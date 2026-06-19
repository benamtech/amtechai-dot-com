# Knowledge Graph Builder File Index

Every source file in this skill package is listed here. Agents should load only the files needed for the current task.

| File | Role | Purpose | Load policy | Raw |
| --- | --- | --- | --- | --- |
| `agents/openai.yaml` | agent-metadata | OpenAI/Codex interface metadata | Read only when installing or creating a local Codex-compatible skill. | [open](https://amtechai.com/skills/knowledge-graph-builder/files/agents/openai.yaml) |
| `assets/graph-schema.json` | asset | Knowledge graph schema | Use when the user asks for JSON or a graph another tool can ingest. | [open](https://amtechai.com/skills/knowledge-graph-builder/files/assets/graph-schema.json) |
| `LICENSE.txt` | license | License | Read when evaluating reuse or redistribution. | [open](https://amtechai.com/skills/knowledge-graph-builder/files/LICENSE.txt) |
| `references/entity-types.md` | reference | Entity type vocabulary | Read when typing entities. | [open](https://amtechai.com/skills/knowledge-graph-builder/files/references/entity-types.md) |
| `references/knowledge-graph-method.md` | reference | Knowledge graph method | Read when deciding which nodes deserve pages and how to write edges. | [open](https://amtechai.com/skills/knowledge-graph-builder/files/references/knowledge-graph-method.md) |
| `SKILL.md` | primary-instructions | Canonical skill instructions | Always read before building a graph. | [open](https://amtechai.com/skills/knowledge-graph-builder/files/SKILL.md) |
