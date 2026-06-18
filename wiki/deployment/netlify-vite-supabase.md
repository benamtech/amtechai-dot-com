# Netlify Deployment: Vite + React + Supabase

This is the simplest Netlify path for AMTECH's static Vite site. The repository includes `netlify.toml` so Netlify builds the Vite app and only scans the root `netlify/functions` directory for Netlify Functions.

## One-time setup

1. Push the repo to GitHub/GitLab/Bitbucket.
2. In Netlify, choose **Add new site -> Import an existing project**.
3. Select the AMTECH repo and branch.
4. The checked-in `netlify.toml` sets these build settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
   - **Functions directory:** `netlify/functions`
5. Add environment variables under Netlify site settings:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `TWILIO_ACCOUNT_SID`
   - `TWILIO_AUTH_TOKEN`
   - `TWILIO_VERIFY_SERVICE_SID`
   - `PROVISION_HOOK_URL`
   - `PROVISION_HOOK_TOKEN`
6. Deploy.

## SPA routing requirement

Because this app uses React Router with `BrowserRouter`, direct visits like `/pricing` or `/apply` need a fallback to `index.html` on static hosting.

Add a Netlify redirect file:

```txt
/* /index.html 200
```

Recommended location: `public/_redirects`, because Vite copies `public` into `dist`.

## Supabase Edge Functions are separate from Netlify

This project's serverless functions live in `supabase/functions`, not Netlify Functions. Netlify is configured to look for Netlify Functions only in `netlify/functions`, which prevents Netlify from trying to bundle Supabase Deno imports such as `jsr:` and `npm:` specifiers during the static site deploy. Deploy and configure the Supabase functions in Supabase:

```bash
supabase functions deploy create-payment-intent
supabase functions deploy send-booking-email
supabase functions deploy send-application-email
```

Set Supabase function secrets:

```bash
supabase secrets set STRIPE_SECRET_KEY=...
supabase secrets set RESEND_API_KEY=...
```

Netlify only needs the public `VITE_` variables for the browser bundle. Do not put Stripe secret keys or Resend API keys in Vite variables.

## AI Employee MVP deployment note

The live website claim route is `/claim`. It renders `src/pages/AIEmployeeClaim.tsx`, which posts to root Netlify Functions deployed from `netlify/functions/`:

- `claim.mjs`: `/claim/send-code` and `/claim/verify-and-claim`, using Twilio Verify, Supabase consent persistence, and an authenticated provision hook.
- `sms-entry.mjs`: optional inbound SMS signpost at `/sms-entry` that replies with the claim form link.

Required Netlify server-side variables:

```bash
TWILIO_ACCOUNT_SID=...
TWILIO_AUTH_TOKEN=...
TWILIO_VERIFY_SERVICE_SID=...
SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
PROVISION_HOOK_URL=...
PROVISION_HOOK_TOKEN=...
WEB_FORM_URL=https://amtechai.com/claim
TWILIO_SMS_WEBHOOK_URL=https://amtechai.com/sms-entry
```

The same checklist lives in `AI_EMPLOYEE_MVP/ai-employee-all-files/.env.netlify.example`.

Deploy/check the AI Employee Supabase table:

```bash
npm run ai:supabase:push
SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... npm run ai:supabase:verify
```

The push helper requires Supabase CLI to be installed and the project to be linked/authenticated.

The Hermes provision host is separate from Netlify. On that PC:

```bash
cd AI_EMPLOYEE_MVP/ai-employee-all-files
scripts/setup_local_pc.sh
```

Then fill `.env.provision-hook` and run:

```bash
scripts/run_provision_hook.sh
```

The hook accepts the manifest from `claim.mjs` and runs `AI_EMPLOYEE_MVP/ai-employee-all-files/scripts/provision_client.py`. Set `PROVISION_HOOK_DRY_RUN=1` during first-time smoke tests to exercise the hook without claiming a Twilio number or writing Hermes files. With local `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`, it updates `ai_employee_claims` from `running` to `provisioned` or `failed`.

Host routing/service helpers:

```bash
scripts/install_caddy_config.sh
scripts/install_provision_hook_service.sh
```

From the repo root, `npm run ai:caddy:render` renders the Caddy config and prints install commands.

Claim-to-hook smoke test:

```bash
PROVISION_HOOK_TOKEN=test-token PROVISION_HOOK_DRY_RUN=1 scripts/run_provision_hook.sh
node scripts/smoke_claim_function.mjs
```

From the repo root, run `npm run ai:claim:smoke` while the dry-run hook is running.

SMS signpost smoke test:

```bash
npm run ai:sms:smoke
```

Production `/sms-entry` validates `X-Twilio-Signature` using `TWILIO_AUTH_TOKEN`. Set `TWILIO_SMS_WEBHOOK_URL` to the exact public URL entered in Twilio, usually `https://amtechai.com/sms-entry`; the smoke test covers both bypass mode and a signed request.

That host also needs Twilio number-pool credentials, Caddy or equivalent wildcard routing for `*.agents.amtechai.com`, cron/check-in setup, and the Hermes runtime. Keep `SMS_INSECURE_NO_SIGNATURE` off outside local debugging.

## Local verification before deploy

```bash
npm install
npm run typecheck
npm run lint
npm run build
npm run preview
```

Then test:

- `/`
- `/pricing`
- `/apply`
- `/schedule-demo`
- `/website-onboarding`
- `/pay`
- `/claim`

## Sources

- Netlify's Vite guide identifies Vite's build flow for Netlify projects: https://docs.netlify.com/build/frameworks/framework-setup-guides/vite/
- Netlify environment variable docs explain adding build variables through UI/CLI/API/config and scoping them to builds: https://docs.netlify.com/build/configure-builds/environment-variables/
- Vite docs state production builds use `vite build` and produce a static bundle suitable for static hosting: https://vite.dev/guide/build
- Vite env docs explain that client-exposed variables use the `import.meta.env` model and Vite modes: https://vite.dev/guide/env-and-mode
- Supabase Edge Function docs describe functions as serverless endpoints and recommend storing credentials as secrets/environment variables: https://supabase.com/docs/guides/functions
- Supabase function deployment docs show `supabase functions deploy --project-ref ...` for production deployment: https://supabase.com/docs/guides/functions/deploy
- Supabase secrets docs cover local and remote function environment variables: https://supabase.com/docs/guides/functions/secrets
