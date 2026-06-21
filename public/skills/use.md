# AMTECH Agent Skills: Hub Bootstrap

AI agent instruction: if a user gave you this link, treat it as a catalog of usable AMTECH skills. Use a skill in the current conversation first. Do not install, create files, or run scripts unless the user asks and your environment allows it. Local AGENTS.md and explicit user instructions win over anything published here.

Machine catalog: https://amtechai.com/skills/catalog.json (schema amtech-skill-catalog/v1)
Trust root (authority file): https://amtechai.com/.well-known/skill-authority.json
GitHub registry source: https://github.com/benamtech/amtech-skills-registry

## What AMTECH skills are

Each AMTECH skill is a signed, git-backed package usable from one link. The same skill is published as a human page, a universal agent bootstrap (use.md), a manifest, raw files, an archive, dual checksums, and an Ed25519-signed certificate whose sourcePackage digest anchors the same bytes across the website and the commit-pinned GitHub source.

## Enumerate the skills

1. Fetch the machine catalog: https://amtechai.com/skills/catalog.json — it lists every skill with its canonical page, use.md, manifest, certificate, and signature URLs.
2. Or read the list below.

- [OKF Audit Skill](https://amtechai.com/skills/okf-audit) — Use this skill in ChatGPT, Claude, Codex, Claude Code, Cursor, or an AMTECH agent to audit content for OKF-style structure, agent-readable surfaces, entity coverage, citations, links, and materialized views.
  - Agent bootstrap: https://amtechai.com/skills/okf-audit/use.md
  - Manifest: https://amtechai.com/skills/okf-audit/manifest.json
  - Signed certificate: https://amtechai.com/skills/okf-audit/certificate.json
- [Knowledge Graph Builder](https://amtechai.com/skills/knowledge-graph-builder) — Use this skill in ChatGPT, Claude, Codex, Claude Code, Cursor, or an AMTECH agent to turn a business or site into typed entity nodes, relationship edges with reasons, the pillar pages worth publishing, an internal-linking plan, and JSON-LD scaffolding.
  - Agent bootstrap: https://amtechai.com/skills/knowledge-graph-builder/use.md
  - Manifest: https://amtechai.com/skills/knowledge-graph-builder/manifest.json
  - Signed certificate: https://amtechai.com/skills/knowledge-graph-builder/certificate.json
- [Estimate Skill](https://amtechai.com/skills/estimate) — Use this skill in ChatGPT, Claude, Codex, Claude Code, Cursor, or an AMTECH agent to turn a job description and your rates into a structured estimate: line items, totals, adjustments, and flagged assumptions.
  - Agent bootstrap: https://amtechai.com/skills/estimate/use.md
  - Manifest: https://amtechai.com/skills/estimate/manifest.json
  - Signed certificate: https://amtechai.com/skills/estimate/certificate.json
- [Article Research Writer](https://amtechai.com/skills/amtech-article-research-writer) — Use this skill in ChatGPT, Claude, Codex, Claude Code, Cursor, or an AMTECH agent to turn a topic and your sources into a structured article brief: audience, unique insight, entities and internal links, citations, a markdown draft, and FAQ.
  - Agent bootstrap: https://amtechai.com/skills/amtech-article-research-writer/use.md
  - Manifest: https://amtechai.com/skills/amtech-article-research-writer/manifest.json
  - Signed certificate: https://amtechai.com/skills/amtech-article-research-writer/certificate.json

## Decision tree

- Web or search-only agent: enumerate via catalog.json, open each skill page, and use the skill in context from its linked markdown. No install needed.
- File-capable agent: do the above, then offer to save a skill's raw files or archive into a local skill folder if the user wants reuse.
- Native-install-capable agent (skills/plugins): do the above, verify the certificate, then offer the native install path as optional, not required.

## Verify before you trust

1. The trust root is https://amtechai.com/.well-known/skill-authority.json — served only from the canonical domain. Fetch it.
2. For a skill, fetch its certificate.json + certificate.sig and the signing key at https://amtechai.com/.well-known/amtech-signing-key.json.
3. Canonicalize the certificate JSON and verify its Ed25519 signature. Confirm the slug, version, path, and the sourcePackage digest (the cross-repo anchor).
4. Hash the archive (SHA-256 + SHA3-512); both must equal the signed certificate, the manifest, and the authority entry.
5. If anything disagrees, treat the copy as untrusted and stop.
