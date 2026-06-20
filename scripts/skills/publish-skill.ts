/**
 * skills:publish — the "Certified AMTECH skill publishing" pipeline (M5 GROUNDWORK, docs/skills/standard/08).
 *
 * Turns "add a skill" into one repeatable low-volatility operation instead of a manual two-phase release:
 * conformance (M1) → materialize surfaces (M0/M3) → registry two-phase release → authority record (M4) →
 * verify (M2), with the 07 gates enforced automatically. This scaffold ships the ORDERED PLAN as a dry run
 * over the onboarding backlog; live onboarding is intentionally not implemented until M0-M4 are stable.
 *
 *   npm run skills:publish -- --dry-run <slug>     plan one backlog skill
 *   npm run skills:publish -- --dry-run --all      plan every backlog skill
 */
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

type BacklogSkill = { slug: string; category: string; registryPath: string; status: string; requiresRepositoryContext?: boolean };
type Backlog = { skills: BacklogSkill[] };

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const all = args.includes('--all');
const slug = args.find((a) => !a.startsWith('--'));

const backlog = JSON.parse(await readFile(resolve('src/lib/skills/onboarding-backlog.json'), 'utf8')) as Backlog;

if (!dryRun) {
  console.error('skills:publish: live onboarding is NOT implemented yet (M5 groundwork). Re-run with --dry-run to print the plan.');
  process.exit(2);
}

const targets = all ? backlog.skills : backlog.skills.filter((s) => s.slug === slug);
if (targets.length === 0) {
  console.error(`skills:publish: no backlog skill matched '${slug ?? ''}'. Known: ${backlog.skills.map((s) => s.slug).join(', ')}. Use --all.`);
  process.exit(2);
}

/** The ordered certified-publishing stages — each names the real script/gate it will drive in M5 proper. */
function stages(s: BacklogSkill): string[] {
  return [
    `Register source: add ${s.registryPath} to src/lib/skills/registry.ts + a conformance.config.json + review evidence.${s.requiresRepositoryContext ? ' (requiresRepositoryContext — confirm host repo deps before certifying.)' : ''}`,
    'M1 conformance: npm run skills:conformance — Ajv schema compile + golden example validates + instruction↔schema consistency; record deterministic evidence (ranAt = release date).',
    'M0/M3 materialize: npm run skills:build — emit page/use.md/manifest (per-file SRI)/catalog (catalogRoot) + the verdict surfaces.',
    'Registry two-phase, Phase 1: commit the canonical bytes to amtech-skills-registry, mark the cert pending-resign, push, capture the SHA.',
    'Sign: pin the Phase-1 SHA, npm run skills:sign — independent signer gates emit the v2 amtech-reviewed certificate + sourcePackage; sign-authority appends the authority record (M4).',
    'M2 verify + gates: npm run skills:check — build validator runs the link-first verifier over the skill (G-M2.3) and the head/body consistency gate (G-M3.1, G-X.4); build fails unless verdict === verified.',
    'Registry two-phase, Phase 2: mirror the byte-identical cert into the registry, flip pending-resign → signed, recompute the catalog root in registry/validate.mjs (cross-repo set proof), keep the website↔registry commit pin in lockstep.',
    'Release: npm run build + deploy; re-run the live black-box walk from https://amtechai.com/skills (a fresh agent enumerates, reaches the page, and recomputes the verdict via recipe.json).',
  ];
}

for (const s of targets) {
  console.log(`\n=== Certified AMTECH skill publishing — DRY RUN — ${s.slug} [${s.category}] ===`);
  stages(s).forEach((step, i) => console.log(`  ${String(i + 1).padStart(2)}. ${step}`));
}
console.log(`\nPlanned ${targets.length} skill(s). Dry run only — no files written, no commits, no release. (M5 groundwork; live pipeline lands after M0-M4 stabilize.)`);
