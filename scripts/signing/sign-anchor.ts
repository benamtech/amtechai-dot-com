/**
 * AMTECH registry-state broadcast (docs/skills/standard/11). The canonical, signed, timestamped message a
 * witness / external anchor consumes — built ON the existing AMTECH standards, useful to agents AND to us:
 *
 *   1. A self-describing **registry-state packet** (`amtech-registry-state/v1`, `anchor/state.json`): what
 *      AMTECH currently certifies (each skill's slug/version/trust tier/certificate), the catalog root, the
 *      signed RFC-6962 tree head, and the verify recipe. One artifact answers "what does AMTECH certify and
 *      how do I check it" — discoverable by agentic search.
 *   2. An **AMTECH Signed Artifact certificate** (`amtech-signed-artifact/v2`, `subjectType: 'registry-state'`,
 *      `subjectId: amtech-skills-tree-<size>-<rootPrefix>`) that BINDS the packet bytes (SHA-256/SHA3-512),
 *      is timestamped, and is Ed25519-signed by the domain key — verifying with the SAME machinery as every
 *      skill cert (`verifyCertificate`, `artifact:verify`). Optional PGP co-sign via `AMTECH_ANCHOR_PGP_KEY`.
 *
 * Runs AFTER sign-authority (needs sth.json + the head record). Idempotent: if the published cert already binds
 * the current state, it re-signs nothing. The cert+packet IS the broadcast message; recording broadcasts +
 * external anchor receipts is the separate receipts ledger (broadcast-anchor.ts) — the authority log is the
 * only append-only chain (no second "megahash").
 */
import { readFile, mkdir, writeFile, rm } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { resolve } from 'node:path';
import {
  certificateId,
  derivePublicKey,
  digest,
  loadPrivateKey,
  signCertificate,
  signingKeyDocument,
  SIGNING_KEY_URL,
  type ArtifactCertificate,
  type SigningKeyDocument,
} from './amtech-signing.ts';
import { SKILL_SITE_ORIGIN, SKILL_AUTHORITY_URL } from '../../src/lib/skills/registry.ts';

const execFileP = promisify(execFile);
const privatePath = resolve(process.env.AMTECH_SIGNING_PRIVATE_KEY_FILE ?? '.amtech/signing-private-key.pem');
const keyPath = resolve('src/lib/skills/certificates/amtech-signing-key.json');
const privateKey = loadPrivateKey(await readFile(privatePath, 'utf8'));
const existingKey = JSON.parse(await readFile(keyPath, 'utf8')) as SigningKeyDocument;
const derivedKey = signingKeyDocument(derivePublicKey(privateKey), existingKey.validFrom);
if (derivedKey.keyId !== existingKey.keyId || derivedKey.fingerprint.sha256 !== existingKey.fingerprint.sha256) {
  throw new Error('Private signing key does not match committed AMTECH public key metadata.');
}

const authorityDir = resolve('src/lib/skills/authority');
const sthBytes = await readFile(resolve(authorityDir, 'sth.json')).catch(() => null);
if (!sthBytes) {
  console.error('sign-anchor: no sth.json — run sign-authority first.');
  process.exit(1);
}
const sth = JSON.parse(sthBytes.toString('utf8')) as { treeSize?: string; rootHash?: string; latestSequence?: string; latestRecordHash?: string; timestamp?: string };

// Pull the certified-skill set + catalog root from the head authority record (its materialized state).
const headStem = String(sth.latestSequence ?? '0').padStart(4, '0');
const headState = (JSON.parse(await readFile(resolve(authorityDir, 'records', `${headStem}.json`), 'utf8')) as {
  state?: { catalogRoot?: string; skills?: { slug: string; version: string; certificateId: string; trustTier: string; status: string }[] };
}).state ?? {};
const certified = (headState.skills ?? []).map((s) => ({
  slug: s.slug,
  version: s.version,
  trustTier: s.trustTier,
  status: s.status,
  certificateId: s.certificateId,
  certificateUrl: `${SKILL_SITE_ORIGIN}/skills/${s.slug}/certificate.json`,
  skillUrl: `${SKILL_SITE_ORIGIN}/skills/${s.slug}`,
}));

const stateUrl = `${SKILL_SITE_ORIGIN}/.well-known/authority/anchor/state.json`;
const registryState = {
  schemaVersion: 'amtech-registry-state/v1',
  authority: 'AMTECH Skill Certificate Authority',
  authorityUrl: SKILL_AUTHORITY_URL,
  registryUrl: `${SKILL_SITE_ORIGIN}/registry`,
  issuedAt: sth.timestamp ?? new Date(0).toISOString(),
  treeHead: {
    algorithm: 'rfc6962-sha256',
    treeSize: sth.treeSize ?? '0',
    rootHash: sth.rootHash ?? '',
    latestSequence: sth.latestSequence ?? '0',
    latestRecordHash: sth.latestRecordHash ?? '',
    sthUrl: `${SKILL_SITE_ORIGIN}/.well-known/authority/sth.json`,
  },
  catalog: {
    catalogRoot: headState.catalogRoot ?? '',
    catalogUrl: `${SKILL_SITE_ORIGIN}/skills/catalog.json`,
    skillCount: String(certified.length),
  },
  certified,
  verify: {
    method: 'graph-replay',
    note: 'Recompute the Ed25519 certificates and the RFC-6962 Merkle root yourself — determinism is the security property, not this signature.',
    skillVerifier: `${SKILL_SITE_ORIGIN}/skills/<slug> → npm run skills:verify <url>`,
    artifactVerifier: 'npm run artifact:verify -- --artifact state.json --certificate certificate.json --signature certificate.sig --key amtech-signing-key.json',
  },
};
const stateBytes = Buffer.from(`${JSON.stringify(registryState, null, 2)}\n`, 'utf8');
const sha256 = digest('sha256', stateBytes);
const sha3_512 = digest('sha3-512', stateBytes);

const anchorDir = resolve(authorityDir, 'anchor');
const existing = await readFile(resolve(anchorDir, 'certificate.json'), 'utf8').catch(() => null);
if (existing && (JSON.parse(existing) as ArtifactCertificate).digests?.sha256 === sha256) {
  console.log(`Registry-state anchor unchanged — certificate already binds state ${sha256.slice(0, 16)}… (no re-sign).`);
  process.exit(0);
}

const subjectId = `amtech-skills-tree-${sth.treeSize ?? '0'}-${(sth.rootHash ?? '').slice(0, 12)}`;
const certificate: ArtifactCertificate = {
  schemaVersion: 'amtech-signed-artifact/v2',
  certificateId: certificateId('registry-state', subjectId, sha3_512),
  subjectType: 'registry-state',
  subjectId,
  owner: { name: 'AMTECH AI', url: SKILL_SITE_ORIGIN },
  canonicalUrl: stateUrl,
  version: sth.treeSize ?? '0',
  digests: { sha256, sha3_512 },
  issuedAt: sth.timestamp ?? new Date(0).toISOString(),
  issuer: existingKey.issuer,
  signingKeyId: existingKey.keyId,
  signingKeyUrl: SIGNING_KEY_URL,
};

await rm(anchorDir, { recursive: true, force: true });
await mkdir(anchorDir, { recursive: true });
await writeFile(resolve(anchorDir, 'state.json'), stateBytes, 'utf8');
await writeFile(resolve(anchorDir, 'certificate.json'), `${JSON.stringify(certificate, null, 2)}\n`, 'utf8');
await writeFile(resolve(anchorDir, 'certificate.sig'), `${signCertificate(certificate, privateKey)}\n`, 'utf8');

let pgp = 'skipped (no AMTECH_ANCHOR_PGP_KEY / gpg)';
const pgpKey = process.env.AMTECH_ANCHOR_PGP_KEY;
if (pgpKey) {
  try {
    await execFileP('gpg', ['--batch', '--yes', '--armor', '--local-user', pgpKey, '--detach-sign', '--output', resolve(anchorDir, 'certificate.asc'), resolve(anchorDir, 'certificate.json')]);
    pgp = `gpg-signed by ${pgpKey}`;
  } catch (e) {
    pgp = `gpg signing failed: ${e instanceof Error ? e.message : String(e)}`;
  }
}

console.log(`Signed registry-state anchor ${certificate.certificateId}`);
console.log(`  ${certified.length} certified skill(s), catalog root ${(headState.catalogRoot ?? '').slice(0, 16)}…, tree size ${sth.treeSize} root ${sth.rootHash?.slice(0, 16)}… (PGP: ${pgp}).`);
