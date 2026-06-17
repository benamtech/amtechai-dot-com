# Research: Codegraph Docs and Token Efficiency

Date: 2026-06-17

## Findings

- A practical codegraph should be a compressed navigation layer, not a full duplicate of the codebase. It should map routes, data flows, service boundaries, and ownership so agents can jump directly to the few relevant files.
- Current CodeGraph-style tools emphasize pre-indexed relationships (symbols, imports, call graphs, code structure) so agents avoid repeated repository-wide grep/read passes.
- Public reports claim large token savings from structured code graphs. One recent writeup reports a 47% input-token reduction and 58% fewer tool calls across seven repositories. Treat that as directional, not guaranteed for this repo, because results depend on repository size, agent behavior, and graph quality.
- AGENTS-style docs should stay short, structured, and operational. They reduce token use when they point agents to the correct files and conventions rather than restating implementation details.
- The best low-maintenance approach for this repo is a human-readable `docs/codegraph.md` plus focused references (`wiki/db-forms-endpoints.md`) that are updated whenever routes, forms, tables, or functions change.

## Recommended AMTECH codegraph shape

1. **Architecture at a glance:** app type, runtime, Supabase role, routing model.
2. **Route graph:** URL -> page -> feature folder -> conversion purpose.
3. **Data graph:** user action -> frontend handler -> Supabase table/storage -> Edge Function/external service.
4. **File ownership map:** where to edit pages, components, migrations, functions, shared clients, and docs.
5. **Agent usage notes:** short steps to avoid scanning the whole repo.

## Future improvements

- Add a generated JSON graph if the team starts using MCP/codegraph tooling locally.
- Track token/tool-call usage before and after codegraph adoption to verify savings in this specific repo.
- Keep graph entries concise; stale codegraphs cost trust and can increase agent work.

## Sources

- CodeGraph project pages describe local-first/queryable code knowledge graphs that expose code structure to agents instead of requiring repeated file scans: https://colbymchenry.github.io/codegraph/ and https://github.com/colbymchenry/codegraph
- Another CodeGraph implementation describes semantic graph support for functions, classes, imports, and call chains through MCP tools: https://github.com/codegraph-ai/CodeGraph
- Token-saving report with the 47% / 58% claim: https://toknow.ai/posts/codegraph-knowledge-graph-ai-coding-agents-fewer-tokens/
- AGENTS.md token-use best-practice article recommending short structured architecture/rule docs: https://www.konordo.com/blog/how-document-agentsmd-file-reduce-ai-token-usage-coding-agents
- GitHub engineering note on measuring token efficiency with token-usage artifacts: https://github.blog/ai-and-ml/github-copilot/improving-token-efficiency-in-github-agentic-workflows/
