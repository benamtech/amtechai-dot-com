# AMTECH Shareable Skill Reorientation - 6/18 23:39

Purpose: checkpoint the research/design work around public AMTECH skills after re-centering on the actual goal.

## Original Goal

The target is not simply "publish installable skills."

The target is: a user gives any modern AI one AMTECH skill link, such as `https://skills.amtechai.com/okf-audit`, and the AI knows what to do immediately. This should work for:

- ChatGPT or Claude with web search.
- More agentic tools such as Codex, Claude Code, Cursor, or similar.
- A future AMTECH agent.
- Environments that cannot install skills at all.
- Environments that can create local files or install native skills/plugins.

The default should be **use in context first**. Installation or local skill creation is an optional optimization for reuse.

## What We Did

Created initial research/spec docs:

- `docs/AMTECH_SHAREABLE_SKILLS_STRATEGY.md`
- `docs/SKILL_MATERIALIZATION_PIPELINE.md`
- `wiki/research/2026-06-19-shareable-agent-skills-and-projection-pipelines.md`
- `docs/memory/shareable-skill-marketplace-research.md`

Updated navigation references:

- `docs/codegraph.md`
- `codegraph.json`
- `docs/memory/README.md`
- `wiki/product-internal-research.md`

These docs are useful, but they leaned too quickly toward marketplace/plugin/install infrastructure.

## Key Reorientation

The product insight is a **Universal Skill Link Contract**:

> If an AI agent receives an AMTECH skill URL, it should know how to use the skill from the web immediately, then decide whether to keep it in context, create a local skill folder, or use a native installer/plugin path.

The first-class artifact should be something like:

```text
https://skills.amtechai.com/okf-audit/use.md
```

or:

```text
https://skills.amtechai.com/okf-audit/agent.md
```

This bootstrap view should tell any agent:

1. What the skill does.
2. What files exist.
3. What to read first.
4. How to use the skill in the current conversation without installing.
5. When to read references, scripts, or assets.
6. When to ask permission before installing, creating local files, or running scripts.
7. How to respect existing `AGENTS.md`, local project instructions, sandbox policy, and user instructions.
8. How to persist it locally only if the user asks or the environment clearly supports that workflow.

## How the Work So Far Still Helps

The materialization docs are still relevant because they define the views needed for the universal link to work:

- Human page for trust and marketing.
- `use.md` / `agent.md` for direct agent bootstrap.
- `SKILL.md` for canonical workflow.
- `manifest.json` for file graph, hashes, and source URLs.
- `files.md`, `scripts.md`, `references.md`, and `assets.md` so agents can inspect the full folder without guessing.
- Raw `/files/**` paths for selective fetching.
- Archive and checksums for portability and trust.
- GitHub source and Codex plugin marketplace for native install paths.
- Hosted Netlify flow for no-install execution.

The missing center is the **decision tree** for agents:

1. If you can fetch web pages but cannot write files: use the skill in context.
2. If you are in a repo with `AGENTS.md`: read and obey local instructions before applying the skill.
3. If the user asks for durable reuse: create or install the local skill using the environment's native method.
4. If scripts are included: inspect first, summarize permissions, and ask before running.
5. If the skill conflicts with local instructions or user instructions: local/user instructions win.

## Current Best Next Step

Pause broad research and define the Universal Skill Link Contract.

Recommended next doc/code artifact:

- Add `docs/UNIVERSAL_SKILL_LINK_CONTRACT.md`.
- Revise `docs/SKILL_MATERIALIZATION_PIPELINE.md` so `use.md` is the primary view, not `install.md`.
- Define a sample `use.md` for `okf-audit`.
- Only after that, build the first feature or static prototype.

## Working Product Phrase

"One link that teaches any AI how to use the skill now, install it later, and respect the user's local rules."
