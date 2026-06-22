# Multi-Authority Trust & Issuance Decentralization

Date: 2026-06-21. Surfaced while planning/writing the article `docs/article-drafts/verifiable-skills-standard.md`
("Skills That Any AI Can Find, Use, and Verify"). **Extends** — does not repeat — the frontier list in
`2026-06-20-system-reality-check-and-experimentation-frontier.md` (avenues A–G). This note isolates ONE axis that
list under-develops: **who is allowed to certify**, and how trust can shift from *known identity* to *checkable
proof*. Normative specs: `docs/skills/standard/03` (authority/keys), `04` (verifier), `09` (ladder + horizon).

## The distinction we'd been blurring

We already decentralized **verification**: `replay-verified` / `graph-replay` means *anyone* can recompute the
verdict from published surfaces — trust is not asked for, it is re-derived. What remains centralized is
**issuance**: today exactly one authority (AMTECH) signs the certificate, and a consumer who accepts the verdict
is still trusting AMTECH's *identity* (its published key) as the root.

> Two independent axes: **verification plurality** (who can check — already "anyone") vs **issuance plurality**
> (who can certify — today "one"). The article's thesis upgrade lives entirely on the second axis.

## The spectrum of issuance (one → many → any)

1. **One authority (today).** AMTECH signs; root of trust = AMTECH's key document. Simple, works statically, but
   trust = reputation of a named party.
2. **Many named authorities (federation).** N independent, *known* CAs each issue an attestation over the **same
   `sourcePackage` digest**. Because the cert subject is bind-by-digest (in-toto/DSSE shape), a certificate can
   carry an `attestations[]` array from multiple signers; the verdict becomes a **policy/quorum over independent
   attestations** ("≥2 of {AMTECH, X, Y} reviewed these exact bytes"). This is cross-notarization — no new crypto,
   it's the multi-signature envelope DSSE already supports. The catalog root is a Merkle commitment multiple
   parties could co-witness (cf. avenue E, the gossip/equivocation monitor — that's the *witness* half of this).
3. **Any unknown-but-proven party (trustless / Nockchain-esque).** Trust stops resting on *who signed* and rests
   on **a proof that the prescribed check actually ran**. If certifying produces a succinct proof (a ZK proof of
   the conformance/verification computation), then a consumer verifies the **proof**, not the **prover** — so an
   arbitrary, previously-unknown party can certify and still be trusted, exactly as a blockchain trusts an unknown
   miner because the proof-of-work/proof checks out. This is the rung where the trust model itself changes, not
   just the tier.

`signed → structure-verified → amtech-reviewed → replay-verified` are all rungs *under a single issuer*.
`behavior-verified` (reserved) and `proof-verified` (horizon) are usually framed as "stronger evidence" — the
sharper framing is that **`proof-verified` is also the rung that removes the trusted issuer.**

## Why our existing shape already leans this way (cheap groundwork, not a rebuild)

- **Bind-by-digest, not by signer.** The cert subject is the `sourcePackage`/content digest; nothing about the
  verification recipe references *which* key issued it until the final Ed25519 step. Swapping/adding issuers is a
  key-document + policy change, not a schema change.
- **Issuer-agnostic method registry (`09`).** The verifier owns `method → max-tier`; it reads the attestation
  *envelope*, not the issuer. A federated or proof-bearing attestation is a new envelope entry, not a new cert
  shape. (`live-model`/`zk-compute` are already pre-declared for forward-compat.)
- **Multi-key serving already exists.** `/.well-known/keys/<keyId>.json` + retired-key verification generalizes
  one-org/many-keys → the same surface generalizes to many-orgs/many-keys with a policy layer above it.
- **Catalog root + hash-chained authority history** are Merkle-style commitments — the natural attachment point
  for independent co-witnesses (avenue E) and, later, for a proof that "this root was computed correctly."

## Concrete frontier experiments (ranked, new vs the 2026-06-20 list)

- **MA-1 — Multi-attestation envelope (cheapest, highest concept-per-effort).** Extend the cert to carry
  `attestations[]` from >1 signer over one `sourcePackage`, and a verifier **policy** that computes a verdict from
  the set (e.g. quorum). Demo it with two locally-held keys standing in for two authorities. Proves issuance
  plurality with zero new crypto. Directly backs the article's "one, many, or any" line.
- **MA-2 — Second real witness/issuer.** Pair with avenue E: a separate static site / GitHub Action that
  *independently re-derives and co-signs* the catalog root, then have the verifier surface "2 independent parties."
  Turns the equivocation-resistance claim into an observable fact.
- **MA-3 — Proof-of-verification PoC (horizon probe).** Identify the *smallest* deterministic step in `graph-replay`
  (e.g. the catalog-root recompute, or manifest-SRI check) and explore emitting a succinct proof of *that one step*
  via an off-the-shelf proving stack (zkVerify-style verifiable-compute layer, or a Nockchain NockApp). Goal is
  not to prove model behavior — it's to demonstrate **issuer-independent trust** on a real, tiny, deterministic
  computation. This is the literal seed of `proof-verified` and the "any unknown party" scenario.
- **MA-4 — Behavioral trust without an issuer.** Cross with frontier avenue B (consumer re-derivation): if a
  consumer's own run against a published challenge can later be wrapped in a proof, behavioral assurance also
  becomes issuer-independent — the `behavior-verified`→`proof-verified` bridge.

## External anchors (for the article + future work)
- **Nockchain** — ZK-PoW: mining produces succinct proofs of state transitions; off-chain NockApps settle via
  constant-cost on-chain verification. The canonical "trust the proof, not the prover" substrate.
  (https://www.nockchain.org/nockchain.pdf, https://docs.nockchain.org/architecture/what-is-nockchain/zero-knowledge-proofs)
- **zkVerify** — framing verifiable compute as a "service layer" for the agent economy; verification cost decoupled
  from computation size. (https://zkverify.io/blog/powering-verifiable-ai-compute-across-the-agent-economy)
- **VET (Verifiable Execution Traces, arXiv 2512.15892)** — verifiable traces for agent tool-calls; a non-ZK
  parallel route to behavioral verifiability.
- Prior art already in our lineage that this axis leans on: **CT/CONIKS** (gossip, equivocation, multiple
  observers), **in-toto/DSSE** (multi-signature subject+predicate envelope).

## Methodology avenue (meta, surfaced by this same task)
The **cold-agent navigation audit** — handing a context-isolated third-party agent only the public catalog URL and
recording whether it can discover/use/verify a skill *without* being told the surfaces exist — is itself a reusable
**discoverability & agentic-SEO test harness**. Worth formalizing as a recurring check (a "does our materialization
actually self-explain to a naive agent?" regression). First run logged alongside this article's drafting; see the
third-party-test writeup folded into the article work.

## Related
`docs/skills/standard/03`,`04`,`09`; `2026-06-20-system-reality-check-and-experimentation-frontier.md` (avenues
E/B/G especially); `2026-06-19-immutable-authority-history-options.md`; `docs/article-drafts/verifiable-skills-standard.md`.
