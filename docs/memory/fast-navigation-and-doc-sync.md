# Fast Navigation and Documentation Sync Memory

Always use the fastest, lowest-token navigation path before broad repo exploration.

## Default navigation order

1. Read `docs/codegraph.md` for the route graph, data/integration graph, and file ownership map.
2. Read `wiki/db-forms-endpoints.md` for Supabase tables, storage buckets, form handlers, Edge Functions, and environment variables.
3. Read `codegraph.json` when a machine-readable route/data-flow map is useful.
4. For article/SEO work, check `docs/ARTICLE_SYSTEM.md`, `docs/seo/AMTECH_MASTER_KNOWLEDGE_GRAPH.md`, and `docs/seo/KNOWLEDGE_GRAPH_SEO_RESEARCH.md`; for live copy decisions, treat current site copy in `src/pages` and `src/components` as authoritative.
5. Inspect only the route page, feature folder, migration, service file, Edge Function, or article-system file identified by those references.
6. Use targeted `rg` searches only after the codegraph/reference docs do not answer the question.

## Required update rule

When codebase changes affect any of the following, update all relevant reference files in the same change:

- Routes, route pages, or feature folders.
- Form fields, submit handlers, validation, or conversion flows.
- Supabase tables, migrations, RLS policies, storage buckets, or service helpers.
- Supabase Edge Functions, function request/response shapes, secrets, or external integrations.
- Deployment behavior, build settings, redirects, environment variables, or hosting assumptions.
- Article-system surfaces, knowledge graph priorities, or durable design, product, market, or internal research findings.

## Reference files to keep synchronized

- `AGENTS.md` for canonical agent workflow instructions.
- `docs/codegraph.md` for human-readable route/data/ownership navigation.
- `codegraph.json` for machine-readable route/data-flow navigation.
- `wiki/db-forms-endpoints.md` for Supabase, form, endpoint, storage, and Edge Function references.
- `wiki/deployment/netlify-vite-supabase.md` for Netlify/Supabase deployment notes.
- `wiki/design-notes.md`, `wiki/product-internal-research.md`, and `wiki/research/*` for durable design, product, market, and internal research.

## Goal

Reduce repeated file scanning, reduce token use, and keep future agents from making partial changes that leave docs, codegraph references, forms, database schema, or deployment notes stale.
