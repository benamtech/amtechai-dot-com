# Mapping the AMTECH Article System to OKF

This is the crosswalk. It establishes how close we already are (closer than expected) and isolates the real gaps. Source files referenced: `src/lib/articles.ts`, `src/lib/articleKnowledgeGraph.ts`, `src/components/articles/ArticlePage.tsx`, `docs/seo/AMTECH_MASTER_KNOWLEDGE_GRAPH.md`, `docs/seo/KNOWLEDGE_GRAPH_SEO_RESEARCH.md`.

## 1. The headline finding

Our `ArticleDefinition` is a richer, typed superset of an OKF concept's frontmatter, and our knowledge graph already encodes both node kinds (articles **and** entities) plus edges. We are not missing the *model*. We are missing the *serialization* (markdown bundle) and the *substrate* (static HTML + a database). OKF conformance is, for us, mostly an emit-and-host problem, not a remodel.

## 2. Concept-level crosswalk

| OKF construct | AMTECH equivalent today | Fit |
| --- | --- | --- |
| Concept document (one `.md` per thing) | One `ArticleDefinition` per article; one `KnowledgeGraphNode` per planned/published node | Articles map 1:1. Entities are not yet their own documents (they live inline in `entities[]`). |
| `type` (required) | `category` (`first-action`, `strategy`, `comparison`…) for articles; node `type`/`typeLabel` (T1–T8) for graph nodes | Direct. Pick the OKF `type` vocabulary deliberately (see §4). |
| `title` | `title` | Direct. |
| `description` | `description` | Direct. |
| `resource` (canonical URI of the thing) | the live URL `https://amtechai.com/articles/<slug>` (built in `buildArticleSchema`) | Direct. For abstract entities, omit or point to a hub. |
| `tags` | `entities[].name` + `category` + `audience` + city/subtype/UC | We have *more* than tags; tags are a lossy flattening of our entity list. |
| `timestamp` | `dateModified` (and `datePublished`) | Direct (ISO 8601 already). |
| arbitrary producer keys | `audience`, `readingTime`, `primaryEntity`, `uc`, `mechanism`, `city`, `subtype` | Carry these as `okf_*`/custom frontmatter keys; OKF preserves unknown keys. |
| Body: `# Schema` | n/a for articles; analog is structured `table` blocks | Use conventional sections where they fit; otherwise body = rendered blocks. |
| Body: `# Examples` | `prompt` blocks, `table` blocks, checklists | Maps to `# Examples` cleanly for prompt/estimate articles. |
| Body: `# Citations` | `citations: [{ label, url, publisher }]` | Direct — render as the numbered `# Citations` list. |
| Cross-link (relationship in prose) | `internalLinks: [{ href, label, reason }]` and graph `connectsTo: []` | **Best-fit in the whole spec.** `reason` *is* OKF's prose-borne edge semantics. |
| `index.md` (progressive disclosure) | `/articles` "Browse by topic" + `/articles/all` + `articleTopicGroups` | We already author the index by hand; OKF wants one per directory. |
| `log.md` (per-directory history) | git history + `docs/memory/status-*.md` | We have the data (git); not emitted as `log.md`. |
| Bundle (directory / git repo) | none — there is no markdown bundle today | **Gap.** Must be emitted. |
| Conformance (parseable frontmatter + `type`) | n/a | Trivial once we emit. |

## 3. Block-type → markdown mapping

`ArticleContentBlock` variants render to structural markdown for the body:

| Block | OKF body markdown |
| --- | --- |
| `answer` | Lead paragraph (optionally under a `# Answer` heading). |
| `section` | `## {title}` + paragraphs. |
| `table` | Markdown table (and, where columns are field/type/desc, a `# Schema`). |
| `callout` | Blockquote, prefixed by tone (`> **Warning:** …`). |
| `checklist` | `- [ ]`/`-` list under `## {title}`. |
| `prompt` | Fenced code block under `# Examples`. |
| `faqs` | `## FAQ` with `### {question}` + answer (also stays in JSON-LD `FAQPage`). |

All of this is mechanical once articles are data we can walk.

## 4. The `type` vocabulary decision

OKF types are uncentralized free strings. We should choose a small, stable vocabulary and use it consistently (the visualizer color-codes by `type`, and agents group by it):

- For **articles**, the OKF `type` = our `category`, title-cased: `First Action`, `Local Condition`, `Material Surface`, `Compliance`, `Comparison`, `Field Note`, `Strategy`. (Or a single `Article` type with `category` as a custom key — decide in the plan; finer types give a better graph viz.)
- For **entities** (newly promoted to documents): use our existing `ArticleEntity.type` set — `Service`, `Problem`, `Industry`, `Place`, `Method`, `Customer`, `Tool`, `Outcome`, `Business`.
- For **use cases** UC1–UC10: `Use Case`.
- For **playbook nodes** N1–N40: `Playbook`.
- For external sources we want as first-class nodes: `Reference`.

## 5. The real gaps (everything else is mechanical)

1. **No markdown/bundle serialization.** Nothing emits OKF. *(Build-time emitter — Phase 1.)*
2. **No static HTML / agent-readable surface.** SPA renders only `dist/index.html`; no `sitemap.xml`, `robots.txt`, `llms.txt`. Non-JS crawlers and many agents see nothing. *(Prerender step — Phase 1, and it benefits classic SEO immediately.)*
3. **Entities are inline, not concepts.** `primaryEntity`/`entities[]` are attributes of articles, not standalone nodes, so the entity graph is implicit. OKF (and entity SEO) want each entity as its own document with its own backlinks. *(Promote entities — Phase 2.)*
4. **Content is code, not data.** Articles are TS objects / TSX. No store to project from; every new article is a code change. *(Supabase storage — Phase 2/3.)*
5. **Edges are partial and bidirectional-by-hand.** `connectsTo` exists on graph nodes but not on `ArticleDefinition`; backlinks are not derived. OKF tolerates this (broken/one-way links are legal), but a good bundle wants resolved backlinks. *(Derive edges at emit time.)*
6. **No `log.md` projection.** We have git history and status memos but emit no per-directory change log. *(Generate from git/`dateModified` — low priority; OKF makes it optional.)*

## 6. What we already satisfy (do not rebuild)

- Direct-answer-first structure, diagnostic tables, "what not to do," DIY-vs-expert thresholds, FAQ, citations — our `ARTICLE_SYSTEM.md` required structure already exceeds OKF's content expectations.
- Entity modeling with a typed vocabulary (`ArticleEntity.type`).
- Relationship-with-reason links (the hardest OKF concept to retrofit — we have it).
- JSON-LD via `buildArticleSchema` (keep it; it serves the classic-SEO path that OKF does not touch).
- A hand-curated progressive-disclosure index (`/articles`, `/articles/all`, `articleTopicGroups`).
- An internal-bundle habit (`AGENTS.md`, `codegraph.json`, `wiki/`, `docs/memory/`) that is already OKF-spirited.

> Conclusion: the adaptation is **additive**. We keep `ArticleDefinition` and `ArticlePage.tsx`, keep JSON-LD, keep the React experience. We add: a canonical store, a set of build-time projections (HTML, bundle, sitemaps), and a one-time promotion of entities to first-class nodes. Sequencing is in [`03-adaptation-plan.md`](./03-adaptation-plan.md).
