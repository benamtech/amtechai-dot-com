# Shareable Skill Marketplace Research Memory

Created: 2026-06-19

AMTECH is treating skills as signed, git-backed artifacts with multiple surfaces, not as a single-storefront object.

Core registry pattern:

- Canonical skill registry in `src/lib/skills/registry.ts`.
- Human skill page plus agent bootstrap.
- Raw `SKILL.md`.
- Full file index covering references, scripts, assets, schemas, examples, and licenses.
- Versioned archive, checksums, and signed certificate.
- Commit-pinned GitHub tree plus reciprocal public-page links.
- Public registry JSON for machine consumption.

Trust model:

- SHA-256 remains for compatibility.
- SHA3-512 adds a second digest construction.
- Ed25519 signs a canonical certificate that binds the skill, version, canonical URL, repo commit/path, and digests.
- The signature authenticates the certificate and content digest, but not legal authorship on its own.

Comparison notes:

- Anthropic Agent Skills are filesystem-first and load on demand across Claude products.
- Anthropic’s public skills repo is a source/distribution surface, but AMTECH is adding a public registry page plus signed artifacts.
- OpenAI GPTs are community-built and review-gated; discovery is strong, but provenance is more platform-mediated than git-pinned.
- GitHub/package registries are strong on version history and source access; AMTECH adds agent-native bootstrap and trust surfaces on top.
- Recent research on skill marketplaces shows supply-demand imbalance, redundancy, and security risk at scale, which supports the need for provenance and signed release discipline.

First product candidate:

- `okf-audit`: audits a URL, pasted article, website text, sitemap, OKF bundle, or draft for OKF-style packaging, agent-readable markdown, entity/edge coverage, citations, internal link graph health, llms.txt/sitemap discovery, and AMTECH knowledge-graph insights.

Primary docs:

- `docs/AMTECH_SHAREABLE_SKILLS_STRATEGY.md`
- `docs/SKILL_MATERIALIZATION_PIPELINE.md`
- `docs/SKILL_SIGNING.md`
- `wiki/research/2026-06-19-shareable-agent-skills-and-projection-pipelines.md`
