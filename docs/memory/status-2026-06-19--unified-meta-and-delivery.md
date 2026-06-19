# AMTECH Status — Unified Meta + Multi-Surface Delivery — 2026-06-19

Companion to the plan: `docs/memory/plan-2026-06-19--unified-meta-and-delivery.md`.
Supersedes handoff: `docs/memory/status-2026-06-19--session-start.md`.

## Problem fixed

Per-page meta was generic homepage defaults on every non-article route; meta came from three competing places (`index.html`, `useArticleHead`, `prerender.ts`); only 13 routes were prerendered; marketing/conversion pages shipped a bare `#root`. The pasted "empty" HTML was the dev-server shell — but the underlying fragmentation and depth gap were real.

## What shipped (Phases 1–3 of the plan)

- **Single source of truth:** `src/lib/seo/pageMeta.ts` — every public route's title/description/canonical/OG/Twitter/robots/JSON-LD/agent-map + a real readable body for marketing/hub routes. Reads through `getConcepts()` + `articleDefinitions` + `skills/registry.ts` (the same boundary the OKF bundle and Supabase concept tables project from), so nothing forks and the future DB authoring cutover is inherited. See codegraph "Per-page meta / SEO source of truth".
- **React-free renderer:** `src/lib/seo/renderHead.ts` (head + body sections + agent-map JSON). Used by the prerenderer.
- **Runtime authority:** `src/components/seo/SeoManager.tsx` applies the same `PageMeta` on every SPA route change. `src/components/articles/useArticleHead.ts` is now a no-op shim (was title-only, raced the head).
- **Prerender refactor:** `scripts/okf/prerender.ts` consumes the registry and emits ALL 32 routes (was 13). Articles/skills keep their rich body renderers; other routes use authored sections.
- **Markdown twins:** `scripts/okf/emit.ts` `articleTwin()` emits `public/articles/<slug>.md` — a "Knowledge map" traversal header (from concept edges) + full body. Advertised via `<head>` `rel="alternate"`. `public/_headers` sets markdown content-type + caching.
- **Validator:** `scripts/seo/validate-seo.ts` (`npm run seo:validate`, gated in `postbuild`). Gates C1–C6 (coverage, title, core meta, JSON-LD, body richness, twin existence). Acceptance criteria = the plan's validation criteria.

## Validation results (all green)

- `npm run typecheck` — pass. `npm run lint` — 0 errors (2 pre-existing unrelated warnings in `salesRepShared.tsx`).
- `npm run okf:validate` — 91 files, 74 concepts, 0/0. `npm run skills:validate` — pass.
- `npm run build` (gated) — 32 routes prerendered, `seo:validate` 0 errors, 2 warnings.
- Warnings are `/pay` + `/payment-success` only (both `noindex` transactional pages, exempt from the body-richness hard gate by design). Confirmed: homepage carries Organization+WebSite JSON-LD; articles keep Article/FAQ/Breadcrumb; `/about`,`/pricing` etc. now have correct per-page meta + real body.

## NOT done / open (deliberate)

- **Phase 4 — edge `Accept` negotiation** (same-URL → `text/markdown`): deferred, measure-then-decide. Static path already covers `.md` probers + `rel=alternate` readers. Decision gate = edge p95 < ~50ms with CDN caching intact (plan criterion 5). No `netlify/edge-functions/` yet.
- **OG image:** no raster asset exists; `image` field is plumbed through the whole pipeline but `og:image` is only emitted when set. TODO: add `public/og-default.png` (1200×630) and set `DEFAULT_OG_IMAGE` in `pageMeta.ts`. Until then unfurls have title+description but no image.
- **Marketing JSON-LD:** marketing routes ship correct OG/meta but no per-page structured data (WebPage/BreadcrumbList) yet — optional enhancement.
- `/payment-success` left `noindex` (standard for confirmation pages); flip to indexable + add copy if desired (1-line).

## How to extend

Add/adjust any page meta in `src/lib/seo/pageMeta.ts` only. Run `npm run seo:check`. Never hand-edit `<head>` in `index.html`, pages, or the prerenderer.

## Live test (was pending)

Skills surface was committed + pushed earlier this session (commit `17c497e`) for live testing. This meta/delivery work is the next push. After deploy, verify on the live site: view-source on `/about`, `/pricing`, an article, and `/articles/<slug>.md` should all show correct per-page meta + real text.
