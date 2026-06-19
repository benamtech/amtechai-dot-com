# AMTECH Skill Surfaces Implemented - 2026-06-19

Purpose: checkpoint the first implementation of the universal skill-link/materialization system.

## What Shipped

- Added `/skills` and `/skills/okf-audit` routes.
- Added `docs/UNIVERSAL_SKILL_LINK_CONTRACT.md`.
- Added canonical `okf-audit` skill source under `src/lib/skills/source/okf-audit/`.
- Added `src/lib/skills/registry.ts` as the authored skill registry.
- Added `scripts/skills/build-skills.ts` to materialize the skill folder into `public/skills/**`.
- Added `scripts/skills/validate-skills.ts` to verify frontmatter, generated views, hashes, archives, raw files, and discovery links.
- Updated `npm run build` so Netlify/local builds run `skills:build`, `okf:build`, `vite build`, and then prerender.
- Updated prerendering so `/skills` and `/skills/okf-audit` have static HTML for non-JS crawlers and agents.
- Updated root `sitemap.xml` and `llms.txt` generation to include skill surfaces.

## Important Product Decision

`okf-audit` is not a Netlify-hosted LLM endpoint in v1. It is a consumable skill package.

The goal is that ChatGPT, Claude, Codex, Claude Code, Cursor, an AMTECH agent, or another environment can receive `https://amtechai.com/skills/okf-audit`, fetch the first page or `use.md`, and use the skill in context immediately.

## Public Materialized Views

The first skill emits:

- `/skills/okf-audit/use.md`
- `/skills/okf-audit/agent.md`
- `/skills/okf-audit/SKILL.md`
- `/skills/okf-audit/manifest.json`
- `/skills/okf-audit/files.md`
- `/skills/okf-audit/references.md`
- `/skills/okf-audit/scripts.md`
- `/skills/okf-audit/assets.md`
- `/skills/okf-audit/files/**`
- `/skills/okf-audit/checksums.txt`
- `/skills/okf-audit/okf-audit-0.1.0.zip`

## Validation

Initial checks run during implementation:

- `npm run skills:build` passed.
- `npm run okf:build` passed.
- `npm run skills:validate` passed.
- `npm run okf:validate` passed.
- `npm run typecheck` passed after fixing the skills hub tuple typing issue.
- `npm run build` passed and prerendered 13 static routes.

## Next Useful Work

- Test the public URL in real ChatGPT/Claude/Codex browsing contexts after deploy.
- Consider adding a public GitHub mirror or plugin marketplace once the one-link consumption behavior is proven.
- Consider adding scripts to future skills only after the script index/trust flow has been tested with real agents.
