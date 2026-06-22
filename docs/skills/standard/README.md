# AMTECH Skill Certificate-Authority Standard

Status: **draft / spec phase**, 2026-06-19; reconciled 2026-06-20 (verifiability ladder + method registry `09`, head-level recipe delivery adopted, tier/reason-code names unified with the M1 code). Normative once `07-phase-gates-and-acceptance.md` gates are wired and M0–M4 land.

## What this is

The standard that turns AMTECH's working v1 signed skill registry into a defensible **certificate authority** for agent skills: structured signed assurance evidence, a published verifier, the same verdict on every surface, and an immutable authority history. It is **AMTECH-native but borrows proven concepts** from TUF, in-toto/DSSE/SLSA, Certificate Transparency / CONIKS, Sigstore, and RFC 8785, and stays **statically hostable** on Netlify/GitHub. The research behind every choice lives in `wiki/research/2026-06-19-*` (start with the prior-art note).

## Why (the gap v1 leaves)

v1 proves *provenance* (who/where/which bytes) and the live Ed25519 chain verifies end-to-end. It does **not** prove *assurance* (was it tested/reviewed), it has **no published verifier** (verification is manual), it does **not** expose a verdict to agents, and its authority file is a **single mutable** record with no history. See `docs/memory/handoff-2026-06-19--skill-verification-next-steps.md`.

## Read in order

| File | Subject |
| --- | --- |
| `01-trust-model-and-threats.md` | Actors, trust roots, threats, non-goals |
| `02-certificate-attestation-schema.md` | `amtech-signed-artifact/v2`: test + review attestations |
| `03-authority-and-key-management.md` | Key lifecycle, rotation/revocation, immutable history (Option A) |
| `04-link-first-verifier.md` | Verifier contract, reason codes, link-only vs archive-byte |
| `05-multi-surface-exposure.md` | Same verdict in HTML/JSON-LD/headers/catalog/manifest/CLI |
| `06-catalog-bootstrap.md` | `/skills` hub self-bootstrap (M0, ships first) |
| `07-phase-gates-and-acceptance.md` | Acceptance gates + validator wiring |
| `08-build-plan.md` | Agentic-dev build plan: M0→M4, exact files, acceptance |
| `09-verifiability-and-proof-methods.md` | Verifiability ladder, method registry, `graph-replay` recipe, reserved/horizon rungs |
| `10-behavioral-verification-and-evals.md` | `behavior-verified`: measured uplift over the prompt-only baseline (`deltaPp`/`g`), eval set, harness, gates |
| `11-trust-federation-and-anchoring.md` | Federation (independent witnesses), broadcast/registry-state cert, external anchoring (the path toward trustless) |
| `12-verified-execution-and-capability.md` | The assurance/autonomy grant: how a verdict warrants running scripts/workflows (describe-not-gate); host obligations |
| `13-client-certificates-and-credential-brokering.md` | Client/holder certs + credential brokering: skills using real credentials to reach services, gated by verifiable identity + provenance |

## Locked decisions (this phase)

- **Posture:** borrow concepts, AMTECH-native, statically hostable. (Not strict DSSE/Rekor interop.)
- **Immutability mechanism:** Option A — git-anchored hash-chained signed snapshots — **plus Option B (RFC 6962 Merkle transparency log), implemented 2026-06-21**: one tree over the existing record stream, signed tree heads + inclusion/consistency proofs, trust-minimization scaffolding (role-tagged witness signatures, reserved external anchors, client STH pinning). See `03-authority-and-key-management.md` §"Transparency log — Option B" and `wiki/research/2026-06-19-immutable-authority-history-options.md`.
- **Catalog bootstrap (M0)** ships before the new CA features.
- **Verifiability ladder + method registry (`09`):** `signed < structure-verified < amtech-reviewed < replay-verified` (+ reserved `behavior-verified`, horizon `proof-verified`). The `replay-verified` rung is **deterministic recompute** (`graph-replay`) any party re-runs client-side — the self-describing recipe — **not** live-model, ZK, or proof-of-work. Verification is self-executing so a re-renderer must recompute "verified", not forward a badge.
- **Two repositories:** work spans `amtechai-dot-com` (this repo — source, signing, verifier, website surfaces, M0–M3 + authority generation) and `amtech-skills-registry` (the public git-backed install source — synced skill folders, signed publishing commits, reciprocal links, authority cross-witness). Releases that touch both must keep the website's authority commit-pin and the registry's signed commit in lockstep. Access in Claude Code: `gh` is authed for both; clone the registry and `/add-dir` it. Details in `08-build-plan.md` → "Cross-repo work".

## Research backing

- `wiki/research/2026-06-19-skill-certificate-authority-prior-art.md`
- `wiki/research/2026-06-19-skill-attestation-evidence-model.md`
- `wiki/research/2026-06-19-immutable-authority-history-options.md`
- `wiki/research/2026-06-19-link-first-skill-verification.md`
- `wiki/research/2026-06-19-experimental-meta-tag-skill-delivery.md` (exploration — head-level/meta-tag delivery)

## Implementation anchors (existing code to reuse, not replace)

- `scripts/signing/amtech-signing.ts` — cert type, `canonicalJson`, `verifyCertificate`, `digest`.
- `scripts/signing/{sign-skills,verify-artifact}.ts` — signing + portable verify.
- `scripts/skills/{build-skills,validate-skills}.ts` — materialization + validation.
- `src/lib/skills/registry.ts`, `src/lib/skills/certificates/**` — registry + cert/key store.
- `public/.well-known/{skill-authority.json,amtech-signing-key.json}` — current authority + key.
- `docs/UNIVERSAL_SKILL_LINK_CONTRACT.md`, `docs/SKILL_MATERIALIZATION_PIPELINE.md`, `docs/SKILL_SIGNING.md`.
