# Skill Attestation Evidence Model

Date: 2026-06-19

Question: what structured, signed evidence should the AMTECH certificate carry so that "verified" means *more* than "the bytes match a digest" — it means "this skill was tested and reviewed under a known policy"?

Context: today `certificate.json` (`amtech-signed-artifact/v1`) binds owner, repo commit/path, dual digests, and key id — strong **provenance**, zero **assurance evidence**. Work item 1 in the handoff adds structured signed test + review attestations and requires the **build/signing step to fail when required evidence is absent or stale**. This note designs that evidence model. It feeds spec `docs/skills/standard/02-certificate-attestation-schema.md`.

## Design principles (borrowed, see prior-art note)
1. **Subject + predicate** (in-toto): the certificate already names the subject (the skill archive, bound by `digests`). The new `attestations` block is the predicate — claims *about* that subject.
2. **Bind everything by digest** (in-toto/SLSA): every piece of evidence (a test report, a review record) is referenced by its own SHA-256 so the human-readable summary in the cert can't drift from the artifact it summarizes.
3. **Graduated trust tiers** (Human-Certified Module Repositories): the cert declares *how* it was certified, not just *that* it is signed.
4. **Freshness / anti-stale** (TUF timestamp): evidence carries a timestamp and a source-commit pin; the signer enforces a max-age and a commit match.
5. **No over-claiming** (existing SKILL_SIGNING posture): evidence attests process, not legal authorship or absolute safety.

## Proposed `attestations` shape (informative — normative version in the spec)

```jsonc
"attestations": {
  "policyVersion": "amtech-skill-policy/1",      // which review/test policy these claims satisfy
  "trustTier": "human-reviewed",                  // automated-tested | human-reviewed (graduated)
  "permissions": {                                // declared capability surface of the skill
    "filesystem": "read-write-optional",          // none | read | read-write | read-write-optional
    "network": "none",
    "scripts": ["scripts/audit.ts"],              // every executable shipped, by path
    "secrets": "none"
  },
  "tests": {
    "suite": "okf-audit-conformance",
    "suiteVersion": "0.3.1",
    "sourceCommit": "88d9ce8...",                 // MUST match certificate.repository.commit
    "result": "pass",                              // pass | fail (signing fails unless pass)
    "ranAt": "2026-06-19T00:00:00.000Z",
    "evidenceDigest": { "sha256": "..." }          // digest of the full machine-readable test report
  },
  "review": {
    "reviewer": { "type": "human", "id": "amtech:reviewer:ben", "name": "Ben (AMTECH)" },
    "result": "approved",                          // approved | rejected | waived
    "reviewedAt": "2026-06-19T00:00:00.000Z",
    "policyVersion": "amtech-skill-policy/1",
    "evidenceDigest": { "sha256": "..." }          // digest of the review record / checklist
  }
}
```

## Trust tiers (initial ladder)
- `unsigned` — not in the registry (not a tier; the absence case).
- `signed` — v1 today: provenance + digest only. Retained as the floor for back-compat.
- `automated-tested` — `tests.result == pass`, fresh, commit-matched; no human review.
- `human-reviewed` — `automated-tested` **plus** `review.result == approved` by a named reviewer under a policy version.

The verifier (work item 2) reports the tier it could prove, never higher than the evidence supports.

## Signer-enforced gates (this is the "build fails" requirement)
At `npm run skills:sign` the signer MUST refuse to emit a v2 certificate unless, for the declared `trustTier`:
- `tests.sourceCommit == certificate.repository.commit` (evidence is about *this* release, not a stale one).
- `tests.ranAt` within max-age (proposed 90 days; configurable per policy).
- `tests.result == pass`.
- each `evidenceDigest` resolves to a real, committed evidence file whose recomputed SHA-256 matches.
- for `human-reviewed`: `review.result == approved`, `review.policyVersion == policyVersion`, reviewer id present.
- `permissions.scripts` lists exactly the executables present in the archive (no undeclared scripts).

Absent/stale/mismatched evidence → hard failure, mirroring how `scripts/okf/validate-okf.ts` phase gates fail the build.

## Where evidence lives
- Evidence files (test report JSON, review checklist) committed under `src/lib/skills/certificates/<slug>/evidence/` (source of truth) and published read-only at `/skills/<slug>/evidence/*` for the link-first verifier. Each is referenced from the cert by digest only, so the cert stays small and the heavy evidence is fetched on demand (progressive disclosure — same pattern as skill references).

## Backward compatibility
- `amtech-signed-artifact/v1` certs remain valid and verify as tier `signed`.
- v2 adds the optional-at-schema-but-required-by-policy `attestations` block; `schemaVersion` bumps to `amtech-signed-artifact/v2`.
- The verifier accepts both; surfaces the proven tier.

## Open questions for the spec
- Max-age default (90d?) and whether it's per-policy or global.
- Reviewer identity model: free-form id now vs. a signed reviewer key later (ties to authority/key-management spec).
- Whether `permissions` should be machine-derived from the archive (preferred — less to forge) or author-declared-then-verified (proposed: author declares, signer verifies against archive contents).

## Sources / related
- in-toto attestation predicate model — see prior-art note.
- SLSA provenance predicate (builder/inputs by digest) — see prior-art note.
- Human-Certified Module Repositories for the AI Age (arXiv 2603.02512) — trust tiers + human review.
- `wiki/research/2026-06-19-skill-certificate-authority-prior-art.md`
- `docs/skills/standard/02-certificate-attestation-schema.md` (normative)
- `scripts/signing/amtech-signing.ts` (current cert type + canonicalization)
