# 04 — Link-First Verifier

Part of the AMTECH Skill Certificate-Authority Standard. Research: `wiki/research/2026-06-19-link-first-skill-verification.md`. Implements work item 2.

## Contract

Input: **any one** AMTECH skill-related URL. Output: exactly one verdict — `verified | revoked | invalid` — plus machine-readable evidence and stable reason codes. The procedure is the manual verification run this session, made executable.

### Accepted inputs (chain discovery converges from any)
skill **page** (`/skills/<slug>`) · **bootstrap** (`use.md` / `agent.md`) · **catalog** (`/skills/catalog.json`) · **certificate** (`certificate.json`) · **authority** (`/.well-known/skill-authority.json`). Each surface links up to the authority and across to cert + key, so any entry point resolves the full chain. (M0 makes the hub a valid entry point.)

### Two depths
- **Link-only** — authenticate metadata + attestations; do **not** download the archive. For in-context use by web/search-only agents. Proves the signed claims, not the zip bytes.
- **Archive-byte** — additionally fetch the archive and confirm SHA-256 + SHA3-512 equal the signed digests. Required before install / running scripts.

The verifier reports which depth it performed.

## Check sequence → verdict

1. Resolve authority + latest record; confirm `latestRecordHash` == head record digest, chain intact → else `invalid` (`AUTHORITY_CHAIN_BROKEN`).
2. Locate the skill entry. `status == revoked` or its signing key revoked → **`revoked`** (`REVOKED_SKILL` / `REVOKED_KEY`).
3. Fetch certificate + signature + signing-key document.
4. Schema valid, `certificate.signingKeyId == key.keyId`, key usable (active, or active-at-issuance for historical) → else **`invalid`** (`INVALID_SCHEMA` / `KEYID_MISMATCH` / `INVALID_KEY_STATUS`).
5. Ed25519 verify over `canonicalJson(certificate)` → fail = **`invalid`** (`INVALID_SIGNATURE`).
6. `certificate.repository.{commit,path}` matches the authority record → else **`invalid`** (`REPO_PIN_MISMATCH`).
7. (v2) attestations present, fresh, commit-matched, `evidence.sha256` resolves → else **`invalid`** (`ATTESTATION_MISSING` / `ATTESTATION_STALE` / `ATTESTATION_DIGEST_MISMATCH`).
8. (archive-byte only) recompute archive digests; mismatch = **`invalid`** (`ARCHIVE_DIGEST_MISMATCH`).
9. All pass → **`verified`** (`OK_VERIFIED`) with the proven `trustTier` and depth.

**Acceptance boundary:** no path returns `verified` unless it resolves to the same signed certificate **and** the current immutable authority state.

## Reason codes (stable strings)

`OK_VERIFIED` · `REVOKED_SKILL` · `REVOKED_KEY` · `INVALID_SCHEMA` · `INVALID_SIGNATURE` · `INVALID_KEY_STATUS` · `KEYID_MISMATCH` · `REPO_PIN_MISMATCH` · `ATTESTATION_MISSING` · `ATTESTATION_STALE` · `ATTESTATION_DIGEST_MISMATCH` · `ARCHIVE_DIGEST_MISMATCH` · `AUTHORITY_CHAIN_BROKEN` · `UNREACHABLE`

`UNREACHABLE` (a required surface couldn't be fetched) is distinct from `invalid` — it means "could not determine," not "failed."

## Output shape

```jsonc
{
  "verdict": "verified",
  "depth": "link-only",                 // link-only | archive-byte
  "trustTier": "human-reviewed",
  "subject": { "slug": "okf-audit", "version": "0.1.0",
               "canonicalUrl": "https://amtechai.com/skills/okf-audit" },
  "reasonCodes": ["OK_VERIFIED"],
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
