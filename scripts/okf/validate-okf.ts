/**
 * Validates the OKF bundle. Run via `npm run okf:validate`.
 *
 * Three layers (docs/okf/04-validation-and-phase-gates.md):
 *   1. Freshness  — re-emit in memory and diff against disk. Stale bundle => hard fail.
 *   2. Conformance (C1–C5) — OKF v0.1 structural rules. Hard fail.
 *   3. Quality (Q1–Q6) + Discovery (D1–D3) — AMTECH bar. WARN in Phase 1; promoted to
 *      hard gates before Phase 2 (see PHASE-GATE-STAGE below).
 */
import { readFile, readdir } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { OKF_DIR, buildOkfFiles } from './emit.ts';
import { ALLOWED_CONCEPT_TYPES } from '../../src/lib/knowledge/concepts.ts';

// Phase-gate stage. Default 2 (Phase 2 active: quality checks are hard). Pass --phase=1 to soften,
// or --phase=3 to additionally run the Phase-3 foundation checks (DB cutover prerequisites).
const phaseArg = process.argv.find((a) => a.startsWith('--phase='));
const PHASE_GATE_STAGE = phaseArg ? Number(phaseArg.split('=')[1]) : 2;

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const errors: string[] = [];
const warnings: string[] = [];
const fail = (msg: string) => errors.push(msg);
const warn = (msg: string) => warnings.push(msg);
// Quality issues are warnings in Phase 1, hard errors from Phase 2 onward.
const quality = (msg: string) => (PHASE_GATE_STAGE >= 2 ? errors : warnings).push(msg);

const ALLOWED_TYPES = new Set<string>(ALLOWED_CONCEPT_TYPES);

function parseFrontmatter(content: string): { fm: string | null; body: string } {
  if (!content.startsWith('---\n')) return { fm: null, body: content };
  const end = content.indexOf('\n---', 4);
  if (end === -1) return { fm: null, body: content };
  return { fm: content.slice(4, end), body: content.slice(end + 4) };
}

function fmValue(fm: string, key: string): string | null {
  const match = fm.match(new RegExp(`^${key}:\\s*"?(.*?)"?\\s*$`, 'm'));
  return match ? match[1] : null;
}

async function listFiles(dir: string, match: RegExp): Promise<string[]> {
  const out: string[] = [];
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = resolve(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await listFiles(full, match)));
    else if (match.test(entry.name)) out.push(full);
  }
  return out;
}

async function main() {
  const expected = buildOkfFiles();

  // ---- 1. Freshness -------------------------------------------------------
  for (const [relPath, content] of expected) {
    let onDisk: string | null = null;
    try {
      onDisk = await readFile(resolve(repoRoot, relPath), 'utf8');
    } catch {
      onDisk = null;
    }
    if (onDisk === null) fail(`Missing committed file: ${relPath}. Run \`npm run okf:build\`.`);
    else if (onDisk !== content) fail(`Stale file (source changed since last build): ${relPath}. Run \`npm run okf:build\`.`);
  }

  // ---- 2/3. Conformance + Quality on concept docs -------------------------
  const conceptPaths = [...expected.keys()].filter(
    (p) => p.startsWith(`${OKF_DIR}/`) && p.endsWith('.md') && !p.endsWith('/index.md') && !p.endsWith('/log.md'),
  );
  const conceptIds = new Set(conceptPaths.map((p) => p.replace(`${OKF_DIR}/`, '/').replace(/\.md$/, '')));

  for (const p of conceptPaths) {
    const content = expected.get(p) as string;
    const { fm, body } = parseFrontmatter(content);
    if (!fm) {
      fail(`C1: ${p} has no parseable frontmatter.`);
      continue;
    }
    const type = fmValue(fm, 'type');
    if (!type) fail(`C2: ${p} has empty/missing \`type\`.`);
    else if (!ALLOWED_TYPES.has(type)) quality(`Q5: ${p} has type "${type}" outside the agreed vocabulary.`);

    if (!fmValue(fm, 'description')) quality(`Q1: ${p} has no description.`);
    if (!/^tags:/m.test(fm)) quality(`Q2: ${p} has no tags.`);
    if (fmValue(fm, 'status') === 'published' && !fmValue(fm, 'resource')) quality(`Q3: ${p} is published but has no resource URL.`);

    // C4/C5: cross-links bundle-relative + broken-link reporting.
    const links = [...body.matchAll(/\]\((\/[^)]+\.md)\)/g)].map((m) => m[1]);
    const hasOutbound = body.includes('# Related concepts') && /_No outbound links recorded yet._/.test(body) === false;
    const hasBacklink = body.includes('# Referenced by');
    if (!hasOutbound && !hasBacklink) quality(`Q4: ${p} is an orphan (no outbound or inbound edges).`);
    for (const link of links) {
      if (!link.startsWith('/')) fail(`C4: ${p} has a non-bundle-relative link: ${link}`);
      const targetId = link.replace(/\.md$/, '');
      if (!conceptIds.has(targetId) && !targetId.startsWith('/unresolved/')) warn(`C5: ${p} links to missing concept ${link} (legal but flagged).`);
    }
  }

  // ---- C3: reserved files -------------------------------------------------
  const rootIndex = expected.get(`${OKF_DIR}/index.md`) as string;
  if (!rootIndex) fail('C3: bundle-root index.md missing.');
  else {
    const { fm } = parseFrontmatter(rootIndex);
    if (!fm || fmValue(fm, 'okf_version') !== '0.1') fail('C3: root index.md must declare okf_version: "0.1".');
  }
  for (const sub of [
    `${OKF_DIR}/articles/index.md`,
    `${OKF_DIR}/playbooks/index.md`,
    `${OKF_DIR}/use-cases/index.md`,
    `${OKF_DIR}/entities/index.md`,
  ]) {
    const content = expected.get(sub) as string;
    if (content && content.startsWith('---\n')) fail(`C3: sub-directory ${sub} must not have frontmatter.`);
  }

  // ---- D1–D3. Discovery ---------------------------------------------------
  const sitemap = expected.get('public/sitemap.xml') as string;
  if (!sitemap || !sitemap.includes('<urlset')) fail('D1: sitemap.xml missing or malformed.');
  else {
    const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
    if (!locs.length) fail('D1: sitemap.xml has no <loc> entries.');
    for (const loc of locs) if (!loc.startsWith('https://amtechai.com')) fail(`D1: sitemap loc not absolute amtechai.com URL: ${loc}`);
  }
  const robots = expected.get('public/robots.txt') as string;
  if (!robots || !robots.includes('Sitemap:')) fail('D2: robots.txt missing or has no Sitemap reference.');
  const llms = expected.get('public/llms.txt') as string;
  if (!llms || !llms.includes('/okf/')) fail('D3: llms.txt missing or does not reference /okf/.');

  // ---- Phase 3 foundation gates (only at --phase=3) -----------------------
  // These enforce the *checkable* Phase-3 prerequisites now, before any DB cutover.
  if (PHASE_GATE_STAGE >= 3) {
    // G9: no Supabase service-role credentials may be referenced from client/src code.
    const forbidden = [/service_role/i, /SUPABASE_SERVICE_ROLE/, /serviceRoleKey/];
    const srcFiles = await listFiles(resolve(repoRoot, 'src'), /\.(ts|tsx)$/);
    for (const file of srcFiles) {
      const content = await readFile(file, 'utf8');
      for (const pattern of forbidden) {
        if (pattern.test(content)) fail(`G9: ${file.replace(repoRoot + '/', '')} references a Supabase service credential (${pattern}); must never be in client code.`);
      }
    }

    // G8: a reviewable Phase-3 schema must exist defining the three tables + RLS.
    const schemaPath = resolve(repoRoot, 'docs/okf/phase-3-schema.sql');
    let schema = '';
    try {
      schema = await readFile(schemaPath, 'utf8');
    } catch {
      fail('G8: docs/okf/phase-3-schema.sql is missing (the proposed concepts/concept_edges/concept_citations schema).');
    }
    if (schema) {
      for (const table of ['concepts', 'concept_edges', 'concept_citations']) {
        if (!new RegExp(`create table[^;]*\\b${table}\\b`, 'i').test(schema)) fail(`G8: phase-3-schema.sql does not define table "${table}".`);
      }
      if (!/row level security/i.test(schema)) fail('G8: phase-3-schema.sql does not enable row level security.');
      if (!/create policy/i.test(schema)) fail('G8: phase-3-schema.sql defines no RLS policy (need published-only public read).');
    }

    // G7 (advisory): the single read path. Reported, not auto-failed — see docs/okf/06.
    warn('G7 (manual): confirm src/lib/knowledge/ is the only knowledge read path before DB cutover.');
  }

  // ---- Report -------------------------------------------------------------
  warnings.forEach((w) => console.warn(`  WARN  ${w}`));
  errors.forEach((e) => console.error(`  FAIL  ${e}`));
  console.log(
    `\nokf:validate (phase-gate stage ${PHASE_GATE_STAGE}) — ${expected.size} files, ${conceptPaths.length} concepts, ${warnings.length} warning(s), ${errors.length} error(s).`,
  );
  if (errors.length) process.exit(1);
}

main().catch((error) => {
  console.error('okf:validate crashed:', error);
  process.exit(1);
});
