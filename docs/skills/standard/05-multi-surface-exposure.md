# 05 — Multi-Surface Exposure

Part of the AMTECH Skill Certificate-Authority Standard. Research: `wiki/research/2026-06-19-link-first-skill-verification.md`. Implements work item 3.

## Goal

Publish the **same** verification verdict everywhere an agent, crawler, or human might look — so discovery context never changes the answer. One engine (`04`), many projections (the "one model, many projections" pattern already used by the OKF/article + skills pipelines).

## Surfaces

| Surface | What it carries | Where it's emitted |
| --- | --- | --- |
| Page HTML badge | Human-visible `verified · human-reviewed` + "re-verify" link | `/skills/<slug>` and `/skills` hub, prerendered |
| JSON-LD | Machine block (verdict, tier, certificateId, authoritySequence, checkedAt) | `<head>` via `renderHead.ts` / skill render |
| Catalog JSON | `verdict` + `trustTier` per skill | `public/skills/catalog.json` (M0) |
| Manifest JSON | Same per-skill verdict + cert/authority links | `public/skills/<slug>/manifest.json` |
| Agent bootstrap | One-line status + how to re-verify | `use.md` / `agent.md` (skill + hub) |
| Response headers | `X-AMTECH-Skill-Verification: verified; tier=human-reviewed; seq=7` | `public/_headers` |
| CLI / API | Full `04` JSON | `npm run skills:verify` / Netlify fn |

## Build-time vs live (honesty constraint)

Pre-rendered/static surfaces (HTML badge, JSON-LD, catalog, manifest, headers) assert **"verified at build time, sequence N."** They MUST say so (carry `checkedAt` + `authoritySequence`). Because a revocation can postdate the build, any consumer needing **live** assurance MUST run the verifier (`04` CLI/API). Never present a static badge as a live check — that's a stated non-goal in `01`.

## Consistency requirement

All static surfaces for a given skill MUST project from one verifier run at build time — the same `verdict`, `trustTier`, `authoritySequence`, and `checkedAt`. `07` gates this: the validator recomputes the verdict and fails the build if any surface disagrees or if any surface claims a tier the evidence can't prove.

## Implementation pointers (reuse)
- HTML + JSON-LD: extend `src/lib/seo/renderHead.ts` and `src/lib/skills/renderSkillContent.ts` (already the shared string projection for prerender + `SkillDetail.tsx`).
- Catalog / manifest / bootstrap: emit from `scripts/skills/build-skills.ts`.
- Headers: `public/_headers` (already sets content-type/caching for `/skills/*`).
- Verdict source: the `04` library — never recompute verification logic per surface.

## Experimental: head-level / meta-tag delivery

Beyond the surfaces above, the `<head>` is itself a high-signal channel many agents read first. AMTECH already emits a JSON-LD block, an `amtech-agent-map` JSON island, a `<noscript>` summary, and arbitrary `<meta name>` tags (`extraMeta`) via `src/lib/seo/renderHead.ts` + `pageMeta.ts`. Tier-1 extensions worth piloting in M3: `amtech:skill:*` meta tags (slug/version/trust-tier/verdict/checked-at + use/manifest/certificate/authority URLs), a `skill`/`verify`/`files` block in the agent-map island, and `rel`-based link relations to the machine twins + authority. Guardrails: meta must never diverge from the visible body (it falls under the same consistency gate), stays descriptive not imperative, is never the only channel, and carries `checked-at` honesty markers. Full exploration + tiers: `wiki/research/2026-06-19-experimental-meta-tag-skill-delivery.md`.

## Related
- `04-link-first-verifier.md` (the engine), `06-catalog-bootstrap.md` (hub surfaces), `07-phase-gates-and-acceptance.md` (consistency gate), `wiki/research/2026-06-19-experimental-meta-tag-skill-delivery.md` (head-level experiments).
