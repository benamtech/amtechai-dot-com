# 02 — Certificate & Attestation Schema (`amtech-signed-artifact/v2`)

Part of the AMTECH Skill Certificate-Authority Standard. Research: `wiki/research/2026-06-19-skill-attestation-evidence-model.md`. Implements work item 1.

## Goal

Extend the certificate so a `verified` result proves **assurance** (tested + reviewed under a known policy), not just **provenance** (who/where/which bytes). Borrow the in-toto subject+predicate discipline and SLSA "bind everything by digest" rule; keep the AMTECH envelope (Ed25519 over canonical JSON).

## v1 → v2 changes

- `schemaVersion`: `amtech-signed-artifact/v1` → `amtech-signed-artifact/v2`.
- **All v1 fields retained** (owner, canonicalUrl, repository, version, digests, issuedAt, issuer, signingKeyId/Url, certificateId, subjectType/Id). v1 certs remain valid and verify as trust tier `signed`.
- **New `attestations` object** (subject is already the archive, bound by `digests`; `attestations` is the predicate).
- **New top-level `sourcePackage` digest** — `{ sha256, sha3_512 }` over the canonical source-package payload. This is the **cross-repo verification anchor**: the website and the registry compute it independently from the same source files and must agree, so *one* certificate verifies in *both* repos with no second cert format (`packagePayloadDigest()` in `amtech-signing.ts`, mirrored in the registry's `validate.mjs`).

## `attestations` (normative)

```jsonc
{
  "policyVersion": "amtech-skill-policy/1",
  "trustTier": "amtech-reviewed",           // see ladder below; signer never emits above the proven tier
  "permissions": {
    "filesystem": "read-write-optional",     // none | read | read-write | read-write-optional
    "network": "outbound",                   // none | outbound | bidirectional
    "secrets": "none",                       // none | declared
    "scripts": ["scripts/audit.ts"]          // EXACT list of executables in the archive
  },
  "conformance": {                           // OFFLINE contract-conformance — NOT a live AI test
    "suite": "okf-audit-conformance",
    "suiteVersion": "0.3.1",
    "method": "static-contract",             // static-contract (now) | live-model (reserved) — method registry, see 09
    "result": "pass",                        // pass | fail
    "ranAt": "2026-06-19T00:00:00.000Z",
    "evidence": { "url": "https://amtechai.com/skills/<slug>/evidence/conformance.json",
                  "sha256": "<digest of that file>" }
  },
  "review": {                                // required only for trustTier "amtech-reviewed"
    "reviewer": { "type": "human", "id": "amtech:reviewer:ben", "name": "Ben (AMTECH)" },
    "result": "approved",                    // approved | rejected | waived
    "reviewedAt": "2026-06-19T00:00:00.000Z",
    "policyVersion": "amtech-skill-policy/1",
    "evidence": { "url": "https://amtechai.com/skills/<slug>/evidence/review.json",
                  "sha256": "<digest of that file>" }
  }
}
```

### Field rules
- `trustTier` MUST NOT exceed what the present evidence proves (see ladder below); the `method` of the evidence maps to a maximum tier via the registry in `09`.
- **The signed cert binds no git commit.** `repository` is `{ url, path }`; the cross-repo anchor is `sourcePackage` (the source byte digest, recomputed in both repos). The release commit is recorded only as provenance in the manifest/authority — so a release is atomic (one registry commit) with no `pending-resign` window (implemented 2026-06-20).
- `permissions.scripts` MUST list exactly the executables present in the archive (no more, no fewer).
- Every `evidence.sha256` MUST resolve to a committed/published file whose recomputed SHA-256 matches.
- All signed values are strings/objects only — **no JSON numbers in signed payloads** (I-JSON / canonicalization safety, RFC 8785 rationale).

## Trust-tier ladder

| Tier | Method | Requires |
| --- | --- | --- |
| `signed` | `signature` | v1 floor: valid signature + provenance + digests (back-compat) |
| `structure-verified` | `static-contract` | `signed` + offline `conformance.result == pass`, fresh, commit-matched |
| `amtech-reviewed` | `amtech-review` | `structure-verified` + `review.result == approved` by a named reviewer under `policyVersion` |
| `replay-verified` | `graph-replay` | any party re-runs the bound deterministic check and reproduces every digest (the "missing middle" — `09`) |
| `behavior-verified` *(reserved)* | `live-model` | live-model behavioral pass — **v2 non-goal**, declared so the envelope is forward-compatible |
| `proof-verified` *(horizon)* | `zk-compute` | succinct proof of a compute job — **documented horizon**, not implemented |

The verifier (`04`) reports only the tier the evidence + method support, never higher. Full ladder + method registry: `09-verifiability-and-proof-methods.md`.

## Signer-enforced gates (the "build fails" requirement)

`npm run skills:sign` MUST refuse to emit a v2 certificate for the declared `trustTier` unless **all** apply:
1. `conformance.ranAt` within max-age (default **90 days**, `MAX_EVIDENCE_AGE_DAYS`; per-policy override allowed).
3. `conformance.result == pass`.
4. each `evidence.sha256` resolves and recomputes equal.
5. `permissions.scripts` equals the archive's executable set (machine-checked against archive contents).
6. `sourcePackage` recomputes equal from the source files (cross-repo anchor).
7. for `amtech-reviewed`: `review.result == approved` and `review.policyVersion == policyVersion` and reviewer id present.

Reason codes for each refusal are the canonical strings in `src/lib/skills/verification/reasonCodes.ts` (e.g. `COMMIT_MISMATCH`, `STALE_EVIDENCE`, `CONFORMANCE_FAILED`, `EVIDENCE_DIGEST_MISMATCH`, `UNDECLARED_SCRIPT`, `SOURCE_PACKAGE_MISMATCH`, `REVIEW_NOT_APPROVED`, `TIER_NOT_SUPPORTED`) — the same set the verifier (`04`) reports.

Any failure → hard build failure (mirror `scripts/okf/validate-okf.ts` gate style). Absent evidence is a failure, not a downgrade — the author must either supply evidence or declare a lower tier.

## Evidence storage

- Source of truth: `src/lib/skills/certificates/<slug>/evidence/{conformance.json,review.json}` (+ `examples/` golden inputs/outputs the conformance runner validates).
- Published read-only: `/skills/<slug>/evidence/*` (so link-first verification can fetch by URL).
- Referenced from the cert **by digest only** — the cert stays small; heavy evidence is progressive-disclosure (same pattern as skill `references/`).

## Type changes (implementation pointer)

Extend `ArtifactCertificate` in `scripts/signing/amtech-signing.ts` with the optional `attestations` object and bump the literal `schemaVersion`. `canonicalJson` already sorts keys + drops `undefined`, so signing/verifying the larger object needs no canonicalization change. Add the gate logic in `scripts/signing/sign-skills.ts` and assert published evidence + tier in `scripts/skills/validate-skills.ts`.

## Related
- `01-trust-model-and-threats.md` (threats this addresses), `04-link-first-verifier.md` (how a verifier consumes this), `07-phase-gates-and-acceptance.md` (gates).
