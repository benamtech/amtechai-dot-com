export type SkillFileRole = 'primary-instructions' | 'agent-metadata' | 'reference' | 'asset' | 'license' | 'script';

export type SkillFileDefinition = {
  path: string;
  role: SkillFileRole;
  title: string;
  summary: string;
  loadPolicy: string;
  runPolicy?: string;
  permissions?: string[];
};

export type SkillDefinition = {
  slug: string;
  name: string;
  title: string;
  version: string;
  updated: string;
  description: string;
  summary: string;
  audience: string[];
  useCases: string[];
  sourceDir: string;
  safety: {
    scripts: 'none' | 'optional' | 'required';
    requiresNetwork: boolean;
    requiresSecrets: boolean;
    riskNote: string;
  };
  files: SkillFileDefinition[];
};

export const SKILL_BASE_PATH = '/skills';
export const SKILL_SITE_ORIGIN = 'https://amtechai.com';

export const skillDefinitions: SkillDefinition[] = [
  {
    slug: 'okf-audit',
    name: 'okf-audit',
    title: 'OKF Audit Skill',
    version: '0.1.0',
    updated: '2026-06-19',
    description:
      'A consumable AMTECH skill for auditing articles, websites, drafts, sitemaps, and OKF bundles for AI-readable knowledge quality.',
    summary:
      'Use this skill in ChatGPT, Claude, Codex, Claude Code, Cursor, or an AMTECH agent to audit content for OKF-style structure, agent-readable surfaces, entity coverage, citations, links, and materialized views.',
    audience: ['AI agents', 'content strategists', 'technical marketers', 'business owners', 'SEO operators'],
    useCases: [
      'Audit an article for OKF and agent-readable knowledge quality.',
      'Find missing entities, relationships, and internal links.',
      'Evaluate sitemap, llms.txt, markdown, JSON, and HTML surfaces.',
      'Generate a remediation prompt for another AI or implementation agent.',
    ],
    sourceDir: 'src/lib/skills/source/okf-audit',
    safety: {
      scripts: 'none',
      requiresNetwork: true,
      requiresSecrets: false,
      riskNote:
        'V1 has no required scripts. Use in context first. Ask before creating files, installing anything, or fetching private URLs.',
    },
    files: [
      {
        path: 'SKILL.md',
        role: 'primary-instructions',
        title: 'Canonical skill instructions',
        summary: 'The primary reusable workflow for running an OKF and agent-readable content audit.',
        loadPolicy: 'Always read before performing an audit.',
      },
      {
        path: 'agents/openai.yaml',
        role: 'agent-metadata',
        title: 'OpenAI/Codex interface metadata',
        summary: 'UI-facing display metadata and default prompt for environments that support it.',
        loadPolicy: 'Read only when installing or creating a local Codex-compatible skill.',
      },
      {
        path: 'references/okf-audit-rubric.md',
        role: 'reference',
        title: 'OKF audit rubric',
        summary: 'Scoring dimensions and pass/fail signals for OKF-style concept packaging and graph quality.',
        loadPolicy: 'Read when scoring or explaining audit findings.',
      },
      {
        path: 'references/agent-readable-content-checklist.md',
        role: 'reference',
        title: 'Agent-readable content checklist',
        summary: 'Checklist for first-fetch HTML, markdown views, snippets, metadata, and retrieval surfaces.',
        loadPolicy: 'Read when auditing website rendering, snippets, or machine-readable surfaces.',
      },
      {
        path: 'references/amtech-knowledge-graph-insights.md',
        role: 'reference',
        title: 'AMTECH knowledge graph insights',
        summary: 'AMTECH-specific guidance for entity coverage, relationship mapping, and materialized views.',
        loadPolicy: 'Read when recommending AMTECH-style knowledge graph improvements.',
      },
      {
        path: 'assets/report-schema.json',
        role: 'asset',
        title: 'Audit report schema',
        summary: 'JSON shape for structured OKF audit reports.',
        loadPolicy: 'Use when the user asks for JSON or a structured report.',
      },
      {
        path: 'LICENSE.txt',
        role: 'license',
        title: 'License',
        summary: 'License for this free AMTECH skill package.',
        loadPolicy: 'Read when evaluating reuse or redistribution.',
      },
    ],
  },
  {
    slug: 'knowledge-graph-builder',
    name: 'knowledge-graph-builder',
    title: 'Knowledge Graph Builder',
    version: '0.1.0',
    updated: '2026-06-19',
    description:
      'A consumable AMTECH skill that generates a large knowledge graph for SEO and AI-readable content from a business, website, product, or topic.',
    summary:
      'Use this skill in ChatGPT, Claude, Codex, Claude Code, Cursor, or an AMTECH agent to turn a business or site into typed entity nodes, relationship edges with reasons, the pillar pages worth publishing, an internal-linking plan, and JSON-LD scaffolding.',
    audience: ['AI agents', 'SEO strategists', 'content operators', 'technical marketers', 'business owners'],
    useCases: [
      'Generate a large entity/knowledge graph from a business or website for SEO.',
      'Identify the priority concepts that deserve their own pages.',
      'Map typed relationships between entities with relationship reasons.',
      'Produce an internal-linking plan and anchor-text guidance from the graph.',
      'Scaffold schema.org JSON-LD for the key entities and emit OKF concept stubs.',
    ],
    sourceDir: 'src/lib/skills/source/knowledge-graph-builder',
    safety: {
      scripts: 'none',
      requiresNetwork: false,
      requiresSecrets: false,
      riskNote:
        'V1 has no required scripts. Use in context first. Ask before creating files or fetching private URLs. Mark assumptions about the business as assumptions.',
    },
    files: [
      {
        path: 'SKILL.md',
        role: 'primary-instructions',
        title: 'Canonical skill instructions',
        summary: 'The primary reusable workflow for generating a knowledge graph for SEO and agent-readability.',
        loadPolicy: 'Always read before building a graph.',
      },
      {
        path: 'references/knowledge-graph-method.md',
        role: 'reference',
        title: 'Knowledge graph method',
        summary: 'Node-worthiness, pillar/supporting/attribute ranking, relationship verbs, internal-linking, and structured data.',
        loadPolicy: 'Read when deciding which nodes deserve pages and how to write edges.',
      },
      {
        path: 'references/entity-types.md',
        role: 'reference',
        title: 'Entity type vocabulary',
        summary: 'The controlled type vocabulary and how to choose a type for each node.',
        loadPolicy: 'Read when typing entities.',
      },
      {
        path: 'assets/graph-schema.json',
        role: 'asset',
        title: 'Knowledge graph schema',
        summary: 'JSON shape for the generated graph: nodes, edges, pillars, and internal links.',
        loadPolicy: 'Use when the user asks for JSON or a graph another tool can ingest.',
      },
      {
        path: 'agents/openai.yaml',
        role: 'agent-metadata',
        title: 'OpenAI/Codex interface metadata',
        summary: 'UI-facing display metadata and default prompt for environments that support it.',
        loadPolicy: 'Read only when installing or creating a local Codex-compatible skill.',
      },
      {
        path: 'LICENSE.txt',
        role: 'license',
        title: 'License',
        summary: 'License for this free AMTECH skill package.',
        loadPolicy: 'Read when evaluating reuse or redistribution.',
      },
    ],
  },
];

export function getSkill(slug: string): SkillDefinition | undefined {
  return skillDefinitions.find((skill) => skill.slug === slug);
}

export function skillPath(skill: SkillDefinition, suffix = ''): string {
  return `${SKILL_BASE_PATH}/${skill.slug}${suffix}`;
}

export function skillUrl(skill: SkillDefinition, suffix = ''): string {
  return `${SKILL_SITE_ORIGIN}${skillPath(skill, suffix)}`;
}
