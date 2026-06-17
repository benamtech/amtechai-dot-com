# Cost Calculator Style Digest

## Layout
- White background throughout, no dark sections
- Stacked blocks separated by 2px gaps (`space-y-0.5`)
- All blocks: white bg, 1px border at `black/10`, zero border-radius

## Typography
- Font: Inter (`font-body`, `font-display`) everywhere — no monospace
- Min text size: 11px (footnotes, labels); 13–14px for body copy
- Slider labels: 13px, medium weight, `text-black`
- Stat labels: 11px, uppercase, tracking `0.12em`, `text-black`, semibold
- Stat values: 22px mobile / 26px desktop, `font-display`
- Cost breakdown lines: 13–14px label, 11–12px note, both `text-black`
- Section headers: 11px, uppercase, tracking `0.2em`, `text-red`, semibold
- Total figure: 48px mobile / 88px desktop, `font-display`, `text-black`
- Footnote: 11px mobile / 12px desktop, `text-black`

## Color
- All text is `text-black` — no grey, no off-white, no opacity fades
- Red (`text-red`, `#E11D2A`) used only for: section headers, TOTAL line value, AI Minutes stat value, slider thumb
- No gradients, no shadows, no colored backgrounds

## Sliders
- Track: 1px tall, `bg-black/20`
- Thumb: 14×14px red square (`bg-red`, `rounded-none`)
- Value displayed inline right of track on desktop; above track on mobile

## Stats Grid
- 4 cells: Total Dials, Conversations, List Reached, AI Minutes
- 2 columns mobile / 4 columns desktop
- AI Minutes value is red; all others are black

## Cost Breakdown Table
- Three line items with label + note stacked left, value right
- Dividers: 1px `border-black/10`
- TOTAL row: 14px bold uppercase label, 16px red value

## Spacing
- Panels: px-4 py-5 mobile / px-7 py-6+ desktop
- Slider rows: mb-5, last:mb-0
- Breakdown rows: py-2 mobile / py-[7px] desktop

## Responsive
- Mobile-first; breakpoint is `sm` (640px)
- Slider value moves from above-track (mobile) to inline-right (desktop)
- Stats grid collapses to 2 cols on mobile
- Total figure shrinks from 88px to 48px on mobile
