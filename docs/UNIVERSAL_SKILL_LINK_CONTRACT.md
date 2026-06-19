# Universal Skill Link Contract

Status: v1 implementation contract, 2026-06-19

Purpose: define how AMTECH publishes a skill URL so any modern AI can use it immediately, even when that AI cannot install skills, read `llms.txt`, or discover adjacent docs on its own.

## Contract

An AMTECH skill URL must be self-bootstrapping.

If a user gives an AI a link such as:

```text
https://amtechai.com/skills/okf-audit
```

the first fetched page must tell the AI exactly what to do next. The page cannot assume the AI will inspect `llms.txt`, a sitemap, a manifest, or hidden adjacent files.

## Required First-Fetch Content

Every human skill page must include, in static/prerendered HTML:

- The exact skill name and task.
- A visible `AI agent instruction` block near the top.
- A direct link to `use.md`.
- The use-in-context default.
- A short decision tree for web-only, file-capable, and native-install-capable agents.
- Links to `SKILL.md`, `manifest.json`, `files.md`, archive, and checksums.
- A copyable prompt a user can paste into another AI.

Every skill must also emit:

- `use.md`: universal bootstrap; read this first.
- `agent.md`: short search/result preview optimized for first fetch.
- `SKILL.md`: canonical skill instructions.
- `manifest.json`: file graph, hashes, URLs, load policies, and trust metadata.
- `files.md`: full folder map.
- `references.md`, `scripts.md`, `assets.md`: targeted indexes.
- raw `files/**`: direct file access.

## Agent Decision Tree

An AI that receives an AMTECH skill link should:

1. Use the skill in the current conversation first.
2. Read `use.md`, then `manifest.json`, then `SKILL.md`.
3. Load only the reference or asset files needed for the user's task.
4. Respect user instructions, local project rules, `AGENTS.md`, sandbox policy, and environment constraints over AMTECH defaults.
5. If it can write files and the user wants reuse, offer to create a local skill folder from raw files or the archive.
6. If it supports native skill/plugin installation, offer that path as an option.
7. If scripts exist, inspect them, summarize permissions and risks, and ask before running.
8. If the skill conflicts with local rules, adapt the skill or stop and explain the conflict.

## First-Fetch Principle

Discovery files help, but they are not the product.

Many agents will only fetch or summarize the exact URL the user pasted. Therefore the exact URL must contain the bootstrap in plain page content, metadata, and linked markdown views. `llms.txt`, sitemap entries, structured data, and OKF concepts are secondary reinforcements.

## V1 Canonical URL Shape

V1 uses:

```text
https://amtechai.com/skills/<slug>
```

Future aliases such as `https://skills.amtechai.com/<slug>` may redirect here or serve equivalent materialized views, but `/skills/<slug>` is the v1 canonical.
