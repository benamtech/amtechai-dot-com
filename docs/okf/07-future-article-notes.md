# Future OKF / Knowledge Publishing Articles

Purpose: preserve the current editorial strategy for AMTECH's next OKF and agentic-search articles. These notes are not final copy; they are the positioning and outlines future agents should reuse.

## The Gap In Current OKF Coverage

Most early OKF coverage frames the standard as a vendor-neutral markdown wiki for agent context:

- One concept per markdown file.
- YAML frontmatter with only `type` required.
- Git-friendly, SDK-free, and readable by any agent.
- A packaging layer for context that avoids bespoke RAG/context assembly.

That is useful, but it is the lowest layer. AMTECH's implementation is materially ahead of a plain wiki because OKF is only one emitted surface from a richer graph system.

The AMTECH angle:

> OKF is the portable projection. The source of advantage is the validated entity graph that can generate OKF, queryable DB rows, prerendered HTML, JSON-LD, sitemap, robots, llms.txt, and human UX from one canonical model.

## Article Ladder

Publish these as a ladder so beginners get the vocabulary before the flagship standard piece.

### 1. What Is A Knowledge Graph? The Simple Version For Business Owners

Goal: explain the underlying concept before mentioning OKF heavily.

Hook: A normal website is a stack of pages. A knowledge graph is a map of the things your business knows and how they connect.

Immediate payoff: the reader can sketch their first knowledge graph in 15 minutes.

Outline:

1. Pages vs. things.
2. What counts as a thing: services, locations, industries, problems, tools, outcomes.
3. What counts as a relationship: solves, depends on, serves, uses, leads to.
4. Why Google and AI tools care about entities, not only keywords.
5. Mini example: AMTECH, AI Employees, Business Brain, local contractors, missed operational work, owner briefing.
6. Prompt to turn a business into a simple graph.

Reusable prompt:

```text
Act as an entity SEO strategist. Build a simple knowledge graph for my business.

Business:
[describe business]

Return:
1. 10 core entities
2. The type of each entity
3. 20 relationships between them
4. 5 article ideas that would strengthen the graph
5. 5 missing concepts I need to define before AI search can understand us
```

### 2. What Is OKF? Google's New Format For AI-Readable Knowledge

Goal: explain OKF plainly while keeping the AMTECH distinction visible.

Hook: OKF is like a folder of markdown pages that agents can read without scraping your whole website or relying on a proprietary platform.

Immediate payoff: the reader can create a first OKF-style concept file.

Outline:

1. The problem: agents need context, but websites and docs are messy.
2. OKF in plain English: one markdown file per concept.
3. The only required field: `type`.
4. What a concept file looks like.
5. Why links matter: markdown links become graph edges.
6. What OKF does not solve: quality, strategy, entity modeling, validation, canonical source, search surfaces.
7. How AMTECH uses OKF as one output of a bigger system.

Example:

```md
---
type: Service
title: AI Employee
description: A managed AI system that handles operational work for a business.
tags: [ai, operations, automation]
---

# AI Employee

An AI Employee is not just a chatbot. It is a connected operating assistant that can read business context, follow workflows, and report back to a human supervisor.

## Related concepts

- [Business Brain](/concepts/business-brain.md) because every AI Employee needs durable company context.
- [Owner Briefing](/concepts/owner-briefing.md) because the agent should turn work into decisions.
```

### 3. OKF Is Not Enough: The New Standard For Agentic Knowledge Publishing

Goal: flagship thought-leadership article. This is the highest-value piece.

Hook: Google's OKF makes knowledge portable for agents, but portability is only the first layer. The next advantage is building a source graph that can generate every discovery surface: human pages, AI-readable markdown, JSON-LD, database rows, sitemaps, and validation reports.

Immediate payoff: the reader leaves with the AMTECH Knowledge Publishing Standard checklist.

Core thesis:

> OKF should be a subset of a more comprehensive knowledge publishing standard. OKF answers "Can an agent read this bundle?" The AMTECH standard asks "Can the same source of truth produce every surface that humans, crawlers, agents, databases, and AI search systems need?"

Outline:

1. What OKF gets right: markdown, YAML, `type`, git, portability, no SDK.
2. Why a markdown wiki is not a knowledge system.
3. The missing layer: a canonical entity graph.
4. The AMTECH standard:
   - Concepts.
   - First-class entities.
   - Edges with reasons.
   - Citations.
   - Derived backlinks.
   - Controlled concept vocabulary.
   - No orphan nodes.
   - Generated surfaces.
   - Freshness tests.
5. Why this matters for AI Overviews, agentic search, and non-ad citations.
6. The practical standard readers can copy.

Action box:

```text
A real agentic knowledge publishing system should have:
- One source of truth
- Named concepts
- First-class entities
- Explicit relationships
- Citations
- Generated human pages
- Generated machine-readable files
- Generated structured data
- A queryable graph surface
- Validation before publish
```

## Two Supporting Advanced Articles

### How To Build A Materialized Knowledge Surface For AI Search

Angle: the implementation article. Explain one graph, many surfaces.

Use AMTECH's build as the model:

- Source: `src/lib/knowledge/` today; Supabase projection now; DB authoring later.
- Surfaces: OKF markdown, static HTML, JSON-LD, sitemap, `robots.txt`, `llms.txt`.
- Database: `concepts`, `concept_edges`, `concept_citations`.
- Validator: freshness, no orphan nodes, controlled types, discovery files.

Key line: the website is no longer the whole website. The real asset is the graph that can become whatever each consumer needs.

### The Orphan Node Test

Angle: a practical validator article.

Use the Phase 1 story: AMTECH had a linking doctrine in prose, but the validator exposed disconnected playbook nodes. The fix was not hand-authoring 22 links. The fix was promoting entities into first-class concepts and deriving edges from `uc`, `city`, and `subtype`.

Key line: a knowledge format does not create knowledge; it makes missing relationships visible.

Checklist:

- Every concept has a description.
- Every concept has tags.
- Every published concept has a canonical URL.
- Every edge has a reason.
- Every non-root concept has at least one connection.
- Every generated surface is fresh.

## Source Notes

- AI Weekly OKF summary framed OKF as vendor-neutral agent context, useful but wiki-level: https://aiweekly.co/alerts/google-cloud-okf-v01-makes-ai-agent-context-vendor-neutral
- Google Cloud OKF launch blog: https://cloud.google.com/blog/products/data-analytics/how-the-open-knowledge-format-can-improve-data-sharing
- Google Search AI features and query fan-out: https://developers.google.com/search/docs/appearance/ai-features
- GEO paper: https://arxiv.org/abs/2311.09735
- Citation selection/absorption paper: https://arxiv.org/abs/2604.25707
- Structural GEO paper: https://arxiv.org/abs/2603.29979
- AMTECH implementation rationale: `docs/okf/01-okf-from-first-principles.md` through `docs/okf/06-phase-3-foundation.md`
