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
import { MAX_AUTHORING_REVIEW_AGE_DAYS } from '../../src/lib/skills/verification/reasonCodes.ts';

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
  ranAt: string;
  result: 'pass' | 'fail';
  checks: ConformanceCheck[];
};

function frontmatterBlock(skillMd: string): string {
  const match = skillMd.match(/^---\n([\s\S]*?)\n---/);
  return match ? match[1] : '';
}

function bodyAfterFrontmatter(skillMd: string): string {
  const match = skillMd.match(/^---\n[\s\S]*?\n---\n?([\s\S]*)$/);
  return match ? match[1] : skillMd;
}

function frontmatterValue(fm: string, key: string): string {
  const match = fm.match(new RegExp(`^${key}:\\s*(.+)$`, 'm'));
  return match ? match[1].trim() : '';
}

/**
 * Authoring-discipline gates (docs/skills/standard/10 + wiki/research/2026-06-22-skill-effectiveness-...). The
 * effectiveness wisdom — what ties a skill to measured uplift — encoded as DETERMINISTIC, recomputable checks so
 * the conformance evidence stays byte-stable (validate-skills re-runs it). Pure: callers pass bytes, so it is
 * unit-testable with mutated inputs (see __fixtures__/authoring-discipline.test.ts). BOTH descriptions are
 * checked (the SKILL.md frontmatter description an agent routes on AND the registry/catalog description), plus a
 * consistency check between them.
 */
export type AuthoringInput = {
  /** SKILL.md frontmatter `description` — what an agent loads to decide whether to use the skill (routing). */
  routingDescription: string;
  /** Registry/catalog `description` — the catalog + website blurb. */
  catalogDescription: string;
  /** SKILL.md body with the frontmatter stripped. */
  skillMdBody: string;
  /** Bundled reference-role markdown files (path + content). */
  referenceFiles: { path: string; content: string }[];
  /** The documented Output Contract sections (registry `outputContract`). */
  outputContract: string[];
  /** ISO date (YYYY-MM-DD) of the last authoring review. */
  lastReviewed?: string;
  /** Release-relative clock (= the conformance ranAt), so freshness stays deterministic. */
  ranAt: string;
};

const FIRST_SECOND_PERSON_OPENER = /^\s*(i|i'll|i'd|i can|we|we'll|you|you'll|let me)\b/i;
const FIRST_SECOND_PERSON_PHRASE = /\b(i can help|you can use this|we will help|i will help)\b/i;
const TRIGGER_CUE = /\b(use when|use this|use to|use for|when )/i;
const NESTED_LOCAL_LINK = /\]\(\s*(?!https?:|mailto:|#)[^)]*\.(md|json|ya?ml|txt)\b[^)]*\)/i;
const TOC_HEADING = /^##+\s*(contents|table of contents)\b/im;
const SHELL_EVAL_BACKTICK = /`[^`\n]*![^`\n]*`/;

export function authoringDisciplineChecks(input: AuthoringInput): ConformanceCheck[] {
  const checks: ConformanceCheck[] = [];
  const add = (name: string, ok: boolean, detail?: string) =>
    checks.push(ok ? { name, result: 'pass' } : { name, result: 'fail', detail });

  const isThirdPerson = (d: string) => !FIRST_SECOND_PERSON_OPENER.test(d.trim()) && !FIRST_SECOND_PERSON_PHRASE.test(d);

  // Routing description (frontmatter) — third person + a trigger cue + adequate length (02 caps at 1024).
  add('authoring:routing-desc-third-person', isThirdPerson(input.routingDescription), 'routing description uses first/second person voice');
  add('authoring:routing-desc-trigger', TRIGGER_CUE.test(input.routingDescription), 'routing description has no "when/use/for" trigger cue');
  add('authoring:routing-desc-length', input.routingDescription.length >= 40 && input.routingDescription.length <= 1024, `routing description length ${input.routingDescription.length} not in 40..1024`);

  // Catalog description (registry) — third person + adequate length.
  add('authoring:catalog-desc-third-person', isThirdPerson(input.catalogDescription), 'catalog description uses first/second person voice');
  add('authoring:catalog-desc-length', input.catalogDescription.length >= 40 && input.catalogDescription.length <= 1024, `catalog description length ${input.catalogDescription.length} not in 40..1024`);

  // Source of truth — the SKILL.md frontmatter (routing) description MUST equal the registry (catalog)
  // description. The registry is authoritative; build-skills materializes the frontmatter from it, so the two
  // cannot drift ([[registry-description-source-of-truth]]). This supersedes a softer term-overlap check.
  add('authoring:desc-matches-registry', input.routingDescription.trim() === input.catalogDescription.trim(), 'SKILL.md frontmatter description != registry description (the registry is the source of truth)');

  // Conciseness — SKILL.md body under 500 lines (progressive disclosure; comprehensive skills measurably degrade).
  const bodyLines = input.skillMdBody.replace(/\s+$/, '').split('\n').length;
  add('authoring:body-under-500', bodyLines <= 500, `SKILL.md body is ${bodyLines} lines (>500)`);

  // Progressive disclosure — references one level deep (Claude partial-reads nested refs) and a TOC on long ones.
  for (const file of input.referenceFiles) {
    if (NESTED_LOCAL_LINK.test(file.content)) {
      add(`authoring:refs-one-deep:${file.path}`, false, `${file.path} links to another local file (nested reference)`);
    }
    const lineCount = file.content.replace(/\s+$/, '').split('\n').length;
    if (lineCount > 100) {
      add(`authoring:refs-toc:${file.path}`, TOC_HEADING.test(file.content), `${file.path} is ${lineCount} lines but has no "## Contents" table of contents`);
    }
  }
  // Stable umbrella results so a skill with no reference files still emits the named checks (deterministic set).
  add('authoring:refs-one-deep', input.referenceFiles.every((f) => !NESTED_LOCAL_LINK.test(f.content)), 'a reference file links to another local file');
  add('authoring:refs-toc', input.referenceFiles.every((f) => f.content.replace(/\s+$/, '').split('\n').length <= 100 || TOC_HEADING.test(f.content)), 'a reference file over 100 lines lacks a table of contents');

  // No shell-eval footgun — an inline-code (backtick) span containing `!` triggers shell history expansion
  // when a host shells out the wrapped path/command, which can break the skill on load
  // (anthropics/claude-code#24510). Keep backtick spans free of `!` across the body and reference files so the
  // materialized skill is safe to bootstrap. Deterministic; complements the backtick-path navigation convention.
  const offending = [
    { label: 'SKILL.md body', content: input.skillMdBody },
    ...input.referenceFiles.map((f) => ({ label: f.path, content: f.content })),
  ].find((s) => SHELL_EVAL_BACKTICK.test(s.content));
  add('authoring:no-shell-eval-backticks', !offending, offending ? `${offending.label} has a backtick code span containing '!' (shell history-expansion footgun)` : undefined);

  // Evidence-first — a real structured Output Contract (≥3 sections), not a single blob.
  add('authoring:output-contract', input.outputContract.length >= 3, `outputContract has ${input.outputContract.length} section(s) (<3)`);

  // Freshness — lastReviewed present, valid, and within the review window of the release date (skills decay).
  let freshOk = false;
  let freshDetail = 'lastReviewed missing';
  if (input.lastReviewed) {
    const reviewed = new Date(`${input.lastReviewed}T00:00:00.000Z`).getTime();
    const ran = new Date(input.ranAt).getTime();
    if (!Number.isFinite(reviewed)) freshDetail = `lastReviewed '${input.lastReviewed}' is not a valid date`;
    else {
      const ageDays = (ran - reviewed) / 86_400_000;
      freshOk = ageDays >= 0 && ageDays <= MAX_AUTHORING_REVIEW_AGE_DAYS;
      freshDetail = `lastReviewed is ${ageDays.toFixed(0)}d before release (window ${MAX_AUTHORING_REVIEW_AGE_DAYS}d)`;
    }
  }
  add('authoring:last-reviewed', freshOk, freshDetail);

  return checks;
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

  // consistency — the registry's bootstrap contract (which drives the SIGNED use.md/agent.md) is non-empty and
  // each declared output section is documented in SKILL.md. Catches the OKF-boilerplate class of drift where a
  // skill's agent-entry surfaces describe a different skill's output (build-skills.ts bootstrapMarkdown).
  add('bootstrap:taskVerb', skill.taskVerb.trim().length > 0, 'registry taskVerb is empty');
  add('bootstrap:inputs', skill.inputs.length > 0, 'registry inputs is empty');
  add('bootstrap:outputsSummary', skill.outputsSummary.trim().length > 0, 'registry outputsSummary is empty');
  add('bootstrap:outputContract', skill.outputContract.length > 0, 'registry outputContract is empty');
  for (const section of skill.outputContract) {
    add(`bootstrap-output:${section}`, skillMd.includes(section), `outputContract section '${section}' is not documented in SKILL.md`);
  }

  // authoring-discipline (docs/skills/standard/10) — the effectiveness wisdom as deterministic, recomputable
  // checks. BOTH the routing (frontmatter) and catalog (registry) descriptions, conciseness, progressive
  // disclosure, evidence-first contract, freshness. Pure fn so it's unit-testable with mutated inputs.
  const referenceFiles: { path: string; content: string }[] = [];
  for (const file of skill.files.filter((f) => f.role === 'reference')) {
    referenceFiles.push({ path: file.path, content: await readFile(resolve(sourceDir, file.path), 'utf8') });
  }
  for (const check of authoringDisciplineChecks({
    routingDescription: frontmatterValue(fm, 'description'),
    catalogDescription: skill.description,
    skillMdBody: bodyAfterFrontmatter(skillMd),
    referenceFiles,
    outputContract: skill.outputContract,
    lastReviewed: skill.lastReviewed,
    ranAt: `${skill.updated}T00:00:00.000Z`,
  })) {
    checks.push(check);
  }

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
