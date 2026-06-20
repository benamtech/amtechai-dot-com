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

type Leaf = { slug: string; certificateSha256: string; trustTier: string };

const leaves: Leaf[] = [];
for (const skill of skillDefinitions) {
  const certBytes = await readFile(resolve(`src/lib/skills/certificates/${skill.slug}/certificate.json`)).catch(() => null);
  if (!certBytes) throw new Error(`sign-authority: missing certificate for ${skill.slug}; run sign-skills first.`);
  const cert = JSON.parse(certBytes.toString('utf8')) as { attestations?: { trustTier?: string } };
  leaves.push({ slug: skill.slug, certificateSha256: digest('sha256', certBytes), trustTier: cert.attestations?.trustTier ?? 'signed' });
}
leaves.sort((a, b) => (a.slug < b.slug ? -1 : a.slug > b.slug ? 1 : 0));

// Catalog root — the SAME preimage as build-skills.computeCatalogRoot + registry/validate.mjs.
const catalogRoot = digest('sha256', canonicalJson(leaves.map((l) => ({ slug: l.slug, cert: l.certificateSha256 }))));
// Deterministic release stamp = the latest skill update date (keeps the record byte-stable across builds).
const issuedAt = `${[...skillDefinitions].map((s) => s.updated).sort().at(-1)}T00:00:00.000Z`;

const record = {
  schemaVersion: 'amtech-authority-record/v1',
  sequence: '0',
  previousRecordHash: null,
  event: 'genesis',
  issuedAt,
  authorityUrl: SKILL_AUTHORITY_URL,
  catalogRoot,
  skills: leaves,
  signingKeyId: existingKey.keyId,
  signingKeyUrl: SIGNING_KEY_URL,
};

const dir = resolve('src/lib/skills/authority/records');
await mkdir(dir, { recursive: true });
await writeFile(resolve(dir, '0000.json'), `${JSON.stringify(record, null, 2)}\n`, 'utf8');
await writeFile(resolve(dir, '0000.sig'), `${signCanonical(record, privateKey)}\n`, 'utf8');
console.log(`Signed authority record seq 0 (genesis): catalogRoot ${catalogRoot.slice(0, 16)}…, ${leaves.length} skill(s).`);
