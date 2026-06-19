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
