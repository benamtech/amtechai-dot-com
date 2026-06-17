# Knowledge Graph SEO Research Notes for AMTECH Articles

This is the research foundation for the AMTECH article system. It is intentionally not a finished AMTECH knowledge graph. It is the operating doctrine agents should use before creating or scaling articles.

## Current search reality

1. **AI search still starts from search quality systems.** Google states that AI features in Search are rooted in its core ranking and quality systems, so article work must still satisfy classic SEO fundamentals: crawlable pages, helpful content, accurate titles, fast rendering, useful links, and clear source attribution.
2. **AI Overviews and AI Mode can use query fan-out.** Google documents that AI Overviews and AI Mode may issue multiple related searches across subtopics and data sources. This rewards pages that answer adjacent questions, define entities clearly, and fit into a broader topical graph rather than one isolated keyword.
3. **Structured data clarifies entities; it does not create authority by itself.** Google says structured data helps it understand page content and the world, but the markup must describe visible content. AMTECH article schema should label what is genuinely on the page: the article, FAQs, breadcrumbs, cited sources, entities discussed, services, and organization identity.
4. **People-first content remains the quality floor.** Google’s helpful-content guidance emphasizes original, useful, reliable content made for people. For AMTECH, this means answer-first copy, operator-level specificity, practical examples, source-backed claims, and no thin AI-written filler.
5. **Knowledge graph SEO is entity architecture plus evidence.** The goal is not to stuff schema into pages. The goal is to repeatedly connect AMTECH and its clients to the entities they actually serve: services, industries, problems, places, tools, customer types, outcomes, methods, proof, and external references.

## Sources reviewed

- Google Search Central: AI features and query fan-out — https://developers.google.com/search/docs/appearance/ai-features
- Google Search Central: structured data introduction — https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data
- Google Search Central: structured data search gallery — https://developers.google.com/search/docs/appearance/structured-data/search-gallery
- Google Search Central: helpful, reliable, people-first content — https://developers.google.com/search/docs/fundamentals/creating-helpful-content
- Google Search Central: AI-generated content guidance — https://developers.google.com/search/blog/2023/02/google-search-and-ai-content
- Google Business Profile Help: local ranking relevance, distance, and prominence — https://support.google.com/business/answer/7091
- Google Patents: contextual estimation of link information gain — https://patents.google.com/patent/US20200349181A1/en

## Practical implications for AMTECH

### 1. Build answer assets, not blog posts

Every article should answer a specific question for a small-business owner in the AMTECH ICP. The page should make the reader smarter even if they never book a call. If an article exists only to capture traffic, it is off-strategy.

Required content pattern:

```text
Direct answer
Diagnostic table
Specific instructions or decision framework
What not to do
Business impact
DIY/internal threshold vs expert threshold
Internal links
External citations where claims rely on third-party facts
FAQ
JSON-LD schema
```

### 2. Optimize for entity relationships

Each article should strengthen a clear relationship, such as:

```text
AMTECH → AI employees → missed-call follow-up → local contractors
AMTECH → entity SEO → service-area architecture → small local businesses
AMTECH → automation → owner bottleneck → $1M-$5M revenue businesses
AMTECH → CRM cleanup → lead leakage → home service companies
```

Agents should explicitly list these relationships in the article data before writing the page.

### 3. Use information gain as the publishing bar

Before adding an article, ask what it contributes that a generic article does not. Good information gain comes from:

- A sharper distinction.
- A practical checklist.
- A specific operating scenario.
- A local or industry-specific constraint.
- A comparison that helps the owner decide.
- A source-backed answer to a question competitors hand-wave.

### 4. Use schema conservatively and visibly

Supported schema for the article system:

- `Article` for every article page.
- `BreadcrumbList` for every article page.
- `FAQPage` only when the visible article includes an FAQ section.
- `Organization` as the publisher entity.
- `Thing` in `about` for visible entities discussed in the article.

Future versions can add `Service`, `HowTo`, `LocalBusiness`, or `Dataset` only when the visible page and page purpose justify it.

### 5. Internal links are graph edges

Internal links should not be generic “read more” links. Each link should state why the relationship exists:

- Link to a service page when the article describes a problem AMTECH solves.
- Link to a related article when it expands a nearby subtopic.
- Link to a pricing, calculator, contact, or scheduling page only when it is the natural next action.

### 6. External citations are trust edges

Use external citations when the article makes a claim based on official guidance, legal/regulatory facts, platform documentation, statistics, medical/legal/financial risk, or third-party research. Prefer primary sources over commentary.

## Agent publishing checklist

When the user says, “Here is a new article titled X; turn it into an article,” the agent should:

1. Identify the article type: first-action, local-condition, material-surface, compliance, comparison, field-note, or strategy.
2. Identify the target ICP and the question being answered.
3. Map entities: primary entity, related entities, business outcomes, services, industries, tools, places if relevant.
4. Choose internal links based on real relationships.
5. Add external citations only when needed, using primary sources where possible.
6. Convert the copy into the article data structure in `src/lib/articles.ts` and render it with `src/components/articles/ArticlePage.tsx`.
7. Add matching schema through the shared schema builder instead of hand-writing JSON-LD per page.
8. Confirm no schema claims are invisible or unsupported by the article body.
9. Run typecheck and build before commit.
