# Shareable Skill Marketplace Research Memory

Created: 2026-06-19

AMTECH is considering a public free-skill hub, starting with `skills.amtechai.com/okf-audit`.

Core decision: do not rely on one URL pretending to be a universal install protocol. Use a projection architecture:

- Canonical skill registry.
- Human skill page.
- Agent landing markdown.
- Agent install prompt.
- Raw `SKILL.md`.
- Full file index covering references, scripts, assets, schemas, examples, and licenses.
- Script index with purpose, permissions, hashes, and run policy.
- Versioned archive + checksums.
- GitHub source tree.
- Codex plugin marketplace hosted from a GitHub repo.
- Optional hosted Netlify audit function.
- llms.txt and OKF discovery entries.

Current Codex reality:

- Skills are local folders with `SKILL.md`.
- `$skill-installer` can be prompted to install GitHub directory URLs.
- Plugins are the proper reusable distribution unit.
- Plugin marketplaces are GitHub/Git/local catalog sources, not arbitrary marketing pages.

First product candidate:

- `okf-audit`: takes a URL, pasted article, website text, sitemap, OKF bundle, or draft and audits it for OKF-style packaging, agent-readable markdown, entity/edge coverage, citations, internal link graph health, llms.txt/sitemap discovery, and AMTECH knowledge-graph insights.

Primary docs:

- `docs/AMTECH_SHAREABLE_SKILLS_STRATEGY.md`
- `docs/SKILL_MATERIALIZATION_PIPELINE.md`
- `wiki/research/2026-06-19-shareable-agent-skills-and-projection-pipelines.md`
