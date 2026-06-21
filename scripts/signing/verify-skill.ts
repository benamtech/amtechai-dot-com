/**
 * skills:verify — the link-first verifier CLI (docs/skills/standard/04). Thin wrapper over the pure
 * library (src/lib/skills/verification/verifySkill.ts). Accepts ANY accepted entry-point and converges
 * (G-M2.1): a skill page, a bootstrap file, a certificate, the catalog.json, or the skill-authority.json.
 * Prints the spec verdict JSON; a catalog/authority entry verifies every skill and prints an array.
 * Exit 0 only when every resolved skill verdict is 'verified'.
 *
 *   npm run skills:verify https://amtechai.com/skills/okf-audit [--archive-byte]
 *   npm run skills:verify https://amtechai.com/skills/catalog.json   # verify all
 *   npm run skills:verify public/skills/okf-audit                    # local published tree
 */
import { verifySkill } from '../../src/lib/skills/verification/verifySkill.ts';
import { resolveEntry } from '../skills/verifier-loaders.ts';

const args = process.argv.slice(2);
const target = args.find((a) => !a.startsWith('--'));
const depth = args.includes('--archive-byte') ? 'archive-byte' : args.includes('--link-only') ? 'link-only' : 'graph-replay';

if (!target) {
  console.error('usage: npm run skills:verify <url-or-local-path> [--archive-byte|--link-only]');
  process.exit(2);
}

const { slugs, makeLoader } = await resolveEntry(target);
if (slugs.length === 0) {
  console.error(`could not resolve any skill from entry-point: ${target}`);
  process.exit(2);
}

const verdicts = [];
for (const slug of slugs) verdicts.push(await verifySkill(makeLoader(slug), { depth }));

console.log(JSON.stringify(verdicts.length === 1 ? verdicts[0] : verdicts, null, 2));
process.exit(verdicts.every((v) => v.verdict === 'verified') ? 0 : 1);
