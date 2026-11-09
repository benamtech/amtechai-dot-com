---
# /industries/hospitality, rebuilt 2026-11-08 (lane `hosptrans`, lead `lena`) on layouts/landing.html, the /industries/contractors
# pattern. Facts, systems, team names and documents are the 2026-10-27 page's (workday and frame). Every figure inside a
# card illustrates the application. Photographs: gpt-image-2.5 through AMTECH's gateway.
title: "AI agents for restaurant groups: food cost, events, reviews"
description: "An AMTECH agent team reads every location's sales and invoices before six, books your events, answers your reviews and keeps each listing right."
layout: "landing"
weight: 5
label: "Hospitality and restaurants"
crumb: "Restaurants and hospitality"
card_line: "Every location's numbers, bookings and reviews, run for you."
config: hospitality
names: {employee: "Your lead agent", t5: "Food cost", t2: "Events", t3: "Being found", t4: "Books", t6: "Builder"}
team: [employee, t5, t2, t3, t6, t4]
h1a: "Know every number"
h1b: "before you open."
sub: "An AI team for your restaurant group that reads last night's sales from Toast or Square, matches them to the week's invoices, and has food cost, labour and what moved on your phone at six, while it books the events, answers the reviews and hires the next line cook."
answer: "AMTECH gives a restaurant or hospitality group a team of AI agents that runs the back office of every location: last night's sales from Toast or Square matched to Sysco, US Foods and produce invoices, recipe costs kept current, private dining and catering inquiries booked with a deposit, Google and Yelp reviews answered in the house voice, hours and menus kept right on every listing, and hiring done. A group is held as one organisation with each location its own business."
field: "Your restaurant group's name"
button: "Start free"
start: {industry: hospitality}
prices: "Start free and pay as you go. Custom agents with guaranteed results from $1,200/mo."
hero_img: "img/hospitality/hosp-hero.png"
hero_alt: "A restaurant dining room before opening, tables set in warm morning light"
panel:
  firm: "Your restaurant group"
  h: "Your team"
  rows:
    - {who: t5, state: work}
    - {who: t2, state: work}
    - {who: t3, state: wait}
    - {who: t6, state: idle}
    - {who: t4, state: work}
  card_h: "Tuesday's recap: Your restaurant group"
  steps: ["Read last night's sales at three locations", "Matched this week's produce invoices", "Found the avocado price behind the second location"]
  now: "Writing the recap for the three managers"
  total: "On your phone by six."
found: [{n: "3", what: "locations read this morning"}, {n: "4", what: "reviews answered"}, {n: "2", what: "events booked"}]
offer_found: false
systems: ["Toast", "Square", "7shifts", "OpenTable", "Resy", "Tripleseat", "MarginEdge", "QuickBooks"]
frame_h: "One morning recap, start to finish."
bands_h: "The back office of every location, done."
bands:
  - who: t5
    img: "img/hospitality/hosp-numbers.png"
    alt: "A restaurant bar counter early in the morning with a laptop and a coffee, the empty dining room behind"
    h: "The morning numbers, for every location."
    p: "Before six, each location's sales, food cost and labour read and set against the same night last week, with what moved and why."
    doc: {kind: report, title: "This morning's numbers", meta: "Last night, every location, against the same night last week", rows: [{label: "Sales by location", value: "Up downtown, flat at the other two"}, {label: "Food cost", value: "Up at the second location: produce prices"}, {label: "Labour", value: "Over the schedule at lunch, downtown"}, {label: "What to look at first", value: "The new case price on avocados"}], foot: "Each manager reads their own location's page."}
  - who: t5
    img: "img/hospitality/hosp-invoices.png"
    alt: "Crates of produce and dairy stacked at a restaurant's back door on a hand truck"
    h: "Supplier invoices, matched to what came in."
    p: "Every Sysco, US Foods and produce invoice checked against what was ordered and received, with recipe costs updated the day a case price moves."
    doc: {kind: sheet, title: "This week's supplier invoices", meta: "From the suppliers' portals and the receiving notes", cols: ["Supplier", "Matched", "Note"], rows: [["Sysco", "Matched to the order", "Short on the delivery: credit asked for"], ["US Foods", "Matched to the order", "Fryer oil price changed: costs updated"], ["Produce house", "Matched to the order", "Avocado case price up: two dishes flagged"]], foot: "Each credit request is followed until it shows on the next statement."}
  - who: t3
    img: "img/hospitality/hosp-reviews.png"
    alt: "A busy restaurant dining room at dinner service, guests seated and a server carrying plates"
    h: "Every review answered, in the house voice."
    p: "Google and Yelp reviews answered the next morning, and anything a guest complained about sent to the manager on duty."
    doc: {kind: email, title: "Reply to a Google review", meta: "Downtown location, from the review and the manager's note", to: "A guest who reviewed Friday's dinner", subject: "Re: your dinner on Friday", body: ["Thank you for coming in on Friday, and for telling us plainly. You are right that the wait for mains was too long; the kitchen was a cook short that night, and that is ours to fix.", "We are glad the short rib was worth it. Next time, ask for the manager on duty and we will look after you."], foot: "The complaint about the wait went to the general manager this morning."}
  - who: t2
    img: "img/hospitality/hosp-events.png"
    alt: "A private dining room with one long table set for a rehearsal dinner in evening light"
    h: "Private events, booked with the deposit."
    p: "Every private dining, catering and buyout inquiry answered with the right room, menu and minimum, and followed until the date is booked or released."
    doc: {kind: invoice, title: "Deposit to hold your date", meta: "Private dining, from the signed event contract", to: "The event's host", rows: [{item: "Private dining room, Saturday evening", note: "Held for you"}, {item: "Set menu and wine pairing, as chosen", note: "Confirmed"}, {item: "Balance, after the event", note: "After the night"}], due: "to hold your date", pay: "Pay the deposit", foot: "Amounts from the signed event contract and your room minimums."}
orbit_h: "Your team, built around your group."
grid_h: "Every location, every teammate, one screen."
grid:
  offices: ["Downtown", "Second location", "Third location"]
  lamps: [[work, work, idle, idle, work], [work, idle, wait, idle, work], [idle, work, work, idle, idle]]
  legend: {work: "working", wait: "waiting on you", idle: "idle"}
proof: {h: "Scoop Dogg was the first business run by an AI employee.", p: "Scoop Dogg runs pet waste cleanup and turf care across Ventura and Santa Barbara counties. Like a restaurant's inbox, his fills with questions while he is busy with the work. His AI employee set up his new website and its online booking, then set up his automatic replies itself. He gets bookings every week, and he is first in ChatGPT and on Google for pet and yard cleanup in his area."}
offer_h: "Start with tomorrow's recap."
offer_p: "Name your restaurant group and your team writes the first morning recap from your own numbers. When you run a way of your own, such as a central kitchen or your own costing, we set it up with you, with the results agreed up front."
options:
  - {h: "Start free", p: "Your team on your numbers, then pay as you go."}
  - {h: "Custom agents", p: "Set up with you, with guaranteed results, from $1,200 a month."}
approval: {who: t2, act: "Event contract for Saturday's rehearsal dinner", to: "To the host", preview: "The contract with the private room, the set menu and wine pairing you chose, and a link to pay the deposit that holds the date."}
questions_h: "Questions"
questions:
  - {q: "Does it replace Toast?", a: "It can take over everything Toast does away from the tables. The terminals stay where your servers ring up, and the reports, the menu costing, the schedule, the event bookings, the reviews and the marketing become your team's job, which today takes a manager, a bookkeeper and several other subscriptions."}
  - {q: "Does it work across all of our locations?", a: "Yes. AMTECH holds a group as one organisation with each location as its own business, so each general manager sees that location's work and you see one recap across all of them."}
  - {q: "Who replies to guests and reviews?", a: "Your team does, in your house voice and under the rules you set, such as thanking five-star reviews or confirming a reservation that is already booked."}
  - {q: "Can it do our hiring?", a: "Yes. It writes and posts the job for the line cook or server you need, reads every application as it arrives, and books the interviews your managers choose on their own calendars."}
  - {q: "Does it get us ready for health inspections?", a: "Yes. It reads each location's past inspection reports from the county and builds a walk-through checklist from what the inspector wrote last time, so your managers fix it first."}
  - {q: "Is it priced per location?", a: "No. Start free and pay as you go for the work done across every location. Custom agents set up with you, with guaranteed results, start at $1,200 a month."}
ask_prompt: "What does AMTECH AI (amtechai.com) do for a restaurant group?"
closing_h: "Name your restaurant group."
closing_sub: "Your team reads your site and your Google listings, then writes the first morning recap from your own numbers."
site_sources: false
sources:
  - "The work shown on this page (numbers, invoices, reviews, events and counts) illustrates the AMTECH application; it is not a customer's restaurant."
  - "Scoop Dogg: reported by Ben Palaskas, AMTECH, 27 October 2026 (scoopdogg.net)."
  - "The photographs on this page were made for it with an image model; they show no real client or restaurant."
reviewed: {by: "Ben Palaskas", date: "2026-11-08"}
frame:
  - who: t5
    ask: "Food cost was high last week at the second location. What happened?"
    reply: "Food cost is on it. The produce invoices show a jump in the avocado case price, and two dishes carry most of it. Tuesday's recap names both, with what the plate costs now."
    title: "Tuesday's recap for the three locations"
    steps: ["Read last night's sales from each location's Toast", "Matched this week's produce invoices to the recipe costs", "Wrote what moved at each location, and why", "Ready to send to the three managers"]
    line: "Found the avocado case price behind the second location's food cost"
    doc:
      kind: report
      title: "Tuesday's recap"
      meta: "Three locations, last night and the week so far"
      rows:
        - {label: "Downtown", value: "Sales up; labour over at lunch"}
        - {label: "Second location", value: "Food cost up: avocado case price"}
        - {label: "Third location", value: "On plan"}
        - {label: "Dishes to look at", value: "The avocado toast and the grain bowl"}
        - {label: "Supplier credits open", value: "One, asked for on Monday"}
    trust: {assumed: "the recipe costs on file are current, except where an invoice changed them", checked: "every invoice against what was received"}
    approve: {act: "Send to the three managers"}
---
