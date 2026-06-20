/**
 * Verification-method registry (docs/skills/standard/09 §"Verification-method registry").
 *
 * The verifier — NOT the certificate — owns the `method → { maxTier, depth }` map. This is what makes
 * methods drop-in: a new method is one entry here + a checker in verifySkill.ts, with no certificate or
 * verifier *shape* change. Two honesty invariants from `09`/`G-X.3`:
 *   - a method can never grant a tier ABOVE its mapped ceiling, and
 *   - an unknown or unsupported method maps to NO tier → the caller raises METHOD_UNKNOWN.
 * `live-model`/`zk-compute` are pre-declared (so the attestation envelope is forward-compatible) but map
 * to no runtime tier — the reserved `behavior-verified` / horizon `proof-verified` v2 non-goals.
 *
 * Type-only import of TrustTier keeps this module free of node:crypto so M3 can reuse it in-browser.
 */
import type { TrustTier } from '../../../../scripts/signing/amtech-signing.ts';

/** How far the verifier must recompute to substantiate a method's tier (docs/skills/standard/04). */
export type VerificationDepth = 'link-only' | 'graph-replay' | 'archive-byte';

/** Stable method ids (docs/skills/standard/09 ladder). `conformance.method` uses a subset. */
export type VerificationMethod =
  | 'signature'
  | 'static-contract'
  | 'amtech-review'
  | 'graph-replay'
  | 'live-model' // reserved → behavior-verified (v2 non-goal)
  | 'zk-compute'; // horizon → proof-verified (documented non-goal)

export type MethodEntry = {
  /** Maximum trust tier this method can substantiate; null = reserved/horizon (no runtime tier). */
  maxTier: TrustTier | null;
  /** Verification depth at which that tier is earned; null when the method grants no runtime tier. */
  depth: VerificationDepth | null;
  /** Pre-declared but unimplemented (forward-compatible envelope) vs. an actually-checkable method. */
  reserved: boolean;
};

/**
 * The map. `signature` is link-only (the signed cert asserts the digests); structure/review/replay all
 * require the `graph-replay` recompute to bind their evidence to the published bytes. `archive-byte` is
 * an opt-in deeper check (download + hash the whole archive), never a tier's baseline requirement.
 */
export const METHOD_REGISTRY: Record<VerificationMethod, MethodEntry> = {
  signature: { maxTier: 'signed', depth: 'link-only', reserved: false },
  'static-contract': { maxTier: 'structure-verified', depth: 'graph-replay', reserved: false },
  'amtech-review': { maxTier: 'amtech-reviewed', depth: 'graph-replay', reserved: false },
  'graph-replay': { maxTier: 'replay-verified', depth: 'graph-replay', reserved: false },
  'live-model': { maxTier: null, depth: null, reserved: true },
  'zk-compute': { maxTier: null, depth: null, reserved: true },
};

/** Tier ladder, weakest→strongest (mirrors `09` + KNOWN_TRUST_TIERS in attestation-gates.ts; G-X.2). */
export const TIER_ORDER: readonly TrustTier[] = ['signed', 'structure-verified', 'amtech-reviewed', 'replay-verified', 'behavior-verified'];

/** Position on the ladder; -1 for an off-ladder name (caller raises TIER_NOT_SUPPORTED). */
export function tierRank(tier: TrustTier): number {
  return TIER_ORDER.indexOf(tier);
}

function lookup(method: string): MethodEntry | undefined {
  return (METHOD_REGISTRY as Record<string, MethodEntry | undefined>)[method];
}

/** Map a declared method to its tier ceiling. null → caller raises METHOD_UNKNOWN (09 / G-X.3). */
export function maxTierForMethod(method: string): TrustTier | null {
  return lookup(method)?.maxTier ?? null;
}

/** The recompute depth a method's tier is earned at, or null if it grants no runtime tier. */
export function depthForMethod(method: string): VerificationDepth | null {
  return lookup(method)?.depth ?? null;
}

/** True only for the pre-declared, unimplemented reserved/horizon methods (live-model, zk-compute). */
export function isReservedMethod(method: string): boolean {
  return lookup(method)?.reserved === true;
}
