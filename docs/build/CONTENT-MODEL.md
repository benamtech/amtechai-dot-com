# The content model of the new amtechai.com (C on white)

Written 2026-10-27 by the build session. One page is one file. Every word a visitor reads on a page lives in that
page's front matter; the layout owns almost none (SITEBUILD measured the layout at 44% of a page's words: keep fixed
words few). A new page is a new file and no code. The templates `errorf` on a missing required field.

Paths are under `site/`. Team ids are the six characters in `data/team.json`: `employee`, `t1` Takeoffs, `t2`
Follow-up, `t3` Being found, `t4` Collections, `t5` Research. A page may rename a teammate for its trade with `names`
(dental called `t2` "Recall"); the character keeps its shape and hue.

## Every page

| field | required | what |
|---|---|---|
| `title` | yes | The `<title>` without the brand (the head appends " | AMTECH AI"). Unique on the site; never differs from a sibling's by only the trade's noun |
| `description` | yes | Meta description, 70-160 characters, a sentence stating what this page holds, unique |
| `reviewed` | yes on written pages | `{by: "Ben Palaskas", date: "2026-10-27"}`: the made-by line at the foot ("Written by an AMTECH AI employee from AMTECH's records; reviewed by ...") |

## An industry page: `content/industries/<slug>/index.md` (layout `industries/page.html`)

URL `/industries/<slug>`. Slugs: `roofing`, `landscaping`, `painting`, `contractors`, `hospitality`, `transportation`.

```yaml
title: "AI employee for roofing contractors: estimates, follow-up and deposits"
description: "..."
label: "Roofing"                         # the card's name on home and the hub
card_line: "Every estimate measured, priced and followed up."   # the card's one line (home, hub)
h1a: "Roofing contractors: every estimate measured, priced and"
h1b: "followed up."                      # the payoff, set in red; short (2-4 words)
sub: "..."                               # the hero paragraph AND the lifted answer: one or two sentences, >= 18 words,
                                         # names AMTECH, carries a fact only this page holds (a system, the trade's real job)
field: "Your roofing company's name"     # the start field's placeholder: always the business's name
button: "Start the free trial"
config: roofing                          # travels to /start as ?industry=
team: [employee, t1, t2, t4]             # 3-4 ids, employee first
names: {}                                # optional: {t2: "Recall"}
team_detail:                             # one entry per teammate except employee, in team order: what it does HERE
  - {id: t1, does: "Measures the plan set or the drone photos at scale, prices it from your book, and names what it could not see."}
systems: ["Jobber", "QuickBooks", "CompanyCam", "Gmail", "Your website's forms"]   # 4-6, the trade's real systems
routines: ["Every morning: ...", "Every Friday: ..."]      # 2-3
first_jobs: ["...", "...", "..."]                          # exactly 3, imperative, specific to the trade
live: {who: t1, title: "Estimate for the plan set from Tuesday's email", step: "Step 2 of 4: measuring the roof planes at scale"}
services: [estimates-from-plans-and-photos, invoices-out-and-paid, found-on-google-and-in-ai-answers]  # 3-5 slugs from data/services.json: "made for your kind of business"
questions_h: "What roofing contractors ask first"
questions:                               # 4-6, the trade's own questions, answered in the first sentence
  - {q: "Does it work from drone photos?", a: "Yes. ..."}
closing_h: "Name your roofing company."  # the closing start's heading
closing_sub: "..."                       # one sentence under it
reviewed: {by: "Ben Palaskas", date: "2026-10-27"}
```

Each industry page carries at least 300 words of its own (sub, team_detail, routines, first_jobs, questions,
closing) and every detail is the trade's: its systems, its paperwork, its season, its words. A page that is another
page with the noun swapped fails `making-pages verify` (written-for-this-page at 70% or less, run per family on all
of them).

The hub `content/industries/_index.md`: `title`, `description`, `h1a`, `h1b`, `sub`, `closing_h`, `closing_sub`. Its
cards come from the industry pages themselves (`label`, `card_line`, `team`), ordered by `weight`.

## A department page: `content/departments/<slug>/index.md` (layout `departments/page.html`)

The industry page's fields, without `label`/`card_line`/`config`, plus:

```yaml
proof_h: "Scoop Dogg: first in ChatGPT for pet and yard cleanup, across Ventura and Santa Barbara."
proof: "..."
proof_link: "https://scoopdogg.net"
```

## Home: `content/_index.md` (layout `home.html`)

```yaml
start_h: "Start free"
start_sub: "Name your business, and your employee starts on it."
h1a / h1b / sub                     # the hero, under the start panel
industries_h / industries_sub       # "Customized to your business": cards from content/industries, by weight
services_h / services_sub / services_featured: [slug x8] / services_more: "See all 28 services"
how_h / how: [{h, p} x4]
proof_h / proof / proof_link / proof_figure: "#1" / proof_figure_line
closing_h / closing_sub
```

## Services: `content/services/_index.md` (layout `services/list.html`) and `data/services.json`

The page's own words in front matter (`title`, `description`, `h1`, `sub`, `featured`); the catalogue's entries in
`data/services.json`, one object per package: `slug`, `name`, `instead`, `for`, `connects` (list), `team` (ids),
`group` (the filter: Estimates, Public bids, Proposals, Getting paid, Bookkeeping, Marketing, Being found, Business
development, Documents, Scheduling, Inbox, Hiring). Each card's action goes to `/start?config=<slug>`.

## The start field everywhere

A plain GET form to `/start` with `business` (the name) and, on an industry page, `industry=<config>`; on a service
card, `config=<slug>`. `/start` is noindex, out of the sitemap, never prerendered; it mounts the workspace and calls
`el.start(business)`.

## Words: the rules every page keeps

- Ben's voice: `amtech-biz-brain/brain/voice.md`. Plain, full sentences. No eyebrow text above any heading, ever.
- The price line, word for word, from `brain/pricing.md`: "Start free and pay as you go. Custom agents with guaranteed
  results from $1,200/mo." It is a site-wide value (`data/site.json`), never retyped in a page.
- The start field asks for the business's name. Never "website, or one job".
- The only customer proof is Scoop Dogg (Ben, 2026-10-27): the first business run by an AI employee; first in ChatGPT
  for pet and yard cleanup across Ventura and Santa Barbara and at the top of Google Maps; AMTECH built his site and
  its online booking. No other customer, number or result is printed unless Ben has stated it.
- Industries are Ben's: landscaping, painting, contractors, hospitality and restaurants, transportation and logistics,
  roofing. Never a niche he has not named.
