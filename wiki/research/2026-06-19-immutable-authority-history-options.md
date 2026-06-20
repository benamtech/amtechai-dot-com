# Immutable Authority History — Options & Recommendation

Date: 2026-06-19

Question (work item 4): before AMTECH presents this as a standard, the authority must stop being a single mutable "latest" file. It needs append-only, signed history with sequence numbers, previous-record hashes, key rotation/revocation events, skill revocations, and stable historical URLs — with the current `skill-authority.json` becoming the *latest pointer*, not the only record. **What mechanism backs this?** (This was the "decide during spec research" decision.)

Current state: `public/.well-known/skill-authority.json` is one mutable file; `commitSignature: "unsigned"`; no sequence/prev-hash; rewriting history would be undetectable to a client that only ever sees "latest."

## Option A — Git-anchored, hash-chained signed snapshots
Each authority change emits a numbered, signed snapshot record:

```jsonc
{
  "schemaVersion": "amtech-authority-record/v1",
  "sequence": 7,
  "previousRecordHash": { "sha256": "..." },   // over canonical JSON of record 6
  "issuedAt": "2026-06-19T...",
  "events": [ { "type": "skill-publish|skill-revoke|key-rotate|key-revoke", ... } ],
  "state": { /* full materialized authority at this sequence */ },
  "signingKeyId": "ed25519:...",
  "signature": "..."                            // Ed25519 over the record minus this field
}
```

- Records committed to the registry git repo at stable URLs: `/.well-known/authority/records/0007.json`; an append-only `/.well-known/authority/log.json` lists `{sequence, hash, url}`.
- `skill-authority.json` becomes the **latest pointer**: it carries `latestSequence` + `latestRecordHash` and the current materialized state.
- **Git is itself a Merkle DAG** — every commit hash chains all prior content; signed commits (work item 4 also fixes `commitSignature`) give a second, independent append-only anchor. GitHub's commit history is the public, third-party-hosted observer.
- Verifier checks: latest pointer's hash matches the head record; each record's `previousRecordHash` chains backward; sequence is gap-free and monotonic; each record's signature verifies; a revoked skill/key in any record ≤ latest is honored.

**Pros:** statically hostable (just JSON files); zero new infrastructure; leans on git's existing Merkle/immutability + signed commits; stable historical URLs are trivial; equivocation is constrained because the public GitHub repo is an independent witness of the same chain.
**Cons:** not a true Merkle *tree* — no compact inclusion/consistency proofs; a client must walk records (or trust the latest pointer + spot-check) rather than verify an O(log n) proof; split-view resistance relies on "compare against GitHub" rather than gossip of signed tree heads.

## Option B — Full RFC-6962-style Merkle transparency log
A real append-only Merkle tree over authority records, with periodically published **signed tree heads (STH)**, and a proof-serving surface for **inclusion** and **consistency** proofs.

- Add a build step that computes the tree + STH; publish `/.well-known/authority/sth.json` and proof endpoints (or precomputed proof files).
- Verifier checks O(log n) inclusion (record R is in tree at STH) and consistency (STH_new extends STH_old) — the CT guarantee.

**Pros:** strongest tamper-evidence; compact proofs; textbook split-view defense via STH gossip; "we run a transparency log" is the strongest standards story.
**Cons:** materially more build + serving complexity on a static host; proofs need either dynamic endpoints (against the static-site grain) or precomputed proof files (large, awkward); STH gossip needs ≥1 independent observer to be meaningful, which we'd have to bootstrap; overkill for a 2-skill registry today.

## Recommendation: **A now, with a designed-in upgrade path to B**
Adopt **Option A (git-anchored hash-chained signed snapshots)** for v2. It delivers every property the handoff's acceptance boundary actually requires — append-only, sequence numbers, prev-record hashes, rotation/revocation events, skill revocations, stable historical URLs, latest-as-pointer — with no new infrastructure and a real independent witness (public signed git history). It is honest: we describe it as a *hash-chained signed log anchored in git*, not as a CT log we don't run.

Design the record schema so **B is a later add-on, not a rewrite**: because every record is content-addressed by its canonical-JSON SHA-256 and sequence-ordered, a future build step can fold those exact record hashes into a Merkle tree and start publishing STHs + proofs **without changing the records themselves**. Promote to B when there is (a) a second independent monitor and (b) enough skills/consumers that O(log n) proofs matter.

Rationale aligns with the locked posture (borrow concepts, stay AMTECH-native and statically hostable) and with TUF/CT pragmatics: start with checkable append-only + an independent witness; add full proofs when the threat model and ecosystem justify the operational cost.

## Equivocation / split-view note
Under Option A, the defense is "the same chain is mirrored in the public GitHub repo with signed commits." A verifier that fetches the authority record from `amtechai.com` and independently confirms the matching record + commit on GitHub is performing a lightweight cross-witness check — the same *idea* as CT gossip, with GitHub as the second view. Document this explicitly in `03-authority-and-key-management.md` so it's a stated property, not an accident.

## Sources / related
- RFC 6962 (Merkle log, STH, inclusion/consistency) — see prior-art note.
- CONIKS / EthIKS (equivocation, external anchoring) — see prior-art note.
- TUF (rotation/revocation, freshness) — see prior-art note.
- `wiki/research/2026-06-19-skill-certificate-authority-prior-art.md`
- `docs/skills/standard/03-authority-and-key-management.md` (normative)
- current authority file: `public/.well-known/skill-authority.json`
