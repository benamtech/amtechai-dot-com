import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import {
  certificateId,
  digest,
  loadPrivateKey,
  signCertificate,
  type ArtifactCertificate,
  type SignedSubjectType,
  type SigningKeyDocument,
} from './amtech-signing.ts';

function arg(name: string, required = true): string | undefined {
  const index = process.argv.indexOf(`--${name}`);
  const value = index >= 0 ? process.argv[index + 1] : undefined;
  if (required && !value) throw new Error(`Missing --${name}.`);
  return value;
}

const type = arg('type') as SignedSubjectType;
if (!['content', 'message', 'repo-update', 'status', 'skill'].includes(type)) throw new Error(`Unsupported --type: ${type}`);
const subjectId = arg('id')!;
const input = resolve(arg('file')!);
const output = resolve(arg('output')!);
const content = await readFile(input);
const sha256 = digest('sha256', content);
const sha3_512 = digest('sha3-512', content);
const key = JSON.parse(await readFile(resolve('src/lib/skills/certificates/amtech-signing-key.json'), 'utf8')) as SigningKeyDocument;
const privateKey = loadPrivateKey(await readFile(resolve(process.env.AMTECH_SIGNING_PRIVATE_KEY_FILE ?? '.amtech/signing-private-key.pem'), 'utf8'));
const certificate: ArtifactCertificate = {
  schemaVersion: 'amtech-signed-artifact/v1',
  certificateId: certificateId(type, subjectId, sha3_512),
  subjectType: type,
  subjectId,
  owner: { name: arg('owner', false) ?? 'AMTECH AI', url: arg('owner-url', false) ?? 'https://amtechai.com' },
  canonicalUrl: arg('url', false),
  version: arg('version', false),
  digests: { sha256, sha3_512 },
  issuedAt: new Date().toISOString(),
  expiresAt: arg('expires', false),
  issuer: key.issuer,
  signingKeyId: key.keyId,
  signingKeyUrl: 'https://amtechai.com/.well-known/amtech-signing-key.json',
};
await mkdir(output, { recursive: true });
await writeFile(resolve(output, 'certificate.json'), `${JSON.stringify(certificate, null, 2)}\n`);
await writeFile(resolve(output, 'certificate.sig'), `${signCertificate(certificate, privateKey)}\n`);
console.log(`Signed ${input} as ${certificate.certificateId}.`);
