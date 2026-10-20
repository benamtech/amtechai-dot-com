---
title: "What Is OKF? Google's New Format For AI-Readable Knowledge"
description: "OKF is a simple way to package knowledge so AI agents can read it. Here is how markdown concept files become a graph, why AMTECH treats OKF as one output of a larger publishing system, and how to score your own content with the free OKF Audit Skill."
dek: "OKF is not just a better wiki format. It is a portable surface for agent-readable concepts, and the first step toward a richer knowledge publishing system."
date: 2026-06-19
lastmod: 2026-06-19
author: "AMTECH AI"
audience: "founders, technical marketers, SEO strategists, content operators, and AI builders"
# What the article is about, for search engines and AI readers (structured data); not shown on the page.
about:
  - { name: "Open Knowledge Format", type: method, sameAs: ["https://cloud.google.com/blog/products/data-analytics/how-the-open-knowledge-format-can-improve-data-sharing"] }
  - { name: "knowledge graph", type: method, sameAs: ["https://arxiv.org/abs/2003.02320"] }
  - { name: "agent-readable knowledge", type: outcome }
  - { name: "AI search", type: tool }
  - { name: "AI Overviews", type: tool, sameAs: ["https://developers.google.com/search/docs/appearance/ai-features"] }
  - { name: "structured data", type: method, sameAs: ["https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data"] }
  - { name: "JSON-LD", type: tool }
  - { name: "llms.txt", type: tool }
  - { name: "Business Brain", type: service }
  - { name: "AMTECH Knowledge Publishing Standard", type: method }
  - { name: "OKF audit", type: method }
faqs:
  - q: "Is OKF the same as a knowledge graph?"
    a: "No. OKF is a lightweight file format that can express a simple knowledge graph through concept files and markdown links. A full knowledge graph may have richer typed entities, stricter edge rules, database storage, validation, and multiple generated surfaces."
  - q: "Does OKF replace SEO?"
    a: "No. OKF does not replace crawlable pages, helpful content, internal links, structured data, or technical SEO. It gives agents another clean way to read your knowledge."
  - q: "Do I need a database to use OKF?"
    a: "No. You can hand-author OKF files in a folder. A database becomes useful when you need one source of truth to generate many surfaces, such as OKF, HTML pages, JSON-LD, sitemaps, and internal tools."
  - q: "What is the first OKF concept I should write?"
    a: "Write the concept your customers, team, or agents need to understand before anything else makes sense. Usually that is your core service, main framework, or the problem your product is built to solve."
  - q: "How do I know if my content is actually agent-readable?"
    a: "Run the OKF audit on the page: give the audit prompt in this article to ChatGPT, Claude, Codex, Claude Code, or Cursor and point it at any URL. It scores the page from 0 to 30 across six dimensions and returns the highest-priority fixes plus a copy-paste remediation prompt, so the answer becomes a score instead of a guess."
citations:
  - label: "Introducing the Open Knowledge Format"
    url: "https://cloud.google.com/blog/products/data-analytics/how-the-open-knowledge-format-can-improve-data-sharing"
    publisher: "Google Cloud"
  - label: "AI features and your website"
    url: "https://developers.google.com/search/docs/appearance/ai-features"
    publisher: "Google Search Central"
  - label: "Introduction to structured data markup in Google Search"
    url: "https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data"
    publisher: "Google Search Central"
  - label: "Knowledge Graphs"
    url: "https://arxiv.org/abs/2003.02320"
    publisher: "arXiv"
  - label: "A Survey on Knowledge Graphs: Representation, Acquisition, and Applications"
    url: "https://arxiv.org/abs/2002.00388"
    publisher: "arXiv"
  - label: "Contextual estimation of link information gain"
    url: "https://patents.google.com/patent/US20200349181A1/en"
    publisher: "Google Patents"
next:
  - label: "Build a local SEO knowledge graph"
    href: "/articles/build-local-seo-plan-with-chatgpt"
    reason: "Shows the entity and knowledge-graph SEO workflow that OKF can turn into a portable agent-readable surface."
  - label: "Build a Business Brain first"
    href: "/articles/business-brain-free"
    reason: "Shows the durable context layer a company needs before agents or AI Employees can use its knowledge reliably."
  - label: "AMTECH vs. ChatGPT or Claude"
    href: "/articles/amtech-vs-chatgpt-claude"
    reason: "Connects agent-readable knowledge to AMTECH's distinction between one-off chat tools and managed AI Employees."
  - label: "See a live OKF audit score a real article 12/30"
    href: "/articles/what-ai-agents-see-when-they-read-your-website"
    reason: "Shows the same audit skill applied dimension by dimension, with the five infrastructure gaps that keep good writing invisible to agents."
  - label: "Browse the AMTECH article graph"
    href: "/articles"
    reason: "Moves from the OKF explainer into the broader AMTECH graph of articles, playbooks, entities, and operating use cases."
---
{{< answer >}}
OKF, short for Open Knowledge Format, is a way to package knowledge so AI agents can read it directly. In plain English, OKF is a folder of markdown files where each file describes one concept, and the links between files form a simple knowledge graph.
{{< /answer >}}

Context
{.kicker}

## Agents need context, but websites are messy {#why-okf-exists}

The new bottleneck in AI is not always the model. Often, it is the context. Google Cloud introduced OKF on June 12, 2026, with the same practical premise: foundation models keep improving, but they still need the right information to produce accurate and useful results.

In most companies, that information is scattered across wikis, docs, drives, code comments, spreadsheets, databases, old proposals, chat threads, and a few experienced people's heads. Before an agent can help, it has to figure out what the important things are, which definitions are current, which sources are trusted, and how one concept relates to another.

Traditional retrieval can pull chunks of text at query time. That is useful, but it is not the same as giving an agent a clean map. A chunk is a piece of text. A concept is a named thing with context, links, citations, and purpose.

{{< prompt id="first-concept-example" title="Example: a small OKF-style concept file" helper="A person can read this file, an agent can parse it, and the links show how the idea connects to other ideas." >}}
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
{{< /prompt >}}

## The simplest useful OKF mental model {#okf-mental-model}

| Website habit | OKF habit | Why it matters |
| --- | --- | --- |
| Page | Concept | Agents need to know the thing being explained, not only the page layout. |
| Navigation menu | index.md | Agents need a cheap map before loading a whole bundle. |
| Internal link | Graph edge | A link tells the agent that two concepts are related. |
| Blog category | Concept type or tag | Grouping becomes machine-readable. |
| Citation link | Trust edge | Claims become easier to inspect and verify. |
| Sitemap | Discovery surface | Crawlers and agents need stable entry points. |

Graph layer
{.kicker}

## Why links matter more than they look {#links-become-edges}

A normal internal link says, "Here is another page." An OKF link can say, "This concept depends on, explains, references, joins with, contrasts against, or extends that concept." The markdown link is simple. The surrounding sentence gives the relationship meaning.

That is close to how good editorial links should work anyway. A useful internal link should never be just "read more." It should tell the reader why the next page matters. Better link text also helps agents and search systems understand the relationship instead of guessing from two URLs.

This is where knowledge graph SEO and OKF overlap. Google's Search documentation says AI Overviews and AI Mode may use query fan-out across related subtopics and data sources. That makes clear entity relationships more valuable, not less.

## What OKF does well, and what it does not solve {#okf-strengths-and-limits}

| Layer | What OKF gives you | What you still need to decide |
| --- | --- | --- |
| Format | Plain markdown files with YAML frontmatter. | Which concepts deserve their own files. |
| Portability | A bundle that is not tied to one model, cloud, database, CMS, or agent platform. | Where the canonical source of truth lives. |
| Graph shape | Markdown links between concepts. | Whether those links encode meaningful relationship reasons. |
| Conformance | A small interoperability surface with `type` as the required field. | Stricter quality, freshness, and no-orphan validation. |
| Agent access | A clean bundle agents can navigate. | How public, private, and permissioned knowledge should be served. |
| Search support | A machine-readable knowledge surface. | Crawlable HTML, structured data, sitemap, robots.txt, and human UX. |

{{< callout title="Do not treat OKF as a dumping ground for markdown" tone="warning" >}}
If you export a messy wiki into OKF, you have a portable messy wiki. That is better than a trapped messy wiki, but it is not a knowledge advantage. The advantage comes from deciding what deserves to be a concept, how concepts relate, which claims need evidence, and which surfaces need to stay in sync.
{{< /callout >}}

AMTECH standard
{.kicker}

## OKF should be one output, not the whole system {#amtech-standard}

At AMTECH, we do not treat OKF as the source of truth. We treat it as one projection. The source is a richer knowledge model: concepts, entities, article bodies, citations, and edges. From that model, we generate multiple surfaces for different consumers.

That distinction matters. OKF answers, "Can an agent read this bundle?" A complete knowledge publishing system asks a harder question: "Can the same source of truth produce every surface humans, crawlers, agents, databases, and AI search systems need?"

One source and many surfaces prevents the usual failure mode where the blog says one thing, the structured data says another, the internal wiki is stale, and the AI assistant has to guess which version is real.

## The surfaces one source model can generate {#amtech-surfaces}

| Surface | Who it serves |
| --- | --- |
| React article pages | Human readers. |
| Prerendered HTML | Crawlers, link previews, non-JS readers, and agents. |
| JSON-LD | Search systems that understand structured page data. |
| OKF markdown bundle | Agents and tools that want portable concept files. |
| sitemap.xml | Search discovery. |
| robots.txt | Crawl guidance. |
| llms.txt | Agent orientation. |

Example
{.kicker}

## AI Employee is stronger as a concept graph than as one landing page {#concept-example}

Suppose you want AI systems to understand what AMTECH means by "AI Employee." A weak version is one landing page that says an AI Employee saves time. A stronger version is a concept graph: AI Employee, Business Brain, Owner Briefing, Supervisor, and agent-readable knowledge all defined and linked.

Now the idea is not floating alone. It has neighbors. It has definitions. It has a role. That is what a graph gives you: not just more pages, but more meaning between pages.

## The first OKF file you should create {#first-okf-file-checklist}

- Pick one concept your company explains over and over: your core service, main framework, a customer problem, or a term you define differently than the market.
- Give it a clear `type`, title, one-sentence description, and useful tags.
- Explain why the concept matters and when to use it.
- Link it to related concepts with relationship reasons, not generic "read more" language.
- Add citations where the concept relies on external claims, platform behavior, or research.
- Add it to an index so an agent can navigate the bundle without loading everything first.

{{< prompt id="okf-bundle-prompt" title="Prompt: plan your first OKF bundle" helper="Use this with ChatGPT, Claude, Gemini, or your preferred writing agent to turn a site or business into an initial concept map." >}}
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
{{< /prompt >}}

Decision point
{.kicker}

## When to keep OKF simple and when to build a pipeline {#when-to-keep-it-simple}

You do not need a full graph pipeline on day one. Keep it simple if you have fewer than 20 important concepts, your content does not change often, and your immediate goal is to make your knowledge clearer for agents and collaborators. A hand-authored folder can be enough.

Build a larger system when you publish many articles, care about AI search visibility, need structured data and human pages to stay in sync, or want the same knowledge to power articles, internal tools, search, and automation. That is when OKF should stop being the whole thing and become one generated surface from a stronger source model.

AMTECH skill
{.kicker}

## How to check whether your knowledge is actually agent-readable {#audit-with-the-skill}

Deciding what deserves to be a concept, how concepts relate, and which claims need citations is judgment work. But you do not have to guess whether the result reads well to an agent. AMTECH publishes a free consumable skill, the OKF Audit Skill, that scores any page, draft, sitemap, or OKF bundle against the same agent-readability rubric this article describes.

It is a skill in the literal sense: a portable instruction package an agent can fetch from one URL and run. There is nothing to install, no SDK, and no plugin. Give ChatGPT, Claude, Codex, Claude Code, Cursor, or an AMTECH agent the audit prompt and a URL, and it returns a score from 0 to 30 across six dimensions — first-fetch clarity, concept packaging, entity and relationship coverage, source and citation quality, materialized views, and agent execution readiness — plus the highest-priority fixes and a copy-paste remediation prompt.

This is the validation step that keeps OKF honest. A bundle can be valid markdown and still be a weak knowledge surface. Running the audit before you publish, and on your competitors after, turns "is this agent-readable?" from an opinion into a score you can act on.

Bottom line
{.kicker}

## The future of content is useful knowledge projected into many surfaces {#short-version}

OKF is Google's lightweight format for AI-readable knowledge. It represents knowledge as markdown concept files with YAML frontmatter. The only required field is `type`. Links between files turn the bundle into a simple graph.

That makes OKF a powerful first step for teams that want agents to read curated knowledge without scraping a whole website or depending on a proprietary platform. But OKF is not the full strategy.

For serious publishing, OKF should be one output from a richer system: one source of truth, first-class entities, explicit relationships, citations, generated human pages, generated structured data, queryable graph tables, and validation before publish.
