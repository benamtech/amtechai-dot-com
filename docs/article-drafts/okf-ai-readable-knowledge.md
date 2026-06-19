# Draft: What Is OKF? Google's New Format For AI-Readable Knowledge

Draft date: 2026-06-19  
Draft status: published to `/articles/what-is-okf-ai-readable-knowledge` on 2026-06-19  
Proposed slug: `what-is-okf-ai-readable-knowledge`  
Proposed category: `strategy`  
Proposed audience: founders, technical marketers, SEO strategists, content operators, and AI builders who understand that search is changing but do not yet have a practical vocabulary for knowledge graphs or agent-readable content.

## Validity Check Before Publishing

### Article Requirement Fit

This draft is meant to satisfy the AMTECH article requirements before it is converted into `ArticleDefinition` form:

| Requirement | Draft plan |
| --- | --- |
| Direct answer near the top | Opens with OKF in plain English: one markdown file per concept, readable by agents and humans. |
| Diagnostic or decision framework | Includes the "page, concept, graph, surface" table and the "what OKF does / does not solve" table. |
| Specific useful distinctions | Distinguishes pages from concepts, markdown links from graph edges, OKF from a full knowledge publishing system. |
| What not to do | Warns against treating OKF as a folder of generic markdown pages or as a replacement for strategy, entities, validation, or search surfaces. |
| DIY/internal threshold vs expert threshold | Includes a short readiness checklist and when to keep it simple vs build a projection pipeline. |
| Internal links with reasons | Proposed below. |
| External citations | Listed in the research appendix and referenced in the article body. |
| FAQ candidates | Included at the end for later conversion into `faqs`. |
| Schema compatibility | Visible article supports `Article`, `BreadcrumbList`, and `FAQPage` if published with the visible FAQ. |

### Proposed Graph Role

Role: published OKF / agentic-search explainer that bridges the current local SEO knowledge graph article and the future AMTECH Knowledge Publishing Standard article.

Primary entity:

- `Open Knowledge Format`, type: `method`

Related entities:

- `knowledge graph`, type: `method`
- `agent-readable knowledge`, type: `outcome`
- `AI search`, type: `tool`
- `AI Overviews`, type: `tool`
- `structured data`, type: `method`
- `JSON-LD`, type: `tool`
- `llms.txt`, type: `tool`
- `Business Brain`, type: `service`
- `AMTECH Knowledge Publishing Standard`, type: `method`

Proposed `KnowledgeGraphNode`:

```ts
{
  id: 'E9',
  title: "What Is OKF? Google's New Format For AI-Readable Knowledge",
  slug: 'what-is-okf-ai-readable-knowledge',
  href: '/articles/what-is-okf-ai-readable-knowledge',
  type: 'EXISTING',
  typeLabel: 'Published OKF and agentic-search explainer',
  status: 'published',
  uc: 'Local authority / Agentic SEO',
  mechanism: 'Explains OKF as a portable markdown concept bundle, then shows why AMTECH treats it as one surface generated from a richer entity graph.',
  audience: 'Founders, technical marketers, SEO strategists, content operators, and AI builders',
  topic: 'Open Knowledge Format',
  description: 'A plain-English explanation of OKF, knowledge graphs, and the AMTECH standard for turning useful content into agent-readable surfaces.',
  connectsTo: ['E1', 'E2', 'E4', 'N1']
}
```

### Proposed Internal Links

| Link | Reason |
| --- | --- |
| `/articles/build-local-seo-plan-with-chatgpt` | Shows the earlier entity/knowledge-graph SEO workflow that OKF now gives a portable agent-readable surface. |
| `/articles/business-brain-free` | Shows the durable context layer a company needs before agents or AI Employees can use its knowledge reliably. |
| `/articles/amtech-vs-chatgpt-claude` | Connects the concept of agent-readable knowledge to AMTECH's distinction between one-off chat tools and managed AI Employees. |
| `/articles` | Lets readers move from the OKF explainer into the broader AMTECH article graph. |

### Proposed External Sources

Use these as citations if converted to `ArticleDefinition`:

1. Google Cloud, "Introducing the Open Knowledge Format" - https://cloud.google.com/blog/products/data-analytics/how-the-open-knowledge-format-can-improve-data-sharing
2. Google Search Central, "AI Features and Your Website" - https://developers.google.com/search/docs/appearance/ai-features
3. Google Search Central, "Introduction to structured data markup in Google Search" - https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data
4. Hogan et al., "Knowledge Graphs" - https://arxiv.org/abs/2003.02320
5. Ji et al., "A Survey on Knowledge Graphs: Representation, Acquisition, and Applications" - https://arxiv.org/abs/2002.00388
6. Google patent, "Contextual estimation of link information gain" - https://patents.google.com/patent/US20200349181A1/en
7. AMTECH internal OKF rationale - `docs/okf/01-okf-from-first-principles.md`
8. AMTECH OKF mapping - `docs/okf/02-mapping-amtech-to-okf.md`
9. AMTECH adaptation plan - `docs/okf/03-adaptation-plan.md`
10. AMTECH validation gates - `docs/okf/04-validation-and-phase-gates.md`
11. AMTECH build notes - `docs/okf/05-phase-1-build-notes.md`
12. AMTECH Phase 3 foundation - `docs/okf/06-phase-3-foundation.md`
13. AMTECH future article notes - `docs/okf/07-future-article-notes.md`
14. AMTECH codegraph - `docs/codegraph.md`

### Published Implementation Notes

This draft has been converted into the live article system:

1. Article data: `src/lib/knowledge/articles/what-is-okf-ai-readable-knowledge.ts`.
2. Article export: `src/lib/knowledge/articles/index.ts`.
3. Wrapper page: `src/pages/articles/OkfAiReadableKnowledge.tsx`.
4. Route: `/articles/what-is-okf-ai-readable-knowledge` in `src/App.tsx`.
5. Knowledge graph node: `E9` in `src/lib/articleKnowledgeGraph.ts`.
6. Topic group: `Knowledge graph and agentic search`.
7. Generated surfaces: `public/okf/**`, `public/sitemap.xml`, `public/robots.txt`, and `public/llms.txt` regenerated by `npm run okf:check`.
8. Supabase projection: not applied from this draft file; use `npm run okf:db:seed-sql` and `npm run okf:db:verify` after applying the SQL through a service-role-safe path if the live DB projection must include the article.

---

# What Is OKF? Google's New Format For AI-Readable Knowledge

OKF, short for Open Knowledge Format, is a way to package knowledge so AI agents can read it directly. In plain English: **OKF is a folder of markdown files where each file describes one concept, and the links between files form a simple knowledge graph.**

That sounds almost too simple. That is the point.

Most websites are built for people clicking around. Most docs are built for humans who already know where to look. Most AI systems have to scrape, chunk, embed, retrieve, and reassemble context before they can answer anything useful. OKF starts from a different assumption: if agents need context, give them a clean bundle of concepts they can read without guessing.

The immediate move is simple. Pick one important thing your company knows. Write one markdown file for it. Add a tiny YAML block at the top. Link it to the concepts it depends on.

That is an OKF-style concept.

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

That little file does three jobs at once:

1. A person can read it.
2. An agent can parse it.
3. The links show how the idea connects to other ideas.

That is why OKF matters. Not because markdown is new. Because it gives people and agents a shared, portable shape for knowledge.

## The Problem: Agents Need Context, But Websites Are Messy

The new bottleneck in AI is not always the model. Often, it is the context.

Google's OKF launch makes that point directly: foundation models keep improving, but they still need the right information to produce accurate, useful results. In most companies, that information is scattered across wikis, docs, drives, code comments, spreadsheets, databases, old proposals, Slack threads, and a few experienced people's heads.

That scattered knowledge creates a practical problem for agents. Before the agent can help, it has to figure out:

- What the important things are.
- Which definitions are current.
- Which pages are trusted.
- How one concept relates to another.
- Which source backs a claim.
- What to ignore.

Traditional RAG tries to solve this by retrieving chunks at query time. That is useful, but it is not the same as giving an agent a clean map. A chunk is a piece of text. A concept is a named thing with context, links, and purpose.

OKF is important because it moves some of the work upstream. Instead of making the agent reconstruct your knowledge every time, you package the knowledge in a form the agent can navigate.

## OKF In Plain English

An OKF bundle is a directory of markdown files. Each file is one concept.

The only required frontmatter field is `type`. Everything else is optional, though useful bundles usually include a title, description, tags, resource URL, timestamp, body sections, examples, citations, and links.

Here is the simplest useful mental model:

| Website habit | OKF habit | Why it matters |
| --- | --- | --- |
| Page | Concept | Agents need to know the thing being explained, not only the page layout. |
| Navigation menu | `index.md` | Agents need a cheap map before loading a whole bundle. |
| Internal link | Graph edge | A link tells the agent that two concepts are related. |
| Blog category | Concept type or tag | Grouping becomes machine-readable. |
| Citation link | Trust edge | Claims become easier to inspect and verify. |
| Sitemap | Discovery surface | Crawlers and agents need stable entry points. |

This is the part most people miss: **OKF is not just a writing format. It is a graph format wearing markdown clothes.**

When one concept links to another, the bundle starts becoming a knowledge graph. Not an academic one with heavy ontology work. Not a giant enterprise graph database. A practical graph: things, descriptions, and relationships.

## Why Links Matter More Than They Look

A normal internal link says, "Here is another page."

An OKF link says, "This concept depends on, explains, references, joins with, contrasts against, or extends that concept."

The markdown link itself is simple. The surrounding sentence gives the relationship meaning.

That is close to how good editorial links should work anyway. A useful internal link should never be just "read more." It should tell the reader why the next page matters.

Bad link:

```md
Read more about our Business Brain.
```

Better link:

```md
Build the [Business Brain](/concepts/business-brain.md) first because every AI Employee needs durable company context before it can make useful decisions.
```

The second version helps humans, agents, and search systems at the same time. It names the relationship. It gives the link a job.

This is where knowledge graph SEO and OKF start to overlap. If AI search systems are breaking complex questions into subtopics, looking for supporting pages, and comparing sources, isolated pages are weaker than connected concepts. Google's own AI Search documentation says AI Overviews and AI Mode may use query fan-out across subtopics and data sources. That makes clear entity relationships more valuable, not less.

## What OKF Does Well

OKF is strong because it is intentionally boring.

It is:

- Plain markdown.
- Plain files.
- Plain YAML frontmatter.
- Git-friendly.
- Readable by humans.
- Parseable by agents.
- Not tied to a specific model, cloud, database, CMS, or agent platform.

That low ceremony is the advantage. A useful standard has to be easy to adopt. If every company has to install a platform, learn a schema language, run a graph database, or rewrite its docs before trying it, the format will not spread.

OKF gives teams a first move:

1. Pick a concept.
2. Write a markdown file.
3. Add `type`.
4. Add a description.
5. Add useful links.
6. Put the bundle where agents can read it.

For many teams, that is already a step forward.

## What OKF Does Not Solve

OKF's strength is also its limit. It is minimal on purpose.

That means OKF does not automatically solve:

| Missing layer | Why it matters |
| --- | --- |
| Content quality | A valid OKF file can still be vague, thin, or wrong. |
| Entity strategy | The format will not tell you which concepts deserve their own files. |
| Edge quality | Links can exist without meaningful relationship text. |
| Canonical source of truth | OKF does not decide whether your source is markdown, code, database rows, or a CMS. |
| Validation | OKF conformance is easy; useful graph quality needs stricter tests. |
| Search surfaces | OKF does not replace indexable pages, JSON-LD, sitemap, or human UX. |
| Access control | Public bundles and private organizational knowledge need different serving rules. |

This is the key distinction:

**OKF answers, "Can an agent read this bundle?" It does not answer, "Is this the best possible knowledge system for humans, search engines, agents, databases, and AI citations?"**

That second question is where AMTECH's standard begins.

## The AMTECH Difference: OKF As One Output, Not The Whole System

At AMTECH, we do not treat OKF as the source of truth. We treat it as one projection.

The source is a richer knowledge model: concepts, entities, article bodies, citations, and edges. From that model, we generate multiple surfaces:

| Surface | Who it serves |
| --- | --- |
| React article pages | Human readers. |
| Prerendered HTML | Crawlers, link previews, non-JS readers, and agents. |
| JSON-LD | Search systems that understand structured page data. |
| OKF markdown bundle | Agents and tools that want portable concept files. |
| Supabase concept tables | Queryable graph access and future product/API use. |
| `sitemap.xml` | Search discovery. |
| `robots.txt` | Crawl guidance. |
| `llms.txt` | Agent orientation. |

The important part is not that we have more outputs. The important part is that they come from the same model.

One source. Many surfaces.

That prevents the usual failure mode where the blog says one thing, the structured data says another, the internal wiki is stale, and the AI assistant has to guess which version is real.

## A Small Example: AI Employee As A Concept

Suppose you want AI systems to understand what AMTECH means by "AI Employee."

A weak version is one landing page that says an AI Employee saves time.

A stronger version is a concept graph:

| Concept | Type | Relationship |
| --- | --- | --- |
| AI Employee | Service | Runs operational workflows for a company. |
| Business Brain | Method | Supplies durable context to the AI Employee. |
| Owner Briefing | Outcome | Turns agent work into decisions the owner can act on. |
| Supervisor | Customer | Reviews, approves, and redirects the AI Employee. |
| Agent-readable knowledge | Method | Lets the system reuse company context instead of guessing. |

Now the idea is not floating alone. It has neighbors. It has definitions. It has a role.

That is what a graph gives you: not just more pages, but more meaning between pages.

## The First OKF File You Should Create

Do not start by converting your whole website.

Start with one concept that your company explains over and over.

Good candidates:

- Your core service.
- Your main framework.
- A customer problem you solve.
- A method your competitors explain badly.
- A term you use differently than the market.
- A product category buyers misunderstand.

Use this template:

```md
---
type: Method
title: [Concept Name]
description: [One-sentence explanation of the concept.]
tags: [category, audience, outcome]
---

# [Concept Name]

[Plain-English explanation.]

## Why it matters

[Explain the operational or strategic consequence.]

## When to use it

- [Situation 1]
- [Situation 2]
- [Situation 3]

## Related concepts

- [Related concept](/concepts/related-concept.md) because [relationship reason].
- [Related concept](/concepts/second-concept.md) because [relationship reason].

## Citations

1. [Source name](https://example.com)
```

The useful part is not the file. The useful part is the discipline.

You are forcing yourself to say:

- What is this thing?
- What type of thing is it?
- What else does it connect to?
- Why does that connection exist?
- What source backs the claim?

That is how content becomes context.

## A Practical Prompt To Build Your First OKF Bundle

Use this with ChatGPT, Claude, Gemini, or your preferred writing agent:

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

If the output is mostly generic nouns, push harder. Ask for sharper entities, clearer relationships, and more operational examples.

## When To Keep It Simple

You do not need a full graph pipeline on day one.

Keep it simple if:

- You have fewer than 20 important concepts.
- Your content is not changing often.
- You do not have a technical publishing workflow.
- Your immediate goal is to make your knowledge clearer for agents and collaborators.

In that case, write a small OKF-style folder by hand. Use `index.md`. Use clear filenames. Add links with reasons.

Build a larger system if:

- You publish many articles.
- You care about AI search visibility.
- You need structured data and human pages to stay in sync.
- Your agents need trusted context.
- Your content has many entities, citations, locations, use cases, or product surfaces.
- You want the same knowledge to power articles, internal tools, search, and automation.

That is when OKF should stop being the whole thing and become one generated surface from a stronger source model.

## The Mistake To Avoid

Do not treat OKF as a dumping ground for markdown.

If you export a messy wiki into OKF, you have a portable messy wiki. That is better than a trapped messy wiki, but it is not a knowledge advantage.

The advantage comes from deciding what deserves to be a concept, how concepts relate, which claims need evidence, and which surfaces need to be generated from the same source.

OKF gives you the container. You still need the judgment.

## The Short Version

OKF is Google's new lightweight format for AI-readable knowledge. It represents knowledge as markdown concept files with YAML frontmatter. The only required field is `type`. Links between files turn the bundle into a simple graph.

That makes OKF a powerful first step for teams that want agents to read curated knowledge without scraping a whole website or depending on a proprietary platform.

But OKF is not the full strategy.

For serious publishing, OKF should be one output from a richer system: one source of truth, first-class entities, explicit relationships, citations, generated human pages, generated structured data, queryable graph tables, and validation before publish.

That is the real shift:

**The future of content is not more pages. It is useful knowledge, structured once, then projected into every surface where humans and agents discover it.**

## FAQ Draft

### Is OKF the same as a knowledge graph?

No. OKF is a lightweight file format that can express a simple knowledge graph through concept files and markdown links. A full knowledge graph may have richer typed entities, stricter edge rules, database storage, validation, and multiple generated surfaces.

### Does OKF replace SEO?

No. OKF does not replace crawlable pages, helpful content, internal links, structured data, or technical SEO. It gives agents another clean way to read your knowledge.

### Do I need a database to use OKF?

No. You can hand-author OKF files in a folder. A database becomes useful when you need one source of truth to generate many surfaces, such as OKF, HTML pages, JSON-LD, sitemaps, and internal tools.

### What is the first OKF concept I should write?

Write the concept your customers, team, or agents need to understand before anything else makes sense. Usually that is your core service, main framework, or the problem your product is built to solve.

---

## Research Appendix

### External Research And Platform References

- Google Cloud introduced OKF on June 12, 2026 as an open specification for representing AI-needed context as markdown files with YAML frontmatter. The launch post emphasizes that OKF is a format, not a platform, and that concepts link to each other with normal markdown links.  
  Source: https://cloud.google.com/blog/products/data-analytics/how-the-open-knowledge-format-can-improve-data-sharing

- Google Search Central says AI Overviews and AI Mode may use query fan-out: multiple related searches across subtopics and data sources. It also says pages eligible as supporting links must meet normal Search technical requirements and that important content should be available in textual form.  
  Source: https://developers.google.com/search/docs/appearance/ai-features

- Google Search Central describes structured data as a standardized way to provide explicit clues about page meaning, while warning not to mark up information that is not visible to users. This supports AMTECH's rule that JSON-LD should reflect visible article content, not invent hidden claims.  
  Source: https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data

- Hogan et al. provide a broad academic survey of knowledge graphs, including data models, identity, context, creation, enrichment, quality assessment, publication, and enterprise/open graph applications. This supports the article's simplified explanation that graphs are about entities and relationships, not just documents.  
  Source: https://arxiv.org/abs/2003.02320

- Ji et al. survey knowledge graph representation, acquisition, completion, reasoning, and applications. This is useful background for later AMTECH articles that go deeper into graph construction and the limits of lightweight markdown-only formats.  
  Source: https://arxiv.org/abs/2002.00388

- Google's information-gain patent is relevant to the publishing bar: a useful graph should add distinctions and relationships, not duplicate generic pages.  
  Source: https://patents.google.com/patent/US20200349181A1/en

### AMTECH Internal References

- `docs/codegraph.md` documents the live AMTECH architecture: `src/lib/knowledge/` is the single authored source for knowledge, and build tooling projects it into OKF, prerendered pages, discovery files, and Supabase seed SQL.
- `docs/okf/01-okf-from-first-principles.md` explains OKF's format, concept model, bundle rules, and the SEO/agentic-search interpretation.
- `docs/okf/02-mapping-amtech-to-okf.md` records the key finding that AMTECH's `ArticleDefinition` is a richer typed superset of OKF frontmatter, while OKF mainly adds serialization and portability.
- `docs/okf/03-adaptation-plan.md` defines the "one canonical model, many projections" architecture.
- `docs/okf/04-validation-and-phase-gates.md` defines the conformance, freshness, quality, and discovery gates that keep generated surfaces trustworthy.
- `docs/okf/05-phase-1-build-notes.md` records the orphan-node discovery: a validator exposed graph gaps that prose documentation had hidden.
- `docs/okf/06-phase-3-foundation.md` records the decision to use façade-as-source and database-as-projection until there is a strong reason for DB authoring.
- `docs/okf/07-future-article-notes.md` records the article ladder and the AMTECH positioning: OKF is the portable projection, not the full knowledge publishing system.
- `docs/ARTICLE_PUBLISHING_AGENT.md` defines the workflow for turning supplied article copy into AMTECH article data, graph nodes, OKF output, validation, and optional Supabase projection.

### Candidate ArticleDefinition Metadata

```ts
{
  slug: 'what-is-okf-ai-readable-knowledge',
  title: "What Is OKF? Google's New Format For AI-Readable Knowledge",
  description: 'OKF is a simple way to package knowledge so AI agents can read it. Here is how markdown concept files become a graph, and why AMTECH treats OKF as one output of a larger publishing system.',
  dek: 'OKF is not just a better wiki format. It is a portable surface for agent-readable concepts, and the first step toward a richer knowledge publishing system.',
  datePublished: '2026-06-19',
  dateModified: '2026-06-19',
  authorName: 'AMTECH AI',
  readingTime: '9 min read',
  category: 'strategy',
  audience: 'Founders, technical marketers, SEO strategists, content operators, and AI builders',
  primaryEntity: { name: 'Open Knowledge Format', type: 'method' },
  entities: [
    { name: 'knowledge graph', type: 'method' },
    { name: 'agent-readable knowledge', type: 'outcome' },
    { name: 'AI search', type: 'tool' },
    { name: 'AI Overviews', type: 'tool' },
    { name: 'structured data', type: 'method' },
    { name: 'Business Brain', type: 'service' },
    { name: 'AMTECH Knowledge Publishing Standard', type: 'method' }
  ]
}
```
