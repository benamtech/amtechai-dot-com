/**
 * Pure attestation gates (docs/skills/standard/02 §"Signer-enforced gates", G-M1). This is the
 * single re-assertion of the signer's gates used by BOTH the build validator
 * (scripts/skills/validate-skills.ts) and the negative-fixture tests — so "fails validation" and
 * "fails the test" mean the exact same code path. No file I/O here: callers load the bytes and pass
 * them in, which is what makes the gates unit-testable with mutated inputs.
 *
 * Every finding carries a canonical ReasonCode (src/lib/skills/verification/reasonCodes.ts).
 */
import { createHash } from 'node:crypto';
import { packagePayloadDigest, type ArtifactCertificate, type TrustTier } from '../signing/amtech-signing.ts';
import { MAX_EVIDENCE_AGE_DAYS, REASON_CODES, type ReasonCode } from '../../src/lib/skills/verification/reasonCodes.ts';

/** Trust tiers the verifier ladder recognizes (docs/skills/standard/02 + 09). G-X.2 pins these names. */
export const KNOWN_TRUST_TIERS: readonly TrustTier[] = ['signed', 'structure-verified', 'amtech-reviewed', 'replay-verified', 'behavior-verified'];
export const POLICY_VERSION = 'amtech-skill-policy/1';

export type GateFinding = { code: ReasonCode; message: string };

export type AttestationGateInput = {
  certificate: ArtifactCertificate;
  /** Authority/registry-pinned commit the conformance evidence must match. */
  repositoryCommit: string;
  /** The exact source bytes the archive is built from (sorted internally by packagePayloadDigest). */
  sourceFiles: { path: string; content: Buffer }[];
  /** Published evidence files a consumer would fetch; null = not found at the canonical origin. */
  publishedConformanceBytes: Buffer | null;
  publishedReviewBytes: Buffer | null;
  /** Fresh `serializeEvidence(computeConformanceEvidence(slug))` for the G-M1.4 byte-equality check. */
  freshConformanceSerialized?: string;
  /** Injectable clock for freshness tests; defaults to now. */
  now?: number;
};

const looksExecutable = (path: string) => path.startsWith('scripts/') || /\.(sh|bash|mjs|cjs|js|ts|py|rb)$/.test(path);
const sha256 = (content: Buffer) => createHash('sha256').update(content).digest('hex');

export function checkAttestationGates(input: AttestationGateInput): GateFinding[] {
  const findings: GateFinding[] = [];
  const add = (code: ReasonCode, message: string) => findings.push({ code, message });
  const { certificate, repositoryCommit, sourceFiles, now = Date.now() } = input;

  // G-M1.1 — v2 + attestations present.
  if (certificate.schemaVersion !== 'amtech-signed-artifact/v2') {
    add(REASON_CODES.INVALID_SCHEMA, `certificate schemaVersion ${certificate.schemaVersion} is not amtech-signed-artifact/v2.`);
  }
  const att = certificate.attestations;
  if (!att) {
    add(REASON_CODES.MISSING_ATTESTATIONS, 'certificate has no attestations block.');
    return findings;
  }

  // G-X.2 — tier name is on the canonical ladder.
  if (!KNOWN_TRUST_TIERS.includes(att.trustTier)) {
    add(REASON_CODES.TIER_NOT_SUPPORTED, `attestations.trustTier '${att.trustTier}' is not a known trust tier.`);
  }

  // G-M1.2 — independent re-assertion of the signer gates.
  const conformance = att.conformance;
  if (conformance.sourceCommit !== repositoryCommit) {
    add(REASON_CODES.COMMIT_MISMATCH, `conformance.sourceCommit ${conformance.sourceCommit} != repository.commit ${repositoryCommit}.`);
  }
  const ageDays = (now - new Date(conformance.ranAt).getTime()) / 86_400_000;
  if (!Number.isFinite(ageDays) || ageDays > MAX_EVIDENCE_AGE_DAYS) {
    add(REASON_CODES.STALE_EVIDENCE, `conformance ranAt ${conformance.ranAt} is older than ${MAX_EVIDENCE_AGE_DAYS}d.`);
  }
  if (conformance.result !== 'pass') {
    add(REASON_CODES.CONFORMANCE_FAILED, `conformance result is '${conformance.result}'.`);
  }

  const shippedScripts = sourceFiles.map((file) => file.path).filter(looksExecutable).sort();
  const declaredScripts = [...att.permissions.scripts].sort();
  if (JSON.stringify(declaredScripts) !== JSON.stringify(shippedScripts)) {
    add(REASON_CODES.UNDECLARED_SCRIPT, `attestations.permissions.scripts [${declaredScripts.join(', ')}] != shipped executables [${shippedScripts.join(', ')}].`);
  }

  const recomputed = packagePayloadDigest(sourceFiles);
  if (!certificate.sourcePackage || certificate.sourcePackage.sha256 !== recomputed.sha256 || certificate.sourcePackage.sha3_512 !== recomputed.sha3_512) {
    add(REASON_CODES.SOURCE_PACKAGE_MISMATCH, 'certificate.sourcePackage does not recompute from the source files.');
  }

  if (att.trustTier === 'amtech-reviewed') {
    const review = att.review;
    if (!review) {
      add(REASON_CODES.REVIEW_NOT_APPROVED, 'trustTier amtech-reviewed but no review attestation present.');
    } else {
      if (review.result !== 'approved') add(REASON_CODES.REVIEW_NOT_APPROVED, `review.result is '${review.result}'.`);
      if (review.policyVersion !== POLICY_VERSION) add(REASON_CODES.REVIEW_NOT_APPROVED, `review.policyVersion ${review.policyVersion} != ${POLICY_VERSION}.`);
    }
  }

  // G-M1.3 — each evidence reference resolves and its digest matches.
  const evidenceChecks: [string, { sha256: string } | undefined, Buffer | null][] = [
    ['conformance', conformance.evidence, input.publishedConformanceBytes],
    ['review', att.review?.evidence, input.publishedReviewBytes],
  ];
  for (const [label, ref, bytes] of evidenceChecks) {
    if (!ref) continue;
    if (!bytes) {
      add(REASON_CODES.EVIDENCE_MISSING, `${label} evidence not published.`);
      continue;
    }
    if (sha256(bytes) !== ref.sha256) {
      add(REASON_CODES.EVIDENCE_DIGEST_MISMATCH, `${label} evidence sha256 ${sha256(bytes)} != certificate ${ref.sha256}.`);
    }
  }

  // G-M1.4 — published conformance evidence is byte-identical to a fresh run.
  if (input.freshConformanceSerialized !== undefined) {
    if (!input.publishedConformanceBytes) {
      add(REASON_CODES.EVIDENCE_MISSING, 'published conformance evidence missing for byte-equality check.');
    } else if (input.publishedConformanceBytes.toString('utf8') !== input.freshConformanceSerialized) {
      add(REASON_CODES.EVIDENCE_DIGEST_MISMATCH, 'published conformance.json is not byte-identical to a fresh conformance run.');
    }
  }

  return findings;
}
