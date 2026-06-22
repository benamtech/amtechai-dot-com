/**
 * Single source for the /certificates/:id body. React-free styled HTML string (Tailwind scanned from this
 * file), baked by the prerenderer and injected by the Certificate React page. One page per AMTECH Signed
 * Artifact certificate: every bound field (subject, digests, sourcePackage, bootstrap, attestations), the
 * Ed25519 signature + key, and links to the manifest, source, the authority record that commits it, and the
 * transparency-log inclusion. A live recompute widget (mounted at [data-recompute-widget]) re-verifies it.
 *
 * Certificates are keyed by a URL-safe id (certificateSlug: colons → hyphens). Today they are the per-skill
 * certificates; the layout generalizes to document/page certificates that link to other certificates.
 */
import { skillDefinitions, skillPath, SKILL_AUTHORITY_URL } from './registry.ts';
import { skillCertificates, skillAuthoritySth, skillAuthorityLog } from './generated/skill-content.ts';
import { certificateSlug } from './renderRegistryContent.ts';

type EvidenceRef = { url?: string; sha256?: string };
type Cert = {
  schemaVersion?: string;
  certificateId?: string;
  subjectType?: string;
  subjectId?: string;
  version?: string;
  owner?: { name?: string; url?: string };
  issuer?: { name?: string; url?: string };
  signingKeyId?: string;
  signingKeyUrl?: string;
  issuedAt?: string;
  repository?: { url?: string; path?: string };
  digests?: { sha256?: string; sha3_512?: string };
  sourcePackage?: { sha256?: string; sha3_512?: string };
  bootstrap?: { use?: { sha256?: string }; agent?: { sha256?: string } };
  attestations?: {
    policyVersion?: string;
    trustTier?: string;
    permissions?: { filesystem?: string; network?: string; secrets?: string; scripts?: string[] };
    conformance?: { suite?: string; method?: string; result?: string; ranAt?: string; evidence?: EvidenceRef };
    review?: { reviewer?: { name?: string }; result?: string; reviewedAt?: string; evidence?: EvidenceRef };
  };
};
type CertEntry = { slug: string; certificateBytesSha256?: string; certificate: Cert };

const CERTS = skillCertificates as CertEntry[];

/** Every certificate id (URL-safe) — used by the prerenderer + meta registry to enumerate pages. */
export function listCertificateSlugs(): string[] {
  return CERTS.map((c) => certificateSlug(c.certificate.certificateId ?? c.slug));
}
export function certificateEntryFor(id: string): CertEntry | undefined {
  return CERTS.find((c) => certificateSlug(c.certificate.certificateId ?? c.slug) === id);
}

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
const mono = (s: string) => `<code class="break-all rounded bg-black/8 px-1.5 py-0.5 font-mono text-[0.8em]">${esc(s)}</code>`;
function row(label: string, valueHtml: string): string {
  return `<div class="flex flex-col gap-0.5 border-b border-black/10 py-2.5 last:border-0 sm:flex-row sm:gap-4">
      <dt class="shrink-0 font-mono text-xs font-semibold uppercase tracking-[0.08em] text-black/55 sm:w-44">${esc(label)}</dt>
      <dd class="min-w-0 text-sm text-black/80">${valueHtml}</dd>
    </div>`;
}
function linkVal(label: string, href: string): string {
  return `<a class="break-all font-semibold text-red underline underline-offset-2 hover:text-black" href="${esc(href)}">${esc(label)}</a>`;
}

export function renderCertificateContentHtml(id: string): string {
  const entry = certificateEntryFor(id);
  if (!entry) {
    return `<main class="bg-[#f4f4f4] text-black"><div class="container-wide max-w-3xl py-24 pt-36">
      <h1 class="text-3xl font-black tracking-[-0.04em]">Certificate not found</h1>
      <p class="mt-4 text-black/70">No certificate matches <code class="rounded bg-black/8 px-1 font-mono">${esc(id)}</code>. See the <a class="font-semibold text-red underline" href="/registry">full registry</a>.</p>
    </div></main>`;
  }
  const c = entry.certificate;
  const skill = skillDefinitions.find((s) => s.slug === entry.slug);
  const att = c.attestations;
  const sth = skillAuthoritySth;
  const headStem = String(skillAuthorityLog.latestSequence ?? '0').padStart(4, '0');

  const attestationBlock = att
    ? `<section class="mt-8 border-2 border-black bg-white p-5 md:p-7">
        <h2 class="text-xl font-black tracking-[-0.03em]">Attestations</h2>
        <dl class="mt-3">
          ${row('Trust tier', mono(att.trustTier ?? 'signed'))}
          ${row('Policy version', esc(att.policyVersion ?? 'n/a'))}
          ${att.permissions ? row('Permissions', `filesystem ${mono(att.permissions.filesystem ?? 'none')} · network ${mono(att.permissions.network ?? 'none')} · secrets ${mono(att.permissions.secrets ?? 'none')} · scripts ${esc(String(att.permissions.scripts?.length ?? 0))}`) : ''}
          ${att.conformance ? row('Conformance', `${esc(att.conformance.suite ?? '')} · ${mono(att.conformance.method ?? '')} · <strong>${esc(att.conformance.result ?? '')}</strong>${att.conformance.evidence?.url ? ` · ${linkVal('evidence', att.conformance.evidence.url)}` : ''}`) : ''}
          ${att.review ? row('Review', `${esc(att.review.reviewer?.name ?? 'reviewer')} · <strong>${esc(att.review.result ?? '')}</strong> · ${esc(att.review.reviewedAt ?? '')}${att.review.evidence?.url ? ` · ${linkVal('evidence', att.review.evidence.url)}` : ''}`) : ''}
        </dl>
      </section>`
    : '';

  return `<main class="bg-[#f4f4f4] text-black">
    <div class="container-wide max-w-3xl py-16 pt-28 md:py-24 md:pt-36">
      <p class="font-mono text-xs font-bold uppercase tracking-[0.12em] text-black/50"><a class="text-red underline" href="/registry">registry</a> / certificate</p>
      <h1 class="mt-3 break-all text-3xl font-black tracking-[-0.04em] md:text-4xl">${esc(c.certificateId ?? entry.slug)}</h1>
      <p class="mt-4 text-base leading-7 text-black/70">An AMTECH Signed Artifact certificate (${esc(c.schemaVersion ?? 'v2')}) — an Ed25519 signature over a deterministic, canonical payload binding this skill's identity, source bytes, agent-entry surfaces, and attestations. Recompute it yourself below; it is also committed in the ${linkVal('transparency log', '/registry')}.</p>

      <section class="mt-8 border-2 border-black bg-black p-5 text-white md:p-7">
        <h2 class="text-xl font-black tracking-[-0.03em]">Verify this certificate</h2>
        <p class="mt-2 text-sm leading-7 text-white/75">Recompute the signature, source package, manifest SRI, catalog root, authority record, and the transparency-log inclusion in your browser.</p>
        <div data-recompute-widget class="mt-4"></div>
      </section>

      <section class="mt-8 border-2 border-black bg-white p-5 md:p-7">
        <h2 class="text-xl font-black tracking-[-0.03em]">Bound fields</h2>
        <dl class="mt-3">
          ${row('Subject', `${mono(c.subjectId ?? entry.slug)} · v${esc(c.version ?? skill?.version ?? '')}`)}
          ${row('Subject type', esc(c.subjectType ?? 'skill'))}
          ${row('Owner', c.owner?.url ? linkVal(c.owner.name ?? c.owner.url, c.owner.url) : esc(c.owner?.name ?? 'AMTECH AI'))}
          ${row('Issuer', c.issuer?.url ? linkVal(c.issuer.name ?? c.issuer.url, c.issuer.url) : esc(c.issuer?.name ?? 'AMTECH AI'))}
          ${row('Issued at', esc(c.issuedAt ?? 'n/a'))}
          ${row('Signing key', `${mono(c.signingKeyId ?? '')}${c.signingKeyUrl ? ` · ${linkVal('key document', c.signingKeyUrl)}` : ''}`)}
          ${c.digests ? row('Archive digests', `sha256 ${mono(c.digests.sha256 ?? '')}<br/>sha3-512 ${mono((c.digests.sha3_512 ?? '').slice(0, 32) + '…')}`) : ''}
          ${c.sourcePackage ? row('Source package', `sha256 ${mono(c.sourcePackage.sha256 ?? '')}`) : ''}
          ${c.bootstrap ? row('Bootstrap (use/agent)', `use ${mono((c.bootstrap.use?.sha256 ?? '').slice(0, 16) + '…')} · agent ${mono((c.bootstrap.agent?.sha256 ?? '').slice(0, 16) + '…')}`) : ''}
          ${entry.certificateBytesSha256 ? row('Certificate bytes', mono(entry.certificateBytesSha256)) : ''}
        </dl>
      </section>

      ${attestationBlock}

      <section class="mt-8 border-2 border-black bg-white p-5 md:p-7">
        <h2 class="text-xl font-black tracking-[-0.03em]">Linked artifacts</h2>
        <ul class="mt-3 space-y-2 text-sm">
          ${skill ? `<li>${linkVal('certificate.json', skillPath(skill, '/certificate.json'))}</li>` : ''}
          ${skill ? `<li>${linkVal('certificate.sig (Ed25519)', skillPath(skill, '/certificate.sig'))}</li>` : ''}
          ${skill ? `<li>${linkVal('manifest.json (file graph + SRI)', skillPath(skill, '/manifest.json'))}</li>` : ''}
          ${skill ? `<li>${linkVal('recipe.json (verification recipe)', skillPath(skill, '/recipe.json'))}</li>` : ''}
          ${skill ? `<li>${linkVal('skill page', skillPath(skill))}</li>` : ''}
          <li>${linkVal('authority record that commits this certificate', `/.well-known/authority/records/${headStem}.json`)}</li>
          ${sth ? `<li>${linkVal('signed tree head (transparency log)', '/.well-known/authority/sth.json')} · root ${mono(sth.rootHash.slice(0, 16) + '…')}</li>` : ''}
          <li>${linkVal('skill-authority.json (trust root)', SKILL_AUTHORITY_URL)}</li>
          ${skill ? `<li>${linkVal('GitHub source (commit-pinned)', `${skill.repository.url}/tree/${skill.repository.commit}/${skill.repository.path}`)}</li>` : ''}
        </ul>
      </section>
    </div>
  </main>`;
}
