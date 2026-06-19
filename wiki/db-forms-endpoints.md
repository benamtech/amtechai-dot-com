# Database, Forms, Endpoints, and Edge Functions Reference

This is the working integration reference for AMTECH's Vite/React/Supabase site.

## Environment variables

### Browser build variables

Vite only exposes variables prefixed with `VITE_` to browser code.

| Variable | Used by | Notes |
| --- | --- | --- |
| `VITE_SUPABASE_URL` | `src/lib/supabase.ts`, `src/pages/Payment.tsx`, `src/components/schedule/bookingService.ts` | Public Supabase project URL. |
| `VITE_SUPABASE_ANON_KEY` | `src/lib/supabase.ts`, `src/pages/Payment.tsx`, `src/components/schedule/bookingService.ts` | Public anon key; RLS must protect data. |

### Supabase Edge Function secrets

| Secret | Used by | Notes |
| --- | --- | --- |
| `STRIPE_SECRET_KEY` | `create-payment-intent` | Must only exist in Supabase function secrets/server environments. |
| `RESEND_API_KEY` | `send-booking-email`, `send-application-email` | Sends admin notifications and confirmations. |

### AI Employee Netlify/provisioning variables

These power the live `/claim` website flow, Netlify claim functions, and local Hermes provision hook.

| Variable | Used by | Notes |
| --- | --- | --- |
| `TWILIO_ACCOUNT_SID` | `netlify/functions/claim.mjs`, `scripts/claim_number.py` | Twilio REST credentials for Verify and number pool operations. |
| `TWILIO_AUTH_TOKEN` | `claim.mjs`, `scripts/claim_number.py` | Server-side secret only. |
| `TWILIO_VERIFY_SERVICE_SID` | `claim.mjs` | Twilio Verify service (`VA...`) used for one inline SMS OTP before final claim/provisioning. |
| `SUPABASE_URL` | `claim.mjs` | Server-side Supabase project URL for consent/claim inserts; may fall back to `VITE_SUPABASE_URL`. |
| `SUPABASE_SERVICE_ROLE_KEY` | `claim.mjs` | Server-side only. Inserts and updates `ai_employee_claims` after phone verification. |
| `PROVISION_HOOK_URL` | `claim.mjs` | Authenticated endpoint on the Hermes host that runs `provision_client.py` with the manifest. |
| `PROVISION_HOOK_TOKEN` | `claim.mjs`, `provision_hook_server.py` | Bearer token shared by Netlify and the local provision hook. |
| `CLAIM_ALLOWED_ORIGIN` | `claim.mjs` | Optional CORS origin override. Defaults to `*` for same-origin browser calls. |
| `WEB_FORM_URL` | `sms-entry.mjs` | Optional SMS signpost link; defaults to `https://amtechai.com/claim`. |
| `TWILIO_SMS_WEBHOOK_URL` | `sms-entry.mjs` | Exact public URL configured in Twilio for signature validation, usually `https://amtechai.com/sms-entry`. |
| `SMS_ENTRY_TEST_MODE` | `sms-entry.mjs` | Local tests only. Production should leave unset/`0` so Twilio signatures are validated. |
| `PROVISION_HOOK_HOST`, `PROVISION_HOOK_PORT`, `PROVISION_HOOK_DRY_RUN`, `AI_EMPLOYEE_BASE_DOMAIN`, `AI_EMPLOYEE_ENRICH` | `provision_hook_server.py`, `run_provision_hook.sh` | Local PC/Hermes hook configuration. Use `PROVISION_HOOK_DRY_RUN=1` for first-time hook smoke tests. |
| `PROVISION_HOOK_PUBLIC_HOST`, `ADMIN_EMAIL`, `CADDY_SNIPPET_DIR`, `CADDY_RELOAD_COMMAND` | `render_caddy_config.py`, `install_caddy_config.sh`, `provision_client.py` | Local Caddy host config and optional automatic reload after per-client snippets are written. |
| `HERMES_ROOT`, `AMTECH_WORKSPACES` | `provision_client.py` | Optional local PC paths for Hermes profiles and client workspaces. |
| `XAI_API_KEY` | `enrich.py` | Optional only when `AI_EMPLOYEE_ENRICH=1` / `--enrich` is used. |

## Tables and storage

| Resource | Migration | Frontend writers/readers | Purpose |
| --- | --- | --- | --- |
| `contact_submissions` | `20260213203810_create_contact_submissions.sql` | `src/pages/Contact.tsx` | Public contact inquiries. |
| `demo_bookings` | `20260317003525_create_demo_bookings.sql` | `bookingService.ts` | Demo scheduling and availability reads. |
| `operator_applications` | `20260518063404_create_operator_applications.sql` | `src/pages/Apply.tsx` | Operator program applications. |
| `sales_rep_applications` | `20260611161544_create_sales_rep_applications.sql` | `src/pages/SalesRepApply.tsx` | Sales rep pre-call applications. |
| `ai_employee_claims` | `20260618193000_create_ai_employee_claims.sql` | `netlify/functions/claim.mjs` | Verified AI Employee claims, manifest payloads, consent records, Twilio verification status, and provision status. |

### AI Employee consent storage

`AI_EMPLOYEE_MVP/ai-employee-all-files/schema/onboarding-form.json` requires a consent record for every claim:

| Field | Source | Notes |
| --- | --- | --- |
| `phone` | Verified form phone | Phone ownership is proven by Twilio Verify. |
| `consent_text_version` | Form payload/schema version | Current schema version is `1.1.0`. |
| `timestamp_iso` | `claim.mjs` at claim time | Stored when `/verify-and-claim` succeeds. |
| `channel` | Claim function | Expected value is `web` for the primary flow. |

Consent lives in `ai_employee_claims`. The browser does not write the table directly; `netlify/functions/claim.mjs` inserts only after Twilio Verify approves the phone number, using `SUPABASE_SERVICE_ROLE_KEY`. RLS is enabled. Authenticated users may read/update claim status; anonymous users have no direct table access. Status values are `queued`, `accepted`, `running`, `provisioned`, and `failed`; Netlify writes `queued/accepted/failed`, and the local provision hook writes `running/provisioned/failed` when local Supabase service-role env is present.

## Edge Functions

| Function | Path | Caller | Request shape | Response | External dependency |
| --- | --- | --- | --- | --- | --- |
| `create-payment-intent` | `supabase/functions/create-payment-intent/index.ts` | `src/pages/Payment.tsx` | `{ amount, currency?, name?, email?, company?, description? }` | `{ clientSecret }` or `{ error }` | Stripe. |
| `send-booking-email` | `supabase/functions/send-booking-email/index.ts` | `src/components/schedule/bookingService.ts` | `{ name, email, organization, industry, topic, bookingDate, bookingTime }` | `{ success: true }` or error | Resend. |
| `send-application-email` | `supabase/functions/send-application-email/index.ts` | `src/pages/Apply.tsx` via `supabase.functions.invoke` | `{ application }` matching operator application fields | `{ ok: true }` or error | Resend. |

## Netlify functions for AI Employee MVP

These files live under root `netlify/functions/` and are deployed by `netlify.toml`. Redirects expose the clean routes used by the React form.

The homepage final CTA may route to `/claim?phone=<encoded phone>` to prefill the browser form. This does not verify the phone or change any Netlify request shape; the user still sends and verifies the Twilio code in the normal web flow.

| Function | Planned path | Caller | Request shape | Response | External dependency |
| --- | --- | --- | --- | --- | --- |
| `claim.mjs` send code | `/claim/send-code` | `src/pages/AIEmployeeClaim.tsx` | `{ phone }` | `{ ok, status }` | Twilio Verify. |
| `claim.mjs` verify code | `/claim/verify-code` | `src/pages/AIEmployeeClaim.tsx` | `{ phone, code }` | `{ ok, phone, claim_token, status }` | Twilio Verify, HMAC claim token. |
| `claim.mjs` verify and claim | `/claim/verify-and-claim` | `src/pages/AIEmployeeClaim.tsx` | `{ claim_token, owns_business, supervisor_name, agent_name, timezone, answers, consent_accepted, consent_text_version? }` | `{ ok: true, provisioning: true, message }` or error | Supabase REST, authenticated Hermes provision hook. |
| `sms-entry.mjs` | `/sms-entry` | Optional onboarding SMS number webhook | Twilio inbound SMS form payload with valid `X-Twilio-Signature` | TwiML reply with the form link | Twilio Messaging. |

## Local Hermes PC scripts

| Script | Purpose |
| --- | --- |
| `AI_EMPLOYEE_MVP/ai-employee-all-files/scripts/setup_local_pc.sh` | Creates `.venv`, installs `requirements-local.txt`, creates `.env.provision-hook` from the example if missing, and runs local checks. |
| `AI_EMPLOYEE_MVP/ai-employee-all-files/scripts/check_local_setup.py` | Checks Python packages, expected env variables, Hermes visibility, and `provision_client.py --dry-run`. |
| `AI_EMPLOYEE_MVP/ai-employee-all-files/scripts/run_provision_hook.sh` | Loads `.env.provision-hook`, activates `.venv` if present, and starts the authenticated local provision hook. |
| `AI_EMPLOYEE_MVP/ai-employee-all-files/scripts/install_caddy_config.sh` | Renders `state/caddy/Caddyfile` and prints install/validate/reload commands for Caddy. |
| `AI_EMPLOYEE_MVP/ai-employee-all-files/scripts/install_provision_hook_service.sh` | Creates `~/.config/systemd/user/amtech-provision-hook.service`. |
| `AI_EMPLOYEE_MVP/ai-employee-all-files/scripts/generate_claim_link_secret.mjs` | Prints a strong `CLAIM_LINK_SECRET` for Netlify without storing it. |
| `AI_EMPLOYEE_MVP/ai-employee-all-files/scripts/smoke_claim_function.mjs` | Runs the Netlify claim handler in `CLAIM_TEST_MODE=1` and posts to a local dry-run provision hook. |
| `AI_EMPLOYEE_MVP/ai-employee-all-files/scripts/smoke_sms_entry.mjs` | Runs the SMS signpost handler in `SMS_ENTRY_TEST_MODE=1`. |
| `AI_EMPLOYEE_MVP/ai-employee-all-files/scripts/apply_supabase_ai_employee_migration.sh` | Runs `supabase db push` when Supabase CLI is installed and linked. |
| `AI_EMPLOYEE_MVP/ai-employee-all-files/scripts/verify_supabase_claim_table.mjs` | Verifies `ai_employee_claims` is reachable through Supabase REST with service role credentials. |

Repo-level aliases in `package.json`: `dev`, `build`, `preview`, `typecheck`, `lint`, `ai:local:setup`, `ai:local:check`, `ai:caddy:render`, `ai:claim:secret`, `ai:claim:smoke`, `ai:sms:smoke`, `ai:supabase:push`, `ai:supabase:verify`, and `ai:provision:dry-run`.

## Form flow checklist

When adding or changing a form:

1. Update the TypeScript form state and validation in the page/feature component.
2. Update the matching Supabase migration if a stored field changes.
3. Confirm the RLS policy permits only the intended operation for `anon` users.
4. Update any Edge Function payload interface and email template.
5. Update this document and `docs/codegraph.md`.
6. Run `npm run typecheck`, `npm run lint`, and `npm run build`.

When adding the AI Employee claim form, also keep the form fields aligned with `AI_EMPLOYEE_MVP/ai-employee-all-files/schema/onboarding-form.json` and the manifest contract generated by `netlify/functions/claim.mjs`.

## Current operational notes

- `contact_submissions`, applications, and bookings are public conversion forms; avoid exposing SELECT policies to anonymous users unless needed for availability checks.
- `demo_bookings` intentionally allows anonymous SELECT for future confirmed bookings so the calendar can check availability.
- Website onboarding/admin intake routes and services are not present in the current frontend. The repo only retains `20260618201000_create_intake_files_storage_bucket.sql` as a storage-bucket helper from prior work; do not assume active intake UI exists without checking `src/App.tsx`.
- The AI Employee MVP is a separate Hermes/Twilio provisioning path. Real provisioning should not run from anonymous browser code; the website should only call a server-side claim endpoint, which then calls the authenticated provision hook.
