---
# /security (lane PAGES2, 2026-10-27; shapes.json h:company "security draws where keys live"). Every statement is one
# the platform's records mark built or green (WHAT-AMTECH-DOES.md §2, §3, §5, §6, read 2026-10-27). Not claimed, because
# no record states it: where AMTECH's servers are, certifications, encryption specifics, retention periods.
title: "Security: how an AMTECH AI employee gets access, and what it never sees"
description: "How an AMTECH AI employee signs in with its own accounts, never sees your passwords or keys, waits for your yes, and keeps a receipt for every action."
route: "/security"
layout: "company"
crumb: "Security"
okf_type: "Security Overview"
h1a: "Your business stays yours."
h1b: "Every action on the record."
sub: "An AMTECH AI employee works with sign-ins of its own, never sees your passwords or keys, does nothing outward without your yes or a standing approval in your words, and leaves a receipt for everything it does."
field: "Your business's name"
button: "Start"
hero:
  kind: card
  who: t4
  act: "Send the reminder for invoice 1042"
  to: "To the customer, after your yes"
  preview: "A friendly reminder that the invoice for last week's job is due, with the payment link."
  receipts:
    - "Signed in to your accounting with its own seat"
    - "Read the invoice and its due date"
    - "Waiting for your yes to send"
blocks:
  - kind: points
    g: g-paper
    numbered: true
    h: "How your employee gets access"
    sub: "Your employee never borrows your identity. It has its own, and you see every door it opens."
    rows:
      - {h: "Its own sign-ins", p: "Your employee has its own address and its own email address. In the systems your business already runs, it works from a seat of its own, signed in with its own address, never with your password or your code."}
      - {h: "You sign in on the system's own screen", p: "Where a system needs your consent, such as your Google account or a vendor's connector, you sign in on that system's own screen and approve it there. Your employee receives the access, never your password."}
      - {h: "Passwords never pass through the conversation", p: "A mailbox password goes in through a secure card, never typed into the chat. Keys are held behind sealed adapters, outside the model's reach: your employee's own setup carries only a pointer to them."}
      - {h: "Only signed events get in", p: "When a service such as Stripe, Shopify or Calendly sends your employee an event, it arrives on a route your employee made with that service's own signing secret. Nothing unsigned gets in."}
  - kind: yes
    h: "Nothing goes out without you"
    sub: "Your employee does the work and shows it to you. You approve it, or give a standing approval in your own words for the routine work. Your standing approvals are shown to you, enforced, and you can revoke any of them."
    own:
      - "Reading your inbox and sorting what came in"
      - "Follow-up on quotes you have already sent"
      - "The morning numbers and the weekly report"
    waits:
      - "An email or a text to a customer"
      - "An estimate, an invoice or a payment request"
      - "A page going live on your website"
      - "Anything a standing approval does not cover"
  - kind: points
    grid: 3
    h: "Everything on the record"
    rows:
      - {h: "A receipt for every action", p: "Every action your employee takes leaves a receipt you can open: what it did, where, and when. Your week arrives in plain words, and every line in it comes from a receipt."}
      - {h: "Every model call metered", p: "Every call your employee makes to the AI models it thinks with goes through AMTECH's gateway, metered and recorded. Nothing is spent on a key nobody named."}
      - {h: "The work shows its working", p: "Finished work carries a trust line: what your employee assumed, what it could not see, and what it checked."}
  - kind: points
    g: g-paper
    h: "AMTECH's own access, and the people on your account"
    rows:
      - {h: "AMTECH's access ends by itself", p: "When AMTECH needs into your business, for a setup or a fix, that access ends by itself, and you see it end."}
      - {h: "People with the right seat", p: "You decide who else works with your employee and what each can do: owner, manager, member, approver, spender, biller or inviter. A member can be given one employee and nothing else."}
      - {h: "Agencies and several businesses", p: "An agency runs each client's business as its own organisation, and a person in several businesses sees only the ones they belong to. Who can do what is checked across every combination of people, businesses and employees."}
  - kind: points
    grid: 4
    h: "Your data"
    rows:
      - {h: "Your business's record is yours", p: "Everything your employee learns is kept as your business's own record: its customers, prices, rules, jobs and files. You can open all of it in your account."}
      - {h: "Each employee on its own computer", p: "Every employee runs in its own sandboxed computer, apart from every other business's. Nothing on AMTECH's servers runs unless it is guarded."}
      - {h: "Backups that are proven", p: "Backups are kept off the server and restored every day, to prove they work. If anything stops, AMTECH is told straight away."}
      - {h: "Closing your account leaves nothing behind", p: "Close your account and nothing of your business stays behind with AMTECH."}
  - kind: faq
    g: g-paper
    h: "Questions about security"
  - kind: next
    h: "Where to go next"
    rows:
      - {label: "Can an AI employee connect to my software?", url: "/questions/can-an-ai-employee-connect-to-my-software", line: "How it signs in to what you run."}
      - {label: "Pricing", url: "/pricing", line: "Start free and pay as you go, or custom agents from $1,200/mo."}
      - {label: "About AMTECH", url: "/about", line: "The company, its founder, and how to reach us."}
      - {label: "Privacy", url: "/privacy", line: "AMTECH's privacy policy, in full."}
questions:
  - {q: "Does my AI employee know my passwords?", a: "No. It signs in with accounts of its own. Where a system needs your consent, you sign in on that system's own screen, and a mailbox password goes in through a secure card, never through the conversation."}
  - {q: "Can it send something without me?", a: "Only what a standing approval in your own words covers. Everything else waits for your yes, and you can revoke a standing approval at any time."}
  - {q: "Can I see what it did?", a: "Yes. Every action leaves a receipt you can open, finished work says what was assumed and checked, and your week arrives in plain words with every line from a receipt."}
  - {q: "Can AMTECH see into my business?", a: "Only when you need it to, for a setup or a fix, and that access ends by itself. You see it end."}
  - {q: "Who else can use my employee?", a: "Only the people you add, with the seat you give them. A member can be given a single employee and nothing more."}
  - {q: "Who owns what my employee learns?", a: "You do. It is kept as your business's own record, and you can open all of it in your account."}
  - {q: "What happens when I close my account?", a: "Nothing of your business stays behind with AMTECH."}
closing_h: "Name your business. You stay in charge."
closing_sub: "Your employee starts on your business now, and nothing goes out until you say yes."
sources:
  - "The price line: AMTECH's price list, October 2026."
  - "How access, approvals, receipts, backups and account closing work: AMTECH's platform records and their tests, read 27 October 2026."
  - "The invoice reminder shown waiting for a yes illustrates the AMTECH application; it is not a customer's job."
site_sources: false
reviewed: {by: "Ben Palaskas", date: "2026-10-27"}
---
