# 03 — Authority & Key Management

Part of the AMTECH Skill Certificate-Authority Standard. Research: `wiki/research/2026-06-19-immutable-authority-history-options.md` (mechanism decision) + prior-art note. Implements work item 4.

## Key lifecycle (TUF-style hygiene)

The signing key document (`amtech-signing-key/v1`, served at `/.well-known/amtech-signing-key.json`) carries a `status`: `active` → `retired` → `revoked`.

- **active** — current release key; certificates signed now use it.
- **retired** — superseded by rotation; still valid for verifying certificates issued during its validity window (historical verification uses active-at-issuance semantics).
- **revoked** — compromised; certificates relying on it return `revoked` regardless of issuance date.
- **Offline discipline:** the private key stays at `.amtech/signing-private-key.pem` (mode 0600, git-ignored). Online surfaces never hold it. `npm run skills:sign` is the only operation that touches it.
- **Rotation:** generate a new key, publish its key document as `active`, mark the prior `retired`, and emit a `key-rotate` event in the authority history (below).
- **Multi-key serving (implemented 2026-06-20):** every key document is served at `/.well-known/keys/<keyId>.json`; the verifier fetches the cert's key by `signingKeyId` and accepts a `retired` key for the certs + authority records it signed (active-at-issuance), so a rotation does NOT invalidate history or force re-signing every cert. `revoked` → `revoked`. The chain walk verifies each record under its own signing key.
- **Signed publishing commits (implemented 2026-06-20):** a dedicated Ed25519 SSH commit-signing key (private git-ignored under `.amtech/`, public + `allowed_signers` committed under `signing/`, served at `/.well-known/commit-signing-key.pub`) signs every publishing commit; `skill-authority.repository.commitSignature` records the signer fingerprint (`ssh:SHA256:…`).

## Immutable authority history — Option A (git-anchored hash-chained signed snapshots)

Chosen mechanism (see trade-off note). Every authority change appends a numbered, signed record; the live authority file becomes the **latest pointer**.

**Implemented 2026-06-20 (M4 full — `docs/memory/status-2026-06-20--m4-full-m5-pipeline.md`):**
`scripts/signing/sign-authority.ts` maintains the chain: it materializes the desired `state` (records use
`events[]` + `state{catalogRoot, skills[], keys[]}`) and **appends** a record only when the state changes
(idempotent), chaining `previousRecordHash → sha256(canonicalJson(head))`. Revocations come from
`src/lib/skills/authority/revocations.json` (skill-revoke / key-revoke events); key lifecycle (active/retired/
revoked + key-rotate) is handled by `scripts/signing/rotate-key.ts`. `build-skills.ts` publishes every record +
`log.json` + the latest pointer + materialized `state`. The verifier (`04`) walks the full chain and honors
skill/key revocation → `revoked`. The registry mirrors the chain under `authority/` and `registry/validate.mjs`
cross-witnesses it; `commitSignature` is the `git-history` witness. Deferred: multi-key-by-keyId historical
serving, GPG/SSH commit signing, Option B Merkle log.

### Record (`amtech-authority-record/v1`)
```jsonc
{
  "schemaVersion": "amtech-authority-record/v1",
  "sequence": 7,                                   // gap-free, monotonic
  "previousRecordHash": { "sha256": "<canonicalJson(record[6]) digest>" },
  "issuedAt": "2026-06-19T...",
  "events": [
    { "type": "skill-publish",  "slug": "...", "version": "...", "certificateId": "..." },
    { "type": "skill-revoke",   "slug": "...", "reason": "..." },
    { "type": "key-rotate",     "fromKeyId": "...", "toKeyId": "..." },
    { "type": "key-revoke",     "keyId": "...", "reason": "..." }
  ],
  "state": { /* full materialized authority at this sequence: skills[], keys[] */ },
  "signingKeyId": "ed25519:...",
  "signature": "<Ed25519 over canonicalJson(record without signature)>"
}
```

### Published surfaces (all static)
- `/.well-known/authority/records/0007.json` — each record, immutable, stable historical URL.
- `/.well-known/authority/log.json` — append-only index: `[{sequence, sha256, url}]`.
- `/.well-known/skill-authority.json` — **latest pointer**: existing fields **plus** `latestSequence`, `latestRecordHash`, and the current materialized `state`. Backward compatible with today's file shape.

### Verifier obligations (consumed by `04`)
- latest pointer `latestRecordHash` == digest of the head record;
- each record's `previousRecordHash` chains to the prior record; `sequence` gap-free + monotonic;
- each record's `signature` verifies under the key named in `signingKeyId` (respecting that key's status);
- a `skill-revoke`/`key-revoke` in any record ≤ latest is honored → `revoked`.

### Commit signing
Fix `commitSignature: "unsigned"`: registry commits that publish a record MUST be signed, so the public GitHub history is an independent, cryptographically-anchored witness of the same chain.

## Equivocation / split-view defense (stated property)

Git is a Merkle DAG; the public registry repo mirrors every authority record under signed commits. A verifier that fetches a record from `amtechai.com` **and** confirms the matching record + signed commit on GitHub performs a lightweight cross-witness check — the CT/CONIKS gossip idea with GitHub as the second view. This is the v2 equivocation story; full STH gossip is deferred with Option B.

## Verification methods, policy & independent monitors

The active **verification-method registry** (`09`) and the review/test **policy** travel under `attestations.policyVersion`. A change to either is a policy event and MAY be recorded as an authority event (alongside `key-rotate`/`skill-revoke`) so a consumer can detect when the rules under which a tier was granted have moved — a tier is only meaningful relative to the policy/method set in force when it was issued. Beyond the GitHub commit witness, **independent replay-monitors** (`01`) are a second, permissionless class of witness: anyone who re-runs the deterministic `graph-replay` check (`04`/`09`) plus the authority-chain checks above confirms the same state without an AMTECH service, strengthening the equivocation defense.

## Designed-in upgrade path to Option B (full Merkle log)

Because each record is content-addressed (canonical-JSON SHA-256) and sequence-ordered, a later build step can fold the exact record hashes into a Merkle tree and publish signed tree heads + inclusion/consistency proofs **without changing any record**. Promote when (a) a second independent monitor exists and (b) scale makes O(log n) proofs worthwhile.

## Related
- `02-certificate-attestation-schema.md` (what each cert binds), `04-link-first-verifier.md` (chain checks), `07-phase-gates-and-acceptance.md` (gates), `08-build-plan.md` (M4).
