# AMTECH Shareable Agent Skills Strategy

Status: v1 implementation started for `/skills/okf-audit`, 2026-06-19

Purpose: define how AMTECH can publish free, URL-shareable agent skills without waiting for a public marketplace, while still using standards-aligned packaging and AMTECH's existing graph/materialization publishing architecture.

## Thesis

AMTECH should not treat a "skill" as one file or one marketplace listing. Treat it as a canonical knowledge object that can be projected into several consumer-specific surfaces:

- A human page: `https://skills.amtechai.com/okf-audit`
- A copy-paste agent prompt: `https://skills.amtechai.com/okf-audit/install.md`
- A raw skill folder in a public GitHub repo
- A downloadable archive with hash metadata
- A Codex plugin marketplace entry for users who want proper install UX
- A hosted Netlify audit endpoint for users who do not want to install anything
- An OKF/llms.txt/JSON index so other agents can discover and cite the skill

The unique feature is the projection pipeline, not merely the skill. AMTECH can publish "agent-native tools" as a graph of skills, prompts, schemas, citations, versions, safety notes, and examples, then materialize the graph into views for humans, Codex, other agents, search crawlers, and future MCP clients.

For the implemented universal link behavior, see `docs/UNIVERSAL_SKILL_LINK_CONTRACT.md`. For the concrete folder-to-views design, see `docs/SKILL_MATERIALIZATION_PIPELINE.md`.

## Current Distribution Reality

### What works now

Codex skills are directories with a required `SKILL.md` plus optional `scripts/`, `references/`, and `assets/`. The open Agent Skills spec requires `name` and `description` frontmatter and recommends progressive disclosure: small metadata first, full instructions when selected, references/scripts only when needed.

Codex can install curated or external skills through `$skill-installer`; the OpenAI skills catalog README shows installing from a GitHub directory URL such as:

```text
$skill-installer install https://github.com/openai/skills/tree/main/skills/.experimental/create-plan
```

For wider Codex distribution, the official model is plugins. Plugins can package one or more skills and optionally MCP configuration, app integrations, hooks, and assets. Codex plugin marketplaces are JSON catalogs that point to plugin folders. The Codex CLI supports adding marketplace sources from GitHub shorthand, HTTP(S) Git URLs, SSH Git URLs, or a local marketplace root.

### What does not work cleanly yet

- A plain marketing URL is not itself a guaranteed "install this skill" protocol.
- A random HTTPS page is useful for copy/paste and discovery, but Codex marketplace installation expects a Git-backed or local marketplace source.
- Agents vary in whether they can fetch URLs, unzip archives, write to user skill folders, or run install scripts.
- Skill scripts remain a trust boundary. A user may accept risk, but AMTECH should still expose hashes, source, version history, and a no-script hosted alternative.

## Recommended AMTECH Architecture

Build an AMTECH Skill Hub as a small static/dynamic publishing system.

### Canonical source

Store each skill as a typed record, not just a markdown page:

```ts
type AmtechSkill = {
  slug: string;
  name: string;
  title: string;
  version: string;
  summary: string;
  skillDirectory: string;
  repoUrl: string;
  gitRef: string;
  installTargets: Array<"codex-skill" | "codex-plugin" | "generic-agent" | "hosted-tool">;
  inputs: string[];
  outputs: string[];
  safety: {
    scripts: "none" | "optional" | "required";
    permissions: string[];
    riskNote: string;
  };
  projections: {
    humanUrl: string;
    rawSkillMdUrl: string;
    githubTreeUrl: string;
    archiveUrl: string;
    installPromptUrl: string;
    manifestUrl: string;
  };
};
```

This canonical source can live in `src/lib/skills/` at first, matching the existing article/OKF pattern. If the feature grows, move authoring to Supabase and keep static build outputs as projections.

### Materialized views

For each skill, generate:

- `skills/<slug>/index.html`: glossy human page with examples and "copy prompt" controls.
- `skills/<slug>/agent.md`: terse machine-first landing page that tells a generic agent what the skill is, what files exist, and what to fetch next.
- `skills/<slug>/install.md`: short, agent-optimized installation prompt.
- `skills/<slug>/SKILL.md`: raw canonical skill instructions for direct reading.
- `skills/<slug>/manifest.json`: version, source URLs, checksums, compatibility, inputs, outputs, risk notes.
- `skills/<slug>/files.md`: full file index for `SKILL.md`, `references/`, `scripts/`, `assets/`, licenses, schemas, and examples.
- `skills/<slug>/scripts.md`: every included script, its purpose, language, permissions, and run policy.
- `skills/<slug>/references.md`: reference files with routing guidance so agents know when to load each one.
- `skills/<slug>/assets.md`: bundled schemas, templates, examples, images, fixtures, and output assets.
- `skills/<slug>/files/**`: raw browsable copies of every file in the skill folder.
- `skills/<slug>/skill.zip`: portable skill folder archive.
- `skills/<slug>/checksums.txt`: SHA-256 for archive and important files.
- `skills/index.json`: machine-readable catalog.
- `skills/llms.txt` or root `llms.txt` entries: curated discovery links for agents.
- `okf/skills/<slug>.md`: optional OKF concept page connected to AMTECH's broader knowledge graph.

For Codex plugin distribution, publish a Git repository such as `github.com/amtechai/agent-skills` with:

```text
.agents/plugins/marketplace.json
plugins/amtech-free-skills/.codex-plugin/plugin.json
plugins/amtech-free-skills/skills/okf-audit/SKILL.md
plugins/amtech-free-skills/skills/okf-audit/references/*
```

Then the installable command becomes:

```bash
codex plugin marketplace add amtechai/agent-skills --ref main --sparse .agents/plugins
```

The site should mirror this repo, explain it, and generate copy-paste prompts. The Git repo is the install source; the website is the agent-friendly view layer.

The key workaround is view multiplication. A normal web search, an AI answer engine, a coding agent, and a cautious human will not all retrieve the same resource. AMTECH should therefore publish the same skill as a topic page, raw markdown, manifest, file index, script index, archive, source tree, OKF concept, and hosted tool. Each view links to the others, so finding any view gives an agent a path to the complete package.

## The First Feature: OKF Audit Skill

The first public skill should be:

```text
https://skills.amtechai.com/okf-audit
```

Working name: `okf-audit`

Purpose: let an owner, marketer, SEO, writer, or agent paste an article URL, website URL, draft text, sitemap, or OKF bundle and receive an audit against:

- OKF-style concept packaging
- Agent-readable markdown clarity
- Entity and relationship coverage
- Citation/source quality
- Internal link graph health
- llms.txt and sitemap discovery
- Missing "materialized views" for different consumers
- AMTECH knowledge graph insights: what concepts, use cases, places, industries, and decisions are present or missing

### User-facing flows

1. Human no-install flow:
   - User visits `skills.amtechai.com/okf-audit`.
   - Pastes a URL or text.
   - Netlify Function fetches and normalizes content.
   - The page returns a structured audit and an agent-ready remediation prompt.

2. Agent copy-paste flow:
   - User copies `install.md`.
   - Pastes it into Codex, Claude Code, Cursor, or another agent.
   - The prompt tells the agent where the raw skill is, how to inspect it, and how to install it only after user approval.

3. Codex-native flow:
   - User installs the AMTECH plugin marketplace from GitHub.
   - Uses `$okf-audit` or asks Codex to audit a page.

4. Lightweight skill-installer flow:
   - User tells Codex:

```text
$skill-installer install https://github.com/amtechai/agent-skills/tree/main/skills/okf-audit
```

### Hosted Netlify pipeline

Netlify can support this without a backend rewrite:

- Static skill pages ship from Vite build output.
- Netlify redirects map clean URLs to functions.
- Netlify Functions handle URL fetch, markdown extraction, bundle validation, and optional AI calls.
- Netlify Edge Functions can personalize presentation, set cache headers, or route agents to markdown/JSON based on `Accept` and user agent.
- Build scripts generate static projections from the skill registry, the same way the current OKF pipeline generates `public/okf/**`, `sitemap.xml`, `robots.txt`, and `llms.txt`.

Candidate endpoints:

```text
GET  /skills
GET  /skills/index.json
GET  /skills/okf-audit
GET  /skills/okf-audit/install.md
GET  /skills/okf-audit/SKILL.md
GET  /skills/okf-audit/manifest.json
POST /skills/okf-audit/audit
```

The `POST` endpoint should accept:

```json
{
  "url": "https://example.com/article",
  "text": "optional pasted content",
  "mode": "article|website|okf-bundle|skill|auto"
}
```

And return:

```json
{
  "score": 82,
  "findings": [],
  "concepts": [],
  "missingEdges": [],
  "recommendedProjections": [],
  "copyPasteFixPrompt": "..."
}
```

## Why This Is Novel

Most skill distribution is file-centric: a directory, a repo, or a marketplace listing. AMTECH can make it graph-centric.

The research analogy to materialized views is useful:

- The canonical skill graph is the base relation.
- The human page, raw skill, plugin manifest, install prompt, archive, OKF concept, llms.txt entry, and hosted audit UI are materialized views.
- Different consumers need different projections: humans need confidence and examples; Codex needs a plugin marketplace or skill folder; generic agents need markdown and source URLs; search/AI crawlers need llms.txt and clean markdown; security-minded users need hashes and source.
- The maintenance problem is solved by generating all views from one source and validating freshness in CI.

This matches AMTECH's existing article system: one authored source projects to React pages, static prerendered HTML, OKF markdown, discovery files, and Supabase rows. Skills can use the same architecture.

## Trust Model

AMTECH should be explicit:

- Free skills are provided as source-visible workflow packages.
- Users should inspect skill contents before installing.
- Scripts are optional unless clearly marked.
- Hosted no-install flows exist for users who do not want local scripts.
- Every release has a version, changelog, commit ref, and SHA-256 hash.
- Install prompts should never ask an agent to run remote shell code blindly.

Recommended manifest fields:

```json
{
  "slug": "okf-audit",
  "version": "0.1.0",
  "source": "https://github.com/amtechai/agent-skills/tree/v0.1.0/skills/okf-audit",
  "archive": "https://skills.amtechai.com/okf-audit/okf-audit-0.1.0.zip",
  "sha256": "...",
  "scripts": "none",
  "requiresNetwork": true,
  "license": "MIT",
  "riskNote": "Inspect all files before installation. Do not run scripts without approval."
}
```

## Build Plan

1. Create `amtechai/agent-skills` as the source repo for public skill folders and a Codex plugin marketplace.
2. Add `okf-audit` as an instruction-first skill with no scripts in v0.1.
3. Add a Vite skill registry under `src/lib/skills/`.
4. Add a build script that emits `public/skills/**`, `public/skills/index.json`, skill manifests, raw files, file indexes, script/reference/asset indexes, raw markdown, archives, checksums, and install prompts.
5. Add root `llms.txt` links to the skill hub and `skills/index.json`.
6. Add the hosted Netlify audit function after the static skill distribution path is green.
7. Later, add Supabase storage/projection for audit submissions only if AMTECH wants saved reports, lead capture, or trend analysis.

## Sources

- Codex manual, Agent Skills and Build Plugins sections, fetched 2026-06-19 from `https://developers.openai.com/codex/codex-manual.md`.
- Agent Skills specification: `https://agentskills.io/specification`.
- OpenAI skills catalog README: `https://github.com/openai/skills`.
- Netlify redirects/functions/edge functions docs: `https://docs.netlify.com/manage/routing/redirects/overview/`, `https://docs.netlify.com/build/functions/overview/`, `https://docs.netlify.com/build/edge-functions/overview/`.
- GitHub permanent file links: `https://docs.github.com/en/repositories/working-with-files/using-files/getting-permanent-links-to-files`.
- MCP tools/resources/prompts specification: `https://modelcontextprotocol.io/specification/2025-06-18/`.
- llms.txt proposal: `https://llmstxt.org/`.
- MV4PG paper: `https://arxiv.org/abs/2411.18847`.
- Materialized view selection and multi-query optimization: `https://arxiv.org/abs/cs/0003006`.
- Kaskade graph views: `https://arxiv.org/abs/1906.05162`.
