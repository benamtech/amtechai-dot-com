# Status — M2 context-bindings + multi-surface + bootstrap-syntax loadability — 2026-06-22

Branch: `skill-ca-merkle-transparency` (local; **NOT pushed/released** — live `main` is still at authority seq 5).
Plan: `docs/memory/plan-2026-06-22--benchmarkable-skills-standard-estimate.md` (M2). Builds on the M0/M1 handoff
`status-2026-06-22--m0-standard-docs-m1-authoring-gates.md`. Research:
`wiki/research/2026-06-22-bootstrap-syntax-and-context-injection.md` (NEW).

## M2 — context-binding / host-adapter layer (DONE, GREEN)
The WorkOS "use the data the context already has" principle, projected per surface (standard/05).
- **registry.ts:** `estimate.contextBindings` = slots `rates`, `customer`, `tax_markup_rules`, each with a per-host
  source map (`generic` = ask the user, `hermes`, `claude-code`, `codex`). New declared+signed file
  `hosts/hermes.md` (role `reference`).
- **source/estimate/SKILL.md:** new host-agnostic `## Context` section (consume-then-ask; never invent a rate).
- **source/estimate/hosts/hermes.md:** names `./brain/business-brain.md` for rates + tax/markup rules, memory/thread
  for customer, and tells the agent to **write back** newly-learned rates.
- **source/estimate/agents/openai.yaml:** `default_prompt` gained the context-slot note (use what's in context;
  ask only for what's missing; never invent a rate).
- **build-skills.ts:** `contextSection()` projects a generic `## Context` block into `use.md`; `contextLine()`
  projects a one-line `Context:` note into `agent.md`. Both gated on declared `contextBindings` (absent ⇒ no
  section, so it stays additive — the other 3 skills are untouched). Host hint paths backticked.
- `hosts/hermes.md` is a source file ⇒ automatically served at `/files/hosts/hermes.md` + in the manifest with SRI
  (no special emit needed).

## Bootstrap-syntax loadability (Ben's ask: "syntax tricks → more bootstrap-able materialized info")
Researched the Claude Skills authoring guide + ecosystem; applied the universal, recomputable ones to ALL skills.
- **build-skills.ts `referencePointers()`:** `use.md` now projects a `## Reference Files (progressive disclosure)`
  block — each bundled reference/asset/script as `Read [`path`](url)` (or `Run … (execute it; do not just read
  it)` for scripts) + its load policy. Backtick path (navigable/`@`-able) inside a markdown link to the canonical
  fetch URL (web-only agents follow it), one level deep, explicit read-vs-execute intent.
- **NEW gate `authoring:no-shell-eval-backticks`** (`run-conformance.ts`): rejects an inline backtick code span
  containing `!` over SKILL.md body + reference files (shell history-expansion footgun, anthropics/claude-code#24510;
  fenced blocks exempt). Deterministic, recomputable. All 4 skills pass.
- **Standard docs:** `05` new "## Bootstrap syntax conventions (loadability)"; `02` authoring-checks note adds the
  backtick gate. Research note `wiki/research/2026-06-22-bootstrap-syntax-and-context-injection.md`.

## Tests (TDD)
- NEW `scripts/skills/__fixtures__/context-bindings.test.ts`: Context section/note present per declared bindings;
  hosts/*.md served + in manifest with SRI; Codex slot note; estimate hermes adapter names the brain + writes back;
  skills WITHOUT bindings grow NO Context section.
- `bootstrap-contract.test.ts`: + reference-pointer projection assertions (backtick path + link + Read/Run intent).
- `authoring-discipline.test.ts`: + no-shell-eval-backticks (body + ref-file fail cases; fenced-block exempt).
- Fixed a **pre-existing fragile test** (`verify-skill.test.ts` "forged STH signature"): it flipped the *last*
  base64 char, which can land in Ed25519 `==` padding bits and decode unchanged (no-op forgery) — surfaced by the
  new signature bytes. Now flips the FIRST char. Verifier itself was always correct.

## Verification / release state (COMMITTED + PUSHED to feature branches; lockstep)
Re-signed twice (Context section, then the host-path backtick fix). Final: authority seq **9**, catalog root
`322e22da…`, STH tree size **10** root `9cfc0227bed4c5ef…`, broadcast receipt **entry 4**
(`amtech:registry-state:amtech-skills-tree-10-9cfc0227bed4:…`). `npm run skills:check` green (**87 tests**, was 71),
`npm run typecheck` green, `skills:validate` green. Still `amtech-reviewed` (behavior tier not yet earned).

**Released 2026-06-22 via `skills:publish --execute --push` (atomic cross-repo, SSH-signed, lockstep):**
- Website `skill-ca-merkle-transparency`: feature commit `a4aefd0` (M0–M2) + provenance-pin commit `ec903db`
  (`SKILL_REPOSITORY_COMMIT` → `239190ab…`). Pushed `3a3edc4..ec903db`.
- Registry `skill-ca-v2-reconcile`: release commit `239190a` (mirrors source + certs + authority chain + STH +
  anchor + receipts; all `signed`; `validate.mjs --check` green). Pushed `a90753e..239190a`.
- **MERGED TO MAIN + DEPLOYED 2026-06-22** (lockstep merge commits, preserving the pin): registry PR #4 → main
  `a159ea3`, website PR #55 → main `4b0b720`. Netlify deployed; live `/.well-known/authority/sth.json` serves
  treeSize 10. LIVE-verified: `skills:verify https://amtechai.com/skills/estimate` →
  verified·amtech-reviewed·bootstrap pass·authoritySth pass·**seq 9**; live `use.md` carries the `## Context` +
  `## Reference Files` sections. Authority is now LIVE at **seq 9 / STH tree 10** (was seq 5).
- Proofs housekeeping: `sign-authority.ts` `rm`s + regenerates `proofs/` for the current tree size only
  (`proofs/10/` = 10 inclusion + consistency-from-{6,7,8,9}); all signed `sth/<n>.json` archives retained; proofs
  are recomputable. Correct/minimal, same as production — not data loss.

## Next (plan)
M3 (eval harness: `eval/cases.json` + deterministic `score-estimate.ts` + `run-eval.md` + `behavior.config.json`),
M4 (`behavior-verified` tier wiring), M4b (capability grant `deriveCapability`), M5 (run the benchmark in this
environment → sign real `behavior.json` → estimate becomes EV+), M6 (publish + live-verify).
Memory: `[[skill-ca-standard]]`, `[[skill-standard-real-root]]`, `[[skill-verification-enforces-effectiveness]]`.
