export type KnowledgeGraphNodeType = 'T1' | 'T2' | 'T3' | 'T4' | 'T5' | 'T6' | 'T7' | 'T8' | 'EXISTING';

export type KnowledgeGraphNode = {
  id: string;
  title: string;
  slug: string;
  href: string;
  type: KnowledgeGraphNodeType;
  typeLabel: string;
  status: 'published' | 'planned';
  city?: 'Phoenix' | 'Sherman' | 'Myrtle Beach' | 'Salisbury';
  subtype?: string;
  uc: string;
  mechanism: string;
  audience: string;
  topic: string;
  description: string;
  connectsTo: string[];
};

const planned = (id: number, title: string, type: KnowledgeGraphNodeType, uc: string, mechanism: string, city = '', subtype = ''): KnowledgeGraphNode => {
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const typeLabels: Record<KnowledgeGraphNodeType, string> = {
    T1: 'General operational authority', T2: 'General topic by market', T3: 'Deep AMTECH technical proof', T4: 'Regional force and demand signal', T5: 'How-to workflow by business type', T6: 'AMTECH use case by market', T7: 'Full operations back office by subtype', T8: 'Reusable subtype playbook', EXISTING: 'Published article',
  };
  return { id: `N${id}`, title, slug, href: `/articles/${slug}`, type, typeLabel: typeLabels[type], status: 'planned', city: city as KnowledgeGraphNode['city'] || undefined, subtype: subtype || undefined, uc, mechanism, audience: subtype || city || 'Operations-led business owners', topic: subtype || city || uc, description: mechanism, connectsTo: [] };
};

export const articleKnowledgeGraphNodes: KnowledgeGraphNode[] = [
  { id: 'E1', title: 'How to Build a Business Brain for Free Before You Hire an AI Consultant', slug: 'business-brain-free', href: '/articles/business-brain-free', type: 'EXISTING', typeLabel: 'Published business-brain anchor', status: 'published', uc: 'UC1/UC8', mechanism: 'Organizes records, examples, rules, approval boundaries, and operating context before automation.', audience: 'Business owners', topic: 'Business Brain', description: 'A practical starting point for building the operational knowledge backbone an AI employee needs.', connectsTo: ['N1', 'N4', 'N27'] },
  { id: 'E2', title: 'Use ChatGPT or Claude to Build a Local SEO Plan That Out-Ranks Bigger Competitors', slug: 'build-local-seo-plan-with-chatgpt', href: '/articles/build-local-seo-plan-with-chatgpt', type: 'EXISTING', typeLabel: 'Published SEO systems anchor', status: 'published', uc: 'Local authority', mechanism: 'Maps services, places, buyer questions, entities, proof, and internal links into a knowledge graph.', audience: 'Local business owners', topic: 'Knowledge graph SEO', description: 'Explains entity SEO planning; this operational graph is the article-system spine it now links into.', connectsTo: ['N1', 'N5', 'N6', 'N7'] },
  { id: 'E3', title: 'Build a Claude Skill That Helps You Price Jobs Like a Pro', slug: 'build-claude-skill-job-pricing', href: '/articles/build-claude-skill-job-pricing', type: 'EXISTING', typeLabel: 'Published custom-skill anchor', status: 'published', uc: 'UC4/UC6', mechanism: 'Packages pricing rules, examples, and profitability checks into a reusable job-pricing skill.', audience: 'Claude users', topic: 'Quoting and margin', description: 'Connects estimating skills to the broader quote, takeoff, and margin-analysis system.', connectsTo: ['N3', 'N21', 'N22', 'N38', 'N40'] },
  { id: 'E4', title: 'AMTECH vs. ChatGPT or Claude: What’s the Difference?', slug: 'amtech-vs-chatgpt-claude', href: '/articles/amtech-vs-chatgpt-claude', type: 'EXISTING', typeLabel: 'Published buying-decision anchor', status: 'published', uc: 'UC10', mechanism: 'Compares DIY chat tools with connected, governed AI employees that operate inside business workflows.', audience: 'Business owners', topic: 'AI employee', description: 'Positions the graph around connected operations rather than one-off prompts.', connectsTo: ['N1', 'N10', 'N28', 'N29', 'N32'] },
  { id: 'E5', title: 'Create an Estimate With ChatGPT', slug: 'create-estimate-with-chatgpt', href: '/articles/create-estimate-with-chatgpt', type: 'EXISTING', typeLabel: 'Published prompt guide', status: 'published', uc: 'UC6', mechanism: 'Turns field notes, scope, assumptions, and exclusions into a professional estimate draft.', audience: 'Contractors', topic: 'Estimating', description: 'The entry-level prompt article that links upward into quoting, takeoff, and margin systems.', connectsTo: ['N21', 'N38'] },
  { id: 'E6', title: 'Write a Pressure Washing Estimate With AI', slug: 'write-pressure-washing-estimate-with-ai', href: '/articles/write-pressure-washing-estimate-with-ai', type: 'EXISTING', typeLabel: 'Published industry prompt guide', status: 'published', uc: 'UC6', mechanism: 'Organizes exterior-cleaning scope, assumptions, exclusions, upgrades, and pricing review.', audience: 'Exterior cleaners', topic: 'Estimating', description: 'A vertical prompt workflow connected to the quote-and-margin branch.', connectsTo: ['E5', 'N38', 'N40'] },
  { id: 'E7', title: 'Estimate Painting Cost With AI', slug: 'estimate-painting-cost-ai', href: '/articles/estimate-painting-cost-ai', type: 'EXISTING', typeLabel: 'Published industry prompt guide', status: 'published', uc: 'UC6/UC4', mechanism: 'Structures measurements, prep notes, coating assumptions, labor, and optional upgrades.', audience: 'Painters', topic: 'Estimating', description: 'A vertical prompt workflow connected to job costing and quote accuracy.', connectsTo: ['E5', 'N22', 'N38'] },
  { id: 'E8', title: 'How Independent Stores Use AI to Turn Three Seasons of Sales Data Into Better Owner Decisions', slug: 'garden-center-spring-buy-plan-ai', href: '/articles/garden-center-spring-buy-plan-ai', type: 'EXISTING', typeLabel: 'Published local operations guide', status: 'published', uc: 'UC3', mechanism: 'Seasonal sales history creates a buy, staffing, promotion, and reorder plan for independent operators.', audience: 'Independent retailers and local service businesses', topic: 'Seasonal sales intelligence', description: 'A Salisbury garden-center walkthrough generalized for hardware stores, supply shops, salons, contractors, and other owner-led businesses.', connectsTo: ['E1', 'E4', 'N2', 'N30', 'N37'] },
  { id: 'E9', title: "What Is OKF? Google's New Format For AI-Readable Knowledge", slug: 'what-is-okf-ai-readable-knowledge', href: '/articles/what-is-okf-ai-readable-knowledge', type: 'EXISTING', typeLabel: 'Published OKF and agentic-search explainer', status: 'published', uc: 'Local authority / Agentic SEO', mechanism: 'Explains OKF as a portable markdown concept bundle, then shows why AMTECH treats it as one surface generated from a richer entity graph.', audience: 'Founders, technical marketers, SEO strategists, content operators, and AI builders', topic: 'Open Knowledge Format', description: 'A plain-English explanation of OKF, knowledge graphs, and the AMTECH standard for turning useful content into agent-readable surfaces.', connectsTo: ['E1', 'E2', 'E4', 'N1'] },
  planned(1, 'AI learned to trade stocks before it could flip a burger: automate the operations brain, not the front desk', 'T1', 'overview', 'Thesis and worked examples across inventory, finance, purchasing, forecasting, and planning.', '', ''),
  planned(2, "Turn last week's sales into next week's order: purchasing intelligence for any inventory-and-repair business", 'T1', 'UC2', 'Reads POS and open tickets to produce a supplier reorder list.', '', ''),
  planned(3, 'Find the margin leaks: reviewing every transaction your business makes with AI', 'T1', 'UC4', 'Parses all sales and jobs to flag low-margin SKUs, pricing gaps, and job-cost outliers.', '', ''),
  planned(4, 'The Monday-morning briefing: making your Business Brain tell you what to do this week', 'T1', 'UC1/UC8', 'Reads operational and finance data to produce a ranked weekly action list.', '', ''),
  planned(5, "The $2M bike shop hiding in a town like Salisbury: what AI takes off the owner's plate first", 'T2', 'overview', 'Parts ordering, repair planning, and transaction review as a complete owner-leverage example.', 'Salisbury', ''),
  planned(6, 'Phoenix runs on pools and panels: the operational AI a Valley service business actually needs', 'T2', 'UC2/UC5', 'Inventory and route or install planning from real job data.', 'Phoenix', ''),
  planned(7, 'Building Sherman: the back-office AI a supply yard needs as the subdivisions land', 'T2', 'UC2/UC3', 'Contractor-demand signals become reorder and stock-ahead plans.', 'Sherman', ''),
  planned(8, 'A full operational Business Brain for a Salisbury independent pharmacy', 'T3', 'UC1/UC2/UC9', 'POS, wholesaler ordering, and refill data connect into reconciliation and reorder workflows.', 'Salisbury', 'pharmacy'),
  planned(9, 'Running a Grand Strand vacation-rental management company on one AI back office', 'T3', 'UC4/UC8/UC10', 'Per-property P&L, maintenance pipeline, and vendor dispatch in one agent.', 'Myrtle Beach', 'vacation-rental management'),
  planned(10, "The connected shop floor: wiring a Phoenix HVAC company's POS, parts supplier, and scheduling into one agent", 'T3', 'UC2/UC5/UC10', 'Install pipeline, parts procurement, and dispatch stay linked.', 'Phoenix', 'HVAC'),
  planned(11, 'Equipment rental in a boomtown: tracking fleet utilization and maintenance for a Sherman yard with AI', 'T3', 'UC9/UC8', 'Reservation and hour-meter data drive utilization reporting and service scheduling.', 'Sherman', 'equipment rental'),
  planned(12, 'What 3,000 new fab jobs mean for a Sherman building-supply yard — and the AI reorder system to meet it', 'T4', 'UC2/UC3', 'Demand surge modeled into stock-ahead and reorder cadence.', 'Sherman', 'building supply'),
  planned(13, 'Phoenix is a chip-and-AI hub now: how a local pool or HVAC company puts the same AI on its own data', 'T4', 'UC4/UC2', "Transaction analysis and inventory planning on the shop's own books.", 'Phoenix', 'pool/HVAC'),
  planned(14, 'Retiree money on the Grand Strand: why a golf-cart sales-and-service shop is a prime AI operations candidate', 'T4', 'UC2/UC9', 'Parts inventory and service history produce reorder and due-for-service lists.', 'Myrtle Beach', 'golf-cart/LSV'),
  planned(15, "How a Phoenix bike shop turns POS sales and repair tickets into next week's parts order with AI", 'T5', 'UC2', 'Sales plus open repairs become a consolidated supplier order.', 'Phoenix', 'bike shop'),
  planned(16, 'Quoting solar from the design, not the guess: how a Phoenix installer builds proposals with AI', 'T5', 'UC6', 'Roof design and live panel pricing produce accurate proposals.', 'Phoenix', 'solar'),
  planned(17, 'Every pool on the route, every chemical it needs: AI inventory and run-planning for a Phoenix pool-service company', 'T5', 'UC2/UC5', 'Route and readings become chemical and part loadouts by truck.', 'Phoenix', 'pool service'),
  planned(19, "Next week's repairs, every part pre-ordered: AI work-planning for a Chesapeake marine service shop", 'T5', 'UC5/UC2', 'Service calendar produces parts-needed and pre-order lists.', 'Salisbury', 'marine service'),
  planned(20, 'How a Salisbury independent pharmacy reconciles inventory against refills and flags what to reorder', 'T5', 'UC2/UC9', 'Dispense and refill data reconcile against on-hand counts.', 'Salisbury', 'pharmacy'),
  planned(21, 'Contractor accounts and material takeoffs: how a Sherman building-supply yard quotes and reorders with AI', 'T5', 'UC6/UC2', 'Plans and takeoffs become quotes and restock triggers.', 'Sherman', 'building supply'),
  planned(22, "Find the margin leaks in a Sherman flooring contractor's jobs: AI review of every job's materials and labor", 'T5', 'UC4', 'Job costing across all jobs exposes margin outliers.', 'Sherman', 'flooring contractor'),
  planned(23, "Owner ledgers and turnover costs: how a Myrtle Beach vacation-rental manager reviews every property's P&L with AI", 'T5', 'UC4/UC8', 'Property revenue and costs become owner-ready P&L summaries.', 'Myrtle Beach', 'vacation-rental management'),
  planned(24, 'Purchasing intelligence for a Phoenix service business: from sales data to supplier order, weekly', 'T6', 'UC2', 'Weekly sales data becomes a scheduled vendor order.', 'Phoenix', ''),
  planned(25, 'The weekly owner briefing for a Sherman trade business: what your numbers say to do next', 'T6', 'UC8', 'Finance and pipeline data produce ranked weekly actions.', 'Sherman', ''),
  planned(26, 'Demand forecasting for a Grand Strand seasonal business: stock and staff for the swing, not the average', 'T6', 'UC3', 'Seasonality model produces stock and staffing plans.', 'Myrtle Beach', ''),
  planned(27, 'A Business Brain for a Salisbury business worth scaling: capture the operations before a second location', 'T6', 'UC1', 'Operational interview becomes a connected operations knowledge base.', 'Salisbury', ''),
  planned(28, 'An AI operations employee for a Phoenix pool supply-and-service company: inventory, routes, reorder', 'T7', 'UC10', 'Inventory, routes, and reorder loops run in one agent.', 'Phoenix', 'pool supply+service'),
  planned(29, 'The connected back office for a Sherman equipment-rental yard: reservations, fleet maintenance, utilization', 'T7', 'UC10', 'Bookings, maintenance, and utilization reporting connect.', 'Sherman', 'equipment rental'),
  planned(30, 'An AI operations brain for a Salisbury garden center: perishable inventory, seasonal forecasting, supplier orders', 'T7', 'UC3/UC10', 'Shrink-aware inventory, forecasts, and ordering connect.', 'Salisbury', 'garden center'),
  planned(31, "Run a Grand Strand marine dealership's parts, service, and winterization schedule from one AI agent", 'T7', 'UC5/UC9/UC10', 'Parts, service history, and seasonal scheduling connect.', 'Myrtle Beach', 'marine dealer'),
  planned(32, 'An AI back office for a Phoenix HVAC company: install pipeline, parts procurement, maintenance contracts', 'T7', 'UC10', 'Pipeline, procurement, and contract renewals connect.', 'Phoenix', 'HVAC'),
  planned(33, 'Inventory and contractor-account intelligence for a Sherman building-supply yard, run by AI', 'T7', 'UC2/UC10', 'Account-level demand becomes stock and reorder intelligence.', 'Sherman', 'building supply'),
  planned(34, 'A pharmacy operations agent for a Salisbury independent: ordering, reconciliation, refill reminders', 'T7', 'UC2/UC9/UC10', 'Wholesaler ordering, reconciliation, and refill prompts connect.', 'Salisbury', 'pharmacy'),
  planned(35, 'How a bike shop anywhere turns sales and repair history into automated parts ordering with AI', 'T8', 'UC2', 'POS and repair data become supplier orders.', '', 'bike shop'),
  planned(36, 'The operational AI back office for a pool supply-and-service company: inventory, routes, reorder', 'T8', 'UC10', 'Inventory, routes, and reorder loops in one operating system.', '', 'pool supply+service'),
  planned(37, 'How a garden center uses AI to forecast perishable inventory and time supplier orders', 'T8', 'UC3/UC2', 'Seasonality and shrink create a supplier buy plan.', '', 'garden center'),
  planned(38, 'Quoting and material takeoff for a building-supply yard or trade contractor, run by one AI agent', 'T8', 'UC6', 'Plans become quotes and material lists.', '', 'building supply/trades'),
  planned(39, 'How an independent pharmacy uses AI for inventory reconciliation and reorder', 'T8', 'UC2/UC9', 'Dispense data reconciles against on-hand inventory.', '', 'pharmacy'),
  planned(40, 'Margin analysis for any inventory-and-service business: what every transaction is telling you', 'T8', 'UC4', 'Full transaction review produces a margin map.', '', 'all inventory-and-service businesses'),
];

export const articleTopicGroups = [
  { title: 'Start here: operations brain', description: 'The thesis pieces and published foundations for replacing owner memory with a connected operating brain.', nodeIds: ['N1', 'E1', 'N4', 'E4', 'N27'] },
  { title: 'Knowledge graph and agentic search', description: 'Entity SEO, OKF, Business Brain context, and agent-readable publishing surfaces.', nodeIds: ['E9', 'E2', 'E1', 'E4', 'N1'] },
  { title: 'Purchasing, inventory, and forecasting', description: 'Reorder lists, stock-ahead planning, perishable inventory, route loadouts, and demand swings.', nodeIds: ['N2', 'N24', 'N35', 'N36', 'N37', 'E8', 'N28', 'N30'] },
  { title: 'Quoting, takeoff, and margin control', description: 'Estimate prompts grow into quote engines, material takeoffs, job-cost review, and transaction-level margin maps.', nodeIds: ['E5', 'E6', 'E7', 'E3', 'N3', 'N16', 'N21', 'N22', 'N38', 'N40'] },
  { title: 'Phoenix operations playbooks', description: 'Pools, HVAC, solar, and bike/outdoor retail workflows for the Valley.', nodeIds: ['N6', 'N10', 'N13', 'N15', 'N16', 'N17', 'N24', 'N28', 'N32'] },
  { title: 'Sherman growth playbooks', description: 'Supply yards, flooring contractors, equipment rental, and trade operations as growth lands.', nodeIds: ['N7', 'N11', 'N12', 'N21', 'N22', 'N25', 'N29', 'N33'] },
  { title: 'Myrtle Beach and Grand Strand operators', description: 'Seasonal inventory, vacation-rental management, marine dealers, and golf-cart service.', nodeIds: ['N9', 'N14', 'N23', 'N26', 'N31'] },
  { title: 'Salisbury and Chesapeake operators', description: 'Independent pharmacy, garden center, bike shop, marine service, and second-location readiness.', nodeIds: ['N5', 'N8', 'E8', 'N19', 'N20', 'N27', 'N30', 'N34', 'N39'] },
];

export const publishedArticleNodes = articleKnowledgeGraphNodes.filter((node) => node.status === 'published');
export const plannedArticleNodes = articleKnowledgeGraphNodes.filter((node) => node.status === 'planned');
export const getNodesByIds = (ids: string[]) => ids.map((id) => articleKnowledgeGraphNodes.find((node) => node.id === id)).filter(Boolean) as KnowledgeGraphNode[];
