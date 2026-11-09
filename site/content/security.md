---
# /security, moved 2026-11-08 (lane `company`, lead `lena`) onto layouts/landing.html. Every statement is one the platform's
# records mark built or green (WHAT-AMTECH-DOES.md §2, §3, §5, §6, read 2026-10-27). Not claimed, because no record states it:
# where AMTECH's servers are, certifications, encryption specifics, retention periods.
title: "Security: how an AMTECH AI team gets access, and what it never sees"
description: "How an AMTECH AI team signs in with its own accounts, never sees your passwords or keys, works within your standing rules, and keeps a receipt for every action."
route: "/security"
layout: "landing"
crumb: "Security"
okf_type: "Security Overview"
names: {employee: "Your lead agent"}
team: [employee, t1, t2, t3, t4, t5]
h1a: "Your business"
h1b: "stays yours."
sub: "Your AMTECH AI team works with sign-ins of its own, never sees your passwords or keys, acts within the standing rules you set in your words, and leaves a receipt for everything it does."
answer: "An AMTECH AI team signs in to your systems with accounts of its own and never sees your passwords or keys. Where a system needs your consent you approve it on that system's own screen; a mailbox password goes in through a secure card, never the conversation. Your team acts within standing rules in your words, every action leaves a receipt, and AMTECH's own access to your business ends by itself. Your business's record is yours, each team runs on its own sandboxed computer, backups are restored daily to prove they work, and closing your account leaves nothing behind."
field: "Your business's name"
button: "Book a call"
start: {industry: ""}
prices: "Custom agents with guaranteed results from $1,200/mo. Or pay as you go from $50/mo."
hero_img: "img/company/co-security-hero.png"
hero_alt: "A brass key on a wooden desk beside a closed laptop, an office door ajar behind"
panel:
  firm: "Your business"
  h: "Your team"
  rows:
    - {who: t4, state: work}
    - {who: t1, state: work}
    - {who: t2, state: wait}
    - {who: t3, state: idle}
    - {who: t5, state: idle}
  card_h: "Invoice 1042: Your business"
  steps: ["Signed in to your accounting with its own seat", "Read the invoice and its due date", "Receipt saved for each step"]
  now: "Sending the reminder you set a rule for"
  total: "Every action is on the record."
steps_h: "How your team gets access"
steps:
  - {h: "Its own sign-ins", p: "Your team has its own address and its own email address. In the systems your business already runs, it works from a seat of its own, signed in with its own address, never with your password or your code."}
  - {h: "You sign in on the system's own screen", p: "Where a system needs your consent, such as your Google account or a vendor's connector, you sign in on that system's own screen and approve it there. Your team receives the access, never your password."}
  - {h: "Passwords never pass through the conversation", p: "A mailbox password goes in through a secure card, never typed into the chat. Keys are held behind sealed adapters, outside the model's reach: your team's own setup carries only a pointer to them."}
  - {h: "Only signed events get in", p: "When a service such as Stripe, Shopify or Calendly sends your team an event, it arrives on a route your team made with that service's own signing secret. Nothing unsigned gets in."}
bands_h: "Everything on the record"
bands:
  - who: t4
    img: "img/company/co-security-receipt.png"
    alt: "A stack of paper receipts and a ledger on a small shop office desk"
    h: "A receipt for every action."
    p: "Every action your team takes leaves a receipt you can open: what it did, where, and when. Your week arrives in plain words, and every line in it comes from a receipt. Every call to the AI models it thinks with goes through AMTECH's gateway, metered and recorded, so nothing is spent on a key nobody named. Finished work carries a trust line: what your team assumed, what it could not see, and what it checked."
    doc: {kind: report, title: "Receipt: invoice reminder", meta: "Saved when it was done", rows: [{label: "Who", value: "Your finance agent"}, {label: "What it did", value: "Sent the reminder for invoice 1042"}, {label: "Where", value: "Your accounting, then the customer's inbox"}, {label: "When", value: "This morning"}, {label: "Assumed", value: "The due date on the invoice"}, {label: "Checked", value: "That it was still unpaid"}], foot: "Every line in your week comes from a receipt like this."}
  - who: t1
    img: "img/company/co-security-signin.png"
    alt: "A person at a laptop in a back office, a phone beside it, seen from behind"
    h: "You set the rules. You see who has a seat."
    p: "You give standing approvals in your own words for the routine work, and you can revoke any of them. Your standing approvals are shown to you and enforced. You decide who else works with your team and what each can do: owner, manager, member, approver, spender, biller or inviter. A member can be given one agent and nothing else. An agency runs each client's business as its own organisation, and a person in several businesses sees only the ones they belong to."
    doc: {kind: sheet, title: "Seats on your account", meta: "You choose each one", cols: ["Person", "Seat", "Works with"], rows: [["You", "Owner", "Your whole team"], ["Your office manager", "Manager", "Your whole team"], ["Your bookkeeper", "Biller", "The finance agent"], ["A new hire", "Member", "One agent"]], foot: "Who can do what is checked across every combination of people, businesses and agents."}
  - who: t5
    img: "img/company/co-security-access.png"
    alt: "A wall of hooks by an office door with one set of keys hung up"
    h: "AMTECH's access ends by itself."
    p: "When AMTECH needs into your business, for a setup or a fix, that access ends by itself, and you see it end. Your business's record is yours: its customers, prices, rules, jobs and files, all open to you in your account. Each team runs on its own sandboxed computer, apart from every other business's, and nothing on AMTECH's servers runs unless it is guarded. Backups are kept off the server and restored every day to prove they work, and if anything stops, AMTECH is told straight away. Close your account and nothing of your business stays behind with AMTECH."
    doc: {kind: sheet, title: "Who has access", meta: "Shown in your account", cols: ["Who", "Access", "Ends"], rows: [["Your team", "Its own sign-ins", "When you close your account"], ["AMTECH, for a setup", "Opened for the job", "By itself, and you see it end"], ["The people you added", "The seat you gave them", "When you change their seat"]], foot: "Closing your account leaves nothing of your business behind."}
cards_h: "Where to go next"
cards:
  - {h: "Can an AI employee connect to my software?", p: "How it signs in to what you run.", href: "/questions/can-an-ai-employee-connect-to-my-software"}
  - {h: "Pricing", p: "Pay as you go from $50 a month, or custom agents from $1,200/mo.", href: "/pricing"}
  - {h: "About AMTECH", p: "The company, its founder, and how to reach us.", href: "/about"}
  - {h: "Privacy", p: "AMTECH's privacy policy, in full.", href: "/privacy"}
offer_h: "Name your business. You stay in charge."
offer_p: "Your AI team works with sign-ins of its own and a receipt for everything it does. Book a call to see it on your business."
options:
  - {h: "Pay as you go", p: "Your team on your real work, then pay as you go."}
  - {h: "Custom agents", p: "Set up with you, with guaranteed results, from $1,200 a month."}
questions_h: "Questions about security"
questions:
  - {q: "Does my AI team know my passwords?", a: "No. It signs in with accounts of its own. Where a system needs your consent, you sign in on that system's own screen, and a mailbox password goes in through a secure card, never through the conversation."}
  - {q: "Can it act without me?", a: "Only what a standing approval in your own words covers. Everything else is left to you, and you can revoke a standing approval at any time."}
  - {q: "Can I see what it did?", a: "Yes. Every action leaves a receipt you can open, finished work says what was assumed and checked, and your week arrives in plain words with every line from a receipt."}
  - {q: "Can AMTECH see into my business?", a: "Only when you need it to, for a setup or a fix, and that access ends by itself. You see it end."}
  - {q: "Who else can use my AI team?", a: "Only the people you add, with the seat you give them. A member can be given a single employee and nothing more."}
  - {q: "Who owns what my AI team learns?", a: "You do. It is kept as your business's own record, and you can open all of it in your account."}
  - {q: "What happens when I close my account?", a: "Nothing of your business stays behind with AMTECH."}
ask_prompt: "How does AMTECH AI (amtechai.com) keep my business's passwords and data safe?"
closing_h: "Your business stays yours."
closing_sub: "Name it and book a call. Your agents work with sign-ins of their own."
site_sources: false
sources:
  - "The price line: AMTECH's price list, October 2026."
  - "How access, standing approvals, receipts, backups and account closing work: AMTECH's platform records and their tests, read 27 October 2026."
  - "The documents shown on this page illustrate the AMTECH application; they are not a customer's account."
reviewed: {by: "Ben Palaskas", date: "2026-11-08"}
---
