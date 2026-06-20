/**
 * AMTECH authority-record signer (M4 groundwork — docs/skills/standard/03 + 07 G-M4).
 *
 * Emits the GENESIS `amtech-authority-record/v1` record: a signed snapshot that commits to the exact
 * skill SET at this release — the catalog root plus each skill's certificate digest and tier. This is the
 * head of the (future) immutable, hash-chained authority history; `previousRecordHash` is null and
 * `event` is `genesis`. Multi-record chaining + key-rotation/revocation events are M4 proper.
 *
 * Mirrors sign-skills.ts: needs the release private key, re-derives + matches the committed public key,
 * writes the signed record to src/lib/skills/authority/ (build-skills.ts publishes it). Runs AFTER
 * sign-skills.ts so the committed certificates exist. The catalog-root preimage is IDENTICAL to
 * build-skills.computeCatalogRoot and registry/validate.mjs (one value across all three).
 */
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import {
  canonicalJson,
  derivePublicKey,
  digest,
  loadPrivateKey,
  signCanonical,
  signingKeyDocument,
  SIGNING_KEY_URL,
  type SigningKeyDocument,
} from './amtech-signing.ts';
import { skillDefinitions, SKILL_AUTHORITY_URL } from '../../src/lib/skills/registry.ts';

const privatePath = resolve(process.env.AMTECH_SIGNING_PRIVATE_KEY_FILE ?? '.amtech/signing-private-key.pem');
const keyPath = resolve('src/lib/skills/certificates/amtech-signing-key.json');
const privateKey = loadPrivateKey(await readFile(privatePath, 'utf8'));
const existingKey = JSON.parse(await readFile(keyPath, 'utf8')) as SigningKeyDocument;
const derivedKey = signingKeyDocument(derivePublicKey(privateKey), existingKey.validFrom);
if (derivedKey.keyId !== existingKey.keyId || derivedKey.fingerprint.sha256 !== existingKey.fingerprint.sha256) {
  throw new Error('Private signing key does not match committed AMTECH public key metadata.');
}

type SkillState = { slug: string; version: string; certificateId: string; certificateSha256: string; trustTier: string };

const skillState: SkillState[] = [];
for (const skill of skillDefinitions) {
  const certBytes = await readFile(resolve(`src/lib/skills/certificates/${skill.slug}/certificate.json`)).catch(() => null);
  if (!certBytes) throw new Error(`sign-authority: missing certificate for ${skill.slug}; run sign-skills first.`);
  const cert = JSON.parse(certBytes.toString('utf8')) as { certificateId?: string; version?: string; attestations?: { trustTier?: string } };
  skillState.push({
    slug: skill.slug,
    version: cert.version ?? skill.version,
    certificateId: cert.certificateId ?? '',
    certificateSha256: digest('sha256', certBytes),
    trustTier: cert.attestations?.trustTier ?? 'signed',
  });
}
skillState.sort((a, b) => (a.slug < b.slug ? -1 : a.slug > b.slug ? 1 : 0));

// Catalog root — the SAME preimage as build-skills.computeCatalogRoot + registry/validate.mjs.
const catalogRoot = digest('sha256', canonicalJson(skillState.map((s) => ({ slug: s.slug, cert: s.certificateSha256 }))));
// Deterministic release stamp = the latest skill update date (keeps the record byte-stable across builds).
const issuedAt = `${[...skillDefinitions].map((s) => s.updated).sort().at(-1)}T00:00:00.000Z`;

// Genesis record (docs/skills/standard/03): events[] of what changed + the full materialized `state`.
const record = {
  schemaVersion: 'amtech-authority-record/v1',
  sequence: '0',
  previousRecordHash: null,
  issuedAt,
  authorityUrl: SKILL_AUTHORITY_URL,
  events: [
    { type: 'genesis' },
    ...skillState.map((s) => ({ type: 'skill-publish', slug: s.slug, version: s.version, certificateId: s.certificateId, certificateSha256: s.certificateSha256, trustTier: s.trustTier })),
  ],
  state: {
    catalogRoot,
    skills: skillState,
    keys: [{ keyId: existingKey.keyId, status: existingKey.status, validFrom: existingKey.validFrom }],
  },
  signingKeyId: existingKey.keyId,
  signingKeyUrl: SIGNING_KEY_URL,
};

const dir = resolve('src/lib/skills/authority/records');
await mkdir(dir, { recursive: true });
await writeFile(resolve(dir, '0000.json'), `${JSON.stringify(record, null, 2)}\n`, 'utf8');
await writeFile(resolve(dir, '0000.sig'), `${signCanonical(record, privateKey)}\n`, 'utf8');
console.log(`Signed authority record seq 0 (genesis): catalogRoot ${catalogRoot.slice(0, 16)}…, ${skillState.length} skill(s).`);
