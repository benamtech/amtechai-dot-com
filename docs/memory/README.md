# Repo Memory

This folder stores durable facts about the AMTECH website project for reuse across sessions and agents.

Core facts:
- Stack: Vite + React + TypeScript
- Styling: Tailwind CSS 3
- Routing: React Router DOM
- Backend/data: Supabase JS + Supabase Edge Functions
- Payments: Stripe JS (`@stripe/react-stripe-js`, `@stripe/stripe-js`)
- New product bundle: `AI_EMPLOYEE_MVP/` contains the upcoming Hermes/Twilio AI Employee provisioning flow.
- Media/animation: three.js, framer-motion, GSAP
- Icons: lucide-react
- Linting: eslint

Operational memory:
- Always start with `docs/codegraph.md`, `wiki/db-forms-endpoints.md`, and `codegraph.json` before broad repo searches.
- When routes, forms, Supabase resources, Edge Functions, deployment behavior, or durable research change, update the matching codegraph/wiki/memory references in the same change.
- Detailed rule: `docs/memory/fast-navigation-and-doc-sync.md`.
- For article publishing from supplied copy, use `docs/skills/amtech-article-publisher/` before editing article data, graph nodes, or generated OKF/discovery outputs.
- For article research and draft creation, use `docs/skills/amtech-article-research-writer/`.
- Use `docs/article-drafts/` for unpublished article drafts and research packets before converting a draft into live article code and graph nodes.
- For AI Employee MVP work, read `docs/AI_EMPLOYEE_MVP.md`, `AI_EMPLOYEE_MVP/BUILD-PLAN.md`, `AI_EMPLOYEE_MVP/SUB_AGENTS.md`, and `AI_EMPLOYEE_MVP/ai-employee-all-files/README.md` first.

Top-of-mind npm commands:
- `npm run dev` - start the Vite dev server.
- `npm run build` - production build.
- `npm run preview` - preview the production build.
- `npm run typecheck` - TypeScript app check.
- `npm run lint` - eslint check.
- `npm run ai:local:setup` - first-run Hermes PC setup for the AI Employee bundle.
- `npm run ai:local:check` - local Hermes/env/Caddy/Supabase prerequisite check plus dry-run provision check.
- `npm run ai:caddy:render` - render/print Caddy host config install commands.
- `npm run ai:claim:secret` - generate a strong `CLAIM_LINK_SECRET` for Netlify.
- `npm run ai:claim:smoke` - smoke-test the Netlify claim function against the local dry-run provision hook.
- `npm run ai:sms:smoke` - smoke-test the SMS entry function.
- `npm run ai:supabase:push` - push AI Employee Supabase migrations through the Supabase CLI.
- `npm run ai:supabase:verify` - verify `ai_employee_claims` through Supabase REST.
- `npm run ai:provision:dry-run` - render/provision the example manifest with no side effects.

Product context:
- Public marketing site for https://amtechai.com
- Pages include home, about, pricing, how-it-works, contact
- Revenue flows: demo scheduling, apply intake, sales rep application, payment, wholesale
- Upcoming product flow: AI Employee claim form with Twilio Verify, consent capture, Hermes provisioning, and one Twilio number per provisioned client.

Copy and design memory:
- Do not use eyebrow text on marketing or conversion pages. Structure pages with clear headings, direct body copy, icons, borders, spacing, and visual hierarchy instead.
- Customer-facing copy should avoid self-referential/internal language such as "business brain seed," "form contract," "provisioning," "Hermes," "profile," and "workspace." Use plain labels like "Business info," "Tell us about your business," "Setup," and "Claim it."
- When orienting the website around the free AI Employee offer and educational pivot, use simple results-first language that works for both high-agency tech adopters and normal service-business owners. Explain the offer as a textable employee that understands the business, pricing, branding, documents, customers, and work style, then helps owners or office staff get admin and growth work done without learning AI tools.
- Before marking a requested UI or flow change complete, write the acceptance criteria in plain language and verify the implementation against each one. For form-flow requests, confirm every requested block exists in the right order and that removed fields are actually gone from the old location.
