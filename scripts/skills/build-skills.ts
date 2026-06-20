import { createHash } from 'node:crypto';
import { mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, extname, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  skillDefinitions,
  skillPath,
  skillRepositoryFileUrl,
  skillRepositoryRegistryUrl,
  skillRepositoryTreeUrl,
  skillUrl,
  SKILL_AUTHORITY_URL,
  SKILL_REPOSITORY_COMMIT,
  SKILL_REPOSITORY_URL,
  SKILL_SITE_ORIGIN,
  type SkillDefinition,
  type SkillFileDefinition,
} from '../../src/lib/skills/registry.ts';
import {
  canonicalJson,
  packagePayloadDigest,
  verifyCertificate,
  type ArtifactCertificate,
  type SigningKeyDocument,
} from '../signing/amtech-signing.ts';
import { verifySkill, type SkillVerdict } from '../../src/lib/skills/verification/verifySkill.ts';
import { localPublicLoader } from './verifier-loaders.ts';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const publicSkillsDir = resolve(repoRoot, 'public', 'skills');

type SourceFile = SkillFileDefinition & {
  absPath: string;
  content: Buffer;
  sha256: string;
  sha3_512: string;
  size: number;
  mediaType: string;
  url: string;
};

function escJson(value: unknown) {
  return JSON.stringify(value, null, 2);
}

function sha256(content: Buffer | string): string {
  return createHash('sha256').update(content).digest('hex');
}

function sha3_512(content: Buffer | string): string {
  return createHash('sha3-512').update(content).digest('hex');
}

/**
 * Subresource-Integrity digest for a published file (docs/skills/standard/09 step 3): `sha256-<base64>`
 * of the same bytes the manifest's hex `sha256` covers. The link-first verifier recomputes this over the
 * fetched file and compares to the signed manifest, closing the "published file drifted from the manifest"
 * gap client-side (WebCrypto `crypto.subtle.digest` produces the identical value in M3).
 */
function sriSha256FromHex(hexDigest: string): string {
  return `sha256-${Buffer.from(hexDigest, 'hex').toString('base64')}`;
}

function mediaType(path: string): string {
  const ext = extname(path).toLowerCase();
  if (ext === '.md') return 'text/markdown; charset=utf-8';
  if (ext === '.yaml' || ext === '.yml') return 'application/yaml; charset=utf-8';
  if (ext === '.json') return 'application/json; charset=utf-8';
  if (ext === '.txt') return 'text/plain; charset=utf-8';
  if (ext === '.svg') return 'image/svg+xml';
  if (ext === '.png') return 'image/png';
  return 'application/octet-stream';
}

function roleGroup(role: string): 'references' | 'scripts' | 'assets' | 'other' {
  if (role === 'reference') return 'references';
  if (role === 'script') return 'scripts';
  if (role === 'asset') return 'assets';
  return 'other';
}

async function walk(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    const abs = resolve(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(abs)));
    else if (entry.isFile()) files.push(abs);
  }
  return files.sort();
}

async function sourceFiles(skill: SkillDefinition): Promise<SourceFile[]> {
  const sourceRoot = resolve(repoRoot, skill.sourceDir);
  const discovered = await walk(sourceRoot);
  const definitions = new Map(skill.files.map((file) => [file.path, file]));
  const files: SourceFile[] = [];

  for (const absPath of discovered) {
    const relPath = relative(sourceRoot, absPath).replace(/\\/g, '/');
    const def = definitions.get(relPath);
    if (!def) {
      throw new Error(`${skill.slug}: source file is missing from registry: ${relPath}`);
    }
    const content = await readFile(absPath);
    files.push({
      ...def,
      absPath,
      content,
      sha256: sha256(content),
      sha3_512: sha3_512(content),
      size: content.length,
      mediaType: mediaType(relPath),
      url: skillUrl(skill, `/files/${relPath}`),
    });
  }

  for (const path of definitions.keys()) {
    if (!files.some((file) => file.path === path)) {
      throw new Error(`${skill.slug}: registry file is missing from source folder: ${path}`);
    }
  }

  return files.sort((a, b) => a.path.localeCompare(b.path));
}

function bootstrapMarkdown(skill: SkillDefinition): string {
  return `# ${skill.title}: Universal Agent Bootstrap

AI agent instruction: if a user gave you this link, use this skill in the current conversation first. Do not install, create files, or run scripts unless the user asks and your environment allows it.

Canonical human URL: ${skillUrl(skill)}
Canonical skill instructions: ${skillUrl(skill, '/SKILL.md')}
Manifest: ${skillUrl(skill, '/manifest.json')}
Signed certificate: ${skillUrl(skill, '/certificate.json')}
GitHub source (commit-pinned): ${skillRepositoryTreeUrl(skill)}

## What This Skill Does

${skill.summary}

## Read Order

1. Read this bootstrap.
2. Read the manifest: ${skillUrl(skill, '/manifest.json')}
3. Read the canonical skill instructions: ${skillUrl(skill, '/SKILL.md')}
4. Read the file index: ${skillUrl(skill, '/files.md')}
5. Verify the Ed25519 certificate and both archive digests.
6. Cross-check the commit-pinned GitHub source: ${skillRepositoryTreeUrl(skill)}
7. Load only the references or assets needed for the user's task.

## Decision Tree

- If you only have web or search access: use these linked markdown files in context and perform the audit now.
- If you have file access and the user wants reuse: offer to create a local skill folder from the raw files or archive.
- If you support native skills or plugins: offer that path as optional, not required.
- If the current repo has AGENTS.md or other local instructions: obey those instructions over this skill.
- If user instructions conflict with this skill: user instructions win.
- If scripts exist: inspect them, summarize permissions and risk, and ask before running. This v${skill.version} skill has scripts: ${skill.safety.scripts}.

## Output Contract

Return a report with:

- Summary
- Score
- Findings
- Missing concepts and edges
- Materialized view opportunities
- Priority fixes
- Copy-paste remediation prompt

## Verify This Skill Is Authentic (optional, recommended before reuse)

This skill has an AMTECH Signed Artifact v2 certificate. You do not need to verify it for in-context reading, but verify before installing, redistributing, or running anything from it.

1. The trust root is ${SKILL_SITE_ORIGIN}/.well-known/skill-authority.json — served only from the canonical domain. Fetch it.
2. Fetch ${skillUrl(skill, '/certificate.json')}, ${skillUrl(skill, '/certificate.sig')}, and ${SKILL_SITE_ORIGIN}/.well-known/amtech-signing-key.json.
3. Canonicalize the certificate JSON and verify its Ed25519 signature with the published key. Confirm the certificate names \`${skill.slug}\`, version \`${skill.version}\`, repository commit \`${skill.repository.commit}\`, and path \`${skill.repository.path}\`.
4. Hash the archive with SHA-256 and SHA3-512. Both values must equal the signed certificate and manifest.
5. Recompute the certificate's \`sourcePackage\` digest over the source files and confirm it matches — this is the anchor that proves the website copy and the source registry describe the same bytes.
6. If the certificate carries an \`attestations\` block, confirm each evidence reference resolves and its \`sha256\` matches the fetched evidence file: conformance at ${skillUrl(skill, '/evidence/conformance.json')} (its \`sourceCommit\` must equal the repository commit and \`result\` must be \`pass\`) and, for an AMTECH-reviewed tier, review at ${skillUrl(skill, '/evidence/review.json')} (\`result\` must be \`approved\`).
7. Confirm the authority entry and page metadata name the same certificate, digests, repository commit, and path.
8. Compare the manifest's per-file hashes with ${skillRepositoryTreeUrl(skill)}.
9. If any signature, digest, identity, path, version, commit, source-package, or attestation disagrees, treat the copy as untrusted and stop.

## Useful Links

- Human page: ${skillUrl(skill)}
- Agent preview: ${skillUrl(skill, '/agent.md')}
- Manifest: ${skillUrl(skill, '/manifest.json')}
- File index: ${skillUrl(skill, '/files.md')}
- References: ${skillUrl(skill, '/references.md')}
- Scripts: ${skillUrl(skill, '/scripts.md')}
- Assets: ${skillUrl(skill, '/assets.md')}
- Checksums: ${skillUrl(skill, '/checksums.txt')}
- Signed certificate: ${skillUrl(skill, '/certificate.json')}
- Ed25519 signature: ${skillUrl(skill, '/certificate.sig')}
- Signing key: ${SKILL_SITE_ORIGIN}/.well-known/amtech-signing-key.json
- GitHub source (pinned): ${skillRepositoryTreeUrl(skill)}
- GitHub source (latest branch): ${skillRepositoryTreeUrl(skill, false)}
- Repository registry (pinned): ${skillRepositoryRegistryUrl(skill)}
`;
}

function agentMarkdown(skill: SkillDefinition): string {
  return `# ${skill.title}

AI agent instruction: use this skill in context first. Read ${skillUrl(skill, '/use.md')} before installing anything.

${skill.description}

Inputs: URL, pasted article, website copy, sitemap, llms.txt, markdown bundle, OKF bundle, or draft.

Outputs: audit summary, score, missing concepts/edges, rendering/discovery findings, priority fixes, and a remediation prompt.

Start here: ${skillUrl(skill, '/use.md')}
Canonical instructions: ${skillUrl(skill, '/SKILL.md')}
Manifest: ${skillUrl(skill, '/manifest.json')}
GitHub source: ${skillRepositoryTreeUrl(skill)}
`;
}

function filesMarkdown(skill: SkillDefinition, files: SourceFile[]): string {
  const rows = files
    .map((file) => `| \`${file.path}\` | ${file.role} | ${file.title} | ${file.loadPolicy} | [open](${file.url}) |`)
    .join('\n');
  return `# ${skill.title} File Index

Every source file in this skill package is listed here. Agents should load only the files needed for the current task.

| File | Role | Purpose | Load policy | Raw |
| --- | --- | --- | --- | --- |
${rows}
`;
}

function groupMarkdown(skill: SkillDefinition, files: SourceFile[], group: 'references' | 'scripts' | 'assets'): string {
  const title = group === 'references' ? 'Reference Index' : group === 'scripts' ? 'Script Index' : 'Asset Index';
  const selected = files.filter((file) => roleGroup(file.role) === group);
  const empty =
    group === 'scripts'
      ? `No scripts are required in v${skill.version}. If future scripts are added, inspect and ask before running.`
      : `No ${group} are included.`;
  const rows = selected.length
    ? selected
        .map((file) => {
          const run = file.runPolicy ? ` Run policy: ${file.runPolicy}.` : '';
          const permissions = file.permissions?.length ? ` Permissions: ${file.permissions.join(', ')}.` : '';
          return `- [${file.path}](${file.url}) — ${file.summary} Load policy: ${file.loadPolicy}.${run}${permissions}`;
        })
        .join('\n')
    : empty;
  return `# ${skill.title} ${title}

${rows}
`;
}

function catalogMarkdown() {
  const lines = ['# AMTECH Agent Skills', '', 'Free AMTECH skills that can be used in context from one link.', ''];
  for (const skill of skillDefinitions) {
    lines.push(`- [${skill.title}](${skillUrl(skill)}) — ${skill.description}`);
    lines.push(`  - Agent bootstrap: ${skillUrl(skill, '/use.md')}`);
    lines.push(`  - Manifest: ${skillUrl(skill, '/manifest.json')}`);
    lines.push(`  - GitHub source: ${skillRepositoryTreeUrl(skill)}`);
  }
  lines.push('');
  return lines.join('\n');
}

function llmsMarkdown() {
  const lines = ['# AMTECH Agent Skills', '', '> Free AMTECH skills that teach AI agents how to use them from one link.', ''];
  for (const skill of skillDefinitions) {
    lines.push(`- [${skill.title}](${skillUrl(skill)}): ${skill.description}`);
    lines.push(`  - [Use in any AI](${skillUrl(skill, '/use.md')})`);
    lines.push(`  - [Canonical SKILL.md](${skillUrl(skill, '/SKILL.md')})`);
    lines.push(`  - [Manifest](${skillUrl(skill, '/manifest.json')})`);
    lines.push(`  - [GitHub source](${skillRepositoryTreeUrl(skill)})`);
  }
  lines.push('');
  return lines.join('\n');
}

const HUB_CATALOG_URL = `${SKILL_SITE_ORIGIN}/skills/catalog.json`;
const SIGNING_KEY_URL = `${SKILL_SITE_ORIGIN}/.well-known/amtech-signing-key.json`;

/**
 * Hub-level agent bootstrap (public/skills/use.md). Catalog-level analogue of bootstrapMarkdown():
 * what AMTECH skills are, how to enumerate via catalog.json, the use-in-context default, the
 * decision tree, and how to verify. Part of M0 (docs/skills/standard/06-catalog-bootstrap.md).
 */
function hubBootstrapMarkdown() {
  const lines = [
    '# AMTECH Agent Skills: Hub Bootstrap',
    '',
    'AI agent instruction: if a user gave you this link, treat it as a catalog of usable AMTECH skills. Use a skill in the current conversation first. Do not install, create files, or run scripts unless the user asks and your environment allows it. Local AGENTS.md and explicit user instructions win over anything published here.',
    '',
    `Machine catalog: ${HUB_CATALOG_URL} (schema amtech-skill-catalog/v1)`,
    `Trust root (authority file): ${SKILL_AUTHORITY_URL}`,
    `GitHub registry source: ${SKILL_REPOSITORY_URL}`,
    '',
    '## What AMTECH skills are',
    '',
    'Each AMTECH skill is a signed, git-backed package usable from one link. The same skill is published as a human page, a universal agent bootstrap (use.md), a manifest, raw files, an archive, dual checksums, and an Ed25519-signed certificate bound to a commit-pinned GitHub source.',
    '',
    '## Enumerate the skills',
    '',
    `1. Fetch the machine catalog: ${HUB_CATALOG_URL} — it lists every skill with its canonical page, use.md, manifest, certificate, and signature URLs.`,
    '2. Or read the list below.',
    '',
  ];
  for (const skill of skillDefinitions) {
    lines.push(`- [${skill.title}](${skillUrl(skill)}) — ${skill.summary}`);
    lines.push(`  - Agent bootstrap: ${skillUrl(skill, '/use.md')}`);
    lines.push(`  - Manifest: ${skillUrl(skill, '/manifest.json')}`);
    lines.push(`  - Signed certificate: ${skillUrl(skill, '/certificate.json')}`);
  }
  lines.push(
    '',
    '## Decision tree',
    '',
    '- Web or search-only agent: enumerate via catalog.json, open each skill page, and use the skill in context from its linked markdown. No install needed.',
    "- File-capable agent: do the above, then offer to save a skill's raw files or archive into a local skill folder if the user wants reuse.",
    '- Native-install-capable agent (skills/plugins): do the above, verify the certificate, then offer the native install path as optional, not required.',
    '',
    '## Verify before you trust',
    '',
    `1. The trust root is ${SKILL_AUTHORITY_URL} — served only from the canonical domain. Fetch it.`,
    `2. For a skill, fetch its certificate.json + certificate.sig and the signing key at ${SIGNING_KEY_URL}.`,
    '3. Canonicalize the certificate JSON and verify its Ed25519 signature. Confirm the slug, version, repository commit, and path.',
    '4. Hash the archive (SHA-256 + SHA3-512); both must equal the signed certificate, the manifest, and the authority entry.',
    '5. If anything disagrees, treat the copy as untrusted and stop.',
    '',
  );
  return lines.join('\n');
}

/** Short first-fetch crawl preview for the hub (public/skills/agent.md). */
function hubAgentMarkdown() {
  const lines = [
    '# AMTECH Agent Skills',
    '',
    'Free AMTECH skills usable from one link. Use in context first; install only if the user asks.',
    '',
    `Machine catalog: ${HUB_CATALOG_URL}`,
    `Full bootstrap: ${SKILL_SITE_ORIGIN}/skills/use.md`,
    `Trust root: ${SKILL_AUTHORITY_URL}`,
    '',
  ];
  for (const skill of skillDefinitions) {
    lines.push(`- [${skill.title}](${skillUrl(skill)}): ${skill.description}`);
  }
  lines.push('');
  return lines.join('\n');
}

const DRAFT_2020_12 = 'https://json-schema.org/draft/2020-12/schema';

/** JSON Schema describing a skill manifest.json (the per-skill package descriptor). */
function manifestSchemaDoc(selfUrl: string, _authoritySchemaUrl: string) {
  return {
    $schema: DRAFT_2020_12,
    $id: selfUrl,
    title: 'AMTECH Skill Manifest v0',
    description: 'Schema for an AMTECH consumable-skill manifest.json. The manifest is the per-skill package descriptor: entrypoints, per-file integrity hashes, the archive hash, and the authority (trust root) pointer.',
    type: 'object',
    required: ['$schema', 'slug', 'name', 'title', 'version', 'source', 'entrypoints', 'files', 'archive', 'certificate', 'authority', 'safety'],
    additionalProperties: true,
    properties: {
      $schema: { type: 'string', format: 'uri', const: selfUrl },
      slug: { type: 'string' },
      name: { type: 'string' },
      title: { type: 'string' },
      version: { type: 'string' },
      updated: { type: 'string' },
      description: { type: 'string' },
      source: {
        type: 'object',
        required: ['canonicalUrl', 'repository', 'repositoryCommit', 'repositoryPath', 'repositoryTree', 'repositoryRegistry', 'codexSkillInstaller'],
        properties: {
          canonicalUrl: { type: 'string', format: 'uri' },
          sourceDirectory: { type: 'string' },
          repository: { type: 'string', format: 'uri' },
          repositoryCommit: { type: 'string', pattern: '^[a-f0-9]{40}$' },
          repositoryCommitSignature: { enum: ['verified', 'unverified', 'unsigned'] },
          repositoryPath: { type: 'string' },
          repositoryTree: { type: 'string', format: 'uri' },
          repositoryRegistry: { type: 'string', format: 'uri' },
          codexSkillInstaller: { type: 'string' },
        },
      },
      entrypoints: { type: 'object', properties: { human: { type: 'string', format: 'uri' }, use: { type: 'string', format: 'uri' }, agent: { type: 'string', format: 'uri' }, skill: { type: 'string', format: 'uri' }, archive: { type: 'string', format: 'uri' }, checksums: { type: 'string', format: 'uri' } }, required: ['human', 'use', 'skill', 'archive', 'checksums'] },
      files: { type: 'array', items: { type: 'object', required: ['path', 'role', 'sha256', 'sha3_512', 'integrity', 'size', 'url'], properties: { path: { type: 'string' }, role: { type: 'string' }, sha256: { type: 'string', pattern: '^[a-f0-9]{64}$' }, sha3_512: { type: 'string', pattern: '^[a-f0-9]{128}$' }, integrity: { type: 'string', pattern: '^sha256-[A-Za-z0-9+/]+=*$' }, size: { type: 'integer', minimum: 0 }, url: { type: 'string', format: 'uri' } } } },
      archive: { type: 'object', required: ['file', 'sha256', 'sha3_512', 'integrity', 'url'], properties: { file: { type: 'string' }, sha256: { type: 'string', pattern: '^[a-f0-9]{64}$' }, sha3_512: { type: 'string', pattern: '^[a-f0-9]{128}$' }, integrity: { type: 'string', pattern: '^sha256-[A-Za-z0-9+/]+=*$' }, url: { type: 'string', format: 'uri' } } },
      certificate: { type: 'object', required: ['id', 'algorithm', 'certificateUrl', 'signatureUrl', 'signingKeyUrl', 'signed'], properties: { id: { type: 'string' }, algorithm: { const: 'Ed25519' }, certificateUrl: { type: 'string', format: 'uri' }, signatureUrl: { type: 'string', format: 'uri' }, signingKeyUrl: { type: 'string', format: 'uri' }, signed: { const: true } } },
      authority: { type: 'object', required: ['authorityUrl', 'method', 'digestAlgorithms', 'signed', 'repositoryRegistryUrl', 'verify'], properties: { authorityUrl: { type: 'string', format: 'uri' }, method: { const: 'ed25519-canonical-json-v1' }, digestAlgorithms: { const: ['SHA-256', 'SHA3-512'] }, signed: { const: true }, repositoryRegistryUrl: { type: 'string', format: 'uri' }, verify: { type: 'string' } } },
      safety: { type: 'object', required: ['scripts', 'requiresNetwork', 'requiresSecrets'], properties: { scripts: { enum: ['none', 'optional', 'required'] }, requiresNetwork: { type: 'boolean' }, requiresSecrets: { type: 'boolean' }, riskNote: { type: 'string' } } },
    },
  };
}

/** JSON Schema describing the domain-controlled skill-authority.json (the trust root). */
function authoritySchemaDoc(selfUrl: string) {
  return {
    $schema: DRAFT_2020_12,
    $id: selfUrl,
    title: 'AMTECH Skill Authority v0',
    description: 'Schema for the domain-controlled /.well-known/skill-authority.json. It is the trust root: an agent confirms a skill archive sha256 against the entry here, served only from the canonical domain.',
    type: 'object',
    required: ['$schema', 'authorityUrl', 'updated', 'issuer', 'repository', 'verification', 'skills'],
    additionalProperties: false,
    properties: {
      $schema: { type: 'string', format: 'uri', const: selfUrl },
      authorityUrl: { type: 'string', format: 'uri', description: 'Self-reference to this authority file on the canonical domain.' },
      updated: { type: 'string', pattern: '^\\d{4}-\\d{2}-\\d{2}$' },
      issuer: { type: 'object', required: ['name', 'url'], additionalProperties: false, properties: { name: { type: 'string' }, url: { type: 'string', format: 'uri' } } },
      repository: { type: 'object', required: ['url', 'commit', 'commitSignature', 'registryUrl'], additionalProperties: false, properties: { url: { type: 'string', format: 'uri' }, commit: { type: 'string', pattern: '^[a-f0-9]{40}$' }, commitSignature: { enum: ['verified', 'unverified', 'unsigned'] }, registryUrl: { type: 'string', format: 'uri' } } },
      verification: { type: 'object', required: ['method', 'digestAlgorithms', 'signed', 'signingKeyUrl', 'note'], additionalProperties: false, properties: { method: { const: 'ed25519-canonical-json-v1' }, digestAlgorithms: { const: ['SHA-256', 'SHA3-512'] }, signed: { const: true }, signingKeyUrl: { type: 'string', format: 'uri' }, note: { type: 'string' } } },
      skills: {
        type: 'array',
        items: {
          type: 'object',
          required: ['slug', 'name', 'title', 'version', 'status', 'trustTier', 'policyVersion', 'canonicalUrl', 'archiveUrl', 'archiveSha256', 'archiveSha3_512', 'sourcePackageSha256', 'sourcePackageSha3_512', 'certificateId', 'certificateUrl', 'signatureUrl', 'conformanceEvidenceUrl', 'authorityUrl', 'repositoryUrl', 'repositoryCommit', 'repositoryCommitSignature', 'repositoryPath', 'repositoryTreeUrl', 'repositoryRegistryUrl'],
          additionalProperties: false,
          properties: {
            slug: { type: 'string' },
            name: { type: 'string' },
            title: { type: 'string' },
            version: { type: 'string' },
            status: { enum: ['published', 'planned', 'deprecated'] },
            trustTier: { enum: ['signed', 'structure-verified', 'amtech-reviewed', 'replay-verified', 'behavior-verified'] },
            policyVersion: { type: 'string' },
            canonicalUrl: { type: 'string', format: 'uri' },
            archiveUrl: { type: 'string', format: 'uri' },
            archiveSha256: { type: 'string', pattern: '^[a-f0-9]{64}$' },
            archiveSha3_512: { type: 'string', pattern: '^[a-f0-9]{128}$' },
            sourcePackageSha256: { type: 'string', pattern: '^[a-f0-9]{64}$' },
            sourcePackageSha3_512: { type: 'string', pattern: '^[a-f0-9]{128}$' },
            certificateId: { type: 'string' },
            certificateUrl: { type: 'string', format: 'uri' },
            signatureUrl: { type: 'string', format: 'uri' },
            conformanceEvidenceUrl: { type: 'string', format: 'uri' },
            reviewEvidenceUrl: { type: 'string', format: 'uri' },
            authorityUrl: { type: 'string', format: 'uri' },
            repositoryUrl: { type: 'string', format: 'uri' },
            repositoryCommit: { type: 'string', pattern: '^[a-f0-9]{40}$' },
            repositoryCommitSignature: { enum: ['verified', 'unverified', 'unsigned'] },
            repositoryPath: { type: 'string' },
            repositoryTreeUrl: { type: 'string', format: 'uri' },
            repositoryRegistryUrl: { type: 'string', format: 'uri' },
          },
        },
      },
    },
  };
}

function manifest(skill: SkillDefinition, files: SourceFile[], archiveSha: string, archiveSha3: string, archiveName: string, certificate?: ArtifactCertificate) {
  return {
    $schema: `${SKILL_SITE_ORIGIN}/skills/schemas/amtech-skill-manifest-v0.json`,
    slug: skill.slug,
    name: skill.name,
    title: skill.title,
    version: skill.version,
    updated: skill.updated,
    description: skill.description,
    source: {
      canonicalUrl: skillUrl(skill),
      sourceDirectory: skill.sourceDir,
      repository: skill.repository.url,
      repositoryCommit: skill.repository.commit,
      repositoryCommitSignature: skill.repository.commitSignature,
      repositoryPath: skill.repository.path,
      repositoryTree: skillRepositoryTreeUrl(skill),
      repositoryRegistry: skillRepositoryRegistryUrl(skill),
      codexSkillInstaller: `$skill-installer install ${skillRepositoryTreeUrl(skill)}`,
    },
    entrypoints: {
      human: skillUrl(skill),
      use: skillUrl(skill, '/use.md'),
      agent: skillUrl(skill, '/agent.md'),
      skill: skillUrl(skill, '/SKILL.md'),
      archive: skillUrl(skill, `/${archiveName}`),
      checksums: skillUrl(skill, '/checksums.txt'),
    },
    files: files.map((file) => ({
      path: file.path,
      role: file.role,
      title: file.title,
      summary: file.summary,
      mediaType: file.mediaType,
      sha256: file.sha256,
      sha3_512: file.sha3_512,
      integrity: sriSha256FromHex(file.sha256),
      size: file.size,
      url: file.url,
      loadPolicy: file.loadPolicy,
      runPolicy: file.runPolicy,
      permissions: file.permissions ?? [],
    })),
    archive: {
      file: archiveName,
      sha256: archiveSha,
      sha3_512: archiveSha3,
      integrity: sriSha256FromHex(archiveSha),
      url: skillUrl(skill, `/${archiveName}`),
    },
    sourcePackage: certificate?.sourcePackage,
    certificate: certificate
      ? {
          id: certificate.certificateId,
          schemaVersion: certificate.schemaVersion,
          algorithm: 'Ed25519',
          certificateUrl: skillUrl(skill, '/certificate.json'),
          signatureUrl: skillUrl(skill, '/certificate.sig'),
          signingKeyUrl: certificate.signingKeyUrl,
          signed: true,
          trustTier: certificate.attestations?.trustTier ?? 'signed',
          policyVersion: certificate.attestations?.policyVersion,
          attestations: certificate.attestations
            ? {
                conformance: {
                  method: certificate.attestations.conformance.method,
                  result: certificate.attestations.conformance.result,
                  evidenceUrl: certificate.attestations.conformance.evidence.url,
                },
                review: certificate.attestations.review
                  ? { result: certificate.attestations.review.result, reviewer: certificate.attestations.review.reviewer.id, evidenceUrl: certificate.attestations.review.evidence.url }
                  : undefined,
              }
            : undefined,
        }
      : { signed: false, trustTier: 'signed' },
    authority: {
      authorityUrl: SKILL_AUTHORITY_URL,
      method: certificate ? 'ed25519-canonical-json-v1' : 'sha256-cross-origin-v1',
      digestAlgorithms: ['SHA-256', 'SHA3-512'],
      signed: Boolean(certificate),
      repositoryRegistryUrl: skillRepositoryRegistryUrl(skill),
      verify: `Verify certificate.json against certificate.sig using the Ed25519 public key at ${SKILL_SITE_ORIGIN}/.well-known/amtech-signing-key.json. Then confirm the signed SHA-256 and SHA3-512 archive digests, version, repository path, and commit ${skill.repository.commit} match this manifest and ${SKILL_AUTHORITY_URL}.`,
    },
    safety: skill.safety,
  };
}

async function signedCertificate(skill: SkillDefinition, archive: Buffer, files: SourceFile[]): Promise<{ certificate: ArtifactCertificate; signature: string } | undefined> {
  try {
    const [certificateRaw, signature, keyRaw] = await Promise.all([
      readFile(resolve(repoRoot, `src/lib/skills/certificates/${skill.slug}/certificate.json`), 'utf8'),
      readFile(resolve(repoRoot, `src/lib/skills/certificates/${skill.slug}/certificate.sig`), 'utf8'),
      readFile(resolve(repoRoot, 'src/lib/skills/certificates/amtech-signing-key.json'), 'utf8'),
    ]);
    const certificate = JSON.parse(certificateRaw) as ArtifactCertificate;
    const key = JSON.parse(keyRaw) as SigningKeyDocument;
    const sourcePackage = packagePayloadDigest(files.map((file) => ({ path: file.path, content: file.content })));
    const valid =
      verifyCertificate(certificate, signature, key) &&
      certificate.subjectType === 'skill' &&
      certificate.subjectId === skill.slug &&
      certificate.version === skill.version &&
      certificate.repository?.commit === skill.repository.commit &&
      certificate.repository.path === skill.repository.path &&
      certificate.digests.sha256 === sha256(archive) &&
      certificate.digests.sha3_512 === sha3_512(archive) &&
      // v2: the cross-repo source-package anchor must match the source bytes the registry also verifies.
      certificate.sourcePackage?.sha256 === sourcePackage.sha256 &&
      certificate.sourcePackage.sha3_512 === sourcePackage.sha3_512;
    if (!valid) throw new Error('certificate, source provenance, signature, archive digest, or sourcePackage mismatch');
    return { certificate, signature: signature.trim() };
  } catch (error) {
    if (process.env.AMTECH_ALLOW_UNSIGNED_BUILD === '1') return undefined;
    throw new Error(`${skill.slug}: signed certificate is missing or stale (${error instanceof Error ? error.message : String(error)}). Run npm run skills:sign with the release key.`);
  }
}

const crcTable = new Uint32Array(256).map((_, n) => {
  let c = n;
  for (let k = 0; k < 8; k += 1) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});

function crc32(buffer: Buffer): number {
  let crc = 0xffffffff;
  for (const byte of buffer) crc = crcTable[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

function u16(value: number): Buffer {
  const buf = Buffer.alloc(2);
  buf.writeUInt16LE(value);
  return buf;
}

function u32(value: number): Buffer {
  const buf = Buffer.alloc(4);
  buf.writeUInt32LE(value >>> 0);
  return buf;
}

function dosDateTime() {
  // Fixed timestamp for deterministic archives: 2026-06-19 00:00:00.
  const year = 2026 - 1980;
  const month = 6;
  const day = 19;
  const hour = 0;
  const minute = 0;
  const second = 0;
  return {
    time: (hour << 11) | (minute << 5) | Math.floor(second / 2),
    date: (year << 9) | (month << 5) | day,
  };
}

function zipStore(entries: { path: string; content: Buffer }[]): Buffer {
  const { time, date } = dosDateTime();
  const locals: Buffer[] = [];
  const central: Buffer[] = [];
  let offset = 0;

  for (const entry of entries) {
    const name = Buffer.from(entry.path);
    const crc = crc32(entry.content);
    const local = Buffer.concat([
      u32(0x04034b50),
      u16(20),
      u16(0),
      u16(0),
      u16(time),
      u16(date),
      u32(crc),
      u32(entry.content.length),
      u32(entry.content.length),
      u16(name.length),
      u16(0),
      name,
      entry.content,
    ]);
    locals.push(local);

    central.push(
      Buffer.concat([
        u32(0x02014b50),
        u16(20),
        u16(20),
        u16(0),
        u16(0),
        u16(time),
        u16(date),
        u32(crc),
        u32(entry.content.length),
        u32(entry.content.length),
        u16(name.length),
        u16(0),
        u16(0),
        u16(0),
        u16(0),
        u32(0),
        u32(offset),
        name,
      ]),
    );
    offset += local.length;
  }

  const centralDir = Buffer.concat(central);
  const localFiles = Buffer.concat(locals);
  const end = Buffer.concat([
    u32(0x06054b50),
    u16(0),
    u16(0),
    u16(entries.length),
    u16(entries.length),
    u32(centralDir.length),
    u32(localFiles.length),
    u16(0),
  ]);

  return Buffer.concat([localFiles, centralDir, end]);
}

async function writeText(relPath: string, content: string) {
  const abs = resolve(repoRoot, relPath);
  await mkdir(dirname(abs), { recursive: true });
  await writeFile(abs, content, 'utf8');
}

async function writeBuffer(relPath: string, content: Buffer) {
  const abs = resolve(repoRoot, relPath);
  await mkdir(dirname(abs), { recursive: true });
  await writeFile(abs, content);
}

async function buildSkill(skill: SkillDefinition) {
  const files = await sourceFiles(skill);
  const archiveName = `${skill.slug}-${skill.version}.zip`;
  const archive = zipStore(files.map((file) => ({ path: `${skill.slug}/${file.path}`, content: file.content })));
  const archiveSha = sha256(archive);
  const archiveSha3 = sha3_512(archive);
  const signed = await signedCertificate(skill, archive, files);
  const base = `public${skillPath(skill)}`;
  const generated = new Map<string, string | Buffer>();

  const useMd = bootstrapMarkdown(skill);
  const agentMd = agentMarkdown(skill);
  generated.set(`${base}/use.md`, useMd);
  generated.set(`${base}/agent.md`, agentMd);
  generated.set(`${base}/SKILL.md`, files.find((file) => file.path === 'SKILL.md')?.content ?? Buffer.alloc(0));
  generated.set(`${base}/manifest.json`, `${escJson(manifest(skill, files, archiveSha, archiveSha3, archiveName, signed?.certificate))}\n`);
  generated.set(`${base}/files.md`, filesMarkdown(skill, files));
  generated.set(`${base}/references.md`, groupMarkdown(skill, files, 'references'));
  generated.set(`${base}/scripts.md`, groupMarkdown(skill, files, 'scripts'));
  generated.set(`${base}/assets.md`, groupMarkdown(skill, files, 'assets'));
  generated.set(`${base}/${archiveName}`, archive);
  if (signed) {
    generated.set(`${base}/certificate.json`, `${escJson(signed.certificate)}\n`);
    generated.set(`${base}/certificate.sig`, `${signed.signature}\n`);
    // Publish the assurance evidence the certificate references (verbatim, so the cert's evidence
    // sha256 resolves against the served file).
    for (const name of ['conformance.json', 'review.json'] as const) {
      const evidence = await readFile(resolve(repoRoot, `src/lib/skills/certificates/${skill.slug}/evidence/${name}`)).catch(() => null);
      if (evidence) generated.set(`${base}/evidence/${name}`, evidence);
    }
  }

  const checksums = [
    `${archiveSha}  ${archiveName}`,
    ...files.map((file) => `${file.sha256}  files/${file.path}`),
    '',
  ].join('\n');
  generated.set(`${base}/checksums.txt`, checksums);
  generated.set(
    `${base}/checksums.json`,
    `${escJson({
      archive: { file: archiveName, sha256: archiveSha, sha3_512: archiveSha3 },
      files: files.map((file) => ({ path: file.path, size: file.size, sha256: file.sha256, sha3_512: file.sha3_512 })),
    })}\n`,
  );

  for (const file of files) {
    generated.set(`${base}/files/${file.path}`, file.content);
  }

  for (const [relPath, content] of generated) {
    if (typeof content === 'string') await writeText(relPath, content);
    else await writeBuffer(relPath, content);
  }

  // React-free content snapshot consumed by the SkillDetail page + prerenderer (render from data).
  const content = {
    slug: skill.slug,
    useMd,
    agentMd,
    archiveSha256: archiveSha,
    archiveSha3_512: archiveSha3,
    certificateId: signed?.certificate.certificateId,
    trustTier: signed?.certificate.attestations?.trustTier ?? (signed ? 'signed' : undefined),
    policyVersion: signed?.certificate.attestations?.policyVersion,
    conformanceEvidenceUrl: signed?.certificate.attestations?.conformance.evidence.url,
    reviewEvidenceUrl: signed?.certificate.attestations?.review?.evidence.url,
    // Quick file-route map (docs/skills/standard/05) — the agent-map `files` block surfaces this so an
    // agent navigates the package without parsing the body. `integrity` is the SRI the manifest binds.
    fileRoutes: files.map((file) => ({ path: file.path, url: file.url, role: file.role, integrity: sriSha256FromHex(file.sha256) })),
    files: files.map((file) => {
      const isText = /^(text\/|application\/(json|yaml))/.test(file.mediaType);
      return {
        path: file.path,
        role: file.role,
        title: file.title,
        summary: file.summary,
        loadPolicy: file.loadPolicy,
        runPolicy: file.runPolicy,
        mediaType: file.mediaType,
        size: file.size,
        sha256: file.sha256,
        sha3_512: file.sha3_512,
        isText,
        ...(isText ? { text: file.content.toString('utf8') } : {}),
      };
    }),
  };

  // SHA-256 of the EXACT published certificate.json bytes (what a consumer fetches) — the per-skill leaf
  // of the catalog root (docs/skills/standard/09 step 4). The registry mirrors byte-identical certs, so
  // it recomputes the same root from its own copies.
  const certificateBytesSha256 = signed ? sha256(`${escJson(signed.certificate)}\n`) : undefined;

  return { files, archiveName, archiveSha, archiveSha3, certificate: signed?.certificate, certificateBytesSha256, content };
}

/**
 * Catalog root (docs/skills/standard/09 §4): a single digest over the SET of certificates, so a
 * consumer can confirm it is looking at the whole, untampered catalog — not just one valid skill.
 * Preimage (LOCKED — changing it is a breaking cross-repo recompute): canonical JSON of
 * `[{ slug, cert: sha256(<published certificate.json bytes>) }]` sorted by slug. `registry/validate.mjs`
 * recomputes this identically from the mirrored certs.
 */
function computeCatalogRoot(entries: { slug: string; certificateBytesSha256: string }[]): string {
  const leaves = entries
    .map((entry) => ({ slug: entry.slug, cert: entry.certificateBytesSha256 }))
    .sort((a, b) => (a.slug < b.slug ? -1 : a.slug > b.slug ? 1 : 0));
  return sha256(canonicalJson(leaves));
}

/** The verdict fields every M3 surface projects (docs/skills/standard/05) — from ONE build-time verifier run. */
function verdictSurface(v: SkillVerdict) {
  return { verdict: v.verdict, trustTier: v.trustTier, method: v.method, depth: v.depth, authoritySequence: v.authoritySequence, checkedAt: v.checkedAt };
}

/**
 * The self-describing verification recipe (docs/skills/standard/04+09) — the *ingredients plus the expected
 * result* of the deterministic graph-replay check, so an agent recomputes the verdict instead of trusting a
 * badge. This is what the head's `amtech:skill:recipe` meta points to; the proof is the recompute, not the meta.
 */
function recipeDoc(skill: SkillDefinition, v: SkillVerdict) {
  const recordsBase = `${SKILL_SITE_ORIGIN}/.well-known/authority/records/0000.json`;
  return {
    schemaVersion: 'amtech-skill-recipe/v1',
    skill: skill.slug,
    version: skill.version,
    method: 'graph-replay',
    note: 'Recompute this verdict yourself from the published surfaces; determinism is the security property (docs/skills/standard/09). The meta tag only transports this pointer — it is never the proof.',
    expected: { verdict: v.verdict, trustTier: v.trustTier, method: v.method, authoritySequence: v.authoritySequence },
    inputs: {
      certificate: skillUrl(skill, '/certificate.json'),
      signature: skillUrl(skill, '/certificate.sig'),
      signingKey: `${SKILL_SITE_ORIGIN}/.well-known/amtech-signing-key.json`,
      manifest: skillUrl(skill, '/manifest.json'),
      catalog: HUB_CATALOG_URL,
      authority: SKILL_AUTHORITY_URL,
      authorityRecord: recordsBase,
    },
    steps: [
      'Ed25519-verify certificate.json over canonical JSON (RFC 8785) against the signing key → INVALID_SIGNATURE / IDENTITY_MISMATCH.',
      'Recompute sourcePackage over the published files and compare to certificate.sourcePackage → SOURCE_PACKAGE_MISMATCH.',
      'Recompute each manifest file SHA-256 and compare to its integrity (SRI) → MANIFEST_DIGEST_MISMATCH.',
      'Recompute the catalog root over the per-skill certificate digests and compare to catalog.json → CATALOG_ROOT_MISMATCH.',
      'Confirm the authority record digest equals skill-authority.latestRecordHash and the record lists this certificate → AUTHORITY_MISMATCH.',
    ],
    verifier: `npm run skills:verify ${skillUrl(skill)}`,
  };
}

/** Rewrite the delimited generated verdict block in public/_headers, preserving the hand-maintained rules. */
async function writeHeadersBlock(block: string) {
  const path = resolve(repoRoot, 'public/_headers');
  const existing = (await readFile(path, 'utf8').catch(() => '')) as string;
  const stripped = existing.replace(/\n*# >>> AMTECH skills verdicts[\s\S]*?# <<< AMTECH skills verdicts\n*/g, '\n');
  await writeFile(path, `${stripped.replace(/\n+$/, '')}\n\n${block}\n`, 'utf8');
}

async function main() {
  await rm(publicSkillsDir, { recursive: true, force: true });
  await mkdir(publicSkillsDir, { recursive: true });

  const index = [];
  const contents = [];
  for (const skill of skillDefinitions) {
    const built = await buildSkill(skill);
    contents.push(built.content);
    index.push({
      slug: skill.slug,
      name: skill.name,
      title: skill.title,
      version: skill.version,
      description: skill.description,
      url: skillUrl(skill),
      use: skillUrl(skill, '/use.md'),
      manifest: skillUrl(skill, '/manifest.json'),
      archive: skillUrl(skill, `/${built.archiveName}`),
      archiveSha256: built.archiveSha,
      archiveSha3_512: built.archiveSha3,
      certificate: built.certificate
        ? {
            id: built.certificate.certificateId,
            url: skillUrl(skill, '/certificate.json'),
            signature: skillUrl(skill, '/certificate.sig'),
            sha256: built.certificateBytesSha256,
          }
        : undefined,
      trustTier: built.certificate?.attestations?.trustTier ?? (built.certificate ? 'signed' : undefined),
      policyVersion: built.certificate?.attestations?.policyVersion,
      sourcePackage: built.certificate?.sourcePackage,
      evidence: built.certificate?.attestations
        ? {
            conformance: built.certificate.attestations.conformance.evidence.url,
            review: built.certificate.attestations.review?.evidence.url,
          }
        : undefined,
      repository: skill.repository.url,
      repositoryCommit: skill.repository.commit,
      repositoryTree: skillRepositoryTreeUrl(skill),
    });
  }

  await writeText('public/skills/index.json', `${escJson({ skills: index })}\n`);
  await writeText('public/skills/catalog.md', catalogMarkdown());
  await writeText('public/skills/llms.txt', llmsMarkdown());

  // Catalog/hub bootstrap (docs/skills/standard/06, M0) + trustTier (earned at M1, docs/.../02).
  // `verdict`/`authoritySequence`/`checkedAt` remain earned by M2/M3/M4 and are intentionally omitted.
  const catalogRootEntries = index
    .filter((s): s is typeof s & { certificate: { sha256: string } } => Boolean(s.certificate?.sha256))
    .map((s) => ({ slug: s.slug, certificateBytesSha256: s.certificate.sha256 }));
  const catalogRoot = computeCatalogRoot(catalogRootEntries);

  const catalogDoc = {
    schemaVersion: 'amtech-skill-catalog/v1',
    issuer: { name: 'AMTECH AI', url: SKILL_SITE_ORIGIN },
    authorityUrl: SKILL_AUTHORITY_URL,
    generatedAt: new Date().toISOString().slice(0, 10),
    // Digest over the SET of per-skill certificate digests (docs/skills/standard/09 §4). Reserve
    // `amtech:catalog:root` for the hub <head> (M3 surfaces it); the registry recomputes this value.
    catalogRoot,
    skills: index.map((s) => ({
      slug: s.slug,
      name: s.name,
      title: s.title,
      version: s.version,
      status: 'published',
      trustTier: s.trustTier,
      canonicalUrl: s.url,
      useUrl: s.use,
      manifestUrl: s.manifest,
      certificateUrl: s.certificate?.url,
      signatureUrl: s.certificate?.signature,
    })),
  };
  await writeText('public/skills/catalog.json', `${escJson(catalogDoc)}\n`);
  await writeText('public/skills/use.md', hubBootstrapMarkdown());
  await writeText('public/skills/agent.md', hubAgentMarkdown());
  await writeText(
    'public/.well-known/amtech-signing-key.json',
    await readFile(resolve(repoRoot, 'src/lib/skills/certificates/amtech-signing-key.json'), 'utf8'),
  );

  // Authority record (M4 groundwork — docs/skills/standard/03). Mirror the cert pattern: sign-authority.ts
  // emits the signed genesis record under src/, build publishes it and exposes the latest pointer. Absent on
  // a pre-sign build (AMTECH_ALLOW_UNSIGNED_BUILD) — pointers stay null until the record exists.
  let latestSequence: string | null = null;
  let latestRecordHash: string | null = null;
  let latestState: unknown = undefined;
  const recordsSrcDir = resolve(repoRoot, 'src/lib/skills/authority/records');
  const recordFiles = (await readdir(recordsSrcDir).catch(() => [] as string[])).filter((f) => /^\d{4}\.json$/.test(f)).sort();
  const logEntries: { sequence: string; recordHash: string; recordUrl: string; signatureUrl: string }[] = [];
  for (const file of recordFiles) {
    const stem = file.replace('.json', '');
    const recordSrc = await readFile(resolve(recordsSrcDir, `${stem}.json`), 'utf8');
    const recordSig = await readFile(resolve(recordsSrcDir, `${stem}.sig`), 'utf8').catch(() => null);
    if (!recordSig) continue;
    const record = JSON.parse(recordSrc) as { sequence?: string; state?: unknown };
    const recordHash = sha256(canonicalJson(record)); // hash over canonical form (independent of pretty-printing)
    await writeText(`public/.well-known/authority/records/${stem}.json`, recordSrc.endsWith('\n') ? recordSrc : `${recordSrc}\n`);
    await writeText(`public/.well-known/authority/records/${stem}.sig`, recordSig.endsWith('\n') ? recordSig : `${recordSig}\n`);
    logEntries.push({
      sequence: record.sequence ?? stem,
      recordHash,
      recordUrl: `${SKILL_SITE_ORIGIN}/.well-known/authority/records/${stem}.json`,
      signatureUrl: `${SKILL_SITE_ORIGIN}/.well-known/authority/records/${stem}.sig`,
    });
    latestSequence = record.sequence ?? stem;
    latestRecordHash = recordHash;
    latestState = record.state;
  }
  if (logEntries.length) {
    await writeText(
      'public/.well-known/authority/log.json',
      `${escJson({ schemaVersion: 'amtech-authority-log/v1', authorityUrl: SKILL_AUTHORITY_URL, latestSequence, latestRecordHash, records: logEntries })}\n`,
    );
  }

  // Domain-controlled skill authority file — the trust root. Agents verify skill hashes against it.
  const authoritySchemaUrl = `${SKILL_SITE_ORIGIN}/.well-known/skill-authority-v0.json`;
  const manifestSchemaUrl = `${SKILL_SITE_ORIGIN}/skills/schemas/amtech-skill-manifest-v0.json`;
  const skillAuthority = {
    $schema: authoritySchemaUrl,
    authorityUrl: SKILL_AUTHORITY_URL,
    updated: new Date().toISOString().slice(0, 10),
    issuer: { name: 'AMTECH AI', url: SKILL_SITE_ORIGIN },
    // Latest immutable authority record (M4 groundwork). The verifier confirms latestRecordHash equals the
    // published record's canonical digest (G-M4.2); the chain/history grows in M4 proper.
    latestSequence,
    latestRecordHash,
    authorityLogUrl: `${SKILL_SITE_ORIGIN}/.well-known/authority/log.json`,
    state: latestState,
    repository: {
      url: SKILL_REPOSITORY_URL,
      commit: SKILL_REPOSITORY_COMMIT,
      commitSignature: 'unsigned',
      registryUrl: `${SKILL_REPOSITORY_URL}/blob/${SKILL_REPOSITORY_COMMIT}/index.json`,
    },
    verification: {
      method: 'ed25519-canonical-json-v1',
      digestAlgorithms: ['SHA-256', 'SHA3-512'],
      signed: true,
      signingKeyUrl: 'https://amtechai.com/.well-known/amtech-signing-key.json',
      note: 'Each skill archive has an Ed25519 signature over a deterministic AMTECH Signed Artifact v2 certificate that also binds a cross-repo sourcePackage digest and trust-tier attestations (offline conformance + AMTECH review). SHA-256 is retained for compatibility and SHA3-512 provides a second digest construction.',
    },
    skills: index.map((s) => ({
      slug: s.slug,
      name: s.name,
      title: s.title,
      version: s.version,
      status: 'published',
      trustTier: s.trustTier,
      policyVersion: s.policyVersion,
      canonicalUrl: s.url,
      archiveUrl: s.archive,
      archiveSha256: s.archiveSha256,
      archiveSha3_512: s.archiveSha3_512,
      sourcePackageSha256: s.sourcePackage?.sha256,
      sourcePackageSha3_512: s.sourcePackage?.sha3_512,
      certificateId: s.certificate?.id,
      certificateUrl: s.certificate?.url,
      signatureUrl: s.certificate?.signature,
      conformanceEvidenceUrl: s.evidence?.conformance,
      reviewEvidenceUrl: s.evidence?.review,
      authorityUrl: SKILL_AUTHORITY_URL,
      repositoryUrl: s.repository,
      repositoryCommit: s.repositoryCommit,
      repositoryCommitSignature: skillDefinitions.find((skill) => skill.slug === s.slug)?.repository.commitSignature,
      repositoryPath: skillDefinitions.find((skill) => skill.slug === s.slug)?.repository.path,
      repositoryTreeUrl: s.repositoryTree,
      repositoryRegistryUrl: skillRepositoryRegistryUrl(skillDefinitions.find((skill) => skill.slug === s.slug)!),
    })),
  };
  await writeText('public/.well-known/skill-authority.json', `${escJson(skillAuthority)}\n`);

  // Served JSON Schemas (draft 2020-12) for the two trust documents. Publishing them turns the
  // `$schema` identifiers into dereferenceable, validatable resources — on-thesis for a verifiable,
  // agent-readable surface — and editors that honor $schema validate the documents automatically.
  await writeText(
    'public/skills/schemas/amtech-skill-manifest-v0.json',
    `${escJson(manifestSchemaDoc(manifestSchemaUrl, authoritySchemaUrl))}\n`,
  );
  await writeText(
    'public/.well-known/skill-authority-v0.json',
    `${escJson(authoritySchemaDoc(authoritySchemaUrl))}\n`,
  );

  // --- M3: project ONE build-time verifier run to every surface (docs/skills/standard/05). The verdict is
  // produced by the engine (04) over the now-complete published tree; meta/JSON-LD/headers/body are all
  // projections of it. checkedAt = the deterministic release date so artifacts stay byte-stable (G-X.7).
  const releaseCheckedAt = `${[...skillDefinitions].map((s) => s.updated).sort().at(-1)}T00:00:00.000Z`;
  const publicDir = resolve(repoRoot, 'public');
  const verdicts = new Map<string, SkillVerdict>();
  for (const skill of skillDefinitions) {
    verdicts.set(skill.slug, await verifySkill(localPublicLoader(publicDir, skill.slug), { checkedAt: releaseCheckedAt }));
  }

  // catalog.json — per-skill verdict (catalogRoot is cert-based, so adding a verdict does not change it).
  for (const entry of catalogDoc.skills as Record<string, unknown>[]) {
    const v = verdicts.get(entry.slug as string);
    if (v) entry.verification = verdictSurface(v);
  }
  await writeText('public/skills/catalog.json', `${escJson(catalogDoc)}\n`);

  // Per-skill: manifest verification block + recipe.json + a response-header line; thread the verdict into
  // the generated content (drives the page badge + head meta via pageMeta.ts).
  const headerBlock: string[] = ['# >>> AMTECH skills verdicts (generated by scripts/skills/build-skills.ts — do not edit)'];
  for (const skill of skillDefinitions) {
    const v = verdicts.get(skill.slug);
    if (!v) continue;
    const recipeUrl = skillUrl(skill, '/recipe.json');
    const manifestRel = `public${skillPath(skill)}/manifest.json`;
    const mf = JSON.parse(await readFile(resolve(repoRoot, manifestRel), 'utf8')) as Record<string, unknown>;
    mf.verification = { ...verdictSurface(v), recipeUrl };
    await writeText(manifestRel, `${escJson(mf)}\n`);
    await writeText(`public${skillPath(skill)}/recipe.json`, `${escJson(recipeDoc(skill, v))}\n`);
    headerBlock.push(
      `${skillPath(skill)}`,
      `  X-AMTECH-Skill-Verification: ${v.verdict}; tier=${v.trustTier ?? 'none'}; seq=${v.authoritySequence ?? 'none'}; checked-at=${v.checkedAt}`,
      '',
    );
    const content = contents.find((c) => c.slug === skill.slug) as Record<string, unknown> | undefined;
    if (content) {
      content.verification = verdictSurface(v);
      content.recipeUrl = recipeUrl;
    }
  }
  headerBlock.push('# <<< AMTECH skills verdicts');
  await writeHeadersBlock(headerBlock.join('\n'));

  // Generated React-free content module: the SkillDetail page and the prerenderer render from this.
  const contentMap = Object.fromEntries(contents.map((c) => [c.slug, c]));
  const module = [
    '// AUTO-GENERATED by scripts/skills/build-skills.ts. Do not edit by hand.',
    'export type GeneratedSkillFile = { path: string; role: string; title: string; summary: string; loadPolicy: string; runPolicy?: string; mediaType: string; size: number; sha256: string; sha3_512: string; isText: boolean; text?: string };',
    'export type GeneratedSkillFileRoute = { path: string; url: string; role: string; integrity: string };',
    'export type GeneratedSkillVerification = { verdict: string; trustTier: string | null; method: string | null; depth: string; authoritySequence: string | null; checkedAt: string };',
    'export type GeneratedSkillContent = { slug: string; useMd: string; agentMd: string; archiveSha256: string; archiveSha3_512: string; certificateId?: string; trustTier?: string; policyVersion?: string; conformanceEvidenceUrl?: string; reviewEvidenceUrl?: string; recipeUrl?: string; verification?: GeneratedSkillVerification; fileRoutes: GeneratedSkillFileRoute[]; files: GeneratedSkillFile[] };',
    `export const skillContent: Record<string, GeneratedSkillContent> = ${escJson(contentMap)};`,
    `export const skillCatalogRoot = ${JSON.stringify(catalogRoot)};`,
    `export const skillsCount = ${JSON.stringify(skillDefinitions.length)};`,
    'export function getSkillContent(slug: string): GeneratedSkillContent | undefined {',
    '  return skillContent[slug];',
    '}',
    '',
  ].join('\n');
  await writeText('src/lib/skills/generated/skill-content.ts', module);

  console.log(`skills:build wrote ${skillDefinitions.length} skill package(s) under public/skills/.`);
}

main().catch((error) => {
  console.error('skills:build failed:', error);
  process.exit(1);
});
