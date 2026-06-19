# Status: Skill Stamp + DB Registry Complete — 2026-06-19

Follows: `status-2026-06-19--skill-stamp-db-session-start.md` (the plan)
and `status-2026-06-19--okf-audit-article-pipeline.md`.

## What Shipped

The trust-layer / DB-registry work planned in the session-start doc is now
complete, validated, and the migration is **applied to the live Supabase
project** (ref `vgedowiwvwfpjymouito`).

### 1. Skill stamp `<meta>` tags (already in tree, re-verified)

Four tags render into the prerendered static `<head>` of every skill page —
confirmed in `dist/skills/okf-audit/index.html`:

```html
<meta name="amtech:skill" content="okf-audit" />
<meta name="amtech:skill-version" content="0.1.0" />
<meta name="amtech:skill-sha256" content="4bd9090a84885a0e73882a45101b885b0d62b7c66dbeee8bc35bd94d646496c8" />
<meta name="amtech:skill-registry" content="https://amtechai.com/.well-known/skill-authority.json" />
```

### 2. Article `amtech:demonstrates` tag (re-verified)

`dist/articles/what-ai-agents-see-when-they-read-your-website/index.html` emits:

```html
<meta name="amtech:demonstrates" content="okf-audit" />
```

### 3. `/.well-known/skill-authority.json` (re-verified)

Emitted by `scripts/skills/build-skills.ts` to both `public/.well-known/` and
`dist/.well-known/`. CORS + content-type set in `public/_headers`.

### 4. Supabase skills registry — NEW, APPLIED

- Migration: `supabase/migrations/20260619220000_create_skills_registry.sql`
- Applied live as migration `create_skills_registry`.
- Tables: `public.skills` (1 row: okf-audit) and `public.skill_article_links`
  (1 row: okf-audit → what-ai-agents-see-when-they-read-your-website,
  relationship `demonstrates`).
- RLS: public read, published-only SELECT policies; **no write policies**
  (service-role-only writes), matching the `concepts` tables pattern.
- Security advisors after DDL: **zero new warnings** on the new tables. The 5
  pre-existing warnings (`ai_employee_inbound_tokens`, `operator_applications`,
  `sales_rep_applications`) are unrelated.

## The Integrity Loop (verified end-to-end)

The same sha256 `4bd9090a…496c8` is identical across all four surfaces:

1. `src/lib/skills/generated/skill-content.ts` (build output)
2. `public/.well-known/skill-authority.json`
3. Rendered `<meta name="amtech:skill-sha256">` in the skill page
4. `public.skills.archive_sha256` in the live DB

An agent can fetch the skill page, read the hash, fetch the authority file,
and confirm the archive is authentic — or query the DB registry for the same.

## Validation Gates — all green

- [x] `npm run typecheck` — passed
- [x] `npm run skills:check` — passed (1 skill package)
- [x] `npm run build` — passed (33 routes prerendered, 0 SEO errors, 2 known
      thin-page warnings on `/pay` + `/payment-success`)
- [x] Live DB query confirms skill row + article link present
- [x] Security advisors clean for new tables

## Source-of-truth Architecture (unchanged convention)

TypeScript registry (`src/lib/skills/registry.ts`) + build-emitted authority
JSON remain the authoring source of truth. The DB is a queryable **projection**,
same as `concepts` projects `src/lib/knowledge`. Runtime serves prerendered HTML
reading the generated bundle — never the DB per request. The DB exists for
internal agents, verification tooling, and future products.

## Not Done / Next

- Pushing the local commits to the remote (5 local commits ahead, plus this
  session's uncommitted work). Awaiting user direction on commit/push.
- A build-time job that refreshes `public.skills` from the registry with the
  service role (today the seed is embedded in the migration; fine for one
  static skill, will want automation when a second skill ships).
