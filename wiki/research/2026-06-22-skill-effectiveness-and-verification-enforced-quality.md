# Skill Effectiveness, and Making Verification *Enforce* It — deep research

Date: 2026-06-22. Driver (Ben): the standard's whole claim collapses unless **a verified skill is actually more
effective at completing tasks than its prompt-only counterpart** — and that must hold whether an agent
*bootstraps/downloads* the skill or a human just *pastes the registry link*. Today our verification proves
authenticity/provenance/structure (`docs/skills/standard/09`), not effectiveness. This note gathers the current
ecosystem wisdom on what makes a skill effective, the empirical evidence that it does, and **how to bind
effectiveness to the certificate** so "verified" comes to mean "measurably better than the prompt."

Sources at the bottom. Pairs with `09` (ladder), `02` (cert/attestation), `04` (verifier), and the business
notes `docs/memory/notes-2026-06-22--product-goals-and-skills-hermes-integration.md`.

---

## 0. The one-line thesis upgrade

> `signed` proves *who*. `structure-verified` proves *shape*. `amtech-reviewed` proves *process*.
> **None proves the skill helps.** The rung that makes the business true is **`behavior-verified` defined as a
> measured uplift over the prompt-only baseline** — and that measurement is exactly the eval loop the whole
> ecosystem now converges on. We should make it the load-bearing tier, not a reserved non-goal.

The good news from the literature: **effectiveness is real, measurable, and reproducible-ish** — which means it
can be attested under the same envelope we already sign.

---

## 1. The empirical case (this is the killer evidence)

**SkillsBench** (arXiv 2602.12670, recomputed 2026-06-16) ran 84 tasks × 11 domains × 5 trials × 7 model-harness
configs (7,308 trajectories), each task under **three conditions: no-skill / curated-skill / self-generated-skill**.

- **Curated skills: +16.2pp average pass rate** (range +13.6 to +23.3pp across configs). They *work*.
- **Self-generated skills: −1.3pp — no benefit.** "Models cannot reliably author the procedural knowledge they
  benefit from consuming." → **This is the economic case for a certificate authority.** A curated, reviewed,
  verified skill beats both the bare prompt *and* the skill the model would write for itself. Curation is the
  value; verification is what makes curation trustworthy at a distance.
- **Smaller model + skill > larger model alone:** Haiku+skills 27.7% ≈ Opus baseline 22.0%. A verified skill is
  a cheaper-model multiplier — directly relevant to the Hermes cost model (`config.yaml` runs Opus for the
  supervisor, Haiku for background; a great skill lets cheaper models punch up).
- **Skills can HURT:** 16/84 tasks showed negative deltas; **comprehensive/long skills −2.9pp** vs
  **moderate-length +18.8pp**; **2–3 skills +18.6pp** vs **4+ skills only +5.9pp**. Effectiveness is not
  monotonic — bloat and over-bundling actively degrade. A standard that certifies "more" without measuring
  uplift would certify *harm*.

**Normalized gain** they use (worth adopting verbatim as our metric):
```
g = (pass_with_skill − pass_vanilla) / (1 − pass_vanilla)
```
Reports proportional improvement toward perfect, separating genuine scaffolding from ceiling effects. We should
sign **both** the absolute Δ (pp) and `g`.

**The adherence problem** (SkillsBench + "in the wild" arXiv 2604.04323): agents often *acknowledge a skill then
implement independently* (Codex "neglects provided skills"); performance degrades as settings get realistic; and
there are **two distinct failure modes** — **discovery** (didn't load it) vs **execution** (loaded, used it
wrong). Explicit "use this skill" instruction yields *dramatically* higher success than autonomous discovery.

---

## 2. The synthesis of "what makes a skill effective"

Merging the WorkOS/TanStack conference notes (Ben's), Anthropic's official best-practices doc, and the benchmark
papers. Grouped by where the leverage is.

### 2a. Discoverability / routing — the description is the product
- **The description decides whether the skill loads at all.** Anthropic: it's injected into the system prompt;
  Claude picks among 100+ skills from descriptions alone (≈100 tokens/skill at startup). Conference Tip #9 +
  "in the wild" both rank **description quality > body quality** because "the best skill is useless if it never
  loads."
- **Rules that work:** third person ("Processes X", never "I/you can"); ≤1024 chars; state **what it does AND
  when to use it**; embed **natural trigger phrases users actually say** ("review this repo", "roast this repo",
  "audit this codebase" — conference Tip #5); specific > generic.
- **Discovery vs execution are separate gates** — a skill can route perfectly and still be used wrong, or be
  excellent and never load. Verification has to cover both, see §3.

### 2b. Information architecture — progressive disclosure
- **Three levels:** metadata (always, ~100 tok) → SKILL.md body (on trigger) → bundled files (on demand). Keep
  **SKILL.md body < 500 lines**; split beyond.
- **References one level deep** from SKILL.md (Claude only `head -100`-previews nested refs → incomplete reads).
- **TOC at top of any reference file > 100 lines** so partial reads still see scope.
- **Many small composable skills > one monster** (conference #5/#7; Anthropic composability; SkillsBench 2–3
  optimal). Domain-partitioned reference dirs so irrelevant context never loads.
- Empirically: **moderate beats comprehensive** (SkillsBench −2.9pp for comprehensive). Conciseness isn't
  aesthetic, it's performance.

### 2c. Instruction style — constraints, freedom, evidence
- **Match degrees of freedom to task fragility** (Anthropic): high-freedom prose for open tasks; low-freedom
  "run exactly this script, don't add flags" for fragile/destructive ones. The "narrow bridge vs open field"
  analogy.
- **Constraints can outperform giant procedures** (conference #4): a few hard "always/never" rules often beat a
  20-step workflow. Anthropic echoes: use strong "MUST"/"NEVER", make rules prominent.
- **Anti-skills / negative instructions** (conference Tip #2): "never use npm / never commit generated files /
  never edit migrations by hand." Negatives are remembered well and map cleanly to a checkable contract.
- **Evidence-first output format** (conference Tip #7): `Finding / Evidence / Risk / Recommendation` — dramatically
  cuts hallucinated reviews. *Our `estimate` already does this* (Output Contract: Customer/Job/Line Items/Totals/
  Assumptions + a Verification section). This is a standardizable, *checkable* property.
- **Deterministic data > agentic search** (conference #6; Anthropic "solve don't punt", utility scripts,
  plan-validate-execute): never ask the model to *discover* what you can *inject*. Ship `git log -10` output, a
  `grep` result, a script — not "go find it." Reduces hallucination + tokens, and **makes the step reproducible**
  (which is the bridge to `graph-replay`).

### 2d. Lifecycle — evals first, build around failures, expire
- **Build evals BEFORE the body** (Anthropic "evaluation-driven development"; conference #10): baseline without
  skill → write minimal skill → measure → keep only if it beats baseline. This *is* the SkillsBench loop, just
  per-skill. **This is the thing almost everyone skips and the thing our standard can mandate.**
- **Build skills around mistakes, not tasks** (conference Tip #1): `prevent-react-performance-regressions` beats
  a generic `react` skill — models avoid named failures better than they recall general competence.
- **"Before-action" / planning skills** (Tip #6): `before-deploying`, `before-migrating` — often save more than
  execution skills. Maps to Anthropic's plan-validate-execute.
- **Skills decay** (Tip #8): add `last_reviewed` / expiration, revisit quarterly; model upgrades obsolete skills.
- **Heuristic:** typed a prompt 3× → it's a skill (Tip #10).

---

## 3. The gap: our verification proves authenticity, not effectiveness

Map the §2 properties against what `09`/`02`/`04` actually enforce today:

| Effectiveness property | In the standard today? | Enforced by verification? |
| --- | --- | --- |
| Signed/reproducible bytes | yes | **yes** (`graph-replay`) |
| Schema/contract conformance (structure) | yes | **yes** (`static-contract`) |
| Description quality / trigger phrases | informal | **no** — no conformance gate |
| SKILL.md < 500 lines, refs one-deep, TOC | partial (our build) | **no** — not a signed check |
| Evidence-first output contract | `estimate` does it by hand | **no** — not standardized/checked |
| Deterministic-data-over-search | ad hoc | **no** |
| **Measured uplift vs prompt-only baseline** | **no** | **no** ← the big one |
| Composability / not-over-bundled | implicit | **no** |
| Freshness / `last_reviewed` | no | **no** |

Two classes of fix:

**(A) Cheap static conformance gates** (extend `static-contract`, no inference). Make `skills:conformance` fail
the build unless: description is third-person + has ≥1 trigger phrase + states when-to-use; body < 500 lines;
references one level deep; reference files >100 lines carry a TOC; an Output Contract block exists; a
`last_reviewed` date present and < N months old. These are *authoring-discipline* checks — they don't prove the
skill helps, but they enforce the properties the literature ties to helping, and they're recomputable (stay
inside `graph-replay`'s "anyone re-runs it" property).

**(B) The behavioral rung — the real prize.** Define `behavior-verified` concretely as **a signed eval record
showing uplift over baseline**, computed by the SkillsBench-style loop:
1. A skill ships an **eval set** (Anthropic's JSON shape: `{query, files, expected_behavior[]}`, ≥3 scenarios —
   *already the recommended format*).
2. A runner executes each scenario **with and without** the skill, N trials, against a **named model+config**
   (recorded, since results are model-specific — Anthropic: "test with all models you'll use").
3. A **deterministic verifier** (script or rubric) emits binary pass/fail per trial.
4. Emit a signed attestation: `{method:"behavior-eval", model, harness, tasks, trials, pass_vanilla, pass_skill,
   delta_pp, normalized_gain_g, ranAt}` — bound by the existing cert envelope, exactly like any other attestation
   (`02` already supports `method` + `policyVersion`; `09` reserves `live-model`).
5. **The certificate only earns the tier if `delta_pp > 0` (and ideally `g` above a policy threshold).** A skill
   that doesn't beat the prompt **fails to certify** — that is the standard literally enforcing Ben's claim.

This is honest about its limits (it's a *reference run* on a *named model*, not a proof of your run — same
caveat `09` already states for `live-model`), but it converts "trust us, it's good" into "here is the measured
uplift, recompute it." The eval set + verifier are published, so a third party re-runs and gets their own number
— the `consumer-side opt-in re-derivation` already sketched in `09` becomes the witness for the behavioral tier.

---

## 4. The two delivery modes — paste-the-link vs agent-bootstrap

Ben's constraint: effectiveness must hold *both* ways. The "in the wild" paper's **discovery vs execution** split
maps onto these exactly, and tells us where each mode is fragile:

| | **Paste the registry link** | **Agent bootstraps/downloads the skill** |
| --- | --- | --- |
| Maps to | *explicit instruction* ("use this") | *autonomous discovery* |
| Literature says | **dramatically higher success** — the human did the routing | **the hard path** — agents often fail to load even relevant skills |
| Failure mode to kill | execution: agent fetches but reads partially / ignores body | discovery: never loads; + execution |
| What the standard must guarantee | the link must **fully materialize in-context** (no partial `head -100` reads, no nested-ref truncation, body small enough to load whole) → progressive-disclosure conformance from §3A is the fix | the **description/triggers** must be strong enough to route, AND the recreate-from-link → re-verify recipe ([NEXT-a]) must reliably reconstruct the file tree |

Implications:
- **Paste mode is the high-reliability path and our shortest road to "beats a prompt."** Optimize the
  single-link surface (`use.md`/`agent.md`, which are *signed bootstrap* now) so that one fetch delivers a
  whole, non-truncated, evidence-first skill. Most of §3A directly serves this.
- **Bootstrap mode lives or dies on the description** (and on the verifier recipe). The federation story (own
  domain, no AMTECH cert yet) is *bootstrap-mode*, so the generic client-side verifier + a routing-quality gate
  matter most there.
- **Adherence is its own risk in both** (Codex "acknowledges then ignores"). Mitigation is instruction style
  §2c: hard constraints, anti-skills, evidence-first output, explicit "MUST use the procedure below" — the
  things that survive a model deciding to freelance.

---

## 5. Recommendations (ranked by concept-per-effort)

1. **Adopt the uplift metric as the definition of "good."** Bake `delta_pp` + normalized `g` into the standard's
   vocabulary now, even before the runner exists. It reframes the entire CA: we certify *measured help*, not
   *mere authenticity*. (Doc change to `09` + `02`.)
2. **Ship static authoring-discipline gates (§3A) in `skills:conformance`.** Cheap, recomputable, immediately
   raise floor quality and directly serve paste-mode. Start with: description-quality (third person + trigger +
   when-to-use), body<500-lines, refs-one-deep, Output-Contract-present, `last_reviewed`.
3. **Standardize the evidence-first Output Contract** (Finding/Evidence/Risk/Recommendation, or the estimate's
   field contract) as a required, checked skill section. Generalize what `estimate` already does.
4. **Build the behavioral runner (§3B) as the `behavior-verified` MVP.** Reuse Anthropic's eval JSON shape +
   SkillsBench's with/without loop + our existing signed-attestation envelope. This is the headline feature:
   *the certificate that proves the skill beats the prompt.* It's also the "novel bet" in the operate/extend
   handoff §5 — now with a concrete, literature-backed method.
5. **Add a routing/discovery eval** (does the description cause load on natural phrasings?) — the conference's
   "ask the model: when would you load this? why didn't you?" turned into a check. Serves bootstrap mode.
6. **Anti-skill / constraints support:** let a skill declare `never[]`/hard-constraints as first-class checked
   fields; they're high-adherence and trivially conformance-checkable.
7. **Freshness policy:** `last_reviewed` + an expiry that downgrades the tier when stale (model upgrades rot
   skills). Ties to the authority log as a policy event.

**Guardrail unchanged** (`[[skills-direction-no-leadgen]]`, claims discipline §4 of the operate/extend handoff):
a behavioral attestation is a *reference run on a named model*, not a universal guarantee. Say "measured +Xpp
uplift over baseline on <model> as of <date>, recompute it yourself," never "proven to work."

---

## 6. Open questions for Ben
- **Threshold policy:** certify on any `delta_pp > 0`, or require `g ≥` some floor (e.g. 0.1)? Per-domain
  thresholds (SkillsBench shows huge domain variance: healthcare +51.9pp vs SWE +4.5pp)?
- **Which model(s) define the canonical reference run?** Opus only, or a Haiku+Sonnet+Opus matrix (Anthropic
  says test all you'll ship — Hermes ships Opus+Haiku)?
- **Where does the runner live?** It needs inference, so it breaks the "statically hostable, no infra" purity of
  `graph-replay`. Acceptable as an *offline signed attestation* (like `amtech-review`), surfaced statically?
  (Recommend yes — the run is offline, only the signed result is served.)
- **Sequencing vs the Hermes integration:** do the static gates (§3A, cheap) first to lift the live catalog, or
  go straight for the behavioral runner (§3B, the headline)? (Recommend §3A + §1 doc change now, §3B as the next
  build milestone.)

---

## Sources
- WorkOS/TanStack skills workshop notes (provided by Ben, 2026-06-22) — description-first, constraints>procedures,
  progressive disclosure, deterministic data, composability, anti-skills, review personalities, evidence-first,
  benchmark with/without, build-around-failures, expiration.
- Anthropic — *Skill authoring best practices*, platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices
  (degrees of freedom; description rules incl. third-person + 1024 char; progressive disclosure + 500-line + one-
  level-deep + TOC>100; evaluation-driven development + Claude A/Claude B loop; plan-validate-execute; solve-don't-
  punt; utility scripts; anti-patterns).
- Anthropic — *Equipping agents for the real world with Agent Skills*, anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills
- SkillsBench, arXiv 2602.12670 (with/without/self-gen; +16.2pp curated, −1.3pp self-gen, normalized gain g,
  2–3 optimal, moderate>comprehensive, smaller-model+skill≈larger-alone, 16/84 negative).
- *How Well Do Agentic Skills Work in the Wild*, arXiv 2604.04323 (discovery vs execution failures; realistic-
  setting degradation; explicit-instruction >> autonomous discovery).
- SkillTester arXiv 2603.28815, EvoSkills arXiv 2604.01687, SkillFlow arXiv 2604.17308 (eval+security, co-
  evolutionary verification, lifelong discovery) — adjacent, for later.
- Our standard: `docs/skills/standard/09` (ladder/`graph-replay`/reserved `live-model`), `02` (cert/method),
  `04` (verifier/recipe).
</content>
