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
  };
}

/** Loader over a live https origin — `baseUrl` is a skill's canonical URL, e.g. https://amtechai.com/skills/okf-audit. */
export function httpLoader(baseUrl: string): ResourceLoader {
  const base = baseUrl.replace(/\/+$/, '');
  const origin = new URL(base).origin;
  const fetchBytes = async (url: string): Promise<Buffer | null> => {
    try {
      const response = await fetch(url);
      if (!response.ok) return null;
      return Buffer.from(await response.arrayBuffer());
    } catch {
      return null;
    }
  };
  return {
    skillFile: (rel) => fetchBytes(`${base}/${rel}`),
    signingKey: () => fetchBytes(`${origin}/.well-known/amtech-signing-key.json`),
    catalog: () => fetchBytes(`${origin}/skills/catalog.json`),
    siblingCertificate: (s) => fetchBytes(`${origin}/skills/${s}/certificate.json`),
  };
}
