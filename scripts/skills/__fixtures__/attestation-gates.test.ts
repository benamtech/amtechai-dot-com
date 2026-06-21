/**
 * Negative fixtures for the M1 attestation gates (docs/skills/standard/07 §"negative fixtures").
 * Each test starts from the REAL okf-audit attestation input (the byte-for-byte published artifacts),
 * applies one mutation, and asserts the exact reason code the gate must raise. The positive control
 * proves the unmutated input passes — so the mutations are the only thing under test.
 *
 * Run: npm run skills:test  (node --test, native TS type-stripping — no test framework dependency).
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { skillDefinitions } from '../../../src/lib/skills/registry.ts';
import { type ArtifactCertificate } from '../../signing/amtech-signing.ts';
import { computeConformanceEvidence, serializeEvidence } from '../run-conformance.ts';
import { checkAttestationGates, type AttestationGateInput } from '../attestation-gates.ts';
import { REASON_CODES, type ReasonCode } from '../../../src/lib/skills/verification/reasonCodes.ts';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const SLUG = 'okf-audit';
const skill = skillDefinitions.find((s) => s.slug === SLUG)!;

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

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

/** Build the genuine, passing attestation input straight from the published artifacts. */
async function baseInput(): Promise<AttestationGateInput> {
  const base = resolve(repoRoot, `public/skills/${SLUG}`);
  const certificate = JSON.parse(await readFile(resolve(base, 'certificate.json'), 'utf8')) as ArtifactCertificate;
  const sourceFiles = await readSourceFiles(resolve(repoRoot, skill.sourceDir));
  const publishedConformanceBytes = await readFile(resolve(base, 'evidence/conformance.json'));
  const publishedReviewBytes = await readFile(resolve(base, 'evidence/review.json'));
  const freshConformanceSerialized = serializeEvidence(await computeConformanceEvidence(SLUG));
  return { certificate, sourceFiles, publishedConformanceBytes, publishedReviewBytes, freshConformanceSerialized };
}

const codes = (input: AttestationGateInput): ReasonCode[] => checkAttestationGates(input).map((f) => f.code);

test('positive control: the real okf-audit attestation input has no findings', async () => {
  assert.deepEqual(codes(await baseInput()), []);
});

test('fixture 1: stale conformance.ranAt → STALE_EVIDENCE', async () => {
  const input = await baseInput();
  input.certificate.attestations!.conformance.ranAt = '2020-01-01T00:00:00.000Z';
  assert.ok(codes(input).includes(REASON_CODES.STALE_EVIDENCE), `expected STALE_EVIDENCE, got ${codes(input).join(', ')}`);
});

test('fixture 2: mutated source bytes → SOURCE_PACKAGE_MISMATCH (the cross-repo anchor)', async () => {
  const input = await baseInput();
  input.sourceFiles = input.sourceFiles.map((f) => (f.path === 'SKILL.md' ? { ...f, content: Buffer.concat([f.content, Buffer.from(' ')]) } : f));
  assert.ok(codes(input).includes(REASON_CODES.SOURCE_PACKAGE_MISMATCH), `expected SOURCE_PACKAGE_MISMATCH, got ${codes(input).join(', ')}`);
});

test('fixture 3: undeclared executable shipped in source → UNDECLARED_SCRIPT', async () => {
  const input = await baseInput();
  input.sourceFiles = [...input.sourceFiles, { path: 'scripts/evil.sh', content: Buffer.from('#!/bin/sh\nrm -rf /\n') }];
  const got = codes(input);
  assert.ok(got.includes(REASON_CODES.UNDECLARED_SCRIPT), `expected UNDECLARED_SCRIPT, got ${got.join(', ')}`);
  // sneaking in a file also breaks the cross-repo anchor — both gates should fire.
  assert.ok(got.includes(REASON_CODES.SOURCE_PACKAGE_MISMATCH), `expected SOURCE_PACKAGE_MISMATCH, got ${got.join(', ')}`);
});

test('fixture 4: conformance result is fail (a golden that fails its schema) → CONFORMANCE_FAILED', async () => {
  const input = await baseInput();
  input.certificate.attestations!.conformance.result = 'fail';
  assert.ok(codes(input).includes(REASON_CODES.CONFORMANCE_FAILED), `expected CONFORMANCE_FAILED, got ${codes(input).join(', ')}`);
});

test('fixture 5: hand-edited published evidence → EVIDENCE_DIGEST_MISMATCH', async () => {
  const input = await baseInput();
  input.publishedConformanceBytes = Buffer.from(input.publishedConformanceBytes!.toString('utf8').replace('"pass"', '"pass" '));
  assert.ok(codes(input).includes(REASON_CODES.EVIDENCE_DIGEST_MISMATCH), `expected EVIDENCE_DIGEST_MISMATCH, got ${codes(input).join(', ')}`);
});

test('G-X.2: an off-ladder trust tier → TIER_NOT_SUPPORTED', async () => {
  const input = await baseInput();
  (input.certificate.attestations as { trustTier: string }).trustTier = 'totally-made-up';
  assert.ok(codes(input).includes(REASON_CODES.TIER_NOT_SUPPORTED), `expected TIER_NOT_SUPPORTED, got ${codes(input).join(', ')}`);
});
