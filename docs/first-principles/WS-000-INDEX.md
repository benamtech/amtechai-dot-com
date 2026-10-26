# WS-000. amtechai.com from first principles: index and plan of work

Opened 2026-10-26 19:33 UTC. Branch `redo/first-principles` of the site repo (worktree
`~/AMTECH/amtech-ai-dot-com-wt/first-principles`), cut from `origin/main` at `f911846`. Nothing here reaches the live
site: production is a merge to `main`, and only Ben's OK merges.

The brief is `amtech-ai-platform-mvp/plans/2026-10-26-DESIGN-PROGRAM/KICKOFF-WEBSITE.md` (Ben's words, the eleven
research areas, the showcase, the rules). Ben, opening this session:

> *"do a full site redesign with extremely extensive research, experimentation, screenshotting, iteration, many many
> times until my requirements are met. we will also need to do a ton of market research, competitor research, academic
> research."*
>
> *"use research and coding subagents, up to 3, but check in on them often and structure your work in a way where they
> frequently take notes so you can see what they are working on or frequently work out prototypes or use the brain
> script so you are all on the same page and you wont have to do massive re edits after they are all done but also dont
> work in a way where you pre empt what is the work of the agent ... use sophisticated workflows"*

## Where things live

| What | Where |
|---|---|
| This program's documents (index, logbook, jobs, the plan, page specs) | `docs/first-principles/` in the site repo, this branch |
| Findings about the world (competitors, market, prices, the frontier) | `amtech-biz-brain/research/2026-10-26-the-website/` (primer, `lanes/`, `sheets/`, `scripts/`, `raw/` ignored by git) |
| Experiments (heroes, onboarding, services, industries, the case study) | One branch each off this one, `lab/<name>`, each with its Vercel preview |
| Screens and clips | `docs/first-principles/shots/<round>/` (small PNG and WebM); the brain's `sheets/` for research contact sheets |
| Claims | `amtech-biz-brain/brain/proof.md` first, then a page may say them |
| Prices | proposed here with their working; Ben sets them in `brain/pricing.md` |

## The documents

| No. | Title | State |
|---|---|---|
| WS-000 | Index and plan of work | this file |
| WS-001 | Logbook (stamped by the clock: `python3 logbook.py "<title>" "<body>"`) | open |
| WS-002 | Job queue: each lane, its brief, deadline, notes file, what its result may change | open |
| WS-010 | The site as it stands (live, photographed 2026-10-26 19:35) | to write |
| WS-011 | The account model, said plainly (one page, one diagram) | to write |
| WS-012 | Onboarding: how the doors that exist compose into one conversation | to write |
| WS-020 | Rivals: ranked table and the gaps nobody fills (from lane RIVALS) | after RIVALS |
| WS-030 | The market and the price: the segment, the jobs, the agency rates, the proposed prices with working (from lane MARKET) | after MARKET |
| WS-040 | The frontier: prior-art notes for every graphics and motion idea (from lane FRONTIER) | after FRONTIER |
| WS-050 | Hypotheses, each with what would prove it wrong | grows all session |
| WS-060 | Experiments: one section per branch, its screens, its critics, its verdict | grows all session |
| WS-100 | The plan: sitemap, page specs, onboarding end to end, services and prices, the visual system, the stack | last |

## How the work runs: rounds, not a line

Each round: a wide sweep; deep first-hand reads of the best few sources (sites at 1440 and 390 read with vision, docs,
code, papers, operators' forums); hypotheses with falsifiers (WS-050); live experiments on `lab/*` branches, filmed and
photographed (WS-060); looking hard (my eye, then blind critics on copied files); deeper research on what the
experiments exposed; the next round. Every round is written up in WS-001 from the clock.

**Lanes (Ben's grant this session: up to three subagents, research and coding).** Each lane has a checked primer
(`research/2026-10-26-the-website/00-PRIMER.md`), one bounded brief, a clock deadline, and a notes file it appends to
at least every ten minutes (`lanes/<JOB>.md`, with a one-line `lanes/<JOB>.now` saying what it is doing this minute).
The main session reads those files while the lane runs, and works only on slices the lane's result cannot overturn
(our own code and records, the experiment harness, the proof). A lane that drifts is corrected by message, not
re-done after.

## Rounds planned (revised as evidence arrives)

1. **Round 1, the sweep.** Lanes RIVALS, MARKET, FRONTIER (research). Main: WS-010, WS-011, WS-012, the Scoop Dogg
   proof, the experiment harness.
2. **Round 2, the first experiments.** Coding lanes on `lab/*` branches: hero directions chosen from round 1's
   hypotheses, the onboarding conversation, a services page with proposed prices. Main: critics, deeper research on what
   the screens expose.
3. **Round 3 onward.** The industry graph and funnels, industry and service pages, the case study, the showcase clips;
   iterate on what the critics and Ben's eye found.
4. **The plan** (WS-100) and the next kickoff: the full build.
