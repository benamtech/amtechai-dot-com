# Status: Cross-Repo Setup for Skill CA Standard - 2026-06-19

## What changed

Prepared the two-repo working environment for implementing `docs/skills/standard/` (the skill certificate-authority standard) **before** starting the M0–M4 build.

- Committed + pushed the two-repo split notes (`5944b34`).
- **Cloned** `github.com/benamtech/amtech-skills-registry` to `~/Desktop/amtech-skills-registry`. `gh` is authed as `benamtech`; push dry-run + working-tree write both succeed for both repos.
- Mapped the registry and recorded findings into `docs/skills/standard/08-build-plan.md` ("Registry repo — current state").

## Key findings

- **Lockstep baseline:** registry HEAD `88d9ce8` == the commit pinned in the live `skill-authority.json`. The two origins are currently synchronized.
- **`docs/agent-skills/` is NOT stale — keep it, do not delete.** It holds the full set of skill packages, including ones intentionally not-yet-certified on the website. (Earlier "stale snapshot" framing was wrong, per Ben.)
- **Registry is already productionized** — `ed25519-canonical-json-v1`, dual-digest `registry/checksums.json`, `registry/validate.mjs --check`, public-key mirror, 7 skill packages (3 categories; only `okf-audit` + `knowledge-graph-builder` website-published), Codex plugin/marketplace, CI, and a documented **two-phase release** (`pending-resign` → `signed`). Our plan must **integrate** with this, not rebuild it.
- **Skill onboarding backlog (deliberate):** the 5 repository-only packages — `estimate`, `invoice`, `daily-checkin`, `amtech-article-publisher`, `amtech-article-research-writer` — are a backlog to publish/certify to the website registry **after** the CA upgrade, batch-onboarded via a future **"Certified AMTECH skill publishing" pipeline (M5)**. Onboarding now (one manual two-phase release each) would be too volatile; do it once, repeatably, on a stable standard.
- **Status lag to reconcile:** registry `index.json` marks `okf-audit` `pending-resign`, but the live website certificate verifies — close this during M1/M4.

## Next

Awaiting go-ahead to start the M0 build (website-only). M1/M4 will touch the registry repo per the two-phase protocol in `registry/README.md`. Keep `docs/agent-skills/` intact; backlog skills onboard in M5. Build plan: `docs/skills/standard/08-build-plan.md`.
