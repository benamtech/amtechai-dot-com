# 13 — Client Certificates & Credential Brokering

Part of the AMTECH Skill Certificate-Authority Standard. Defines how an AMTECH agent (an AI employee or any client
embedding the verifier) **proves its own identity** with a CA-issued client certificate, and how a *verified*
skill's scripts can then **use real credentials to reach external services** — without hardcoding secrets into the
skill or trusting unverified code. Builds on `02` (the `amtech-signed-artifact/v2` envelope + `permissions.secrets`),
`12` (the capability grant that gates autonomy of a credentialed call), `03` (identity revocation in the authority
history). This is the use case that turns the CA from a skill registry into the trust substrate of an **agentic
operating environment**. Status: **normative spec; built when the first credentialed skill needs it** (the free,
script-free `estimate` MVP does not exercise it).

## The problem

Useful office work means touching real services — sending an SMS via Twilio, pulling a price from a supplier API,
writing to a CRM. A skill's script needs a credential to do that. Two bad options dominate today: bake the secret
into the skill (leaks; un-rotatable; same secret for everyone), or hand the agent broad standing credentials (any
skill, verified or not, can use them). The CA already proves *what* a skill is and *that its scripts are genuine*
(`02`, `12`); add a proof of *who is running it*, and a host can broker a **scoped** credential safely.

## A. The client / holder certificate

A **holder certificate** is the agent's own CA-issued identity — the mTLS-client-cert analogue. It is an ordinary
`amtech-signed-artifact/v2` with `subjectType: 'holder'`:

```jsonc
{
  "schemaVersion": "amtech-signed-artifact/v2",
  "subjectType": "holder",
  "subjectId": "amtech:holder:client_8f3a",   // the provisioned agent / client
  "owner": { "id": "amtech:client:acme-plumbing", "name": "Acme Plumbing" },
  "holder": {
    "publicKey": "<Ed25519 pub>",              // the agent holds the matching private key locally
    "issuedAt": "2026-06-22T...","expiresAt": "2027-06-22T...",
    "status": "active"                          // active | suspended | revoked (mirrors key lifecycle, 03)
  },
  "certificateId": "...", "issuer": {...}, "signingKeyId": "...", "signature over canonicalJson"
}
```

- The agent proves possession by **signing a fresh challenge** with its holder private key (proof-of-possession),
  or by presenting the cert over an already-authenticated host channel. The holder private key lives in the agent's
  isolated profile (Hermes per-client profile / secret store) and is **never** in a skill package.
- **Revocation** is an authority event (`03`): a `revoked`/`suspended` holder → the verifier returns no valid
  identity → brokering is refused. Same machinery as signing-key revocation.
- Issued at provisioning time by the factory (`AI_EMPLOYEE_MVP/.../provision_client.py`): each AI employee gets one
  holder cert + keypair alongside its profile.

## B. The credentials manifest (`secrets: declared`)

When a skill needs credentials, `permissions.secrets` is `declared` and the skill ships a **credentials manifest**
(`amtech-skill-credentials/v1`, part of `sourcePackage`, so it is signed and `UNDECLARED_SECRET`-checkable):

```jsonc
{
  "schemaVersion": "amtech-skill-credentials/v1",
  "skill": "parts-ordering",
  "needs": [
    { "name": "SUPPLIER_API_KEY", "service": "supplier.example.com",
      "scope": "read:catalog write:order", "network": "outbound", "rationale": "look up parts + place orders" }
  ]
}
```

The skill declares *which named credentials, for which service, at what scope, and why* — it never names the secret
value. The signer gate: every name in `needs[]` must be referenced by a declared script, `network` must be covered
by `permissions.network`, and `permissions.secrets` must be `declared` (else `UNDECLARED_SECRET` /
`SECRET_SCOPE_MISMATCH`).

## C. The three-party brokering chain (the act)

A script that needs a credential triggers this, all host-mediated:

1. **What is running** — the host verifies the **skill** at `archive-byte`/`graph-replay` depth (`04`): genuine
   bytes, declared scripts, the credentials manifest is signed and bound. Capability grant (`12`):
   `secrets: declared`, `assuranceLevel ≥ authorship`.
2. **Who is running** — the host verifies the **holder cert** (active, not revoked) and a proof-of-possession.
3. **Whether it may** — (optional) an **entitlement** cert (`02` §entitlement) if the skill/service is paid; the
   host policy + `autonomyWarranted` (`12`) decide whether to broker without a human confirm.
4. **Broker** — only if 1–3 pass, the host's **secret store** (Hermes `.env` / profile vault) injects the *scoped*
   credential into the script's environment **for that invocation** — least privilege, time-boxed, never written
   to the package or logged. The CA **issued identity and authorized; it never held the secret.**

```
skill cert (what + manifest)  ─┐
holder cert (who)             ─┼─► host broker ─► scoped, time-boxed credential ─► script ─► service
entitlement cert (may, $)     ─┘     (secret store: Hermes profile vault)
```

## D. Scoping, least privilege, revocation
- Brokered credentials are **scoped to the declared `service`+`scope`**, issued per-invocation, and SHOULD be
  time-boxed / single-use where the service supports it.
- A `revoked` holder, a failed skill verification, an undeclared secret, or a scope the manifest didn't declare →
  **no brokering** (fail-closed). Standing broad credentials are an anti-pattern the manifest exists to replace.
- Rotation is a host concern (rotate the vault secret) — independent of the certs, because the skill names secrets,
  never values.

## E. Threats & honest limits

| Threat | Mitigation |
| --- | --- |
| Malicious skill exfiltrates a secret | Only **verified** skills with a **signed, scoped** credentials manifest get brokered creds; least privilege; host isolation (`12`); `UNDECLARED_SCRIPT`/`UNDECLARED_SECRET`. |
| Stolen holder private key | Holder revocation (`03`); proof-of-possession over a fresh challenge; short holder-cert expiry. |
| Over-broad scope | Scope declared in the manifest + checked against the service grant; broker refuses out-of-scope. |
| Replay of a brokered credential | Time-boxed / single-use credentials; the service, not the CA, is the resource authority. |

**Honest boundary:** this layer **identifies and authorizes**; it does not itself encrypt or store secrets, and it
does not make a compromised host safe. Security still depends on host secret hygiene, isolation (docker), and the
service's own scoping. The CA's contribution is making credential use **conditional on verifiable identity +
provenance + declared, signed scope** instead of on trust.

## Related
- `02` (envelope, `permissions.secrets`, entitlement subjectType), `12` (capability grant gating the credentialed
  call), `03` (holder revocation in the authority history), `11` (federation — third-party holders/issuers),
  `AI_EMPLOYEE_MVP/` (the host: profile vault, docker isolation, provisioning that issues the holder cert).
</content>
