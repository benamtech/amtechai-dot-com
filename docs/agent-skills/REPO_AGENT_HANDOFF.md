# Prompt for the AMTECH Skills Registry Agent

Use this prompt in an agent session that has write access to `https://github.com/benamtech/amtech-skills-registry`.

```text
Productionize the AMTECH skills registry as the Git-backed source counterpart to https://amtechai.com/skills.

Repository: https://github.com/benamtech/amtech-skills-registry
Website authority: https://amtechai.com/.well-known/skill-authority.json
Website skills hub: https://amtechai.com/skills

Read the repository's README.md and index.json before editing. Preserve all seven skill packages. Make small, reviewable changes and do not remove skill content.

Required outcomes:

1. Reciprocal discovery links
   - README.md must link every live website skill page and manifest next to its corresponding repository skill.
   - At present the live page pairs are:
     - skills/okf-audit -> https://amtechai.com/skills/okf-audit and https://amtechai.com/skills/okf-audit/manifest.json
     - skills/knowledge-graph-builder -> https://amtechai.com/skills/knowledge-graph-builder and https://amtechai.com/skills/knowledge-graph-builder/manifest.json
   - In each corresponding SKILL.md, add a concise final "Source and verification" section linking its live page, website manifest, domain authority file, repository tree on main, and repository index.json.
   - For skills without a live website detail page, link the website skills hub and explicitly mark the package "repository-only". Do not invent a detail-page URL.

2. Machine-readable registry
   - Keep index.json as the canonical repository catalog.
   - Add top-level repository, site, authority, and verification metadata.
   - Use verification.method = "ed25519-canonical-json-v1", digestAlgorithms = ["SHA-256", "SHA3-512"], and signed = true for website-published packages.
   - Every skill record must include its repository-relative path. Published website skills must also include canonicalUrl and manifestUrl. Repo-only skills must explicitly use publishedOnWebsite: false.
   - Do not embed the commit that contains index.json inside index.json; that creates a self-reference problem. The website authority is responsible for pinning the exact Git commit externally.

3. Signed artifacts and authority cross-check
   - Add a deterministic validation script that walks every canonical skills/<slug>/ folder, computes SHA-256 and SHA3-512 for each file, and emits a stable registry/checksums.json. Exclude the generated checksum file itself.
   - Record path, size, SHA-256, and SHA3-512 for every skill file. Sort skill slugs and file paths before serialization.
   - Add a validation mode that exits nonzero when the generated checksums, index coverage, skill frontmatter names, or website-link declarations are stale.
   - Mirror the website public key metadata at registry/amtech-signing-key.json. Do not create or store a private key in this repository.
   - Mirror each website-published skill's certificate.json and certificate.sig beside its registry metadata only when they verify against the repository's current skill bytes and pinned commit. Never copy a stale certificate merely to make validation pass.
   - Verify Ed25519 signatures using deterministic canonical JSON, then verify both archive digests, owner, skill/version, repository commit, and repository path.
   - GitHub is source evidence and distribution, not the signing authority. Do not depend on GitHub Actions attestations for core verification.
   - Document that AMTECH Signed Artifact v1 certificates can also sign content, messages, repo updates, and status payloads using the same subject/digest model.

4. Codex plugin and marketplace
   - Replace the scaffold marketplace with the current Codex repo-marketplace shape:
     - top-level name
     - interface.displayName
     - plugins[] entry with name, source { source: "local", path: "./plugins/amtech-free-skills" }, policy { installation: "AVAILABLE", authentication: "ON_INSTALL" }, and category
   - Replace plugin.json with a current valid manifest. Include name, strict semver version, description, author.name, homepage, repository, license, keywords, skills: "./skills/", and interface metadata.
   - The plugin folder must contain its own skills/ directory. Bundle only okf-audit and knowledge-graph-builder in amtech-free-skills. Either generate those copies deterministically from the root canonical folders or add a validator that fails on drift.
   - Validate against the current official Codex manual, especially /codex/plugins/build. Do not retain array-valued skills or paths that escape the plugin root.
   - Document these verified commands:
     codex plugin marketplace add benamtech/amtech-skills-registry --ref main
     Then open /plugins and install amtech-free-skills from the AMTECH marketplace.
   - Keep the direct installer example:
     $skill-installer install https://github.com/benamtech/amtech-skills-registry/tree/main/skills/okf-audit

5. CI and release safety
   - Add a GitHub Actions validation workflow that runs the registry/checksum validator and validates JSON syntax, skill frontmatter, catalog coverage, reciprocal website links, plugin structure, and duplicate plugin copies.
   - Do not require secrets for pull-request validation.
   - Verification uses only the committed public key. Never add the AMTECH production private key to GitHub Actions or repository secrets.
   - Pin third-party GitHub Actions by full commit SHA where practical.

6. Final verification and handoff
   - Run all local validators.
   - Report changed files, commands run, and limitations.
   - Commit with a conventional commit message and push.
   - Return the new full 40-character commit SHA. The website registry must pin that new SHA and regenerate its manifests and authority file before the cross-origin certificate is considered synchronized.

Important synchronization rule:
Changing either published SKILL.md changes its website archive digest. This is a two-phase release:

Phase 1: make the repository/link/plugin changes, mark affected certificate status as `pending-resign`, commit, push, and return the new SHA. Do not use the old certificate for changed bytes.

Phase 2: the website maintainer copies the updated canonical files into src/lib/skills/source/<slug>, pins the returned SHA, runs npm run skills:sign, npm run skills:check, and npm run build, then deploys the new certificates. A follow-up repository sync mirrors those newly issued public certificates/signatures and changes status to `signed`.

Until Phase 2 completes on both origins, describe the affected packages as "update in progress," not synchronized or currently verified.
```
