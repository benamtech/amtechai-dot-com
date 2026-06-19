# OKF Audit Skill File Index

Every source file in this skill package is listed here. Agents should load only the files needed for the current task.

| File | Role | Purpose | Load policy | Raw |
| --- | --- | --- | --- | --- |
| `agents/openai.yaml` | agent-metadata | OpenAI/Codex interface metadata | Read only when installing or creating a local Codex-compatible skill. | [open](https://amtechai.com/skills/okf-audit/files/agents/openai.yaml) |
| `assets/report-schema.json` | asset | Audit report schema | Use when the user asks for JSON or a structured report. | [open](https://amtechai.com/skills/okf-audit/files/assets/report-schema.json) |
| `LICENSE.txt` | license | License | Read when evaluating reuse or redistribution. | [open](https://amtechai.com/skills/okf-audit/files/LICENSE.txt) |
| `references/agent-readable-content-checklist.md` | reference | Agent-readable content checklist | Read when auditing website rendering, snippets, or machine-readable surfaces. | [open](https://amtechai.com/skills/okf-audit/files/references/agent-readable-content-checklist.md) |
| `references/amtech-knowledge-graph-insights.md` | reference | AMTECH knowledge graph insights | Read when recommending AMTECH-style knowledge graph improvements. | [open](https://amtechai.com/skills/okf-audit/files/references/amtech-knowledge-graph-insights.md) |
| `references/okf-audit-rubric.md` | reference | OKF audit rubric | Read when scoring or explaining audit findings. | [open](https://amtechai.com/skills/okf-audit/files/references/okf-audit-rubric.md) |
| `SKILL.md` | primary-instructions | Canonical skill instructions | Always read before performing an audit. | [open](https://amtechai.com/skills/okf-audit/files/SKILL.md) |
