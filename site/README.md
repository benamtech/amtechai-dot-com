# site/: amtechai.com on Hugo

Home (`/`), `/contractors` and `/painters` are Hugo pages, ported from the React app to look and behave exactly
as they did on production `4d1ad0c` (2026-10-13). The React app still serves every other route. Nothing on these
pages was redesigned or rewritten on the way.

## How it is built

- `tools/build.sh` builds the CSS with the app's own Tailwind 3 theme (`../tailwind.config.js`) and `../src/index.css`
  over these templates, then runs Hugo 0.167.0 (pinned and checksummed in `tools/hugo.sh`) into `public/`.
  `tools/build.sh server --port 1314` serves it while editing.
- `tools/overlay.sh` is Netlify's second build step (`netlify.toml`): after `npm run build` has made the React app
  and pre-rendered its routes into `dist/`, it keeps the React shell as `dist/spa.html`, points the SPA catch-all at
  it, and copies Hugo's pages over `dist/`. An unknown URL still gets the React app, never a 200 copy of Home.
- `src/components/ServerPage.tsx`: a React link to one of these three paths loads the file from the server instead
  of rendering a React copy.

## Where things are

| | |
|---|---|
| `layouts/baseof.html` | the head every page shares (GA and Google Fonts as before) and the page shell |
| `layouts/_partials/` | `navbar`, `footer`, `icon` (lucide-react 0.344's icons, drawn the same way) |
| `layouts/home.html`, `contractors.html`, `painters.html` | one per page, classes copied from the React source |
| `content/*.md` | each page's title, description, path and its head tags as production served them |
| `data/home.yaml` | Home's words; `/contractors` reads `../src/data/catalogue.json` and `real-run.json` (mounted) |
| `assets/js/site.js` | the navbar and the fade-up, as framer-motion did them; `assets/css/port.css` the fade's CSS |

A Tailwind class must appear whole in a template or in `assets/js/`, with a space on both sides when it sits next
to a template tag, or Tailwind will not generate it (it missed `lg:[&>*:first-child]:order-2` that way once).

## How it was proved the same

- `tools/node/capture.mjs <base> <out> / /contractors /painters` (`ENGINE=firefox|webkit`): full-page shots at 390
  and 1280 px after every fade has run. Compared against production pixel by pixel in Chromium and Firefox: 0
  differing pixels on all three pages at both widths. Home's Unsplash photographs come in two encodings from
  Unsplash's own CDN, so two captures of the same page can differ there by up to 21/255. Production does this too.
- WebKit (Playwright's Docker image) cannot be compared full-page on these pages: its headless full-page shot and
  its scroll-in fades disagree, and production fails it worse than the port (its hero heading stays invisible). Looked
  at in the viewport after scrolling to each section instead, the port shows what production shows.
- `tools/node/behaviour.mjs <base>`: the menu, the fade, Home's phone form, and the employee on `/contractors` (with
  app.amtechai.com stubbed). The output is identical on production and on the port.
