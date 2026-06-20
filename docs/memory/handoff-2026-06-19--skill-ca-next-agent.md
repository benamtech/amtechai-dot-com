# Handoff: Skill Certificate-Authority Standard — Next Agent - 2026-06-19

## Where we are

Research + specs + cross-repo setup are **done**. No feature code yet. Next up: build **M0**.

## Read these first (in order)

1. `docs/codegraph.md` — site map; see the "skills surface" + `docs/skills/standard/` entries.
2. `docs/skills/standard/README.md` → `08-build-plan.md` — the standard and the M0→M5 build plan.
3. `wiki/research/2026-06-19-skill-certificate-authority-prior-art.md` (+ its 3 siblings + the meta-tag note) — why each design choice.

## State of the world

- Live v1 chain **verifies** end-to-end (Ed25519 cert checks out). Gaps drive the plan.
- Two repos, **in lockstep**: this one (`amtechai-dot-com`) and `amtech-skills-registry` (cloned at `~/Desktop/amtech-skills-registry`, HEAD `88d9ce8` == live authority pin). `gh` authed as `benamtech` for both.
- Registry is **already productionized** (checksums, `validate.mjs`, plugin/marketplace, CI, two-phase `pending-resign`→`signed` release) — integrate, don't rebuild.
- `docs/agent-skills/` is **not stale — do not delete**. The 5 non-website skills are a deliberate backlog onboarded later via **M5**.

## Do next: M0 — catalog/hub bootstrap (website-only, reversible)

Spec `docs/skills/standard/06-catalog-bootstrap.md`; gates in `07`. The `/skills` hub has no agent bootstrap (verified). Touch: `src/pages/Skills.tsx`, `src/lib/seo/pageMeta.ts`, `scripts/skills/build-skills.ts`, `scripts/skills/validate-skills.ts`, `public/_headers`. Reuse signing helpers in `scripts/signing/amtech-signing.ts`. Acceptance: a fresh agent given only `https://amtechai.com/skills` can enumerate skills, reach each page, and verify each cert.

## Conventions

- Status updates → both `MEMORY.md` (auto-memory) **and** a timestamped `docs/memory/status-…`/`handoff-…`; update the codegraph "Most recent handoff" pointer.
- Run `npm run typecheck` → `skills:check` → `build` after each milestone; re-run the live black-box walk.

## Sequence

M0 (hub bootstrap) → M1 (v2 attestations) → M2 (link-first verifier) → M3 (multi-surface verdict) → M4 (immutable authority history) → M5 (certified-publishing pipeline + onboard backlog).
