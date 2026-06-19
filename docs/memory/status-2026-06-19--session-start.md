# AMTECH Session Handoff - 2026-06-19

Branch: `main` (HEAD `081ccb5`)

## Where We Are

The skill-surfaces build shipped. See `docs/memory/status-2026-06-19--skill-surfaces-implemented.md` for the full checkpoint. The OKF article (`/articles/what-is-okf-ai-readable-knowledge`) also shipped in the same session. Both surfaces now appear in `public/skills/**`, `public/okf/**`, and the prerendered static HTML for 13 routes.

## Current State by Area

**Skill surface** — see `docs/UNIVERSAL_SKILL_LINK_CONTRACT.md`, `docs/SKILL_MATERIALIZATION_PIPELINE.md`, `src/lib/skills/registry.ts`, `scripts/skills/build-skills.ts`.
- `okf-audit` is the first consumable skill; all materialized views are committed.
- Build order: `skills:build` → `okf:build` → `vite build` → prerender. See `docs/codegraph.md` → "Build pipeline" bullet.
- Validation: `npm run skills:validate` (or `npm run skills:check`).

**OKF / knowledge graph** — see `docs/okf/`, `src/lib/knowledge/`, `scripts/okf/`.
- Authored source: `src/lib/knowledge/concepts.ts` + `src/lib/knowledge/articles/`.
- Projected outputs: `public/okf/**` (74 concepts), `public/sitemap.xml`, `public/llms.txt`.
- DB projection is one-way at build time; cutover to build-reads-DB needs CI service-role creds (still open). See codegraph "Knowledge / OKF surface" bullet.

**AI Employee claim flow** — see `docs/AI_EMPLOYEE_MVP.md`, `AI_EMPLOYEE_MVP/BUILD-PLAN.md`.
- Netlify functions: `netlify/functions/claim.mjs`, `netlify/functions/sms-entry.mjs`.
- Claim page: `src/pages/AIEmployeeClaim.tsx`. Supabase tables: `ai_employee_claims`, `ai_employee_inbound_tokens`.
- Still open: Netlify env vars (`CLAIM_LINK_SECRET`, Twilio Verify SID + webhook), Hermes provision hook reachable in prod. See `AI_EMPLOYEE_MVP/BUILD-PLAN.md` and `AI_EMPLOYEE_MVP/ai-employee-all-files/README.md`.

**Article system** — see `docs/skills/amtech-article-publisher/SKILL.md` before any publish.
- All 9 articles prerendered; article data in `src/lib/knowledge/articles/` (React-free modules).
- Drafts/research live in `docs/article-drafts/` until intentionally published.

## Open / Next Work

1. Test `https://amtechai.com/skills/okf-audit` in real ChatGPT/Claude/Codex browsing after deploy.
2. Complete AI Employee prod wiring (Netlify env + provision hook). See `AI_EMPLOYEE_MVP/BUILD-PLAN.md`.
3. Consider GitHub mirror or plugin-marketplace entry once one-link skill consumption is proven. See `docs/AMTECH_SHAREABLE_SKILLS_STRATEGY.md`.
4. DB authoring cutover (build reads Supabase instead of in-code source). See codegraph "Knowledge / OKF" bullet + `docs/okf/`.

## Navigation

- Start: `docs/codegraph.md` + `wiki/db-forms-endpoints.md`.
- Skills: `docs/UNIVERSAL_SKILL_LINK_CONTRACT.md` → `src/lib/skills/registry.ts`.
- Articles: `docs/skills/amtech-article-publisher/SKILL.md`.
- AI Employee: `docs/AI_EMPLOYEE_MVP.md` → `AI_EMPLOYEE_MVP/BUILD-PLAN.md`.
