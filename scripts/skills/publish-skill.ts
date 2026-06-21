/**
 * skills:publish — the "Certified AMTECH skill publishing" pipeline (M5, docs/skills/standard/08).
 *
 *   --dry-run [<slug>]      print the ordered release plan (no execution).
 *   --execute [--push]      run the ATOMIC, SSH-signed, cross-repo release end-to-end:
 *     1. website: skills:sign (certs bind sourcePackage) → skills:check → build.
 *     2. registry: mirror source + certs + authority chain + index (every skill `signed`) → ONE SSH-signed
 *        commit (no pending-resign window). Capture that commit.
 *     3. website: re-pin SKILL_REPOSITORY_COMMIT to the registry release commit (provenance only — no re-sign),
 *        rebuild, skills:check → SSH-signed website commit.
 *     4. registry/validate.mjs --check (sourcePackage proof + cross-witness).
 *   `--push` pushes both repos (the only outward step); without it the release is committed locally for review.
 *
 * Idempotent: re-running with no source change makes no cert/record change and yields no diff.
 */
import { execFileSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { skillDefinitions } from '../../src/lib/skills/registry.ts';

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const execute = args.includes('--execute');
const push = args.includes('--push');
const slug = args.find((a) => !a.startsWith('--'));
const repoRoot = process.cwd();
const registry = process.env.AMTECH_SKILLS_REGISTRY ?? resolve(process.env.HOME ?? '', 'Desktop/amtech-skills-registry');

if (!dryRun && !execute) {
  console.error('usage: npm run skills:publish -- --dry-run [<slug>]   |   --execute [--push]');
  process.exit(2);
}

const run = (label: string, cmd: string, cmdArgs: string[], cwd = repoRoot) => {
  console.log(`\n── [${label}] ${cmd} ${cmdArgs.join(' ')}`);
  execFileSync(cmd, cmdArgs, { stdio: 'inherit', cwd });
};
const git = (cwd: string, ...a: string[]) => execFileSync('git', a, { cwd, encoding: 'utf8' }).trim();

if (execute) {
  if (!existsSync(registry)) {
    console.error(`skills:publish --execute: registry not found at ${registry}. Set AMTECH_SKILLS_REGISTRY.`);
    process.exit(2);
  }

  // 1. Website: sign (sourcePackage-anchored certs + authority record) → check → build.
  run('sign', 'npm', ['run', 'skills:sign']);
  run('check', 'npm', ['run', 'skills:check']);

  // 2. Mirror source + certs + authority chain into the registry; mark every published skill `signed`.
  const newRoot = JSON.parse(readFileSync(resolve(repoRoot, 'public/skills/catalog.json'), 'utf8')).catalogRoot as string;
  for (const skill of skillDefinitions) {
    cpSync(resolve(repoRoot, skill.sourceDir), resolve(registry, skill.repository.path), { recursive: true });
    mkdirSync(resolve(registry, 'registry/skills', skill.slug), { recursive: true });
    for (const f of ['certificate.json', 'certificate.sig']) cpSync(resolve(repoRoot, 'public/skills', skill.slug, f), resolve(registry, 'registry/skills', skill.slug, f));
  }
  mkdirSync(resolve(registry, 'authority/records'), { recursive: true });
  cpSync(resolve(repoRoot, 'public/.well-known/authority/records'), resolve(registry, 'authority/records'), { recursive: true });
  cpSync(resolve(repoRoot, 'public/.well-known/authority/log.json'), resolve(registry, 'authority/log.json'));
  const index = JSON.parse(readFileSync(resolve(registry, 'index.json'), 'utf8'));
  index.verification.catalogRoot = newRoot;
  for (const s of index.skills) if (s.publishedOnWebsite && s.verification) { s.verification.signed = true; s.verification.status = 'signed'; s.verification.certificate = `registry/skills/${s.slug}/certificate.json`; }
  writeFileSync(resolve(registry, 'index.json'), `${JSON.stringify(index, null, 2)}\n`);
  run('registry checksums', 'node', ['registry/validate.mjs', '--write'], registry);
  run('registry validate', 'node', ['registry/validate.mjs', '--check'], registry);

  // 3. Registry: ONE SSH-signed atomic commit (all signed; no pending-resign).
  git(registry, 'add', '-A');
  if (git(registry, 'status', '--porcelain')) git(registry, 'commit', '-S', '-q', '-m', 'release: certified AMTECH skills (atomic, all signed)');
  const releaseCommit = git(registry, 'rev-parse', 'HEAD');
  console.log(`\nregistry release commit: ${releaseCommit}`);

  // 4. Website: re-pin provenance to the release commit (NOT in the signed cert → no re-sign), rebuild, check.
  const registryTs = resolve(repoRoot, 'src/lib/skills/registry.ts');
  writeFileSync(registryTs, readFileSync(registryTs, 'utf8').replace(/export const SKILL_REPOSITORY_COMMIT = '[0-9a-f]{40}';/, `export const SKILL_REPOSITORY_COMMIT = '${releaseCommit}';`));
  run('rebuild (provenance pin)', 'npm', ['run', 'skills:build']);
  run('check', 'npm', ['run', 'skills:check']);
  git(repoRoot, 'add', '-A');
  if (git(repoRoot, 'status', '--porcelain')) git(repoRoot, 'commit', '-S', '-q', '-m', `release: pin website provenance to registry ${releaseCommit.slice(0, 12)}`);

  if (push) {
    run('push website', 'git', ['push'], repoRoot);
    run('push registry', 'git', ['push'], registry);
  }
  console.log(`\n✓ atomic release complete${push ? ' + pushed' : ' (local; re-run with --push to publish)'}. Every published skill is signed; no pending-resign.`);
  process.exit(0);
}

// --dry-run
const targets = slug ? skillDefinitions.filter((s) => s.slug === slug) : skillDefinitions;
for (const skill of targets) {
  console.log(`\n=== Certified AMTECH skill publishing — DRY RUN — ${skill.slug} ===`);
  [
    'M1 conformance + M0/M3 materialize (skills:sign runs conformance, build, sign, the authority record).',
    'M2 verify + gates (skills:check): link-first verifier (G-M2.3) + head/body consistency (G-X.4) + chain.',
    'Atomic release: mirror source + certs + chain into the registry, mark all signed → ONE SSH-signed commit.',
    'Provenance pin: set the website SKILL_REPOSITORY_COMMIT to the release commit, rebuild, SSH-signed commit.',
    'Verify: registry/validate.mjs --check (sourcePackage proof + cross-witness). No pending-resign.',
  ].forEach((step, i) => console.log(`  ${String(i + 1).padStart(2)}. ${step}`));
}
console.log(`\nPlanned ${targets.length} skill(s). Dry run only. Run --execute [--push] for the real release.`);
