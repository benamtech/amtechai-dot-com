# Plan — Complete M1, scaffold M2, prep M3/M4: the verifiability ladder + self-describing verification recipe

Date: 2026-06-20 · Branch: `skill-ca-m1-attestations` (stacked on M0 PR #47)
Supersedes the implementation-sequencing role of `/home/computer/.claude/plans/robust-doodling-dolphin.md`
(whose **doc-reconciliation** pass is folded in here as Phase 0). Orientation: `docs/memory/current-identity.md`.

---

## 0. North star (the ultimate vision — do not lose this)

AMTECH is building the **first build→sign→verify→render pipeline for agent-discoverable, verifiable
resources.** Skills are **instance #1 of a general signed-artifact standard**, not a one-off. The same five
verbs — `signed schema → build → sign(cert+attestations) → verify(link-first, reason codes) →
render(multi-surface)` — generalize to OKF/knowledge-graph bundles, datasets, and pages. End state =
**three decoupled concerns/repos** (CA+standard+tooling · registry · website-as-consumer), no distributed
runtime, fully static and deterministic, production-grade certification with zero infra.

**The sharpening locked this session — bake it into every phase:** verification must be **self-executing
from the surface**. The standard ships the *recipe plus the expected result* of a cheap deterministic check,
so any agent or downstream re-renderer **recomputes the verdict instead of trusting a rendered badge.** That
is the property that makes the standard *provisionable*: a third party that re-renders "verified" cannot fake
it — it has to recompute it. Deterministic recompute is the security property — **not** ZKP, **not** a live
model, **not** proof-of-work-for-its-own-sake.

### Concept decisions locked this session (carry into Phase 0 docs)
- **No live model, no ZKP as active work.** `behavior-verified` (method `live-model`) and `proof-verified`
  (method `zk-compute`) are **reserved/horizon rungs, documented only** — explicit v2 non-goals.
- **The "missing middle" rung = `replay-verified` via method `graph-replay`:** a deterministic, evidence-
  bound check **any party re-runs**; every step digest-bound; determinism (not consensus/compute) is the
  security property. Its **concrete instantiation** is the self-describing verification recipe:
  - Ed25519 verify over the **canonical** certificate (RFC 8785 / JCS),
  - SHA-256 recompute of the archive + `sourcePackage` cross-repo anchor,
  - **SRI-style** digest binding over every *published* file vs. the signed manifest,
  - **catalog-root** recompute over the per-skill digests (the set, not just one cert).
  All run client-side via WebCrypto; no infra.
- **Meta tags = transport for the recipe, never the proof.** Tier-1 only, descriptive-not-imperative, under
  the head/body consistency gate. Never the only channel (First-Fetch Principle holds).
- **Consumer-side opt-in re-derivation** (the "testing skill" that points an agent at a challenge and checks
  the response) = the *consumer's own* verdict. The standard defines the **verdict format**; the CA **never
  signs** it. Build deferred (post-M2).

---

## Scope of THIS plan
- **M1 → COMPLETE** (finish the interrupted resume tasks; one CA, both repos verify).
- **M2 → major scaffolding** (link-first verifier: method registry, reason-code unification, the
  `graph-replay` rung + client recompute path, SRI binding). Not the full surfaced verifier UI.
- **M3 → minor piping/prep** (Tier-1 head meta + agent-map `verify` block + consistency gate seam).
- **M4 → minor piping/prep** (catalog-root primitive surfaced; hash-chain hook points, no history store yet).

---

## Phase 0 — Standard reconciliation (prerequisite; absorbs M1 task 7 + robust-doodling doc pass)

Weave requirements into the numbered specs **before** more code lands, updated for this session's decisions.
No feature code in this phase.

- **`01-trust-model-and-threats.md`** — add actor *independent replay-monitor*; threats *verification-method
  spoofing*, *head/body divergence*, *replay non-determinism*, *badge-forwarding by re-renderers*; non-goals
  *no on-chain/ZK/live-model in v2* (`graph-replay` is deterministic recompute, not a compute network).
- **`02-certificate-attestation-schema.md`** — rename `human-reviewed`→`amtech-reviewed` (match code);
  adopt the full ladder `signed < structure-verified < amtech-reviewed < replay-verified` (+ reserved
  `behavior-verified`, horizon `proof-verified`); generalize the `method` field into a **method registry**
  reference; document the **offline `conformance`** reality (not live tests); keep the `sourcePackage`
  cross-repo anchor + I-JSON/no-numbers rule; point to new `09`.
- **`03-authority-and-key-management.md`** — verification-method/registry version travels under
  `policyVersion`; a method change may be an authority event; replay monitors = second witness alongside the
  GitHub cross-witness.
- **`04-link-first-verifier.md`** — verifier consumes `method → max-tier`; **unify the reason-code set with
  `src/lib/skills/verification/reasonCodes.ts`** (the code is canonical; doc adopts its names); add
  `METHOD_UNKNOWN`, `REPLAY_MISMATCH`, `REPLAY_NONDETERMINISTIC`, `MANIFEST_DIGEST_MISMATCH`,
  `CATALOG_ROOT_MISMATCH`; head-level claims are inputs to the consistency check; **document the
  self-describing recipe** (what ingredients the head carries + the recompute algorithm).
- **`05-multi-surface-exposure.md`** — promote meta Tiers 1–2 from "experimental" to **adopted**; Tier-3
  (descriptive/opt-in attribute) **research-gated**; enumerate meta / agent-map / link-rel / JSON-LD / header
  surfaces; state the head/body consistency gate + guardrails; add **SRI link relations** for published files.
- **`06-catalog-bootstrap.md`** — hub carries `amtech:catalog`, `amtech:skills:count`, **`amtech:catalog:root`**
  + agent-map `verify` block (hub = a `04` entry point).
- **`07-phase-gates-and-acceptance.md`** — new gates: head/body consistency (incl. meta), `method→tier`
  honesty (no surface claims a tier the method can't prove), replay-determinism, reason-code unification,
  manifest-SRI match, catalog-root match. Fold in M1 G-M1.1–1.4.
- **NEW `09-verifiability-and-proof-methods.md`** — the verifiability ladder + method registry + the
  `graph-replay` concept (proof-carrying materialization: the graph path *is* the algorithm; replay =
  recompute + compare digests) + the self-describing recipe spec + the reserved `behavior-verified` /
  horizon `proof-verified` rungs as **explicit v2 non-goals**.
- **`08-build-plan.md`** — rewrite to match `01`–`07`+`09` and this plan's M-sequence.
- Promote `wiki/research/2026-06-19-experimental-meta-tag-skill-delivery.md` status →
  "adopted (Tier-1/2), Tier-3 research-gated"; cross-link `09`.

**Phase 0 acceptance:** tier names + reason-code names identical across `01/02/04/05/07/09` **and** the M1
code (`amtech-signing.ts` `TrustTier`, `sign-skills.ts`, `reasonCodes.ts`); all cross-refs resolve; `08`
milestones map 1:1 to the numbered docs.

---

## Phase 1 — Complete M1 (resume the interrupted implementation)

From `current-identity.md` "NOT done", minus task 7 (now Phase 0):

- **(1a / task 11 tail)** `src/lib/skills/renderSkillContent.ts` — "Source & verification" prose still says
  **v1** and has no evidence links → update to **v2**, add conformance + review evidence links + the
  trust-tier chip wording. Then `npm run typecheck`.
- **(1b / task 12)** `scripts/skills/validate-skills.ts` — implement **G-M1.1–1.4** gates + **negative
  fixtures** that MUST fail signing: stale evidence, `sourceCommit` mismatch, undeclared script, golden-fails-
  schema. Re-run conformance and assert committed evidence is **byte-identical** (defeats hand-edited evidence).
- **(1c / task 13)** **Registry reconcile** (subagent on `~/Desktop/amtech-skills-registry`, only if user asks
  to spawn — otherwise inline): mirror the public key (`registry/amtech-signing-key.json` is
  `pending-publication`/null), rewrite `registry/validate.mjs` to verify the **v2** cert + recompute
  `sourcePackage`, add v2 metadata to `index.json`, two-phase lockstep flip `pending-resign`→`signed`. Commit
  registry only when `validate.mjs --check` is green. **Keep website↔registry in lockstep** (authority
  `repository.commit` pins a registry commit).
- **(1d / task 14)** End-to-end verify (`skills:sign` → `skills:check` → `build`; live black-box walk: a fresh
  agent given only the URL enumerates, reaches each page, verifies each cert + new evidence). Update
  `docs/codegraph.md` handoff pointer, MEMORY.md, and a `status-2026-06-20--…` handoff.

**M1 acceptance:** v2 chain verifies end-to-end on both repos; negative fixtures fail; evidence byte-stable;
both repos lockstep.

---

## Phase 2 — M2 scaffold (link-first verifier + self-describing recipe)

The verifier and the head-delivered recipe are two ends of one contract. Scaffold, don't fully surface.

- **(2a) Method registry + `method → max-tier` mapping.** Pure module consuming `reasonCodes.ts`; reads the
  attestation *envelope*, not the method internals (methods are drop-in). Seeds: `signature`, `static-contract`,
  `amtech-review`, **`graph-replay`** (+ reserved `live-model`, horizon `zk-compute` declared but unimplemented).
- **(2b) Client recompute path (`graph-replay` rung).** WebCrypto implementation of the recipe:
  RFC 8785 canonicalization → Ed25519 verify of the cert → SHA-256 of archive + `sourcePackage` →
  per-file **SRI** check against the signed manifest. Emits a reason-code verdict object. Deterministic;
  re-running reproduces the verdict.
- **(2c) SRI binding over published files.** `build-skills.ts` emits `integrity="sha256-…"` for each published
  file into the manifest/link relations; verifier recomputes and compares. Closes the "published file drifted
  from signed manifest" gap at the client.
- **(2d) Verdict object + format.** Canonical verdict shape (`tier`, `method`, `checkedAt`, `reasonCodes[]`)
  shared by the verifier and (later) the consumer re-derivation format. No live calls.

**M2-scaffold acceptance:** verifier module verifies a known-good cert to the correct tier and a tampered
file/cert to the right reason code, in a unit test; SRI present in manifest; no UI surfacing required yet.

---

## Phase 3 — M3 prep (multi-surface head delivery — minor piping)

- **(3a) Tier-1 meta via `extraMeta`** (`src/lib/seo/pageMeta.ts`): `amtech:skill:{slug,version,trust-tier}` +
  `use/manifest/certificate/authority` URLs + `amtech:skill:recipe` (URL of the recompute recipe). `verdict`/
  `checked-at` deferred until the M2 verifier is surfaced.
- **(3b) Extend the `amtech-agent-map` island** with a `verify` block (recipe ingredients + reason-code
  contract) and a `files` block.
- **(3c) Consistency-gate seam** (`07`): a build-time check that head claims == cert == body. Wire the seam +
  one assertion now; full enforcement lands with M3 proper.

**M3-prep acceptance:** head carries Tier-1 `amtech:*` + recipe pointer; consistency seam runs in `skills:check`.

---

## Phase 4 — M4 prep (catalog-root primitive — minor piping)

- **(4a) Catalog-root** `amtech:catalog:root` over the per-skill digests, emitted in the hub head + `catalog.json`.
- **(4b) Hash-chain hook points** in the authority generation (where a future snapshot links to its parent) —
  define the field shape, leave the history store for M4 proper.

**M4-prep acceptance:** hub head + catalog carry a recomputable root; authority schema reserves the chain fields.

---

## Research track (ongoing mandate — widen the base, don't block the build)
- RFC 8785 / JCS canonicalization parity in-browser (WebCrypto) vs. `canonicalJson` in `amtech-signing.ts`.
- SRI semantics for `fetch()`-retrieved JSON/markdown (vs. only `<script>/<link>` subresources) — confirm the
  client recompute path is the robust one.
- Verifiable-claims head conventions (JSON-LD `ClaimReview`-shaped verdict) for Tier-2.
- Tier-3 empirical validation (e.g., first-fetch behavior test) before any hard-ship.
- `proof-verified`/zk horizon — document-only; revisit only if a static-hostable succinct-proof path appears.
- **Generalization study:** the second instance of the standard (OKF bundle / dataset) — what changes, what's
  identical — to keep the "standard as base" thesis honest.

---

## Sequencing, PRs, conventions
1. **Phase 0** (docs) — can land as its own commit on this branch (no code).
2. **Phase 1** (M1 complete) — finishes the in-flight cert work; registry reconcile in lockstep.
3. **Phase 2** (M2 scaffold) → **Phase 3/4 prep** — additive, behind the verifier scaffold.
- Run `npm run typecheck` → `skills:check` → `build` after each phase; re-run the live black-box walk after M1.
- Status updates → MEMORY.md **and** a timestamped `docs/memory/status-…`; update the codegraph handoff pointer.
- Keep cross-repo lockstep + "one CA, no discrepancies." Never over-claim in a signed artifact.
- PRs: M1-completion PR (stacked on #47), then an M2-scaffold PR.
