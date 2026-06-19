# Repository Guidelines

## Project Layout

This workspace contains the AMTECH AI Employee MVP. The root `BUILD-PLAN.md` is the development plan for the application.

- `BUILD-PLAN.md` at the repo root is authoritative for what to build next.
- `ai-employee-all-files/` is a source bundle for creating one provisioned AI employee. It is not the whole application.
- Root-level scripts and files may also be part of the build. Do not assume the `ai-employee-all-files/` copies are canonical without checking the current task and the build plan.
- Application code and generated build output for this project should live under `main/`.
- Existing `application/` content should not be treated as the target unless the user explicitly redirects work there.
- Inside `ai-employee-all-files/`, `template/` is the rendered Hermes employee profile template, `schema/` contains the onboarding contract, `scripts/` contains provisioning helpers, `cron/` contains scheduled check-ins, and `netlify/functions/` contains the onboarding/SMS functions for that single-agent flow.

## Run And Verify

When working on the single-agent provisioning bundle, use the dry-run provision command first:

```bash
python3 ai-employee-all-files/scripts/provision_client.py --manifest ai-employee-all-files/schema/client-manifest.example.json --dry-run
```

Real provisioning depends on Hermes, Twilio credentials, optional LLM credentials, local filesystem paths outside this workspace, and network access. Do not run non-dry provisioning unless explicitly requested.

For application work, follow the root `BUILD-PLAN.md` first and place new project files under `main/`.

## Implementation Notes

- Keep the provisioning path deterministic by default. The optional `--enrich` path must continue to fail open to the deterministic mapping.
- `netlify/functions/claim.mjs` and `provision_client.py` both encode the raw onboarding answer contract. Keep their mappings in sync.
- Template rendering intentionally leaves unknown `{{TOKEN}}` placeholders visible. Do not silently remove that behavior.
- The Twilio webhook signature check described in `BUILD-PLAN.md` is security critical because provisioned agents have shell access.
- Runtime state belongs in `ai-employee-all-files/state/`; avoid committing secrets, `.env` files, or generated client output.

## Style

- Python scripts are straightforward stdlib orchestration. Match the existing direct style and keep side effects gated by `--dry-run` where practical.
- Netlify functions are small ESM handlers using `fetch`. Keep request/response behavior explicit and avoid adding server-side onboarding session state unless required.
- Use ASCII for new repository text unless a touched file already uses non-ASCII.
