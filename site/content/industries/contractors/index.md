---
# /industries/contractors, rebuilt 2026-11-08 (session `lena`) on layouts/landing.html, the /real-estate pattern: Ben, "upgrade
# the contractor landing page ... less clutter ... more images". Eighteen sections became nine. The trade's documents
# (bid leveling, the permit check, the change order, the pay application) sit on photographs of the work. The action is
# still the free start with the contractors setup (this page is a self-serve door). Every figure inside a card
# illustrates the application. Photographs: gpt-image-2.5 through AMTECH's gateway.
title: "AI agents for general contractors: bids, permits and draws"
description: "An AMTECH agent team takes off every plan set, sends and levels your bid packages, checks every permit each morning, and gets every draw and change order paid."
layout: "landing"
weight: 4
label: "General contractors"
crumb: "General contractors"
card_line: "Bids out, permits closed, every draw paid."
config: contractors
names: {employee: "Your lead agent", t5: "Permits", t4: "Draws"}
team: [employee, t1, t5, t4, t2, t6]
h1a: "Bid more jobs."
h1b: "Get every draw paid."
sub: "An AI team for your construction company that takes off every plan set, sends and levels your bid packages, checks every permit each morning, and writes each draw with the waivers in."
answer: "AMTECH gives a general contractor or remodeler a team of AI agents that does the work of an estimator, a permit expediter and a project accountant: takeoffs and bid packages to subs, the daily permit and inspection check on the city portal, change orders priced before the work, and pay applications with every lien waiver collected, inside Procore, Buildertrend or JobTread."
field: "Your company's name"
button: "Book a call"
start: {industry: contractors}
prices: "Custom agents with guaranteed results from $1,200/mo. Or pay as you go from $50/mo."
hero_img: "img/contractors/hero.png"
hero_alt: "A three-storey commercial building under construction at golden hour, a tower crane above it"
panel:
  firm: "Your company"
  h: "Your team"
  rows:
    - {who: t1, state: work}
    - {who: t5, state: work}
    - {who: t4, state: wait}
    - {who: t2, state: work}
    - {who: t6, state: idle}
  card_h: "Bid: Medical office tenant improvement"
  steps: ["Took off 42 sheets by trade", "Sent the packages to 18 subs", "Leveled 11 bids and named each gap"]
  now: "Writing the RFI for the corridor ceiling"
  total: "Bid ready two days before it is due."
found: [{n: "7", what: "bids out this week"}, {n: "23", what: "permits checked today"}, {n: "3", what: "draws ready to send"}]
offer_found: false
systems: ["Procore", "Buildertrend", "JobTread", "QuickBooks", "BuildingConnected", "City permit portal", "Gmail", "Google Calendar"]
frame_h: "One bid, start to finish."
bands_h: "The paperwork every job runs on, done."
bands:
  - who: t1
    img: "img/contractors/bids.png"
    alt: "Architectural drawings with highlighter marks on an estimating desk at night"
    h: "Bid packages, out and leveled."
    p: "Every plan set taken off by trade and sent to your subs, their numbers set side by side with each gap named."
    doc: {kind: sheet, title: "Bid leveling: medical office tenant improvement", meta: "From the scope sheets and the subs' replies", cols: ["Trade", "Bids back", "What is missing"], rows: [["Framing and drywall", "All on your list", "One leaves out the soffits"], ["Electrical", "All on your list", "One leaves out the fire alarm tie-in"], ["Plumbing", "Waiting on one", "Reminder sent"]], foot: "Each gap goes into the scope sheet so every number covers the same work."}
  - who: t5
    img: "img/contractors/permits.png"
    alt: "A building inspector with a clipboard checking new wall framing"
    h: "Every permit, checked each morning."
    p: "Each live job's permit read on the city portal, the next inspection booked, and a failed one flagged the same morning."
    doc: {kind: report, title: "Permits and inspections", meta: "From the city's portal, this morning", rows: [{label: "Rough electrical inspection", value: "Passed yesterday"}, {label: "Framing inspection", value: "Booked for Thursday morning"}, {label: "Rough plumbing inspection", value: "Failed: vent not on the drawings"}, {label: "Permit expiry", value: "Not this quarter"}], foot: "The inspector's note is attached as written."}
  - who: t4
    img: "img/contractors/changes.png"
    alt: "A kitchen remodel in progress, the island framed with open drywall"
    h: "Change orders, priced before the work."
    p: "Each change priced from your book and your subs' numbers, and signed before anyone builds it."
    doc: {kind: estimate, title: "Change order: kitchen island", meta: "Asked for at the last site walk", priced: "From your book", rows: [{item: "Two outlets on the island, with the circuit", unit: "each"}, {item: "Pendant lights, wiring and boxes", unit: "each"}, {item: "Patch and finish the opened drywall", unit: "square feet"}], foot: "Signed by the homeowner before the electrician is scheduled."}
  - who: t4
    img: "img/contractors/draws.png"
    alt: "A just-finished medical office reception area"
    h: "Every draw, with the waivers in."
    p: "Pay applications written against the schedule of values, with lien waivers and insurance collected first."
    doc: {kind: invoice, title: "Pay application", meta: "This period, against the schedule of values", to: "The owner and the lender", rows: [{item: "Work completed this period, line by line", note: "Attached"}, {item: "Lien waivers from last month's paid subs", note: "All signed"}, {item: "Certificates of insurance", note: "Current"}], due: "on the contract's pay terms", pay: "Approve and pay"}
orbit_h: "Your team, built around your company."
grid_h: "Every job, every team, one screen."
grid:
  offices: ["Medical office TI", "Kitchen remodel", "Retail fit-out"]
  lamps: [[work, idle, wait, work, idle], [idle, work, work, work, idle], [work, work, idle, idle, wait]]
  legend: {work: "working", wait: "waiting on you", idle: "idle"}
proof: {h: "The first business run by an AI employee is a local service company.", p: "Scoop Dogg runs pet waste cleanup and turf care across Ventura and Santa Barbara counties. His AI employee set up his new website and its online booking, then set up his automatic replies itself. He gets bookings every week, and he is first in ChatGPT and on Google for pet and yard cleanup in his area."}
offer_h: "Start with your next bid."
offer_p: "Name your company and your team takes off the next plan set today. When you want your own draw process or bid forms set up with you, with the results agreed up front, we build it together."
options:
  - {h: "Pay as you go", p: "Your team on your next bid, then pay as you go."}
  - {h: "Custom agents", p: "Set up with you, with guaranteed results, from $1,200 a month."}
approval: {who: t4, act: "Pay application for the kitchen remodel", to: "To the owner and the lender", preview: "Line by line against the schedule of values, with every sub's lien waiver signed."}
questions_h: "Questions"
questions:
  - {q: "Does it replace Procore or Buildertrend?", a: "It can. Your team starts inside the one you run, so superintendents and clients keep their screens. It can also keep the RFIs, daily logs, change orders and draws itself, set up for how your company builds, when the per-project fees stop making sense."}
  - {q: "Can it do takeoffs from a full plan set?", a: "Yes. Takeoffs works through the drawings sheet by sheet, counts and measures by trade, names the scale on every sheet and lists what the drawings leave open, so your RFIs are written before the bid."}
  - {q: "Will it talk to my subs and clients?", a: "Yes, from your own email and in your words: bid invitations, package reminders, change orders and owner updates, under the rules you set."}
  - {q: "Can it keep my subs' paperwork current?", a: "Yes. Draws checks every sub's licence on the state board and every insurance certificate on file, and asks for the renewal sixty days before it lapses."}
  - {q: "Is there a fee per project?", a: "No. Pay as you go for the work done, from $50 a month. Custom agents set up with you, with guaranteed results, start at $1,200 a month."}
ask_prompt: "What does AMTECH AI (amtechai.com) do for a general contractor or remodeler?"
closing_h: "Name your construction company."
closing_sub: "Your team reads your site and your Google listing, then takes off the next plan set."
site_sources: false
sources:
  - "The work shown on this page (bids, permits, change orders, pay applications, jobs and counts) illustrates the AMTECH application; it is not a customer's job."
  - "Scoop Dogg: reported by Ben Palaskas, AMTECH, 27 October 2026 (scoopdogg.net)."
  - "The photographs on this page were made for it with an image model; they show no real client, job or building."
reviewed: {by: "Ben Palaskas", date: "2026-11-08"}
frame:
  - who: t1
    ask: "We got the invitation for the medical office tenant improvement. Bids are due next week. Can you get it out to the subs?"
    reply: "Takeoffs is on it. The drawings are taken off by trade and the packages are out to your list. The numbers are coming back now, leveled side by side, with each gap named."
    title: "Bid for the medical office tenant improvement"
    steps: ["Read the invitation, the drawings and the specs", "Took off the drawings by trade and sent the packages to your subs", "Leveled the subs' numbers and named each gap", "Waiting for your yes to submit the bid"]
    line: "Wrote an RFI for the corridor ceiling height"
    doc:
      kind: estimate
      title: "Tenant improvement bid"
      meta: "From the drawings, the specs and your subs' numbers"
      priced: "From your subs"
      rows:
        - {item: "Metal stud framing, interior partitions", unit: "linear feet"}
        - {item: "Gypsum board, taped and finished", unit: "square feet"}
        - {item: "Acoustical ceiling grid and tile", unit: "square feet"}
        - {item: "Receptacles, switches and lighting", unit: "each"}
        - {item: "Doors, frames and hardware", unit: "each"}
    trust: {assumed: "the building's fire sprinkler stays in place, as the specs say", checked: "the scale on every sheet against its scale bar"}
    approve: {act: "Submit the bid"}
---
