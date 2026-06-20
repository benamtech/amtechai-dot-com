# Skill Certificate-Authority Standard — Prior Art

Date: 2026-06-19

Question: what proven supply-chain and transparency standards should an AMTECH skill **certificate-authority standard** borrow from, and how does each map to the four work items in `docs/memory/handoff-2026-06-19--skill-verification-next-steps.md`?

Decision posture (locked this session): **borrow the concepts, keep the formats AMTECH-native and statically hostable** on Netlify/GitHub. Document the mapping to each external standard for credibility; do not take on heavy tooling (no Rekor server, no Fulcio CA, no live OIDC). This note is the credibility spine — every spec file in `docs/skills/standard/` should cite back here.

## Mapping table

| External standard | What AMTECH borrows | AMTECH work item |
| --- | --- | --- |
| Certificate Transparency, RFC 6962 + CONIKS key transparency | append-only Merkle log, signed tree heads, inclusion/consistency proofs, gossip/equivocation (split-view) defense | 4 — immutable authority history |
| The Update Framework (TUF) | key roles, thresholds, rotation/revocation, snapshot/timestamp freshness (anti-rollback / fast-forward) | 1 & 4 — keys + authority |
| in-toto attestations / DSSE / SLSA provenance | signed attestation envelope, subject+predicate model, build/test/review evidence | 1 — certificate attestations |
| Sigstore (Fulcio / Rekor / cosign) | CA + transparency-log + verifier reference architecture; notarization with timestamp | 2 & 4 — verifier + log |
| RFC 8785 (JSON Canonicalization Scheme) | formalize the deterministic canonical JSON we already hand-roll | all signing |
| "Human-Certified Module Repositories for the AI Age" (arXiv 2603.02512); AEX (arXiv 2603.14283) | human-review gates + crypto attestation + graduated trust tiers + revocation, framed for AI-consumed modules | 1 — review evidence + trust tiers |

## Per-standard summaries

### Certificate Transparency (RFC 6962) + CONIKS
A CT log is a single, ever-growing, **append-only Merkle tree**. On submission the log returns a Signed Certificate Timestamp (SCT). Two proof types matter: **inclusion proofs** (this record is in the tree) and **consistency proofs** (version N+k is a superset of version N — the log never rewrote history). The append-only property is not trust-me; it is checkable. The residual attack is **split-view / equivocation**: a malicious log shows one tree to the victim and another to everyone else, each internally consistent. The defense is **gossip**: independent parties compare their latest signed tree heads. CONIKS extends this to name→key bindings with efficient **non-inclusion proofs** (prefix trees) so a user can verify "my name maps only to keys I authorized." EthIKS shows you can anchor a CONIKS root in a public ledger to make equivocation detectable without a separate gossip network.

Takeaway for AMTECH: any "immutable history" we publish must support *checkable* append-only semantics (sequence + prev-hash at minimum; Merkle proofs at most) and must have an equivocation story (independent observers can compare what they saw). See trade-off note `2026-06-19-immutable-authority-history-options.md`.

### The Update Framework (TUF)
TUF separates trust into **roles**, each with its own metadata file and a **threshold** of keys: `root` (delegates trust, lists keys+thresholds for all roles), `targets` (signs the actual artifacts), `snapshot` (lists versions of all metadata — a consistent view), `timestamp` (frequently re-signed, online key, proves freshness). Compromise recovery = `root` re-signs to replace the compromised key. `timestamp`/`snapshot` defend against **rollback** and **fast-forward** attacks (serving an old-but-valid or far-future version). Online vs offline key separation is the core hygiene idea: the high-value `root` key stays offline; only low-value freshness keys are online.

Takeaway for AMTECH: even without full TUF metadata, adopt (a) an explicit **key lifecycle** (`active`/`retired`/`revoked` — already present in `amtech-signing-key/v1`), (b) a **freshness signal** so a stale authority file is detectable, and (c) **offline release key** discipline (already true: `.amtech/signing-private-key.pem`, git-ignored). Thresholds/multi-key are a documented future option, not v2.

### in-toto / DSSE / SLSA
in-toto's attestation framework is an envelope: a **DSSE** ("Dead Simple Signing Envelope") wraps a **Statement** (which names the `subject` artifacts by digest) containing a **predicate** (a domain-specific JSON claim). SLSA provenance is one such predicate type — it records builder identity, build instructions/params, and dependency digests, and defines build **levels** (L1 = provenance exists; L2/L3 add constraints on how provenance is generated, e.g. signing material isolated from build steps). DSSE's key idea is **PAE (pre-authentication encoding)**: sign over an unambiguous serialization of `(payloadType, payload)` so the signature can't be confused across contexts.

Takeaway for AMTECH: the v2 certificate's new `attestations` block is conceptually an in-toto predicate — `subject` = the skill archive (already bound by digest in v1), `predicate` = our test + review evidence. We keep our own envelope (the existing `amtech-signed-artifact` certificate signed over canonical JSON) but borrow the **subject+predicate discipline** and the **bind-everything-by-digest** rule. See `2026-06-19-skill-attestation-evidence-model.md`.

### Sigstore (Fulcio / Rekor / cosign)
Reference architecture for "CA + transparency log + verifier." **Fulcio** = a CA that issues short-lived certificates binding an ephemeral key to an OIDC identity (keyless). **Rekor** = an immutable transparency log of signing events with timestamps. **cosign** = the client that signs and submits to Rekor and verifies. The "keyless" property comes from short-lived keys + the log providing the durable audit record.

Takeaway for AMTECH: we deliberately do **not** go keyless (no OIDC/Fulcio); we keep a stable offline Ed25519 release key, which is simpler and statically verifiable. What we borrow is the **shape**: a CA (us), a published verifier (work item 2), and a durable append-only record (work item 4). Sigstore is the thing we cite to explain why a transparency log belongs next to a CA.

### RFC 8785 (JCS)
Cryptographic signing needs an **invariant byte representation**. JCS defines canonical JSON: I-JSON subset, object keys sorted by UTF-16 code unit, whitespace stripped, numbers normalized via ECMAScript rules. `scripts/signing/amtech-signing.ts:canonicalJson` already implements a compatible subset (sorted keys, no whitespace, `JSON.stringify` for scalars, drops `undefined`). The gap vs strict JCS is **number normalization** — we sidestep it by keeping all signed values as strings/objects (no floats in certificates), which is the safe move.

Takeaway for AMTECH: cite RFC 8785 as the basis for `ed25519-canonical-json-v1`, document the I-JSON constraint ("no non-string numbers in signed payloads"), and keep the hand-rolled canonicalizer (it's correct for our value shapes and dependency-free).

### "Human-Certified Module Repositories for the AI Age" (arXiv 2603.02512) + AEX (2603.14283)
The most on-point academic source: it argues that as AI agents orchestrate module/skill ecosystems, **malicious modules are a first-class risk**, and proposes **human review gates + cryptographic attestation + graduated trust tiers + fast revocation + transparent genealogy + federated discovery with shared trust anchors**. It explicitly says human certification is needed because some judgment calls automated scanners cannot make. AEX adds multi-hop attestation/provenance for LLM API call chains.

Takeaway for AMTECH: this validates the whole direction and supplies the **trust-tier vocabulary** for the attestation model — a skill should declare *how* it was certified (e.g. `automated-tested`, `human-reviewed`), not just *that* it is signed. The certificate's review-evidence fields (`reviewer identity/type`, `policy version`) come straight from this.

## What AMTECH explicitly is NOT adopting (scope guardrails)
- No keyless/OIDC signing (Fulcio) — stable offline Ed25519 key instead.
- No running log server (Rekor) — static, git-anchored records (mechanism chosen in the trade-off note).
- No multi-key thresholds in v2 — documented as a future option.
- No claim of legal authorship — the signature authenticates the certificate + content digest only (carried over from `docs/SKILL_SIGNING.md`).

## Sources
- [RFC 6962: Certificate Transparency](https://www.rfc-editor.org/rfc/rfc6962.html)
- [Transparent Logs for Skeptical Clients (research!rsc)](https://research.swtch.com/tlog)
- [TUF specification](https://theupdateframework.github.io/specification/latest/)
- [TUF FAQ](https://theupdateframework.io/docs/faq/)
- [in-toto and SLSA](https://slsa.dev/blog/2023/05/in-toto-and-slsa)
- [What Is in-toto? (Sbomify)](https://sbomify.com/2024/08/14/what-is-in-toto/)
- [SLSA provenance / software attestation (Legit Security)](https://www.legitsecurity.com/blog/slsa-provenance-blog-series-part-1-what-is-software-attestation)
- [Sigstore cosign signing overview](https://docs.sigstore.dev/cosign/signing/overview/)
- [Sigstore keyless signing (cosign DeepWiki)](https://deepwiki.com/sigstore/cosign/4.1-keyless-signing)
- [RFC 8785: JSON Canonicalization Scheme](https://www.rfc-editor.org/info/rfc8785/)
- [CONIKS: Bringing Key Transparency to End Users](https://jbonneau.com/doc/MBBFF15-coniks.pdf)
- [EthIKS: Using Ethereum to audit a CONIKS log](https://jbonneau.com/doc/B16b-BITCOIN-ethiks.pdf)
- Human-Certified Module Repositories for the AI Age — arXiv 2603.02512
- AEX: Non-Intrusive Multi-Hop Attestation and Provenance for LLM APIs — arXiv 2603.14283

## Related notes
- `wiki/research/2026-06-19-skill-attestation-evidence-model.md`
- `wiki/research/2026-06-19-immutable-authority-history-options.md`
- `wiki/research/2026-06-19-link-first-skill-verification.md`
- `docs/skills/standard/README.md`
