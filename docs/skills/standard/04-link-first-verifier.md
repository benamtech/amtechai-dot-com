# 04 — Link-First Verifier

Part of the AMTECH Skill Certificate-Authority Standard. Research: `wiki/research/2026-06-19-link-first-skill-verification.md`. Implements work item 2.

## Contract

Input: **any one** AMTECH skill-related URL. Output: exactly one verdict — `verified | revoked | invalid` — plus machine-readable evidence and stable reason codes. The procedure is the manual verification run this session, made executable.

### Accepted inputs (chain discovery converges from any)
skill **page** (`/skills/<slug>`) · **bootstrap** (`use.md` / `agent.md`) · **catalog** (`/skills/catalog.json`) · **certificate** (`certificate.json`) · **authority** (`/.well-known/skill-authority.json`). Each surface links up to the authority and across to cert + key, so any entry point resolves the full chain. (M0 makes the hub a valid entry point.)

### Two depths
- **Link-only** — authenticate metadata + attestations; do **not** download the archive. For in-context use by web/search-only agents. Proves the signed claims, not the zip bytes.
- **Graph-replay** — additionally recompute the self-describing recipe (SRI over published files + catalog root + any bound replay step) without downloading the archive. Earns `replay-verified`; the verdict is independently reproducible by any party.
- **Archive-byte** — additionally fetch the archive and confirm SHA-256 + SHA3-512 equal the signed digests. Required before install / running scripts.

The verifier reports which depth it performed.

## Check sequence → verdict

1. Resolve authority + latest record; confirm `latestRecordHash` == head record digest, chain intact → else `invalid` (`AUTHORITY_MISMATCH`).
2. Locate the skill entry. `status == revoked` → **`revoked`** (`REVOKED`); signing key revoked/unusable → **`revoked`** (`KEY_NOT_ACTIVE`).
3. Fetch certificate + signature + signing-key document. A required surface unreachable → **`UNREACHABLE`** ("can't determine", not `invalid`).
4. Schema valid, `certificate.signingKeyId == key.keyId`, key usable (active, or active-at-issuance for historical) → else **`invalid`** (`INVALID_SCHEMA` / `IDENTITY_MISMATCH` / `KEY_NOT_ACTIVE`).
5. Ed25519 verify over `canonicalJson(certificate)` → fail = **`invalid`** (`INVALID_SIGNATURE`).
6. `certificate.repository.path` matches the authority record, and the **`sourcePackage`** digest recomputes over the published files → else **`invalid`** (`SOURCE_PACKAGE_MISMATCH`). The cert binds no git commit — `sourcePackage` is the cross-repo anchor; the release commit is provenance only.
7. (skill certs) the served **`use.md`** and **`agent.md`** — the agent-entry surfaces — recompute SHA-256/SHA3-512 equal to **`certificate.bootstrap`**; a missing field or file, or any drift → **`invalid`** (`BOOTSTRAP_DIGEST_MISMATCH`, missing file `EVIDENCE_MISSING`). This binds the first two files an agent fetches, which sit outside `sourcePackage`/the archive.
8. (v2) attestations present, fresh, commit-matched, `evidence.sha256` resolves; map `conformance.method → max-tier` (unknown → `METHOD_UNKNOWN`) → else **`invalid`** (`MISSING_ATTESTATIONS` / `STALE_EVIDENCE` / `EVIDENCE_DIGEST_MISMATCH`).
9. (graph-replay depth) recompute the self-describing recipe: per-file SRI vs. signed manifest (`MANIFEST_DIGEST_MISMATCH`), catalog root (`CATALOG_ROOT_MISMATCH`), any bound replay step (`REPLAY_MISMATCH` / `REPLAY_NONDETERMINISTIC`).
10. (archive-byte only) recompute archive digests; mismatch = **`invalid`** (`DIGEST_MISMATCH`).
11. All pass → **`verified`** (`OK`) with the proven `trustTier`, `method`, and depth.

**Acceptance boundary:** no path returns `verified` unless it resolves to the same signed certificate **and** the current immutable authority state.

## Method → tier mapping & the self-describing recipe

The verifier reads the attestation **envelope**, not the method internals: it maps `conformance.method → maximum provable tier` via the registry in `09` and never reports a tier the method can't support (unknown → `METHOD_UNKNOWN`). New methods are drop-in — no cert/verifier-shape churn.

`replay-verified` is earned by the **self-describing recipe**: the verified surfaces carry the *ingredients and the expected result* of a cheap deterministic check, so a consumer — or a downstream re-renderer — **recomputes** the verdict instead of trusting a rendered badge. All client-side via WebCrypto:
1. canonicalize the certificate (RFC 8785 / JCS) and Ed25519-verify it against the published key;
2. recompute the archive digests + `sourcePackage` (the cross-repo anchor);
3. recompute the served `use.md`/`agent.md` digests and compare to the signed **`bootstrap`** (`BOOTSTRAP_DIGEST_MISMATCH` on drift) — the agent-entry surfaces;
4. recompute each published file's SHA-256 and compare to the **SRI digest** the signed manifest binds (`MANIFEST_DIGEST_MISMATCH` on drift);
5. recompute the **catalog root** over the per-skill digests (`CATALOG_ROOT_MISMATCH` on drift).
Determinism is the security property: re-running reproduces the verdict byte-for-byte; a step that doesn't → `REPLAY_NONDETERMINISTIC`. This is the `graph-replay` method (`09`) — deterministic recompute, **not** a live model, ZK, or proof-of-work.

## Reason codes (stable strings)

The reason-code set is **canonical in `src/lib/skills/verification/reasonCodes.ts`** — one enum shared by the signer gates (`02`), the conformance runner, the build validator (`07`), and this verifier. Adding/renaming a code is a change to that module; doc and code must not drift (`07` gates this).

`OK` · `INVALID_SIGNATURE` · `KEY_NOT_ACTIVE` · `IDENTITY_MISMATCH` · `DIGEST_MISMATCH` · `SOURCE_PACKAGE_MISMATCH` · `BOOTSTRAP_DIGEST_MISMATCH` · `MISSING_ATTESTATIONS` · `EVIDENCE_MISSING` · `EVIDENCE_DIGEST_MISMATCH` · `STALE_EVIDENCE` · `CONFORMANCE_FAILED` · `UNDECLARED_SCRIPT` · `REVIEW_NOT_APPROVED` · `TIER_NOT_SUPPORTED` · `INVALID_SCHEMA` · `UNREACHABLE` · `METHOD_UNKNOWN` · `REPLAY_MISMATCH` · `REPLAY_NONDETERMINISTIC` · `MANIFEST_DIGEST_MISMATCH` · `CATALOG_ROOT_MISMATCH` · `REVOKED` · `AUTHORITY_MISMATCH`

`UNREACHABLE` (a required surface couldn't be fetched) is distinct from `invalid` — it means "could not determine," not "failed."

## Output shape

```jsonc
{
  "verdict": "verified",
  "depth": "link-only",                 // link-only | graph-replay | archive-byte
  "trustTier": "amtech-reviewed",
  "method": "amtech-review",            // the method that earned the tier (registry in 09)
  "subject": { "slug": "okf-audit", "version": "0.1.0",
               "canonicalUrl": "https://amtechai.com/skills/okf-audit" },
  "reasonCodes": ["OK"],
  "evidence": { "certificateId": "...", "signingKeyId": "...",
                "repositoryCommit": "...", "authoritySequence": 7 },
  "checkedAt": "2026-06-19T..."
}
```

## Surfaces (one engine, several entry points)
- **Library** — pure function in `scripts/signing/` reusing `canonicalJson`, `verifyCertificate`, `digest` from `amtech-signing.ts`; generalize `verify-artifact.ts`.
- **CLI** — `verify-skill <url> [--archive-byte]` printing the JSON above; `npm run skills:verify`.
- **API** — optional Netlify function wrapping the library for non-technical/agent callers.

The build-time validator (`07`) runs this same engine over every published skill so the build fails if any surface can't reach `verified`.

## Related
- `02` (attestations consumed here), `03` (authority chain), `05` (exposing the verdict), `06` (hub as an entry point), `07` (gates).
