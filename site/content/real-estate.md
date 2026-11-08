---
# /real-estate, rebuilt 2026-11-08 (plans/2026-11-08-REAL-ESTATE/PAGE-10X.md and OFFER.md v2). Built from AMTECH's own
# parts: the characters (renamed for real estate in `names`), the Orbit and the 3D team, the application frame, the
# documents, and the owner app's team panel and Agents grid. 350 visible words at most. The lead is deal origination;
# answering leads is standard, never the pitch (Ben). $1,200 a month is the minimum retainer, the engagement is sized
# on the call. Every card and document illustrates the application. Photographs: gpt-image-2.5 through AMTECH's gateway.
title: "AI operating teams for real estate firms | AMTECH"
description: "AMTECH builds real estate firms an AI team that finds their next deals first: likely sellers, expiring leases, off-market deals and top producers."
route: "/real-estate"
layout: "landing"
crumb: "Real estate"
okf_type: "Business Type"
llms: {order: 30, label: "Real estate", text: "AI operating teams for real estate firms: likely sellers, expiring leases, off-market deals and agent recruiting found every morning, plus listings, surveys and the firm's own software. Engagements from $1,200/mo."}
names: {employee: "Your operating team", t5: "Seller Finder", t1: "Lease Watch", t4: "Deal Sourcing", t2: "Recruiting", t3: "Listings", t6: "Builder"}
team: [employee, t5, t1, t4, t2, t3, t6]
h1a: "Find your next deals"
h1b: "before anyone else."
sub: "AMTECH builds your real estate firm an AI team that finds likely sellers, expiring leases, off-market deals and top producers every morning, and works each one."
field: "Your firm's name"
button: "Get my Market Deal Map"
book: {industry: "Real estate", topic: "A Market Deal Map"}
prices: "Engagements from $1,200 a month. One firm per market."
hero_img: "img/real-estate/hero2.png"
hero_alt: "An office tower and a luxury house on a hillside at golden hour"
panel:
  firm: "Your firm"
  h: "Agents"
  rows:
    - {who: t5, state: work}
    - {who: t1, state: work}
    - {who: t4, state: wait}
    - {who: t2, state: idle}
    - {who: t3, state: work}
  card_h: "Market Deal Map: Westlake Hills"
  steps: ["Read 4,212 county records", "Ranked owners by likelihood to sell", "Wrote a letter and a valuation for each"]
  now: "Building 12 listing presentations"
live:
  - {who: t1, title: "Lease expiring at Harbor Point, floor 6", step: "Decision maker found"}
  - {who: t4, title: "Off-market triplex on Alder Street", step: "Offer range ready for your yes"}
systems: ["Follow Up Boss", "MLS", "County records", "DocuSign", "Zillow", "Gmail", "QuickBooks", "Your website"]
orbit_h: "Your team, built around your firm."
bands_h: "Deals your competitors never see."
bands:
  - who: t5
    img: "img/real-estate/listings.png"
    alt: "A luxury living room above the city lights at dusk"
    h: "Every likely seller, found before they list."
    p: "Equity, tenure, probate, permits, expired listings: read every morning, with a presentation ready for each owner."
    doc: {kind: sheet, title: "Likely sellers this week", meta: "Westlake Hills, from county records", cols: ["Owner", "Why now", "Ready"], rows: [["R. Castillo", "Owned 22 years, high equity", "Letter and valuation"], ["The Nguyen trust", "Probate filed in March", "Personal note"], ["M. Fischer", "Listing expired Friday", "Presentation"], ["D. Okafor", "Remodel permit closed", "Letter and valuation"]], foot: "100 owners ranked. 12 presentations built."}
  - who: t1
    img: "img/real-estate/surveys.png"
    alt: "An aerial view of a downtown office district in the morning"
    h: "Every expiring lease, worked 18 months early."
    p: "Tenants, headcount and funding tracked, the decision maker found, the survey already built."
    doc: {kind: sheet, title: "Leases expiring in 18 months", meta: "Downtown office, 5,000 sq ft and up", cols: ["Tenant", "Space", "Status"], rows: [["Northwind Health", "12,400 sq ft", "Hiring fast"], ["Osprey Partners LLP", "8,900 sq ft", "Survey built"], ["Larkspur Labs", "6,200 sq ft", "Raised a round"]], foot: "Each with its decision maker and a pitch."}
  - who: t4
    img: "img/real-estate/sellers.png"
    alt: "A tired ranch house with an overgrown front lawn"
    h: "Every off-market deal in your buy box."
    p: "Found, priced from comps and photos, and an offer range ready before the owner has called anyone."
    doc: {kind: sheet, title: "Off-market, inside your buy box", meta: "From tax, code and probate records", cols: ["Property", "Signal", "Offer range"], rows: [["2214 Alder St", "Tax delinquent", "Ready"], ["88 Mill Pond Rd", "Code violation", "Ready"], ["410 Cedar Ln", "Probate", "Needs photos"]], foot: "Repairs estimated from listing photos and satellite."}
  - who: t2
    img: "img/real-estate/recruiting.png"
    alt: "A brokerage office at dusk above the city"
    h: "Every top producer in your market, courted."
    p: "Agents ranked by closed volume from public records, each with an offer written for them."
    doc: {kind: sheet, title: "Producers worth a call", meta: "Your market, last 12 months", cols: ["Agent", "Closed", "Next"], rows: [["J. Alvarez", "41 sides", "Coffee invite"], ["S. Patel", "33 sides", "Custom offer"], ["K. Brennan", "29 sides", "Follow up in May"]], foot: "From public sales records."}
frame:
  - who: t5
    ask: "Get me the owners in Westlake Hills most likely to sell this spring."
    reply: "Seller Finder is on it. 100 owners ranked, and a presentation built for the top twelve."
    title: "Listing presentation for R. Castillo"
    steps: ["Read the county records and the last ten years of sales", "Valued the house from the closest sales", "Wrote the presentation in your brand", "Waiting for your yes to send the letter"]
    line: "Owned 22 years. The kitchen was remodelled in 2019."
    doc: {kind: page, title: "Your home on Ridgeview Court", meta: "A private page for the owner", url: "yourfirm.com/for/castillo", h: "What your home is worth this spring.", p: "Three homes on your street sold this year. Here is what yours would likely bring, and how we would sell it.", button: "Book a walkthrough", rows: ["What would we list it for?", "How long would it take?", "What would we fix first?"]}
    trust: {assumed: "the 2019 remodel, from the permit", checked: "every sale on the street since 2016"}
    approve: {act: "Send the letter"}
frame_h: "One owner, start to finish."
grid_h: "Every office, every deal, one screen."
grid:
  offices: ["Downtown", "Westside", "Commercial"]
  lamps: [[work, work, idle, wait, work], [work, idle, work, work, idle], [idle, work, work, idle, wait]]
  legend: {work: "working", wait: "waiting on you", idle: "idle"}
lines_h: "What changes."
lines:
  - "Your best broker's standard on every deal."
  - "Every lead worked, every hour."
  - "New markets without new overhead."
  - "Software built for your firm, owned by you."
offer_h: "Start with your Market Deal Map."
offer_p: "In seven days: the deals in your market you are not working, and one finished presentation for a real prospect. Credited in full when you start."
options:
  - {h: "Desk", p: "One engine, one office."}
  - {h: "Growth Team", p: "Deal finding and the full operating team for your market."}
  - {h: "Firm Operating System", p: "Every office, recruiting and your own software."}
guarantee: "Your agreed pipeline in 90 days, or we keep working free."
questions_h: "Questions"
questions:
  - {q: "What does it cost?", a: "Engagements start at $1,200 a month. Most firms choose the Growth Team; you get the number with your Market Deal Map."}
  - {q: "Where does the data come from?", a: "County records, permits, court filings, your MLS access and paid property data, checked per market before we promise a number."}
  - {q: "Will it work with our systems?", a: "Yes. Your team works inside your CRM, email, phones and calendars, and builds any connection that is missing."}
  - {q: "How fast is it live?", a: "Within 14 days of your Market Deal Map, or the setup fee comes back."}
closing_h: "Your next deals are already out there."
closing_sub: "Your Market Deal Map shows you where."
site_sources: false
sources:
  - "The work shown on this page (owners, tenants, properties, agents, streets and counts) illustrates the AMTECH application; it is not a customer's job."
  - "The photographs on this page were made for it with an image model; they show no real client, agent or property."
reviewed: {by: "Ben Palaskas", date: "2026-11-08"}
---
