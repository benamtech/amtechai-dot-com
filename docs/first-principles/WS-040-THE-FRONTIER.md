# WS-040. The frontier: prior-art notes for every graphics and motion idea (from lane FRONTIER, 2026-10-26)

Source: `amtech-biz-brain/research/2026-10-26-the-website/lanes/FRONTIER.md` (seven prior-art notes, spikes measured on
this laptop's Chromium 156 with metascripting receipts, screens in `sheets/FRONTIER/`). Checked at source by the main
session: Apple TN3156, *"the preview downloads the video and automatically plays it back"* (a downloadable MPEG-4 in
Messages); Heron AI's Awwwards page shows it as Site of the Day. **Correction to our own earlier research**
(`NEXT-15/design/RESEARCH.md` §2 said nobody publishes iMessage autoplay): Apple does, in TN3156.

**The rule (Ben):** no graphics or motion idea is built without its prior-art note. The notes for every idea below are
in FRONTIER.md; an idea not listed here has none yet and is not built.

## 1. What the field does (seen and measured)

- **Product as hero** is the leaders' move (Linear, Attio, Cursor: the real app window in the first viewport).
  **Nobody shows a worker doing anything**; every first viewport leads with a headline.
- **Serif display type is now the AI default** (Naive, Granola, Resend, Anthropic, Origami, Construct): no longer a
  difference.
- **Old-world done well** is one object, a caption system, numbered sections and tiny captions (teenage engineering,
  1.5 MB; Commit Mono's keyboard-operated manual, 451 KB; Klim's crate), never scanlines. **Heron AI** (Awwwards SOTD
  2026-10-12) proves paper, a drafting grid with registration marks, a mono spec block and one red at award level in AI,
  but draws a building, not its product, and hijacks the scroll.
- **Weight:** the 12 craft sites' median first load is ~3.3 MB (1.8-17 MB), 8 of 12 Next.js; rivals ~2.2 MB. Ours is
  0.39 MB today (WS-010). **None of the 12 craft sites, and no rival, declares og:video.**

## 2. The ten ideas worth an experiment, ranked by FRONTIER (cost; what is left for AMTECH)

| # | Idea | Cost and support | Left for us |
|---|---|---|---|
| 1 | **The employee at work on a real record in the first viewport**, live DOM (a quote being built, "Step 2 of 4", the trust line, an approval card) | DOM only, ~0 KB media | The worker itself: no one shows one |
| 2 | **Paper and one red, drafted**: grain, hairline grid, crosshair registration marks, mono spec block, numbered sections | CSS, tiny | Draw the product (the plan as an engineering drawing with callouts), not a building |
| 3 | **og:video per page family**: 4-8 s silent loops of the app's own scenes, poster = frame 0 | 66 KB-1 MB each; `film.mjs` exists; iMessage autoplays, Discord plays, others show the poster | Nobody in the field does it |
| 4 | **Cross-document View Transitions**: the employee's solid morphs from a list to its page | 3 lines of CSS, measured working; Chrome 126+, Safari 18.2+; Firefox navigates plainly | No production card-to-page morph found |
| 5 | **One object that lands, with a contact shadow** (Vercel's triangle; ours is the character on its plinth) | CSS/SVG or one small WebGL scene | Our object has eyes and a job |
| 6 | **Numbered sections and a printed keyboard legend** (Commit Mono) | Tiny; accessible by construction | The old-world manual, for a business |
| 7 | **SVG-filter dither / print texture on live UI**, in states (asleep, awaiting approval) | Zero dependencies, measured; text stays real DOM | A state language, not decoration |
| 8 | **HTML-in-Canvas**: the real app card rasterised into a canvas and shaded | Chromium behind flags or an origin trial (through Chrome 160); measured 20,412 px drawn here; fps unmeasured on a real GPU | The subject (a business's real work in paper colours), not the shader |
| 9 | **Text flowing around moving characters** (Pretext, Cheng Lou) | A JS dependency; claims unverified | New for a product site |
| 10 | **Hand-off sparks between teammates** (Pixel Council's SVG motion along edges) | Tiny | The swarm as real records moving, not a pixel town |

## 3. Ruled out (with the reason)

Green-phosphor CRT and terminal portfolios (the genre's default; the opposite of Braun and the FT); pixel-art agent
towns (AI Town, Pixel Council: done, off the aesthetic); serif display as the difference; heavy video, Rive or Lottie
heroes (Rive 15.7 MB, Clay 17 MB); scroll hijacking (Heron: unreadable, hostile to crawlers); anchor positioning,
Houdini Paint, CSS `if()` and WebGPU as dependencies; a CSS contrast-trick halftone (failed in the spike: use an SVG dot
screen or a small WebGL pass).

## 4. What it changes here

- **The first viewport is the product working on a business**: idea 1 is the strongest finding of three lanes at once
  (RIVALS gap 2, FRONTIER #1, the shipped look's showcase material).
- **The type system is a grotesk plus mono** (Ben's mood board: Braun, a bus timetable, Bloomberg), not a serif.
- **The stack can stay light**: everything ranked 1-7 is HTML, CSS and SVG with small modules; nothing requires a
  framework. The stack decision (WS-100) is made on what the onboarding conversation needs, not on the graphics.
- **og:video is a free lead** over every rival and every craft site; the tool exists.
