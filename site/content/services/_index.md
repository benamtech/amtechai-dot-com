---
# /services, rebuilt 2026-11-08 (session `lena`) on layouts/landing.html: the three places most businesses start, on
# photographs with their documents, then all twenty-eight services by group (from data/services.json; each keeps its
# #anchor, which the structured data's ItemList points at). Ben: one style across the site, less clutter, more images.
title: "AI services: whole departments run by your AI team"
description: "Twenty-eight departments an AMTECH AI agent team runs end to end, from estimating to bookkeeping, each replacing a hire, an agency or software."
layout: "landing"
crumb: "Services"
names: {employee: "Your lead agent", t1: "Estimates", t2: "Sales", t3: "Marketing", t4: "Finance", t5: "Research", t6: "Builder"}
team: [employee, t1, t2, t3, t4, t5, t6]
h1a: "Every department,"
h1b: "run for you."
sub: "Estimating, marketing, bookkeeping, collections, bids, hiring: each one run end to end by a team of AI agents, in place of a hire, an agency or another subscription."
answer: "AMTECH's AI agent teams run whole departments of a small or mid-sized business: estimates and takeoffs, public bids, proposals, getting paid, bookkeeping, marketing, being found on Google and in AI answers, business development, documents, scheduling, the inbox and hiring. Twenty-eight services in all, each replacing a hire, an agency or software."
field: "Your business's name"
button: "Start"
start: {industry: ""}
prices: "Start free and pay as you go. Custom agents with guaranteed results from $1,200/mo."
hero_img: "img/hubs/services.png"
hero_alt: "A bright back office in the morning, company vans outside the windows"
panel:
  firm: "Your business"
  h: "Your departments"
  rows:
    - {who: t1, state: work}
    - {who: t3, state: work}
    - {who: t4, state: wait}
    - {who: t2, state: work}
    - {who: t5, state: idle}
  card_h: "This week: Your business"
  steps: ["Priced every estimate from your book", "Wrote the page customers ask ChatGPT for", "Sent every invoice the day the job was done"]
  now: "Chasing four late payments"
  total: "Three departments run, none hired."
systems: ["QuickBooks", "Jobber", "Gmail", "Google Business Profile", "Your website", "Stripe", "Shopify", "Procore"]
bands_h: "Where most businesses start."
bands:
  - who: t1
    img: "img/contractors/bids.png"
    alt: "Architectural drawings with highlighter marks on an estimating desk"
    h: "Estimates, from plans and photos."
    p: "Every plan set, photo and satellite view measured and priced from your own book the day it arrives, then sent and followed up."
    doc: {kind: estimate, title: "Estimate", meta: "From the plan set in Monday's bid invite", priced: "From your book", rows: [{item: "Roof area, measured at scale with pitch and waste", qty: "16.3", unit: "squares"}, {item: "Underlayment and ice shield in the valleys", unit: "squares"}, {item: "Ridge, hip and drip edge", unit: "linear feet"}], foot: "Anything the plans could not show is named, never guessed."}
  - who: t3
    img: "img/home/landscaping.png"
    alt: "A finished garden with ornamental grasses at sunset"
    h: "Found on Google and in AI answers."
    p: "Your site, your Google listing and the answers in ChatGPT worked every week, the way Scoop Dogg's employee took him to the top."
    doc: {kind: sheet, title: "Where you show up", meta: "Checked this morning", cols: ["Question", "Google", "ChatGPT"], rows: [["Service near me", "First", "First"], ["Best in your town", "Third", "Named"], ["How much does it cost", "Second", "Not yet"]], foot: "A new page is being written for the last one."}
  - who: t4
    img: "img/home/govern.png"
    alt: "A family business back office at dusk"
    h: "Invoices out and paid."
    p: "Every job invoiced the day it is done, every payment matched in your books, and every late one chased until it is paid."
    doc: {kind: invoice, title: "Invoice for the Elm Street job", meta: "From the finished job", to: "The customer, with your payment link", rows: [{item: "The work, line by line from the estimate", note: "Attached"}, {item: "Deposit already paid", note: "Taken off"}, {item: "Photos of the finished job", note: "Attached"}], due: "in 15 days", pay: "Pay now"}
service_groups_h: "All twenty-eight services."
service_groups_sub: "Each is a whole department your team runs. Start with one and hand over the next when the first is running."
service_groups: ["Estimates", "Public bids", "Proposals", "Getting paid", "Bookkeeping", "Marketing", "Being found", "Business development", "Documents", "Scheduling", "Inbox", "Hiring"]
offer_h: "Hand over your first department."
offer_p: "Name your business and your lead agent tells you which department to hand over first, then starts on it today."
options:
  - {h: "Start free", p: "Your first department on your real work, then pay as you go."}
  - {h: "Custom agents", p: "Set up with you, with guaranteed results, from $1,200 a month."}
questions_h: "Questions"
questions:
  - {q: "What exactly is a service?", a: "A whole department of your business, run end to end by the AI agents built for that work."}
  - {q: "Do I pay per service?", a: "No. Your team runs the departments you hand it; you start free and pay as you go for the work done."}
  - {q: "Can a service replace the software I pay for?", a: "Yes. Your agents plug into what you run on the first day and can take over that software's job, with a custom setup where you need one."}
  - {q: "What if my work is not on the list?", a: "Describe it. Your lead agent builds the team for the work your business actually has."}
ask_prompt: "Which AI services does AMTECH AI (amtechai.com) offer for small businesses?"
closing_h: "Name your business."
closing_sub: "Your lead agent reads your site and your Google listing, and tells you which department to hand over first."
site_sources: false
sources:
  - "The work shown on this page illustrates the AMTECH application; it is not a customer's job."
reviewed: {by: "Ben Palaskas", date: "2026-11-08"}
---
