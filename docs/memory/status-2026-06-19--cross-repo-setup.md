# Status: Cross-Repo Setup for Skill CA Standard - 2026-06-19

## What changed

Prepared the two-repo working environment for implementing `docs/skills/standard/` (the skill certificate-authority standard) **before** starting the M0–M4 build.

- Committed + pushed the two-repo split notes (`5944b34`).
- **Cloned** `github.com/benamtech/amtech-skills-registry` to `~/Desktop/amtech-skills-registry`. `gh` is authed as `benamtech`; push dry-run + working-tree write both succeed for both repos.
- Mapped the registry and recorded findings into `docs/skills/standard/08-build-plan.md` ("Registry repo — current state").

## Key findings

- **Lockstep baseline:** registry HEAD `88d9ce8` == the commit pinned in the live `skill-authority.json`. The two origins are currently synchronized.
- **`docs/agent-skills/` is stale.** It is an earlier in-repo snapshot that has drifted from the real registry (differs in `index.json`, `README.md`, `marketplace.json`, signing-key, and is missing the productionized `registry/{checksums.json,validate.mjs,README.md}`, `.github/`, and `plugins/.../skills/`). **Authoritative = the cloned GitHub registry repo, not `docs/agent-skills/`.** Reconcile/regenerate the staging copy separately.
- **Registry is already productionized** — `ed25519-canonical-json-v1`, dual-digest `registry/checksums.json`, `registry/validate.mjs --check`, public-key mirror, 7 skill packages (3 categories; only `okf-audit` + `knowledge-graph-builder` website-published), Codex plugin/marketplace, CI, and a documented **two-phase release** (`pending-resign` → `signed`). Our plan must **integrate** with this, not rebuild it.
- **Status lag to reconcile:** registry `index.json` marks `okf-audit` `pending-resign`, but the live website certificate verifies — close this during M1/M4.

## Decision needed before full implementation

How to treat the `docs/agent-skills/` drift: (A) regenerate it from the authoritative registry repo, (B) delete it and work against the cloned registry directly, or (C) leave it and treat the cloned registry as truth. Recommendation: **B/C** — work against the cloned registry as the single source; stop maintaining a second stale copy in-repo.

## Next

Awaiting go-ahead to start the M0 build (website-only). M1/M4 will touch the registry repo per the two-phase protocol in `registry/README.md`. Reconcile `docs/agent-skills/` per the decision above. Build plan: `docs/skills/standard/08-build-plan.md`.
