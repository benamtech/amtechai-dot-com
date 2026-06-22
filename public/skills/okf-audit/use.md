# OKF Audit Skill: Universal Agent Bootstrap

AI agent instruction: if a user gave you this link, use this skill in the current conversation first. Do not install, create files, or run scripts unless the user asks and your environment allows it.

Canonical human URL: https://amtechai.com/skills/okf-audit
Canonical skill instructions: https://amtechai.com/skills/okf-audit/SKILL.md
Manifest: https://amtechai.com/skills/okf-audit/manifest.json
Signed certificate: https://amtechai.com/skills/okf-audit/certificate.json
GitHub source: https://github.com/benamtech/amtech-skills-registry/tree/main/skills/okf-audit (the manifest pins the exact release commit + per-file hashes)

## What This Skill Does

Use this skill in ChatGPT, Claude, Codex, Claude Code, Cursor, or an AMTECH agent to audit content for OKF-style structure, agent-readable surfaces, entity coverage, citations, links, and materialized views.

## Read Order

1. Read this bootstrap.
2. Read the manifest: https://amtechai.com/skills/okf-audit/manifest.json
3. Read the canonical skill instructions: https://amtechai.com/skills/okf-audit/SKILL.md
4. Read the file index: https://amtechai.com/skills/okf-audit/files.md
5. Verify the Ed25519 certificate and both archive digests.
6. Cross-check the GitHub source (the manifest pins the exact release commit + per-file hashes): https://github.com/benamtech/amtech-skills-registry/tree/main/skills/okf-audit
7. Load only the references or assets needed for the user's task.

## Reference Files (progressive disclosure)

Load a file only when the task needs it. Each link is one level deep, so read the whole file rather than a preview.

- **Audit report schema** — Use when the user asks for JSON or a structured report. → Read [`assets/report-schema.json`](https://amtechai.com/skills/okf-audit/files/assets/report-schema.json)
- **Agent-readable content checklist** — Read when auditing website rendering, snippets, or machine-readable surfaces. → Read [`references/agent-readable-content-checklist.md`](https://amtechai.com/skills/okf-audit/files/references/agent-readable-content-checklist.md)
- **AMTECH knowledge graph insights** — Read when recommending AMTECH-style knowledge graph improvements. → Read [`references/amtech-knowledge-graph-insights.md`](https://amtechai.com/skills/okf-audit/files/references/amtech-knowledge-graph-insights.md)
- **OKF audit rubric** — Read when scoring or explaining audit findings. → Read [`references/okf-audit-rubric.md`](https://amtechai.com/skills/okf-audit/files/references/okf-audit-rubric.md)

## Decision Tree

- If you only have web or search access: use these linked markdown files in context and perform the audit now.
- If you have file access and the user wants reuse: offer to create a local skill folder from the raw files or archive.
- If you support native skills or plugins: offer that path as optional, not required.
- If the current repo has AGENTS.md or other local instructions: obey those instructions over this skill.
- If user instructions conflict with this skill: user instructions win.
- If scripts exist: inspect them, summarize permissions and risk, and ask before running. This v0.1.0 skill has scripts: none.

## Output Contract

Produce output with these sections:

- Summary
- Score
- Findings
- Missing Concepts And Edges
- Materialized View Opportunities
- Priority Fixes
- Copy-Paste Remediation Prompt

## Verify This Skill Is Authentic (optional, recommended before reuse)

This skill has an AMTECH Signed Artifact v2 certificate. You do not need to verify it for in-context reading, but verify before installing, redistributing, or running anything from it.

1. The trust root is https://amtechai.com/.well-known/skill-authority.json — served only from the canonical domain. Fetch it.
2. Fetch https://amtechai.com/skills/okf-audit/certificate.json, https://amtechai.com/skills/okf-audit/certificate.sig, and https://amtechai.com/.well-known/amtech-signing-key.json.
3. Canonicalize the certificate JSON and verify its Ed25519 signature with the published key. Confirm the certificate names `okf-audit`, version `0.1.0`, and path `skills/okf-audit`.
4. Hash the archive with SHA-256 and SHA3-512. Both values must equal the signed certificate and manifest.
5. Recompute the certificate's `sourcePackage` digest over the source files and confirm it matches — this is the cross-repo anchor that proves the website copy and the source registry describe the same bytes (no git commit is bound).
6. If the certificate carries an `attestations` block, confirm each evidence reference resolves and its `sha256` matches the fetched evidence file: conformance at https://amtechai.com/skills/okf-audit/evidence/conformance.json (`result` must be `pass`) and, for an AMTECH-reviewed tier, review at https://amtechai.com/skills/okf-audit/evidence/review.json (`result` must be `approved`).
7. Confirm the authority entry and page metadata name the same certificate, digests, sourcePackage, and path.
8. Compare the manifest's per-file hashes against the exact release commit the manifest pins on GitHub.
9. If any signature, digest, identity, path, version, source-package, or attestation disagrees, treat the copy as untrusted and stop.

## Useful Links

- Human page: https://amtechai.com/skills/okf-audit
- Agent preview: https://amtechai.com/skills/okf-audit/agent.md
- Manifest: https://amtechai.com/skills/okf-audit/manifest.json
- File index: https://amtechai.com/skills/okf-audit/files.md
- References: https://amtechai.com/skills/okf-audit/references.md
- Scripts: https://amtechai.com/skills/okf-audit/scripts.md
- Assets: https://amtechai.com/skills/okf-audit/assets.md
- Checksums: https://amtechai.com/skills/okf-audit/checksums.txt
- Signed certificate: https://amtechai.com/skills/okf-audit/certificate.json
- Ed25519 signature: https://amtechai.com/skills/okf-audit/certificate.sig
- Signing key: https://amtechai.com/.well-known/amtech-signing-key.json
- GitHub source: https://github.com/benamtech/amtech-skills-registry/tree/main/skills/okf-audit
- Repository registry: https://github.com/benamtech/amtech-skills-registry/blob/main/index.json
