/**
 * AMTECH anchor BROADCAST + receipts ledger (docs/skills/standard/11, path A).
 *
 * The broadcast MESSAGE is the registry-state certificate (sign-anchor.ts) — the authority log is the only
 * append-only chain, so this is NOT a second "megahash". This command does the deliberate act of broadcasting:
 * it appends ONE entry to an append-only, signed **receipts ledger** (`/.well-known/authority/receipts.json`)
 * recording `{ this signed registry-state cert + its tree head } → { where it was externally anchored }`. The
 * `receipts[]` slot is where a Bitcoin / OpenTimestamps / Nockchain / third-party-witness receipt lands once
 * off-site broadcasting is live (the `ANCHOR_VERIFIERS` "breaker" then checks it). Ordering comes from the tree
 * size, not a hash-chain — the ledger is a flat registry of broadcasts, signed by the domain key.
 *
 * Idempotent: re-broadcasting the same root is a no-op. Run: `npm run skills:broadcast` (after skills:sign),
 * then `npm run skills:build` to publish.
 */
import { readFile, writeFile } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { resolve } from 'node:path';
import {
  derivePublicKey,
  digest,
  loadPrivateKey,
  signCanonical,
  signingKeyDocument,
  verifyCertificate,
  SIGNING_KEY_URL,
  type ArtifactCertificate,
  type SigningKeyDocument,
} from './amtech-signing.ts';
import { SKILL_SITE_ORIGIN, SKILL_AUTHORITY_URL } from '../../src/lib/skills/registry.ts';

const execFileP = promisify(execFile);
const privatePath = resolve(process.env.AMTECH_SIGNING_PRIVATE_KEY_FILE ?? '.amtech/signing-private-key.pem');
const keyPath = resolve('src/lib/skills/certificates/amtech-signing-key.json');
const privateKey = loadPrivateKey(await readFile(privatePath, 'utf8'));
const keyDoc = JSON.parse(await readFile(keyPath, 'utf8')) as SigningKeyDocument;
const derived = signingKeyDocument(derivePublicKey(privateKey), keyDoc.validFrom);
if (derived.keyId !== keyDoc.keyId || derived.fingerprint.sha256 !== keyDoc.fingerprint.sha256) {
  throw new Error('Private signing key does not match committed AMTECH public key metadata.');
}

const authorityDir = resolve('src/lib/skills/authority');
const certBytes = await readFile(resolve(authorityDir, 'anchor/certificate.json')).catch(() => null);
const certSig = await readFile(resolve(authorityDir, 'anchor/certificate.sig'), 'utf8').catch(() => null);
const stateBytes = await readFile(resolve(authorityDir, 'anchor/state.json')).catch(() => null);
const sthBytes = await readFile(resolve(authorityDir, 'sth.json')).catch(() => null);
if (!certBytes || !certSig || !stateBytes || !sthBytes) {
  console.error('broadcast-anchor: missing anchor certificate / state.json / sth.json — run `npm run skills:sign` first.');
  process.exit(1);
}
const cert = JSON.parse(certBytes.toString('utf8')) as ArtifactCertificate;
const sth = JSON.parse(sthBytes.toString('utf8')) as { treeSize?: string; rootHash?: string };

// The broadcast message must be a valid signed certificate before we record broadcasting it.
if (!verifyCertificate(cert, certSig, keyDoc)) {
  console.error('broadcast-anchor: registry-state certificate does not verify — refusing to broadcast.');
  process.exit(1);
}

type Receipt = { type: string; ref: string; target: string; anchoredAt: string };
type LedgerEntry = {
  sequence: string;
  broadcastAt: string;
  certificateId: string;
  treeSize: string;
  rootHash: string;
  stateSha256: string;
  certSha256: string;
  anchorUrl: string;
  receipts: Receipt[];
};
type Ledger = {
  schemaVersion: 'amtech-anchor-receipts/v1';
  authorityUrl: string;
  note: string;
  updatedAt: string;
  entries: LedgerEntry[];
  signatures?: { role: string; signingKeyId: string; signingKeyUrl: string; signature: string }[];
};

const ledgerPath = resolve(authorityDir, 'receipts.json');
const ledger: Ledger = JSON.parse((await readFile(ledgerPath, 'utf8').catch(() => 'null')) as string) ?? {
  schemaVersion: 'amtech-anchor-receipts/v1',
  authorityUrl: SKILL_AUTHORITY_URL,
  note: 'Append-only ledger of broadcast registry-state certificates and their external anchor receipts (Bitcoin/OpenTimestamps/Nockchain/witness). Ordering is by tree size; the authority log is the chain — this is not a second hash-chain.',
  updatedAt: '',
  entries: [],
};

const latest = ledger.entries.at(-1);
if (latest && latest.rootHash === sth.rootHash) {
  console.log(`Broadcast unchanged — root ${sth.rootHash?.slice(0, 16)}… already broadcast at entry ${latest.sequence} (${latest.broadcastAt}). No-op.`);
  process.exit(0);
}

const entry: LedgerEntry = {
  sequence: String(ledger.entries.length),
  broadcastAt: new Date().toISOString(),
  certificateId: cert.certificateId,
  treeSize: sth.treeSize ?? '0',
  rootHash: sth.rootHash ?? '',
  stateSha256: digest('sha256', stateBytes),
  certSha256: digest('sha256', certBytes),
  anchorUrl: `${SKILL_SITE_ORIGIN}/.well-known/authority/anchor/certificate.json`,
  receipts: [], // external anchor receipts appended when off-site broadcasting (Bitcoin/OTS/Nockchain/witness) is live
};
ledger.entries.push(entry);
ledger.updatedAt = entry.broadcastAt;

const { signatures: _drop, ...core } = ledger;
ledger.signatures = [{ role: 'authority', signingKeyId: keyDoc.keyId, signingKeyUrl: SIGNING_KEY_URL, signature: signCanonical(core, privateKey) }];
await writeFile(ledgerPath, `${JSON.stringify(ledger, null, 2)}\n`, 'utf8');

let pgp = 'skipped (no AMTECH_ANCHOR_PGP_KEY / gpg)';
const pgpKey = process.env.AMTECH_ANCHOR_PGP_KEY;
if (pgpKey) {
  try {
    await execFileP('gpg', ['--batch', '--yes', '--armor', '--local-user', pgpKey, '--detach-sign', '--output', resolve(authorityDir, 'receipts.asc'), ledgerPath]);
    pgp = `gpg-signed by ${pgpKey}`;
  } catch (e) {
    pgp = `gpg signing failed: ${e instanceof Error ? e.message : String(e)}`;
  }
}

console.log(`Broadcast entry ${entry.sequence}: ${entry.certificateId}`);
console.log(`  tree size ${entry.treeSize}, root ${entry.rootHash.slice(0, 16)}…, at ${entry.broadcastAt}. Ledger signed (PGP: ${pgp}).`);
console.log(`  receipts[] empty — append a Bitcoin/OpenTimestamps/Nockchain/witness receipt when off-site broadcasting is live.`);
console.log(`Publish with: npm run skills:build  →  ${SKILL_SITE_ORIGIN}/.well-known/authority/receipts.json`);
