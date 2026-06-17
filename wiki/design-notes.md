# Design Notes

AMTECH should feel ambitious, confident, glossy, modern, and enterprise-premium.

## Core visual direction

- Black/dark base, high-contrast white text, sharp red accent (`#E11D2A` appears throughout the current UI).
- Use cinematic spacing, strong headings, monospace eyebrow labels, subtle borders, and restrained motion.
- Preserve conversion intent: pages should guide users toward sales calls, applications, onboarding, payments, or demo bookings.

## Required source docs before major visual refactors

- `AMTECH_STYLE_GUIDE.md`
- `COST_CALCULATOR_STYLE.md`
- `VISUAL_ANALYSIS.md`
- `ONBOARDING_IMPLEMENTATION.md`

## Component reuse preference

- Route sections live in feature folders under `src/components/<feature>`.
- Reuse `src/components/ui/*` before adding new primitives.
- Keep one-off landing pages visually consistent with the premium AMTECH style unless campaign testing requires otherwise.
