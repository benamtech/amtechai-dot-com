# AMTECH Symbol System

## Purpose

AMTECH symbols are field-manual signage for AI-enabled business procedures. They help operators understand actions, business objects, roles, and system states quickly.

## Style rules

- Simple geometry.
- Single-color rendering by default.
- Strong silhouette recognition at small sizes.
- Square or circular construction grids; no soft SaaS illustration style.
- No gradients, shadows, emoji styling, or decorative flourishes.
- Stroke or fill must be consistent within a family.
- Symbols should work in black, white, AMTECH red, and muted gray.

## Construction grid

Use a 24x24 SVG viewBox for interface symbols and a 48x48 viewBox for larger editorial pictograms. Align major shapes to whole pixels where possible.

## Naming

Use direct business nouns and actions:

- `EstimateSymbol`
- `InvoiceSymbol`
- `PayrollSymbol`
- `MissedCallSymbol`
- `BookingSymbol`
- `LeadListSymbol`
- `DispatchSymbol`
- `FollowUpSymbol`
- `ApprovalSymbol`
- `HumanOperatorSymbol`
- `AIAgentSymbol`
- `SystemHandoffSymbol`
- `ExceptionSymbol`

## Semantic categories

### Human action

- approve
- call back
- review
- sign
- collect payment

### Machine action

- generate
- summarize
- route
- remind
- update CRM

### Business objects

- estimate
- invoice
- payroll
- lead
- schedule
- job
- review

### System states

- pending
- complete
- exception
- escalation
- verified

## Article usage examples

- Use a `PictogramStep` for each major procedure step.
- Use business-object symbols in metadata strips and article index cards.
- Use state symbols in dashboard mockups and risk tables.
- Use human/machine role symbols in split panels.

## Implementation recommendation

Create reusable React SVG components under `src/components/icons/amtech/`. Export from an `index.ts` barrel. Keep the components color-agnostic by using `currentColor`.
