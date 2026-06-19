# PLAN: Unified Knowledge-Graph Meta + Multi-Surface Delivery — 2026-06-19

Status: APPROVED-PENDING / pre-work checkpoint. Companion completion doc to be written when done.
Most recent handoff before this: `docs/memory/status-2026-06-19--session-start.md`.

## Problem (verbatim intent)

HTML rendering isn't serving real content; article/page meta tags are generic homepage defaults, not sourced from the knowledge graph. "View source" should expose lots of useful text. Meta must come from ONE source of truth and be baked into every materialization — articles, skills, offers, marketing pages. Add dynamic meta + JSON-LD across all surfaces, plus small machine-readable "map"/instruction payloads so agents know what to do even if they can't parse the page. Fix rendering basics first, then unique skill delivery.

## Findings (current architecture)

- Stack: static Netlify-hosted Vite SPA. No request-time server for page content (`netlify/functions/` is only the AI-Employee claim flow). No `_headers`, no `netlify/edge-functions/`, no header config in `netlify.toml` today.
- Prerender (`scripts/okf/prerender.ts`) DOES bake correct per-page `<head>` (title/description/canonical/OG/Twitter/JSON-LD) + real body text — but ONLY for the 9 published articles + `/articles`, `/articles/all`, `/skills`, `/skills/okf-audit` (13 routes). See `dist/articles/<slug>/index.html`.
- The HTML the user saw empty was the **dev server shell** (`/@vite/client`), not the prod build. Real but partial confusion.
- **Three competing meta sources, no single owner:** static `index.html` defaults, runtime `src/components/articles/useArticleHead.ts` (title+description ONLY — not OG/canonical/JSON-LD), and build-time `prerender.ts`.
- **Depth gap:** knowledge graph = 5 concept types (`ALLOWED_CONCEPT_TYPES` = Article, Playbook, Use Case, Place, Industry; 74 concepts) across dirs `articles/playbooks/use-cases/entities` in `src/lib/knowledge/`. Only Articles get HTML/prerender. Playbooks, Use Cases, Places, Industries exist ONLY as OKF markdown (`public/okf/**`).
- **Marketing pages bare:** Home/About/Pricing/HowItWorks/Contact/claim/apply serve `index.html` defaults — no per-page meta, no head hook.
- No `og:image` anywhere. `twitter:card=summary_large_image` with no image.
- Markdown twins already exist but at non-canonical URLs: `/okf/articles/<slug>.md`, `/skills/okf-audit/*.md`. No `Accept`-negotiation, no `Link: rel=alternate`.

## Key source-of-truth assets (reuse, do not duplicate)

- `src/lib/knowledge/concepts.ts` — `getConcepts()`, `OkfConcept` (title, description, slug, dir, bundlePath, resource, summary, bodyMarkdown, citations, edges), `SITE_ORIGIN`, `getConceptIndex()`, `getTopicGroups()`.
- `src/lib/knowledge/entities.ts` — entity registry + `deriveEntityEdgeIds()` (the traversal edges).
- `src/lib/articles.ts` — `buildArticleSchema()` (Article + BreadcrumbList + FAQPage JSON-LD).
- `scripts/okf/emit.ts` — `buildOkfFiles()` emits per-concept `.md`, dir indexes, sitemap.xml, robots.txt, llms.txt.
- `src/lib/skills/registry.ts` — skill definitions + `skillUrl()`.

## Decision (research-backed)

Adopt **static-first hybrid**, unconditionally:
1. One meta/SEO registry derived from the knowledge graph drives EVERY surface.
2. Enrich prerendered HTML body for every route (real readable text).
3. Per-format twins (`.md`, JSON-LD) materialized at BUILD time from the same source.
4. `Link: rel=alternate` + `Vary: Accept` + caching/`ETag` headers via `public/_headers`.

Treat **edge `Accept`-negotiation (same-URL → text/markdown)** as PROVISIONAL — gated on measured latency (criterion 5). Prototype one Netlify Edge Function, measure, then decide.

REJECTED for our context (no live/streaming content; cost/perf with zero gain): per-request edge generation/summarization, small-model-at-edge, `.live.txt`/`.stream.json` "current frame" files, background re-processing crons. Deploy IS the freshness trigger.

## Architecture: one source → many projections

Entity-level source of truth = the in-code façade `src/lib/knowledge/` via `getConcepts()`. The Supabase tables `concepts`/`concept_edges`/`concept_citations` are a ONE-WAY build-time projection of it (`db-seed-sql.ts` imports `getConcepts`; `db-verify.ts` checks anon parity + published-only RLS). The DB schema already mirrors the meta fields (title, description, resource, tags, status, summary, body, edges, citations). The future "authoring cutover" (build reads DB) only swaps what backs `getConcepts()`. THEREFORE: meta MUST read through `getConcepts()` (and the article/skill registries), never re-author concept data — that keeps meta, OKF, prerender HTML, and the DB as projections of one model and inherits the DB cutover for free.

`src/lib/seo/` (new) = single page-meta authority, reads through the façade boundary above.
- `pageMeta.ts`: `getPageMeta(route)` → `{ title, description, canonical, ogType, image?, jsonLd[], alternates[] }` for ALL routes. Pulls article/skill/concept meta from the knowledge façade + skills registry; holds authored meta for static marketing routes (home/about/pricing/how-it-works/contact/etc.).
- One renderer used by: (a) `prerender.ts` head injection, (b) a runtime `useSeoHead()` hook replacing `useArticleHead`, (c) skills/OKF emitters via shared helpers.

## Phases

### Phase 1 — Unify meta source of truth (rendering basics)
- Create `src/lib/seo/pageMeta.ts` + `src/lib/seo/renderHead.ts` (pure, React-free; importable by Node build scripts and React).
- Author marketing-page meta entries (home/about/pricing/how-it-works/contact/our-work/cost-calculator + conversion pages) — concise, content-true descriptions.
- Add `useSeoHead(route)` hook that sets title, description, canonical, OG, Twitter, JSON-LD on mount; wire into `src/App.tsx` (one place, route-aware) or each page. Retire/replace `useArticleHead`.
- Add a single shared `OG_IMAGE` default + per-type image hook (even a static branded default kills the no-image gap).

### Phase 2 — Refactor prerender to consume the registry + cover full depth
- `scripts/okf/prerender.ts` reads `pageMeta`/`renderHead` instead of inline head logic (delete the duplicated `injectHead` meta strings).
- Extend prerender to ALL public routes: marketing pages get real prerendered body text (pull hero/section copy or a concept-derived summary), and add concept-type surfaces (playbooks/use-cases/places/industries) IF we expose HTML routes for them — otherwise ensure they remain first-class in sitemap/llms/OKF and are linked from `/articles/all`.
- Confirm body richness: every route's `#root` ships headings + readable text.

### Phase 3 — Per-format twins + discovery headers (static delivery)
- Materialize canonical-adjacent `.md` twins: `/articles/<slug>.md`, `/skills/<slug>.md`, and a "Knowledge Map" traversal-index header (from concept `edges` + `deriveEntityEdgeIds`) at the top of each.
- Add `public/_headers`: `Link: </articles/x.md>; rel="alternate"; type="text/markdown"`, `Vary: Accept`, `Cache-Control`, and markdown `Content-Type` for `*.md`.
- Embed a compact agent-instruction payload in head (`<script type="application/json" data-agent-map>` or `<link rel=alternate type=text/markdown>`) + a `<noscript>` agent hint, so agents that can't parse the page still get a map.

### Phase 4 — Edge negotiation (MEASURE-THEN-DECIDE)
- Prototype `netlify/edge-functions/negotiate.ts`: on `/articles/*`, `/skills/*`, read `Accept`/User-Agent → serve pre-built `.md` (Content-Type text/markdown) from the SAME canonical URL; else pass through to prerendered HTML. Selection only, no generation.
- Measure added p95 latency + CDN-cache impact. Adopt only if < ~50ms and caching intact; else ship static-only (Phase 3 already covers `.md` probers + header readers).

## Validation check (`scripts/seo/validate-seo.ts`, new — wire as `npm run seo:validate`)

1. **Meta correctness (hard gate):** every route in `dist/**` has page-specific title/description/canonical/og:*/twitter:*/JSON-LD that traces to the knowledge source; assert NO homepage-default leakage on non-home routes.
2. **Body richness (hard gate):** each prerendered `#root` has ≥1 `<h1>`/`<h2>` and ≥ N words readable text.
3. **Payload efficiency:** `.md` twin ≥40% fewer tokens than HTML→MD of same page.
4. **Negotiation discoverability:** `Link: rel="alternate"; type="text/markdown"` + `Vary: Accept` present on HTML responses (static path); if edge adopted, `curl -H "Accept: text/markdown"` returns `text/markdown`.
5. **Edge perf budget (fork gate):** edge p95 added latency < ~50ms and full-page CDN caching for browsers intact — else skip edge.
6. **No regression:** SPA still interactive; Lighthouse SEO ≥ current; real unfurl in Slack/X/Discord.

## Process requirements (user-specified)

- This doc = pre-work entry. ✅
- On completion: write `docs/memory/status-2026-06-19--<slug>.md` summarizing work done + validation results, and update `docs/codegraph.md` "Most recent handoff" pointer.
- Keep `docs/codegraph.md`, `codegraph.json`, `public/sitemap.xml`, `public/llms.txt` in sync with any new routes/surfaces.

## Out of scope (this pass)

Live/streaming preview machinery, dynamic per-request generation, social `.png` OG-image generation (use one branded static default for now; revisit dynamic OG images later).
