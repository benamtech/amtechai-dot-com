# Status — M2 scaffold COMPLETE (link-first verifier + SRI + catalog root)

Date: 2026-06-20 · Branch: `skill-ca-m1-attestations`
Plan: `docs/memory/plan-2026-06-20--phase-1-2-implementation.md` (Phase 2 = PR B). Follows
`docs/memory/status-2026-06-20--m1-complete.md`.

## Delivered (all uncommitted on the branch; verify green)
- **2a — verification-method registry.** `src/lib/skills/verification/methodRegistry.ts`: pure
  `method → { maxTier, depth }` map for `signature`/`static-contract`/`amtech-review`/`graph-replay`;
  `live-model`/`zk-compute` declared but map to no runtime tier (reserved/horizon). `maxTierForMethod()`,
  `depthForMethod()`, `tierRank()`, `TIER_ORDER`. Type-only `TrustTier` import → browser-portable for M3.
  Tests: `scripts/skills/__fixtures__/method-registry.test.ts` (incl. `TIER_ORDER === KNOWN_TRUST_TIERS`).
- **2c — SRI + catalog root at build.** `scripts/skills/build-skills.ts`: every manifest file entry + the
  archive now carry `integrity: "sha256-<base64>"` (manifest schema updated, required). **Catalog root**
  `catalogRoot = sha256(canonicalJson([{slug, cert: sha256(<certificate.json bytes>)}] sorted by slug))`
  emitted into `public/skills/catalog.json`; per-skill `certificate.sha256` added to `index.json`.
  **Cross-repo:** `registry/validate.mjs` recomputes the identical root from the mirrored certs and asserts
  equality with `index.json.verification.catalogRoot` — and it MATCHES the website value
  (`1b5e8b8a62caf26b…`). Preimage is LOCKED (changing it breaks cross-repo + browser recompute).
- **2b — verifier library + graph-replay recompute.** `src/lib/skills/verification/verifySkill.ts`: pure,
  loader-driven, runs the `09` recipe over PUBLISHED surfaces only and returns
  `{ verdict, depth, trustTier, method, subject, reasonCodes[], evidence, checkedAt }`. Depths
  `link-only`/`graph-replay`/`archive-byte`. Steps: Ed25519 over canonical cert → sourcePackage recompute
  over published files → per-file SRI vs manifest → evidence-digest resolution → catalog-root over the set →
  determinism re-run. Tests: `__fixtures__/verify-skill.test.ts` (good→verified/amtech-reviewed; tampered
  cert→INVALID_SIGNATURE; mutated file→MANIFEST_DIGEST_MISMATCH+SOURCE_PACKAGE_MISMATCH; mutated
  catalog→CATALOG_ROOT_MISMATCH; unreachable→unverifiable; link-only).
- **2d — CLI + validator wiring.** `scripts/signing/verify-skill.ts` (`npm run skills:verify <url|path>
  [--archive-byte|--link-only]`, prints spec JSON, exit 0 only when verified) over shared Node loaders in
  `scripts/skills/verifier-loaders.ts` (local-public + https). `validate-skills.ts` runs the verifier over
  every published skill (G-M2.3 — build fails if any ≠ verified). `package.json`: `skills:verify` added;
  verifier runs inside `skills:check` via `skills:validate`.

## Verify state (all green)
`npm run typecheck` · `npm run skills:check` (validate + verifier gate + **18** tests) · `npm run build`
(34 routes, 0 errors; 2 pre-existing /pay,/payment-success warnings) · `node registry/validate.mjs --check`
· `npm run skills:verify public/skills/okf-audit` → `verified` / `amtech-reviewed`, all 6 evidence steps pass.

## NOT in scope (deferred, unchanged from plan)
M3 surfacing (Tier-1 meta, agent-map `verify` block, `X-AMTECH`, head/body consistency enforcement, in-browser
recompute), M4 (authority log / hash-chained catalog root), consumer-side re-derivation, `behavior-verified`/
`proof-verified` (reserved/horizon).

## Landing (pending — see task #7)
Everything is uncommitted on `skill-ca-m1-attestations` (website) + uncommitted additive reconcile on the
registry. Land as two stacked PRs (A: M1 / B: M2) with the registry committed in lockstep at registry HEAD
(website pin stays `88d9ce8` — source bytes unchanged).
