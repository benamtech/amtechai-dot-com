/**
 * Entity registry — the connective tissue of the knowledge graph.
 *
 * Phase 2 promotes entities to first-class OKF concepts. These are grounded in fields the
 * article graph already carries (use case, city, subtype), so graph nodes can be auto-linked
 * to them at emit time. That derivation is what resolves the Phase-1 orphan finding: every
 * playbook now connects to its use-case / place / industry concept(s) — the "link sideways to
 * the city node, down to the subtype" rule from the master graph doc, finally *encoded* in data
 * instead of only narrated.
 *
 * Scope: Use Case, Place, Industry are derived from graph-node fields (uc/city/subtype) with no
 * authored guesswork. Service / Method / Outcome / Tool / Problem entities are the promotion of
 * the previously-inline `ArticleDefinition.entities[]` strings into first-class concept nodes:
 * they carry authored descriptions and resolve to articles by name (see `deriveNamedEntityEdgeIds`),
 * which makes the entity graph explicit instead of implicit.
 */

export type EntityKind = 'Use Case' | 'Place' | 'Industry' | 'Service' | 'Method' | 'Outcome' | 'Tool' | 'Problem';

export type EntityDef = {
  /** Stable concept id. Use-case ids are the bare token (e.g. "UC2") so they match node.uc directly. */
  id: string;
  kind: EntityKind;
  dir: 'use-cases' | 'entities';
  slug: string;
  title: string;
  description: string;
  tags: string[];
  /** node.city value this entity represents (Place only). */
  matchCity?: string;
  /** node.subtype values that map to this entity (Industry only). */
  matchSubtypes?: string[];
  /** Curated cross-entity edges (keeps composite entities like UC10 connected). */
  relatedEntityIds?: string[];
  /** Names as they appear in ArticleDefinition.primaryEntity/entities[] that resolve to this node. */
  matchNames?: string[];
  /** Canonical URL this entity stands for (e.g. a skill page); rendered as a See-also line. */
  sameAs?: string;
};

const useCases: EntityDef[] = [
  { id: 'UC1', kind: 'Use Case', dir: 'use-cases', slug: 'uc1-business-brain', title: 'Business Brain', description: 'The operational knowledge backbone everything else runs on.', tags: ['Use Case', 'UC1'] },
  { id: 'UC2', kind: 'Use Case', dir: 'use-cases', slug: 'uc2-purchasing-intelligence', title: 'Purchasing intelligence', description: 'Reads sales plus open repairs and orders and creates supplier reorder lists.', tags: ['Use Case', 'UC2'] },
  { id: 'UC3', kind: 'Use Case', dir: 'use-cases', slug: 'uc3-demand-forecasting', title: 'Demand forecasting', description: 'Uses sales history and seasonality to plan stock and buying ahead.', tags: ['Use Case', 'UC3'] },
  { id: 'UC4', kind: 'Use Case', dir: 'use-cases', slug: 'uc4-margin-analysis', title: 'Transaction and margin analysis', description: 'Reviews every sale and job for margin leaks, pricing gaps, and outliers.', tags: ['Use Case', 'UC4'] },
  { id: 'UC5', kind: 'Use Case', dir: 'use-cases', slug: 'uc5-pipeline-planning', title: 'Job and repair pipeline planning', description: "Turns next week's work into required parts, labor hours, and prep.", tags: ['Use Case', 'UC5'] },
  { id: 'UC6', kind: 'Use Case', dir: 'use-cases', slug: 'uc6-quoting-and-takeoff', title: 'Quoting and takeoff', description: 'Turns specs, designs, plans, and live parts pricing into quotes and material lists.', tags: ['Use Case', 'UC6'] },
  { id: 'UC7', kind: 'Use Case', dir: 'use-cases', slug: 'uc7-vendor-management', title: 'Supplier and vendor management', description: 'Tracks pricing, lead times, reorder timing, and vendor performance.', tags: ['Use Case', 'UC7'], relatedEntityIds: ['UC2'] },
  { id: 'UC8', kind: 'Use Case', dir: 'use-cases', slug: 'uc8-owner-briefing', title: 'Financial ops and owner briefing', description: 'Categorizes, reconciles, and produces weekly owner action reports.', tags: ['Use Case', 'UC8'] },
  { id: 'UC9', kind: 'Use Case', dir: 'use-cases', slug: 'uc9-service-history', title: 'Service-history intelligence', description: "Knows each client's equipment, service history, and what is due.", tags: ['Use Case', 'UC9'] },
  { id: 'UC10', kind: 'Use Case', dir: 'use-cases', slug: 'uc10-full-operations-employee', title: 'Full AI operations employee', description: 'A connected back office spanning several operational use cases at once.', tags: ['Use Case', 'UC10'], relatedEntityIds: ['UC1', 'UC2', 'UC4', 'UC5', 'UC8'] },
];

const places: EntityDef[] = [
  { id: 'place-phoenix', kind: 'Place', dir: 'entities', slug: 'place-phoenix', title: 'Phoenix', description: 'Arizona Valley market and chip-and-AI hub; pools, HVAC, solar, and outdoor retail dominate the service economy.', tags: ['Place', 'Phoenix'], matchCity: 'Phoenix' },
  { id: 'place-sherman', kind: 'Place', dir: 'entities', slug: 'place-sherman', title: 'Sherman', description: 'North Texas growth market where semiconductor-fab investment is driving building supply, contractors, and equipment rental.', tags: ['Place', 'Sherman'], matchCity: 'Sherman' },
  { id: 'place-myrtle-beach', kind: 'Place', dir: 'entities', slug: 'place-myrtle-beach', title: 'Myrtle Beach', description: 'Grand Strand coastal South Carolina market: seasonal, retiree, vacation-rental, and marine businesses.', tags: ['Place', 'Myrtle Beach', 'Grand Strand'], matchCity: 'Myrtle Beach' },
  { id: 'place-salisbury', kind: 'Place', dir: 'entities', slug: 'place-salisbury', title: 'Salisbury', description: 'Independent-retail and service market (including the Chesapeake area): pharmacy, garden center, bike, and marine operators.', tags: ['Place', 'Salisbury', 'Chesapeake'], matchCity: 'Salisbury' },
];

const industries: EntityDef[] = [
  { id: 'industry-pharmacy', kind: 'Industry', dir: 'entities', slug: 'industry-pharmacy', title: 'Independent pharmacy', description: 'Wholesaler ordering, refill data, and inventory reconciliation make pharmacies a prime operations-AI candidate.', tags: ['Industry', 'pharmacy'], matchSubtypes: ['pharmacy'] },
  { id: 'industry-garden-center', kind: 'Industry', dir: 'entities', slug: 'industry-garden-center', title: 'Garden center', description: 'Perishable, seasonal inventory with high shrink risk and sharp demand swings.', tags: ['Industry', 'garden center'], matchSubtypes: ['garden center'] },
  { id: 'industry-bike-shop', kind: 'Industry', dir: 'entities', slug: 'industry-bike-shop', title: 'Bike shop', description: 'Retail sales plus a repair pipeline that drives parts ordering.', tags: ['Industry', 'bike shop'], matchSubtypes: ['bike shop'] },
  { id: 'industry-pool', kind: 'Industry', dir: 'entities', slug: 'industry-pool', title: 'Pool supply and service', description: 'Route-based chemical and parts inventory with recurring service visits.', tags: ['Industry', 'pool'], matchSubtypes: ['pool service', 'pool/HVAC', 'pool supply+service'] },
  { id: 'industry-hvac', kind: 'Industry', dir: 'entities', slug: 'industry-hvac', title: 'HVAC', description: 'Install pipeline, parts procurement, and maintenance-contract renewals.', tags: ['Industry', 'HVAC'], matchSubtypes: ['HVAC', 'pool/HVAC'] },
  { id: 'industry-building-supply', kind: 'Industry', dir: 'entities', slug: 'industry-building-supply', title: 'Building supply and trades', description: 'Contractor accounts, material takeoffs, and demand-driven reorder cadence.', tags: ['Industry', 'building supply'], matchSubtypes: ['building supply', 'building supply/trades'] },
  { id: 'industry-equipment-rental', kind: 'Industry', dir: 'entities', slug: 'industry-equipment-rental', title: 'Equipment rental', description: 'Reservations and hour-meter data drive utilization reporting and service scheduling.', tags: ['Industry', 'equipment rental'], matchSubtypes: ['equipment rental'] },
  { id: 'industry-vacation-rental', kind: 'Industry', dir: 'entities', slug: 'industry-vacation-rental', title: 'Vacation-rental management', description: 'Per-property P&L, maintenance pipeline, and vendor dispatch across a portfolio.', tags: ['Industry', 'vacation-rental management'], matchSubtypes: ['vacation-rental management'] },
  { id: 'industry-marine', kind: 'Industry', dir: 'entities', slug: 'industry-marine', title: 'Marine service and dealers', description: 'Parts, service history, and seasonal winterization scheduling.', tags: ['Industry', 'marine'], matchSubtypes: ['marine service', 'marine dealer'] },
  { id: 'industry-solar', kind: 'Industry', dir: 'entities', slug: 'industry-solar', title: 'Solar', description: 'Proposals built from roof design and live panel pricing rather than guesswork.', tags: ['Industry', 'solar'], matchSubtypes: ['solar'] },
  { id: 'industry-golf-cart', kind: 'Industry', dir: 'entities', slug: 'industry-golf-cart', title: 'Golf-cart and LSV sales-and-service', description: 'Parts inventory and service history drive reorder and due-for-service lists.', tags: ['Industry', 'golf-cart/LSV'], matchSubtypes: ['golf-cart/LSV'] },
  { id: 'industry-flooring', kind: 'Industry', dir: 'entities', slug: 'industry-flooring', title: 'Flooring contractor', description: 'Job costing across materials and labor exposes margin outliers.', tags: ['Industry', 'flooring contractor'], matchSubtypes: ['flooring contractor'] },
];

// Promoted entities: the recurring, connective Method / Tool / Outcome / Service / Problem concepts
// that were previously only inline strings in ArticleDefinition.entities[]. Each resolves to the
// articles that name it (matchNames), giving every node an inbound edge — no orphans. Cross-entity
// `relatedEntityIds` thicken the cluster so the agent-readability concepts form a real subgraph.
const concepts: EntityDef[] = [
  { id: 'concept-okf', kind: 'Method', dir: 'entities', slug: 'concept-open-knowledge-format', title: 'Open Knowledge Format', description: "Google's lightweight format for AI-readable knowledge: a directory of markdown concept files with YAML frontmatter whose links form a portable knowledge graph.", tags: ['Method', 'Open Knowledge Format', 'OKF'], matchNames: ['Open Knowledge Format', 'OKF'], relatedEntityIds: ['concept-knowledge-graph', 'concept-materialized-views', 'concept-agent-readable-knowledge'] },
  { id: 'concept-knowledge-graph', kind: 'Method', dir: 'entities', slug: 'concept-knowledge-graph', title: 'Knowledge graph', description: 'Named entities connected by typed relationships, so agents and search systems build context by traversing links between things rather than re-reading prose.', tags: ['Method', 'knowledge graph', 'entity graph'], matchNames: ['knowledge graph', 'entity graph'], relatedEntityIds: ['concept-okf', 'concept-ai-overviews'] },
  { id: 'concept-materialized-views', kind: 'Method', dir: 'entities', slug: 'concept-materialized-views', title: 'Materialized views', description: 'One source of truth projected into many consumer surfaces — HTML, prerendered static pages, JSON-LD, markdown bundle, sitemap — so every reader gets a fit-for-purpose representation.', tags: ['Method', 'materialized views'], matchNames: ['materialized views'], relatedEntityIds: ['concept-okf', 'concept-publishing-standard'] },
  { id: 'concept-okf-audit', kind: 'Method', dir: 'entities', slug: 'concept-okf-content-audit', title: 'OKF content audit', description: 'A six-dimension scoring method (0–30) for how readable a page or bundle is to AI agents: first-fetch clarity, concept packaging, entity coverage, citations, materialized views, and execution readiness.', tags: ['Method', 'OKF content audit', 'OKF audit'], matchNames: ['OKF content audit', 'OKF audit'], relatedEntityIds: ['concept-okf', 'tool-okf-audit-skill'] },
  { id: 'concept-publishing-standard', kind: 'Method', dir: 'entities', slug: 'concept-amtech-knowledge-publishing-standard', title: 'AMTECH Knowledge Publishing Standard', description: 'The AMTECH discipline of authoring knowledge once and projecting it into every surface humans, crawlers, agents, and databases need, with validation before publish.', tags: ['Method', 'AMTECH Knowledge Publishing Standard'], matchNames: ['AMTECH Knowledge Publishing Standard'], relatedEntityIds: ['concept-okf', 'concept-materialized-views'] },
  { id: 'concept-structured-data', kind: 'Method', dir: 'entities', slug: 'concept-structured-data', title: 'Structured data', description: 'Machine-readable clues about page meaning (author, date, type, FAQ, breadcrumbs) that agents and search systems use when prose alone is ambiguous.', tags: ['Method', 'structured data'], matchNames: ['structured data'], relatedEntityIds: ['concept-json-ld'] },
  { id: 'concept-json-ld', kind: 'Tool', dir: 'entities', slug: 'concept-json-ld', title: 'JSON-LD', description: 'The JSON syntax for embedding schema.org structured data in a page so its meaning is explicit in the first-fetch surface.', tags: ['Tool', 'JSON-LD'], matchNames: ['JSON-LD'], relatedEntityIds: ['concept-structured-data'] },
  { id: 'concept-llms-txt', kind: 'Tool', dir: 'entities', slug: 'concept-llms-txt', title: 'llms.txt', description: 'A discovery file that gives AI tools a direct orientation to a site’s most important content, complementing sitemap.xml and robots.txt.', tags: ['Tool', 'llms.txt'], matchNames: ['llms.txt'], relatedEntityIds: ['concept-okf'] },
  { id: 'concept-ai-overviews', kind: 'Tool', dir: 'entities', slug: 'concept-ai-overviews', title: 'AI Overviews', description: "Google's generative search surface that may use query fan-out across related subtopics, rewarding clear entity relationships and cited claims.", tags: ['Tool', 'AI Overviews'], matchNames: ['AI Overviews'], relatedEntityIds: ['concept-knowledge-graph'] },
  { id: 'tool-okf-audit-skill', kind: 'Tool', dir: 'entities', slug: 'tool-okf-audit-skill', title: 'OKF Audit Skill', description: 'The consumable AMTECH skill that runs the OKF content audit from a single URL in any agent, returning a score, priority fixes, and a remediation prompt.', tags: ['Tool', 'OKF Audit Skill', 'skill'], matchNames: ['OKF Audit Skill'], sameAs: 'https://amtechai.com/skills/okf-audit', relatedEntityIds: ['concept-okf-audit', 'concept-okf'] },
  { id: 'concept-agent-readable-knowledge', kind: 'Outcome', dir: 'entities', slug: 'concept-agent-readable-knowledge', title: 'Agent-readable knowledge', description: 'The end state where an agent that fetches a URL gets enough structure, metadata, entities, and citations to use the content as trusted context without scraping or guessing.', tags: ['Outcome', 'agent-readable knowledge'], matchNames: ['agent-readable knowledge'], relatedEntityIds: ['concept-okf', 'concept-materialized-views'] },
  { id: 'service-ai-employee', kind: 'Service', dir: 'entities', slug: 'service-ai-employee', title: 'AI Employee', description: 'A managed, connected operating assistant that reads business context, follows workflows, and reports to a human supervisor — not a one-off chatbot.', tags: ['Service', 'AI Employee', 'AI employees'], matchNames: ['AI Employee', 'AI employees', 'AI employee', 'AI agents'], relatedEntityIds: ['service-business-brain', 'problem-owner-bottleneck'] },
  { id: 'service-business-brain', kind: 'Service', dir: 'entities', slug: 'service-business-brain', title: 'Business Brain', description: 'The durable operating-context layer — records, rules, examples, and approval boundaries — a business documents before agents or automation can use its knowledge reliably.', tags: ['Service', 'Business Brain'], matchNames: ['Business Brain', 'AMTECH Business Brain', 'business brain'], relatedEntityIds: ['service-ai-employee'] },
  { id: 'problem-owner-bottleneck', kind: 'Problem', dir: 'entities', slug: 'problem-owner-bottleneck', title: 'Owner bottleneck', description: 'The constraint where a business cannot scale because key decisions, knowledge, and approvals all route through the owner; the problem AI Employees and a Business Brain are built to relieve.', tags: ['Problem', 'owner bottleneck'], matchNames: ['owner bottleneck'], relatedEntityIds: ['service-ai-employee', 'service-business-brain'] },
];

export const entityDefs: EntityDef[] = [...useCases, ...places, ...industries, ...concepts];

/** Resolve which promoted-entity ids an article links to, from its primaryEntity/entities[] names. */
export function deriveNamedEntityEdgeIds(names: string[]): string[] {
  const wanted = new Set(names.map((n) => n.trim().toLowerCase()).filter(Boolean));
  const ids: string[] = [];
  for (const entity of concepts) {
    const aliases = [entity.title, ...(entity.matchNames ?? [])].map((a) => a.toLowerCase());
    if (aliases.some((alias) => wanted.has(alias))) ids.push(entity.id);
  }
  return [...new Set(ids)];
}

/** Resolve which entity ids a graph node links to, from its use case, city, and subtype. */
export function deriveEntityEdgeIds(uc: string, city?: string, subtype?: string): string[] {
  const ids: string[] = [];
  uc.split('/')
    .map((part) => part.trim())
    .forEach((token) => {
      if (entityDefs.some((entity) => entity.id === token)) ids.push(token);
    });
  if (city) {
    const place = places.find((entity) => entity.matchCity === city);
    if (place) ids.push(place.id);
  }
  if (subtype) {
    industries.forEach((entity) => {
      if (entity.matchSubtypes?.includes(subtype)) ids.push(entity.id);
    });
  }
  return [...new Set(ids)];
}
