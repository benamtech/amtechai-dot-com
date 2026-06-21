/**
 * Fixtures for the in-browser graph-replay recompute (src/lib/skills/verification/recomputeWeb.ts) —
 * the client-side twin of verifySkill.ts. recomputeWeb is pure browser code: it reaches the published
 * surfaces with same-origin `fetch` and recomputes with WebCrypto. Here we back `fetch` with the real
 * bytes under `public/`, so the recompute runs against the genuine published artifacts (no mocks of the
 * crypto). The positive control proves the unmutated surfaces recompute to `verified`; each mutation
 * flips exactly one served byte/field and asserts the verdict the recompute must reach.
 *
 * Run: npm run skills:test  (node --test, native TS type-stripping — no test framework dependency).
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { recomputeVerdict } from '../../../src/lib/skills/verification/recomputeWeb.ts';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const publicDir = resolve(repoRoot, 'public');
const SLUG = 'okf-audit';

/**
 * Install a `fetch` that serves same-origin paths from `public/`. `overrides` maps a path (no leading
 * slash) to replacement bytes (or null to force a 404), so a test can mutate exactly one surface.
 */
function installFetch(overrides: Map<string, Uint8Array | null> = new Map()) {
  globalThis.fetch = (async (input: unknown) => {
    const url = typeof input === 'string' ? input : String((input as { url: string }).url);
    const rel = url.replace(/^https?:\/\/[^/]+/, '').replace(/^\//, '').split('?')[0];
    if (overrides.has(rel)) {
      const body = overrides.get(rel);
      return body == null ? new Response('not found', { status: 404 }) : new Response(body, { status: 200 });
    }
    try {
      return new Response(await readFile(resolve(publicDir, rel)), { status: 200 });
    } catch {
      return new Response('not found', { status: 404 });
    }
  }) as typeof fetch;
}

const read = (rel: string) => readFile(resolve(publicDir, rel));

test('positive control: the real published surfaces recompute to verified, every step passing', async () => {
  installFetch();
  const result = await recomputeVerdict(SLUG);
  assert.equal(result.verdict, 'verified', JSON.stringify(result.steps, null, 2));
  assert.ok(result.steps.length >= 5, 'all five recompute steps run');
  assert.ok(
    result.steps.every((s) => s.status === 'pass'),
    `every step passes: ${JSON.stringify(result.steps)}`,
  );
});

test('tampered file → sourcePackage + SRI mismatch → invalid', async () => {
  // Flip one byte of a published skill file; the manifest/sourcePackage no longer match.
  const manifest = JSON.parse(await read(`skills/${SLUG}/manifest.json`)) as { files: { path: string }[] };
  const victim = manifest.files[0].path;
  const original = await read(`skills/${SLUG}/files/${victim}`);
  const tampered = new Uint8Array(original);
  tampered[0] ^= 0xff;
  installFetch(new Map([[`skills/${SLUG}/files/${victim}`, tampered]]));
  const result = await recomputeVerdict(SLUG);
  assert.equal(result.verdict, 'invalid', JSON.stringify(result.steps, null, 2));
  assert.ok(
    result.steps.some((s) => s.status === 'fail' && /sourcePackage/i.test(s.label)),
    `sourcePackage step fails: ${JSON.stringify(result.steps)}`,
  );
});

test('forged certificate (signature no longer covers the canonical cert) → invalid', async () => {
  // Bump a signed field; the Ed25519 signature no longer verifies over the canonical certificate.
  const cert = JSON.parse(await read(`skills/${SLUG}/certificate.json`)) as Record<string, unknown>;
  cert.subjectId = 'amtech:skill:forged';
  installFetch(new Map([[`skills/${SLUG}/certificate.json`, new TextEncoder().encode(JSON.stringify(cert))]]));
  const result = await recomputeVerdict(SLUG);
  assert.equal(result.verdict, 'invalid', JSON.stringify(result.steps, null, 2));
  assert.ok(
    result.steps[0]?.status === 'fail' && /signature/i.test(result.steps[0].label),
    `signature step fails first: ${JSON.stringify(result.steps)}`,
  );
});

test('missing certificate → unverifiable (not a false "invalid")', async () => {
  installFetch(new Map([[`skills/${SLUG}/certificate.json`, null]]));
  const result = await recomputeVerdict(SLUG);
  assert.equal(result.verdict, 'unverifiable', JSON.stringify(result.steps, null, 2));
});
