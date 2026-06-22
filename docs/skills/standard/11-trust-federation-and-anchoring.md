# 11 — Trust Federation, Broadcast & External Anchoring

Part of the AMTECH Skill Certificate-Authority Standard. Builds directly on `03` (authority + the RFC-6962 transparency log) and reuses `02` (the AMTECH Signed Artifact certificate). This is the path **from trust-minimized toward trustless** — and, critically, it is wired but mostly **inert until broadcasting goes live**: the mechanism exists end-to-end; only the external broadcast/anchor step is deferred.

## The honest position

We never claim *trustless* in the absolute sense — every system roots in *something*. We claim a concrete, improving ladder:

| Rung | What backs it | Status |
| --- | --- | --- |
| **verifiable** | recompute the signed cert + the RFC-6962 root yourself | LIVE |
| **trust-minimized** | append-only consistency proofs + client STH pinning | LIVE |
| **federated** | independent witnesses co-sign the same root (own keys, own domains) | **wired**, no external witness yet |
| **externally anchored** | the root is committed to a public system (Bitcoin, Nockchain, …) nobody controls | **wired (the "breaker")**, broadcasting deferred |

Do **not** advertise "federated/witnessed/anchored/trustless" until a real second witness or a real external anchor exists. The wiring below is what makes flipping to those claims a configuration change, not a rewrite.

## A. Everything is an AMTECH Signed Artifact (reuse, don't reinvent)

The new surfaces are built ON the existing standards — the same `amtech-signed-artifact/v2` certificate, canonical JSON (RFC 8785), the served Ed25519 key, `signCertificate`/`verifyCertificate`, and the same reason codes. No new signature format is introduced. This keeps one verifier, one key, one trust model across skills, the authority log, and the broadcast anchor.

## B. The broadcast message (`/.well-known/authority/anchor/`)

amtechai.com publishes the canonical, timestamped, signed message a witness / external anchor consumes — **useful to agentic search and to us**, and built ON the existing AMTECH certificate standard:

1. **The registry-state packet** (`amtech-registry-state/v1`, `anchor/state.json`) — a self-describing snapshot: the certified skills (slug / version / trust tier / certificate URL), the catalog root, the signed RFC-6962 **tree head** (`treeSize`, `rootHash`, `latestRecordHash`, `sthUrl`), and the verify recipe. One artifact answers *"what does AMTECH certify and how do I check it."*
2. **An AMTECH Signed Artifact certificate** (`amtech-signed-artifact/v2`, `subjectType: 'registry-state'`, `subjectId: amtech-skills-tree-<treeSize>-<rootPrefix>`, `version: <treeSize>`) that **binds the packet bytes** (SHA-256/SHA3-512), `canonicalUrl` = the packet URL, `issuedAt` = the STH timestamp, Ed25519-signed by the domain key. `scripts/signing/sign-anchor.ts`; idempotent.

The subject is meaningful (`amtech:registry-state:amtech-skills-tree-6-ed0e2db175dc:…` — not an opaque `authority-sth`), and the bound subject is the useful packet, not a bare hash.

- **Verifiable with the existing tooling, unchanged:** `npm run artifact:verify -- --artifact anchor/state.json --certificate anchor/certificate.json --signature anchor/certificate.sig --key amtech-signing-key.json` → `valid: true`. `validate-skills.ts` gates it (cert verifies + binds `state.json` + the packet's tree head == the published STH root).
- **Optional PGP co-signature** (`certificate.asc`): wired in `sign-anchor.ts` — emitted only if `gpg` + `AMTECH_ANCHOR_PGP_KEY` are present. A second, different-keyspace signature for parties who anchor trust in PGP/WoT; **no cryptographic/anti-equivocation value when signed by the same operator** — only useful to bridge an existing PGP reputation. Deferred.

### Broadcasting + the receipts ledger (`receipts.json`)
Broadcasting is the deliberate act of recording that a registry-state message went out, and where it was externally anchored. `scripts/signing/broadcast-anchor.ts` (`npm run skills:broadcast`) appends one signed entry to an **append-only receipts ledger** `/.well-known/authority/receipts.json` (`amtech-anchor-receipts/v1`): `{ certificateId, treeSize, rootHash, stateSha256, certSha256, anchorUrl, broadcastAt, receipts: [] }`. **This is NOT a second hash-chain** — ordering comes from the tree size; the authority log is the only chain. The `receipts[]` slot is where a Bitcoin / OpenTimestamps / Nockchain / third-party-witness receipt lands once off-site broadcasting is live, at which point `ANCHOR_VERIFIERS` checks it. Idempotent (same root → no-op). Ledger Ed25519-signed by the domain key; optional PGP.

This is the object an external witness or chain consumes: one signed, timestamped, self-describing attestation of the latest verified registry state, plus a ledger of where it has been anchored.

## C. Federation — independent witnesses

The STH carries a **role-tagged signature set** (`03`): `signatures: [{ role: 'authority' | 'witness', signingKeyId, signingKeyUrl, signature }]`, each signing the same signed core (STH minus `signatures` + `anchors`). The verifier:

- resolves a **witness key by its own `signingKeyUrl`** (`ResourceLoader.keyByUrl`) — so a witness key may live on *another domain* under another party's control;
- counts valid, non-revoked witness signatures against the trust policy `{ minWitnessSigs }`;
- fails closed if the policy isn't met.

**The mechanism is the point:** an independent party runs their own signer, fetches the published STH (or the anchor cert), **re-derives the Merkle root themselves** from the records, and only then co-signs — a real witness, not a rubber stamp. Bootstrapped as operator-held and **transferable**: hand the witness key (and its serving domain / its own git repo) to a third party and it becomes independent without any format change. Raising `minWitnessSigs` then makes it enforced.

## D. External anchoring — the pluggable "breaker"

`ANCHOR_VERIFIERS` (`verifySkill.ts`) is an empty, pluggable registry of `type → (anchor, rootHash) => boolean`. The STH/anchor `anchors: [{ type, ref, target, anchoredAt }]` array (`target` MUST equal the root) carries external receipts. Today the registry is empty, so `verifyAnchor` returns false and `requireAnchor: true` fails closed (you cannot require an uncheckable claim).

When broadcasting goes live — committing the anchor cert / root to **Bitcoin, Nockchain, or any public system** — you (1) append a receipt to `anchors[]` and (2) register a `type` verifier in `ANCHOR_VERIFIERS`. Then witnesses anywhere verify the root against that public system, against our registry, or against any single skill/artifact. **Chain-agnostic by design** — nothing here is Bitcoin-specific.

## E. Multi-domain / multi-subject certificates

The same `subjectType` machinery already spans `skill | content | message | repo-update | status`. The anchor uses `status`; the same standard issues certificates for **pages, agentic sitemaps, documents, and other domains** — any artifact gets an AMTECH cert that verifies against the published key and (optionally) is included in the same transparency log and the same broadcast/anchor pipeline. One CA, many subject types, one verifier. A certificate for one document may link to other certificates; `/certificates/:id` already renders any of them.

## What is implemented now (2026-06-22)

- **Registry-state broadcast message:** `sign-anchor.ts` emits the `amtech-registry-state/v1` packet (`anchor/state.json`) + a `registry-state` AMTECH certificate binding it (`subjectType: 'registry-state'` added to the standard); in the `skills:sign` pipeline; published + gated by `validate-skills`; verifiable via `artifact:verify`. PGP co-sign wired-optional.
- **Broadcast + receipts ledger:** `broadcast-anchor.ts` / `npm run skills:broadcast` appends a signed entry to the append-only `receipts.json` (with the empty `receipts[]` slot for path A). First artifact broadcast (entry 0). Not a second hash-chain.
- **Witness federation:** role-tagged STH signatures + verifier `keyByUrl` resolution + `{ minWitnessSigs }` policy. Tested with an independent witness key.
- **External anchoring "breaker":** `ANCHOR_VERIFIERS` pluggable registry + `anchors[]`/`receipts[]` + fail-closed `requireAnchor`.

## What is deferred (explicit non-goals until pursued)

- Standing up a real **second witness** on an independent domain / third-party key.
- **Broadcasting** the anchor/root to an external public system + registering its verifier.
- A configured **PGP** key.

## Related
- `02` (certificate schema), `03` (authority + transparency log), `04` (verifier), `07` (gates). Research: `wiki/research/2026-06-21-multi-authority-trust-and-issuance-decentralization.md`.
