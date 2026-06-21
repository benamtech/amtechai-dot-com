# current-identity — AMTECH CA standard, starter context

Token-efficient orientation. Read this first, then only the files you need (graph paths below).
Live work is **uncommitted on branch `skill-ca-m1-attestations`** (stacked on M0 PR #47).

## Identity / stance
Senior AMTECH engineer. Graph theory + posets/lattices, set theory, field theory; knowledge-graph
materialization; TypeScript + deterministic data design. Hyper-efficient; synthesizes novel structure
from existing primitives instead of adding machinery. Bias: reuse the pipeline we already have, keep
everything statically hostable + deterministic, never over-claim in a signed artifact.

## Thesis (the deep opportunity — keep widening this)
AMTECH is building the **first dedicated build→sign→verify→render pipeline for agent-discoverable +
verifiable resources.** The skill CA is **instance #1 of a general standard**, not a one-off:
- A *signed-artifact standard* turns any schema-conformant resource into a certificate-bearing,
  multi-surface-materialized, agent-consumable object. Same shape we already use for site pages
  (HTML / `.md` twin / JSON-LD / headers / `llms.txt` / manifest), generalized to **any signed schema**.
- Because a resource *follows the standard*, it *has a valid certificate* → a server can **provision the
  standard to agents** and render verifiable surfaces (HTML pages, the right files to surface, even
  download links for scripts of *verified* skills). As a service from AMTECH, or anyone holding a valid
  cert. Generalizes to: skills (now) → knowledge-graph/OKF bundles → data → pages.
- Ties directly to our existing studies: **SEO** (agent-readable first-fetch surfaces), **graph
  materialization** (OKF concept→many-views), **surface theory** (one model projected to many honest
  surfaces). The CA adds the missing axis: **verifiable assurance**, by digest, link-first.
- Research mandate: depth *and* breadth always increase. Treat each milestone as widening the
  base standard, not just shipping a feature.

## Architecture direction (forward — bake into plan, not yet done)
End state = **three separated concerns / repos**, no distributed runtime (static, build-time,
production-level certification with zero infra spun up):
1. **CA + standard + sign/verify tooling** (today lives in this website repo: `scripts/signing/`,
   `scripts/skills/`, `docs/skills/standard/`) → extract to its own repo.
2. **Skill registry** = content/install source → `amtech-skills-registry` (exists, `~/Desktop/...`).
3. **Website** `amtechai-dot-com` → consumes the standard at build time to retrieve + verify data.
The standard is the contract that lets these stay decoupled but consistent. (Mirrors how the
website↔registry already lock-step via a cross-repo digest, just static.)

## Where we are — M-series (spec set: `docs/skills/standard/` README + 01–08)
- **M0 DONE / shipped** (PR #47): `/skills` hub self-bootstrap. See `status-2026-06-19--skill-ca-m0-…md`.
- **M1 COMPLETE 2026-06-20** (this branch): v2 attestations + cross-repo CA reconciliation ("one CA, no
  discrepancies") verify end-to-end on both repos — see `docs/memory/status-2026-06-20--m1-complete.md`.
  **M2 scaffold next (PR B).** **Canonical implementation plan (2026-06-20): `docs/memory/plan-2026-06-20--m1-complete-m2-scaffold-verification-recipe.md`**
  — completes M1, scaffolds M2 (verifiability ladder + self-describing verification recipe: `graph-replay`
  rung = deterministic client-side recompute, no live model / no ZKP), preps M3/M4. Folds in the older
  doc-reconciliation pass `/home/computer/.claude/plans/robust-doodling-dolphin.md` as its Phase 0.
- M2 verifier → M3 multi-surface verdict → M4 immutable authority history → M5 pipeline+backlog.

## M1 state — done vs NOT done (the interrupted work)
DONE:
- `scripts/signing/amtech-signing.ts` — cert `schemaVersion v2`, added `sourcePackage` +
  `attestations` (`SkillAttestations`, `TrustTier`), `packagePayloadDigest()` (cross-repo anchor).
- `src/lib/skills/verification/reasonCodes.ts` — shared reason-code enum (signer + M2 verifier).
- `scripts/skills/run-conformance.ts` — offline contract-conformance (Ajv schema compile + golden
  example validates + instruction↔schema consistency). `method:"static-contract"` seam; deterministic.
- Evidence authored/generated per skill under `src/lib/skills/certificates/<slug>/`:
  `conformance.config.json`, `evidence/conformance.json` (generated), `evidence/review.json`,
  `evidence/examples/*` (golden). Both skills **pass** (30/30, 26/26).
- `scripts/signing/sign-skills.ts` — independent signer gates (re-validates everything, never trusts
  the runner): commit match, freshness ≤90d, result==pass, evidence digests, scripts==archive,
  review approved → emits **v2 `amtech-reviewed`** certs with `sourcePackage`. Verified signature OK.
- `scripts/skills/build-skills.ts` — publishes `/skills/<slug>/evidence/*`; verifies `sourcePackage`
  in `signedCertificate()`; threads `trustTier`/`policyVersion`/`sourcePackage`/evidence URLs into
  `manifest.json`, `catalog.json`, `skill-authority.json` (+ extended authority-v0 schema), and the
  generated `skill-content.ts`. `package.json`: added `skills:conformance`; `skills:sign` runs it first.
- Renderers: `renderHubContent.ts` shows real trust tier; `renderSkillContent.ts` has a trust-tier chip.
- `skills:sign` → `skills:check` green; ajv added (devDep).
M1 tasks — all COMPLETE 2026-06-20 (`docs/memory/status-2026-06-20--m1-complete.md`); the bullets below
record what each task delivered:
- **(task 11 tail)** `renderSkillContent.ts` "Source &amp; verification" prose now describes v2 +
  conformance/review evidence links. `npm run typecheck` green.
- **(task 12)** `scripts/skills/validate-skills.ts` — G-M1.1–1.4 gates + negative fixtures
  (stale/mismatch/undeclared-script/golden-fails-schema must fail signing); re-run conformance and
  assert committed evidence is byte-identical (defeat hand-edited evidence).
- **(task 7)** Revise `docs/skills/standard/02` (tests→offline `conformance`, tier ladder, `sourcePackage`
  anchor, reserved `behavior-verified`) + `07` G-M1 wording + cross-repo gate.
- **(task 13)** Registry reconcile (subagent on `~/Desktop/amtech-skills-registry`): mirror public key
  (`registry/amtech-signing-key.json` is `pending-publication`/null), rewrite `registry/validate.mjs`
  to verify the **v2** cert + recompute `sourcePackage`, add v2 metadata to `index.json`, two-phase
  lockstep flip `pending-resign`→`signed`. Commit registry only when `validate.mjs --check` green.
- **(task 14)** End-to-end verify + update `docs/codegraph.md` + memory + status handoff + PRs.

## Locked decisions
- Cert attests **AMTECH = reviewer+publisher** + **offline contract-conformance**, NOT live-AI tests.
  Future live-model run reuses the same envelope (`method:"live-model"`) → reserved tier `behavior-verified`.
- **One certificate, both repos verify** via the `sourcePackage` digest (canonical package-payload over
  source files; `packagePayloadDigest` here, to be mirrored in `validate.mjs`). No 2nd cert format.
- Tier ladder: `signed` < `structure-verified` < `amtech-reviewed` (< reserved `behavior-verified`).
- No JSON numbers in signed payload (RFC 8785 / I-JSON). Deterministic evidence (`ranAt` = release date).
- Two-phase lockstep: authority valid at every commit; any registry commit moves HEAD → forces website
  re-pin/re-sign — so do registry in coordinated phases.

## Graph paths (read-order traversals — minimize tokens)
- **Orient:** `docs/codegraph.md` (handoff pointer + "skills surface" entry) → `docs/skills/standard/README.md`
  → `08-build-plan.md` → this file → `/home/computer/.claude/plans/robust-doodling-dolphin.md` (M1 plan).
- **Pipeline data-flow (source→agent):** `src/lib/skills/registry.ts` *(source of truth)* →
  `scripts/skills/build-skills.ts` *(materialize+publish)* → `scripts/skills/run-conformance.ts` *(evidence)*
  → `scripts/signing/sign-skills.ts` *(gates+cert)* → `scripts/skills/validate-skills.ts` *(gates)* →
  `src/lib/skills/renderHubContent.ts` + `renderSkillContent.ts` *(surfaces)* → `scripts/okf/prerender.ts` *(static HTML)*.
- **Trust primitives:** `scripts/signing/amtech-signing.ts` (cert type, `canonicalJson`, `verifyCertificate`,
  `packagePayloadDigest`) + `src/lib/skills/verification/reasonCodes.ts`.
- **Trust anchor files:** `src/lib/skills/certificates/<slug>/{certificate.json,.sig,conformance.config.json,evidence/*}`;
  `public/.well-known/{skill-authority.json,amtech-signing-key.json}`; `public/skills/{catalog.json,index.json}`.
- **M1 spec ↔ research:** `02-certificate-attestation-schema.md` ↔ `wiki/research/2026-06-19-skill-attestation-evidence-model.md`;
  gates `07`; prior-art `wiki/research/2026-06-19-skill-certificate-authority-prior-art.md`.
- **Cross-repo:** `~/Desktop/amtech-skills-registry/{index.json, registry/validate.mjs, registry/amtech-signing-key.json, registry/README.md}` (two-phase release).
- **Generalization precedent (the "standard as base"):** `docs/SKILL_MATERIALIZATION_PIPELINE.md`,
  `docs/UNIVERSAL_SKILL_LINK_CONTRACT.md`, and the OKF graph-materialization pipeline (`docs/okf/`, `scripts/okf/`,
  `src/lib/seo/pageMeta.ts`+`renderHead.ts`) — the multi-surface projection we are generalizing under signature.

## Standard-as-base (one-line generalization map)
`signed schema → build → sign(cert + attestations) → verify(link-first, reason codes) → render(multi-surface)`.
Instance #1 = skills. Next instances reuse the same five verbs: knowledge-graph/OKF bundles, datasets, pages.
Each conformant resource carries a cert → becomes provisionable to agents as verifiable, renderable surfaces.
