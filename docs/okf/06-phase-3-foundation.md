# Phase 3 Foundation: Supabase as a Build-Time Source of Truth

> **Status (2026-06-18): EXECUTED (projection stage).** The schema is applied to the live project (`supabase/migrations/20260618210000_okf_concepts.sql`), all 73 concepts + 166 edges + 19 citations are seeded, and `npm run okf:db:verify` confirms RLS exposes only the 8 published concepts and they match the in-code source. The **authoring cutover** (build reads the DB instead of the façade) remains the future step — see "Architecture decision" and "What still has to be built" below.

Phase 3 moves concepts out of TypeScript objects and into the database, so new knowledge is data (and, later, agent-authored) rather than a code change. This document records the foundation and the validation that gates the full cutover.

## Architecture decision (important)

We adopted **façade-as-source, database-as-projection**, not a hard "DB is the only source" cutover:

- `src/lib/knowledge/` remains the *authored* source of truth. Every projection — the markdown bundle, prerendered HTML, JSON-LD, **and the database** — is generated from it. The DB is another emit target (via `okf:db:seed-sql`), exactly like `public/okf/`.
- This keeps the build network-independent and deterministic (no build-time DB dependency, no service-role key required in Netlify CI today), while still giving agents and apps a live, queryable, public **published** surface over the Supabase API.
- The *authoring* cutover — humans/agents edit DB rows and the build reads them back — is deferred until there is a reason to author outside code (e.g., the Phase-4 agent loop). It needs a service-role key in CI and a build-time loader; both are specified below. Until then, `okf:db:seed-sql` keeps the DB faithful to the façade and `okf:db:verify` proves it.

## The one rule that makes this safe

**Supabase is a build-time source, not a runtime dependency.** The build reads the DB (service role, in CI), runs the existing projectors, and emits the same static bundle/HTML the site already serves. The browser never queries the concepts tables; the runtime stays a fast static SPA. This preserves everything Phase 1/2 gained (prerendered, agent-readable, zero-infra consumption) while killing the "articles are code" problem.

```
Supabase concepts/* ──(build-time, service role, CI)──► src/lib/knowledge façade
                                                              │
                                                              ▼
                                          same projectors → bundle, HTML, JSON-LD, sitemaps
```

## Schema

The reviewable, not-yet-applied schema is `docs/okf/phase-3-schema.sql`: `concepts`, `concept_edges`, `concept_citations`, with RLS allowing public read of **published** rows only. It is kept in `docs/` (not `supabase/migrations/`) so it is version-controlled and validated without risking accidental `supabase db push`. When Phase 3 starts, promote it to `supabase/migrations/<timestamp>_okf_concepts.sql` unchanged.

## Lossless mapping: `OkfConcept` ↔ rows

| `OkfConcept` field | `concepts` column | Notes |
| --- | --- | --- |
| `id` | `id` (pk) | stable concept id |
| `conceptType` | `concept_type` | OKF `type` |
| `dir` | `dir` | bundle subdirectory |
| `slug` | `slug` | unique within `dir` |
| `title`, `description` | `title`, `description` | |
| `resource` | `resource` | nullable |
| `tags` | `tags text[]` | |
| `status` | `status` | published \| planned \| reference |
| `lead` | `lead` | nullable |
| `summary` | `summary jsonb` | ordered bullet lines |
| `relationLabel` | `relation_label` | |
| `edgeTargetIds` | `concept_edges(source_id → target_id)` | one row per edge; `reason` carries prose |
| *(future)* article body blocks | `body jsonb` | nullable until content consolidation |
| *(future)* citations | `concept_citations` | |

The mapping is lossless today; the only nullable additions (`body`, citations) are the content-consolidation work that lands with the migration.

## Validation: the checkable Phase-3 gates

Run the foundation checks:

```bash
npm run okf:validate:phase3     # = okf:validate --phase=3
```

This runs everything in stage 2 (conformance + freshness + hard quality + discovery) **plus**:

- **G9 — no service credentials in client code.** Scans `src/**/*.ts(x)` for `service_role` / `SUPABASE_SERVICE_ROLE` / `serviceRoleKey`. Any hit fails. The service role bypasses RLS and must never be inlined into the public bundle (the same rule already enforced informally in `src/lib/supabase.ts`).
- **G8 — schema exists and is shaped.** Confirms `docs/okf/phase-3-schema.sql` defines `concepts`, `concept_edges`, `concept_citations`, enables row level security, and declares at least one RLS policy.
- **G7 — single read path (manual).** Emitted as a warning reminder, not auto-failed: before cutover, confirm `src/lib/knowledge/` is the *only* path that reads concepts (emitter, prerenderer, and React app all go through it). Today the emitter is the only consumer; the gate is satisfied when the React app reads from the same façade rather than importing article TSX/data directly.

## Done in this phase

- ✅ **Content consolidation** — the 8 published `ArticleDefinition` objects moved to React-free modules under `src/lib/knowledge/articles/`; pages are thin wrappers using `useArticleHead`. This unlocked full OKF bodies, prerender, real `dateModified` timestamps, and DB seeding from one source.
- ✅ **Schema applied** — `supabase/migrations/20260618210000_okf_concepts.sql` on the live project; `get_advisors` shows no RLS issues on the new tables.
- ✅ **Seed** — `okf:db:seed-sql` projected all 73 concepts + 166 edges + 19 citations into the tables.
- ✅ **Verification** — `okf:db:verify` confirms anon sees only the 8 published concepts and they match the façade.

## What still has to be built for the authoring cutover

1. A build-time loader in `scripts/okf/` (not `src/`, to keep G9 clean) returning `OkfConcept[]` from Supabase via the **service role** behind the same shape `getConcepts()` produces, selected by a build env flag; default stays the in-code façade.
2. Full-fidelity seed (`okf:db:seed-sql` without `--no-body`) so `body`/timestamps round-trip losslessly for that loader.
3. A reason to author outside code — most naturally the Phase-4 agent loop writing draft concepts for human review.

Each is independently revertible; none changes public URLs or the runtime's static nature. To roll back Phase 3 entirely: `drop table concept_citations, concept_edges, concepts cascade;` and delete the migration — the façade and every other projection are unaffected.
