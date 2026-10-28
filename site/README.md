# site/: amtechai.com

Every page amtechai.com serves is built here, by Hugo, from Markdown and data files, in one design: C on white
(2026-10-27; the rules that bind every page are in the platform repo's `plans/2026-10-27-WEBSITE/build/PRIMER.md`).
There is no JavaScript framework. Node is in the repo for three (the hero's 3D team, bundled by Hugo) and for the
screenshot and browser checks under `tools/node/`.

## Build it, look at it, check it

```
npm install                 # once
npm run dev                 # http://localhost:1314, rebuilds as you save
npm run build               # what Vercel runs: the characters' data, Hugo into site/public/, then the checks
npm run check               # the checks alone, on the last build
node site/tools/node/shots.mjs site/public <out> /path/ ...   # full pages at 390 and 1440: look before you commit
```

Hugo is pinned (0.167.0) and fetched and checksummed on first use by `tools/hugo.sh`. Vercel (project
`amtechai-dot-com`) publishes `site/public/`; `vercel.json` at the repo root says so, and holds the site's redirects and
its response headers (the Markdown content types and cache rules for `/okf/*`, `/articles/*.md` and `/llms.txt`).
Production is a merge to `main`; every pull request gets a preview at its own `*.vercel.app` URL.

`tools/baseline.mjs capture <origin>` records what an origin answers for every URL the site has ever promised (status,
`Location`, content type, cache rules, a hash of each body); `tools/baseline.mjs diff a.json b.json` compares two. It
proved the move from Netlify to Vercel (2026-10-20) changed nothing a reader sees; run it before and after any change
to hosting, redirects or headers.

`tools/check.mjs` fails the build when a page has no title, description, canonical or single `<h1>`; when a link or
image inside the site goes nowhere; when the sitemap and the pages disagree; when structured data does not parse;
when an article lacks its Markdown twin or its knowledge-bundle entry; or when a redirect lands nowhere; and (§11) when a layout builds a sentence from a page's fields
instead of taking every word whole from the page's own file or `data/w.json`.

## Adding a page

**An article** (most new pages) is one file: `content/articles/<slug>.md`. It is served at `/articles/<slug>`,
listed on `/articles`, in `/llms.txt`, in `/sitemap.xml` and in the knowledge bundle, and gets its Markdown twin at
`/articles/<slug>.md`. Nothing else is edited. Copy an existing article's front matter and keep its fields:

```yaml
---
title: "Create an Estimate With ChatGPT"          # the page's <h1> and its title
description: "One sentence for search results."   # meta description, llms.txt, the bundle
dek: "The paragraph under the title."
date: 2026-06-17
lastmod: 2026-06-17                               # change it when the words change; the sitemap reads it
author: "AMTECH AI"
audience: "owners and office managers at local service businesses"
related: [service-ai-employee]                    # optional: concepts in data/concepts.yaml it explains (none yet)
about:                                            # structured data only, not shown
  - { name: "ChatGPT estimates", type: tool }     # type: business service problem industry place method customer tool outcome
faqs:                                             # optional; shown as Questions, and as FAQ structured data
  - q: "Can ChatGPT make a PDF estimate?"
    a: "It can draft the estimate ..."
citations:                                        # optional; shown as Sources
  - { label: "Title of the source", url: "https://...", publisher: "Who published it" }
next:                                             # the three links in the closing panel
  - { label: "Talk through an estimating workflow", href: "/schedule-demo", reason: "One sentence." }
---
```

The body is Markdown: `## Headings`, paragraphs, lists, tables (they stack on a phone by themselves). Three extras:

| Write | You get |
|---|---|
| `{{< answer >}} One paragraph. {{< /answer >}}` | the short answer, set large under a red rule |
| `{{< prompt title="Copy this prompt" helper="One line on how to use it." >}}` the prompt `{{< /prompt >}}` | a dark panel with a Copy button; `[anything in brackets]` shows as a blank to fill in |
| `{{< callout title="..." tone="warning" >}} One paragraph. {{< /callout >}}` | a note set apart (red rule for `warning`, black otherwise) |

**Any other page** is `content/<name>.md` (or a section folder) with `route`, `title`, `description` and every word
the page shows in its front matter, and `layout:` pointing at its template. A template is a whole document:
`{{ partial "w/top.html" . }} <main>...</main> {{ partial "w/bottom.html" . }}`; it refuses a missing field with
`errorf` and owns no sentence. Start from the closest page: `company.html` (/pricing, /about, /security: blocks of
kinds), `legal.html` (words in the Markdown body), `contact.html` or `pay.html` (a heading and cards), or one of the
section families (`industries/`, `services/`, `questions/`, `departments/`, `customers/`). Give it an `llms:` line if AI
assistants should see it in `/llms.txt`. `noindex: true` keeps a page out of search and the sitemap (as `/pay`,
`/investors` and `/start` are). Head tags are never written by hand: `w/top.html` makes them from the front matter, and
`node site/tools/og.mjs` draws the page's share image (Vercel cannot).

Then `npm run build`. If the checks pass, look at the page in full at 390 px and 1440 px wide before you commit it.

**Removing or renaming a page**: add a rule to `redirects` in `vercel.json`
(`{"source": "/old-url", "destination": "/new-url", "statusCode": 301}`; `/old(/.*)?` for a path and everything under it, as
`/old`, `/old/` and `/old/any/page`) so
its links and search standing carry over. Rules run top to bottom and the first match wins, ahead of any page at that
URL. Always give `statusCode: 301`: Vercel's `permanent: true` is a 308. The checks fail if the target does not exist
or the code is not 301. Anything that is neither a page nor a redirect gets `404.html` with a real 404.

## Where things are

| | |
|---|---|
| `content/` | every page's file: its route, title, description and all its words. `_index.md` is Home; sections are folders with an `_index.md` and one folder per page |
| `data/` | `w.json` (the words shared across pages: the start field, the price line, labels), `services.json` (the 28 packages on /services), `team.json` and `characters.json` (the characters; the second is generated at build), `frame.json` (the application frame), `investors.json` (written by the brain's `output/2026-10-17-funding/site/publish.py`), `concepts.yaml` (the knowledge bundle's concepts) |
| `layouts/<name>.html`, `layouts/<section>/` | one template per page family; `start.html` is /start (the handoff to the live employee) |
| `layouts/_partials/w/` | the kit: `top` and `bottom` (the head, nav and footer), the start field, the Orbit, the characters, the application frame, documents, proof, price, questions and the other sections; `jsonld`, `meta` and `ogimage` (structured data and share tags) |
| `layouts/_partials/md/`, `layouts/_shortcodes/` | the Markdown twin and bundle pieces; the article shortcodes `answer`, `prompt`, `callout`, `highlight`, each with Markdown twins |
| `layouts/home.llms.txt`, `home.sitemapxml.xml`, `home.okfindex.md` | `/llms.txt`, `/sitemap.xml`, `/okf/index.md` and the concept files |
| `assets/css/w/` | the design: `white.css` (tokens and base), then one file per family, concatenated in `w/top.html` |
| `assets/js/` | `investors.js` (the deck viewer), `team3d/` (the hero's 3D team), `w/` (the booking page, the swarm) |
| `static/` | files served as they are: `robots.txt`, the IndexNow key, favicons and the manifest, fonts (`fonts/w/`), share images (`og/`), customer captures, the investor PDFs |
| `tools/` | `build.sh`, `hugo.sh`, `check.mjs`, `og.mjs` (share images), `baseline.mjs` (what an origin serves, URL by URL), `indexnow.mjs` (after a deploy), `node/` (`shots.mjs`, `start-page.mjs` and `start-handoff.mjs` with the workspace stubbed, `walk-booking.mjs`, `contrast.mjs`) |

## What visitors and crawlers get

One markup for people and crawlers: the HTML a browser renders is the HTML a crawler reads. From the same files, one
build also writes `/sitemap.xml` (every page; articles with their `lastmod`), `/llms.txt` (the pages with an `llms:`
line, then every article), each article's Markdown twin `/articles/<slug>.md` (named in the page's head), and the
knowledge bundle `/okf/` in the Open Knowledge Format: `index.md`, one entry per article, and one file per concept
in `data/concepts.yaml` (empty until the buildout writes some; the format is in that file), each listing what links to it.

## Speed

The new pages measured 93-98 on Lighthouse's phone profile at launch (2026-10-27; a11y, best practices and SEO 100,
CLS 0). What is left is Google Analytics (about 176 KB of script). `ga_load` in `config/_default/hugo.toml` decides when it
loads (`layouts/_partials/analytics.html`): `head` counts every visit; `settled` loads it on the first scroll, tap
or key, or 5 seconds after the page has loaded, and misses only a visitor who leaves inside those 5 seconds without
touching the page. Loading it after the page's load event (`load`) measured no faster than `head`.
