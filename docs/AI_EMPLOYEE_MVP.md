# AI Employee MVP Reference

This is the current planning and implementation reference for the AI Employee product bundle added under `AI_EMPLOYEE_MVP/`.

## Product Shape

The MVP provisions one self-hosted Hermes AI employee per client. Each client gets:

- One isolated Hermes profile.
- One Twilio SMS number claimed from a managed pool.
- One client-specific workspace and business brain.
- One supervisor phone number verified through Twilio Verify.
- Scheduled morning and midday check-ins.

The website claim surface now lives at `/claim`: a user fills one form, verifies their phone inline, consents to ongoing texts, and triggers provisioning. The runtime agent then texts the owner from its newly claimed number.

## Source Of Truth

- `AI_EMPLOYEE_MVP/BUILD-PLAN.md` is authoritative for build order and phase scope.
- `AI_EMPLOYEE_MVP/SUB_AGENTS.md` describes how agents should work inside the MVP bundle.
- `AI_EMPLOYEE_MVP/ai-employee-all-files/README.md` explains the bundle layout and lifecycle.
- `AI_EMPLOYEE_MVP/ai-employee-all-files/schema/onboarding-form.json` is the intake contract and consent text.
- `AI_EMPLOYEE_MVP/ai-employee-all-files/schema/client-manifest.example.json` is the manifest shape consumed by provisioning.

## Bundle Layout

| Path | Purpose |
| --- | --- |
| `AI_EMPLOYEE_MVP/BUILD-PLAN.md` | Phase 2 and Phase 3 implementation plan. |
| `AI_EMPLOYEE_MVP/SUB_AGENTS.md` | Agent workflow rules for the MVP bundle. |
| `AI_EMPLOYEE_MVP/ai-employee-all-files/template/` | Hermes profile template: persona, config, memories, skills, workspace, and business brain. |
| `AI_EMPLOYEE_MVP/ai-employee-all-files/schema/` | Onboarding form contract and example manifest. |
| `AI_EMPLOYEE_MVP/ai-employee-all-files/scripts/provision_client.py` | Factory that turns a manifest into a live isolated AI employee. |
| `AI_EMPLOYEE_MVP/ai-employee-all-files/scripts/claim_number.py` | Twilio number pool claim/top-up helper. |
| `AI_EMPLOYEE_MVP/ai-employee-all-files/scripts/provision_hook_server.py` | Authenticated local HTTP hook for the Hermes PC; accepts manifests from Netlify and starts `provision_client.py`. |
| `AI_EMPLOYEE_MVP/ai-employee-all-files/scripts/run_provision_hook.sh` | Local runner that loads `.env.provision-hook` and starts the hook server. |
| `AI_EMPLOYEE_MVP/ai-employee-all-files/scripts/setup_local_pc.sh` | First-run local PC setup: creates `.venv`, installs requirements, creates `.env.provision-hook`, and runs checks. |
| `AI_EMPLOYEE_MVP/ai-employee-all-files/scripts/check_local_setup.py` | Verifies local modules/env/Hermes visibility and dry-runs the provisioning factory. |
| `AI_EMPLOYEE_MVP/ai-employee-all-files/scripts/install_caddy_config.sh` | Renders host Caddy config for `hook.agents.amtechai.com` and per-client snippet imports. |
| `AI_EMPLOYEE_MVP/ai-employee-all-files/scripts/install_provision_hook_service.sh` | Writes a user systemd service for the local provision hook. |
| `AI_EMPLOYEE_MVP/ai-employee-all-files/scripts/smoke_claim_function.mjs` | Local test-mode claim function smoke test that posts to the dry-run provision hook. |
| `AI_EMPLOYEE_MVP/ai-employee-all-files/scripts/smoke_sms_entry.mjs` | Local test-mode SMS signpost smoke test. |
| `AI_EMPLOYEE_MVP/ai-employee-all-files/scripts/apply_supabase_ai_employee_migration.sh` | Supabase CLI helper for pushing migrations once the CLI/project are configured. |
| `AI_EMPLOYEE_MVP/ai-employee-all-files/scripts/verify_supabase_claim_table.mjs` | Supabase REST verifier for `ai_employee_claims` after migration. |
| `AI_EMPLOYEE_MVP/ai-employee-all-files/host/Caddyfile.template` | Reverse-proxy template for the provision hook and per-client gateway snippets. |
| `AI_EMPLOYEE_MVP/ai-employee-all-files/requirements-local.txt` | Python dependencies for Twilio number operations and optional enrichment. |
| `AI_EMPLOYEE_MVP/ai-employee-all-files/.env.netlify.example` | Netlify environment variable checklist for `/claim` and `/sms-entry`. |
| `AI_EMPLOYEE_MVP/ai-employee-all-files/scripts/enrich.py` | Optional LLM answer structuring path; deterministic mapping remains the default. |
| `AI_EMPLOYEE_MVP/ai-employee-all-files/cron/jobs.template.json` | Scheduled check-in templates. |
| `netlify/functions/claim.mjs` | Deployed website claim endpoint: Twilio Verify send/check, Supabase consent persistence, and provisioning hook trigger. |
| `netlify/functions/sms-entry.mjs` | Optional deployed SMS signpost that points texters to the web claim form. |

## Build Order

1. Finish Phase 2 first: prove `provision_client.py` can render and provision a hand-written manifest end to end.
2. Keep provisioning deterministic by default. Only enable `--enrich` after deterministic output has been reviewed.
3. Stand up the Twilio number pool and per-client gateway routing.
4. Apply the security gate before real clients: validate Twilio signatures, keep insecure webhook mode off outside local debugging, and move tool execution toward Docker isolation after pilots.
5. Use the website claim form as a thin wrapper around the manifest and provisioning hook.

## Website Integration

- Route: `/claim`, owned by `src/pages/AIEmployeeClaim.tsx`.
- Form contract: seven answer IDs and consent text match `AI_EMPLOYEE_MVP/ai-employee-all-files/schema/onboarding-form.json`.
- Function endpoints: `/claim/send-code` and `/claim/verify-and-claim`, redirected by `netlify.toml` to `netlify/functions/claim.mjs`.
- Consent persistence: `ai_employee_claims`, created by `supabase/migrations/20260618193000_create_ai_employee_claims.sql`.
- Local provision hook: `AI_EMPLOYEE_MVP/ai-employee-all-files/scripts/provision_hook_server.py`, started through `run_provision_hook.sh`.
- Local first-run setup: `AI_EMPLOYEE_MVP/ai-employee-all-files/scripts/setup_local_pc.sh`.
- Provision status lifecycle: Netlify writes `queued` then `accepted`; the local hook can mark `running`, `provisioned`, or `failed` when local `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are set.
- Hook smoke testing: set `PROVISION_HOOK_DRY_RUN=1` locally to make the hook pass `--dry-run` to `provision_client.py`.
- Claim smoke testing: start the dry-run hook and run `AI_EMPLOYEE_MVP/ai-employee-all-files/scripts/smoke_claim_function.mjs`; it uses `CLAIM_TEST_MODE=1` to bypass external Twilio/Supabase calls.
- SMS signpost smoke testing: `AI_EMPLOYEE_MVP/ai-employee-all-files/scripts/smoke_sms_entry.mjs` covers local bypass mode and a signed request; production `/sms-entry` validates `X-Twilio-Signature` with `TWILIO_AUTH_TOKEN` and should set `TWILIO_SMS_WEBHOOK_URL` to the exact public Twilio webhook URL.
- Host routing: `install_caddy_config.sh` renders a Caddyfile for `PROVISION_HOOK_PUBLIC_HOST` and imports per-client snippets from `state/caddy/*.caddy`.
- Repo-level convenience scripts: `npm run ai:local:setup`, `npm run ai:local:check`, `npm run ai:caddy:render`, `npm run ai:claim:smoke`, `npm run ai:sms:smoke`, `npm run ai:supabase:push`, `npm run ai:supabase:verify`, and `npm run ai:provision:dry-run`.

## Security And Deployment Notes

- Real provisioning depends on Hermes, Twilio credentials, an authenticated provision hook, local host filesystem paths, cron setup, and network access.
- Do not run non-dry provisioning unless explicitly requested.
- The Twilio webhook signature validation is the real security boundary for provisioned agents because each agent has tool access.
- Required Netlify/provisioning environment variables are tracked in `wiki/db-forms-endpoints.md` and `wiki/deployment/netlify-vite-supabase.md`.
