/**
 * Regression guard for the agent-entry surfaces (use.md / agent.md) — the bug where build-skills.ts hardcoded
 * the okf-audit Output Contract / Inputs / Outputs into EVERY skill's bootstrap, so estimate / kgb /
 * article-writer told agents to produce an OKF audit report instead of their real output.
 *
 * Asserts, over the BUILT public/ bytes (the same artifacts agents fetch):
 *   - positive: each skill's use.md carries its own outputContract sections + task verb, and agent.md carries
 *     its own inputs + outputs summary (all driven from the registry).
 *   - negative (anti-contamination): no skill's bootstrap contains another skill's DISTINCTIVE output section
 *     (multi-word, ≥8 chars — so common words like "Job"/"Draft"/"Score" can't cause false positives).
 *
 * Run: npm run skills:test  (node --test). Reads public/ like attestation-gates.test.ts; run a build first
 * (skills:check builds before testing).
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { skillDefinitions, skillUrl } from '../../../src/lib/skills/registry.ts';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const read = (slug: string, name: 'use.md' | 'agent.md') =>
  readFile(resolve(repoRoot, 'public/skills', slug, name), 'utf8');

/** Output sections distinctive enough that appearing in a foreign skill's bootstrap is real contamination. */
const distinctive = (sections: string[]) => sections.filter((s) => s.length >= 8 && s.includes(' '));

for (const skill of skillDefinitions) {
  test(`${skill.slug}: use.md carries its own contract`, async () => {
    const useMd = await read(skill.slug, 'use.md');
    assert.ok(useMd.includes(skill.taskVerb), `use.md missing task verb "${skill.taskVerb}"`);
    for (const section of skill.outputContract) {
      assert.ok(useMd.includes(`- ${section}`), `use.md Output Contract missing "${section}"`);
    }
  });

  test(`${skill.slug}: agent.md carries its own inputs/outputs`, async () => {
    const agentMd = await read(skill.slug, 'agent.md');
    for (const input of skill.inputs) {
      assert.ok(agentMd.includes(input), `agent.md Inputs missing "${input}"`);
    }
    assert.ok(agentMd.includes(skill.outputsSummary), 'agent.md missing outputs summary');
  });

  test(`${skill.slug}: use.md projects progressive-disclosure reference pointers (backtick path + link + intent)`, async () => {
    const useMd = await read(skill.slug, 'use.md');
    const pointed = skill.files.filter((f) => f.role === 'reference' || f.role === 'asset' || f.role === 'script');
    if (pointed.length === 0) {
      assert.ok(!useMd.includes('## Reference Files'), 'no pointable files, so no Reference Files section expected');
      return;
    }
    assert.ok(useMd.includes('## Reference Files'), 'use.md missing the "## Reference Files" progressive-disclosure section');
    for (const f of pointed) {
      const verb = f.role === 'script' ? 'Run' : 'Read';
      const url = skillUrl(skill, `/files/${f.path}`);
      // backtick path inside a markdown link to the canonical fetch URL, with explicit read/execute intent.
      assert.ok(
        useMd.includes(`${verb} [\`${f.path}\`](${url})`),
        `use.md missing ${verb} pointer for \`${f.path}\``,
      );
    }
  });

  test(`${skill.slug}: bootstrap is free of other skills' output sections`, async () => {
    const [useMd, agentMd] = await Promise.all([read(skill.slug, 'use.md'), read(skill.slug, 'agent.md')]);
    const own = new Set(skill.outputContract);
    for (const other of skillDefinitions) {
      if (other.slug === skill.slug) continue;
      for (const foreign of distinctive(other.outputContract)) {
        if (own.has(foreign)) continue; // legitimately shared section name
        assert.ok(!useMd.includes(foreign), `${skill.slug}/use.md leaks ${other.slug} section "${foreign}"`);
        assert.ok(!agentMd.includes(foreign), `${skill.slug}/agent.md leaks ${other.slug} section "${foreign}"`);
      }
    }
  });
}
