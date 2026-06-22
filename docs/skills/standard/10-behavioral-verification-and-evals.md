# 10 — Behavioral Verification & Evals (`behavior-verified`)

Part of the AMTECH Skill Certificate-Authority Standard. Defines the rung that makes the CA's central promise
*checkable*: **a verified skill measurably out-performs the same agent with no skill (the prompt-only baseline).**
Builds on `09` (the ladder + method registry — `behavior-verified` is promoted here from *reserved* to *defined*),
`02` (the attestation envelope this adds a block to), and `04` (the verifier that reports the tier). Research:
`wiki/research/2026-06-22-skill-effectiveness-and-verification-enforced-quality.md`.

## Why this exists

`signed` proves *who*, `structure-verified` proves *shape*, `amtech-reviewed` proves *process*, `replay-verified`
proves *the bytes recompute*. **None proves the skill helps.** The empirical record is blunt about why that gap
matters: curated skills raise task pass-rates by ~16pp while self-authored ones add nothing (SkillsBench), and
*more* skill is not *better* — over-long, over-bundled skills measurably degrade outcomes. So "verified" must come
to mean **measured uplift**, or it is only authenticity wearing a quality badge. This rung closes that gap.

## The metric (normative)

A skill's behavioral evidence reports, against a fixed eval set run under both conditions:

- `passVanilla` — pass rate with **no skill** (the baseline: the same model/harness, the task query only).
- `passSkill` — pass rate **with the skill** bootstrapped into context.
- `deltaPp` — `passSkill − passVanilla`, in percentage points (the absolute uplift).
- `normalizedGain` (`g`) — `(passSkill − passVanilla) / (1 − passVanilla)`, the proportional improvement toward
  perfect; separates genuine scaffolding from ceiling effects.

All reported as strings (I-JSON / RFC 8785 — no JSON numbers in signed payloads, per `02`). A skill earns
`behavior-verified` only if `deltaPp > behaviorPolicy.minDeltaPp` (a policy knob, **default `"0"`** — any real
uplift qualifies; raise it as a policy event without a schema change, recorded in the authority history per `03`).
`normalizedGain` is recorded alongside for when a normalized floor is set later.

## The eval set (`eval/cases.json`, shipped + signed)

Each skill that claims `behavior-verified` ships an eval set in its source package (so it is `sourcePackage`-bound
and published for re-derivation). Schema `amtech-skill-eval/v1`, an array of cases shaped after the Anthropic eval
JSON, extended with deterministic expectations the scorer checks:

```jsonc
{
  "schemaVersion": "amtech-skill-eval/v1",
  "skill": "estimate",
  "cases": [
    {
      "id": "core-missing-rate",
      "query": "Quote 3 hours of labor and 40 ft of trim. No rates given.",
      "context": {},                         // optional host-injected context (slots from 05)
      "expected": {                          // deterministic, scorer-checkable (no LLM judge required)
        "mustAsk": ["labor rate", "trim unit price"],
        "forbidInventedRate": true,
        "requiredSections": ["Customer", "Job", "Line Items", "Totals", "Assumptions"]
      }
    }
  ]
}
```

Cases SHOULD span difficulty (a "core" majority + a few "extended") and MUST include at least one case that
exercises the skill's safety discipline (e.g. the missing-rate case above — the prompt-only baseline tends to
invent a number; the skill must refuse). 2–3 skills per task and moderate-length skills are the empirically
optimal regime — eval sets should reflect realistic single-skill tasks, not kitchen-sink scenarios.

## The harness (with / without, N trials)

A **deterministic scorer** (a script shipped with the skill, e.g. `scripts/skills/eval/score-estimate.ts`) maps
`(case, agentOutput) → { pass, rubric[] }` with **no LLM in the scoring path** — it parses the output, recomputes
arithmetic, checks required sections, schema-validates structured output, and detects forbidden behavior (an
invented rate). Determinism in scoring is what makes the number reproducible.

Two harness types share one attestation envelope:

| `harness` | What runs the cases | Model | Status |
| --- | --- | --- | --- |
| `agent-in-loop` | a host agent executes each case vanilla + with-skill; the scorer scores transcripts | whatever the environment runs (recorded, not fixed) | **defined** |
| `live-model` | an AMTECH-hosted reference run against a named model/config | named | reserved (`09`) — same envelope |

The MVP harness is `agent-in-loop`: model-agnostic, no infra, runnable inside an ordinary agentic environment.
The signed evidence records *whatever ran*; it does not assert a universal guarantee.

## The behavior attestation (`02` envelope addition)

Recorded under `attestations.behavior`, evidence stored at
`src/lib/skills/certificates/<slug>/evidence/behavior.json` (`amtech-skill-behavior/v1`), referenced from the cert
by digest only:

```jsonc
"behavior": {
  "method": "behavior-eval",               // method registry (09) → max tier behavior-verified
  "harness": "agent-in-loop",              // agent-in-loop | live-model
  "model": "unspecified",                   // recorded if a fixed model ran; "unspecified" for agent-in-loop
  "evalSet": { "url": ".../skills/<slug>/eval/cases.json", "sha256": "<digest>" },
  "trials": "5",
  "passVanilla": "0.20",
  "passSkill": "0.80",
  "deltaPp": "60",
  "normalizedGain": "0.75",
  "result": "pass",                         // pass | fail (pass requires deltaPp > minDeltaPp)
  "ranAt": "2026-06-22T00:00:00.000Z",
  "evidence": { "url": ".../skills/<slug>/evidence/behavior.json", "sha256": "<digest>" }
}
```

**Behavior evidence is offline-measured** (like `review.json`), NOT byte-equality re-run: LLM output is not
bit-reproducible, so the signer/validator cannot re-execute the eval and demand identical bytes. Integrity comes
from the digest binding; *reproducibility* comes from the published `evalSet` + scorer — any party re-runs the
cases through their own agent, re-scores with the published scorer, and gets their own number. This is the
`09` "consumer-side opt-in re-derivation" made concrete: the re-derivation is the behavioral **witness**.

## Signer & verifier gates

`skills:sign` MUST refuse `trustTier: behavior-verified` unless **all** apply (additions to the `02` gate list):
1. `attestations.behavior` present, `method == "behavior-eval"`, `result == "pass"`.
2. `deltaPp` (numeric value of the string) `> behaviorPolicy.minDeltaPp`.
3. `behavior.ranAt` within `MAX_EVIDENCE_AGE_DAYS`.
4. `behavior.evidence.sha256` resolves + recomputes; `behavior.evalSet.sha256` resolves + recomputes and the eval
   set is part of `sourcePackage`.

The verifier (`04`) reports `behavior-verified` only when these hold, surfaces `deltaPp`/`normalizedGain`/`harness`
in the verdict, and otherwise reports the highest *lower* tier (additive — a cert with no behavior block verifies
exactly as before). New reason codes: `BEHAVIOR_NOT_PROVEN` (tier claimed, block absent/failing),
`BEHAVIOR_UPLIFT_INSUFFICIENT` (`deltaPp ≤ minDeltaPp`).

## Claims discipline (non-negotiable)

A behavior attestation is a **measured reference run**, not a universal guarantee. Permitted: *"measured +X pp over
the prompt-only baseline on this eval set + harness as of <date> — recompute it yourself."* Forbidden: *"proven to
work," "guaranteed," "safety-tested."* The honesty is the product — a skill that does not beat baseline does not
earn the tier; that negative result is a finding, not something to paper over.

## Related
- `09` (ladder + method registry; `behavior-verified` now defined here), `02` (attestation envelope + gates),
  `04` (verdict reporting), `12` (a `behavior-verified` skill warrants autonomous execution),
  `wiki/research/2026-06-22-skill-effectiveness-and-verification-enforced-quality.md`.
</content>
