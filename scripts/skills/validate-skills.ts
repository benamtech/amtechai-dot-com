import { createHash } from 'node:crypto';
import { readFile, readdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { skillDefinitions, skillPath, skillUrl, SKILL_AUTHORITY_URL, SKILL_SITE_ORIGIN, type SkillDefinition } from '../../src/lib/skills/registry.ts';
import { canonicalJson, digest, verifyCanonical, verifyCertificate, type ArtifactCertificate, type SigningKeyDocument } from '../signing/amtech-signing.ts';
import { REASON_CODES, type ReasonCode } from '../../src/lib/skills/verification/reasonCodes.ts';
import { computeConformanceEvidence, serializeEvidence } from './run-conformance.ts';
import { checkAttestationGates } from './attestation-gates.ts';
import { verifySkill } from '../../src/lib/skills/verification/verifySkill.ts';
import { maxTierForMethod, tierRank } from '../../src/lib/skills/verification/methodRegistry.ts';
import { localPublicLoader } from './verifier-loaders.ts';
import { getSkillContent } from '../../src/lib/skills/generated/skill-content.ts';
import { getPageMeta } from '../../src/lib/seo/pageMeta.ts';
import { renderHeadTags } from '../../src/lib/seo/renderHead.ts';
import { renderSkillContentHtml } from '../../src/lib/skills/renderSkillContent.ts';
import {
  renderHubContentHtml,
  HUB_INSTRUCTION_SENTINEL,
  HUB_DECISION_TREE_SENTINEL,
  SKILL_CATALOG_URL,
} from '../../src/lib/skills/renderHubContent.ts';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const errors: string[] = [];

type ManifestFile = {
  path: string;
  sha256: string;
  sha3_512?: string;
};

type SkillManifest = {
  $schema?: string;
  source?: {
    repository?: string;
    repositoryCommit?: string;
    repositoryPath?: string;
    repositoryTree?: string;
    repositoryRegistry?: string;
  };
  files?: ManifestFile[];
  archive?: {
    file?: string;
    sha256?: string;
    sha3_512?: string;
  };
  certificate?: { id?: string; signed?: boolean };
  authority?: {
    authorityUrl?: string;
    verify?: string;
  };
};

/** Map a canonical https://amtechai.com/... URL to its committed public/ path. */
function publicPathForUrl(url: string): string | null {
  if (!url.startsWith(`${SKILL_SITE_ORIGIN}/`)) return null;
  return `public/${url.slice(SKILL_SITE_ORIGIN.length + 1)}`;
}

/** A served $schema target must exist, parse as JSON, and look like a JSON Schema (carry $id + $schema). */
async function validateServedSchema(label: string, url: string | undefined) {
  if (!url) {
    fail(`${label}: missing $schema URL.`);
    return;
  }
  const path = publicPathForUrl(url);
  if (!path) {
    fail(`${label}: $schema URL is not on the canonical origin: ${url}`);
    return;
  }
  const raw = await read(path);
  if (typeof raw !== 'string') {
    fail(`${label}: $schema target not published at ${path}. Run npm run skills:build.`);
    return;
  }
  try {
    const doc = JSON.parse(raw) as { $id?: string; $schema?: string };
    if (doc.$id !== url) fail(`${label}: ${path} $id (${doc.$id}) does not match its URL (${url}).`);
    if (!doc.$schema) fail(`${label}: ${path} does not declare a $schema dialect.`);
  } catch {
    fail(`${label}: ${path} is not valid JSON.`);
  }
}

async function read(relPath: string, binary = false): Promise<Buffer | string | null> {
  try {
    const content = await readFile(resolve(repoRoot, relPath));
    return binary ? content : content.toString('utf8');
  } catch {
    return null;
  }
}

function sha256(content: Buffer | string): string {
  return createHash('sha256').update(content).digest('hex');
}

function fail(message: string) {
  errors.push(message);
}

/**
 * Record a failure tagged with a canonical reason code. G-X.1: the code MUST be a member of
 * REASON_CODES (the import + ReasonCode type make this a compile-time guarantee; the runtime guard
 * catches a stringly-typed mistake too).
 */
function failCode(slug: string, code: ReasonCode, message: string) {
  if (!(Object.values(REASON_CODES) as string[]).includes(code)) {
    errors.push(`${slug}: internal error — unknown reason code '${code}'.`);
    return;
  }
  errors.push(`${slug}: [${code}] ${message}`);
}

/** Read every file under a skill source dir as { path, content }, sorted — mirrors the signer exactly. */
async function readSourceFiles(absDir: string, rel = ''): Promise<{ path: string; content: Buffer }[]> {
  const entries = await readdir(absDir, { withFileTypes: true });
  const out: { path: string; content: Buffer }[] = [];
  for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
    const childRel = rel ? `${rel}/${entry.name}` : entry.name;
    if (entry.isDirectory()) out.push(...(await readSourceFiles(resolve(absDir, entry.name), childRel)));
    else if (entry.isFile()) out.push({ path: childRel, content: await readFile(resolve(absDir, entry.name)) });
  }
  return out;
}

function hasSkillFrontmatter(content: string): boolean {
  return /^---\n[\s\S]*?^name:\s*.+\n[\s\S]*?^description:\s*.+\n[\s\S]*?^---/m.test(content);
}

async function validateSkill(slug: string) {
  const skill = skillDefinitions.find((item) => item.slug === slug);
  if (!skill) return;
  const base = `public${skillPath(skill)}`;
  const required = ['use.md', 'agent.md', 'SKILL.md', 'manifest.json', 'files.md', 'references.md', 'scripts.md', 'assets.md', 'checksums.txt', 'checksums.json', 'certificate.json', 'certificate.sig'];

  for (const file of required) {
    if (!(await read(`${base}/${file}`))) fail(`${skill.slug}: missing generated ${file}. Run npm run skills:build.`);
  }

  const skillMd = await read(`${base}/SKILL.md`);
  if (typeof skillMd !== 'string' || !hasSkillFrontmatter(skillMd)) fail(`${skill.slug}: generated SKILL.md has invalid frontmatter.`);

  const useMd = await read(`${base}/use.md`);
  if (typeof useMd === 'string') {
    for (const needle of ['AI agent instruction', 'use this skill in the current conversation first', 'manifest.json', 'SKILL.md']) {
      if (!useMd.includes(needle)) fail(`${skill.slug}: use.md missing bootstrap phrase: ${needle}`);
    }
  }

  const manifestRaw = await read(`${base}/manifest.json`);
  let manifest: SkillManifest | null = null;
  if (typeof manifestRaw === 'string') {
    try {
      manifest = JSON.parse(manifestRaw);
    } catch {
      fail(`${skill.slug}: manifest.json is not valid JSON.`);
    }
  }

  if (manifest) {
    // Decision: $schema must be a served, dereferenceable JSON Schema; authority pointer must use
    // the disambiguated `authorityUrl` field (never the old overloaded `registryUrl`).
    await validateServedSchema(`${skill.slug}: manifest`, manifest.$schema);
    if (!manifest.authority?.authorityUrl) fail(`${skill.slug}: manifest.authority.authorityUrl missing.`);
    if ((manifest.authority as Record<string, unknown> | undefined)?.registryUrl) {
      fail(`${skill.slug}: manifest.authority still uses the retired field name "registryUrl"; use "authorityUrl".`);
    }
    if (manifest.source?.repository !== skill.repository.url) fail(`${skill.slug}: manifest source repository mismatch.`);
    if (manifest.source?.repositoryCommit !== skill.repository.commit) fail(`${skill.slug}: manifest source commit mismatch.`);
    if (manifest.source?.repositoryPath !== skill.repository.path) fail(`${skill.slug}: manifest source path mismatch.`);
    if (!manifest.source?.repositoryTree?.includes(skill.repository.commit)) fail(`${skill.slug}: manifest repository tree is not commit-pinned.`);
    if (!manifest.source?.repositoryRegistry?.includes(skill.repository.commit)) fail(`${skill.slug}: manifest repository registry is not commit-pinned.`);

    for (const def of skill.files) {
      const entry = manifest.files?.find((file) => file.path === def.path);
      if (!entry) {
        fail(`${skill.slug}: manifest missing file ${def.path}.`);
        continue;
      }
      const raw = await read(`${base}/files/${def.path}`, true);
      if (!raw || !(raw instanceof Buffer)) {
        fail(`${skill.slug}: missing raw file ${def.path}.`);
        continue;
      }
      if (sha256(raw) !== entry.sha256) fail(`${skill.slug}: hash mismatch for ${def.path}.`);
      if (digest('sha3-512', raw) !== entry.sha3_512) fail(`${skill.slug}: SHA3-512 mismatch for ${def.path}.`);
    }

    const archivePath = manifest.archive?.file;
    if (!archivePath) fail(`${skill.slug}: manifest missing archive file.`);
    else {
      const archive = await read(`${base}/${archivePath}`, true);
      if (!archive || !(archive instanceof Buffer)) fail(`${skill.slug}: missing archive ${archivePath}.`);
      else if (sha256(archive) !== manifest.archive.sha256) fail(`${skill.slug}: archive hash mismatch.`);
      else if (digest('sha3-512', archive) !== manifest.archive.sha3_512) fail(`${skill.slug}: archive SHA3-512 mismatch.`);
    }
    const [certificateRaw, signatureRaw, keyRaw] = await Promise.all([
      read(`${base}/certificate.json`),
      read(`${base}/certificate.sig`),
      read('public/.well-known/amtech-signing-key.json'),
    ]);
    if (typeof certificateRaw === 'string' && typeof signatureRaw === 'string' && typeof keyRaw === 'string') {
      const certificate = JSON.parse(certificateRaw) as ArtifactCertificate;
      const key = JSON.parse(keyRaw) as SigningKeyDocument;
      if (!verifyCertificate(certificate, signatureRaw, key)) fail(`${skill.slug}: Ed25519 certificate signature is invalid.`);
      if (manifest.certificate?.signed !== true || manifest.certificate.id !== certificate.certificateId) fail(`${skill.slug}: manifest certificate metadata mismatch.`);
      if (certificate.digests.sha256 !== manifest.archive?.sha256 || certificate.digests.sha3_512 !== manifest.archive?.sha3_512) fail(`${skill.slug}: certificate archive digests mismatch.`);
    }
  }
}

/**
 * G-M1 — attestation gates (docs/skills/standard/02 §"Signer-enforced gates", 07). The verifier
 * NEVER trusts that the signer ran correctly: it independently re-asserts every gate over the
 * PUBLISHED artifacts (the bytes a consumer actually fetches). Each failure carries its canonical
 * reason code so surfaces, the registry, and the M2 verifier agree on what went wrong.
 */
async function validateAttestations(slug: string) {
  const skill = skillDefinitions.find((item) => item.slug === slug) as SkillDefinition | undefined;
  if (!skill) return;
  const base = `public${skillPath(skill)}`;

  const certificateRaw = await read(`${base}/certificate.json`);
  if (typeof certificateRaw !== 'string') return; // validateSkill already reported the missing cert.
  let certificate: ArtifactCertificate;
  try {
    certificate = JSON.parse(certificateRaw) as ArtifactCertificate;
  } catch {
    failCode(slug, REASON_CODES.INVALID_SCHEMA, 'certificate.json is not valid JSON.');
    return;
  }

  const sourceFiles = await readSourceFiles(resolve(repoRoot, skill.sourceDir));
  const publishedConformanceBytes = (await read(`${base}/evidence/conformance.json`, true)) as Buffer | null;
  const publishedReviewBytes = (await read(`${base}/evidence/review.json`, true)) as Buffer | null;

  // G-M1.4 — recompute the evidence so the gates can assert byte-equality (defeats hand-edited evidence).
  let freshConformanceSerialized: string | undefined;
  try {
    freshConformanceSerialized = serializeEvidence(await computeConformanceEvidence(slug));
  } catch (error) {
    failCode(slug, REASON_CODES.CONFORMANCE_FAILED, `conformance recompute crashed: ${error instanceof Error ? error.message : String(error)}.`);
  }

  const findings = checkAttestationGates({
    certificate,
    repositoryCommit: skill.repository.commit,
    sourceFiles,
    publishedConformanceBytes,
    publishedReviewBytes,
    freshConformanceSerialized,
  });
  for (const finding of findings) failCode(slug, finding.code, finding.message);
}

/**
 * G-M2.3 — run the LINK-FIRST VERIFIER (docs/skills/standard/04 + 09 graph-replay recipe) over every
 * published skill, exactly as a third party would: the same pure verifier, reading only the published
 * surfaces under public/. The build fails unless every skill verdict is 'verified'. This is the gate
 * that proves the self-describing recipe actually re-derives the verdict — not just that the signer ran.
 */
async function validateVerifier(slug: string) {
  const loader = localPublicLoader(resolve(repoRoot, 'public'), slug);
  const verdict = await verifySkill(loader);
  if (verdict.verdict !== 'verified') {
    for (const code of verdict.reasonCodes) failCode(slug, code, `link-first verifier verdict '${verdict.verdict}' (depth ${verdict.depth}).`);
  } else if (!verdict.trustTier) {
    failCode(slug, REASON_CODES.TIER_NOT_SUPPORTED, 'verifier returned verified but no trust tier.');
  }
}

/**
 * G-M3.1–3.3 + G-X.3/X.4 — multi-surface consistency (docs/skills/standard/05+07). One build-time verifier
 * run is the source of truth; the catalog, manifest, generated content, head meta, and body badge must ALL
 * project the same verdict/tier/sequence — and no surface may claim a tier the method can't prove. This is
 * the gate that keeps meta tags honest: the head can never say more than the recomputed verdict.
 */
async function validateSurfaces(slug: string) {
  const skill = skillDefinitions.find((s) => s.slug === slug) as SkillDefinition | undefined;
  if (!skill) return;
  const verdict = await verifySkill(localPublicLoader(resolve(repoRoot, 'public'), slug));

  // G-X.3 / G-M3.2 — the proven tier must not exceed the method's ceiling.
  if (verdict.trustTier && verdict.method) {
    const ceiling = maxTierForMethod(verdict.method);
    if (!ceiling || tierRank(verdict.trustTier) > tierRank(ceiling)) {
      failCode(slug, REASON_CODES.TIER_NOT_SUPPORTED, `verdict tier ${verdict.trustTier} exceeds method ${verdict.method} ceiling (G-M3.2).`);
    }
  }

  const sameVerdict = (s: { verdict?: string; trustTier?: string | null; authoritySequence?: string | null; checkedAt?: string } | undefined, name: string) => {
    if (!s) return fail(`${slug}: ${name} missing verification block (G-M3.1).`);
    if (s.verdict !== verdict.verdict || s.trustTier !== verdict.trustTier || s.authoritySequence !== verdict.authoritySequence) {
      fail(`${slug}: ${name} verdict disagrees with the recomputed verifier verdict (G-X.4).`);
    }
    if (!s.checkedAt) fail(`${slug}: ${name} missing checkedAt build-time marker (G-M3.3).`);
  };

  const catalogRaw = await read('public/skills/catalog.json');
  if (typeof catalogRaw === 'string') {
    const entry = (JSON.parse(catalogRaw).skills as { slug: string; verification?: Record<string, never> }[]).find((e) => e.slug === slug);
    sameVerdict(entry?.verification, 'catalog.json');
  }
  const manifestRaw = await read(`public${skillPath(skill)}/manifest.json`);
  if (typeof manifestRaw === 'string') sameVerdict(JSON.parse(manifestRaw).verification, 'manifest.json');
  sameVerdict(getSkillContent(slug)?.verification, 'generated skill-content');

  // Head meta + body badge (G-X.4) — the head TRANSPORTS the verdict (descriptive), the body SHOWS it.
  const meta = getPageMeta(`/skills/${slug}`);
  const head = meta ? renderHeadTags(meta) : '';
  if (!head.includes(`name="amtech:skill:verdict" content="${verdict.verdict}"`)) fail(`${slug}: head meta missing/!= amtech:skill:verdict (G-X.4).`);
  if (verdict.trustTier && !head.includes(`name="amtech:skill:trust-tier" content="${verdict.trustTier}"`)) fail(`${slug}: head meta trust-tier disagrees (G-X.4).`);
  if (!renderSkillContentHtml(slug).includes(verdict.verdict)) fail(`${slug}: body badge missing the verdict (G-X.4).`);
}

/**
 * G-M4.1/4.2 — authority record (M4 groundwork, docs/skills/standard/03+07). The published genesis record
 * must parse + verify under the active key, the domain authority's `latestRecordHash` must equal the
 * record's canonical digest, and the record's `catalogRoot` must equal the published catalog root.
 */
async function validateAuthorityRecord() {
  const [recordRaw, sigRaw, authRaw, keyRaw, catalogRaw] = await Promise.all([
    read('public/.well-known/authority/records/0000.json'),
    read('public/.well-known/authority/records/0000.sig'),
    read('public/.well-known/skill-authority.json'),
    read('public/.well-known/amtech-signing-key.json'),
    read('public/skills/catalog.json'),
  ]);
  if (typeof recordRaw !== 'string' || typeof sigRaw !== 'string') {
    failCode('authority', REASON_CODES.AUTHORITY_MISMATCH, 'genesis authority record/signature missing. Run npm run skills:sign.');
    return;
  }
  try {
    const record = JSON.parse(recordRaw) as { sequence?: string; catalogRoot?: string };
    const recordHash = digest('sha256', canonicalJson(record));
    if (typeof keyRaw === 'string' && !verifyCanonical(record, sigRaw, JSON.parse(keyRaw) as SigningKeyDocument)) {
      failCode('authority', REASON_CODES.AUTHORITY_MISMATCH, 'genesis record signature does not verify (G-M4.1).');
    }
    if (typeof authRaw === 'string') {
      const auth = JSON.parse(authRaw) as { latestRecordHash?: string; latestSequence?: string };
      if (auth.latestRecordHash !== recordHash) failCode('authority', REASON_CODES.AUTHORITY_MISMATCH, `skill-authority.latestRecordHash != record digest (G-M4.2).`);
      if (auth.latestSequence !== record.sequence) failCode('authority', REASON_CODES.AUTHORITY_MISMATCH, 'skill-authority.latestSequence != record sequence.');
    }
    if (typeof catalogRaw === 'string') {
      const catalog = JSON.parse(catalogRaw) as { catalogRoot?: string };
      if (catalog.catalogRoot !== record.catalogRoot) failCode('authority', REASON_CODES.CATALOG_ROOT_MISMATCH, 'authority record catalogRoot != catalog.json catalogRoot.');
    }
  } catch {
    failCode('authority', REASON_CODES.INVALID_SCHEMA, 'genesis authority record is not valid JSON.');
  }
}

/**
 * G-M0 — catalog/hub bootstrap gates (docs/skills/standard/07). The hub (/skills) must be
 * self-bootstrapping: a machine catalog that matches the registry, hub agent-bootstrap files that
 * point at the catalog + authority, and prerendered HTML carrying the instruction block + decision
 * tree (asserted against the shared renderer that feeds the prerenderer).
 */
async function validateCatalogBootstrap() {
  // G-M0.1 — catalog.json exists, schema-valid, lists exactly the registry's skills.
  const catalogRaw = await read('public/skills/catalog.json');
  if (typeof catalogRaw !== 'string') {
    fail('public/skills/catalog.json missing. Run npm run skills:build.');
  } else {
    try {
      const catalog = JSON.parse(catalogRaw) as {
        schemaVersion?: string;
        authorityUrl?: string;
        skills?: { slug?: string; version?: string; status?: string; canonicalUrl?: string; useUrl?: string; manifestUrl?: string; certificateUrl?: string; signatureUrl?: string }[];
      };
      if (catalog.schemaVersion !== 'amtech-skill-catalog/v1') fail('catalog.json: schemaVersion must be amtech-skill-catalog/v1.');
      if (catalog.authorityUrl !== SKILL_AUTHORITY_URL) fail('catalog.json: authorityUrl mismatch.');
      const entries = catalog.skills ?? [];
      if (entries.length !== skillDefinitions.length) fail(`catalog.json: lists ${entries.length} skill(s); registry has ${skillDefinitions.length}.`);
      for (const skill of skillDefinitions) {
        const entry = entries.find((e) => e.slug === skill.slug);
        if (!entry) {
          fail(`catalog.json: missing entry for ${skill.slug}.`);
          continue;
        }
        if (entry.version !== skill.version) fail(`catalog.json: ${skill.slug} version mismatch (${entry.version} != ${skill.version}).`);
        if (entry.status !== 'published') fail(`catalog.json: ${skill.slug} status must be published.`);
        if (entry.canonicalUrl !== skillUrl(skill)) fail(`catalog.json: ${skill.slug} canonicalUrl mismatch.`);
        for (const [field, value] of [
          ['useUrl', entry.useUrl],
          ['manifestUrl', entry.manifestUrl],
          ['certificateUrl', entry.certificateUrl],
          ['signatureUrl', entry.signatureUrl],
        ] as const) {
          if (!value) fail(`catalog.json: ${skill.slug} missing ${field}.`);
        }
      }
    } catch (error) {
      if (error instanceof SyntaxError) fail('public/skills/catalog.json is not valid JSON.');
      else throw error;
    }
  }

  // G-M0.2 — hub use.md + agent.md exist and link the catalog + authority.
  for (const file of ['use.md', 'agent.md'] as const) {
    const content = await read(`public/skills/${file}`);
    if (typeof content !== 'string') {
      fail(`public/skills/${file} missing. Run npm run skills:build.`);
      continue;
    }
    if (!content.includes(SKILL_CATALOG_URL)) fail(`public/skills/${file}: missing catalog.json URL.`);
    if (!content.includes(SKILL_AUTHORITY_URL)) fail(`public/skills/${file}: missing authority URL.`);
  }

  // G-M0.3 — prerendered hub HTML (the shared renderer feeding scripts/okf/prerender.ts) carries the
  // agent-instruction block and the decision tree, and enumerates every skill page.
  const hubHtml = renderHubContentHtml();
  if (!hubHtml.includes(HUB_INSTRUCTION_SENTINEL)) fail(`hub HTML missing the agent-instruction block ("${HUB_INSTRUCTION_SENTINEL}").`);
  if (!hubHtml.includes(HUB_DECISION_TREE_SENTINEL)) fail(`hub HTML missing the decision tree ("${HUB_DECISION_TREE_SENTINEL}").`);
  for (const skill of skillDefinitions) {
    if (!hubHtml.includes(`href="${skillPath(skill)}"`)) fail(`hub HTML missing a link to ${skillPath(skill)}.`);
  }
}

async function main() {
  for (const skill of skillDefinitions) await validateSkill(skill.slug);
  for (const skill of skillDefinitions) await validateAttestations(skill.slug);
  for (const skill of skillDefinitions) await validateVerifier(skill.slug);
  for (const skill of skillDefinitions) await validateSurfaces(skill.slug);
  await validateAuthorityRecord();
  await validateCatalogBootstrap();

  const rootLlms = await read('public/llms.txt');
  const sitemap = await read('public/sitemap.xml');
  const skillsLlms = await read('public/skills/llms.txt');
  const catalog = await read('public/skills/catalog.md');

  for (const skill of skillDefinitions) {
    for (const [label, content] of [
      ['public/skills/llms.txt', skillsLlms],
      ['public/skills/catalog.md', catalog],
    ] as const) {
      if (typeof content !== 'string' || !content.includes(skillUrl(skill, '/use.md'))) fail(`${label} missing ${skill.slug} use.md URL.`);
    }
    if (typeof rootLlms !== 'string' || !rootLlms.includes(skillUrl(skill))) fail(`public/llms.txt missing ${skill.slug}. Run npm run okf:build after skills changes.`);
    if (typeof sitemap !== 'string' || !sitemap.includes(skillUrl(skill))) fail(`public/sitemap.xml missing ${skill.slug}. Run npm run okf:build after skills changes.`);
  }

  // skill-authority.json must exist and list every skill
  const authorityRaw = await read('public/.well-known/skill-authority.json');
  if (typeof authorityRaw !== 'string') {
    fail('public/.well-known/skill-authority.json missing. Run npm run skills:build.');
  } else {
    try {
      const authority = JSON.parse(authorityRaw) as {
        $schema?: string;
        authorityUrl?: string;
        repository?: { url?: string; commit?: string; commitSignature?: string; registryUrl?: string };
        verification?: { method?: string; digestAlgorithms?: string[]; signed?: boolean; signingKeyUrl?: string };
        skills?: { slug: string; authorityUrl?: string; repositoryCommit?: string; repositoryPath?: string; repositoryTreeUrl?: string }[];
      } & Record<string, unknown>;
      await validateServedSchema('skill-authority.json', authority.$schema);
      if (!authority.authorityUrl) fail('skill-authority.json: top-level authorityUrl missing.');
      if (!authority.repository?.url) fail('skill-authority.json: repository.url missing.');
      if (!authority.repository?.commit || !authority.repository.registryUrl?.includes(authority.repository.commit)) {
        fail('skill-authority.json: top-level repository registry is not commit-pinned.');
      }
      if (authority.verification?.method !== 'ed25519-canonical-json-v1') fail('skill-authority.json: verification method mismatch.');
      if (authority.verification?.digestAlgorithms?.join(',') !== 'SHA-256,SHA3-512') fail('skill-authority.json: digest algorithms mismatch.');
      if (authority.verification?.signed !== true) fail('skill-authority.json: signed must be true.');
      if (!authority.verification?.signingKeyUrl) fail('skill-authority.json: signingKeyUrl missing.');
      if (authority.registryUrl) fail('skill-authority.json still uses the retired field name "registryUrl"; use "authorityUrl".');
      for (const skill of skillDefinitions) {
        const entry = authority.skills?.find((s) => s.slug === skill.slug);
        if (!entry) {
          fail(`public/.well-known/skill-authority.json missing entry for ${skill.slug}.`);
        } else if (!entry.authorityUrl) {
          fail(`skill-authority.json entry ${skill.slug} missing authorityUrl.`);
        } else if (entry.repositoryCommit !== skill.repository.commit || entry.repositoryPath !== skill.repository.path) {
          fail(`skill-authority.json entry ${skill.slug} repository provenance mismatch.`);
        } else if (!entry.repositoryTreeUrl?.includes(skill.repository.commit)) {
          fail(`skill-authority.json entry ${skill.slug} repository tree is not commit-pinned.`);
        }
      }
    } catch (error) {
      if (error instanceof SyntaxError) fail('public/.well-known/skill-authority.json is not valid JSON.');
      else throw error;
    }
  }

  if (errors.length) {
    console.error(`skills:validate found ${errors.length} error(s):`);
    errors.forEach((error) => console.error(`- ${error}`));
    process.exit(1);
  }

  console.log(`skills:validate passed for ${skillDefinitions.length} skill package(s).`);
}

main().catch((error) => {
  console.error('skills:validate crashed:', error);
  process.exit(1);
});
