import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import {
  certificateId,
  derivePublicKey,
  digest,
  loadPrivateKey,
  signCertificate,
  signingKeyDocument,
  type ArtifactCertificate,
  type SigningKeyDocument,
} from './amtech-signing.ts';
import { skillDefinitions, skillUrl } from '../../src/lib/skills/registry.ts';

const privatePath = resolve(process.env.AMTECH_SIGNING_PRIVATE_KEY_FILE ?? '.amtech/signing-private-key.pem');
const keyPath = resolve('src/lib/skills/certificates/amtech-signing-key.json');
const privateKey = loadPrivateKey(await readFile(privatePath, 'utf8'));
const existingKey = JSON.parse(await readFile(keyPath, 'utf8')) as SigningKeyDocument;
const derivedKey = signingKeyDocument(derivePublicKey(privateKey), existingKey.validFrom);
if (derivedKey.keyId !== existingKey.keyId || derivedKey.fingerprint.sha256 !== existingKey.fingerprint.sha256) {
  throw new Error('Private signing key does not match committed AMTECH public key metadata.');
}

for (const skill of skillDefinitions) {
  const archiveName = `${skill.slug}-${skill.version}.zip`;
  const archive = await readFile(resolve(`public/skills/${skill.slug}/${archiveName}`));
  const sha256 = digest('sha256', archive);
  const sha3_512 = digest('sha3-512', archive);
  const certificate: ArtifactCertificate = {
    schemaVersion: 'amtech-signed-artifact/v1',
    certificateId: certificateId('skill', skill.slug, sha3_512),
    subjectType: 'skill',
    subjectId: skill.slug,
    owner: { name: 'AMTECH AI', url: 'https://amtechai.com' },
    canonicalUrl: skillUrl(skill),
    repository: { url: skill.repository.url, commit: skill.repository.commit, path: skill.repository.path },
    version: skill.version,
    digests: { sha256, sha3_512 },
    issuedAt: `${skill.updated}T00:00:00.000Z`,
    issuer: existingKey.issuer,
    signingKeyId: existingKey.keyId,
    signingKeyUrl: 'https://amtechai.com/.well-known/amtech-signing-key.json',
  };
  const base = resolve(`src/lib/skills/certificates/${skill.slug}`);
  await mkdir(base, { recursive: true });
  await writeFile(resolve(base, 'certificate.json'), `${JSON.stringify(certificate, null, 2)}\n`, 'utf8');
  await writeFile(resolve(base, 'certificate.sig'), `${signCertificate(certificate, privateKey)}\n`, 'utf8');
  console.log(`Signed ${skill.slug}: ${certificate.certificateId}`);
}

console.log('Run npm run skills:build to publish the signed certificates.');
