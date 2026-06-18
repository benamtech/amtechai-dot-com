# AMTECH AI Employee — Build Plan (Phases 2 and 3)

Phase 0 (base install) and Phase 1 (the template) are done as concepts; the template exists as files in this repo. Two phases remain, and the second is now much smaller than first planned: the provisioning factory, and one onboarding form that verifies the phone inline and triggers provisioning. No SMS conversation, no second code.

One Hermes install, one isolated profile per client, one Twilio number per client claimed from a pool. Deliverables live here: `template/` is the agent, `schema/` is the data contract, `scripts/` is the factory, `cron/` is the check-ins, `netlify/functions/` is the front door.

---

## Phase 2 — The provisioning factory

This is the only substantial code. The goal: one command turns a finished manifest into a live, isolated AI employee with its own number, in under a minute.

### 2.1 Confirm the template renders

The template uses `{{TOKEN}}` placeholders that `scripts/provision_client.py` fills from a manifest. Render once against the example and read it by eye:

```
python3 scripts/provision_client.py --manifest schema/client-manifest.example.json --dry-run
```

Dry run prints every action and writes nothing. Confirm SOUL, USER, MEMORY, AGENTS, brain, skills, config, and `.env` come out with the business filled in and no stray tokens.

### 2.2 The document path: persistent template plus per-client data

Each client's markdown is the persistent AMTECH AI Employee material (the employee persona in `SOUL.md`, the operating policy and always-on context in `AGENTS.md`, the preloaded skills) combined with that one client's data. The client data arrives as the seven raw form answers.

By default there is no AI in the middle. `provision_client.py` maps each raw answer into its primary field deterministically, drops the verbatim answers into the brain so nothing is lost, and lets the agent refine the detail over time. This is the recommended path; it is simpler and has no extra dependency or cost.

The AI structuring step is there when you want it, off unless asked. Run with `--enrich` and `scripts/enrich.py` sends the raw answers to an LLM (Grok 4.3 by default, any JSON-capable model works) and gets back clean per-field values, so "Scoop Dogg, dog waste pickup, 3 yrs" becomes a separate business name and business type up front. If enrichment fails for any reason it falls back to the deterministic map, so turning it on never blocks a provision.

```
python3 scripts/provision_client.py --manifest <manifest>.json            # deterministic, default
python3 scripts/provision_client.py --manifest <manifest>.json --enrich    # AI structuring on
```

### 2.3 Stand up the Twilio number pool

`scripts/claim_number.py` treats a number as free when its inbound `SmsUrl` is not pointed at a client webhook, claims one by setting that `SmsUrl`, records it in `state/number-pool.json`, and tops the pool back to four whenever fewer than two are free. The assumption that there are always two or more free numbers holds because the top-up runs on every claim. Buy two or three SMS-capable numbers once by hand (or let the first top-up do it), set `TWILIO_ACCOUNT_SID` and `TWILIO_AUTH_TOKEN`, then:

```
python3 scripts/claim_number.py --client-id test --webhook-url https://test.agents.amtechai.com/webhooks/twilio --dry-run
```

### 2.4 Wire per-client routing

Each client gateway binds its own webhook port (`8100 + n`). The client's Twilio number points at `https://<client>.agents.amtechai.com/webhooks/twilio`, and a reverse proxy maps that subdomain to the local port. You have amtechai.com and subdomains, so a wildcard `*.agents.amtechai.com` record plus Caddy is the clean path; the factory writes a per-client Caddy snippet to `state/caddy/` to import and reload. Cloudflared named tunnels work the same way with no open ports.

### 2.5 Run the factory for real

```
python3 scripts/provision_client.py --manifest <manifest>.json
```

It claims a number, creates the profile, renders the template into `~/.hermes/profiles/client_<id>/` and the workspace into `~/amtech/clients/<id>/workspace`, registers the two cron check-ins, writes the Caddy snippet, and installs and starts the per-client gateway with the client's timezone set so check-ins fire in local time.

### 2.6 Security gate, do not skip

The agent has shell and file tools. On current Hermes the SMS webhook validates the `X-Twilio-Signature` header, and that validation, not the phone allowlist, is the real boundary: the allowlist trusts the spoofable `From` field. So run a current Hermes version, keep `SMS_WEBHOOK_URL` set, never set `SMS_INSECURE_NO_SIGNATURE` outside local debugging, and once past the first pilots switch `terminal.backend` to `docker` in the template config so each client's tool execution is contained.

Phase 2 is complete when running the factory against a hand-written manifest produces an agent you can text on its own number, that knows the business, and that sends its morning check-in on schedule.

---

## Phase 3 — The onboarding form

One page on amtechai.com, one inline verification, one trigger. This replaces what was originally split into an SMS intake state machine plus a separate web form; collapsing verification into the form removed the back-and-forth and the second code entirely.

### 3.1 Create a Twilio Verify service

In the Twilio console, create a Verify service and note its `VA...` SID. Verify sends and checks the one-time code over managed telephony, so you do not need to own a number for the verification itself. Set `TWILIO_VERIFY_SERVICE_SID` for the function.

### 3.2 Build the form

A page collecting the seven answers (branching on the business question), the supervisor's name, what to call the agent, the timezone, and a consent checkbox over the consent text in `schema/onboarding-form.json`. The CTA: "verify your phone number to claim your AI Employee." The form holds the answers client-side across the two calls below, so there is no server-side state to manage.

### 3.3 Two posts, one verification

`netlify/functions/claim.js` exposes two routes. The form posts `/send-code` with the phone (Verify sends the OTP), the user enters the code, and the form posts `/verify-and-claim` with the code, the consent flag, and all the answers. On an approved check, the function builds the manifest and calls `triggerProvision`. That is the only verification in the system; phone ownership is proven, consent is recorded, provisioning starts, and the new agent texts the owner when it is ready.

### 3.4 The provision hook

`triggerProvision` posts the manifest to a small authenticated endpoint on your Hermes host that runs `provision_client.py`. Set `PROVISION_HOOK_URL` and `PROVISION_HOOK_TOKEN`. This is the one piece of glue between Netlify and the host; keep it authenticated since it triggers provisioning.

### 3.5 Optional SMS signpost

If you still want a "text AGENT to <number>" door, `netlify/functions/sms-entry.js` is a one-reply function that points texters at the form link. It needs one onboarding number whose inbound webhook points at it. This is optional; the web CTA is the primary path.

### 3.6 Consent record and A2P

Persist the consent text version, timestamp, channel, and phone for each claim. Register your A2P 10DLC brand and campaign (or use a toll-free number) before any volume so carriers do not throttle the agents' outbound texts.

Phase 3 is complete when someone can fill the form, verify once, and a real agent provisions and texts them, with a consent record written.

---

## Build order

Do Phase 2 first and provision one client by hand from a written manifest; that proves the whole agent end to end before any form exists. Add the 2.6 hardening before a real client touches it. Then build the form. Leave `--enrich` off until you have seen the deterministic output and decided the AI split is worth the dependency. The factory is the keystone: the form is a thin wrapper that ends in one `triggerProvision` call.
