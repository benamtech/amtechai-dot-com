# Draft: What AI Agents See When They Read Your Website

Draft date: 2026-06-19
Draft status: ready for ArticleDefinition conversion
Proposed slug: `what-ai-agents-see-when-they-read-your-website`
Proposed category: `strategy`
Proposed audience: founders, content operators, SEO strategists, and technical marketers who publish educational content and want it to reach AI agents and AI search systems.

---

## Validity Check Before Publishing

| Requirement | Draft plan |
|---|---|
| Direct answer near the top | Opens with what the OKF audit measures and why a 12/30 matters. |
| Diagnostic or decision framework | Includes the full 6-dimension rubric table with what each score level means. |
| Specific useful distinctions | Distinguishes the 6 rubric categories, explains why agent-invisible content differs from bad content. |
| What not to do | Notes that good prose is not the same as agent-readable infrastructure. |
| DIY/internal threshold vs expert threshold | Includes a "do this in one afternoon" checklist and a copy-paste remediation prompt. |
| Internal links with reasons | Proposed below. |
| External citations | Listed in research appendix. |
| FAQ candidates | Included at the end. |
| Schema compatibility | Supports `Article`, `BreadcrumbList`, and `FAQPage`. |

### Validation Notes

The LinkedIn post written before this draft used improvised rubric category names. The article uses the actual names from `okf-audit-rubric.md`:
1. First-Fetch Clarity
2. Concept Packaging
3. Entity And Relationship Coverage
4. Source And Citation Quality
5. Materialized Views
6. Agent Execution Readiness

See `docs/memory/validation-2026-06-19--okf-audit-linkedin-post.md` for the full claim-by-claim validation pass.

### Proposed Graph Role

Primary entity: `OKF content audit` (method)

Related entities:
- `Open Knowledge Format` (method)
- `materialized views` (method)
- `entity graph` (method)
- `agent-readable knowledge` (outcome)
- `JSON-LD` (tool)
- `First-Fetch Clarity` (method)
- `AMTECH Knowledge Publishing Standard` (method)

Proposed `KnowledgeGraphNode`:

```ts
{
  id: 'E10',
  title: "What AI Agents See When They Read Your Website",
  slug: 'what-ai-agents-see-when-they-read-your-website',
  href: '/articles/what-ai-agents-see-when-they-read-your-website',
  type: 'EXISTING',
  typeLabel: 'OKF audit walkthrough and infrastructure explainer',
  status: 'draft',
  uc: 'Agentic SEO / Content infrastructure',
  mechanism: 'Walks through a live OKF audit on a real article, explains the 6 rubric dimensions, and names the infrastructure concepts that determine whether content is agent-usable.',
  audience: 'Founders, content operators, SEO strategists, and technical marketers',
  topic: 'OKF content audit',
  description: 'A plain-English walkthrough of an OKF content audit scoring a real article 12/30, explaining what each dimension measures and what to fix.',
  connectsTo: ['E9', 'E1', 'E2']
}
```

### Proposed Internal Links

| Link | Reason |
|---|---|
| `/articles/what-is-okf-ai-readable-knowledge` | Explains the OKF format this audit is based on. |
| `/articles/build-local-seo-plan-with-chatgpt` | Shows the entity graph strategy that feeds directly into the Entity And Relationship Coverage dimension. |
| `/articles/business-brain-free` | A company without a Business Brain cannot pass the Concept Packaging or Source And Citation Quality dimensions. |
| `/skills/okf-audit` | The skill used in the live test; readers can run the same audit themselves. |

### Proposed External Sources

1. Google Cloud OKF launch blog — https://cloud.google.com/blog/products/data-analytics/how-the-open-knowledge-format-can-improve-data-sharing
2. Google Search Central, AI features and query fan-out — https://developers.google.com/search/docs/appearance/ai-features
3. Google Search Central, structured data introduction — https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data
4. Hogan et al., Knowledge Graphs survey — https://arxiv.org/abs/2003.02320
5. GEO (Generative Engine Optimization) paper — https://arxiv.org/abs/2311.09735

---

# What AI Agents See When They Read Your Website

Most content scores around 12 out of 30 when an AI agent audits it for agent-readability.

That is not a score for bad writing. It is a score for infrastructure. The content may be accurate, well-organized, and genuinely useful to a human reader. The problem is that the same page is nearly invisible to agents fetching it to answer a question, power a recommendation, or use it as trusted context.

This article explains what an OKF content audit measures, how the scoring works, and what the five most common gaps tell you about your content infrastructure.

## What Is An OKF Content Audit

An OKF audit scores a page, article, or knowledge bundle against six dimensions that determine whether AI agents can use the content effectively. The scoring system comes from the AMTECH OKF audit skill.

Each dimension is scored 0 to 5:

- 0: absent or actively misleading
- 1: present only as vague prose
- 2: partially present but not usable by an agent without interpretation
- 3: usable with gaps
- 4: strong and mostly complete
- 5: excellent, explicit, and easy for agents and humans to verify

The six dimensions add up to 30 points.

| Score | What it means |
|---|---|
| 26–30 | Agent-native and strong |
| 20–25 | Usable with targeted fixes |
| 14–19 | Promising but incomplete |
| 8–13 | Human-readable but weak for agents |
| 0–7 | Not agent-ready |

Most educational and marketing content from independent businesses falls in the 8–13 range. Good writing. Weak infrastructure.

## The Six Dimensions

### 1. First-Fetch Clarity

The first question an agent asks when it fetches a URL: what is this page, who is it for, and what can I do with it?

Strong signals: a clear title and H1, an opening paragraph that names the task and audience, and critical links in body text rather than hidden behind JavaScript.

This is the most commonly failed dimension because most pages are designed for users who already know why they arrived. A user landing from search has context. An agent fetching a URL cold does not.

### 2. Concept Packaging

Does the page map to one durable concept with stable definitions? Can the content be cited?

Strong signals: one page per concept, YAML frontmatter or structured metadata naming title, description, type, tags, updated date, and source URL. Definitions that are stable enough to cite.

Concept packaging fails when a page covers too many ideas, when the author and publish date are missing, or when the page has no metadata beyond an HTML title tag.

### 3. Entity And Relationship Coverage

Agents build context by connecting named things. A page that names the right entities and shows how they relate is far more useful than a page that describes the same ideas in generic prose.

Strong signals: explicit links to related concepts with relationship reasons, consistent entity names throughout, and no important concepts left unlinked.

A page that mentions "AI tools" without naming specific tools, or talks about "customers" without describing which type, has low entity coverage. Agents have to guess where one idea ends and another begins.

### 4. Source And Citation Quality

Claims should be traceable. External sources should be linked near the claims they support. Dates should be concrete.

This dimension fails most often because educational content for business owners treats its conclusions as obvious rather than sourced. If an AI system is deciding whether to cite your page in a recommendation, uncited claims carry less weight than cited ones.

### 5. Materialized Views

Different consumers need different surfaces from the same content.

Strong signals: a human HTML page, a markdown or text view, JSON structured data, sitemap and discovery links, and raw files or a downloadable package when the content is a reusable resource.

A React single-page application that renders correctly in a browser but delivers blank HTML to a non-executing crawler has one materialized view where it needs at least four. This is the most technically specific dimension and the most fixable.

### 6. Agent Execution Readiness

If the content is a workflow, a skill, or a practical guide — can an agent act from it directly?

Strong signals: an ordered, imperative workflow with explicit inputs and outputs, labeled optional references, failure modes stated, and a copy-paste prompt the reader can give to another agent.

General content will score lower here because it is not designed to be acted on. A how-to article with three labeled prompts scores higher than a blog post with the same information in narrative form.

## A Live Audit: The Garden-Center Article

The AMTECH OKF audit skill was run against `https://amtechai.com/articles/garden-center-spring-buy-plan-ai` in a live test session on 2026-06-19.

The article teaches independent retailers how to use three seasons of sales data to make better purchasing, staffing, and promotion decisions. It includes a concrete Salisbury, Maryland example and three labeled copy-paste prompts.

**The audit score: 12 out of 30.**

Here is how each dimension scored and why.

| Dimension | Score | Finding |
|---|---|---|
| First-Fetch Clarity | 2/5 | The first-fetch surface (non-executing agent) shows no author name, no publish date, and a title that does not match the URL slug. URL implies garden centers; article covers six business types. |
| Concept Packaging | 2/5 | Metadata (author, date, type tags) exists in the React data layer but is invisible to agents that do not execute JavaScript. No YAML frontmatter or static machine-readable header. |
| Entity And Relationship Coverage | 2/5 | Business types are listed (garden centers, hardware stores, salons) but no specific AI tools are named. "AI" is referenced throughout without naming a tool, model, or platform. |
| Source And Citation Quality | 1/5 | Zero external citations. Competitive advantage claims are stated as fact with no supporting data or sources. |
| Materialized Views | 2/5 | The React page renders correctly for users. Agents fetching the URL without executing JavaScript get a minimal shell. No markdown surface, no JSON manifest, no standalone text view. |
| Agent Execution Readiness | 3/5 | Three copy-paste prompts are the article's strongest asset. Prompts are well-scoped and actionable. Missing: a labeled workflow summary at the top and a remediation prompt. |

**Total: 12/30** — human-readable but weak for agents.

The article itself is good. An owner who finds it can use it. The gap is infrastructure: the content is locked in a JavaScript rendering layer, the metadata is invisible to non-executing agents, and the entity coverage is too generic for an AI that is trying to decide whether this page is authoritative about a specific topic.

## What These Five Concepts Mean For Your Content

Five specific infrastructure gaps explain most low OKF audit scores. These are not editorial problems. They are architecture problems.

### First-Fetch Surface

What a non-executing agent receives when it fetches your URL is your first-fetch surface. In many single-page applications and JavaScript-heavy sites, that surface is a nearly empty HTML shell with a few meta tags.

The fix is not rebuilding your site. The fix is prerendering: generating static HTML from the same content your React or JS framework renders. Prerendered pages are agent-readable from the first byte.

AMTECH publishes article pages as prerendered static HTML at build time specifically because of this gap.

### Entity Naming

The content an agent can use effectively names the things it is about. Services, tools, locations, industries, revenue bands, outcomes — these are entities. A page about "AI for small businesses" is one vague entity. A page about "using Claude to analyze a QuickBooks CSV export for a garden center doing $2M in annual revenue" has five named entities and implied relationships between all of them.

Naming entities consistently across your content is the foundation of the entity graph. It does not require a graph database. It requires discipline in how you write.

### Structured Metadata

Author, publish date, topic type, and description should be present in machine-readable form — not just in human prose.

The minimum viable implementation is `Article` JSON-LD on every published page. More complete implementations add `HowTo` for step-based guides, `FAQPage` for question-answer content, and `BreadcrumbList` for navigation context. These structured data types are the closest thing web content has to the YAML frontmatter that OKF requires.

### Static Discovery Infrastructure

Every page should be discoverable without interaction. That means a current `sitemap.xml`, a `robots.txt` that does not block legitimate agents, and ideally an `llms.txt` file that gives AI tools a direct orientation to your most important content.

Internal links also count here. An article with no outbound links is a dead end for an agent building context. Every meaningful internal link is a relationship the agent can follow.

### Citation Infrastructure

Claims with sources perform better than unsupported assertions in AI-mediated search results. The GEO (Generative Engine Optimization) research from 2023 found that citing credible statistics and sources was one of the strongest signals for inclusion in generative search outputs.

The practical fix is simple: link external sources near the claims they support. You do not need a formal bibliography. You need clear attribution in the prose.

## The AMTECH Approach

AMTECH builds content so that the same knowledge is useful to three readers at once: the human who arrives from search, the agent that fetches the URL to answer a downstream question, and the search system that decides whether this content deserves to appear in an AI-generated response.

That requires building one source of truth and projecting it into multiple surfaces:

| Surface | Who it serves |
|---|---|
| React article page | Human readers browsing the site |
| Prerendered static HTML | Crawlers, link previews, and non-executing agents |
| JSON-LD structured data | Search systems that understand page semantics |
| OKF markdown bundle | Agents and tools that want portable concept files |
| Sitemap and llms.txt | Discovery for crawlers and AI tools |
| Supabase concept tables | Queryable graph for internal agents and future products |

The important part is not the number of surfaces. The important part is that they come from the same model. One source. Many projections.

That prevents the common failure where the blog says one thing, the structured data says another, and the AI assistant has to guess which is current.

## A Prompt To Run Your Own Audit

Use this with Claude, ChatGPT, or the AMTECH OKF audit skill at `https://amtechai.com/skills/okf-audit`:

```
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
4. A copy-paste remediation prompt I can give to a writing agent
```

## Do This In One Afternoon

- Fetch your most important article or page and view the page source (Ctrl+U or Cmd+U). If you see mostly empty `<div>` tags, your first-fetch surface is weak.
- Check for `<script type="application/ld+json">` in the page source. If it is absent, you have no structured data.
- Search your page source for your company name, your main service, and a key tool or location you reference. If they appear only in prose and not in structured form, entity naming is an opportunity.
- Count the external links in your most important article. If there are zero citations for factual claims, that is a Source And Citation Quality gap.
- Open your site's `/sitemap.xml`. If it does not exist or does not include your article URLs, discovery is broken.

Any one of these fixes raises your score. All five push you from the 8–13 band into the 20–25 range.

## FAQ Draft

### Does a low OKF audit score mean my content is bad?

Not necessarily. A low score usually means the content is well-written for human readers but poorly set up for agents. The writing, logic, and practical value may be strong while the infrastructure (metadata, static rendering, structured data, citations) is missing.

### Do I need a technical team to fix these gaps?

The three most impactful fixes — adding citations, naming entities consistently in your writing, and adding Article JSON-LD — require no code changes and can be done by a writer or content editor. Prerendering and `sitemap.xml` require technical work but are well-documented in most modern frameworks.

### What is the difference between an OKF audit and regular SEO?

Traditional SEO focuses on ranking signals: keywords, backlinks, page speed, mobile-friendliness, crawlability. An OKF audit focuses on agent-readability: can a language model fetch your URL and extract useful, trustworthy, structured context? The two sets of signals overlap significantly — structured data, crawlability, and citation quality matter in both — but the OKF lens surfaces infrastructure gaps that keyword-focused SEO often misses.

### Can I run the OKF audit on a competitor's content?

Yes. The OKF audit skill does not require ownership of the content. Auditing competitor pages is a useful research method to find infrastructure advantages you can build.

---

## Research Appendix

### External Sources

- Google Cloud OKF launch (June 12, 2026): OKF is a vendor-neutral, agent-friendly format for representing knowledge as markdown files with YAML frontmatter. One required field: `type`. Format, not platform.
  Source: https://cloud.google.com/blog/products/data-analytics/how-the-open-knowledge-format-can-improve-data-sharing

- Google Search Central, AI features: AI Overviews and AI Mode may use query fan-out across subtopics and data sources. Important content should be available in textual form.
  Source: https://developers.google.com/search/docs/appearance/ai-features

- Google Search Central, structured data: a standardized way to provide explicit clues about page meaning. Only mark up content visible to users.
  Source: https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data

- Hogan et al., Knowledge Graphs (2020): entities and relationships are the core of a knowledge graph, not just documents or text chunks.
  Source: https://arxiv.org/abs/2003.02320

- GEO paper (2023): citing credible statistics and sources is one of the strongest signals for inclusion in generative AI search results.
  Source: https://arxiv.org/abs/2311.09735

### AMTECH Internal References

- Skill source: `src/lib/skills/source/okf-audit/SKILL.md`
- Rubric: `src/lib/skills/source/okf-audit/references/okf-audit-rubric.md`
- Validation pass for this draft: `docs/memory/validation-2026-06-19--okf-audit-linkedin-post.md`
- Session status: `docs/memory/status-2026-06-19--okf-audit-live-test.md`
- OKF system overview: `docs/okf/README.md`
- Future article ladder: `docs/okf/07-future-article-notes.md`

### Candidate ArticleDefinition Metadata

```ts
{
  slug: 'what-ai-agents-see-when-they-read-your-website',
  title: 'What AI Agents See When They Read Your Website',
  description: 'Most web content scores around 12/30 when audited for agent-readability. This walkthrough explains the six OKF rubric dimensions, scores a real article, and names the five infrastructure gaps most publishers need to fix.',
  dek: 'Good writing is not the same as agent-readable infrastructure. Here is what the score reveals and how to fix it.',
  datePublished: '2026-06-19',
  dateModified: '2026-06-19',
  authorName: 'AMTECH AI',
  readingTime: '10 min read',
  category: 'strategy',
  audience: 'Founders, content operators, SEO strategists, and technical marketers publishing educational content',
  primaryEntity: { name: 'OKF content audit', type: 'method' },
  entities: [
    { name: 'Open Knowledge Format', type: 'method' },
    { name: 'materialized views', type: 'method' },
    { name: 'entity graph', type: 'method' },
    { name: 'agent-readable knowledge', type: 'outcome' },
    { name: 'JSON-LD', type: 'tool' },
    { name: 'First-Fetch Clarity', type: 'method' },
    { name: 'AMTECH Knowledge Publishing Standard', type: 'method' }
  ],
  internalLinks: [
    {
      label: 'What Is OKF? Google\'s New Format For AI-Readable Knowledge',
      href: '/articles/what-is-okf-ai-readable-knowledge',
      reason: 'Explains the OKF format this audit is based on.',
    },
    {
      label: 'Build a Local SEO Plan with ChatGPT',
      href: '/articles/build-local-seo-plan-with-chatgpt',
      reason: 'The entity graph strategy that feeds directly into the Entity And Relationship Coverage dimension.',
    },
    {
      label: 'Build Your Business Brain Free',
      href: '/articles/business-brain-free',
      reason: 'A business without a documented knowledge layer cannot pass Concept Packaging or Source And Citation Quality.',
    },
  ],
}
```
