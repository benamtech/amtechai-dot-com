# amtechai.com

The public website for AMTECH (https://amtechai.com), built by Hugo from `site/`. **Read `site/README.md` first**:
how it builds, where every page's words live, how to add a page, and what the checks catch.

```
npm install        # once: Tailwind
npm run dev        # http://localhost:1314
npm run build      # what Netlify runs: Tailwind, Hugo, then the checks (must pass)
```

- A page is a Markdown or data file in `site/content/` plus a template in `site/layouts/`. An article is one file,
  `site/content/articles/<slug>.md`, and nothing else.
- The look is the live pages. Match the template beside the one you are writing; classes and theme are Tailwind
  (`site/tailwind.config.js`).
- A removed or renamed URL gets a 301 in `site/static/_redirects`.
- Look at a changed page at 390 px and 1280 px before committing it. Production is a merge to `main` (Netlify).
- One Netlify function: `netlify/functions/sms-entry.mjs` (`/sms-entry`). The booking page writes to the
  `demo_bookings` table (migrations in `supabase/`).

`docs/`, `wiki/` and the `*.md` style notes at the root describe the React site this replaced (October 2026) and
the retired skills registry. They are history, not instructions.
