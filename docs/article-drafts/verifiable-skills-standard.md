# Draft: Skills That Any AI Can Find, Use, and Verify

Draft date: 2026-06-21
Draft status: ready for review
Proposed slug: `verifiable-skills-standard`
Proposed category: `strategy`
Proposed audience: founders, technical operators, and AI builders who understand that AI tools are proliferating but recognize the fragmentation problem: skills built for one AI don't travel to others.

---

## Validity Check Before Publishing

| Requirement | Draft plan |
|---|---|
| Direct answer near the top | Opens with the platform fragmentation problem and names AMTECH's approach immediately. |
| Diagnostic or decision framework | Includes the verifiability ladder table; contrasts platform-trapped skills with open-web skills. |
| Specific useful distinctions | Distinguishes platform install vs. link-based use; signed vs. replay-verified; what the CA proves today vs. what is reserved/horizon. |
| What not to do | Honest about what the certificate does not prove; honest that the CA is infrastructure, not a distribution network. |
| DIY/internal threshold vs expert threshold | Includes the "paste the URL" simplicity alongside the structured technical layers underneath. |
| Internal links with reasons | Proposed below. |
| External citations | Nockchain, zkVerify, VET paper. |
| FAQ candidates | Included at end. |
| Schema compatibility | Supports `Article`, `BreadcrumbList`, `TechArticle`. |

### Proposed Internal Links

| Link | Reason |
| --- | --- |
| `/articles/what-is-okf-ai-readable-knowledge` | Establishes the knowledge graph and materialization foundation this article builds on. |
| `/skills/okf-audit` | The live certified skill that demonstrates everything this article describes. |
| `/skills` | Hub page showing the full catalog of certified skills with verification status. |
| `/articles/build-local-seo-plan-with-chatgpt` | Connects agentic SEO origin to practical application. |

### Proposed External Sources

1. Nockchain: distributed market for verifiable computation — https://www.nockchain.org/nockchain.pdf
2. Nockchain ZK architecture — https://docs.nockchain.org/architecture/what-is-nockchain/zero-knowledge-proofs
3. zkVerify: Powering Verifiable AI Compute Across the Agent Economy — https://zkverify.io/blog/powering-verifiable-ai-compute-across-the-agent-economy
4. VET: Verifiable Execution Traces (arXiv 2512.15892) — https://arxiv.org/pdf/2512.15892
5. AMTECH Skill Certificate-Authority Standard — `docs/skills/standard/README.md`
6. AMTECH Universal Skill Link Contract — `docs/UNIVERSAL_SKILL_LINK_CONTRACT.md`
7. AMTECH Skill Materialization Pipeline — `docs/SKILL_MATERIALIZATION_PIPELINE.md`

---

# Skills That Any AI Can Find, Use, and Verify

There is a distribution problem at the center of AI tools that nobody talks about clearly.

Skills and plugins built for one AI system do not travel. A Claude skill does not work in ChatGPT. A Codex plugin does not show up in Claude chat. A tool built for one platform stays on that platform. The AI you happen to be talking to—the basic ChatGPT interface, Claude in your browser, Grok in an X post—mostly has no idea that carefully built tools exist elsewhere.

AMTECH built a different approach. One that started with the question of how to make knowledge readable for AI agents, and ended up answering a more useful question: how do you make a skill usable by any AI, from a single link, without installing anything?

The live result: paste `https://amtechai.com/skills/okf-audit` into ChatGPT, Claude, Codex, Claude Code, Cursor, or any AI with web access. The AI reads the skill in-context and can apply it immediately. No plugin. No marketplace. No install step.

The certificate authority that sits on top of this—signing each skill and making its integrity recomputable by any third party—is the next layer. But the foundation is discoverability, and discoverability came from the knowledge graph.

## The problem that led here: agents need context, not just content

Two years ago, the working theory about AI and web content was roughly this: write good content, Google will index it, AIs will find it. That theory holds for general topics. It breaks for anything that requires structured knowledge—specific methods, workflows, entities with relationships to other entities.

AI search systems do not read pages the way a human clicks through them. They break queries into parts, extract named concepts, and look for pages that clearly explain specific things and connect them to related ideas. A page optimized purely for human scanning often tells an AI agent less than a single well-structured paragraph with clear entity relationships and useful links.

This insight led AMTECH to treat knowledge as a graph: entities with types, relationships with reasons, and a clear hierarchy of what each thing connects to and why. Not an academic exercise—a practical decision about how to structure information so agents, answer engines, and search systems can extract and use it accurately.

## One model, many surfaces

The AMTECH publishing engine takes one canonical knowledge model and materializes it into every surface a different type of consumer might need.

For an article:

| Surface | Who it serves |
| --- | --- |
| Prerendered HTML page | Human readers and crawlers |
| Markdown twin at `/articles/slug.md` | Agents that handle markdown reliably |
| JSON-LD in the page head | Search systems reading structured metadata |
| OKF concept file | Agents navigating portable knowledge bundles |
| Agent-map block in the HTML head | Any agent reading the first-fetch summary |

One authored source. Many honest projections. The same information reaches every surface because it comes from the same record—which means no version drift, no contradiction between what the page says and what the structured data says.

This materialization pattern—one model, many surfaces—is what made extending to skills natural.

## Skills as web-native objects

A skill is, at its core, a set of instructions that tells an AI how to do a specific thing. The problem with most skill formats is that they assume a particular environment: a specific agent system, a marketplace install flow, a plugin API. Remove that assumption and the skill stops working.

AMTECH's Universal Skill Link Contract inverts this: a skill should be a self-bootstrapping web object. The page at `amtechai.com/skills/okf-audit` is not a description of the skill—it is the skill, materialized into every form a different type of AI might need to receive it.

What that URL serves:

| Surface | Contents |
| --- | --- |
| Human page | Plain-language explanation, use cases, examples |
| `use.md` | First-fetch bootstrap: exactly what to do next, including "if you only have web access" |
| `SKILL.md` | The canonical skill instructions, readable directly by any AI |
| `manifest.json` | File graph, per-file hashes, load policies, source provenance |
| `agent.md` | Terse first-fetch summary optimized for agent discovery |
| Response header | `X-AMTECH-Skill-Verification` carrying the current trust status |

The decision tree inside `use.md` covers every agent environment explicitly: web-only access, file-capable agents, native-install-capable agents. An AI that lands on the page with nothing but web access is told to read the linked markdown files in-context and perform the task immediately. An agent that can write files is told how to install the skill locally. Each path is a first-class option, not a fallback.

This is what makes it work in ChatGPT, Claude chat, or Grok. When a user shares the link, the AI fetches the page, reads the bootstrap, and knows what to do. The skill is on the open web, structured for first-fetch clarity, with no platform dependency.

## The standard that makes this systematic

Publishing one skill this way is a project. Publishing many skills this way, keeping them consistent, and ensuring every surface says the same thing—that requires a standard.

The AMTECH Skill Standard defines what a skill must carry to be a proper web-native, multi-surface object: the required file structure, the manifest shape, what the human page must include, what `use.md` must tell an agent, how every projection links back to every other projection. The standard is what keeps the materialization pipeline honest—the same rule applies to every skill, and a validator fails the build if any surface contradicts another.

This is a different kind of standard than what existing agent platforms provide. OpenAI, Anthropic, and the emerging protocol-level specifications (MCP, A2A) define how to call a skill once it is installed. The AMTECH standard defines what a skill is as a web object—how it gets delivered, how an agent discovers it, what it must carry on first fetch.

These are not in competition. A skill can conform to both: callable via any protocol, and also self-bootstrapping from a single web URL.

## The certificate authority: integrity on top of discoverability

Once a skill is properly materialized into stable, verifiable surfaces, it can be signed.

The AMTECH Certificate Authority takes a materialized skill and produces a signed certificate that binds together:

- The exact byte content of every file in the skill
- A structured attestation of what was checked (conformance testing, human review)
- The publisher identity and the timestamp

That certificate is then published across every surface—in the manifest, in the page's JSON-LD, in the HTTP response headers, in a `recipe.json` file that carries the full recomputation path.

The result is a graduated ladder of what can be independently proven:

| Tier | What it proves |
| --- | --- |
| Signed | These bytes match the original certificate—provenance is authentic |
| Structure-verified | The skill conforms to the schema and structural contract |
| AMTECH-reviewed | AMTECH reviewed and published this skill under a named policy |
| Replay-verified | Any third party can recompute the full verdict from the published surfaces |

The top rung—replay-verified—is designed around a specific security property: reproducibility. Because every surface carries the ingredients of a deterministic check, an agent or independent auditor can recompute the cryptographic path from the published signing key through the signed certificate to each individual file, and reach the same verdict that AMTECH reached at build time. A downstream system that wants to display "verified" must recompute it—it cannot forward a badge.

The authority record itself is append-only and hash-chained, with every publish event, key rotation, and revocation recorded in sequence and cross-witnessed by a signed Git history in a separate public repository.

### One authority today—but the design does not require one

The certificate authority is operated by AMTECH today, and a consumer who accepts a verdict is, at the final step, trusting AMTECH's published signing key. That is the honest current state. What is worth noticing is how little of the machinery actually depends on there being a single authority—because three properties are already built, not hypothesized:

- **The certificate binds bytes, not a signer.** Its anchor is a digest of the skill's source package, recomputed independently in two separate repositories that must agree before a release is valid. The proof of *what* is being attested does not route through any one party's identity.
- **Verification is already permissionless.** The replay recipe lets anyone recompute the full verdict with no AMTECH service in the loop, and the standard already treats independent re-runners as a second class of witness alongside the signed Git history.
- **The verifier already trusts multiple independent keys.** Multi-key serving is in production: a certificate is checked against whichever key signed it, including rotated-out keys for the records they signed in their validity window.

Given that, the step from *many keys, one authority* to *many keys, many authorities*—several independent reviewers each attesting to the same exact bytes, with the verdict computed as a policy over the set (for example, "reviewed by at least two of these parties")—is a policy layer on top of existing mechanisms, not a redesign. The certificate is structured as a subject bound by digest plus a separable attestation, the same discipline the software-supply-chain world uses precisely so that multiple parties can attest independently. That multi-signer policy layer is not built yet; the foundation it would sit on is.

## What the certificate does not prove

Being precise about this matters.

The certificate proves that AMTECH signed these exact bytes, that the skill conforms to its structural contract, and that it was reviewed under a named policy. It does not prove that the skill is safe or correct in every use case. It does not prove AI behavior—whether the skill instructions produce good outputs when run against a model is not something a static certificate attests to.

The standard is honest about this. Two additional rungs exist on the ladder—reserved and horizon—for a reason.

**Behavior-verified** would involve attesting to a reference run: AMTECH runs the skill against a defined input, records the model output, and signs the result. A consumer could compare their own run against the published behavior. The infrastructure for this is defined in the standard; it is not yet built.

**Proof-verified** is further out. Projects like [Nockchain](https://nockchain.org/)—a blockchain whose mining produces zero-knowledge proofs of state transitions rather than discarded hashes—are building the infrastructure layer that makes this plausible at scale: verifiable compute as a tradable commodity, where a prover submits a cryptographic proof that a specific computation happened, and any party checks the proof without re-running the model. The proof generation cost for large models is still high. But the direction is established, and the AMTECH verifiability ladder has a reserved slot for it when it becomes practically useful.

The deeper shift that rung enables is in *who is allowed to certify*. When a certificate carries a proof that the prescribed check actually ran, a consumer verifies the proof rather than the party that produced it—so certification need not come from AMTECH, or from any single known authority, the way a blockchain accepts a block from an unknown miner because the proof checks out. That is the long-horizon version of the multi-authority direction above: trust rooted in a checkable proof instead of a known identity. It is genuinely speculative for AI workloads today, which is exactly why it sits on the horizon rung and not in the shipped ladder—the near-term, buildable version of "more than one authority" is the multi-reviewer policy layer described earlier, which needs no new cryptography at all.

## Why this matters now

The certificate authority AMTECH operates is new, and the ecosystem of tools that automatically consume and act on these certificates does not yet exist in mainstream AI systems. A skill carrying an AMTECH cert is not automatically more trusted by ChatGPT or Claude than a skill without one—those systems do not yet speak this protocol.

But the value of the standard and the CA is not dependent on immediate ecosystem adoption. Three things work today:

1. Any AI with web access can find and use an AMTECH skill from a single link—no install, no platform dependency.
2. Any person or agent that wants to verify a skill's authenticity can recompute the certificate check from the published surfaces, independent of any AMTECH service.
3. The standard is the foundation for adding more rigorous verification later—behavioral testing, consumer re-derivation against published challenges, eventually proof-compute—without changing the certificate shape or the verifier.

The combination of open-web delivery, a structured materialization standard, and a recomputable certificate authority is the kind of infrastructure that becomes load-bearing before it becomes obvious. The moment when "is this skill trustworthy" is an operationally important question—when agents are executing real workflows with real consequences—is the moment when having built the standard early looks like the right call.

Certified skills are not particularly powerful yet. That is a fair statement about where this is. The more accurate statement is: skills that are open-web discoverable, self-bootstrapping for any AI, structurally verified, and cryptographically signed are a different category of thing than skills that require a specific marketplace and produce nothing checkable. The gap between those two things is what the standard is about.

## The short version

Most AI skills are platform-trapped—built for one system, invisible to every other. AMTECH built skills as open-web objects: a single URL serves a human page, AI-readable markdown, a file manifest, and a structured bootstrap that any AI can pick up and use in-context. ChatGPT, Claude, Codex, Claude Code, Cursor—any AI with web access can use an AMTECH skill from the link alone.

The foundation for this was agentic SEO: treating knowledge as a graph and materializing it across every surface different consumers need. The same engine that serves articles this way serves skills.

The AMTECH Skill Certificate Authority adds integrity on top: a signed certificate that binds the skill's exact bytes to a provenance and review record, with a recomputable verification recipe any third party can replay. The current certificate proves provenance and structure, not AI behavior. Behavioral verification and cryptographic proof-of-computation (via emerging verifiable compute infrastructure) are reserved and horizon rungs respectively.

The ecosystem of tools that consumes these certificates is early. But a structured, recomputable standard for what a verified skill means—built on top of skills that are already open-web discoverable and usable by any AI—is the right foundation to have.

---

## FAQ Draft

### Can I really use an AMTECH skill in basic ChatGPT or Claude chat?

Yes, if the AI has web access. Share the skill URL, the AI fetches the page and `use.md`, and can apply the skill immediately from those instructions. No install, no plugin, no platform-specific step. The `use.md` explicitly covers the "if you only have web or search access" path.

### What does the AMTECH certificate actually prove?

That AMTECH signed these exact bytes (provenance), that the skill conforms to its structural contract (structure), and that a human review was completed under a named policy (review). It does not prove that the skill's AI outputs are correct, safe, or appropriate for every use case.

### How is this different from OpenAI plugins or Claude skills?

Those standards define how to call a skill once it is installed on a specific platform. The AMTECH standard defines what a skill is as a web-native, multi-surface object—how it gets delivered, how any AI discovers it, what it carries on first fetch. They address different layers and are not in competition.

### What is the `replay-verified` tier?

The top current rung of the verifiability ladder. It means any third party can recompute the full verification verdict from the published surfaces—the certificate, per-file hashes, signing key, catalog root—without relying on any AMTECH service. Determinism is the security property: anyone who runs the check reaches the same answer.

### Does a skill have to be certified by AMTECH?

Today, yes—AMTECH operates the certificate authority. But the certificate is designed to bind exact bytes rather than a signer's identity, verification is already permissionless (anyone can recompute the verdict with no AMTECH service involved), and the verifier already validates against multiple independent keys. So extending to several independent reviewers each attesting to the same skill—with a verdict computed as a policy over the set—is a policy layer over machinery that already exists, not a redesign. A fully trustless version, where an unknown party certifies and you trust a cryptographic proof rather than the party, is a horizon goal tied to verifiable-compute infrastructure, not a current capability.

### What is Nockchain?

A blockchain whose mining process produces zero-knowledge proofs of state transitions rather than discarded hashes—making verifiable compute a commodity. It is one example of the infrastructure direction that would eventually support cryptographic proof that a specific AI computation happened, which corresponds to the `proof-verified` horizon rung in the AMTECH verifiability ladder.

---

## Research Appendix

### External References

- Nockchain whitepaper: verifiable computation as a distributed market; ZK-PoW where mining produces succinct proofs of state transitions, with off-chain apps settling on-chain through constant-cost verification.
  Source: https://www.nockchain.org/nockchain.pdf

- Nockchain ZK architecture: NockApps run off-chain; succinct proofs settle on the shared base layer; verification cost is constant regardless of computation size.
  Source: https://docs.nockchain.org/architecture/what-is-nockchain/zero-knowledge-proofs

- zkVerify: framing ZK coprocessors as a "verifiable service layer" with cryptographic guarantees over trust-based ones; infrastructure for powering verifiable AI compute.
  Source: https://zkverify.io/blog/powering-verifiable-ai-compute-across-the-agent-economy

- VET (Verifiable Execution Traces): research on verifiable traces for AI agent tool-calls; a parallel research direction to ZK proofs for behavioral verification.
  Source: https://arxiv.org/pdf/2512.15892

### AMTECH Internal References

- `docs/skills/standard/README.md`: full AMTECH Skill Certificate-Authority Standard.
- `docs/skills/standard/09-verifiability-and-proof-methods.md`: verifiability ladder, method registry, `graph-replay` recipe, reserved and horizon rungs.
- `docs/skills/standard/01-trust-model-and-threats.md`: trust model, threat table, explicit non-goals.
- `docs/skills/standard/05-multi-surface-exposure.md`: how one verifier run projects to every surface.
- `docs/UNIVERSAL_SKILL_LINK_CONTRACT.md`: the first-fetch principle and self-bootstrapping URL contract.
- `docs/SKILL_MATERIALIZATION_PIPELINE.md`: the build pipeline from skill folder to all published surfaces.
- `docs/AMTECH_SHAREABLE_SKILLS_STRATEGY.md`: original strategy for platform-agnostic skill distribution.
- `wiki/research/2026-06-20-meta-as-agent-entry-surface-agentic-web.md`: how AMTECH's per-resource materialization relates to emerging agentic-web standards (llms.txt, agents.txt, WebMCP, SRI-2).
- `wiki/research/2026-06-20-system-reality-check-and-experimentation-frontier.md`: honest assessment of what the system does and does not do.
