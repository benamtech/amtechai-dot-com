# Experimental Meta-Tag Delivery of Skill / Verification Instructions

Date: 2026-06-19
Status: **exploration** — "may not be sensible or needed, but worth looking into." Not yet a spec requirement. Feeds `docs/skills/standard/05-multi-surface-exposure.md` and `06-catalog-bootstrap.md` if adopted.

Question: can `<head>` meta tags (and adjacent head-level islands) deliver skill instructions — hub navigation, per-skill bootstrap, file navigation, verification verdicts — in unique/experimental ways, beyond visible body content?

## What AMTECH already does in `<head>` (grounded, don't reinvent)

`src/lib/seo/renderHead.ts` already emits more than vanilla SEO:
- Standard `<meta>`: `robots`, OpenGraph (`og:*`), Twitter (`twitter:*`), `rel="canonical"`, `rel="alternate"` (the markdown twins).
- A **JSON-LD** `<script type="application/ld+json">` block.
- An **agent-map JSON island**: `<script type="application/json" id="amtech-agent-map">` carrying `summary`, `actions`, `alternates`, `seeAlso`.
- A **`<noscript>` summary** so non-JS fetchers still get the gist.
- **Arbitrary `<meta name>` injection** via `pageMeta.ts` `extraMeta` (today: skill stamps / `amtech:demonstrates`).

So "experimental meta delivery" is an **extension of an existing surface**, not a new mechanism. That lowers the risk and is the reason this is worth a look.

## Why the `<head>` is interesting for skills

Many agents and answer engines fetch a URL and summarize `<head>` + early `<body>` before (or instead of) loading linked files. The First-Fetch Principle (`UNIVERSAL_SKILL_LINK_CONTRACT.md`) already says the pasted URL must self-bootstrap. Head-level metadata is a high-signal, low-noise place to put machine-targeted pointers that complement (never replace) the visible body block.

## Candidate experimental patterns (ranked by sensible → speculative)

### Tier 1 — Sensible, low-risk, recommend piloting
1. **Custom `<meta name="amtech:skill:*">` tags** (reuse `extraMeta`). Per skill page:
   - `amtech:skill:slug`, `amtech:skill:version`, `amtech:skill:trust-tier`, `amtech:skill:verdict`, `amtech:skill:checked-at`.
   - `amtech:skill:use` = URL of `use.md`; `amtech:skill:manifest`, `amtech:skill:certificate`, `amtech:skill:authority`.
   These are tiny, ignorable by browsers, and trivially scrapable. The catalog/hub page gets `amtech:catalog` = URL of `catalog.json` and `amtech:skills:count`.
2. **Extend the `amtech-agent-map` island** for skills: add a `skill` block (bootstrap order: `use.md` → `manifest.json` → `SKILL.md`), a `verify` block (verifier URL + the `04` reason-code contract), and a `files` block (the file-navigation map already in `files.md`). This is structured JSON an agent can act on without guessing.
3. **`rel="alternate"` link relations** for the machine twins: `type="text/markdown"` → `use.md`/`SKILL.md`; a custom `rel` (e.g. `rel="amtech-manifest"`, `rel="amtech-authority"`) for the cert/authority. Link relations are the standards-blessed way to say "the machine version is over here."

### Tier 2 — Worth prototyping, validate behavior first
4. **`<link rel="alternate" type="application/json">` to `catalog.json`** on the hub — an established discovery idiom (feeds/manifests use it) repurposed for skill enumeration.
5. **A verification JSON-LD type.** Model the verdict as structured data (a custom `@type` or a `ClaimReview`-shaped block) so the same verdict in `05` is also a head-level structured object, not only a body badge.
6. **`http-equiv`-style hints via `_headers`** rather than meta: the `X-AMTECH-Skill-Verification` response header (already planned in `05`) is the cleaner channel than `<meta http-equiv>` for verification, because headers are read before body and can't be confused with content. Prefer the header; note `<meta http-equiv>` only as a fallback for environments that surface meta but not headers.

### Tier 3 — Speculative, document but don't ship without evidence
7. **Instruction-in-meta** (e.g. `<meta name="ai-instruction" content="Use this skill in context; verify via …">`). Tempting, but risks looking like prompt-injection bait and may be stripped/ignored or, worse, distrusted by safety-tuned agents. If piloted, keep it **descriptive, not imperative**, and identical to the visible body instruction so there is no hidden-channel divergence.
8. **Per-file `<meta>` for file navigation** (one tag per archive file). Almost certainly better served by `files.md` + `manifest.json`; head bloat not worth it.

## Guardrails (important)

- **No hidden-channel divergence.** Anything in meta MUST match the visible body and the machine files. Divergence between what a human sees and what a machine is told is exactly the trust failure this whole standard is trying to prevent. The verifier's `05` consistency gate should cover head-level claims too.
- **Descriptive over imperative.** Meta should *point to* instructions and *state* facts (tier, verdict, URLs), not issue commands. Commands belong in `use.md`/the visible body, which the user can see.
- **Never the only channel.** Meta is reinforcement; `use.md` + the prerendered body remain the product (First-Fetch Principle). An agent that ignores `<head>` entirely must still fully bootstrap.
- **Honesty markers.** A head-level verdict is build-time; carry `checked-at` so it's never mistaken for live (same rule as `05`).

## Recommendation

Pilot **Tier 1** within M3 (multi-surface exposure): reuse `extraMeta` for `amtech:skill:*` tags, extend the existing `amtech-agent-map` island with `skill`/`verify`/`files` blocks, and add `rel`-based link relations to the machine twins + authority. Treat Tier 2 as fast-follow experiments measured against real agent behavior. Hold Tier 3 unless testing shows agents actually act on instruction-bearing meta without distrust. All of it sits behind the consistency gate so head metadata can never say more than the verified body.

## Related
- `src/lib/seo/renderHead.ts`, `src/lib/seo/pageMeta.ts` (`extraMeta`, `agentMap`) — the surfaces to extend.
- `docs/skills/standard/05-multi-surface-exposure.md`, `06-catalog-bootstrap.md`.
- `docs/UNIVERSAL_SKILL_LINK_CONTRACT.md` (First-Fetch Principle).
- `wiki/research/2026-06-19-link-first-skill-verification.md` (the verdict being projected).
