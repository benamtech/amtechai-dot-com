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
import { verifySkill, type ResourceLoader } from '../../../src/lib/skills/verification/verifySkill.ts';
import { REASON_CODES } from '../../../src/lib/skills/verification/reasonCodes.ts';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const SLUG = 'okf-audit';
const read = (abs: string) => readFile(abs).catch(() => null);

/** Loader over the real public/ surfaces; `overrides` (keyed by logical resource) inject mutations. */
function makeLoader(overrides: Record<string, Buffer | null> = {}): ResourceLoader {
  const base = resolve(repoRoot, 'public/skills', SLUG);
  return {
    skillFile: async (rel) => (rel in overrides ? overrides[rel] : read(resolve(base, rel))),
    signingKey: async () => ('signingKey' in overrides ? overrides.signingKey : read(resolve(repoRoot, 'public/.well-known/amtech-signing-key.json'))),
    catalog: async () => ('catalog' in overrides ? overrides.catalog : read(resolve(repoRoot, 'public/skills/catalog.json'))),
    siblingCertificate: async (slug) => read(resolve(repoRoot, 'public/skills', slug, 'certificate.json')),
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
