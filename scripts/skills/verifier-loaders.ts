/**
 * Node-side ResourceLoader factories for the link-first verifier (src/lib/skills/verification/verifySkill.ts).
 * Kept OUT of verifySkill.ts so the verifier stays free of node:fs/fetch specifics and remains
 * WebCrypto/browser-portable for M3. Two sources: the local published tree (build validator) and a live
 * https origin (the `skills:verify <url>` CLI). Both resolve the SAME logical resources to the same bytes.
 */
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import type { ResourceLoader } from '../../src/lib/skills/verification/verifySkill.ts';

/** Loader over a local `public/` directory — what the build validator checks before anything is deployed. */
export function localPublicLoader(publicDir: string, slug: string): ResourceLoader {
  const skillBase = resolve(publicDir, 'skills', slug);
  const read = (abs: string) => readFile(abs).catch(() => null);
  return {
    skillFile: (rel) => read(resolve(skillBase, rel)),
    signingKey: () => read(resolve(publicDir, '.well-known/amtech-signing-key.json')),
    catalog: () => read(resolve(publicDir, 'skills/catalog.json')),
    siblingCertificate: (s) => read(resolve(publicDir, 'skills', s, 'certificate.json')),
    authority: () => read(resolve(publicDir, '.well-known/skill-authority.json')),
    authorityLog: () => read(resolve(publicDir, '.well-known/authority/log.json')),
    authorityRecordStem: (stem) => read(resolve(publicDir, '.well-known/authority/records', `${stem}.json`)),
    authorityRecordStemSig: (stem) => read(resolve(publicDir, '.well-known/authority/records', `${stem}.sig`)),
  };
}

/** Loader over a live https origin — `baseUrl` is a skill's canonical URL, e.g. https://amtechai.com/skills/okf-audit. */
export function httpLoader(baseUrl: string): ResourceLoader {
  const base = baseUrl.replace(/\/+$/, '');
  const origin = new URL(base).origin;
  return {
    skillFile: (rel) => fetchBytes(`${base}/${rel}`),
    signingKey: () => fetchBytes(`${origin}/.well-known/amtech-signing-key.json`),
    catalog: () => fetchBytes(`${origin}/skills/catalog.json`),
    siblingCertificate: (s) => fetchBytes(`${origin}/skills/${s}/certificate.json`),
    authority: () => fetchBytes(`${origin}/.well-known/skill-authority.json`),
    authorityLog: () => fetchBytes(`${origin}/.well-known/authority/log.json`),
    authorityRecordStem: (stem) => fetchBytes(`${origin}/.well-known/authority/records/${stem}.json`),
    authorityRecordStemSig: (stem) => fetchBytes(`${origin}/.well-known/authority/records/${stem}.sig`),
  };
}

async function fetchBytes(url: string): Promise<Buffer | null> {
  try {
    const response = await fetch(url);
    return response.ok ? Buffer.from(await response.arrayBuffer()) : null;
  } catch {
    return null;
  }
}

/** Bytes for any accepted entry-point — an https URL or a local published path. */
async function loadAny(target: string): Promise<Buffer | null> {
  return /^https?:\/\//.test(target) ? fetchBytes(target) : readFile(resolve(process.cwd(), target)).catch(() => null);
}

export type EntryResolution = { slugs: string[]; makeLoader: (slug: string) => ResourceLoader };

/**
 * Chain discovery (docs/skills/standard/04 §"Accepted inputs"): map ANY accepted entry-point URL/path —
 * a skill page `/skills/<slug>`, a bootstrap `use.md`/`agent.md`, a `certificate.json`/`manifest.json`, the
 * `catalog.json`, or the `skill-authority.json` — to the skill base(s) to verify. A catalog or authority
 * entry-point enumerates EVERY skill; any per-skill surface converges on its single slug.
 */
export async function resolveEntry(target: string): Promise<EntryResolution> {
  const isHttp = /^https?:\/\//.test(target);
  const clean = target.replace(/\/+$/, '');

  let makeLoader: (slug: string) => ResourceLoader;
  let pathname: string;
  if (isHttp) {
    const url = new URL(clean);
    pathname = url.pathname;
    makeLoader = (slug) => httpLoader(`${url.origin}/skills/${slug}`);
  } else {
    const marker = clean.lastIndexOf('/skills/');
    const wellKnown = clean.lastIndexOf('/.well-known/');
    const publicDir = marker >= 0 ? clean.slice(0, marker) : wellKnown >= 0 ? clean.slice(0, wellKnown) : 'public';
    pathname = marker >= 0 ? clean.slice(marker) : clean;
    makeLoader = (slug) => localPublicLoader(resolve(process.cwd(), publicDir || '.'), slug);
  }

  // Catalog / authority entry-points enumerate the whole set.
  if (/catalog\.json$/.test(clean) || /skill-authority\.json$/.test(clean)) {
    const bytes = await loadAny(target);
    const skills = bytes ? ((JSON.parse(bytes.toString('utf8')) as { skills?: { slug?: string }[] }).skills ?? []) : [];
    return { slugs: skills.map((s) => s.slug).filter((s): s is string => Boolean(s)), makeLoader };
  }

  // Any per-skill surface → its single slug.
  const m = pathname.match(/\/skills\/([^/]+)/);
  if (m && m[1] !== 'catalog.json' && m[1] !== 'index.json') return { slugs: [m[1]], makeLoader };
  const tail = clean.split('/').filter(Boolean).pop();
  return { slugs: tail ? [tail] : [], makeLoader };
}
