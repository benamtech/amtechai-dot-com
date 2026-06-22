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
  type ArtifactCertificate,
  type SigningKeyDocument,
} from '../../../../scripts/signing/amtech-signing.ts';
import { REASON_CODES, type ReasonCode } from './reasonCodes.ts';
import { depthForMethod, maxTierForMethod, tierRank, type VerificationDepth, type VerificationMethod } from './methodRegistry.ts';
import type { TrustTier } from '../../../../scripts/signing/amtech-signing.ts';
import { leafHash, verifyInclusion, verifyConsistency } from '../merkle.ts';

/** Loads published bytes for one skill. Every getter returns null when the resource is unreachable. */
export type ResourceLoader = {
  /** Bytes for a path relative to the skill base, e.g. 'certificate.json', 'manifest.json', 'files/SKILL.md'. */
  skillFile: (relPath: string) => Promise<Buffer | null>;
  /** The served active signing-key document (/.well-known/amtech-signing-key.json). */
  signingKey: () => Promise<Buffer | null>;
  /** A key document by keyId (/.well-known/keys/<keyId>.json) — historical/active-at-issuance verification. */
  signingKeyById?: (keyId: string) => Promise<Buffer | null>;
  /** A key document by absolute URL — used to resolve STH witness keys that may live on ANOTHER domain
   *  (docs/skills/standard/11 — federation). Each witness signature carries its own `signingKeyUrl`. */
  keyByUrl?: (url: string) => Promise<Buffer | null>;
  /** The catalog.json (set-integrity). Omit/return null to skip the catalog-root check. */
  catalog?: () => Promise<Buffer | null>;
  /** Another skill's published certificate.json by slug — needed to recompute the catalog root. */
  siblingCertificate?: (slug: string) => Promise<Buffer | null>;
  /** The domain authority document (/.well-known/skill-authority.json) — revocation + provenance (04 §1–2,6). */
  authority?: () => Promise<Buffer | null>;
  /** The append-only authority log (/.well-known/authority/log.json) — the chain index (docs/skills/standard/03). */
  authorityLog?: () => Promise<Buffer | null>;
  /** A signed authority record by zero-padded sequence stem (e.g. '0000'). */
  authorityRecordStem?: (stem: string) => Promise<Buffer | null>;
  /** The detached signature for an authority record by stem. */
  authorityRecordStemSig?: (stem: string) => Promise<Buffer | null>;
  /** The latest signed tree head (/.well-known/authority/sth.json) — transparency log (docs/skills/standard/03). */
  authoritySth?: () => Promise<Buffer | null>;
  /** A precomputed Merkle inclusion proof for a record index at a tree size. */
  authorityInclusionProof?: (treeSize: string, index: number) => Promise<Buffer | null>;
  /** A precomputed consistency proof from `fromSize` to the current `treeSize` (for STH pinning). */
  authorityConsistencyProof?: (treeSize: string, fromSize: number) => Promise<Buffer | null>;
};

/**
 * Trust-minimization policy for the signed tree head (docs/skills/standard/03 §Merkle, scaffolding #2).
 * Defaults reproduce today's behavior (one authority signature, no witnesses, no external anchor). Raising
 * `minWitnessSigs` or `requireAnchor` is how "independently witnessed / externally anchored" becomes a
 * default flip, not a format change — once real witnesses/anchors exist.
 */
export type SthTrustPolicy = { minAuthoritySigs?: number; minWitnessSigs?: number; requireAnchor?: boolean };

export type VerifyOptions = {
  depth?: VerificationDepth;
  /** Deterministic build-time stamp; the live CLI omits it and uses now(). Keeps artifacts byte-stable (G-X.7). */
  checkedAt?: string;
  /** STH trust policy (scaffolding #2). Omitted → { minAuthoritySigs: 1, minWitnessSigs: 0, requireAnchor: false }. */
  trustPolicy?: SthTrustPolicy;
  /** A previously-seen STH the caller pins (scaffolding #3). The verifier proves the current STH append-only
   *  EXTENDS it via a consistency proof and fails closed on rollback/equivocation. Stateful agents (Hermes). */
  pinnedSth?: { treeSize: string; rootHash: string };
};

/**
 * The assurance/autonomy grant (docs/skills/standard/12). Side-effect-free description of what a verdict
 * WARRANTS — it never gates the right to bootstrap or run; the host sets policy. Never exceeds the signed
 * `permissions` envelope. (Stub for M0; `deriveCapability` lands in M4b.)
 */
export type Capability = {
  scripts: string[];
  filesystem: string;
  network: string;
  secrets: string;
  assuranceLevel: 'none' | 'integrity' | 'authorship' | 'effectiveness';
  autonomyWarranted: boolean;
  isolationRecommended: boolean;
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
  /** Assurance/autonomy grant (docs/skills/standard/12); optional until derived in M4b. */
  capability?: Capability;
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

/**
 * External-anchor record on an STH: a claim that the Merkle root was committed to an independent system
 * (a public chain like Bitcoin or Nockchain, a transparency log, a signed git tag) so its existence-at-time
 * is witnessable WITHOUT trusting AMTECH (docs/skills/standard/11). `target` MUST equal the STH `rootHash`.
 */
export type AnchorRecord = { type?: string; ref?: string; target?: string; anchoredAt?: string };
export type AnchorVerifier = (anchor: AnchorRecord, rootHash: string) => boolean | Promise<boolean>;

/**
 * Pluggable anchor-verifier registry — the "breaker" the broadcasting backend hooks into. EMPTY today: we
 * wire the mechanism end-to-end but broadcast nothing yet. When the operator starts publishing STH roots to a
 * chain (Bitcoin / Nockchain / …), register `type → verifier` here and `requireAnchor: true` lights up. Until
 * then verifyAnchor returns false, so requiring an anchor fails CLOSED (you cannot require an uncheckable claim).
 */
export const ANCHOR_VERIFIERS: Record<string, AnchorVerifier> = {};

async function verifyAnchor(anchors: AnchorRecord[], rootHash: string): Promise<boolean> {
  for (const a of anchors) {
    const verify = a?.type ? ANCHOR_VERIFIERS[a.type] : undefined;
    if (verify && a.target === rootHash && (await verify(a, rootHash))) return true;
  }
  return false;
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
  const [certBytes, sigBytes] = await Promise.all([loader.skillFile('certificate.json'), loader.skillFile('certificate.sig')]);
  if (!certBytes) return (fail(REASON_CODES.UNREACHABLE, 'certificate'), baseFail('unverifiable'));
  let cert: ArtifactCertificate;
  try {
    cert = JSON.parse(certBytes.toString('utf8')) as ArtifactCertificate;
  } catch {
    return (fail(REASON_CODES.INVALID_SCHEMA, 'certificate'), baseFail('invalid'));
  }
  const subject = { slug: cert.subjectId, version: cert.version, certificateId: cert.certificateId };
  if (!sigBytes) return (fail(REASON_CODES.UNREACHABLE, 'signature'), baseFail('unverifiable', subject));

  // Fetch the cert's key BY keyId (active-at-issuance — a retired key still verifies its historical certs),
  // falling back to the served active key (docs/skills/standard/03).
  const keyBytes = (loader.signingKeyById ? await loader.signingKeyById(cert.signingKeyId) : null) ?? (await loader.signingKey());
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

  // Key status: a `retired` key still verifies certs issued during its validity (active-at-issuance); a
  // `revoked` key is terminal (`revoked`); an unknown status is not acceptable.
  if (cert.signingKeyId !== key.keyId) fail(REASON_CODES.IDENTITY_MISMATCH, 'signature');
  else if (key.status === 'revoked') return (fail(REASON_CODES.KEY_NOT_ACTIVE, 'signature'), baseFail('revoked', subject));
  else if (key.status !== 'active' && key.status !== 'retired') fail(REASON_CODES.KEY_NOT_ACTIVE, 'signature');
  else if (!verifyCanonical(cert, sigBytes.toString('utf8'), key)) fail(REASON_CODES.INVALID_SIGNATURE, 'signature');
  else pass('signature');

  // Provenance: the authority entry must name the same source path the certificate binds. The cross-repo
  // proof is `sourcePackage` (recomputed below), not a git commit.
  if (authorityEntry && authorityEntry.repositoryPath !== cert.repository?.path) {
    fail(REASON_CODES.SOURCE_PACKAGE_MISMATCH, 'authority');
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

  // Bootstrap binding (docs/skills/standard/04): the served agent-entry surfaces — use.md and agent.md, the
  // first two files an agent fetches — must match the signed cert.bootstrap. This is what makes tampering with
  // or omitting the front door a hard failure; they live outside sourcePackage/the archive, so nothing else
  // covers them. Required for skill certs.
  if (cert.subjectType === 'skill') {
    if (!cert.bootstrap) {
      fail(REASON_CODES.BOOTSTRAP_DIGEST_MISMATCH, 'bootstrap');
    } else {
      let bootstrapOk = true;
      const bootstrapFiles: [string, { sha256: string; sha3_512: string }][] = [
        ['use.md', cert.bootstrap.use],
        ['agent.md', cert.bootstrap.agent],
      ];
      for (const [path, ref] of bootstrapFiles) {
        const bytes = await loader.skillFile(path);
        if (!bytes) {
          fail(REASON_CODES.EVIDENCE_MISSING, 'bootstrap');
          bootstrapOk = false;
        } else if (sha256(bytes) !== ref.sha256 || digest('sha3-512', bytes) !== ref.sha3_512) {
          fail(REASON_CODES.BOOTSTRAP_DIGEST_MISMATCH, 'bootstrap');
          bootstrapOk = false;
        }
      }
      if (bootstrapOk) pass('bootstrap');
    }
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

  // ---- Authority chain (04 §1, M4): walk the SIGNED hash-chain and honor revocations ------------------
  // Obligations: gap-free + monotonic sequence; each previousRecordHash links to the prior record's canonical
  // digest; each record's log-entry hash matches; each signature verifies; the latest pointer equals the head
  // digest; this skill's certificate digest is in the head state; and a skill-revoke in the SIGNED head state
  // → `revoked` (tamper-evident, independent of the unsigned authority file's status hint). Drift → AUTHORITY_MISMATCH.
  if (loader.authorityLog && loader.authorityRecordStem && loader.authority) {
    const [logBytes, authDocBytes] = await Promise.all([loader.authorityLog(), loader.authority()]);
    if (!logBytes || !authDocBytes) {
      evidence.authorityRecord = 'skipped';
    } else {
      try {
        const log = JSON.parse(logBytes.toString('utf8')) as { records?: { sequence: string; recordHash: string }[] };
        const authDoc = JSON.parse(authDocBytes.toString('utf8')) as { latestRecordHash?: string };
        const entries = (log.records ?? []).slice().sort((a, b) => Number(a.sequence) - Number(b.sequence));
        let prevHash: string | null = null;
        let headRecord: { sequence?: string; state?: { skills?: { slug: string; certificateSha256: string; status?: string }[]; keys?: { keyId: string; status?: string }[] } } | null = null;
        let chainOk = entries.length > 0;
        for (let i = 0; i < entries.length; i++) {
          const stem = String(entries[i].sequence).padStart(4, '0');
          const [recBytes, sigBytes] = await Promise.all([loader.authorityRecordStem(stem), loader.authorityRecordStemSig?.(stem) ?? Promise.resolve(null)]);
          if (!recBytes) { chainOk = false; break; }
          const rec = JSON.parse(recBytes.toString('utf8')) as { sequence?: string; signingKeyId?: string; previousRecordHash?: { sha256?: string } | null; events?: { type?: string; slug?: string }[]; state?: { skills?: { slug: string; certificateSha256: string; status?: string }[] } };
          const recHash = digest('sha256', canonicalJson(rec));
          const linkOk = i === 0 ? rec.previousRecordHash == null : rec.previousRecordHash?.sha256 === prevHash;
          if (Number(rec.sequence) !== i || !linkOk || entries[i].recordHash !== recHash) { chainOk = false; break; }
          // Verify each record under ITS signing key by id (a retired key still verifies records it signed).
          let recKey = key;
          if (rec.signingKeyId && rec.signingKeyId !== key.keyId && loader.signingKeyById) {
            const rkBytes = await loader.signingKeyById(rec.signingKeyId);
            if (rkBytes) recKey = JSON.parse(rkBytes.toString('utf8')) as SigningKeyDocument;
          }
          if (sigBytes && !verifyCanonical(rec, sigBytes.toString('utf8'), recKey)) { chainOk = false; break; }
          prevHash = recHash;
          headRecord = rec;
        }
        if (!chainOk || !headRecord) {
          fail(REASON_CODES.AUTHORITY_MISMATCH, 'authorityRecord');
        } else if (authDoc.latestRecordHash !== prevHash) {
          fail(REASON_CODES.AUTHORITY_MISMATCH, 'authorityRecord');
        } else {
          const entry = headRecord.state?.skills?.find((s) => s.slug === cert.subjectId && s.certificateSha256 === sha256(certBytes));
          const keyEntry = headRecord.state?.keys?.find((k) => k.keyId === cert.signingKeyId);
          if (!entry) {
            fail(REASON_CODES.AUTHORITY_MISMATCH, 'authorityRecord');
          } else if (entry.status === 'revoked') {
            return (fail(REASON_CODES.REVOKED, 'authority'), baseFail('revoked', subject));
          } else if (keyEntry?.status === 'revoked') {
            return (fail(REASON_CODES.KEY_NOT_ACTIVE, 'authority'), baseFail('revoked', subject));
          } else {
            pass('authorityRecord');
            authoritySequence = headRecord.sequence ?? null;

            // ---- Transparency log (docs/skills/standard/03 — Option B): verify the signed tree head, the
            //      head record's Merkle inclusion, the STH trust policy, and (if pinned) the consistency proof.
            //      Additive: if no STH is served, the chain walk above already established the verdict. ----
            if (loader.authoritySth) {
              const sthBytes = await loader.authoritySth();
              if (!sthBytes) {
                evidence.authoritySth = 'skipped';
              } else {
                try {
                  const sth = JSON.parse(sthBytes.toString('utf8')) as {
                    treeSize?: string;
                    rootHash?: string;
                    latestRecordHash?: string;
                    signatures?: { role?: string; signingKeyId?: string; signingKeyUrl?: string; signature?: string }[];
                    anchors?: { type?: string }[];
                  };
                  const policy = {
                    minAuthoritySigs: options.trustPolicy?.minAuthoritySigs ?? 1,
                    minWitnessSigs: options.trustPolicy?.minWitnessSigs ?? 0,
                    requireAnchor: options.trustPolicy?.requireAnchor ?? false,
                  };
                  // Signed core = STH minus `signatures` + `anchors` (so witnesses/anchors append without re-signing).
                  const core: Record<string, unknown> = { ...sth };
                  delete core.signatures;
                  delete core.anchors;
                  let authValid = 0;
                  let witnessValid = 0;
                  for (const s of sth.signatures ?? []) {
                    if (!s.signature) continue;
                    // Resolve the signer's key. Witnesses (docs/skills/standard/11) carry their own signingKeyUrl
                    // and may live on another domain → resolve by URL; the authority key resolves by id as before.
                    let sKey: SigningKeyDocument | null = s.signingKeyId === key.keyId ? key : null;
                    if (!sKey && s.role === 'witness' && s.signingKeyUrl && loader.keyByUrl) {
                      const kb = await loader.keyByUrl(s.signingKeyUrl);
                      if (kb) sKey = JSON.parse(kb.toString('utf8')) as SigningKeyDocument;
                    }
                    if (!sKey && s.signingKeyId && loader.signingKeyById) {
                      const kb = await loader.signingKeyById(s.signingKeyId);
                      if (kb) sKey = JSON.parse(kb.toString('utf8')) as SigningKeyDocument;
                    }
                    if (sKey && sKey.status !== 'revoked' && verifyCanonical(core, s.signature, sKey)) {
                      if (s.role === 'witness') witnessValid += 1;
                      else if (s.role === 'authority') authValid += 1;
                    }
                  }
                  // External-anchor check is structural for now (verifyAnchor); requireAnchor fails closed until live.
                  const anchorOk = !policy.requireAnchor || (await verifyAnchor(sth.anchors ?? [], sth.rootHash ?? ''));
                  const headBound = sth.treeSize === String(entries.length) && sth.latestRecordHash === prevHash;
                  let inclusionOk = false;
                  if (loader.authorityInclusionProof && sth.treeSize && sth.rootHash) {
                    const headIndex = entries.length - 1;
                    const pb = await loader.authorityInclusionProof(sth.treeSize, headIndex);
                    if (pb) {
                      const proof = JSON.parse(pb.toString('utf8')) as { auditPath?: string[] };
                      inclusionOk = verifyInclusion(leafHash(canonicalJson(headRecord)), headIndex, entries.length, proof.auditPath ?? [], sth.rootHash);
                    }
                  }
                  if (authValid < policy.minAuthoritySigs || witnessValid < policy.minWitnessSigs || !anchorOk) {
                    fail(REASON_CODES.STH_SIGNATURE_INVALID, 'authoritySth');
                  } else if (!headBound) {
                    fail(REASON_CODES.AUTHORITY_MISMATCH, 'authoritySth');
                  } else if (!inclusionOk) {
                    fail(REASON_CODES.INCLUSION_PROOF_INVALID, 'authoritySth');
                  } else {
                    pass('authoritySth');
                  }

                  // STH pinning (scaffolding #3): prove the current STH append-only EXTENDS the pinned one.
                  if (options.pinnedSth && sth.rootHash && sth.treeSize) {
                    const fromSize = Number(options.pinnedSth.treeSize);
                    let consistencyOk = fromSize === entries.length && options.pinnedSth.rootHash === sth.rootHash;
                    if (!consistencyOk && loader.authorityConsistencyProof) {
                      const cb = await loader.authorityConsistencyProof(sth.treeSize, fromSize);
                      if (cb) {
                        const cp = JSON.parse(cb.toString('utf8')) as { proof?: string[] };
                        consistencyOk = verifyConsistency(fromSize, entries.length, options.pinnedSth.rootHash, sth.rootHash, cp.proof ?? []);
                      }
                    }
                    if (consistencyOk) pass('authorityConsistency');
                    else fail(REASON_CODES.CONSISTENCY_PROOF_INVALID, 'authorityConsistency');
                  }
                } catch {
                  fail(REASON_CODES.INVALID_SCHEMA, 'authoritySth');
                }
              }
            }
          }
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
