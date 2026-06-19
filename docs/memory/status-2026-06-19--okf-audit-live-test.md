# Status: OKF Audit Live Test + Article Pipeline — 2026-06-19

## What Happened This Session

A live end-to-end test of the AMTECH skill-sharing pipeline ran in Claude Code during a user conversation.

**The sequence:**
1. User asked Claude to fetch the skill at `https://amtechai.com/skills/okf-audit` and run it.
2. Claude (Claude Code / Sonnet 4.6) fetched the skill page using WebFetch, parsed the audit rubric from the response, then fetched `https://amtechai.com/articles/garden-center-spring-buy-plan-ai`.
3. Claude ran the OKF audit against the garden-center article and returned a structured report.
4. Score: **12/30** — "human-readable but weak for agents" per the rubric bands.
5. User asked for a LinkedIn post. Post was drafted covering: materialized views, entity graphs, OKF structure, discovery infrastructure, skill portability.
6. Validation pass written (see `validation-2026-06-19--okf-audit-linkedin-post.md`).

## Key Finding From The Live Test

The skill-sharing pipeline works as designed. An agent with no prior configuration fetched a skill from a public URL and executed it successfully. No plugins, SDKs, or custom integrations were required.

The garden-center article scored 12/30 because:
- First-fetch surface (WebFetch, non-executing) shows no author, no date, no structured data
- Internal links exist in the React layer only — invisible to non-executing agents
- No citations in the article
- Article scope mismatches the URL slug
- Content quality is good; infrastructure is the gap

## Validation Findings (Summary)

One significant correction: the LinkedIn post used improvised dimension labels. The actual rubric has six categories with different names. The article draft must use the real names.

Full details: `validation-2026-06-19--okf-audit-linkedin-post.md`

## What Needs To Happen Next

- [x] Validation pass written
- [ ] `npm run skills:validate` run to confirm skill pipeline is still green
- [ ] Codegraph updated with new article draft entry
- [ ] Article draft written to `docs/article-drafts/`
- [ ] (Optional) Rerun OKF audit on the garden-center article with corrected rubric categories for accuracy record

## Article Draft To Be Written

**Working title:** What AI Agents See When They Read Your Website: An OKF Content Audit in Practice  
**Proposed slug:** `what-ai-agents-see-when-they-read-your-website`  
**Category:** strategy  
**Audience:** Founders, content operators, SEO strategists, and technical marketers who publish educational content and want it to be useful to AI agents and AI search systems.  
**Primary entity:** OKF Audit (method)  
**Key entities:** Open Knowledge Format, materialized views, entity graph, agent-readable knowledge, JSON-LD, First-Fetch Clarity

The article should use the actual rubric dimensions, not the improvised LinkedIn post labels.
