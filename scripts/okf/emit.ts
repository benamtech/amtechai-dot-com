/**
 * OKF emitter — pure projection from the knowledge façade to a file map.
 *
 * Returns a Map keyed by path relative to the repo root (under `public/`). Writing
 * is the caller's job (build-okf.ts); the validator re-runs this in memory and diffs
 * the result against disk for the freshness gate (see docs/okf/04-validation-and-phase-gates.md).
 *
 * Determinism is a hard requirement (Q6): no Date.now(), stable id sort, stable tag order.
 */
import {
  BUNDLE_META,
  OKF_VERSION,
  SITE_ORIGIN,
  getConcepts,
  getConceptIndex,
  getTopicGroups,
  type OkfConcept,
} from '../../src/lib/knowledge/concepts.ts';
import { skillDefinitions, skillUrl } from '../../src/lib/skills/registry.ts';

export const OKF_DIR = 'public/okf';

// Indexable content routes for the sitemap. Maintained list — keep in sync with src/App.tsx
// (gate D1). Published article routes are appended automatically from the concept set.
const MAIN_ROUTES = [
  '/',
  '/how-it-works',
  '/about',
  '/pricing',
  '/contact',
  '/our-work',
  '/cost-calculator',
  '/articles',
  '/articles/all',
  '/skills',
];

function yamlString(value: string): string {
  const escaped = value.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\s+/g, ' ').trim();
  return `"${escaped}"`;
}

function frontmatter(lines: string[]): string {
  return ['---', ...lines, '---', ''].join('\n');
}

function relationshipLine(target: OkfConcept | undefined, fallbackId: string): string {
  if (!target) {
    // OKF tolerates broken links; we still emit the edge so the relationship is recorded.
    return `- [${fallbackId}](/unresolved/${fallbackId}.md) — related concept (not yet in this bundle).`;
  }
  return `- [${target.title}](${target.bundlePath}) — ${target.relationLabel}.`;
}

function conceptDocument(concept: OkfConcept, index: Map<string, OkfConcept>, backlinks: OkfConcept[]): string {
  const fm = [
    `type: ${yamlString(concept.conceptType)}`,
    `title: ${yamlString(concept.title)}`,
    `description: ${yamlString(concept.description)}`,
  ];
  if (concept.resource) fm.push(`resource: ${yamlString(concept.resource)}`);
  if (concept.tags.length) {
    fm.push('tags:');
    concept.tags.forEach((tag) => fm.push(`  - ${yamlString(tag)}`));
  }
  if (concept.timestamp) fm.push(`timestamp: ${yamlString(concept.timestamp)}`);
  // Custom (producer-defined) key — OKF preserves unknown keys.
  fm.push(`status: ${yamlString(concept.status)}`);

  const body: string[] = [];
  body.push(`# ${concept.title}`, '');
  body.push(concept.description, '');
  if (concept.lead) body.push(`> ${concept.lead}`, '');
  if (concept.bodyMarkdown) {
    body.push(concept.bodyMarkdown, '');
  } else {
    concept.summary.forEach((line) => body.push(`- ${line}`));
    body.push('');
  }

  body.push('# Related concepts', '');
  if (concept.edgeTargetIds.length) {
    body.push('This concept connects to related parts of the AMTECH operations knowledge graph; each relationship is described inline:', '');
    concept.edgeTargetIds.forEach((id) => body.push(relationshipLine(index.get(id), id)));
    body.push('');
  } else {
    body.push('_No outbound links recorded yet._', '');
  }

  if (backlinks.length) {
    body.push('# Referenced by', '');
    backlinks.forEach((source) => body.push(`- [${source.title}](${source.bundlePath}) — ${source.relationLabel}.`));
    body.push('');
  }

  if (concept.citations.length) {
    body.push('# Citations', '');
    concept.citations.forEach((citation, i) => {
      const publisher = citation.publisher ? ` — ${citation.publisher}` : '';
      body.push(`[${i + 1}] [${citation.label}](${citation.url})${publisher}`);
    });
    body.push('');
  }

  return frontmatter(fm) + body.join('\n').replace(/\n+$/, '\n');
}

function listingLine(concept: OkfConcept): string {
  return `* [${concept.title}](${concept.bundlePath}) - ${concept.description}`;
}

function rootIndex(concepts: OkfConcept[]): string {
  const articles = concepts.filter((c) => c.dir === 'articles');
  const playbooks = concepts.filter((c) => c.dir === 'playbooks');
  const groups = getTopicGroups();
  const byId = getConceptIndex(concepts);

  const fm = frontmatter([
    `okf_version: ${yamlString(OKF_VERSION)}`,
    `title: ${yamlString(BUNDLE_META.title)}`,
    `description: ${yamlString(BUNDLE_META.description)}`,
  ]);

  const useCases = concepts.filter((c) => c.dir === 'use-cases');
  const entities = concepts.filter((c) => c.dir === 'entities');

  const body: string[] = [];
  body.push(`# ${BUNDLE_META.title}`, '');
  body.push(BUNDLE_META.description, '');
  body.push('## Articles', '');
  articles.forEach((c) => body.push(listingLine(c)));
  body.push('', '## Playbooks (planned)', '');
  playbooks.forEach((c) => body.push(listingLine(c)));
  body.push('', '## Use cases', '');
  useCases.forEach((c) => body.push(listingLine(c)));
  body.push('', '## Entities (places & industries)', '');
  entities.forEach((c) => body.push(listingLine(c)));
  body.push('', '## Browse by topic', '');
  groups.forEach((group) => {
    body.push(`### ${group.title}`, '', group.description, '');
    group.nodeIds.forEach((id) => {
      const c = byId.get(id);
      if (c) body.push(listingLine(c));
    });
    body.push('');
  });
  return fm + body.join('\n').replace(/\n+$/, '\n');
}

function subIndex(heading: string, intro: string, concepts: OkfConcept[]): string {
  // Sub-directory index.md carries NO frontmatter (OKF reserved-file rule, C3).
  const body: string[] = [`# ${heading}`, '', intro, ''];
  concepts.forEach((c) => body.push(listingLine(c)));
  body.push('');
  return body.join('\n').replace(/\n+$/, '\n');
}

function sitemap(concepts: OkfConcept[]): string {
  const published = concepts.filter((c) => c.dir === 'articles' && c.resource);
  const articleRoutes = published.map((c) => c.resource as string);
  const mainUrls = MAIN_ROUTES.map((route) => `${SITE_ORIGIN}${route === '/' ? '/' : route}`);
  const skillRoutes = skillDefinitions.map((skill) => skillUrl(skill));
  const urls = [...mainUrls, ...articleRoutes, ...skillRoutes];
  const lines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls.map((loc) => `  <url><loc>${loc}</loc></url>`),
    '</urlset>',
    '',
  ];
  return lines.join('\n');
}

function robots(): string {
  return ['User-agent: *', 'Allow: /', '', `Sitemap: ${SITE_ORIGIN}/sitemap.xml`, ''].join('\n');
}

function llms(concepts: OkfConcept[]): string {
  const published = concepts.filter((c) => c.dir === 'articles' && c.resource);
  const lines: string[] = [];
  lines.push('# AMTECH AI', '');
  lines.push(
    '> AMTECH builds AI "employees" that automate the operations brain of inventory-, repair-, and transaction-rich small businesses — purchasing, forecasting, quoting, margin review, and owner briefings.',
    '',
  );
  lines.push('## Knowledge graph (Open Knowledge Format)', '');
  lines.push(
    `- [OKF bundle index](${SITE_ORIGIN}/okf/index.md): machine-readable knowledge graph of AMTECH articles and operational playbooks, with the relationships between them.`,
    '',
  );
  lines.push('## Key pages', '');
  lines.push(`- [Articles hub](${SITE_ORIGIN}/articles): the AMTECH operations-AI learning library.`);
  lines.push(`- [All articles & knowledge map](${SITE_ORIGIN}/articles/all): full index of published articles and planned operational nodes.`);
  lines.push('');
  lines.push('## Free AMTECH agent skills', '');
  lines.push(`- [Agent skills hub](${SITE_ORIGIN}/skills): free AMTECH skills that can be used from one link.`);
  skillDefinitions.forEach((skill) => {
    lines.push(`- [${skill.title}](${skillUrl(skill)}): ${skill.description}`);
    lines.push(`  - [Use in any AI](${skillUrl(skill, '/use.md')})`);
    lines.push(`  - [Manifest](${skillUrl(skill, '/manifest.json')})`);
  });
  lines.push('');
  lines.push('## Published articles', '');
  published.forEach((c) => lines.push(`- [${c.title}](${c.resource}): ${c.description}`));
  lines.push('');
  return lines.join('\n');
}

/** Build the full set of managed files. Keys are repo-root-relative paths. */
export function buildOkfFiles(): Map<string, string> {
  const concepts = getConcepts();
  const index = getConceptIndex(concepts);
  const files = new Map<string, string>();

  // Backlink map: target id -> sources that link to it (derived, deterministic).
  const backlinkMap = new Map<string, OkfConcept[]>();
  concepts.forEach((source) => {
    source.edgeTargetIds.forEach((targetId) => {
      const list = backlinkMap.get(targetId) ?? [];
      list.push(source);
      backlinkMap.set(targetId, list);
    });
  });

  concepts.forEach((concept) => {
    files.set(`${OKF_DIR}/${concept.path}`, conceptDocument(concept, index, backlinkMap.get(concept.id) ?? []));
  });

  files.set(`${OKF_DIR}/index.md`, rootIndex(concepts));
  files.set(
    `${OKF_DIR}/articles/index.md`,
    subIndex('Articles', 'Published AMTECH operations-AI articles.', concepts.filter((c) => c.dir === 'articles')),
  );
  files.set(
    `${OKF_DIR}/playbooks/index.md`,
    subIndex('Playbooks (planned)', 'Planned operational knowledge-graph nodes, not yet published as live pages.', concepts.filter((c) => c.dir === 'playbooks')),
  );
  files.set(
    `${OKF_DIR}/use-cases/index.md`,
    subIndex('Use cases', 'The operational AI use cases (UC1–UC10) that articles and playbooks connect to.', concepts.filter((c) => c.dir === 'use-cases')),
  );
  files.set(
    `${OKF_DIR}/entities/index.md`,
    subIndex('Entities', 'Places and industries that ground the operational knowledge graph.', concepts.filter((c) => c.dir === 'entities')),
  );

  // Discovery files (served from the site root).
  files.set('public/sitemap.xml', sitemap(concepts));
  files.set('public/robots.txt', robots());
  files.set('public/llms.txt', llms(concepts));

  return files;
}
