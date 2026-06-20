/**
 * skills:verify — the link-first verifier CLI (docs/skills/standard/04). Thin wrapper over the pure
 * library (src/lib/skills/verification/verifySkill.ts): point it at a skill's canonical URL (or a local
 * `public/` dir) and it prints the spec verdict JSON — `{ verdict, depth, trustTier, method, subject,
 * reasonCodes, evidence, checkedAt }`. Exit 0 only when verdict === 'verified'.
 *
 *   npm run skills:verify https://amtechai.com/skills/okf-audit [--archive-byte]
 *   npm run skills:verify public/skills/okf-audit            # local published tree
 */
import { resolve } from 'node:path';
import { verifySkill } from '../../src/lib/skills/verification/verifySkill.ts';
import { httpLoader, localPublicLoader } from '../skills/verifier-loaders.ts';

const args = process.argv.slice(2);
const target = args.find((a) => !a.startsWith('--'));
const depth = args.includes('--archive-byte') ? 'archive-byte' : args.includes('--link-only') ? 'link-only' : 'graph-replay';

if (!target) {
  console.error('usage: npm run skills:verify <skill-url-or-local-path> [--archive-byte|--link-only]');
  process.exit(2);
}

function localLoader(path: string) {
  const clean = path.replace(/\/+$/, '');
  const slug = clean.split('/').pop()!;
  const marker = clean.lastIndexOf('/skills/');
  const publicDir = marker >= 0 ? clean.slice(0, marker) : 'public';
  return localPublicLoader(resolve(process.cwd(), publicDir), slug);
}

const loader = /^https?:\/\//.test(target) ? httpLoader(target) : localLoader(target);

const verdict = await verifySkill(loader, { depth });
console.log(JSON.stringify(verdict, null, 2));
process.exit(verdict.verdict === 'verified' ? 0 : 1);
