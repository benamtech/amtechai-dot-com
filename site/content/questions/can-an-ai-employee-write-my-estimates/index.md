---
title: "Can an AI employee write my estimates from plans, photos and my own prices?"
description: "Yes. How an AMTECH AI employee measures plan sets, drone photos and site pictures, prices the work from your book and sends the estimate once you approve."
weight: 3
h1: "Can an AI employee write my estimates?"
yes: "Yes."
answer: "Your AMTECH AI employee's Takeoffs teammate measures the plan set, the drone photos or the pictures from a walk-through at scale, prices every line from your own price book, writes the estimate in Jobber or as a PDF, sends it and follows it up. It shows you every line and what it could not measure, and the number goes out when you say yes."
card_line: "Takeoffs measures the plans or the photos, prices every line from your book, and names what it could not see."
field: "Your business's name"
button: "Start the free trial"
team: [employee, t1, t5, t2]
names: {}
systems: ["Your price book", "CompanyCam", "EagleView", "Jobber", "Google Drive", "Gmail"]
live: {who: t1, title: "Exterior repaint from Tuesday's photos", step: "Step 3 of 4: pricing the trim and the prep from your book"}
steps_h: "How an estimate gets written"
steps:
  - {h: "The plans, the photos or the address arrive", p: "A plan set lands in your inbox, a crew member uploads CompanyCam pictures, or a customer sends only an address and Takeoffs pulls the satellite imagery, and your employee starts the estimate the same hour."}
  - {h: "Takeoffs measures at scale", p: "It reads the scale from the drawing or the photo, measures each area, length and count, and writes down the scale it used so you can check any line."}
  - {h: "Every line is priced from your book", p: "Materials, labour and your markup come from your own price book and your past jobs, never from a national average, and Research looks up anything the book does not hold."}
  - {h: "You check the number and send it", p: "The estimate reaches you with what Takeoffs could not see marked plainly, such as the flashing behind a gutter, and nothing goes to the customer until you approve it."}
team_h: "Who writes the estimate"
employee_does: "Learns your price book, your markup and the jobs you like to win, hands each request to Takeoffs, and brings you the finished estimate with its working shown."
team_detail:
  - {id: t1, does: "Measures plan sets, drone photos and site pictures at scale, builds the line items, and prices them from your book, listing every quantity with the page or the photo it came from."}
  - {id: t5, does: "Finds what the plans leave out: the supplier's current price for a material you have not bought this year, a permit fee, or the spec named in a bid's addendum."}
  - {id: t2, does: "Sends the estimate once you approve it and follows it up until the customer says yes or no, so the work Takeoffs did is not left sitting in an inbox."}
questions_h: "What owners ask next"
questions_sub: "Estimating is where most owners lose their evenings and weekends."
questions:
  - {q: "Can it estimate before anyone visits the site?", a: "Yes. From an address alone Takeoffs measures roofs, lawns, beds and driveways on satellite imagery, so the customer has a price the same day and your crew visits only the jobs worth a visit."}
  - {q: "How does it know my prices?", a: "From your own records. Your employee reads your price book, your past estimates and your invoices, asks you about anything that does not add up, and uses your numbers from then on."}
  - {q: "Can it estimate from photos alone, without plans?", a: "Yes. Photos from a walk-through or a drone work, and Takeoffs names the scale it measured at and the parts of the job no picture showed, so you know which lines to check on site."}
  - {q: "Which trades does it estimate for?", a: "Roofing, painting, landscaping and general contracting today: roof squares and pitch, wall and trim areas, beds and hardscape, and the full scopes on a plan set."}
  - {q: "Who is responsible for the number?", a: "You are. Every estimate waits for your approval, shows its working line by line, and goes out under your name only after you say yes."}
related_h: "Related questions and pages"
related:
  - {text: "Estimates from plans and photos", href: "/services/estimates-from-plans-and-photos", why: "The package: Takeoffs, Research and your employee, set up to estimate from day one."}
  - {text: "Can an AI employee follow up every lead for me?", href: "/questions/can-an-ai-employee-follow-up-every-lead", why: "What happens to the estimate after it goes out."}
  - {text: "Can an AI employee connect to the software my business already uses?", href: "/questions/can-an-ai-employee-connect-to-my-software", why: "How it reads your price book in the system you keep it in."}
  - {text: "Roofing", href: "/industries/roofing", why: "Roof planes measured from EagleView reports and drone photos."}
  - {text: "General contractors", href: "/industries/contractors", why: "Full plan sets from BuildingConnected, measured and priced."}
closing_h: "Name your business, and price the next job."
closing_sub: "Your employee reads your site and your Google listing, asks for one plan set or a few photos, and prices the first job while you watch."
frame_h: "Watch an estimate get written from photos"
frame:
  - tab: "From walk-through photos"
    who: t1
    ask: "The crew sent photos of the house on Sage Court on Tuesday. Can we price the repaint?"
    reply: "Takeoffs measured the walls, trim and doors from the photos at scale, and priced the prep and two coats from your book. No photo showed the back porch ceiling, so it is marked."
    title: "Exterior repaint from Tuesday's photos"
    steps: ["Read the crew's photos and notes", "Measured walls, trim and doors at scale", "Priced the trim and the prep from your book", "Waiting for your yes to send the estimate"]
    line: "Marked the back porch ceiling: no photo showed it"
    doc:
      kind: estimate
      title: "Exterior repaint"
      meta: "Sage Court, from Tuesday's photos"
      priced: "From your book"
      rows:
        - {item: "Siding: wash, scrape, prime bare spots", unit: "square feet"}
        - {item: "Siding: two coats", unit: "square feet"}
        - {item: "Trim and fascia", unit: "linear feet"}
        - {item: "Doors and shutters", unit: "each"}
        - {item: "Back porch ceiling, not in any photo", unit: "check on site"}
      foot: "Each line names the photo it was measured from."
    trust: {assumed: "the house was built after 1978, as the county record shows", checked: "the scale against the front door's standard height"}
    approve: {act: "Send to the homeowner"}
  - tab: "From drone photos"
    who: t1
    ask: "Here are the drone photos of the roof on Canyon View. Can you price a re-roof?"
    reply: "Takeoffs measured each plane from the drone photos, with pitch and waste, and priced it from your book. Research found the county's re-roof permit and added it as a line."
    title: "Re-roof from the drone photos"
    steps: ["Read the drone photos and the address", "Measured each plane with pitch and waste", "Added the county's re-roof permit", "Waiting for your yes to send the estimate"]
    line: "Flagged a soft-looking spot near the vent for a look on site"
    doc:
      kind: estimate
      title: "Roof replacement"
      meta: "Canyon View, from the drone photos"
      priced: "From your book"
      rows:
        - {item: "Roof area, with pitch and waste", unit: "squares"}
        - {item: "Tear-off and disposal", unit: "squares"}
        - {item: "Drip edge and starter", unit: "linear feet"}
        - {item: "County re-roof permit", unit: "each"}
        - {item: "Decking near the vent", unit: "check on site"}
    trust: {assumed: "one layer of shingles to remove", checked: "each plane against the parcel's satellite outline"}
    approve: {act: "Send to the homeowner"}
connects_h: "Where your plans, photos and prices already live"
connects_sub: "Takeoffs works from the files you already have. Your crews do not learn a new app."
connects:
  - {name: "Plans", systems: ["Gmail", "Google Drive", "Dropbox", "BuildingConnected"]}
  - {name: "Photos", systems: ["CompanyCam", "Drone photos", "Phone photos"]}
  - {name: "Measurements", systems: ["EagleView", "Satellite imagery", "County parcel maps"]}
  - {name: "Prices and estimates", systems: ["Your price book", "Jobber", "QuickBooks", "Your supplier's site"]}
connects_how:
  - "Send plans and photos the way you do now: email, a shared folder or CompanyCam."
  - "Your price book can be a spreadsheet, Jobber's price list, or just your past invoices."
  - "Sign in once, on each tool's own screen. Your employee never sees your password."
start2_h: "Name your business, and send one job to price."
ask_prompt: "Can AMTECH AI (amtechai.com) write estimates from plans and photos for my business?"
reviewed: {by: "Ben Palaskas", date: "2026-10-27"}
---
