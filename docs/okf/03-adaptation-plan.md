# Adaptation Plan: One Canonical Model, Many Projections

This is the implementation plan to make AMTECH's knowledge OKF-conformant **without a destructive rewrite**. It is sequenced so the first shippable increment is small, reversible, and useful on its own.

## 0. The architecture in one diagram

```
                         ┌─────────────────────────────┐
   SOURCE OF TRUTH  ──►  │  Canonical knowledge model  │
   (TS data now;         │  concepts: articles,        │
    Supabase later)      │  entities, use-cases,       │
                         │  playbooks + typed edges    │
                         └──────────────┬──────────────┘
                                        │  build-time projectors
        ┌───────────────┬───────────────┼───────────────┬───────────────┐
        ▼               ▼               ▼               ▼               ▼
  React pages     Prerendered     JSON-LD          OKF bundle      sitemap.xml
  (current UX)    static HTML     (schema.org)     (/okf/ +        robots.txt
  ArticlePage     per route       buildArticle-    viz.html)       llms.txt
                  + knowledge      Schema
                  maps
```

**Principle: the model is authored once; every other surface is generated.** No surface is hand-maintained in parallel. This is what makes OKF cheap to keep conformant — the bundle is output, not a second copy.

## 1. The canonical model

A *concept* with: `id` (stable slug/path), `type`, `title`, `description`, `resource` (live URL, nullable for abstract entities), `tags`, `timestamp`, a body (ordered blocks), `citations`, and `edges` (`{ targetId, reason }`). Articles, entities, use-cases, and playbook nodes are all concepts of different `type`. This is `ArticleDefinition` + `ArticleEntity` + `KnowledgeGraphNode` unified — we already have every field; we are consolidating, not inventing.

Edges are **directed with a prose reason** (our `internalLinks[].reason` / `connectsTo`). Backlinks are *derived* at build time, never hand-authored.

## 2. Phasing

### Phase 1 — Emit + prerender from current TS data (small, reversible, no DB)

> **Status (2026-06-18): bundle emission + discovery + validation gates are BUILT and green** (0 errors, 21 Q4 orphan warnings). See `05-phase-1-build-notes.md`. The remaining Phase-1 item is prerendering (step 3 below). Conformance, freshness, and discovery checks pass; quality checks run as warnings until the Phase-2 gate flips them hard (`npm run okf:validate -- --phase=2` previews that).

Goal: become OKF-conformant and agent-readable *without touching the content model or the database*. Everything stays as TS objects; we add build-time outputs.

1. ✅ **Consolidate read access.** `src/lib/knowledge/concepts.ts` exposes all concepts through one typed accessor (`getConcepts()` → `OkfConcept[]`). No data moved; pure façade over `articleKnowledgeGraph.ts`.
2. ✅ **OKF emitter** (`scripts/okf/emit.ts` + `build-okf.ts`, `npm run okf:build`): walks concepts → writes `public/okf/` as a conformant bundle:
   - `okf/index.md` with `okf_version: "0.1"` frontmatter + sectioned listing.
   - `okf/articles/<slug>.md`, one per article, frontmatter from the crosswalk (§2 of mapping doc), body from block→markdown rules, `# Citations`, and bundle-relative cross-links from `internalLinks`/`connectsTo`.
   - `okf/articles/index.md` and per-directory `index.md`.
   - Optional `log.md` generated from `dateModified`.
3. ⏳ **Prerender** (the agent-first/classic-SEO fix, still TODO): render each article route and the knowledge-map pages to static HTML. Lowest-friction option for this stack is a Vite-compatible SSG pass (e.g. `vite-react-ssg`) or a small Puppeteer/`react-dom/server` prerender of the known route list. Output real `<html>` with content + the existing JSON-LD inlined. **This is a Phase-2 gate (item 5) and the one remaining Phase-1 task.**
4. ✅ **Discovery files**: `scripts/okf/emit.ts` generates `sitemap.xml` (main routes + published article URLs), `robots.txt` (allow + sitemap ref), and `llms.txt` (curated map pointing agents at `/okf/` and key hubs).
5. ✅ **Validate**: `scripts/okf/validate-okf.ts` (`npm run okf:validate`) enforces conformance C1–C5, freshness (re-emit + diff), quality Q1–Q6, and discovery D1–D3. See `04-validation-and-phase-gates.md`.

Phase 1 ships OKF conformance, a static agent-readable site, and discovery files, with zero schema risk. If we stop here we are already conformant.

> Decision: Phase 1 reads existing TS data so we are never blocked on the database migration. The emitter and prerenderer are pure additions to the build; reverting is deleting two scripts.

### Phase 2 — Promote entities to first-class concepts

> **Status (2026-06-18): DONE** (minus the optional on-site hub pages, step 3). 26 entity concepts emitted (10 Use Cases, 4 Places, 12 Industries); orphans resolved by derived entity edges; bundle = 73 concepts, `okf:validate` 0/0 at hard stage 2. See `05-phase-1-build-notes.md` (Phase 2 section).

Goal: turn the implicit entity graph into real concept documents (the entity-SEO upgrade).

1. ✅ **Entity registry** (`src/lib/knowledge/entities.ts`) grounded in the graph's existing `uc`/`city`/`subtype` fields. Service/Problem/Method/Outcome entities (which need authored descriptions from `ArticleDefinition.entities[]`) deferred to Phase-3 content consolidation.
2. ✅ Emit `okf/use-cases/<slug>.md` and `okf/entities/<slug>.md` with **derived backlinks** ("Referenced by …"); playbooks now carry derived edges to their use-case/place/industry concepts.
3. ⏳ Optional: lightweight on-site hub *pages* for high-value entities (`/topics/<entity>`), prerendered, so the entity graph exists in the indexed site too — not only in the bundle. (Pairs with the prerender task.)

### Phase 3 — Move content to Supabase (storage done properly)

> **Status (2026-06-18): EXECUTED (projection stage).** Content consolidated into React-free data modules; schema applied to the live project and seeded (73 concepts / 166 edges / 19 citations); `okf:db:verify` green. We adopted **façade-as-source, DB-as-projection** (see `06-phase-3-foundation.md`) — the authoring cutover (build reads DB) is the remaining optional step, gated on a CI service-role key and a reason to author outside code (Phase 4).

Goal: stop hand-editing TypeScript objects; make the canonical model a database the projectors read.

1. Schema (sketch): `concepts` (id, type, slug, title, description, resource, tags `text[]`, body `jsonb` blocks, audience, reading_time, category, uc, city, subtype, published_at, modified_at, status), `concept_edges` (source_id, target_id, reason), `concept_citations` (concept_id, label, url, publisher). RLS: public read for `status = 'published'`; writes restricted.
2. Build reads from Supabase at build time (service role in CI only, never in the client bundle) and runs the same Phase 1/2 projectors. The React app can keep importing a generated static manifest so the runtime stays a fast static SPA — DB is a *build-time* source, not a per-request dependency.
3. Migrate existing articles into rows; keep `ArticlePage.tsx` rendering from the generated manifest. Author new articles as rows (eventually via the enrichment-agent pattern below).

> Decision: Supabase is a **build-time** source of truth, not a runtime data fetch for articles. This preserves the static, fast, prerendered, agent-readable site while killing the "articles are code" problem. Reserve runtime Supabase for forms/claims as today.

### Phase 4 — Agent authorship loop (optional, high-leverage)

Mirror Google's enrichment-agent pattern: an agent drafts new concepts (and updates cross-references/backlinks across many files in one pass — "the bookkeeping LLMs are good at") into the store; humans curate and approve; the build projects. This is where "generated by agents, curated by people" becomes literal for us, and it is the natural home for the planned N-nodes.

## 3. Routing and hosting

- `/okf/` — serve the static bundle directory (markdown + `index.md` tree). Add a `viz.html` (port/borrow Google's) at `/okf/viz.html` for a human/agent graph view.
- `/llms.txt`, `/sitemap.xml`, `/robots.txt` at root.
- Netlify: ensure the SPA `_redirects` fallback does **not** swallow `/okf/*`, `*.xml`, `*.txt`, or prerendered `*.html` (serve files before the catch-all to `index.html`). This is the one deployment gotcha — verify in `netlify.toml`/`public/_redirects`.

## 4. Non-destructive guarantees

- `ArticleDefinition`, `ArticlePage.tsx`, the React routes, and `buildArticleSchema` JSON-LD **stay**. OKF is an additional output.
- No public URL changes; `resource` in OKF points at existing article URLs.
- Phase 1 adds only build scripts + generated artifacts. Phases 2–3 are additive schema + a façade swap behind one accessor module.
- Each phase is independently shippable and independently revertible.

## 5. Conformance checklist (definition of done for "OKF-conformant")

- [ ] `okf/index.md` declares `okf_version: "0.1"`.
- [ ] Every emitted non-reserved `.md` has parseable YAML frontmatter with a non-empty `type`.
- [ ] `index.md`/`log.md` follow reserved-file structure where present.
- [ ] Cross-links are bundle-relative (`/...`) and tolerate missing targets.
- [ ] Citations render under `# Citations` as numbered markdown links.
- [ ] Bundle is committed to git (history = OKF's attribution/log mechanism) and/or downloadable as an archive.
- [ ] A consumer (the visualizer, or an agent) can read `index.md`, fan out, and render the graph with no backend.

## 6. Reference-doc sync (when implementation starts)

Per `docs/memory/fast-navigation-and-doc-sync.md`, when any of the above lands, update in the same change: `docs/codegraph.md` (new `/okf` route, build outputs, prerender behavior), `codegraph.json`, `wiki/db-forms-endpoints.md` (new Supabase tables in Phase 3), `wiki/deployment/netlify-vite-supabase.md` (redirect ordering, prerender/SSG build step), and `docs/ARTICLE_SYSTEM.md` (the canonical-model + projection workflow).

## 7. Open decisions to confirm before building

1. **`type` granularity for articles** — one `Article` type with `category` as a custom key, vs. one type per category (better graph-viz coloring). *Recommendation: type-per-category.*
2. **Prerender mechanism** — `vite-react-ssg` vs. a custom `react-dom/server` route-list prerender. *Recommendation: start with the smallest custom prerender over the known route list; adopt a plugin only if route count grows.*
3. **Bundle hosting location** — same Netlify site under `/okf/` vs. a dedicated public git repo (closer to Google's "git repo = attribution + log" model). *Recommendation: do both — emit into the site for discovery, and publish the git repo as the canonical, diffable bundle.*
4. **Phase 3 timing** — migrate to Supabase before or after entity promotion. *Recommendation: entities first (Phase 2) while content is still in code, then move the consolidated model to the DB.*
