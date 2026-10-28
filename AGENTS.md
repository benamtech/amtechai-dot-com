# amtechai.com

The public website for AMTECH (https://amtechai.com), built by Hugo from `site/`. **Read `site/README.md` first**:
how it builds, where every page's words live, how to add a page, and what the checks catch.

```
npm install        # once
npm run dev        # http://localhost:1314
npm run build      # what Vercel runs: Hugo, then the checks (must pass)
```

- A page is a file in `site/content/` (every word in its front matter) plus a template in `site/layouts/` built from
  the kit in `site/layouts/_partials/w/`. An article is one file, `site/content/articles/<slug>.md`, and nothing else.
- One design, C on white: match the template beside the one you are writing; the CSS is `site/assets/css/w/`.
- A removed or renamed URL gets a 301 in `vercel.json` (`redirects`, with `"statusCode": 301`).
- Look at a changed page in full at 390 px and 1440 px before committing it (`site/tools/node/shots.mjs`). Production is a merge to `main` (Vercel, project
  `amtechai-dot-com`); every pull request gets a preview at its own `*.vercel.app` URL.
- The site is static: no functions, and no database of its own (its
  Supabase project was let go 2026-10-20): the booking page reads taken times from app.amtechai.com/site/slots and
  books at app.amtechai.com/site/booking, and the platform keeps the row.

`docs/`, `wiki/` and the `*.md` style notes at the root describe the React site this replaced (October 2026) and
the retired skills registry. They are history, not instructions.
