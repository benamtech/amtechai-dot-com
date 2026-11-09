---
# /services/estimates-from-plans-and-photos, rebuilt 2026-11-08 (lane `services`, lead `lena`) on layouts/landing.html.
# One department of work (estimating) shown across the trades that use it: plan sets, drone roofs, walk-through
# photos, bare addresses and supplier prices. Facts and documents are the page's own from 2026-10-27. Every figure
# in a card illustrates the application. Photographs: gpt-image-2.5 through AMTECH's gateway, and the site's own.
title: "Estimates from plans and photos: an AI estimator that prices from your own book"
description: "An AMTECH agent team measures every plan set, photo and address, prices each line from your own book, sends the estimate and follows it up until a yes."
layout: "landing"
crumb: "Estimating"
h1a: "Every job measured."
h1b: "Priced by morning."
sub: "An AI estimating team that measures every plan set, drone photo and address that comes in, prices each line from your own price book, and follows each estimate up until the customer says yes or no."
answer: "AMTECH runs a trade contractor's estimating end to end in place of a salaried estimator, an outsourced takeoff service and estimating software. The Takeoffs agent measures plan sets, EagleView reports, drone and CompanyCam photos and satellite imagery of an address, naming the sheet or picture behind every quantity. It prices from the contractor's own price book, Research finds supplier prices and the addenda, and Follow-up chases each estimate. It works inside Jobber, JobNimbus, Housecall Pro, BuildingConnected or Procore."
field: "Your company's name"
button: "Start free"
start: {config: estimates-from-plans-and-photos}
prices: "Start free and pay as you go. Custom agents with guaranteed results from $1,200/mo."
hero_img: "img/services/svc-est-hero.png"
hero_alt: "A contractor's estimating desk in the early morning with rolled plan sets and a tablet showing a roof photo"
names: {employee: "Your lead agent"}
team: [employee, t1, t5, t2, t4, t6]
panel:
  firm: "Your company"
  h: "Your team"
  rows:
    - {who: t1, state: work}
    - {who: t5, state: work}
    - {who: t2, state: wait}
    - {who: t4, state: idle}
    - {who: t6, state: idle}
  card_h: "Estimate: Your company"
  steps: ["Measured 31 sheets by trade", "Read both addenda", "Priced every line from your book"]
  now: "Writing the note that goes with it"
  total: "Priced and waiting for you at 6 a.m."
found: [{n: "6", what: "plan sets measured overnight"}, {n: "11", what: "estimates priced"}, {n: "4", what: "followed up today"}]
offer_found: false
systems: ["Jobber", "CompanyCam", "EagleView", "BuildingConnected", "Procore", "QuickBooks", "Dropbox", "Gmail"]
frame_h: "One plan set, start to finish."
bands_h: "The estimate, whatever you are given."
bands:
  - who: t1
    img: "img/services/svc-est-roof.png"
    alt: "A drone view of a house roof with grey shingles and two chimneys"
    h: "Roofs priced from the air."
    p: "Roof planes, pitch and waste read from an EagleView report or drone photos, and priced by the square from your book."
    doc: {kind: estimate, title: "Roof replacement", meta: "From the EagleView report and the drone photos", priced: "From your book", rows: [{item: "Tear-off and haul away, two layers", unit: "squares"}, {item: "Architectural shingles, with starter and ridge", unit: "squares"}, {item: "Ice and water shield at eaves and valleys", unit: "linear feet"}, {item: "Chimney flashing, two chimneys", unit: "each"}], foot: "Waste is set from the number of hips and valleys."}
  - who: t1
    img: "img/landscaping/design.png"
    alt: "A newly finished backyard patio with planting beds"
    h: "A price from the address alone."
    p: "Lawns, beds and walks measured from satellite imagery, so the homeowner has a price today and your crew visits only to confirm."
    doc: {kind: estimate, title: "Front yard renovation", meta: "Linden Avenue, measured from satellite imagery", priced: "From your book", rows: [{item: "Old turf removed and hauled away", unit: "square feet"}, {item: "New sod, laid and rolled", unit: "square feet"}, {item: "Planting beds, soil and mulch", unit: "square feet"}, {item: "Side yard, hidden by trees", unit: "check on site"}], foot: "What the trees hide is marked for a look on site."}
  - who: t5
    img: "img/services/svc-est-supply.png"
    alt: "A building supply yard with stacked lumber and pallets of shingles"
    h: "Open estimates, re-priced when supplies move."
    p: "Every estimate still waiting on an answer checked against this month's supplier prices, with a short note ready for each customer."
    doc: {kind: sheet, title: "Open estimates, re-priced", meta: "Supplier prices as of this Monday", cols: ["Estimate", "Sent", "What moved", "Now"], rows: [["Oak Street repaint", "2 weeks ago", "Exterior paint", "Re-priced"], ["Bayview deck", "Last week", "Deck boards", "Re-priced"], ["Cedar Lane roof", "Last week", "Nothing", "Price holds"], ["Main Street storefront", "10 days ago", "Lumber", "Re-priced"]], foot: "Each price is checked against the supplier's own list."}
  - who: t2
    img: "img/home/painting.png"
    alt: "A painter on a ladder painting the exterior of a green house at sunset"
    h: "Followed up until a yes or a no."
    p: "Walk-through photos priced, the estimate sent, and the customer written to on the days you choose until they answer."
    doc: {kind: email, title: "Follow-up on the Oak Street repaint", meta: "Third day, in your words", to: "The homeowner, from your inbox", subject: "Your estimate for the Oak Street repaint", body: ["Hello again. Your estimate for the Oak Street repaint is below, with the price held through Friday.", "If you would like the trim done in a different colour, tell me and I will update the price today.", "A yes, and we put you on the schedule."]}
orbit_h: "Your estimating team, built around your company."
grid_h: "Every trade, every estimate, one screen."
grid:
  offices: ["Roofing", "Painting", "General contracting"]
  lamps: [[work, work, idle, idle, idle], [work, idle, wait, idle, idle], [work, work, work, idle, idle]]
  legend: {work: "working", wait: "waiting on you", idle: "idle"}
offer_h: "Start with the plan set in your inbox."
offer_p: "Name your company and your team measures and prices the next job today. When you want your price book, your trade and your bid list set up with you, with the results agreed up front, we build it together."
options:
  - {h: "Start free", p: "Your team on your next estimate, then pay as you go."}
  - {h: "Custom agents", p: "Set up with you, with guaranteed results, from $1,200 a month."}
approval: {who: t1, act: "Bid for the Harbor Street fit-out", to: "To the general contractor", preview: "Our scope, measured from sheets A-101 to A-401 with addendum 2. Every quantity names its sheet. Any sheet with no scale is marked."}
questions_h: "Questions"
questions:
  - {q: "How accurate are the measurements?", a: "As accurate as the drawing or the photo allows. Takeoffs states the scale it measured at on every estimate and marks any line it could not measure, so you check those and nothing else."}
  - {q: "Can it replace my estimating software?", a: "Yes. It plugs into Jobber or the estimating tool you run today on the first day, and it does the estimator's whole job itself: measuring, pricing, writing and following up. Keep the tool if your crew likes it, or let your team do that job too."}
  - {q: "What does it need from me on day one?", a: "Your business's name, a few past estimates and the invoices that followed. Your team builds your price book from those and asks you only about what does not match."}
  - {q: "Can it handle a large commercial plan set?", a: "Yes. Takeoffs works through the set sheet by sheet, splits the scope by trade, and tells you which sheets it measured and which it left for you."}
  - {q: "Is there a charge for each estimate?", a: "You start free, then pay as you go for the work done. You see every piece of work and what it cost. Custom agents set up with you, with guaranteed results, start at $1,200 a month."}
ask_prompt: "Can AMTECH AI (amtechai.com) measure and price my estimates from plans and photos?"
closing_h: "Name your company, and send the first plan set."
closing_sub: "Your team reads your site and your Google listing, then measures and prices the first job while you watch."
site_sources: false
sources:
  - "The plan sets, photos, prices and counts shown on this page illustrate the AMTECH application; they are not a customer's job."
  - "The photographs on this page were made for it with an image model, or are the site's own; they show no real client, job or building."
reviewed: {by: "Ben Palaskas", date: "2026-11-08"}
frame:
  - who: t1
    ask: "Price our scope on the Harbor Street office fit-out. The plans came in the bid invite this morning."
    reply: "Takeoffs measured our scope sheet by sheet and priced it from your book. Research read both addenda. The second one lowers the break-room ceiling, and the bid follows it."
    title: "Bid for the Harbor Street office fit-out"
    steps: ["Read the bid invite, the plan set and both addenda", "Measured walls, ceilings and doors, sheet by sheet", "Priced every line from your book", "Waiting for your yes to send the bid"]
    line: "Named the sheets with no scale, for you to check"
    doc:
      kind: estimate
      title: "Bid: interior fit-out, our scope"
      meta: "Harbor Street, sheets A-101 to A-401 and addendum 2"
      priced: "From your book"
      rows:
        - {item: "Metal stud walls, framed and hung", unit: "linear feet"}
        - {item: "Drywall, taped and finished", unit: "square feet"}
        - {item: "Ceiling grid and tile", unit: "square feet"}
        - {item: "Hollow metal door frames", unit: "each"}
        - {item: "Paint, walls and frames, two coats", unit: "square feet"}
      foot: "Every quantity names the sheet it came from."
    trust: {assumed: "the wall finish the spec book asks for", checked: "the break-room ceiling against addendum 2"}
    approve: {act: "Send the bid to the general contractor"}
---
