/**
 * skills:publish — the "Certified AMTECH skill publishing" pipeline (M5, docs/skills/standard/08).
 *
 *   --dry-run [<slug>]   print the ordered release plan for a registered skill (no execution).
 *   --execute <slug>     run the website-side pipeline for a REGISTERED skill (conformance → build →
 *                        sign certs → sign-authority → check → verify), then mirror the signed authority
 *                        chain into the registry and cross-witness it. Idempotent.
 *
 * Outward cross-repo COMMITS (the atomic signed release) remain the explicit operator/release step;
 * --execute runs every gate + the mirror so that step is mechanical and safe.
 */
import { execFileSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { skillDefinitions } from '../../src/lib/skills/registry.ts';

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const execute = args.includes('--execute');
const slug = args.find((a) => !a.startsWith('--'));
const repoRoot = process.cwd();

if (!dryRun && !execute) {
  console.error('usage: npm run skills:publish -- --dry-run [<slug>]   |   --execute <slug>');
  process.exit(2);
}

function requireRegistered(name: string | undefined) {
  if (!name) {
    console.error('skills:publish: name a registered skill, e.g. `npm run skills:publish -- --execute okf-audit`.');
    process.exit(2);
  }
  const skill = skillDefinitions.find((s) => s.slug === name);
  if (!skill) {
    console.error(`skills:publish: '${name}' is not a registered skill. Add it to src/lib/skills/registry.ts (+ conformance.config.json, golden, review) first.`);
    process.exit(2);
  }
  return skill;
}

if (execute) {
  const skill = requireRegistered(slug);
  const run = (label: string, cmd: string, cmdArgs: string[]) => {
    console.log(`\n── [${label}] ${cmd} ${cmdArgs.join(' ')}`);
    execFileSync(cmd, cmdArgs, { stdio: 'inherit' });
  };
  run('M1+M4 sign (conformance, certs, authority record)', 'npm', ['run', 'skills:sign']);
  run('M2+M3 check (verifier + consistency + chain gates + tests)', 'npm', ['run', 'skills:check']);
  run('M2 verify (link-first verdict for the target)', 'npm', ['run', 'skills:verify', '--', `public/skills/${skill.slug}`]);

  const registry = process.env.AMTECH_SKILLS_REGISTRY ?? resolve(process.env.HOME ?? '', 'Desktop/amtech-skills-registry');
  if (existsSync(registry)) {
    mkdirSync(resolve(registry, 'authority/records'), { recursive: true });
    cpSync(resolve(repoRoot, 'public/.well-known/authority/records'), resolve(registry, 'authority/records'), { recursive: true });
    cpSync(resolve(repoRoot, 'public/.well-known/authority/log.json'), resolve(registry, 'authority/log.json'));
    run('registry cross-witness', 'node', [resolve(registry, 'registry/validate.mjs'), '--check']);
  } else {
    console.log(`\n(registry not found at ${registry}; skipping cross-witness — set AMTECH_SKILLS_REGISTRY to enable)`);
  }
  console.log(`\n✓ publish pipeline complete for ${skill.slug} (idempotent for an already-certified, unchanged skill).`);
  console.log('Next (operator/release step, outward): the atomic signed cross-repo release — commit source + certs in');
  console.log('ONE registry commit (all signed), set the website provenance pin, commit + push both repos in lockstep.');
  process.exit(0);
}

// --dry-run
const targets = slug ? [requireRegistered(slug)] : skillDefinitions;
for (const skill of targets) {
  console.log(`\n=== Certified AMTECH skill publishing — DRY RUN — ${skill.slug} ===`);
  [
    'M1 conformance: npm run skills:conformance — schema compile + golden validates + documented outputs.',
    'M0/M3 materialize: npm run skills:build — page, manifest (per-file SRI), catalog (catalogRoot), recipe.json, verdict surfaces.',
    'Sign: npm run skills:sign — v2 amtech-reviewed cert (sourcePackage anchor) + the appended authority record.',
    'M2 verify + gates: npm run skills:check — link-first verifier (G-M2.3) + head/body consistency (G-X.4).',
    'Atomic release: mirror source + certs + authority chain into the registry in ONE signed commit (all signed),',
    'set the website provenance pin to that commit, rebuild (provenance only), commit + push both repos in lockstep.',
  ].forEach((step, i) => console.log(`  ${String(i + 1).padStart(2)}. ${step}`));
}
console.log(`\nPlanned ${targets.length} skill(s). Dry run only — no execution.`);
