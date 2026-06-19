import { generateKeyPairSync } from 'node:crypto';
import { chmod, mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { derivePublicKey, loadPrivateKey, signingKeyDocument } from './amtech-signing.ts';

const privatePath = resolve(process.env.AMTECH_SIGNING_PRIVATE_KEY_FILE ?? '.amtech/signing-private-key.pem');
const publicPath = resolve('src/lib/skills/certificates/amtech-signing-key.json');
const { privateKey } = generateKeyPairSync('ed25519');
const privatePem = privateKey.export({ type: 'pkcs8', format: 'pem' }).toString();
const validFrom = new Date().toISOString();
const keyDoc = signingKeyDocument(derivePublicKey(loadPrivateKey(privatePem)), validFrom);

await mkdir(dirname(privatePath), { recursive: true });
await mkdir(dirname(publicPath), { recursive: true });
await writeFile(privatePath, privatePem, { encoding: 'utf8', mode: 0o600 });
await chmod(privatePath, 0o600);
await writeFile(publicPath, `${JSON.stringify(keyDoc, null, 2)}\n`, 'utf8');
console.log(`Generated ${keyDoc.keyId}. Private key: ${privatePath}; public metadata: ${publicPath}.`);
