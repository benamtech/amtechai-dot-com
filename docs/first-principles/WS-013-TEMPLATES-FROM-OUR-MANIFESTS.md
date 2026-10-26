# WS-013. Templates: what ours are, from the factory (2026-10-26)

Ben (2026-10-26): usenaive.ai's *"list of templates for ai company idea is good. we do the same with our generated ai
employee manifests and profiles"*. Read from `standard/factory/` (`compile_manifest.py`, `manifests/*.json`),
`standard/platform/intents.json` and spec S11 (the work catalogue). Facts of our own code.

## What a template is here

- **An onboarding spec**: business facts only (the business type, its services, the primary job, the first workflow
  with its trigger, inputs, output and receipt, what the employee must never do, the first open question). The model
  may write it; it carries no authority.
- **Compiled, not validated**, by `factory/compile_manifest.py`: the security boundary of provisioning. Image, tools,
  model, budget, cron and network come from the compiler's own defaults; nothing in the spec can widen them. So a
  template a visitor picks or edits on the website is safe by construction: it can change what the employee knows and
  starts on, never what it may do.
- **Plus the work catalogue every employee ships with** (S11, D55): skills in prose per family (`price-the-job`,
  `property-managers`, `gc-bid-lists`, `realtor-repairs`, `answer-the-leads`, `public-work`, `reputation`, `hire`,
  `new-owner`, `inspection-trades`, `get-paid`, `any-office-work`), never a limit on what the employee takes on.
- **And the team the employee makes** (Hermes profiles; names arise from the job, DP-900): a template can name the
  teammates it expects (one per recurring service), but the employee makes and names them itself.

Eight manifests exist today (`amtech-graphics-lab`, `amtech-internal-ops`, `amtech-public-funnel`,
`a-taste-of-puerto-rico`, `harbor-books`, `scratch-m1`, `visitor`, `walk-119f08`); none is a public template.

## What the site's template catalog can be (hypothesis H-TPL-1)

One template per business type × its recurring services (lane INDUSTRY's `services.json`), each rendered from a real
onboarding spec that the compiler accepts, so **every template on the site is provably buildable** (a check in the
site's build compiles each one, as `tools/check.mjs` checks every link). A template's page shows: the business type,
the services it runs on its own with their cadence, the public data each watches, the first job it starts on, the team
it will make, what it never does without the owner, the market cost it stands in for (WS-030), and "Start with this"
into the onboarding with the spec pre-filled.

Where it beats Naive's catalog (as RIVALS reads it): Naive's templates are companies a developer launches (content
channels, agencies); ours are the businesses a $500k-1M owner already runs, with the public data their work runs on.

**What would prove H-TPL-1 wrong:** INDUSTRY finds too few strong recurring services per type to fill a page (then the
catalog is per service, not per type); or a compiled template's first job cannot run on a fresh pool employee without
setup the owner must do (then "guaranteed" fails at the start).
