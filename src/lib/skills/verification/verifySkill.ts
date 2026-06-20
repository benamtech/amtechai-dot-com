/**
 * Link-first skill verifier (docs/skills/standard/04 + the `graph-replay` recipe in 09).
 *
 * Pure and loader-driven so the SAME code runs from the CLI (fetch from URLs) and from the build
 * validator (read local public/ files): the caller supplies a `ResourceLoader`, the verifier runs the
 * deterministic recompute recipe and returns a reason-coded verdict. It consumes ONLY published surfaces
 * — the signed certificate, the manifest, the published files, the served key, the catalog — so a third
 * party re-derives the verdict instead of trusting a badge. Determinism is the security property.
 *
 * Depths (how far we recompute):
 *   - `link-only`    — authenticate the certificate (Ed25519 over canonical JSON) only.
 *   - `graph-replay` — + recompute `sourcePackage` over the published files, per-file SRI vs the manifest,
 *                       evidence-digest resolution, and the catalog root over the set of certificates.
 *   - `archive-byte` — + download the archive and recompute its SHA-256/SHA3-512 against the signed cert.
 *
 * Reuses node:crypto via amtech-signing today; the digest/canonical helpers are WebCrypto-portable so M3
 * can run the identical recipe in-browser (RFC 8785 + crypto.subtle).
 */
import {
  canonicalJson,
  digest,
  packagePayloadDigest,
  verifyCanonical,
  verifyCertificate,
  type ArtifactCertificate,
  type SigningKeyDocument,
} from '../../../../scripts/signing/amtech-signing.ts';
import { REASON_CODES, type ReasonCode } from './reasonCodes.ts';
import { depthForMethod, maxTierForMethod, tierRank, type VerificationDepth, type VerificationMethod } from './methodRegistry.ts';
import type { TrustTier } from '../../../../scripts/signing/amtech-signing.ts';

/** Loads published bytes for one skill. Every getter returns null when the resource is unreachable. */
export type ResourceLoader = {
  /** Bytes for a path relative to the skill base, e.g. 'certificate.json', 'manifest.json', 'files/SKILL.md'. */
  skillFile: (relPath: string) => Promise<Buffer | null>;
  /** The served signing-key document (/.well-known/amtech-signing-key.json). */
  signingKey: () => Promise<Buffer | null>;
  /** The catalog.json (set-integrity). Omit/return null to skip the catalog-root check. */
  catalog?: () => Promise<Buffer | null>;
  /** Another skill's published certificate.json by slug — needed to recompute the catalog root. */
  siblingCertificate?: (slug: string) => Promise<Buffer | null>;
  /** The domain authority document (/.well-known/skill-authority.json) — revocation + provenance (04 §1–2,6). */
  authority?: () => Promise<Buffer | null>;
  /** The latest signed authority record (docs/skills/standard/03) — set-integrity + sequence (04 §1). */
  authorityRecord?: () => Promise<Buffer | null>;
  /** The detached signature for the latest authority record. */
  authorityRecordSig?: () => Promise<Buffer | null>;
};

export type VerifyOptions = {
  depth?: VerificationDepth;
  /** Deterministic build-time stamp; the live CLI omits it and uses now(). Keeps artifacts byte-stable (G-X.7). */
  checkedAt?: string;
};

export type SkillVerdict = {
  verdict: 'verified' | 'invalid' | 'revoked' | 'unverifiable';
  depth: VerificationDepth;
  trustTier: TrustTier | null;
  method: VerificationMethod | null;
  subject: { slug?: string; version?: string; certificateId?: string };
  reasonCodes: ReasonCode[];
  evidence: Record<string, 'pass' | 'fail' | 'skipped'>;
  /** Authority sequence the verdict is anchored to (docs/skills/standard/03); null until a record resolves. */
  authoritySequence: string | null;
  checkedAt: string;
};

type ManifestShape = {
  files?: { path: string; sha256: string; sha3_512?: string; integrity?: string }[];
  archive?: { file?: string; sha256?: string; sha3_512?: string };
};

const sha256 = (b: Buffer) => digest('sha256', b);
const sriOf = (b: Buffer) => `sha256-${createDigestBase64(b)}`;
function createDigestBase64(b: Buffer): string {
  return Buffer.from(sha256(b), 'hex').toString('base64');
}

/** The effective verification method a certificate's attestations declare (docs/skills/standard/09). */
function effectiveMethod(cert: ArtifactCertificate): VerificationMethod {
  const att = cert.attestations;
  if (!att) return 'signature';
  if (att.trustTier === 'amtech-reviewed' && att.review) return 'amtech-review';
  if (att.conformance?.method === 'static-contract') return 'static-contract';
  if (att.conformance?.method === 'live-model') return 'live-model';
  return 'signature';
}

export async function verifySkill(loader: ResourceLoader, options: VerifyOptions = {}): Promise<SkillVerdict> {
  const requestedDepth: VerificationDepth = options.depth ?? 'graph-replay';
  const reasons: ReasonCode[] = [];
  const evidence: Record<string, 'pass' | 'fail' | 'skipped'> = {};
  const checkedAt = options.checkedAt ?? new Date().toISOString();
  let authoritySequence: string | null = null;
  const fail = (code: ReasonCode, label: string) => {
    reasons.push(code);
    evidence[label] = 'fail';
  };
  const pass = (label: string) => {
    evidence[label] = 'pass';
  };

  const baseFail = (verdict: SkillVerdict['verdict'], subject: SkillVerdict['subject'] = {}): SkillVerdict => ({
    verdict,
    depth: requestedDepth,
    trustTier: null,
    method: null,
    subject,
    reasonCodes: reasons.length ? reasons : [REASON_CODES.UNREACHABLE],
    evidence,
    authoritySequence,
    checkedAt,
  });

  // ---- Step 1 — authenticity (link-only floor) ---------------------------------------------------
  const [certBytes, sigBytes, keyBytes] = await Promise.all([loader.skillFile('certificate.json'), loader.skillFile('certificate.sig'), loader.signingKey()]);
  if (!certBytes) return (fail(REASON_CODES.UNREACHABLE, 'certificate'), baseFail('unverifiable'));
  let cert: ArtifactCertificate;
  try {
    cert = JSON.parse(certBytes.toString('utf8')) as ArtifactCertificate;
  } catch {
    return (fail(REASON_CODES.INVALID_SCHEMA, 'certificate'), baseFail('invalid'));
  }
  const subject = { slug: cert.subjectId, version: cert.version, certificateId: cert.certificateId };
  if (!sigBytes) return (fail(REASON_CODES.UNREACHABLE, 'signature'), baseFail('unverifiable', subject));
  if (!keyBytes) return (fail(REASON_CODES.UNREACHABLE, 'signingKey'), baseFail('unverifiable', subject));

  const key = JSON.parse(keyBytes.toString('utf8')) as SigningKeyDocument;

  // Authority resolution (04 §1–2) — REVOCATION is terminal and outranks every signature/integrity check:
  // a revoked skill or key returns `revoked`, never `invalid`. Provenance (commit/path) is checked after.
  type AuthorityEntry = { slug?: string; status?: string; repositoryCommit?: string; repositoryPath?: string };
  let authorityEntry: AuthorityEntry | undefined;
  const authorityBytes = loader.authority ? await loader.authority() : null;
  if (authorityBytes) {
    try {
      const authority = JSON.parse(authorityBytes.toString('utf8')) as { skills?: AuthorityEntry[] };
      authorityEntry = authority.skills?.find((s) => s.slug === cert.subjectId);
    } catch {
      fail(REASON_CODES.INVALID_SCHEMA, 'authority');
    }
  }
  if (authorityEntry?.status === 'revoked') return (fail(REASON_CODES.REVOKED, 'authority'), baseFail('revoked', subject));
  if (key.status !== 'active') return (fail(REASON_CODES.KEY_NOT_ACTIVE, 'signature'), baseFail('revoked', subject));

  if (cert.signingKeyId !== key.keyId) fail(REASON_CODES.IDENTITY_MISMATCH, 'signature');
  else if (!verifyCertificate(cert, sigBytes.toString('utf8'), key)) fail(REASON_CODES.INVALID_SIGNATURE, 'signature');
  else pass('signature');

  // Provenance: the authority entry must pin the same commit/path the certificate binds (04 §6).
  if (authorityEntry && (authorityEntry.repositoryCommit !== cert.repository?.commit || authorityEntry.repositoryPath !== cert.repository?.path)) {
    fail(REASON_CODES.COMMIT_MISMATCH, 'authority');
  } else if (authorityEntry) {
    pass('authority');
  }

  const method = effectiveMethod(cert);
  const ceiling = maxTierForMethod(method);
  if (ceiling === null) fail(REASON_CODES.METHOD_UNKNOWN, 'method');
  const claimedTier: TrustTier = cert.attestations?.trustTier ?? 'signed';
  // G-X.3 honesty: a method can never substantiate a tier above its ceiling.
  if (ceiling !== null && tierRank(claimedTier) > tierRank(ceiling)) fail(REASON_CODES.TIER_NOT_SUPPORTED, 'method');

  // A broken signature is terminal — nothing below it can be trusted.
  if (evidence.signature === 'fail') {
    return { verdict: 'invalid', depth: 'link-only', trustTier: null, method, subject, reasonCodes: reasons, evidence, authoritySequence, checkedAt };
  }

  if (requestedDepth === 'link-only') {
    const tier = ceiling !== null && tierRank(claimedTier) <= tierRank(ceiling) ? claimedTier : null;
    return { verdict: reasons.length ? 'invalid' : 'verified', depth: 'link-only', trustTier: reasons.length ? null : tier, method, subject, reasonCodes: reasons, evidence, authoritySequence, checkedAt };
  }

  // ---- Step 2 — provenance: recompute sourcePackage over the published files ----------------------
  const manifestBytes = await loader.skillFile('manifest.json');
  let manifest: ManifestShape | null = null;
  if (!manifestBytes) fail(REASON_CODES.UNREACHABLE, 'manifest');
  else {
    try {
      manifest = JSON.parse(manifestBytes.toString('utf8')) as ManifestShape;
    } catch {
      fail(REASON_CODES.INVALID_SCHEMA, 'manifest');
    }
  }

  const publishedFiles: { path: string; content: Buffer }[] = [];
  if (manifest?.files) {
    for (const entry of manifest.files) {
      const bytes = await loader.skillFile(`files/${entry.path}`);
      if (!bytes) {
        fail(REASON_CODES.EVIDENCE_MISSING, 'publishedFiles');
        continue;
      }
      publishedFiles.push({ path: entry.path, content: bytes });
      // Step 3 — per-file SRI vs the signed manifest.
      if (sha256(bytes) !== entry.sha256 || (entry.integrity && sriOf(bytes) !== entry.integrity)) {
        fail(REASON_CODES.MANIFEST_DIGEST_MISMATCH, 'manifestSri');
      }
    }
    if (evidence.manifestSri !== 'fail' && evidence.publishedFiles !== 'fail') pass('manifestSri');
  }

  // sourcePackage recompute (the cryptographic link from published files to the signed certificate).
  const recomputedPackage = publishedFiles.length ? packagePayloadDigest(publishedFiles) : null;
  if (!cert.sourcePackage || !recomputedPackage || cert.sourcePackage.sha256 !== recomputedPackage.sha256 || cert.sourcePackage.sha3_512 !== recomputedPackage.sha3_512) {
    fail(REASON_CODES.SOURCE_PACKAGE_MISMATCH, 'sourcePackage');
  } else {
    pass('sourcePackage');
  }

  // Evidence-digest resolution (published evidence must match the cert's evidence refs).
  const att = cert.attestations;
  if (att) {
    const evidenceRefs: [string, { sha256: string } | undefined][] = [
      ['evidence/conformance.json', att.conformance?.evidence],
      ['evidence/review.json', att.review?.evidence],
    ];
    let evidenceOk = true;
    for (const [path, ref] of evidenceRefs) {
      if (!ref) continue;
      const bytes = await loader.skillFile(path);
      if (!bytes) {
        fail(REASON_CODES.EVIDENCE_MISSING, 'evidence');
        evidenceOk = false;
      } else if (sha256(bytes) !== ref.sha256) {
        fail(REASON_CODES.EVIDENCE_DIGEST_MISMATCH, 'evidence');
        evidenceOk = false;
      }
    }
    if (evidenceOk) pass('evidence');
  }

  // ---- Step 4 — set integrity: recompute the catalog root over every skill's certificate ----------
  if (loader.catalog && loader.siblingCertificate) {
    const catalogBytes = await loader.catalog();
    if (!catalogBytes) {
      evidence.catalogRoot = 'skipped';
    } else {
      try {
        const catalog = JSON.parse(catalogBytes.toString('utf8')) as { catalogRoot?: string; skills?: { slug: string; certificateUrl?: string }[] };
        const leaves: { slug: string; cert: string }[] = [];
        let complete = true;
        for (const entry of (catalog.skills ?? []).filter((s) => s.certificateUrl)) {
          const bytes = await loader.siblingCertificate(entry.slug);
          if (!bytes) {
            fail(REASON_CODES.CATALOG_ROOT_MISMATCH, 'catalogRoot');
            complete = false;
            break;
          }
          leaves.push({ slug: entry.slug, cert: sha256(bytes) });
        }
        if (complete) {
          leaves.sort((a, b) => (a.slug < b.slug ? -1 : a.slug > b.slug ? 1 : 0));
          const recomputedRoot = digest('sha256', canonicalJson(leaves));
          if (catalog.catalogRoot !== recomputedRoot) fail(REASON_CODES.CATALOG_ROOT_MISMATCH, 'catalogRoot');
          else pass('catalogRoot');
        }
      } catch {
        fail(REASON_CODES.INVALID_SCHEMA, 'catalogRoot');
      }
    }
  } else {
    evidence.catalogRoot = 'skipped';
  }

  // ---- Authority record (04 §1, M4 groundwork): the latest SIGNED record commits to the skill SET -----
  // The domain authority's latest pointer must equal the record's canonical digest, the record signature
  // must verify, and this skill's certificate digest must appear in the record's set. Drift → AUTHORITY_MISMATCH.
  if (loader.authorityRecord && loader.authority) {
    const [recordBytes, recordSigBytes, authDocBytes] = await Promise.all([
      loader.authorityRecord(),
      loader.authorityRecordSig?.() ?? Promise.resolve(null),
      loader.authority(),
    ]);
    if (!recordBytes || !authDocBytes) {
      evidence.authorityRecord = 'skipped';
    } else {
      try {
        const record = JSON.parse(recordBytes.toString('utf8')) as { sequence?: string; catalogRoot?: string; skills?: { slug: string; certificateSha256: string }[] };
        const authDoc = JSON.parse(authDocBytes.toString('utf8')) as { latestRecordHash?: string };
        const recordHash = digest('sha256', canonicalJson(record));
        const leafOk = record.skills?.some((s) => s.slug === cert.subjectId && s.certificateSha256 === sha256(certBytes));
        if (authDoc.latestRecordHash !== recordHash) fail(REASON_CODES.AUTHORITY_MISMATCH, 'authorityRecord');
        else if (recordSigBytes && !verifyCanonical(record, recordSigBytes.toString('utf8'), key)) fail(REASON_CODES.AUTHORITY_MISMATCH, 'authorityRecord');
        else if (!leafOk) fail(REASON_CODES.AUTHORITY_MISMATCH, 'authorityRecord');
        else {
          pass('authorityRecord');
          authoritySequence = record.sequence ?? null;
        }
      } catch {
        fail(REASON_CODES.INVALID_SCHEMA, 'authorityRecord');
      }
    }
  }

  // ---- Step 5 — determinism: recompute the digest-bound step once more and require byte-equality ---
  // The recipe must be reproducible: a second pass over the same bytes yields the same digests, or the
  // surface is non-deterministic and the verdict cannot be trusted (docs/skills/standard/09).
  if (recomputedPackage && publishedFiles.length) {
    const second = packagePayloadDigest(publishedFiles);
    if (second.sha256 !== recomputedPackage.sha256 || second.sha3_512 !== recomputedPackage.sha3_512) fail(REASON_CODES.REPLAY_NONDETERMINISTIC, 'determinism');
    else pass('determinism');
  }

  // ---- archive-byte (opt-in): download + hash the whole archive against the signed certificate -----
  let depth: VerificationDepth = 'graph-replay';
  if (requestedDepth === 'archive-byte' && manifest?.archive?.file) {
    const archive = await loader.skillFile(manifest.archive.file);
    if (!archive) fail(REASON_CODES.UNREACHABLE, 'archive');
    else if (digest('sha256', archive) !== cert.digests.sha256 || digest('sha3-512', archive) !== cert.digests.sha3_512) fail(REASON_CODES.DIGEST_MISMATCH, 'archive');
    else {
      pass('archive');
      depth = 'archive-byte';
    }
  }

  const verified = reasons.length === 0;
  const ceilingTier = ceiling;
  const reportedTier = verified && ceilingTier !== null && tierRank(claimedTier) <= tierRank(ceilingTier) ? claimedTier : null;
  return {
    verdict: verified ? 'verified' : 'invalid',
    depth,
    trustTier: reportedTier,
    method,
    subject,
    reasonCodes: verified ? [REASON_CODES.OK] : reasons,
    evidence,
    authoritySequence,
    checkedAt,
  };
}

/** The expected `method`'s recompute depth, for callers that want to pick a default depth from a cert. */
export function defaultDepthFor(cert: ArtifactCertificate): VerificationDepth {
  return depthForMethod(effectiveMethod(cert)) ?? 'link-only';
}
