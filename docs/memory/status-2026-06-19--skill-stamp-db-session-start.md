# Status: Skill Stamp, DB Registry, Authority File — 2026-06-19

## Session Goal

Extend the AMTECH skill system with three trust-layer surfaces and a proper Supabase backing table. All three are additive — nothing breaks existing skill surfaces.

## What This Session Will Build

### 1. Stamp meta tags on skill pages

Four `<meta>` tags emitted into the `<head>` of every skill page:

```html
<meta name="amtech:skill" content="okf-audit" />
<meta name="amtech:skill-version" content="0.1.0" />
<meta name="amtech:skill-sha256" content="<archive sha256>" />
<meta name="amtech:skill-registry" content="https://amtechai.com/.well-known/skill-authority.json" />
```

These let any agent that fetches the skill page identify the skill, version, and integrity hash without executing JS or following links.

### 2. Article `amtech:demonstrates` tag

Articles that run or reference a skill declare it in `<head>`:

```html
<meta name="amtech:demonstrates" content="okf-audit" />
```

This creates a bidirectional machine-readable link: skill knows its articles (via DB), articles declare their skill (via meta).

First article: `what-ai-agents-see-when-they-read-your-website` → `okf-audit`.

### 3. `/.well-known/skill-authority.json`

Generated at build time from the skill registry. Emitted to `public/.well-known/skill-authority.json`. Contains canonical skill slug, version, sha256, archive URL, and status for every skill.

Agents that want to verify a skill's authenticity fetch this file and compare hashes. No new protocol — just a JSON file at a predictable location the domain owner controls.

### 4. Supabase skills registry

A `skills` table that is the eventual source of truth for the registry. A `skill_article_links` table for the skill–article bidirectional graph. Both with RLS policies and seed data.

The TypeScript registry remains the current authoring source; the DB is the projection. Same architecture as articles/concepts.

## Files That Will Change

| File | Change |
|---|---|
| `src/lib/articles.ts` | Add optional `demonstratesSkill?: string` to `ArticleDefinition` |
| `src/lib/seo/pageMeta.ts` | Add `extraMeta` to `PageMeta`; populate stamp tags + demonstrates tag |
| `src/lib/seo/renderHead.ts` | Emit `extraMeta` tags |
| `scripts/skills/build-skills.ts` | Add `archiveSha256` to generated content; emit `skill-authority.json`; add self-verification block to bootstrap |
| `src/lib/knowledge/articles/what-ai-agents-see...ts` | Add `demonstratesSkill: 'okf-audit'` |
| `public/_headers` | Add `.well-known` CORS + content-type; add `X-Skill-Authority` + `X-Skill-Registry` headers to `/skills/*` |
| `supabase/migrations/20260619220000_create_skills_registry.sql` | New migration: skills table, skill_article_links table, RLS, seed |
| `codegraph.json` + `docs/codegraph.md` | Update latestHandoff and docs list |

## Validation Gates (See Separate Doc)

See `validation-2026-06-19--skill-stamp-plan.md`

## Dependency Order

1. `build-skills.ts` must emit `archiveSha256` into `skill-content.ts` BEFORE `pageMeta.ts` can read it.
2. Therefore: `npm run skills:build` must run before `npm run build` (it already does in the build pipeline).
3. The `pageMeta.ts` import of `getSkillContent` creates a build-time dependency on the generated file — this is the same pattern as `SkillDetail.tsx` already uses.
