# Article Graph Nodes

This is the human guide to the internal article graph. The machine-readable backlog lives in `docs/seo/article-graph-nodes.json` and is validated by `npm run article-system:validate`.

## Node Schema

```yaml
node_id: short-kebab-case
primary_entity: string
cluster: ai_agents_for_small_business | contractor_ai | business_setup_with_ai | current_ai_news_for_smbs | agentic_seo_geo | tool_workflow_howtos
audience: string
question: string
search_intent: informational | operational | news-explainer | comparison | setup | troubleshooting
freshness_requirement: evergreen | current | breaking
traffic_thesis: string
information_gain_thesis: string
amtech_bridge: string
fanout_queries:
  - string
internal_edges:
  - target: string
    relationship: string
source_requirements:
  - official
  - primary_reporting
  - research
  - operator_voice
  - vendor
  - social
surface_requirements:
  - article
  - schema
  - okf
  - image_pack
  - pinterest_pin
  - social_snippets
  - future_tool_node
publish_priority: 1-5
```

## Clusters

- `ai_agents_for_small_business`: Own the practical AI Employee category before buyers know the term.
- `contractor_ai`: Capture AMTECH's strongest wedge: estimating, job context, follow-up, materials, deposits, and approval gates.
- `business_setup_with_ai`: Reach owners at formation moments: email, Stripe, website, bookkeeping, CRM, offer, and operating context.
- `current_ai_news_for_smbs`: Translate fast-moving AI news into durable SMB operating principles.
- `agentic_seo_geo`: Build authority around AMTECH's own graph/materialized-surface publishing strategy.
- `tool_workflow_howtos`: Answer exact operational questions from people ready to act.

## Initial Backlog Shape

The initial backlog contains exactly 100 nodes:

- 18 AI agents for small business nodes.
- 22 contractor AI nodes.
- 15 business setup with AI nodes.
- 15 current AI news for SMBs nodes.
- 15 agentic SEO/GEO nodes.
- 15 tool/workflow how-to nodes.

This is intentionally aggressive. The graph is allowed to extend beyond the current contractor beachhead because the editorial goal is topical authority, traffic, and future agent-readable surface area. Publishing priority controls sequencing; it does not delete useful future territory.

## Title Rule

Titles are outputs, not inputs. A title can be drafted only after the node, source plan, fan-out, information-gain thesis, and surface pack are defined.
