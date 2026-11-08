---
# /real-estate, rebuilt 2026-11-08 (PAGE-10X.md, then PAGE-V3.md with research/R2-PAGES-AND-BUYERS.md behind it). Built
# from AMTECH's own parts: the characters (renamed for real estate in `names`), the Live Lines, the application frame,
# the documents, the Orbit and the 3D team, and the owner app's panel and office grid. The order is the argument: the
# work in progress, the app finishing a job, what the four engines find, the firm at the centre of its systems, every
# office, four promises, then one action. The lead is deal origination; answering every lead is the floor, never the
# pitch (Ben). $1,200 a month is the minimum retainer and the engagement is sized on the call. Every figure inside a
# card or document illustrates the application. Photographs: gpt-image-2.5 through AMTECH's gateway.
title: "AI operating teams for real estate firms | AMTECH"
description: "The sellers, expiring leases and off-market property in your market, read every morning and worked into a letter, valuation or offer before anyone else calls."
route: "/real-estate"
layout: "landing"
crumb: "Real estate"
okf_type: "Business Type"
llms: {order: 30, label: "Real estate", text: "AI operating teams for real estate firms: likely sellers, expiring leases, off-market deals and agent recruiting found every morning, plus listings, surveys and the firm's own software. Engagements from $1,200/mo."}
names: {employee: "Your operating team", t5: "Seller Finder", t1: "Lease Watch", t4: "Deal Sourcing", t2: "Recruiting", t3: "Listings", t6: "Builder"}
team: [employee, t5, t1, t4, t2, t3, t6]
h1a: "Find your next deals"
h1b: "before anyone else."
sub: "An AI team for your firm that finds the sellers, leases and off-market deals in your market every morning, and works each one."
field: "Firm and city"
button: "Get my Deal Map"
book: {industry: "Real estate", topic: "A Market Deal Map"}
prices: "Engagements from $1,200 a month. Your Map in seven days; one firm per market."
hero_img: "img/real-estate/hero-city.png"
hero_alt: "A glass office tower at blue hour, seen across a still city street"
panel:
  firm: "Your firm"
  h: "Your team"
  rows:
    - {who: t5, state: work}
    - {who: t1, state: work}
    - {who: t4, state: wait}
    - {who: t2, state: idle}
    - {who: t3, state: work}
  card_h: "Market Deal Map: Westlake Hills"
  steps: ["Found 1,842 owners likely to sell", "Checked deeds, permits and probate", "Wrote a letter and a valuation"]
  now: "Building 12 listing presentations"
  total: "$318,000 of commission found before 9am."
systems: ["Follow Up Boss", "MLS", "County records", "DocuSign", "Zillow", "Gmail", "QuickBooks", "Your website"]
orbit_h: "Your team, built around your firm."
bands_h: "Deals your competitors never see."
bands:
  - who: t5
    img: "img/real-estate/listings.png"
    alt: "A luxury living room above the city lights at dusk"
    h: "Sellers, before the sign goes up."
    p: "Equity, tenure, probate and permits read every morning, a presentation ready for each."
    doc: {kind: sheet, title: "Likely sellers this week", meta: "Westlake Hills, from county records", cols: ["Owner", "Why now", "Ready"], rows: [["R. Castillo", "Owned 22 years, high equity", "Letter, valuation"], ["The Nguyen trust", "Probate filed in March", "Personal note"], ["M. Fischer", "Listing expired Friday", "Presentation"]], foot: "100 owners ranked, twelve presentations built."}
  - who: t1
    img: "img/real-estate/surveys.png"
    alt: "An aerial view of a downtown office district in the morning"
    h: "Leases, worked 18 months out."
    p: "Tenants, headcount and funding tracked; the decision maker found; the survey built."
    doc: {kind: sheet, title: "Leases expiring in 18 months", meta: "Downtown office, 5,000 sq ft and up", cols: ["Tenant", "Space", "Status"], rows: [["Northwind Health", "12,400 sq ft", "Hiring fast"], ["Osprey Partners LLP", "8,900 sq ft", "Survey built"], ["Larkspur Labs", "6,200 sq ft", "Raised a round"]], foot: "Each with its decision maker and a pitch."}
  - who: t4
    img: "img/real-estate/sellers.png"
    alt: "A tired ranch house with an overgrown front lawn"
    h: "Off-market, inside your buy box."
    p: "Found and priced from comps and photos, with an offer range before anyone else calls."
    doc: {kind: sheet, title: "Off-market, inside your buy box", meta: "From tax, code and probate records", cols: ["Property", "Signal", "Status"], rows: [["2214 Alder St", "Tax delinquent", "Offer ready"], ["88 Mill Pond Rd", "Code violation", "Offer ready"], ["410 Cedar Ln", "Probate", "Needs photos"]], foot: "Repairs estimated from photos and satellite."}
  - who: t2
    img: "img/real-estate/recruiting.png"
    alt: "A brokerage office at dusk above the city"
    h: "The producers your rivals rely on."
    p: "Agents ranked by closed volume from public records, each with an offer written."
    doc: {kind: sheet, title: "Producers worth a call", meta: "Your market, last 12 months", cols: ["Agent", "Closed", "Next"], rows: [["J. Alvarez", "41 sides", "Coffee invite"], ["S. Patel", "33 sides", "Custom offer"], ["K. Brennan", "29 sides", "Follow up in May"]], foot: "From public sales records."}
frame:
  - who: t5
    ask: "Get me the owners in Westlake Hills most likely to sell."
    reply: "On it. 100 owners ranked, and a presentation built for the top twelve."
    title: "Listing presentation for R. Castillo"
    steps: ["Read the county records and ten years of sales", "Valued the house against the closest sales", "Wrote the presentation in your brand", "Booking the walkthrough for Thursday"]
    line: "Owned 22 years. Kitchen remodeled in 2019."
    doc: {kind: page, title: "Your home on Ridgeview Court", meta: "A private page for the owner", url: "yourfirm.com/for/castillo", h: "What your home is worth this spring.", p: "Three homes on your street sold this year. Here is what yours would likely bring, and how we would sell it.", button: "Book a walkthrough", rows: ["What would we list it for?", "How long would it take?", "What would we fix first?"]}
    trust: {assumed: "the 2019 remodel, from the permit", checked: "every sale on the street since 2016"}
    approve: {act: "Send the letter"}
frame_h: "One owner, start to finish."
grid_h: "Every office, every deal, one screen."
grid:
  offices: ["Downtown", "Westside", "Commercial"]
  lamps: [[work, work, idle, wait, work], [work, idle, work, work, idle], [idle, work, work, idle, wait]]
  legend: {work: "working", wait: "waiting on you", idle: "idle"}
offer_h: "Start with your Market Deal Map."
offer_p: "In seven days: the deals you are not working, a presentation for a real owner, and one appointment set. Credited when you start."
options:
  - {h: "Desk", p: "One engine, one office."}
  - {h: "Growth Team", p: "Deal finding and the full team for one market."}
  - {h: "Firm Operating System", p: "Every office, recruiting and your own software."}
guarantee: "Your agreed pipeline in 90 days, or we work free."
found: [{n: "38", what: "deals found this week"}, {n: "126", what: "letters in your voice"}, {n: "9", what: "appointments booked"}]
approval: {who: t5, act: "Listing presentation for R. Castillo", to: "Sent this morning", preview: "Three homes on your street sold this year."}
questions_h: "Questions"
questions:
  - {q: "What does it cost?", a: "Engagements start at $1,200 a month. What you pay depends on how many offices and markets you hand over; you will have the number with your Map."}
  - {q: "How is this different from the AI tools we pay for?", a: "Those answer what arrives; your team finds the deals first, with the reason."}
  - {q: "Will it work with our systems?", a: "Yes. Inside your CRM, email, phone and calendar, and builds what is missing."}
  - {q: "How fast is it live?", a: "Live within 14 days of your Map, or your first month is free."}
closing_h: "Your next deals are already out there."
closing_sub: "Type your firm's name; your Map is seven days away."
site_sources: false
sources:
  - "The work shown on this page (owners, tenants, properties, agents, streets, counts and commission estimates) illustrates the AMTECH application; it is not a customer's job."
  - "The photographs on this page were made for it with an image model; they show no real client, agent or property."
reviewed: {by: "Ben Palaskas", date: "2026-11-08"}
---
