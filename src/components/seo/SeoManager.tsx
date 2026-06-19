import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { canonicalUrl, getPageMeta, DEFAULT_TITLE, SITE_NAME, type PageMeta } from '../../lib/seo/pageMeta';

/**
 * The single runtime head authority. On every route change it applies the SAME PageMeta the
 * build-time prerenderer baked into the static HTML (src/lib/seo/pageMeta.ts), so the DOM head
 * stays correct during client-side navigation — title, description, canonical, Open Graph, Twitter,
 * robots, JSON-LD, and the agent-map payload. Rendered once inside the Router. This replaces the
 * old per-page useArticleHead (which only touched title + description).
 */
const SITE_ORIGIN = 'https://amtechai.com';
const absUrl = (href: string) => (href.startsWith('http') ? href : `${SITE_ORIGIN}${href}`);

function upsertNamed(selector: string, create: () => HTMLElement, apply: (el: HTMLElement) => void) {
  let el = document.head.querySelector<HTMLElement>(selector);
  if (!el) {
    el = create();
    document.head.appendChild(el);
  }
  apply(el);
}

function clearManaged() {
  document.head
    .querySelectorAll(
      'link[rel="canonical"], meta[property^="og:"], meta[name^="twitter:"], meta[name="robots"], script[type="application/ld+json"], script[data-seo-managed], link[data-seo-managed]',
    )
    .forEach((n) => n.remove());
}

function metaProp(property: string, content: string) {
  const m = document.createElement('meta');
  m.setAttribute('property', property);
  m.setAttribute('content', content);
  document.head.appendChild(m);
}
function metaName(name: string, content: string) {
  const m = document.createElement('meta');
  m.setAttribute('name', name);
  m.setAttribute('content', content);
  document.head.appendChild(m);
}

function apply(meta: PageMeta) {
  const canonical = canonicalUrl(meta);
  document.title = meta.title;

  upsertNamed(
    'meta[name="description"]',
    () => {
      const m = document.createElement('meta');
      m.setAttribute('name', 'description');
      return m;
    },
    (el) => el.setAttribute('content', meta.description),
  );

  clearManaged();

  const canon = document.createElement('link');
  canon.setAttribute('rel', 'canonical');
  canon.setAttribute('href', canonical);
  document.head.appendChild(canon);

  metaName('robots', meta.noindex ? 'noindex, follow' : 'index, follow');
  metaProp('og:site_name', SITE_NAME);
  metaProp('og:title', meta.title);
  metaProp('og:description', meta.description);
  metaProp('og:url', canonical);
  metaProp('og:type', meta.ogType);
  metaName('twitter:card', 'summary_large_image');
  metaName('twitter:title', meta.title);
  metaName('twitter:description', meta.description);
  if (meta.image) {
    metaProp('og:image', absUrl(meta.image));
    metaName('twitter:image', absUrl(meta.image));
  }

  for (const alt of meta.alternates) {
    const link = document.createElement('link');
    link.setAttribute('rel', 'alternate');
    link.setAttribute('type', alt.type);
    link.setAttribute('href', absUrl(alt.href));
    if (alt.title) link.setAttribute('title', alt.title);
    link.setAttribute('data-seo-managed', '');
    document.head.appendChild(link);
  }

  for (const ld of meta.jsonLd) {
    const s = document.createElement('script');
    s.type = 'application/ld+json';
    s.textContent = JSON.stringify(ld);
    document.head.appendChild(s);
  }

  if (meta.agentMap) {
    const s = document.createElement('script');
    s.type = 'application/json';
    s.id = 'amtech-agent-map';
    s.setAttribute('data-seo-managed', '');
    s.textContent = JSON.stringify({
      page: canonical,
      title: meta.title,
      summary: meta.agentMap.summary,
      ...(meta.agentMap.actions ? { actions: meta.agentMap.actions } : {}),
      ...(meta.agentMap.alternates ? { alternates: meta.agentMap.alternates.map((a) => ({ ...a, href: absUrl(a.href) })) } : {}),
      ...(meta.agentMap.seeAlso ? { seeAlso: meta.agentMap.seeAlso } : {}),
    });
    document.head.appendChild(s);
  }
}

export default function SeoManager() {
  const { pathname } = useLocation();
  useEffect(() => {
    const meta = getPageMeta(pathname);
    if (meta) {
      apply(meta);
    } else {
      // Unknown route: restore safe defaults rather than leaving stale per-page tags.
      document.title = DEFAULT_TITLE;
    }
  }, [pathname]);
  return null;
}
