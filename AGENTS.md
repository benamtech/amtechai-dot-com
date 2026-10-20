# amtechai.com

The public website for AMTECH (https://amtechai.com), built by Hugo from `site/`. **Read `site/README.md` first**:
how it builds, where every page's words live, how to add a page, and what the checks catch.

```
npm install        # once: Tailwind
npm run dev        # http://localhost:1314
npm run build      # what Vercel runs: Tailwind, Hugo, then the checks (must pass)
```

- A page is a Markdown or data file in `site/content/` plus a template in `site/layouts/`. An article is one file,
  `site/content/articles/<slug>.md`, and nothing else.
- The look is the live pages. Match the template beside the one you are writing; classes and theme are Tailwind
  (`site/tailwind.config.js`).
- A removed or renamed URL gets a 301 in `vercel.json` (`redirects`, with `"statusCode": 301`).
- Look at a changed page at 390 px and 1280 px before committing it. Production is a merge to `main` (Vercel, project
  `amtechai-dot-com`); every pull request gets a preview at its own `*.vercel.app` URL.
- The site is static: no functions, and no database of its own (its
  Supabase project was let go 2026-10-20): the booking page reads taken times from app.amtechai.com/site/slots and
  books at app.amtechai.com/site/booking, and the platform keeps the row.

`docs/`, `wiki/` and the `*.md` style notes at the root describe the React site this replaced (October 2026) and
the retired skills registry. They are history, not instructions.
