# Netlify Deployment: Vite + React + Supabase

This is the simplest Netlify path for AMTECH's static Vite site.

## One-time setup

1. Push the repo to GitHub/GitLab/Bitbucket.
2. In Netlify, choose **Add new site -> Import an existing project**.
3. Select the AMTECH repo and branch.
4. Use these build settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
5. Add environment variables under Netlify site settings:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
6. Deploy.

## SPA routing requirement

Because this app uses React Router with `BrowserRouter`, direct visits like `/pricing` or `/apply` need a fallback to `index.html` on static hosting.

Add a Netlify redirect file:

```txt
/* /index.html 200
```

Recommended location: `public/_redirects`, because Vite copies `public` into `dist`.

## Supabase Edge Functions are separate from Netlify

This project's serverless functions live in `supabase/functions`, not Netlify Functions. Deploy and configure them in Supabase:

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

## Sources

- Netlify's Vite guide identifies Vite's build flow for Netlify projects: https://docs.netlify.com/build/frameworks/framework-setup-guides/vite/
- Netlify environment variable docs explain adding build variables through UI/CLI/API/config and scoping them to builds: https://docs.netlify.com/build/configure-builds/environment-variables/
- Vite docs state production builds use `vite build` and produce a static bundle suitable for static hosting: https://vite.dev/guide/build
- Vite env docs explain that client-exposed variables use the `import.meta.env` model and Vite modes: https://vite.dev/guide/env-and-mode
- Supabase Edge Function docs describe functions as serverless endpoints and recommend storing credentials as secrets/environment variables: https://supabase.com/docs/guides/functions
- Supabase function deployment docs show `supabase functions deploy --project-ref ...` for production deployment: https://supabase.com/docs/guides/functions/deploy
- Supabase secrets docs cover local and remote function environment variables: https://supabase.com/docs/guides/functions/secrets
