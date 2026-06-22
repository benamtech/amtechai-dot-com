# Handoff → agent[sysadmin + product-designer + ad-exec] · AMTECH verifiable skills

Codegraph syntax (dense). `→`=produces/flows · `·`=and · `path:thing` · `⚠`=watch · `[ ]`=todo. Read with `docs/codegraph.md` + `docs/skills/standard/01..09`.

## MISSION
AMTECH free agent-skills, usable from ONE link → `amtechai.com/skills` · public install src = `github.com/benamtech/amtech-skills-registry`.
thesis = **verifiable skills**: each skill = a signed package an agent uses in-context from a URL and can *recompute trust itself*. Genuinely-useful tools, **never a lead-gen funnel** (`[[skills-direction-no-leadgen]]`).
STATE 2026-06-21: standard **M0–M5 LIVE on `main` + production**. 4 certified: `okf-audit` · `knowledge-graph-builder` · `estimate` · `amtech-article-research-writer`.

## ARCH (one model → many projections)
- truth: `src/lib/skills/registry.ts` (`skillDefinitions[]`) + `src/lib/skills/source/<slug>/{SKILL.md,references/,assets/*.json,agents/openai.yaml}`
- build: `scripts/skills/build-skills.ts` → `public/skills/<slug>/{use.md,agent.md,SKILL.md,manifest.json,files/*,<slug>-<ver>.zip,certificate.json,certificate.sig,recipe.json,checksums.*,evidence/*}` + hub `catalog.json`·`use.md`·`agent.md`·`llms.txt` + `/.well-known/{skill-authority.json,amtech-signing-key.json,keys/<id>.json,authority/{records,log.json}}`
- verify engine: `src/lib/skills/verification/verifySkill.ts` (pure · loader-driven · WebCrypto-portable) ← `scripts/skills/verifier-loaders.ts` (http|local)
- sign: `scripts/signing/{amtech-signing.ts(core),sign-skills.ts,sign-authority.ts,rotate-key.ts}`
- page render: `src/lib/skills/{renderSkillContent.ts,renderHubContent.ts,generated/skill-content.ts}` → both prerender (`scripts/okf/prerender.ts`) + SPA (`src/pages/{Skills,SkillDetail}.tsx`)

## CRYPTO — what `verified` means (sysadmin/security)
- ONE real sig = **Ed25519** over **RFC-8785 canonicalJson(cert)**. everything else = hashing the content back to what that sig commits to.
- cert commits-by-digest → `sourcePackage`(SHA-256+SHA3-512, cross-repo anchor) · manifest per-file SRI · `bootstrap{use,agent}` digests · evidence(conformance/review) · `catalogRoot`(hash of sorted cert-set) · authority hash-chain (`previousRecordHash`, per-record Ed25519, head==`latestRecordHash`).
- depths: link-only(sig) < graph-replay(default; recompute all) < archive-byte(also re-hash the zip).
- ⚠ root-of-trust = **domain control · TLS+CA · self-served key @ `/.well-known/`** → NOT trustless. no external transparency log; registry cross-witness = same-owner (raises bar vs equivocation/rollback, ≠ CT-grade). attestations(`amtech-reviewed`,`static-contract`) = signed human/offline claims, NOT proof-of-behavior. private-key leak or domain compromise → silent forge.

## OPS (sysadmin)
- release (atomic·cross-repo·SSH-signed): `npm run skills:publish -- --execute [--push]` → sign→`skills:check`→build→mirror src+certs+chain to registry→1 SSH-signed registry commit→re-pin website `SKILL_REPOSITORY_COMMIT`→rebuild→`registry/validate.mjs --check`. idempotent (no change → no diff).
- gates: `npm run skills:check` = build·okf:build·validate·test(**38 green**) · `skills:conformance` · `skills:verify <url>` · `typecheck`
- keys: `.amtech/signing-private-key.pem`(Ed25519, NEVER commit) · `.amtech/commit-signing-key`(SSH, `signing/allowed_signers`) · pub mirrors `src/lib/skills/certificates/` + `/.well-known/`. retired keys still verify historical certs (active-at-issuance); revoked→`revoked`.
- revoke: edit `src/lib/skills/authority/revocations.json` → re-sign → verifier walks chain → `revoked` (terminal).
- ⚠ lockstep: website pins registry HEAD; **merge PRs with MERGE COMMITS (not squash)** so the pinned SHA survives. now: registry `048c371` on main · website pin = `048c371` (verified). live: `skills:verify https://amtechai.com/skills/estimate`→verified·graph-replay·amtech-reviewed·bootstrap pass·seq 5.
- ⚠ signed `use.md`/`agent.md` MUST stay commit-INDEPENDENT (branch URLs via `skillRepositoryTreeUrl(skill,false)`); embedding the pinned commit breaks `cert.bootstrap` on the post-sign provenance re-pin (circular).

## PRODUCT / UX (product-designer)
- agent front-door = per-skill `use.md`(full bootstrap: decision-tree `taskVerb`, Output Contract, verify steps) · `agent.md`(short preview: inputs/outputs) — **now per-skill + SIGNED** (was hardcoded okf boilerplate).
- bootstrap content driven by `SkillDefinition` fields: `taskVerb`·`inputs`·`outputContract`·`outputsSummary` (must match `SKILL.md` `## Output Format`; conformance gates it).
- head-as-channel: `amtech:skill:*` meta · `amtech-agent-map` island · `ClaimReview` JSON-LD · `X-AMTECH-Skill-Verification` header · per-skill `recipe.json` (self-describing recompute) · in-browser recompute widget (`standard/09`). one build-time verdict → every surface under consistency gate G-X.4.
- principle: First-Fetch — every surface gives an agent enough to act without hunting; descriptive-over-imperative; `checked-at` honesty marker.

## POSITIONING (ad-exec)
- pitch: "**Signed, verifiable AI skills you use from one link** — the agent checks the math itself." differentiators: in-context use (no install) · re-derivable trust (not a badge) · git-backed provenance.
- ⚠ COPY GUARDRAIL: claim **signed · verifiable · reproducible · tamper-evident**. do NOT claim **trustless / tamper-proof / unhackable / audited-for-safety** (see CRYPTO caveats — would be false).
- audience: AI builders · agencies · operators · technical marketers. tone matches existing site copy (post-June-2026 revisions).

## OPEN THREADS / NEXT
- [ ] confirm Netlify prod deploy green (website `main`); spot-`skills:verify` the other 3 slugs live.
- [ ] backlog skills (invoice·daily-checkin·amtech-article-publisher) = **DROPPED, won't add** (`[[skill-ca-standard]]`).
- [ ] trustless-hardening (only if needed): external append-only witnessed log + out-of-band key anchor; `catalogRoot` flat→Merkle (O(n)→O(log n) membership).
- refs: `docs/memory/status-2026-06-21--bootstrap-binding.md`(latest) · `docs/codegraph.md` · `docs/skills/standard/` · `docs/UNIVERSAL_SKILL_LINK_CONTRACT.md`.
