---
type: "Article"
title: "What AI Agents See When They Read Your Website"
description: "Most web content scores around 12/30 when audited for agent-readability. This walkthrough explains all six OKF rubric dimensions, scores a real AMTECH article, and names the five infrastructure gaps most publishers need to fix."
resource: "https://amtechai.com/articles/what-ai-agents-see-when-they-read-your-website"
tags:
  - "Agentic SEO"
  - "Content infrastructure"
  - "OKF content audit"
  - "Open Knowledge Format"
  - "First-Fetch Clarity"
  - "materialized views"
  - "entity graph"
  - "agent-readable knowledge"
  - "JSON-LD"
  - "AMTECH Knowledge Publishing Standard"
  - "strategy"
timestamp: "2026-06-19"
status: "published"
---
# What AI Agents See When They Read Your Website

Most web content scores around 12/30 when audited for agent-readability. This walkthrough explains all six OKF rubric dimensions, scores a real AMTECH article, and names the five infrastructure gaps most publishers need to fix.

> Good writing is not the same as agent-readable infrastructure. Here is what the score reveals and what to fix.

## Answer

Most web content scores around 12 out of 30 when an AI agent audits it for agent-readability. That is not a score for bad writing. It is a score for infrastructure. The content may be accurate, well-organized, and genuinely useful to a human reader. The problem is that the same page is nearly invisible to agents fetching it to answer a question, power a recommendation, or use it as trusted context. This article explains the six dimensions of the OKF content audit, shows a live scored example, and names the five infrastructure gaps that explain most low scores.

## What the rubric actually measures

An OKF audit scores a page, article, or knowledge bundle against six dimensions that determine whether AI agents can use the content effectively. Each dimension is scored 0 to 5. Zero means absent or actively misleading. Five means excellent, explicit, and easy for agents and humans to verify. The six scores add up to 30 points.

The rubric comes from the AMTECH OKF audit skill, which any agent can fetch and run from a single URL. The dimensions are not subjective writing quality scores. They measure whether specific infrastructure is present: metadata, named entities, citations, machine-readable surfaces, and actionable structure.

## The six OKF audit dimensions

| Dimension | What it scores |
| --- | --- |
| First-Fetch Clarity | Does the first-fetched surface tell an agent what the page is, who it serves, and what to do next — without executing JavaScript or following links? |
| Concept Packaging | Is there one stable concept per page? Is machine-readable metadata present: author, date, type, description, tags, and source URL? |
| Entity And Relationship Coverage | Are the important people, places, tools, industries, and use cases named consistently and linked to related concepts with relationship reasons? |
| Source And Citation Quality | Are claims traceable? Are external sources linked near the claims they support? Are dates concrete and generated or inferred claims labeled? |
| Materialized Views | Is the content available in multiple surfaces: human HTML page, markdown or text view, JSON structured data, sitemap, discovery links, and downloadable package when relevant? |
| Agent Execution Readiness | If the content is a workflow or guide, can an agent act from it directly? Is the workflow ordered, with explicit inputs, outputs, failure modes, and a copy-paste action prompt? |

## Score band interpretation

| Score | What it means |
| --- | --- |
| 26–30 | Agent-native and strong |
| 20–25 | Usable with targeted fixes |
| 14–19 | Promising but incomplete |
| 8–13 | Human-readable but weak for agents |
| 0–7 | Not agent-ready |

## Why each dimension catches a real gap

First-Fetch Clarity fails because most pages are designed for users who already know why they arrived. A user landing from search has context. An agent fetching a URL cold does not. If the opening paragraph does not name the task and audience, and if important links are hidden behind JavaScript, the agent has to guess.

Concept Packaging fails when a page covers too many ideas at once, or when the author and publish date are missing. Most blog platforms render author and date in the browser but do not put them in machine-readable form in the page source. An agent that fetches the HTML without executing scripts sees an anonymous, undated page.

Entity And Relationship Coverage fails when content uses generic language. A page that says "use AI to improve your business" has one vague entity and zero named relationships. A page that says "use Claude to analyze a QuickBooks CSV export for a garden center doing two million in annual revenue" has five named entities and implied relationships between all of them. Agents build context by connecting named things, not by interpreting vague prose.

Source And Citation Quality fails because educational content for business owners often treats its conclusions as obvious rather than sourced. Generative search systems weight cited claims more heavily than uncited assertions. If an AI is deciding whether to recommend your page, uncited claims carry less authority.

Materialized Views fails when a site is built as a JavaScript-only single-page application. The React or Vue page may render correctly in a browser but deliver a nearly empty HTML shell to a non-executing crawler or agent. Prerendering static HTML at build time, adding JSON-LD structured data, and maintaining a current sitemap.xml are the three minimum fixes for this dimension.

Agent Execution Readiness applies most directly to how-to articles, guides, and skill pages. General content will score lower here by nature. The dimension rewards pages that include labeled, ordered steps, explicit inputs and outputs, and a copy-paste prompt the reader can give to another agent. A narrative explainer scores a 2. A page with a numbered workflow and a prompt block scores a 4 or 5.

## Live audit: amtechai.com/articles/garden-center-spring-buy-plan-ai

| Dimension | Score | Finding |
| --- | --- | --- |
| First-Fetch Clarity | 2 / 5 | URL slug says "garden-center" but article covers six business types. No author name or date visible to a non-executing agent. |
| Concept Packaging | 2 / 5 | Author and date exist in the React data layer but are invisible in the static HTML. No YAML frontmatter or JSON-LD author block in first-fetch surface. |
| Entity And Relationship Coverage | 2 / 5 | Six business types listed. Zero AI tools named — "AI" appears throughout with no model, platform, or tool identified. |
| Source And Citation Quality | 1 / 5 | Zero external citations. Competitive-advantage claims stated as fact with no supporting data or sources. |
| Materialized Views | 2 / 5 | React page renders correctly for human readers. Non-executing agents receive a minimal HTML shell. No standalone markdown view or JSON manifest. |
| Agent Execution Readiness | 3 / 5 | Three labeled copy-paste prompts are the article's strongest asset. Missing a top-level workflow summary and a remediation prompt. |

## The five infrastructure concepts behind low scores

First-fetch surface: what a non-executing agent receives when it fetches your URL is your first-fetch surface. In many JavaScript-heavy sites, that surface is a nearly empty HTML shell with a few meta tags. The fix is prerendering — generating static HTML from the same content your framework renders. Prerendered pages are agent-readable from the first byte. AMTECH publishes all article routes as prerendered static HTML at build time specifically because of this.

Entity naming: the content an agent can use effectively names the things it is about. Services, tools, locations, industries, revenue bands, outcomes — these are entities. Naming them consistently across your content is the foundation of the entity graph. It does not require a graph database. It requires discipline in how you write. The same discipline that makes prose clearer to humans also makes it traversable for agents.

Structured metadata: author, publish date, topic type, and description should appear in machine-readable form — not just in human prose. The minimum viable implementation is Article JSON-LD on every published page. More complete implementations add HowTo for step-based guides, FAQPage for question-answer content, and BreadcrumbList for navigation context. Google Search Central describes structured data as a standardized way to provide explicit clues about page meaning. These clues are what agents and search systems use when prose alone is ambiguous.

Static discovery infrastructure: every page should be discoverable without interaction. That means a current sitemap.xml, a robots.txt that does not block legitimate agents, and ideally an llms.txt file that gives AI tools a direct orientation to your most important content. Internal links count here too. A page with no outbound links is a dead end for an agent building context. Google's documentation on AI features notes that query fan-out can trace across subtopics and data sources. That traversal requires linked pages, not isolated ones.

Citation infrastructure: claims with sources outperform unsupported assertions in generative search results. The GEO research found that citing credible statistics and sources was one of the strongest signals for inclusion in AI-generated outputs. The practical fix is simple: link external sources near the claims they support. You do not need a formal bibliography. You need clear attribution in the prose.

## One source, many projections: how AMTECH builds agent-readable content

| Surface | Who it serves |
| --- | --- |
| React article page | Human readers browsing the site |
| Prerendered static HTML | Crawlers, link previews, and non-executing agents |
| JSON-LD structured data | Search systems that understand page semantics |
| OKF markdown bundle | Agents and tools that want portable concept files |
| Sitemap and llms.txt | Discovery for crawlers and AI tools |
| Supabase concept tables | Queryable graph for internal agents and future products |

> **⚠️ Good writing is not the same as agent-readable infrastructure**
>
> A well-written article can score 12 out of 30. The prose is clear. The advice is sound. A human who finds the page can use it. But an agent fetching the URL to answer a downstream question gets a shell, no author, no date, no named tools, no citations, and no links to follow. The content exists. The infrastructure does not. Both matter now.

# Examples

### Run an OKF audit on any page

Use this with Claude, ChatGPT, or the AMTECH OKF audit skill at amtechai.com/skills/okf-audit. Replace the URL with your own page or a competitor's.

```text
I want to audit a page for agent-readability using the OKF rubric.

Page URL: [paste URL]

Score the page across these six dimensions (0–5 each):
1. First-Fetch Clarity — does the first-fetch surface tell an agent what the page is, who it serves, and what to do?
2. Concept Packaging — is there one stable concept per page with machine-readable metadata (author, date, type, description)?
3. Entity And Relationship Coverage — are the important entities named, linked, and related consistently?
4. Source And Citation Quality — are claims traceable to sources with dates?
5. Materialized Views — does the page have HTML, structured data, a text/markdown view, and discovery links?
6. Agent Execution Readiness — if this is a workflow or guide, can an agent act from it directly?

Return:
1. A score table with score and one-sentence finding per dimension
2. Total out of 30 and the score band
3. The three highest-priority fixes
4. A copy-paste remediation prompt I can give to a writing or publishing agent
```

## Five checks you can do in one afternoon

- Fetch your most important article and view the page source (Ctrl+U or Cmd+U). If you see mostly empty div tags, your first-fetch surface is weak.
- Search the page source for <script type="application/ld+json">. If it is absent, you have no structured data and no author or date in machine-readable form.
- Count how many times your main AI tool, model, or platform is named specifically. If you wrote "AI" throughout without naming a tool, your Entity And Relationship Coverage is low.
- Count the external links in your most important article. If there are zero citations for factual or competitive claims, that is a Source And Citation Quality gap.
- Open your site's /sitemap.xml. If it does not exist, does not include your article URLs, or has not been updated recently, discovery is broken for agents and crawlers both.

## FAQ

### Does a low OKF audit score mean my content is bad?

Not necessarily. A low score usually means the content is well-written for human readers but poorly set up for agents. The writing, logic, and practical value may be strong while the infrastructure — metadata, static rendering, structured data, citations — is missing.

### Do I need a technical team to fix these gaps?

The three most impactful fixes — adding citations, naming entities consistently in your writing, and adding Article JSON-LD — require no code changes and can be done by a writer or content editor. Prerendering and sitemap.xml require technical work but are well-documented in most modern frameworks.

### What is the difference between an OKF audit and regular SEO?

Traditional SEO focuses on ranking signals: keywords, backlinks, page speed, mobile-friendliness, crawlability. An OKF audit focuses on agent-readability: can a language model fetch your URL and extract useful, trustworthy, structured context? The two overlap significantly — structured data, crawlability, and citation quality matter in both — but the OKF lens surfaces infrastructure gaps that keyword-focused SEO often misses.

### Can I run the OKF audit on a competitor's content?

Yes. The OKF audit skill does not require ownership of the content. Auditing competitor pages is a useful research method for finding infrastructure advantages you can build.

# Related concepts

This concept connects to related parts of the AMTECH operations knowledge graph; each relationship is described inline:

- [What Is OKF? Google's New Format For AI-Readable Knowledge](/articles/what-is-okf-ai-readable-knowledge.md) — Published OKF and agentic-search explainer.
- [Use ChatGPT or Claude to Build a Local SEO Plan That Out-Ranks Bigger Competitors](/articles/build-local-seo-plan-with-chatgpt.md) — Published SEO systems anchor.
- [How to Build a Business Brain for Free Before You Hire an AI Consultant](/articles/business-brain-free.md) — Published business-brain anchor.
- [AMTECH vs. ChatGPT or Claude: What’s the Difference?](/articles/amtech-vs-chatgpt-claude.md) — Published buying-decision anchor.
- [Open Knowledge Format](/entities/concept-open-knowledge-format.md) — Method.
- [Knowledge graph](/entities/concept-knowledge-graph.md) — Method.
- [Materialized views](/entities/concept-materialized-views.md) — Method.
- [OKF content audit](/entities/concept-okf-content-audit.md) — Method.
- [AMTECH Knowledge Publishing Standard](/entities/concept-amtech-knowledge-publishing-standard.md) — Method.
- [JSON-LD](/entities/concept-json-ld.md) — Tool.
- [Agent-readable knowledge](/entities/concept-agent-readable-knowledge.md) — Outcome.

# Referenced by

- [What Is OKF? Google's New Format For AI-Readable Knowledge](/articles/what-is-okf-ai-readable-knowledge.md) — Published OKF and agentic-search explainer.

# Citations

[1] [Open Knowledge Format — Google Cloud](https://cloud.google.com/blog/products/data-analytics/how-the-open-knowledge-format-can-improve-data-sharing) — Google Cloud
[2] [AI features and your website — Google Search Central](https://developers.google.com/search/docs/appearance/ai-features) — Google Search Central
[3] [Introduction to structured data — Google Search Central](https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data) — Google Search Central
[4] [Generative Engine Optimization (GEO) — arXiv 2311.09735](https://arxiv.org/abs/2311.09735) — arXiv
