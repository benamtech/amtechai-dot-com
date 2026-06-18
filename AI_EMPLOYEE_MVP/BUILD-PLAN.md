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

Each client gateway binds its own webhook port (`8100 + n`). The client's Twilio number points at `https://<client>.agents.amtechai.com/webhooks/twilio`, and a reverse proxy maps that subdomain to the local port. You have amtechai.com and subdomains, so a wildcard `*.agents.amtechai.com` record plus Caddy is the clean path; the factory writes a per-client Caddy snippet to `state/caddy/` to import and can run `CADDY_RELOAD_COMMAND` after the snippet is written. `scripts/install_caddy_config.sh` renders the host Caddyfile for the provision hook and the per-client snippet import. Cloudflared named tunnels work the same way with no open ports.

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

`netlify/functions/claim.mjs` exposes two routes. The form posts `/claim/send-code` with the phone (Verify sends the OTP), the user enters the code, and the form posts `/claim/verify-and-claim` with the code, the consent flag, and all the answers. On an approved check, the function writes the consent/claim record, builds the manifest, and calls `triggerProvision`. That is the only verification in the system; phone ownership is proven, consent is recorded, provisioning starts, and the new agent texts the owner when it is ready.

### 3.4 The provision hook

`triggerProvision` posts the manifest to a small authenticated endpoint on your Hermes host that runs `provision_client.py`. Set `PROVISION_HOOK_URL` and `PROVISION_HOOK_TOKEN`. This is the one piece of glue between Netlify and the host; keep it authenticated since it triggers provisioning. The checked-in local host path is `scripts/provision_hook_server.py`; run `scripts/setup_local_pc.sh` once, fill `.env.provision-hook`, then start it with `scripts/run_provision_hook.sh`. `scripts/install_provision_hook_service.sh` writes a user systemd service for steady operation. With local Supabase service-role env, the hook marks claims `running`, then `provisioned` or `failed`. For first-time smoke tests, run the hook with `PROVISION_HOOK_DRY_RUN=1` and use `scripts/smoke_claim_function.mjs`, which uses `CLAIM_TEST_MODE=1` to bypass external Twilio/Supabase calls.

### 3.5 The text-in onboarding door (pre-verified)

There are now two front doors into the same factory. The web CTA at `/claim` is one; the other is texting a keyword to an AMTECH-owned number. The two doors share the entire tail: both end by building a manifest, writing the consent/claim record, and calling `triggerProvision`. The only thing that differs is how phone ownership is proven.

The keyword door exists because an inbound SMS *is* proof of phone ownership. When someone texts the onboarding number, Twilio delivers a webhook that `sms-entry.mjs` validates with `X-Twilio-Signature`. That signature proves the message genuinely came through our Twilio account from that `From` number, which is exactly the guarantee Twilio Verify gives us on the web path. So for a texter, the second code is redundant: their number is already set and already verified by the time they reach the form. Everything after that point is identical to the web flow.

The flow, end to end:

1. A person texts `AI EMPLOYEE` (also accept `ai employee`, `ai agent`, `ai worker`, case-insensitive, leading/trailing space tolerant) to the onboarding number. `STOP` and `HELP` keep their current carrier-required behavior.
2. `sms-entry.mjs` validates the signature, matches the keyword, and mints a short-lived, single-use, HMAC-signed claim token over `{phone, iat, exp (~15 min), nonce}` using a new `CLAIM_LINK_SECRET`. It records the inbound attempt (phone, nonce, Twilio `MessageSid`) and replies with one personalized link: `https://amtechai.com/claim?t=<token>`.
3. The `/claim` page reads `?t=`, posts the token to a new `claim.mjs` route `/claim/start-from-sms`, which re-validates the HMAC and expiry server-side and returns `{ phone, prefilled: true }`. The page locks the phone field read-only and hides the entire "send code / verification code" section. The seven questions, supervisor name, agent name, timezone, and the consent checkbox stay exactly as they are.
4. On submit, the form posts the answers plus the `claim_token` (instead of a `code`) to `verify-and-claim`. The function branches: a `code` re-checks Twilio Verify as today; a `claim_token` re-validates the HMAC and burns the nonce. Either branch then runs the same `buildManifest` -> `persistClaim` -> `triggerProvision` tail. The manifest records `verification.method` (`twilio_verify` or `sms_inbound`) and `consent.channel` (`web` or `sms`).

Why each guard matters, because this path skips Verify:

- The inbound-SMS proof is only as strong as the signature check. `sms-entry.mjs` must keep validating `X-Twilio-Signature` with `TWILIO_SMS_WEBHOOK_URL` set to the exact public webhook URL. Without it, anyone could POST a forged `From` and mint a token for a number they do not own. This is non-negotiable.
- The token is HMAC-signed so the browser cannot forge or alter the phone, expiring so a stale link dies, and single-use (nonce stored in Supabase and marked used on claim) so a leaked link cannot be replayed. The phone is baked into the signed payload and the field is locked on the page, so a given token can only ever claim the number that texted in.
- Consent is still captured on the page over the same consent text, recording version, timestamp, and `channel: 'sms'`, alongside the inbound `MessageSid`. The keyword text is a strong opt-in signal, but the explicit on-page checkbox is what keeps the consent record clean for A2P/TCPA.

The onboarding number is a single AMTECH-owned "front door" number, distinct from the per-client pool. Its inbound `SmsUrl` points at `/sms-entry`. It must be excluded from the pool: `claim_number.py` currently treats any number whose `SmsUrl` is not a client webhook as free, which would let a top-up re-point the onboarding number away from `/sms-entry`. Add the onboarding number to a reserved list the claimer never touches (a `reserved` array in `state/number-pool.json`, or an explicit `RESERVED_NUMBERS` env the script honors).

New env and storage this adds: `CLAIM_LINK_SECRET` on Netlify; the onboarding number bought and pointed at `/sms-entry`; and a small Supabase change for the token nonce, used-at, and `verification_method` (either columns on `ai_employee_claims` or a tiny `ai_employee_inbound_tokens` table). Files touched: `netlify/functions/sms-entry.mjs`, `netlify/functions/claim.mjs`, `src/pages/AIEmployeeClaim.tsx`, one Supabase migration, `schema/onboarding-form.json` (document the second door), and `.env.netlify.example`.

Build order note: this is a thin wrapper over Phase 3 that reuses the manifest/persist/trigger tail wholesale, so build it after the web Verify path is proven working. Do not let it block Phase 2. If you want the simplest possible signpost first, the current `sms-entry.mjs` already replies with the plain `/claim` link to any inbound text; the keyword/token upgrade turns that signpost into a real pre-verified door.

### 3.6 Consent record and A2P

Persist the consent text version, timestamp, channel, and phone for each claim. Register your A2P 10DLC brand and campaign (or use a toll-free number) before any volume so carriers do not throttle the agents' outbound texts.

Phase 3 is complete when someone can fill the form, verify once, and a real agent provisions and texts them, with a consent record written.

---

## Build order

Do Phase 2 first and provision one client by hand from a written manifest; that proves the whole agent end to end before any form exists. Add the 2.6 hardening before a real client touches it. Then build the form. Leave `--enrich` off until you have seen the deterministic output and decided the AI split is worth the dependency. The factory is the keystone: the form is a thin wrapper that ends in one `triggerProvision` call.

---

## What is already done vs. what is left

The goal is: copy the `ai-employee-all-files/` bundle to the Hermes/Caddy host, set env locally and on Netlify, run one script, and a real textable agent comes out. The code path for that exists and the dry run passes end to end. The items below are what stands between the dry run and a live agent.

Done and verified (code-complete):

- The provisioning factory (`provision_client.py`) renders the full profile, claims a number, writes the per-client Caddy snippet, registers both cron check-ins, and starts the gateway. Dry run exits clean.
- The web claim path: `/claim` page, `claim.mjs` (Verify send/check, Supabase consent, provision-hook trigger), `netlify.toml` redirects, the `ai_employee_claims` migration, and `public/_redirects` so deep links load.
- Host tooling: `setup_local_pc.sh`, `run_provision_hook.sh`, `check_local_setup.py`, `install_caddy_config.sh` / `render_caddy_config.py`, `install_provision_hook_service.sh`, and the smoke tests. The bundle is self-contained and copyable; `.gitignore` keeps `state/`, `.venv/`, and `.env.provision-hook` out of git so a fresh copy starts clean (re-run the Caddy render after copying so the import path matches the new host).

Left to do before "run script, everything works":

1. Secrets and accounts, set once. On the host `.env.provision-hook`: `PROVISION_HOOK_TOKEN`, `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `ANTHROPIC_API_KEY`, and (recommended) `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY`. On Netlify: the same `PROVISION_HOOK_TOKEN`, the Twilio account creds, `TWILIO_VERIFY_SERVICE_SID`, `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY`, `PROVISION_HOOK_URL`, and (for the text-in door) `CLAIM_LINK_SECRET`. `check_local_setup.py` flags the host ones.
2. Public ingress for the host, decided once. Two subdomains must reach this PC: `hook.agents.amtechai.com` (the provision hook) and `*.agents.amtechai.com` (per-client gateways on ports 8100+n). The rendered Caddyfile assumes the host is publicly reachable so Caddy can get per-host certs over ACME, which means a static or DDNS IP with 80/443 forwarded. A home PC behind NAT is cleaner on a Cloudflare named tunnel: TLS terminates at the tunnel and no ports are opened, but then the Caddy ACME blocks are not what does TLS and the routing is configured in the tunnel instead. Pick one; the bundle ships the Caddy path, the tunnel path is a swap at this layer only.
3. Twilio number pool, seeded once. Buy two or three SMS-capable numbers (or let the first `claim_number.py` top-up buy them), then provision. A2P 10DLC brand and campaign registration (or a toll-free number) before any volume, or carriers throttle outbound.
4. The 2.6 security gate, before a real client. Run current Hermes, keep `SMS_WEBHOOK_URL` set and `SMS_INSECURE_NO_SIGNATURE` unset, and move `terminal.backend` to `docker` after the first pilots.
5. The text-in onboarding door (Phase 3.5 above), if you want the keyword path: build the keyword/token upgrade in `sms-entry.mjs` + `claim.mjs` + the claim page, add the Supabase token fields, and reserve the onboarding number so `claim_number.py` never recycles it.

Smaller gaps worth closing:

- No provision-time "I'm live" text. The factory registers morning and midday check-ins but sends nothing at provision time, so someone who claims at 2pm first hears from the agent the next morning. The plan says the agent texts the owner when it is ready; add one immediate intro send (a `hermes -p <profile> ...` one-off, or a `now+1m` cron) at the end of `provision_client.py` to honor that.
- The reserved-number exclusion in item 5 is also a correctness fix independent of the keyword UI: the moment an onboarding number exists, the pool top-up can claim it unless it is reserved.
