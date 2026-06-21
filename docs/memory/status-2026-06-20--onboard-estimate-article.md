# Status — First real onboarding: estimate + article-research-writer certified

Date: 2026-06-20 · Branch: `skill-ca-onboard-estimate-article` (stacked on `skill-ca-m4-authority`).
Plan: `/home/computer/.claude/plans/indexed-booping-eich.md`. Follows `status-2026-06-20--m4-full-m5-pipeline.md`.

## What shipped
Rewrote `estimate` and `amtech-article-research-writer` from SKILL.md-only packages into **standalone,
certifiable public tools** and ran them through the pipeline — the **first real use** of the M4 chain + the
certified-publishing flow. The catalog is now **4 signed skills**; the authority chain grew to **seq 1**.

- **Standalone reframe:** dropped `{{PLACEHOLDERS}}` / `./brain/`-`./output/` (estimate) and all AMTECH-repo
  coupling + `requiresRepositoryContext` (article). Each is now use-in-context-first with a JSON output contract.
- **Output contracts (mirror okf-audit):** `estimate` → `assets/estimate-schema.json` (`amtech-job-estimate/v1`:
  customer, job, lineItems, totals, assumptions); `article-research-writer` → `assets/article-brief-schema.json`
  (`amtech-article-research-brief/v1`: meta, uniqueInsight, entities, citations, draft, faq).
- **Source in both repos, byte-identical** (`sourcePackage` anchor): registry `skills/<slug>/` + website
  `src/lib/skills/source/<slug>/`. Each: SKILL.md (Read Order / Workflow / Output Format / Safety / Source-and-
  verification), schema asset, 1–2 references, `agents/openai.yaml`, LICENSE. **No scripts.**
- **Cert inputs:** `src/lib/skills/certificates/<slug>/{conformance.config.json, evidence/review.json,
  evidence/examples/*}`. Registered both in `src/lib/skills/registry.ts`.

## Two-phase lockstep release
- **Registry commit A** (`d251e21`, Phase 1): new source + index entries `pending-resign` + reciprocal
  README/SKILL.md links. The website **re-pinned `SKILL_REPOSITORY_COMMIT` → A** (so all 4 certs bind A).
- `npm run skills:sign` re-signed all 4 at A and appended **authority record seq 1** (4 `skill-publish` events);
  new catalog root `0fac2bed…` over 4 skills.
- **Registry commit B** (`b50e330`, Phase 2): mirrored the 4 certs + the grown chain under `authority/`, flipped
  the two to `status: signed`, updated `index.json` catalogRoot. `registry/validate.mjs --check` green
  (cross-witness over 4 skills + the 2-record chain). Website pins A (source); registry signed at B (A's source).

## Bug fixed in passing
`validate-skills.ts validateAuthorityRecord` read `records/0000.json` hardcoded — broke on the first multi-record
chain (checked the genesis catalogRoot, not the head). Now reads the head via `log.json latestSequence`.

## Verify (all green)
`npm run skills:conformance` → **4/4 pass** (estimate 26/26, article 29/29). `npm run skills:check` (validate +
verifier + consistency + chain gates + **21 tests**). `npm run build` → **36 routes**, 0 errors; both new skill
pages render the verdict badge + `recipe.json`. `npm run skills:verify public/skills/{estimate,
amtech-article-research-writer}` → `verified` / `amtech-reviewed` / **seq 1**. `registry/validate.mjs --check`
green. Rebuild is deterministic (no drift).

## Notes / next
- The website authority pins commit **A**; the registry's `signed` metadata is at **B** (B only adds certs/
  mirror — A's source is what the certs bind). This is the documented "update in progress → synchronized"
  two-phase state; a future pass could collapse to a single pin.
- `invoice`, `daily-checkin` (ai-employee templates) and `amtech-article-publisher` (repo-bound) remain backlog —
  see `onboarding-backlog.json`.
- Re-pinning to A re-signed okf-audit + kgb too (their source unchanged at A); their certs now bind A.
