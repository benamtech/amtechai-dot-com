# WS-070. The design pass: how it runs (written 2026-10-26 before it starts)

Ben, 2026-10-26: *"remember we will have an extremely deep design and iteration pass after all the agents are
finished"*; on the first lab page: *"about 3/10 ... we need to be the best"*. The research rounds end when CRAFT,
INDUSTRY (and its funnels part) and HERO-A report. This file says how the pass runs so it can start at once.

## The bar, stated so it can be checked

- **Ben, 2026-10-26: *"we want a good looking high converting site"*.** Both halves are checked: the look against the
  best sites and CRAFT's numbers; conversion by five-second tests (blind critics playing owners say what is sold and what
  to do next), one primary action per screen, proof before the second screen, friction counted to the first piece of
  real work, and later by GA4 on the live pages.
- **Ben's notes stand on every page:** no eyebrow text, ever; no customer as a menu item; money in the owner's numbers;
  many industries through departments, never the AI-receptionist trope.
- **Ben's eye: 9 or 10 out of 10.** His scores so far: the live site 2, `lab/services` v0 3.
- **Beside the best, not the rivals**: every screen is shot beside Linear, Stripe, Vercel, teenage engineering and
  Heron AI at 1440 and 390 (the controls), and the blind critics see the controls under letters too. A version that a
  critic cannot tell from a control on craft, and can tell apart on what it says, passes.
- **CRAFT's measured targets** (20-30 numbers: type scale, measure, spacing base, hairlines, accent share, density,
  motion timings) are checked by script on every version, as the site's build checks links.
- **Nothing from the 2026 default**: no serif display as the difference, no generative art backdrop, no glass, no
  gradient text, no eyed blob as decoration (WS-040 §3, DP-020 F1, DP-100 §9B).

## The loop (one round is about 30-45 minutes, many rounds)

1. **Direction**: one idea per direction, its motifs named, its prior-art notes cited (WS-040).
2. **System first**: the type scale, grid, colour and line rules for the direction as CSS variables in
   `site/static/lab/_shared/` (one file per direction), measured against CRAFT's targets before any page is drawn.
3. **Pages**: the home page's first three screens, then the services page and one industry page in the same system,
   so a direction is judged as a site, not a poster.
4. **Shoot** (`shoot.mjs`: first screen, calm, full, the filmed scroll) and **look**: my eye first, faults written down
   with the element and the number.
5. **Blind critics** (Opus subagents under the standing grant; `blind.py` letters, the controls included, the key out
   of their reach), located faults only.
6. **Fix and reshoot**; a direction that stops improving for two rounds is dropped, its best element carried.
7. **Ben's eye** at checkpoints: a gallery page on the program branch's preview with every direction's latest screens and
   clips side by side, opened in a browser before he is told it is there.

## Parallel lanes in the pass (Ben's grant: up to three)

Coding lanes, one direction each, each in its own worktree and branch (`lab/<direction>`), notes every ten minutes,
a push every twenty; the main session runs the critics, reads every lane's shots each round, carries a good element
from one direction to another by message, and writes WS-060 (the experiments' record).

## What the pass ends with

The chosen direction as a system (tokens, components, the type scale, the drawn product, the characters' use, motion
rules), the home, services, one industry and the onboarding pages built in it, their screens and clips, the critics'
rounds, Ben's score, and WS-100 (the plan for the full build).
