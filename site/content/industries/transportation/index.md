---
# /industries/transportation, rebuilt 2026-11-08 (lane `hosptrans`, lead `lena`) on layouts/landing.html, the /industries/contractors
# pattern. Facts, systems, team names and documents are the 2026-10-27 page's (workday and frame). Every figure inside a
# card illustrates the application. Photographs: gpt-image-2.5 through AMTECH's gateway.
title: "AI agents for trucking companies: loads, paperwork, billing"
description: "An AMTECH agent team finds loads for tomorrow's empty trucks, checks every rate confirmation and sends each invoice packet the day the load delivers."
layout: "landing"
weight: 6
label: "Transportation and logistics"
crumb: "Trucking and logistics"
card_line: "Loads booked, paperwork checked, invoices out the same day."
config: transportation
names: {employee: "Your lead agent", t5: "Dispatch", t4: "Billing", t2: "Follow-up", t3: "Compliance", t6: "Builder"}
team: [employee, t5, t4, t2, t3, t6]
h1a: "Bill every load"
h1b: "the day it delivers."
sub: "An AI team for your trucking company that finds loads for tomorrow's empty trucks, books the ones inside your rules, checks every rate confirmation, and sends the invoice with the signed bill of lading to the broker or your factoring company the day the load delivers."
answer: "AMTECH gives a trucking or logistics company a team of AI agents that does the desk work of dispatch and billing: loads found on DAT and Truckstop for each empty truck and booked inside your lanes, rates and brokers, every rate confirmation checked line by line, invoice packets with the signed bill of lading sent the day a load delivers, detention and short pays claimed with the ELD's times, and the IFTA quarter and driver files kept ready. It works inside McLeod, Ascend or Rose Rocket and reads hours and miles from Samsara or Motive."
field: "Your trucking company's name"
button: "Book a call"
start: {industry: transportation}
prices: "Custom agents with guaranteed results from $1,200/mo. Or pay as you go from $50/mo."
hero_img: "img/transportation/truck-hero.png"
hero_alt: "A line of semi trucks parked in a freight yard at sunrise"
panel:
  firm: "Your trucking company"
  h: "Your team"
  rows:
    - {who: t5, state: work}
    - {who: t4, state: work}
    - {who: t2, state: work}
    - {who: t3, state: wait}
    - {who: t6, state: idle}
  card_h: "Invoice packet: Dallas to Memphis"
  steps: ["Matched the signed bill of lading to the rate confirmation", "Added detention from the ELD's times", "Booked tomorrow's reefer out of Dallas"]
  now: "Sending the packet to your factoring company"
  total: "Billed the day it delivered."
found: [{n: "4", what: "loads booked for tomorrow"}, {n: "6", what: "invoice packets sent"}, {n: "2", what: "detention claims open"}]
offer_found: false
systems: ["McLeod", "Ascend", "Rose Rocket", "DAT", "Truckstop", "Samsara", "Motive", "QuickBooks"]
frame_h: "One load, start to finish."
bands_h: "A carrier's desk work, done while the trucks roll."
bands:
  - who: t5
    img: "img/transportation/truck-loads.png"
    alt: "Reefer and dry van trailers parked in a freight yard at dusk"
    h: "Tomorrow's loads, booked inside your rules."
    p: "Every afternoon each empty truck matched to loads on its lane, ranked by rate per mile after deadhead, with the hours checked on the ELD."
    doc: {kind: sheet, title: "Tomorrow's empty trucks", meta: "From the ELD's hours and the load boards, this afternoon", cols: ["Truck", "Lane", "Status"], rows: [["Reefer, empty in Dallas", "Dallas to Memphis", "Booked"], ["Dry van, empty in Atlanta", "Atlanta to Charlotte", "Under your rate floor"], ["Dry van, empty in Memphis", "Memphis to Nashville", "Booked"]], foot: "Each driver's hours checked on the ELD before a load was booked."}
  - who: t4
    img: "img/transportation/truck-rate.png"
    alt: "The inside of a semi truck cab at dawn with a clipboard and a tablet on the dashboard"
    h: "Every rate confirmation, checked."
    p: "The rate, stops, detention and lumper terms read line by line against what was agreed, and a mistake goes back to the broker before the truck moves."
    doc: {kind: report, title: "Rate confirmation check", meta: "Dallas to Memphis, from the broker's confirmation", rows: [{label: "Rate", value: "Matches what was agreed"}, {label: "Pickup and delivery times", value: "Match the tender"}, {label: "Detention terms", value: "Missing: the broker was asked to add them"}, {label: "Broker's authority", value: "Active on FMCSA's records"}], foot: "The corrected confirmation is filed with the load."}
  - who: t4
    img: "img/transportation/truck-packet.png"
    alt: "A driver handing a clipboard of papers to a dock worker at a warehouse loading dock"
    h: "The invoice packet, out the day it delivers."
    p: "The signed bill of lading, proof of delivery and lumper receipt matched to the rate confirmation and sent to the broker or your factoring company."
    doc: {kind: invoice, title: "Invoice packet", meta: "Dallas to Memphis, delivered this morning", to: "The broker, or your factoring company", rows: [{item: "Linehaul, from the rate confirmation", note: "Attached"}, {item: "Signed bill of lading", note: "Attached"}, {item: "Proof of delivery", note: "Attached"}, {item: "Detention, from the ELD's times", note: "Claimed"}], due: "on the broker's terms", pay: "Submit the packet", foot: "Amounts from the rate confirmation and the receipts."}
  - who: t2
    img: "img/transportation/truck-detention.png"
    alt: "Semi trucks waiting in a row at warehouse loading docks in the afternoon"
    h: "Detention, followed until paid."
    p: "What each broker paid compared with the rate confirmation and the ELD's times, and the claim filed with the proof and followed up."
    doc: {kind: email, title: "Detention claim", meta: "From the ELD's arrival and departure times", to: "The broker's accounts team", subject: "Detention at the Memphis delivery", body: ["Our truck arrived at the Memphis receiver on time for its appointment and was held well past the free time on the rate confirmation.", "The arrival and departure times from the ELD and the signed bill of lading with the receiver's times are attached.", "Please add the detention to this load's payment, as the rate confirmation's terms state."], foot: "Followed up until it is paid or answered."}
orbit_h: "Your team, built around your fleet."
grid_h: "Every lane, every teammate, one screen."
grid:
  offices: ["Reefer lanes", "Dry van lanes", "Direct shippers"]
  lamps: [[work, work, work, idle, idle], [work, wait, work, idle, idle], [idle, work, work, work, idle]]
  legend: {work: "working", wait: "waiting on you", idle: "idle"}
proof: {h: "The first business run by an AI employee is a small company, like most carriers.", p: "Scoop Dogg runs pet waste cleanup and turf care across Ventura and Santa Barbara counties. His trade is far from freight, but his problem was a carrier's: the work happens on the road, and the paperwork and the customers wait until night. His AI employee set up his new website and its online booking, then set up his automatic replies itself. He gets bookings every week, and he is first in ChatGPT and on Google for pet and yard cleanup in his area."}
offer_h: "Start with your next empty truck."
offer_p: "Name your trucking company and your team finds loads for the next empty truck today. When you run a way of your own, such as dedicated lanes with your own settlement rules, we set it up with you, with the results agreed up front."
options:
  - {h: "Pay as you go", p: "Your team on your next empty truck, then pay as you go."}
  - {h: "Custom agents", p: "Set up with you, with guaranteed results, from $1,200 a month."}
approval: {who: t5, act: "Atlanta to Charlotte load", to: "Under your rate floor", preview: "The dry van is empty in Atlanta tomorrow. This is the best load on its lane after deadhead, from a broker you have used before, and it puts the truck where next week's freight is."}
questions_h: "Questions"
questions:
  - {q: "Does it replace my dispatcher?", a: "It can do the desk work of dispatch: finding and ranking loads, booking the ones inside your rules, checking every rate confirmation, building the invoice packets and chasing the brokers. Many carriers start with it beside the dispatcher and hand it more each week, while the drivers and the trucks stay yours to run."}
  - {q: "Does it book loads on its own?", a: "Yes, inside the rules you set. Tell your team the lanes, rates and brokers it may book, and it books those itself; anything outside them comes to you or your dispatcher first."}
  - {q: "Does it replace my TMS?", a: "It can. Your team starts inside McLeod, Ascend, Rose Rocket or whichever TMS you run, with a seat of its own, and reads hours and miles from Samsara or Motive. With a custom setup it can keep the loads, documents and settlements itself when the TMS stops earning its fee."}
  - {q: "Can it chase detention and short pays?", a: "Yes. Billing compares what each broker paid with the rate confirmation and the detention times from the ELD, then files the claim with the proof attached and keeps after it until it is paid."}
  - {q: "We broker freight as well. Does it work there?", a: "Yes. It checks each carrier's authority and insurance on FMCSA's records before you tender a load, and keeps the certificates on file current."}
  - {q: "Is it priced per truck or per load?", a: "No. Pay as you go for the work done, from $50 a month. Custom agents set up with you, with guaranteed results, start at $1,200 a month."}
ask_prompt: "What does AMTECH AI (amtechai.com) do for a trucking company?"
closing_h: "Name your trucking company."
closing_sub: "On the call you see your team read your FMCSA record and find loads for your next empty truck."
site_sources: false
sources:
  - "The work shown on this page (loads, rate confirmations, invoice packets, claims and counts) illustrates the AMTECH application; it is not a carrier's load."
  - "Scoop Dogg: reported by Ben Palaskas, AMTECH, 27 October 2026 (scoopdogg.net)."
  - "The photographs on this page were made for it with an image model; they show no real client, truck or yard."
reviewed: {by: "Ben Palaskas", date: "2026-11-08"}
frame:
  - who: t4
    ask: "The Memphis load delivered this morning. Can we get it billed today?"
    reply: "Billing is on it. The signed bill of lading and the proof of delivery match the rate confirmation, and the ELD shows the truck was held past the free time, so detention is on the invoice."
    title: "Invoice packet for the Dallas to Memphis load"
    steps: ["Read the driver's photos of the signed paperwork", "Matched the signed bill of lading to the rate confirmation", "Added detention from the ELD's times", "Ready to send the packet"]
    line: "Added detention: the truck was held past the free time"
    doc:
      kind: invoice
      title: "Invoice packet"
      meta: "Dallas to Memphis, delivered this morning"
      to: "Your factoring company"
      rows:
        - {item: "Linehaul, from the rate confirmation", note: "Attached"}
        - {item: "Signed bill of lading", note: "Attached"}
        - {item: "Proof of delivery", note: "Attached"}
        - {item: "Detention, from the ELD's times", note: "Claimed"}
      due: "on the factoring company's terms"
      pay: "Submit the packet"
    trust: {assumed: "this broker's loads go to your factoring company, as last month's did", checked: "the receiver's signature and times on the bill of lading"}
    approve: {act: "Send to your factoring company"}
---
