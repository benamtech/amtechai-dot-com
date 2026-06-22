# Plan — the first benchmark-able, agent-aware, bootstrappable skills standard, proven on `estimate`

Date: 2026-06-22. Owner: next session(s). Driver (Ben): turn the research into a real standard upgrade and prove
it on ONE skill — `estimate` — so a *verified* skill is **measurably better than the prompt-only baseline**, and
that holds across every materialized surface (plain Hermes, contexted Hermes, Claude Code, Codex-plugin-via-link,
link-only bootstrap). Headline feature first: **behavioral verification = signed measured uplift**. We benchmark
it *inside this agentic environment* after publishing.

**The second pillar (added 2026-06-22; framing corrected per Ben):** the standard must define how a skill becomes
*next-level useful to an AMTECH AI employee / any agent or client that holds the AMTECH verifier* — the verifier
is **insurance that raises trust and warrants autonomy**, NOT a gate that forbids running scripts. Bootstrapping
and running a skill's scripts and advanced workflows from a link is the whole point — never blocked. What AMTECH
verification *adds* is assurance: a `replay-verified` skill's script bytes are proven to be exactly what the
authority signed and to match the declared permission envelope, so a host can run them with **reduced friction**
(no tamper-doubt) instead of treating them as unknown code; a `behavior-verified` skill is proven to beat the
baseline, so a host can run it **autonomously / unattended** and chain it into multi-step workflows. This rides
the boundary the AI Employee MVP names: a Hermes employee runs **shell + file tools** (`config.yaml`
`terminal.backend: local|docker`), and the README/`BUILD-PLAN.md` §2.6 state the *real risk is
provenance/integrity*. Verification de-risks that — it informs *how much autonomy is warranted*, the host still
decides policy. "Via link **+ amtech-skill** (verified)" = run it on its own with confidence; link-only =
run it with the host's normal caution. The verifier upgrades trust; it never withholds the right to execute.

Grounded in: `wiki/research/2026-06-22-skill-effectiveness-and-verification-enforced-quality.md` (the wisdom +
empirical case), the operate/extend handoff §5, the AI Employee MVP (`AI_EMPLOYEE_MVP/` — host that consumes this:
shell-capable agent, docker isolation, permission gate), and the live pipeline (`run-conformance.ts`,
`attestation-gates.ts`, `build-skills.ts`, `validate-skills.ts`, `verifySkill.ts`, `docs/skills/standard/02/04/05/09`).

---

## 0. Definition of done (the north star)

1. **Standard upgraded** to define, normatively: (a) static **authoring-discipline** conformance gates that
   encode the effectiveness wisdom; (b) **context-binding / host adapters** (the WorkOS "use the data the context
   already has" idea) as a first-class, multi-surface projection; (c) **`behavior-verified`** = a signed eval
   attestation showing `delta_pp > 0` uplift over a vanilla baseline, with the metric vocabulary (`delta_pp`,
   normalized gain `g`); (d) **verified-capability / autonomy assurance** — the cert's `permissions` + `safety`
   block becomes a **capability manifest**, the verifier returns an **assurance/autonomy grant** keyed on the
   verdict tier (how much autonomy the verdict *warrants*), and a host (Hermes) sets policy from it. Verification
   never gates the freedom to bootstrap or run scripts; it informs *how confidently / autonomously* to run them.
2. **`estimate` is the reference EV+ skill:** it passes the new static gates, ships an **eval set + deterministic
   scorer**, has a **signed `behavior` attestation** with a real measured uplift produced by running it in this
   environment, and is certified `behavior-verified`.
3. **`estimate` materializes to every surface** below, each carrying the right context-binding, each verifiable,
   each tested:
   - plain Hermes agent · contexted Hermes (rates from `./brain` + memory) · Claude Code · Codex plugin via link ·
     link-only bootstrap (`use.md`/`agent.md`) · machine catalog/manifest/recipe.
4. **TDD throughout:** every new gate, schema, and surface has a failing test written first, then the code, then
   green. `npm run skills:check` + `npm run typecheck` + the build all green; live-verified after publish.

**Explicitly deferred (Ben):** the canonical *model* for the reference run (we run in-environment, model-agnostic);
a hard normalized-gain floor (gate at `delta_pp > 0`, expose `behaviorPolicy.minDeltaPp` knob defaulting to 0).

---

## 1. Principles → mechanisms (traceability)

| Research principle | Mechanism in this plan | Surface it serves most |
| --- | --- | --- |
| Description decides loading; triggers win | static gate: third-person + ≥1 trigger phrase + "when to use" | bootstrap/discovery |
| Progressive disclosure; body<500; refs one-deep; TOC>100 | static gates on body length + ref depth + TOC | link-only paste (full in-context load) |
| Evidence-first output contract | static gate: Output Contract present + documented (already partial) | all |
| Deterministic data > agentic search | **context-binding**: skill consumes host-injected data, asks only for gaps | contexted Hermes / Claude Code |
| Curated >> self-generated (+16.2pp vs −1.3pp) | the whole CA + the behavior tier | the business case |
| Measured uplift, not authenticity | **`behavior-verified`** attestation w/ `delta_pp`,`g` | the headline |
| Skills can hurt (16/84 neg; comprehensive −2.9pp) | gate certification on `delta_pp>0`; body-length gate | quality floor |
| paste=explicit (high reliability) vs bootstrap=autonomous | per-surface materialization + strong description | both delivery modes |
| Skills decay | `last_reviewed` gate + staleness (reuse `MAX_EVIDENCE_AGE_DAYS`) | maintenance |
| Bundled scripts are reliable; running downloaded code carries integrity risk | **assurance grant**: integrity proof lets the host run with reduced friction (not a gate) | verified agentic hosts (Hermes) |
| Provenance/integrity is the real risk (MVP §2.6) | verdict *informs* host autonomy policy; host always sandboxes per its own rules | Hermes / any verifier-holder |

---

## 1b. Verified-capability model (the second pillar — "the verifier is insurance, not a gate")

The cert already carries `permissions: {scripts[], filesystem, network, secrets}` + a `safety` block. Promote that
to a normative **capability manifest**, and define an **assurance/autonomy grant** the verifier returns from the
verdict. The grant describes *how much autonomy a verdict warrants* — it never withholds the freedom to bootstrap
or run. A host (Hermes, Claude Code, any client embedding the AMTECH verifier) reads it and sets its own friction:

| Verdict state | What it *warrants* (host default policy) | Rationale |
| --- | --- | --- |
| **Unverified** (pasted link, no AMTECH verifier in play) | **Bootstrap + run freely, with the host's normal caution for any code** — sandbox it, confirm external/irreversible actions. Not blocked; just no AMTECH assurance to lean on. | The standard works for anyone over a link; no AMTECH proof of provenance/effectiveness yet. |
| **`replay-verified`** (integrity+provenance recomputed vs AMTECH key) | **Run with reduced friction** — the script bytes are proven to be exactly what the authority signed and to match the signed `permissions` envelope, so the host can skip tamper-doubt and execute within that envelope (still sandboxed, e.g. `terminal.backend: docker`). | Provenance + integrity are proven, so the "is this code what it claims?" risk is gone. |
| **`behavior-verified`** (measured uplift, `delta_pp>0`) | **Run autonomously / unattended** — scheduled/cron contexts, chained multi-step workflows, fewer per-step confirmations. | The workflow is proven to beat the baseline, so trusting it without a human in each loop is warranted. |

The host owns policy (the standard *informs*, the host *decides*). For the AI Employee MVP the grant maps onto
Hermes's existing controls — `terminal.backend: docker` isolation, the confirmation gate, the per-client sandbox —
all of which apply regardless of verdict; verification just lets the host *relax friction and grant autonomy* as
assurance rises. The verifier output gains a `capability` field: `{ scripts[], filesystem, network, secrets,
assuranceLevel, autonomyWarranted, isolationRecommended }`. **`estimate` is script-free**, so at
`behavior-verified` its grant warrants `autonomyWarranted:true` — the employee may draft estimates *unattended* in
a cron check-in from the brain, not only when asked. A script-bearing skill (e.g. future parts-ordering) carries
its `scripts[]` in the grant; the standard + verifier + a **test fixture** land now so the assurance mapping is
specified and consistent before any script skill ships.

> The one-liner for the standard: **link = a skill anyone can bootstrap and run; link + AMTECH verifier = the
> assurance to run it autonomously, unattended, and at scale.** Verification doesn't withhold the right to
> execute — it upgrades how far you can trust the skill to act on its own. That's why an AMTECH-verified skill is
> categorically more *trustworthy-to-automate* than the same text pasted raw, and why it's worth being the only
> benchmarked, certified, capability-describing standard.

---

## 1c. The certificate as the foundation of an agentic environment (the full use-case set, Ben 2026-06-22)

The skill cert is ONE instance of a general AMTECH signed artifact (`amtech-signed-artifact/v2`, already
multi-subject). The same key + envelope + verifier underwrite a whole **agentic environment**, not just a skill
catalog. The use cases, each mapped to what the docs already provide:

1. **Authorship / provenance of scripts** *(exists today).* `sourcePackage` + `permissions.scripts[]` bound in the
   AMTECH-signed cert prove the script bytes are exactly what the authority published; `UNDECLARED_SCRIPT` blocks
   smuggling an executable the cert didn't declare. The capability grant's `assuranceLevel` surfaces "written by
   the correct authority." Generalizes to a distinct author `owner` identity (`01` reserves it) → multi-author
   co-attestation (federation, `11`).
2. **Effectiveness** *(this plan — `behavior-verified`).* Proven to beat the baseline.
3. **Entitlement — "the skill was paid for"** *(new use, same envelope).* An **entitlement certificate**
   (`subjectType: 'entitlement'`) signed by AMTECH binds `{ holderId, skill slug+version / certificateId, orderRef,
   issuedAt, expiresAt }`. A premium skill or a host checks for a valid, unexpired entitlement before unlocking.
   No new crypto — a new subject type + a verifier check. *Roadmap* (estimate is free); the standard reserves the
   shape so the paid catalog has a home.
4. **Client-side certificates → credential brokering for service-connecting scripts** *(new, the powerful one).*
   An AMTECH agent holds a **client/holder certificate** — its own CA-issued identity (mTLS-client-cert analogue).
   When a verified skill's script must reach a service (Twilio, a supplier API, a CRM), the chain is: the **client
   cert** proves *who is running*; the **skill cert** proves *what is running and that it's genuine* (+
   `permissions.network` + `secrets: declared`); the **host brokers the actual scoped credential** to the script
   only when both verify and the permission was declared. The CA **issues identity and authorizes; it never holds
   the secret** — the host (Hermes `.env`/secret store) injects it under the verified envelope. Net: skills use
   *real* credentials to do *real* work, gated by verifiable identity + provenance, never by hardcoding secrets
   into a skill. *Roadmap*; needs a client-cert profile (new standard doc) + a `secrets: declared` → broker
   contract + Hermes host enforcement.
5. **One trust substrate** *(the framing).* Genuineness, effectiveness, entitlement (who may run), identity (who
   is running), and credential authorization (what they may access) all chain to one key + one verifier. That is
   the moat: not a skill marketplace — a **verifiable agentic operating environment**. The estimate MVP proves
   prongs 1–2 + multi-surface + capability; 3–4 are reserved in the standard now and built when a paid/credentialed
   skill needs them.

These extend the standard, they don't fork it: entitlement = a `subjectType` + gate in `02`; client certs +
brokering = a new doc (`13`) that reuses the same Ed25519 envelope, `permissions.secrets`, and the capability grant.

## 2. The surface matrix (what we materialize for `estimate`)

One canonical truth (`src/lib/skills/source/estimate/` + registry) → many projections. New = **context binding**:
the skill declares **context slots** (named inputs it can consume from a host) and each host adapter maps slots →
where that host keeps them. The skill body gains a host-agnostic **Context** section ("if a rate/customer is
already in your context — memory, business brain, prior messages — use it; only ask for what's genuinely
missing"); per-host hint files say *where*.

| Surface | Artifact(s) | Context binding | Verified by | Autonomy warranted |
| --- | --- | --- | --- | --- |
| Link-only bootstrap (no verifier) | `use.md` / `agent.md` (SIGNED) | generic: ask the user for rates | `bootstrap` digest in cert | runnable, host's normal caution |
| Machine catalog | `catalog.json`, `manifest.json`, `recipe.json`, `checksums.*` | n/a | `graph-replay` | n/a |
| Claude Code | skill dir (`SKILL.md`+refs+assets) install recipe | `AGENTS.md`/repo context slot | manifest SRI | execute under repo perms |
| Codex plugin via link | `agents/openai.yaml` + `manifest.source.codexSkillInstaller` | `default_prompt` + slot note | manifest SRI | execute under plugin perms |
| Plain Hermes | catalog fetch + verify + local materialize | ask-the-user | live verify | per capability grant |
| **Contexted Hermes (verified)** | same + host hint: rates in `./brain/business-brain.md`, memory | **rates/customer slots → brain+MEMORY** | live verify | **autonomous** (cron-drafted estimates) |
| Human/agent page | `/skills/estimate`, `/certificates/:id` | n/a | in-browser recompute | n/a |

Estimate's context slots (initial): `rates`, `customer`, `tax_markup_rules`. Host adapter map lives in the
registry (`contextBindings`) and projects into each surface's prelude. **The signed `use.md`/`agent.md` stays
commit-independent and canonical** (hard invariant); host hints are additive surfaces (signed via manifest SRI
where they're files, e.g. a `hosts/hermes.md`).

---

## 3. Milestones (each: Goal · Tests-first · Build · Acceptance gate)

### M0 — Standard architecture + scaffolding (docs + types, no behavior change)  ✅ DRAFTED 2026-06-22 (awaiting Ben's review)
- **Goal:** write the normative shape so code has a spec to satisfy.
- **Build:**
  - New `docs/skills/standard/10-behavioral-verification-and-evals.md`: the eval set format (Anthropic
    `{query,files,expected_behavior[]}` shape), the with/without harness, the `behavior-eval` method, the
    `delta_pp`/`g` metric, the `behaviorPolicy.minDeltaPp` knob, honesty caveats (reference run, recompute-it-
    yourself; never "proven to work").
  - Edit `09`: promote `behavior-verified` from *reserved* to *defined* (method `behavior-eval`); keep `live-model`
    as the hosted-inference variant. Edit `02`: add the `behavior` attestation block + `authoring` conformance
    sub-checks. Extend `05`: the context-binding/host-adapter projection + per-surface obligations.
  - New `docs/skills/standard/12-verified-execution-and-capability.md` (pillar 1b): the capability manifest
    (`permissions`+`safety`), the per-tier **assurance/autonomy grant** table, the verifier's `capability` output,
    and **host policy obligations** with the AI Employee MVP as the worked reference (docker isolation, the
    confirmation gate, the profile sandbox). State the honest boundary: the grant *describes* assurance + warranted
    autonomy; the *host* sets policy; verification never withholds the right to bootstrap or run (Ben).
  - **Reserve the broader use cases (§1c)** so the envelope is forward-compatible: add an `entitlement` subjectType
    + gate sketch to `02`; new `docs/skills/standard/13-client-certificates-and-credential-brokering.md` (roadmap)
    defining the client/holder cert profile + the `secrets: declared` → host-broker contract. Spec-only this phase;
    estimate doesn't exercise them, but the paid/credentialed skills land on a defined foundation.
  - Type additions (no logic yet): `registry.ts` `SkillDefinition` gains `contextBindings?` and `lastReviewed`;
    `attestation-gates.ts` keep `behavior-verified` in `KNOWN_TRUST_TIERS` (already there); a `Capability` type in
    `verifySkill.ts`.
- **Acceptance:** `npm run typecheck` green; docs cross-link; no runtime change.

### M1 — Static authoring-discipline gates (cheap, deterministic, lifts the floor + serves paste-mode)
- **Goal:** encode the effectiveness wisdom as recomputable conformance checks in `run-conformance.ts`
  (extends `static-contract`; stays byte-equality-stable).
- **Tests first** (`scripts/skills/__fixtures__/authoring-discipline.test.ts`): fixtures that FAIL each new check —
  vague/first-person description; no trigger phrase; SKILL.md body > 500 lines; a nested reference (depth 2); a
  >100-line reference with no TOC; missing/old `lastReviewed`; missing Output Contract section. Each asserts the
  specific check id fails; a good fixture passes all.
- **Build:** add checks to `computeConformanceEvidence` (new named checks → same evidence envelope):
  `desc:third-person`, `desc:trigger-phrase`, `desc:when-to-use`, `body:under-500-lines`, `refs:one-level-deep`,
  `refs:toc-when-long`, `bootstrap:evidence-first-contract` (Output Contract present), `freshness:last-reviewed`.
  Keep determinism (drives G-M1.4 byte-equality).
- **Acceptance:** new tests green; `estimate` passes all (fix the source if not); `skills:conformance` fails a
  deliberately-broken estimate; `skills:check` green.

### M2 — Context-binding / host-adapter layer + multi-surface materialization
- **Goal:** the WorkOS "use the data already in context" principle, projected per host; the full surface matrix §2.
- **Tests first** (`scripts/skills/__fixtures__/context-bindings.test.ts` + extend existing surface tests):
  every materialized bootstrap for `estimate` contains the **Context** section; the Hermes host hint names
  `./brain/business-brain.md`; the generic/link bootstrap says "ask the user"; Codex `openai.yaml` + installer
  present; declared context slots resolve; host hint files are in the manifest with SRI.
- **Build:**
  - `registry.ts`: `estimate.contextBindings` = slots (`rates`,`customer`,`tax_markup_rules`) + host map
    (`hermes`→brain/memory, `claude-code`→AGENTS.md/repo, `codex`→default_prompt, `generic`→ask).
  - `source/estimate/SKILL.md`: add a short host-agnostic **Context** section (consume-then-ask).
  - `source/estimate/hosts/hermes.md` (new file, declared+signed): "rates live in `./brain/business-brain.md`;
    customer/job may be in MEMORY or the current thread; write back any newly-learned rate."
  - `build-skills.ts`: project context-binding into `use.md`/`agent.md` (generic) and emit per-host hint surfaces;
    ensure Codex installer + `openai.yaml` carry the slot note.
- **Acceptance:** surface tests green; build emits all surfaces; manifest SRI covers the new files;
  `use.md`/`agent.md` stay commit-independent; `skills:check` green.

### M3 — Behavioral eval harness (eval set + deterministic scorer), model-agnostic, agent-in-the-loop
- **Goal:** the reproducible with/without measurement, runnable *in this environment* — no fixed model, no infra.
- **Tests first** (`scripts/skills/__fixtures__/eval-scorer.test.ts`): the scorer is deterministic and correct —
  a golden good estimate output scores pass (arithmetic correct, all required sections, schema-valid when JSON,
  no invented rate); mutated outputs fail the right rubric item (wrong subtotal → arithmetic-fail; missing
  Assumptions → section-fail; invented rate → safety-fail).
- **Build:**
  - `source/estimate/eval/cases.json` (new, declared+signed): ≥5 eval scenarios (`{id, query, provided_rates,
    expected: {line_items, totals, must_flag_assumptions, forbid_invented_rate}}`), spanning core/extended
    difficulty, incl. a missing-rate case (must ask, must NOT invent) and a JSON-output case.
  - `scripts/skills/eval/score-estimate.ts`: pure deterministic scorer `score(caseDef, agentOutput) → {pass,
    rubric[]}` (parse the estimate, recompute arithmetic, check sections, schema-validate JSON, detect invented
    rate). Reusable by validator + tests.
  - `scripts/skills/eval/run-eval.md` (the harness procedure for the in-environment run): for each case, run the
    agent **vanilla** (case query only) and **with-skill** (skill bootstrap + case query), capture outputs to
    `eval/runs/<condition>/<caseId>.md`, then `score-estimate.ts` computes per-condition pass rate.
  - `behavior.config.json` per skill (mirrors `conformance.config.json`): points at `cases.json` + the scorer +
    `trials`, declares `method: "behavior-eval"`, `harness: "agent-in-loop"`.
- **Acceptance:** scorer tests green; `cases.json` schema-valid; a dry scoring of the committed golden runs to a
  number; no network/model dependency in the scorer.

### M4 — `behavior-verified` tier wiring (attestation → gate → validate → verifier)
- **Goal:** make the certificate able to *earn* `behavior-verified`, and fail-closed when it shouldn't.
- **Tests first** (extend `attestation-gates` negative fixtures + `verifySkill` tests):
  - cert with `trustTier: behavior-verified` but no `behavior` attestation → `BEHAVIOR_NOT_PROVEN` (new reason
    code).
  - behavior evidence with `delta_pp <= behaviorPolicy.minDeltaPp` → fails the tier (uplift floor).
  - behavior evidence digest mismatch → `EVIDENCE_DIGEST_MISMATCH` (reuse).
  - stale behavior `ranAt` → `STALE_EVIDENCE` (reuse).
  - a `replay-verified` cert with no behavior block still verifies at its tier (additive, no regression).
- **Build:**
  - `reasonCodes.ts`: `BEHAVIOR_NOT_PROVEN`, `BEHAVIOR_UPLIFT_INSUFFICIENT`.
  - `attestation-gates.ts`: a `behavior-verified` branch mirroring the `amtech-reviewed` branch — require
    `att.behavior` with `result:'pass'`, `method:'behavior-eval'`, `delta_pp > minDeltaPp`, fresh `ranAt`,
    evidence digest resolves. `behavior` evidence is NOT byte-equality re-run (it's an offline measured run, like
    `review.json`); validation checks the digest + the recorded delta, and surfaces the number.
  - `sign-skills.ts` / certificate: include the `behavior` attestation when present; bump `trustTier` to
    `behavior-verified` for `estimate`.
  - `validate-skills.ts`: gate the behavior evidence (digest + uplift); `verifySkill.ts` + `verifier-loaders.ts`:
    load + report `behavior` (tier, `delta_pp`, `g`, harness) in the verdict.
  - `docs/skills/standard/09` ladder table → mark `behavior-verified` LIVE.
- **Acceptance:** all negative tests fail-closed; `estimate` (once it has real evidence, M5) verifies
  `behavior-verified`; other 3 skills unaffected (stay at their tier); `skills:test` green.

### M4b — Verified-capability grant + host-enforcement spec (the second pillar, made real)
- **Goal:** the verifier emits a **capability grant** from the verdict; a host can mechanically apply it; the
  spec is exercised by tests now even though `estimate` is script-free.
- **Tests first** (`scripts/skills/__fixtures__/capability-grant.test.ts`):
  - unverified / signature-invalid verdict → grant `{assuranceLevel:'none', autonomyWarranted:false}` (still
    runnable by the host — the grant just carries no AMTECH assurance), regardless of declared permissions.
  - `replay-verified` + a fixture cert declaring `permissions.scripts:['scripts/x.sh']` → grant
    `assuranceLevel:'integrity'`, `scripts:['scripts/x.sh']`, `isolationRecommended:true` when network/secrets used.
  - `behavior-verified` → grant `autonomyWarranted:true`.
  - `estimate` (script-free, `behavior-verified`) → `{scripts:[], autonomyWarranted:true}`.
  - permission/authorship mismatch (cert claims a script not in `sourceFiles`) → already caught by
    `UNDECLARED_SCRIPT`; grant downgrades to `assuranceLevel:'none'` (no false authorship assurance).
- **Build:**
  - `verifySkill.ts`: pure `deriveCapability(verdict, certificate) → Capability` mapping the per-tier grant table
    (§1b); add `capability` to the verdict object. No host side-effects — the verifier only *describes* the grant
    (assurance + warranted autonomy); the host decides policy.
  - `docs/skills/standard/12`: finalize the grant table + host-enforcement obligations; add a short
    `AI_EMPLOYEE_MVP` host-adapter note (map grant → `terminal.backend: docker`, confirmation gate, profile
    sandbox) — spec only, no MVP code change this milestone.
  - Surface the capability on `/certificates/:id` + `recipe.json` (so a host reads it without re-deriving).
- **Acceptance:** capability tests green; `skills:verify estimate` prints the grant; verdict shape unchanged for
  consumers that ignore `capability` (additive); `skills:check` + typecheck green.

### M5 — Run the benchmark in this environment → sign the real evidence → `estimate` becomes EV+
- **Goal:** produce the genuine measured uplift, not a placeholder.
- **Build/Run:** execute `eval/run-eval.md` here: for each case, run vanilla vs with-skill, score with
  `score-estimate.ts`, compute `pass_vanilla`, `pass_skill`, `delta_pp`, `g`. Write
  `src/lib/skills/certificates/estimate/evidence/behavior.json` (the signed envelope: schemaVersion
  `amtech-skill-behavior/v1`, method, harness, cases hash, trials, the two pass rates, delta, g, ranAt, per-case
  results). Then `npm run skills:sign` binds it; `npm run skills:check`.
- **Acceptance:** `behavior.json` shows `delta_pp > 0` (if not, the skill isn't EV+ yet — iterate the skill, the
  honest outcome the standard is designed to force); `estimate` cert = `behavior-verified`; `skills:verify`
  (local) reports the uplift; evidence digest bound + validated.

### M6 — Publish + live-verify every surface
- **Goal:** ship atomically (website + registry lockstep) and confirm all surfaces in production.
- **Build:** `npm run skills:publish -- --execute --push` (merge as merge-commit; keep the SHA pin invariant).
- **Acceptance (live):** `amtechai.com/skills/estimate` shows `behavior-verified` + the uplift; `recipe.json` +
  `certificate.json` carry the behavior attestation; `/certificates/<id>` renders it; `skills:verify
  https://amtechai.com/skills/estimate` → `behavior-verified · delta +Xpp`; Codex-installer link works;
  link-only `use.md` loads whole with the Context section; contexted-Hermes hint present.

---

## 4. File-change map (concrete targets)
- **Docs:** `docs/skills/standard/10-behavioral-verification-and-evals.md` (new),
  `docs/skills/standard/12-verified-execution-and-capability.md` (new); edits to `02`, `05`, `09`.
- **Registry/source:** `src/lib/skills/registry.ts` (`contextBindings`, `lastReviewed`, estimate tier bump);
  `src/lib/skills/source/estimate/{SKILL.md (Context section), hosts/hermes.md, eval/cases.json,
  behavior.config.json}`.
- **Conformance/eval:** `scripts/skills/run-conformance.ts` (authoring-discipline checks);
  `scripts/skills/eval/{score-estimate.ts, run-eval.md}`; `src/lib/skills/certificates/estimate/{conformance.config.json
  (new sections), evidence/behavior.json}`.
- **Gates/verify:** `scripts/skills/attestation-gates.ts` (behavior branch); `scripts/skills/validate-skills.ts`;
  `src/lib/skills/verification/{reasonCodes.ts, verifySkill.ts}`; `scripts/skills/verifier-loaders.ts`.
- **Build/sign:** `scripts/skills/build-skills.ts` (surface projection + behavior surfacing);
  `scripts/signing/sign-skills.ts`.
- **Capability (pillar 1b):** `verifySkill.ts` (`deriveCapability` + `Capability` type, `capability` on verdict);
  `build-skills.ts` (surface `capability` on `recipe.json`); `src/pages/Certificate.tsx`/`renderCertificateContent.ts`
  (show the grant). Spec in `docs/skills/standard/12`.
- **Tests:** `scripts/skills/__fixtures__/{authoring-discipline,context-bindings,eval-scorer,capability-grant}.test.ts`
  + extend `attestation-gates`/`verifySkill` fixtures.

## 5. Test inventory (TDD order)
1. `authoring-discipline.test.ts` (M1) — per-check failure + good-skill pass.
2. `context-bindings.test.ts` (M2) — Context section present on every surface; host slot resolution; SRI coverage.
3. `eval-scorer.test.ts` (M3) — scorer determinism + correct rubric attribution on mutated outputs.
4. `attestation-gates` behavior negatives (M4) — missing/insufficient/stale/digest-mismatch behavior → fail-closed.
5. `verifySkill` behavior path (M4) — reports tier+delta; no-behavior cert still verifies at lower tier.
6. `capability-grant.test.ts` (M4b) — unverified⇒read-only; replay⇒execute-under-perms; behavior⇒autonomous;
   undeclared-script⇒read-only.
7. Whole-pipeline: `skills:check` + `typecheck` green at every milestone; live `skills:verify` at M6.

## 6. Decisions taken (defaults, revisitable)
- **Model:** none fixed — `harness: "agent-in-loop"`, run in this environment; the signed evidence records
  whatever ran. (Ben.)
- **Uplift floor:** gate at `delta_pp > 0`; `behaviorPolicy.minDeltaPp` knob (default 0) so we can raise it as a
  policy event later without a schema change. Record `g` alongside for when we set a real floor. (Ben: "may not
  be there yet.")
- **Behavior evidence is offline-measured** (like `review.json`), not byte-equality re-run (LLM output isn't
  deterministic); reproducibility comes from published `cases.json` + scorer = consumer can re-derive their own
  number (the `09` "consumer-side opt-in re-derivation" becomes the witness).
- **Surfaces signed where they're files** (host hints, eval set) via manifest SRI; the canonical signed bootstrap
  (`use.md`/`agent.md`) stays commit-independent.

## 7. Guardrails (don't relearn the hard way)
- Claims discipline: "measured +Xpp over baseline on this harness as of <date>, recompute it yourself" — never
  "proven to work" / "trustless". (`[[skill-verification-enforces-effectiveness]]`, handoff §4.)
- Lockstep + merge-commit release; cert binds no git commit (`sourcePackage` only); don't hand-edit
  `public/skills/**`. (handoff §7.)
- No lead-gen: estimate stays a real tool. (`[[skills-direction-no-leadgen]]`.)
- If `estimate` doesn't beat baseline, that's a *finding*, not a blocker to paper over — iterate the skill until
  it does, or it doesn't earn the tier. That honesty is the product.
- **Capability is describe-not-gate:** the verifier only *describes* the assurance + warranted autonomy; the host
  sets policy. Verification NEVER withholds the right to bootstrap or run a skill's scripts — that openness is the
  point (Ben). Unverified = runnable with the host's normal caution, just no AMTECH assurance. A grant never
  claims more than the cert's signed, recomputed `permissions` envelope; `UNDECLARED_SCRIPT`/signature failures
  drop `assuranceLevel` to `none` (no false authorship/integrity claim). Don't let the verifier acquire side-effects.
```
</content>
