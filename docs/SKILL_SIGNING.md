# AMTECH Signed Artifact v1

AMTECH signs deterministic skill archives with Ed25519. SHA-256 remains available for compatibility; SHA3-512 provides a second digest construction. The signed certificate binds the owner, subject, version, canonical URL, repository commit/path, both archive digests, issuer, time, and signing-key ID.

## Files

- `src/lib/skills/certificates/amtech-signing-key.json`: committed public key metadata.
- `src/lib/skills/certificates/<slug>/certificate.json`: canonical certificate payload.
- `src/lib/skills/certificates/<slug>/certificate.sig`: base64url Ed25519 signature.
- `.amtech/signing-private-key.pem`: local release key, mode `0600`, ignored by Git.
- `scripts/signing/`: key generation, skill signing, generic artifact signing, and verification.

Generated public copies are served at `/.well-known/amtech-signing-key.json` and `/skills/<slug>/{certificate.json,certificate.sig}`.

## Release procedure

1. Keep the private key outside Git and back it up in a protected secret manager.
2. Update skill source, version, and repository commit pin.
3. Run `npm run skills:sign` with `AMTECH_SIGNING_PRIVATE_KEY_FILE` when the key is not at the local default.
4. Run `npm run skills:check` and `npm run build`.
5. Commit the public key metadata, certificates, signatures, generated manifests, authority file, and archives.

Normal builds verify current signatures and fail when a certificate is missing or stale. They do not need the private key.

## Other signed content

Use:

```bash
npm run artifact:sign -- --type content --id example --file path/to/content --output output/signature
npm run artifact:verify -- --artifact path/to/content --certificate output/signature/certificate.json --signature output/signature/certificate.sig --key src/lib/skills/certificates/amtech-signing-key.json
```

Supported subject types are `skill`, `content`, `message`, `repo-update`, and `status`. The signature authenticates the certificate and exact content digest; it does not independently establish legal authorship.
