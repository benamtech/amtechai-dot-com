# WS-020. Rivals: the ranked table and the gaps nobody fills (from lane RIVALS, 2026-10-26)

Source: `amtech-biz-brain/research/2026-10-26-the-website/lanes/RIVALS.md` (stamped notes, Parts A-D, Summary v2),
`lanes/RIVALS-table.json` (24 rows with `sells_to_agencies`, `runs_smb_businesses`, sources, date read), screens in
`sheets/RIVALS/`. Checked at source by the main session: Avoca's own banner ("Avoca raises $125M Series B at $1B
valuation"); Naive's 30 `/businesses/*` template pages (all content channels or agencies). Ben's frame, added mid-lane:
the buyer is an SMB owner, an SEO or marketing agency running owners, or an operator running one or several service
businesses; **Naive is the direct competitor** (memory buyers-are-owners-agencies-and-operators).

## 1. Ranked by threat to AMTECH (for an owner's, an agency's or an operator's money)

| # | Rival | Money (source kind) | Who it sells to | Price on the page | First step | Runs SMB businesses? |
|---|---|---|---|---|---|---|
| 1 | **Naive** (usenaive.ai) | $28.5M Series A, Nexus, YC; ~$32M (TechCrunch) | Developers and operators; fastest-growing use: AI automation agencies | $20 / $200 a month plus metering; 7-day trial with card | Template page, Deploy, account, then a talk with a "CEO" agent before the paywall (changelog 2026-10-06) | Yes: a workspace per client in its agency templates; LLC, payments, phone, email in one API |
| 2 | **Avoca** | $125M Series B at $1B (own banner) | US home and field service, 13 industry pages | None shown | Book a demo | One function deep (calls, scheduling, win-back) |
| 3 | **Probook** | $40M, a16z and Sequoia (Fortune) | Home-service operators, PE roll-ups | None | Book a demo; "41 days" to deploy | Dispatch-first, big operators |
| 4 | **Marblism** (YC) | REPORTED | Solo owners, all industries | $24 a month for a team of seven "AI employees" | Onboarding app | Persona shelf; 40% recurring partner programme |
| 5 | **CentralComs** (YC S26) | Seed REPORTED | Trades | Minutes: $119-299 a month | 14-day trial, no card | Phone and text only |
| 6 | **Sintra** | $17M seed REPORTED | US small business | $16-49 a month, 12 "helpers", 3D mascots | Login | Persona chat |
| 7 | **Construct Computer** | n/a | Solo founders, small teams | From $9; team of 3 $39; Pro $150-300 | Start, 7-day trial | **Same architecture as ours** (own cloud desktop, email, schedules); a glowing orb with eyes |
| 8 | **NanoCorp** (YC) | n/a | People starting online businesses | $30 a month for 30 credits; 1 business free | **Idea box on the home page**, then login | Starts new businesses, not existing ones |
| 9-11 | Viktor, **Vendasta**, **GoHighLevel** | Vendasta 66,000+ partners; GHL $97/$297/$497 | Agencies and their local clients | GHL sub-accounts, white label | Trial or demo | **They hold the agency channel** and already sell "AI employees" to agencies |
| 12+ | Lindy, Cactus, Origami, Claude for Small Business, Bernard, Robby, Netic, Broccoli, UpSmith, Artisan, Devin, Instinct | see the table | | | | |

The YC directory (6,337 companies, swept): **59 active 2024-26 companies call themselves AI employees, workers,
workforce or teammates**; 49 more name trades, home services or small business. The phrase is a category, not a
difference.

## 2. What they look like (the main session's eye on their first screens, `sheets/RIVALS/`)

- **Naive**: a serif display face ("The Frontier of Autonomous Companies"), a generative crystal-and-light image across
  the full width, a mono ticker ("NAIVE RAISES $28.5M SERIES A ... JOIN OUR YC HACKATHON ON NOV 7TH"). Art direction
  over product; nothing of the product on the first screen.
- **Avoca**: a blueprint grid, a condensed all-caps headline with one word in blue, a stock photo of two mechanics,
  trust chips, a logo strip. The enterprise B2B template.
- **Construct Computer**: italic serif, a glowing orb character with two eyes, floating chat bubbles. The eyed
  character again (DP-020 F1: the idiom is now a commodity).
- **Origami**: serif headline, **a URL box as the first action** ("Enter your website"), reply bubbles from named
  prospects around it.
- **Devin**: the real product UI on the first screen (sessions, a PR, a recording), plain type. The one that shows the
  thing working.
- **Probook**: a dithered, halftone 3D hand holding a wrench on lavender; a bold sans headline. Dither as art.
- Weights (12 sites): median first load ~2.2 MB; 11 of 12 Next.js; **none declares `og:video`**.

## 3. The gaps nobody fills (each with RIVALS's evidence)

1. **One employee doing many jobs, in a trade's words, at a service price.** Trades rivals each sell one function
   (calls, dispatch, sales); the breadth sellers are $9-200 persona chat.
2. **Proof from one real business's week.** Logo walls, star badges, a counter that moved from $1,530 to $5,493 in
   hours (NanoCorp), benchmarks on a developer suite (Naive). Nobody shows a named small business's actual work.
3. **A conversation about the business you already run.** Naive's CEO interview and NanoCorp's idea box are for
   founders starting something; Origami's URL box is for B2B prospecting. Nobody says "tell me about your business" or
   takes a Google listing.
4. **A price set against a person.** Every price read is credits, minutes, seats or a demo; none says "$X a month
   against a full-time hire".
5. **An agency door for the new kind of employee**: the channel is Vendasta's and GoHighLevel's (sub-accounts, white
   label); Naive has no reseller page; Marblism a referral share.
6. **og:video, and work in seconds**: no rival declares one; "41 days" (Probook) and demos everywhere.

## 4. What it changes here (hypotheses for WS-050, each to be tested, not adopted)

- **H-HOME-PROOF**: the first screen shows a real business's real work (Scoop Dogg's, measured in `brain/proof.md`, and
  the product doing it), where every rival shows art, stock photos or a diagram. Devin is the only one that shows the
  product, and it is a developer tool.
- **H-HOME-INPUT**: the first action is the owner's own business (a website or a Google listing, as Origami takes a URL),
  answered with real work before any account, ending in the onboarding of WS-012.
- **H-PRICE-PERSON**: services priced per month against the named jobs and agency services they stand in for (WS-030),
  the comparison nobody prints.
- **H-AGENCY-DOOR**: an agencies page and a client-organisation model (WS-011 case 4) as a first-class door, against
  GoHighLevel's sub-accounts.
- **Do not lead with "AI employee"** as the claim (59 YC companies say it); lead with the business's outcome and the proof.
- **The look must not be the 2026 default**: serif-display-plus-generative-art (Naive, Origami, Construct) is now
  itself a template; so is the blueprint grid (Avoca). DP-020's warning on the eyed blob holds for the characters' use.
