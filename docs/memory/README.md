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
- For AI Employee MVP work, read `docs/AI_EMPLOYEE_MVP.md`, `AI_EMPLOYEE_MVP/BUILD-PLAN.md`, `AI_EMPLOYEE_MVP/SUB_AGENTS.md`, and `AI_EMPLOYEE_MVP/ai-employee-all-files/README.md` first.

Product context:
- Public marketing site for https://amtechai.com
- Pages include home, about, pricing, how-it-works, contact
- Revenue flows: demo scheduling, apply intake, sales rep application, payment, wholesale
- Upcoming product flow: AI Employee claim form with Twilio Verify, consent capture, Hermes provisioning, and one Twilio number per provisioned client.

Copy and design memory:
- Do not use eyebrow text on marketing or conversion pages. Structure pages with clear headings, direct body copy, icons, borders, spacing, and visual hierarchy instead.
- Customer-facing copy should avoid self-referential/internal language such as "business brain seed," "form contract," "provisioning," "Hermes," "profile," and "workspace." Use plain labels like "Business info," "Tell us about your business," "Setup," and "Claim it."
- When orienting the website around the free AI Employee offer and educational pivot, use simple results-first language that works for both high-agency tech adopters and normal service-business owners. Explain the offer as a textable employee that understands the business, pricing, branding, documents, customers, and work style, then helps owners or office staff get admin and growth work done without learning AI tools.
