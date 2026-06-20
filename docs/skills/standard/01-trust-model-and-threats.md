# 01 — Trust Model and Threats

Part of the AMTECH Skill Certificate-Authority Standard. Research: `wiki/research/2026-06-19-skill-certificate-authority-prior-art.md`.

## Actors

- **Issuer / CA (AMTECH).** Holds the offline Ed25519 release key, signs certificates and authority records, operates the registry.
- **Skill author.** Today the issuer; the model allows a future distinct author identity carried in the certificate `owner`.
- **Reviewer.** Human (or automated suite) that produces the assurance evidence attested in the certificate (`02`).
- **Consumer / agent.** Receives a skill URL, runs the verifier, decides whether to use / install / run.
- **Independent witness.** The public GitHub registry repo (signed commits) — a second view of the authority chain used to detect equivocation (`03`).

## Trust roots

1. **The AMTECH signing key** published at `/.well-known/amtech-signing-key.json` (`amtech-signing-key/v1`), with a key lifecycle (`active`/`retired`/`revoked`) and SHA-256/SHA3-512 fingerprints. Everything cryptographic chains to this key.
2. **The domain** `amtechai.com` over HTTPS as the canonical publication point (`/.well-known/*`, `/skills/*`).
3. **The git registry** `github.com/benamtech/amtech-skills-registry` as commit-pinned source evidence and the independent witness.

A consumer who trusts the AMTECH key + the domain + the git pin can verify everything offline-after-fetch; nothing requires a live AMTECH service.

## Threat model (and where each is addressed)

| Threat | Description | Mitigation | Spec |
| --- | --- | --- | --- |
| Malicious / tampered skill | Bytes differ from what was reviewed | Dual-digest binding in signed cert; archive-byte verification | 02, 04 |
| Forged certificate | Attacker mints a cert | Ed25519 signature over canonical JSON; key id must match published key | 02, 04 |
| Unreviewed skill passed off as trusted | "Signed" ≠ "tested/reviewed" | Structured attestations + trust tiers; verifier reports only the proven tier | 02, 04 |
| Stale evidence | Old passing test reused for a new release | `tests.sourceCommit` must equal release commit; max-age freshness gate | 02 |
| Key compromise | Release key stolen | Key revocation event in authority history; `revoked` verdict; rotation | 03 |
| Rollback / fast-forward | Serving an old (or far-future) authority state | Sequence numbers + latest-pointer + freshness signal (TUF idea) | 03 |
| History rewrite | Issuer silently edits past records | Hash-chained append-only records; latest-pointer hash; git as Merkle anchor | 03 |
| Split-view / equivocation | Different history shown to different parties | Cross-witness against signed GitHub commits (CONIKS/CT idea, lightweight) | 03 |
| Undeclared capability | Skill does more than it claims (network, fs, scripts) | `permissions` block verified against archive contents at signing | 02 |
| Discovery dead-end | Agent lands somewhere with no path to verify | Self-bootstrapping page **and hub** + authority-chain discovery from any surface | 06, 04 |

## Non-goals (explicit)

- **No claim of legal authorship or absolute safety.** A signature authenticates the certificate and the exact content digest; it does not establish authorship or guarantee the skill is harmless. (Carried from `docs/SKILL_SIGNING.md`.)
- **No keyless/OIDC (Fulcio) signing** and **no hosted log server (Rekor)** — stable offline key + static git-anchored records instead.
- **No multi-key thresholds in v2** — single release key; thresholds are a documented future option (TUF-style).
- **The pre-rendered verification badge is a build-time assertion**, not a live check; live assurance requires running the verifier (`05`).

## Related
- `02-certificate-attestation-schema.md`, `03-authority-and-key-management.md`, `04-link-first-verifier.md`, `06-catalog-bootstrap.md`
