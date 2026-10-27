---
title: "Estimates from plans and photos: an AI estimator that prices from your own book"
description: "An AMTECH AI employee with Takeoffs and Research that runs your estimating: plan sets and photos measured, priced from your book, sent and followed up."
crumb: "Estimating"
h1a: "Your estimating done for you, every job measured and priced"
h1b: "by morning."
sub: "AMTECH runs your estimating end to end, in place of the estimator you would hire, the outsourced takeoff service and the estimating subscription. Your AI employee and its Takeoffs teammate measure plan sets, drone photos and CompanyCam pictures at scale, price every line from your own book, send the estimate and follow it up; Research finds the supplier prices and the addenda the plans leave out."
field: "Your company's name"
button: "Start the free trial"
names: {}
systems_more: ["EagleView", "Your price book"]
live: {who: t1, title: "Takeoff for the plan set from Monday's bid invite", step: "Step 2 of 4: measuring sheet A-201 at 1/4 inch to the foot"}
manifest_h: "What starts on the first day"
employee_does: "Reads your past estimates and invoices to learn your prices and markup, then hands every plan set and photo to Takeoffs and brings you the estimate to approve."
team_detail:
  - {id: t1, does: "Measures areas, lengths and counts from drawings and photos, prices them from your book, and lists each quantity with the sheet or picture it came from."}
  - {id: t5, does: "Looks up current supplier prices, permit fees and the specs in a bid's addenda, with the source for each."}
connects_note: "Your employee files every estimate in Jobber, keeps the photos with the job in CompanyCam, and answers the request in Gmail once you approve."
routines:
  - "Every morning: plan sets and photos that arrived overnight measured, and the estimates priced and ready for your yes."
  - "Every day: every takeoff available to you done, from new plan sets, bid invites and satellite imagery of the addresses that came in."
  - "Every Monday: supplier prices on your ten most-used materials checked against your book, with any change flagged."
first_jobs:
  - "Measure and price the plan set sitting in your inbox"
  - "Rebuild your price book from last year's invoices"
  - "Re-price the estimates you sent this month that have not been answered"
for_h: "Who uses it"
for_sub: "Trade contractors who price from drawings, photos or a walk-through, and lose evenings doing it."
industries:
  - {slug: roofing, line: "Roof planes, pitch and waste from EagleView reports and drone photos, priced by the square."}
  - {slug: painting, line: "Wall, ceiling and trim areas from walk-through photos, with prep and coats from your book."}
  - {slug: contractors, line: "Full plan sets from bid invites, measured trade by trade, with the addenda read."}
  - {slug: landscaping, line: "Beds, turf and hardscape measured from site photos and aerial maps."}
questions_h: "Questions about estimates"
asked:
  - {text: "Can an AI employee write my estimates?", href: "/questions/can-an-ai-employee-write-my-estimates"}
  - {text: "Can an AI employee follow up every lead for me?", href: "/questions/can-an-ai-employee-follow-up-every-lead"}
questions:
  - {q: "How accurate are the measurements?", a: "As accurate as the drawing or the photo allows. Takeoffs states the scale it measured at on every estimate and marks any line it could not measure, so you check those and nothing else."}
  - {q: "Can it replace my estimating software?", a: "Yes. It plugs into Jobber or the estimating tool you run today on the first day, and it does the estimator's whole job itself: measuring, pricing, writing and following up. Keep the tool if your crew likes it, or let your employee do that job too."}
  - {q: "What does it need from me on day one?", a: "Your business's name, a few past estimates and the invoices that followed. Your employee builds your price book from those and asks you only about what does not match."}
  - {q: "Can it handle a large commercial plan set?", a: "Yes. Takeoffs works through the set sheet by sheet, splits the scope by trade, and tells you which sheets it measured and which it left for you."}
closing_h: "Name your company, and send the first plan set."
closing_sub: "Your employee reads your site and your Google listing, then measures and prices the first job while you watch."
frame_h: "Watch one estimate go from the inbox to your yes"
frame:
  - tab: "A plan set from a bid invite"
    who: t1
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
  - tab: "An address and nothing else"
    who: t1
    ask: "A homeowner on Linden Avenue wants a price for new sod and beds. All we have is the address."
    reply: "Takeoffs measured the lawn, the beds and the front walk from satellite imagery of the address. The price is below. The side yard is marked, because trees hide it from above."
    title: "Estimate for Linden Avenue, from the address"
    steps: ["Pulled the satellite imagery for the address", "Measured the lawn, the beds and the front walk", "Priced sod, soil and edging from your book", "Waiting for your yes to send the price"]
    line: "Marked the side yard, hidden by trees, for a look on site"
    doc:
      kind: estimate
      title: "Front yard renovation"
      meta: "Linden Avenue, measured from satellite imagery"
      priced: "From your book"
      rows:
        - {item: "Old turf removed and hauled away", unit: "square feet"}
        - {item: "New sod, laid and rolled", unit: "square feet"}
        - {item: "Planting beds, soil and mulch", unit: "square feet"}
        - {item: "Steel edging along the beds", unit: "linear feet"}
        - {item: "Side yard, hidden by trees", unit: "check on site"}
      foot: "The homeowner gets a price today. Your crew visits only to confirm it."
    trust: {assumed: "the soil depth from your last bed jobs", checked: "the lawn's outline against the property line"}
    approve: {act: "Send to the homeowner"}
  - tab: "Open estimates, re-priced"
    who: t5
    ask: "Supplier prices went up this month. Which of our open estimates are too low now?"
    reply: "Research checked this month's supplier prices against every estimate still waiting on an answer. The ones that moved are re-priced below, each with a short note to the customer."
    title: "Open estimates checked against this month's prices"
    steps: ["Read every estimate still waiting on an answer", "Checked each material against this month's supplier prices", "Re-priced the lines that moved, from your book", "Waiting for your yes to send the new prices"]
    line: "Wrote a short note to go with each new price"
    doc:
      kind: sheet
      title: "Open estimates, re-priced"
      meta: "Supplier prices as of this Monday"
      cols: ["Estimate", "Sent", "What moved", "Now"]
      rows:
        - ["Oak Street repaint", "2 weeks ago", "Exterior paint", "Re-priced"]
        - ["Bayview deck", "Last week", "Deck boards", "Re-priced"]
        - ["Cedar Lane roof", "Last week", "Nothing", "Price holds"]
        - ["Main Street storefront", "10 days ago", "Lumber", "Re-priced"]
    trust: {assumed: "your markup stays as your book has it", checked: "every price against the supplier's own list"}
    approve: {act: "Send the new prices"}
work_h: "How estimating runs, start to finish"
work_steps:
  - {h: "The request comes in", p: "A bid invite, a plan set, a few photos, or just an address. Your employee picks it up the hour it lands, from your inbox, your website's form or Jobber."}
  - {h: "Takeoffs measures it", p: "Every area, length and count is measured at the drawing's scale. Each line says which sheet or photo it came from."}
  - {h: "It is priced from your book", p: "Materials, labour and markup come from your own prices. Research looks up anything new, such as a supplier's price or a permit fee."}
  - {h: "You say yes, and it goes out", p: "You see the estimate with its working. Say yes, and your employee sends it in your name, from Jobber or as a PDF."}
  - {h: "Followed up to a yes", p: "Your employee writes to the customer on the days you choose until they answer. A yes becomes a job in Jobber, and the deposit request goes out that day."}
start2_h: "Name your company, and send Takeoffs your next plan set."
week_h: "A week of estimating"
week:
  - {day: "Monday", who: t1, lines: ["Weekend plan sets and photos measured and priced", "New bid invites sorted by due date"]}
  - {day: "Tuesday", who: t5, lines: ["The addenda read on every open bid", "Supplier prices checked against your book"]}
  - {day: "Wednesday", who: t1, lines: ["Address-only requests measured from satellite imagery", "The crews' walk-through photos priced"]}
  - {day: "Thursday", who: employee, lines: ["This week's estimates followed up", "Won estimates turned into jobs in Jobber"]}
  - {day: "Friday", who: employee, lines: ["Next week's bids ready for your yes", "Your week: priced, sent, won, lost, and why"]}
instead_h: "What it replaces in your estimating"
instead_sub: "Most contractors pay for estimating three ways: a person, a service and a subscription. Then they finish it themselves at night. Your estimating team does all of it."
instead:
  - {today: "An estimator on salary", now: "Every plan set and photo measured and priced the day it arrives, weekends too."}
  - {today: "An outsourced takeoff service", now: "Takeoffs in hours, not days, with the sheet named for every quantity."}
  - {today: "Takeoff and estimating software", now: "The measuring, pricing and writing done for you. Keep the tool if your crew likes it, or let your employee do its job."}
  - {today: "Your evenings and Sundays", now: "Estimates waiting for your yes when you start the day."}
  - {today: "Bids you never got to", now: "Every bid invite read, and the ones worth pricing priced before they are due."}
  - {today: "Estimates nobody chased", now: "Each one followed up until the customer says yes or no."}
connects_h: "Works in the tools your estimates live in"
connects_sub: "Your employee signs in to each one with an account of its own. It reads plans and photos where they already are, and files the estimate where you keep it."
connects:
  - {name: "Plans and bids", systems: ["Bid invites in Gmail", "BuildingConnected", "Procore", "Dropbox"]}
  - {name: "Photos and measurements", systems: ["CompanyCam", "EagleView", "Drone photos", "Satellite imagery"]}
  - {name: "Estimates and jobs", systems: ["Jobber", "JobNimbus", "Housecall Pro"]}
  - {name: "Prices", systems: ["Your price book", "Supplier price lists", "QuickBooks"]}
connects_how:
  - "You tell your employee where plans and photos arrive. It goes and gets them."
  - "You sign in once, on each tool's own screen. Your employee never sees your password."
  - "No estimating tool? Your employee does that job itself and sends a clean PDF in your name."
connects_link: {text: "Can it connect to the software you run?", url: "/questions/can-an-ai-employee-connect-to-my-software"}
yes_h: "No price goes out without your yes"
yes_sub: "Takeoffs measures and prices. You see every line and say yes. Once you trust it, set a standing approval, such as the yearly price for a repeat customer."
on_its_own:
  - "Measuring every plan set, photo and address that comes in"
  - "Checking supplier prices against your book every week"
  - "Reading the addenda on every open bid"
  - "Following up an estimate you already approved"
waits:
  - "Sending an estimate or a bid"
  - "Changing a price in your book"
  - "Re-pricing an estimate the customer already has"
  - "Turning down a bid invite"
approval: {who: t1, act: "Send the bid for the Harbor Street fit-out", to: "To the general contractor, after your yes", preview: "Our scope, measured from sheets A-101 to A-401 with addendum 2. Every quantity names its sheet. Any sheet with no scale is marked for you."}
price_h: "What estimating costs"
price_q:
  - {q: "Is there a charge for each estimate?", a: "You start free, then pay as you go for the work done. You see every piece of work and what it cost."}
  - {q: "What does a custom setup add?", a: "An estimating team set up with you for your trade, your price book and your bid list, with the results agreed up front."}
next_h: "Read next"
next:
  - {label: "Can an AI employee write my estimates?", url: "/questions/can-an-ai-employee-write-my-estimates", line: "The short answer, and what it needs from you."}
  - {label: "Can an AI employee follow up every lead?", url: "/questions/can-an-ai-employee-follow-up-every-lead", line: "What happens after the estimate goes out."}
  - {label: "Invoices out and paid", url: "/services/invoices-out-and-paid", line: "From the won estimate to the money in."}
  - {label: "Roofing", url: "/industries/roofing", line: "Estimates from EagleView reports and drone photos."}
  - {label: "General contractors", url: "/industries/contractors", line: "Full plan sets from bid invites, trade by trade."}
ask_prompt: "Can AMTECH AI (amtechai.com) measure and price my estimates from plans and photos?"
reviewed: {by: "Ben Palaskas", date: "2026-10-27"}
---
