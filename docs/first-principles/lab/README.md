# The lab: how an experiment is made, shown and judged

1. **A branch per experiment**, cut from `redo/first-principles`: `git switch -c lab/<name>`. The experiment is a
   static page (or several) under `site/static/lab/<name>/index.html`; Hugo copies it untouched, so an experiment may
   use any technique without deciding the site's stack. It must pass `npm run build` (the checks): one `<title>`, a
   description of 20+ characters, `<meta name="robots" content="noindex">`, a canonical
   `https://amtechai.com/lab/<name>`, one `<h1>`, and internal links that resolve. Copy `site/static/lab/characters/`.
2. **Shared parts** in `site/static/lab/_shared/`: `fonts.css` (Geist, IBM Plex Sans and Mono, Inter: the app's own
   self-hosted files) and `characters.js` (the application's 3D characters, ported unchanged: `characterSVG()` and
   `<amtech-character>`). Never fork them inside an experiment; change them here, once.
3. **A preview** is a push: `git -C ~/AMTECH/amtech-ai-dot-com-wt/<worktree> push -u origin lab/<name>` and Vercel
   builds `https://amtechai-dot-<hash>-benamtechs-projects.vercel.app/lab/<name>/` (public, `x-robots-tag: noindex`,
   about ten seconds; `vercel ls amtechai-dot-com` lists it). Locally: `npm run build`, then serve `site/public/`.
4. **Shoot it**: `node docs/first-principles/lab/shoot.mjs <round> <name> <url> [--hold 6] [--full]` writes the first
   screen, the calm (reduced-motion) first screen and a filmed scroll at 1440 and 390, plus console errors, failed
   requests, overflowing controls, bytes and LCP, into `docs/first-principles/shots/<round>/`.
5. **Judge it**: my own eye on the shots first, then blind critics on copied files (letters, not names; the key kept
   outside the critics' folder), then Ben on screens. Results go in WS-060 with the shots.

Nothing in `lab/` is ever merged to `main`: it lives on its branches and on this program branch.
