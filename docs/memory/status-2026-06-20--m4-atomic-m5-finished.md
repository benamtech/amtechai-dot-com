# Status — M4 totally finished (atomic lockstep, multi-key, signed commits) + M5 implemented

Date: 2026-06-20 · Branch: `skill-ca-m4-finish-m5` (stacked on PR #50). Registry: `skill-ca-v2-reconcile`.
Plan: `/home/computer/.claude/plans/indexed-booping-eich.md`. Follows `status-2026-06-20--onboard-estimate-article.md`.

## The goal (met): no "update in progress" skills, ever
The two-phase release used to leave the website pinned to a registry commit whose `index.json` said
`pending-resign`. Root cause was a **redundant** `git show` check in `registry/validate.mjs` that forced
"commit source → then sign," even though `sourcePackage` already proves the bytes. Fixed by making
`sourcePackage` the **sole** cross-repo anchor → an atomic, single-commit, signed release with **zero
pending-resign**. Final state: 4 published skills, all `signed`; registry validate green; both repos SSH-signed.

## Landed (6 commits; no backward-compat shims — early-stage clean cut)
- **C1** — removed the onboarding backlog (`onboarding-backlog.json` deleted; `invoice`/`daily-checkin`/
  `amtech-article-publisher` will not be added).
- **C2** — **atomic cross-repo anchor**: the signed cert binds `{url, path}` + `sourcePackage` only; **dropped
  `repository.commit` and `conformance.sourceCommit`** from the signed payload, the `COMMIT_MISMATCH` reason
  code, the `git show` step + `pending-resign` branch in `registry/validate.mjs`. The release commit is recorded
  only as **provenance** (manifest/authority, set post-commit, no re-sign).
- **C3** — **multi-key by keyId**: build publishes every key to `/.well-known/keys/<keyId>.json`; the verifier
  fetches the cert's key by `signingKeyId` and accepts a **retired** key (active-at-issuance) for the certs +
  authority records it signed; **revoked** → `revoked`. A rotation no longer invalidates history or forces a
  mass re-sign. The chain walk verifies each record under its own key.
- **C4** — **SSH-signed publishing commits**: dedicated Ed25519 key (`signing:commit-keygen`); private in
  `.amtech/` (git-ignored), public + `allowed_signers` committed under `signing/` and served at
  `/.well-known/commit-signing-key.pub`. `skill-authority.repository.commitSignature = ssh:SHA256:8DKLJqHsNPm…`;
  G-M4.4 requires an `ssh:` witness. Both repos' release commits are signed.
- **C5** — **M5 automation**: `skills:publish -- --execute [--push]` runs the whole atomic signed cross-repo
  release (sign → check → mirror → one signed registry commit → website provenance pin → check → signed website
  commit → registry cross-witness). Idempotent.
- **C6** — ran the release (registry `d53b6c8`, website pins it); docs (`02`/`03`/`04` reason codes, registry
  README → atomic), codegraph, MEMORY, this status. PRs.

## Verify (all green)
`skills:check` (validate + verifier + consistency + chain + multi-key gates + **22 tests**) · `build` (36 routes)
· `registry/validate.mjs --check` (sourcePackage proof + cross-witness, **0 pending-resign**) · `skills:verify`
all 4 → `verified`/`amtech-reviewed`/seq 2 · retired key still verifies, revoked key/skill → `revoked` · both
repos' release commits show `git log --show-signature` = Good ssh signature.

## Key files
Anchor: `scripts/signing/{amtech-signing.ts,sign-skills.ts}`, `run-conformance.ts`, `attestation-gates.ts`,
`verifySkill.ts`, `registry/validate.mjs`. Multi-key: `build-skills.ts` (`/.well-known/keys/*`),
`verifier-loaders.ts`. Commit signing: `scripts/signing/generate-commit-key.ts`, `signing/`,
`build-skills.ts` (`commitSignature`), `validate-skills.ts` (G-M4.4). Pipeline: `scripts/skills/publish-skill.ts`.

## Next
Nothing required — the standard is feature-complete for v2 (M0–M5). Optional futures (unchanged): Option B
Merkle log, `behavior-verified`/`proof-verified`, Tier-3 instruction-in-meta. The artifact private key
(`.amtech/signing-private-key.pem`) and the commit-signing key (`.amtech/commit-signing-key`) are git-ignored —
a fresh clone runs `signing:keygen` / `signing:commit-keygen` (or restores the keys) before a release.
