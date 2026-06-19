import {
  articleKnowledgeGraphNodes,
  articleTopicGroups,
  type KnowledgeGraphNode,
} from '../articleKnowledgeGraph.ts';
import type { ArticleContentBlock, ArticleDefinition } from '../articles.ts';
import { deriveEntityEdgeIds, entityDefs, type EntityDef } from './entities.ts';
import { getArticleDefinition } from './articles/index.ts';

// Canonical site origin. OKF `resource` URIs and discovery URLs are built from this.
export const SITE_ORIGIN = 'https://amtechai.com';

// OKF version this bundle targets (declared in the bundle-root index.md frontmatter).
export const OKF_VERSION = '0.1';

// Bundle-root display metadata.
export const BUNDLE_META = {
  title: 'AMTECH AI Operations Knowledge Graph',
  description:
    'The AMTECH operations-AI knowledge graph: published articles, planned operational playbooks, and the use cases, places, and industries they connect, as an Open Knowledge Format bundle.',
};

// Controlled OKF `type` vocabulary actually emitted (validator enforces this exact set — Q5).
export const ALLOWED_CONCEPT_TYPES = ['Article', 'Playbook', 'Use Case', 'Place', 'Industry'] as const;
export type ConceptType = (typeof ALLOWED_CONCEPT_TYPES)[number];

/**
 * A normalized OKF concept. The single read model the emitter (and, later, the prerenderer
 * and React app) project from. Body composition lives here so the emitter stays generic across
 * articles, playbooks, and entities.
 */
export type OkfConcept = {
  id: string;
  conceptType: ConceptType;
  dir: 'articles' | 'playbooks' | 'use-cases' | 'entities';
  slug: string;
  /** Bundle-relative file path without leading slash. */
  path: string;
  /** Bundle-relative link target with leading slash. */
  bundlePath: string;
  title: string;
  description: string;
  /** Live, indexable URL. Present only for published article concepts (Q3). */
  resource?: string;
  tags: string[];
  status: 'published' | 'planned' | 'reference';
  /** Short label used when this concept appears as a link target's relationship hint. */
  relationLabel: string;
  /** Optional blockquote lead line (the graph-node mechanism, or an article dek). */
  lead?: string;
  /** Bullet lines rendered under the lead (without the leading "- "). Used when bodyMarkdown is absent. */
  summary: string[];
  /** Full rich body markdown (published articles); when present it replaces the summary bullets. */
  bodyMarkdown?: string;
  /** External citations, rendered as a `# Citations` section. */
  citations: { label: string; url: string; publisher?: string }[];
  /** ISO 8601 last-meaningful-change datetime (article dateModified); omitted when unknown (Q7). */
  timestamp?: string;
  /** Outbound edges (target concept ids). Relationship meaning is rendered in body prose. */
  edgeTargetIds: string[];
};

function escapeCell(value: string): string {
  return value.replace(/\|/g, '\\|').replace(/\n+/g, ' ').trim();
}

/** Render an article's content blocks (+ FAQ) to structural markdown for the OKF body. */
function renderArticleBody(def: ArticleDefinition): string {
  const out: string[] = [];
  const block = (b: ArticleContentBlock) => {
    switch (b.type) {
      case 'answer':
        out.push('## Answer', '', b.body, '');
        break;
      case 'section':
        out.push(`## ${b.title}`, '', ...b.body.flatMap((p) => [p, '']));
        break;
      case 'table':
        out.push(`## ${b.title}`, '');
        out.push(`| ${b.columns.map(escapeCell).join(' | ')} |`);
        out.push(`| ${b.columns.map(() => '---').join(' | ')} |`);
        b.rows.forEach((row) => out.push(`| ${row.map(escapeCell).join(' | ')} |`));
        out.push('');
        break;
      case 'callout': {
        const mark = b.tone === 'warning' ? '⚠️ ' : b.tone === 'success' ? '✅ ' : '';
        out.push(`> **${mark}${b.title}**`, '>', `> ${b.body}`, '');
        break;
      }
      case 'checklist':
        out.push(`## ${b.title}`, '', ...b.items.map((item) => `- ${item}`), '');
        break;
      case 'prompt':
        out.push('# Examples', '', `### ${b.title}`, '');
        if (b.helper) out.push(b.helper, '');
        out.push('```text', b.body, '```', '');
        break;
    }
  };
  def.blocks.forEach(block);
  if (def.faqs.length) {
    out.push('## FAQ', '');
    def.faqs.forEach((faq) => out.push(`### ${faq.question}`, '', faq.answer, ''));
  }
  return out.join('\n').replace(/\n+$/, '');
}

function deriveNodeTags(node: KnowledgeGraphNode): string[] {
  const tags: string[] = [];
  const push = (value?: string) => {
    if (!value) return;
    const trimmed = value.trim();
    if (trimmed && !tags.includes(trimmed)) tags.push(trimmed);
  };
  push(node.city);
  push(node.subtype);
  node.uc
    .split('/')
    .map((part) => part.trim())
    .filter(Boolean)
    .forEach(push);
  if (node.topic && node.topic !== node.city && node.topic !== node.subtype) push(node.topic);
  return tags;
}

function nodeToConcept(node: KnowledgeGraphNode): OkfConcept {
  const published = node.status === 'published';
  const dir: OkfConcept['dir'] = published ? 'articles' : 'playbooks';
  const conceptType: ConceptType = published ? 'Article' : 'Playbook';
  const path = `${dir}/${node.slug}.md`;
  const resource = published ? `${SITE_ORIGIN}${node.href}` : undefined;

  const summary = [`**Use case:** ${node.uc}`, `**Audience:** ${node.audience}`, `**Status:** ${node.status}`];
  if (resource) summary.push(`**Live page:** ${resource}`);

  // Edges: existing graph links first, then derived entity membership (the orphan fix).
  const edgeTargetIds = [...new Set([...node.connectsTo, ...deriveEntityEdgeIds(node.uc, node.city, node.subtype)])];

  // Published articles enrich the thin graph node with full content from the consolidated
  // ArticleDefinition: real description, dek, body, citations, dateModified, and entity tags.
  const def = published ? getArticleDefinition(node.slug) : undefined;
  const tags = deriveNodeTags(node);
  if (def) {
    [def.primaryEntity.name, ...def.entities.map((e) => e.name), def.category].forEach((t) => {
      if (t && !tags.includes(t)) tags.push(t);
    });
  }

  return {
    id: node.id,
    conceptType,
    dir,
    slug: node.slug,
    path,
    bundlePath: `/${path}`,
    title: node.title,
    description: def?.description ?? node.description,
    resource,
    tags,
    status: node.status,
    relationLabel: node.typeLabel,
    // Lead: an article dek, else the graph mechanism (suppressed when it just repeats the description).
    lead: def?.dek ?? (node.mechanism !== node.description ? node.mechanism : undefined),
    summary,
    bodyMarkdown: def ? renderArticleBody(def) : undefined,
    citations: def?.citations ?? [],
    timestamp: def?.dateModified,
    edgeTargetIds,
  };
}

function entityToConcept(entity: EntityDef): OkfConcept {
  const path = `${entity.dir}/${entity.slug}.md`;
  return {
    id: entity.id,
    conceptType: entity.kind,
    dir: entity.dir,
    slug: entity.slug,
    path,
    bundlePath: `/${path}`,
    title: entity.title,
    description: entity.description,
    tags: entity.tags,
    status: 'reference',
    relationLabel: entity.kind,
    summary: [`**Kind:** ${entity.kind}`, '**Status:** reference'],
    citations: [],
    edgeTargetIds: entity.relatedEntityIds ? [...entity.relatedEntityIds] : [],
  };
}

/** All concepts (articles + playbooks + entities), sorted by id for deterministic output (Q6). */
export function getConcepts(): OkfConcept[] {
  return [
    ...articleKnowledgeGraphNodes.map(nodeToConcept),
    ...entityDefs.map(entityToConcept),
  ].sort((a, b) => a.id.localeCompare(b.id, 'en'));
}

/** Resolve edge target ids to concepts. Missing targets are tolerated (OKF permissive model). */
export function getConceptIndex(concepts: OkfConcept[]): Map<string, OkfConcept> {
  return new Map(concepts.map((concept) => [concept.id, concept]));
}

/** Topic groups for the bundle-root index.md "Browse by topic" section. */
export function getTopicGroups() {
  return articleTopicGroups;
}
