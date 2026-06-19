# Validation Pass: OKF Audit LinkedIn Post — 2026-06-19

Purpose: verify every factual claim in the LinkedIn post written in this session before the article draft is produced from the same material.

---

## What We Are Validating

A LinkedIn post was written based on a live OKF audit skill run during this session. The post made claims about:

1. The audit score (12/30)
2. The scoring framework (6 dimensions, 0–5 each, 30 total)
3. The score interpretation bands
4. The five concepts described (materialized views, entity graphs, OKF structure, discovery infrastructure, skill portability)
5. The skill-sharing pipeline mechanism

---

## Claim-by-Claim Findings

### Claim: "scored it 12 out of 30"

**Status: Valid but category labels were improvised.**

The 0–30 scale is correct per `references/okf-audit-rubric.md`. The score of 12 is a plausible audit result for that article. However, the six dimension labels used in the LinkedIn post were not the actual rubric categories.

**LinkedIn post used:**
- OKF readability
- Agent-readability
- Entity coverage
- Citations / trust
- Links / discovery
- Materialized views

**Actual rubric categories (from `okf-audit-rubric.md`):**
1. First-Fetch Clarity
2. Concept Packaging
3. Entity And Relationship Coverage
4. Source And Citation Quality
5. Materialized Views
6. Agent Execution Readiness

The improvised labels in the post are close analogues, not exact matches. The article draft should use the actual rubric category names.

---

### Claim: "26-30: agent-native and strong" and "0-7: not agent-ready"

**Status: Verified exact.** Sourced directly from `okf-audit-rubric.md` lines 88–93.

Full bands:
- 26–30: agent-native and strong
- 20–25: usable with targeted fixes
- 14–19: promising but incomplete
- 8–13: human-readable but weak for agents
- 0–7: not agent-ready

The score of 12 places the garden-center article in the "human-readable but weak for agents" band, consistent with what the post described.

---

### Claim: "No plugins. No custom integrations. Just URLs, structured text, and an agent that could read both."

**Status: Verified.** The skill was fetched from `https://amtechai.com/skills/okf-audit` using WebFetch and applied in context. The article was fetched from `https://amtechai.com/articles/garden-center-spring-buy-plan-ai` using WebFetch. No plugins, MCP tool beyond WebFetch, or custom integrations were used.

---

### Claim: Materialized views = "database architecture concept where pre-computed query results are served instantly"

**Status: Technically accurate.** Materialized views are a real database term — a stored query result refreshed on a schedule. The web content analogy (JSON-LD as pre-computed semantic answer) is an AMTECH framing, not an industry-standard equivalence. The article should label it as such.

---

### Claim: "Agents don't read content as a document. They traverse it as a graph."

**Status: Directionally accurate, requires nuance.** Large language models process tokens sequentially, not as graph traversal. However, the broader claim — that well-linked, entity-named content is more useful to agents than isolated prose — is well-supported by knowledge graph literature (Hogan et al. 2020, Ji et al. 2020) and Google's AI features documentation. The claim is a useful simplification, not a precise technical statement about model internals.

---

### Claim: OKF structure means "the conclusion comes first"

**Status: AMTECH interpretation, not the OKF spec.**

Google's OKF v0.1 spec (verified via the Cloud blog) is a format standard about how to package knowledge (markdown files, YAML frontmatter, `type` field). It does not prescribe editorial rules about conclusion placement. The "front-load the answer" rule is AMTECH's editorial doctrine (derived from our OKF readability dimension) applied on top of the format. The article should distinguish these.

---

### Claim: "npm for agent behaviors"

**Status: Metaphor only.** No such standard exists. Valid as an analogy but should not be stated as a real protocol or ecosystem. The article should not use this framing.

---

### Claim: URL/title mismatch (slug is "garden-center-spring-buy-plan-ai" but title is about all retailers)

**Status: Verified.** The article title in `src/lib/knowledge/articles/garden-center-spring-buy-plan-ai.ts` is "How Independent Stores Use AI to Turn Three Seasons of Sales Data Into Better Owner Decisions." The slug references garden centers but the article explicitly covers garden centers, hardware stores, salons, bakeries, flower shops, and contractors. Real mismatch confirmed.

---

### Claim: Zero links detected in the article

**Status: Confirmed with a caveat.** The article has no external citations (citations array is empty in the ArticleDefinition). However, it does have three `internalLinks` defined in the ArticleDefinition. These are rendered client-side in the React page — a non-executing agent or WebFetch call would not find them in the first-fetch surface. The claim is accurate for the agent-fetch context.

---

### Claim: No author, no date in the first-fetch surface

**Status: Confirmed for the WebFetch surface.** The ArticleDefinition has `authorName: 'AMTECH AI'` and `datePublished: '2026-06-18'` but these are rendered via React — invisible to agents that fetch the prerendered HTML or the static surface. The claim is accurate.

---

## Summary

| Claim | Verdict |
|---|---|
| 12/30 score | Valid; category labels improvised |
| 6 dimensions × 5 = 30 | Valid scale; actual category names differ |
| Score bands | Exact match to rubric |
| No plugins or integrations needed | Verified |
| Materialized views from DB architecture | Technically accurate; web analogy is AMTECH framing |
| Agents traverse content as a graph | Directionally accurate simplification |
| OKF puts conclusion first | AMTECH doctrine, not OKF spec |
| npm for agent behaviors | Metaphor only; not a real standard |
| URL/title mismatch | Verified |
| Zero links in agent-fetch surface | Accurate for non-executing agent |
| No author/date in agent-fetch surface | Accurate for non-executing agent |

---

## Corrections Needed For The Article Draft

1. Use actual rubric category names: First-Fetch Clarity, Concept Packaging, Entity And Relationship Coverage, Source And Citation Quality, Materialized Views, Agent Execution Readiness.
2. Label the materialized-views-as-JSON-LD equivalence as an AMTECH framing, not a universal standard.
3. Qualify the "agents traverse as a graph" claim: well-linked, entity-named content performs better for agents, but this is not literal graph traversal inside the model.
4. Keep "conclusion comes first" as AMTECH's OKF readability doctrine, not a claim about what the OKF spec requires.
5. Drop "npm for agent behaviors" from any informational article — keep it as LinkedIn metaphor only.
6. Acknowledge that the garden-center article's internal links exist in the React layer and are invisible only to non-executing agents.
