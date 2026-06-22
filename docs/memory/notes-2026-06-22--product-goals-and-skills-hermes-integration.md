# Notes — product goals (business context) + the skills↔Hermes integration — 2026-06-22

Research/notes pass, not a status of shipped work. Purpose: (1) write down what each product/feature in
this repo is *for* in business terms and where it stands, (2) pin down the bar "a skill link must beat a plain
prompt," and (3) map how the certified-skills standard integrates into the AI Employee (Hermes) product.

Pairs with: `handoff-2026-06-21--skills-ca-operate-extend.md` (§5 business prongs), `status-2026-06-21--merkle-transparency-log.md`
(what's live), `docs/AI_EMPLOYEE_MVP.md`, `docs/skills/standard/11`, `wiki/research/2026-06-21-multi-authority-trust-and-issuance-decentralization.md`.

---

## 1. Product map — what each piece is for, and where it stands

Tags: `[LIVE]` in prod · `[BUILT]` in repo, not productized · `[NEXT]` designed, not built.

### A. The verifiable skill-serving standard (the real root) `[LIVE]`
- **What it is, in business terms:** a way to publish a skill at a URL such that *any* agent can use it from
  that one link and **check the trust itself** by recomputing the math — no install, no app store, no "trust the
  badge." The product is the standard + the certificate authority, not the SEO articles that proved it out
  (`[[skill-standard-real-root]]`).
- **State:** 4 certified skills live (`estimate`, `okf-audit`, `knowledge-graph-builder`, `amtech-article-research-writer`).
  RFC-6962 Merkle transparency log, `/registry` + `/certificates/:id` with a live in-browser verify widget,
  registry-state broadcast cert + receipts ledger, federation/anchor wiring (inert). Claims discipline:
  **trust-minimized, NOT trustless.**
- **Goal:** become the de-facto "verified app store for agent skills" — which does not exist today. A valid
  certificate against our domain key is the proof; verified-by-default is the moat.

### B. The skill library (genuinely useful tools) `[LIVE]` / `[NEXT]`
- **What it is:** the actual back-office work of American local/small service businesses, delivered as skills.
  Estimator is live; parts ordering, local-service research, and the rest of the office set are next.
- **Hard guardrail (`[[skills-direction-no-leadgen]]`):** these are real tools, never lead-gen funnels. That is
  what makes the catalog worth discovering and citing.
- **Goal:** ~95% of the back-office/office work covered by certified skills.

### C. The AI Employee / Hermes platform `[BUILT]` (provisioning), positioning `[LIVE]`
- **What it is:** a textable AI *employee* (not a chatbot) set up to know one business — pricing, services,
  brand, customers, how work gets done — that finishes office work (estimates, invoices, follow-up, material
  checks) and reports over SMS. One isolated Hermes profile + one Twilio number per client, provisioned from a
  `/claim` form in under a minute.
- **State:** provisioning factory (Phase 2) + claim form (Phase 3) built; positioned around a free AI Employee
  offer aimed at two audiences at once (high-agency operators *and* normal service-business owners who just want
  more work done). Source of truth: `AI_EMPLOYEE_MVP/BUILD-PLAN.md`.
- **Goal:** the consumer/business surface that *showcases and consumes* the certified catalog by default. This
  is where A + B turn into revenue and into a reason for the standard to spread.

### D. Agentic SEO / materialization (the substrate) `[LIVE]`
- Agent-first site, machine catalog, head-as-agent-entry meta, JSON-LD, `recipe.json`, OKF bundle, in-browser
  recompute. Thesis: when a user's agent hits a novel task, web search + the agent surface should *find* an
  AMTECH skill, *discover the standard*, and *verify it itself*.

### E. The novel bet (most interesting) `[NEXT]`
- **Behavior-verification:** prove a skill actually *completes the task* (VPS sandbox run → signed evidence →
  new `behavior-verified` tier; engine already reserves the rung). The hard parts (deterministic recompute,
  signed evidence envelope, authority chain) already exist.

---

## 2. The bar: "a skill link must beat a plain prompt"

This is the product test Ben set. Attaching `amtechai.com/skills/<slug>` (or a creator's own domain) must make
the agent *more* useful than the same agent given a hand-typed prompt. What that requires, and where we are:

1. **The skill is materially better than what a user would type.** [LIVE for `estimate`] The certified
   `estimate` carries an explicit Output Contract, inputs, pitfalls, and verification steps — richer than the
   stub a user improvises. (Contrast: the Hermes template's local `estimate`/`invoice` copies are thinner — see §4.)
2. **It loads from one link, in context, no install.** [LIVE] file-pointing works well in Claude, Grok-over-X,
   chat UIs; partial in ChatGPT; some Codex-plugin support.
3. **The agent can verify it itself.** [LIVE engine, [NEXT] recipe] `verifySkill` + `httpLoader` already
   fetch+recompute; the gap is (i) a documented "recreate-from-link → re-verify" recipe and (ii) a tiny
   **client-side verifier addressable from a system prompt**. (Open thread [NEXT-a].)
4. **Verified-by-default in the agent that runs it.** [NEXT] — see §4; this is the Hermes integration.

So the bar is ~80% met for `estimate` in a chat context; the missing 20% is the verifier-from-system-prompt
recipe + making our *own* product (Hermes) consume the verified catalog instead of static forks.

---

## 3. The federation nuance (creator's own domain, no AMTECH cert yet)

Ben's framing: a skill creator who is *not yet* in our registry should still benefit from the link — served
from **their own domain**, just without an `amtech-reviewed` verdict. The research already supports this:

- We decentralized **verification** (anyone can recompute). What's centralized is **issuance** (today only
  AMTECH signs). `wiki/research/2026-06-21-multi-authority-trust-and-issuance-decentralization.md`.
- Spectrum: **one** authority (today) → **many named** authorities (federation, a quorum over independent
  attestations of the *same* `sourcePackage` digest, no new crypto — DSSE multi-sig envelope) → **any
  unknown-but-proven** party (proof-verified / Nockchain-shape; trust the proof, not the prover).
- **What this means for the no-cert creator:** because the cert binds **by digest, not by signer**, a creator
  serving from their own domain + their own key gets a *self-attested, recomputable* skill. An agent with the
  generic client-side verifier can confirm "these bytes match this domain's signed cert" — it just can't show
  `amtech-reviewed` until AMTECH (or another trusted issuer) co-signs the same digest. The verifier **degrades
  gracefully**: domain-key-valid < amtech-reviewed < replay-verified. Standard/11 already role-tags signatures
  and resolves witness keys by their own `signingKeyUrl` — so a third party on another domain is a config/policy
  change, not a rewrite.
- **Takeaway:** the "anyone with a signature domain + the verifier baked into their system prompt could do this"
  idea is the federation thesis, and the shape is already there. Productizing it = ship the generic verifier +
  a "publish a skill on your own domain" recipe.

---

## 4. The integration: skills standard ↔ Hermes AI Employee (the main finding)

**There are two parallel skill systems that don't talk to each other yet.**

| | Certified AMTECH catalog `[LIVE]` | Hermes template `skills/` (today) |
| --- | --- | --- |
| Skills | `estimate`, `okf-audit`, `kgb`, `article-research-writer` | `estimate`, `invoice`, `daily-checkin` — static `SKILL.md` with `{{TOKEN}}` placeholders |
| Delivery | one URL, recomputed live | frozen forks baked into each profile at provision time |
| Verification | agent recomputes cert vs. domain key | **none** — no verifier in the Hermes identity (`SOUL.md`/`AGENTS.md`) |
| Quality | Output Contract + evidence + cert | thinner; `invoice`/`daily-checkin` were **dropped** from the certified catalog ("won't add as-is") |
| Drift | canonical, signed | already diverging |

So the product that should *prove the standard* currently ships **worse, unverified forks** of skills we've
already certified, while the canonical `estimate` sits unused by Hermes. `AGENTS.md` even tells the employee
"use skills, write new ones" but points only at the local `skills/` dir — never at the standard or the registry.

**The target is already written** (handoff §5c): *every Hermes identity ships with the verifier built in and the
AMTECH catalog + agentic-discoverable links baked into its system identity, so it discovers, verifies, and runs
AMTECH skills by default.* Verified-by-default is the differentiator.

### Integration shape (proposed milestone, for a later implementation plan — not built)
1. **Bake the client-side verifier into the Hermes template** (`SOUL.md`/`AGENTS.md` + a `skills/_verify/`
   recipe). This is the open [NEXT-a] "recreate-from-link → re-verify" recipe, landed inside the product.
2. **Replace the static `skills/` forks with the live catalog.** At provision (and on a refresh cron) Hermes
   fetches `amtechai.com/skills/catalog.json`, verifies each skill, and materializes it locally — so catalog
   updates propagate without re-provisioning, and the employee uses the *certified* `estimate`, not the fork.
3. **Reconcile the orphan skills.** `invoice` and `daily-checkin` exist only in Hermes. Decide per-skill: either
   promote to certified catalog entries (start from the `estimate` template) or keep `daily-checkin` as a
   product-internal, uncertified local skill (it's check-in orchestration, arguably not a catalog skill).
4. **Make "write new skills" point at the standard.** A skill the employee writes locally for one business
   should be promotable to a certified entry (and, per §3, a client could serve private skills from their own
   domain, verified the same way).
5. **Surface the trust in the product.** When the employee uses a skill, it can honestly say "verified against
   amtechai.com" — turning the CA into a felt feature, not backend plumbing.

### Why this is the high-leverage next move
It connects all three business prongs: the standard (A) gets its flagship consumer (C), the library (B) gets a
distribution channel and a reason to grow, and "verified-by-default" stops being a slide and becomes something a
paying customer's agent actually does. It also exercises the link-beats-a-prompt bar (§2) end-to-end inside our
own product.

---

## 5. Open questions / decisions for Ben
- **Scope of first integration cut:** verifier-in-template only, or verifier + live-catalog consumption together?
- **Orphan skills:** promote `invoice` to the certified catalog? Keep `daily-checkin` local-only? (Recommend:
  promote `invoice`, keep `daily-checkin` as product-internal orchestration.)
- **Catalog refresh model in Hermes:** fetch-at-provision only, or a periodic refresh cron so live updates land
  without re-provisioning? (Refresh cron is the stronger story but adds a moving part.)
- **Federation timing:** ship the generic "verify a skill from any domain" verifier now (backs the article +
  the no-cert-creator story), or keep it AMTECH-only until a real second issuer exists?

## 6. Key references
- `docs/memory/handoff-2026-06-21--skills-ca-operate-extend.md` — §4 trust model (claims discipline), §5 prongs.
- `docs/memory/status-2026-06-21--merkle-transparency-log.md` — what's live as of 2026-06-22.
- `docs/AI_EMPLOYEE_MVP.md` + `AI_EMPLOYEE_MVP/BUILD-PLAN.md` — Hermes product + provisioning.
- `AI_EMPLOYEE_MVP/ai-employee-all-files/template/{SOUL.md,workspace/AGENTS.md,skills/*}` — what a provisioned
  employee actually ships today (the static forks; no verifier).
- `docs/skills/standard/11-trust-federation-and-anchoring.md` — federation/anchor wiring + honest ladder.
- `wiki/research/2026-06-21-multi-authority-trust-and-issuance-decentralization.md` — one→many→any issuance.
- `wiki/product-internal-research.md` — AI Employee positioning + the two audiences.
</content>
</invoke>
