# Skill Materialization Pipeline

Status: v1 implemented for `okf-audit`, 2026-06-19

Purpose: define the AMTECH workaround for making full agent skills consumable across AI web search, generic chat agents, Codex, crawlers, and humans without assuming a universal marketplace install protocol.

## Core Idea

A skill folder is the package of record. Do not flatten it into one page.

Instead, materialize the full folder into a set of stable views, each optimized for a different consumer context:

- AI web search needs concise, crawlable pages with exact names, descriptions, examples, and source links.
- Generic agents need markdown instructions, manifests, and file indexes they can fetch and reason over.
- Codex needs a valid `SKILL.md` folder or plugin marketplace source.
- Security-minded users need script lists, hashes, permissions, source refs, and diffable version history.
- Humans need a polished page, examples, copy buttons, and a no-install hosted path.

The workaround is to use normal web publishing primitives in a more agent-native way: static markdown, JSON manifests, raw source, zipped folders, checksums, llms.txt, OKF concepts, GitHub permanent links, and Netlify functions. No single piece is novel. The projection system is.

## Input Artifact

The input is a standards-shaped skill folder:

```text
okf-audit/
  SKILL.md
  agents/openai.yaml
  references/
    audit-rubric.md
    okf-field-guide.md
  scripts/
    extract-page.mjs
    score-okf.mjs
  assets/
    example-report.json
  LICENSE.txt
```

AMTECH should support every file class that skills commonly include:

- `SKILL.md`: primary instructions and trigger metadata.
- `agents/openai.yaml`: optional interface/policy/dependency metadata.
- `references/`: long-form docs the agent loads only when relevant.
- `scripts/`: executable helpers, validators, extractors, or deterministic transforms.
- `assets/`: examples, templates, icons, schemas, fixtures, or files used in output.
- `LICENSE.txt`, notices, and changelogs when public distribution requires them.

The folder remains available intact through GitHub and archive downloads. The materializer never replaces the skill format; it projects it.

## Materialized Views

For a skill slug such as `okf-audit`, v1 emits these views:

| View | URL | Consumer | Purpose |
| --- | --- | --- | --- |
| Human page | `/skills/okf-audit` | Humans, search | Explains value, examples, trust notes, install choices. |
| Agent landing markdown | `/skills/okf-audit/agent.md` | Generic agents | Short instructions: what this is, what to fetch next, how to inspect safely. |
| Universal bootstrap | `/skills/okf-audit/use.md` | Agents and user copy/paste | Prompt that tells an agent to inspect manifest/files/source before use or install. |
| Raw skill | `/skills/okf-audit/SKILL.md` | Agents, Codex, crawlers | Exact primary skill instructions. |
| Folder manifest | `/skills/okf-audit/manifest.json` | Agents/tools | Complete file graph, hashes, roles, source URLs, compatibility. |
| File index | `/skills/okf-audit/files.md` | Agents/search | Markdown table of every bundled file and when to read/use it. |
| Script index | `/skills/okf-audit/scripts.md` | Trust review | Script names, language, purpose, required permissions, safety notes. |
| Reference index | `/skills/okf-audit/references.md` | Agents | Reference files with routing guidance and summaries. |
| Asset index | `/skills/okf-audit/assets.md` | Agents/humans | Assets, schemas, examples, and output-use instructions. |
| Raw files | `/skills/okf-audit/files/<path>` | Agents/tools | Direct fetch path for each file. |
| Archive | `/skills/okf-audit/okf-audit-0.1.0.zip` | Installers | Portable skill folder. |
| Checksums | `/skills/okf-audit/checksums.txt` | Trust review | SHA-256 for archive and all files. |
| Plugin view | `/skills/okf-audit/plugin.json` | Codex/plugin users | Plugin/package metadata or link to marketplace entry. |
| OKF concept | `/okf/skills/okf-audit.md` | Knowledge graph | Connects the skill to topics, use cases, and AMTECH concepts. |
| Hosted tool | `/skills/okf-audit/audit` | No-install users | Netlify-powered runtime for the same workflow. |

Root-level discovery should include:

```text
/skills/index.json
/skills/catalog.md
/skills/llms.txt
/llms.txt
/sitemap.xml
/okf/index.md
```

## Manifest Shape

The manifest is the key agent-readable bridge. It tells a model what exists before it burns context fetching every file.

```json
{
  "$schema": "https://amtechai.com/skills/schemas/amtech-skill-manifest-v0.json",
  "slug": "okf-audit",
  "name": "okf-audit",
  "title": "OKF Audit",
  "version": "0.1.0",
  "updated": "2026-06-19",
  "source": {
    "canonicalUrl": "https://amtechai.com/skills/okf-audit",
    "repository": "https://github.com/benamtech/amtech-skills-registry",
    "repositoryCommit": "15bab1b2622acd6afd0fa5f66b8af4bde01c5e50",
    "repositoryCommitSignature": "unsigned",
    "repositoryPath": "skills/okf-audit",
    "repositoryTree": "https://github.com/benamtech/amtech-skills-registry/tree/15bab1b2622acd6afd0fa5f66b8af4bde01c5e50/skills/okf-audit",
    "repositoryRegistry": "https://github.com/benamtech/amtech-skills-registry/blob/15bab1b2622acd6afd0fa5f66b8af4bde01c5e50/index.json"
  },
  "entrypoints": {
    "human": "https://amtechai.com/skills/okf-audit",
    "use": "https://amtechai.com/skills/okf-audit/use.md",
    "agent": "https://amtechai.com/skills/okf-audit/agent.md",
    "skill": "https://amtechai.com/skills/okf-audit/SKILL.md",
    "archive": "https://amtechai.com/skills/okf-audit/okf-audit-0.1.0.zip"
  },
  "files": [
    {
      "path": "SKILL.md",
      "role": "primary-instructions",
      "mediaType": "text/markdown",
      "sha256": "CHANGE_ME",
      "url": "https://amtechai.com/skills/okf-audit/files/SKILL.md",
      "loadPolicy": "always-read-before-use"
    },
    {
      "path": "references/audit-rubric.md",
      "role": "reference",
      "mediaType": "text/markdown",
      "sha256": "CHANGE_ME",
      "url": "https://amtechai.com/skills/okf-audit/files/references/audit-rubric.md",
      "loadPolicy": "read-when-auditing"
    },
    {
      "path": "scripts/score-okf.mjs",
      "role": "script",
      "language": "javascript",
      "sha256": "CHANGE_ME",
      "url": "https://amtechai.com/skills/okf-audit/files/scripts/score-okf.mjs",
      "loadPolicy": "inspect-before-run",
      "permissions": ["filesystem-read", "network-optional"],
      "runPolicy": "ask-user-before-execution"
    }
  ],
  "safety": {
    "scripts": "optional",
    "requiresNetwork": true,
    "requiresSecrets": false,
    "riskNote": "Inspect all files and ask before installing or running scripts."
  }
}
```

## Agent Search Workaround

The system should deliberately publish multiple text surfaces because different AI systems retrieve different things.

Practical rules:

- Put the exact skill name, URL, task phrase, GitHub source, and authority URL in the `<title>`, H1, meta description, first paragraph, `agent.md`, `use.md`, and catalog entries.
- Expose raw markdown paths. Many agents and search systems handle markdown better than JS-rendered pages.
- Keep `agent.md` short enough to fit inside search snippets and first-fetch context.
- Put the file graph in `manifest.json` and `files.md`, not only in page copy.
- Include source and trust statements in machine-readable files, not only the visual page.
- Link every projection to every other projection. Agents should not have to infer that `SKILL.md`, archive, GitHub source, and hosted tool are the same object.
- Use versioned URLs or tags for installable artifacts, and reserve unversioned URLs for the latest marketing/canonical view.
- Add a root `llms.txt` section for "Free AMTECH agent skills" and a dedicated `skills/llms.txt`.
- Add sitemap entries for human pages and markdown views that should be crawled.
- Add `X-Robots-Tag` or `robots.txt` exclusions only for views that should not be indexed, such as raw archives if needed.

This is the useful "hack": let AI search discover the skill as a topic, a raw instruction file, a manifest, a catalog entry, and a source package. A user can paste any one of those links into an agent, and the agent can climb the links to the complete package.

## Build Pipeline

Add a build script later, likely `scripts/skills/build-skills.ts`, with these steps:

1. Read configured skill source folders.
2. Validate `SKILL.md` frontmatter.
3. Walk all files and classify them by path and media type.
4. Hash every file and generate archive checksum.
5. Copy raw files into `public/skills/<slug>/files/**`.
6. Emit `SKILL.md`, `agent.md`, `use.md`, `files.md`, `scripts.md`, `references.md`, `assets.md`, `manifest.json`, `checksums.txt`, and the zip archive.
7. Emit `public/skills/index.json`, `public/skills/catalog.md`, and `public/skills/llms.txt`.
8. Add skill URLs to the main sitemap and root `llms.txt`.
9. Optionally emit OKF concept pages under `public/okf/skills/**`.
10. Validate that every manifest URL resolves locally, every file hash matches, and repository/authority URLs are commit-pinned.

## Netlify Role

Netlify can make the same skill folder useful in three modes:

- Static mode: serve all materialized files from `public/skills/**`.
- View negotiation mode: redirect or rewrite based on extension and `Accept` header. For example, `/skills/okf-audit` stays human, while `/skills/okf-audit.agent` or `/skills/okf-audit/agent.md` is machine-first.
- Runtime mode: Netlify Functions run hosted versions of selected workflows, such as a URL/content OKF audit, without requiring local skill installation.

Candidate redirects:

```toml
[[redirects]]
  from = "/skills/:slug/audit"
  to = "/.netlify/functions/skill-okf-audit"
  status = 200
```

## OKF Audit Skill Package

The first full test should be `okf-audit`, packaged as:

```text
okf-audit/
  SKILL.md
  agents/openai.yaml
  references/
    okf-audit-rubric.md
    agent-readable-content-checklist.md
    amtech-knowledge-graph-insights.md
  scripts/
    normalize-url-content.mjs
    audit-okf-bundle.mjs
  assets/
    report-schema.json
    example-audit-report.json
  LICENSE.txt
```

The hosted page can run a lighter function-backed audit while the installed skill gives an agent deeper local instructions and optional scripts.

## Validation Gates

Before publishing a skill:

- `SKILL.md` has valid frontmatter.
- Every reference/script/asset appears in `manifest.json`.
- Every emitted URL exists in local build output.
- Every checksum matches.
- `scripts.md` lists every executable file and its run policy.
- `use.md` tells agents to inspect before installing/running and links the commit-pinned GitHub source.
- The authority entry and manifest agree on repository commit, path, archive SHA-256, and verification method.
- The archive expands to exactly one skill folder with `SKILL.md`.
- The plugin marketplace entry points to a real plugin folder.
- Root `llms.txt`, `skills/llms.txt`, and sitemap include the intended public views.

## Relationship to AMTECH's Existing OKF System

This should reuse the current "one canonical source, many projections" discipline:

- Articles already project into React pages, prerendered HTML, OKF markdown, discovery files, and Supabase rows.
- Skills should project into human pages, raw folders, plugin manifests, install prompts, hosted functions, indexes, and OKF concepts.

The long-term product is not just "AMTECH has free skills." It is "AMTECH publishes operational knowledge as executable, inspectable, multi-view agent packages."
