# Entities

Places, industries, services, methods, tools, outcomes, and problems that ground the operational knowledge graph.

* [Agent-readable knowledge](/entities/concept-agent-readable-knowledge.md) - The end state where an agent that fetches a URL gets enough structure, metadata, entities, and citations to use the content as trusted context without scraping or guessing.
* [AI Overviews](/entities/concept-ai-overviews.md) - Google's generative search surface that may use query fan-out across related subtopics, rewarding clear entity relationships and cited claims.
* [JSON-LD](/entities/concept-json-ld.md) - The JSON syntax for embedding schema.org structured data in a page so its meaning is explicit in the first-fetch surface.
* [Knowledge graph](/entities/concept-knowledge-graph.md) - Named entities connected by typed relationships, so agents and search systems build context by traversing links between things rather than re-reading prose.
* [llms.txt](/entities/concept-llms-txt.md) - A discovery file that gives AI tools a direct orientation to a site’s most important content, complementing sitemap.xml and robots.txt.
* [Materialized views](/entities/concept-materialized-views.md) - One source of truth projected into many consumer surfaces — HTML, prerendered static pages, JSON-LD, markdown bundle, sitemap — so every reader gets a fit-for-purpose representation.
* [Open Knowledge Format](/entities/concept-open-knowledge-format.md) - Google's lightweight format for AI-readable knowledge: a directory of markdown concept files with YAML frontmatter whose links form a portable knowledge graph.
* [OKF content audit](/entities/concept-okf-content-audit.md) - A six-dimension scoring method (0–30) for how readable a page or bundle is to AI agents: first-fetch clarity, concept packaging, entity coverage, citations, materialized views, and execution readiness.
* [AMTECH Knowledge Publishing Standard](/entities/concept-amtech-knowledge-publishing-standard.md) - The AMTECH discipline of authoring knowledge once and projecting it into every surface humans, crawlers, agents, and databases need, with validation before publish.
* [Structured data](/entities/concept-structured-data.md) - Machine-readable clues about page meaning (author, date, type, FAQ, breadcrumbs) that agents and search systems use when prose alone is ambiguous.
* [Bike shop](/entities/industry-bike-shop.md) - Retail sales plus a repair pipeline that drives parts ordering.
* [Building supply and trades](/entities/industry-building-supply.md) - Contractor accounts, material takeoffs, and demand-driven reorder cadence.
* [Equipment rental](/entities/industry-equipment-rental.md) - Reservations and hour-meter data drive utilization reporting and service scheduling.
* [Flooring contractor](/entities/industry-flooring.md) - Job costing across materials and labor exposes margin outliers.
* [Garden center](/entities/industry-garden-center.md) - Perishable, seasonal inventory with high shrink risk and sharp demand swings.
* [Golf-cart and LSV sales-and-service](/entities/industry-golf-cart.md) - Parts inventory and service history drive reorder and due-for-service lists.
* [HVAC](/entities/industry-hvac.md) - Install pipeline, parts procurement, and maintenance-contract renewals.
* [Marine service and dealers](/entities/industry-marine.md) - Parts, service history, and seasonal winterization scheduling.
* [Independent pharmacy](/entities/industry-pharmacy.md) - Wholesaler ordering, refill data, and inventory reconciliation make pharmacies a prime operations-AI candidate.
* [Pool supply and service](/entities/industry-pool.md) - Route-based chemical and parts inventory with recurring service visits.
* [Solar](/entities/industry-solar.md) - Proposals built from roof design and live panel pricing rather than guesswork.
* [Vacation-rental management](/entities/industry-vacation-rental.md) - Per-property P&L, maintenance pipeline, and vendor dispatch across a portfolio.
* [Myrtle Beach](/entities/place-myrtle-beach.md) - Grand Strand coastal South Carolina market: seasonal, retiree, vacation-rental, and marine businesses.
* [Phoenix](/entities/place-phoenix.md) - Arizona Valley market and chip-and-AI hub; pools, HVAC, solar, and outdoor retail dominate the service economy.
* [Salisbury](/entities/place-salisbury.md) - Independent-retail and service market (including the Chesapeake area): pharmacy, garden center, bike, and marine operators.
* [Sherman](/entities/place-sherman.md) - North Texas growth market where semiconductor-fab investment is driving building supply, contractors, and equipment rental.
* [Owner bottleneck](/entities/problem-owner-bottleneck.md) - The constraint where a business cannot scale because key decisions, knowledge, and approvals all route through the owner; the problem AI Employees and a Business Brain are built to relieve.
* [AI Employee](/entities/service-ai-employee.md) - A managed, connected operating assistant that reads business context, follows workflows, and reports to a human supervisor — not a one-off chatbot.
* [Business Brain](/entities/service-business-brain.md) - The durable operating-context layer — records, rules, examples, and approval boundaries — a business documents before agents or automation can use its knowledge reliably.
* [OKF Audit Skill](/entities/tool-okf-audit-skill.md) - The consumable AMTECH skill that runs the OKF content audit from a single URL in any agent, returning a score, priority fixes, and a remediation prompt.
