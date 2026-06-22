# Bootstrap syntax & context-injection tricks for maximally loadable skills — 2026-06-22

Research driving the M2 materialization upgrade: which markdown/path **syntax conventions** make a skill's
materialized bytes more reliably loaded, navigated, and bootstrapped by an agent — over a link, with `@`/path
affordances, or from disk. Grounded in the Claude Skills authoring guide + the agent-skills ecosystem, then
applied to `build-skills.ts` and the standard (`02`, `05`).

## The conventions (and what we adopted)

1. **Backtick paths = the navigable reference unit.** Agents (Claude Code, Cursor, Codex) treat a backtick-wrapped
   path/command as a recognizable, clickable/`@`-able reference; Claude Code's own convention is "reference code as
   `file_path:line_number` — it's clickable." **Adopted:** every file path in `use.md`/`SKILL.md` is backticked.
   - **Footgun:** a backtick *inline-code* span containing `!` triggers shell history-expansion when a host shells
     the token, and has broken skills on load (anthropics/claude-code#24510). **Adopted as a gate:**
     `authoring:no-shell-eval-backticks` (deterministic, over `SKILL.md` body + reference files). Fenced blocks are
     exempt (they aren't shelled as a token).

2. **One-level-deep reference pointers with explicit intent + when-to-load.** Anthropic's guide: keep references one
   level deep (deeper nesting → Claude `head -n` previews → incomplete reads), and make execute-vs-read intent
   explicit ("Run `analyze_form.py`" vs "See `analyze_form.py` for the algorithm"). **Adopted:** `build-skills.ts`
   projects a *Reference Files (progressive disclosure)* block into `use.md` — `Read [`path`](url)` /
   `Run [`path`](url) (execute it; do not just read it)` + the file's load policy. The link carries the canonical
   fetch URL (web-only agents follow it); the backtick path serves file/`@` hosts. One bullet per bundled
   reference/asset/script, generated from the registry (no hand-authoring, no drift).

3. **Progressive disclosure is the loading model, not a style.** Four stages: metadata advertises (~80–100 tok/skill,
   pre-loaded into the system prompt), `SKILL.md` body loads on relevance (< 500 lines), references load on demand,
   scripts execute without loading. **Already enforced** by the M1 gates (`body-under-500`, `refs-one-deep`,
   `refs-toc`); the pointer block makes stage-3 navigation explicit.

4. **Description triggers selection.** Third person, key terms, and "use when …" triggers decide whether the skill
   loads at all (it's the only thing pre-loaded). **Already enforced** (`routing/catalog-desc-*`,
   `desc-matches-registry`); `[[registry-description-source-of-truth]]`.

5. **`@`-mentions are a host affordance, not the canonical form.** Claude Code / Cursor / Codex can pull a file with
   `@references/x.md`. Useful but host-specific and not resolvable for a web-only agent. **Adopted:** keep the
   universal markdown-link + backtick form canonical; a `hosts/<host>.md` adapter may note the `@` shortcut
   additively (it never changes the signed `use.md`/`agent.md` bytes).

6. **Cautions we encoded as "don't":** no XML angle brackets in frontmatter (injection risk, and Anthropic rejects
   them in `name`/`description`); no Windows-style backslash paths; no time-sensitive text; consistent terminology.

## Why this is on-mission

The product is the link-delivered, certificate-verified skill standard ([[skill-standard-real-root]]). "More
bootstrap-able materialized bytes" = the *delivery* half of the thesis, the complement to the *trust* half
(behavior + capability). A skill that loads cleanly and navigates its own references reliably is a precondition for
the measured uplift M3–M5 will try to prove — and the loadability conventions are themselves recomputable gates, so
they ride the same "recompute it yourself" discipline as the rest of the CA.

## Sources
- [Skill authoring best practices — Claude API Docs](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices) (one-level-deep refs, execute-vs-read intent, TOC>100, descriptions, forward-slash paths, no XML in frontmatter, eval-driven dev).
- [Extend Claude with skills — Claude Code Docs](https://code.claude.com/docs/en/skills).
- [Agent Skills: Progressive Disclosure as a System Design Pattern (SwirlAI)](https://www.newsletter.swirlai.com/p/agent-skills-progressive-disclosure) (three-tier loading, token budgets, file-reference syntax).
- [anthropics/claude-code#24510 — backticks with `!` cause shell evaluation errors](https://github.com/anthropics/claude-code/issues/24510) (the backtick footgun the gate prevents).
- Related internal: `wiki/research/2026-06-22-skill-effectiveness-and-verification-enforced-quality.md`, `docs/skills/standard/05`, `docs/skills/standard/10`.
