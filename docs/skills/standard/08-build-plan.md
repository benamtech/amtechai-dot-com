# 08 — Build Plan (agentic-dev executable)

Part of the AMTECH Skill Certificate-Authority Standard. This is the implementation sequence a later agentic-dev session executes. Each milestone names exact files and a runnable acceptance check. Gates: `07-phase-gates-and-acceptance.md`.

## Conventions for the executing agent
- Start every session by reading `docs/skills/standard/README.md`, then this file, then the milestone's spec section.
- Reuse, don't re-implement: `canonicalJson`, `verifyCertificate`, `digest`, `signCertificate` from `scripts/signing/amtech-signing.ts`.
- After each milestone: `npm run typecheck` → `npm run skills:check` → `npm run build`; then re-run the live black-box walk (`scripts/` verify harness pattern from the verifier spec).
- Keep `docs/codegraph.md` updated when a route/surface/script changes (agent usage note #7).
- One milestone per PR/commit; do not start Mn+1 until Mn's gates pass.

---

## M0 — Catalog skills-browser + bootstrap (prerequisite, ships first)
Spec: `06-catalog-bootstrap.md`. Gates: G-M0.1–G-M0.4.

**Do:**
1. `scripts/skills/build-skills.ts` — emit `public/skills/catalog.json` (`amtech-skill-catalog/v1`), hub `use.md`, hub `agent.md`, all derived from `src/lib/skills/registry.ts`.
2. `src/pages/Skills.tsx` — add prerendered agent-instruction block + catalog-level decision tree + per-skill list with page/use/manifest/certificate/authority links (mirror `SkillDetail.tsx`).
3. `src/lib/seo/pageMeta.ts` — hub entry carries the bootstrap body so the prerenderer emits it.
4. `public/_headers` — `catalog.json` content-type + caching.
5. `scripts/skills/validate-skills.ts` — G-M0 assertions.

**Acceptance:** fresh agent given only `https://amtechai.com/skills` can enumerate skills, reach each page, and verify each certificate. `npm run skills:check` + `npm run build` green.

---

## M1 — Certificate attestations (`amtech-signed-artifact/v2`)
Spec: `02`. Gates: G-M1.1–G-M1.3.

**Do:**
1. `scripts/signing/amtech-signing.ts` — add optional `attestations` to `ArtifactCertificate`; bump `schemaVersion` literal to `v2`.
2. `src/lib/skills/certificates/<slug>/evidence/{tests.json,review.json}` — evidence source; publish to `/skills/<slug>/evidence/*` via `build-skills.ts`.
3. `scripts/signing/sign-skills.ts` — enforce signer gates (commit match, freshness, result==pass, evidence digests resolve, scripts==archive, review approved for `human-reviewed`); hard-fail otherwise.
4. `scripts/skills/validate-skills.ts` — G-M1 checks incl. a negative fixture (stale evidence must fail signing).
5. Re-sign existing skills at their proven tier; `npm run skills:sign`.

**Acceptance:** every cert is v2 with a defensible tier; a stale/absent-evidence fixture fails signing.

---

## M2 — Link-first verifier
Spec: `04`. Gates: G-M2.1–G-M2.3.

**Do:**
1. `scripts/signing/verify-skill.ts` (+ reusable lib) — generalize `verify-artifact.ts`; accept page/bootstrap/catalog/certificate/authority URLs; implement the check sequence → `verified|revoked|invalid` + reason codes + depth (link-only/archive-byte).
2. `package.json` — `skills:verify` script.
3. Optional Netlify function wrapping the lib (API surface).
4. `scripts/skills/validate-skills.ts` — run verifier over all published skills (G-M2.3) + conformance fixtures (tampered/revoked/good).

**Acceptance:** `npm run skills:verify <url>` returns the spec JSON; fixtures map to exact reason codes; build fails if any published skill ≠ `verified`.

---

## M3 — Multi-surface exposure
Spec: `05`. Gates: G-M3.1–G-M3.3.

**Do:**
1. `src/lib/seo/renderHead.ts` + `src/lib/skills/renderSkillContent.ts` — HTML badge + JSON-LD verdict block (skill + hub), carrying `checkedAt`/`authoritySequence`.
2. `scripts/skills/build-skills.ts` — verdict fields into `catalog.json` + each `manifest.json` + bootstrap one-liners.
3. `public/_headers` — `X-AMTECH-Skill-Verification` header.
4. `scripts/skills/validate-skills.ts` — cross-surface consistency gate (one build-time verifier run feeds all surfaces).

**Acceptance:** all surfaces agree per skill; no surface over-claims a tier; static surfaces marked build-time.

---

## M4 — Immutable authority history
Spec: `03`. Gates: G-M4.1–G-M4.4.

**Do:**
1. New `scripts/skills/build-authority.ts` (or extend `build-skills.ts`) — emit `amtech-authority-record/v1` records to `public/.well-known/authority/records/NNNN.json`, append `log.json`, and rewrite `skill-authority.json` as the latest pointer (`latestSequence`, `latestRecordHash`, materialized `state`). Sign each record (Ed25519 over canonical JSON).
2. Implement `key-rotate`/`key-revoke`/`skill-revoke` events + key-status lifecycle in the key document.
3. `scripts/signing/verify-skill.ts` — add authority-chain checks (chain intact, latest pointer matches, revocation honored).
4. Sign publishing commits (fix `commitSignature`); document the GitHub cross-witness.
5. `scripts/skills/validate-skills.ts` — G-M4 chain/consistency/revocation checks.

**Acceptance:** chain is gap-free + signed; latest pointer matches head; a revocation event flips the verdict to `revoked`; signed commits mirror records.

---

## Cross-repo work (two repositories)

Implementation spans **two repositories** — an executing session needs access to both.

- **`amtechai-dot-com` (this repo).** Canonical skill source (`src/lib/skills/`), signing (`scripts/signing/`), build + validate (`scripts/skills/`), the verifier, the website surfaces, and the generated artifacts under `public/skills/**` + `public/.well-known/**`. **M0, M1, M2, M3 land here**, plus the M4 authority-record generation and signing.
- **`amtech-skills-registry` (separate GitHub repo, `github.com/benamtech/amtech-skills-registry`).** The public git-backed install source. Today its content is staged in-repo at `docs/agent-skills/` and published to the standalone repo. Registry-side work: synced skill folders + `index.json`, **signed publishing commits** (M4 fixes `commitSignature: "unsigned"`), reciprocal README/authority back-links, and the **cross-witness mirror of authority records** (the equivocation defense in `03`). The authority file's `repository.commit` pins a commit in *this* repo, so the two must be released in lockstep.

**Access in Claude Code (confirmed possible):** `gh` is authenticated (account `benamtech`) and reaches both repos. Clone `amtech-skills-registry` locally and add it as an extra working directory (`/add-dir <path>`); Read/Edit/Write/Bash work on any absolute path and git on the second repo works via `git -C <path>`. Releases that change both must keep the website's authority commit-pin and the registry's signed commit consistent (single coordinated release step).

### Registry repo — current state (discovered 2026-06-19, cloned at `~/Desktop/amtech-skills-registry`)

The standalone registry is **already productionized** and is the authoritative source — **not** the in-repo `docs/agent-skills/` copy, which is a stale earlier snapshot that has drifted (treat the cloned GitHub repo as truth; reconcile or regenerate `docs/agent-skills/` separately). Registry HEAD `88d9ce8` **matches the live authority commit-pin**, so the two origins are currently in lockstep.

What the registry already implements (do **not** rebuild — integrate with it):
- `ed25519-canonical-json-v1` verification + dual digests; `registry/checksums.json` (per-file SHA-256 + SHA3-512); `registry/validate.mjs --write|--check` staleness gate; `registry/amtech-signing-key.json` public-key mirror (no private key in the repo).
- `index.json` canonical catalog (7 skill packages across `agent-tool` / `ai-employee` / `amtech-workflow`; only `okf-audit` + `knowledge-graph-builder` are `publishedOnWebsite`); index never embeds its own commit (website authority pins externally).
- Codex plugin + marketplace (`plugins/amtech-free-skills/`), reciprocal website links, and a CI validation workflow.
- A documented **two-phase release** (see `registry/README.md` + `docs/agent-skills/REPO_AGENT_HANDOFF.md`): Phase 1 changes registry bytes, marks affected certs `pending-resign`, pushes, returns the SHA; Phase 2 the website pins the SHA, runs `skills:sign`/`skills:check`/`build`, deploys, then a follow-up registry sync mirrors the new certs and flips status to `signed`. Until both complete, packages are "update in progress."

Implications for our milestones (the **delta** to build, registry-side):
- **M1 (attestations)** — the registry's mirrored certs + `index.json` `verification` block must carry the v2 attestation/trust-tier fields; `registry/validate.mjs` must learn the v2 schema.
- **M4 (immutable authority)** — the git-anchored authority records + the equivocation cross-witness must hook into the existing two-phase protocol (the registry is the second witness); **fix `commitSignature: "unsigned"`** by signing the Phase-1 publishing commit.
- **Reconcile now-vs-spec:** registry `index.json` marks `okf-audit` `pending-resign` while the live website cert verifies — close this status lag as part of M1/M4 (flip to `signed` only if certs validate against the pinned bytes/commit).
- **M0/M2/M3** are website-only; no registry change required.

## Out of scope for v2 (documented futures)
- Full RFC-6962 Merkle log + inclusion/consistency proofs (Option B — upgrade path designed into M4 records).
- Multi-key thresholds / delegated roles (TUF-style).
- Keyless/OIDC signing, hosted Rekor-style log, federated multi-issuer trust anchors.

## Cross-references
- Specs: `01`–`07`. Research: `wiki/research/2026-06-19-*`. Existing pipeline: `docs/SKILL_MATERIALIZATION_PIPELINE.md`, `docs/UNIVERSAL_SKILL_LINK_CONTRACT.md`, `docs/SKILL_SIGNING.md`.
