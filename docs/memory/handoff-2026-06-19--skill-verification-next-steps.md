# Skill verification next steps

## Objective

Make every AMTECH skill verifiable and usable from either a specific `/skills/:slug` URL or the `/skills` catalog, without manual installation or copy/paste.

## Implementation sequence

1. **Certificate attestations:** extend `amtech-signed-artifact/v1` with structured, signed test and review evidence: suite/version, source commit, result, timestamp, reviewer identity/type, policy version, permissions, and evidence digests. Build/signing must fail when required evidence is absent or stale.
2. **Link-first verifier:** accept a skill page, bootstrap, catalog, certificate, or authority URL; discover the canonical authority chain; validate schema, Ed25519 signature, key status, certificate status, repository pin, tests, and attestations; return exactly `verified`, `revoked`, or `invalid` plus machine-readable evidence and reason codes. Link-only verification authenticates metadata and attestations without installing the skill; archive-byte verification additionally requires fetching the archive.
3. **Multi-surface exposure:** publish the same verification result in page HTML/JSON-LD, skill manifests, catalog JSON, agent bootstrap files, response headers, and a small CLI/library/API so agents can discover, verify, and use skills directly from links.
4. **Immutable authority history:** before presenting this as an AMTECH standard, add append-only, signed authority snapshots with sequence numbers, previous-record hashes, key rotation/revocation events, skill revocations, and stable historical URLs. The current authority file becomes the latest pointer, not the only record.

## Acceptance boundary

No surface may report `verified` unless it resolves to the same signed certificate and current immutable authority state. Revoked keys or skills must return `revoked`; malformed, mismatched, stale, or unverifiable evidence must return `invalid`.
