# Phase 1 Build Notes (Editorial Log)

Running log of what we actually built, the decisions made at the keyboard, and what the work taught us. Kept for the future article — these are the "show your work" details that make the eventual write-up real instead of reconstructed.

## What shipped in Phase 1

A non-destructive, dependency-free pipeline that projects the existing knowledge graph into an OKF bundle + agent-discovery surface, with validation gates wired in.

| Piece | File | Notes |
| --- | --- | --- |
| Typed read façade | `src/lib/knowledge/concepts.ts` | The single read model the plan promised. Normalizes `articleKnowledgeGraphNodes` → `OkfConcept[]`. Pure data, no React, so build scripts can import it. |
| Emitter (pure) | `scripts/okf/emit.ts` | Returns a `Map<path, content>` of all managed files. No FS writes — so the validator can re-emit in memory and diff. |
| Writer | `scripts/okf/build-okf.ts` | `npm run okf:build`. Cleans `public/okf/` then writes the file map. |
| Validator | `scripts/okf/validate-okf.ts` | `npm run okf:validate`. Freshness + conformance (C1–C5) + quality (Q1–Q6) + discovery (D1–D3). |
| Scripts | `package.json` | `okf:build`, `okf:validate`, `okf:check`. |

Output (committed under `public/`, copied verbatim into `dist/` by Vite):

- `public/okf/index.md` — bundle root, declares `okf_version: "0.1"`, lists articles + playbooks + topic groups.
- `public/okf/articles/*.md` — 8 published articles as concepts (`type: Article`, live `resource` URL).
- `public/okf/playbooks/*.md` — 39 planned nodes as concepts (`type: Playbook`, no `resource` yet).
- `public/okf/{articles,playbooks}/index.md` — sub-directory listings (no frontmatter, per the reserved-file rule).
- `public/sitemap.xml`, `public/robots.txt`, `public/llms.txt` — the agent/crawler discovery surface the SPA never had.

53 managed files total; build + production `vite build` + typecheck all green.

## Decisions made at the keyboard

- **Node 24 runs the TS directly.** `node scripts/okf/*.ts` works via native type-stripping, and `articleKnowledgeGraph.ts` is erasable TS. So Phase 1 added **zero dependencies** and is not coupled to the Vite/Netlify build — `build` stays untouched; the bundle is committed output. Reverting Phase 1 is deleting `scripts/okf/` and the generated files.
- **Emit to `public/`, not `dist/`.** Committing the bundle gives us OKF's intended attribution/history-via-git, makes it diffable in PRs, and lets Vite copy it to `dist/` for free. The trade-off — staleness — is exactly what the freshness gate guards.
- **Determinism over timestamps.** We omit per-concept `timestamp` rather than fake it with `Date.now()`. A faked timestamp would change every run and make the freshness diff meaningless (Q6). Real `dateModified` gets pulled in when we consolidate `ArticleDefinition` content.
- **Derived backlinks now, not later.** The plan slated backlinks for Phase 2, but they were cheap and made the bundle genuinely bi-directional, so concepts emit a `# Referenced by` section derived at build time. Entity-concept backlinks remain Phase 2.
- **Single source of truth for validation.** The validator imports the *same* emitter the writer uses, so "is it valid OKF" and "is the committed copy current" are answered by one code path. There is no second, driftable spec of the format.

## What the work taught us (the good part for the article)

**Building the validator immediately exposed a latent data gap.** The Q4 "no orphans" check flagged that **22 of 39 planned playbook nodes have no edges at all** — neither outbound (`connectsTo: []`, hardcoded by the `planned()` helper) nor inbound (no published article links to them). Meanwhile `docs/seo/AMTECH_MASTER_KNOWLEDGE_GRAPH.md` describes a confident three-way internal-linking rule ("link up to the workflow anchor, sideways to the city node, down to the subtype playbook").

So the linking doctrine was **authored in prose but never encoded in the data.** The graph *looked* connected in the narrative and was actually a hub-and-spoke of 8 connected anchors around a cloud of 22 islands. Nothing in the React app surfaced this, because the app only renders nodes the topic-groups happen to list. The moment we projected the same data into a format whose entire job is to make relationships explicit, the gap became a 22-line warning list.

That is the OKF thesis in miniature, and the spine of the future article: **a knowledge format does not add knowledge — it makes the absence of knowledge legible.** Entity SEO, information-gain SEO, and agent-readability all fail quietly in a prose-and-React system and fail *loudly* in a graph bundle. The forcing function is the point.

Action carried into the Phase-2 gate: the orphan playbooks must get real edges (encoded, not narrated) before Q4 is promoted from warning to hard error. That work belongs in the knowledge graph data, and is the natural first task of the agent-authorship loop (Phase 4) — exactly the "touch 15 files in one pass to fix cross-references" job Google's blog says LLMs are for.

## Run it

```bash
npm run okf:check        # build + validate (stage 2, hard quality)
npm run okf:validate -- --phase=1   # soften quality back to warnings
```

---

# Phase 2 Build Notes (Editorial Log)

## What shipped in Phase 2

Entities promoted to first-class concepts, which **resolved the Phase-1 orphan finding by construction**.

| Piece | File | Notes |
| --- | --- | --- |
| Entity registry | `src/lib/knowledge/entities.ts` | 26 curated entities: 10 Use Cases (UC1–UC10), 4 Places, 12 Industries. All grounded in fields the graph already carries. |
| Edge derivation | `entities.ts` → `deriveEntityEdgeIds()` | Maps a node's `uc` / `city` / `subtype` to entity concept ids. |
| Façade refactor | `src/lib/knowledge/concepts.ts` | Merges graph nodes + entities into one `OkfConcept[]`; body composition (`lead` + `summary`) moved here so the emitter is concept-agnostic. `ALLOWED_CONCEPT_TYPES` is now the single source for the type vocabulary. |
| Emitter | `scripts/okf/emit.ts` | New `use-cases/` and `entities/` directories + sub-indexes; root index gained "Use cases" and "Entities" sections. |
| Validator | `scripts/okf/validate-okf.ts` | Default stage is now **2** (hard quality); type vocab imported from the façade. |

Bundle grew from 53 → **81 managed files** (73 concepts + 5 `index.md` + 3 discovery). `okf:validate` → **0 errors, 0 warnings**. typecheck + production build green.

## The orphan fix — the satisfying part

Phase 1 flagged 22 orphan playbooks because the only edges in the data were the 8 published articles' hand-written `connectsTo`. Phase 2 did **not** hand-author 22 fixes. It encoded the *rule*: a playbook about a Phoenix solar installer (UC6) now links to the `Use Case: Quoting and takeoff`, `Place: Phoenix`, and `Industry: Solar` concepts automatically, because those edges are *derived* from the node's own `uc`/`city`/`subtype` fields. The master-graph's "link sideways to the city node, down to the subtype" rule went from prose to a 20-line function. Result: zero orphans, and the graph is now genuinely navigable in both directions (every Use Case page shows its referencing playbooks as backlinks).

**Article lesson:** the orphan warnings were not a content problem to be patched node-by-node; they were a *missing abstraction*. The entities were always implied by the data — promoting them to concepts made the implicit graph explicit. A knowledge format pressures you toward the right abstraction because it refuses to let the relationship hide in prose.

## Phase 3 foundation laid (not executed)

- `docs/okf/phase-3-schema.sql` — reviewable `concepts` / `concept_edges` / `concept_citations` schema with published-only RLS. Kept in `docs/` (not `supabase/migrations/`) so it is validated without risking accidental application.
- `docs/okf/06-phase-3-foundation.md` — the build-time-source-of-truth rule, the lossless `OkfConcept ↔ rows` mapping, and the cutover task list.
- New checks (`npm run okf:validate:phase3`): **G8** (schema present + shaped), **G9** (no service-role credentials anywhere in `src/`), **G7** (manual single-read-path reminder). All green.

## Run it (Phase 2 / 3)

```bash
npm run okf:check               # stage 2: 0 errors, 0 warnings
npm run okf:validate:phase3     # stage 3: + G8/G9 foundation gates
```

---

# Phase 3 + Prerender Build Notes (Editorial Log)

## What shipped

The two remaining big rocks: **prerender** (the open Phase-2 gate) and the **Phase-3 database**, both riding on a **content consolidation** that turned out to be the real keystone.

### Content consolidation — the move that unblocked everything

All 8 published articles were already `ArticleDefinition` objects rendered through one `ArticlePage` component — but the data was trapped inside `.tsx` files that import React, so the Node build could not read it. We extracted each object into a React-free module under `src/lib/knowledge/articles/` (programmatically, to avoid hand-copying ~1,500 lines) and made each page a thin wrapper:

```tsx
import ArticlePage from '../../components/articles/ArticlePage';
import { useArticleHead } from '../../components/articles/useArticleHead';
import { article } from '../../lib/knowledge/articles/<slug>';
export default function X() { useArticleHead(article); return <ArticlePage article={article} />; }
```

One change, three unlocks: full-fidelity OKF bodies (the `# Schema`/`# Examples`/`# Citations` sections are now real), per-page prerender content, and a lossless DB seed — all from one source. **Lesson for the article:** the DB cutover sounded like the hard part; the actual leverage was separating data from presentation. Most "we need a database" moments are really "our data is entangled with our rendering" moments.

### Prerender without SSR tooling

The app boots with `createRoot().render()` (client render, not hydrate). That one fact let us skip an entire category of work: `scripts/okf/prerender.ts` injects real content + a correct per-page `<head>` (title, description, canonical, OG, JSON-LD) into copies of the built `index.html`, and the SPA simply *replaces* `#root` on boot. Crawlers/agents get content and per-page metadata (the SPA shipped one shared title before); users get the React app. No hydration matching, no SSR bundle, no three.js-in-Node hazards. Runs as `postbuild`; Node 24 pinned in `netlify.toml` + `.nvmrc`.

### Phase 3 database — projection, not cutover

We deliberately chose **façade-as-source, DB-as-projection** (see `06-phase-3-foundation.md`). The schema is applied to the live project, seeded (73 concepts / 166 edges / 19 citations) via `okf:db:seed-sql` through the Supabase MCP, and `okf:db:verify` proves — through the **anon key** — that RLS exposes only the 8 published concepts and they match the in-code source. The DB is immediately useful (a public, queryable knowledge surface) without making the build depend on it.

**Lesson for the article:** "store it in a database" is not one decision. *Authoring* source, *serving* surface, and *build* input can each live in a different place. Forcing them to be the same table is how teams end up with a slow, fragile build that can't run offline. Keeping the authored source in version-controlled code and treating the DB as one more generated projection preserved determinism, offline builds, and the freshness gate — and the DB still does its real job (serving agents/apps a published API).

## Run it (Phase 3 DB)

```bash
npm run okf:db:seed-sql | <apply via service role / Supabase MCP>   # full refresh from source
npm run okf:db:verify                                              # anon parity + RLS check
```
