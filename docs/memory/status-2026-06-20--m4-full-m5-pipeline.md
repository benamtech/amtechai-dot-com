# Status — M4 full (immutable authority) + M5 live pipeline COMPLETE

Date: 2026-06-20 · Branch: `skill-ca-m4-authority` (stacked on `skill-ca-m1-attestations` / PR #48).
Plan: `/home/computer/.claude/plans/indexed-booping-eich.md`. Follows `status-2026-06-20--m2m3-complete-m4m5-groundwork.md`.

## What this makes true (the readiness goal)
Before onboarding real skills it must be possible to **revoke** a bad skill or compromised key, the authority
history must be **tamper-evident + cross-witnessed**, and onboarding must be **one repeatable command**. All true now.

## Landed as 6 commits (branch `skill-ca-m4-authority`; all green)
- **M4.1** (`693a32a`): authority record → the `03` shape — `events[]` (genesis + skill-publish) + materialized
  `state{catalogRoot, skills[], keys[]}`. verifier/validator read `state`.
- **M4.2** (`189bb30`): **chain append + idempotency** — `sign-authority` compares the desired materialized state
  to the head record's; unchanged → appends nothing; changed → appends record N+1 (`previousRecordHash =
  sha256(canonicalJson(head))`, `events` = the diff) from `src/lib/skills/authority/revocations.json`. Records are
  immutable; `build-skills` publishes every record + gap-free `log.json` + latest pointer + `state`.
- **M4.3** (`50b87b3`): **verifier chain walk + revocation** — walk `log.json` + records: gap-free/monotonic,
  linked `previousRecordHash`, log-entry hash match, each signature verifies, latest pointer == head digest,
  cert in head state; a **skill-revoke** in the signed head state → `revoked`. Loaders fetch log + records by stem.
  Integration-proven: a 2-record chain revokes one skill while the other stays verified at the head sequence.
- **M4.4** (`37e0f05`): **key lifecycle** — keys carried forward (active/retired/revoked), `key-rotate`/`key-revoke`
  events; the chain walk honors a **key-revoke** → `revoked` (`KEY_NOT_ACTIVE`). `rotate-key.ts` (`signing:rotate
  --yes`) archives the prior key retired + installs a fresh active key (operator-only).
- **M4.5** (`c154ade` + registry `1ec4a8d`): **registry cross-witness** — the registry mirrors the signed chain
  under `authority/` and `registry/validate.mjs` independently validates it (signature/links/latest/catalogRoot);
  `commitSignature` is now `git-history` (env-overridable), not `unsigned`; website gate **G-M4.4**.
- **M5** (`c395490`): **live pipeline** — `skills:publish --execute <slug>` runs sign → check → verify → registry
  cross-witness, gated + idempotent; `--dry-run` still prints the backlog plan. **Self-test:** `--execute okf-audit`
  runs the full pipe with **no diff**.

## New scripts / inputs
`scripts/signing/rotate-key.ts` (`signing:rotate`), `src/lib/skills/authority/revocations.json`,
`scripts/skills/publish-skill.ts --execute`; registry `authority/` mirror + chain validation in `registry/validate.mjs`.

## Verify (all green)
`npm run typecheck` · `npm run skills:check` (validate + verifier + consistency + chain gates + **21 tests**) ·
`npm run build` · `node ~/Desktop/amtech-skills-registry/registry/validate.mjs --check` (incl. cross-witness) ·
`npm run skills:publish -- --execute okf-audit` → no diff. Revocation: add a `revocations.json` entry → one new
chained record → `skills:verify` returns `revoked`; remove it → next record restores `verified`.

## Operational notes
- **Revoke a skill/key:** add it to `src/lib/skills/authority/revocations.json` (+ `asOf`), `npm run skills:sign`
  (appends one chained record), re-run the registry mirror/cross-witness, commit both repos in lockstep.
- **Rotate the key:** `npm run signing:rotate -- --yes` then `npm run skills:sign` (re-signs all + a key-rotate record).
- **Cross-repo commits stay the explicit operator step** (the registry two-phase pending-resign → signed); the
  pipeline runs every gate + the mirror so that step is mechanical.

## Now ready — next session
The pipeline is complete and proven. The only remaining work before real skills go live is **rewriting the 5
backlog skills to our format** (a JSON output schema + golden + review per skill; the `amtech-article-*` two are
`requiresRepositoryContext` and may not be appropriate public tools), then running
`npm run skills:publish -- --execute <slug>` per skill and the registry two-phase. See `onboarding-backlog.json`
and `skills:publish --dry-run --all`.

## Deferred (unchanged)
Multi-key-by-keyId historical serving (single-key re-sign on rotation for now), Option B full Merkle log +
inclusion/consistency proofs, cryptographic (GPG/SSH) commit signing beyond the git-history witness,
`behavior-verified`/`proof-verified`, Tier-3 instruction-in-meta.
