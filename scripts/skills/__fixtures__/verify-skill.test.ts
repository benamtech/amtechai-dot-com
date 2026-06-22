/**
 * Link-first verifier tests (docs/skills/standard/04 + 09 graph-replay recipe). A local ResourceLoader
 * reads the real published surfaces under public/skills/; each negative case overrides exactly one
 * resource with a mutation and asserts the exact reason code. The positive control proves the unmutated
 * published skill verifies to its attested tier.
 *
 * Run: npm run skills:test (node --test).
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { generateKeyPairSync } from 'node:crypto';
import { verifySkill, type ResourceLoader } from '../../../src/lib/skills/verification/verifySkill.ts';
import { REASON_CODES } from '../../../src/lib/skills/verification/reasonCodes.ts';
import { derivePublicKey, loadPrivateKey, signCanonical, signingKeyDocument, verifyCanonical, verifyCertificate, type ArtifactCertificate, type SigningKeyDocument } from '../../signing/amtech-signing.ts';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const SLUG = 'okf-audit';
const read = (abs: string) => readFile(abs).catch(() => null);

/** Loader over the real public/ surfaces; `overrides` (keyed by logical resource) inject mutations. */
function makeLoader(overrides: Record<string, Buffer | null> = {}): ResourceLoader {
  const base = resolve(repoRoot, 'public/skills', SLUG);
  return {
    skillFile: async (rel) => (rel in overrides ? overrides[rel] : read(resolve(base, rel))),
    signingKey: async () => ('signingKey' in overrides ? overrides.signingKey : read(resolve(repoRoot, 'public/.well-known/amtech-signing-key.json'))),
    signingKeyById: async (keyId) => ('signingKeyById' in overrides ? overrides.signingKeyById : read(resolve(repoRoot, 'public/.well-known/keys', `${keyId.replace(/[:/]/g, '_')}.json`))),
    catalog: async () => ('catalog' in overrides ? overrides.catalog : read(resolve(repoRoot, 'public/skills/catalog.json'))),
    siblingCertificate: async (slug) => read(resolve(repoRoot, 'public/skills', slug, 'certificate.json')),
    authority: async () => ('authority' in overrides ? overrides.authority : read(resolve(repoRoot, 'public/.well-known/skill-authority.json'))),
    authorityLog: async () => ('authorityLog' in overrides ? overrides.authorityLog : read(resolve(repoRoot, 'public/.well-known/authority/log.json'))),
    authorityRecordStem: async (stem) => (`record:${stem}` in overrides ? overrides[`record:${stem}`] : read(resolve(repoRoot, 'public/.well-known/authority/records', `${stem}.json`))),
    authorityRecordStemSig: async (stem) => read(resolve(repoRoot, 'public/.well-known/authority/records', `${stem}.sig`)),
    authoritySth: async () => ('authoritySth' in overrides ? overrides.authoritySth : read(resolve(repoRoot, 'public/.well-known/authority/sth.json'))),
    authorityInclusionProof: async (treeSize, index) => read(resolve(repoRoot, 'public/.well-known/authority/proofs', treeSize, 'inclusion', `${index}.json`)),
    authorityConsistencyProof: async (treeSize, fromSize) => read(resolve(repoRoot, 'public/.well-known/authority/proofs', treeSize, `consistency-from-${fromSize}.json`)),
  };
}

test('positive control: the published okf-audit verifies to its attested tier', async () => {
  const verdict = await verifySkill(makeLoader());
  assert.equal(verdict.verdict, 'verified', JSON.stringify(verdict));
  assert.equal(verdict.trustTier, 'amtech-reviewed');
  assert.equal(verdict.method, 'amtech-review');
  assert.equal(verdict.depth, 'graph-replay');
  assert.deepEqual(verdict.reasonCodes, [REASON_CODES.OK]);
  assert.equal(verdict.evidence.catalogRoot, 'pass');
  assert.equal(verdict.evidence.authorityRecord, 'pass');
  assert.ok(verdict.authoritySequence !== null && /^\d+$/.test(verdict.authoritySequence), `verdict anchored to a chain sequence, got ${verdict.authoritySequence}`);
});

test('tampered authority record in the chain → AUTHORITY_MISMATCH', async () => {
  const record = JSON.parse((await read(resolve(repoRoot, 'public/.well-known/authority/records/0000.json')))!.toString('utf8'));
  record.state.catalogRoot = '0'.repeat(64); // breaks the log-entry hash + the latest pointer + the signature
  const verdict = await verifySkill(makeLoader({ 'record:0000': Buffer.from(JSON.stringify(record)) }));
  assert.equal(verdict.verdict, 'invalid');
  assert.ok(verdict.reasonCodes.includes(REASON_CODES.AUTHORITY_MISMATCH), verdict.reasonCodes.join(', '));
});

test('tampered certificate → INVALID_SIGNATURE', async () => {
  const real = JSON.parse((await read(resolve(repoRoot, 'public/skills', SLUG, 'certificate.json')))!.toString('utf8'));
  real.version = '9.9.9'; // breaks the Ed25519 signature over the canonical certificate
  const verdict = await verifySkill(makeLoader({ 'certificate.json': Buffer.from(JSON.stringify(real)) }));
  assert.equal(verdict.verdict, 'invalid');
  assert.ok(verdict.reasonCodes.includes(REASON_CODES.INVALID_SIGNATURE), verdict.reasonCodes.join(', '));
});

test('mutated published file → MANIFEST_DIGEST_MISMATCH (+ SOURCE_PACKAGE_MISMATCH)', async () => {
  const manifest = JSON.parse((await read(resolve(repoRoot, 'public/skills', SLUG, 'manifest.json')))!.toString('utf8'));
  const target = manifest.files[0].path as string;
  const verdict = await verifySkill(makeLoader({ [`files/${target}`]: Buffer.from('tampered bytes that do not match the signed manifest') }));
  assert.equal(verdict.verdict, 'invalid');
  assert.ok(verdict.reasonCodes.includes(REASON_CODES.MANIFEST_DIGEST_MISMATCH), verdict.reasonCodes.join(', '));
  assert.ok(verdict.reasonCodes.includes(REASON_CODES.SOURCE_PACKAGE_MISMATCH), verdict.reasonCodes.join(', '));
});

test('mutated catalog root → CATALOG_ROOT_MISMATCH', async () => {
  const catalog = JSON.parse((await read(resolve(repoRoot, 'public/skills/catalog.json')))!.toString('utf8'));
  catalog.catalogRoot = '0'.repeat(64);
  const verdict = await verifySkill(makeLoader({ catalog: Buffer.from(JSON.stringify(catalog)) }));
  assert.equal(verdict.verdict, 'invalid');
  assert.ok(verdict.reasonCodes.includes(REASON_CODES.CATALOG_ROOT_MISMATCH), verdict.reasonCodes.join(', '));
});

test('revoked skill in the authority → revoked (REVOKED, not invalid)', async () => {
  const authority = JSON.parse((await read(resolve(repoRoot, 'public/.well-known/skill-authority.json')))!.toString('utf8'));
  authority.skills.find((s: { slug: string }) => s.slug === SLUG).status = 'revoked';
  const verdict = await verifySkill(makeLoader({ authority: Buffer.from(JSON.stringify(authority)) }));
  assert.equal(verdict.verdict, 'revoked');
  assert.ok(verdict.reasonCodes.includes(REASON_CODES.REVOKED), verdict.reasonCodes.join(', '));
});

test('revoked signing key → revoked (KEY_NOT_ACTIVE)', async () => {
  const key = JSON.parse((await read(resolve(repoRoot, 'public/.well-known/amtech-signing-key.json')))!.toString('utf8'));
  key.status = 'revoked';
  const verdict = await verifySkill(makeLoader({ signingKeyById: Buffer.from(JSON.stringify(key)) }));
  assert.equal(verdict.verdict, 'revoked');
  assert.ok(verdict.reasonCodes.includes(REASON_CODES.KEY_NOT_ACTIVE), verdict.reasonCodes.join(', '));
});

test('RETIRED signing key still verifies its historical certs (active-at-issuance)', async () => {
  const key = JSON.parse((await read(resolve(repoRoot, 'public/.well-known/amtech-signing-key.json')))!.toString('utf8'));
  key.status = 'retired';
  const verdict = await verifySkill(makeLoader({ signingKeyById: Buffer.from(JSON.stringify(key)) }));
  assert.equal(verdict.verdict, 'verified', JSON.stringify(verdict.reasonCodes));
  assert.equal(verdict.trustTier, 'amtech-reviewed');
});

test('unreachable certificate → unverifiable / UNREACHABLE', async () => {
  const verdict = await verifySkill(makeLoader({ 'certificate.json': null }));
  assert.equal(verdict.verdict, 'unverifiable');
  assert.ok(verdict.reasonCodes.includes(REASON_CODES.UNREACHABLE));
});

test('link-only depth verifies the signature without recomputing the graph', async () => {
  const verdict = await verifySkill(makeLoader(), { depth: 'link-only' });
  assert.equal(verdict.verdict, 'verified');
  assert.equal(verdict.depth, 'link-only');
  assert.equal(verdict.trustTier, 'amtech-reviewed');
});

// ---- Transparency log (Option B — docs/skills/standard/03 §Merkle): STH inclusion + policy + pinning ----

test('signed tree head: the head record inclusion proof verifies (authoritySth pass)', async () => {
  const verdict = await verifySkill(makeLoader());
  assert.equal(verdict.verdict, 'verified', JSON.stringify(verdict.reasonCodes));
  assert.equal(verdict.evidence.authoritySth, 'pass');
});

test('forged STH signature → STH_SIGNATURE_INVALID', async () => {
  const sth = JSON.parse((await read(resolve(repoRoot, 'public/.well-known/authority/sth.json')))!.toString('utf8'));
  // Flip the FIRST base64 char — its bits always map to real signature bytes, so the forgery is never a no-op
  // (flipping the trailing char can land in Ed25519's "==" padding bits and decode unchanged).
  sth.signatures[0].signature = sth.signatures[0].signature.replace(/^./, (c: string) => (c === 'A' ? 'B' : 'A'));
  const verdict = await verifySkill(makeLoader({ authoritySth: Buffer.from(JSON.stringify(sth)) }));
  assert.equal(verdict.verdict, 'invalid');
  assert.ok(verdict.reasonCodes.includes(REASON_CODES.STH_SIGNATURE_INVALID), verdict.reasonCodes.join(', '));
});

test('tampered STH rootHash → INCLUSION_PROOF_INVALID (signature also breaks, both fail closed)', async () => {
  const sth = JSON.parse((await read(resolve(repoRoot, 'public/.well-known/authority/sth.json')))!.toString('utf8'));
  sth.rootHash = '0'.repeat(64);
  const verdict = await verifySkill(makeLoader({ authoritySth: Buffer.from(JSON.stringify(sth)) }));
  assert.equal(verdict.verdict, 'invalid');
  // The forged root no longer matches the signed core, so the policy gate fires first; either code proves fail-closed.
  assert.ok(
    verdict.reasonCodes.includes(REASON_CODES.STH_SIGNATURE_INVALID) || verdict.reasonCodes.includes(REASON_CODES.INCLUSION_PROOF_INVALID),
    verdict.reasonCodes.join(', '),
  );
});

test('STH pinning: pinning the current STH proves trivial consistency (pass)', async () => {
  const sth = JSON.parse((await read(resolve(repoRoot, 'public/.well-known/authority/sth.json')))!.toString('utf8'));
  const verdict = await verifySkill(makeLoader(), { pinnedSth: { treeSize: sth.treeSize, rootHash: sth.rootHash } });
  assert.equal(verdict.verdict, 'verified');
  assert.equal(verdict.evidence.authorityConsistency, 'pass');
});

test('STH pinning rollback: a bogus pinned root fails closed → CONSISTENCY_PROOF_INVALID', async () => {
  const verdict = await verifySkill(makeLoader(), { pinnedSth: { treeSize: '3', rootHash: 'deadbeef'.repeat(8) } });
  assert.equal(verdict.verdict, 'invalid');
  assert.ok(verdict.reasonCodes.includes(REASON_CODES.CONSISTENCY_PROOF_INVALID), verdict.reasonCodes.join(', '));
});

test('trust policy: requiring an unmet witness signature fails closed → STH_SIGNATURE_INVALID', async () => {
  const verdict = await verifySkill(makeLoader(), { trustPolicy: { minWitnessSigs: 1 } });
  assert.equal(verdict.verdict, 'invalid');
  assert.ok(verdict.reasonCodes.includes(REASON_CODES.STH_SIGNATURE_INVALID), verdict.reasonCodes.join(', '));
});

test('federation: an independent witness co-signature (key resolved by URL) satisfies minWitnessSigs', async () => {
  // Stand up an independent witness key (could live on any domain) and have it co-sign the STH's signed core.
  const sth = JSON.parse((await read(resolve(repoRoot, 'public/.well-known/authority/sth.json')))!.toString('utf8'));
  const priv = loadPrivateKey(generateKeyPairSync('ed25519').privateKey.export({ type: 'pkcs8', format: 'pem' }).toString());
  const witnessKey = signingKeyDocument(derivePublicKey(priv), new Date().toISOString());
  const core = { ...sth };
  delete core.signatures;
  delete core.anchors;
  const witnessUrl = 'https://witness.example/keys/w1.json';
  sth.signatures.push({ role: 'witness', signingKeyId: witnessKey.keyId, signingKeyUrl: witnessUrl, signature: signCanonical(core, priv) });
  const base = makeLoader({ authoritySth: Buffer.from(JSON.stringify(sth)) });
  const loader: ResourceLoader = { ...base, keyByUrl: async (url) => (url === witnessUrl ? Buffer.from(JSON.stringify(witnessKey)) : null) };
  const verdict = await verifySkill(loader, { trustPolicy: { minWitnessSigs: 1 } });
  assert.equal(verdict.verdict, 'verified', verdict.reasonCodes.join(', '));
  assert.equal(verdict.evidence.authoritySth, 'pass');
});

test('broadcast anchor: the AMTECH registry-state certificate verifies + binds state.json whose tree head is the STH root', async () => {
  const [certRaw, sigRaw, keyRaw, stateBytes, sthRaw] = await Promise.all([
    read(resolve(repoRoot, 'public/.well-known/authority/anchor/certificate.json')),
    read(resolve(repoRoot, 'public/.well-known/authority/anchor/certificate.sig')),
    read(resolve(repoRoot, 'public/.well-known/amtech-signing-key.json')),
    read(resolve(repoRoot, 'public/.well-known/authority/anchor/state.json')),
    read(resolve(repoRoot, 'public/.well-known/authority/sth.json')),
  ]);
  assert.ok(certRaw && sigRaw && keyRaw && stateBytes && sthRaw, 'anchor artifacts present');
  const cert = JSON.parse(certRaw!.toString('utf8')) as ArtifactCertificate;
  assert.equal(cert.subjectType, 'registry-state');
  assert.ok(cert.subjectId.startsWith('amtech-skills-tree-'), `useful subjectId, got ${cert.subjectId}`);
  assert.ok(verifyCertificate(cert, sigRaw!.toString('utf8'), JSON.parse(keyRaw!.toString('utf8')) as SigningKeyDocument), 'anchor cert Ed25519 verifies');
  const { createHash } = await import('node:crypto');
  assert.equal(createHash('sha256').update(stateBytes!).digest('hex'), cert.digests.sha256, 'anchor binds the served state.json packet');
  const state = JSON.parse(stateBytes!.toString('utf8')) as { treeHead?: { rootHash?: string }; certified?: unknown[] };
  const sth = JSON.parse(sthRaw!.toString('utf8')) as { rootHash?: string };
  assert.equal(state.treeHead?.rootHash, sth.rootHash, 'packet tree head == published STH root');
  assert.ok(Array.isArray(state.certified) && state.certified.length > 0, 'packet lists certified skills (useful to agents)');
});

test('broadcast receipts ledger: signed, append-only, latest entry tracks the current root', async () => {
  const [ledgerRaw, keyRaw, sthRaw] = await Promise.all([
    read(resolve(repoRoot, 'public/.well-known/authority/receipts.json')),
    read(resolve(repoRoot, 'public/.well-known/amtech-signing-key.json')),
    read(resolve(repoRoot, 'public/.well-known/authority/sth.json')),
  ]);
  if (!ledgerRaw) return; // ledger only exists after a broadcast
  const ledger = JSON.parse(ledgerRaw.toString('utf8')) as { entries: { rootHash: string; receipts: unknown[] }[]; signatures?: { role?: string; signature: string }[] };
  const sth = JSON.parse(sthRaw!.toString('utf8')) as { rootHash?: string };
  assert.ok(ledger.entries.length >= 1, 'at least one broadcast entry');
  assert.equal(ledger.entries.at(-1)!.rootHash, sth.rootHash, 'latest broadcast tracks the current STH root');
  const { signatures, ...core } = ledger as Record<string, unknown>;
  const sig = (signatures as { role?: string; signature: string }[]).find((s) => s.role === 'authority')!;
  assert.ok(verifyCanonical(core, sig.signature, JSON.parse(keyRaw!.toString('utf8')) as SigningKeyDocument), 'ledger Ed25519 signature verifies');
});
