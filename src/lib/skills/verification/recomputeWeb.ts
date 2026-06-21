/**
 * In-browser graph-replay recompute (docs/skills/standard/09) — the client-side twin of verifySkill.ts.
 *
 * This is the whole standard made tangible: a visitor (or an agent with a JS runtime) RECOMPUTES the verdict
 * from the published surfaces using WebCrypto + fetch, instead of trusting the rendered badge. A downstream
 * re-renderer that copies the badge cannot fake it — it has to run this. Pure browser code (no node deps);
 * fetches are same-origin off the slug, so it works on any deploy (prod, preview, local).
 *
 * WebCrypto covers everything graph-replay needs: SHA-256 (sourcePackage / per-file SRI / catalog root / record
 * digest) and Ed25519 (certificate signature). The cert's secondary SHA3-512 digests are a server-side second
 * construction and are intentionally not re-run here (no SHA3 in WebCrypto) — the SHA-256 chain is the recompute.
 */
export type ReplayStep = { label: string; status: 'pass' | 'fail' | 'skipped' | 'unsupported'; detail?: string };
export type ReplayResult = { verdict: 'verified' | 'invalid' | 'unverifiable'; steps: ReplayStep[] };

/** Deterministic JSON identical to amtech-signing.ts canonicalJson (RFC 8785-compatible subset). */
function canonicalJson(value: unknown): string {
  if (value === null || typeof value === 'boolean' || typeof value === 'string') return JSON.stringify(value);
  if (typeof value === 'number') return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(',')}]`;
  if (typeof value === 'object') {
    const record = value as Record<string, unknown>;
    return `{${Object.keys(record)
      .sort()
      .filter((k) => record[k] !== undefined)
      .map((k) => `${JSON.stringify(k)}:${canonicalJson(record[k])}`)
      .join(',')}}`;
  }
  throw new Error(`unsupported canonical value: ${typeof value}`);
}

const toHex = (buf: ArrayBuffer) => [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
const toB64 = (bytes: Uint8Array) => btoa(String.fromCharCode(...bytes));
const utf8 = (s: string) => new TextEncoder().encode(s);
const sha256Hex = async (bytes: Uint8Array) => toHex(await crypto.subtle.digest('SHA-256', bytes));
const sha256B64 = async (bytes: Uint8Array) => toB64(new Uint8Array(await crypto.subtle.digest('SHA-256', bytes)));

function b64urlToBytes(b64url: string): Uint8Array {
  const t = b64url.trim();
  const b64 = t.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(t.length / 4) * 4, '=');
  return Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
}
function pemToDer(pem: string): Uint8Array {
  return Uint8Array.from(atob(pem.replace(/-----[A-Z ]+-----/g, '').replace(/\s+/g, '')), (c) => c.charCodeAt(0));
}
async function ed25519Verify(publicKeyPem: string, sigB64url: string, message: Uint8Array): Promise<boolean> {
  const key = await crypto.subtle.importKey('spki', pemToDer(publicKeyPem), { name: 'Ed25519' }, false, ['verify']);
  return crypto.subtle.verify({ name: 'Ed25519' }, key, b64urlToBytes(sigB64url), message);
}

async function getText(url: string): Promise<string> {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`fetch ${url} → ${r.status}`);
  return r.text();
}
const getJson = async <T>(url: string): Promise<T> => JSON.parse(await getText(url)) as T;
async function getBytes(url: string): Promise<Uint8Array> {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`fetch ${url} → ${r.status}`);
  return new Uint8Array(await r.arrayBuffer());
}

type Cert = { signingKeyId: string; sourcePackage?: { sha256: string } };
type KeyDoc = { keyId: string; status: string; publicKeyPem: string };
type Manifest = { files?: { path: string; sha256: string; integrity?: string }[] };

/** Recompute the verdict for `slug` from same-origin published surfaces, reporting each step as it runs. */
export async function recomputeVerdict(slug: string, onStep?: (i: number, step: ReplayStep) => void): Promise<ReplayResult> {
  const base = `/skills/${slug}`;
  const steps: ReplayStep[] = [];
  const emit = (step: ReplayStep) => {
    onStep?.(steps.length, step);
    steps.push(step);
  };
  const stop = (label: string, detail: string, verdict: ReplayResult['verdict'] = 'invalid'): ReplayResult => {
    emit({ label, status: verdict === 'unverifiable' ? 'skipped' : 'fail', detail });
    return { verdict, steps };
  };

  // ---- Step 1 — authenticity: Ed25519 over the canonical certificate (key fetched by id) ----------
  let cert: Cert;
  let certShaHex: string;
  try {
    const [certText, sig] = await Promise.all([getText(`${base}/certificate.json`), getText(`${base}/certificate.sig`)]);
    certShaHex = await sha256Hex(utf8(certText));
    cert = JSON.parse(certText) as Cert;
    const key =
      (await getJson<KeyDoc>(`/.well-known/keys/${cert.signingKeyId.replace(/[:/]/g, '_')}.json`).catch(() => null)) ??
      (await getJson<KeyDoc>(`/.well-known/amtech-signing-key.json`));
    if (key.status === 'revoked') return stop('Signing key not revoked', `key ${key.keyId} is revoked`);
    const ok = await ed25519Verify(key.publicKeyPem, sig, utf8(canonicalJson(cert)));
    emit({ label: 'Ed25519 signature over the canonical certificate', status: ok ? 'pass' : 'fail', detail: ok ? `key ${key.keyId} (${key.status})` : 'signature does not verify' });
    if (!ok) return { verdict: 'invalid', steps };
  } catch (e) {
    if (e instanceof Error && /Ed25519/.test(e.message)) return { verdict: 'unverifiable', steps: [{ label: 'Ed25519 signature', status: 'unsupported', detail: 'this browser lacks WebCrypto Ed25519 — verify via the CLI' }] };
    return { verdict: 'unverifiable', steps: [{ label: 'Fetch certificate + signing key', status: 'skipped', detail: e instanceof Error ? e.message : String(e) }] };
  }

  // ---- Step 2 + 3 — sourcePackage over published files + per-file SRI vs the signed manifest -------
  let manifest: Manifest;
  try {
    manifest = await getJson<Manifest>(`${base}/manifest.json`);
  } catch (e) {
    return stop('Fetch manifest', e instanceof Error ? e.message : String(e), 'unverifiable');
  }
  const files = manifest.files ?? [];
  const payload: { path: string; size: number; contentBase64: string }[] = [];
  let sriOk = true;
  for (const entry of files) {
    const bytes = await getBytes(`${base}/files/${entry.path}`);
    payload.push({ path: entry.path, size: bytes.length, contentBase64: toB64(bytes) });
    if ((await sha256Hex(bytes)) !== entry.sha256 || (entry.integrity && `sha256-${await sha256B64(bytes)}` !== entry.integrity)) sriOk = false;
  }
  payload.sort((a, b) => (a.path < b.path ? -1 : a.path > b.path ? 1 : 0));
  const recomputedSource = await sha256Hex(utf8(canonicalJson(payload)));
  emit({ label: 'sourcePackage recomputes over the published files', status: recomputedSource === cert.sourcePackage?.sha256 ? 'pass' : 'fail', detail: `${recomputedSource.slice(0, 16)}…` });
  if (recomputedSource !== cert.sourcePackage?.sha256) return { verdict: 'invalid', steps };
  emit({ label: `Per-file SRI vs the signed manifest (${files.length} files)`, status: sriOk ? 'pass' : 'fail' });
  if (!sriOk) return { verdict: 'invalid', steps };

  // ---- Step 4 — catalog root over the per-skill certificate digests --------------------------------
  try {
    const catalog = await getJson<{ catalogRoot?: string; skills?: { slug: string; certificateUrl?: string }[] }>(`/skills/catalog.json`);
    const leaves: { slug: string; cert: string }[] = [];
    for (const s of (catalog.skills ?? []).filter((x) => x.certificateUrl)) leaves.push({ slug: s.slug, cert: await sha256Hex(await getBytes(`/skills/${s.slug}/certificate.json`)) });
    leaves.sort((a, b) => (a.slug < b.slug ? -1 : a.slug > b.slug ? 1 : 0));
    const root = await sha256Hex(utf8(canonicalJson(leaves)));
    emit({ label: 'Catalog root over the per-skill certificate digests', status: root === catalog.catalogRoot ? 'pass' : 'fail', detail: `${root.slice(0, 16)}…` });
    if (root !== catalog.catalogRoot) return { verdict: 'invalid', steps };
  } catch (e) {
    return stop('Catalog root', e instanceof Error ? e.message : String(e));
  }

  // ---- Step 5 — authority record: latest pointer + this cert is in the signed set -------------------
  try {
    const authority = await getJson<{ latestSequence?: string; latestRecordHash?: string }>(`/.well-known/skill-authority.json`);
    const stem = String(authority.latestSequence ?? '0').padStart(4, '0');
    const record = JSON.parse(await getText(`/.well-known/authority/records/${stem}.json`)) as { state?: { skills?: { slug: string; certificateSha256: string }[] } };
    const recordHash = await sha256Hex(utf8(canonicalJson(record)));
    const inSet = record.state?.skills?.some((s) => s.slug === slug && s.certificateSha256 === certShaHex) ?? false;
    const ok = authority.latestRecordHash === recordHash && inSet;
    emit({ label: `Authority record (seq ${authority.latestSequence}) commits to this certificate`, status: ok ? 'pass' : 'fail', detail: ok ? undefined : 'latest pointer or set membership mismatch' });
    if (!ok) return { verdict: 'invalid', steps };
  } catch (e) {
    return stop('Authority record', e instanceof Error ? e.message : String(e));
  }

  return { verdict: 'verified', steps };
}
