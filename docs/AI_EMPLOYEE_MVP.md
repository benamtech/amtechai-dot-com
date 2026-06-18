# AI Employee MVP Reference

This is the current planning and implementation reference for the AI Employee product bundle added under `AI_EMPLOYEE_MVP/`.

## Product Shape

The MVP provisions one self-hosted Hermes AI employee per client. Each client gets:

- One isolated Hermes profile.
- One Twilio SMS number claimed from a managed pool.
- One client-specific workspace and business brain.
- One supervisor phone number verified through Twilio Verify.
- Scheduled morning and midday check-ins.

The website will become the public claim surface: a user fills one form, verifies their phone inline, consents to ongoing texts, and triggers provisioning. The runtime agent then texts the owner from its newly claimed number.

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
| `AI_EMPLOYEE_MVP/ai-employee-all-files/scripts/enrich.py` | Optional LLM answer structuring path; deterministic mapping remains the default. |
| `AI_EMPLOYEE_MVP/ai-employee-all-files/cron/jobs.template.json` | Scheduled check-in templates. |
| `AI_EMPLOYEE_MVP/ai-employee-all-files/netlify/functions/claim.js` | Planned website claim endpoint: Twilio Verify send/check plus provisioning hook. |
| `AI_EMPLOYEE_MVP/ai-employee-all-files/netlify/functions/sms-entry.js` | Optional SMS signpost that points texters to the web claim form. |

## Build Order

1. Finish Phase 2 first: prove `provision_client.py` can render and provision a hand-written manifest end to end.
2. Keep provisioning deterministic by default. Only enable `--enrich` after deterministic output has been reviewed.
3. Stand up the Twilio number pool and per-client gateway routing.
4. Apply the security gate before real clients: validate Twilio signatures, keep insecure webhook mode off outside local debugging, and move tool execution toward Docker isolation after pilots.
5. Build the website claim form as a thin wrapper around the manifest and provisioning hook.

## Future Website Integration

The current website does not yet have a route for AI Employee claiming. When adding it:

- Add a route in `src/App.tsx`.
- Prefer a dedicated page such as `src/pages/AIEmployeeClaim.tsx` and feature folder such as `src/components/ai-employee-claim/`.
- Match the questions and consent text in `AI_EMPLOYEE_MVP/ai-employee-all-files/schema/onboarding-form.json`.
- Post to the Netlify claim function routes `/claim/send-code` and `/claim/verify-and-claim`, or move the same contract into the app's chosen serverless layer.
- Persist the consent record fields described by the schema: phone, consent text version, timestamp, and channel.
- Update `docs/codegraph.md`, `codegraph.json`, `wiki/db-forms-endpoints.md`, and deployment notes in the same change.

## Security And Deployment Notes

- Real provisioning depends on Hermes, Twilio credentials, an authenticated provision hook, local host filesystem paths, cron setup, and network access.
- Do not run non-dry provisioning unless explicitly requested.
- The Twilio webhook signature validation is the real security boundary for provisioned agents because each agent has tool access.
- Required Netlify/provisioning environment variables are tracked in `wiki/db-forms-endpoints.md` and `wiki/deployment/netlify-vite-supabase.md`.
