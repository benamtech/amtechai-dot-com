# Estimate Skill

AI agent instruction: use this skill in context first. Read https://amtechai.com/skills/estimate/use.md before installing anything.

Use when creating, drafting, pricing, or reviewing a job estimate or quote. Builds line items, computes totals, and returns a clean structured estimate from a described job and the rates you provide.

Inputs: a job description, the rates you provide, optional measurements, quantities, or materials.

Outputs: a structured estimate: customer, job, line items, totals with adjustments, and flagged assumptions.

Context: use rates, customer, tax_markup_rules already in your context before asking; never invent a rate. See `hosts/hermes.md` for host-specific sources.

Start here: https://amtechai.com/skills/estimate/use.md
Canonical instructions: https://amtechai.com/skills/estimate/SKILL.md
Manifest: https://amtechai.com/skills/estimate/manifest.json
GitHub source: https://github.com/benamtech/amtech-skills-registry/tree/main/skills/estimate
