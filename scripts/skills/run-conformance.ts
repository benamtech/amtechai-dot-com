/**
 * Offline contract-conformance runner (docs/skills/standard/02). Produces the signed-by-digest
 * evidence that backs a skill's `conformance` attestation — WITHOUT any live model call. It is the
 * `method:"static-contract"` path; a future `live-model` run (AMTECH-hosted LLM API) writes the same
 * envelope so the certificate + verifier are unchanged.
 *
 * Checks per skill (every check named, pass/fail, detail-on-fail):
 *  - structure: SKILL.md frontmatter keys, required sections, every registry-declared file resolves,
 *    declared script-role files == the script files actually present (no undeclared executables).
 *  - contract:  each shipped asset JSON Schema COMPILES (Ajv, draft 2020-12) and a committed golden
 *    example VALIDATES against it.
 *  - consistency: the schema's top-level required field count == the documented-output count, and each
 *    documented output string appears in SKILL.md (catches instruction/schema drift).
 *
 * Output is deterministic (ranAt = the skill's release date) so the committed evidence is stable and
 * `validate-skills.ts` can re-run this and assert byte-equality (defeats hand-edited evidence).
 *
 * Exports `computeConformanceEvidence(slug)` (pure) and, when run directly, writes the evidence files.
 */
import { readFile, writeFile, readdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import Ajv2020 from 'ajv/dist/2020.js';
import { skillDefinitions, type SkillDefinition } from '../../src/lib/skills/registry.ts';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');

export const CONFORMANCE_SCHEMA_VERSION = 'amtech-skill-conformance/v1';

type ConformanceConfig = {
  suite: string;
  suiteVersion: string;
  method: 'static-contract' | 'live-model';
  requiredFrontmatter: string[];
  requiredSections: string[];
  schemas: { asset: string; goldenExample: string; requiredOutputDocumented: string[] }[];
  permissions: { filesystem: string; network: string; secrets: string };
};

export type ConformanceCheck = { name: string; result: 'pass' | 'fail'; detail?: string };

export type ConformanceEvidence = {
  schemaVersion: string;
  skill: string;
  version: string;
  suite: string;
  suiteVersion: string;
  method: 'static-contract' | 'live-model';
  sourceCommit: string;
  ranAt: string;
  result: 'pass' | 'fail';
  checks: ConformanceCheck[];
};

function frontmatterBlock(skillMd: string): string {
  const match = skillMd.match(/^---\n([\s\S]*?)\n---/);
  return match ? match[1] : '';
}

/** Recursively list source files relative to the skill source dir (so we can detect undeclared files). */
async function listSourceFiles(absDir: string, rel = ''): Promise<string[]> {
  const entries = await readdir(absDir, { withFileTypes: true });
  const out: string[] = [];
  for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
    const childRel = rel ? `${rel}/${entry.name}` : entry.name;
    if (entry.isDirectory()) out.push(...(await listSourceFiles(resolve(absDir, entry.name), childRel)));
    else if (entry.isFile()) out.push(childRel);
  }
  return out;
}

export async function computeConformanceEvidence(slug: string): Promise<ConformanceEvidence> {
  const skill = skillDefinitions.find((item) => item.slug === slug);
  if (!skill) throw new Error(`conformance: unknown skill ${slug}`);
  const certDir = resolve(repoRoot, `src/lib/skills/certificates/${slug}`);
  const sourceDir = resolve(repoRoot, skill.sourceDir);
  const config = JSON.parse(await readFile(resolve(certDir, 'conformance.config.json'), 'utf8')) as ConformanceConfig;

  const checks: ConformanceCheck[] = [];
  const add = (name: string, ok: boolean, detail?: string) => checks.push(ok ? { name, result: 'pass' } : { name, result: 'fail', detail });

  const skillMd = await readFile(resolve(sourceDir, 'SKILL.md'), 'utf8');
  const fm = frontmatterBlock(skillMd);

  // structure — frontmatter
  for (const key of config.requiredFrontmatter) {
    add(`frontmatter:${key}`, new RegExp(`^${key}:\\s*\\S`, 'm').test(fm), `frontmatter key '${key}' missing or empty`);
  }
  // structure — required sections
  for (const section of config.requiredSections) {
    add(`section:${section}`, skillMd.includes(section), `SKILL.md missing section '${section}'`);
  }
  // structure — every registry-declared file resolves in source
  const declaredPaths = new Set(skill.files.map((file) => file.path));
  for (const file of skill.files) {
    let ok = true;
    try {
      await readFile(resolve(sourceDir, file.path));
    } catch {
      ok = false;
    }
    add(`file-resolves:${file.path}`, ok, `declared file '${file.path}' not present in source`);
  }
  // structure — no undeclared files in source (every source file is registered)
  const actualFiles = await listSourceFiles(sourceDir);
  for (const path of actualFiles) {
    add(`file-declared:${path}`, declaredPaths.has(path), `source file '${path}' is not declared in the registry`);
  }
  // structure — declared script-role files == script files actually present (no undeclared executables)
  const declaredScripts = skill.files.filter((file) => file.role === 'script').map((file) => file.path).sort();
  const looksExecutable = (path: string) => path.startsWith('scripts/') || /\.(sh|bash|mjs|cjs|js|ts|py|rb)$/.test(path);
  const presentScripts = actualFiles.filter(looksExecutable).sort();
  add(
    'scripts-match-declared',
    JSON.stringify(declaredScripts) === JSON.stringify(presentScripts),
    `declared scripts [${declaredScripts.join(', ')}] != executable-looking source files [${presentScripts.join(', ')}]`,
  );

  // contract — schema compiles + golden validates; consistency — documented outputs
  const ajv = new Ajv2020({ allErrors: true, strict: false });
  for (const entry of config.schemas) {
    let schema: Record<string, unknown> | null = null;
    try {
      schema = JSON.parse(await readFile(resolve(sourceDir, entry.asset), 'utf8'));
      add(`schema-parses:${entry.asset}`, true);
    } catch (error) {
      add(`schema-parses:${entry.asset}`, false, error instanceof Error ? error.message : String(error));
      continue;
    }
    let validate;
    try {
      validate = ajv.compile(schema);
      add(`schema-compiles:${entry.asset}`, true);
    } catch (error) {
      add(`schema-compiles:${entry.asset}`, false, error instanceof Error ? error.message : String(error));
      continue;
    }
    let golden: unknown;
    try {
      golden = JSON.parse(await readFile(resolve(certDir, 'evidence/examples', entry.goldenExample), 'utf8'));
      add(`golden-parses:${entry.goldenExample}`, true);
    } catch (error) {
      add(`golden-parses:${entry.goldenExample}`, false, error instanceof Error ? error.message : String(error));
      continue;
    }
    const valid = validate(golden);
    add(`golden-validates:${entry.goldenExample}`, valid, ajv.errorsText(validate.errors, { separator: '; ' }));

    const requiredCount = Array.isArray(schema.required) ? schema.required.length : 0;
    add(
      `contract-count:${entry.asset}`,
      requiredCount === entry.requiredOutputDocumented.length,
      `schema declares ${requiredCount} required field(s) but config documents ${entry.requiredOutputDocumented.length}`,
    );
    for (const documented of entry.requiredOutputDocumented) {
      add(`documented:${documented}`, skillMd.includes(documented), `output '${documented}' is not documented in SKILL.md`);
    }
  }

  const result: 'pass' | 'fail' = checks.every((check) => check.result === 'pass') ? 'pass' : 'fail';
  return {
    schemaVersion: CONFORMANCE_SCHEMA_VERSION,
    skill: skill.slug,
    version: skill.version,
    suite: config.suite,
    suiteVersion: config.suiteVersion,
    method: config.method,
    sourceCommit: skill.repository.commit,
    ranAt: `${skill.updated}T00:00:00.000Z`,
    result,
    checks,
  };
}

/** Deterministic serialization shared by the writer and the validator's byte-equality check. */
export function serializeEvidence(evidence: ConformanceEvidence): string {
  return `${JSON.stringify(evidence, null, 2)}\n`;
}

async function main() {
  let failed = false;
  for (const skill of skillDefinitions as SkillDefinition[]) {
    const evidence = await computeConformanceEvidence(skill.slug);
    const target = resolve(repoRoot, `src/lib/skills/certificates/${skill.slug}/evidence/conformance.json`);
    await writeFile(target, serializeEvidence(evidence), 'utf8');
    const failedChecks = evidence.checks.filter((check) => check.result === 'fail');
    console.log(`conformance ${skill.slug}: ${evidence.result} (${evidence.checks.length - failedChecks.length}/${evidence.checks.length} checks)`);
    for (const check of failedChecks) console.error(`  - FAIL ${check.name}: ${check.detail}`);
    if (evidence.result !== 'pass') failed = true;
  }
  if (failed) {
    console.error('skills:conformance failed. Fix the skill or its golden example before signing.');
    process.exit(1);
  }
  console.log('skills:conformance passed for all skills.');
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error('skills:conformance crashed:', error);
    process.exit(1);
  });
}
