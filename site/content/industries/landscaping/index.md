---
# /industries/landscaping, rebuilt 2026-11-08 (session `lena`) on layouts/landing.html. Ben: "landscaping and yard
# maintenance type contractors (more on the side of scoop dogg type businesses but also for larger landscaper
# operations)". So the page speaks to a one-truck yard care service and to a company with crews, routes and HOA
# contracts. Scoop Dogg is the proof (brain/proof.md). Still the free start with the landscaping setup. Every figure in
# a card illustrates the application. Photographs: gpt-image-2.5.
title: "AI agents for landscaping and yard care companies"
description: "A custom AI team for your lawn, landscaping or yard care company: every quote, route, renewal and invoice handled, and you first on Google and ChatGPT."
layout: "landing"
weight: 2
label: "Landscaping"
crumb: "Landscaping and yard care"
card_line: "Every route, renewal and invoice handled."
config: landscaping
names: {employee: "Your lead agent", t1: "Quotes", t2: "Customers", t3: "Being found", t4: "Billing", t5: "Bids", t6: "Builder"}
team: [employee, t1, t2, t3, t4, t5, t6]
h1a: "More yards."
h1b: "Less office work."
sub: "A custom AI team for your lawn, landscaping or yard care company: every quote sent, every route filled, every renewal signed and every invoice paid, while your crews are out working."
answer: "AMTECH builds custom teams of AI agents for landscaping, lawn care and yard care companies, from a one-truck service to a company with crews and HOA contracts. The agents quote new customers from the address, fill routes, sign up recurring service, renew agreements over winter, bid commercial and HOA work, send invoices and get the business named first on Google and in ChatGPT."
field: "Your company's name"
button: "Start free"
start: {industry: landscaping}
prices: "Start free and pay as you go. Custom agents with guaranteed results from $1,200/mo."
hero_img: "img/landscaping/hero.png"
hero_alt: "A crew mowing and edging a wide lawn in front of a large home in the morning"
panel:
  firm: "Your company"
  h: "Your team"
  rows:
    - {who: t1, state: work}
    - {who: t2, state: work}
    - {who: t3, state: wait}
    - {who: t4, state: work}
    - {who: t5, state: idle}
  card_h: "Before the crews roll: Your company"
  steps: ["Quoted 9 new yards from the address", "Moved Thursday's route ahead of the rain", "Sent 64 invoices for last week's visits"]
  now: "Signing up 3 new weekly customers"
  total: "Every route full through next Friday."
found: [{n: "9", what: "new quotes today"}, {n: "64", what: "invoices sent"}, {n: "212", what: "renewals signed"}]
offer_found: false
systems: ["Jobber", "LMN or Aspire", "QuickBooks", "Stripe", "Google Business Profile", "Your website", "Google Maps", "Gmail"]
frame_h: "One new customer, start to finish."
bands_h: "The office work behind every yard."
bands:
  - who: t1
    img: "img/landscaping/yard.png"
    alt: "A yard care worker cleaning a backyard lawn while a dog watches"
    h: "Recurring customers, signed up online."
    p: "Each quote priced from the address and your rates, and the customer booked onto a weekly route and paying by card."
    doc: {kind: sheet, title: "New this week", meta: "From your website and your Google listing", cols: ["Customer", "Service", "Status"], rows: [["Ridgeview Ct", "Weekly yard cleanup", "Paying by card"], ["Alder St", "Mowing and edging", "On Tuesday's route"], ["Mill Pond Rd", "Spring cleanup", "Quote sent"]], foot: "Prices from your book, never guessed."}
  - who: t5
    img: "img/landscaping/commercial.png"
    alt: "The landscaped entrance of a residential community, a crew truck at the side"
    h: "HOA and commercial bids, ready on time."
    p: "Bid documents read, sites measured from the aerial map and priced from your production rates before the deadline."
    doc: {kind: sheet, title: "Open bids", meta: "Your county, this week", cols: ["Property", "Work", "Status"], rows: [["Oak Hollow HOA", "Weekly mowing, 14 acres", "Priced"], ["Westgate office park", "Grounds and mulch", "Measuring"], ["City parks, north", "Seasonal contract", "Due Friday"]], foot: "What the map could not show is marked for a walk."}
  - who: t2
    img: "img/landscaping/design.png"
    alt: "A newly finished backyard patio and planting beds"
    h: "Every agreement renewed by spring."
    p: "Last season's customers written to over winter with next year's price and an upgrade, and followed until they sign."
    doc: {kind: report, title: "Renewals", meta: "Next season, so far", rows: [{label: "Signed", value: "212 agreements"}, {label: "With an upgrade", value: "58, mostly aeration"}, {label: "Waiting", value: "41, reminded on Monday"}, {label: "Lost", value: "6, each with the reason"}], foot: "Spring is booked before the first mow."}
  - who: t3
    img: "img/home/landscaping.png"
    alt: "A finished garden with ornamental grasses at sunset"
    h: "First on Google and in ChatGPT."
    p: "Your listing, reviews and pages worked every week until the answers name you for your service in your towns."
    doc: {kind: sheet, title: "Where you show up", meta: "Checked this morning", cols: ["Question", "Google", "ChatGPT"], rows: [["Yard cleanup near me", "First", "First"], ["Lawn mowing service", "Third", "Named"], ["Spring cleanup", "Second", "Not yet"]], foot: "A new page is being written for spring cleanup."}
orbit_h: "Your team, built around your company."
grid_h: "Every crew, every route, one screen."
grid:
  offices: ["North route", "South route", "HOA and commercial"]
  lamps: [[work, work, idle, work, idle], [work, idle, work, work, idle], [idle, work, wait, work, work]]
  legend: {work: "working", wait: "waiting on you", idle: "idle"}
proof: {h: "Scoop Dogg was the first business run by an AI employee.", p: "Pet waste cleanup and turf care across Ventura and Santa Barbara counties. His AI employee set up his new website and its online booking, then set up his automatic replies itself. He gets bookings every week, and he is first in ChatGPT and on Google for pet and yard cleanup in his area."}
offer_h: "Start with your next new customer."
offer_p: "Name your company and your team starts on your quotes and your listing today. When you want your routes, contracts and billing set up with you, with the results agreed up front, we build it together."
options:
  - {h: "Start free", p: "Your team on your real work, then pay as you go."}
  - {h: "Custom agents", p: "Set up with you, with guaranteed results, from $1,200 a month."}
approval: {who: t1, act: "Quote for 18 Ridgeview Court", to: "To the homeowner, from your email", preview: "Weekly yard cleanup, every Tuesday, paid by card."}
questions_h: "Questions"
questions:
  - {q: "I run one truck. Is this for me?", a: "Yes. A small yard care service gets the same team: quotes and bookings online, recurring payments, reviews, and being first on Google and in ChatGPT. Scoop Dogg runs this way."}
  - {q: "Does it work with Jobber or LMN?", a: "Yes. Your team works inside the software you run, so your crew leaders' mornings stay the same. It can also keep quotes, routes, visits and invoices itself when you would rather stop paying per seat."}
  - {q: "Can it measure a property without a site visit?", a: "Yes, for most bids. Quotes come from the aerial map of the address, and anything hidden under trees is marked for a walk before you price it."}
  - {q: "What does it do in winter?", a: "Winter is the busiest season: renewals go out, last year's lost bids are revisited, new homeowners in your area get a quote, and the books are ready for your accountant."}
  - {q: "What does it cost?", a: "Start free and pay as you go for the work done. Custom agents set up with you, with guaranteed results, start at $1,200 a month."}
ask_prompt: "What does AMTECH AI (amtechai.com) do for a landscaping or yard care company?"
closing_h: "Name your company."
closing_sub: "Your team reads your site and your Google listing, then starts on your next quote."
site_sources: false
sources:
  - "The customers, routes, bids and figures shown on this page illustrate the AMTECH application; they are not a customer's job."
  - "Scoop Dogg: reported by Ben Palaskas, AMTECH, 27 October 2026 (scoopdogg.net)."
reviewed: {by: "Ben Palaskas", date: "2026-11-08"}
frame:
  - who: t1
    ask: "Someone on Ridgeview Court asked for weekly yard cleanup through the website. Can you get them going?"
    reply: "Quotes priced it from the address and your rates, and Customers put them on Tuesday's route with card payments set up. The reply is ready."
    title: "New weekly customer on Ridgeview Court"
    steps: ["Read the request and measured the yard from the map", "Priced weekly cleanup from your rates", "Found room on Tuesday's route", "Waiting for your yes to send the quote and the sign-up link"]
    line: "Two dogs, noted for the crew"
    doc: {kind: email, title: "Reply to the homeowner", meta: "Written in your words, from your past replies", to: "The homeowner, from your website's form", subject: "Weekly yard cleanup on Ridgeview Court", body: ["Thanks for reaching out. We can start your weekly cleanup next Tuesday.", "The price and a link to sign up and pay by card are below. You can pause or cancel any time."]}
    trust: {assumed: "the backyard only, as the form says", checked: "the yard's size on the map against your rate sheet"}
    approve: {act: "Send to the homeowner"}
---
