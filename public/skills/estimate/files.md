# Estimate Skill File Index

Every source file in this skill package is listed here. Agents should load only the files needed for the current task.

| File | Role | Purpose | Load policy | Raw |
| --- | --- | --- | --- | --- |
| `agents/openai.yaml` | agent-metadata | OpenAI/Codex interface metadata | Read only when installing or creating a local Codex-compatible skill. | [open](https://amtechai.com/skills/estimate/files/agents/openai.yaml) |
| `assets/estimate-schema.json` | asset | Estimate schema | Use when the user asks for JSON or a structured estimate. | [open](https://amtechai.com/skills/estimate/files/assets/estimate-schema.json) |
| `hosts/hermes.md` | reference | Hermes host hint | Read when running as an AMTECH Hermes employee with a business brain and memory. | [open](https://amtechai.com/skills/estimate/files/hosts/hermes.md) |
| `LICENSE.txt` | license | License | Read when evaluating reuse or redistribution. | [open](https://amtechai.com/skills/estimate/files/LICENSE.txt) |
| `references/estimating-discipline.md` | reference | Estimating discipline | Read when deciding how to price line items or handle a missing rate. | [open](https://amtechai.com/skills/estimate/files/references/estimating-discipline.md) |
| `SKILL.md` | primary-instructions | Canonical skill instructions | Always read before building an estimate. | [open](https://amtechai.com/skills/estimate/files/SKILL.md) |
