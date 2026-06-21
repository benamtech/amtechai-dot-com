/**
 * React-free renderers that turn a PageMeta into HTML strings. Used by scripts/okf/prerender.ts
 * (build-time static HTML) and exercised by scripts/seo/validate-seo.ts. The runtime React app
 * applies the SAME PageMeta imperatively (src/components/seo/SeoManager.tsx) — this file is the
 * canonical string projection so crawlers/agents and the DOM never disagree.
 */
import { SITE_ORIGIN } from '../knowledge/concepts.ts';
import { canonicalUrl, type BodySection, type PageMeta } from './pageMeta.ts';

export function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

const absUrl = (href: string) => (href.startsWith('http') ? href : `${SITE_ORIGIN}${href}`);

/** All <head> tags for a page (everything that must replace or augment the template defaults). */
export function renderHeadTags(meta: PageMeta): string {
  const canonical = canonicalUrl(meta);
  const tags: string[] = [
    `<link rel="canonical" href="${esc(canonical)}" />`,
    meta.noindex ? `<meta name="robots" content="noindex, follow" />` : `<meta name="robots" content="index, follow" />`,
    `<meta property="og:site_name" content="AMTECH AI" />`,
    `<meta property="og:title" content="${esc(meta.title)}" />`,
    `<meta property="og:description" content="${esc(meta.description)}" />`,
    `<meta property="og:url" content="${esc(canonical)}" />`,
    `<meta property="og:type" content="${esc(meta.ogType)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(meta.title)}" />`,
    `<meta name="twitter:description" content="${esc(meta.description)}" />`,
  ];
  if (meta.image) {
    const img = absUrl(meta.image);
    tags.push(`<meta property="og:image" content="${esc(img)}" />`, `<meta name="twitter:image" content="${esc(img)}" />`);
  }
  for (const alt of meta.alternates) {
    tags.push(
      `<link rel="alternate" type="${esc(alt.type)}" href="${esc(absUrl(alt.href))}"${alt.title ? ` title="${esc(alt.title)}"` : ''} />`,
    );
  }
  for (const ld of meta.jsonLd) {
    tags.push(`<script type="application/ld+json">${JSON.stringify(ld)}</script>`);
  }
  if (meta.agentMap) {
    // Compact, machine-readable instruction payload for agents that will not parse the page body.
    const payload = {
      page: canonical,
      title: meta.title,
      summary: meta.agentMap.summary,
      ...(meta.agentMap.actions ? { actions: meta.agentMap.actions } : {}),
      ...(meta.agentMap.alternates ? { alternates: meta.agentMap.alternates.map((a) => ({ ...a, href: absUrl(a.href) })) } : {}),
      ...(meta.agentMap.seeAlso ? { seeAlso: meta.agentMap.seeAlso } : {}),
      // Skill CA blocks (docs/skills/standard/05): bootstrap order, the verification recipe + verdict, and the
      // quick file-route map. Descriptive pointers only — the proof is the recompute, never the head.
      ...(meta.agentMap.skill ? { skill: meta.agentMap.skill } : {}),
      ...(meta.agentMap.verify ? { verify: meta.agentMap.verify } : {}),
      ...(meta.agentMap.files ? { files: meta.agentMap.files } : {}),
    };
    tags.push(`<script type="application/json" id="amtech-agent-map">${JSON.stringify(payload)}</script>`);
  }
  for (const em of meta.extraMeta ?? []) {
    tags.push(`<meta name="${esc(em.name)}" content="${esc(em.content)}" />`);
  }
  return tags.join('\n    ');
}

function sectionHtml(s: BodySection): string {
  const parts: string[] = [];
  if (s.heading) parts.push(`<h2>${esc(s.heading)}</h2>`);
  if (s.paragraphs) parts.push(...s.paragraphs.map((p) => `<p>${esc(p)}</p>`));
  if (s.bullets) parts.push(`<ul>${s.bullets.map((b) => `<li>${esc(b)}</li>`).join('')}</ul>`);
  return parts.join('');
}

/**
 * Authored body for routes whose readable copy is not available React-free (marketing/hub routes).
 * Returns '' when no sections are authored — the caller then keeps its own richer content (articles)
 * or falls back to a minimal title/description block.
 */
export function renderSectionsHtml(meta: PageMeta): string {
  if (!meta.sections?.length) return '';
  const noscript = meta.agentMap
    ? `<noscript><p>${esc(meta.agentMap.summary)}</p></noscript>`
    : '';
  return `<main><h1>${esc(meta.title.replace(/ \| AMTECH AI$/, ''))}</h1><p>${esc(meta.description)}</p>${meta.sections
    .map(sectionHtml)
    .join('')}${noscript}</main>`;
}
