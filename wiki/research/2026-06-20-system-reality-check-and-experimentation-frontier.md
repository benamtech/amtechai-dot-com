# System Reality Check & Experimentation Frontier

Date: 2026-06-20. Written after M0–M5 + the atomic-anchor finish, to (a) state plainly what we actually built,
(b) reconnect it to its origin (agentic-SEO materialization), (c) list loose ends, and (d) lay out where to push
the concept next. Normative specs: `docs/skills/standard/01`–`09`. Status: `docs/memory/status-2026-06-20--m4-atomic-m5-finished.md`.

## 1. What this system actually is (reality check)

Strip the milestones away and the core is one thing:

> **A statically-hostable certificate authority + transparency log + link-first verifier for agent-discoverable
> resources, whose verdict any third party RECOMPUTES from the published surfaces instead of trusting a badge.**

Mechanically, for any schema-conformant resource (today: a skill):
- authored once as a canonical model → **materialized** into many honest surfaces (HTML page, `use.md`,
  `manifest.json` with per-file SRI, JSON-LD, Tier-1 meta, `recipe.json`, archive, checksums) — the *one model,
  many projections* pattern carried over from the OKF/article pipeline;
- **signed** (Ed25519 over canonical JSON) with an `attestations` predicate (offline conformance + AMTECH review)
  → a trust tier; the cross-repo anchor is `sourcePackage` (a source byte digest), recomputed identically in both
  repos — so the cert binds bytes, not a git commit;
- recorded in an **immutable hash-chained authority history** (publish / revoke / key-rotate events), **cross-
  witnessed** by the registry's signed git history;
- **verified link-first**: the `graph-replay` recipe recomputes the verdict from published surfaces (Ed25519 over
  the canonical cert → `sourcePackage` → per-file SRI → catalog root → authority chain). **Determinism is the
  security property** — not secrecy, not a live model, not proof-of-work.

The genuinely novel property is **self-executing verification**: the recipe *and its expected result* travel with
the resource, so an agent or a downstream re-renderer **cannot fake "verified" — it has to recompute it.** Every
surface (meta, JSON-LD, header, body badge, `recipe.json`) is a projection of ONE build-time verifier run, under a
head/body consistency gate. Zero infra: no Rekor, no Fulcio, no OIDC, no servers — Netlify static + GitHub.

Prior-art lineage (borrowed concepts, AMTECH-native formats): CT/CONIKS (append-only, equivocation), TUF (key
lifecycle, offline release key, freshness), in-toto/DSSE/SLSA (subject+predicate, bind-by-digest), Sigstore
(CA+log+verifier shape), RFC 8785 (canonical JSON), and the "Human-Certified Module Repositories for the AI Age"
paper (review gates + graduated tiers + revocation for AI-consumed modules).

## 2. What it can be used for (the leverage)

1. **Usable skills from one link, no install** — the working MVP. An agent handed `…/skills/<slug>` bootstraps
   and uses the skill in-context because every part is materialized as a first-fetch surface.
2. **A verifiable first-fetch primitive for ANY resource** — skill, OKF/knowledge bundle, dataset, page, model
   card, API spec. Each becomes a self-bootstrapping, recomputably-verified, multi-surface object from one URL.
3. **Agentic SEO with provenance** — the original thesis plus the missing axis: agent-readable *and recomputably
   verifiable*. Content an agent fetches first now carries trust it can re-derive.
4. **A platform-independent trust layer for the agent-tool ecosystem** — "is this skill safe, and at what tier?"
   answered by a CA that is statically verifiable (no lock-in), revocable, and cross-witnessed.
5. **Provisioning-as-a-service (endgame)** — a server holding a valid cert renders verifiable surfaces (pages, the
   right files to expose, verified download links for *verified* skills) for AMTECH or any cert-holder.

## 3. Honest limits (what it does NOT do)

- It does **not** prove AI *behavior* — `behavior-verified` is a reserved rung; conformance proves structure/
  contract, not that the skill is correct or safe in every case.
- A malicious skill that *passes* offline conformance + review can still be published; the trust claim is
  "AMTECH-reviewed + structure-conforms + recomputably authentic," not "correct."
- No **live revocation push** — static surfaces are "verified at build time"; a consumer needing live assurance
  must re-run the verifier (revocation can postdate the build).
- It is a **trust + discovery layer, not a sandbox** — running scripts is still gated on the agent inspecting them
  (our 4 skills ship none).
- No legal-authorship claim — the signature authenticates the certificate + content digest only.

## 4. Loose ends (cheap to close, worth closing)

- **Dated research notes drift** — `2026-06-19-link-first-skill-verification.md` and siblings use the *old* reason
  codes (`OK_VERIFIED`, `REPO_PIN_MISMATCH`) and the commit-binding model. They are historical; `01`–`09` are
  normative. Add a one-line "superseded by `docs/skills/standard/04`+`09`" header to each so a reader isn't misled.
- **No live verifier endpoint** — `05` reserves an optional API; `skills:verify` is CLI-only. A Netlify function
  wrapping `verifySkill` would give live re-verification (and power the browser widget below).
- **In-browser recompute is designed, not built** — `recipe.json` + WebCrypto parity are specified; nothing runs
  the recipe client-side yet.
- **Tier-3 meta unproven** — instruction-bearing meta is research-gated; no empirical first-fetch agent test run.
- **Generalization unproven** — "skills = instance #1 of a general standard" is asserted; no 2nd instance (OKF/
  dataset/page) has been certified.
- **Repo split incomplete** — the target is 3 repos (CA+tooling / registry / website-consumer); the CA tooling
  still lives in the website repo.
- **Registry multi-key asymmetry** — the website serves keys by id; `registry/validate.mjs` still uses the single
  active key.

## 5. Experimentation frontier (ranked by leverage)

**A. In-browser self-verification widget — DO THIS FIRST.** Implement the WebCrypto `graph-replay` on the skill
page: a "Verify this yourself" control that recomputes the verdict client-side from the published surfaces, live,
showing each step pass/fail. It makes the entire thesis — *verification self-executes from the surface; a
re-renderer can't fake it* — visible and undeniable in 30 seconds. Reuses `verifySkill`'s recipe; the only new
work is the WebCrypto port of `canonicalJson`/SHA-256 (already kept portable) + a small UI. Highest demo value,
lowest risk.

**B. Consumer-side re-derivation / the "testing skill" (the `behavior-verified` rung, made real but un-signed).**
`09` already defines the consumer verdict format. Build a published **conformance challenge** (input + an
expected-output *shape/schema*, not a fixed answer) so a consumer runs the skill on *their own* model and a
deterministic checker emits *their own* verdict (`{verdict, tier, method:'consumer-replay', checkedAt}`). The CA
never signs it — but it *enables* behavioral assurance by extending the determinism principle from structure to
behavior. This is novel and on-thesis ("the standard defines the verdict format; the consumer earns the verdict").

**C. Push meta to the limit: the "first-fetch recompute kit."** Today meta is descriptive transport. Experiment:
make the `<head>` carry *enough* (cert URL + `sourcePackage` + manifest-SRI pointer + catalog root + the recipe
URL) that an agent can recompute the verdict from the head ALONE, then **empirically test** whether real agents
(Claude/GPT/Codex) actually do it when handed only the URL. This closes the Tier-3 empirical gap and stakes a
real claim: *a resource whose head is a complete recompute kit.* Pair with a Netlify edge function emitting the
`X-AMTECH-Skill-Verification` header for header-first agents.

**D. Certify instance #2 — a verifiable OKF/knowledge bundle.** Run a non-skill resource (an OKF article/concept
bundle — they already materialize many surfaces) through the same `build → sign → verify → render` pipeline. This
proves the "standard as base" thesis AND reconnects to the origin (agentic SEO) with the trust axis added:
*verifiable agentic-SEO content.* Strategically the highest-value direction; validates generalization for real.

**E. An independent replay-monitor (the equivocation/gossip frontier).** A tiny external witness (a GitHub Action
or a separate static site) that fetches the authority chain, recomputes it, and publishes its own signed head —
realizing the CT "gossip" defense with a genuine second observer. Proves the equivocation-resistance claim
instead of asserting it.

**F. Provisioning demo (the business shape).** Minimal "bring-your-own-cert → get verifiable surfaces": given a
valid cert, render the pages/files/verified-download surfaces. This is CA-as-a-service / verifiable-publishing-
as-a-service made concrete.

**G. Horizon: proof-carrying materialization beyond bytes.** The deepest idea in `09` — *the graph traversal path
IS the algorithm.* Today we recompute that BYTES are authentic. Push toward recomputing that DERIVED KNOWLEDGE
follows from sources: an OKF edge that carries its derivation so an agent recomputes "this claim follows from
these cited bytes," deterministically. From verifying artifacts → verifying knowledge. Genuinely novel; ties
graph-materialization and verification into one thesis. Long-horizon, but it's the north star.

## 6. Recommendation

Sequence: **A (browser widget)** → **C (first-fetch recompute kit + empirical agent test)** → **D (certify an OKF
bundle as instance #2)**, with **B (consumer re-derivation)** as the conceptually richest parallel experiment. A
proves the property visibly; C is the experimental edge the foundation finally makes safe to push; D proves the
generalization and rejoins the agentic-SEO origin; B opens the behavioral-trust frontier without over-claiming.
E/F/G are the maturity/scale/north-star track.

## Related
`docs/skills/standard/04`,`05`,`09`; `docs/UNIVERSAL_SKILL_LINK_CONTRACT.md` (first-fetch origin);
`wiki/research/2026-06-19-{experimental-meta-tag-skill-delivery,link-first-skill-verification,shareable-agent-skills-and-projection-pipelines,skill-certificate-authority-prior-art}.md`;
`docs/memory/status-2026-06-20--m4-atomic-m5-finished.md`.
