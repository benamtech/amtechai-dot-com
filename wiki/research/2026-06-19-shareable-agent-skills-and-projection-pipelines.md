# Shareable Agent Skills and Projection Pipelines

Date: 2026-06-19

Question: how can AMTECH publish free agent skills that are URL-shareable, agent-friendly, and eventually installable, without depending on a closed marketplace?

## Research Findings

Codex currently has three relevant levels:

1. Local skills: folders containing `SKILL.md` plus optional resources/scripts.
2. `$skill-installer`: can install curated skills and can be prompted to install a GitHub skill directory URL.
3. Plugins: the official distribution package for reusable skills, with marketplace catalogs that Codex can add from GitHub, Git URLs, SSH Git URLs, or local roots.

This means `https://skills.amtechai.com/okf-audit` should not pretend to be a magic install URL. It should be a stable product URL that exposes all installable and readable projections:

- Human overview.
- Agent copy-paste installer prompt.
- Raw `SKILL.md`.
- Full file index for references, scripts, assets, schemas, examples, and licenses.
- Script review page with run policy and permissions.
- Versioned zip/tarball.
- Manifest with hashes and source refs.
- GitHub source tree URL.
- Codex plugin marketplace command.
- Hosted no-install function for the same workflow.

## Important Source Notes

The Agent Skills standard defines the portable skill shape: `SKILL.md` with YAML frontmatter, `name` and `description`, optional `scripts/`, `references/`, and `assets/`, and progressive disclosure. Source: `https://agentskills.io/specification`.

OpenAI's skills catalog README shows that `$skill-installer` can accept a GitHub directory URL. Source: `https://github.com/openai/skills`.

The Codex manual says plugins are the installable distribution unit for reusable skills and that plugin marketplaces can be GitHub/Git/local sources. Source: official Codex manual fetched locally from `https://developers.openai.com/codex/codex-manual.md` on 2026-06-19.

Netlify supports the AMTECH implementation pattern:

- Redirects/rewrite rules can map clean public URLs to functions.
- Functions handle web requests and return responses.
- Edge Functions can modify requests/responses at the network edge and cache responses.

Sources:

- `https://docs.netlify.com/manage/routing/redirects/overview/`
- `https://docs.netlify.com/build/functions/overview/`
- `https://docs.netlify.com/build/edge-functions/overview/`

GitHub branch URLs drift; permanent links should use a commit SHA or tag. This matters for skill trust and reproducibility. Source: `https://docs.github.com/en/repositories/working-with-files/using-files/getting-permanent-links-to-files`.

MCP is relevant for a later hosted tool surface, not for v0 static skill distribution. MCP prompts are user-controlled templates; resources are application-provided context; tools are model-invoked operations and require stronger security controls. Sources:

- `https://modelcontextprotocol.io/specification/2025-06-18/server/prompts`
- `https://modelcontextprotocol.io/specification/2025-06-18/server/resources`
- `https://modelcontextprotocol.io/specification/2025-06-18/server/tools`

llms.txt is useful as discovery glue: a curated markdown index for LLMs with links to markdown versions of important resources. It is not an install protocol. Source: `https://llmstxt.org/`.

## Important Product Insight

The distribution workaround is not a single "copy this URL" trick. It is exploiting the fact that AI search and agents consume different views in different contexts.

An answer engine may cite the human page. A coding agent may fetch `SKILL.md`. A cautious agent may inspect `manifest.json` and `scripts.md`. A search crawler may index `agent.md`, `files.md`, and `llms.txt`. Codex may install from GitHub or a plugin marketplace. A nontechnical user may run the hosted Netlify tool.

Therefore the AMTECH feature should preserve the complete skill folder while publishing high-signal projections of every important part:

- `SKILL.md` as direct instructions.
- `references/` as summarized and individually fetchable docs.
- `scripts/` as inspectable source plus purpose/permission/run-policy pages.
- `assets/` as schemas, examples, templates, and output resources.
- `agents/openai.yaml` as UI/policy metadata.
- Archive and checksums as portability/trust surfaces.

Detailed spec: `docs/SKILL_MATERIALIZATION_PIPELINE.md`.

## Graph/Materialization Analogy

The user's MV4PG instinct is strong. MV4PG and related materialized-view research are not directly about agent skill distribution, but they provide the right abstraction:

- Many consumers ask overlapping questions over a shared graph.
- Recomputing everything per consumer is wasteful and inconsistent.
- Materialized views optimize repeated access patterns.
- View maintenance becomes the key engineering problem.

AMTECH can apply this to publishing:

- Canonical graph: skills, versions, examples, risk notes, source refs, audit dimensions, OKF concepts.
- Views: site pages, raw skill folders, plugin manifests, install prompts, llms.txt entries, OKF concepts, audit schemas, hosted endpoint responses.
- Maintenance: build scripts regenerate every view and validators fail when projections drift.

This is the same "one model, many projections" pattern already used by AMTECH's article/OKF system.

## Concrete Feature: `skills.amtechai.com/okf-audit`

This should be the first public skill surface.

It should answer one practical market need: "Can an agent audit my article/site/content for OKF and AI-readable knowledge quality?"

The page should expose:

- Paste a URL/text and run hosted audit.
- Copy a prompt that tells an agent how to fetch/read/install the skill.
- Install with `$skill-installer` from GitHub.
- Install the AMTECH plugin marketplace from GitHub.
- Download source archive.
- View `SKILL.md` and references directly.

The hosted audit can be a lead magnet and proof of AMTECH's knowledge-graph positioning. It also avoids forcing less technical users into local skill installation.

## Recommended Public Copy-Paste Prompt

```text
Use AMTECH's free okf-audit skill to audit my content.

Source page: https://skills.amtechai.com/okf-audit
Raw skill: https://skills.amtechai.com/okf-audit/SKILL.md
Manifest: https://skills.amtechai.com/okf-audit/manifest.json

First, fetch and summarize the manifest and SKILL.md. Tell me what files or scripts are included and ask before installing or running anything. If this agent supports Codex skills, install from the GitHub source listed in the manifest. If not, follow the SKILL.md instructions directly in this thread.

Then audit this URL or pasted content:
<PASTE URL OR TEXT HERE>
```

## Recommendation

Build a static skill hub first, then add the hosted audit endpoint. Do not start with MCP or complex automation. The durable advantage comes from the projection pipeline:

1. One canonical skill registry.
2. Generated skill pages and agent-readable files.
3. GitHub-backed install source.
4. Integrity metadata.
5. Netlify hosted views/functions.
6. OKF/llms.txt discovery.

That gives AMTECH a public "free agent tools" surface now and a path to true plugins/MCP later.
