/**
 * Post-build prerender. Run AFTER `vite build` (it needs dist/index.html with hashed asset tags).
 *
 * Writes a static HTML file per article + hub route into dist/, each containing the real content
 * and a correct per-page <head> (title, description, canonical, Open Graph, JSON-LD). The SPA boots
 * with createRoot().render() (a client render, not hydrate), so it simply REPLACES this static
 * content — meaning crawlers and non-JS agents get real content and per-page metadata, while users
 * still get the interactive React app. No SSR/hydration matching required.
 *
 * Node 24 runs this .ts directly (type stripping); the data it imports is React-free.
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { articleDefinitions } from '../../src/lib/knowledge/articles/index.ts';
import { buildArticleSchema, type ArticleContentBlock, type ArticleDefinition } from '../../src/lib/articles.ts';
import { SITE_ORIGIN, getConcepts } from '../../src/lib/knowledge/concepts.ts';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const distDir = resolve(repoRoot, 'dist');

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function blockHtml(b: ArticleContentBlock): string {
  switch (b.type) {
    case 'answer':
      return `<h2>Answer</h2><p>${esc(b.body)}</p>`;
    case 'section':
      return `<h2>${esc(b.title)}</h2>${b.body.map((p) => `<p>${esc(p)}</p>`).join('')}`;
    case 'table': {
      const head = `<tr>${b.columns.map((c) => `<th>${esc(c)}</th>`).join('')}</tr>`;
      const rows = b.rows.map((r) => `<tr>${r.map((c) => `<td>${esc(c)}</td>`).join('')}</tr>`).join('');
      return `<h2>${esc(b.title)}</h2><table><thead>${head}</thead><tbody>${rows}</tbody></table>`;
    }
    case 'callout':
      return `<aside><strong>${esc(b.title)}</strong><p>${esc(b.body)}</p></aside>`;
    case 'checklist':
      return `<h2>${esc(b.title)}</h2><ul>${b.items.map((i) => `<li>${esc(i)}</li>`).join('')}</ul>`;
    case 'prompt':
      return `<h2>${esc(b.title)}</h2>${b.helper ? `<p>${esc(b.helper)}</p>` : ''}<pre><code>${esc(b.body)}</code></pre>`;
    default:
      return '';
  }
}

function articleContentHtml(def: ArticleDefinition): string {
  const blocks = def.blocks.map(blockHtml).join('');
  const faqs = def.faqs.length
    ? `<section><h2>FAQ</h2>${def.faqs.map((f) => `<h3>${esc(f.question)}</h3><p>${esc(f.answer)}</p>`).join('')}</section>`
    : '';
  const cites = def.citations.length
    ? `<section><h2>Citations</h2><ol>${def.citations
        .map((c) => `<li><a href="${esc(c.url)}">${esc(c.label)}</a>${c.publisher ? ` — ${esc(c.publisher)}` : ''}</li>`)
        .join('')}</ol></section>`
    : '';
  return `<article><h1>${esc(def.title)}</h1><p>${esc(def.dek)}</p>${blocks}${faqs}${cites}</article>`;
}

type Page = { route: string; title: string; description: string; content: string; jsonLd?: unknown };

function buildPages(): Page[] {
  const pages: Page[] = [];

  for (const def of Object.values(articleDefinitions)) {
    pages.push({
      route: `/articles/${def.slug}`,
      title: `${def.title} | AMTECH AI`,
      description: def.description,
      content: articleContentHtml(def),
      jsonLd: buildArticleSchema(def),
    });
  }

  const concepts = getConcepts();
  const articleList = concepts
    .filter((c) => c.dir === 'articles')
    .map((c) => `<li><a href="${esc(c.resource ?? `${SITE_ORIGIN}/articles/${c.slug}`)}">${esc(c.title)}</a> — ${esc(c.description)}</li>`)
    .join('');
  pages.push({
    route: '/articles',
    title: 'Articles — AMTECH AI operations library',
    description: 'The AMTECH operations-AI learning library: build a business brain, price jobs, forecast demand, and run a connected back office.',
    content: `<h1>AMTECH AI articles</h1><ul>${articleList}</ul>`,
  });

  const allList = concepts
    .map((c) => `<li><a href="${esc(c.resource ?? `${SITE_ORIGIN}/okf${c.bundlePath}`)}">${esc(c.title)}</a> — ${esc(c.description)}</li>`)
    .join('');
  pages.push({
    route: '/articles/all',
    title: 'All articles & knowledge map — AMTECH AI',
    description: 'The full AMTECH operations knowledge graph: published articles, planned playbooks, and the use cases, places, and industries they connect.',
    content: `<h1>All articles & knowledge map</h1><ul>${allList}</ul>`,
  });

  return pages;
}

function injectHead(template: string, page: Page): string {
  const canonical = `${SITE_ORIGIN}${page.route}`;
  const headTags = [
    `<link rel="canonical" href="${esc(canonical)}" />`,
    `<meta property="og:title" content="${esc(page.title)}" />`,
    `<meta property="og:description" content="${esc(page.description)}" />`,
    `<meta property="og:url" content="${esc(canonical)}" />`,
    `<meta property="og:type" content="article" />`,
    page.jsonLd ? `<script type="application/ld+json">${JSON.stringify(page.jsonLd)}</script>` : '',
  ].join('\n    ');

  let html = template;
  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(page.title)}</title>`);
  if (/<meta name="description"[^>]*>/.test(html)) {
    html = html.replace(/<meta name="description"[^>]*>/, `<meta name="description" content="${esc(page.description)}" />`);
  } else {
    html = html.replace('</head>', `  <meta name="description" content="${esc(page.description)}" />\n  </head>`);
  }
  html = html.replace('</head>', `  ${headTags}\n  </head>`);
  html = html.replace(/<div id="root">\s*<\/div>/, `<div id="root">${page.content}</div>`);
  return html;
}

async function main() {
  const template = await readFile(resolve(distDir, 'index.html'), 'utf8');
  const pages = buildPages();
  for (const page of pages) {
    const html = injectHead(template, page);
    const outDir = resolve(distDir, page.route.replace(/^\//, ''));
    await mkdir(outDir, { recursive: true });
    await writeFile(resolve(outDir, 'index.html'), html, 'utf8');
  }
  console.log(`okf:prerender wrote ${pages.length} static route(s) into dist/ (articles + hubs).`);
}

main().catch((error) => {
  console.error('okf:prerender failed:', error);
  process.exit(1);
});
