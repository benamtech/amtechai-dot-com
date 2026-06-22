# Article Research Writer: Universal Agent Bootstrap

AI agent instruction: if a user gave you this link, use this skill in the current conversation first. Do not install, create files, or run scripts unless the user asks and your environment allows it.

Canonical human URL: https://amtechai.com/skills/amtech-article-research-writer
Canonical skill instructions: https://amtechai.com/skills/amtech-article-research-writer/SKILL.md
Manifest: https://amtechai.com/skills/amtech-article-research-writer/manifest.json
Signed certificate: https://amtechai.com/skills/amtech-article-research-writer/certificate.json
GitHub source: https://github.com/benamtech/amtech-skills-registry/tree/main/skills/amtech-article-research-writer (the manifest pins the exact release commit + per-file hashes)

## What This Skill Does

Use this skill in ChatGPT, Claude, Codex, Claude Code, Cursor, or an AMTECH agent to turn a topic and your sources into a structured article brief: audience, unique insight, entities and internal links, citations, a markdown draft, and FAQ.

## Read Order

1. Read this bootstrap.
2. Read the manifest: https://amtechai.com/skills/amtech-article-research-writer/manifest.json
3. Read the canonical skill instructions: https://amtechai.com/skills/amtech-article-research-writer/SKILL.md
4. Read the file index: https://amtechai.com/skills/amtech-article-research-writer/files.md
5. Verify the Ed25519 certificate and both archive digests.
6. Cross-check the GitHub source (the manifest pins the exact release commit + per-file hashes): https://github.com/benamtech/amtech-skills-registry/tree/main/skills/amtech-article-research-writer
7. Load only the references or assets needed for the user's task.

## Reference Files (progressive disclosure)

Load a file only when the task needs it. Each link is one level deep, so read the whole file rather than a preview.

- **Article brief schema** — Use when the user asks for JSON or a structured brief. → Read [`assets/article-brief-schema.json`](https://amtechai.com/skills/amtech-article-research-writer/files/assets/article-brief-schema.json)
- **Draft template** — Read when assembling the draft. → Read [`references/draft-template.md`](https://amtechai.com/skills/amtech-article-research-writer/files/references/draft-template.md)
- **Research workflow** — Read when gathering sources or synthesizing the unique insight. → Read [`references/research-workflow.md`](https://amtechai.com/skills/amtech-article-research-writer/files/references/research-workflow.md)

## Decision Tree

- If you only have web or search access: use these linked markdown files in context and produce the brief now.
- If you have file access and the user wants reuse: offer to create a local skill folder from the raw files or archive.
- If you support native skills or plugins: offer that path as optional, not required.
- If the current repo has AGENTS.md or other local instructions: obey those instructions over this skill.
- If user instructions conflict with this skill: user instructions win.
- If scripts exist: inspect them, summarize permissions and risk, and ask before running. This v1.0.0 skill has scripts: none.

## Output Contract

Produce output with these sections:

- Meta
- Unique Insight
- Entities
- Citations
- Draft
- FAQ

## Verify This Skill Is Authentic (optional, recommended before reuse)

This skill has an AMTECH Signed Artifact v2 certificate. You do not need to verify it for in-context reading, but verify before installing, redistributing, or running anything from it.

1. The trust root is https://amtechai.com/.well-known/skill-authority.json — served only from the canonical domain. Fetch it.
2. Fetch https://amtechai.com/skills/amtech-article-research-writer/certificate.json, https://amtechai.com/skills/amtech-article-research-writer/certificate.sig, and https://amtechai.com/.well-known/amtech-signing-key.json.
3. Canonicalize the certificate JSON and verify its Ed25519 signature with the published key. Confirm the certificate names `amtech-article-research-writer`, version `1.0.0`, and path `skills/amtech-article-research-writer`.
4. Hash the archive with SHA-256 and SHA3-512. Both values must equal the signed certificate and manifest.
5. Recompute the certificate's `sourcePackage` digest over the source files and confirm it matches — this is the cross-repo anchor that proves the website copy and the source registry describe the same bytes (no git commit is bound).
6. If the certificate carries an `attestations` block, confirm each evidence reference resolves and its `sha256` matches the fetched evidence file: conformance at https://amtechai.com/skills/amtech-article-research-writer/evidence/conformance.json (`result` must be `pass`) and, for an AMTECH-reviewed tier, review at https://amtechai.com/skills/amtech-article-research-writer/evidence/review.json (`result` must be `approved`).
7. Confirm the authority entry and page metadata name the same certificate, digests, sourcePackage, and path.
8. Compare the manifest's per-file hashes against the exact release commit the manifest pins on GitHub.
9. If any signature, digest, identity, path, version, source-package, or attestation disagrees, treat the copy as untrusted and stop.

## Useful Links

- Human page: https://amtechai.com/skills/amtech-article-research-writer
- Agent preview: https://amtechai.com/skills/amtech-article-research-writer/agent.md
- Manifest: https://amtechai.com/skills/amtech-article-research-writer/manifest.json
- File index: https://amtechai.com/skills/amtech-article-research-writer/files.md
- References: https://amtechai.com/skills/amtech-article-research-writer/references.md
- Scripts: https://amtechai.com/skills/amtech-article-research-writer/scripts.md
- Assets: https://amtechai.com/skills/amtech-article-research-writer/assets.md
- Checksums: https://amtechai.com/skills/amtech-article-research-writer/checksums.txt
- Signed certificate: https://amtechai.com/skills/amtech-article-research-writer/certificate.json
- Ed25519 signature: https://amtechai.com/skills/amtech-article-research-writer/certificate.sig
- Signing key: https://amtechai.com/.well-known/amtech-signing-key.json
- GitHub source: https://github.com/benamtech/amtech-skills-registry/tree/main/skills/amtech-article-research-writer
- Repository registry: https://github.com/benamtech/amtech-skills-registry/blob/main/index.json
