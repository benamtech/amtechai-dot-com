# 09 — Verifiability Ladder & Proof Methods

Part of the AMTECH Skill Certificate-Authority Standard. Defines the graduated **verifiability ladder**, the
**verification-method registry** that maps evidence to tiers, the **`graph-replay`** method (the deterministic
"missing middle" that makes verification self-executing), and the reserved/horizon rungs that are explicit v2
non-goals. Consumed by `02` (tier/method fields), `04` (verifier mapping + recipe), `01`/`07` (threats/gates).

## Why this exists

A signature proves *provenance*; offline conformance proves *structure*; human review proves *process*. None of
those let a **third party re-derive the verdict** — they ask for trust. The ladder adds a rung whose security
property is **reproducibility, not secrecy or expended compute**: anyone can re-run a deterministic, digest-bound
check and reach the same answer (the Certificate-Transparency philosophy — hand over the means to check). That is
what makes the standard *provisionable*: a downstream service that re-renders "verified" **cannot fake it — it has
to recompute it**.

## The ladder (weakest → strongest)

| Tier | Method id | Proves | Compute |
| --- | --- | --- | --- |
| `signed` | `signature` | provenance + exact bytes (v1 floor, back-compat) | none |
| `structure-verified` | `static-contract` | offline contract conformance (schema compiles, golden validates, instruction↔schema consistency) | none, static |
| `amtech-reviewed` | `amtech-review` | AMTECH reviewed + published under a named policy | none, human |
| **`replay-verified`** | **`graph-replay`** | a deterministic, evidence-bound check **any party re-runs from the published surfaces**, reproducing every digest | none — recompute |
| `behavior-verified` *(reserved)* | `live-model` | a live-model behavioral pass | hosted inference — **v2 non-goal** |
| `proof-verified` *(horizon)* | `zk-compute` | a succinct proof of a compute job | verifiable compute — **documented horizon** |

The verifier (`04`) reports the **maximum tier the present method + evidence support**, never higher. Tiers are
cumulative: `replay-verified` presupposes the lower rungs' checks also pass.

## Verification-method registry

Attestations declare a `conformance.method`; the **verifier owns the `method → max-tier` map** and reads the
attestation *envelope*, not the method internals. Consequences:
- **Modular / drop-in.** A new method is a new registry entry + a checker; no certificate or verifier *shape*
  change. (`live-model`/`zk-compute` are pre-declared so the envelope is forward-compatible.)
- **Honesty by construction.** An unknown or unsupported method maps to no tier → `METHOD_UNKNOWN`; a method can
  never grant a tier above its mapped ceiling (`G-X.3`).
- **Policy-bound.** The active registry version travels under `attestations.policyVersion`; a registry change is a
  policy event and MAY be recorded in the authority history (`03`) so a tier is interpreted under the rules in
  force when it was issued.

## `graph-replay` — the self-describing verification recipe

`replay-verified` is earned by a recipe the verified surfaces **carry**: the *ingredients plus the expected
result* of a cheap deterministic check, so an agent (or a re-renderer) recomputes the verdict. Because AMTECH
resources are graph-materialized and digest-bound, the **traversal path itself is the algorithm** — replay =
recompute the path, compare digests. Determinism is the security property (not consensus, not proof-of-work).

The recipe, all client-side via WebCrypto, no infra:
1. **Authenticity** — canonicalize the certificate (RFC 8785 / JCS) and Ed25519-verify it against the published
   key document. (`INVALID_SIGNATURE` / `IDENTITY_MISMATCH` / `INVALID_SCHEMA`)
2. **Provenance** — recompute the archive digests + the `sourcePackage` cross-repo anchor.
   (`DIGEST_MISMATCH` / `SOURCE_PACKAGE_MISMATCH`)
3. **Published-file integrity** — recompute each published machine file's SHA-256 and compare to the **SRI digest**
   the signed manifest binds. (`MANIFEST_DIGEST_MISMATCH`)
4. **Set integrity** — recompute the **catalog root** over the per-skill certificate digests. (`CATALOG_ROOT_MISMATCH`)

A step that fails to reproduce byte-for-byte across two runs → `REPLAY_NONDETERMINISTIC`; a recompute that
disagrees with the bound value → `REPLAY_MISMATCH`. The recipe's *ingredients* are advertised in `<head>` (Tier-1/2
meta + `rel`/SRI link relations, `05`) but the head is never the only channel — the same recipe is reachable from
the cert + manifest directly.

### Why this is not ZKP / live-model / PoW
- **No fixed model to prove over** and LLM inference isn't bit-reproducible → a literal proof of "prompt→output"
  is infeasible and out of scope. `graph-replay` proves *what is digest-bound and deterministic*, not AI behavior.
- **Reproducibility, not expended energy.** The goal is *minimal* client work that anyone can repeat — the inverse
  of proof-of-work.

## Consumer-side opt-in re-derivation (defined, not CA-signed)

A consumer MAY run a skill against a published challenge on their *own* model and check the output against
published assertions — earning **their own** fresh verdict. The standard defines the **verdict format** a self-run
emits (`{ verdict, tier, method, checkedAt, reasonCodes[] }`, the `04` shape) so tooling can consume it; the CA
**never signs** this (it cannot, statically). This is the honest home for the "testing-skill points an agent at a
challenge and checks the response" idea — it *enables* behavioral assurance without *claiming* it. Build deferred.

## Reserved / horizon (explicit v2 non-goals)
- **`behavior-verified` (`live-model`)** — reserved. A future AMTECH-hosted reference run records the same
  attestation envelope (`method:"live-model"`) so the cert + verifier are unchanged; the CA attests "reference run
  on <date> with <model/config>", never live consumer behavior.
- **`proof-verified` (`zk-compute`)** — horizon only. Revisit if a *statically hostable* succinct-proof path for a
  meaningful compute job appears; not implemented, not promised.

## Generalization (the standard as a base)

The ladder + method registry apply to **any signed schema**, not just skills: knowledge-graph / OKF bundles,
datasets, pages. Each conformant resource carries a cert → becomes provisionable to agents as a verifiable,
recomputable, multi-surface object. `graph-replay` is the rung that makes "verify" something a third party *does*
rather than *trusts* — the same five verbs (`build → sign → verify → render`) at every instance.

## Related
- `02` (tier/method/`sourcePackage` fields), `04` (verifier mapping + recipe + reason codes), `05` (head-level
  recipe delivery + SRI), `01` (threats: method-spoofing, replay non-determinism), `07` (cross-cutting gates),
  `03` (method/policy as authority events). Research: `wiki/research/2026-06-19-skill-attestation-evidence-model.md`,
  `wiki/research/2026-06-19-experimental-meta-tag-skill-delivery.md`, `wiki/research/2026-06-19-link-first-skill-verification.md`.
