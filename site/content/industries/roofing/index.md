---
# /industries/roofing, rebuilt 2026-11-08 (lane `roofpaint`) on layouts/landing.html. Keeps the old page's facts, systems and
# best documents (estimate, supplement, storm streets, progress invoice). The action is the free start with the roofing
# setup. Every figure in a card illustrates the application. Photographs: gpt-image-2.5.
title: "AI agents for roofing companies: estimates, claims and deposits"
description: "A custom AI team for your roofing company: every roof measured and priced, every claim supplemented, every quote followed to a yes and every deposit collected."
layout: "landing"
weight: 1
label: "Roofing"
crumb: "Roofing"
card_line: "Every roof priced and every quote followed to a yes."
config: roofing
names: {employee: "Your lead agent", t1: "Estimates", t5: "Claims", t4: "Deposits"}
team: [employee, t1, t5, t2, t4, t6]
h1a: "Every roof priced."
h1b: "Every quote won."
sub: "A custom AI team for your roofing company that measures each roof from the plans or the drone photos, prices it from your book, writes the insurance supplement, follows every quote to a yes and collects the deposit."
answer: "AMTECH builds a team of AI agents for roofing companies that does the work of an estimator, a claims desk, a follow-up desk and a collections clerk: roofs measured from plan sets, drone photos or an EagleView report and priced from the company's book, supplements written for the items an adjuster's scope missed, storm-street letters after hail, every quote followed to a yes, and deposits and progress invoices collected. It works inside AccuLynx, JobNimbus, CompanyCam and QuickBooks, or can keep the records itself."
field: "Your roofing company's name"
button: "Start free"
start: {industry: roofing}
prices: "Start free and pay as you go. Custom agents with guaranteed results from $1,200/mo."
hero_img: "img/roofing/roof-hero.png"
hero_alt: "A roofing crew laying shingles on a large suburban home in early morning light"
panel:
  firm: "Your roofing company"
  h: "Your team"
  rows:
    - {who: t1, state: work}
    - {who: t5, state: work}
    - {who: t2, state: work}
    - {who: t4, state: wait}
    - {who: t6, state: idle}
  card_h: "Estimate: Mill Pond Road re-roof"
  steps: ["Measured every plane from the plan set", "Priced 16.3 squares from your book", "Flagged the chimney flashing for a look"]
  now: "Following up 11 open quotes"
  total: "Estimate ready before the homeowner calls back."
found: [{n: "9", what: "roofs priced today"}, {n: "11", what: "quotes followed up"}, {n: "3", what: "deposits requested"}]
offer_found: false
systems: ["AccuLynx or JobNimbus", "EagleView", "CompanyCam", "Xactimate", "QuickBooks", "Gmail", "Google Business Profile", "Your website's forms"]
frame_h: "One roof, start to finish."
bands_h: "The paperwork behind every roof."
bands:
  - who: t1
    img: "img/roofing/roof-estimate.png"
    alt: "A roofing plan set, a scale ruler and a tablet showing an aerial photo of a house on a desk at night"
    h: "Every roof measured and priced by morning."
    p: "Each plane measured from the plan set, the drone photos or the satellite image, with pitch and waste added and every line priced from your book."
    doc: {kind: estimate, title: "Roof replacement estimate", meta: "From the plan set in Tuesday's email", priced: "From your book", rows: [{item: "Roof area, measured at scale with pitch and waste", qty: "16.3", unit: "squares"}, {item: "Tear-off and disposal, one layer", unit: "squares"}, {item: "Ice and water shield in the valleys", unit: "squares"}, {item: "Ridge vent, hip and ridge cap", unit: "linear feet"}, {item: "Chimney flashing the plans do not detail", unit: "each"}], foot: "Checked against the plan's scale bar. The chimney is flagged for a look on site."}
  - who: t5
    img: "img/roofing/roof-claim.png"
    alt: "A roofer on a ladder photographing hail damage on shingles at the eave"
    h: "Insurance supplements, followed to payment."
    p: "The adjuster's scope laid beside your measurements and photos, a supplement written for every item it missed, and the claim followed until the carrier answers each line."
    doc: {kind: email, title: "Supplement request", meta: "Written from the scope, your measurements and the inspection photos", to: "The adjuster on the claim", subject: "Supplement: items missing from the scope", body: ["Set against our measurements and the inspection photos, the scope leaves out the items below.", "Drip edge along every eave and rake. Ice and water shield in both valleys. Starter course at the eaves.", "The photo and the measurement for each item are attached. Please send the revised scope when it is ready."], foot: "Each item carries its photo and its measurement."}
  - who: t2
    img: "img/roofing/roof-storm.png"
    alt: "A quiet suburban street the morning after hail, with ice scattered on the lawns"
    h: "First to the streets the storm hit."
    p: "The morning after hail or wind, the streets it hit in your service area listed and a letter to each homeowner offering an inspection."
    doc: {kind: sheet, title: "Streets hit by last night's hail", meta: "Inside your service area, from the storm reports", cols: ["Street", "Storm report", "Letter"], rows: [["Oak Hollow Drive", "Hail", "Written"], ["Ridgeview Court", "Hail", "Written"], ["Mill Pond Road", "Wind", "Written"], ["Cedar Lane", "Hail", "A past customer: a personal note"]], foot: "Streets from the storm reports; past customers from your own records."}
  - who: t4
    img: "img/roofing/roof-deposit.png"
    alt: "A finished roof with dark architectural shingles on a two-storey home, a couple on the lawn"
    h: "The deposit asked for the day you win."
    p: "The deposit request the day a contract is signed, then the progress and final invoices, chased until the money is in and matched in QuickBooks."
    doc: {kind: invoice, title: "Progress invoice", meta: "Roof replacement, tear-off finished", to: "The homeowner", rows: [{item: "Deposit, on signing", note: "Paid"}, {item: "Progress payment, at tear-off", note: "Due now"}, {item: "Final payment, at the walk-through", note: "Later"}], due: "on receipt", pay: "Pay online", foot: "Amounts from the signed contract. Paid by card or bank transfer."}
orbit_h: "Your team, built around your company."
grid_h: "Every crew, every job, one screen."
grid:
  offices: ["Re-roofs", "Repairs and leaks", "Storm and claim work"]
  lamps: [[work, work, idle, work, idle], [idle, work, work, wait, idle], [work, work, wait, work, work]]
  legend: {work: "working", wait: "waiting on you", idle: "idle"}
proof: {h: "The first business run by an AI employee works outdoors, like your crews.", p: "Scoop Dogg cleans up pet waste and cares for turf across Ventura and Santa Barbara counties, so his leads come in while he is on a job. His AI employee set up his new website and its online booking, then set up his automatic replies itself. He gets bookings every week, and he is first in ChatGPT and on Google for pet and yard cleanup in his area."}
offer_h: "Start with your next estimate."
offer_p: "Name your roofing company and your team starts on the plan set waiting in your inbox. When you want your supplement process or storm routine set up with you, with the results agreed up front, we build it together."
options:
  - {h: "Start free", p: "Your team on your next roof, then pay as you go."}
  - {h: "Custom agents", p: "Set up with you, with guaranteed results, from $1,200 a month."}
approval: {who: t4, act: "Deposit request for the Oak Hollow roof", to: "To the homeowner, from the signed contract", preview: "Thank you for choosing us for your new roof. Here is the deposit from your signed contract, with a link to pay by card or bank transfer."}
questions_h: "Questions"
questions:
  - {q: "Can it do the estimator's job?", a: "Yes. Estimates measures and prices every roof you are asked to bid from the plan set, the drone photos or an EagleView report, and names whatever the pictures could not show."}
  - {q: "Does it replace AccuLynx or JobNimbus?", a: "It can. Your team starts inside the one you run, so nothing changes for your crews on day one. When you would rather stop paying for it, your team keeps the estimates, photos, job notes and customer files itself."}
  - {q: "Can it work insurance claims?", a: "Yes. It compares the adjuster's scope with your measurements and photos, writes the supplement for every item the scope missed, and follows the claim until the carrier answers each line."}
  - {q: "What happens in a slow month?", a: "Your team goes back through the quotes that went quiet and the past customers whose roofs are due for a look, and writes to each one, so the slow month fills with work you already earned once."}
  - {q: "What does it cost?", a: "Start free and pay as you go for the work done. Custom agents set up with you, with guaranteed results, start at $1,200 a month."}
ask_prompt: "What does AMTECH AI (amtechai.com) do for a roofing company?"
closing_h: "Name your roofing company."
closing_sub: "Your team reads your site and your Google listing, then prices the first roof while you watch."
site_sources: false
sources:
  - "The roofs, claims, streets, invoices and counts shown on this page illustrate the AMTECH application; they are not a customer's job."
  - "Scoop Dogg: reported by Ben Palaskas, AMTECH, 27 October 2026 (scoopdogg.net)."
  - "The photographs on this page were made for it with an image model; they show no real client, job or building."
reviewed: {by: "Ben Palaskas", date: "2026-11-08"}
frame:
  - who: t1
    ask: "Tuesday's email has a plan set for a re-roof on Mill Pond Road. Can you price it?"
    reply: "Estimates is on it. Every plane is measured at scale and priced from your book, and the chimney flashing is flagged because the plans do not detail it."
    title: "Estimate for the Mill Pond Road plan set"
    steps: ["Read the plan set and the homeowner's email", "Measured each roof plane at scale, with pitch and waste", "Priced every line from your book", "Estimate ready to send to the homeowner"]
    line: "Flagged the chimney flashing for a look on site"
    doc: {kind: estimate, title: "Roof replacement estimate", meta: "Mill Pond Road, from the plan set in Tuesday's email", priced: "From your book", rows: [{item: "Roof area, measured at scale with pitch and waste", qty: "16.3", unit: "squares"}, {item: "Tear-off and disposal, one layer", unit: "squares"}, {item: "Synthetic underlayment, ice and water shield", unit: "squares"}, {item: "Ridge vent, hip and ridge cap", unit: "linear feet"}, {item: "Chimney flashing the plans do not detail", unit: "each"}]}
    trust: {assumed: "one layer to tear off, as the homeowner's email says", checked: "every plane against the plan's scale bar"}
    approve: {act: "Send to the homeowner"}
---
