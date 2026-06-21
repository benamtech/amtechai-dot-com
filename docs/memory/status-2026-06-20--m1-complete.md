# Status — M1 (v2 attestations) COMPLETE

Date: 2026-06-20 · Branch: `skill-ca-m1-attestations` (stacked on M0 PR #47)
Plan: `docs/memory/plan-2026-06-20--phase-1-2-implementation.md` (PR A) ·
Parent: `docs/memory/plan-2026-06-20--m1-complete-m2-scaffold-verification-recipe.md`

## What "complete" means here
**One AMTECH Signed Artifact v2 certificate verifies in BOTH repos.** The website signs it; the registry
re-verifies the *same signed bytes* and independently recomputes the `sourcePackage` cross-repo anchor over its
own source files. No second certificate format, no discrepancy.

## Done this session (PR A = M1 completion)
- **1a (was already in tree):** `src/lib/skills/renderSkillContent.ts` renders v2 "Source & verification" prose
  + conformance/review evidence links (gated on attestations; "verified at build time" wording — no false live-check).
- **1b (was already in tree):** `scripts/skills/attestation-gates.ts` `checkAttestationGates()` re-asserts the
  signer gates G-M1.1–1.4 + G-X.2 over the *published* bytes; wired into `validate-skills.ts:validateAttestations`.
  6 negative fixtures (`scripts/skills/__fixtures__/attestation-gates.test.ts`, `node --test` → `npm run skills:test`,
  folded into `skills:check`): stale → `STALE_EVIDENCE`, commit ≠ → `COMMIT_MISMATCH`, undeclared script →
  `UNDECLARED_SCRIPT` (+`SOURCE_PACKAGE_MISMATCH`), conformance fail → `CONFORMANCE_FAILED`, hand-edited evidence →
  `EVIDENCE_DIGEST_MISMATCH`, off-ladder tier → `TIER_NOT_SUPPORTED`. **Open decision #3 settled** (fixtures live in
  `__fixtures__/*.test.ts` with `node --test`, no test-framework dependency).
- **1c — registry reconcile + lockstep VERIFIED green:**
  - `~/Desktop/amtech-skills-registry`: `registry/amtech-signing-key.json` mirrors the real active Ed25519 public
    key (`keyId ed25519:2ecc5136…`); `index.json` skills are `status:signed` / `trustTier:amtech-reviewed` with the
    v2 `verification` block; `registry/validate.mjs` Ed25519-verifies the v2 cert over canonical JSON and recomputes
    `sourcePackage` over the registry's own `skills/<slug>/` source. `node registry/validate.mjs --check` → green.
  - **Lockstep proof:** website `public/.well-known/skill-authority.json` `repository.commit` pins registry
    `88d9ce86525d3e234a37b0c5c7b752fc2beb69bb`; the certs bind that same commit; the registry's source bytes under
    `skills/` are unchanged vs `88d9ce8`. `validate.mjs` step 6 checks the cert's *self-pinned commit's* bytes
    (`git show 88d9ce8:…`) against the working tree (NOT against registry HEAD) — so the additive v2 reconcile can be
    committed at a new registry commit without breaking verification or forcing a website re-sign (source bytes,
    hence `sourcePackage`, are identical).
- **1d — end-to-end verify green:**
  - `npm run skills:sign` is **idempotent** (cert.json/.sig digests byte-identical pre/post — deterministic
    `ranAt`/canonical JSON). `npm run skills:check` green (validate + 7 tests). `npm run build` green (34 routes,
    0 errors; the 2 SEO warnings are pre-existing on `/pay`,`/payment-success`).
  - Static black-box check: prerendered `dist/skills/okf-audit/index.html` carries "AMTECH Signed Artifact v2" +
    "Conformance evidence (offline checks)" + "AMTECH review evidence" + `amtech-skill-policy/1`; all 4
    `public/skills/<slug>/evidence/{conformance,review}.json` resolve; catalog enumerates both skills.

## Lockstep / landing notes
- Registry has uncommitted additive v2 reconcile (`index.json`, `validate.mjs`, `registry/README.md`,
  `registry/amtech-signing-key.json`, untracked `registry/skills/<slug>/{certificate.json,.sig}`). Commit it at PR-A
  landing; the website pin stays `88d9ce8` because source bytes did not change.
- A true *live* black-box walk (a fresh agent against `https://amtechai.com/skills`) runs **post-deploy**; the static
  prerender check above stands in until then.

## Next — PR B (M2 scaffold)
2a method registry → 2c emit SRI + catalog root (root preimage locked:
`sha256(canonicalJson(sorted [{slug, cert: sha256(certificate.json bytes)}]))`) → 2b `graph-replay` verifier →
2d `verify-skill` CLI + validator wiring. See `docs/memory/plan-2026-06-20--phase-1-2-implementation.md` Phase 2.
