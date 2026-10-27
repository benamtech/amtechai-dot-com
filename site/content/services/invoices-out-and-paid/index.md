---
title: "Invoices out and paid: an AI employee that bills the day the work is done"
description: "An AMTECH AI employee and its Collections teammate send each invoice from QuickBooks Online or Jobber with a Stripe link, and remind whoever is late."
crumb: "Getting paid"
h1a: "Every invoice out the day the job is done, and"
h1b: "the money in."
sub: "AMTECH runs getting paid end to end, in place of the bookkeeper's billing hours, the collections service and the invoicing add-ons. Your AI employee and its Collections teammate invoice each job in QuickBooks Online or Jobber the day it closes, put a Stripe payment link on it, chase whoever is late and mark it paid when the money lands; Follow-up answers the customer who questions a line."
field: "Your business's name"
button: "Start the free trial"
names: {}
systems_more: ["Gmail", "Your bank feed"]
live: {who: t4, title: "Second reminder on the invoice from 3 October", step: "Step 2 of 3: written politely, ready for your yes"}
manifest_h: "What it takes off your desk"
employee_does: "Watches your jobs for the one that just finished, makes sure it gets billed the same day, and tells you every Friday what is owed, by whom and since when."
team_detail:
  - {id: t4, does: "Writes each invoice from the job's own record, adds the Stripe link, sends it under your approval, and chases the late ones on the schedule you set until they pay."}
  - {id: t2, does: "Answers the customer who questions a line or asks for more time, in your words, and brings any request for a discount to you."}
connects_note: "Your employee reads payments from Stripe and your bank feed and marks each invoice paid in QuickBooks Online, so your books are right without anyone typing them in."
routines:
  - "Every evening: the jobs finished today invoiced, waiting for your OK."
  - "Every Friday: who owes what and since when, in plain words, with the reminders ready to go on your yes."
first_jobs:
  - "Invoice every finished job that has not been billed"
  - "Send a first reminder on everything over thirty days"
  - "Match last month's Stripe payments to their invoices in QuickBooks Online"
for_h: "Who uses it"
for_sub: "Any service business that invoices after the work, and waits too long to be paid."
industries:
  - {slug: transportation, line: "Each load billed with its rate confirmation and proof of delivery, or sent to the factoring portal."}
  - {slug: landscaping, line: "Monthly maintenance billed on the first, and one-off jobs billed the day they finish."}
  - {slug: roofing, line: "Deposit, progress and final invoices on every roof, and the insurance payment followed."}
questions_h: "Questions about getting paid"
asked:
  - {text: "Can an AI employee connect to the software my business already uses?", href: "/questions/can-an-ai-employee-connect-to-my-software"}
  - {text: "Can an AI employee follow up every lead for me?", href: "/questions/can-an-ai-employee-follow-up-every-lead"}
questions:
  - {q: "Where does the money go?", a: "Straight to you. Customers pay through your own Stripe account or the way they pay you now, and your employee sends the link, watches for the payment and marks the invoice paid the moment it lands."}
  - {q: "Will the reminders upset good customers?", a: "No. You write the tone once, every reminder waits for your OK until you trust it, and you can keep any customer off the list."}
  - {q: "Can it work with my factoring company?", a: "Yes. For a trucking company your employee sends each load's paperwork to the factoring portal you already use, and checks that the advance arrives."}
closing_h: "Name your business, and bill this week's work."
closing_sub: "Your employee reads your site and your Google listing, finds the finished jobs that were never invoiced, and invoices the first one while you watch."
frame_h: "Watch a finished job get billed and paid"
frame:
  - tab: "The job just finished"
    who: t4
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
  - tab: "A late one"
    who: t4
    ask: "Who still owes us from early October?"
    reply: "The invoice from 3 October is still open. Collections sent a friendly first reminder last week under your standing approval. The second one is below and waits for you."
    title: "Second reminder on the invoice from 3 October"
    steps: ["Found the invoice still open after the first reminder", "Checked Stripe and your bank feed: nothing received", "Wrote the second reminder in the tone you set", "Waiting for your yes to send it"]
    line: "Put the pay link at the top"
    doc:
      kind: email
      title: "Second reminder"
      meta: "Written in the tone you set"
      to: "The customer on Pine Hollow Road"
      subject: "Your invoice from 3 October"
      body:
        - "Hello again. Your invoice from 3 October is still open, and the link to pay is below."
        - "If something about the work or the bill is not right, reply to this email and we will sort it out."
        - "If you have already paid, thank you, and please ignore this note."
    trust: {assumed: "no cheque is on its way", checked: "Stripe and your bank feed this morning"}
    approve: {act: "Send the reminder"}
  - tab: "Friday's money"
    who: employee
    ask: "Where do we stand on money owed this week?"
    reply: "Your Friday note is below: what is owed, how late, and the reminder ready for each. This week's payments are already marked paid in QuickBooks Online."
    title: "Who owes you, this Friday"
    steps: ["Read every open invoice in QuickBooks Online", "Matched this week's Stripe and bank payments", "Sorted what is still owed by how late it is", "Waiting for your yes to send the reminders"]
    line: "Marked this week's payments paid in QuickBooks Online"
    doc:
      kind: report
      title: "Money owed to you"
      meta: "This Friday, from QuickBooks Online"
      rows:
        - {label: "Paid this week", value: "Marked paid in your books"}
        - {label: "Due, not yet late", value: "Nothing to do"}
        - {label: "Up to 30 days late", value: "First reminder ready"}
        - {label: "Over 30 days late", value: "Second reminder ready"}
        - {label: "Questioned by the customer", value: "Answered by Follow-up"}
        - {label: "Finished but never billed", value: "Invoiced tonight"}
      foot: "Every line opens the invoices behind it."
    trust: {assumed: "the reminder schedule you set", checked: "every payment against its invoice"}
    approve: {act: "Send the reminders"}
work_h: "How getting paid runs, start to finish"
work_steps:
  - {h: "The job closes, the bill is written", p: "The day a job is marked done in Jobber, Collections writes each line from the approved quote and the crew's notes, with what changed on site."}
  - {h: "It goes out with a link to pay", p: "Once you say yes, the invoice goes by email and text, with a Stripe link to pay by card or bank."}
  - {h: "Late ones get reminded", p: "A polite reminder goes out on the schedule you set, and stops the moment the customer pays."}
  - {h: "Questions get answered", p: "If a customer questions a line, Follow-up answers from the job's record and brings any discount request to you."}
  - {h: "Your books stay right", p: "When the money lands, the invoice is marked paid in QuickBooks Online. Nobody types it in."}
start2_h: "Name your business. The jobs nobody billed come first."
week_h: "A week of getting paid"
week:
  - {day: "Monday", who: t4, lines: ["The weekend's finished jobs invoiced", "Payments that landed matched to their invoices"]}
  - {day: "Tuesday", who: t4, lines: ["First reminders on bills a week late"]}
  - {day: "Wednesday", who: t2, lines: ["Questions about a bill answered from the job's record", "Requests for more time brought to you"]}
  - {day: "Thursday", who: employee, lines: ["QuickBooks Online checked against Stripe and the bank", "Finished jobs that were never billed, caught"]}
  - {day: "Friday", who: employee, lines: ["Who owes what and since when, in plain words", "Next week's reminders ready for your yes"]}
  - {day: "On the 1st", who: t4, lines: ["Monthly plans billed to every customer on one"]}
instead_h: "What getting paid costs you now"
instead_sub: "Most businesses pay a person, a service and an add-on to send bills and chase them. Your billing team does all three, from the day the job closes."
instead:
  - {today: "A bookkeeper's billing hours", now: "Every finished job invoiced the same day, from the job's own record."}
  - {today: "A collections service and its cut", now: "Polite reminders on your schedule, in your tone, until the bill is paid."}
  - {today: "Invoicing and payment-reminder add-ons", now: "Your employee does that job itself, inside QuickBooks Online or Jobber."}
  - {today: "Typing payments into the books", now: "Each payment matched to its invoice and marked paid, with nobody typing."}
  - {today: "Your Friday night with a spreadsheet", now: "A plain Friday note: who owes what, since when, and what goes out next."}
  - {today: "Jobs nobody remembered to bill", now: "Found in your job records, and billed."}
connects_h: "Works where your money already moves"
connects_sub: "Your employee works inside your accounts with a sign-in of its own. Customers pay you directly, the way they do now."
connects:
  - {name: "Jobs", systems: ["Jobber", "Housecall Pro", "ServiceTitan", "Google Calendar"]}
  - {name: "Books", systems: ["QuickBooks Online", "Xero", "FreshBooks"]}
  - {name: "Payments", systems: ["Stripe", "Square", "Your bank feed", "Your factoring portal"]}
  - {name: "Messages", systems: ["Gmail", "Text messages"]}
connects_how:
  - "You connect Stripe and QuickBooks Online on their own screens. Your employee never sees a password."
  - "Customers pay the way they do now, or with a link to pay on every invoice."
  - "No invoicing tool? Your employee does the billing itself and keeps the record in your books."
connects_link: {text: "How your employee connects to your books", url: "/questions/can-an-ai-employee-connect-to-my-software"}
yes_h: "You set the rules for every bill"
yes_sub: "Your employee shows you each invoice and each reminder. Say yes, or set a standing approval, such as every invoice that matches its quote."
on_its_own:
  - "Matching payments to invoices and marking them paid"
  - "Invoicing a job that matches its approved quote"
  - "Sending the first polite reminder"
  - "Telling you every Friday who owes what"
waits:
  - "An invoice that differs from the quote"
  - "A second or third reminder"
  - "Any discount, refund or payment plan"
  - "Writing off a bill that will not be paid"
approval: {who: t4, act: "Send the invoice for the Ridgeway Drive gutters", to: "To the homeowner, by email and text, after your yes", preview: "Gutters and downspouts as quoted, one extra downspout the homeowner approved on site, less the deposit already paid. A Stripe link to pay by card or bank."}
price_h: "What billing costs"
price_q:
  - {q: "Do payments pass through AMTECH?", a: "No. Customers pay into your own Stripe account or your bank, the way they pay you now."}
  - {q: "What does a custom setup add?", a: "Billing set up with you for your deposits, progress bills, factoring or monthly plans, with the results agreed up front."}
next_h: "Read next"
next:
  - {label: "Can an AI employee connect to my software?", url: "/questions/can-an-ai-employee-connect-to-my-software", line: "How it signs in to QuickBooks Online, Jobber and Stripe."}
  - {label: "Estimates from plans and photos", url: "/services/estimates-from-plans-and-photos", line: "Where the bill starts: the estimate the customer said yes to."}
  - {label: "Can an AI employee follow up every lead?", url: "/questions/can-an-ai-employee-follow-up-every-lead", line: "The same steady follow-up, before the job instead of after."}
  - {label: "Transportation and logistics", url: "/industries/transportation", line: "Each load billed with its paperwork, or sent to factoring."}
  - {label: "Roofing", url: "/industries/roofing", line: "Deposit, progress and final bills on every roof."}
ask_prompt: "Can AMTECH AI (amtechai.com) send my invoices and collect what customers owe?"
reviewed: {by: "Ben Palaskas", date: "2026-10-27"}
---
