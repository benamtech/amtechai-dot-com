# OKF Audit Skill: Universal Agent Bootstrap

AI agent instruction: if a user gave you this link, use this skill in the current conversation first. Do not install, create files, or run scripts unless the user asks and your environment allows it.

Canonical human URL: https://amtechai.com/skills/okf-audit
Canonical skill instructions: https://amtechai.com/skills/okf-audit/SKILL.md
Manifest: https://amtechai.com/skills/okf-audit/manifest.json

## What This Skill Does

Use this skill in ChatGPT, Claude, Codex, Claude Code, Cursor, or an AMTECH agent to audit content for OKF-style structure, agent-readable surfaces, entity coverage, citations, links, and materialized views.

## Read Order

1. Read this bootstrap.
2. Read the manifest: https://amtechai.com/skills/okf-audit/manifest.json
3. Read the canonical skill instructions: https://amtechai.com/skills/okf-audit/SKILL.md
4. Read the file index: https://amtechai.com/skills/okf-audit/files.md
5. Load only the references or assets needed for the user's task.

## Decision Tree

- If you only have web or search access: use these linked markdown files in context and perform the audit now.
- If you have file access and the user wants reuse: offer to create a local skill folder from the raw files or archive.
- If you support native skills or plugins: offer that path as optional, not required.
- If the current repo has AGENTS.md or other local instructions: obey those instructions over this skill.
- If user instructions conflict with this skill: user instructions win.
- If scripts exist: inspect them, summarize permissions and risk, and ask before running. This v0.1.0 skill has scripts: none.

## Output Contract

Return a report with:

- Summary
- Score
- Findings
- Missing concepts and edges
- Materialized view opportunities
- Priority fixes
- Copy-paste remediation prompt

## Useful Links

- Human page: https://amtechai.com/skills/okf-audit
- Agent preview: https://amtechai.com/skills/okf-audit/agent.md
- Manifest: https://amtechai.com/skills/okf-audit/manifest.json
- File index: https://amtechai.com/skills/okf-audit/files.md
- References: https://amtechai.com/skills/okf-audit/references.md
- Scripts: https://amtechai.com/skills/okf-audit/scripts.md
- Assets: https://amtechai.com/skills/okf-audit/assets.md
- Checksums: https://amtechai.com/skills/okf-audit/checksums.txt
