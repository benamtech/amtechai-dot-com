# Primer for the website program's coding lanes (2026-10-26)

Read this, then `docs/first-principles/lab/README.md` (how an experiment is made, shown and judged), then your brief.
Also read the research primer's facts: `~/AMTECH/ai-employee-v2/amtech-biz-brain/research/2026-10-26-the-website/
00-PRIMER.md` ("What AMTECH is" and "What you must not do" apply to you too).

## What you are building, and what you are not

An **experiment**: one page (or a few) under `site/static/lab/<name>/` on your own branch `lab/<name>`, in your own
git worktree, that tests one hypothesis about the new amtechai.com. It is photographed and filmed at 1440 and 390 and
judged by blind critics and by Ben. It is not the site, and it is not merged to `main`, ever. **Ben, 2026-10-26: an
extremely deep design and iteration pass follows the research**, so your experiment is evidence for that pass: make the
hypothesis visible and honest, built well enough to judge, and say plainly what it got wrong.

## Fixed (do not change; ask the main session if one blocks you)

- **Facts and claims** only from `amtech-biz-brain/brain/proof.md`. The Scoop Dogg claims that may be said, as worded
  there: first in ChatGPT and Google's AI Overview for pet waste and turf care in Ventura and Santa Barbara (October
  2026); first on Google Maps for "pet waste removal" searched from Ventura and Oxnard (measured 26 October 2026);
  5.0 from 45 Google reviews; an Ahrefs site health score of 100; website and leads run by an AMTECH AI employee (one
  employee; never "a team of employees" for Scoop Dogg). Never his customers' names, numbers or addresses.
- **Prices** only as proposals, from `docs/first-principles/WS-030-MARKET-AND-PRICE.md` §4-5, with a visible line that
  they are proposed; today's live prices (`$1,200 setup`, usage) only as written there.
- **The characters**: `site/static/lab/_shared/characters.js` (`characterSVG()`, `<amtech-character>`): the shipped
  application's flat-shaded 3D solids with two eyes, ported unchanged. An employee stands on a plinth; teammates do not.
  Never redraw them, never give them mouths, never put a name on a shape as its identity.
- **Fonts**: `site/static/lab/_shared/fonts.css` (Geist, IBM Plex Sans, IBM Plex Mono, Inter, self-hosted).
- **The wordmark**: `AMTECH.` with a red period (#E11D2A). Red appears in the period and as at most one accent.
- **Words** (`amtech-biz-brain/brain/voice.md`): full plain sentences, answer first, one idea a sentence, no hype words,
  no "harness the power", no "revolutionise", no "unlock". In anything an owner reads, name the employee or the thing
  rather than writing "it". The six account words only (WS-011): you, organisation, business, AI employee, team, seat.
- **Real work only.** What the page shows of the product comes from the platform's real records (the showcase stills
  in `docs/first-principles/showcase/raw-r1/`, the application's real components and wording), never an invented
  demo. A demonstration business is labelled as one (TEST Walk Roofing is AMTECH's own test business).
- **The repo is public on GitHub.** Commit nothing from a customer's private records; Scoop Dogg's public facts above
  are fine.
- **No eyebrow text, ever** (Ben, 2026-10-26): no small uppercase or mono label above a heading, section or card. The
  heading says what the section is. Labels inside a table or a drawn figure (a callout, an axis) are not eyebrows.
- **The characters across the site, never boring** (Ben: *"we definitely need to use characters across the site.
  however your initial use of them ... was incredibly boring"*, of 40 px characters beside table rows): they are the
  page's living presence at real size, working, handing work to each other; a page where they could be deleted without
  loss has failed.
- **A customer is never a menu item** (Ben, on `lab/services` v0's nav "Scoop Dogg"): a customer's story is a proof
  section on a page or a Customers page, not navigation.
- **Money in the owner's own numbers** (Ben: *"9k a month for an estimator and 4.5k a month for a receptionist? thats
  ridiculous"*): no loaded-cost multipliers on a page; and the price model is **whole-business results** (one monthly
  price against everything the business would otherwise pay across agencies and positions), not per-service lines.
  WS-030 edition 0's numbers are withdrawn; show no hire comparison or service price until WS-030 edition 1.
- **Weight**: an experiment page under 300 KB on first load without its media; motion respects
  `prefers-reduced-motion` (the calm shot is taken automatically).

## The research you build on (read the digests, not the lanes)

`docs/first-principles/`: WS-010 (the site today), WS-011 (accounts, with the diagram), WS-012 (onboarding from the
doors), WS-013 (templates), WS-020 (rivals: ranked, how they look, the gaps), WS-030 (market and proposed prices),
WS-040 (the frontier: ranked ideas with their prior-art notes, and what is ruled out). **No graphics or motion idea is
built without a prior-art note**; WS-040 and `lanes/FRONTIER.md` hold the notes for the ten ranked ideas. If you want
an idea not there, write its prior-art note first in your notes file (who has done it, what it costs, what is left),
then build.

The shipped application's look, for reference: `~/AMTECH/ai-employee-v2/standard/projection/web/src/styles.css` (look
B), `ui/characters.tsx`, `ui/face.tsx`; and the screens in `docs/first-principles/showcase/raw-r1/*.jpg`.

## How you work (Ben asked to see the work as it happens)

- Notes: `docs/first-principles/lab/notes/<NAME>.md`, appended at least every ten minutes, stamped from `date -u +%H:%M`;
  a one-line `docs/first-principles/lab/notes/<NAME>.now` saying what you are doing this minute.
- **Commit and push your branch at every milestone** (at least every 20 minutes), so the main session can open your
  preview: `git -C <your worktree> push -u origin lab/<name>`. Shoot each milestone:
  `node docs/first-principles/lab/shoot.mjs r2 <name>-v<n> <url> --full` (a local `python3 -m http.server` over
  `site/public/` after `npm run build`, on your own port).
- Look at your own shots with vision before saying a version is done: crop, then Read the PNG. Name the faults you
  see in your notes, fix them, shoot again.
- Kill processes by pid only (`pkill -f` kills sessions here). Never read `.env*` or key files.
- If the main session sends you a message, it changes your brief from that moment; note it.
- At your deadline: a last shoot, a last push, and a report under 300 words: what the experiment shows, its URLs and
  shots, what you would change, what you could not do.
