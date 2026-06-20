# Status: Skill Certificate-Authority Standard — Research & Spec - 2026-06-19

## What changed

Initiated the next phase: turning the working v1 signed skill registry into a defensible **certificate-authority standard**. This pass is research + specs + build plan (no production code yet).

- **Live black-box test** of the shipped system (as an agent): `/skills/okf-audit` self-bootstraps correctly; the Ed25519 certificate **cryptographically verifies** against the active key. Gaps confirmed: the `/skills` **hub** has no agent bootstrap; the certificate carries **no test/review evidence**; there is **no published verifier**; the authority file is a **single mutable** record with no history (`commitSignature: unsigned`).
- **4 research notes** in `wiki/research/2026-06-19-*`: prior-art landscape (CT/RFC6962, TUF, in-toto/DSSE/SLSA, Sigstore, RFC8785, CONIKS, arXiv 2603.02512 "Human-Certified Module Repositories for the AI Age"), attestation evidence model, immutable-authority trade-off, link-first verification.
- **Spec set** `docs/skills/standard/README.md` + `01`–`08` (trust model, v2 attestation cert, authority/key mgmt, verifier, multi-surface exposure, catalog bootstrap, phase gates, build plan).
- **Navigation:** extended `docs/UNIVERSAL_SKILL_LINK_CONTRACT.md` (hub must self-bootstrap), forward-pointer in `docs/SKILL_SIGNING.md`, new subsection + file-ownership entry in `docs/codegraph.md`.

## Locked decisions

- Posture: **borrow concepts, AMTECH-native, statically hostable** (not strict DSSE/Rekor interop).
- Immutability: **Option A — git-anchored hash-chained signed snapshots** with a designed-in upgrade path to a full Merkle log (Option B). See `wiki/research/2026-06-19-immutable-authority-history-options.md`.
- The `/skills` **catalog bootstrap is M0** and ships before the new CA features.

## Next

Execute the build plan `docs/skills/standard/08-build-plan.md`: **M0** catalog bootstrap (only code milestone scoped to this phase if approved), then M1 v2 attestations, M2 verifier, M3 multi-surface, M4 immutable authority history. Gates in `07-phase-gates-and-acceptance.md`.

## Verify harness

The session's manual verifier lives at `/tmp/amtech-verify/verify.mjs` (fetch cert+sig+key, recompute `canonicalJson`, check Ed25519). Re-run the live walk after M0.
