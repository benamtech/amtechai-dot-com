# 02 — Certificate & Attestation Schema (`amtech-signed-artifact/v2`)

Part of the AMTECH Skill Certificate-Authority Standard. Research: `wiki/research/2026-06-19-skill-attestation-evidence-model.md`. Implements work item 1.

## Goal

Extend the certificate so a `verified` result proves **assurance** (tested + reviewed under a known policy), not just **provenance** (who/where/which bytes). Borrow the in-toto subject+predicate discipline and SLSA "bind everything by digest" rule; keep the AMTECH envelope (Ed25519 over canonical JSON).

## v1 → v2 changes

- `schemaVersion`: `amtech-signed-artifact/v1` → `amtech-signed-artifact/v2`.
- **All v1 fields retained** (owner, canonicalUrl, repository, version, digests, issuedAt, issuer, signingKeyId/Url, certificateId, subjectType/Id). v1 certs remain valid and verify as trust tier `signed`.
- **New `attestations` object** (subject is already the archive, bound by `digests`; `attestations` is the predicate).

## `attestations` (normative)

```jsonc
{
  "policyVersion": "amtech-skill-policy/1",
  "trustTier": "human-reviewed",            // signed | automated-tested | human-reviewed
  "permissions": {
    "filesystem": "read-write-optional",     // none | read | read-write | read-write-optional
    "network": "none",                       // none | outbound | bidirectional
    "secrets": "none",                       // none | declared
    "scripts": ["scripts/audit.ts"]          // EXACT list of executables in the archive
  },
  "tests": {
    "suite": "okf-audit-conformance",
    "suiteVersion": "0.3.1",
    "sourceCommit": "<must equal repository.commit>",
    "result": "pass",                        // pass | fail
    "ranAt": "2026-06-19T00:00:00.000Z",
    "evidence": { "url": "https://amtechai.com/skills/<slug>/evidence/tests.json",
                  "sha256": "<digest of that file>" }
  },
  "review": {                                // required only for trustTier "human-reviewed"
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
- `trustTier` MUST NOT exceed what the present evidence proves (see ladder below).
- `tests.sourceCommit` MUST equal `repository.commit`.
- `permissions.scripts` MUST list exactly the executables present in the archive (no more, no fewer).
- Every `evidence.sha256` MUST resolve to a committed/published file whose recomputed SHA-256 matches.
- All signed values are strings/objects only — **no JSON numbers in signed payloads** (I-JSON / canonicalization safety, RFC 8785 rationale).

## Trust-tier ladder

| Tier | Requires |
| --- | --- |
| `signed` | v1 floor: valid signature + provenance + digests (back-compat) |
| `automated-tested` | `signed` + `tests.result == pass`, fresh, commit-matched |
| `human-reviewed` | `automated-tested` + `review.result == approved` by a named reviewer under `policyVersion` |

## Signer-enforced gates (the "build fails" requirement)

`npm run skills:sign` MUST refuse to emit a v2 certificate for the declared `trustTier` unless **all** apply:
1. `tests.sourceCommit == repository.commit`.
2. `tests.ranAt` within max-age (default **90 days**; per-policy override allowed).
3. `tests.result == pass`.
4. each `evidence.sha256` resolves and recomputes equal.
5. `permissions.scripts` equals the archive's executable set (machine-checked against archive contents).
6. for `human-reviewed`: `review.result == approved` and `review.policyVersion == policyVersion` and reviewer id present.

Any failure → hard build failure (mirror `scripts/okf/validate-okf.ts` gate style). Absent evidence is a failure, not a downgrade — the author must either supply evidence or declare a lower tier.

## Evidence storage

- Source of truth: `src/lib/skills/certificates/<slug>/evidence/{tests.json,review.json}`.
- Published read-only: `/skills/<slug>/evidence/*` (so link-first verification can fetch by URL).
- Referenced from the cert **by digest only** — the cert stays small; heavy evidence is progressive-disclosure (same pattern as skill `references/`).

## Type changes (implementation pointer)

Extend `ArtifactCertificate` in `scripts/signing/amtech-signing.ts` with the optional `attestations` object and bump the literal `schemaVersion`. `canonicalJson` already sorts keys + drops `undefined`, so signing/verifying the larger object needs no canonicalization change. Add the gate logic in `scripts/signing/sign-skills.ts` and assert published evidence + tier in `scripts/skills/validate-skills.ts`.

## Related
- `01-trust-model-and-threats.md` (threats this addresses), `04-link-first-verifier.md` (how a verifier consumes this), `07-phase-gates-and-acceptance.md` (gates).
