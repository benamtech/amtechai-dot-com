# Repo Memory

This folder stores durable facts about the AMTECH website project for reuse across sessions and agents.

Core facts:
- Stack: Vite + React + TypeScript
- Styling: Tailwind CSS 3
- Routing: React Router DOM
- Backend/data: Supabase JS + Supabase Edge Functions
- Payments: Stripe JS (`@stripe/react-stripe-js`, `@stripe/stripe-js`)
- Media/animation: three.js, framer-motion, GSAP
- Icons: lucide-react
- Linting: eslint

Operational memory:
- Always start with `docs/codegraph.md`, `wiki/db-forms-endpoints.md`, and `codegraph.json` before broad repo searches.
- When routes, forms, Supabase resources, Edge Functions, deployment behavior, or durable research change, update the matching codegraph/wiki/memory references in the same change.
- Detailed rule: `docs/memory/fast-navigation-and-doc-sync.md`.

Product context:
- Public marketing site for https://amtechai.com
- Pages include home, about, pricing, how-it-works, contact
- Revenue flows: demo scheduling, apply intake, sales rep application, payment, wholesale
