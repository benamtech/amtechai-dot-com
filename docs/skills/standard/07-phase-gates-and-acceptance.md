# 07 — Phase Gates & Acceptance

Part of the AMTECH Skill Certificate-Authority Standard. Mirrors the gate discipline of `scripts/okf/validate-okf.ts` and `scripts/skills/validate-skills.ts`. These gates wire into `npm run skills:validate` / `skills:check` and must pass in `postbuild`.

## Acceptance boundary (from the handoff — the one rule)

No surface may report `verified` unless it resolves to the same signed certificate **and** the current immutable authority state. Revoked keys/skills → `revoked`. Malformed, mismatched, stale, or unverifiable evidence → `invalid`.

## Gates by milestone

### M0 — Catalog bootstrap
- **G-M0.1** `public/skills/catalog.json` exists, schema-valid, lists exactly the registry's skills with matching slug/version/status.
- **G-M0.2** `public/skills/use.md` and `agent.md` (hub) exist and link `catalog.json` + authority.
- **G-M0.3** Prerendered `/skills` HTML contains the agent-instruction block and decision tree.
- **G-M0.4** Live-walk acceptance (`06`) passes from the hub URL alone.

### M1 — Attestations (`v2`)
- **G-M1.1** Every published cert is `amtech-signed-artifact/v2` with an `attestations` block (or explicitly tier `signed` for back-compat).
- **G-M1.2** Signer refused conditions all enforced (commit match, freshness ≤ max-age, `result==pass`, evidence digests resolve, scripts match archive, review approved for `human-reviewed`). Negative tests: a stale/absent/mismatched-evidence fixture **fails** signing.
- **G-M1.3** Published evidence files resolve and recompute to the cert's `evidence.sha256`.

### M2 — Verifier
- **G-M2.1** `npm run skills:verify <url>` returns the `04` JSON for page/bootstrap/catalog/certificate/authority inputs.
- **G-M2.2** Conformance fixtures: a tampered cert → `invalid` `INVALID_SIGNATURE`; a revoked skill → `revoked`; a good skill → `verified`. Each asserts the exact reason code.
- **G-M2.3** Build validator runs the verifier over every published skill; build fails if any can't reach `verified`.

### M3 — Multi-surface exposure
- **G-M3.1** HTML badge, JSON-LD, catalog, manifest, headers, and bootstrap all carry the same `verdict`/`trustTier`/`authoritySequence`/`checkedAt` for each skill.
- **G-M3.2** No static surface claims a tier the evidence can't prove.
- **G-M3.3** Static surfaces carry `checkedAt` (build-time honesty marker).

### M4 — Immutable authority history
- **G-M4.1** `log.json` is gap-free + monotonic; each record's `previousRecordHash` chains; each signature verifies.
- **G-M4.2** `skill-authority.json` `latestRecordHash` == head record digest; `latestSequence` == head sequence.
- **G-M4.3** A `skill-revoke`/`key-revoke` event makes the verifier return `revoked` for the affected subject.
- **G-M4.4** Publishing commits are signed (`commitSignature` ≠ `unsigned`); the GitHub mirror matches the published records.

## Validator wiring
- Extend `scripts/skills/validate-skills.ts` with G-M0/M1/M3 checks; add a verifier-conformance step (G-M2); add authority-chain checks (G-M4).
- Keep the existing dual-digest, archive, repo-pin, and discovery-link checks.
- `npm run skills:check` = build + validate; gated in `postbuild` like the OKF validator.

## Related
- `02`/`03`/`04`/`05`/`06` (the things gated here), `08-build-plan.md` (milestones).
