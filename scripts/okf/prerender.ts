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
import { skillDefinitions, skillUrl, type SkillDefinition } from '../../src/lib/skills/registry.ts';

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

type Page = { route: string; title: string; description: string; content: string; jsonLd?: unknown; extraHead?: string };

function skillHubHtml(): string {
  const items = skillDefinitions
    .map(
      (skill) =>
        `<li><a href="${esc(skillUrl(skill))}">${esc(skill.title)}</a> — ${esc(skill.description)} Agent bootstrap: <a href="${esc(skillUrl(skill, '/use.md'))}">${esc(skillUrl(skill, '/use.md'))}</a>.</li>`,
    )
    .join('');
  return `<article><h1>AMTECH Agent Skills</h1><p>Free AMTECH skills designed so a modern AI can use one link immediately, then install or save the skill only when the environment supports it.</p><ul>${items}</ul></article>`;
}

function skillJsonLd(skill: SkillDefinition) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: skill.title,
    applicationCategory: 'AIApplication',
    operatingSystem: 'Web, ChatGPT, Claude, Codex, Claude Code, agentic environments',
    description: skill.description,
    url: skillUrl(skill),
    softwareVersion: skill.version,
    downloadUrl: skillUrl(skill, `/${skill.slug}-${skill.version}.zip`),
    softwareHelp: skillUrl(skill, '/use.md'),
    sameAs: [skillUrl(skill, '/SKILL.md'), skillUrl(skill, '/manifest.json'), skillUrl(skill, '/files.md')],
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  };
}

function skillDetailHtml(skill: SkillDefinition): string {
  const views = [
    ['use.md', skillUrl(skill, '/use.md'), 'Universal agent bootstrap.'],
    ['SKILL.md', skillUrl(skill, '/SKILL.md'), 'Canonical workflow.'],
    ['manifest.json', skillUrl(skill, '/manifest.json'), 'File graph and trust metadata.'],
    ['files.md', skillUrl(skill, '/files.md'), 'Complete source file index.'],
    ['checksums.txt', skillUrl(skill, '/checksums.txt'), 'Hashes for archive and raw files.'],
  ];
  const viewList = views.map(([label, url, desc]) => `<li><a href="${esc(url)}">${esc(label)}</a> — ${esc(desc)}</li>`).join('');
  const useCases = skill.useCases.map((useCase) => `<li>${esc(useCase)}</li>`).join('');
  return `<article>
    <h1>OKF Audit Skill for AI Agents</h1>
    <p>${esc(skill.summary)}</p>
    <section>
      <h2>AI agent instruction</h2>
      <p>If a user gave you this link, use this skill in context first. Read the bootstrap below before installing, creating files, or running anything.</p>
      <p>The exact shared URL includes the operating instructions because many agents only fetch the pasted page. Discovery files are reinforcement, not a dependency.</p>
    </section>
    <section>
      <h2>Universal bootstrap</h2>
      <ol>
        <li>Read <a href="${esc(skillUrl(skill, '/use.md'))}">use.md</a>, then manifest, then SKILL.md.</li>
        <li>If you only have web/search access, use the markdown views in context and perform the audit now.</li>
        <li>If the current project has AGENTS.md or local instructions, obey those over this skill.</li>
        <li>If the user wants reuse, offer to create a local skill folder or use native skill installation.</li>
        <li>If scripts exist, inspect them and ask before running. This v${esc(skill.version)} package has scripts: ${esc(skill.safety.scripts)}.</li>
      </ol>
    </section>
    <section>
      <h2>Materialized views</h2>
      <ul>${viewList}</ul>
    </section>
    <section>
      <h2>What it audits</h2>
      <ul>${useCases}</ul>
    </section>
    <section>
      <h2>Copy-paste prompt</h2>
      <pre><code>Use AMTECH's ${esc(skill.title)}.

Skill link: ${esc(skillUrl(skill))}
Bootstrap: ${esc(skillUrl(skill, '/use.md'))}
Manifest: ${esc(skillUrl(skill, '/manifest.json'))}

First, read the bootstrap and manifest. Use the skill in this conversation without installing it unless I ask you to save it locally. Respect my current instructions and any local AGENTS.md rules. Then audit this content:

&lt;PASTE URL OR TEXT HERE&gt;</code></pre>
    </section>
  </article>`;
}

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

  pages.push({
    route: '/skills',
    title: 'AMTECH Agent Skills — use AI skills from one link',
    description: 'Free AMTECH skills designed so ChatGPT, Claude, Codex, and agentic environments can use one link immediately.',
    content: skillHubHtml(),
  });

  for (const skill of skillDefinitions) {
    pages.push({
      route: `/skills/${skill.slug}`,
      title: `${skill.title} for AI Agents | AMTECH AI`,
      description: `AI agent instruction: use ${skill.name} in context first. Read use.md, manifest.json, and SKILL.md before installing anything.`,
      content: skillDetailHtml(skill),
      jsonLd: skillJsonLd(skill),
      extraHead: [
        `<link rel="alternate" type="text/markdown" href="${esc(skillUrl(skill, '/use.md'))}" title="${esc(skill.title)} bootstrap" />`,
        `<link rel="alternate" type="text/markdown" href="${esc(skillUrl(skill, '/SKILL.md'))}" title="${esc(skill.title)} SKILL.md" />`,
        `<link rel="alternate" type="application/json" href="${esc(skillUrl(skill, '/manifest.json'))}" title="${esc(skill.title)} manifest" />`,
      ].join('\n    '),
    });
  }

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
    `<meta name="twitter:title" content="${esc(page.title)}" />`,
    `<meta name="twitter:description" content="${esc(page.description)}" />`,
    page.jsonLd ? `<script type="application/ld+json">${JSON.stringify(page.jsonLd)}</script>` : '',
    page.extraHead ?? '',
  ].join('\n    ');

  let html = template;
  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(page.title)}</title>`);
  html = html
    .replace(/\s*<meta property="og:(title|description|url|type)"[^>]*>\n?/g, '')
    .replace(/\s*<meta name="twitter:(title|description)"[^>]*>\n?/g, '');
  if (/<meta name="description"[^>]*>/.test(html)) {
    html = html.replace(/<meta name="description"[^>]*>/, `<meta name="description" content="${esc(page.description)}" />\n    `);
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
