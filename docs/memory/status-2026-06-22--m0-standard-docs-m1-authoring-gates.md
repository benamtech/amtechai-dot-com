# Status — M0 standard docs + M1 authoring-discipline gates (benchmarkable skills standard) — 2026-06-22

Branch: `skill-ca-merkle-transparency` (local; **NOT pushed/released** — live `main` is still at authority seq 5).
Plan: `docs/memory/plan-2026-06-22--benchmarkable-skills-standard-estimate.md`. Research:
`wiki/research/2026-06-22-skill-effectiveness-and-verification-enforced-quality.md`. The goal driving all of this:
**a verified skill must measurably beat the prompt-only baseline**, over links and in its most agentic/verified
state — and the cert is the trust substrate for a whole agentic environment (provenance, effectiveness,
entitlement, identity, credential brokering).

## M0 — standard docs (DRAFTED, reviewed by Ben in spec form)
- **New `docs/skills/standard/10-behavioral-verification-and-evals.md`** — `behavior-verified` fully defined:
  `deltaPp` + normalized gain `g`, `behaviorPolicy.minDeltaPp` (default 0), `amtech-skill-eval/v1` eval set,
  `agent-in-loop` (model-agnostic) vs `live-model` harness, `amtech-skill-behavior/v1` attestation envelope
  (offline-measured, digest-bound, reproducible via published eval set + scorer), signer/verifier gates, claims
  discipline ("measured +X pp, recompute it yourself" — never "proven to work").
- **New `docs/skills/standard/12-verified-execution-and-capability.md`** — **describe-not-gate** capability model.
  Verification informs autonomy, NEVER withholds the right to bootstrap/run scripts (Ben's correction). The signed
  `permissions`+`safety` manifest → an `assurance/autonomy grant` (`assuranceLevel: none|integrity|authorship|
  effectiveness`, `autonomyWarranted`, `isolationRecommended`); per-verdict grant table; host policy obligations;
  AI Employee MVP mapping (docker, confirmation gate, profile sandbox).
- **New `docs/skills/standard/13-client-certificates-and-credential-brokering.md`** — holder cert
  (`subjectType:'holder'`) + signed credentials manifest (`secrets: declared`) + the three-party brokering chain
  (skill cert = *what*, holder cert = *who*, host injects the scoped secret; CA authorizes, never holds the
  secret). Scoping/revocation/threats. Normative spec; built when the first credentialed skill needs it.
- **Edits:** `02` (behavior gate #9, full **entitlement** `subjectType` section, authoring sub-checks note),
  `09` (`behavior-verified` promoted reserved→**defined**, method `behavior-eval`), `05` (context-binding /
  host-adapter surface + capability surface), `README` index (10–13).

## M1 — authoring-discipline conformance gates (IMPLEMENTED + GREEN)
The effectiveness wisdom encoded as **deterministic, recomputable** conformance checks (so evidence stays
byte-stable; `validate-skills` re-runs it). Pure `authoringDisciplineChecks(input)` in
`scripts/skills/run-conformance.ts`, called from `computeConformanceEvidence`; unit-tested with mutated inputs.
- Checks (named): `routing-desc-third-person|trigger|length`, `catalog-desc-third-person|length`,
  `desc-consistency` (shared significant terms between the two descriptions), `body-under-500`, `refs-one-deep`,
  `refs-toc` (>100-line refs need a TOC), `output-contract` (≥3 sections), `last-reviewed` (within
  `MAX_AUTHORING_REVIEW_AGE_DAYS`=365 of release, deterministic vs wall-clock).
- **BOTH descriptions checked** (Ben: both critical) — the SKILL.md frontmatter (routing) AND the registry
  (catalog) description, plus consistency between them.
- Test `scripts/skills/__fixtures__/authoring-discipline.test.ts` (17 tests, incl. 4 integration: every live skill
  passes). `lastReviewed` added to all 4 skills in `registry.ts`.

## Groundwork piped (inert until later milestones)
- `reasonCodes.ts`: `BEHAVIOR_NOT_PROVEN`, `BEHAVIOR_UPLIFT_INSUFFICIENT`, `UNDECLARED_SECRET`,
  `SECRET_SCOPE_MISMATCH`, `ENTITLEMENT_REQUIRED`, `ENTITLEMENT_INVALID`, `HOLDER_NOT_ACTIVE`; consts
  `MAX_AUTHORING_REVIEW_AGE_DAYS`, `BEHAVIOR_POLICY{minDeltaPp:0}`.
- `verifySkill.ts`: `Capability` type + optional `capability` on `SkillVerdict` (M4b `deriveCapability` later).
- `registry.ts`: `SkillContextBinding` type + optional `contextBindings`/`lastReviewed` on `SkillDefinition`.

## Verification
Re-signed all 4 certs (still `amtech-reviewed` — behavior tier not yet wired/earned): authority seq **5→6**,
catalog root `e58c33c5…`, STH tree size **6→7** root `1ad02fbb…`, registry-state anchor + **broadcast receipt
entry 1** appended (the re-sign changed the tree, so `skills:broadcast` was required to keep receipts tracking the
current root — a coupling the test enforces). `npm run skills:check` green (**71 tests**, was 53), `npm run
typecheck` green, `skills:validate` green. All LOCAL; nothing pushed.

## Registry description = source of truth (DONE 2026-06-22, after M1)
- All 4 registry `description` fields rewritten to the **frontmatter "Use when…" trigger style** (registry is now
  the single source of truth for the routing description).
- `build-skills.ts` `syncSkillMdDescription()` **materializes** the source SKILL.md frontmatter `description` FROM
  the registry (idempotent; runs before source read so sourcePackage/published reflect it) — they can no longer drift.
- The gate changed from `authoring:desc-consistency` (term overlap) → **`authoring:desc-matches-registry`**
  (exact identity). Re-signed: authority seq **7**, STH tree **8** root `5cea455c…`, broadcast receipt entry 2;
  `skills:check` green (71 tests), typecheck green. Still LOCAL/unpushed.

## Open / next
- **Plan continues:** M2 (context bindings + full surface matrix), M3 (eval harness: `cases.json` + deterministic
  `score-estimate.ts`), M4 (`behavior-verified` tier wiring), M4b (capability grant `deriveCapability`), M5 (run
  the benchmark in this environment → sign real `behavior.json` → estimate becomes EV+), M6 (publish + live-verify).
- Memory: `[[skill-verification-enforces-effectiveness]]`, `[[skill-cert-agentic-environment-use-cases]]`,
  `[[skills-hermes-integration]]`. Prior handoff: `status-2026-06-21--merkle-transparency-log.md`.
</content>
