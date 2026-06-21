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
Spec: `02` (+ ladder/method `09`). Gates: G-M1.1–G-M1.4, G-X.1–X.2. **Largely implemented** — done/not-done split in `docs/memory/current-identity.md`; completion plan in `docs/memory/plan-2026-06-20--m1-complete-m2-scaffold-verification-recipe.md`.

**Done:** `amtech-signing.ts` v2 cert + `attestations.conformance` + `sourcePackage` + `packagePayloadDigest()`; `run-conformance.ts` offline runner (Ajv compile + golden validates + instruction↔schema consistency); per-skill evidence (`conformance.json`/`review.json`/`examples/`); `sign-skills.ts` independent signer gates → v2 `amtech-reviewed` certs; `build-skills.ts` publishes evidence + threads tier/policy/`sourcePackage`; `reasonCodes.ts` canonical set.

**Resume:**
1. `src/lib/skills/renderSkillContent.ts` — "Source & verification" prose → v2 + conformance/review evidence links + trust-tier chip; `npm run typecheck`.
2. `scripts/skills/validate-skills.ts` — G-M1.2/1.4 + negative fixtures (stale / commit-mismatch / undeclared-script / golden-fails-schema each fail signing) + byte-identical evidence re-run.
3. Registry reconcile (`amtech-skills-registry`): mirror pubkey, rewrite `validate.mjs` for the v2 cert + recompute `sourcePackage`, v2 fields in `index.json`, two-phase lockstep flip `pending-resign`→`signed`.
4. End-to-end verify + codegraph/memory/status handoff.

**Acceptance:** every cert v2 with a defensible tier; negative fixtures fail; evidence byte-stable; one certificate verifies in both repos.

---

## M2 — Link-first verifier (+ verification-method registry & self-describing recipe)
Spec: `04` + `09`. Gates: G-M2.1–G-M2.3, G-X.3, G-X.5–X.7. **Status: COMPLETE 2026-06-20** — pure
`src/lib/skills/verification/verifySkill.ts` + `methodRegistry.ts`; `scripts/skills/verifier-loaders.ts`
`resolveEntry()` converges from any entry-point; `skills:verify` CLI; `revoked` handling; G-M2 fixtures.

**Do:**
1. `scripts/signing/verify-skill.ts` (+ reusable lib) — generalize `verify-artifact.ts`; accept page/bootstrap/catalog/certificate/authority URLs; check sequence → `verified|revoked|invalid` + reason codes (consume `reasonCodes.ts`) + depth (link-only / **graph-replay** / archive-byte) + `method`/`trustTier`.
2. **Method-registry module** — `method → max-tier` map (`signature`/`static-contract`/`amtech-review`/`graph-replay`; `live-model`/`zk-compute` declared, unimplemented). Reads the envelope; methods are drop-in.
3. **`graph-replay` recompute** — WebCrypto-parity recipe: RFC 8785 canonical → Ed25519 → archive+`sourcePackage` digests → per-file **SRI** vs. signed manifest → **catalog root**. Deterministic; emits the verdict object.
4. `scripts/skills/build-skills.ts` — emit per-file SRI `integrity` into each `manifest.json` + the catalog root.
5. `package.json` — `skills:verify`; optional Netlify fn (API).
6. `scripts/skills/validate-skills.ts` — run verifier over all published skills (G-M2.3) + fixtures (tampered cert → `INVALID_SIGNATURE`, revoked → `revoked`, file drift → `MANIFEST_DIGEST_MISMATCH`, good → `verified`).

**Acceptance:** verifier maps a known-good cert to the right tier/method and tampered inputs to exact reason codes; SRI + catalog root recompute; build fails if any published skill ≠ `verified`.

---

## M3 — Multi-surface exposure (+ head-level recipe delivery)
Spec: `05` + `09`. Gates: G-M3.1–G-M3.3, G-X.4. **Status: COMPLETE 2026-06-20** — `build-skills.ts` runs ONE
verifier pass (deterministic `checkedAt`) and projects the verdict to `catalog.json`/`manifest.json`
`verification`, the generated content (+ fileRoutes), `_headers`, Tier-1 `amtech:skill:*` meta, agent-map
`skill`/`verify`/`files`, `ClaimReview` JSON-LD, the body badge, and per-skill **`recipe.json`**; the head/body
consistency gate (`validateSurfaces`) enforces agreement + method-ceiling honesty.

**Do:**
1. `src/lib/seo/renderHead.ts` + `src/lib/skills/renderSkillContent.ts` — HTML badge + JSON-LD verdict block (skill + hub) with `checkedAt`/`authoritySequence`; **Tier-1 `amtech:skill:*` meta + `amtech:skill:recipe`**, agent-map `skill`/`verify`/`files` blocks, `rel` + **SRI** link relations (Tier-2).
2. `scripts/skills/build-skills.ts` — verdict fields into `catalog.json` + each `manifest.json` + bootstrap one-liners; `amtech:catalog:root` on the hub.
3. `public/_headers` — `X-AMTECH-Skill-Verification` header.
4. `scripts/skills/validate-skills.ts` — cross-surface + **head/body consistency** gate (one build-time verifier run feeds all surfaces); Tier-3 attribute behind the research gate.

**Acceptance:** all surfaces (incl. head meta) agree per skill; no surface over-claims a tier; static surfaces marked build-time.

---

## M4 — Immutable authority history
Spec: `03`. Gates: G-M4.1–G-M4.4. **TOTALLY COMPLETE 2026-06-20** (`docs/memory/status-2026-06-20--m4-atomic-m5-finished.md`):
chain + revocation + **atomic sourcePackage-anchored release (no commit binding, no pending-resign)** + **multi-key
historical serving** + **SSH-signed publishing commits**. Earlier groundwork notes below. (`docs/memory/status-2026-06-20--m4-full-m5-pipeline.md`)
— `sign-authority.ts` maintains the hash-chained history: idempotent append (unchanged state → no record), `events[]`
diff + materialized `state{skills,keys}`, revocations via `src/lib/skills/authority/revocations.json`. The verifier
(`verifySkill.ts`) walks the chain (gap-free/linked/signed/latest-pointer) and honors `skill-revoke`/`key-revoke`
from the signed head state → `revoked`. `rotate-key.ts` (`signing:rotate`) handles key lifecycle (active/retired/
revoked + key-rotate event). The registry mirrors the chain under `authority/` and `registry/validate.mjs`
cross-witnesses it; `commitSignature` is the `git-history` witness (G-M4.4). Deferred: multi-key-by-keyId historical
serving, GPG/SSH commit signing, Option B Merkle log.

**Do:**
1. New `scripts/skills/build-authority.ts` (or extend `build-skills.ts`) — emit `amtech-authority-record/v1` records to `public/.well-known/authority/records/NNNN.json`, append `log.json`, and rewrite `skill-authority.json` as the latest pointer (`latestSequence`, `latestRecordHash`, materialized `state`). Sign each record (Ed25519 over canonical JSON). Fold the `amtech:catalog:root` (M3) into each record so the chain commits to the exact skill set at that sequence; a verification-method/registry change (`09`) is recordable as a policy event.
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

The standalone registry is **already productionized**. The in-repo `docs/agent-skills/` copy is **not stale and must not be deleted** — it holds the full set of skill packages, including ones intentionally **not yet published/certified on the website** (a deliberate backlog, see below). Registry HEAD `88d9ce8` **matches the live authority commit-pin**, so the *published* origins are in lockstep; for the productionized registry surfaces (checksums/validate/plugin/CI), treat the cloned GitHub repo as current.

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

### Skill onboarding backlog (deferred to M5, on purpose)

The registry holds **7 packages**; only `okf-audit` + `knowledge-graph-builder` (`agent-tool`) are website-published/certified today. The remaining packages — `estimate`, `invoice`, `daily-checkin` (`ai-employee`), `amtech-article-publisher`, `amtech-article-research-writer` (`amtech-workflow`) — are a **deliberate backlog to certify and publish to the website registry, not stale content**. Do not delete `docs/agent-skills/`; it is where these live.

Onboarding them now would mean hand-running the two-phase release once per skill — volatile and error-prone. The plan is to **publish them as a batch after M0–M4 land**, once the standard is stable, using a repeatable pipeline (M5). Keep them referenced and intact until then.

## M5 (follow-on) — "Certified AMTECH skill publishing" pipeline + onboard backlog

**Live pipeline DONE 2026-06-20** — `scripts/skills/publish-skill.ts` now has `--execute <slug>` (registered skills:
conformance → build → sign certs + authority record → check (verifier + consistency + chain gates) → verify →
registry cross-witness; gated + idempotent) alongside `--dry-run [<slug>|--all]`. Self-tested on `okf-audit` (no
diff). **Remaining:** rewrite the 5 backlog skills (`onboarding-backlog.json`) to our format (schema + golden +
review), then `--execute` each + the registry two-phase. The batch-onboarding itself is the next session.

After M0–M4 stabilize the standard, build a repeatable **Certified AMTECH skill publishing** pipeline (itself a candidate AMTECH skill) that turns "add a skill" into a single low-volatility operation instead of a manual two-phase release. It should: take a skill source folder → run tests + record review evidence (M1) → materialize website surfaces (M0/M3) → execute the registry two-phase release (Phase 1 registry commit + `pending-resign`, Phase 2 website `skills:sign`/`check`/`build`, then flip to `signed`) → append the authority record (M4) → verify (M2) end-to-end, with the gates in `07` enforced automatically.

Then use it to **batch-onboard the backlog**: `estimate`, `invoice`, `daily-checkin`, `amtech-article-publisher`, `amtech-article-research-writer`. This is *why* onboarding is deferred — do it once, repeatably, on a stable standard. Spec this milestone in detail only after M0–M4 are real.

## Out of scope for v2 (documented futures)
- Full RFC-6962 Merkle log + inclusion/consistency proofs (Option B — upgrade path designed into M4 records).
- Multi-key thresholds / delegated roles (TUF-style).
- Keyless/OIDC signing, hosted Rekor-style log, federated multi-issuer trust anchors.

## Cross-references
- Specs: `01`–`09` (the verifiability ladder + method registry + `graph-replay` recipe live in `09`). Cross-cutting gates G-X.* in `07`. Reconciliation + this M-sequence's rationale: `/home/computer/.claude/plans/robust-doodling-dolphin.md` (Phase 0) + `docs/memory/plan-2026-06-20--m1-complete-m2-scaffold-verification-recipe.md`. Research: `wiki/research/2026-06-19-*`. Existing pipeline: `docs/SKILL_MATERIALIZATION_PIPELINE.md`, `docs/UNIVERSAL_SKILL_LINK_CONTRACT.md`, `docs/SKILL_SIGNING.md`.
