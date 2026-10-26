# WS-010. The site as it stands (2026-10-26, measured)

Screens: `amtech-biz-brain/research/2026-10-26-the-website/sheets/MAIN/live-before/` (home, /contractors, /create,
/pricing at 1440 and 390, with each page's text). Weights: `scripts/MAIN/weigh.mjs`, a first visit in Chromium at 1440.

## What it is

- **Build.** Hugo 0.167 from `site/` (Markdown and data files, templates in `site/layouts/`), Tailwind 3 compiled once,
  no framework. Three scripts in `site/assets/js` (29 KB together: menu, fade-in, copy button; booking; investors).
  `site/tools/check.mjs` fails the build on a missing title, description, canonical or `<h1>`, a dead internal link,
  a sitemap mismatch, bad structured data, or an article without its Markdown twin. Vercel publishes `site/public/`.
- **Pages.** 15 content pages (home, about, contact, contractors, create, how-it-works, investors, painters, pay,
  pricing, privacy, schedule-demo, sms, terms) and 10 articles; 88 redirects in `vercel.json`. `/llms.txt`, the OKF
  bundle at `/okf/`, Markdown twins of articles.
- **Weight and speed (measured 19:58 UTC).**

| Page | Requests | Total | Script | Font | Image | LCP |
|---|---|---|---|---|---|---|
| `/` | 9 | 388 KB | 180 KB | 62 KB | 129 KB | 0.84 s |
| `/contractors` | 7 | 261 KB | 180 KB | 62 KB | 0 | 1.83 s |
| `/create` | 7 | 257 KB | 180 KB | 62 KB | 0 | 4.74 s |

  The 180 KB of script is almost all Google Analytics (`gtag.js`, loaded async); the site's own script is under 30 KB.
  `/create` and `/contractors` paint late because their largest element waits on the employee's client.

## What a visitor sees (read by eye from the screens)

- **The first screen** is a black Inter headline at display size, "Your next employee is an AI agent." with the red
  period, a grey paragraph of 50 words, and one red button, "Claim my AI Employee". Nothing of the product is shown.
- **Below it**: a strip of links ("This site is agent-readable. Working agent, Knowledge graph, llms.txt"), a black
  band ("Know the difference between using ChatGPT and managing an AI Employee."), then alternating bands of a large
  headline beside a duotone stock-style photograph (a hand with a grinder throwing sparks; a blurred circuit board).
  The home page is 8,927 px tall at 1440.
- **The writing** is the earlier essay voice ("The problem is not effort. It is where the effort is going.").

## What this changes

- Ben's verdict (*"some sort of blog or manifesto not a technology company"*) holds by eye: no product, no proof, no
  numbers, no customers, no pricing on the first three screens; photographs that could belong to any trade blog.
- What is worth keeping is under the surface: the checks, the redirects, the Markdown twins, `/llms.txt` and the OKF
  bundle, GA, and a site that loads in under a second. A new front end must keep every one of those working, or replace
  each with something that does the same job, measured with `tools/baseline.mjs` before and after.
- Hugo is not what makes the site look like a blog; the templates and the content do. Whether a framework is needed is
  decided by what the experiments need (live product, motion, the onboarding conversation), not by this survey.
