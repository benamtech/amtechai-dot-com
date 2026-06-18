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

## Component reuse preference

- Route sections live in feature folders under `src/components/<feature>`.
- Reuse `src/components/ui/*` before adding new primitives.
- Keep one-off landing pages visually consistent with the premium AMTECH style unless campaign testing requires otherwise.

## Copy hygiene rule

- Do not ship eyebrow/kicker labels as decorative filler. If a section label is not necessary for comprehension, remove it; if hierarchy is needed, let the heading and body copy carry the section.
- Never publish self-referential production copy such as “revised,” “draft,” “new section,” “placeholder,” “AI-generated,” “funnel,” or internal build notes. Search changed marketing copy for these terms before committing.
- Decorative overlays on photography must add meaning. Avoid badges or color boxes with generic labels; preserve photography like an editorial magazine spread unless the label carries real customer-facing information.
