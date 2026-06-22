/**
 * Single source for the /registry body. React-free, returns a styled HTML string (Tailwind classes are
 * scanned from this .ts file). The prerenderer bakes it into static HTML and the Registry React page injects
 * the identical string — so crawlers, agents, and users see the same FULL materialization of the AMTECH
 * skill certificate authority: every catalog entry, the trust root + signing keys, the RFC-6962 transparency
 * log (signed tree head + every record/leaf), and every per-skill artifact (certificate, signature, manifest,
 * files with SHA-256, recipe, evidence) — each one a link. A client-side verification widget (mounted at
 * #registry-verify-widget) recomputes any skill/record/certificate live and shows where it sits in the tree.
 *
 * Mirrors renderHubContent.ts / renderSkillContent.ts: same React-free posture + esc idioms + dual consumption.
 * "Show absolutely everything" is the design goal — this page is the human-readable index of the whole registry.
 */
import { skillDefinitions, skillPath, SKILL_AUTHORITY_URL, SKILL_REPOSITORY_URL, type SkillDefinition } from './registry.ts';
import { getSkillContent, skillCatalogRoot, skillsCount, skillAuthoritySth, skillAuthorityLog } from './generated/skill-content.ts';

const WK = '/.well-known';
const AUTHORITY_BASE = `${WK}/authority`;
const CATALOG_PATH = '/skills/catalog.json';
const SIGNING_KEY_PATH = `${WK}/amtech-signing-key.json`;

/** URL-safe id for a certificate's detail page (/certificates/:id). Colons → hyphens. */
export function certificateSlug(certificateId: string): string {
  return certificateId.replace(/[:]/g, '-');
}

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
const mono = (s: string) => `<code class="break-all rounded bg-black/8 px-1.5 py-0.5 font-mono text-[0.8em]">${esc(s)}</code>`;
function link(label: string, href: string): string {
  return `<a class="break-all font-semibold text-red underline underline-offset-2 hover:text-black" href="${esc(href)}">${esc(label)}</a>`;
}
function artifactRow(label: string, href: string, note?: string): string {
  return `<li class="flex flex-col gap-0.5 border-b border-black/10 py-2 last:border-0 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
      <span class="font-mono text-xs font-semibold text-black/80">${esc(label)}</span>
      <span class="flex flex-wrap items-baseline gap-2 text-xs">${link('open ↗', href)}${note ? `<span class="text-black/45">${note}</span>` : ''}</span>
    </li>`;
}

const TRUST_TIER_LABEL: Record<string, string> = {
  signed: 'Signed',
  'structure-verified': 'Structure-verified',
  'amtech-reviewed': 'AMTECH-reviewed',
  'replay-verified': 'Replay-verified',
  'behavior-verified': 'Behavior-verified',
};

/** Trust root + the keys/documents that anchor everything else. */
function trustRootSection(): string {
  const sth = skillAuthoritySth;
  return `<section class="mt-10 border-2 border-black bg-white p-5 md:p-7">
      <h2 class="text-xl font-black tracking-[-0.03em] md:text-2xl">Trust root</h2>
      <p class="mt-2 text-sm leading-7 text-black/70">Everything in this registry is verifiable against one domain-controlled Ed25519 key and one append-only log. The root of trust is <strong>domain control + TLS + the self-served signing key</strong> — verifiable and tamper-evident, deliberately <em>not</em> claimed as trustless.</p>
      <dl class="mt-4 space-y-1.5 font-mono text-xs text-black/70">
        <div><dt class="inline font-semibold text-black">Catalog root:</dt> <dd class="inline">${mono(skillCatalogRoot)}</dd></div>
        ${sth ? `<div><dt class="inline font-semibold text-black">Transparency-log root:</dt> <dd class="inline">${mono(sth.rootHash)} <span class="text-black/45">(tree size ${esc(sth.treeSize)})</span></dd></div>` : ''}
      </dl>
      <ul class="mt-4">
        ${artifactRow('catalog.json — machine catalog (amtech-skill-catalog/v1)', CATALOG_PATH)}
        ${artifactRow('skill-authority.json — trust root + latest pointer', SKILL_AUTHORITY_URL)}
        ${artifactRow('amtech-signing-key.json — active Ed25519 public key', SIGNING_KEY_PATH)}
        ${artifactRow('keys/ — every key by id (active + retired, historical verification)', `${WK}/keys/`)}
        ${artifactRow('commit-signing-key.pub — SSH publishing-commit key', `${WK}/commit-signing-key.pub`)}
      </ul>
    </section>`;
}

/** The RFC-6962 transparency log: signed tree head + every record/leaf, each linked. */
function transparencyLogSection(): string {
  const sth = skillAuthoritySth;
  const leaves = skillAuthorityLog.leaves;
  const leafCards = leaves
    .map((r) => {
      const inclusionUrl = sth ? `${AUTHORITY_BASE}/proofs/${sth.treeSize}/inclusion/${r.sequence}.json` : '#';
      const isHead = r.recordHash === skillAuthorityLog.latestRecordHash;
      return `<li class="border border-black/15 bg-white p-4 ${isHead ? 'ring-2 ring-red' : ''}">
          <div class="flex flex-wrap items-baseline justify-between gap-2">
            <h3 class="font-mono text-sm font-bold text-black">record ${esc(r.sequence)}${isHead ? ' <span class="text-red">· head</span>' : ''}</h3>
            <span class="font-mono text-[0.7rem] uppercase tracking-[0.1em] text-black/45">${esc(r.events.join(', ') || 'state')}</span>
          </div>
          <dl class="mt-2 space-y-1 font-mono text-[0.7rem] leading-5 text-black/65">
            <div><dt class="inline font-semibold text-black/80">recordHash:</dt> <dd class="inline break-all">${esc(r.recordHash)}</dd></div>
            <div><dt class="inline font-semibold text-black/80">leaf (0x00‖record):</dt> <dd class="inline break-all">${esc(r.leafHash)}</dd></div>
            ${r.issuedAt ? `<div><dt class="inline font-semibold text-black/80">issuedAt:</dt> <dd class="inline">${esc(r.issuedAt)}</dd></div>` : ''}
          </dl>
          <p class="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs">
            ${link('record.json', `${AUTHORITY_BASE}/records/${r.stem}.json`)}
            ${link('record.sig', `${AUTHORITY_BASE}/records/${r.stem}.sig`)}
            ${link('inclusion proof', inclusionUrl)}
          </p>
        </li>`;
    })
    .join('');

  return `<section class="mt-10 border-2 border-black bg-white p-5 md:p-7">
      <h2 class="text-xl font-black tracking-[-0.03em] md:text-2xl">Transparency log (RFC&nbsp;6962)</h2>
      <p class="mt-2 text-sm leading-7 text-black/70">A single append-only Merkle log folds every signed authority record (each one a full catalog snapshot) into one tree. Leaf = <code class="rounded bg-black/8 px-1 font-mono text-[0.8em]">SHA-256(0x00 ‖ canonicalJson(record))</code>; nodes = <code class="rounded bg-black/8 px-1 font-mono text-[0.8em]">SHA-256(0x01 ‖ L ‖ R)</code>. The signed tree head commits to the root; anyone can recompute it and verify inclusion + append-only consistency. <em>Trust-minimized — independent witnesses and external anchors are scaffolded but not yet active.</em></p>
      <dl class="mt-4 space-y-1.5 font-mono text-xs text-black/70">
        ${sth ? `<div><dt class="inline font-semibold text-black">root:</dt> <dd class="inline">${mono(sth.rootHash)}</dd></div>` : ''}
        ${sth ? `<div><dt class="inline font-semibold text-black">tree size:</dt> <dd class="inline">${esc(sth.treeSize)} record(s)</dd></div>` : ''}
        <div><dt class="inline font-semibold text-black">latest sequence:</dt> <dd class="inline">${esc(skillAuthorityLog.latestSequence ?? 'n/a')}</dd></div>
      </dl>
      <ul class="mt-4">
        ${artifactRow('sth.json — signed tree head', `${AUTHORITY_BASE}/sth.json`)}
        ${sth ? artifactRow(`sth/${sth.treeSize}.json — immutable STH archive`, `${AUTHORITY_BASE}/sth/${sth.treeSize}.json`) : ''}
        ${artifactRow('log.json — append-only record index', `${AUTHORITY_BASE}/log.json`)}
      </ul>
      <h3 class="mt-6 text-sm font-black uppercase tracking-[0.1em] text-black/60">Leaves (${leaves.length})</h3>
      <ul class="mt-3 grid gap-2">${leafCards}</ul>
    </section>`;
}

/** Per-skill: identity + every published artifact, each linked, with digests inline. */
function skillSection(skill: SkillDefinition): string {
  const content = getSkillContent(skill.slug);
  const certId = content?.certificateId;
  const tier = content?.trustTier ?? 'signed';
  const fileRows = (content?.files ?? [])
    .map((f) => artifactRow(`${f.path} · ${f.role}`, skillPath(skill, `/files/${f.path}`), `sha256 ${f.sha256.slice(0, 12)}…`))
    .join('');
  return `<details class="group border-2 border-black bg-white">
      <summary class="flex cursor-pointer flex-wrap items-baseline justify-between gap-3 p-5 md:p-6">
        <span class="text-lg font-black tracking-[-0.03em] md:text-xl">${esc(skill.title)}</span>
        <span class="font-mono text-[0.7rem] uppercase tracking-[0.12em] text-black/55">${esc(skill.slug)} · v${esc(skill.version)} · ${esc(TRUST_TIER_LABEL[tier] ?? tier)}${content?.verification ? ` · ${esc(content.verification.verdict)}` : ''}</span>
      </summary>
      <div class="border-t border-black/15 p-5 md:p-6">
        <dl class="space-y-1.5 font-mono text-xs text-black/70">
          ${certId ? `<div><dt class="inline font-semibold text-black">certificate:</dt> <dd class="inline">${mono(certId)}</dd></div>` : ''}
          ${content?.archiveSha256 ? `<div><dt class="inline font-semibold text-black">archive sha256:</dt> <dd class="inline break-all">${esc(content.archiveSha256)}</dd></div>` : ''}
          ${content?.verification ? `<div><dt class="inline font-semibold text-black">verdict:</dt> <dd class="inline">${esc(content.verification.verdict)} · ${esc(content.verification.method ?? 'n/a')} · seq ${esc(content.verification.authoritySequence ?? 'n/a')}</dd></div>` : ''}
        </dl>
        <ul class="mt-4">
          ${artifactRow('skill page', skillPath(skill))}
          ${certId ? artifactRow('certificate detail page', `/certificates/${certificateSlug(certId)}`) : ''}
          ${artifactRow('certificate.json — signed certificate', skillPath(skill, '/certificate.json'))}
          ${artifactRow('certificate.sig — Ed25519 signature', skillPath(skill, '/certificate.sig'))}
          ${artifactRow('manifest.json — file graph + SRI', skillPath(skill, '/manifest.json'))}
          ${artifactRow('recipe.json — self-describing verification recipe', skillPath(skill, '/recipe.json'))}
          ${artifactRow('use.md — agent bootstrap', skillPath(skill, '/use.md'))}
          ${artifactRow('agent.md — agent-entry surface', skillPath(skill, '/agent.md'))}
          ${content?.conformanceEvidenceUrl ? artifactRow('conformance evidence', content.conformanceEvidenceUrl) : ''}
          ${content?.reviewEvidenceUrl ? artifactRow('review evidence', content.reviewEvidenceUrl) : ''}
          ${artifactRow('GitHub source (commit-pinned)', `${skill.repository.url}/tree/${skill.repository.commit}/${skill.repository.path}`)}
        </ul>
        <h4 class="mt-5 text-xs font-black uppercase tracking-[0.1em] text-black/55">Files (${content?.files?.length ?? 0})</h4>
        <ul class="mt-2">${fileRows}</ul>
      </div>
    </details>`;
}

export function renderRegistryContentHtml(): string {
  return `<main class="bg-[#f4f4f4] text-black">
    <div class="container-wide max-w-4xl py-16 pt-28 md:py-24 md:pt-36">
      <h1 class="text-4xl font-black tracking-[-0.04em] md:text-5xl">AMTECH Skill Registry</h1>
      <p class="mt-5 text-lg leading-8 text-black/70">The complete, verifiable contents of the AMTECH skill certificate authority — every skill, certificate, signature, key, manifest, file, and the RFC-6962 transparency log — laid out as one navigable index. ${esc(String(skillsCount))} certified skill(s). Nothing here asks you to trust a badge: recompute any of it yourself, in your browser or with <code class="rounded bg-black/8 px-1 font-mono text-[0.85em]">npm run skills:verify</code>.</p>

      <section class="mt-8 border-2 border-black bg-black p-5 text-white md:p-7">
        <h2 class="text-xl font-black tracking-[-0.03em] md:text-2xl">Verify anything, live</h2>
        <p class="mt-2 text-sm leading-7 text-white/75">Recompute a skill, certificate, or authority record in your browser (WebCrypto + fetch) and see exactly where it connects in the catalog root and Merkle tree. A downstream copy of this page cannot fake it — it has to run the math.</p>
        <div id="registry-verify-widget" class="mt-4"></div>
      </section>

      ${trustRootSection()}
      ${transparencyLogSection()}

      <section class="mt-10">
        <div class="flex items-baseline justify-between gap-4">
          <h2 class="text-xl font-black tracking-[-0.03em] md:text-2xl">Certified skills</h2>
          <a class="shrink-0 font-mono text-xs font-bold text-red underline underline-offset-2" href="${esc(CATALOG_PATH)}">catalog.json ↗</a>
        </div>
        <p class="mt-2 text-sm leading-7 text-black/60">Open any skill to see every published artifact with its digest and link.</p>
        <div class="mt-5 grid gap-3">${skillDefinitions.map(skillSection).join('')}</div>
      </section>

      <section class="mt-10 border-t border-black/15 pt-8">
        <h2 class="text-xl font-black tracking-[-0.03em]">Standard &amp; source</h2>
        <ul class="mt-4">
          ${artifactRow('GitHub registry (install source)', SKILL_REPOSITORY_URL)}
          ${artifactRow('Skills hub (/skills)', '/skills')}
          ${artifactRow('skill-authority.json (trust root)', SKILL_AUTHORITY_URL)}
        </ul>
      </section>
    </div>
  </main>`;
}
