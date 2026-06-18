# Product and Internal Research Notes

## Product surface

AMTECH's website is a conversion system for:

- AI employee and automation offers.
- Website onboarding and intake.
- Demo bookings and sales calls.
- Operator and sales rep applications.
- Payments.

## AI Employee MVP product direction

The new product bundle under `AI_EMPLOYEE_MVP/` turns AMTECH's AI employee offer into a provisionable product. The intended customer flow is:

1. A business owner claims an AI Employee on amtechai.com.
2. The form asks the seven business-intake questions from `AI_EMPLOYEE_MVP/ai-employee-all-files/schema/onboarding-form.json`, plus supervisor name, agent name, timezone, phone, and consent.
3. Twilio Verify proves phone ownership inline with one OTP.
4. A server-side claim endpoint builds a manifest and calls an authenticated Hermes provision hook.
5. The provisioner creates one isolated Hermes profile, claims one Twilio number, renders the client business brain, schedules check-ins, and starts the client's SMS gateway.

Current build order from `AI_EMPLOYEE_MVP/BUILD-PLAN.md`: prove Phase 2 provisioning by hand first, harden Twilio signature validation/tool isolation, then build the website claim form as a thin wrapper around the manifest and provision hook.

Product constraints to preserve:

- Deterministic answer mapping is the default; optional AI enrichment must fail open to deterministic mapping.
- The form has one verification step only. No SMS intake conversation and no second code.
- Consent text/version/timestamp/channel must be captured for every claim.
- The AI employee is positioned as an employee reporting to a supervisor, not a generic chatbot.

## Internal research backlog

Capture future findings here as short dated entries:

- Customer objections and wording that improves conversion.
- Industry-specific use cases for AI employees.
- Pricing/packaging experiments.
- Sales-call insights that should become website copy.
- Operational constraints in Supabase, Stripe, Resend, Netlify, or onboarding workflows.
- Operational constraints in Hermes, Twilio Verify, Twilio Messaging/A2P, provisioning hooks, and AI Employee onboarding.

## Documentation rule

Keep this file high signal. Link detailed research artifacts in `wiki/research/` instead of pasting long raw notes here.
