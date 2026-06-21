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
} as const;

export type ReasonCode = (typeof REASON_CODES)[keyof typeof REASON_CODES];

/** Default signed-evidence freshness window (docs/skills/standard/02 — per-policy override allowed). */
export const MAX_EVIDENCE_AGE_DAYS = 90;
