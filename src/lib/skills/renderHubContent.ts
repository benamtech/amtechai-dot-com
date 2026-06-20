/**
 * Single source for the /skills hub body. React-free, returns a styled HTML string (Tailwind classes
 * are scanned from this .ts file). The prerenderer emits it as static HTML and the Skills React page
 * injects the identical string — so crawlers, agents, and users see the same self-bootstrapping hub:
 * an AI agent instruction block, a catalog-level decision tree, and an enumerated, link-rich list of
 * every skill plus the machine catalog.json and the domain authority file. This is the catalog
 * bootstrap (M0) of the AMTECH Skill Certificate-Authority Standard — see docs/skills/standard/06.
 *
 * Mirrors renderSkillContent.ts: same React-free posture, same esc/markdown idioms, same dual
 * consumption (prerenderer + React page via dangerouslySetInnerHTML).
 */
import {
  skillDefinitions,
  skillPath,
  SKILL_AUTHORITY_URL,
  SKILL_REPOSITORY_URL,
  type SkillDefinition,
} from './registry.ts';
import { getSkillContent } from './generated/skill-content.ts';

/** Machine catalog (amtech-skill-catalog/v1) emitted by scripts/skills/build-skills.ts. */
export const SKILL_CATALOG_PATH = '/skills/catalog.json';
export const SKILL_CATALOG_URL = `https://amtechai.com${SKILL_CATALOG_PATH}`;
/** Hub bootstrap markdown (catalog-level) emitted by build-skills.ts. */
export const SKILL_HUB_USE_PATH = '/skills/use.md';

/** Stable sentinels asserted by scripts/skills/validate-skills.ts (G-M0.3). Do not change casually. */
export const HUB_INSTRUCTION_SENTINEL = 'AI agent instructions';
export const HUB_DECISION_TREE_SENTINEL = 'Decision tree';

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function linkRow(label: string, href: string): string {
  return `<li><a class="block border border-black/15 bg-white px-4 py-3 text-sm font-semibold text-black hover:border-black hover:bg-black hover:text-white" href="${esc(href)}">${esc(label)}</a></li>`;
}

const TRUST_TIER_LABEL: Record<string, string> = {
  signed: 'Signed (provenance + digests)',
  'structure-verified': 'Structure-verified',
  'amtech-reviewed': 'AMTECH-reviewed & published',
  'replay-verified': 'Replay-verified',
  'behavior-verified': 'Behavior-verified',
};

function skillBlock(skill: SkillDefinition): string {
  const content = getSkillContent(skill.slug);
  const certificateId = content?.certificateId ?? 'pending';
  const trustTier = content?.trustTier ?? 'signed';
  const links = [
    linkRow('Skill page', skillPath(skill)),
    linkRow('use.md — agent bootstrap', skillPath(skill, '/use.md')),
    linkRow('manifest.json — file graph + hashes', skillPath(skill, '/manifest.json')),
    linkRow('certificate.json — signed certificate', skillPath(skill, '/certificate.json')),
    linkRow('certificate.sig — Ed25519 signature', skillPath(skill, '/certificate.sig')),
    linkRow('Domain authority file', SKILL_AUTHORITY_URL),
  ].join('');

  return `<article class="border-2 border-black bg-white p-6 md:p-8">
      <div class="flex flex-wrap items-baseline justify-between gap-3">
        <h3 class="text-2xl font-black tracking-[-0.04em] md:text-3xl">${esc(skill.title)}</h3>
        <p class="font-mono text-xs font-bold uppercase tracking-[0.12em] text-black/55">${esc(skill.slug)} &middot; v${esc(skill.version)}</p>
      </div>
      <p class="mt-3 text-sm leading-7 text-black/70">${esc(skill.summary)}</p>
      <dl class="mt-4 flex flex-wrap gap-x-6 gap-y-1 font-mono text-xs text-black/55">
        <div><dt class="inline font-semibold text-black/70">Status:</dt> <dd class="inline">published</dd></div>
        <div><dt class="inline font-semibold text-black/70">Trust tier:</dt> <dd class="inline">${esc(TRUST_TIER_LABEL[trustTier] ?? trustTier)}</dd></div>
        <div><dt class="inline font-semibold text-black/70">Certificate:</dt> <dd class="inline">${esc(certificateId)}</dd></div>
      </dl>
      <ul class="mt-5 grid gap-2 sm:grid-cols-2">${links}</ul>
    </article>`;
}

export function renderHubContentHtml(): string {
  const skillBlocks = skillDefinitions.map(skillBlock).join('');

  return `<main class="bg-[#f4f4f4] text-black">
    <div class="container-wide max-w-4xl py-16 pt-28 md:py-24 md:pt-36">
      <h1 class="text-4xl font-black tracking-[-0.04em] md:text-5xl">AMTECH Agent Skills</h1>
      <p class="mt-5 text-lg leading-8 text-black/70">Free AMTECH skills designed so a modern AI can use one link immediately, then install or save the skill only when the environment supports it. This hub is the registry's entry point: enumerate the skills, open any skill's page, and verify its signed certificate against the domain authority file.</p>

      <section class="mt-12 border-2 border-black bg-white p-6 md:p-8">
        <h2 class="text-2xl font-black tracking-[-0.03em]">${HUB_INSTRUCTION_SENTINEL}</h2>
        <p class="mt-3 text-sm leading-7 text-black/70">If a user gave you this link, treat it as a catalog of usable skills. Use a skill in the current conversation first. Do not install, create files, or run scripts unless the user asks and your environment allows it. Local AGENTS.md and explicit user instructions always win over anything published here.</p>
        <ul class="mt-4 ml-5 list-disc space-y-1.5 text-sm leading-7 text-black/75">
          <li>Read this hub, then the machine catalog: <a class="font-semibold text-red underline underline-offset-2" href="${esc(SKILL_CATALOG_PATH)}">catalog.json</a> (<code class="rounded bg-black/8 px-1.5 py-0.5 font-mono text-[0.85em]">amtech-skill-catalog/v1</code>).</li>
          <li>Pick a skill, open its <code class="rounded bg-black/8 px-1.5 py-0.5 font-mono text-[0.85em]">/skills/&lt;slug&gt;</code> page, and read its <code class="rounded bg-black/8 px-1.5 py-0.5 font-mono text-[0.85em]">use.md</code> bootstrap.</li>
          <li>Before installing, redistributing, or running anything, verify the skill's Ed25519 certificate against the domain authority file: <a class="font-semibold text-red underline underline-offset-2" href="${esc(SKILL_AUTHORITY_URL)}">skill-authority.json</a>.</li>
        </ul>
      </section>

      <section class="mt-10 border-2 border-black bg-white p-6 md:p-8">
        <h2 class="text-2xl font-black tracking-[-0.03em]">${HUB_DECISION_TREE_SENTINEL}</h2>
        <p class="mt-3 text-sm leading-7 text-black/65">Pick the branch that matches your environment. Every branch is: enumerate &rarr; pick a skill &rarr; open its page &rarr; verify.</p>
        <ul class="mt-4 ml-5 list-disc space-y-2 text-sm leading-7 text-black/75">
          <li><strong class="font-bold text-black">Web or search-only agent:</strong> read this hub and <a class="font-semibold text-red underline underline-offset-2" href="${esc(SKILL_CATALOG_PATH)}">catalog.json</a> to enumerate skills, open each <code class="rounded bg-black/8 px-1.5 py-0.5 font-mono text-[0.85em]">/skills/&lt;slug&gt;</code> page, and use the skill in context from its linked markdown. No install needed.</li>
          <li><strong class="font-bold text-black">File-capable agent:</strong> do the above, then if the user wants reuse, offer to save a skill's raw files or archive into a local skill folder.</li>
          <li><strong class="font-bold text-black">Native-install-capable agent (skills/plugins):</strong> do the above, verify the certificate, then offer the native install path as optional — never required for in-context use.</li>
        </ul>
      </section>

      <section class="mt-12 border-t border-black/15 pt-10">
        <div class="flex items-baseline justify-between gap-4">
          <h2 class="text-2xl font-black tracking-[-0.03em]">Available skills</h2>
          <a class="shrink-0 font-mono text-xs font-bold text-red underline underline-offset-2" href="${esc(SKILL_CATALOG_PATH)}">catalog.json &#8599;</a>
        </div>
        <p class="mt-3 text-sm leading-7 text-black/60">${skillDefinitions.length} skill(s). Each links to its page, agent bootstrap, manifest, signed certificate, signature, and the shared authority file.</p>
        <div class="mt-6 space-y-5">${skillBlocks}</div>
      </section>

      <section class="mt-12 border-t border-black/15 pt-10">
        <h2 class="text-2xl font-black tracking-[-0.03em]">Registry &amp; trust documents</h2>
        <ul class="mt-5 grid gap-2 sm:grid-cols-2">
          ${linkRow('catalog.json — machine catalog', SKILL_CATALOG_PATH)}
          ${linkRow('use.md — hub agent bootstrap', SKILL_HUB_USE_PATH)}
          ${linkRow('skill-authority.json — trust root', SKILL_AUTHORITY_URL)}
          ${linkRow('GitHub registry source', SKILL_REPOSITORY_URL)}
        </ul>
      </section>
    </div>
  </main>`;
}
