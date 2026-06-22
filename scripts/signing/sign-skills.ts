/**
 * AMTECH skill release signer (M1). Emits an `amtech-signed-artifact/v2` certificate per skill,
 * binding provenance (repo commit/path), the zip-archive digests, the cross-repo `sourcePackage`
 * digest, AND the assurance attestations (offline conformance + AMTECH publisher review).
 *
 * The signer is the enforcement point: it independently re-validates every gate before it will emit
 * a certificate (docs/skills/standard/02 §"Signer-enforced gates"). It does NOT trust that
 * `skills:conformance` ran — it re-reads the committed evidence and checks digests, commit, freshness,
 * result, declared-scripts-vs-archive, and review approval. Any failure is a hard error (no cert).
 */
import { readFile, readdir, mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import {
  certificateId,
  derivePublicKey,
  digest,
  loadPrivateKey,
  packagePayloadDigest,
  signCertificate,
  signingKeyDocument,
  type ArtifactCertificate,
  type SigningKeyDocument,
  type SkillAttestations,
  type TrustTier,
} from './amtech-signing.ts';
import { skillDefinitions, skillUrl, type SkillDefinition } from '../../src/lib/skills/registry.ts';
import { MAX_EVIDENCE_AGE_DAYS, REASON_CODES, type ReasonCode } from '../../src/lib/skills/verification/reasonCodes.ts';

const POLICY_VERSION = 'amtech-skill-policy/1';

const privatePath = resolve(process.env.AMTECH_SIGNING_PRIVATE_KEY_FILE ?? '.amtech/signing-private-key.pem');
const keyPath = resolve('src/lib/skills/certificates/amtech-signing-key.json');
const privateKey = loadPrivateKey(await readFile(privatePath, 'utf8'));
const existingKey = JSON.parse(await readFile(keyPath, 'utf8')) as SigningKeyDocument;
const derivedKey = signingKeyDocument(derivePublicKey(privateKey), existingKey.validFrom);
if (derivedKey.keyId !== existingKey.keyId || derivedKey.fingerprint.sha256 !== existingKey.fingerprint.sha256) {
  throw new Error('Private signing key does not match committed AMTECH public key metadata.');
}

function fail(slug: string, code: ReasonCode, message: string): never {
  throw new Error(`sign-skills: ${slug} refused [${code}]: ${message}`);
}

/** Read every file under a skill source dir as { path, content }, sorted — the archive's exact bytes. */
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

type ConformanceFile = { suite: string; suiteVersion: string; method: 'static-contract' | 'live-model'; result: 'pass' | 'fail'; ranAt: string };
type ReviewFile = { reviewer?: { type?: string; id?: string; name?: string }; result?: string; reviewedAt?: string; policyVersion?: string };
type ConformanceConfig = { permissions: { filesystem: SkillAttestations['permissions']['filesystem']; network: SkillAttestations['permissions']['network']; secrets: SkillAttestations['permissions']['secrets'] } };

async function readJson<T>(slug: string, path: string, missingCode: ReasonCode): Promise<T> {
  try {
    return JSON.parse(await readFile(path, 'utf8')) as T;
  } catch {
    fail(slug, missingCode, `required evidence/config missing or invalid JSON: ${path}`);
  }
}

function ageInDays(iso: string): number {
  return (Date.now() - new Date(iso).getTime()) / 86_400_000;
}

async function buildAttestations(skill: SkillDefinition, sourceFiles: { path: string; content: Buffer }[]): Promise<SkillAttestations> {
  const certDir = resolve(`src/lib/skills/certificates/${skill.slug}`);
  const conformancePath = resolve(certDir, 'evidence/conformance.json');
  const reviewPath = resolve(certDir, 'evidence/review.json');
  const config = await readJson<ConformanceConfig>(skill.slug, resolve(certDir, 'conformance.config.json'), REASON_CODES.EVIDENCE_MISSING);

  // --- conformance gates --- (the sourcePackage digest is the cross-repo source anchor; no commit binding)
  const conformanceBytes = await readFile(conformancePath).catch(() => fail(skill.slug, REASON_CODES.EVIDENCE_MISSING, 'conformance.json missing'));
  const conformance = JSON.parse(conformanceBytes.toString('utf8')) as ConformanceFile;
  if (conformance.result !== 'pass') fail(skill.slug, REASON_CODES.CONFORMANCE_FAILED, 'conformance result is not pass');
  if (!Number.isFinite(ageInDays(conformance.ranAt)) || ageInDays(conformance.ranAt) > MAX_EVIDENCE_AGE_DAYS) {
    fail(skill.slug, REASON_CODES.STALE_EVIDENCE, `conformance ranAt ${conformance.ranAt} is older than ${MAX_EVIDENCE_AGE_DAYS}d`);
  }

  // --- declared scripts == executable files actually shipped (no undeclared executables) ---
  const declaredScripts = skill.files.filter((file) => file.role === 'script').map((file) => file.path).sort();
  const looksExecutable = (path: string) => path.startsWith('scripts/') || /\.(sh|bash|mjs|cjs|js|ts|py|rb)$/.test(path);
  const shippedScripts = sourceFiles.map((file) => file.path).filter(looksExecutable).sort();
  if (JSON.stringify(declaredScripts) !== JSON.stringify(shippedScripts)) {
    fail(skill.slug, REASON_CODES.UNDECLARED_SCRIPT, `declared scripts [${declaredScripts.join(', ')}] != shipped executables [${shippedScripts.join(', ')}]`);
  }

  // --- review gates (top tier requires AMTECH approval) ---
  const reviewBytes = await readFile(reviewPath).catch(() => fail(skill.slug, REASON_CODES.EVIDENCE_MISSING, 'review.json missing'));
  const review = JSON.parse(reviewBytes.toString('utf8')) as ReviewFile;
  let trustTier: TrustTier = 'structure-verified';
  if (review.result === 'approved' && review.reviewer?.id && review.policyVersion === POLICY_VERSION) {
    trustTier = 'amtech-reviewed';
  } else if (review.result && review.result !== 'approved') {
    fail(skill.slug, REASON_CODES.REVIEW_NOT_APPROVED, `review.result is '${review.result}'`);
  }

  const base = `${skillUrl(skill)}/evidence`;
  const attestations: SkillAttestations = {
    policyVersion: POLICY_VERSION,
    trustTier,
    permissions: { ...config.permissions, scripts: declaredScripts },
    conformance: {
      suite: conformance.suite,
      suiteVersion: conformance.suiteVersion,
      method: conformance.method,
      result: conformance.result,
      ranAt: conformance.ranAt,
      evidence: { url: `${base}/conformance.json`, sha256: digest('sha256', conformanceBytes) },
    },
  };
  if (trustTier === 'amtech-reviewed') {
    attestations.review = {
      reviewer: { type: 'human', id: review.reviewer!.id!, name: review.reviewer!.name ?? review.reviewer!.id! },
      result: 'approved',
      reviewedAt: review.reviewedAt ?? `${skill.updated}T00:00:00.000Z`,
      policyVersion: POLICY_VERSION,
      evidence: { url: `${base}/review.json`, sha256: digest('sha256', reviewBytes) },
    };
  }
  return attestations;
}

for (const skill of skillDefinitions as SkillDefinition[]) {
  const archiveName = `${skill.slug}-${skill.version}.zip`;
  const archive = await readFile(resolve(`public/skills/${skill.slug}/${archiveName}`));
  const sourceFiles = await readSourceFiles(resolve(skill.sourceDir));
  const sourcePackage = packagePayloadDigest(sourceFiles);
  const sha256 = digest('sha256', archive);
  const sha3_512 = digest('sha3-512', archive);
  const attestations = await buildAttestations(skill, sourceFiles);

  // Bind the generated agent-entry surfaces (the first two files an agent fetches). The unsigned build has
  // already written them to public/; read+hash them so changing or omitting them breaks the signature.
  const bootstrapDigests = async (name: 'use.md' | 'agent.md') => {
    const bytes = await readFile(resolve(`public/skills/${skill.slug}/${name}`)).catch(() =>
      fail(skill.slug, REASON_CODES.EVIDENCE_MISSING, `${name} missing — run the unsigned build before signing`),
    );
    return { sha256: digest('sha256', bytes), sha3_512: digest('sha3-512', bytes) };
  };
  const bootstrap = { use: await bootstrapDigests('use.md'), agent: await bootstrapDigests('agent.md') };

  const certificate: ArtifactCertificate = {
    schemaVersion: 'amtech-signed-artifact/v2',
    certificateId: certificateId('skill', skill.slug, sha3_512),
    subjectType: 'skill',
    subjectId: skill.slug,
    owner: { name: 'AMTECH AI', url: 'https://amtechai.com' },
    canonicalUrl: skillUrl(skill),
    repository: { url: skill.repository.url, path: skill.repository.path },
    version: skill.version,
    digests: { sha256, sha3_512 },
    sourcePackage,
    bootstrap,
    issuedAt: `${skill.updated}T00:00:00.000Z`,
    issuer: existingKey.issuer,
    signingKeyId: existingKey.keyId,
    signingKeyUrl: 'https://amtechai.com/.well-known/amtech-signing-key.json',
    attestations,
  };
  const base = resolve(`src/lib/skills/certificates/${skill.slug}`);
  await mkdir(base, { recursive: true });
  await writeFile(resolve(base, 'certificate.json'), `${JSON.stringify(certificate, null, 2)}\n`, 'utf8');
  await writeFile(resolve(base, 'certificate.sig'), `${signCertificate(certificate, privateKey)}\n`, 'utf8');
  console.log(`Signed ${skill.slug}: ${certificate.certificateId} (tier ${attestations.trustTier})`);
}

console.log('Run npm run skills:build to publish the signed certificates.');
