# AMTECH Codegraph

Purpose: give agents and humans a compressed map of the site so they can answer routing, form, database, and deployment questions without scanning every file.

Most recent handoff: `docs/memory/status-2026-06-18--2324.md`.

## Architecture at a glance

- **App type:** Vite + React 18 + TypeScript marketing/conversion website.
- **Runtime:** Static SPA served from `dist/`; Supabase provides database, storage, and Edge Functions. Netlify Functions provide the AI Employee claim front door. The repo also contains an `AI_EMPLOYEE_MVP/` product bundle for the Hermes/Twilio AI employee provisioning flow.
- **Build pipeline (`npm run build`):** `vite build` then a `postbuild` step (`scripts/okf/prerender.ts`) that writes per-route static HTML for the 9 published article routes + `/articles` + `/articles/all` into `dist/` (real content + per-page `<title>`/description/canonical/OpenGraph/JSON-LD). The SPA boots with `createRoot().render()` (a client render, not hydrate), so it simply replaces the prerendered `#root` content — crawlers/agents get real content, users get the interactive app. Requires Node 24 (pinned via `netlify.toml` `NODE_VERSION` + `.nvmrc`) because the build scripts are `.ts` run directly via type stripping.
- **Knowledge / OKF surface:** the article knowledge graph projects to an Open Knowledge Format bundle (`public/okf/**`, 74 concepts) + `public/{sitemap.xml,robots.txt,llms.txt}`, all committed and copied into `dist/` by Vite. Single authored source = `src/lib/knowledge/` façade. Draft/research articles live under `docs/article-drafts/` until they are intentionally published into the live article graph. See `docs/okf/` and the "Knowledge graph / OKF" file-ownership entries below.
- **Routing:** `src/App.tsx` owns all public routes. Most brand pages use `src/components/layout/Layout.tsx`; conversion flows (`/claim`, `/apply`, `/schedule-call`, `/pay`, etc.) render standalone. Current in-app site copy is the authoritative source after the June 2026 homepage, article-library, and AI Employee claim revisions.
- **Supabase client:** `src/lib/supabase.ts` reads `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` and exports one browser client. If either var is missing it logs a console error and falls back to placeholder values instead of throwing at module load, so a missing local `.env` no longer white-screens the whole app (it is imported transitively by statically-loaded routes like `/apply`). Use the anon/publishable key only — never a service role key (every `VITE_*` value is inlined into the public bundle).
- **Database migrations:** `supabase/migrations/*.sql` define public form tables, intake storage references, booking availability and applications. `20260618210000_okf_concepts.sql` adds the OKF knowledge tables (`concepts`, `concept_edges`, `concept_citations`) with published-only public-read RLS — applied to the live project.
- **Edge Functions:** `supabase/functions/*/index.ts` handle Stripe PaymentIntent creation and Resend transactional emails.
- **AI employee bundle:** `AI_EMPLOYEE_MVP/` contains the Phase 2/3 build plan, Hermes profile template, onboarding schema, Twilio number/provisioning scripts, and the local provision hook used by the deployed Netlify claim function.

## Route graph

| Route | Page | Major component folders | Primary purpose |
| --- | --- | --- | --- |
| `/` | `src/pages/Home.tsx` | `src/components/home/*`, layout | Main marketing homepage. |
| `/how-it-works` | `src/pages/HowItWorks.tsx` | `src/components/how-it-works/*`, layout | Process/included/differentiation explainer. |
| `/about` | `src/pages/About.tsx` | `src/components/about/*`, layout | Company story, thesis, team. |
| `/pricing` | `src/pages/Pricing.tsx` | `src/components/pricing/*`, layout | Pricing positioning and CTA. |
| `/contact` | `src/pages/Contact.tsx` | page-local form | Contact capture into `contact_submissions`. |
| `/our-work` | `src/pages/OurWork.tsx` | `src/components/our-work/*`, layout | Portfolio/capability narrative. |
| `/cost-calculator` | `src/pages/CostCalculator.tsx` | `src/components/cost-calculator/*`, layout | Interactive outbound cost calculator. |
| `/articles` | `src/pages/Articles.tsx` | `src/components/articles/*`, `src/lib/articleKnowledgeGraph.ts`, layout | Central AI learning library with featured articles, condensed Browse by topic knowledge-graph shelves, glossary concepts, ICP paths, category shelves, and sitemap links. |
| `/articles/all` | `src/pages/AllArticles.tsx` | `src/lib/articleKnowledgeGraph.ts`, layout | Mobile-first index of all published articles and planned operational knowledge-graph nodes, grouped by topic and node type. |
| `/articles/write-pressure-washing-estimate-with-ai`, `/articles/estimate-painting-cost-ai`, `/articles/create-estimate-with-chatgpt`, `/articles/amtech-vs-chatgpt-claude`, `/articles/build-claude-skill-job-pricing`, `/articles/build-local-seo-plan-with-chatgpt`, `/articles/business-brain-free`, `/articles/garden-center-spring-buy-plan-ai`, `/articles/what-is-okf-ai-readable-knowledge` | `src/pages/AIEstimateArticles.tsx`, `src/pages/articles/AmtechVsChatgptClaude.tsx`, `src/pages/articles/ClaudeSkillJobPricing.tsx`, `src/pages/articles/LocalSeoKnowledgeGraphPlan.tsx`, `src/pages/articles/BusinessBrainFree.tsx`, `src/pages/articles/SalisburyRetailSalesDataAI.tsx`, `src/pages/articles/OkfAiReadableKnowledge.tsx` | `src/components/articles/*`, `src/lib/articles.ts`, layout | Educational articles for AI-assisted contractor estimating prompts, Claude Skills, AI tool comparison, local knowledge-graph SEO planning, free business-brain setup, Salisbury seasonal sales-data planning, and OKF/agent-readable knowledge workflows. **Each page is a thin wrapper**: the `ArticleDefinition` data lives in React-free modules under `src/lib/knowledge/articles/`, and the page imports it, calls `useArticleHead(article)` (sets per-page title/description), and renders `<ArticlePage>`. All 9 article routes are prerendered to static HTML at build time. |
| `/schedule-demo`, `/shedule-demo` | `src/pages/ScheduleDemo.tsx` | `src/components/schedule/*` | Demo booking flow into `demo_bookings`; invokes booking email function. |
| `/claim` | `src/pages/AIEmployeeClaim.tsx` | page-local form | AI Employee claim form; optional `?phone=` browser prefill from homepage CTAs, posts to Netlify `/claim/send-code`, verifies the code through `/claim/verify-code`, then posts a signed `claim_token` to `/claim/verify-and-claim` to record consent in `ai_employee_claims` and trigger Hermes provisioning. |
| `/schedule-call` | `src/pages/ScheduleCall.tsx` | page-local | Sales/operator call CTA flow. |
| `/apply` | `src/pages/Apply.tsx` | `src/components/apply/*` | Operator application into `operator_applications`; invokes application email function. |
| `/apply/info-sales-rep` | `src/pages/SalesRepApply.tsx` | `src/components/sales-rep-apply/*` | Sales rep pre-call application into `sales_rep_applications`. |
| `/pay` | `src/pages/Payment.tsx` | `src/components/payment/*` | Stripe payment form; calls `create-payment-intent`. |
| `/payment-success` | `src/pages/PaymentSuccess.tsx` | page-local | Post-payment confirmation. |
| `/wholesale`, `/wholesale-2`, `/sell-ai-employees`, `/sales-bootcamp` | `src/pages/*` | `src/components/wholesale2/*` where applicable | Campaign-specific landing pages. |

## AI Employee product surface

| Surface | Current files | Planned website role |
| --- | --- | --- |
| AI Employee claim/provisioning | `src/pages/AIEmployeeClaim.tsx`, `netlify/functions/claim.mjs`, `netlify/functions/sms-entry.mjs`, `AI_EMPLOYEE_MVP/ai-employee-all-files/scripts/provision_hook_server.py`, `AI_EMPLOYEE_MVP/ai-employee-all-files/*` | Website product flow where a user fills one AI Employee claim form, optionally arrives with the phone field prefilled, verifies phone ownership with Twilio Verify, consents to ongoing texts, and triggers the authenticated Hermes provisioning hook. |

## Data and integration graph

| User action | Frontend entry | Supabase table/storage | Edge function / external service |
| --- | --- | --- | --- |
| Submit contact form | `src/pages/Contact.tsx` | `contact_submissions` | None. |
| Book demo | `src/components/schedule/bookingService.ts` | `demo_bookings` | `send-booking-email` -> Resend. |
| Operator application | `src/pages/Apply.tsx` | `operator_applications` | `send-application-email` -> Resend. |
| Sales rep application | `src/pages/SalesRepApply.tsx` | `sales_rep_applications` | None currently. |
| Payment | `src/pages/Payment.tsx`, `src/components/payment/*` | Stripe only from current code | `create-payment-intent` -> Stripe. |
| AI Employee claim | `src/pages/AIEmployeeClaim.tsx`; contract in `AI_EMPLOYEE_MVP/ai-employee-all-files/schema/onboarding-form.json` | `ai_employee_claims`, `ai_employee_inbound_tokens` | Netlify `claim.mjs` -> Twilio Verify -> signed claim token -> Supabase consent insert/status update -> authenticated provision hook -> `provision_hook_server.py` -> `provision_client.py`; optional Twilio-signed `sms-entry.mjs` pre-verified link. |
| Knowledge graph (OKF) | authored in `src/lib/knowledge/` | `concepts`, `concept_edges`, `concept_citations` (published-only public-read RLS) | Build-time only: the façade is the authored source; `okf:db:seed-sql` projects it into the tables (service role), `okf:db:verify` checks parity via the anon key. The browser never writes these tables. The DB is a queryable projection alongside the markdown bundle; the authoring cutover (build reads DB) is a documented future step needing CI service-role creds. |

## File ownership map

- `src/pages`: route-level composition and flow state.
- `src/components/<feature>`: feature-specific sections, shared helpers, and step components.
- `src/components/ui`: reusable visual primitives.
- `src/components/layout`: navbar/footer/site shell.
- `src/lib`: shared infrastructure clients.
- `supabase/migrations`: database schema and RLS policies.
- `supabase/functions`: Deno Edge Functions deployed to Supabase.
- `wiki`: long-form design/product/research/deployment notes.
- `docs/article-drafts`: unpublished article drafts and research packets. Drafts may include validity checks, proposed graph roles, internal/external link plans, source notes, FAQ candidates, and candidate `ArticleDefinition` metadata. They are not live routes and do not regenerate OKF until converted into `src/lib/knowledge/articles/*` and `src/lib/articleKnowledgeGraph.ts`.
- `docs/skills`: repo-local reusable agent skills. `docs/skills/amtech-article-research-writer/` researches, plans, and drafts AMTECH-standard information-gain articles before live publish. `docs/skills/amtech-article-publisher/` publishes supplied article copy into the live article system, article knowledge graph, OKF bundle, prerendered route, and optional Supabase projection.
- `docs/seo`: AMTECH article-system research, master operational knowledge graph, and article opportunity sequencing.
- `docs/ARTICLE_PUBLISHING_AGENT.md`: compatibility pointer to `docs/skills/amtech-article-publisher/SKILL.md` for older docs and agent memory.
- `src/lib/articleKnowledgeGraph.ts`: live article graph data used by `/articles` and `/articles/all`, including published articles and planned nodes.
- `src/lib/knowledge/` — **the single authored source of truth for knowledge** (the "one model, many projections" hub):
  - `concepts.ts`: typed façade that normalizes the article graph + entity registry + full article content into `OkfConcept[]` (`getConcepts()`, `ALLOWED_CONCEPT_TYPES`, block→markdown renderer). Read path for the OKF emitter, prerenderer, and DB seed.
  - `entities.ts`: curated entity registry (Use Cases UC1–UC10, Places, Industries) + `deriveEntityEdgeIds()`; entities are first-class OKF concepts and supply the derived edges that connect playbooks (orphan fix).
  - `articles/`: React-free `ArticleDefinition` data modules (one per published article) + `index.ts` (`articleDefinitions` by slug). Imported by both the React pages and the build tooling — this consolidation is what unlocks full-fidelity OKF bodies, prerender, and DB seeding.
- `src/components/articles/useArticleHead.ts`: hook that sets per-page `document.title` + meta description while an article is mounted (complements the prerendered `<head>`).
- `scripts/okf/`: Open Knowledge Format (OKF) build tooling, all `.ts` run directly by Node 24.
  - `emit.ts` (pure projection → file map), `build-okf.ts` (writes `public/okf/**` + discovery files), `validate-okf.ts` (conformance C1–C5 / freshness / quality Q1–Q6 / discovery D1–D3; default hard stage 2; `--phase=3` adds DB gates G8/G9).
  - `prerender.ts` (postbuild → per-route static HTML in `dist/`).
  - `db-seed-sql.ts` (emits idempotent seed SQL for the concept tables from the façade; `--no-body` for a compact seed), `db-verify.ts` (anon-key parity + RLS check vs the in-code source).
  - Commands: `npm run okf:build|okf:validate|okf:validate:phase3|okf:check|okf:prerender|okf:db:seed-sql|okf:db:verify`. Output committed under `public/okf/**` (74 concepts) + `public/{sitemap.xml,robots.txt,llms.txt}`. Standards, phase gates, Supabase schema, and future OKF/article positioning: `docs/okf/`.
- `docs/memory`: durable short facts for future agents.
- `netlify/functions`: Netlify Functions deployed with the Vite site; `claim.mjs` handles AI Employee Twilio Verify/provisioning and `sms-entry.mjs` is the optional onboarding SMS signpost.
- `AI_EMPLOYEE_MVP`: AI Employee product bundle. Read `BUILD-PLAN.md` first, then `SUB_AGENTS.md` and `ai-employee-all-files/README.md`; `template/` is the Hermes profile, `schema/` is the form/manifest contract, `scripts/` is the provisioning factory, first-run setup, local checks, Caddy/systemd helpers, smoke tests, and authenticated hook, `.env.netlify.example` is the Netlify env checklist, `host/` contains local reverse-proxy templates, `cron/` is check-in scheduling, and `netlify/functions/` is the source-bundle copy/reference for claim/SMS functions.

## Agent usage notes

1. Start with this file and `wiki/db-forms-endpoints.md` before grepping.
2. For route changes, inspect `src/App.tsx`, the page file, then only the referenced component folder.
3. For data changes, inspect the relevant migration, frontend service/page submit handler, and Edge Function if present.
4. For design changes, read `AMTECH_STYLE_GUIDE.md`, `COST_CALCULATOR_STYLE.md`, and relevant notes in `wiki/design-notes.md`.
5. For article research/drafting, use `docs/skills/amtech-article-research-writer/`. For article publishing from supplied copy, use `docs/skills/amtech-article-publisher/` before editing article data, graph nodes, or OKF outputs. Use `docs/article-drafts/` for reviewable research/draft artifacts before publishing.
6. Keep this codegraph updated whenever a route, table, endpoint, feature folder, article-system surface, or durable knowledge-graph/research source changes.
7. For AI Employee MVP work, start with `docs/AI_EMPLOYEE_MVP.md` and `AI_EMPLOYEE_MVP/BUILD-PLAN.md`; dry-run provisioning before any real Hermes/Twilio side effects.

## NPM command map

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite dev server. |
| `npm run build` | Build the production Vite bundle. |
| `npm run preview` | Preview the production build locally. |
| `npm run typecheck` | Run TypeScript app checks. |
| `npm run okf:build` | Regenerate the OKF bundle + `sitemap.xml`/`robots.txt`/`llms.txt` into `public/`. |
| `npm run okf:validate` | Validate the OKF bundle (conformance, freshness, quality, discovery). Default stage 2 = hard quality; `-- --phase=1` softens. |
| `npm run okf:validate:phase3` | Validate plus Phase-3 cutover foundation gates (G8 schema present/shaped, G9 no service creds in `src/`). |
| `npm run okf:check` | `okf:build` then `okf:validate` — run before committing knowledge-graph changes. |
| `npm run okf:prerender` | Prerender article + hub routes to static HTML in `dist/` (also runs automatically as `postbuild`). |
| `npm run okf:db:seed-sql` | Emit idempotent seed SQL for the `concepts*` tables from the façade (`--no-body` for a compact seed). |
| `npm run okf:db:verify` | Verify the DB projection matches the in-code source and RLS exposes only published concepts (anon key). |
| `npm run lint` | Run eslint. |
| `npm run ai:local:setup` | First-run setup for the local Hermes PC bundle. |
| `npm run ai:local:check` | Check local Hermes/env/Caddy/Supabase prerequisites and dry-run provisioning. |
| `npm run ai:caddy:render` | Render Caddy host config and print install/reload commands. |
| `npm run ai:claim:secret` | Generate a strong `CLAIM_LINK_SECRET` for Netlify. |
| `npm run ai:claim:smoke` | Smoke-test the Netlify claim function against the dry-run provision hook. |
| `npm run ai:sms:smoke` | Smoke-test the SMS entry function. |
| `npm run ai:supabase:push` | Push AI Employee Supabase migrations through the Supabase CLI. |
| `npm run ai:supabase:verify` | Verify `ai_employee_claims` through Supabase REST. |
| `npm run ai:provision:dry-run` | Run the provisioning factory against the example manifest with no side effects. |
