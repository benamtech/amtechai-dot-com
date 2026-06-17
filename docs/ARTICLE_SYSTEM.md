# AMTECH Article System

The article system is a lightweight TSX-first publishing workflow for AMTECH’s knowledge graph SEO strategy. It lets agents turn approved copy into visually consistent, schema-ready, internally linked article pages without inventing a CMS yet.

## Files

- `src/lib/articles.ts` defines the article data contract, entity model, link model, citation model, FAQ model, and shared JSON-LD schema builder.
- `src/components/articles/ArticlePage.tsx` renders the article layout, answer block, sections, tables, callouts, checklists, FAQ, citations, internal links, entity panel, and JSON-LD.
- `docs/seo/KNOWLEDGE_GRAPH_SEO_RESEARCH.md` explains the research-backed SEO doctrine agents should follow before publishing articles.

## Article categories

Use the closest category for each page:

- `first-action` — “What should I do right now?” pages.
- `local-condition` — local market, climate, infrastructure, or behavior pages.
- `material-surface` — pages about how a problem changes by asset, material, system, or environment.
- `compliance` — laws, platform rules, industry requirements, or official guidance.
- `comparison` — decision pages comparing options.
- `field-note` — lessons from real operating observations with privacy preserved.
- `strategy` — AMTECH thought leadership, frameworks, and owner education.

## Visual block types

Agents should compose articles from these visible blocks:

```ts
{ type: 'answer', body: 'The first 80 words answer the question directly.' }
{ type: 'section', id: 'why-it-matters', eyebrow: 'Context', title: 'Why it matters', body: ['Paragraph one.'] }
{ type: 'table', id: 'diagnostic-table', title: 'Diagnostic table', columns: ['Symptom', 'Likely cause', 'First move'], rows: [['...', '...', '...']] }
{ type: 'callout', title: 'Do not do this', body: 'A specific warning.', tone: 'warning' }
{ type: 'checklist', id: 'publish-checklist', title: 'Before you move forward', items: ['Item one'] }
```

## Required article structure

Every article should include:

1. A direct answer block near the top.
2. At least one diagnostic table or decision framework.
3. Specific sections that add useful distinctions, not filler.
4. A “what not to do” warning when the reader might make an expensive mistake.
5. A DIY/internal threshold versus expert threshold.
6. Internal links with reasons.
7. Citations when using third-party facts or official guidance.
8. FAQ entries when the page answers visible questions.
9. Schema generated through `buildArticleSchema`.

## Example implementation pattern

Create a page-specific article definition, then render the shared component:

```tsx
import ArticlePage from '../components/articles/ArticlePage';
import { ArticleDefinition } from '../lib/articles';

const article: ArticleDefinition = {
  slug: 'why-ai-follow-up-agents-miss-less-revenue',
  title: 'Why AI Follow-Up Agents Miss Less Revenue Than Manual Follow-Up',
  description: 'A practical guide for small-business owners evaluating AI follow-up systems.',
  dek: 'Most lead leakage is not a lead problem. It is a timing, ownership, and memory problem.',
  datePublished: '2026-06-17',
  dateModified: '2026-06-17',
  authorName: 'AMTECH AI',
  readingTime: '7 min read',
  category: 'strategy',
  audience: '$500K-$25M small-business owners who want more efficient operations',
  primaryEntity: { name: 'AI follow-up agents', type: 'service' },
  entities: [
    { name: 'lead leakage', type: 'problem' },
    { name: 'local service businesses', type: 'industry' },
    { name: 'owner bottleneck', type: 'problem' },
  ],
  internalLinks: [
    { label: 'Schedule a call', href: '/schedule-call', reason: 'Talk through where your current follow-up process leaks revenue.' },
  ],
  citations: [],
  faqs: [
    { question: 'Can an AI follow-up agent replace a salesperson?', answer: 'Usually no. It should protect response speed, reminders, qualification, and handoff so the human salesperson spends more time on real decisions.' },
  ],
  blocks: [
    { type: 'answer', body: 'AI follow-up agents reduce missed revenue by responding faster, remembering every lead, and escalating the right conversations back to a human.' },
  ],
};

export default function FollowUpArticle() {
  return <ArticlePage article={article} />;
}
```

## Routing note

This change intentionally does not create the AMTECH graph or publish live articles. When publishing begins, add article routes under `/articles/<slug>` in `src/App.tsx` and create an index route only after there are enough pages to make a useful hub.

## Quality bar

The page should feel like AMTECH has actually diagnosed the problem in the field. It should be direct, specific, premium, and useful to an owner who wants to understand the system before hiring experts to build it.
