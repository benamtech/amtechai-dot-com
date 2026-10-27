---
title: "AI employee for restaurant groups: food cost, events, reviews"
description: "An AMTECH AI employee for restaurant and hospitality groups: one 6 a.m. recap across every location, events booked, reviews answered, hiring done."
weight: 5
label: "Hospitality and restaurants"
card_line: "Every location's numbers, bookings and reviews, run for you."
h1a: "Restaurant groups: every location's numbers on your phone by"
h1b: "six in the morning."
sub: "AMTECH gives a restaurant or hospitality group an AI employee that runs the back office of every location. It reads last night's sales from Toast or Square, matches them to the week's vendor invoices, and has food cost, labour and the three numbers that moved most on your phone at six, while its teammates book the events, answer the reviews and hire the next line cook."
field: "Your restaurant group's name"
button: "Start the free trial"
config: hospitality
team: [employee, t5, t2, t3, t6]
names: {t5: "Food cost", t2: "Events"}
employee_does: "Learns every location's menu, suppliers and events calendar, connects to Toast or Square, 7shifts, your reservation book and your suppliers' portals, and gives each invoice, booking and review to the teammate for it, with one recap back to you each morning."
team_h: "Who works behind every location"
services_h: "What restaurant groups hand over first"
team_detail:
  - {id: t5, does: "Reads each location's sales and every Sysco, US Foods and produce invoice, keeps the recipe costs current when a case price moves, and shows which plates lost margin this week, which is the work of a back-office manager and a costing subscription."}
  - {id: t2, does: "Answers every private dining, catering and buyout inquiry with the right room, menu and minimum, sends the contract and deposit request once you approve, and follows up until the date is booked or released."}
  - {id: t3, does: "Answers every Google and Yelp review in the house voice, keeps hours and holiday menus current on each location's listing, and checks what ChatGPT tells guests about each location."}
  - {id: t6, does: "Builds and keeps each location's website, the online ordering and private-dining pages, and the menus on all of them current the day the kitchen changes a dish."}
systems: ["Toast or Square", "7shifts", "OpenTable or Resy", "MarginEdge", "Tripleseat", "QuickBooks"]
routines:
  - "Every morning at six: last night's sales, food cost and labour by location, with what moved and why."
  - "Every morning: yesterday's reviews answered on your yes or under your standing approval, and anything a guest complained about sent to the manager on duty."
  - "Every month: each location's past health inspections read, with the checklist for the next visit."
first_jobs:
  - "Show last week's food cost by location and the five items that moved it"
  - "Answer every open private dining and catering inquiry in the inbox"
  - "Reply to this month's unanswered reviews in your house voice"
services: [the-six-oclock-numbers-food-cost-job-cost-cash, inquiries-answered-and-booked, found-on-google-and-in-ai-answers, this-months-posts-and-pictures, hire-the-next-person]
live: {who: t5, title: "Tuesday's recap for the three locations", step: "Step 2 of 3: matching this week's produce invoices to the recipe costs"}
questions_h: "What restaurant and hospitality owners ask first"
questions:
  - {q: "Does it replace Toast?", a: "It can take over everything Toast does away from the tables. The terminals stay where your servers ring up, and the reports, the menu costing, the schedule, the event bookings, the reviews and the marketing become your employee's job, which today takes a manager, a bookkeeper and several other subscriptions."}
  - {q: "Does it work across all of our locations?", a: "Yes. AMTECH holds a group as one organisation with each location as its own business, so each general manager sees that location's work and you see one recap across all of them."}
  - {q: "Who replies to guests and reviews?", a: "You decide. Every reply goes out on your yes, or under a standing approval in your own words, such as thanking five-star reviews or confirming a reservation that is already booked."}
  - {q: "Can it do our hiring?", a: "Yes. The employee writes and posts the job for the line cook or server you need, reads every application as it arrives, and books the interviews your managers choose on their own calendars."}
  - {q: "Does it get us ready for health inspections?", a: "Yes. The employee reads each location's past inspection reports from the county and builds a walk-through checklist from what the inspector wrote last time, so your managers fix it first."}
closing_h: "Name your restaurant group."
closing_sub: "Your employee reads your site and your Google listings, then writes the first morning recap from your own numbers."
reviewed: {by: "Ben Palaskas", date: "2026-10-27"}
# N2 workday, N1 one job, N4 week and the rest of SECTIONS-PLAN §4 (lane TRADES, 2026-10-27): every word written for
# restaurant and hospitality groups.
workday_h: "A restaurant group's back office, done before the doors open"
workday_sub: "Five jobs that land on every location's office. Your employee and its team do each one end to end, and the finished work waits for your yes or goes out under a standing approval."
workday:
  - job: "The morning numbers, for every location"
    who: t5
    does: "Before six, Food cost reads last night's sales from each location's Toast or Square, matches them to the week's invoices and the schedule, and writes what moved and why. You read one recap; each manager reads their own."
    doc:
      kind: report
      title: "This morning's numbers"
      meta: "Last night, every location, set against the same night last week"
      rows:
        - {label: "Sales by location", value: "Up downtown, flat at the other two"}
        - {label: "Food cost", value: "Up at the second location: produce prices"}
        - {label: "Labour", value: "Over the schedule at lunch, downtown"}
        - {label: "Voids and comps", value: "Normal everywhere"}
        - {label: "What to look at first", value: "The new case price on avocados"}
      foot: "The numbers themselves are in the recap on your phone."
  - job: "The supplier invoices, matched to what came in"
    who: t5
    does: "Food cost reads every invoice from Sysco, US Foods and the produce and dairy houses, checks it against what was ordered and received, and updates the recipe costs the day a case price moves."
    doc:
      kind: sheet
      title: "This week's supplier invoices"
      meta: "From the suppliers' portals and the receiving notes"
      cols: ["Supplier", "Matched", "Note"]
      rows:
        - ["Sysco", "Matched to the order", "Short on the delivery: credit asked for"]
        - ["US Foods", "Matched to the order", "Fryer oil price changed: recipe costs updated"]
        - ["Produce house", "Matched to the order", "Avocado case price up: two dishes flagged"]
        - ["Dairy", "Matched to the order", "None"]
      foot: "Each credit request is followed until it shows on the next statement."
  - job: "The review reply, in the house voice"
    who: t3
    does: "Being found answers every Google and Yelp review in the house voice, sends anything a guest complained about to the manager on duty, and keeps each location's hours and holiday menus right on every listing."
    doc:
      kind: email
      title: "Reply to a Google review"
      meta: "Downtown location, from the review and the manager's note"
      to: "A guest who reviewed Friday's dinner"
      subject: "Re: your dinner on Friday"
      body:
        - "Thank you for coming in on Friday, and for telling us plainly. You are right that the wait for mains was too long; the kitchen was a cook short that night, and that is ours to fix."
        - "We are glad the short rib was worth it. Next time, ask for the manager on duty and we will look after you."
      foot: "The complaint about the wait went to the general manager this morning."
  - job: "The private event, booked with its deposit"
    who: t2
    does: "Events answers every private dining, catering and buyout inquiry with the right room, menu and minimum, sends the contract and the deposit request once you approve, and follows up until the date is booked or released."
    doc:
      kind: invoice
      title: "Deposit to hold your date"
      meta: "Private dining, from the signed event contract"
      to: "The event's host"
      rows:
        - {item: "Private dining room, Saturday evening", note: "Held for you"}
        - {item: "Set menu and wine pairing, as chosen", note: "Confirmed"}
        - {item: "Deposit to hold the date", note: "To hold the date"}
        - {item: "Balance, after the event", note: "After the night"}
      due: "to hold your date"
      pay: "Pay the deposit"
      foot: "Amounts from the signed event contract and your room minimums."
  - job: "The private dining page, kept current"
    who: t6
    does: "Builder keeps each location's website, its online ordering and its private dining page current, and changes the menu on all of them the day the kitchen changes a dish."
    doc:
      kind: page
      title: "Private dining"
      meta: "A page on each location's website, with its inquiry form"
      url: "yourrestaurant.com/private-dining"
      h: "Private dining and events"
      p: "Rehearsal dinners, birthdays and team dinners in our private room, with a set menu from the kitchen. Tell us the date and we will send the room, the menu and the minimum the same day."
      button: "Ask about a date"
      rows: ["Can we bring our own cake?", "Is there a room minimum?", "Can you cater at our office?"]
work_h: "One morning recap, start to finish"
work_sub: "Before anyone opens, Food cost reads every location's night, matches it to the invoices, and writes the recap. It waits for your yes before it goes to the managers, with what it assumed written on its face."
frame:
  - who: t5
    ask: "Food cost was high last week at the second location. What happened?"
    reply: "Food cost is on it. The produce invoices show a jump in the avocado case price, and two dishes carry most of it. Tuesday's recap names both, with what the plate costs now."
    title: "Tuesday's recap for the three locations"
    steps: ["Read last night's sales from each location's Toast", "Matched this week's produce invoices to the recipe costs", "Wrote what moved at each location, and why", "Waiting for your yes to send it to the managers"]
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
week_h: "A week behind every location"
week_sub: "Every morning starts with the numbers, and every holiday changes the hours."
week:
  - {day: "Monday", who: t5, lines: ["The weekend's sales, food cost and labour by location", "Supplier credits asked for"]}
  - {day: "Tuesday", who: t2, lines: ["Every open event inquiry answered", "Contracts and deposits sent on your yes"]}
  - {day: "Wednesday", who: t3, lines: ["Reviews answered in the house voice", "What ChatGPT tells guests about each location, checked"]}
  - {day: "Thursday", who: t5, lines: ["Recipe costs updated from this week's invoices", "The schedule set against next week's bookings"]}
  - {day: "Friday", who: employee, lines: ["Weekend events confirmed with the kitchen", "Your week, across every location"]}
  - {day: "Before a holiday", who: t3, lines: ["Holiday hours and menus on every listing", "Bookings and events confirmed with each guest"]}
proof_h: "The first business run by an AI employee answers every customer at once."
proof: "Scoop Dogg runs pet waste cleanup and turf care across Ventura and Santa Barbara counties. Like a restaurant's inbox, his fills with questions while he is busy with the work. His AI employee set up his new website and its online booking, then set up his automatic replies itself, so every booking and question is answered at his real prices. He gets bookings every week, and he is first in ChatGPT and on Google for pet and yard cleanup in his area."
start2_h: "Name your restaurant group. Your employee writes tomorrow's morning recap."
connects_h: "Plugs into what every location runs today"
connects_sub: "Your employee works inside your point of sale, your scheduling, your reservations and your suppliers' portals from the first day, with a seat of its own."
connects:
  - {name: "Sales and staff", systems: ["Toast", "Square", "7shifts"]}
  - {name: "Guests and events", systems: ["OpenTable", "Resy", "Tripleseat"]}
  - {name: "Suppliers and costing", systems: ["Sysco", "US Foods", "MarginEdge"]}
  - {name: "Books", systems: ["QuickBooks", "Each location's bank deposits"]}
  - {name: "Listings and reviews", systems: ["Google Business Profile", "Yelp", "Each location's website"]}
connects_how:
  - "Your employee builds each connection itself. You sign in while it walks you through it, and no key or password is handed over."
  - "Where a system has no way in, such as a supplier's portal, your employee works it through the screen, the way your office does."
  - "It can also do the jobs your extra subscriptions do, from menu costing to event bookings, so keeping them becomes your choice."
connects_link: {text: "Can it connect to Toast or Square?", url: "/questions/can-an-ai-employee-connect-to-my-software"}
instead_h: "What your AI team takes the place of"
instead_sub: "A restaurant group pays for its back office in managers' hours, subscriptions and a bookkeeper. Your AI team does that work across every location."
instead:
  - {today: "A manager adding up last night's numbers before opening", now: "Each location's sales, food cost and labour on your phone by six, with what moved."}
  - {today: "A costing subscription and a back-office manager", now: "Every supplier invoice matched and every recipe cost kept current."}
  - {today: "An events coordinator answering inquiries", now: "Every inquiry answered with the room, the menu and the minimum, and booked with its deposit."}
  - {today: "A reviews tool and a social media agency", now: "Every review answered in the house voice and every listing kept right."}
  - {today: "A hiring service for the next line cook", now: "The job posted, every application read and the interviews booked."}
yes_h: "Nothing reaches a guest without you"
yes_sub: "Your employee does the work and shows it to you. Approve each piece, or write a standing approval so the routine work goes ahead during service."
on_its_own:
  - "Sending the morning recap to each manager"
  - "Thanking five-star reviews"
  - "Confirming a reservation that is already booked"
  - "Asking a supplier for a credit on a short delivery"
waits:
  - "Replying to a review that complains"
  - "Sending an event contract and its deposit request"
  - "Changing hours or menus on a listing"
  - "Posting a job opening"
approval: {who: t2, act: "Send the event contract", to: "To the host of Saturday's rehearsal dinner", preview: "Thank you for choosing us for Saturday. Your contract is attached with the private room, the set menu you chose and the wine pairing, and a link to pay the deposit that holds the date."}
price_h: "What a restaurant group pays"
price_q:
  - {q: "Is it priced per location?", a: "No. You pay as you go for the work your employee does across every location, and every piece of work shows what it cost."}
  - {q: "When does a restaurant group need a custom agent?", a: "When you run a way of your own, such as a central kitchen or your own costing method, and you want it set up with you, with the results agreed up front."}
next_h: "Where restaurant owners go next"
next:
  - {label: "Being found in every town", url: "/departments/being-found", line: "Each location's listing, reviews and AI answers, worked every week."}
  - {label: "Can an AI employee connect to my software?", url: "/questions/can-an-ai-employee-connect-to-my-software", line: "How it gets into Toast, 7shifts and your suppliers' portals."}
  - {label: "Invoices out and paid", url: "/services/invoices-out-and-paid", line: "For catering and events billed after the night."}
  - {label: "Transportation and logistics", url: "/industries/transportation", line: "If your group runs its own deliveries."}
ask_prompt: "What does AMTECH AI (amtechai.com) do for a restaurant group?"
---
