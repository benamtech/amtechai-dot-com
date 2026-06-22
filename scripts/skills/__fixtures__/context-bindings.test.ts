/**
 * M2 — context-binding / host-adapter projection (docs/skills/standard/05).
 *
 * The "use the data the context already has" principle: a skill declares named context slots
 * (registry `contextBindings`) and a per-host source map. Those project into every materialized surface —
 * a host-agnostic Context section in use.md, a one-line Context note in agent.md, a per-host hint file
 * (hosts/*.md) carried in the signed package + manifest with SRI, and a slot note in the Codex default prompt.
 *
 * Asserts over the BUILT public/ bytes (the artifacts agents fetch). Run a build first
 * (skills:check builds before testing). Skills WITHOUT declared bindings must NOT grow a Context section —
 * the projection is gated on the declaration, so it stays additive.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { skillDefinitions } from '../../../src/lib/skills/registry.ts';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const readPublic = (...parts: string[]) => readFile(resolve(repoRoot, 'public/skills', ...parts), 'utf8');

for (const skill of skillDefinitions) {
  const bindings = skill.contextBindings;

  if (!bindings || bindings.length === 0) {
    test(`${skill.slug}: no Context section without declared bindings (additive)`, async () => {
      const useMd = await readPublic(skill.slug, 'use.md');
      assert.ok(!useMd.includes('## Context'), `${skill.slug}/use.md has a Context section but declares no contextBindings`);
    });
    continue;
  }

  test(`${skill.slug}: use.md carries the generic Context prelude`, async () => {
    const useMd = await readPublic(skill.slug, 'use.md');
    assert.ok(useMd.includes('## Context'), 'use.md missing "## Context" section');
    assert.ok(/already in your context/i.test(useMd), 'use.md Context missing the "already in your context" cue');
    assert.ok(/ask the user/i.test(useMd), 'use.md Context missing the generic link-only "ask the user" fallback');
    for (const b of bindings) {
      assert.ok(useMd.includes(`**${b.slot}**`), `use.md Context missing slot "${b.slot}"`);
    }
  });

  test(`${skill.slug}: agent.md carries the one-line Context note`, async () => {
    const agentMd = await readPublic(skill.slug, 'agent.md');
    assert.ok(/^Context:/m.test(agentMd), 'agent.md missing the "Context:" note');
    for (const b of bindings) {
      assert.ok(agentMd.includes(b.slot), `agent.md Context note missing slot "${b.slot}"`);
    }
  });

  // Per-host hint files: declared (role reference, path hosts/*.md), served, and in the manifest with SRI.
  const hostFiles = skill.files.filter((f) => f.path.startsWith('hosts/'));
  test(`${skill.slug}: declares at least one host hint file`, () => {
    assert.ok(hostFiles.length > 0, 'a skill with contextBindings should ship at least one hosts/*.md adapter');
  });

  for (const hostFile of hostFiles) {
    test(`${skill.slug}: ${hostFile.path} is served and in the manifest with SRI`, async () => {
      const served = await readPublic(skill.slug, 'files', ...hostFile.path.split('/'));
      assert.ok(served.trim().length > 0, `${hostFile.path} served file is empty`);
      const manifest = JSON.parse(await readPublic(skill.slug, 'manifest.json')) as {
        files: { path: string; integrity: string }[];
      };
      const entry = manifest.files.find((f) => f.path === hostFile.path);
      assert.ok(entry, `${hostFile.path} missing from manifest.files`);
      assert.match(entry!.integrity, /^sha256-[A-Za-z0-9+/]+=*$/, `${hostFile.path} manifest entry has no SRI integrity`);
    });
  }

  // Codex surface: openai.yaml default prompt carries a slot note + installer is present in the manifest.
  test(`${skill.slug}: Codex openai.yaml + installer carry the context-slot note`, async () => {
    const yaml = await readPublic(skill.slug, 'files', 'agents', 'openai.yaml');
    assert.ok(/already in your context/i.test(yaml), 'openai.yaml default_prompt missing the context-slot note');
    const manifest = JSON.parse(await readPublic(skill.slug, 'manifest.json')) as {
      source: { codexSkillInstaller?: string };
    };
    assert.ok(manifest.source.codexSkillInstaller, 'manifest missing codexSkillInstaller');
  });
}

// Estimate-specific: the Hermes adapter names the business brain and tells the agent to write back learned rates.
test('estimate: hosts/hermes.md names the business brain and writes back learned rates', async () => {
  const hermes = await readPublic('estimate', 'files', 'hosts', 'hermes.md');
  assert.ok(hermes.includes('./brain/business-brain.md'), 'hermes.md does not name ./brain/business-brain.md');
  assert.ok(/never invent a rate/i.test(hermes), 'hermes.md missing the never-invent-a-rate discipline');
  assert.ok(/save|remember|write back/i.test(hermes), 'hermes.md does not tell the agent to persist a newly-learned rate');
});
