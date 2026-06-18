# AMTECH Codegraph

Purpose: give agents and humans a compressed map of the site so they can answer routing, form, database, and deployment questions without scanning every file.

## Architecture at a glance

- **App type:** Vite + React 18 + TypeScript marketing/conversion website.
- **Runtime:** Static SPA served from `dist/`; Supabase provides database, storage, and Edge Functions. The repo now also contains an `AI_EMPLOYEE_MVP/` product bundle for the upcoming Hermes/Twilio AI employee provisioning flow; it is not yet wired into the React route graph.
- **Routing:** `src/App.tsx` owns all public routes. Most brand pages use `src/components/layout/Layout.tsx`; conversion flows (`/apply`, `/schedule-call`, `/website-onboarding`, `/pay`, etc.) render standalone. Current in-app site copy is the authoritative source after the June 2026 homepage and article-library revisions.
- **Supabase client:** `src/lib/supabase.ts` reads `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` and exports one browser client.
- **Database migrations:** `supabase/migrations/*.sql` define public form tables, intake storage references, booking availability and applications.
- **Edge Functions:** `supabase/functions/*/index.ts` handle Stripe PaymentIntent creation and Resend transactional emails.
- **AI employee bundle:** `AI_EMPLOYEE_MVP/` contains the Phase 2/3 build plan, Hermes profile template, onboarding schema, Twilio number/provisioning scripts, and planned Netlify claim functions for the new AI Employee product.

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
| `/articles/write-pressure-washing-estimate-with-ai`, `/articles/estimate-painting-cost-ai`, `/articles/create-estimate-with-chatgpt`, `/articles/amtech-vs-chatgpt-claude`, `/articles/build-claude-skill-job-pricing`, `/articles/build-local-seo-plan-with-chatgpt`, `/articles/business-brain-free`, `/articles/garden-center-spring-buy-plan-ai` | `src/pages/AIEstimateArticles.tsx`, `src/pages/articles/AmtechVsChatgptClaude.tsx`, `src/pages/articles/ClaudeSkillJobPricing.tsx`, `src/pages/articles/LocalSeoKnowledgeGraphPlan.tsx`, `src/pages/articles/BusinessBrainFree.tsx`, `src/pages/articles/SalisburyRetailSalesDataAI.tsx` | `src/components/articles/*`, `src/lib/articles.ts`, layout | Educational articles for AI-assisted contractor estimating prompts, Claude Skills, AI tool comparison, local knowledge-graph SEO planning, free business-brain setup, and Salisbury seasonal sales-data planning workflows. |
| `/schedule-demo`, `/shedule-demo` | `src/pages/ScheduleDemo.tsx` | `src/components/schedule/*` | Demo booking flow into `demo_bookings`; invokes booking email function. |
| `/schedule-call` | `src/pages/ScheduleCall.tsx` | page-local | Sales/operator call CTA flow. |
| `/apply` | `src/pages/Apply.tsx` | `src/components/apply/*` | Operator application into `operator_applications`; invokes application email function. |
| `/apply/info-sales-rep` | `src/pages/SalesRepApply.tsx` | `src/components/sales-rep-apply/*` | Sales rep pre-call application into `sales_rep_applications`. |
| `/website-onboarding` | `src/pages/WebsiteOnboarding.tsx` | `src/components/website-onboarding/*` | Client website intake with session persistence and file upload. |
| `/admin` | `src/pages/Admin.tsx` | `src/components/admin/*` | Intake admin dashboard for sessions/files. |
| `/pay` | `src/pages/Payment.tsx` | `src/components/payment/*` | Stripe payment form; calls `create-payment-intent`. |
| `/payment-success` | `src/pages/PaymentSuccess.tsx` | page-local | Post-payment confirmation. |
| `/wholesale`, `/wholesale-2`, `/sell-ai-employees`, `/sales-bootcamp` | `src/pages/*` | `src/components/wholesale2/*` where applicable | Campaign-specific landing pages. |

## Upcoming product surface

| Surface | Current files | Planned website role |
| --- | --- | --- |
| AI Employee claim/provisioning | `AI_EMPLOYEE_MVP/BUILD-PLAN.md`, `AI_EMPLOYEE_MVP/SUB_AGENTS.md`, `AI_EMPLOYEE_MVP/ai-employee-all-files/*` | New website product flow where a user fills one AI Employee claim form, verifies phone ownership with Twilio Verify, consents to ongoing texts, and triggers a Hermes provisioning hook. No React route exists yet. |

## Data and integration graph

| User action | Frontend entry | Supabase table/storage | Edge function / external service |
| --- | --- | --- | --- |
| Submit contact form | `src/pages/Contact.tsx` | `contact_submissions` | None. |
| Book demo | `src/components/schedule/bookingService.ts` | `demo_bookings` | `send-booking-email` -> Resend. |
| Operator application | `src/pages/Apply.tsx` | `operator_applications` | `send-application-email` -> Resend. |
| Sales rep application | `src/pages/SalesRepApply.tsx` | `sales_rep_applications` | None currently. |
| Website intake session | `src/components/website-onboarding/intakeService.ts` | `intake_sessions`, `intake_files`, storage bucket `intake-files` | None currently. |
| Intake admin review | `src/components/admin/adminService.ts` | `intake_sessions`, `intake_files`, storage bucket `intake-files` | None currently. |
| Payment | `src/pages/Payment.tsx`, `src/components/payment/*` | Stripe only from current code | `create-payment-intent` -> Stripe. |
| AI Employee claim (planned) | Future route/component; contract currently in `AI_EMPLOYEE_MVP/ai-employee-all-files/schema/onboarding-form.json` | Consent record storage still to be implemented | Netlify `claim.js` -> Twilio Verify -> authenticated provision hook -> `provision_client.py`; optional `sms-entry.js` signpost. |

## File ownership map

- `src/pages`: route-level composition and flow state.
- `src/components/<feature>`: feature-specific sections, shared helpers, and step components.
- `src/components/ui`: reusable visual primitives.
- `src/components/layout`: navbar/footer/site shell.
- `src/lib`: shared infrastructure clients.
- `supabase/migrations`: database schema and RLS policies.
- `supabase/functions`: Deno Edge Functions deployed to Supabase.
- `wiki`: long-form design/product/research/deployment notes.
- `docs/seo`: AMTECH article-system research, master operational knowledge graph, and article opportunity sequencing.
- `src/lib/articleKnowledgeGraph.ts`: live article graph data used by `/articles` and `/articles/all`, including published articles and planned nodes.
- `docs/memory`: durable short facts for future agents.
- `AI_EMPLOYEE_MVP`: AI Employee product bundle. Read `BUILD-PLAN.md` first, then `SUB_AGENTS.md` and `ai-employee-all-files/README.md`; `template/` is the Hermes profile, `schema/` is the form/manifest contract, `scripts/` is the provisioning factory, `cron/` is check-in scheduling, and `netlify/functions/` is the planned website claim/SMS front door.

## Agent usage notes

1. Start with this file and `wiki/db-forms-endpoints.md` before grepping.
2. For route changes, inspect `src/App.tsx`, the page file, then only the referenced component folder.
3. For data changes, inspect the relevant migration, frontend service/page submit handler, and Edge Function if present.
4. For design changes, read `AMTECH_STYLE_GUIDE.md`, `COST_CALCULATOR_STYLE.md`, and relevant notes in `wiki/design-notes.md`.
5. Keep this codegraph updated whenever a route, table, endpoint, feature folder, article-system surface, or durable knowledge-graph/research source changes.
6. For AI Employee MVP work, start with `docs/AI_EMPLOYEE_MVP.md` and `AI_EMPLOYEE_MVP/BUILD-PLAN.md`; dry-run provisioning before any real Hermes/Twilio side effects.
