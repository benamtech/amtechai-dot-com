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

export type SkillRepository = {
  url: string;
  owner: string;
  name: string;
  defaultBranch: string;
  commit: string;
  path: string;
  commitSignature: 'verified' | 'unverified' | 'unsigned';
};

/**
 * Context binding (standard/05 + 12): a skill declares named context slots it can consume, and a per-host map of
 * where that host keeps each slot. Lets the same canonical skill "use the data the context already has" instead of
 * re-asking. Optional + additive — absent means the generic ask-the-user behavior.
 */
export type SkillContextBinding = {
  /** Slot name the skill consumes, e.g. "rates". */
  slot: string;
  /** What the slot is, for the host-agnostic Context section. */
  description: string;
  /** Per-host source hints: host id -> where that host keeps this slot. */
  hosts: Record<string, string>;
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
  /** Decision-tree action verb for the bootstrap (e.g. "build the estimate now"). */
  taskVerb: string;
  /** agent.md "Inputs:" items — what the skill accepts. */
  inputs: string[];
  /** use.md "## Output Contract" sections — MUST equal this skill's SKILL.md `## Output Format`/`## Output`. */
  outputContract: string[];
  /** agent.md "Outputs:" one-line summary. */
  outputsSummary: string;
  sourceDir: string;
  repository: SkillRepository;
  safety: {
    scripts: 'none' | 'optional' | 'required';
    requiresNetwork: boolean;
    requiresSecrets: boolean;
    riskNote: string;
  };
  files: SkillFileDefinition[];
  /** Optional context slots + per-host source map (standard/05 + 12). Absent = generic ask-the-user. */
  contextBindings?: SkillContextBinding[];
  /** Optional ISO date (YYYY-MM-DD) of the last authoring review — drives the `10` freshness gate. */
  lastReviewed?: string;
};

export const SKILL_BASE_PATH = '/skills';
export const SKILL_SITE_ORIGIN = 'https://amtechai.com';
export const SKILL_AUTHORITY_URL = `${SKILL_SITE_ORIGIN}/.well-known/skill-authority.json`;
export const SKILL_REPOSITORY_URL = 'https://github.com/benamtech/amtech-skills-registry';
export const SKILL_REPOSITORY_COMMIT = 'a90753e4431acbe17a0a862f981607643282595b';

function registryRepository(slug: string): SkillRepository {
  return {
    url: SKILL_REPOSITORY_URL,
    owner: 'benamtech',
    name: 'amtech-skills-registry',
    defaultBranch: 'main',
    commit: SKILL_REPOSITORY_COMMIT,
    path: `skills/${slug}`,
    commitSignature: 'unsigned',
  };
}

export const skillDefinitions: SkillDefinition[] = [
  {
    slug: 'okf-audit',
    name: 'okf-audit',
    title: 'OKF Audit Skill',
    version: '0.1.0',
    updated: '2026-06-19',
    lastReviewed: '2026-06-19',
    description:
      'Use when auditing an article, website, draft, sitemap, llms.txt file, markdown bundle, or OKF bundle for AI-readable knowledge quality, OKF-style concept packaging, entity coverage, citations, internal links, materialized views, and AMTECH knowledge graph improvements.',
    summary:
      'Use this skill in ChatGPT, Claude, Codex, Claude Code, Cursor, or an AMTECH agent to audit content for OKF-style structure, agent-readable surfaces, entity coverage, citations, links, and materialized views.',
    audience: ['AI agents', 'content strategists', 'technical marketers', 'business owners', 'SEO operators'],
    useCases: [
      'Audit an article for OKF and agent-readable knowledge quality.',
      'Find missing entities, relationships, and internal links.',
      'Evaluate sitemap, llms.txt, markdown, JSON, and HTML surfaces.',
      'Generate a remediation prompt for another AI or implementation agent.',
    ],
    taskVerb: 'perform the audit now',
    inputs: ['a URL', 'pasted text', 'an article draft', 'a sitemap', 'an llms.txt file', 'a markdown bundle', 'an OKF bundle'],
    outputContract: [
      'Summary',
      'Score',
      'Findings',
      'Missing Concepts And Edges',
      'Materialized View Opportunities',
      'Priority Fixes',
      'Copy-Paste Remediation Prompt',
    ],
    outputsSummary:
      'an audit summary, a score, findings, missing concepts and edges, materialized-view opportunities, priority fixes, and a copy-paste remediation prompt',
    sourceDir: 'src/lib/skills/source/okf-audit',
    repository: registryRepository('okf-audit'),
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
    lastReviewed: '2026-06-19',
    description:
      'Use when you need to generate a large knowledge graph for SEO and AI-readable content from a business, website, product, or topic — typed entity nodes, relationship edges with reasons, the priority concepts worth their own pages, an internal-linking plan, and JSON-LD scaffolding. The output is the entity-SEO and agent-readability foundation a site publishes against.',
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
    taskVerb: 'build the graph now',
    inputs: ['a business description', 'a website URL or sitemap', 'a product, service, or topic area', 'an existing content list or keyword set'],
    outputContract: [
      'Domain frame',
      'Entity table',
      'Edge list',
      'Pillar pages to publish',
      'Internal-linking plan',
      'Structured-data scaffolding',
      'Copy-paste build prompt',
    ],
    outputsSummary:
      'a domain frame, an entity table, an edge list, pillar pages to publish, an internal-linking plan, structured-data scaffolding, and a copy-paste build prompt',
    sourceDir: 'src/lib/skills/source/knowledge-graph-builder',
    repository: registryRepository('knowledge-graph-builder'),
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
  {
    slug: 'estimate',
    name: 'estimate',
    title: 'Estimate Skill',
    version: '1.0.0',
    updated: '2026-06-20',
    lastReviewed: '2026-06-20',
    description:
      'Use when creating, drafting, pricing, or reviewing a job estimate or quote. Builds line items, computes totals, and returns a clean structured estimate from a described job and the rates you provide.',
    summary:
      'Use this skill in ChatGPT, Claude, Codex, Claude Code, Cursor, or an AMTECH agent to turn a job description and your rates into a structured estimate: line items, totals, adjustments, and flagged assumptions.',
    audience: ['AI agents', 'service business owners', 'estimators', 'operations staff', 'office managers'],
    useCases: [
      'Build a priced estimate for a job from a scope description and known rates.',
      'Produce a clean structured estimate (line items, totals, assumptions) for review.',
      'Draft a blank estimate template for a trade or service.',
      'Return a machine-readable estimate that matches the published schema.',
    ],
    taskVerb: 'build the estimate now',
    inputs: ['a job description', 'the rates you provide', 'optional measurements, quantities, or materials'],
    outputContract: ['Customer', 'Job', 'Line Items', 'Totals', 'Assumptions'],
    outputsSummary: 'a structured estimate: customer, job, line items, totals with adjustments, and flagged assumptions',
    contextBindings: [
      {
        slot: 'rates',
        description: 'the labor, material, and unit prices the estimate is priced from',
        hosts: {
          generic: 'ask the user for the rates',
          hermes: 'your business brain (`./brain/business-brain.md`) and any rates saved in memory',
          'claude-code': 'the working tree — `AGENTS.md`, a rate sheet, or pricing config',
          codex: 'the default prompt context and any attached rate files',
        },
      },
      {
        slot: 'customer',
        description: 'who the estimate is for (name, contact, job address)',
        hosts: {
          generic: 'ask the user for the customer',
          hermes: 'the current message thread or saved memory',
          'claude-code': 'the task description or repo notes',
          codex: 'the conversation',
        },
      },
      {
        slot: 'tax_markup_rules',
        description: 'standing tax, markup, discount, or minimum-charge rules to apply to the totals',
        hosts: {
          generic: 'ask the user, or omit if none apply',
          hermes: 'your business brain (`./brain/business-brain.md`)',
          'claude-code': 'repo config or `AGENTS.md`',
          codex: 'the default prompt context',
        },
      },
    ],
    sourceDir: 'src/lib/skills/source/estimate',
    repository: registryRepository('estimate'),
    safety: {
      scripts: 'none',
      requiresNetwork: false,
      requiresSecrets: false,
      riskNote:
        'No scripts, no network, no secrets. Use in context first. Never invents a rate; saving a file or sending to a customer happens only on explicit confirmation.',
    },
    files: [
      {
        path: 'SKILL.md',
        role: 'primary-instructions',
        title: 'Canonical skill instructions',
        summary: 'The primary workflow for building a structured job estimate from a job and provided rates.',
        loadPolicy: 'Always read before building an estimate.',
      },
      {
        path: 'agents/openai.yaml',
        role: 'agent-metadata',
        title: 'OpenAI/Codex interface metadata',
        summary: 'UI-facing display metadata and default prompt for environments that support it.',
        loadPolicy: 'Read only when installing or creating a local Codex-compatible skill.',
      },
      {
        path: 'references/estimating-discipline.md',
        role: 'reference',
        title: 'Estimating discipline',
        summary: 'How to handle missing rates, line items, minimums, taxes, markups, and the arithmetic check.',
        loadPolicy: 'Read when deciding how to price line items or handle a missing rate.',
      },
      {
        path: 'hosts/hermes.md',
        role: 'reference',
        title: 'Hermes host hint',
        summary: 'Where an AMTECH Hermes employee finds estimate context (rates, customer, tax/markup rules) and how to write back newly-learned rates.',
        loadPolicy: 'Read when running as an AMTECH Hermes employee with a business brain and memory.',
      },
      {
        path: 'assets/estimate-schema.json',
        role: 'asset',
        title: 'Estimate schema',
        summary: 'JSON shape for a structured job estimate (amtech-job-estimate/v1).',
        loadPolicy: 'Use when the user asks for JSON or a structured estimate.',
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
    slug: 'amtech-article-research-writer',
    name: 'amtech-article-research-writer',
    title: 'Article Research Writer',
    version: '1.0.0',
    updated: '2026-06-20',
    lastReviewed: '2026-06-20',
    description:
      'Use when researching, planning, and drafting an information-gain article from a topic, notes, sources, or rough positioning. Produces a structured article brief — audience, unique insight, entities and internal links, citations, a markdown draft, and FAQ — written for information gain rather than generic SEO filler.',
    summary:
      'Use this skill in ChatGPT, Claude, Codex, Claude Code, Cursor, or an AMTECH agent to turn a topic and your sources into a structured article brief: audience, unique insight, entities and internal links, citations, a markdown draft, and FAQ.',
    audience: ['AI agents', 'content operators', 'technical marketers', 'founders', 'SEO strategists'],
    useCases: [
      'Research and draft an information-gain article from a topic and notes.',
      'Find the unique insight and a precise audience for a piece.',
      'Plan entities, internal links, and citations for an article.',
      'Return a structured article brief that matches the published schema.',
    ],
    taskVerb: 'produce the brief now',
    inputs: ['a topic', 'pasted notes', 'links or sources', 'a rough angle or positioning'],
    outputContract: ['Meta', 'Unique Insight', 'Entities', 'Citations', 'Draft', 'FAQ'],
    outputsSummary: 'a structured article brief: meta, the unique insight, entities and internal links, citations, a markdown draft, and an FAQ',
    sourceDir: 'src/lib/skills/source/amtech-article-research-writer',
    repository: registryRepository('amtech-article-research-writer'),
    safety: {
      scripts: 'none',
      requiresNetwork: true,
      requiresSecrets: false,
      riskNote:
        'No scripts. May fetch public sources to research and cite. Use in context first; produces a draft and stops before publishing to any live system.',
    },
    files: [
      {
        path: 'SKILL.md',
        role: 'primary-instructions',
        title: 'Canonical skill instructions',
        summary: 'The primary workflow for researching, planning, and drafting an information-gain article brief.',
        loadPolicy: 'Always read before drafting.',
      },
      {
        path: 'agents/openai.yaml',
        role: 'agent-metadata',
        title: 'OpenAI/Codex interface metadata',
        summary: 'UI-facing display metadata and default prompt for environments that support it.',
        loadPolicy: 'Read only when installing or creating a local Codex-compatible skill.',
      },
      {
        path: 'references/research-workflow.md',
        role: 'reference',
        title: 'Research workflow',
        summary: 'Deeper procedure for source gathering, synthesis, audience laddering, and graph placement.',
        loadPolicy: 'Read when gathering sources or synthesizing the unique insight.',
      },
      {
        path: 'references/draft-template.md',
        role: 'reference',
        title: 'Draft template',
        summary: 'The reusable markdown skeleton for the article brief.',
        loadPolicy: 'Read when assembling the draft.',
      },
      {
        path: 'assets/article-brief-schema.json',
        role: 'asset',
        title: 'Article brief schema',
        summary: 'JSON shape for a structured article research brief (amtech-article-research-brief/v1).',
        loadPolicy: 'Use when the user asks for JSON or a structured brief.',
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

export function skillRepositoryTreeUrl(skill: SkillDefinition, pinned = true): string {
  const ref = pinned ? skill.repository.commit : skill.repository.defaultBranch;
  return `${skill.repository.url}/tree/${ref}/${skill.repository.path}`;
}

export function skillRepositoryFileUrl(skill: SkillDefinition, path: string, pinned = true): string {
  const ref = pinned ? skill.repository.commit : skill.repository.defaultBranch;
  return `${skill.repository.url}/blob/${ref}/${skill.repository.path}/${path}`;
}

export function skillRepositoryRegistryUrl(skill: SkillDefinition, pinned = true): string {
  const ref = pinned ? skill.repository.commit : skill.repository.defaultBranch;
  return `${skill.repository.url}/blob/${ref}/index.json`;
}
