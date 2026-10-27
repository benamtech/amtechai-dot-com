---
title: "AI employee for roofers: estimates, follow-up and deposits"
description: "An AMTECH AI employee measures roofs from plans or drone photos, prices them from your book, follows every quote to a yes and collects the deposit."
weight: 1
label: "Roofing"
card_line: "Every roof priced and every quote followed to a yes."
h1a: "Roofing contractors: every roof priced and every quote"
h1b: "followed to a yes."
sub: "AMTECH gives a roofing company an AI employee that does the work of an estimator, a follow-up desk and a collections clerk. Takeoffs measures the plan set, the drone photos or an EagleView report and prices the squares from your book in minutes, Follow-up answers every lead and keeps after every quote, and Collections sends the deposit request the day a job is won. Your employee connects to AccuLynx, JobNimbus, QuickBooks or anything else your office runs, and gets better at your roofs every week."
field: "Your roofing company's name"
button: "Start the free trial"
config: roofing
team: [employee, t1, t2, t4, t6]
names: {}
employee_does: "Learns your price book, your crews and the roofs you like to win, then sends each plan set, quote and deposit to the teammate for it and brings the finished work back to you to approve."
team_h: "Who works your roofing office"
services_h: "What roofing companies hand over first"
team_detail:
  - {id: t1, does: "Measures each roof plane from the plan set, the drone photos, an EagleView report or the satellite imagery of the address, adds pitch and waste, prices it from your book, and names anything the pictures could not show, so you check a finished estimate instead of building one."}
  - {id: t2, does: "Answers every new lead from your website, your Google listing and your inbox, then follows every open estimate until the homeowner says yes or no, writing each note in your words and sending it on your yes or under a standing approval."}
  - {id: t4, does: "Sends the deposit request the day a contract is signed, then the progress and final invoices, and keeps after whoever is late until the money is in your account."}
  - {id: t6, does: "Builds what your office has been missing: a storm-damage page and an inspection booking form on your website, and a portal where each homeowner sees the estimate, the photos and the invoice, live once you say yes."}
systems: ["AccuLynx or JobNimbus", "EagleView", "CompanyCam", "QuickBooks", "Gmail", "Your website's forms"]
routines:
  - "Every morning: new leads answered, the day's estimates priced from the crew's photos, and the roofing permits pulled in your area yesterday listed by address."
  - "Every Friday: open quotes followed up and unpaid deposits chased, with your week in plain words."
  - "After a hail or wind storm: the streets it hit in your service area, listed with the letters to those homeowners ready for your yes."
first_jobs:
  - "Price the plan set waiting in your inbox"
  - "Answer this week's quote requests at your real prices"
  - "Send the deposit request for the job you won on Tuesday"
live: {who: t1, title: "Estimate for the plan set from Tuesday's email", step: "Step 2 of 4: measuring the roof planes at scale"}
services: [estimates-from-plans-and-photos, insurance-claim-supplements-followed-to-payment, invoices-out-and-paid, found-on-google-and-in-ai-answers]
questions_h: "What roofing contractors ask first"
questions:
  - {q: "Can it do the estimator's job?", a: "Yes. Takeoffs measures and prices every roof you are asked to bid from the plan set, the drone photos or an EagleView report. You check and approve a finished estimate instead of spending the evening building one."}
  - {q: "Does it replace AccuLynx or JobNimbus?", a: "It can. Your employee starts inside the one you run, with a seat of its own, so nothing changes for your crew on day one. When you would rather stop paying for it, your employee keeps the estimates, photos, job notes and customer files itself, set up the way your office already works."}
  - {q: "Can it work insurance claims?", a: "Yes. The employee compares the adjuster's scope with your measurements and photos, writes the supplement for every item the scope missed, and follows the claim until the carrier answers each line, so the money a supplement company would take stays with you."}
  - {q: "Who sends the estimate?", a: "You do. Nothing leaves until you say yes, or until a standing approval in your own words covers it, such as repair quotes under an amount you set."}
  - {q: "What happens in a slow month?", a: "Your employee goes back through the quotes that went quiet and the past customers whose roofs are due for a look, and writes to each one on your yes, so the slow month fills with work you already earned once."}
closing_h: "Name your roofing company."
closing_sub: "Your employee reads your site and your Google listing, then prices the first roof while you watch."
reviewed: {by: "Ben Palaskas", date: "2026-10-27"}
# N2 workday, N1 one job and N4 week (lane FRAME, 2026-10-27): every word written for roofing.
workday_h: "A roofing office's day, done for you"
workday_sub: "Five jobs a roofing office does every week. Your employee and its team do each one end to end, and the finished work waits for your yes or goes out under a standing approval."
workday:
  - job: "The estimate, from the plan set or the drone photos"
    who: t1
    does: "Takeoffs measures every roof plane at scale from the plan set, the drone photos or an EagleView report, adds pitch and waste, and prices each line from your book. Whatever the pictures could not show is named on the estimate, never guessed."
    doc:
      kind: estimate
      title: "Roof replacement estimate"
      meta: "From the plan set in Tuesday's email"
      priced: "From your book"
      rows:
        - {item: "Roof area, measured at scale with pitch and waste", qty: "16.3", unit: "squares"}
        - {item: "Tear-off and disposal, one layer", unit: "squares"}
        - {item: "Synthetic underlayment, ice and water shield in the valleys", unit: "squares"}
        - {item: "Ridge vent, hip and ridge cap", unit: "linear feet"}
        - {item: "Drip edge and starter course", unit: "linear feet"}
        - {item: "Chimney flashing the plans do not detail", unit: "each"}
      foot: "Checked against the plan's scale bar. The chimney is flagged for a look on site."
  - job: "The insurance supplement, to the adjuster"
    who: employee
    does: "Your employee lays the adjuster's scope beside your measurements and photos and writes the supplement for every item the scope missed, each with its photo. Then it keeps after the claim until the carrier has answered every line."
    doc:
      kind: email
      title: "Supplement request"
      meta: "Written from the scope, your measurements and the inspection photos"
      to: "The adjuster on the claim"
      subject: "Supplement: items missing from the scope"
      body:
        - "Thank you for the scope on this claim. Set against our measurements and the inspection photos, it leaves out the items below."
        - "Drip edge along every eave and rake. Ice and water shield in both valleys. Starter course at the eaves. Removal and reset of the gutter guards."
        - "The photo and the measurement for each item are attached. Please send the revised scope when it is ready, and we will schedule the work."
      foot: "Each item carries its photo and its measurement."
  - job: "The storm-street letters, the morning after hail"
    who: t2
    does: "After a hail or wind storm, your employee lists the streets it hit inside your service area and writes to each homeowner offering an inspection, with a personal note to the ones whose roofs you already did. The letters go out on your yes."
    doc:
      kind: sheet
      title: "Streets hit by last night's hail"
      meta: "Inside your service area, from the storm reports"
      cols: ["Street", "Storm report", "Letter"]
      rows:
        - ["Oak Hollow Drive", "Hail", "Ready for your yes"]
        - ["Ridgeview Court", "Hail", "Ready for your yes"]
        - ["Mill Pond Road", "Wind", "Ready for your yes"]
        - ["Cedar Lane", "Hail", "A past customer: a personal note"]
        - ["Birchwood Avenue", "Hail", "Ready for your yes"]
      foot: "Streets from the storm reports; past customers from your own records."
  - job: "The deposit and the progress invoice"
    who: t4
    does: "The day a contract is signed, Collections sends the deposit request, then the progress invoice once the tear-off is done and the final one at the walk-through. It keeps after whoever is late until the money is in your account and matched in QuickBooks."
    doc:
      kind: invoice
      title: "Progress invoice"
      meta: "Roof replacement, tear-off finished"
      to: "The homeowner"
      rows:
        - {item: "Deposit, on signing", note: "Paid"}
        - {item: "Progress payment, at tear-off", note: "Due now"}
        - {item: "Final payment, at the walk-through", note: "Later"}
      due: "on receipt"
      pay: "Pay online"
      foot: "Amounts from the signed contract. Paid by card or bank transfer."
  - job: "The storm-damage page and the inspection booking"
    who: t6
    does: "Builder puts a storm-damage page on your website that answers what homeowners ask after a storm, with a form that books the inspection straight onto your calendar. It goes live when you say yes, and Follow-up answers every booking."
    doc:
      kind: page
      title: "Storm damage"
      meta: "A new page on your website, with its booking form"
      url: "yourroofingcompany.com/storm-damage"
      h: "Hail or wind damage? Book a roof inspection."
      p: "We check every slope, photograph what the storm did, and tell you plainly whether a claim is worth filing."
      button: "Book an inspection"
      rows: ["Will my insurance cover hail damage?", "How soon after a storm should I call?", "What does an inspection look at?"]
work_h: "One estimate, start to finish"
work_sub: "The plan set arrives in your inbox. Your employee reads it, Takeoffs measures and prices it, and the finished estimate waits for your yes, with what it assumed and what it checked written on its face."
frame:
  - who: t1
    ask: "Tuesday's email has a plan set for a re-roof on Mill Pond Road. Can you price it?"
    reply: "Takeoffs is on it. Every plane is measured at scale and priced from your book, and the chimney flashing is flagged because the plans do not detail it."
    title: "Estimate for the Mill Pond Road plan set"
    steps: ["Read the plan set and the homeowner's email", "Measured each roof plane at scale, with pitch and waste", "Priced every line from your book", "Waiting for your yes to send the estimate"]
    line: "Flagged the chimney flashing for a look on site"
    doc:
      kind: estimate
      title: "Roof replacement estimate"
      meta: "Mill Pond Road, from the plan set in Tuesday's email"
      priced: "From your book"
      rows:
        - {item: "Roof area, measured at scale with pitch and waste", qty: "16.3", unit: "squares"}
        - {item: "Tear-off and disposal, one layer", unit: "squares"}
        - {item: "Synthetic underlayment, ice and water shield in the valleys", unit: "squares"}
        - {item: "Ridge vent, hip and ridge cap", unit: "linear feet"}
        - {item: "Chimney flashing the plans do not detail", unit: "each"}
    trust: {assumed: "one layer to tear off, as the homeowner's email says", checked: "every plane against the plan's scale bar"}
    approve: {act: "Send to the homeowner"}
week_h: "A week in a roofing office"
week_sub: "On your office's own clock, with the storm as the day nobody plans for."
week:
  - {day: "Monday", who: t1, lines: ["The weekend's leads answered at your real prices", "Monday's estimates priced from the crew's photos"]}
  - {day: "Tuesday", who: employee, lines: ["Supplements written for the claims that came back short", "Yesterday's roofing permits in your area, listed by address"]}
  - {day: "Wednesday", who: t2, lines: ["Every quote that went quiet followed up, in your words"]}
  - {day: "Thursday", who: t4, lines: ["Deposit requests for the jobs won this week", "Progress invoices for the roofs torn off"]}
  - {day: "Friday", who: employee, lines: ["Open quotes followed up and unpaid deposits chased", "Your week, in plain words"]}
  - {day: "After a storm", who: t2, lines: ["The streets it hit in your service area, listed", "A letter to each homeowner, ready for your yes"]}
# The rest of SECTIONS-PLAN §4 (lane TRADES, 2026-10-27): proof, the start after it, connections, what it takes the
# place of, your yes, price, next pages and ask the AIs, every word written for roofing.
proof_h: "The first business run by an AI employee works outdoors, like your crews."
proof: "Scoop Dogg cleans up pet waste and cares for turf across Ventura and Santa Barbara counties, so his work, like a roofer's, happens outside and his leads come in while he is on a job. His AI employee set up his new website and its online booking, then set up his automatic replies itself. Every booking and quote request is answered at his real prices, he gets bookings every week, and he is first in ChatGPT and on Google for pet and yard cleanup in his area."
start2_h: "Name your roofing company. Your employee starts on the next estimate."
connects_h: "Plugs into what your roofing office runs today"
connects_sub: "Your employee works inside your own job software, measurement reports and books from the first day, with a seat of its own."
connects:
  - {name: "Jobs and crews", systems: ["AccuLynx", "JobNimbus", "Roofr", "CompanyCam"]}
  - {name: "Measurements", systems: ["EagleView", "Hover", "Drone photos", "Satellite imagery"]}
  - {name: "Insurance claims", systems: ["Xactimate", "The carriers' claim portals"]}
  - {name: "Deposits and books", systems: ["QuickBooks", "Your financing partner's portal"]}
  - {name: "Storm leads", systems: ["Your website's forms", "Google Business Profile", "NOAA storm reports", "Your permit office's records"]}
connects_how:
  - "Your employee builds each connection itself. You sign in while it walks you through it, and it never asks you for a key or a password."
  - "Where a system has no way in, such as a carrier's claim portal, your employee works it the way your office does, through the screen."
  - "It can also do the job of the software you pay for, so dropping a subscription becomes your choice."
connects_link: {text: "Can it connect to AccuLynx or JobNimbus?", url: "/questions/can-an-ai-employee-connect-to-my-software"}
instead_h: "What your AI team takes the place of"
instead_sub: "A roofing office buys its paperwork in pieces: an estimator's time, measurement reports, a supplement company, a billing clerk and an agency. Your AI team runs all of it."
instead:
  - {today: "Your evenings at the kitchen table building estimates", now: "Every roof measured and priced from your book by morning, waiting for your yes."}
  - {today: "A measurement report bought for every bid", now: "Takeoffs measures from the plan set, the drone photos or the satellite imagery, and names the roofs that still need a ladder."}
  - {today: "A supplement company's share of every claim", now: "Supplements written from your own photos and measurements and followed until the carrier answers each line."}
  - {today: "A billing clerk", now: "Deposit, progress and final invoices sent on time and chased until they are paid."}
  - {today: "A local marketing agency", now: "Your storm page, your Google listing and what ChatGPT says about you, worked every week."}
yes_h: "Nothing reaches a homeowner or an adjuster without you"
yes_sub: "Your employee does the work and shows it to you. You approve each piece, or write a standing approval so the routine work goes ahead on its own."
on_its_own:
  - "Pricing the morning's estimates from your book"
  - "Following up open quotes in the words you approved"
  - "Listing yesterday's roofing permits in your area"
  - "Answering a new lead with your next inspection times"
waits:
  - "Sending an estimate to a homeowner"
  - "Sending a supplement to the adjuster"
  - "Asking for a deposit"
  - "Mailing the storm-street letters"
approval: {who: t4, act: "Send the deposit request", to: "To the homeowner, from the signed contract", preview: "Thank you for choosing us for your new roof. Here is the deposit from your signed contract, with a link to pay by card or bank transfer. We will confirm your start date as soon as it is in."}
price_h: "What a roofing company pays"
price_q:
  - {q: "Is there a fee per estimate or per claim?", a: "No. You pay as you go for the work your employee does, and every piece of work shows what it cost before you approve the next."}
  - {q: "When does a roofer need a custom agent?", a: "When your office runs a way of its own, such as your supplement process or your storm routine, and you want it set up with you, with the results agreed up front."}
next_h: "Where roofers go next"
next:
  - {label: "Estimates from plans and photos", url: "/services/estimates-from-plans-and-photos", line: "How Takeoffs measures and prices a roof, start to finish."}
  - {label: "Can an AI employee write my estimates?", url: "/questions/can-an-ai-employee-write-my-estimates", line: "What it reads, what it checks and what it flags."}
  - {label: "Being found after a storm", url: "/departments/being-found", line: "Your storm page, your listing and the AI answers, worked every week."}
  - {label: "General contractors", url: "/industries/contractors", line: "If you take on full builds and remodels as well."}
ask_prompt: "What does AMTECH AI (amtechai.com) do for a roofing company?"
---
