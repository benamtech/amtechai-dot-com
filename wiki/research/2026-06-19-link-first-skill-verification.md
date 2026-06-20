# Link-First Skill Verification

Date: 2026-06-19

Question (work item 2): how does a verifier turn any AMTECH skill-related URL into exactly one of `verified | revoked | invalid`, with machine-readable evidence and reason codes — and how is that result exposed everywhere an agent might look?

Grounding: this session a verifier was run **by hand** — fetch `certificate.json` + `certificate.sig` + signing key, recompute `canonicalJson`, check the Ed25519 signature, confirm key id + active status. Verdict: `verified`. That manual procedure is the spec made executable. Feeds `docs/skills/standard/04-link-first-verifier.md` and `05-multi-surface-exposure.md`.

## Two verification depths
Borrowed from the Sigstore/CT distinction between metadata verification and artifact verification:

- **Link-only verification** — authenticate the *metadata and attestations* without installing or even downloading the skill archive. Resolve the authority chain, validate schema + Ed25519 signature + key status + cert status + repo pin + attestations. This is what an in-context agent (web/search-only) needs before using a skill in conversation. It does **not** prove the zip bytes; it proves the signed claims about them.
- **Archive-byte verification** — additionally fetch the archive, recompute SHA-256 + SHA3-512, and confirm they equal the digests in the (signed) certificate. Required before a skill is installed / its scripts are run.

A verifier reports which depth it performed, so a consumer knows whether the bytes were checked or only the claims.

## Accepted inputs (any one URL bootstraps the chain)
The verifier must discover the canonical authority chain from any of: a skill **page** URL (`/skills/<slug>`), a **bootstrap** file (`use.md`/`agent.md`), the **catalog** (`/skills/catalog.json`), a **certificate** URL, or the **authority** URL. Each surface links "up" to the authority and "across" to the cert + key, so discovery converges regardless of entry point. (This is why the catalog-bootstrap M0 matters: the hub must also point into the chain.)

## Check sequence → verdict
1. Resolve authority (`/.well-known/skill-authority.json`) and the immutable latest record; confirm latest-pointer hash matches the head record (per `03-authority-and-key-management.md`).
2. Locate the skill entry; if `status == revoked` (or its key is revoked) → **`revoked`**.
3. Fetch certificate + signature + signing key.
4. Schema valid? key id matches? key `status == active` (or active-at-issuance for historical)? → else **`invalid`**.
5. Verify Ed25519 over `canonicalJson(certificate)`. Fail → **`invalid`**.
6. Repo pin: certificate `repository.commit/path` matches the authority record. Mismatch → **`invalid`**.
7. Attestations (v2): required evidence present, fresh, commit-matched, digests resolve. Missing/stale → **`invalid`** (cannot claim a tier it can't prove).
8. (Archive-byte mode only) recompute archive digests; mismatch → **`invalid`**.
9. All pass → **`verified`**, with the proven `trustTier` and the depth performed.

Acceptance boundary (from the handoff): **no** path returns `verified` unless it resolves to the same signed certificate **and** the current immutable authority state.

## Reason-code taxonomy (machine-readable, stable strings)
- `OK_VERIFIED`
- `REVOKED_SKILL`, `REVOKED_KEY`
- `INVALID_SCHEMA`, `INVALID_SIGNATURE`, `INVALID_KEY_STATUS`, `KEYID_MISMATCH`
- `REPO_PIN_MISMATCH`
- `ATTESTATION_MISSING`, `ATTESTATION_STALE`, `ATTESTATION_DIGEST_MISMATCH`
- `ARCHIVE_DIGEST_MISMATCH`
- `AUTHORITY_CHAIN_BROKEN` (latest pointer ≠ head record, or record chain gap)
- `UNREACHABLE` (a required surface could not be fetched — distinct from invalid)

Output is a small JSON object: `{ verdict, depth, trustTier, reasonCodes[], subject, evidence{...}, checkedAt }`.

## Multi-surface exposure of the result (work item 3)
The *same* verdict, projected:
- **Page HTML + JSON-LD** — a visible verification badge + a machine `ClaimReview`/custom JSON-LD block on `/skills/<slug>` and the hub.
- **Catalog + manifest JSON** — `verdict`/`trustTier` fields per skill.
- **Agent bootstrap** (`use.md`/`agent.md`) — a one-line status + how to re-verify.
- **Response headers** (`public/_headers`) — e.g. `X-AMTECH-Skill-Verification: verified; tier=human-reviewed`.
- **CLI / library / API** — `verify-skill <url>` returning the JSON above; reuse `verifyCertificate()` + `canonicalJson()` from `scripts/signing/amtech-signing.ts`.

Important honesty constraint: a *statically pre-rendered* badge asserts "verified at build time." A consumer that needs live assurance must run the verifier (or hit the API), because revocation can postdate the build. Document this clearly so the badge is not mistaken for a live check.

## Reuse (don't re-implement)
- `canonicalJson`, `verifyCertificate`, `digest` — `scripts/signing/amtech-signing.ts`.
- Existing portable verify entry — `scripts/signing/verify-artifact.ts` (generalize to a skill/URL verifier).
- Existing validation harness patterns — `scripts/skills/validate-skills.ts`, `scripts/okf/validate-okf.ts` (reason-coded gates).

## Sources / related
- Sigstore verify (metadata vs artifact) — see prior-art note.
- CT client verification + research.swtch.com/tlog — see prior-art note.
- `wiki/research/2026-06-19-skill-certificate-authority-prior-art.md`
- `docs/skills/standard/04-link-first-verifier.md`, `05-multi-surface-exposure.md` (normative)
