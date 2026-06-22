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

## B. The broadcast endpoint (`/.well-known/authority/anchor/`)

amtechai.com publishes the canonical, timestamped, signed object that **incorporates the signed tree head** and is ready to be broadcast/anchored — and it is itself **an AMTECH status certificate**:

- `scripts/signing/sign-anchor.ts` emits an `ArtifactCertificate` with `subjectType: 'status'`, `subjectId: 'authority-sth'`, `version: <treeSize>`, `digests` = SHA-256/SHA3-512 over the served `sth.json` bytes, `canonicalUrl` = the anchor URL, `issuedAt` = the STH timestamp (deterministic), signed by the domain Ed25519 key. Idempotent (re-signs nothing if it already binds the current STH).
- Published at `/.well-known/authority/anchor/certificate.json` (+ `.sig`), alongside the `sth.json` it binds.
- **Verifiable with the existing tooling, unchanged:** `npm run artifact:verify -- --artifact sth.json --certificate anchor/certificate.json --signature anchor/certificate.sig --key amtech-signing-key.json` → `valid: true`. `validate-skills.ts` gates it in the build.
- **Optional PGP co-signature** (`certificate.asc`): wired in `sign-anchor.ts` — emitted only if `gpg` + `AMTECH_ANCHOR_PGP_KEY` are present; absent otherwise. A second, different-keyspace signature for parties who anchor trust in PGP/WoT.

This is the object an external witness or chain consumes: one signed, timestamped, scheme-locked attestation of the latest log state.

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

- `sign-anchor.ts` (status cert over the STH) + `skills:sign` pipeline step + build publishing + `validate-skills` gate; verifiable via `artifact:verify`. PGP co-sign wired-optional.
- Witness federation: role-tagged STH signatures + verifier `keyByUrl` resolution + `{ minWitnessSigs }` policy. Tested with an independent witness key.
- `ANCHOR_VERIFIERS` pluggable registry + `anchors[]` + fail-closed `requireAnchor`.

## What is deferred (explicit non-goals until pursued)

- Standing up a real **second witness** on an independent domain / third-party key.
- **Broadcasting** the anchor/root to an external public system + registering its verifier.
- A configured **PGP** key.

## Related
- `02` (certificate schema), `03` (authority + transparency log), `04` (verifier), `07` (gates). Research: `wiki/research/2026-06-21-multi-authority-trust-and-issuance-decentralization.md`.
