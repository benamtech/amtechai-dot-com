# WS-002. Job queue

Grant (Ben, 2026-10-26 ~19:40 UTC): *"use research and coding subagents, up to 3, but check in on them often and
structure your work in a way where they frequently take notes so you can see what they are working on ... but also dont
work in a way where you pre empt what is the work of the agent"*. Primer:
`amtech-biz-brain/research/2026-10-26-the-website/00-PRIMER.md` (checked against `brain/proof.md`, `brain/pricing.md`,
the session-2 note and DP-011/DP-020 before sending; the metascripting command line and the screenshot script were run
before they were written in). Each lane: a brief (`lanes/<JOB>-BRIEF.md`), notes appended at least every ten minutes
(`lanes/<JOB>.md`), a one-line `lanes/<JOB>.now`. Each line here is updated when the job starts, is checked, reports,
and is read.

| Job | Wave | Model | Started (UTC) | Deadline (UTC) | State | Output | Read at join |
|---|---|---|---|---|---|---|---|
| RIVALS | 1 | sonnet | 19:48 | 21:20 | **reported ~20:17** (24 rivals ranked, gaps, Parts A-D); stopped early twice despite two messages; **resumed 20:18 with Part E** (best conversational onboardings, filmed to the identity wall); **Part E reported ~20:39** (13 products walked, 8 deep, WebM per walk, nothing submitted) | `lanes/RIVALS.md`, `RIVALS-table.json`, `sheets/RIVALS/` | 20:18: 2 of 2 checked at source (Avoca's own banner "$125M Series B at $1B"; Naive's 30 `/businesses/*` pages all content channels or agencies) |
| MARKET | 1 | sonnet | 19:48 | 21:20 | **reported ~20:08 by the clock** (it wrote 20:12; segment, 144 job rows, 48 rate rows, agencies) | `lanes/MARKET.md`, `lanes/MARKET-data/` | 20:09: 2 of 2 checked at source (Census raw `EC2200SIZEREVFIRM.dat`: NAICS 2382 at $500k-1M = 29,367 firms, 133,085 employees; Ahrefs: local SEO $1,557/mo) |
| INDUSTRY | 1b | sonnet | 20:09 | 21:45 | running: per business type, the recurring data-heavy services (the bids example's equivalents), their public data, what each is worth | `lanes/INDUSTRY.md`, `lanes/INDUSTRY-data/` | |
| FRONTIER | 1 | sonnet | 19:48 | 21:20 | **reported ~20:26** (7 prior-art notes, 10 ideas ranked, rule-outs, support table, spikes measured) | `lanes/FRONTIER.md`, `sheets/FRONTIER/`, `scripts/FRONTIER/spikes/` | 20:28: 2 of 2 checked at source (Apple TN3156: a downloadable MPEG-4 in Messages 'downloads the video and automatically plays it back'; Heron AI on Awwwards: SOTD). WS-040 written |
| CRAFT | 2 | **opus** | 20:33 | 21:55 | running: the best-crafted sites measured from computed styles (type, space, colour and line, density, motion, the product's picture) and looked at; 20-30 measurable targets for the design pass | `lanes/CRAFT.md`, `lanes/CRAFT-data/` | |
| HERO-A | 2 | **opus** (coding) | 20:30 | 21:55 | running: the employee at work on a real record in the first viewport, on a drafted paper ground (worktree `hero-a`, port 8091) | `site/static/lab/hero-a/`, `lab/notes/HERO-A.md`, `shots/r2/hero-a-*` | |

## What the main session does while wave 1 runs (no lane's result can overturn it)

1. WS-010: the site as it stands (live screens taken 19:35, the repo's pages and build, the weight).
2. WS-011: the account model said plainly, from our own store and DP-011 (facts of our own code).
3. WS-012: how the doors that exist compose into one onboarding conversation (our own code).
4. The Scoop Dogg proof: which AMTECH employees run his site and what they did (records), his ratings beside the
   competitors' (measured), the ChatGPT ranking (Ben's ask is to show it; measured, not assumed) into `brain/proof.md`.
5. The experiment harness on this branch: preview deploys, the shoot script at 1440 and 390, the clip recorder, the
   blind critics' kit.

## Dependencies written down before anything returns

- WS-020 waits on RIVALS; WS-030 waits on MARKET; WS-040 waits on FRONTIER.
- WS-050's hypotheses about the home page wait on all three; the onboarding hypotheses (WS-012) do not.
- No round-2 lane starts before join 1 is written in WS-001.
