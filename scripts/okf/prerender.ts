/**
 * Post-build prerender. Run AFTER `vite build` (it needs dist/index.html with hashed asset tags).
 *
 * Writes a static HTML file per public route into dist/, each containing real content and a correct
 * per-page <head> sourced from the SINGLE meta authority (src/lib/seo/pageMeta.ts). The SPA boots
 * with createRoot().render() (a client render, not hydrate), so it simply REPLACES this static
 * content — crawlers and non-JS agents get real content + per-page metadata, users get the app.
 *
 * Head + agent-map come from renderHead.ts so the prerendered HTML and the runtime DOM (SeoManager)
 * project the SAME PageMeta. Article and skill bodies keep their richer dedicated renderers; all
 * other routes use the authored body sections from the registry.
 *
 * Node 24 runs this .ts directly (type stripping); everything it imports is React-free.
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { articleDefinitions } from '../../src/lib/knowledge/articles/index.ts';
import type { ArticleContentBlock, ArticleDefinition } from '../../src/lib/articles.ts';
import { skillDefinitions, skillUrl, type SkillDefinition } from '../../src/lib/skills/registry.ts';
import { listPageMeta, type PageMeta } from '../../src/lib/seo/pageMeta.ts';
import { esc, renderHeadTags, renderSectionsHtml } from '../../src/lib/seo/renderHead.ts';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const distDir = resolve(repoRoot, 'dist');

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

function skillHubHtml(): string {
  const items = skillDefinitions
    .map(
      (skill) =>
        `<li><a href="${esc(skillUrl(skill))}">${esc(skill.title)}</a> — ${esc(skill.description)} Agent bootstrap: <a href="${esc(skillUrl(skill, '/use.md'))}">${esc(skillUrl(skill, '/use.md'))}</a>.</li>`,
    )
    .join('');
  return `<article><h1>AMTECH Agent Skills</h1><p>Free AMTECH skills designed so a modern AI can use one link immediately, then install or save the skill only when the environment supports it.</p><ul>${items}</ul></article>`;
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
    <h1>${esc(skill.title)} for AI Agents</h1>
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

/** Pick the richest available body for a route. */
function bodyFor(meta: PageMeta): string {
  const articleMatch = meta.route.match(/^\/articles\/([^/]+)$/);
  if (articleMatch) {
    const def = articleDefinitions[articleMatch[1] as keyof typeof articleDefinitions];
    if (def) return articleContentHtml(def);
  }
  if (meta.route === '/skills') return skillHubHtml();
  const skillMatch = meta.route.match(/^\/skills\/([^/]+)$/);
  if (skillMatch) {
    const skill = skillDefinitions.find((s) => s.slug === skillMatch[1]);
    if (skill) return skillDetailHtml(skill);
  }
  const sections = renderSectionsHtml(meta);
  if (sections) return sections;
  // Minimal but non-empty fallback so view-source is never bare.
  return `<main><h1>${esc(meta.title.replace(/ \| AMTECH AI$/, ''))}</h1><p>${esc(meta.description)}</p></main>`;
}

function injectHead(template: string, meta: PageMeta, body: string): string {
  let html = template;
  // Replace the template <title> and description with the page-specific ones.
  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(meta.title)}</title>`);
  html = html
    .replace(/\s*<meta property="og:(title|description|url|type)"[^>]*>\n?/g, '')
    .replace(/\s*<meta name="twitter:(card|title|description)"[^>]*>\n?/g, '')
    .replace(/\s*<link rel="canonical"[^>]*>\n?/g, '');
  if (/<meta name="description"[^>]*>/.test(html)) {
    html = html.replace(/<meta name="description"[^>]*>/, `<meta name="description" content="${esc(meta.description)}" />`);
  } else {
    html = html.replace('</head>', `  <meta name="description" content="${esc(meta.description)}" />\n  </head>`);
  }
  html = html.replace('</head>', `  ${renderHeadTags(meta)}\n  </head>`);
  html = html.replace(/<div id="root">\s*<\/div>/, `<div id="root">${body}</div>`);
  return html;
}

async function main() {
  const template = await readFile(resolve(distDir, 'index.html'), 'utf8');
  const pages = listPageMeta();
  for (const meta of pages) {
    const html = injectHead(template, meta, bodyFor(meta));
    const outDir = resolve(distDir, meta.route.replace(/^\//, ''));
    await mkdir(outDir, { recursive: true });
    await writeFile(resolve(outDir, 'index.html'), html, 'utf8');
  }
  console.log(`okf:prerender wrote ${pages.length} static route(s) into dist/ (all public routes).`);
}

main().catch((error) => {
  console.error('okf:prerender failed:', error);
  process.exit(1);
});
