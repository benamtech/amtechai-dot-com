# AMTECH Article Knowledge Graph — Operational Edition

This replaces the prior article node set. It keeps AMTECH's article system focused on one thesis: **automate the operations brain, not the front desk.** The system now contains the seven existing published articles plus 40 planned operational nodes.

## Targeting principle

- **Automate cognitive operations work.** Articles should show AI reading sales data, planning purchasing, forecasting demand, reviewing transactions for margin, preparing quotes, planning jobs against parts, reconciling inventory, briefing owners, and coordinating suppliers.
- **Target businesses worth scaling.** The strongest fits are inventory-rich, repair-rich, transaction-rich businesses that can support a real AMTECH engagement: independent pharmacy, garden center, bike shop, pool supply-and-service, HVAC, building supply, equipment rental, vacation-rental management, marine service, solar, golf-cart/LSV, and trade contractors.
- **No lead-gen commodity drift.** Avoid missed-call, after-hours capture, dead-lead reactivation, and generic AI front desk angles unless explicitly tied to a larger operations system.
- **Location grounds viability.** Phoenix, Sherman, Myrtle Beach, and Salisbury appear when the local economy makes the operating workflow real; the body should remain technical and operational.

## Operational AI use cases

| UC | Capability | What the agent actually does |
| --- | --- | --- |
| UC1 | Business Brain | The operational knowledge backbone everything else runs on. |
| UC2 | Purchasing intelligence | Reads sales plus open repairs/orders and creates supplier reorder lists. |
| UC3 | Demand forecasting | Uses sales history and seasonality to plan stock or buying ahead. |
| UC4 | Transaction and margin analysis | Reviews every sale/job for margin leaks, pricing gaps, and SKU/job outliers. |
| UC5 | Job/repair pipeline planning | Turns next week's work into required parts, labor hours, and prep. |
| UC6 | Quoting and takeoff | Turns specs, designs, plans, and live parts pricing into quote/material lists. |
| UC7 | Supplier/vendor management | Tracks pricing, lead times, reorder timing, and vendor performance. |
| UC8 | Financial ops and owner briefing | Categorizes, reconciles, and produces weekly owner action reports. |
| UC9 | Service-history intelligence | Knows each client's equipment, service history, and what's due. |
| UC10 | Full AI operations employee | A connected Hermes-style back office across several of the above. |

## Existing published articles incorporated into the graph

| ID | Title | Role in graph | Connected nodes |
| --- | --- | --- | --- |
| E1 | How to Build a Business Brain for Free Before You Hire an AI Consultant | Published Business Brain anchor | N1, N4, N27 |
| E2 | Use ChatGPT or Claude to Build a Local SEO Plan That Out-Ranks Bigger Competitors | Published entity/knowledge-graph SEO anchor | N1, N5, N6, N7 |
| E3 | Build a Claude Skill That Helps You Price Jobs Like a Pro | Published quote/margin skill anchor | N3, N21, N22, N38, N40 |
| E4 | AMTECH vs. ChatGPT or Claude: What’s the Difference? | Published AI employee buying-decision anchor | N1, N10, N28, N29, N32 |
| E5 | Create an Estimate With ChatGPT | Published entry-level estimating prompt | N21, N38 |
| E6 | Write a Pressure Washing Estimate With AI | Published vertical estimating prompt | E5, N38, N40 |
| E7 | Estimate Painting Cost With AI | Published vertical estimating prompt | E5, N22, N38 |

## The 40 operational nodes

### T1 — General topic

| ID | Title | UC | Mechanism |
| --- | --- | --- | --- |
| N1 | AI learned to trade stocks before it could flip a burger: automate the operations brain, not the front desk | overview | Thesis and worked examples across inventory, finance, purchasing, forecasting, and planning. |
| N2 | Turn last week's sales into next week's order: purchasing intelligence for any inventory-and-repair business | UC2 | Reads POS and open tickets to produce a supplier reorder list. |
| N3 | Find the margin leaks: reviewing every transaction your business makes with AI | UC4 | Parses sales/jobs to flag low-margin SKUs, pricing gaps, and job-cost outliers. |
| N4 | The Monday-morning briefing: making your Business Brain tell you what to do this week | UC1/UC8 | Reads operational and finance data to produce ranked weekly actions. |

### T2 — General topic to location

| ID | Title | City | UC | Mechanism |
| --- | --- | --- | --- | --- |
| N5 | The $2M bike shop hiding in a town like Salisbury: what AI takes off the owner's plate first | Salisbury | overview | Parts ordering, repair planning, and transaction review. |
| N6 | Phoenix runs on pools and panels: the operational AI a Valley service business actually needs | Phoenix | UC2/UC5 | Inventory and route/install planning from job data. |
| N7 | Building Sherman: the back-office AI a supply yard needs as the subdivisions land | Sherman | UC2/UC3 | Contractor-demand signals become reorder and stock-ahead plans. |

### T3 — Deep AMTECH technical proof

| ID | Title | City | Subtype | UC | Mechanism |
| --- | --- | --- | --- | --- | --- |
| N8 | A full operational Business Brain for a Salisbury independent pharmacy | Salisbury | pharmacy | UC1/UC2/UC9 | POS, wholesaler ordering, refill data, reconciliation, and reorder. |
| N9 | Running a Grand Strand vacation-rental management company on one AI back office | Myrtle Beach | vacation-rental management | UC4/UC8/UC10 | Per-property P&L, maintenance pipeline, and vendor dispatch. |
| N10 | The connected shop floor: wiring a Phoenix HVAC company's POS, parts supplier, and scheduling into one agent | Phoenix | HVAC | UC2/UC5/UC10 | Install pipeline, procurement, and dispatch stay linked. |
| N11 | Equipment rental in a boomtown: tracking fleet utilization and maintenance for a Sherman yard with AI | Sherman | equipment rental | UC9/UC8 | Reservations and hour-meter data drive utilization and service scheduling. |

### T4 — Regional force

| ID | Title | City | Subtype | UC | Mechanism |
| --- | --- | --- | --- | --- | --- |
| N12 | What 3,000 new fab jobs mean for a Sherman building-supply yard — and the AI reorder system to meet it | Sherman | building supply | UC2/UC3 | Demand surge modeled into stock-ahead and reorder cadence. |
| N13 | Phoenix is a chip-and-AI hub now: how a local pool or HVAC company puts the same AI on its own data | Phoenix | pool/HVAC | UC4/UC2 | Transaction analysis and inventory on the shop's own books. |
| N14 | Retiree money on the Grand Strand: why a golf-cart sales-and-service shop is a prime AI operations candidate | Myrtle Beach | golf-cart/LSV | UC2/UC9 | Parts inventory and service history drive reorder and due-for-service lists. |

### T5 — Location + subtype how-to

| ID | Title | City | Subtype | UC | Mechanism |
| --- | --- | --- | --- | --- | --- |
| N15 | How a Phoenix bike shop turns POS sales and repair tickets into next week's parts order with AI | Phoenix | bike shop | UC2 | Sales plus open repairs become a consolidated supplier order. |
| N16 | Quoting solar from the design, not the guess: how a Phoenix installer builds proposals with AI | Phoenix | solar | UC6 | Roof/design plus panel pricing create accurate proposals. |
| N17 | Every pool on the route, every chemical it needs: AI inventory and run-planning for a Phoenix pool-service company | Phoenix | pool service | UC2/UC5 | Route plus readings become chemical and part loadouts. |
| N18 | Spring ordering for a Salisbury garden center: forecasting what to buy from three seasons of sales data | Salisbury | garden center | UC3 | Seasonal sales history creates a perishable buy plan. |
| N19 | Next week's repairs, every part pre-ordered: AI work-planning for a Chesapeake marine service shop | Salisbury | marine service | UC5/UC2 | Service calendar produces parts-needed and pre-order lists. |
| N20 | How a Salisbury independent pharmacy reconciles inventory against refills and flags what to reorder | Salisbury | pharmacy | UC2/UC9 | Dispense and refill data reconcile against on-hand inventory. |
| N21 | Contractor accounts and material takeoffs: how a Sherman building-supply yard quotes and reorders with AI | Sherman | building supply | UC6/UC2 | Plans/takeoffs become quotes and restock triggers. |
| N22 | Find the margin leaks in a Sherman flooring contractor's jobs: AI review of every job's materials and labor | Sherman | flooring contractor | UC4 | Job costing across all jobs exposes margin outliers. |
| N23 | Owner ledgers and turnover costs: how a Myrtle Beach vacation-rental manager reviews every property's P&L with AI | Myrtle Beach | vacation-rental management | UC4/UC8 | Property revenue/cost become owner-ready P&L. |

### T6 — AMTECH use case to location

| ID | Title | City | UC | Mechanism |
| --- | --- | --- | --- | --- |
| N24 | Purchasing intelligence for a Phoenix service business: from sales data to supplier order, weekly | Phoenix | UC2 | Weekly sales data becomes a scheduled vendor order. |
| N25 | The weekly owner briefing for a Sherman trade business: what your numbers say to do next | Sherman | UC8 | Finance and pipeline data produce ranked weekly actions. |
| N26 | Demand forecasting for a Grand Strand seasonal business: stock and staff for the swing, not the average | Myrtle Beach | UC3 | Seasonality model produces stock and staffing plans. |
| N27 | A Business Brain for a Salisbury business worth scaling: capture the operations before a second location | Salisbury | UC1 | Operational interview becomes a connected operations knowledge base. |

### T7 — Full operations back office

| ID | Title | City | Subtype | UC | Mechanism |
| --- | --- | --- | --- | --- | --- |
| N28 | An AI operations employee for a Phoenix pool supply-and-service company: inventory, routes, reorder | Phoenix | pool supply+service | UC10 | Inventory, routes, and reorder loops run in one agent. |
| N29 | The connected back office for a Sherman equipment-rental yard: reservations, fleet maintenance, utilization | Sherman | equipment rental | UC10 | Bookings, maintenance, and utilization reporting connect. |
| N30 | An AI operations brain for a Salisbury garden center: perishable inventory, seasonal forecasting, supplier orders | Salisbury | garden center | UC3/UC10 | Shrink-aware inventory, forecasts, and ordering connect. |
| N31 | Run a Grand Strand marine dealership's parts, service, and winterization schedule from one AI agent | Myrtle Beach | marine dealer | UC5/UC9/UC10 | Parts, service history, and seasonal scheduling connect. |
| N32 | An AI back office for a Phoenix HVAC company: install pipeline, parts procurement, maintenance contracts | Phoenix | HVAC | UC10 | Pipeline, procurement, and contract renewals connect. |
| N33 | Inventory and contractor-account intelligence for a Sherman building-supply yard, run by AI | Sherman | building supply | UC2/UC10 | Account-level demand becomes stock and reorder intelligence. |
| N34 | A pharmacy operations agent for a Salisbury independent: ordering, reconciliation, refill reminders | Salisbury | pharmacy | UC2/UC9/UC10 | Wholesaler ordering, reconciliation, and refill prompts connect. |

### T8 — General subtype playbooks

| ID | Title | Subtype | UC | Mechanism |
| --- | --- | --- | --- | --- |
| N35 | How a bike shop anywhere turns sales and repair history into automated parts ordering with AI | bike shop | UC2 | POS and repair data become supplier orders. |
| N36 | The operational AI back office for a pool supply-and-service company: inventory, routes, reorder | pool supply+service | UC10 | Inventory, routes, and reorder loops in one operating system. |
| N37 | How a garden center uses AI to forecast perishable inventory and time supplier orders | garden center | UC3/UC2 | Seasonality and shrink create a buy plan. |
| N38 | Quoting and material takeoff for a building-supply yard or trade contractor, run by one AI agent | building supply/trades | UC6 | Plans become quotes and material lists. |
| N39 | How an independent pharmacy uses AI for inventory reconciliation and reorder | pharmacy | UC2/UC9 | Dispense data reconciles against on-hand inventory. |
| N40 | Margin analysis for any inventory-and-service business: what every transaction is telling you | all | UC4 | Full transaction review produces a margin map. |

## Human navigation groups

The live `/articles/all` page organizes the graph into easier shelves:

1. Start here: operations brain.
2. Purchasing, inventory, and forecasting.
3. Quoting, takeoff, and margin control.
4. Phoenix operations playbooks.
5. Sherman growth playbooks.
6. Myrtle Beach and Grand Strand operators.
7. Salisbury and Chesapeake operators.

The main `/articles` page includes a condensed “Browse by topic” section that links into `/articles/all`.

## Internal linking rule

Every new article should link three ways when possible:

1. Up to its general workflow anchor, such as purchasing intelligence or margin analysis.
2. Sideways to its city/regional force node when location is important.
3. Down or sideways to its subtype playbook or full operations back-office proof piece.

Published prompt/skill articles should be treated as entry points into the deeper operations graph rather than isolated prompt content.
