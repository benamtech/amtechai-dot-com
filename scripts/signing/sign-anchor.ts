/**
 * AMTECH authority-anchor broadcast (docs/skills/standard/11). The "broadcast endpoint" amtechai.com serves
 * for the latest signed tree head — built ON the existing AMTECH standards, not a new format:
 *
 *   It is an **AMTECH Signed Artifact certificate** (amtech-signed-artifact/v2, `subjectType: 'status'`) whose
 *   SUBJECT is the signed tree head (`sth.json`). The cert binds the STH bytes (SHA-256 + SHA3-512), is
 *   timestamped (`issuedAt`), names the canonical anchor URL, and is Ed25519-signed by the same domain key —
 *   so it verifies with the SAME machinery as every skill certificate (`verifyCertificate`, `artifact:verify`).
 *
 * This is the canonical, scheme-locked, signed, timestamped object that incorporates the STH and is ready to
 * be broadcast/anchored to an external system (Bitcoin, Nockchain, a third-party witness). We emit + serve it;
 * broadcasting is a later step that appends receipts. Runs AFTER sign-authority (needs sth.json). Idempotent:
 * if the anchor cert already binds the current STH digest, it re-signs nothing.
 *
 * Optional PGP co-signature: if `gpg` is available AND `AMTECH_ANCHOR_PGP_KEY` names a secret key, a detached
 * ASCII-armored signature over the certificate bytes is emitted alongside (certificate.asc). Wired, not required.
 */
import { readFile, mkdir, writeFile, rm } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { resolve } from 'node:path';
import {
  certificateId,
  derivePublicKey,
  digest,
  loadPrivateKey,
  signCertificate,
  signingKeyDocument,
  SIGNING_KEY_URL,
  type ArtifactCertificate,
  type SigningKeyDocument,
} from './amtech-signing.ts';
import { SKILL_SITE_ORIGIN } from '../../src/lib/skills/registry.ts';

const execFileP = promisify(execFile);
const privatePath = resolve(process.env.AMTECH_SIGNING_PRIVATE_KEY_FILE ?? '.amtech/signing-private-key.pem');
const keyPath = resolve('src/lib/skills/certificates/amtech-signing-key.json');
const privateKey = loadPrivateKey(await readFile(privatePath, 'utf8'));
const existingKey = JSON.parse(await readFile(keyPath, 'utf8')) as SigningKeyDocument;
const derivedKey = signingKeyDocument(derivePublicKey(privateKey), existingKey.validFrom);
if (derivedKey.keyId !== existingKey.keyId || derivedKey.fingerprint.sha256 !== existingKey.fingerprint.sha256) {
  throw new Error('Private signing key does not match committed AMTECH public key metadata.');
}

const authorityDir = resolve('src/lib/skills/authority');
const sthPath = resolve(authorityDir, 'sth.json');
const sthBytes = await readFile(sthPath).catch(() => null);
if (!sthBytes) {
  console.error('sign-anchor: no sth.json — run sign-authority first.');
  process.exit(1);
}
const sth = JSON.parse(sthBytes.toString('utf8')) as { treeSize?: string; rootHash?: string; timestamp?: string };

const anchorDir = resolve(authorityDir, 'anchor');
const sha256 = digest('sha256', sthBytes);
const sha3_512 = digest('sha3-512', sthBytes);

// Idempotent: if the published anchor cert already binds this exact STH, do nothing.
const existing = await readFile(resolve(anchorDir, 'certificate.json'), 'utf8').catch(() => null);
if (existing && (JSON.parse(existing) as ArtifactCertificate).digests?.sha256 === sha256) {
  console.log(`Anchor unchanged — status certificate already binds STH ${sha256.slice(0, 16)}… (no re-sign).`);
  process.exit(0);
}

const anchorUrl = `${SKILL_SITE_ORIGIN}/.well-known/authority/anchor/certificate.json`;
const certificate: ArtifactCertificate = {
  schemaVersion: 'amtech-signed-artifact/v2',
  certificateId: certificateId('status', 'authority-sth', sha3_512),
  subjectType: 'status',
  subjectId: 'authority-sth',
  owner: { name: 'AMTECH AI', url: SKILL_SITE_ORIGIN },
  canonicalUrl: anchorUrl,
  // The subject is the signed tree head; `version` carries the tree size so an anchor names a specific log state.
  version: sth.treeSize ?? '0',
  digests: { sha256, sha3_512 },
  // Deterministic timestamp from the STH it attests (reproducible builds; the STH already stamps release time).
  issuedAt: sth.timestamp ?? new Date(0).toISOString(),
  issuer: existingKey.issuer,
  signingKeyId: existingKey.keyId,
  signingKeyUrl: SIGNING_KEY_URL,
};

await rm(anchorDir, { recursive: true, force: true });
await mkdir(anchorDir, { recursive: true });
await writeFile(resolve(anchorDir, 'certificate.json'), `${JSON.stringify(certificate, null, 2)}\n`, 'utf8');
const certBytes = await readFile(resolve(anchorDir, 'certificate.json'));
await writeFile(resolve(anchorDir, 'certificate.sig'), `${signCertificate(certificate, privateKey)}\n`, 'utf8');

// Optional PGP co-signature over the certificate bytes (wired; emitted only if gpg + a key are available).
let pgp = 'skipped (no AMTECH_ANCHOR_PGP_KEY / gpg)';
const pgpKey = process.env.AMTECH_ANCHOR_PGP_KEY;
if (pgpKey) {
  try {
    await execFileP('gpg', ['--batch', '--yes', '--armor', '--local-user', pgpKey, '--detach-sign', '--output', resolve(anchorDir, 'certificate.asc'), resolve(anchorDir, 'certificate.json')]);
    pgp = `gpg-signed by ${pgpKey}`;
  } catch (e) {
    pgp = `gpg signing failed: ${e instanceof Error ? e.message : String(e)}`;
  }
}

console.log(`Signed authority anchor ${certificate.certificateId} over STH treeSize ${sth.treeSize}, root ${sth.rootHash?.slice(0, 16)}… (PGP: ${pgp}).`);
console.log(`Verify with the standard tooling: npm run artifact:verify -- --artifact <sth.json> --certificate <anchor/certificate.json> --signature <anchor/certificate.sig> --key <amtech-signing-key.json>`);
