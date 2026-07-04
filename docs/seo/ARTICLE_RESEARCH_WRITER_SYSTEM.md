# AMTECH Article Research Writer System

Status: active. This is the internal operating system for AMTECH article research. It is not the public signed skill registry and not the live article publisher.

## Prime Directive

Pick the graph node first, prove the current claim, synthesize the useful mechanism, then materialize every surface that helps a human, crawler, AI system, or future AMTECH agent traverse the same knowledge.

The operating order is graph node before title: the title is an output of entity strategy, not the source of the strategy.

The live AMTECH site is not business evidence. Business truth comes from the local GTM/wiki material: `GTM-RESEARCH/wiki/00-decision.md`, `segments/contractors.md`, `segments/bookkeeping.md`, `offers/wedge-offers.md`, `offers/skill-catalog.md`, `principle-graph-materialization.md`, `principle-deliverable-driven-surfaces.md`, and `product-agent-platform-architecture.md`. The live site may be inspected only as an implementation surface.

## What This System Optimizes

- Traffic, but not junk. Every article must answer a specific valuable question.
- Novel synthesis, not summaries. The article must connect sources into a mechanism competitors skip.
- AMTECH relevance, not sales copy. The bridge explains how an AI Employee, business brain, connector, approval gate, skill traversal, or graph materialized view operationalizes the idea only when natural.
- Evidence ecosystem design. One article should strengthen adjacent nodes, OKF/concept projections, schema, images, social/forum answers, and future tools.
- Volume through a graph backlog. Titles come after entity, intent, source plan, fan-out, and internal edges.

## Production Workflow

1. **Select or create a graph node.** Use `docs/seo/article-graph-nodes.json` as the backlog. If a new node is needed, fill every field in the node schema before title ideation.
2. **Simulate query fan-out.** Generate direct, definitional, practical, comparison, risk/compliance, image/video, and local/industry fan-outs. Keep the article focused; route other fan-outs into adjacent nodes.
3. **Build the research ledger.** Capture sources before drafting. Current-event articles need fresh sources and precise attribution. Source conflicts are part of the article, not cleanup noise.
4. **State the information-gain thesis.** The article cannot proceed until it can say: "This article adds information gain because ..."
5. **Draft from the ledger.** Use claim IDs and evidence summaries to build the direct answer, mechanism, framework, failure modes, AMTECH bridge, graph links, FAQ, and citations.
6. **Create the surface pack.** Follow `ARTICLE_SURFACE_PACK_SPEC.md`; every major article gets SEO, schema, OKF projection, image/Pinterest briefs, social snippets, and future tool assessment.
7. **Run blockers.** Block publication if any publication blocker fires.

## Research Ledger Contract

```yaml
sources:
  - source_id: S1
    url: string
    title: string
    publisher: string
    published_or_updated: YYYY-MM-DD
    accessed: YYYY-MM-DD
    source_type: official | primary_reporting | research_paper | operator_voice | job_posting | commentary | vendor | social
    trust_tier: high | medium | low
    claims:
      - claim_id: C1
        claim: string
        evidence_span_summary: string
        use_in_article: true
        caveat: string
```

Rules:

- Vendor pages can support product/category context, not market pain unless they provide primary data.
- Social/forum evidence can support language and discovery patterns, but must be labeled and not overgeneralized.
- Current-event numbers must be attributed to the publisher that reported them.
- If sources conflict, state the conflict rather than smoothing it out.
- A citation must support the exact claim it is attached to, not merely discuss the same topic.

## Article Archetypes

| Archetype | Use when | Output shape |
| --- | --- | --- |
| News-to-operator explainer | A current AI event needs mechanism and SMB implication. | What happened, why it matters, mechanism, SMB implication, what to do now, citations. |
| Exact workflow how-to | Searcher wants to do a job with AI. | Direct answer, steps, checklist, prompt/template, failure modes, AI Employee threshold. |
| Category definition | A term is important and under-explained. | Definition, examples, non-examples, graph edges, SMB relevance, citations. |
| Operational comparison | Buyer compares DIY AI, software, human assistant, and AMTECH-style employee. | Decision table, costs, trust/risk, workflow fit, recommendation by scenario. |
| Business setup playbook | User is forming or reorganizing a business. | Ordered setup path, account/tool explanation, approvals, risks, automation points. |
| Agentic SEO field note | AMTECH observes or uses a publishing tactic. | Claim, evidence, method, limitations, tactical checklist, graph implication. |
| Tool/calculator seed | Article implies an interactive asset. | Explanation plus future tool spec and data inputs. |

## Publication Blockers

Block the brief or mark `blocked: true` when:

- The information-gain thesis is generic or missing.
- A factual claim has no supporting source.
- A current-event claim uses stale sources.
- A title or question promises a claim the ledger does not prove.
- Schema describes content that is not visible in the draft.
- The AMTECH bridge claims product capabilities not supported by the wiki/product docs.
- The draft treats the live AMTECH site as business evidence.
- The article is a "top tips", "ultimate guide", vague trend, or curiosity-hook piece with no mechanism.

## AMTECH Lens

Use AMTECH as a mechanism for synthesis, not as a forced CTA. The strongest bridges are:

- **Business brain:** the business-owned context layer that makes AI useful.
- **Approval gate:** the trust boundary for money, customer messages, and external actions.
- **Skill traversal:** a repeatable path through the graph that writes a useful node.
- **Connector:** Gmail, Stripe, calendar, files, and similar systems that give the agent operating context and action rights.
- **Materialized surface:** a human, AI, schema, OKF, image, social, or tool projection of the same knowledge.

## Handoff To Publishing

This system stops at a reviewed article bundle. Publishing approved copy uses `docs/skills/amtech-article-publisher/SKILL.md`, which owns live article files, routes, article graph updates, OKF generation, and build verification.
