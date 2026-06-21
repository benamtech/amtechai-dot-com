# Meta as the Agent-Entry Surface — agentic-web grounding + novelty frontier

Date: 2026-06-20. Companion to `2026-06-20-system-reality-check-and-experimentation-frontier.md`. Focus: the
experimental use of the `<head>`/meta as a machine surface, grounded in the **real AMTECH business arc** and the
**emerging agentic-web standards**, plus the novel edge-case uses worth prototyping.

## The real business arc (what actually happened — keep this honest)

1. **Origin: materialization for agentic SEO of *articles*.** AMTECH's article/OKF system takes one canonical
   concept and materializes it into many honest agent-readable surfaces — HTML page + a `.md` twin (`/articles/
   <slug>.md`) + an OKF projection (`/okf/articles/<slug>.md`) + JSON-LD + an `amtech-agent-map` head island +
   `llms.txt` entries. The point was **SEO that works for agents and answer engines**, not just keyword crawlers.
   This is live and valuable on its own (`src/lib/seo/pageMeta.ts` + `renderHead.ts` + `scripts/okf/`).
2. **Spread: the same engine → skills.** A skill folder is the same shape — materialize it into page + `use.md` +
   `agent.md` + `manifest.json` + raw files + archive + agent-map → **usable-by-link skills, no install**
   (`https://amtechai.com/skills/okf-audit` is the live testament; usable via the link *independent of any
   certificate*).
3. **Newest axis: skill *security* (the CA).** Because a resource *follows the materialization standard* it can
   carry a recomputable certificate → the verifiability axis on top of the same surfaces.

**The backbone is the materialization/projection pipeline** (`pageMeta` → `renderHead` + the `.md`/OKF twins +
`agent-map`), validated by drift-checks. It already serves three business needs — **SEO (articles), delivery
(skills), and trust (security)** — with one engine. The meta-experimentation below is about making that engine's
output the richest possible **agent-entry surface**, which compounds all three.

## The agentic web is converging — and AMTECH already sits at the intersection

External signal (June 2026):
- **llms.txt** (Layer 3, "what the content is") is now audited in Chrome **Lighthouse → "Agentic Browsing"**
  category — Google gathering data while standards form.
- **agents.txt / agents.json** (Layer 4, "what you can *do*"): a protocol-agnostic site-level capability
  declaration with directives for `Protocols`, `Authorization`, `MCP`, **`Skills` (agent skill package URLs)**,
  `A2A`, `WebMCP`. It announces *which* capabilities exist; details live in each protocol's own surface.
- **WebMCP** (Chrome 149 origin trial, May 2026): expose structured JS functions + annotated HTML so a browser
  agent executes tasks in-page — "the page IS the API."
- **Resource Integrity Proofs (RIP)** + **SRI-2**: decouple integrity from link/resource syntax so **any
  representation of a resource is verifiable from any link** (id + proof.type + multiDigest; integrity +
  discoverability + scheme-agility).
- **VET / Web Proofs** + **ZK verifiable inference**: verifiable *execution traces* for agent tool-calls; the
  research frontier for behavioral/compute proofs.

**The insight:** the ecosystem is splitting these across *separate site-level files* (llms.txt, agents.txt, MCP
endpoints, SRI attributes). AMTECH already unifies them **per resource, materialized into the head/surfaces, and
recomputable**:
| Ecosystem layer | AMTECH's per-resource equivalent (already shipped) |
| --- | --- |
| llms.txt (content brief) | agent-map `summary` + the prerendered body + `.md` twin |
| agents.txt `Skills`/capabilities | agent-map `skill`/`verify`/`files` blocks; Tier-1 `amtech:skill:*` meta |
| WebMCP (in-page actions) | the recipe + verifier as a *recomputable* action (not yet a WebMCP tool) |
| SRI / RIP (verify any representation) | `sourcePackage` + per-file SRI + catalog root + the `04` multi-entry verifier |
| Web Proofs / VET (verifiable execution) | `recipe.json` (graph-replay); consumer re-derivation = the open rung |

So AMTECH's novelty is a **verifiable, navigable, materialized resource** whose head is a complete agent-entry
contract — content + capability + navigation + *self-executing proof* — for **any** resource (articles today,
skills today, datasets/pages next), not a single site-level file.

## Novel experimental meta uses (ranked; verification + beyond)

**1. The head as a recompute kit — and a live in-browser recompute (build now, "A").** The head already carries
`amtech:skill:recipe` + the cert/manifest/catalog pointers. Ship a client-side WebCrypto recompute on the page (a
"Verify this yourself" control) that re-derives the verdict from the published surfaces and shows each step
pass/fail. Proves the thesis visibly: a re-renderer can't fake "verified," it must recompute. *Experimental edge:*
test whether an agent handed only the **head** can recompute the verdict without loading the body (Tier-3
empirical test).

**2. Resource-level capability declaration that carries its own proof (publish `/agents.txt` + `/agents.json`).**
Become a first-class Layer-4 citizen: a site `/agents.txt` with `Skills:` → the catalog, and `WebMCP:`/`MCP:`
slots reserved. But go further than the spec — AMTECH's *per-resource* agent-map is a granular capability
declaration **with a recomputable trust tier attached**. Novel claim: "capability declaration you can verify."

**3. Navigation graph in the head (agentic site-nav without crawling).** The agent-map `seeAlso` edges already
carry knowledge-graph neighbors *with reasons*. Push it so an agent traverses the materialized graph by
head-hops: skill → related skills → OKF concepts → articles, each edge typed and reasoned. This is the
agentic-SEO graph (the article origin!) exposed as a **navigable agent surface** — directly reusable on
non-skill pages.

**4. Skill-as-data / skill-as-tool duality as a machine policy.** The body decision tree (use-in-context vs
install vs hosted) becomes a small machine-readable policy in the head, so an agent *deterministically* picks the
mode given its capabilities (web-only / file-capable / native-install / WebMCP).

**5. Consumer-side re-derivation as a Web-Proof-shaped trace (the "B" experiment).** `09` defines the consumer
verdict format; the agentic web is independently inventing VET/Web-Proofs for the same need. Publish a **skill
conformance challenge** (input + an expected output *schema*, not a fixed answer); a consumer runs the skill on
its own model; a deterministic checker emits `{verdict, tier:'consumer-replay', checkedAt, reasonCodes[]}` — *the
consumer's own* verdict, which the CA never signs. Extends determinism from structure → behavior, and slots into
the emerging verifiable-execution standards.

**6. WebMCP bridge (horizon).** Expose `verify` and `use-skill` as in-page WebMCP tools so a browser agent runs a
*verifiable* action. The static recipe becomes a registered tool — AMTECH's materialization meeting Chrome's
in-page agent execution.

## Reality check on limits (so we don't over-claim in the head)
The head is **transport, never proof** — every claim falls under the head/body consistency gate (G-X.4) and may
never exceed the recomputed verdict. Meta is reinforcement, never the only channel (First-Fetch Principle). A
head-level verdict is build-time (`checked-at`); live assurance still requires re-running the recipe. None of this
proves AI *behavior* (that's the reserved `behavior-verified` rung) — only that the materialized surfaces are
authentic and recomputable.

## Recommendation
Build **#1** now (the live recompute widget) — it makes the whole thesis undeniable and is self-contained. Then
**#2** (`/agents.txt` + `/agents.json`) as a cheap, high-signal agentic-web citizenship move that also advertises
the catalog. Prototype **#5** (consumer challenge) as the conceptually richest meta experiment. **#3** (navigation
graph) is the one that pays back the *article/SEO* origin most directly and should be tried on non-skill pages.

## Sources
- [agents.txt](https://github.com/agents-txt/agents-txt) · [llms.txt 2026 guide](https://limy.ai/blog/llms.txt-in-2026-the-full-guide) · [Google adds llms.txt to Lighthouse](https://ppc.land/google-adds-llms-txt-to-lighthouse-as-agentic-web-standards-heat-up/) · [Website agent-readiness spec](https://specification.website/spec/agent-readiness/)
- [Resource Integrity Proofs (RWoT)](https://github.com/WebOfTrustInfo/rwot7-toronto/blob/master/final-documents/resource-integrity-proofs.md) · [SRI-2 (W3C)](https://www.w3.org/TR/sri-2/) · [SRI (MDN)](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity)
- [VET: Verifiable Execution Traces (arXiv 2512.15892)](https://arxiv.org/pdf/2512.15892) · [ZK verifiable inference (arXiv 2511.19902)](https://arxiv.org/pdf/2511.19902)

## Related
`docs/skills/standard/05` (multi-surface + head delivery), `09` (graph-replay + consumer re-derivation),
`docs/UNIVERSAL_SKILL_LINK_CONTRACT.md` (first-fetch origin), `src/lib/seo/{pageMeta,renderHead}.ts` (the engine).
