# site/: amtechai.com

Every page amtechai.com serves is built here, by Hugo, from Markdown and data files. There is no JavaScript
framework: the pages are HTML with one small script (`assets/js/site.js`: the menu, the fade-in, the Copy button).
Node is in the repo only to run Tailwind.

## Build it, look at it, check it

```
npm install                 # once: Tailwind
npm run dev                 # http://localhost:1314, rebuilds as you save (Tailwind is built once at start)
npm run build               # what Vercel runs: Tailwind, Hugo into site/public/, then the checks
npm run check               # the checks alone, on the last build
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
when an article lacks its Markdown twin or its knowledge-bundle entry; or when a redirect lands nowhere.

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

The body is Markdown: `## Headings`, paragraphs, lists, tables (they stack on a phone by themselves). Four extras:

| Write | You get |
|---|---|
| `{{< answer >}} One paragraph. {{< /answer >}}` | the short answer, set large under a red rule |
| `{{< prompt title="Copy this prompt" helper="One line on how to use it." >}}` the prompt `{{< /prompt >}}` | a dark panel with a Copy button; `[anything in brackets]` shows as a blank to fill in |
| `{{< callout title="..." tone="warning" >}} One paragraph. {{< /callout >}}` | a note set apart (red rule for `warning`, black otherwise) |
| `Pricing logic` then `{.kicker}` on the next line, above a `## Heading` | a small red label over the heading |

**Any other page** is `content/<name>.md` with `route: "/<name>"`, `title`, `description`, its words in front matter
or in the body, and `layout: "<name>"` pointing at `layouts/<name>.html`. Start from the closest page:
`how-it-works.md` + `how-it-works.html` (words in front matter, a template that lays them out) or `privacy.md` +
`legal.html` (words in the Markdown body). Give it an `llms:` line if AI assistants should see it in `/llms.txt`.
Any page can carry `faqs:` (shown by its template, and written as FAQ structured data from the same list) and
`noindex: true` (kept out of search results and the sitemap, as `/pay` is). Head tags are never written by hand:
`layouts/_partials/head.html` makes them from the title, description and route.

Then `npm run build`. If the checks pass, look at the page at 390 px and 1280 px wide before you commit it.

**Removing or renaming a page**: add a rule to `redirects` in `vercel.json`
(`{"source": "/old-url", "destination": "/new-url", "statusCode": 301}`; `/old(/.*)?` for a path and everything under it, as
`/old`, `/old/` and `/old/any/page`) so
its links and search standing carry over. Rules run top to bottom and the first match wins, ahead of any page at that
URL. Always give `statusCode: 301`: Vercel's `permanent: true` is a 308. The checks fail if the target does not exist
or the code is not 301. Anything that is neither a page nor a redirect gets `404.html` with a real 404.

## Where things are

| | |
|---|---|
| `content/` | every page's title, description and route, and the words of the articles, legal pages, How it works, Pricing and the FAQs. `articles/` one file per article; `_index.md` is Home. The hand-designed pages ported in session 3 (`/painters`, `/contractors`, `/about`, `/contact`, `/pay`, `/schedule-demo`) keep their other words in their template, and Home's in `data/home.yaml` |
| `data/` | `home.yaml` (Home's words), `catalogue.json` (`/contractors`; it is generated by the brain's `programs/trade-office/bin/catalogue.py`), `concepts.yaml` (the bundle's concepts) |
| `layouts/baseof.html` | the head every page shares (GA, fonts, CSS) and the page shell |
| `layouts/_partials/` | `navbar`, `footer`, `icon` (lucide 0.344 icons), `head` (search and link-preview tags, from front matter), `article-schema` (an article's structured data), `md/` (the Markdown twin and bundle pieces) |
| `layouts/<name>.html` | one per page that has its own design; `articles/page.html` is every article, `articles/section.html` is `/articles`, `legal.html` is `/privacy`, `/terms`, `/sms` |
| `layouts/_shortcodes/` | `answer`, `prompt`, `callout`, `highlight` (legal), each with `.markdown.md` / `.okf.md` twins for the Markdown outputs |
| `layouts/home.llms.txt`, `home.sitemapxml.xml`, `home.okfindex.md` | `/llms.txt`, `/sitemap.xml`, `/okf/index.md` and the concept files |
| `assets/css/` | `base.css` (fonts, the shared component classes), `port.css` (the fade), `article.css` (article and legal bodies) |
| `static/` | files served as they are: `robots.txt`, the IndexNow key, images, the investor PDFs |
| `tailwind.config.js` | the theme (colours, type scale, shadows) |
| `tools/` | `build.sh`, `hugo.sh`, `check.mjs`, `baseline.mjs` (what an origin serves, URL by URL), `indexnow.mjs` (after a deploy: ping Bing and others with the sitemap), `node/` (screenshot and behaviour checks) |

A Tailwind class must appear whole in a template, a content file or `assets/js/`, with a space on both sides when
it sits next to a template tag, or Tailwind will not generate it.

## What visitors and crawlers get

One markup for people and crawlers: the HTML a browser renders is the HTML a crawler reads. From the same files, one
build also writes `/sitemap.xml` (every page; articles with their `lastmod`), `/llms.txt` (the pages with an `llms:`
line, then every article), each article's Markdown twin `/articles/<slug>.md` (named in the page's head), and the
knowledge bundle `/okf/` in the Open Knowledge Format: `index.md`, one entry per article, and one file per concept
in `data/concepts.yaml` (empty until the buildout writes some; the format is in that file), each listing what links to it.

## How the pages were proved the same as the React site (2026-10-13)

- `tools/node/capture.mjs <base> <out> <path...>` (`ENGINE=firefox|webkit`): full-page shots at 390 and 1280 px
  after every fade. Against production: 0 differing pixels in Chromium on every page at both widths (Home differs
  only inside its Unsplash photographs, by up to 21/255: Unsplash serves two encodings, and production differs from
  itself the same way), and 0 in Firefox on the pages checked there.
- `tools/node/behaviour.mjs <base>`: the menu, the fade, Home's phone form, and the employee on `/contractors` (with
  app.amtechai.com stubbed). Identical output on production and on this build.
- Articles are the one deliberate change of look: a new template (`layouts/articles/page.html`), every word kept.

## Speed (measured 2026-10-13)

Lighthouse, phone profile, GA on, both builds served from one local server the way Netlify serves them (brotli),
interleaved, median of 3. Netlify's deploy previews injected about 1 MB that production did not have; Vercel's serve
the same bytes as production (measured 2026-10-20), but time on a local server or production all the same.

| | React (production) | Hugo, Google fonts | Hugo, fonts served here (now) | + GA `settled` |
|---|---|---|---|---|
| score | 39-47 | 60-63 | 71-95 | 100 |
| first paint | 3.1-4.0 s | 2.6 s | 1.1-1.2 s | 1.1-1.3 s |
| largest paint | 5.7-6.3 s | 4.8-5.5 s | 1.4-4.2 s | 1.4-1.5 s |
| blocking time | 1.4-2.1 s | 0.5-0.6 s | 0.26-0.58 s | 0 |
| the site's own bytes | 226-463 KB | 11-18 KB (+250 KB photos on /painters) | 78-93 KB (fonts now count as the site's) | same |

What is left is Google Analytics (about 176 KB of script). `ga_load` in `config/_default/hugo.toml` decides when it
loads (`layouts/_partials/analytics.html`): `head` counts every visit; `settled` loads it on the first scroll, tap
or key, or 5 seconds after the page has loaded, and misses only a visitor who leaves inside those 5 seconds without
touching the page. Loading it after the page's load event (`load`) measured no faster than `head`.
