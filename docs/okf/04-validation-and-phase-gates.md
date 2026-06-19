# Validation Standards & Phase Gates

This document defines the checks that make our OKF output trustworthy, and the **gates** — conditions that must be green — before Phase 2 (entity promotion) or Phase 3 (Supabase storage) may begin. Phase 1 builds the emitter and these checks together so that every later phase inherits a passing baseline.

> Principle: the bundle is **generated output**, never hand-edited. Therefore the validator's most important job is not "is this valid OKF" (it almost always will be) but "is the committed bundle still faithful to the source." Freshness is the real risk; conformance is the easy part.

## 1. How to run the checks

```bash
npm run okf:build            # regenerate public/okf/** + sitemap.xml, robots.txt, llms.txt from source
npm run okf:validate         # stage 2 (default): conformance + freshness + HARD quality + discovery
npm run okf:validate:phase3  # stage 3: the above + Phase-3 foundation gates (G8 schema, G9 no service creds)
npm run okf:check            # build then validate (use before committing)
```

> Stage note: the validator defaults to **stage 2** now that Phase 2 is active — quality checks (Q1–Q6) are hard. Pass `--phase=1` to soften them back to warnings; pass `--phase=3` (or use `okf:validate:phase3`) to additionally run the Phase-3 cutover prerequisites.

`okf:validate` re-emits the bundle in memory from the same source the emitter uses and **diffs it against what is committed on disk**. A stale bundle fails the build. This makes "regenerate after editing the knowledge graph" enforceable rather than a convention.

## 2. Conformance standards (OKF v0.1 — must always pass)

These map directly to the spec's conformance section. The validator enforces each:

- **C1 — Frontmatter present.** Every non-reserved `.md` in `public/okf/` has a parseable YAML frontmatter block.
- **C2 — `type` required.** Every such frontmatter block has a non-empty `type` string.
- **C3 — Reserved files well-formed.** `index.md` files are listings (no frontmatter except the bundle-root `index.md`, which carries only `okf_version`); `log.md` (when present) is date-grouped newest-first. The root `index.md` declares `okf_version: "0.1"`.
- **C4 — Bundle-relative links.** Cross-links between concepts begin with `/` and are interpreted relative to the bundle root (not the site root). Portable if the bundle is tarballed or moved.
- **C5 — Permissive, but observable.** Broken cross-links are *legal* (the spec forbids rejecting them) so they do not fail the build, but the validator **reports** them so we catch unintended breaks.

## 3. AMTECH quality standards (our bar, which OKF will not enforce for us)

OKF accepts almost anything; our knowledge-graph-SEO doctrine does not. These are enforced as warnings now and become hard gates before Phase 2:

- **Q1 — Every concept has a non-empty `description`** (one sentence). Feeds index snippets and agent previews.
- **Q2 — Every concept has at least one tag** drawn from a controlled vocabulary (city, subtype, use case, topic).
- **Q3 — Every published concept has a `resource`** pointing at its live, indexable URL (the seam back to classic SEO + JSON-LD).
- **Q4 — Every concept has at least one outbound edge** (no orphan nodes in a graph format), OR is explicitly marked a root/hub.
- **Q5 — Concept `type` is from the agreed vocabulary.** Enforced against the exact set emitted, sourced from `ALLOWED_CONCEPT_TYPES` in `src/lib/knowledge/concepts.ts`. Currently: `Article`, `Playbook`, `Use Case`, `Place`, `Industry`. `Service`, `Problem`, `Method`, `Outcome`, `Customer`, `Tool`, `Reference` are reserved for the content-consolidation step (they need authored descriptions lifted from `ArticleDefinition.entities[]`) and added to the set when first emitted. No ad-hoc types.
- **Q6 — Determinism.** Two runs of the emitter on unchanged source produce byte-identical output (no timestamps from `Date.now()`, stable sort by concept id). Required for the freshness gate to be meaningful.

## 4. Discovery / agent-surface standards

Because a JS-only SPA is invisible to non-executing crawlers and many agents, Phase 1 also owns these and the validator checks them:

- **D1 — `sitemap.xml`** exists, is XML-parseable, lists every live route, and every `<loc>` is an absolute `https://amtechai.com` URL.
- **D2 — `robots.txt`** exists and references the sitemap.
- **D3 — `llms.txt`** exists and points agents at `/okf/` and the key human hubs.
- **D4 — Bundle is reachable as files.** `public/**` is copied verbatim into `dist/` by Vite, and Netlify's non-forced `/* /index.html 200` rewrite serves real files first — so `/okf/index.md`, `/sitemap.xml`, etc. resolve. The deployment note (§6) records the one guard to keep this true.

## 5. Phase gates (the contract)

### Gate to begin Phase 2 (promote entities to first-class concepts) — ✅ MET (2026-06-18)

1. ✅ `npm run okf:check` exits 0 (conformance C1–C5 + freshness + discovery D1–D4).
2. ✅ Quality standards Q1–Q6 pass as **hard** checks (validator default is now stage 2; 0 warnings).
3. ✅ The emitted bundle is committed under `public/okf/` and renders as plain markdown.
4. ✅ `type` vocabulary ratified: `Article`, `Playbook`, `Use Case`, `Place`, `Industry` (see Q5).
5. ✅ **Done:** all 8 published article routes + `/articles` + `/articles/all` prerender to static HTML with per-page `<head>` + JSON-LD via `scripts/okf/prerender.ts` (`postbuild`; Node 24 pinned in `netlify.toml`/`.nvmrc`).

### Gate to begin Phase 3 (Supabase as build-time source of truth) — ✅ EXECUTED (projection stage, 2026-06-18)

All Phase-2 gates, plus:

6. ✅ Entities, use cases, and playbooks are emitted as their own concept documents with **derived backlinks**, and the bundle passes Q4 (no orphans) with the 73-concept graph.
7. ✅ **Single read path:** `src/lib/knowledge/` is the authored source for the emitter, the prerenderer, the DB seed, *and* the React article pages (which now import `articleDefinitions` data instead of inlining it). G7 stays an advisory reminder for the future authoring cutover.
8. ✅ **Schema applied + seeded:** `supabase/migrations/20260618210000_okf_concepts.sql` is live; 73 concepts / 166 edges / 19 citations seeded; `get_advisors` clean. Lossless `OkfConcept ↔ rows` mapping in `06-phase-3-foundation.md`. G8 passes.
9. ✅ **Build-time only / no creds in client:** G9 confirms no Supabase service credentials in `src/`; `okf:db:verify` confirms RLS exposes only published rows via the anon key. The DB is a projection of the façade (see the architecture decision in `06`).

## 6. Deployment guard (keep D4 true)

`public/_redirects` is `/* /index.html 200` (a non-forced rewrite), so existing static files take precedence and the bundle is served correctly today. **Do not add `!`/`force` to that rule** — forcing would shadow `/okf/*`, `*.xml`, and `*.txt`. If the catch-all is ever changed, add explicit passthrough rules for `/okf/*`, `/sitemap.xml`, `/robots.txt`, and `/llms.txt` *before* the catch-all. The validator cannot see Netlify behavior, so this guard lives here as a standard.

## 7. What Phase 1 deliberately does NOT validate yet

- Per-concept `timestamp` (the graph data has no dates; pulled from `ArticleDefinition.dateModified` during consolidation). Omitted, not faked — faking would break Q6 determinism.
- Full article *body* fidelity (the bundle emits frontmatter + summary + edges; rich block→markdown bodies come when content is consolidated/migrated in Phase 3).
- ~~Entity concepts and backlinks~~ — **done in Phase 2** (73 concepts incl. Use Case / Place / Industry, with derived backlinks).
- Prerendered HTML (the remaining Phase-2 gate item).

These are tracked as gaps in `02-mapping-amtech-to-okf.md` §5, not silently skipped.
