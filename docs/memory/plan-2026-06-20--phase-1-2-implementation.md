# Implementation Plan — Phase 1 (complete M1) + Phase 2 (scaffold M2)

Date: 2026-06-20 · Branch: `skill-ca-m1-attestations`
Parent plan: `docs/memory/plan-2026-06-20--m1-complete-m2-scaffold-verification-recipe.md`
Standard (reconciled Phase 0): `docs/skills/standard/01`–`09`. North star: `docs/memory/current-identity.md`.

**Preconditions (met):** Phase 0 done — specs `01`–`09` reconciled, tier/reason-code names unified with code
(`TrustTier` now includes `replay-verified`; `reasonCodes.ts` extended with verifier/M2 codes). `npx tsc --noEmit`
is green. Conventions: after each task run `npm run typecheck` → `skills:check`; one PR per phase; keep
website↔registry in lockstep.

---

## PHASE 1 — Complete M1 (v2 attestations; "one CA, both repos verify")

Gates: G-M1.1–G-M1.4, G-X.1–X.2 (`07`). Reason codes are the canonical strings in
`src/lib/skills/verification/reasonCodes.ts`.

### 1a — Surface the v2 verification block (`renderSkillContent.ts`)
**Problem:** `src/lib/skills/renderSkillContent.ts:118` still prose-claims *"AMTECH Signed Artifact **v1**
certificate"* and lists no evidence. The trust-tier chip already exists (`:65`–`74`).
**Do:**
- Rewrite the "Source &amp; verification" `<p>` (`:117`–`118`) to describe **v2**: Ed25519 over canonical JSON
  binding owner/skill/version/repo-commit/SHA-256/SHA3-512 **plus** the `attestations` predicate
  (offline `conformance` + AMTECH `review`) and the `sourcePackage` cross-repo anchor.
- Add an **evidence links** list (only when `content.attestations` present): conformance evidence
  (`/skills/<slug>/evidence/conformance.json`), review evidence (`review.json`), and the certificate/signature.
  Pull URLs from the same content model the chip uses; omit gracefully for tier `signed`.
- Keep wording honest: "verified at build time" — do not imply a live check (`05` honesty rule).
**Files:** `src/lib/skills/renderSkillContent.ts` (+ `renderHubContent.ts` only if it repeats the v1 string —
grep first). **Source of fields:** the generated `skill-content.ts` (already threaded by `build-skills.ts`).
**Acceptance:** `npm run typecheck`; prerendered skill page shows v2 prose + resolvable evidence links; tier
`signed` page renders with no evidence block (no crash).

### 1b — G-M1 gates + negative fixtures (`validate-skills.ts`)
**Context:** `scripts/skills/validate-skills.ts` uses a `fail()` accumulator; `validateSkill()` already checks
manifest digests + Ed25519 cert (`:172`) + archive digests (`:174`); `validateCatalogBootstrap()` holds G-M0.
**Do — add `validateAttestations(slug)` (G-M1.1–1.4):**
- **G-M1.1** every published cert is `amtech-signed-artifact/v2` with `attestations` (or explicitly tier `signed`).
- **G-M1.2** re-assert the signer gates independently (never trust `sign-skills.ts`): `conformance.sourceCommit
  == repository.commit` (`COMMIT_MISMATCH`), freshness ≤ `MAX_EVIDENCE_AGE_DAYS` (`STALE_EVIDENCE`),
  `result==pass` (`CONFORMANCE_FAILED`), `permissions.scripts` == archive executables (`UNDECLARED_SCRIPT`),
  `sourcePackage` recomputes via `packagePayloadDigest()` (`SOURCE_PACKAGE_MISMATCH`), and for `amtech-reviewed`
  `review.result==approved` + `policyVersion` match (`REVIEW_NOT_APPROVED`).
- **G-M1.3** each `evidence.sha256` resolves to the published file and recomputes equal (`EVIDENCE_DIGEST_MISMATCH`
  / `EVIDENCE_MISSING`).
- **G-M1.4** re-run `computeConformanceEvidence(slug)` (exported from `run-conformance.ts`) and assert the result
  is **byte-identical** to the committed `evidence/conformance.json` (defeats hand-edited evidence).
- **G-X.1/X.2** assert every reason string used here is a member of `REASON_CODES`, and `TrustTier` names match
  the `02`/`09` ladder (a tiny static check or a unit test).
**Do — negative fixtures** (a `scripts/skills/__fixtures__/` or an inline test harness): four mutated inputs each
**fail signing/validation** with the exact reason code — (1) stale `conformance.ranAt`, (2) `sourceCommit`≠commit,
(3) an undeclared executable in the archive, (4) a golden example that fails its schema. Wire as
`npm run skills:test:negative` (or fold into `skills:check`).
**Acceptance:** `npm run skills:check` green on real skills; each negative fixture fails with its reason code.

### 1c — Registry reconcile (`~/Desktop/amtech-skills-registry`, lockstep)
Spec: `08` "Cross-repo work" + `02` `sourcePackage`. **Only spawn a subagent if the user asks; otherwise inline
via `git -C`.**
**Do:** mirror the public key into `registry/amtech-signing-key.json` (currently `pending-publication`/null);
rewrite `registry/validate.mjs` to (a) verify the **v2** cert (Ed25519 over canonical JSON), (b) recompute
`sourcePackage` from the registry's source files and assert equality with the cert — this is the proof that
*one* cert verifies in *both* repos; add the v2 `verification` fields (trustTier/policyVersion/method/evidence)
to `index.json`; flip `okf-audit`/`knowledge-graph-builder` `pending-resign`→`signed` **only** when
`validate.mjs --check` is green against the pinned bytes/commit.
**Lockstep:** the website authority `repository.commit` pins a registry commit — follow the documented two-phase
release (`registry/README.md`); do not push one repo's release without the other's pin.
**Acceptance:** `node registry/validate.mjs --check` green; `sourcePackage` recomputed in the registry equals the
website cert; both repos at lockstep HEADs.

### 1d — End-to-end verify + handoff
**Do:** `npm run skills:sign` → `skills:check` → `build`; re-run the live black-box walk (a fresh agent given only
`https://amtechai.com/skills` enumerates, reaches each page, verifies each cert **and** new evidence). Update
`docs/codegraph.md` (handoff pointer already set; flip M1 wording to "complete" when true), `MEMORY.md`, and write
`docs/memory/status-2026-06-20--m1-complete.md`.
**Acceptance:** v2 chain verifies end-to-end on both repos; black-box walk passes; docs/memory updated.

---

## PHASE 2 — Scaffold M2 (link-first verifier + verification-method registry + self-describing recipe)

Gates: G-M2.1–G-M2.3, G-X.3, G-X.5–X.7 (`07`). Spec: `04` + `09`. **Scaffold, not full UI surfacing** (that is M3).

### 2a — Verification-method registry (pure module)
**New:** `src/lib/skills/verification/methodRegistry.ts` — a `method → { maxTier, depth }` map for
`signature`/`static-contract`/`amtech-review`/`graph-replay`; `live-model`/`zk-compute` **declared but mapped to
no runtime tier** (reserved/horizon). Export `maxTierForMethod(method): TrustTier | null` (null → `METHOD_UNKNOWN`).
Reads only the envelope; adding a method = one entry + a checker (no cert/verifier shape change).
**Acceptance:** unit test: each known method maps to its ceiling; unknown → null/`METHOD_UNKNOWN`.

### 2b — Verifier library + `graph-replay` recompute
**New:** `src/lib/skills/verification/verifySkill.ts` (pure, reused by CLI + validator), generalizing
`scripts/signing/verify-artifact.ts`. Implements the `04` check sequence → `{ verdict, depth, trustTier, method,
subject, reasonCodes[], evidence, checkedAt }` consuming `REASON_CODES`. Depths: `link-only` /
**`graph-replay`** / `archive-byte`.
**`graph-replay` recipe** (deterministic; mirrors `09`):
1. canonicalize cert (`canonicalJson`) + Ed25519 verify (`verifyCertificate`) → `INVALID_SIGNATURE`/`IDENTITY_MISMATCH`.
2. recompute archive digests + `sourcePackage` (`packagePayloadDigest`) → `DIGEST_MISMATCH`/`SOURCE_PACKAGE_MISMATCH`.
3. per published file: recompute SHA-256, compare to the manifest's **SRI** `integrity` → `MANIFEST_DIGEST_MISMATCH`.
4. recompute the **catalog root** (see 2c) → `CATALOG_ROOT_MISMATCH`.
Determinism check: re-run steps 2–4 once; any divergence → `REPLAY_NONDETERMINISTIC`.
**Note:** implement with Node `crypto` now; keep the digest/canonical helpers WebCrypto-portable so M3 can run the
same recipe in-browser (research item: RFC 8785 + SRI-for-`fetch()` parity).
**Acceptance:** unit tests — known-good cert → `verified`/correct tier+method; tampered cert → `INVALID_SIGNATURE`;
mutated published file → `MANIFEST_DIGEST_MISMATCH`; mutated catalog → `CATALOG_ROOT_MISMATCH`.

### 2c — Emit SRI + catalog root at build (`build-skills.ts`)
**Do:** for each published machine file, add `integrity: "sha256-<base64>"` to its `manifest.json` entry (alongside
the existing `sha256`/`sha3_512`). Compute the **catalog root** = `sha256(canonicalJson(skills.map(s => ({ slug,
cert: s.certificate.sha256 })).sort(bySlug)))`; emit it into `catalog.json` (`catalogRoot`) and reserve
`amtech:catalog:root` for the hub head (M3 surfaces it). Document the algorithm inline so the registry + browser can
recompute identically.
**Acceptance:** manifest entries carry `integrity`; `catalog.json` carries `catalogRoot`; both recompute in 2b.

### 2d — CLI + validator wiring
**Do:** `scripts/signing/verify-skill.ts` thin CLI over the lib (`npm run skills:verify <url> [--archive-byte]`),
prints the `04` JSON. Extend `validate-skills.ts` to run the verifier over every published skill (G-M2.3, build
fails if any ≠ `verified`) + the conformance fixtures (tampered/revoked/file-drift/good → exact reason codes).
Optional: a Netlify function wrapping the lib (API) — defer unless cheap.
**Acceptance:** `npm run skills:verify <url>` returns spec JSON; `skills:check` runs the verifier across all skills;
fixtures map to exact reason codes.

---

## What is explicitly NOT in Phase 1/2 (deferred)
- **M3 surfacing** — Tier-1 `amtech:skill:*` meta, agent-map `verify` block, `X-AMTECH` header, head/body
  consistency *enforcement*, in-browser recompute. (Phase 2 only emits the data + Node-side recompute.)
- **M4** — authority records/log, catalog-root folded into the chain, signed commits.
- **Consumer-side re-derivation** ("testing skill") — verdict format defined in `09`; build deferred.
- **`behavior-verified`/`proof-verified`** — reserved/horizon, declared in the registry, unimplemented.

## Open decisions to confirm while implementing
1. **Catalog-root preimage** — proposed `sha256(canonicalJson(sorted [{slug, cert.sha256}]))`. Confirm before the
   registry + browser depend on it (changing it later is a breaking recompute).
2. **SRI for `fetch()`-retrieved JSON/markdown** — Node recompute is trivial; verify the browser path (M3) can use
   the same `sha256-<base64>` form for non-subresource fetches (research item).
3. **Negative-fixture harness location** — `__fixtures__` + a test runner vs. inline in `validate-skills.ts`. Pick
   the one that fits the repo's existing test pattern (grep `*.test.ts` / `vitest`/`node:test`).

## Sequencing & commands
Phase 1 (1a→1b→1c→1d) lands as the **M1-completion PR** (stacked on #47). Phase 2 (2a→2c→2b→2d; emit SRI/root
before the verifier consumes them) lands as the **M2-scaffold PR**. After each task: `npm run typecheck` →
`npm run skills:check`; after each phase: `npm run build` + the live black-box walk.
