/**
 * AMTECH signing-key ROTATION (docs/skills/standard/03 §Key lifecycle). Generates a fresh Ed25519 key,
 * archives the prior public key document as `retired` under src/lib/skills/certificates/keys/<keyId>.json,
 * and installs the new key as the active signer. The operator then re-runs `npm run skills:sign`, which
 * re-signs every certificate + the authority record with the new key and — because the active keyId changed —
 * appends a `key-rotate` event to the authority chain (sign-authority detects prevActive != nextActive).
 *
 * Single-key serving means old certificates are re-signed under the new key; multi-key-by-keyId historical
 * serving is deferred (03 "Future"). This is a maintenance command, never part of the normal pipeline.
 */
import { generateKeyPairSync } from 'node:crypto';
import { chmod, mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { derivePublicKey, loadPrivateKey, signingKeyDocument, type SigningKeyDocument } from './amtech-signing.ts';

const privatePath = resolve(process.env.AMTECH_SIGNING_PRIVATE_KEY_FILE ?? '.amtech/signing-private-key.pem');
const publicPath = resolve('src/lib/skills/certificates/amtech-signing-key.json');
const keysArchiveDir = resolve('src/lib/skills/certificates/keys');

if (!process.argv.includes('--yes')) {
  console.error('rotate-key: re-signs EVERY certificate + the authority chain under a new key. Re-run with --yes to proceed, then run: npm run skills:sign');
  process.exit(2);
}

// Archive the current key document as retired (for the audit trail; the chain records the rotation event).
const prior = JSON.parse(await readFile(publicPath, 'utf8')) as SigningKeyDocument;
await mkdir(keysArchiveDir, { recursive: true });
await writeFile(resolve(keysArchiveDir, `${prior.keyId.replace(/[:/]/g, '_')}.json`), `${JSON.stringify({ ...prior, status: 'retired' }, null, 2)}\n`, 'utf8');

// Generate + install the new active key.
const { privateKey } = generateKeyPairSync('ed25519');
const privatePem = privateKey.export({ type: 'pkcs8', format: 'pem' }).toString();
const newDoc = signingKeyDocument(derivePublicKey(loadPrivateKey(privatePem)), new Date().toISOString());
await mkdir(dirname(privatePath), { recursive: true });
await writeFile(privatePath, privatePem, { encoding: 'utf8', mode: 0o600 });
await chmod(privatePath, 0o600);
await writeFile(publicPath, `${JSON.stringify(newDoc, null, 2)}\n`, 'utf8');
console.log(`Rotated: retired ${prior.keyId} → new active ${newDoc.keyId}. Now run: npm run skills:sign (re-signs all + appends a key-rotate record).`);
