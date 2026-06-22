/**
 * M1 — authoring-discipline conformance gates (docs/skills/standard/10 + the effectiveness research
 * wiki/research/2026-06-22-skill-effectiveness-and-verification-enforced-quality.md). These encode the wisdom
 * that ties a skill to measured uplift — description/trigger quality, conciseness, progressive-disclosure
 * structure, evidence-first contract, freshness — as DETERMINISTIC, recomputable checks (so the evidence stays
 * byte-stable and validate-skills can re-run it).
 *
 * Pure-function tests with mutated inputs (mirrors attestation-gates.test.ts): a known-good input passes every
 * check; each mutation fails exactly the check it targets. Plus an integration assert that all 4 live skills pass.
 *
 * Run: npm run skills:test  (node --test).
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { authoringDisciplineChecks, computeConformanceEvidence, type AuthoringInput } from '../run-conformance.ts';
import { skillDefinitions } from '../../../src/lib/skills/registry.ts';

/** A skill that satisfies every authoring-discipline gate. */
function goodInput(): AuthoringInput {
  return {
    routingDescription:
      'Use when creating, drafting, or pricing a job estimate or quote. Builds line items, computes totals, and returns a clean structured estimate from a described job and the rates you provide.',
    // Source of truth: the registry (catalog) description IS the frontmatter (routing) description.
    catalogDescription:
      'Use when creating, drafting, or pricing a job estimate or quote. Builds line items, computes totals, and returns a clean structured estimate from a described job and the rates you provide.',
    skillMdBody: '# Estimate\n\n## Workflow\n\nBuild line items, compute totals, list assumptions.\n',
    referenceFiles: [{ path: 'references/estimating-discipline.md', content: '# Estimating discipline\n\nHandle missing rates.\n' }],
    outputContract: ['Customer', 'Job', 'Line Items', 'Totals', 'Assumptions'],
    lastReviewed: '2026-06-20',
    ranAt: '2026-06-20T00:00:00.000Z',
  };
}

const names = (checks: { name: string; result: string }[]) => new Set(checks.filter((c) => c.result === 'fail').map((c) => c.name));

test('good authoring input passes every check', () => {
  const checks = authoringDisciplineChecks(goodInput());
  const failed = checks.filter((c) => c.result === 'fail');
  assert.equal(failed.length, 0, `unexpected failures: ${failed.map((c) => `${c.name}(${c.detail})`).join(', ')}`);
  assert.ok(checks.length >= 9, 'expected the full authoring-discipline check set');
});

test('first-person routing description fails third-person check', () => {
  const input = { ...goodInput(), routingDescription: 'I can help you write a job estimate when you need one quickly and cleanly.' };
  assert.ok(names(authoringDisciplineChecks(input)).has('authoring:routing-desc-third-person'));
});

test('routing description with no trigger cue fails the trigger check', () => {
  const input = { ...goodInput(), routingDescription: 'A structured job estimate is produced with line items, totals, and assumptions for review.' };
  assert.ok(names(authoringDisciplineChecks(input)).has('authoring:routing-desc-trigger'));
});

test('too-short routing description fails length', () => {
  const input = { ...goodInput(), routingDescription: 'Use when estimating.' };
  assert.ok(names(authoringDisciplineChecks(input)).has('authoring:routing-desc-length'));
});

test('first-person catalog description fails third-person check', () => {
  const input = { ...goodInput(), catalogDescription: 'You can use this to build a job estimate from a described job and the rates you provide quickly.' };
  assert.ok(names(authoringDisciplineChecks(input)).has('authoring:catalog-desc-third-person'));
});

test('frontmatter description not matching the registry fails the source-of-truth check', () => {
  const input = { ...goodInput(), catalogDescription: 'Use when doing something entirely different from the routing description, with no shared wording at all.' };
  assert.ok(names(authoringDisciplineChecks(input)).has('authoring:desc-matches-registry'));
});

test('SKILL.md body over 500 lines fails the conciseness check', () => {
  const input = { ...goodInput(), skillMdBody: Array.from({ length: 501 }, (_, i) => `line ${i}`).join('\n') };
  assert.ok(names(authoringDisciplineChecks(input)).has('authoring:body-under-500'));
});

test('a reference file with a nested local link fails refs-one-deep', () => {
  const input = {
    ...goodInput(),
    referenceFiles: [{ path: 'references/a.md', content: 'See [more](./deeper.md) for details.\n' }],
  };
  assert.ok(names(authoringDisciplineChecks(input)).has('authoring:refs-one-deep'));
});

test('a long reference file without a TOC fails refs-toc', () => {
  const long = '# Title\n\n' + Array.from({ length: 120 }, (_, i) => `paragraph ${i}`).join('\n');
  const input = { ...goodInput(), referenceFiles: [{ path: 'references/long.md', content: long }] };
  assert.ok(names(authoringDisciplineChecks(input)).has('authoring:refs-toc'));
});

test('a long reference file WITH a TOC passes refs-toc', () => {
  const long = '# Title\n\n## Contents\n- a\n- b\n\n' + Array.from({ length: 120 }, (_, i) => `paragraph ${i}`).join('\n');
  const input = { ...goodInput(), referenceFiles: [{ path: 'references/long.md', content: long }] };
  assert.ok(!names(authoringDisciplineChecks(input)).has('authoring:refs-toc'));
});

test('an inline backtick span containing "!" fails no-shell-eval-backticks (SKILL.md body)', () => {
  const input = { ...goodInput(), skillMdBody: '# Estimate\n\nRun `rm -rf !$` to clean up.\n' };
  assert.ok(names(authoringDisciplineChecks(input)).has('authoring:no-shell-eval-backticks'));
});

test('a backtick span with "!" in a reference file fails no-shell-eval-backticks', () => {
  const input = { ...goodInput(), referenceFiles: [{ path: 'references/a.md', content: 'Use `echo hello!` here.\n' }] };
  assert.ok(names(authoringDisciplineChecks(input)).has('authoring:no-shell-eval-backticks'));
});

test('a fenced code block containing "!" does NOT trip no-shell-eval-backticks', () => {
  const input = { ...goodInput(), skillMdBody: '# Estimate\n\n```bash\necho "done!"\n```\n' };
  assert.ok(!names(authoringDisciplineChecks(input)).has('authoring:no-shell-eval-backticks'));
});

test('thin output contract (<3) fails the evidence-first check', () => {
  const input = { ...goodInput(), outputContract: ['Result'] };
  assert.ok(names(authoringDisciplineChecks(input)).has('authoring:output-contract'));
});

test('missing lastReviewed fails the freshness check', () => {
  const input = { ...goodInput(), lastReviewed: undefined };
  assert.ok(names(authoringDisciplineChecks(input)).has('authoring:last-reviewed'));
});

test('stale lastReviewed (older than the window) fails freshness', () => {
  const input = { ...goodInput(), lastReviewed: '2023-01-01', ranAt: '2026-06-20T00:00:00.000Z' };
  assert.ok(names(authoringDisciplineChecks(input)).has('authoring:last-reviewed'));
});

// Integration: every live skill passes the authoring-discipline gates (the gate catches bad authoring, not good).
for (const skill of skillDefinitions) {
  test(`${skill.slug}: passes all authoring-discipline checks`, async () => {
    const evidence = await computeConformanceEvidence(skill.slug);
    const failed = evidence.checks.filter((c) => c.result === 'fail' && c.name.startsWith('authoring:'));
    assert.equal(failed.length, 0, `authoring failures: ${failed.map((c) => `${c.name}(${c.detail})`).join(', ')}`);
  });
}
