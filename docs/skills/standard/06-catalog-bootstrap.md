# 06 — Catalog Bootstrap (the `/skills` hub)

Part of the AMTECH Skill Certificate-Authority Standard. **This is M0 — it ships before M1–M4.** Extends `docs/UNIVERSAL_SKILL_LINK_CONTRACT.md`.

## Why this exists (verified gap)

Black-box test this session: an agent handed `https://amtechai.com/skills/okf-audit` gets a full instruction block + decision tree. An agent handed `https://amtechai.com/skills` (the hub) gets **nothing machine-actionable** — no agent-instruction block, no catalog, no way to enumerate skills or reach their certificates. The hub is the URL people are most likely to paste ("here are AMTECH's skills"), so it must be self-bootstrapping too. The Universal Skill Link Contract currently requires this of `/skills/<slug>` only; this spec extends it to the hub.

## Requirements

### 1. Hub page (`/skills`) — prerendered HTML must include
- A visible **AI agent instruction block** near the top (same posture as the skill page: "use in context, don't install/run without asking").
- A **decision tree** for web/search-only, file-capable, and native-install-capable agents — at the catalog level ("enumerate → pick a skill → open its page → verify").
- A rendered **list of every skill** with, per skill: name, one-line task, version, status, trust tier, and links to its `/skills/<slug>` page, `use.md`, `manifest.json`, certificate, and the authority file.
- A link to the machine `catalog.json` and to `/.well-known/skill-authority.json`.

### 2. Machine catalog — `public/skills/catalog.json`
```jsonc
{
  "schemaVersion": "amtech-skill-catalog/v1",
  "issuer": { "name": "AMTECH AI", "url": "https://amtechai.com" },
  "authorityUrl": "https://amtechai.com/.well-known/skill-authority.json",
  "generatedAt": "2026-06-19T...",
  "skills": [
    {
      "slug": "okf-audit", "name": "okf-audit", "title": "OKF Audit Skill",
      "version": "0.1.0", "status": "published", "trustTier": "amtech-reviewed",
      "verdict": "verified", "checkedAt": "2026-06-19T...", "authoritySequence": 7,
      "canonicalUrl": "https://amtechai.com/skills/okf-audit",
      "useUrl": ".../skills/okf-audit/use.md",
      "manifestUrl": ".../skills/okf-audit/manifest.json",
      "certificateUrl": ".../skills/okf-audit/certificate.json",
      "signatureUrl": ".../skills/okf-audit/certificate.sig"
    }
  ]
}
```
Derived from `src/lib/skills/registry.ts` — never hand-maintained.

### 3. Hub bootstrap files
- `public/skills/use.md` — universal hub bootstrap: what AMTECH skills are, how to enumerate via `catalog.json`, how to verify, the use-in-context default.
- `public/skills/agent.md` — short first-fetch preview optimized for search/crawl.

### 4. Headers
`public/_headers` serves `catalog.json` with the right content-type/caching alongside the existing `/skills/*` rules.

### 5. Hub head-level surfaces (Tier-1/2, see `05`)
- `amtech:catalog` (URL of `catalog.json`), `amtech:skills:count`, and **`amtech:catalog:root`** — a digest over the per-skill certificate digests so an agent can confirm the skill *set* is complete and untampered (recompute → `CATALOG_ROOT_MISMATCH` on drift; M4 folds the same root into the authority record).
- The `amtech-agent-map` island gains a `verify` block (the recompute recipe + the reason-code contract) — the hub is a `04` entry point.

## Acceptance (re-run the live black-box walk)
A fresh agent given **only** `https://amtechai.com/skills` can:
1. Read the agent-instruction block + decision tree from the first fetch.
2. Enumerate every skill (from page content and/or `catalog.json`).
3. Reach each `/skills/<slug>` page.
4. Locate each skill's certificate + the authority file and run `04` to `verified`.

## Implementation pointers
- `src/pages/Skills.tsx` — add the prerendered instruction block + decision tree + skill list (mirror the structure already in `SkillDetail.tsx`).
- `src/lib/seo/pageMeta.ts` — hub entry: ensure the prerendered body carries the bootstrap content (it drives the prerenderer).
- `scripts/skills/build-skills.ts` — emit `catalog.json`, hub `use.md`, hub `agent.md`.
- `scripts/skills/validate-skills.ts` — assert the three files exist, match the registry, and that the hub HTML contains the instruction block (gate).
- `public/_headers` — catalog content-type/caching.

## Related
- `docs/UNIVERSAL_SKILL_LINK_CONTRACT.md` (extended by this), `04-link-first-verifier.md` (hub as entry point), `05-multi-surface-exposure.md` (hub badge/JSON-LD), `08-build-plan.md` (M0).
