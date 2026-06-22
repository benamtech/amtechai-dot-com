# 05 — Multi-Surface Exposure

Part of the AMTECH Skill Certificate-Authority Standard. Research: `wiki/research/2026-06-19-link-first-skill-verification.md`. Implements work item 3.

## Goal

Publish the **same** verification verdict everywhere an agent, crawler, or human might look — so discovery context never changes the answer. One engine (`04`), many projections (the "one model, many projections" pattern already used by the OKF/article + skills pipelines).

## Surfaces

| Surface | What it carries | Where it's emitted |
| --- | --- | --- |
| Page HTML badge | Human-visible `verified · amtech-reviewed` + "re-verify" link | `/skills/<slug>` and `/skills` hub, prerendered |
| JSON-LD | Machine block (verdict, tier, certificateId, authoritySequence, checkedAt) | `<head>` via `renderHead.ts` / skill render |
| Catalog JSON | `verdict` + `trustTier` per skill | `public/skills/catalog.json` (M0) |
| Manifest JSON | Same per-skill verdict + cert/authority links | `public/skills/<slug>/manifest.json` |
| Agent bootstrap | Per-skill instructions, decision tree, Output Contract + one-line status & how to re-verify | `use.md` / `agent.md` (skill + hub) — **signed**: per-skill `use.md`/`agent.md` bytes are bound by `certificate.bootstrap` and recomputed by `04` (`BOOTSTRAP_DIGEST_MISMATCH`), so the front door is integrity-protected, not just a convenience wrapper |
| Response headers | `X-AMTECH-Skill-Verification: verified; tier=amtech-reviewed; seq=7` | `public/_headers` |
| Self-describing recipe | Recompute ingredients + per-file SRI + catalog root (earn `replay-verified` client-side) | `<head>` meta + `rel` link relations + signed `manifest.json` |
| CLI / API | Full `04` JSON | `npm run skills:verify` / Netlify fn |
| Context binding | Per-host hint: where the host keeps the skill's declared context slots | `use.md`/`agent.md` prelude (generic) + `hosts/<host>.md` (signed via manifest SRI) |
| Capability grant | `assuranceLevel` + warranted autonomy + the signed permission envelope | `recipe.json` + `/certificates/:id` (derived by `04`, see `12`) |

## Build-time vs live (honesty constraint)

Pre-rendered/static surfaces (HTML badge, JSON-LD, catalog, manifest, headers) assert **"verified at build time, sequence N."** They MUST say so (carry `checkedAt` + `authoritySequence`). Because a revocation can postdate the build, any consumer needing **live** assurance MUST run the verifier (`04` CLI/API). Never present a static badge as a live check — that's a stated non-goal in `01`.

## Consistency requirement

All static surfaces for a given skill MUST project from one verifier run at build time — the same `verdict`, `trustTier`, `authoritySequence`, and `checkedAt`. `07` gates this: the validator recomputes the verdict and fails the build if any surface disagrees or if any surface claims a tier the evidence can't prove.

## Implementation pointers (reuse)
- HTML + JSON-LD: extend `src/lib/seo/renderHead.ts` and `src/lib/skills/renderSkillContent.ts` (already the shared string projection for prerender + `SkillDetail.tsx`).
- Catalog / manifest / bootstrap: emit from `scripts/skills/build-skills.ts`.
- Headers: `public/_headers` (already sets content-type/caching for `/skills/*`).
- Verdict source: the `04` library — never recompute verification logic per surface.

**Implemented 2026-06-20 (M3):** one build-time `04` verifier run is projected to every surface above —
`verification` blocks in `catalog.json`/`manifest.json`, the generated content, the `X-AMTECH-Skill-Verification`
header, Tier-1 `amtech:skill:*` meta, agent-map `skill`/`verify`/`files`, a `ClaimReview` JSON-LD, the visible
body badge, and a first-class `/skills/<slug>/recipe.json` (`amtech-skill-recipe/v1`). The head/body consistency
gate (`scripts/skills/validate-skills.ts` `validateSurfaces`, G-X.4) fails the build if any surface disagrees or
over-claims a tier. The verdict carries a real `authoritySequence` from the genesis authority record (`03`).

## Head-level / meta-tag delivery (adopted: Tier-1/2; Tier-3 research-gated)

The `<head>` is itself a high-signal channel many agents read first; AMTECH already emits a JSON-LD block, an `amtech-agent-map` JSON island, a `<noscript>` summary, and arbitrary `<meta name>` tags (`extraMeta`) via `src/lib/seo/renderHead.ts` + `pageMeta.ts`. The head does not merely *point to* a badge — it carries the **self-describing verification recipe** (`04`) so an agent can **recompute** the verdict instead of trusting it.

- **Tier 1 (adopted):** `amtech:skill:{slug,version,trust-tier}` + `use/manifest/certificate/authority` URLs + `amtech:skill:recipe` (URL of the recompute recipe) + — once M2 surfaces a verdict — `verdict`/`checked-at`; extend the `amtech-agent-map` island with `skill`/`verify`/`files` blocks; `rel`-based link relations to the machine twins + cert + authority.
- **Tier 2 (adopted):** `rel="alternate" type="application/json"` → `catalog.json` on the hub; a verification JSON-LD type (`ClaimReview`-shaped verdict block); prefer the `X-AMTECH-Skill-Verification` response header over `<meta http-equiv>`. **SRI link relations** for the published machine files (`<link rel="amtech-manifest" integrity="sha256-…">`, etc.) so a client recomputes each file's digest against the signed manifest.
- **Tier 3 (research-gated):** a descriptive, opt-in verification attribute that *points to* the method/recipe and *states facts*, never imperative commands — validate empirically (e.g. a first-fetch agent test) before hard-shipping.

Guardrails (gated by `07`): no hidden-channel divergence — head meta falls under the same consistency gate and may never claim more than the verified body/cert; descriptive over imperative; never the only channel (First-Fetch Principle holds); `checked-at` honesty marker on any verdict. Full exploration: `wiki/research/2026-06-19-experimental-meta-tag-skill-delivery.md` (status: adopted Tier-1/2, Tier-3 research-gated).

## Context binding & host adapters (use the data the context already has)

The strongest agentic principle from the ecosystem: **never make the model discover what the host can inject.** A
skill declares **context slots** (named inputs it can consume — e.g. `estimate`'s `rates`, `customer`,
`tax_markup_rules`), and each **host adapter** maps a slot to where that host keeps it. The same canonical skill
then projects per host:

| Host | Slot source |
| --- | --- |
| Hermes AI employee | `rates` → `./brain/business-brain.md`; `customer`/`job` → MEMORY or the current thread |
| Claude Code | repo context / `AGENTS.md` |
| Codex plugin | `agents/openai.yaml` `default_prompt` |
| Generic link-only | ask the user (no host context to draw on) |

The skill body carries one host-agnostic **Context** section ("if a rate/customer is already in your context, use
it; only ask for what's genuinely missing"); per-host hint files (`hosts/<host>.md`) say *where*. Host hints are
additive surfaces signed via manifest SRI; the canonical signed `use.md`/`agent.md` stay commit-independent. The
map lives in `registry.ts` `contextBindings` and is projected by `build-skills.ts`. This is what makes a verified
skill *more useful in an agent that already knows the business* than the same text pasted cold.

## Bootstrap syntax conventions (loadability)

The materialized bootstrap (`use.md`) and the canonical `SKILL.md` follow the loadability conventions the Claude
Skills authoring guide proves out, so the *same bytes* navigate well whether an agent has the files on disk, an
`@`/path affordance, or only web access. These are projected by `build-skills.ts` and (where checkable) enforced
as recomputable conformance gates — see `wiki/research/2026-06-22-bootstrap-syntax-and-context-injection.md`.

- **Backtick paths are navigable references.** Every file path is wrapped in backticks (`` `references/x.md` ``).
  A backtick path is the recognizable, clickable/`@`-able reference unit across Claude Code, Cursor, and Codex.
  **Footgun gate:** a backtick span must never contain `!` — it triggers shell history-expansion when a host
  shells the wrapped token and can break the skill on load (anthropics/claude-code#24510). Enforced by
  `authoring:no-shell-eval-backticks` over `SKILL.md` + reference files.
- **Reference pointers are one level deep, with intent + when-to-load.** `use.md` projects a *Reference Files
  (progressive disclosure)* block: each bundled file as `Read [`path`](url)` (or `Run …` for scripts), plus its
  load policy. One level deep means the agent reads the *whole* file, not a `head -n` preview (deeper nesting
  triggers partial reads). The link carries the canonical fetch URL so a web-only agent follows it too; the
  backtick path serves file/`@` hosts. Read-vs-execute intent is explicit (`Run … (execute it; do not just read
  it)` for scripts) — the guide's strongest reliability lever for script skills.
- **Progressive disclosure is the default.** Metadata (name + description) routes; `SKILL.md` is the overview;
  references load only when the task needs them. Body stays < 500 lines (gate), refs > 100 lines carry a
  `## Contents` TOC (gate), nested local links are rejected in reference files (gate).
- **Host affordances are additive.** `hosts/<host>.md` may note the host-native pull syntax (e.g. Claude Code /
  Codex `@references/x.md`) without changing the canonical signed bytes — the universal markdown-link + backtick
  form always works; the host hint just adds the shortcut.

## Capability surface

The `04` verdict carries a `capability` grant (`12`): the signed permission envelope + `assuranceLevel` + whether
autonomy is warranted. It is surfaced on `recipe.json` and `/certificates/:id` so a host reads what a verdict
warrants without re-deriving it. Under the consistency gate like every other surface — it may never claim more than
the verified cert proves.

## Related
- `04-link-first-verifier.md` (the engine), `06-catalog-bootstrap.md` (hub surfaces), `07-phase-gates-and-acceptance.md` (consistency gate), `10` (behavior verdict surfaced here), `12` (capability grant), `13` (host hints + credential brokering), `wiki/research/2026-06-19-experimental-meta-tag-skill-delivery.md` (head-level experiments).
