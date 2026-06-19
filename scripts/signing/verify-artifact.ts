import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { digest, verifyCertificate, type ArtifactCertificate, type SigningKeyDocument } from './amtech-signing.ts';

function arg(name: string): string {
  const index = process.argv.indexOf(`--${name}`);
  const value = index >= 0 ? process.argv[index + 1] : undefined;
  if (!value) throw new Error(`Missing --${name}.`);
  return value;
}

const artifact = await readFile(resolve(arg('artifact')));
const certificate = JSON.parse(await readFile(resolve(arg('certificate')), 'utf8')) as ArtifactCertificate;
const signature = await readFile(resolve(arg('signature')), 'utf8');
const key = JSON.parse(await readFile(resolve(arg('key')), 'utf8')) as SigningKeyDocument;
const errors: string[] = [];
if (!verifyCertificate(certificate, signature, key)) errors.push('Ed25519 signature is invalid.');
if (digest('sha256', artifact) !== certificate.digests.sha256) errors.push('SHA-256 digest mismatch.');
if (digest('sha3-512', artifact) !== certificate.digests.sha3_512) errors.push('SHA3-512 digest mismatch.');
if (certificate.expiresAt && Date.parse(certificate.expiresAt) <= Date.now()) errors.push('Certificate is expired.');
if (errors.length) {
  console.error(JSON.stringify({ valid: false, certificateId: certificate.certificateId, errors }, null, 2));
  process.exit(1);
}
console.log(JSON.stringify({ valid: true, certificateId: certificate.certificateId, subjectType: certificate.subjectType, subjectId: certificate.subjectId }, null, 2));
