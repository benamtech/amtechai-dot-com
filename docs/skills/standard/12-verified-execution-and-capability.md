# 12 — Verified Execution & Capability (the assurance/autonomy grant)

Part of the AMTECH Skill Certificate-Authority Standard. Defines how a verification verdict becomes *useful to an
agent that holds the AMTECH verifier* — how much **autonomy** a skill's scripts and workflows **warrant**, given
what the verdict proved. Builds on `02` (the `permissions` + `safety` capability manifest), `04` (the verdict +
its three depths), `09`/`10` (the tiers that feed the grant). Consumed by the AI Employee MVP (`AI_EMPLOYEE_MVP/`)
as the reference host.

## The principle: describe, don't gate

Bootstrapping a skill from a link and running its scripts and advanced workflows is the **whole point** of the
standard — it is never blocked by verification. What verification *adds* is **assurance**, and assurance is what
lets a host grant **autonomy**: run with less friction, run unattended, chain into multi-step workflows. The
verifier **describes** what a verdict warrants; the **host decides policy** and does the enforcing.

> **link = a skill anyone can bootstrap and run; link + AMTECH verifier = the assurance to run it autonomously,
> unattended, and at scale.** Verification upgrades how far you can trust a skill to act on its own — it never
> withholds the right to execute.

This rides the boundary the AI Employee MVP names: a Hermes employee has **shell + file tools**
(`config.yaml terminal.backend: local|docker`), and the README + `BUILD-PLAN.md` §2.6 state the real risk is
**provenance/integrity**, not the channel. A `replay-verified` skill removes that risk (the script bytes are proven
to be exactly what the authority signed and to match the declared permission envelope), so the host can stop
treating them as unknown code.

## The capability manifest (already signed, in `02`)

The cert's `attestations.permissions` + `safety` block IS the capability manifest — no new signed structure:

- `permissions.scripts[]` — the exact executables in the package (machine-checked at signing; `UNDECLARED_SCRIPT`
  on mismatch). This is the **authorship/provenance** of the code: proven to be the authority's bytes.
- `permissions.filesystem` — `none | read | read-write | read-write-optional`.
- `permissions.network` — `none | outbound | bidirectional`.
- `permissions.secrets` — `none | declared` (the hook for credential brokering — `13`).
- `safety` — `{ scripts, requiresNetwork, requiresSecrets, riskNote }`.

## The assurance/autonomy grant (verifier output)

The verifier derives a pure, side-effect-free `capability` from `(verdict, certificate)` and adds it to the `04`
output. It **never exceeds** the signed, recomputed `permissions` envelope:

```jsonc
"capability": {
  "scripts": ["scripts/order.ts"],         // from permissions.scripts (empty for script-free skills)
  "filesystem": "read-write-optional",
  "network": "outbound",
  "secrets": "none",
  "assuranceLevel": "effectiveness",        // none | integrity | authorship | effectiveness
  "autonomyWarranted": true,                // host may run unattended / chain workflows
  "isolationRecommended": true              // recommend a sandbox (e.g. docker) when network/secrets/scripts present
}
```

`assuranceLevel` ladder (what the verdict proved):
- `none` — unverified, or any signature/authorship failure (`INVALID_SIGNATURE`, `UNDECLARED_SCRIPT`,
  `SOURCE_PACKAGE_MISMATCH`). The host has no AMTECH assurance to lean on.
- `integrity` — the served bytes recompute to the signed digests (`replay-verified` integrity steps).
- `authorship` — additionally, the scripts are the authority's exact declared set (`permissions.scripts` matches).
- `effectiveness` — additionally, `behavior-verified` (measured uplift) — the workflow is proven to help.

## Per-verdict grant table (what each verdict *warrants*)

| Verdict | `assuranceLevel` | `autonomyWarranted` | Host default policy |
| --- | --- | --- | --- |
| **Unverified** (no AMTECH verifier / failed checks) | `none` | `false` | Bootstrap + run freely **with the host's normal caution** — sandbox, confirm external/irreversible actions. Not blocked; just unassured. |
| **`replay-verified`** | `integrity`/`authorship` | `false` | Run with **reduced friction** — bytes proven genuine + match the permission envelope, so skip tamper-doubt; still sandboxed per host rules. |
| **`behavior-verified`** | `effectiveness` | `true` | Run **autonomously / unattended** — scheduled/cron contexts, chained workflows, fewer per-step confirmations. |

Autonomy is *warranted*, not *forced*: a host may always require more caution (the confirmation gate for anything
that leaves the business or spends money still applies regardless of verdict).

## Host policy obligations (the host enforces; the standard informs)

A conforming host (Hermes, Claude Code, any verifier-embedding client) MUST:
1. Treat `assuranceLevel: none` as "no AMTECH assurance" — apply its normal untrusted-code caution; it MUST NOT
   present such a skill as AMTECH-verified. It MAY still run it.
2. Never grant a capability beyond the signed `permissions` envelope, even if the skill body asks for more.
3. Keep its own controls active across all verdicts — sandbox/isolation (`isolationRecommended`), the external-
   action confirmation gate, and (for AI employees) the per-client profile boundary.
4. Use `autonomyWarranted` only to *relax friction* (unattended runs, fewer confirmations), never to bypass (3).

**AI Employee MVP mapping (worked reference):** `permissions` → `terminal.backend: docker` isolation; external
actions → the `AGENTS.md` confirmation gate; `secrets: declared` → the credential broker (`13`); per-client
sandbox → the Hermes profile. All apply regardless of verdict; verification lets the employee *act on its own with
confidence* (e.g. draft estimates unattended in a cron check-in once the skill is `behavior-verified`).

## Relationship to `04` depths
`04` already defines `archive-byte` depth as *"required before install / running scripts."* The capability grant
sits on top: depth says *how thoroughly you checked*; the grant says *what that check warrants*. A host that
intends to execute scripts SHOULD verify at `archive-byte`/`graph-replay` depth so the grant reflects real
integrity, not link-only metadata.

## Guardrails
- **Describe-not-gate.** The verifier is side-effect-free; it only emits `capability`. It never runs, blocks, or
  brokers anything.
- Any signature/authorship failure forces `assuranceLevel: none` — no false authorship/integrity claim.
- The grant is a function of the *signed* envelope; a skill cannot widen its own permissions by editing its body.

## Related
- `02` (the capability manifest fields), `04` (verdict + depths), `09`/`10` (tiers feeding the grant),
  `13` (credential brokering via `secrets: declared` + client certs), `AI_EMPLOYEE_MVP/BUILD-PLAN.md` §2.6 (host
  security boundary).
</content>
