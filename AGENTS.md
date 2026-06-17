# AMTECH AI Agents Launch Point

This file is the canonical onboarding doc for humans and agents working in this repo.

## What This Project Is
- Public-facing Vite + React + TypeScript marketing and conversion website for AMTECH.
- The site presents AMTECH’s offerings to external audiences and drives revenue actions
  (sales calls, bookings, onboarding, payments, applications).
- Production URL: https://amtechai.com
- Backed by Supabase for bookings, payments, intake, conversations, and applications.

## Quick-start
```bash
cd /home/computer/Desktop/project
npm install
npm run dev
```

## Language / User
Primary user language: English. Write docs and commit messages in English.

## Style / Tone
Ambitious, confident, glossy, modern, enterprise-premium.
Guiding docs:
- `AMTECH_STYLE_GUIDE.md`
- `COST_CALCULATOR_STYLE.md`

## Preferred Stack (Fixed)
- Vite
- React 18
- TypeScript 5
- Tailwind CSS 3
- React Router DOM
- Three.js
- Framer Motion
- GSAP
- Supabase JS
- Stripe JS
- Lucide icons
- eslint

## Git / GitHub Workflow
- Branch source: main or trunk
- Feature branches from trunk/main
- One logical change per PR
- Include prose summary of the change
- Commit messages follow conventional commits:
  - `feat:`, `fix:`, `refactor:`, `docs:`, `chore:`
- Practice defensive coding; avoid deleting structures without migration

## Codebase Conventions
- `/src/pages` is for route-level pages.
- `/src/components/<feature>` keeps feature code together.
- Shared state helpers and page-level inflection live in `/src/components/<feature>` as `*Shared.tsx`.
- Shared infrastructure helpers live in `/src/lib` or `/src/components/ui`.
- Supabase service files keep DB/service calls in dedicated files (pattern: `bookingService.ts`, `adminService.ts`).

## Agent Workflow (Multi-Agent Safe)
- Treat existing files as stable artifacts; do not rewrite large files in full.
- Prefer small, validated edits.
- Reuse components/styles instead of duplicating.
- Preserve router/page contract unless explicitly instructed.

## Why We Care (Read Before Large Refactors)
Read `VISUAL_ANALYSIS.md` and `ONBOARDING_IMPLEMENTATION.md` before refactoring to preserve design rationale and conversion intent.

## Bundled References
- `codegraph.json` — module graph and starting points.
- `docs/memory/` — durable repo/project facts for agents.
