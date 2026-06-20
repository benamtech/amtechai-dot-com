# Plan: Skill Certificate-Authority Standard - 2026-06-19

Source plan file: `/home/computer/.claude/plans/curious-wobbling-candy.md` (approved).

## Goal
Turn AMTECH's working v1 signed skill registry into a defensible certificate-authority standard via research notes + spec docs + an agentic-dev build plan. Posture: borrow concepts (TUF, in-toto/DSSE/SLSA, CT/CONIKS, Sigstore, RFC 8785), stay AMTECH-native and statically hostable.

## Deliverables (this phase = docs)
- Research: `wiki/research/2026-06-19-{skill-certificate-authority-prior-art, skill-attestation-evidence-model, immutable-authority-history-options, link-first-skill-verification}.md`
- Specs: `docs/skills/standard/README.md` + `01`–`08`.
- Nav: `docs/UNIVERSAL_SKILL_LINK_CONTRACT.md` (hub bootstrap), `docs/SKILL_SIGNING.md`, `docs/codegraph.md`.

## Build plan (implementable later) — `docs/skills/standard/08-build-plan.md`
M0 catalog/hub bootstrap (ships first) → M1 v2 attestation cert → M2 link-first verifier → M3 multi-surface verdict → M4 immutable git-anchored authority history. Gates in `07`.

## Locked decisions
Immutability = Option A (git-anchored hash-chained signed snapshots, upgrade path to Merkle log). Catalog bootstrap is the prerequisite. Experimental meta-tag delivery of skill/verification instructions is being explored — see `wiki/research/2026-06-19-experimental-meta-tag-skill-delivery.md`.
