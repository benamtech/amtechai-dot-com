# AMTECH AI Employee

A self-hosted Hermes Agent install where every client is one isolated profile (one AI employee), reached over SMS on its own Twilio number. The agent is framed as an employee reporting to the business owner, not a chatbot, and it gets actual work done rather than handing back text.

There is almost no custom software here. The agent runtime, memory, skills, cron, and SMS gateway are all Hermes. What this repo adds is a template for the agent and a thin factory that stamps it out per client.

## Layout

```
template/                 The AI employee, as files. Rendered per client.
  SOUL.md                 Identity (slot #1 in the prompt): the AI-employee persona.
  config.yaml             Per-profile Hermes config (model, terminal, cron, sms).
  .env.template           Per-profile secrets and SMS wiring.
  memories/
    MEMORY.md             Seed business facts (kept tight).
    USER.md               Model of the supervisor the agent reports to.
  skills/
    estimate/             Produce a price estimate as a file.
    invoice/              Produce an invoice as a file.
    daily-checkin/        Loaded by the two scheduled check-ins.
  workspace/              Becomes the client's terminal.cwd (isolated working dir).
    AGENTS.md             Standing operating instructions, read every session.
    brain/                The business wiki the agent reads and grows.
    output/               Where estimates, invoices, and other deliverables land.

schema/
  onboarding-form.json    The seven-question intake contract + consent text.
  client-manifest.example.json   A filled manifest: the input to the factory.

cron/
  jobs.template.json      The morning and midday check-ins, data-driven.

scripts/
  claim_number.py         Lazy Twilio pool picker: claim a free number, top up.
  provision_client.py     The factory: manifest -> live isolated AI employee.
  provision_hook_server.py Authenticated local hook called by Netlify after Verify.
  setup_local_pc.sh       First-run local install/check script for the Hermes PC.
  check_local_setup.py    Local prerequisite and dry-run verifier.
  install_caddy_config.sh Render host Caddy config and print install/reload commands.
  install_provision_hook_service.sh Create a user systemd service for the hook.
  generate_claim_link_secret.mjs Print a strong CLAIM_LINK_SECRET for Netlify.
  smoke_claim_function.mjs Local Netlify-claim-to-hook smoke test.
  smoke_sms_entry.mjs Local SMS signpost smoke test.
  verify_supabase_claim_table.mjs Verify ai_employee_claims is reachable through Supabase REST.
  apply_supabase_ai_employee_migration.sh Push Supabase migrations when Supabase CLI is installed.
  render_caddy_config.py  Render state/caddy/Caddyfile from host/Caddyfile.template.
  enrich.py               OPTIONAL: AI-structure raw answers into clean fields.
requirements-local.txt    Python packages for Twilio number claims and optional enrichment.
.env.netlify.example      Server-side Netlify env checklist for the claim functions.
host/
  Caddyfile.template      Reverse-proxy template for hook + per-client snippets.

netlify/functions/
  claim.js                The onboarding form handler: inline Twilio Verify -> provision.
  sms-entry.js            OPTIONAL: "text AGENT" signpost that replies with the form link.

state/                    Local runtime state (number pool registry, caddy snippets).
BUILD-PLAN.md             Step-by-step for phases 2, 3, 4.
```

## How a client comes to life

1. A lead fills the form on amtechai.com: the seven answers, their name, what to call the agent, timezone, and a consent checkbox. They verify their phone once, inline, with a Twilio Verify code (`claim.js`).
2. On an approved code, the form produces a manifest (see `schema/client-manifest.example.json`), writes a consent/claim record in Supabase, and posts the manifest to the authenticated local provision hook. There is no second code and no SMS conversation.
3. `provision_hook_server.py` accepts the manifest, writes it to `state/provision-requests/`, marks the claim `running` when Supabase service-role env is present locally, and runs `provision_client.py` in the background.
4. `provision_client.py` claims a Twilio number, creates the Hermes profile, renders the template with the business's details, registers the two daily check-ins, maps a subdomain to the gateway, and starts it. The hook marks the claim `provisioned` or `failed` when the process exits.
5. The new agent texts the owner that it's ready. From then on the owner is talking to their own AI employee on its own number.

## Where the per-client docs come from

The persistent parts (the employee persona in `SOUL.md`, the operating policy and always-on context in `AGENTS.md`, the preloaded skills) are the same for every client. Only the data differs, and it comes straight from the seven form answers.

By default there is no AI in the loop: the answers are mapped into fields deterministically and stored verbatim in the brain, and the agent sharpens the detail as it works. The optional `--enrich` flag routes the raw answers through an LLM (Grok 4.3 by default) for clean up-front field splitting, falling back to the deterministic map if it fails. Keep it off unless the cleaner split earns the dependency.

## The two ideas the template encodes

It uses skills as much as possible. The estimate, invoice, and check-in procedures are skills, loaded only when relevant, and `AGENTS.md` tells the agent to lean on skills and to write new ones when it solves something that will recur. That is how each agent gets better at its specific business over time.

It is an employee talking to a supervisor. `SOUL.md` sets the employee persona and the texting voice; `USER.md` models the supervisor; `AGENTS.md` sets the operating rule that matters most, which is to finish the work and report the result. The confirmation gate keeps anything that leaves the business behind a one-line yes.

## Running it

First-run setup on the Hermes PC:

```
cd AI_EMPLOYEE_MVP/ai-employee-all-files
scripts/setup_local_pc.sh
```

From the repo root, the same local commands are exposed as:

```
npm run ai:local:setup
npm run ai:local:check
npm run ai:caddy:render
npm run ai:provision:dry-run
npm run ai:claim:secret
npm run ai:claim:smoke
npm run ai:sms:smoke
npm run ai:supabase:push
npm run ai:supabase:verify
```

For the optional SMS signpost, set `TWILIO_SMS_WEBHOOK_URL` in Netlify to the exact URL configured in Twilio, normally `https://amtechai.com/sms-entry`, so signature validation uses the same URL Twilio signed.

Then fill `.env.provision-hook` with real secrets and run:

```
scripts/run_provision_hook.sh
```

Generate local host config:

```
scripts/install_caddy_config.sh
scripts/install_provision_hook_service.sh
```

Smoke-test the Netlify claim function against a local dry-run hook:

```
PROVISION_HOOK_TOKEN=test-token PROVISION_HOOK_DRY_RUN=1 scripts/run_provision_hook.sh
node scripts/smoke_claim_function.mjs
```

From the repo root, the smoke test command is:

```
npm run ai:claim:smoke
```

Render against the example with no side effects:

```
python3 scripts/provision_client.py --manifest schema/client-manifest.example.json --dry-run
```

Read BUILD-PLAN.md before running for real. Mind the security gate in Phase 2.5: the Twilio signature check is the real boundary because the agent has shell access.
