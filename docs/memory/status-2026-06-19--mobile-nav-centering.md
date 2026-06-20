# Mobile navigation centering fix

## Status

- Confirmed `main` was clean and synchronized with `origin/main` at `ff6af6c` before the change.
- Fixed the shared mobile navigation dropdown in `src/components/layout/Navbar.tsx` so it stays centered and matches the navbar width.
- Root cause: Framer Motion's inline vertical `transform` overrode Tailwind's transform-based horizontal centering. Both panels now use `mx-auto`, avoiding the transform conflict.

## Validation

- `npm run typecheck` passes.
- `npx eslint src/components/layout/Navbar.tsx` passes.
- `git diff --check` passes.
- Full `npm run lint` remains blocked by four pre-existing unused-variable errors in `scripts/signing/sign-artifact.ts`, `scripts/signing/sign-skills.ts`, and `scripts/skills/build-skills.ts`, plus two existing Fast Refresh warnings in `src/components/sales-rep-apply/salesRepShared.tsx`.
