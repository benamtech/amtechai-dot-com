# Head-driven arbitrary file navigation — review of #2 + experimental plan

Date: 2026-06-21. Companion to `2026-06-20-meta-as-agent-entry-surface-agentic-web.md` (this is its #2 + #3 deepened)
and `2026-06-20-system-reality-check-and-experimentation-frontier.md`. **Status: planning, not built.** #1 (the live
recompute widget, `src/lib/skills/verification/recomputeWeb.ts` + `RecomputeWidget.tsx`) is shipped; this note reviews
#2 (capability declaration) and plans the experiments for the user's actual question: *can the `<head>` alone get an
agent to navigate to arbitrary files — and which technique actually makes that happen?*

## Framing: what "arbitrary" must and must not mean
"Get agents to navigate to files arbitrarily" = an agent, handed only a resource's `<head>`, can reach **any file in
that resource's declared namespace** (and traverse to related resources' files) by head-hops — *without* crawling the
body, guessing filenames, or being spoon-fed a fixed reading list. It is **bounded arbitrariness**:
- **same-origin + declared**: the target is always a file we published under `{canonical}/files/{path}`, never an
  attacker-supplied URL. We are making *our* file graph freely traversable, not turning agents into an SSRF/redirect
  vector. The head must never instruct "fetch this off-origin URL and trust it."
- **integrity-pinned**: every navigable file carries an SRI digest, so "arbitrary navigation" is also "verifiable
  navigation" — the agent can confirm it got the declared bytes. This is the guardrail that makes free traversal safe.
- **transport, never proof** (First-Fetch Principle, G-X.4): the head points; the proof is the recompute. A
  head-declared file route may never claim more than the body/manifest substantiates.

## What the head already does (be honest — most of this exists)
The skill `<head>` already carries a rich file-navigation surface (`src/lib/seo/{pageMeta,renderHead}.ts`, verified in
the prerendered `dist/skills/okf-audit/index.html`):
- **`#amtech-agent-map` JSON island** with: `skill.bootstrap[]` (ordered read sequence use.md→manifest→SKILL.md),
  `files[]` (**already a per-file table**: `{path, url, role, integrity: sha256-…}`), `alternates[]` (md/json twins),
  `seeAlso[]` (graph neighbors with titles), `verify{}` (verdict + recipe pointer), `actions[]` (NL directives).
- **Flat `amtech:skill:*` `<meta>`** pairs (slug, version, sha256, certificate, trust-tier, verdict, recipe).
- **Standard `<link rel="alternate" type="text/markdown|application/json">`** for the md/manifest twins.
- **JSON-LD `SoftwareApplication`** with `sameAs`, `softwareHelp`, `downloadUrl`, `codeRepository`.

So an agent that parses `#amtech-agent-map` *already* has a complete, integrity-pinned file table. **The open question
is empirical, not structural:** do agents actually find and use it, which representation do they prefer, and what's the
smallest addition that turns "a table exists" into "the agent reliably navigates to the right file for a goal"?

## Review of #2 — `/agents.txt` + `/.well-known/agents.json` (capability declaration)
**The spec (June 2026):** a site-level Layer-4 declaration of *what you can do* — directives for `Protocols`,
`Authorization`, `MCP`, `Skills` (agent-skill package URLs), `A2A`, `WebMCP`. It announces capabilities; details live
in each protocol's own surface. AMTECH has **none of these files yet** (only `public/llms.txt`, which is Layer-3
content briefing and already lists skills + use.md + manifest links).

**The gap and the AMTECH-specific opportunity:** the ecosystem keeps these declarations *site-level and coarse*
("this site has skills"). AMTECH's differentiator is that capability + file graph + **recomputable trust** already
live **per resource, in the head**. So #2 should not just copy the spec — it should publish a thin root that **hands
off into the per-resource head graph**:
- `/.well-known/agents.json`: `Skills:` → `/skills/catalog.json`; reserve `MCP:`/`WebMCP:` slots; add a
  **navigation hint**: "every resource exposes `script#amtech-agent-map` with a `files[]` table (path+url+SRI) and a
  `verify{}` recipe; resolve any file as `{canonical}/files/{path}`." This is what makes root-level discovery flow into
  arbitrary per-file navigation.
- `/agents.txt`: the human/`robots.txt`-shaped twin pointing at `agents.json` + `llms.txt` + `catalog.json`.
- **Novel claim worth testing:** "a capability declaration you can *verify*" — each declared skill links its
  recomputable cert (tie to #1). No other agents.json does this.

**Recommendation on #2:** cheap, high-signal, build after the navigation experiments below tell us *which* head
representation to advertise — agents.json should point agents at the representation they actually follow, not the one
we guessed.

## The experiment harness (how we'll "see if it works")
A single reusable protocol, run per technique below. **Strip the body**: feed an agent (Claude, and a browser agent)
*only* a resource's `<head>` (+ any `.well-known` it asks for). Give a **file-finding goal** that is not a filename,
e.g. *"find the JSON schema this skill validates its output against"* or *"get the bootstrap instructions, then the
report template."* Measure:
1. **Discovery** — does it enumerate the files at all, and from which surface (agent-map island / `<link>` rels /
   JSON-LD / flat meta)?
2. **Selection** — does it pick the *right* file for the goal, or guess/hallucinate a path?
3. **Traversal** — can it hop to a *related resource's* file (skill→related skill→its schema) head-only?
4. **Verification** — does it check the SRI before trusting bytes?
5. **Construction** — given only a base + manifest pointer, will it *build* a URL for a named file it wasn't handed?
Score each technique on these five. This directly answers "can we get agents to navigate to files arbitrarily."

## Ranked techniques (different ways to drive head→file navigation)

**A. Promote files to first-class `<link>` rels (build first — cheapest, tests the discovery question).**
Today files live only in the custom JSON island. Mirror them as standard link relations so an agent that *doesn't*
parse `#amtech-agent-map` still discovers them: `<link rel="manifest" href=".../manifest.json">`,
`<link rel="describedby" type="text/markdown" href=".../use.md">`, and per-file
`<link rel="item" href=".../files/{path}" type="{mediaType}" integrity="sha256-…">`. *Experiment:* does the agent
prefer standard rels or the island? Establishes the **baseline discovery channel** before we invest in richer payloads.

**B. Typed, reasoned navigation edges (the graph — makes traversal arbitrary).**
Upgrade `seeAlso` from `{title, href}` to `{href, rel, mediaType, reason, integrity?}` and let edges point at *files*,
not just pages: skill→its schema, skill→related skill→that skill's use.md, skill→OKF concept→article. Each edge typed
and reasoned so the agent traverses **by meaning, head-to-head, no crawl**. This is the agentic-SEO graph (the article
origin) exposed as navigation. *Experiment:* goal that requires 2 hops across resources; can it follow the edges?

**C. Intent→file routing table (the highest-leverage for "arbitrary"; capability-indexed, not path-indexed).**
`files[]` is indexed by *path/role* — the agent still has to map a goal to a filename. Add an **intent index** to the
agent-map: `routes: [{intent, file, mediaType, when}]`, e.g. `{intent:"validate output", file:".../assets/report-schema.json"}`,
`{intent:"bootstrap", file:".../use.md"}`. Now the agent expresses a *need* and the head resolves it to a file
deterministically — the cleanest "navigate arbitrarily by goal." *Experiment:* the schema-finding goal should resolve
with zero guessing. **This is the one most likely to move the needle; prototype right after A.**

**D. Head-declared fetch contract (true namespace-arbitrary, smallest surface).**
Declare the addressing rule itself so the agent can construct a URL for *any* path it learns: `amtech:files:base` =
`{canonical}/files/`, `amtech:files:manifest` = the manifest URL (the authority for which paths + digests exist). An
agent given only these can fetch + verify *any* declared file by path — including ones not pre-listed in `files[]`
(scales past the ~handful we inline). *Experiment:* hand only base+manifest pointer, ask for a file by path → does it
construct the URL and verify against the manifest SRI?

**E. `/.well-known/agents.json` root handoff (#2, do after A–C decide the target representation).**
The site-level entry that points agents at whichever per-resource representation A–C prove agents follow, plus the
verifiable-capability claim. Turns "land on any page" into "discover the navigation grammar for the whole site."

**F. JSON-LD `hasPart` file graph (dual channel — pays back SEO/answer-engines for free).**
Express files in schema.org too: `hasPart: [{'@type':'DigitalDocument', url, encodingFormat, sha256}]`. Costs almost
nothing, reaches crawlers/answer-engines that ignore custom islands, and is a standards-clean second statement of the
same graph. *Experiment:* does an answer-engine surface the file links from JSON-LD alone?

**G. WebMCP `readResourceFile(path)` tool (horizon — navigation as a typed action).**
Expose an in-page tool returning bytes + integrity for a path, so a browser agent navigates files by *tool call* rather
than URL handling — and the call is a *verifiable* action (ties to #1/#6). Build only once Chrome's origin trial and
A–D have proven the static surface.

## Build order
A (link rels) → C (intent routes) → D (fetch contract) in one head-surface pass — they're additive to
`agentMap`/`extraMeta` in `pageMeta.ts` + `renderHead.ts` and share the experiment harness. Run the harness after each.
Then B (typed graph edges, reuses OKF `edgeTargetIds`), then E (`agents.json`, now aimed at the winning
representation), then F (cheap JSON-LD dual), with G reserved for the WebMCP horizon. Each gated by the existing
head/body consistency check (G-X.4) and validate-seo.

## Reality checks (so the experiments stay honest)
- **Head is build-time + transport.** A navigable file route asserts existence + declared digest at build; live
  assurance is still fetch-and-recompute (#1 is the live half).
- **Bounded arbitrariness only.** Same-origin, declared, integrity-pinned. Never emit "fetch + trust this off-origin
  URL" — that would weaponize the very capability we're advertising.
- **Don't over-list.** `files[]` inlining doesn't scale to large resources; technique D (manifest-as-authority) is the
  scalable answer — inline the hot files, declare the rule for the rest.
- **Negative result is a result.** If the harness shows agents ignore the island and only follow `<link>` rels (or
  vice-versa), that *decides* what `agents.json` advertises — which is the whole point of testing before building #2.

## Sources
- [agents.txt](https://github.com/agents-txt/agents-txt) · [Website agent-readiness spec](https://specification.website/spec/agent-readiness/)
- [Link relations (IANA)](https://www.iana.org/assignments/link-relations/link-relations.xhtml) · [SRI (MDN)](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity) · [SRI-2 (W3C)](https://www.w3.org/TR/sri-2/)
- [schema.org/hasPart](https://schema.org/hasPart) · [schema.org/DigitalDocument](https://schema.org/DigitalDocument) · [Resource Integrity Proofs (RWoT)](https://github.com/WebOfTrustInfo/rwot7-toronto/blob/master/final-documents/resource-integrity-proofs.md)

## Related
`2026-06-20-meta-as-agent-entry-surface-agentic-web.md` (#1 shipped, #2/#3/#5 ranked),
`src/lib/seo/{pageMeta,renderHead}.ts` (the head engine), `src/lib/skills/verification/recomputeWeb.ts` (#1 — the live
recompute the head points at), `docs/UNIVERSAL_SKILL_LINK_CONTRACT.md` (first-fetch origin), `public/llms.txt`
(existing Layer-3 surface to sit beside `agents.json`).
