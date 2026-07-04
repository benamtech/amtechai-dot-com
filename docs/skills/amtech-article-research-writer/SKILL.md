---
name: amtech-article-research-writer
description: Research, plan, and draft AMTECH-standard articles from topics, pasted notes, source links, repo docs, current AI news, or rough positioning. Use when Codex needs an internal AMTECH article intelligence system that selects graph nodes before titles, synthesizes novel information-gain theses from many sources, builds claim ledgers, plans SEO/GEO/OKF/social/image surfaces, and stops before live publishing.
---

# AMTECH Article Research Writer

Use this internal AMTECH article intelligence system to create graph-first, source-heavy article briefs and research packets. It is not the public signed AMTECH skill registry package, and it is not a live `/articles` publisher unless the user explicitly asks to publish.

## Core Rule

Write for information gain. The article must make a useful distinction, solve a real problem, connect entities, and leave the reader with an action they can take. Do not produce generic AI/SEO content, clickbait, or topic summaries that could be written from one search result.

## Required Local Context

Read these before drafting:

1. `docs/seo/ARTICLE_RESEARCH_WRITER_SYSTEM.md`
2. `docs/seo/ARTICLE_RESEARCH_DOCTRINE.md`
3. `docs/seo/ARTICLE_GRAPH_NODES.md`
4. `docs/seo/ARTICLE_SURFACE_PACK_SPEC.md`
5. `docs/ARTICLE_SYSTEM.md`
6. `docs/skills/amtech-article-publisher/SKILL.md` only when the user asks to publish approved copy.

AMTECH business truth comes from the local GTM/wiki materials summarized in those docs. Do not use the live AMTECH site as business evidence. The live site is only implementation context.

If the topic is current, technical, academic, legal, financial, or platform-specific, browse and cite primary/current sources. Current-event claims need a research ledger before drafting.

## Workflow

1. **Select the graph node before title.** Choose or propose a node from `docs/seo/article-graph-nodes.json`; define primary entity, cluster, audience, search intent, freshness, source requirements, surface requirements, internal edges, and publish priority.
2. **Simulate query fan-out.** Generate direct, definitional, practical, comparison, risk, image/video, and local/industry fan-outs. Decide which belong in the article and which should become adjacent nodes.
3. **Build the research ledger.** Capture official sources, primary reporting, research papers, operator voice, vendor context, social/forum language, trust tier, claim IDs, evidence span summaries, and caveats. Vendor pages cannot prove demand unless they contain primary data.
4. **Find the novel synthesis.** State the information-gain thesis before drafting. Good theses connect sources into a mechanism AMTECH understands: business brain, approval gate, connector, skill traversal, graph materialization, evidence ecosystem, or owner workflow.
5. **Draft from claims, not vibes.** Write the direct answer, mechanism, actionable framework, failure modes, where an AI Employee fits if natural, internal graph links, FAQ, and citations. Block the draft if the title promises more than the sources prove.
6. **Create the surface pack.** Produce SEO metadata, schema plan, internal links, OKF projection, image and Pinterest briefs, social/forum snippets, and future tool node.
7. **Run the citation audit.** Block publication when claims are unsupported, citations are only topically related, recency is stale, schema is invisible, or the AMTECH bridge claims capabilities not supported by the wiki/product docs.
8. **Stop before live publish.** Do not edit `src/lib/knowledge/articles/*`, `src/App.tsx`, `src/lib/articleKnowledgeGraph.ts`, or generated OKF outputs unless the user explicitly asks to publish.

## Output Location

Write drafts to:

```text
docs/article-drafts/<slug>.md
```

Use lowercase hyphenated slugs. Include draft status at the top.

## Output Bundle

Return a structured bundle:

- `article_brief`
- `research_ledger`
- `entity_graph`
- `fanout_map`
- `information_gain_thesis`
- `draft_article`
- `citation_audit`
- `schema_plan`
- `internal_link_plan`
- `okf_projection`
- `image_and_pin_pack`
- `social_snippet_pack`
- `future_tool_node`
- `publish_checklist`
- `blocked`
- `block_reasons`

## Synthesis Standards

Use the ladder:

- **Beginner explainer:** simple vocabulary, strong analogy, immediate action.
- **Tactical article:** copyable prompts, checklists, examples, concrete payoff.
- **Advanced/LinkedIn-style article:** deeper thesis, sharper market framing, still plain and useful.
- **Flagship standard article:** original synthesis across AMTECH implementation, research, graph theory, search behavior, and agent workflows.

For multi-article plans, map each article to a different awareness level. Do not cram every insight into the first piece.

## AMTECH Tone

Keep the charm simple: direct, practical, confident, specific. Use short sentences when explaining new concepts. Avoid academic fog, hype, and vendor-speak. Make the advanced idea feel usable.

## Reference Files

- `references/research-workflow.md`: deeper procedure for source gathering, synthesis, audience laddering, and graph placement.
- `references/draft-template.md`: markdown skeleton for draft articles.
- `docs/seo/ARTICLE_RESEARCH_WRITER_SYSTEM.md`: internal operating system and blockers.
- `docs/seo/ARTICLE_RESEARCH_DOCTRINE.md`: esoteric SEO/GEO research doctrine.
- `docs/seo/ARTICLE_GRAPH_NODES.md`: graph schema and 100-node backlog map.
- `docs/seo/ARTICLE_SURFACE_PACK_SPEC.md`: required surface pack contract.
