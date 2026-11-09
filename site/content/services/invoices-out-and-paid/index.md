---
# /services/invoices-out-and-paid, rebuilt 2026-11-08 (lane `services`, lead `lena`) on layouts/landing.html. One
# department of work (billing and collecting) across a trucking firm, a roofer and a yard-care company. Facts and
# documents are the page's own from 2026-10-27. Every figure in a card illustrates the application.
title: "Invoices out and paid: an AI employee that bills the day the work is done"
description: "An AMTECH agent team invoices each job in QuickBooks Online or Jobber with a Stripe link the day it closes, and reminds whoever is late until the money lands."
layout: "landing"
crumb: "Getting paid"
h1a: "Every job billed"
h1b: "the day it closes."
sub: "An AI billing team that writes each invoice from the job's own record, puts a Stripe link to pay on it, reminds whoever is late, and marks it paid in your books when the money lands."
answer: "AMTECH runs getting paid end to end in place of a bookkeeper's billing hours, a collections service and invoicing add-ons. The Collections agent invoices each job in QuickBooks Online or Jobber the day it closes, adds a Stripe payment link, sends polite reminders on the owner's schedule and marks each invoice paid when Stripe or the bank feed shows the money. Follow-up answers the customer who questions a line. Customers pay into the business's own Stripe account or bank."
field: "Your business's name"
button: "Start free"
start: {config: invoices-out-and-paid}
prices: "Start free and pay as you go. Custom agents with guaranteed results from $1,200/mo."
hero_img: "img/services/svc-inv-hero.png"
hero_alt: "A white service van outside a freshly finished home at golden hour, a tradesman checking his phone"
names: {employee: "Your lead agent"}
team: [employee, t4, t2, t1, t5, t6]
panel:
  firm: "Your business"
  h: "Your team"
  rows:
    - {who: t4, state: work}
    - {who: t2, state: work}
    - {who: t1, state: idle}
    - {who: t5, state: idle}
    - {who: t6, state: wait}
  card_h: "Bills: Your business"
  steps: ["Invoiced 9 jobs finished today", "Matched 14 payments to their invoices", "Sent first reminders on 6 late bills"]
  now: "Writing your Friday note"
  total: "Every finished job billed the day it closed."
found: [{n: "9", what: "jobs billed today"}, {n: "14", what: "payments matched"}, {n: "6", what: "reminders sent"}]
offer_found: false
systems: ["QuickBooks Online", "Jobber", "Stripe", "Xero", "Housecall Pro", "Your bank feed", "Gmail", "Google Calendar"]
frame_h: "One finished job, billed and paid."
bands_h: "Billing the way each business bills."
bands:
  - who: t4
    img: "img/home/transportation.png"
    alt: "A freight truck at a loading dock in early morning light"
    h: "Each load billed with its paperwork."
    p: "The rate confirmation and the proof of delivery attached to every load's bill, or sent to the factoring portal you already use."
    doc: {kind: sheet, title: "Loads billed this week", meta: "From the rate confirmations and the signed deliveries", cols: ["Load", "Paperwork", "Where it went"], rows: [["Dallas to Tulsa", "Rate sheet and delivery proof", "Factoring portal"], ["Tulsa to Wichita", "Rate sheet and delivery proof", "Invoice to the broker"], ["Wichita to Omaha", "Waiting on the signed delivery", "Driver asked"]], foot: "The factoring advance is checked when it lands."}
  - who: t4
    img: "img/home/roofing.png"
    alt: "A roofing crew at work on a new shingle roof against a clear sky"
    h: "Deposit, progress and final, on every roof."
    p: "Each stage billed when it is reached, the insurance payment followed, and every payment matched to the roof it was for."
    doc: {kind: invoice, title: "Progress invoice: roof replacement", meta: "Second stage, from the job in Jobber", to: "The homeowner, by email and text", rows: [{item: "Tear-off and dry-in complete", note: "Photos attached"}, {item: "Shingles installed, north and east", note: "From your quote"}, {item: "Less the deposit already paid", note: "Matched in Stripe"}], due: "On receipt", pay: "Pay by card or bank"}
  - who: t4
    img: "img/landscaping/yard.png"
    alt: "A yard care worker cleaning a backyard lawn while a dog watches"
    h: "Monthly plans billed on the first."
    p: "Every weekly or monthly customer billed on the same day, with one-off jobs billed as they finish."
    doc: {kind: report, title: "Billed on the 1st", meta: "Monthly plans, from Jobber", rows: [{label: "Weekly yard cleanup", value: "Sent, with a link to pay"}, {label: "Mowing and edging", value: "Sent, with a link to pay"}, {label: "Paid by card on file", value: "Marked paid in your books"}, {label: "A card that failed", value: "Customer asked for another"}], foot: "Each line opens the invoice behind it."}
  - who: t2
    img: "img/services/svc-inv-desk.png"
    alt: "A small business owner's desk in the evening with a laptop and a stack of invoices"
    h: "Late bills reminded, politely."
    p: "A reminder on the schedule you set, in the tone you chose, stopping the moment the customer pays."
    doc: {kind: email, title: "Second reminder", meta: "Written in the tone you set", to: "The customer on Pine Hollow Road", subject: "Your invoice from 3 October", body: ["Hello again. Your invoice from 3 October is still open, and the link to pay is below.", "If something about the work or the bill is not right, reply to this email and we will sort it out.", "If you have already paid, thank you, and please ignore this note."]}
orbit_h: "Your billing team, built around your business."
grid_h: "Every business, every bill, one screen."
grid:
  offices: ["Trucking company", "Roofing company", "Yard care company"]
  lamps: [[work, idle, work, idle, idle], [work, work, idle, idle, wait], [work, work, idle, idle, idle]]
  legend: {work: "working", wait: "waiting on you", idle: "idle"}
offer_h: "Start with the jobs nobody billed."
offer_p: "Name your business and your team finds the finished jobs that were never invoiced and bills the first one today. When you want deposits, progress bills, factoring or monthly plans set up with you, with the results agreed up front, we build it together."
options:
  - {h: "Start free", p: "Your team on this week's finished jobs, then pay as you go."}
  - {h: "Custom agents", p: "Set up with you, with guaranteed results, from $1,200 a month."}
approval: {who: t4, act: "Invoice for the Ridgeway Drive gutters", to: "To the homeowner, by email and text", preview: "Gutters and downspouts as quoted, one extra downspout approved on site, less the deposit already paid. A Stripe link to pay by card or bank."}
questions_h: "Questions"
questions:
  - {q: "Where does the money go?", a: "Straight to you. Customers pay through your own Stripe account or the way they pay you now, and your team sends the link, watches for the payment and marks the invoice paid the moment it lands. Payments do not pass through AMTECH."}
  - {q: "Will the reminders upset good customers?", a: "No. You write the tone once, and you can keep any customer off the list. Reminders stop the moment the customer pays."}
  - {q: "Can it work with my factoring company?", a: "Yes. For a trucking company your team sends each load's paperwork to the factoring portal you already use, and checks that the advance arrives."}
  - {q: "Does it work with QuickBooks Online?", a: "Yes. It works inside QuickBooks Online, Xero or FreshBooks, and Jobber or Housecall Pro for the jobs. You connect each on its own screen and your team never sees a password. With no invoicing tool, it does the billing itself and keeps the record in your books."}
  - {q: "What does billing cost?", a: "Start free and pay as you go for the work done. A custom setup for your deposits, progress bills, factoring or monthly plans, with the results agreed up front, starts at $1,200 a month."}
ask_prompt: "Can AMTECH AI (amtechai.com) send my invoices and collect what customers owe?"
closing_h: "Name your business, and bill this week's work."
closing_sub: "Your team reads your site and your Google listing, finds the finished jobs that were never invoiced, and bills the first one while you watch."
site_sources: false
sources:
  - "The jobs, loads, invoices and counts shown on this page illustrate the AMTECH application; they are not a customer's job."
  - "The photographs on this page were made for it with an image model, or are the site's own; they show no real client, job or building."
reviewed: {by: "Ben Palaskas", date: "2026-11-08"}
frame:
  - who: t4
    ask: "The crew finished the Ridgeway Drive gutters today. Can the bill go out tonight?"
    reply: "Collections wrote the invoice from the job in Jobber: the work as quoted, the downspout the homeowner added on site, and a Stripe link to pay. It is below, ready to send."
    title: "Invoice for the Ridgeway Drive gutters"
    steps: ["Read the finished job and the crew's notes in Jobber", "Wrote each line from the quote the customer approved", "Added your Stripe link to pay", "Waiting for your yes to send it tonight"]
    line: "Attached the crew's before and after photos"
    doc:
      kind: invoice
      title: "Invoice: gutter replacement"
      meta: "Ridgeway Drive, from the job in Jobber"
      to: "The homeowner, by email and text"
      rows:
        - {item: "Gutters and downspouts, as quoted", note: "From your quote"}
        - {item: "Extra downspout, added on site", note: "Approved by the homeowner"}
        - {item: "Less the deposit already paid", note: "Matched in Stripe"}
      due: "On receipt"
      pay: "Pay by card or bank"
    trust: {assumed: "the extra downspout was agreed, as the crew's note says", checked: "the deposit against Stripe"}
    approve: {act: "Send to the homeowner"}
---
