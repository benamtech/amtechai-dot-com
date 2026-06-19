# What Is OKF? Google's New Format For AI-Readable Knowledge

> OKF is a simple way to package knowledge so AI agents can read it. Here is how markdown concept files become a graph, why AMTECH treats OKF as one output of a larger publishing system, and how to score your own content with the free OKF Audit Skill.

## Knowledge map

- **Type:** Article
- **Canonical page:** https://amtechai.com/articles/what-is-okf-ai-readable-knowledge
- **Format:** Agent-optimized Markdown twin of the HTML article (clean, no page chrome).
- **Topics:** Local authority, Agentic SEO, Open Knowledge Format, knowledge graph, agent-readable knowledge, AI search, AI Overviews, structured data, JSON-LD, llms.txt, Business Brain, AMTECH Knowledge Publishing Standard, OKF audit, OKF Audit Skill, strategy
- **See also:**
  - [How to Build a Business Brain for Free Before You Hire an AI Consultant](https://amtechai.com/articles/business-brain-free) — Published business-brain anchor
  - [Use ChatGPT or Claude to Build a Local SEO Plan That Out-Ranks Bigger Competitors](https://amtechai.com/articles/build-local-seo-plan-with-chatgpt) — Published SEO systems anchor
  - [AMTECH vs. ChatGPT or Claude: What’s the Difference?](https://amtechai.com/articles/amtech-vs-chatgpt-claude) — Published buying-decision anchor
  - [What AI Agents See When They Read Your Website](https://amtechai.com/articles/what-ai-agents-see-when-they-read-your-website) — Published OKF audit walkthrough and content infrastructure explainer
  - [AI learned to trade stocks before it could flip a burger: automate the operations brain, not the front desk](https://amtechai.com/okf/playbooks/ai-learned-to-trade-stocks-before-it-could-flip-a-burger-automate-the-operations-brain-not-the-front-desk.md) — General operational authority

## Article

## Answer

OKF, short for Open Knowledge Format, is a way to package knowledge so AI agents can read it directly. In plain English, OKF is a folder of markdown files where each file describes one concept, and the links between files form a simple knowledge graph.

## Agents need context, but websites are messy

The new bottleneck in AI is not always the model. Often, it is the context. Google Cloud introduced OKF on June 12, 2026, with the same practical premise: foundation models keep improving, but they still need the right information to produce accurate and useful results.

In most companies, that information is scattered across wikis, docs, drives, code comments, spreadsheets, databases, old proposals, chat threads, and a few experienced people's heads. Before an agent can help, it has to figure out what the important things are, which definitions are current, which sources are trusted, and how one concept relates to another.

Traditional retrieval can pull chunks of text at query time. That is useful, but it is not the same as giving an agent a clean map. A chunk is a piece of text. A concept is a named thing with context, links, citations, and purpose.

# Examples

### Example: a small OKF-style concept file

A person can read this file, an agent can parse it, and the links show how the idea connects to other ideas.

```text
---
type: Service
title: AI Employee
description: A managed AI system that handles operational work for a business.
tags: [ai, operations, automation]
---

# AI Employee

An AI Employee is not just a chatbot. It is a connected operating assistant that can read business context, follow workflows, and report back to a human supervisor.

## Related concepts

- Business Brain because every AI Employee needs durable company context.
- Owner Briefing because the agent should turn work into decisions.
```

## The simplest useful OKF mental model

| Website habit | OKF habit | Why it matters |
| --- | --- | --- |
| Page | Concept | Agents need to know the thing being explained, not only the page layout. |
| Navigation menu | index.md | Agents need a cheap map before loading a whole bundle. |
| Internal link | Graph edge | A link tells the agent that two concepts are related. |
| Blog category | Concept type or tag | Grouping becomes machine-readable. |
| Citation link | Trust edge | Claims become easier to inspect and verify. |
| Sitemap | Discovery surface | Crawlers and agents need stable entry points. |

## Why links matter more than they look

A normal internal link says, "Here is another page." An OKF link can say, "This concept depends on, explains, references, joins with, contrasts against, or extends that concept." The markdown link is simple. The surrounding sentence gives the relationship meaning.

That is close to how good editorial links should work anyway. A useful internal link should never be just "read more." It should tell the reader why the next page matters. Better link text also helps agents and search systems understand the relationship instead of guessing from two URLs.

This is where knowledge graph SEO and OKF overlap. Google's Search documentation says AI Overviews and AI Mode may use query fan-out across related subtopics and data sources. That makes clear entity relationships more valuable, not less.

## What OKF does well, and what it does not solve

| Layer | What OKF gives you | What you still need to decide |
| --- | --- | --- |
| Format | Plain markdown files with YAML frontmatter. | Which concepts deserve their own files. |
| Portability | A bundle that is not tied to one model, cloud, database, CMS, or agent platform. | Where the canonical source of truth lives. |
| Graph shape | Markdown links between concepts. | Whether those links encode meaningful relationship reasons. |
| Conformance | A small interoperability surface with `type` as the required field. | Stricter quality, freshness, and no-orphan validation. |
| Agent access | A clean bundle agents can navigate. | How public, private, and permissioned knowledge should be served. |
| Search support | A machine-readable knowledge surface. | Crawlable HTML, structured data, sitemap, robots.txt, and human UX. |

> **⚠️ Do not treat OKF as a dumping ground for markdown**
>
> If you export a messy wiki into OKF, you have a portable messy wiki. That is better than a trapped messy wiki, but it is not a knowledge advantage. The advantage comes from deciding what deserves to be a concept, how concepts relate, which claims need evidence, and which surfaces need to stay in sync.

## OKF should be one output, not the whole system

At AMTECH, we do not treat OKF as the source of truth. We treat it as one projection. The source is a richer knowledge model: concepts, entities, article bodies, citations, and edges. From that model, we generate multiple surfaces for different consumers.

That distinction matters. OKF answers, "Can an agent read this bundle?" A complete knowledge publishing system asks a harder question: "Can the same source of truth produce every surface humans, crawlers, agents, databases, and AI search systems need?"

One source and many surfaces prevents the usual failure mode where the blog says one thing, the structured data says another, the internal wiki is stale, and the AI assistant has to guess which version is real.

## The surfaces one source model can generate

| Surface | Who it serves |
| --- | --- |
| React article pages | Human readers. |
| Prerendered HTML | Crawlers, link previews, non-JS readers, and agents. |
| JSON-LD | Search systems that understand structured page data. |
| OKF markdown bundle | Agents and tools that want portable concept files. |
| Supabase concept tables | Queryable graph access and future product/API use. |
| sitemap.xml | Search discovery. |
| robots.txt | Crawl guidance. |
| llms.txt | Agent orientation. |

## AI Employee is stronger as a concept graph than as one landing page

Suppose you want AI systems to understand what AMTECH means by "AI Employee." A weak version is one landing page that says an AI Employee saves time. A stronger version is a concept graph: AI Employee, Business Brain, Owner Briefing, Supervisor, and agent-readable knowledge all defined and linked.

Now the idea is not floating alone. It has neighbors. It has definitions. It has a role. That is what a graph gives you: not just more pages, but more meaning between pages.

## The first OKF file you should create

- Pick one concept your company explains over and over: your core service, main framework, a customer problem, or a term you define differently than the market.
- Give it a clear `type`, title, one-sentence description, and useful tags.
- Explain why the concept matters and when to use it.
- Link it to related concepts with relationship reasons, not generic "read more" language.
- Add citations where the concept relies on external claims, platform behavior, or research.
- Add it to an index so an agent can navigate the bundle without loading everything first.

# Examples

### Prompt: plan your first OKF bundle

Use this with ChatGPT, Claude, Gemini, or your preferred writing agent to turn a site or business into an initial concept map.

```text
Act as an entity SEO strategist and OKF bundle architect.

Business or site:
[describe the company, product, or website]

Audience:
[describe who needs to understand this knowledge]

Goal:
Create the first 10 OKF-style concept files we should publish.

Return:
1. The 10 concepts, each with a type, title, description, and tags
2. The reason each concept deserves its own file
3. The 20 most important links between those concepts, with relationship reasons
4. The 5 concepts that need citations before publication
5. The first 3 article or page ideas that should be generated from this graph
6. A warning list of weak, duplicate, or vague concepts to avoid
```

## When to keep OKF simple and when to build a pipeline

You do not need a full graph pipeline on day one. Keep it simple if you have fewer than 20 important concepts, your content does not change often, and your immediate goal is to make your knowledge clearer for agents and collaborators. A hand-authored folder can be enough.

Build a larger system when you publish many articles, care about AI search visibility, need structured data and human pages to stay in sync, or want the same knowledge to power articles, internal tools, search, and automation. That is when OKF should stop being the whole thing and become one generated surface from a stronger source model.

## How to check whether your knowledge is actually agent-readable

Deciding what deserves to be a concept, how concepts relate, and which claims need citations is judgment work. But you do not have to guess whether the result reads well to an agent. AMTECH publishes a free consumable skill, the OKF Audit Skill, that scores any page, draft, sitemap, or OKF bundle against the same agent-readability rubric this article describes.

It is a skill in the literal sense: a portable instruction package an agent can fetch from one URL and run. There is nothing to install, no SDK, and no plugin. Point ChatGPT, Claude, Codex, Claude Code, Cursor, or an AMTECH agent at amtechai.com/skills/okf-audit, give it a URL, and it returns a score from 0 to 30 across six dimensions — first-fetch clarity, concept packaging, entity and relationship coverage, source and citation quality, materialized views, and agent execution readiness — plus the highest-priority fixes and a copy-paste remediation prompt.

This is the validation step that keeps OKF honest. A bundle can be valid markdown and still be a weak knowledge surface. Running the audit before you publish, and on your competitors after, turns "is this agent-readable?" from an opinion into a score you can act on.

## The future of content is useful knowledge projected into many surfaces

OKF is Google's lightweight format for AI-readable knowledge. It represents knowledge as markdown concept files with YAML frontmatter. The only required field is `type`. Links between files turn the bundle into a simple graph.

That makes OKF a powerful first step for teams that want agents to read curated knowledge without scraping a whole website or depending on a proprietary platform. But OKF is not the full strategy.

For serious publishing, OKF should be one output from a richer system: one source of truth, first-class entities, explicit relationships, citations, generated human pages, generated structured data, queryable graph tables, and validation before publish.

## FAQ

### Is OKF the same as a knowledge graph?

No. OKF is a lightweight file format that can express a simple knowledge graph through concept files and markdown links. A full knowledge graph may have richer typed entities, stricter edge rules, database storage, validation, and multiple generated surfaces.

### Does OKF replace SEO?

No. OKF does not replace crawlable pages, helpful content, internal links, structured data, or technical SEO. It gives agents another clean way to read your knowledge.

### Do I need a database to use OKF?

No. You can hand-author OKF files in a folder. A database becomes useful when you need one source of truth to generate many surfaces, such as OKF, HTML pages, JSON-LD, sitemaps, and internal tools.

### What is the first OKF concept I should write?

Write the concept your customers, team, or agents need to understand before anything else makes sense. Usually that is your core service, main framework, or the problem your product is built to solve.

### How do I know if my content is actually agent-readable?

Run the AMTECH OKF Audit Skill at amtechai.com/skills/okf-audit. It is a free consumable skill you can fetch into ChatGPT, Claude, Codex, Claude Code, or Cursor and point at any URL. It scores the page from 0 to 30 across six dimensions and returns the highest-priority fixes plus a copy-paste remediation prompt, so the answer becomes a score instead of a guess.

## Citations

[1] [Introducing the Open Knowledge Format](https://cloud.google.com/blog/products/data-analytics/how-the-open-knowledge-format-can-improve-data-sharing) — Google Cloud
[2] [AI features and your website](https://developers.google.com/search/docs/appearance/ai-features) — Google Search Central
[3] [Introduction to structured data markup in Google Search](https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data) — Google Search Central
[4] [Knowledge Graphs](https://arxiv.org/abs/2003.02320) — arXiv
[5] [A Survey on Knowledge Graphs: Representation, Acquisition, and Applications](https://arxiv.org/abs/2002.00388) — arXiv
[6] [Contextual estimation of link information gain](https://patents.google.com/patent/US20200349181A1/en) — Google Patents

---

Alternate views: [HTML](https://amtechai.com/articles/what-is-okf-ai-readable-knowledge) · [OKF concept](https://amtechai.com/okf/articles/what-is-okf-ai-readable-knowledge.md) · [llms.txt](https://amtechai.com/llms.txt)
