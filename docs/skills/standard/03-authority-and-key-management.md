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
cross-witnesses it; `commitSignature` is the `git-history` witness. **Option B (RFC 6962 Merkle transparency
log) is now IMPLEMENTED** — see "Transparency log — Option B" below. Still deferred: independent witness
co-signatures + external anchoring (scaffolded but not yet active).

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

## Transparency log — Option B (RFC 6962 Merkle log) — IMPLEMENTED 2026-06-21

The designed-in upgrade landed: a single RFC 6962 / RFC 9162 Merkle log folds the **existing** record bytes into a tree **without changing any record**. There is intentionally **one** tree over the authority record stream — no second catalog tree — because every record already materializes the full catalog `state`, so a record *is* a catalog snapshot. An agent verifies a skill by checking inclusion of the head record in the latest signed tree head, then that the skill's `{slug, certificateSha256}` (status ≠ revoked) appears in that record's `state`.

Code: `src/lib/skills/merkle.ts` (pure RFC-6962 primitives, validated against an independent oracle + RFC-9162 verifiers in `scripts/skills/__fixtures__/merkle.test.ts`); emitted by `scripts/signing/sign-authority.ts`; published by `scripts/skills/build-skills.ts`; gated by `scripts/skills/validate-skills.ts` (`validateTransparencyLog`); consumed by `src/lib/skills/verification/verifySkill.ts`.

### Hashing (domain-separated, RFC 6962 §2.1)
- Leaf of record *i*: `SHA-256(0x00 || canonicalJson(record_i))`. (Distinct from `log.json.recordHash = SHA-256(canonicalJson(record))` — no prefix — which still serves the Option-A chain checks. Both derive from the same unchanged bytes.)
- Interior node: `SHA-256(0x01 || left || right)`. Empty tree: `SHA-256("")`.
- Tree order = `sequence` order (gap-free, monotonic — already enforced).

### Signed tree head (`amtech-authority-sth/v1`, served at `/.well-known/authority/sth.json`)
```jsonc
{
  "schemaVersion": "amtech-authority-sth/v1",
  "authorityUrl": "https://amtechai.com/.well-known/skill-authority.json",
  "treeSize": "6",                  // string (no JSON numbers in the signed payload — RFC 8785/I-JSON safety)
  "rootHash": "<RFC-6962 Merkle root>",
  "latestSequence": "5",
  "latestRecordHash": "<sha256(canonicalJson(head record))>",   // ties the log to the Option-A latest pointer
  "timestamp": "<head record issuedAt — deterministic, reproducible builds>",
  "signingKeyId": "ed25519:...",
  "signingKeyUrl": "https://amtechai.com/.well-known/amtech-signing-key.json",
  "signatures": [ { "role": "authority", "signingKeyId": "...", "signingKeyUrl": "...", "signature": "<Ed25519>" } ],
  "anchors": []
}
```
The **signed payload is the STH minus `signatures` and `anchors`**, so independent witnesses (`role: "witness"`) and external anchors can be appended later **without re-signing** the authority's commitment to the root.

### Published surfaces (all static, precomputed at build)
- `/.well-known/authority/sth.json` — the latest STH (above). The latest pointer (`skill-authority.json`) gains `merkle:{treeSize, rootHash, sthUrl, algorithm:"rfc6962-sha256"}`; `catalog.json` gains `authoritySth`.
- `/.well-known/authority/sth/<treeSize>.json` — immutable per-size STH archive (stable consistency anchors).
- `/.well-known/authority/proofs/<treeSize>/inclusion/<index>.json` — `{treeSize, index, leafHash, auditPath[]}` for every record.
- `/.well-known/authority/proofs/<treeSize>/consistency-from-<firstSize>.json` — `{firstSize, secondSize, proof[]}` from every prior archived size to the current one.

### Verifier obligations (`04`, consumed by `verifySkill.ts`)
- Recompute the RFC-6962 root over the published records → `MERKLE_ROOT_MISMATCH`; `treeSize` = record count; `latestRecordHash` = head digest.
- Evaluate the STH **trust policy** `{ minAuthoritySigs:1, minWitnessSigs:0, requireAnchor:false }` over the role-tagged `signatures[]` → `STH_SIGNATURE_INVALID`. (Raising the witness/anchor minimums is how "independently witnessed / externally anchored" becomes a default flip, not a format change.)
- Verify the head record's inclusion proof against `rootHash` → `INCLUSION_PROOF_INVALID`.
- If the caller **pins** an earlier STH, verify the consistency proof pin→current and **fail closed** on rollback/equivocation → `CONSISTENCY_PROOF_INVALID` (the append-only guarantee for stateful agents, e.g. Hermes).
- Additive: if no STH is served, the Option-A chain walk above already established the verdict.

### Trust trajectory (honest framing)
This is **trust-minimized**, not trustless. With the default policy (no witnesses, no anchors) the root of trust is still domain control + the self-served Ed25519 key + the same-owner GitHub mirror. The scaffolding for the next step — **independent witness co-signatures** (`role:"witness"`), **external anchoring** (`anchors[]`: OpenTimestamps→Bitcoin / Sigstore-Rekor / signed git tag), and **client-enforced consistency** (STH pinning) — is wired but deferred. Do **not** claim "trustless," "witnessed," or "quorum-verified" until those defaults are actually flipped against a real second witness/anchor.

### Independent witness / monitor recipe (permissionless)
Anyone can witness this log without an AMTECH service: (1) fetch `log.json` + every record; (2) recompute each leaf `SHA-256(0x00 || canonicalJson(record))` and the RFC-6962 root; (3) compare to `sth.json.rootHash` and verify its signature under the published key; (4) fetch a prior `sth/<m>.json` and verify the `consistency-from-<m>` proof to confirm append-only; (5) optionally co-sign the STH root and publish your signature as a `witness` entry. A monitor that does this on a schedule and gossips disagreement is the equivocation defense that makes raising `minWitnessSigs` meaningful.

## Related
- `02-certificate-attestation-schema.md` (what each cert binds), `04-link-first-verifier.md` (chain checks), `07-phase-gates-and-acceptance.md` (gates), `08-build-plan.md` (M4).
