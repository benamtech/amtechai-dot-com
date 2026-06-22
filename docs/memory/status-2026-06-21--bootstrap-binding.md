# Status — Bootstrap binding + per-skill agent-entry content (2026-06-21)

Branch `skill-ca-m4-finish-m5`. Builds on the v2 FEATURE-COMPLETE state (`status-2026-06-20--m4-atomic-m5-finished.md`).

## What prompted this
`scripts/skills/build-skills.ts` `bootstrapMarkdown`/`agentMarkdown` hardcoded the **okf-audit** Output Contract / Inputs / Outputs into EVERY skill's `use.md` and `agent.md`. So `estimate`, `knowledge-graph-builder`, and `amtech-article-research-writer` told agents — at the first surface they read — to produce an OKF audit report instead of their real output. Worse: `use.md`/`agent.md` were generated **unsigned** wrappers, so nothing in the verifier covered the front door.

## Two-part fix (shipped)

1. **Correctness — per-skill content from the registry.** New required `SkillDefinition` fields `taskVerb` / `inputs` / `outputContract` / `outputsSummary` (`src/lib/skills/registry.ts`), populated for all 4 skills from each `SKILL.md`. `bootstrapMarkdown`/`agentMarkdown` render from them; a missing field is a compile/build error (no silent boilerplate fallback). Guards: a conformance check that every `outputContract` section is documented in `SKILL.md` + fields non-empty (`run-conformance.ts`, signed evidence); a regression test `scripts/skills/__fixtures__/bootstrap-contract.test.ts` (positive per-skill + anti-contamination over built bytes).

2. **Integrity — the agent-entry surfaces are now signed.** New signed `certificate.bootstrap` `{ use:{sha256,sha3_512}, agent:{sha256,sha3_512} }` (additive within `amtech-signed-artifact/v2`, `scripts/signing/amtech-signing.ts`). `sign-skills.ts` reads+hashes the served `use.md`/`agent.md` into the cert. The link-first verifier (`verifySkill.ts`) recomputes them for skill certs → `BOOTSTRAP_DIGEST_MISMATCH` on tamper, `EVIDENCE_MISSING` on omission — on every surface (CLI, build validator, live site). `build-skills.ts signedCertificate()` re-asserts the digests (stale-cert guard); `recipeDoc()` documents the new step; the manifest mirrors the digests. **Deliberately NOT in `sourcePackage`** (website-generated, not registry source) → registry `validate.mjs` ignores `bootstrap` but still verifies the whole cert, so one cert verifies in both repos.

## Also fixed (loose-end sweep)
- Normalized stale "**update in progress** pending a website re-sign" footers in `okf-audit` + `knowledge-graph-builder` `SKILL.md` to the clean phrasing the other two skills use (changed `sourcePackage` → re-signed).
- `docs/skills/standard/02` cited removed `COMMIT_MISMATCH` → replaced with current codes incl. `BOOTSTRAP_DIGEST_MISMATCH`.
- `docs/skills/standard/08` line 117 asserted the two-phase "update in progress" model in present tense → marked **Superseded by M5** (atomic release).
- Docs `02`/`04`/`05` document the `bootstrap` field, the verifier step + reason code, and that the bootstrap surfaces are signed.

## Verification
Re-signed locally with `.amtech/signing-private-key.pem` (twice — once for binding, once after the SKILL.md footer edits). `npm run skills:check` green: validate + **38 tests** + consistency/chain gates. Authority chain at **seq 4**. Tamper/omission proven: baseline `verified` (evidence.bootstrap=pass) → tamper `use.md` → `invalid/BOOTSTRAP_DIGEST_MISMATCH` → remove `agent.md` → `invalid/EVIDENCE_MISSING` → restored → `verified`. Typecheck clean.

## Commit-independence fix (surfaced during the release)
The first `skills:publish --execute` failed at the provenance-pin rebuild: `use.md`/`agent.md` embedded the **commit-pinned** GitHub URL (`skillRepositoryTreeUrl(skill)`), so re-pinning `SKILL_REPOSITORY_COMMIT` after signing changed the bootstrap bytes → `certificate.bootstrap` mismatch. This is fundamentally circular (the post-release commit can't live in data signed before that commit exists) and violates the standard's "no git commit in signed payloads" rule. Fix: the signed `use.md`/`agent.md` now reference GitHub by **branch** (`skillRepositoryTreeUrl(skill, false)` / `skillRepositoryRegistryUrl(skill, false)`); the exact pinned commit + per-file hashes stay in the unsigned `manifest.json`/authority (where the standard puts provenance). Verified: re-pinning the commit and rebuilding no longer breaks the bootstrap.

## Released (done this session)
`npm run skills:publish -- --execute` then pushed both repos. Atomic, SSH-signed (key `SHA256:8DKLJqHsNPm/AKQW/LRzSQh5tfK6TkyfcZdAq+TaBtA`):
- **registry** `amtech-skills-registry` @ `048c371` (branch `skill-ca-v2-reconcile`, pushed) — mirrors source+certs+authority chain, all skills `signed`, one signed commit.
- **website** @ `209e6d2` (branch `skill-ca-m4-finish-m5`, pushed) — `SKILL_REPOSITORY_COMMIT` pinned to `048c371`; pin matches registry HEAD.
- `registry/validate.mjs --check` green; 38 tests green; no `pending-resign`. The release overwrote the previously-stale `docs/agent-skills/**`-equivalent registry mirror with the corrected source.

## Merged to production (done this session)
Both PRs merged to `main` in lockstep, **merge commits** (not squash) to preserve the pinned SHAs:
- registry PR **#2** (`skill-ca-v2-reconcile` → `main`) MERGED → `048c371` is on registry `main`.
- website PR **#52** (`skill-ca-m4-finish-m5` → `main`) MERGED → release on website `main`, `SKILL_REPOSITORY_COMMIT` = `048c371`. Lockstep verified: website-main pin resolves on registry-main.
- This shipped the **entire M0–M5 skill-CA standard** (30 commits) + the bootstrap work, not just the fix. Website `main` merge triggers a Netlify production deploy (async; confirm the deploy log goes green).
- **Live production verify confirmed:** `npm run skills:verify https://amtechai.com/skills/estimate` → `verified`, `graph-replay`, `amtech-reviewed`, every evidence `pass` incl. `bootstrap: pass`, `authoritySequence: 5`. The signed front door verifies end-to-end on the real domain.

## Trust-model note (for whoever extends this)
The crypto (Ed25519 over RFC-8785 canonical JSON; SHA-256+SHA3-512 content digests; hash-chained signed authority) proves internal consistency + one signature. The root of trust is **domain control / TLS+CA + the self-served signing key** at `/.well-known/` — not an independent anchor. No external transparency log; the registry "cross-witness" is same-owner, so it raises the bar against equivocation/rollback but isn't CT-grade. Attestations (`amtech-reviewed`, `static-contract`) are signed human/offline claims, not proof-of-behavior. Largest hardening opportunity if this ever needs to be trustless: an independent append-only witnessed log + an out-of-band key anchor.
