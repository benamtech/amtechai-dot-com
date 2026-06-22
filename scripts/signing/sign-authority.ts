/**
 * AMTECH authority-record signer (M4 — docs/skills/standard/03 + 07 G-M4).
 *
 * Maintains the immutable, hash-chained authority history. Each run computes the desired materialized
 * `state` (the published skill set + key statuses, with revocations applied) and compares it to the head
 * record's state: if UNCHANGED it appends nothing (idempotent — re-signing an unchanged release is a no-op);
 * if CHANGED it APPENDS a new record `N+1` chaining `previousRecordHash → sha256(canonicalJson(head))`, with
 * `events[]` describing the diff (skill-publish / skill-revoke / key-rotate / key-revoke). Existing records
 * are immutable and never rewritten. build-skills.ts publishes every record + log.json + the latest pointer.
 *
 * Mirrors sign-skills.ts: needs the release private key, re-derives + matches the committed public key, runs
 * AFTER sign-skills.ts. The catalog-root preimage is IDENTICAL to build-skills.computeCatalogRoot and
 * registry/validate.mjs (one value across all three).
 */
import { readFile, readdir, mkdir, writeFile, rm } from 'node:fs/promises';
import { resolve } from 'node:path';
import {
  canonicalJson,
  derivePublicKey,
  digest,
  loadPrivateKey,
  signCanonical,
  signingKeyDocument,
  SIGNING_KEY_URL,
  type SigningKeyDocument,
} from './amtech-signing.ts';
import { leafHash, merkleRoot, inclusionProof, consistencyProof } from '../../src/lib/skills/merkle.ts';
import { skillDefinitions, SKILL_AUTHORITY_URL } from '../../src/lib/skills/registry.ts';

const privatePath = resolve(process.env.AMTECH_SIGNING_PRIVATE_KEY_FILE ?? '.amtech/signing-private-key.pem');
const keyPath = resolve('src/lib/skills/certificates/amtech-signing-key.json');
const privateKey = loadPrivateKey(await readFile(privatePath, 'utf8'));
const existingKey = JSON.parse(await readFile(keyPath, 'utf8')) as SigningKeyDocument;
const derivedKey = signingKeyDocument(derivePublicKey(privateKey), existingKey.validFrom);
if (derivedKey.keyId !== existingKey.keyId || derivedKey.fingerprint.sha256 !== existingKey.fingerprint.sha256) {
  throw new Error('Private signing key does not match committed AMTECH public key metadata.');
}

type SkillState = { slug: string; version: string; certificateId: string; certificateSha256: string; trustTier: string; status: 'active' | 'revoked' };
type KeyState = { keyId: string; status: string; validFrom: string };
type AuthorityState = { catalogRoot: string; skills: SkillState[]; keys: KeyState[] };
type AuthorityEvent = Record<string, unknown> & { type: string };
type AuthorityRecord = {
  schemaVersion: 'amtech-authority-record/v1';
  sequence: string;
  previousRecordHash: { sha256: string } | null;
  issuedAt: string;
  authorityUrl: string;
  events: AuthorityEvent[];
  state: AuthorityState;
  signingKeyId: string;
  signingKeyUrl: string;
};

const recordsDir = resolve('src/lib/skills/authority/records');

// --- Revocation input (docs/skills/standard/03). Listing a slug/keyId appends a revoke event next run. ---
type Revocations = { asOf?: string | null; skills?: { slug: string; reason: string }[]; keys?: { keyId: string; reason: string }[] };
const revocations = JSON.parse(
  (await readFile(resolve('src/lib/skills/authority/revocations.json'), 'utf8').catch(() => '{}')) as string,
) as Revocations;
const revokedSkills = new Map((revocations.skills ?? []).map((r) => [r.slug, r.reason]));
const revokedKeys = new Map((revocations.keys ?? []).map((r) => [r.keyId, r.reason]));

// --- Desired materialized state from current certs + revocations. ---
const skills: SkillState[] = [];
for (const skill of skillDefinitions) {
  const certBytes = await readFile(resolve(`src/lib/skills/certificates/${skill.slug}/certificate.json`)).catch(() => null);
  if (!certBytes) throw new Error(`sign-authority: missing certificate for ${skill.slug}; run sign-skills first.`);
  const cert = JSON.parse(certBytes.toString('utf8')) as { certificateId?: string; version?: string; attestations?: { trustTier?: string } };
  skills.push({
    slug: skill.slug,
    version: cert.version ?? skill.version,
    certificateId: cert.certificateId ?? '',
    certificateSha256: digest('sha256', certBytes),
    trustTier: cert.attestations?.trustTier ?? 'signed',
    status: revokedSkills.has(skill.slug) ? 'revoked' : 'active',
  });
}
skills.sort((a, b) => (a.slug < b.slug ? -1 : a.slug > b.slug ? 1 : 0));

// Catalog root — over ALL published certs (revocation is an authority flag, not an unpublish), so it stays
// equal to build-skills.computeCatalogRoot + registry/validate.mjs.
const catalogRoot = digest('sha256', canonicalJson(skills.map((s) => ({ slug: s.slug, cert: s.certificateSha256 }))));

// --- Load the existing immutable chain; find the head. ---
const files = (await readdir(recordsDir).catch(() => [] as string[])).filter((f) => /^\d{4}\.json$/.test(f)).sort();
const chain: AuthorityRecord[] = [];
for (const f of files) chain.push(JSON.parse(await readFile(resolve(recordsDir, f), 'utf8')) as AuthorityRecord);
const head = chain.at(-1) ?? null;

// Carry forward prior keys: the current key is `active`; a superseded prior active becomes `retired`; any key
// listed in revocations becomes `revoked`. This records rotation + revocation in the materialized state.
const keysMap = new Map<string, KeyState>((head?.state.keys ?? []).map((k) => [k.keyId, { ...k }]));
keysMap.set(existingKey.keyId, { keyId: existingKey.keyId, status: 'active', validFrom: existingKey.validFrom });
for (const k of keysMap.values()) {
  if (k.keyId !== existingKey.keyId && k.status === 'active') k.status = 'retired';
  if (revokedKeys.has(k.keyId)) k.status = 'revoked';
}
const keys: KeyState[] = [...keysMap.values()].sort((a, b) => (a.keyId < b.keyId ? -1 : a.keyId > b.keyId ? 1 : 0));
const nextState: AuthorityState = { catalogRoot, skills, keys };

// --- Compute the diff events. ---
function skillPublish(s: SkillState): AuthorityEvent {
  return { type: 'skill-publish', slug: s.slug, version: s.version, certificateId: s.certificateId, certificateSha256: s.certificateSha256, trustTier: s.trustTier };
}
function diffEvents(prev: AuthorityState | null, next: AuthorityState): AuthorityEvent[] {
  if (!prev) return [{ type: 'genesis' }, ...next.skills.map(skillPublish)];
  const events: AuthorityEvent[] = [];
  const prevSkills = new Map(prev.skills.map((s) => [s.slug, s]));
  for (const s of next.skills) {
    const p = prevSkills.get(s.slug);
    if (!p || p.certificateSha256 !== s.certificateSha256) events.push(skillPublish(s));
    if (s.status === 'revoked' && p?.status !== 'revoked') events.push({ type: 'skill-revoke', slug: s.slug, reason: revokedSkills.get(s.slug) ?? 'unspecified' });
  }
  const prevKeys = new Map(prev.keys.map((k) => [k.keyId, k]));
  for (const k of next.keys) {
    const p = prevKeys.get(k.keyId);
    if (k.status === 'revoked' && p?.status !== 'revoked') events.push({ type: 'key-revoke', keyId: k.keyId, reason: revokedKeys.get(k.keyId) ?? 'unspecified' });
  }
  const prevActive = prev.keys.find((k) => k.status === 'active')?.keyId;
  const nextActive = next.keys.find((k) => k.status === 'active')?.keyId;
  if (prevActive && nextActive && prevActive !== nextActive) events.push({ type: 'key-rotate', fromKeyId: prevActive, toKeyId: nextActive });
  return events;
}

// --- Idempotent append: unchanged state writes NO new record (the transparency-log STH below is still
//     synced from the records on disk, so the first STH-aware run backfills the tree without an append). ---
const unchanged = Boolean(head && canonicalJson(head.state) === canonicalJson(nextState));
if (unchanged) {
  console.log(`Authority unchanged — head record seq ${head!.sequence} is current (no append).`);
} else {
  const sequence = head ? String(Number(head.sequence) + 1) : '0';
  const previousRecordHash = head ? { sha256: digest('sha256', canonicalJson(head)) } : null;
  // Deterministic stamp: the later of the latest skill update and the revocations `asOf`.
  const issuedAt = [revocations.asOf ?? '', `${[...skillDefinitions].map((s) => s.updated).sort().at(-1)}T00:00:00.000Z`].filter(Boolean).sort().at(-1)!;

  const record: AuthorityRecord = {
    schemaVersion: 'amtech-authority-record/v1',
    sequence,
    previousRecordHash,
    issuedAt,
    authorityUrl: SKILL_AUTHORITY_URL,
    events: diffEvents(head?.state ?? null, nextState),
    state: nextState,
    signingKeyId: existingKey.keyId,
    signingKeyUrl: SIGNING_KEY_URL,
  };

  await mkdir(recordsDir, { recursive: true });
  const stem = sequence.padStart(4, '0');
  await writeFile(resolve(recordsDir, `${stem}.json`), `${JSON.stringify(record, null, 2)}\n`, 'utf8');
  await writeFile(resolve(recordsDir, `${stem}.sig`), `${signCanonical(record, privateKey)}\n`, 'utf8');
  console.log(`Signed authority record seq ${sequence} (${record.events.map((e) => e.type).join(', ')}): catalogRoot ${catalogRoot.slice(0, 16)}…, ${skills.length} skill(s).`);
}

// --- Transparency log (docs/skills/standard/03 — Option B): fold the EXISTING record bytes into an
//     RFC 6962 Merkle tree and emit a signed tree head (STH) + precomputed inclusion + consistency proofs.
//     No record is changed — leaves are leafHash(canonicalJson(record)). The signed payload is the STH
//     MINUS `signatures` and `anchors` so independent witnesses / external anchors can be appended later
//     without re-signing the authority's commitment to the root (trust-minimization scaffolding). ---
const authorityDir = resolve('src/lib/skills/authority');
const sthArchiveDir = resolve(authorityDir, 'sth');
const proofsRootDir = resolve(authorityDir, 'proofs');

const recordFilesNow = (await readdir(recordsDir).catch(() => [] as string[])).filter((f) => /^\d{4}\.json$/.test(f)).sort();
const recordCanon: string[] = [];
for (const f of recordFilesNow) recordCanon.push(canonicalJson(JSON.parse(await readFile(resolve(recordsDir, f), 'utf8'))));
const headCanon = recordCanon.at(-1)!;
const headRecord = JSON.parse(headCanon) as { sequence?: string; issuedAt?: string };
const leaves = recordCanon.map((c) => leafHash(c));
const treeSize = leaves.length;
const rootHash = merkleRoot(leaves);
const latestRecordHash = digest('sha256', headCanon); // no 0x00 prefix — equals log.json/skill-authority

const sthPath = resolve(authorityDir, 'sth.json');
const existingSth = JSON.parse((await readFile(sthPath, 'utf8').catch(() => 'null')) as string) as
  | { treeSize?: string; rootHash?: string }
  | null;
if (existingSth && existingSth.treeSize === String(treeSize) && existingSth.rootHash === rootHash) {
  console.log(`Transparency log unchanged — STH treeSize ${treeSize}, root ${rootHash.slice(0, 16)}… (no re-sign).`);
  process.exit(0);
}

// Prior archived STH sizes (all < treeSize, since an unchanged tree exited above) → consistency targets.
const priorSizes = (await readdir(sthArchiveDir).catch(() => [] as string[]))
  .map((f) => /^(\d+)\.json$/.exec(f)?.[1])
  .filter((s): s is string => Boolean(s))
  .map(Number)
  .filter((s) => s < treeSize)
  .sort((a, b) => a - b);

// Signed core (deterministic timestamp from the head record; sizes are strings — no JSON numbers signed).
const sthCore = {
  schemaVersion: 'amtech-authority-sth/v1' as const,
  authorityUrl: SKILL_AUTHORITY_URL,
  treeSize: String(treeSize),
  rootHash,
  latestSequence: headRecord.sequence ?? '0',
  latestRecordHash,
  timestamp: headRecord.issuedAt ?? new Date(0).toISOString(),
  signingKeyId: existingKey.keyId,
  signingKeyUrl: SIGNING_KEY_URL,
};
const sth = {
  ...sthCore,
  // Role-tagged signature SET (only `authority` populated now; independent `witness` entries append later).
  signatures: [
    { role: 'authority', signingKeyId: existingKey.keyId, signingKeyUrl: SIGNING_KEY_URL, signature: signCanonical(sthCore, privateKey) },
  ],
  // Reserved: external anchors (OpenTimestamps→Bitcoin / Sigstore-Rekor / signed git tag) — empty no-op for now.
  anchors: [] as unknown[],
};

await mkdir(sthArchiveDir, { recursive: true });
await writeFile(sthPath, `${JSON.stringify(sth, null, 2)}\n`, 'utf8');
await writeFile(resolve(sthArchiveDir, `${treeSize}.json`), `${JSON.stringify(sth, null, 2)}\n`, 'utf8');

// Proofs are fully regenerable from the records, so rewrite a clean set for the current size.
await rm(proofsRootDir, { recursive: true, force: true });
const inclusionDir = resolve(proofsRootDir, String(treeSize), 'inclusion');
await mkdir(inclusionDir, { recursive: true });
for (let i = 0; i < treeSize; i++) {
  const proof = { treeSize: String(treeSize), index: String(i), leafHash: leaves[i], auditPath: inclusionProof(leaves, i) };
  await writeFile(resolve(inclusionDir, `${i}.json`), `${JSON.stringify(proof, null, 2)}\n`, 'utf8');
}
// Consistency proof from EVERY prior archived size to the current size (covers any STH an agent pinned).
for (const firstSize of priorSizes) {
  const proof = { firstSize: String(firstSize), secondSize: String(treeSize), proof: consistencyProof(leaves, firstSize, treeSize) };
  await writeFile(resolve(proofsRootDir, String(treeSize), `consistency-from-${firstSize}.json`), `${JSON.stringify(proof, null, 2)}\n`, 'utf8');
}
console.log(
  `Signed STH treeSize ${treeSize}, root ${rootHash.slice(0, 16)}… (${treeSize} inclusion proof(s), ${priorSizes.length} consistency proof(s) from sizes [${priorSizes.join(', ')}]).`,
);
