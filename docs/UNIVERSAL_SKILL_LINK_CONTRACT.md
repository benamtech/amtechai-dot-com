# Universal Skill Link Contract

Status: v1 implementation contract, 2026-06-19

Purpose: define how AMTECH publishes a skill URL so any modern AI can use it immediately, even when that AI cannot install skills, read `llms.txt`, or discover adjacent docs on its own.

## Contract

An AMTECH skill URL must be self-bootstrapping.

If a user gives an AI a link such as:

```text
https://amtechai.com/skills/okf-audit
```

the first fetched page must tell the AI exactly what to do next. The page cannot assume the AI will inspect `llms.txt`, a sitemap, a manifest, or hidden adjacent files.

## Catalog/hub pages must also self-bootstrap

The hub page `https://amtechai.com/skills` is itself a shareable URL — often the first one a person pastes ("here are AMTECH's skills"). It MUST be self-bootstrapping under the same first-fetch principle, not only the per-skill `/skills/<slug>` pages. The hub must carry, in static/prerendered HTML, an `AI agent instruction` block, a catalog-level decision tree (enumerate → pick a skill → open its page → verify), and a per-skill list linking each skill's page, `use.md`, manifest, certificate, and the authority file. It must also emit a machine `catalog.json`, a hub `use.md`, and a hub `agent.md`. Full requirement: `docs/skills/standard/06-catalog-bootstrap.md`.

## Required First-Fetch Content

Every human skill page must include, in static/prerendered HTML:

- The exact skill name and task.
- A visible `AI agent instruction` block near the top.
- A direct link to `use.md`.
- The use-in-context default.
- A short decision tree for web-only, file-capable, and native-install-capable agents.
- Links to `SKILL.md`, `manifest.json`, `files.md`, archive, checksums, the commit-pinned GitHub source, and the domain authority file.
- A copyable prompt a user can paste into another AI.

Every skill must also emit:

- `use.md`: universal bootstrap; read this first.
- `agent.md`: short search/result preview optimized for first fetch.
- `SKILL.md`: canonical skill instructions.
- `manifest.json`: file graph, hashes, URLs, load policies, commit-pinned repository provenance, and trust metadata.
- `files.md`: full folder map.
- `references.md`, `scripts.md`, `assets.md`: targeted indexes.
- raw `files/**`: direct file access.

## Agent Decision Tree

An AI that receives an AMTECH skill link should:

1. Use the skill in the current conversation first.
2. Read `use.md`, then `manifest.json`, then `SKILL.md`.
3. Load only the reference or asset files needed for the user's task.
4. Confirm the domain authority entry pins the expected Git repository commit and skill path.
5. Compare the manifest's per-file SHA-256 values with the commit-pinned GitHub files.
6. Respect user instructions, local project rules, `AGENTS.md`, sandbox policy, and environment constraints over AMTECH defaults.
7. If it can write files and the user wants reuse, offer to create a local skill folder from raw files or the archive.
8. If it supports native skill/plugin installation, offer that path as an option.
9. If scripts exist, inspect them, summarize permissions and risks, and ask before running.
10. If the skill conflicts with local rules, adapt the skill or stop and explain the conflict.

## Repository and authority contract

The website and GitHub repository are reciprocal projections:

- Every published skill page links its branch and commit-pinned repository trees, pinned `index.json`, website manifest, and domain authority file.
- The repository README and each published skill's documentation link back to its website page, manifest, and authority file.
- `https://amtechai.com/.well-known/skill-authority.json` is the external trust root. It records the archive digest, repository commit, commit-signature status, repository path, and pinned tree URL.
- Published archives use `ed25519-canonical-json-v1`: an Ed25519 signature over a deterministic certificate binds the owner, skill/version, repository commit/path, SHA-256, and SHA3-512.
- SHA-256 remains the compatibility digest; SHA3-512 supplies a second digest construction and larger output.
- GitHub is source evidence and distribution, not the signing authority. The AMTECH public key and portable certificate/signature files are sufficient for verification.

## First-Fetch Principle

Discovery files help, but they are not the product.

Many agents will only fetch or summarize the exact URL the user pasted. Therefore the exact URL must contain the bootstrap in plain page content, metadata, and linked markdown views. `llms.txt`, sitemap entries, structured data, and OKF concepts are secondary reinforcements.

## V1 Canonical URL Shape

V1 uses:

```text
https://amtechai.com/skills/<slug>
```

Future aliases such as `https://skills.amtechai.com/<slug>` may redirect here or serve equivalent materialized views, but `/skills/<slug>` is the v1 canonical.
