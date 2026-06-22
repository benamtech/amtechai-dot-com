/**
 * Canonical reason codes for AMTECH skill certificate verification and signing gates.
 *
 * One enum shared across the pipeline so a failure means the same thing everywhere: the M1 signer
 * gates (scripts/signing/sign-skills.ts), the conformance runner (scripts/skills/run-conformance.ts),
 * the build/validate gates (scripts/skills/validate-skills.ts), and the M2 link-first verifier
 * (docs/skills/standard/04). Reason codes are stable strings — surfaces and tests assert on them.
 */
export const REASON_CODES = {
  OK: 'OK',
  // Signature / identity
  INVALID_SIGNATURE: 'INVALID_SIGNATURE',
  KEY_NOT_ACTIVE: 'KEY_NOT_ACTIVE',
  IDENTITY_MISMATCH: 'IDENTITY_MISMATCH',
  // Provenance / bytes
  DIGEST_MISMATCH: 'DIGEST_MISMATCH',
  SOURCE_PACKAGE_MISMATCH: 'SOURCE_PACKAGE_MISMATCH',
  BOOTSTRAP_DIGEST_MISMATCH: 'BOOTSTRAP_DIGEST_MISMATCH', // served use.md/agent.md ≠ the signed cert.bootstrap
  // Evidence / attestations
  MISSING_ATTESTATIONS: 'MISSING_ATTESTATIONS',
  EVIDENCE_MISSING: 'EVIDENCE_MISSING',
  EVIDENCE_DIGEST_MISMATCH: 'EVIDENCE_DIGEST_MISMATCH',
  STALE_EVIDENCE: 'STALE_EVIDENCE',
  CONFORMANCE_FAILED: 'CONFORMANCE_FAILED',
  UNDECLARED_SCRIPT: 'UNDECLARED_SCRIPT',
  REVIEW_NOT_APPROVED: 'REVIEW_NOT_APPROVED',
  TIER_NOT_SUPPORTED: 'TIER_NOT_SUPPORTED',
  // Verifier / link-first (M2) — consumed by docs/skills/standard/04 + 09
  INVALID_SCHEMA: 'INVALID_SCHEMA',           // certificate/authority document fails schema validation
  UNREACHABLE: 'UNREACHABLE',                 // a required surface couldn't be fetched ("can't determine" ≠ invalid)
  METHOD_UNKNOWN: 'METHOD_UNKNOWN',           // attestation declares a verification method the verifier can't map to a tier
  REPLAY_MISMATCH: 'REPLAY_MISMATCH',         // graph-replay recompute disagrees with the bound digest
  REPLAY_NONDETERMINISTIC: 'REPLAY_NONDETERMINISTIC', // a replay step did not reproduce byte-for-byte
  MANIFEST_DIGEST_MISMATCH: 'MANIFEST_DIGEST_MISMATCH', // a published file's SRI digest ≠ the signed manifest
  CATALOG_ROOT_MISMATCH: 'CATALOG_ROOT_MISMATCH',       // recomputed catalog root ≠ the published root
  // Authority (reserved for M4)
  REVOKED: 'REVOKED',
  AUTHORITY_MISMATCH: 'AUTHORITY_MISMATCH',
  // Transparency log (Option B — docs/skills/standard/03 §Merkle). The Merkle tree folds the existing
  // record bytes; these fire when the signed tree head or a published proof fails to recompute/verify.
  MERKLE_ROOT_MISMATCH: 'MERKLE_ROOT_MISMATCH',           // recomputed RFC-6962 root over records ≠ the STH rootHash
  STH_SIGNATURE_INVALID: 'STH_SIGNATURE_INVALID',         // signed tree head fails the trust policy (no valid authority sig)
  INCLUSION_PROOF_INVALID: 'INCLUSION_PROOF_INVALID',     // the head record's Merkle inclusion proof did not verify
  CONSISTENCY_PROOF_INVALID: 'CONSISTENCY_PROOF_INVALID', // STH is not an append-only extension of a pinned earlier STH
  // Behavioral verification (docs/skills/standard/10) — reserved/piped now, wired in M4.
  BEHAVIOR_NOT_PROVEN: 'BEHAVIOR_NOT_PROVEN',             // trustTier behavior-verified but no passing behavior attestation
  BEHAVIOR_UPLIFT_INSUFFICIENT: 'BEHAVIOR_UPLIFT_INSUFFICIENT', // deltaPp <= behaviorPolicy.minDeltaPp
  // Credential brokering + entitlement (docs/skills/standard/13 + 02) — reserved/piped now, wired with the first
  // credentialed/paid skill. The CA authorizes; the host brokers/enforces.
  UNDECLARED_SECRET: 'UNDECLARED_SECRET',                 // a script uses a credential the signed manifest didn't declare
  SECRET_SCOPE_MISMATCH: 'SECRET_SCOPE_MISMATCH',         // requested scope exceeds the declared credentials manifest
  ENTITLEMENT_REQUIRED: 'ENTITLEMENT_REQUIRED',           // premium skill used without a valid entitlement certificate
  ENTITLEMENT_INVALID: 'ENTITLEMENT_INVALID',             // entitlement cert expired/revoked/holder-mismatched
  HOLDER_NOT_ACTIVE: 'HOLDER_NOT_ACTIVE',                 // client/holder certificate suspended/revoked
} as const;

export type ReasonCode = (typeof REASON_CODES)[keyof typeof REASON_CODES];

/** Default signed-evidence freshness window (docs/skills/standard/02 — per-policy override allowed). */
export const MAX_EVIDENCE_AGE_DAYS = 90;

/**
 * Authoring-review freshness window (docs/skills/standard/10 — "skills decay"). A skill's `lastReviewed` must be
 * within this many days of the release date for the authoring-discipline gate to pass. Relative to the release
 * (not wall-clock), so the conformance evidence stays deterministic + byte-stable.
 */
export const MAX_AUTHORING_REVIEW_AGE_DAYS = 365;

/** Behavioral uplift policy (docs/skills/standard/10). Gate at any real uplift now; raise minDeltaPp later as a
 *  policy event without a schema change. Piped for M4; unused until the behavior tier wires in. */
export const BEHAVIOR_POLICY = { minDeltaPp: 0 } as const;
