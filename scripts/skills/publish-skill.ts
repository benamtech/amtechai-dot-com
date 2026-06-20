/**
 * skills:publish — the "Certified AMTECH skill publishing" pipeline (M5, docs/skills/standard/08).
 *
 * Turns "add a skill" into one repeatable, gated, idempotent operation instead of a manual cross-repo
 * two-phase release. Two modes:
 *   --dry-run [<slug>|--all]   print the ordered plan over the onboarding backlog (no execution).
 *   --execute <slug>           run the website-side pipeline for a REGISTERED skill (conformance → build →
 *                              sign certs → sign-authority → check (verifier + consistency + chain gates) →
 *                              verify), then mirror the authority chain into the registry and cross-witness it.
 *                              Idempotent: an already-certified, unchanged skill produces no diff.
 *
 * Outward cross-repo COMMITS (the registry two-phase pending-resign → signed) remain the explicit operator/
 * release step; --execute runs every gate + the mirror so that step is mechanical and safe.
 */
import { execFileSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { skillDefinitions } from '../../src/lib/skills/registry.ts';

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const execute = args.includes('--execute');
const all = args.includes('--all');
const slug = args.find((a) => !a.startsWith('--'));
const repoRoot = process.cwd();

if (!dryRun && !execute) {
  console.error('usage: npm run skills:publish -- --dry-run [<slug>|--all]   |   --execute <slug>');
  process.exit(2);
}

// ---------------------------------------------------------------- --execute (live website pipeline) -----
if (execute) {
  if (!slug) {
    console.error('skills:publish --execute: name a registered skill, e.g. `npm run skills:publish -- --execute okf-audit`.');
    process.exit(2);
  }
  const skill = skillDefinitions.find((s) => s.slug === slug);
  if (!skill) {
    console.error(`skills:publish --execute: '${slug}' is not a registered skill. Add it to src/lib/skills/registry.ts (+ conformance.config.json, golden example, review evidence) first.`);
    process.exit(2);
  }
  const run = (label: string, cmd: string, cmdArgs: string[]) => {
    console.log(`\n── [${label}] ${cmd} ${cmdArgs.join(' ')}`);
    execFileSync(cmd, cmdArgs, { stdio: 'inherit' });
  };

  run('M1+M4 sign (conformance, certs, authority record)', 'npm', ['run', 'skills:sign']);
  run('M2+M3 check (verifier + consistency + chain gates + tests)', 'npm', ['run', 'skills:check']);
  run('M2 verify (link-first verdict for the target)', 'npm', ['run', 'skills:verify', '--', `public/skills/${slug}`]);

  // Cross-witness: mirror the signed authority chain into the registry + independently validate it.
  const registry = process.env.AMTECH_SKILLS_REGISTRY ?? resolve(process.env.HOME ?? '', 'Desktop/amtech-skills-registry');
  if (existsSync(registry)) {
    mkdirSync(resolve(registry, 'authority/records'), { recursive: true });
    cpSync(resolve(repoRoot, 'public/.well-known/authority/records'), resolve(registry, 'authority/records'), { recursive: true });
    cpSync(resolve(repoRoot, 'public/.well-known/authority/log.json'), resolve(registry, 'authority/log.json'));
    run('registry cross-witness', 'node', [resolve(registry, 'registry/validate.mjs'), '--check']);
  } else {
    console.log(`\n(registry not found at ${registry}; skipping cross-witness — set AMTECH_SKILLS_REGISTRY to enable)`);
  }

  console.log(`\n✓ publish pipeline complete for ${slug} (idempotent for an already-certified, unchanged skill).`);
  console.log('Next (operator/release step, outward): commit + push BOTH repos in lockstep — registry two-phase');
  console.log('(Phase 1 pending-resign → Phase 2 signed) and re-pin the website authority to the registry commit.');
  process.exit(0);
}

// ------------------------------------------------------------------------------- --dry-run (plan) -------
type BacklogSkill = { slug: string; category: string; registryPath: string; status: string; requiresRepositoryContext?: boolean };
const backlog = (JSON.parse(readFileSync(resolve('src/lib/skills/onboarding-backlog.json'), 'utf8')) as { skills: BacklogSkill[] }).skills;
const targets = all ? backlog : backlog.filter((s) => s.slug === slug);
if (targets.length === 0) {
  console.error(`skills:publish --dry-run: no backlog skill matched '${slug ?? ''}'. Known: ${backlog.map((s) => s.slug).join(', ')}. Use --all.`);
  process.exit(2);
}

function stages(s: BacklogSkill): string[] {
  return [
    `Rewrite + register: bring ${s.registryPath} to our format (SKILL.md + a JSON output schema asset + golden example), add a SkillDefinition + conformance.config.json + review evidence.${s.requiresRepositoryContext ? ' (requiresRepositoryContext — resolve host-repo deps before certifying.)' : ''}`,
    'Run the live pipeline: npm run skills:publish -- --execute ' + s.slug + ' — conformance → build → sign (certs + authority record) → check (verifier + consistency + chain gates) → verify → registry cross-witness.',
    'Registry two-phase (operator/release): Phase 1 commit canonical bytes + pending-resign (capture SHA); Phase 2 pin the SHA, mirror the byte-identical cert + authority records, flip signed.',
    'Release: re-pin the website authority to the registry commit, npm run build + deploy, re-run the live black-box walk from https://amtechai.com/skills.',
  ];
}

for (const s of targets) {
  console.log(`\n=== Certified AMTECH skill publishing — DRY RUN — ${s.slug} [${s.category}] ===`);
  stages(s).forEach((step, i) => console.log(`  ${String(i + 1).padStart(2)}. ${step}`));
}
console.log(`\nPlanned ${targets.length} skill(s). Dry run only — no execution. Run --execute <slug> once the skill is in our format.`);
