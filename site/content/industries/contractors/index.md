---
title: "AI employee for general contractors: bids, permits and draws"
description: "An AMTECH AI employee takes off plan sets, sends bid packages to your subs, chases permits and inspections, and gets every draw and change order paid."
weight: 4
label: "General contractors"
card_line: "Bids out, permits closed, every draw paid."
h1a: "General contractors: bids out, permits closed and every"
h1b: "draw paid."
sub: "AMTECH gives a general contractor or remodeler an AI employee that does the work of an estimator, a permit expediter and a project accountant. Its teammates take off the plan set and send the bid packages to your subs, check every live job's permit on the city portal each morning, and turn each finished phase into a draw request with the lien waivers attached, working in Procore, Buildertrend or JobTread from the first day."
field: "Your construction company's name"
button: "Start the free trial"
config: contractors
team: [employee, t1, t5, t4, t6]
names: {t5: "Permits", t4: "Draws"}
employee_does: "Learns your subs, your schedule of values and the jobs you have running, connects to Procore, Buildertrend, your plan rooms and your city's portal, and builds a connection to any system that has none, then gives each bid, permit and draw request to the teammate for it."
team_h: "Who keeps your bids, permits and draws on time"
services_h: "What general contractors hand over first"
team_detail:
  - {id: t1, does: "Takes off the plan set by trade, builds the scope sheet for each bid package, sends it to the subs on your list and levels their numbers side by side when they come back, so you bid more jobs without adding an estimator."}
  - {id: t5, does: "Checks each live job's permit on the city or county portal every weekday, books the next inspection, and tells you the morning one fails, with what the inspector wrote."}
  - {id: t4, does: "Writes each draw request against the schedule of values, collects the subs' lien waivers and insurance certificates first, and prices every change order before the work starts."}
  - {id: t6, does: "Builds the homeowner portal for selections, change orders and progress photos, and turns the spreadsheets your office runs on into tools your project managers use from their phones."}
systems: ["Procore", "Buildertrend or JobTread", "QuickBooks", "BuildingConnected", "City permit portal", "Gmail"]
routines:
  - "Every weekday at seven: the public bids and plan-room invitations that fit your work, with due dates and bonding noted."
  - "Every weekday: the permit and inspection status of each live job, and every new building permit in your area, with the owner and the work it covers."
  - "Every month before the draw: what each owner owes, which waivers are missing, and which sub certificates expire in the next sixty days."
first_jobs:
  - "Take off the plan set from the latest bid invitation and send it to your subs"
  - "Check every live job's permit and list what is open, failed or due"
  - "Write this month's draw request with the waivers you still need"
services: [estimates-from-plans-and-photos, the-morning-public-bid-sheet, open-permits-and-inspections-chased-on-live-jobs, billing-dates-pay-applications-waivers-and-lien-notices, the-books-kept-every-week]
live: {who: t1, title: "Bid for the medical office tenant improvement", step: "Step 3 of 5: leveling the drywall and electrical numbers from four subs"}
questions_h: "What general contractors and remodelers ask first"
questions:
  - {q: "Does it replace Procore or Buildertrend?", a: "It can. Your employee starts inside the one you run, so superintendents and clients keep their screens. It can also keep the RFIs, daily logs, change orders and draws itself, set up for how your company builds, when the per-project fees stop making sense."}
  - {q: "Can it do takeoffs from a full plan set?", a: "Yes. Takeoffs works through the drawings sheet by sheet, counts and measures by trade, names the scale on every sheet and lists what the drawings leave open, so your RFIs are written before the bid."}
  - {q: "Will it talk to my subs and clients?", a: "Only with your yes. Bid invitations, change orders and draw requests wait for you, unless a standing approval in your own words covers them, such as bid package reminders to subs already on the job."}
  - {q: "How does it help remodeling clients?", a: "The employee keeps each homeowner's selections, allowances and change orders in one place, prices every change before it is built, and sends the homeowner a plain weekly update once you approve it."}
  - {q: "Can it keep my subs' paperwork current?", a: "Yes. Draws checks every sub's licence on the state board and every insurance certificate on file, and asks for the renewal sixty days before it lapses."}
closing_h: "Name your construction company."
closing_sub: "Your employee reads your site and your Google listing, then takes off the first plan set while you watch."
reviewed: {by: "Ben Palaskas", date: "2026-10-27"}
# N2 workday, N1 one job, N4 week and the rest of SECTIONS-PLAN §4 (lane TRADES, 2026-10-27): every word written for
# general contractors and remodelers.
workday_h: "A general contractor's office day, done between site visits"
workday_sub: "Five pieces of paper every job runs on. Your employee and its team do each one end to end, and the finished work waits for your yes or goes out under a standing approval."
workday:
  - job: "The bid package, out to your subs and leveled"
    who: t1
    does: "Takeoffs works through the plan set by trade, writes the scope sheet for each package and sends it to the subs on your list. When the numbers come back it sets them side by side and names what each sub left out."
    doc:
      kind: sheet
      title: "Bid leveling: medical office tenant improvement"
      meta: "From the scope sheets and the subs' replies"
      cols: ["Trade", "Bids back", "What is missing"]
      rows:
        - ["Framing and drywall", "All on your list", "One leaves out the soffits"]
        - ["Electrical", "All on your list", "One leaves out the fire alarm tie-in"]
        - ["Plumbing", "Waiting on one", "Reminder sent"]
        - ["Acoustical ceilings", "All on your list", "Complete"]
        - ["Doors, frames and hardware", "All on your list", "One excludes the hardware"]
      foot: "Each gap is written into the scope sheet so every number covers the same work."
  - job: "The RFI, before the bid is due"
    who: t1
    does: "Where the drawings leave a question open, your employee writes the RFI with the sheet and the detail named, sends it to the architect on your yes, and logs the answer against the drawings so the field has it."
    doc:
      kind: email
      title: "Request for information"
      meta: "From the takeoff of the reflected ceiling plan"
      to: "The architect of record"
      subject: "RFI: ceiling height in the corridor"
      body:
        - "The reflected ceiling plan shows the corridor ceiling at one height, and the wall section shows it lower where the duct runs above. Please confirm which height governs."
        - "The sheet and the detail are attached, marked where they disagree."
        - "We need the answer before bids are due so every sub prices the same ceiling."
      foot: "Logged in the RFI list with its sheet and detail."
  - job: "The permit and inspection check, every morning"
    who: t5
    does: "Permits reads each live job's permit on the city or county portal every weekday, books the next inspection and tells you the morning one fails, with what the inspector wrote."
    doc:
      kind: report
      title: "Permits and inspections"
      meta: "From the city's portal, this morning"
      rows:
        - {label: "Building permit, kitchen and bath remodel", value: "Issued, posted on site"}
        - {label: "Rough electrical inspection", value: "Passed yesterday"}
        - {label: "Framing inspection", value: "Booked for Thursday morning"}
        - {label: "Rough plumbing inspection", value: "Failed: vent not shown on the permit drawings"}
        - {label: "Permit expiry", value: "Not this quarter"}
      foot: "The inspector's note on the failed inspection is attached as written."
  - job: "The change order, priced before the work starts"
    who: t4
    does: "When an owner asks for something new, Draws prices the change from your book and your subs' numbers, writes the change order with what it adds to the schedule, and sends it for signature before anyone builds it."
    doc:
      kind: estimate
      title: "Change order: kitchen island"
      meta: "Asked for by the homeowner at the last site walk"
      priced: "From your book"
      rows:
        - {item: "Two outlets added to the island, with the circuit", unit: "each"}
        - {item: "Pendant lights over the island, wiring and boxes", unit: "each"}
        - {item: "Patch and finish the opened drywall", unit: "square feet"}
        - {item: "Added days on the schedule", unit: "days"}
      foot: "Waits for the homeowner's signature before the electrician is scheduled."
  - job: "The pay application, with the waivers in"
    who: t4
    does: "Before each draw, Draws writes the pay application against the schedule of values, collects the conditional lien waivers from every sub paid last month, and checks each certificate of insurance before it goes to the owner or the lender."
    doc:
      kind: invoice
      title: "Pay application"
      meta: "This period, against the schedule of values"
      to: "The owner and the lender"
      rows:
        - {item: "Work completed this period, line by line", note: "Attached"}
        - {item: "Materials stored on site", note: "Photos attached"}
        - {item: "Retainage", note: "Held as the contract states"}
        - {item: "Lien waivers from last month's paid subs", note: "All signed"}
        - {item: "Certificates of insurance", note: "Current"}
      due: "on the contract's pay terms"
      pay: "Approve and pay"
      foot: "Amounts from the schedule of values and the approved change orders."
work_h: "One bid, start to finish"
work_sub: "An invitation to bid lands in your inbox. Your employee reads it, Takeoffs takes off the drawings and sends the packages to your subs, and the leveled bid waits for your yes with what it assumed written on its face."
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
week_h: "A week in a general contractor's office"
week_sub: "Bids, permits and inspections every day, and the draw at the end of the month."
week:
  - {day: "Monday", who: t1, lines: ["New invitations to bid read and sorted", "Bid packages out to your subs"]}
  - {day: "Tuesday", who: t5, lines: ["Every live job's permit read on the portal", "The week's inspections booked"]}
  - {day: "Wednesday", who: t1, lines: ["Subs' numbers leveled side by side", "RFIs written where the drawings are open"]}
  - {day: "Thursday", who: t4, lines: ["Change orders priced and sent for signature", "Sub certificates that expire soon, asked for"]}
  - {day: "Friday", who: employee, lines: ["A plain update to each owner, on your yes", "Your week, in plain words"]}
  - {day: "Before each draw", who: t4, lines: ["The pay application written against the schedule of values", "Every lien waiver collected first"]}
proof_h: "The first business run by an AI employee is a local service company."
proof: "Scoop Dogg runs pet waste cleanup and turf care across Ventura and Santa Barbara counties. His business is smaller than a general contractor's, but the office problem is the same: work comes in while he is out doing the last job. His AI employee set up his new website and its online booking, then set up his automatic replies itself. He gets bookings every week, and he is first in ChatGPT and on Google for pet and yard cleanup in his area."
start2_h: "Name your construction company. Your employee takes off the next plan set."
connects_h: "Plugs into what your construction company runs today"
connects_sub: "Your employee works inside your project software, your plan rooms and your city's portal from the first day, with a seat of its own."
connects:
  - {name: "Projects", systems: ["Procore", "Buildertrend", "JobTread", "CoConstruct"]}
  - {name: "Bids and plans", systems: ["BuildingConnected", "Your plan rooms", "Public bid portals"]}
  - {name: "Permits and licences", systems: ["Your city's permit portal", "Your county's portal", "The state licence board"]}
  - {name: "Money", systems: ["QuickBooks", "Your lender's draw portal"]}
  - {name: "Mail and calendar", systems: ["Gmail", "Google Calendar"]}
connects_how:
  - "Your employee builds each connection itself. You sign in while it walks you through it, and no key or password is handed over."
  - "Where a system has no way in, such as a city permit portal, your employee works it through the screen, the way your office does."
  - "It can also keep the RFIs, daily logs, change orders and draws on its own, so the per-project fees become your choice."
connects_link: {text: "Can it connect to Procore or Buildertrend?", url: "/questions/can-an-ai-employee-connect-to-my-software"}
instead_h: "What your AI team takes the place of"
instead_sub: "A general contractor's office runs on people you hire or the hours you give up. Your AI team does that office work on every job at once."
instead:
  - {today: "An estimator, or your weekends on takeoffs", now: "Every plan set taken off by trade and every bid package sent and leveled."}
  - {today: "A permit expediter", now: "Every live job's permit read each morning and every inspection booked."}
  - {today: "A project accountant before each draw", now: "Pay applications written against the schedule of values, with every waiver in first."}
  - {today: "Change orders priced after the work is built", now: "Every change priced and signed before anyone builds it."}
  - {today: "Spreadsheets for sub insurance and licences", now: "Every certificate and licence checked, and renewals asked for before they lapse."}
yes_h: "Nothing reaches an owner, a sub or the city without you"
yes_sub: "Your employee does the work and shows it to you. Approve each piece, or write a standing approval so the routine work goes ahead while you are on site."
on_its_own:
  - "Reading every live job's permit status"
  - "Booking inspections on the dates you set"
  - "Reminding subs already on the job about their packages"
  - "Asking subs for certificates that expire soon"
waits:
  - "Submitting a bid"
  - "Sending a change order for signature"
  - "Sending a pay application"
  - "Sending an RFI to the architect"
approval: {who: t4, act: "Send the pay application", to: "To the owner and the lender", preview: "This period's pay application is attached, line by line against the schedule of values, with the stored materials photographed and every sub's lien waiver signed."}
price_h: "What a general contractor pays"
price_q:
  - {q: "Is there a fee per project?", a: "No. You pay as you go for the work your employee does, and every piece of work shows what it cost before you approve the next."}
  - {q: "When does a contractor need a custom agent?", a: "When you build a way of your own, such as your own draw process with a lender or your own bid forms, and you want it set up with you, with the results agreed up front."}
next_h: "Where contractors go next"
next:
  - {label: "Estimates from plans and photos", url: "/services/estimates-from-plans-and-photos", line: "How Takeoffs works through a full plan set."}
  - {label: "Can an AI employee write my estimates?", url: "/questions/can-an-ai-employee-write-my-estimates", line: "What it reads, what it checks and what it flags."}
  - {label: "Can an AI employee connect to my software?", url: "/questions/can-an-ai-employee-connect-to-my-software", line: "How it gets into Procore, your plan rooms and the city's portal."}
  - {label: "Roofing contractors", url: "/industries/roofing", line: "If you run a roofing crew as well."}
ask_prompt: "What does AMTECH AI (amtechai.com) do for a general contractor or remodeler?"
---
