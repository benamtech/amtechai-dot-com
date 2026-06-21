/**
 * Unit tests for the verification-method registry (docs/skills/standard/09 / G-X.3).
 * Each known method maps to its declared ceiling; reserved/horizon and unknown methods map to NO tier.
 *
 * Run: npm run skills:test (node --test, native TS type-stripping).
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  maxTierForMethod,
  depthForMethod,
  isReservedMethod,
  tierRank,
  TIER_ORDER,
} from '../../../src/lib/skills/verification/methodRegistry.ts';
import { KNOWN_TRUST_TIERS } from '../attestation-gates.ts';

test('each known method maps to its declared tier ceiling + depth', () => {
  assert.equal(maxTierForMethod('signature'), 'signed');
  assert.equal(depthForMethod('signature'), 'link-only');
  assert.equal(maxTierForMethod('static-contract'), 'structure-verified');
  assert.equal(maxTierForMethod('amtech-review'), 'amtech-reviewed');
  assert.equal(maxTierForMethod('graph-replay'), 'replay-verified');
  assert.equal(depthForMethod('graph-replay'), 'graph-replay');
});

test('reserved/horizon methods are declared but grant no runtime tier', () => {
  for (const method of ['live-model', 'zk-compute']) {
    assert.equal(maxTierForMethod(method), null, `${method} must map to no tier`);
    assert.equal(depthForMethod(method), null);
    assert.equal(isReservedMethod(method), true, `${method} must be flagged reserved`);
  }
});

test('an unknown method maps to no tier (caller raises METHOD_UNKNOWN) and is not "reserved"', () => {
  assert.equal(maxTierForMethod('totally-made-up'), null);
  assert.equal(depthForMethod('totally-made-up'), null);
  assert.equal(isReservedMethod('totally-made-up'), false);
});

test('a method never grants a tier above its ceiling: runtime ceilings are on the ladder', () => {
  for (const method of ['signature', 'static-contract', 'amtech-review', 'graph-replay']) {
    const tier = maxTierForMethod(method)!;
    assert.ok(tierRank(tier) >= 0, `${method} ceiling ${tier} must be on the tier ladder`);
  }
});

test('G-X.2: TIER_ORDER matches the attestation-gates ladder exactly', () => {
  assert.deepEqual([...TIER_ORDER], [...KNOWN_TRUST_TIERS]);
});
