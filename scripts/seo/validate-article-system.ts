import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const repoRoot = resolve(new URL('../..', import.meta.url).pathname);

const graphPath = 'docs/seo/article-graph-nodes.json';
const requiredDocs = [
  'docs/seo/ARTICLE_RESEARCH_WRITER_SYSTEM.md',
  'docs/seo/ARTICLE_RESEARCH_DOCTRINE.md',
  'docs/seo/ARTICLE_GRAPH_NODES.md',
  'docs/seo/ARTICLE_SURFACE_PACK_SPEC.md',
  'docs/skills/amtech-article-research-writer/SKILL.md',
];

const clusters = [
  'ai_agents_for_small_business',
  'contractor_ai',
  'business_setup_with_ai',
  'current_ai_news_for_smbs',
  'agentic_seo_geo',
  'tool_workflow_howtos',
] as const;

const searchIntents = ['informational', 'operational', 'news-explainer', 'comparison', 'setup', 'troubleshooting'];
const freshnessRequirements = ['evergreen', 'current', 'breaking'];
const sourceRequirements = ['official', 'primary_reporting', 'research', 'operator_voice', 'vendor', 'social'];
const surfaceRequirements = [
  'article',
  'schema',
  'okf',
  'image_pack',
  'pinterest_pin',
  'social_snippets',
  'future_tool_node',
];
const bannedPatterns = [
  /ultimate guide/i,
  /top \d+/i,
  /what nobody tells you/i,
  /changed .* forever/i,
  /one .* trick/i,
  /\bsecrets?\b/i,
  /will save your business/i,
];

type ArticleNode = {
  node_id: string;
  primary_entity: string;
  cluster: string;
  audience: string;
  question: string;
  search_intent: string;
  freshness_requirement: string;
  traffic_thesis: string;
  information_gain_thesis: string;
  amtech_bridge: string;
  fanout_queries: string[];
  internal_edges: { target: string; relationship: string }[];
  source_requirements: string[];
  surface_requirements: string[];
  publish_priority: number;
};

const errors: string[] = [];

function fail(message: string) {
  errors.push(message);
}

async function readText(path: string) {
  return readFile(resolve(repoRoot, path), 'utf8');
}

function hasText(value: unknown) {
  return typeof value === 'string' && value.trim().length >= 12;
}

function validateNode(node: ArticleNode, index: number, ids: Set<string>) {
  const label = node?.node_id || `node at index ${index}`;
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(node.node_id || '')) fail(`${label}: node_id must be short kebab-case.`);
  if (ids.has(node.node_id)) fail(`${label}: duplicate node_id.`);
  ids.add(node.node_id);

  for (const key of ['primary_entity', 'audience', 'question', 'traffic_thesis', 'information_gain_thesis', 'amtech_bridge'] as const) {
    if (!hasText(node[key])) fail(`${label}: ${key} is missing or too thin.`);
  }

  if (!clusters.includes(node.cluster as (typeof clusters)[number])) fail(`${label}: invalid cluster ${node.cluster}.`);
  if (!searchIntents.includes(node.search_intent)) fail(`${label}: invalid search_intent ${node.search_intent}.`);
  if (!freshnessRequirements.includes(node.freshness_requirement)) fail(`${label}: invalid freshness_requirement ${node.freshness_requirement}.`);
  if (!Number.isInteger(node.publish_priority) || node.publish_priority < 1 || node.publish_priority > 5) {
    fail(`${label}: publish_priority must be an integer from 1 to 5.`);
  }

  if (!Array.isArray(node.fanout_queries) || node.fanout_queries.length < 5) fail(`${label}: needs at least five fanout_queries.`);
  if (!Array.isArray(node.internal_edges) || node.internal_edges.length < 2) fail(`${label}: needs at least two internal_edges.`);
  for (const edge of node.internal_edges || []) {
    if (!hasText(edge.target) || !hasText(edge.relationship)) fail(`${label}: every internal edge needs target and relationship.`);
  }

  if (!Array.isArray(node.source_requirements) || node.source_requirements.length < 2) fail(`${label}: needs at least two source_requirements.`);
  for (const source of node.source_requirements || []) {
    if (!sourceRequirements.includes(source)) fail(`${label}: invalid source requirement ${source}.`);
  }

  for (const surface of surfaceRequirements) {
    if (!node.surface_requirements?.includes(surface)) fail(`${label}: missing surface requirement ${surface}.`);
  }

  const clickbaitSurface = [node.question, node.traffic_thesis, node.information_gain_thesis].join(' ');
  for (const pattern of bannedPatterns) {
    if (pattern.test(clickbaitSurface)) fail(`${label}: banned clickbait pattern ${pattern}.`);
  }

  if (!/\bAMTECH|AI Employee|business brain|approval gate|connector|skill|graph|surface\b/i.test(node.amtech_bridge)) {
    fail(`${label}: amtech_bridge must connect to an AMTECH doctrine term without turning into a sales pitch.`);
  }
}

async function main() {
  const rawGraph = await readText(graphPath);
  const parsed = JSON.parse(rawGraph) as { nodes?: ArticleNode[] };
  const nodes = parsed.nodes || [];
  if (nodes.length !== 100) fail(`${graphPath}: expected exactly 100 nodes, found ${nodes.length}.`);

  const ids = new Set<string>();
  const clusterCounts = new Map<string, number>();
  for (const node of nodes) {
    clusterCounts.set(node.cluster, (clusterCounts.get(node.cluster) || 0) + 1);
  }
  for (const cluster of clusters) {
    const count = clusterCounts.get(cluster) || 0;
    if (count < 10) fail(`${graphPath}: cluster ${cluster} has ${count} nodes; expected at least 10.`);
  }
  nodes.forEach((node, index) => validateNode(node, index, ids));

  const docExpectations: Record<string, string[]> = {
    'docs/seo/ARTICLE_RESEARCH_WRITER_SYSTEM.md': [
      'live AMTECH site is not business evidence',
      'graph node before title',
      'information-gain thesis',
      'research ledger',
      'publication blocker',
    ],
    'docs/seo/ARTICLE_RESEARCH_DOCTRINE.md': [
      'query fan-out',
      'evidence ecosystem',
      'citation absorption',
      'source ownership',
      'Pinterest',
    ],
    'docs/seo/ARTICLE_SURFACE_PACK_SPEC.md': [
      'surface_pack',
      'schema',
      'okf_projection',
      'image_pack',
      'future_tool_node',
    ],
    'docs/skills/amtech-article-research-writer/SKILL.md': [
      'internal AMTECH article intelligence system',
      'Do not use the live AMTECH site as business evidence',
      'Stop before live publish',
    ],
  };

  for (const path of requiredDocs) {
    const text = await readText(path);
    if (text.length < 1000) fail(`${path}: document is unexpectedly thin.`);
    for (const phrase of docExpectations[path] || []) {
      if (!text.includes(phrase)) fail(`${path}: missing required phrase "${phrase}".`);
    }
  }

  if (errors.length) {
    console.error(`article-system:validate failed with ${errors.length} issue(s):`);
    for (const error of errors) console.error(`- ${error}`);
    process.exit(1);
  }

  console.log(`article-system:validate passed — ${nodes.length} nodes, ${clusters.length} clusters, ${requiredDocs.length} docs.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
