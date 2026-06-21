import { createHash, createPrivateKey, createPublicKey, sign, verify, type KeyObject } from 'node:crypto';

export const SIGNED_ARTIFACT_SCHEMA = 'https://amtechai.com/schemas/amtech-signed-artifact-v2.json';
export const SIGNING_KEY_URL = 'https://amtechai.com/.well-known/amtech-signing-key.json';

export type SignedSubjectType = 'skill' | 'content' | 'message' | 'repo-update' | 'status';

/**
 * Trust tiers (docs/skills/standard/02 + the ladder in 09). Ordered weakest→strongest.
 * `replay-verified` = the deterministic-recompute rung (method `graph-replay`), the "missing middle"
 * any party re-runs client-side. `behavior-verified` (live-model) is a reserved v2 non-goal;
 * `proof-verified` (zk-compute) is a documented horizon, not a runtime tier.
 */
export type TrustTier =
  | 'signed'
  | 'structure-verified'
  | 'amtech-reviewed'
  | 'replay-verified'
  | 'behavior-verified';

export type EvidenceRef = { url: string; sha256: string };

/**
 * The assurance predicate over the certificate's subject (the skill archive). All values are
 * strings/objects/arrays-of-strings — NO JSON numbers in the signed payload (RFC 8785 / I-JSON safety).
 */
export type SkillAttestations = {
  policyVersion: string;
  trustTier: TrustTier;
  permissions: {
    filesystem: 'none' | 'read' | 'read-write' | 'read-write-optional';
    network: 'none' | 'outbound' | 'bidirectional';
    secrets: 'none' | 'declared';
    /** Exact list of executables shipped in the archive — signer-verified against archive contents. */
    scripts: string[];
  };
  /** Offline contract-conformance (method:'static-contract' now; 'live-model' reserved). Not a live AI test. */
  conformance: {
    suite: string;
    suiteVersion: string;
    method: 'static-contract' | 'live-model';
    result: 'pass' | 'fail';
    ranAt: string;
    evidence: EvidenceRef;
  };
  /** AMTECH publisher/reviewer attestation. Required for trustTier 'amtech-reviewed'. */
  review?: {
    reviewer: { type: 'human'; id: string; name: string };
    result: 'approved' | 'rejected' | 'waived';
    reviewedAt: string;
    policyVersion: string;
    evidence: EvidenceRef;
  };
};

export type ArtifactCertificate = {
  schemaVersion: 'amtech-signed-artifact/v1' | 'amtech-signed-artifact/v2';
  certificateId: string;
  subjectType: SignedSubjectType;
  subjectId: string;
  owner: { name: string; url: string };
  canonicalUrl?: string;
  /**
   * Source location bound by the signed cert: {url, path}. The cross-repo anchor is `sourcePackage` (the byte
   * digest, docs/skills/standard/02) — NOT a git commit. The release commit is recorded only as provenance in
   * the manifest/authority at build time, so a release is atomic (one registry commit) with no pending-resign.
   * There is deliberately no `commit` in the signed payload (no dual-shape to spoof against).
   */
  repository?: { url: string; path: string };
  version?: string;
  digests: { sha256: string; sha3_512: string };
  /** v2: digest over the canonical source-package payload — the cross-repo verification anchor. */
  sourcePackage?: { sha256: string; sha3_512: string };
  issuedAt: string;
  expiresAt?: string;
  issuer: { name: string; url: string };
  signingKeyId: string;
  signingKeyUrl: string;
  /** v2: assurance predicate (tested/reviewed under a policy). Absent on v1 certs (tier 'signed'). */
  attestations?: SkillAttestations;
};

export type SigningKeyDocument = {
  schemaVersion: 'amtech-signing-key/v1';
  issuer: { name: string; url: string };
  keyId: string;
  algorithm: 'Ed25519';
  publicKeyPem: string;
  fingerprint: { sha256: string; sha3_512: string };
  validFrom: string;
  status: 'active' | 'retired' | 'revoked';
  purposes: SignedSubjectType[];
};

export function digest(algorithm: 'sha256' | 'sha3-512', content: Buffer | string): string {
  return createHash(algorithm).update(content).digest('hex');
}

/** Deterministic JSON for the certificate's JSON-safe data model (RFC 8785-compatible subset). */
export function canonicalJson(value: unknown): string {
  if (value === null || typeof value === 'boolean' || typeof value === 'string') return JSON.stringify(value);
  if (typeof value === 'number') {
    if (!Number.isFinite(value)) throw new Error('Canonical JSON does not allow non-finite numbers.');
    return JSON.stringify(value);
  }
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(',')}]`;
  if (typeof value === 'object') {
    const record = value as Record<string, unknown>;
    return `{${Object.keys(record)
      .sort()
      .filter((key) => record[key] !== undefined)
      .map((key) => `${JSON.stringify(key)}:${canonicalJson(record[key])}`)
      .join(',')}}`;
  }
  throw new Error(`Unsupported canonical JSON value: ${typeof value}`);
}

/**
 * Canonical source-package digest — the cross-repo verification anchor (docs/skills/standard/02).
 * Both the website (over src/lib/skills/source/<slug>/) and the registry (over skills/<slug>/) compute
 * this identically, so the SAME signed certificate verifies in both repos. Construction: array of
 * { path, size, contentBase64 } sorted by `path` in UTF-16 code-unit order, serialized with
 * canonicalJson (keys sorted), digested. `registry/validate.mjs` mirrors this exactly.
 */
export function packagePayloadDigest(files: { path: string; content: Buffer }[]): { sha256: string; sha3_512: string } {
  const sorted = [...files].sort((a, b) => (a.path < b.path ? -1 : a.path > b.path ? 1 : 0));
  const payload = Buffer.from(
    canonicalJson(sorted.map((file) => ({ path: file.path, size: file.content.length, contentBase64: file.content.toString('base64') }))),
    'utf8',
  );
  return { sha256: digest('sha256', payload), sha3_512: digest('sha3-512', payload) };
}

export function publicKeyFingerprint(publicKey: KeyObject): { sha256: string; sha3_512: string } {
  const der = publicKey.export({ type: 'spki', format: 'der' });
  return { sha256: digest('sha256', der), sha3_512: digest('sha3-512', der) };
}

export function signingKeyDocument(publicKey: KeyObject, validFrom: string): SigningKeyDocument {
  const fingerprint = publicKeyFingerprint(publicKey);
  return {
    schemaVersion: 'amtech-signing-key/v1',
    issuer: { name: 'AMTECH AI', url: 'https://amtechai.com' },
    keyId: `ed25519:${fingerprint.sha256.slice(0, 24)}`,
    algorithm: 'Ed25519',
    publicKeyPem: publicKey.export({ type: 'spki', format: 'pem' }).toString(),
    fingerprint,
    validFrom,
    status: 'active',
    purposes: ['skill', 'content', 'message', 'repo-update', 'status'],
  };
}

export function loadPrivateKey(pem: string): KeyObject {
  const key = createPrivateKey(pem);
  if (key.asymmetricKeyType !== 'ed25519') throw new Error('AMTECH signing key must be Ed25519.');
  return key;
}

export function derivePublicKey(privateKey: KeyObject): KeyObject {
  return createPublicKey(privateKey);
}

export function signCertificate(certificate: ArtifactCertificate, privateKey: KeyObject): string {
  return sign(null, Buffer.from(canonicalJson(certificate)), privateKey).toString('base64url');
}

/** Generic Ed25519 signature over any canonical-JSON-serializable value (authority records, etc.). */
export function signCanonical(value: unknown, privateKey: KeyObject): string {
  return sign(null, Buffer.from(canonicalJson(value)), privateKey).toString('base64url');
}

/** Verify a generic canonical-JSON signature against a published key document (key status checked by caller). */
export function verifyCanonical(value: unknown, signature: string, key: SigningKeyDocument): boolean {
  return verify(null, Buffer.from(canonicalJson(value)), createPublicKey(key.publicKeyPem), Buffer.from(signature.trim(), 'base64url'));
}

export function verifyCertificate(certificate: ArtifactCertificate, signature: string, key: SigningKeyDocument): boolean {
  if (certificate.signingKeyId !== key.keyId || key.status !== 'active') return false;
  return verify(null, Buffer.from(canonicalJson(certificate)), createPublicKey(key.publicKeyPem), Buffer.from(signature.trim(), 'base64url'));
}

export function certificateId(type: SignedSubjectType, subjectId: string, sha3_512: string): string {
  return `amtech:${type}:${subjectId}:${sha3_512.slice(0, 24)}`;
}
