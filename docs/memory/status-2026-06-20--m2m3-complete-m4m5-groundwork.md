# Status — M2 + M3 COMPLETE, M4 + M5 groundwork laid

Date: 2026-06-20 · Branch: `skill-ca-m1-attestations` (PR #48) · Plan:
`/home/computer/.claude/plans/indexed-booping-eich.md`. Follows `status-2026-06-20--m2-scaffold.md`.

## Design principle (baked in)
Verification is produced by ONE engine (the `04` verifier) and every surface is a **projection** of that single
build-time run. `graph-replay` is an attribute the verifier **assigns** from intrinsic, recomputable data
(Ed25519 cert + per-file SRI in the signed manifest + catalog root + the signed authority record). **Meta tags
only transport** a quick file-route map + a pointer to the recipe + the verdict — never the proof; the head/body
consistency gate (G-X.4) forbids any surface claiming more than the recomputed verdict.

## Landed as 4 commits on PR #48 (all green: typecheck · skills:check (21 tests) · build · CLI)
- **Commit 1 — M2 complete** (`d51036e`): `resolveEntry()` converges any `04` entry-point (page, use.md/agent.md,
  certificate.json, catalog.json, skill-authority.json) → the skill base(s); catalog/authority enumerate the set.
  `verifySkill.ts` adds authority-file resolution — a revoked skill/key returns `revoked` (not `invalid`),
  authority entry must pin the cert's commit/path. CLI prints one verdict or an array. Revoked fixtures (G-M2.1/2.2).
- **Commit 2 — M4 groundwork** (`fed3ed8`): `sign-authority.ts` emits the signed **genesis**
  `amtech-authority-record/v1` (sequence "0", folds the catalog root + each cert digest + tier). `build-skills`
  publishes the record + `log.json` and writes `latestSequence`/`latestRecordHash` into `skill-authority.json`.
  `verifySkill` checks the latest pointer == canonical record digest + record signature + cert-in-set → emits
  `authoritySequence`; drift → `AUTHORITY_MISMATCH`. Gate G-M4.1/4.2. `signCanonical`/`verifyCanonical` added.
- **Commit 3 — M3** (`38c7a3a`): build runs ONE verifier pass (deterministic `checkedAt` = release date) and
  threads the verdict into `catalog.json`, every `manifest.json`, the generated `skill-content.ts` (+ a quick
  **fileRoutes** map), and a delimited `X-AMTECH-Skill-Verification` block in `public/_headers`. Emits per-skill
  **`recipe.json`** (inputs + ordered graph-replay steps + EXPECTED verdict). `pageMeta.ts`: Tier-1
  `amtech:skill:{verdict,trust-tier,checked-at,authority-sequence,recipe}` meta + agent-map `skill`/`verify`/
  `files` blocks + a `ClaimReview` verdict JSON-LD; hub gets `amtech:catalog`/`:count`/`:catalog:root` + a verify
  block. Visible build-time **verdict badge** (with a re-verify→recipe link) in the skill + hub renderers.
  **Head/body consistency gate** (G-M3.1–3.3, G-X.3/X.4) — verified to bite when a surface is hand-edited.
- **Commit 4 — M5 groundwork** (`6a6738c`): `onboarding-backlog.json` (5 deferred skills) + `publish-skill.ts`
  (`skills:publish --dry-run [<slug>|--all]`) printing the 8-stage certified-publishing plan; live mode refused,
  dry run writes nothing.

## New scripts / artifacts
`scripts/signing/sign-authority.ts`, `scripts/skills/publish-skill.ts`,
`public/.well-known/authority/{records/0000.json,0000.sig,log.json}`, `public/skills/<slug>/recipe.json`,
`src/lib/skills/onboarding-backlog.json`. New npm: `skills:verify` (entry-converging), `skills:publish`.
Verdict surfaces: `catalog.json`/`manifest.json` `verification`, `skill-content.ts` `verification`+`fileRoutes`,
`_headers` verdict block, Tier-1 meta + agent-map verify/skill/files + ClaimReview JSON-LD.

## Verify
`npm run typecheck` · `npm run skills:check` (validate + verifier gate + consistency gate + **21 tests**) ·
`npm run build` (34 routes, 0 errors) · `npm run skills:verify public/skills/catalog.json` → both `verified`/seq 0 ·
`npm run skills:publish -- --dry-run --all`. Signing idempotent; deterministic `checkedAt`/record `issuedAt`.

## NOT done (deferred, unchanged)
**M4 proper** (multi-record chain, key-rotate/revoke events, registry cross-witness mirror, signed publishing
commits), **M5 actual batch onboarding** (the dry-run plan is the rails), `behavior-verified`/`proof-verified`
(reserved/horizon), Tier-3 instruction-in-meta (research-gated). Registry untouched this round (M2/M3 website-only;
the genesis record is website-side — the registry cross-witness is M4 proper).

## Next agent
M4 proper: grow the record chain (`previousRecordHash`), key lifecycle + revocation events, the registry
cross-witness mirror, signed publishing commits (fix `commitSignature: unsigned`). Then M5 live pipeline +
batch-onboard the backlog. Verifier `authorityRecord`/`authorityRecordSig` loaders + `signCanonical`/
`verifyCanonical` are already in place to build on.
