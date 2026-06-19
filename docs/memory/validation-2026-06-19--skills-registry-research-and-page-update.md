# Validation Pass: Skills Registry Research And Page Update - 2026-06-19

Purpose: verify the registry explanation, trust model, and marketplace comparison before and after editing the AMTECH skills page.

---

## What We Are Validating

The page update should explain three things clearly:

1. How the AMTECH skills registry is authored, published, and consumed.
2. How AMTECH's trust model works beyond a bare hash stamp.
3. How the AMTECH approach compares to current agent/people-facing registries and marketplaces.

---

## Sources To Anchor The Claims

Use the following current sources as the factual base:

1. `src/lib/skills/registry.ts` and the generated skill surfaces in this repo.
2. Claude Agent Skills docs: filesystem-based, on-demand loading, custom skills across Claude products.
3. Claude Code skills docs: nested `.claude/skills/` and repo-local loading behavior.
4. Anthropic public skills repo: public repository for agent skills.
5. OpenAI's GPTs announcement: community-built GPTs, sharing, review, and identity verification.
6. Recent arXiv work on skill marketplaces and GPT vulnerabilities for scale/risk framing.

---

## Claim-By-Claim Checks

### Claim: AMTECH has a commit-pinned, Git-backed public skills registry.

**Pass condition:** the page states that the registry is authored in repo code, published as a public site + raw files + manifests, and linked back to a pinned GitHub tree.

**Evidence to verify:** `src/lib/skills/registry.ts`, `/skills/index.json`, `/skills/:slug/manifest.json`, and the public skill page source links.

---

### Claim: AMTECH trust is signed, not just hashed.

**Pass condition:** the page says the registry uses deterministic certificates, an Ed25519 signature, and multiple digests, and that the certificate binds the skill, version, repo commit, and canonical URL.

**Evidence to verify:** `docs/SKILL_SIGNING.md`, `src/lib/skills/renderSkillContent.ts`, and the emitted certificate files.

---

### Claim: AMTECH is more registry-like than a pure marketplace.

**Pass condition:** the page says AMTECH emphasizes source provenance, reciprocal links, and machine-readable artifacts instead of only a browse-and-install storefront.

**Evidence to verify:** the page copy and the comparison section.

---

### Claim: Anthropic and OpenAI are used as comparison points accurately.

**Pass condition:** the page states that Anthropic skills are filesystem-based and load on demand, while OpenAI GPTs are community-built and reviewed before broad sharing.

**Evidence to verify:** the official docs and announcement pages.

---

### Claim: The comparison includes the main tradeoff.

**Pass condition:** the page makes the tradeoff explicit: marketplace UX favors discovery, while AMTECH's registry favors provenance, raw fetchability, and reciprocal link integrity.

**Evidence to verify:** the new comparison copy on the skills page and the SEO metadata.

---

## Publish Gates

Do not consider the update done until all of the following are true:

1. The skills page contains a registry explanation and a comparison section.
2. The prerendered SEO source says the same thing in shorter form.
3. The memory/status note records the change.
4. The site builds cleanly after the edits.

