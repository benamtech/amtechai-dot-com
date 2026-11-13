---
# Home, rebuilt 2026-11-13 (lane `homepage`, draft for Ben) on layouts/agentfirst.html. The frame is Ben's of 2026-11-12:
# AMTECH is a technology company built on agent swarms that form around a business and work under the owner's rules.
# The live product is in the first screen (the start box posts to app.amtechai.com/start, as /start's fields do since
# PR #104). Every claim here is in brain/proof.md or in the measured tables of WHAT-AMTECH-IS-NOW.md section 1; the line
# for each is in session-4/site/CLAIMS.md. Timings are "in our tests". NO price figure is set: [PRICE: Ben sets].
# The old home (landing layout) is in git history. /contractors and /real-estate still use layouts/landing.html.
llms: { order: 1, label: "AMTECH", text: "AMTECH is software that builds a team of AI agents around a business. The owner says what the business does in a few messages, and a team with its own jobs, a work board and a group room forms and starts work, under the owner's rules." }
title: "AMTECH: software that builds itself around your business"
description: "Describe your business. AMTECH forms a team of AI agents around it, each with its own job, on a work board you watch. About 90 seconds in our tests."
route: "/"
layout: "agentfirst"
crumb: "AMTECH"
answer: "AMTECH is software that builds a team of AI agents around a business. The owner says what the business does in a few short messages. A team forms, each teammate with its own job and skills, and starts on a work board the owner can watch. The team works under the owner's rules, and nothing goes out until the owner says yes or a standing yes covers it."
app:
  name: "AMTECH"
  category: "Teams of AI agents that form around a business"
  features: ["A team of AI agents built from a description of the business", "Each teammate carries the skills for its job", "A work board, a page for each teammate and a group room where the team meets", "Standing rules in plain words, a receipt for every action, and the cost of every job", "A team for each business on one account"]
  offers:
    - {name: "Free to start", price: "0", description: "Free to start."}
nav:
  - {t: "How it works", u: "#how"}
  - {t: "Examples", u: "#examples"}
  - {t: "Pricing", u: "#pricing"}
  - {t: "For operators", u: "#operators"}
nav_cta: {t: "Start", u: "#start"}
hero:
  kicker: "Agent-first software"
  h1a: "Software that builds itself"
  h1b: "around your business."
  sub: "Describe your business. AMTECH forms a team of AI agents around it, each with its own job, and starts them on a work board you can watch. In our tests the team was ready about a minute and a half after the start."
  label: "Tell us what your business does"
  field: "I run an online candle store"
  button: "Start your team"
  free: "Free to start."
  chips_h: "Or start from one of these"
  chips:
    - "I run an online candle store"
    - "We are a general contractor"
    - "I run a marketing agency with 30 clients"
    - "We do yard and pet waste cleanup"
    - "We are a heating and air company"
    - "We run a dental office"
    - "We run a law office"
    - "We run a food bank"
  live:
    tag: "From a test business"
    h: "An online candle store, 85.6 seconds after the start"
    team_h: "The team that formed"
    team: ["Ads", "Email", "Listings", "Inbox", "Analyst"]
    job_h: "Its first job, on the board"
    job: "Look at the last 30 days of sales and ad spend, then tell the owner the three biggest money leaks."
    cards_h: "Cards on the board"
    cards:
      - {who: "Analyst", t: "Pull last 30 days of sales and ad spend data"}
      - {who: "Ads", t: "Analyze ad spend efficiency and flag losing campaigns"}
      - {who: "Analyst", t: "Analyze sales, discounts, refunds and margin leaks"}
      - {who: "Analyst", t: "Write the owner-facing top three money leaks report"}
    foot: "These are the real cards from one of our test runs, not a mock-up."
how:
  id: "how"
  h: "A team with jobs, a board, pages and a morning meeting."
  p: "This is what a team looks like once it has formed. Every screen here is a real screen from a test business on the platform."
  tag: "From a test business"
  items:
    - slot: "today"
      h: "Each day opens on work done"
      p: "Today shows what the team finished this week, counted from its records, and the few things that wait for your yes."
      alt: "Today for a test store: cards finished this week, records made, messages sent, orders, and two things waiting for the owner"
      img: "img/home/today-1440.png"
      img_small: "img/home/today-1440.png"
      w: 1440
      h_px: 900
    - slot: "pages"
      h: "The business's own pages"
      p: "Your records become pages built from your description: a store gets listings, ad changes and cart recoveries; a dental office gets recalls and appointments. Every change the team proposes waits for your yes, and can be undone."
      alt: "A test store's listings page: eight products read from its store, in a pipeline from drafting to live"
      img: "img/home/pages-1440.png"
      img_small: "img/home/pages-390.png"
      w: 1440
      h_px: 900
    - slot: "group"
      h: "A group room where the team meets"
      p: "On a schedule, the team meets in a group room, agrees what to do and puts the actions on the board. You can write to the group at any time."
      alt: "The morning marketing group room of a test candle store: the teammates agree how to count which scents are missing from the store's emails, and one has built the tool"
      img: "img/home/group-1440.png"
      img_small: "img/home/group-390.png"
      w: 1440
      h_px: 900
    - slot: "org"
      h: "Every team you run, on one page"
      p: "One sign-in holds a team for each business, across your organisations, with what each team got done this week."
      alt: "The account home of a test owner with three teams in two organisations, each with its week of work"
      img: "img/home/org-1440.png"
      img_small: "img/home/org-390.png"
      w: 1440
      h_px: 740
  morning:
    h: "What happened at 8 am in a test"
    p: "A test store's team met in its group room. One teammate built and tested a tool that decides which campaigns to cut, hold or keep. The lead put the agreed actions on the board as cards for whoever does them. Both teammates started, and the summary reached the owner 2.6 minutes after the meeting began. At the next meeting a teammate reported a scent-coverage tool as done rather than agreed."
tech:
  id: "tech"
  h: "The technology, said plainly."
  items:
    - h: "Built from a description"
      p: "You answer about six short messages. The system plans the team and starts it. In our tests the team was ready 72 to 103 seconds after the start, across eight kinds of business."
    - h: "Each teammate carries its job's skills"
      p: "A teammate gets four to eight skills from a catalog, matched to its job. The cards it works on keep those skills pinned to them."
    - h: "Teams meet, agree and act"
      p: "Teammates meet in a group room. They decide what to do and put the work on the board. In one test the group built and tested a tool during the meeting."
    - h: "Your address, your records, your rules"
      p: "Each business gets its own address and its own records. You write the rules in plain words. Every action leaves a receipt you can open, and every job shows its cost."
examples:
  id: "examples"
  h: "The same technology, shaped by the business."
  p: "Eight kinds of business were described to AMTECH as a stranger would describe theirs. Each got a different team, with different jobs and a different first task. All eight are test runs. None is a customer."
  seconds: "seconds to a ready team"
  team_k: "Team"
  job_k: "First job"
  cards:
    - {name: "An online candle store", s: "85.6", team: "Ads, email, listings, inbox, analyst", job: "Look at 30 days of sales and ad spend and name the three biggest money leaks."}
    - {name: "A heating and air company", s: "76.3", team: "Retention, reviews, lead follow-up, analyst", job: "Pull the maintenance plan list and show who is due for renewal this month."}
    - {name: "A law office", s: "90.4", team: "Front desk, intake, lead follow-up, onboarding, documents, billing, collections", job: "Answer every missed intake call, put every new enquiry into the firm's records, and start the client updates."}
    - {name: "A food bank", s: "78.3", team: "Shift fill, fundraising, email, documents, analyst", job: "Read the volunteer sheet and the grant tracker, then tell the owner what needs attention."}
    - {name: "A dental office", s: "102.8", team: "Front desk, retention, reviews, analyst", job: "Look at the next two weeks of appointments and recall lists, then tell the owner what needs attention."}
    - {name: "A general contractor", s: "71.5", team: "Estimator, projects, dispatch, billing, collections, inbox", job: "Put estimate, job and invoice records, open estimates and unpaid invoices into one list."}
    - {name: "A marketing agency with 30 clients", s: "80.5", team: "Ads, email, creative, support, analyst", job: "Put the 30 clients into one client list with their ad accounts, and set a monthly report rhythm."}
    - {name: "A yard-service company", s: "74.2", team: "Front desk, estimator, scheduler, lead follow-up, reviews", job: "Quote new yards, plan the week's route, reply fast to new enquiries and ask for reviews."}
  note: "Each time is one run, from the start to a ready team with its first job on the board. Two earlier runs for the law office took 124 and 241 seconds, when our test system was short of free capacity."
live:
  id: "proof"
  tag: "Running today"
  h: "A business with an AI employee running its bookings, quotes and replies."
  p: "Scoop Dogg does pet waste removal and turf care in Ventura and Santa Barbara counties. An AMTECH AI employee gets every booking, quote and contact from his website, and drafts the reply at his real prices. In October 2026 he was first in ChatGPT and in Google's AI Overview for pet waste and turf care in Ventura and Santa Barbara."
  source: "Reported by Ben Palaskas, AMTECH, October 2026."
  link: "/customers/scoop-dogg"
  link_text: "Read how it works for him"
for:
  id: "operators"
  h: "Who it is for."
  p: "Owners of businesses that make $500,000 to $10 million a year and sell something other than software. And firms that own or run many of them."
  cols:
    - {h: "An owner", p: "A team for your business without hiring one. You watch the board and set the rules."}
    - {h: "An operator with several businesses", p: "One account holds a team for each business you run. People you invite can use a team."}
    - {h: "A portfolio or family office", p: "Talk to us. We build this with you."}
  link: "/schedule-demo"
  link_text: "Talk to us"
# Section 7 of the plan, "Businesses AMTECH runs itself", is NOT shown. It stays empty until one business has run for a
# month with its own books (GAP-10). Fill `own:` and the layout shows it; no redesign needed.
own: {}
price:
  id: "pricing"
  h: "What it costs."
  cols:
    - {h: "Start", big: "Free to start.", p: "Describe your business and your team starts."}
    - {h: "One business", big: "A monthly plan.", p: "We take no share of your sales.", placeholder: "[PRICE: Ben sets]"}
    - {h: "Operators and portfolios", big: "Talk to us.", p: "For firms with many businesses.", link: "/schedule-demo", link_text: "Talk to us"}
questions_h: "Questions"
questions:
  - {q: "Is this a template?", a: "No. Each team is made from what you tell us. In our tests, eight kinds of business got eight different teams, with different jobs and a different first task."}
  - {q: "What can it not do?", a: "It cannot do physical work, such as cleaning a yard or filling a tooth. It cannot sign in to your accounts until you connect them. Nothing is sent, posted, paid or booked until you say yes, unless a standing yes in your own words covers it."}
  - {q: "Who sees my data?", a: "Your business has its own address and its own records. AMTECH's own access to your business ends by itself, and you see it end. If you close your account, nothing of your business stays behind."}
  - {q: "Can it run my whole business?", a: "It does the computer work of a business. This page shows what it has done so far, and that is all we claim."}
  - {q: "What is an AI agent?", a: "An AI that does a job from start to finish rather than answering a question. It reads what it needs, uses your software, does the work and reports what it did."}
  - {q: "Who is AMTECH?", a: "AMTECH AI is a technology company founded by Ben Palaskas. It builds software that forms teams of AI agents around a business. It is not Amtech Systems."}
close:
  h: "Describe your business and start your team."
  p: "Free to start."
  talk: "Rather talk first?"
  talk_link: "Talk to us"
site_sources: false
sources:
  - "The cards, teams and times shown on this page come from tests of AMTECH's own system with described businesses, on 2026-11-12. They are not customers' jobs."
  - "Scoop Dogg: reported by Ben Palaskas, AMTECH, October 2026 (scoopdogg.net)."
reviewed: {by: "Ben Palaskas", date: "2026-11-13"}
---
