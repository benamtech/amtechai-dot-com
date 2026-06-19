import { createHash, createPrivateKey, createPublicKey, sign, verify, type KeyObject } from 'node:crypto';

export const SIGNED_ARTIFACT_SCHEMA = 'https://amtechai.com/schemas/amtech-signed-artifact-v1.json';
export const SIGNING_KEY_URL = 'https://amtechai.com/.well-known/amtech-signing-key.json';

export type SignedSubjectType = 'skill' | 'content' | 'message' | 'repo-update' | 'status';

export type ArtifactCertificate = {
  schemaVersion: 'amtech-signed-artifact/v1';
  certificateId: string;
  subjectType: SignedSubjectType;
  subjectId: string;
  owner: { name: string; url: string };
  canonicalUrl?: string;
  repository?: { url: string; commit: string; path: string };
  version?: string;
  digests: { sha256: string; sha3_512: string };
  issuedAt: string;
  expiresAt?: string;
  issuer: { name: string; url: string };
  signingKeyId: string;
  signingKeyUrl: string;
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

export function verifyCertificate(certificate: ArtifactCertificate, signature: string, key: SigningKeyDocument): boolean {
  if (certificate.signingKeyId !== key.keyId || key.status !== 'active') return false;
  return verify(null, Buffer.from(canonicalJson(certificate)), createPublicKey(key.publicKeyPem), Buffer.from(signature.trim(), 'base64url'));
}

export function certificateId(type: SignedSubjectType, subjectId: string, sha3_512: string): string {
  return `amtech:${type}:${subjectId}:${sha3_512.slice(0, 24)}`;
}
