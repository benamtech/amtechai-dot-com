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

### AI Employee MVP Netlify/provisioning variables

These are planned for the AI Employee claim/provisioning flow in `AI_EMPLOYEE_MVP/`. They are not used by the current React/Supabase website routes yet.

| Variable | Used by | Notes |
| --- | --- | --- |
| `TWILIO_ACCOUNT_SID` | `AI_EMPLOYEE_MVP/ai-employee-all-files/netlify/functions/claim.js`, `scripts/claim_number.py` | Twilio REST credentials for Verify and number pool operations. |
| `TWILIO_AUTH_TOKEN` | `claim.js`, `scripts/claim_number.py` | Server-side secret only. |
| `TWILIO_VERIFY_SERVICE_SID` | `claim.js` | Twilio Verify service (`VA...`) used for one inline SMS OTP before provisioning. |
| `PROVISION_HOOK_URL` | `claim.js` | Authenticated endpoint on the Hermes host that runs `provision_client.py` with the manifest. |
| `PROVISION_HOOK_TOKEN` | `claim.js` | Bearer token for the provision hook. |

## Tables and storage

| Resource | Migration | Frontend writers/readers | Purpose |
| --- | --- | --- | --- |
| `contact_submissions` | `20260213203810_create_contact_submissions.sql` | `src/pages/Contact.tsx` | Public contact inquiries. |
| `intake_sessions` | `20260316174722_create_intake_sessions_and_files.sql` | `intakeService.ts`, `adminService.ts` | Website onboarding progress and answers JSON. |
| `intake_files` | `20260316174722_create_intake_sessions_and_files.sql` | `intakeService.ts`, `adminService.ts` | Metadata for uploaded onboarding files. |
| Storage bucket `intake-files` | Expected by app; bucket creation is not represented in current migrations | `intakeService.ts`, `adminService.ts` | Stores onboarding uploads by session/field path. |
| `demo_bookings` | `20260317003525_create_demo_bookings.sql` | `bookingService.ts` | Demo scheduling and availability reads. |
| `operator_applications` | `20260518063404_create_operator_applications.sql` | `src/pages/Apply.tsx` | Operator program applications. |
| `sales_rep_applications` | `20260611161544_create_sales_rep_applications.sql` | `src/pages/SalesRepApply.tsx` | Sales rep pre-call applications. |

### Planned AI Employee consent storage

`AI_EMPLOYEE_MVP/ai-employee-all-files/schema/onboarding-form.json` requires a consent record for every claim:

| Field | Source | Notes |
| --- | --- | --- |
| `phone` | Verified form phone | Phone ownership is proven by Twilio Verify. |
| `consent_text_version` | Form payload/schema version | Current schema version is `1.0.0`. |
| `timestamp_iso` | `claim.js` at verification time | Stored when `/verify-and-claim` succeeds. |
| `channel` | Claim function | Expected value is `web` for the primary flow. |

No Supabase table exists for this yet. When the website claim route is implemented, decide whether consent records live in Supabase, the Hermes provision host, or both, then update migrations and this reference.

## Edge Functions

| Function | Path | Caller | Request shape | Response | External dependency |
| --- | --- | --- | --- | --- | --- |
| `create-payment-intent` | `supabase/functions/create-payment-intent/index.ts` | `src/pages/Payment.tsx` | `{ amount, currency?, name?, email?, company?, description? }` | `{ clientSecret }` or `{ error }` | Stripe. |
| `send-booking-email` | `supabase/functions/send-booking-email/index.ts` | `src/components/schedule/bookingService.ts` | `{ name, email, organization, industry, topic, bookingDate, bookingTime }` | `{ success: true }` or error | Resend. |
| `send-application-email` | `supabase/functions/send-application-email/index.ts` | `src/pages/Apply.tsx` via `supabase.functions.invoke` | `{ application }` matching operator application fields | `{ ok: true }` or error | Resend. |

## Planned Netlify functions for AI Employee MVP

These files live under `AI_EMPLOYEE_MVP/ai-employee-all-files/netlify/functions/` today. They are not deployed by the root `netlify.toml` until intentionally copied/moved into the production Netlify functions directory or otherwise wired into deployment.

| Function | Planned path | Caller | Request shape | Response | External dependency |
| --- | --- | --- | --- | --- | --- |
| `claim.js` send code | `/claim/send-code` | Future AI Employee claim form | `{ phone }` | `{ ok, status }` | Twilio Verify. |
| `claim.js` verify and claim | `/claim/verify-and-claim` | Future AI Employee claim form | `{ phone, code, owns_business, supervisor_name, agent_name, timezone, answers, consent_accepted, consent_text_version? }` | `{ ok: true, provisioning: true, message }` or error | Twilio Verify, authenticated Hermes provision hook. |
| `sms-entry.js` | Optional onboarding SMS number webhook | Twilio inbound SMS | Twilio webhook payload | One reply with the form link | Twilio Messaging. |

## Form flow checklist

When adding or changing a form:

1. Update the TypeScript form state and validation in the page/feature component.
2. Update the matching Supabase migration if a stored field changes.
3. Confirm the RLS policy permits only the intended operation for `anon` users.
4. Update any Edge Function payload interface and email template.
5. Update this document and `docs/codegraph.md`.
6. Run `npm run typecheck`, `npm run lint`, and `npm run build`.

When adding the AI Employee claim form, also keep the form fields aligned with `AI_EMPLOYEE_MVP/ai-employee-all-files/schema/onboarding-form.json` and the manifest contract generated by `claim.js`.

## Current operational notes

- `contact_submissions`, applications, and bookings are public conversion forms; avoid exposing SELECT policies to anonymous users unless needed for availability checks.
- `demo_bookings` intentionally allows anonymous SELECT for future confirmed bookings so the calendar can check availability.
- Intake sessions are currently readable/updatable by anon when a session exists; if sessions become sensitive, add stronger session-scoped access controls.
- The app expects the `intake-files` storage bucket to exist. If deploys are recreated from scratch, document/create the bucket and storage policies in Supabase.
- The AI Employee MVP is a separate Hermes/Twilio provisioning path. Real provisioning should not run from anonymous browser code; the website should only call a server-side claim endpoint, which then calls the authenticated provision hook.
