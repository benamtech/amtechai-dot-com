/**
 * Single source for the skill detail body. React-free, returns a styled HTML string (Tailwind classes
 * are scanned from this .ts file). The prerenderer emits it as static HTML and the SkillDetail React
 * page injects the identical string — so crawlers, agents, and users see the same useful content:
 * title + description + metadata, the use.md bootstrap, what it does, every file (with inline
 * contents), and download/machine views. Content comes from the skill data model (registry +
 * generated content), not hand-written marketing copy.
 */
import {
  getSkill,
  skillPath,
  skillRepositoryFileUrl,
  skillRepositoryRegistryUrl,
  skillRepositoryTreeUrl,
  SKILL_AUTHORITY_URL,
  type SkillDefinition,
} from './registry.ts';
import { getSkillContent, type GeneratedSkillContent, type GeneratedSkillFile } from './generated/skill-content.ts';
import { renderMarkdown } from './markdown.ts';

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function chip(label: string, value: string): string {
  return `<div class="bg-[#f4f4f4] p-3"><dt class="font-mono text-[0.62rem] uppercase tracking-[0.12em] text-black/50">${esc(label)}</dt><dd class="mt-1 font-bold text-black">${esc(value)}</dd></div>`;
}

function fileBody(file: GeneratedSkillFile): string {
  if (!file.isText || !file.text) return '';
  const rendered = file.path.endsWith('.md')
    ? renderMarkdown(file.text)
    : `<pre class="overflow-x-auto text-xs leading-6"><code class="font-mono">${esc(file.text)}</code></pre>`;
  const open = file.role === 'primary-instructions';
  return `<details class="mt-4 border-t border-black/10 pt-3"${open ? ' open' : ''}><summary class="cursor-pointer font-mono text-xs font-bold uppercase tracking-[0.12em] text-black/55">${open ? 'Contents' : 'Show contents'}</summary><div class="mt-3">${rendered}</div></details>`;
}

function fileBlock(skill: SkillDefinition, file: GeneratedSkillFile): string {
  return `<div class="border border-black/15 bg-white">
      <div class="flex flex-wrap items-center justify-between gap-2 border-b border-black/10 px-4 py-3">
        <div>
          <p class="font-mono text-sm font-bold text-black">${esc(file.path)}</p>
          <p class="mt-0.5 text-xs text-black/55">${esc(file.title)} &middot; ${esc(file.role)} &middot; ${file.size} B</p>
        </div>
        <a class="font-mono text-xs font-bold text-red underline underline-offset-2" href="${esc(skillPath(skill, `/files/${file.path}`))}">raw &#8599;</a>
      </div>
      <div class="px-4 py-4">
        <p class="text-sm leading-7 text-black/70">${esc(file.summary)}</p>
        <p class="mt-2 text-xs text-black/50"><span class="font-semibold text-black/70">Load policy:</span> ${esc(file.loadPolicy)}</p>
        ${fileBody(file)}
      </div>
    </div>`;
}

function notFound(): string {
  return `<main class="bg-[#f4f4f4] text-black"><div class="container-wide max-w-4xl py-32 pt-36"><h1 class="text-4xl font-black">Skill not found.</h1><p class="mt-5"><a class="font-bold text-red underline" href="/skills">View all skills</a></p></div></main>`;
}

export function renderSkillContentHtml(slug: string): string {
  const skill = getSkill(slug);
  const content: GeneratedSkillContent | undefined = getSkillContent(slug);
  if (!skill || !content) return notFound();

  const safety = skill.safety;
  const trustTierLabel: Record<string, string> = {
    signed: 'Signed',
    'structure-verified': 'Structure-verified',
    'amtech-reviewed': 'AMTECH-reviewed',
    'replay-verified': 'Replay-verified',
    'behavior-verified': 'Behavior-verified',
  };
  const trustTier = content.trustTier ?? 'signed';
  const chips = [
    chip('Version', skill.version),
    chip('Trust tier', trustTierLabel[trustTier] ?? trustTier),
    chip('Scripts', safety.scripts),
    chip('Network', safety.requiresNetwork ? 'required' : 'no'),
  ].join('');

  const useCases = skill.useCases.map((u) => `<li class="leading-7">${esc(u)}</li>`).join('');
  const fileBlocks = content.files.map((f) => fileBlock(skill, f)).join('');
  const shortCommit = skill.repository.commit.slice(0, 12);
  const certificateId = content.certificateId ?? 'missing';
  const policyVersion = content.policyVersion;

  const evidenceItems: [string, string][] = [];
  if (content.conformanceEvidenceUrl) {
    evidenceItems.push(['Conformance evidence (offline checks)', content.conformanceEvidenceUrl]);
  }
  if (content.reviewEvidenceUrl) {
    evidenceItems.push(['AMTECH review evidence', content.reviewEvidenceUrl]);
  }
  const evidenceLinks = evidenceItems.length
    ? `<ul class="mt-5 grid gap-2 sm:grid-cols-2">${evidenceItems
        .map(([label, href]) => `<li><a class="block border border-black/15 bg-white px-4 py-3 text-sm font-semibold text-black hover:border-black hover:bg-black hover:text-white" href="${esc(href)}">${esc(label)} &#8599;</a></li>`)
        .join('')}</ul>`
    : '';

  // Build-time verdict badge (docs/skills/standard/05). Honest: "verified at build time" + a re-verify link
  // to the self-describing recipe — the page never presents a static badge as a live check.
  const verification = content.verification;
  const verdictBadge = verification
    ? `<div class="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 border border-black/15 bg-white px-4 py-3 text-sm">
        <span class="font-mono text-xs font-bold uppercase tracking-[0.12em] ${verification.verdict === 'verified' ? 'text-green-700' : 'text-red'}">${esc(verification.verdict)}</span>
        <span class="font-bold text-black">${esc(trustTierLabel[verification.trustTier ?? trustTier] ?? verification.trustTier ?? trustTier)}</span>
        <span class="text-black/55">verified at build time &middot; authority seq ${esc(verification.authoritySequence ?? 'n/a')} &middot; checked ${esc((verification.checkedAt ?? '').slice(0, 10))}</span>
        ${content.recipeUrl ? `<a class="font-mono text-xs font-bold text-red underline underline-offset-2" href="${esc(content.recipeUrl)}">re-verify (recipe) &#8599;</a>` : ''}
      </div>`
    : '';

  const views: [string, string][] = [
    ['use.md — agent bootstrap', skillPath(skill, '/use.md')],
    ['SKILL.md — canonical instructions', skillPath(skill, '/SKILL.md')],
    ['manifest.json — file graph + hashes', skillPath(skill, '/manifest.json')],
    ['files.md — full file index', skillPath(skill, '/files.md')],
    ['checksums.txt — integrity hashes', skillPath(skill, '/checksums.txt')],
    [`Download ${skill.slug}-${skill.version}.zip`, skillPath(skill, `/${skill.slug}-${skill.version}.zip`)],
  ];
  const viewLinks = views
    .map(([label, href]) => `<li><a class="block border border-black/15 bg-white px-4 py-3 text-sm font-semibold text-black hover:border-black hover:bg-black hover:text-white" href="${esc(href)}">${esc(label)}</a></li>`)
    .join('');

  return `<main class="bg-[#f4f4f4] text-black">
    <div class="container-wide max-w-4xl py-16 pt-28 md:py-24 md:pt-36">
      <h1 class="text-4xl font-black tracking-[-0.04em] md:text-5xl">${esc(skill.title)}</h1>
      <p class="mt-5 text-lg leading-8 text-black/70">${esc(skill.description)}</p>
      <dl class="mt-7 grid grid-cols-2 gap-px border border-black/15 bg-black/10 sm:grid-cols-4">${chips}</dl>
      <p class="mt-4 text-sm leading-7 text-black/60">${esc(safety.riskNote)}</p>

      <section class="mt-12 border-t border-black/15 pt-10">
        <div class="flex items-baseline justify-between gap-4">
          <h2 class="text-2xl font-black tracking-[-0.03em]">Use this skill</h2>
          <a class="shrink-0 font-mono text-xs font-bold text-red underline underline-offset-2" href="${esc(skillPath(skill, '/use.md'))}">use.md &#8599;</a>
        </div>
        <div class="mt-5">${renderMarkdown(content.useMd)}</div>
      </section>

      <section class="mt-12 border-t border-black/15 pt-10">
        <h2 class="text-2xl font-black tracking-[-0.03em]">What it does</h2>
        <ul class="mt-5 ml-5 list-disc space-y-2 text-black/75">${useCases}</ul>
      </section>

      <section class="mt-12 border-t border-black/15 pt-10">
        <h2 class="text-2xl font-black tracking-[-0.03em]">Source &amp; verification</h2>
        ${verdictBadge}
        <p class="mt-3 text-sm leading-7 text-black/65">This package has an AMTECH Signed Artifact v2 certificate. Its canonical certificate is signed with Ed25519 and binds the owner, skill, version, repository commit, SHA-256 digest, and SHA3-512 digest&mdash;plus a <code class="font-mono text-xs">sourcePackage</code> digest that anchors the same bytes across the website and the source registry.${evidenceLinks ? ` The certificate also carries an <code class="font-mono text-xs">attestations</code> predicate: an offline conformance run and an AMTECH human review${policyVersion ? ` under <code class="font-mono text-xs">${esc(policyVersion)}</code>` : ''}, each verified at build time with its evidence published below.` : ''}</p>
        ${evidenceLinks}
        <ul class="mt-5 grid gap-2 sm:grid-cols-2">
          <li><a class="block border border-black/15 bg-white px-4 py-3 text-sm font-semibold text-black hover:border-black" href="${esc(skillRepositoryTreeUrl(skill))}">GitHub source at ${esc(shortCommit)} &#8599;</a></li>
          <li><a class="block border border-black/15 bg-white px-4 py-3 text-sm font-semibold text-black hover:border-black" href="${esc(skillRepositoryFileUrl(skill, 'SKILL.md'))}">Commit-pinned SKILL.md &#8599;</a></li>
          <li><a class="block border border-black/15 bg-white px-4 py-3 text-sm font-semibold text-black hover:border-black" href="${esc(skillRepositoryRegistryUrl(skill))}">Commit-pinned repository registry &#8599;</a></li>
          <li><a class="block border border-black/15 bg-white px-4 py-3 text-sm font-semibold text-black hover:border-black" href="${esc(SKILL_AUTHORITY_URL)}">Domain authority file &#8599;</a></li>
          <li><a class="block border border-black/15 bg-white px-4 py-3 text-sm font-semibold text-black hover:border-black" href="${esc(skillPath(skill, '/certificate.json'))}">Signed certificate &#8599;</a></li>
          <li><a class="block border border-black/15 bg-white px-4 py-3 text-sm font-semibold text-black hover:border-black" href="${esc(skillPath(skill, '/certificate.sig'))}">Ed25519 signature &#8599;</a></li>
        </ul>
        <p class="mt-4 font-mono text-xs leading-6 text-black/50">Certificate: ${esc(certificateId)}. Commit: ${esc(skill.repository.commit)}. Signature: Ed25519. Digests: SHA-256 + SHA3-512.</p>
      </section>

      <section class="mt-12 border-t border-black/15 pt-10">
        <h2 class="text-2xl font-black tracking-[-0.03em]">Files in this skill</h2>
        <p class="mt-3 text-sm leading-7 text-black/60">${content.files.length} file(s). Contents are inline below; raw files and machine views are linked.</p>
        <div class="mt-6 space-y-5">${fileBlocks}</div>
      </section>

      <section class="mt-12 border-t border-black/15 pt-10">
        <h2 class="text-2xl font-black tracking-[-0.03em]">Download &amp; machine views</h2>
        <ul class="mt-5 grid gap-2 sm:grid-cols-2">${viewLinks}</ul>
      </section>
    </div>
  </main>`;
}
