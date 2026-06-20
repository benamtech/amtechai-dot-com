# Status: Skill CA Standard — M0 (catalog/hub bootstrap) complete — 2026-06-19

## What shipped

M0 of the AMTECH Skill Certificate-Authority Standard (`docs/skills/standard/06`, gates `07`
G-M0.1–G-M0.4). The `/skills` hub is now self-bootstrapping for agents. Website-only, reversible,
no registry-repo changes. Plan: `~/.claude/plans/robust-doodling-dolphin.md`.

## Changes

- **New `src/lib/skills/renderHubContent.ts`** — React-free `renderHubContentHtml()` mirroring
  `renderSkillContent.ts`. Emits the agent-instruction block (sentinel `AI agent instructions`),
  the catalog-level decision tree (sentinel `Decision tree`; web / file-capable / install-capable
  branches), an enumerated per-skill list (page/use.md/manifest/certificate/signature/authority
  links + status `published` + `Ed25519-signed (v1 certificate)` provenance — **no v2 trust tier**),
  and links to `catalog.json` + the authority file. Exports the two sentinels + `SKILL_CATALOG_URL`
  for the validator.
- **`scripts/okf/prerender.ts`** — replaced the minimal local `skillHubHtml()` with
  `renderHubContentHtml()` (this, not pageMeta sections, is the actual `/skills` prerender body).
- **`src/pages/Skills.tsx`** — now a one-line `dangerouslySetInnerHTML` of the shared renderer
  (mirrors `SkillDetail.tsx`); SPA == prerender parity. Old hand-rolled marketing body removed.
- **`scripts/skills/build-skills.ts`** — emits `public/skills/catalog.json`
  (`amtech-skill-catalog/v1`, **structural fields only**: slug/name/title/version/status + URLs;
  `generatedAt` is date-granularity to avoid per-build churn), hub `use.md` (`hubBootstrapMarkdown`),
  hub `agent.md` (`hubAgentMarkdown`).
- **`public/_headers`** — `/skills/catalog.json` → `application/json` + CORS + edge cache.
- **`scripts/skills/validate-skills.ts`** — `validateCatalogBootstrap()`: G-M0.1 (catalog matches
  registry exactly), G-M0.2 (hub use.md/agent.md link catalog+authority), G-M0.3 (hub HTML carries
  both sentinels + every skill-page link).

## Verification (all green)

- `npm run typecheck` clean.
- `npm run skills:check` green incl. new G-M0 gates.
- `npm run build` green — 34 routes prerendered, `seo:validate` 0 errors (2 pre-existing thin-body
  warnings on `/pay`, `/payment-success`, unrelated).
- Black-box walk on `dist/`: hub HTML carries the instruction block, decision tree, both skill-page
  links, catalog.json + authority + certificate links; `catalog.json`, `use.md`, `agent.md`, both
  `/skills/<slug>/index.html`, and `skill-authority.json` all reachable. Certs verified by
  `skills:validate`'s `verifyCertificate`.

## Decision (with user)

verdict/trustTier/authoritySequence/checkedAt are **omitted until earned** — added by M1 (v2
attestations), M3 (verdict), M4 (authority history). At M0 the catalog/hub surfaces carry only what
v1 can prove (status + Ed25519/v1 provenance), satisfying G-M3.2 (no over-claiming).

## Next: M1 — v2 attestations

Spec `02`, gates G-M1.1–3. Add optional `attestations` to `ArtifactCertificate` + bump schemaVersion
to v2; evidence files (`tests.json`/`review.json`) per skill; signer gates (commit match, freshness,
result==pass, evidence digests resolve, scripts==archive, review approved for `human-reviewed`) with
a negative fixture (stale evidence must fail signing); re-sign at proven tier. See `08-build-plan.md`.
Sequence: M0 ✓ → M1 → M2 (verifier) → M3 (multi-surface verdict) → M4 (authority history) → M5.
