# 03 — Authority & Key Management

Part of the AMTECH Skill Certificate-Authority Standard. Research: `wiki/research/2026-06-19-immutable-authority-history-options.md` (mechanism decision) + prior-art note. Implements work item 4.

## Key lifecycle (TUF-style hygiene)

The signing key document (`amtech-signing-key/v1`, served at `/.well-known/amtech-signing-key.json`) carries a `status`: `active` → `retired` → `revoked`.

- **active** — current release key; certificates signed now use it.
- **retired** — superseded by rotation; still valid for verifying certificates issued during its validity window (historical verification uses active-at-issuance semantics).
- **revoked** — compromised; certificates relying on it return `revoked` regardless of issuance date.
- **Offline discipline:** the private key stays at `.amtech/signing-private-key.pem` (mode 0600, git-ignored). Online surfaces never hold it. `npm run skills:sign` is the only operation that touches it.
- **Rotation:** generate a new key, publish its key document as `active`, mark the prior `retired`, and emit a `key-rotate` event in the authority history (below). Future: multiple key documents addressable by `keyId` so retired keys remain fetchable for historical verification.

## Immutable authority history — Option A (git-anchored hash-chained signed snapshots)

Chosen mechanism (see trade-off note). Every authority change appends a numbered, signed record; the live authority file becomes the **latest pointer**.

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

## Designed-in upgrade path to Option B (full Merkle log)

Because each record is content-addressed (canonical-JSON SHA-256) and sequence-ordered, a later build step can fold the exact record hashes into a Merkle tree and publish signed tree heads + inclusion/consistency proofs **without changing any record**. Promote when (a) a second independent monitor exists and (b) scale makes O(log n) proofs worthwhile.

## Related
- `02-certificate-attestation-schema.md` (what each cert binds), `04-link-first-verifier.md` (chain checks), `07-phase-gates-and-acceptance.md` (gates), `08-build-plan.md` (M4).
