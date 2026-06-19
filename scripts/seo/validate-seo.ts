/**
 * SEO / meta materialization validator. Run AFTER `npm run build` (needs dist/**).
 *
 * Hard gates (exit 1 on failure):
 *   C1 Coverage   — every route in the meta registry has a prerendered dist/<route>/index.html.
 *   C2 Title      — page <title> equals the registry title (no homepage-default leakage off '/').
 *   C3 Meta       — description, canonical, og:title/description/url/type, twitter card/title/desc present + correct.
 *   C4 JSON-LD    — pages whose registry meta declares jsonLd ship those <script type=ld+json> blocks.
 *   C5 Body       — prerendered #root contains a heading and >= MIN_WORDS of readable text (no bare shell).
 *   C6 Alternates — declared rel=alternate twins are present in <head>.
 *
 * This is the executable form of the acceptance criteria in
 * docs/memory/plan-2026-06-19--unified-meta-and-delivery.md.
 */
import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { canonicalUrl, listPageMeta, DEFAULT_TITLE } from '../../src/lib/seo/pageMeta.ts';
import { esc } from '../../src/lib/seo/renderHead.ts';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const distDir = resolve(repoRoot, 'dist');
const MIN_WORDS = 25;

const errors: string[] = [];
const warnings: string[] = [];

function distPathFor(route: string): string {
  return resolve(distDir, route === '/' ? 'index.html' : `${route.replace(/^\//, '')}/index.html`);
}

function rootText(html: string): string {
  // Vite hoists the module script into <head>, so #root closes right before </body>.
  // Our prerendered bodies contain no nested <div>, so the first </div> is the root close.
  const m = html.match(/<div id="root">([\s\S]*?)<\/div>/);
  const inner = m ? m[1] : '';
  return inner
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

async function main() {
  const pages = listPageMeta();
  let checked = 0;

  for (const meta of pages) {
    const file = distPathFor(meta.route);
    let html: string;
    try {
      html = await readFile(file, 'utf8');
    } catch {
      errors.push(`C1 ${meta.route}: missing prerendered file (${file}).`);
      continue;
    }
    checked++;
    const where = `[${meta.route}]`;
    const canonical = canonicalUrl(meta);

    // C2 title
    if (!html.includes(`<title>${esc(meta.title)}</title>`)) {
      errors.push(`C2 ${where} title mismatch — expected "${meta.title}".`);
    }
    if (meta.route !== '/' && html.includes(`<title>${esc(DEFAULT_TITLE)}</title>`)) {
      errors.push(`C2 ${where} leaked homepage default title.`);
    }

    // C3 core meta
    const required: [string, string][] = [
      ['description', `<meta name="description" content="${esc(meta.description)}" />`],
      ['canonical', `<link rel="canonical" href="${esc(canonical)}" />`],
      ['og:title', `<meta property="og:title" content="${esc(meta.title)}" />`],
      ['og:description', `<meta property="og:description" content="${esc(meta.description)}" />`],
      ['og:url', `<meta property="og:url" content="${esc(canonical)}" />`],
      ['og:type', `<meta property="og:type" content="${esc(meta.ogType)}" />`],
      ['twitter:card', `<meta name="twitter:card" content="summary_large_image" />`],
      ['twitter:title', `<meta name="twitter:title" content="${esc(meta.title)}" />`],
      ['twitter:description', `<meta name="twitter:description" content="${esc(meta.description)}" />`],
    ];
    for (const [label, tag] of required) {
      if (!html.includes(tag)) errors.push(`C3 ${where} missing/incorrect ${label}.`);
    }

    // C4 JSON-LD
    const ldCount = (html.match(/<script type="application\/ld\+json">/g) ?? []).length;
    if (meta.jsonLd.length > 0 && ldCount < 1) {
      errors.push(`C4 ${where} declares ${meta.jsonLd.length} JSON-LD block(s) but none rendered.`);
    }

    // C5 body richness
    const text = rootText(html);
    const words = text ? text.split(' ').length : 0;
    const hasHeading = /<h[12][ >]/i.test(html.split('<div id="root">')[1] ?? '');
    // noindex pages (transactional: /pay, /payment-success) are not for crawlers/agents — warn only.
    if (words < MIN_WORDS) {
      (meta.noindex ? warnings : errors).push(`C5 ${where} thin body (${words} words < ${MIN_WORDS}).`);
    }
    if (!hasHeading) warnings.push(`C5 ${where} no <h1>/<h2> in prerendered body.`);

    // C6 alternates: link present in <head> AND (for same-origin .md twins) the file exists on disk.
    for (const alt of meta.alternates) {
      const href = alt.href.startsWith('http') ? alt.href : `https://amtechai.com${alt.href}`;
      if (!html.includes(`href="${esc(href)}"`)) {
        errors.push(`C6 ${where} missing rel=alternate ${alt.type} -> ${href}.`);
      }
      const localPath = href.replace(/^https:\/\/amtechai\.com/, '');
      if (localPath.endsWith('.md')) {
        try {
          await readFile(resolve(distDir, localPath.replace(/^\//, '')), 'utf8');
        } catch {
          errors.push(`C6 ${where} advertised twin does not exist in dist: ${localPath}`);
        }
      }
    }
  }

  for (const w of warnings) console.warn(`war: ${w}`);
  if (errors.length) {
    for (const e of errors) console.error(`ERR: ${e}`);
    console.error(`\nseo:validate FAILED — ${checked} route(s) checked, ${errors.length} error(s), ${warnings.length} warning(s).`);
    process.exit(1);
  }
  console.log(`\nseo:validate passed — ${checked} route(s), 0 errors, ${warnings.length} warning(s).`);
}

main().catch((error) => {
  console.error('seo:validate crashed:', error);
  process.exit(1);
});
