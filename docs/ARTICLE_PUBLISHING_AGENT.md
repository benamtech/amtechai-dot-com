# AMTECH Article Publishing Agent Workflow

Purpose: reusable instructions for agents that receive article copy in chat or files and need to publish it into AMTECH's article system, knowledge graph, OKF bundle, prerendered article surface, and Supabase knowledge projection.

Use this workflow when the input is pasted text, markdown, HTML, XML, JSON, a draft outline, or edited article copy. The agent's job is not only to format the article. The agent must convert the copy into AMTECH's knowledge publishing standard.

## Start Here

Before editing code, read:

1. `docs/codegraph.md`
2. `docs/ARTICLE_SYSTEM.md`
3. `docs/seo/KNOWLEDGE_GRAPH_SEO_RESEARCH.md`
4. `docs/seo/AMTECH_MASTER_KNOWLEDGE_GRAPH.md`
5. `docs/okf/README.md`
6. `docs/okf/04-validation-and-phase-gates.md`
7. `docs/memory/fast-navigation-and-doc-sync.md`

For OKF/agentic-search articles, also read `docs/okf/07-future-article-notes.md`.

## Publishing Standard

Every AMTECH article must become a concept in the public knowledge graph. A finished article is not done until all of these are true:

- It has a React-free `ArticleDefinition` in `src/lib/knowledge/articles/`.
- It is included in `src/lib/knowledge/articles/index.ts`.
- It has a route under `/articles/<slug>` using a thin React wrapper page.
- It has a published `KnowledgeGraphNode` in `src/lib/articleKnowledgeGraph.ts`.
- Its internal links encode real graph edges with `reason` text.
- Its entities are explicit in `primaryEntity` and `entities`.
- Its citations back third-party claims.
- `npm run okf:check` regenerates and validates `public/okf/**`, `public/sitemap.xml`, `public/robots.txt`, and `public/llms.txt`.
- `npm run build` prerenders the article route and verifies the site build.
- If the Supabase projection must stay current, `npm run okf:db:seed-sql` is applied through a service-role path and `npm run okf:db:verify` passes.

## Input Normalization

Accept the user's supplied copy as authoritative raw material, regardless of format.

- Markdown: preserve headings, lists, tables, prompts, and links.
- HTML: extract visible text, headings, tables, links, and citations; ignore styling wrappers.
- XML/JSON: parse structure semantically; do not stringify it into prose if it contains fields that map to article metadata.
- Plain pasted text: infer sections from paragraphs, transitions, and repeated phrases.
- Mixed chat notes: separate claims, examples, instructions, sources, and desired positioning.

Do not publish raw copy unchanged. Convert it into AMTECH's answer-first article system.

## Article Strategy Pass

Before writing the `ArticleDefinition`, identify:

- `slug`: short, lowercase, hyphenated, stable.
- `category`: one of `first-action`, `local-condition`, `material-surface`, `compliance`, `comparison`, `field-note`, `strategy`.
- `audience`: specific operator/owner/technical reader, not generic "businesses".
- `primaryEntity`: the main thing the article teaches.
- `entities`: services, problems, industries, places, methods, customers, tools, outcomes, and businesses.
- `graph role`: anchor, tactical prompt guide, comparison, local proof, use-case explainer, technical proof, or standard/spec article.
- `search intent`: the question this page should answer directly.
- `information gain`: what this page says that a generic AI article does not.
- `next action`: what the reader should do after understanding the page.

If the copy lacks enough specificity, add a concise direct-answer framing and decision structure. Do not pad with generic AI marketing.

## Content Shape

Every article should include:

- A direct `answer` block near the top.
- At least one `table` block that helps diagnose, compare, or decide.
- Specific `section` blocks with useful distinctions.
- A `callout` warning for common expensive mistakes when relevant.
- A `checklist` for implementation or decision readiness when relevant.
- Prompt blocks for tactical articles where the reader expects copyable prompts.
- FAQs only when the article visibly answers those questions.

Use the block types defined in `src/lib/articles.ts`:

```ts
{ type: 'answer', body: '...' }
{ type: 'section', id: '...', eyebrow: '...', title: '...', body: ['...'] }
{ type: 'table', id: '...', title: '...', columns: ['...'], rows: [['...']] }
{ type: 'callout', title: '...', body: '...', tone: 'warning' }
{ type: 'checklist', id: '...', title: '...', items: ['...'] }
{ type: 'prompt', id: '...', title: '...', helper: '...', body: '...' }
```

## Knowledge Graph Work

Internal links are graph edges. Do not use generic "read more" links.

For each article, choose links that satisfy at least two of these when possible:

- Up to the broad workflow anchor.
- Sideways to a related entity, place, industry, or comparison.
- Down to a practical playbook or prompt guide.
- Forward to a conversion route only when the article naturally creates that next action.

Each link must include a `reason` that names the relationship, for example:

```ts
{
  label: 'Build a Business Brain first',
  href: '/articles/business-brain-free',
  reason: 'Shows the durable context layer an AI Employee or agent-readable knowledge system needs before automation.'
}
```

When adding the published node in `src/lib/articleKnowledgeGraph.ts`:

- Use a new stable ID (`E9`, `E10`, etc.) for published articles.
- Set `status: 'published'`.
- Set `href` to `/articles/<slug>`.
- Use `connectsTo` to encode related node IDs, not URLs.
- Keep `description`, `mechanism`, `topic`, and `audience` concrete.
- Add the article to the most relevant `articleTopicGroups`.

If the article introduces a durable new use case, place, industry, or concept family, update `src/lib/knowledge/entities.ts` only when it should become a first-class concept. Do not create ad-hoc concept types without updating `ALLOWED_CONCEPT_TYPES` and the OKF validation rationale.

## File Implementation Pattern

Create the React-free article data:

```text
src/lib/knowledge/articles/<slug>.ts
```

Export:

```ts
import type { ArticleDefinition } from '../../articles';

export const article: ArticleDefinition = {
  slug: '<slug>',
  title: '...',
  description: '...',
  dek: '...',
  datePublished: 'YYYY-MM-DD',
  dateModified: 'YYYY-MM-DD',
  authorName: 'AMTECH AI',
  readingTime: 'X min read',
  category: 'strategy',
  audience: '...',
  primaryEntity: { name: '...', type: 'method' },
  entities: [],
  internalLinks: [],
  citations: [],
  faqs: [],
  blocks: [],
};
```

Add it to:

```text
src/lib/knowledge/articles/index.ts
```

Create a thin wrapper page:

```text
src/pages/articles/<PascalCasePageName>.tsx
```

Pattern:

```tsx
import ArticlePage from '../../components/articles/ArticlePage';
import { useArticleHead } from '../../components/articles/useArticleHead';
import { article } from '../../lib/knowledge/articles/<slug>';

export default function ArticlePageName() {
  useArticleHead(article);
  return <ArticlePage article={article} />;
}
```

Add the route to `src/App.tsx`.

## Citation Rules

Use citations when the article relies on:

- Official platform behavior.
- Laws, regulations, or policy.
- Academic research.
- Market statistics.
- Claims about Google, AI Overviews, OKF, schema.org, or other external systems.
- Third-party technical claims.

Prefer primary sources. For technical standards and platform behavior, use official docs when available.

Do not overquote. Paraphrase and cite. Keep the visible article useful even if the reader never opens the source.

## OKF And Generated Surfaces

The OKF bundle is generated output. Never hand-edit `public/okf/**`.

After article/graph edits, run:

```bash
npm run okf:check
npm run build
```

Expected generated or touched surfaces can include:

- `public/okf/articles/<slug>.md`
- `public/okf/articles/index.md`
- `public/okf/index.md`
- `public/sitemap.xml`
- `public/llms.txt`
- `dist/articles/<slug>/index.html` after build

Commit generated `public/` artifacts when they change. Do not commit `dist/` unless the repo convention changes.

## Supabase Projection

The current architecture is façade-as-source, DB-as-projection. The browser does not write or query the `concepts*` tables.

When the user asks to keep the live Supabase projection current, or when publishing work is intended to ship fully:

1. Run `npm run okf:db:seed-sql`.
2. Apply the emitted SQL through a service-role-safe path.
3. Run `npm run okf:db:verify`.

Never place a service role key in `src/` or any `VITE_*` variable.

## Verification Checklist

Before final response:

- `npm run typecheck`
- `npm run okf:check`
- `npm run build`
- `npm run lint` when the change touches enough code to justify it or when requested

If any command cannot run because dependencies or credentials are missing, state that clearly and report what did run.

## Final Response Checklist

Summarize:

- Article slug and route.
- Article graph role.
- New/updated files.
- Generated OKF/discovery outputs.
- Validation commands run.
- Any Supabase projection step skipped or completed.

Do not say the article is published unless the route, article data, graph node, generated OKF/discovery files, and build validation are complete.
