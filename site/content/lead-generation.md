---
# /lead-generation, 2026-11-08 (session `lena`) on layouts/landing.html. Ben: a page for lead generation and data agencies
# (the kind of business Eli's is: lists at volume across many sources, the owner or person who runs each business named
# with their role, the data sent on to other systems, email flows). Eli is never named. The action is a call, as on
# /real-estate. Every list, business and figure inside a card illustrates the application. Photographs: gpt-image-2.5.
title: "AI agent teams for lead generation and data agencies"
description: "A custom team of AI agents that finds the businesses, names the owner of each, checks how to reach them and sends the list wherever your clients work."
route: "/lead-generation"
layout: "landing"
crumb: "Lead generation"
okf_type: "Business Type"
llms: {order: 32, label: "Lead generation", text: "Custom AI agent teams for lead generation and data agencies: businesses found across many sources, the owner or person who runs each one named with their role, contacts checked, lists delivered to any CRM, and outreach written. Engagements from $1,200/mo."}
names: {employee: "Your lead agent", t5: "Sourcing", t1: "Owner Finder", t3: "Verification", t4: "Delivery", t2: "Outreach", t6: "Builder"}
team: [employee, t5, t1, t3, t4, t2, t6]
h1a: "Better lists,"
h1b: "at any size."
sub: "A custom team of AI agents that finds the businesses, names the owner or person who runs each one, checks how to reach them, and sends the list wherever your clients work."
answer: "AMTECH builds custom teams of AI agents for lead generation and data agencies. The agents search maps, state business records, directories and each business's own website; name the owner or the person who runs each business, with their role and the source; check every email and phone; deliver the list to the client's CRM, sheet or email platform; and write the outreach."
field: "Your company's name"
button: "Book a call"
book: {industry: "Lead generation and data", topic: "A lead generation agent team"}
prices: "Custom agents with guaranteed results from $1,200 a month. Or pay as you go from $50 a month."
hero_img: "img/lead-generation/hero.png"
hero_alt: "A quiet office at night, two monitors glowing above a city of lights"
panel:
  firm: "Your agency"
  h: "Your team"
  rows:
    - {who: t5, state: work}
    - {who: t1, state: work}
    - {who: t3, state: work}
    - {who: t4, state: wait}
    - {who: t2, state: idle}
  card_h: "List: Pet stores, Texas"
  steps: ["Found 4,120 stores from maps and state records", "Named the owner of 3,388, each with a role", "Checked every email and phone"]
  now: "Sending the list to your client's CRM"
  total: "The cost of every row, shown on the list."
found: [{n: "4,120", what: "businesses found"}, {n: "3,388", what: "owners named"}, {n: "3", what: "lists running"}]
offer_found: false
systems: ["Google Maps", "State business records", "Your CRM", "Google Sheets", "HubSpot", "Instantly", "Gmail", "Webhooks"]
frame_h: "One list, start to finish."
bands_h: "Every part of the list, done."
bands:
  - who: t5
    img: "img/lead-generation/owners.png"
    alt: "A main street of small independent shops in the morning"
    h: "Every business, from every source."
    p: "Maps, state records, directories and each business's own site, searched together and cleaned of duplicates."
    doc: {kind: sheet, title: "Sources for this list", meta: "Pet stores, Texas", cols: ["Source", "Found", "New to the list"], rows: [["Maps listings", "3,640", "3,640"], ["State business records", "2,910", "318"], ["Directories and websites", "1,220", "162"]], foot: "Chains and closed stores left out."}
  - who: t1
    img: "img/lead-generation/verify.png"
    alt: "A shop owner on the phone behind her counter"
    h: "The person who runs it, by name."
    p: "The owner or manager of each business, with their role labelled and where the name came from."
    doc: {kind: sheet, title: "Owners found", meta: "Each with its source", cols: ["Business", "Person", "Role"], rows: [["Paws on Main, Austin", "Named", "Owner"], ["The Feed Barn, Waco", "Named", "Owner and manager"], ["Lone Star Pets, Tyler", "Named", "Store manager"]], foot: "A role is never guessed: unknown stays unknown."}
  - who: t4
    img: "img/lead-generation/crm.png"
    alt: "A bright records room with rows of archive boxes"
    h: "Delivered where your clients work."
    p: "Lists sent to your client's CRM, sheet or email tool, and kept current as businesses change."
    doc: {kind: sheet, title: "Delivered", meta: "This week", cols: ["Where", "Rows", "Status"], rows: [["Client CRM", "3,388", "Sent"], ["Google Sheet", "3,388", "Shared"], ["Email tool", "2,960", "Ready for the first send"]], foot: "Changed businesses are updated every week."}
  - who: t2
    img: "img/lead-generation/outreach.png"
    alt: "An open-plan sales office in the early morning"
    h: "Outreach that sounds like a person."
    p: "First emails and follow-ups written for each person from what the list found about their business."
    doc: {kind: email, title: "First email", meta: "Written from the list", to: "The owner of Paws on Main, Austin", subject: "Your second store on South Lamar", body: ["Congratulations on the new South Lamar store.", "We help pet stores in Austin with exactly this stage. Would a short call next week be useful?"]}
orbit_h: "Your team, built around your agency."
grid_h: "Every list, every team, one screen."
grid:
  offices: ["Pet stores, Texas", "HVAC owners, Florida", "Dental practices, Ohio"]
  lamps: [[work, work, work, wait, idle], [work, work, idle, work, work], [idle, work, work, idle, wait]]
  legend: {work: "working", wait: "waiting on you", idle: "idle"}
offer_h: "See the team for your lists."
offer_p: "Tell us what your clients buy. On the call we show the team we would build for your agency and run a sample of a real list."
options:
  - {h: "Your own lists", p: "A team for the lists you sell."}
  - {h: "Lead generation agency", p: "A team for every client's market, on one screen."}
  - {h: "Custom agents", p: "Set up with you, with guaranteed results, from $1,200 a month."}
approval: {who: t2, act: "First emails to 2,960 owners", to: "From your client's domain, in batches", preview: "Congratulations on the new South Lamar store."}
questions_h: "Questions"
questions:
  - {q: "Where do the owner names come from?", a: "Public sources: state business records, maps listings, directories and each business's own website. Every name keeps the source it came from, and a role is never guessed."}
  - {q: "How big can a list be?", a: "As big as the market. The team works in batches, and every list shows what each row cost."}
  - {q: "Can it send the data into our tools?", a: "Yes. Lists go to your client's CRM, a Google Sheet, an email tool or any system with a webhook, and stay current as businesses change."}
  - {q: "What does it cost?", a: "Custom agents set up with you, with guaranteed results, start at $1,200 a month. You can also pay as you go for the work done, from $50 a month."}
ask_prompt: "What does AMTECH AI (amtechai.com) do for a lead generation agency?"
closing_h: "Your next list could be running tonight."
closing_sub: "Tell us what your clients buy and we will show you the team for it."
site_sources: false
sources:
  - "The lists, businesses, people and figures shown on this page illustrate the AMTECH application; they are not a customer's list."
reviewed: {by: "Ben Palaskas", date: "2026-11-08"}
frame:
  - who: t5
    ask: "Find me the owners of independent pet stores in Texas, with a phone and an email for each."
    reply: "Sourcing found 4,120 stores. Owner Finder named the person who runs 3,388 of them, Verification checked every email and phone, and the list is ready to send to the client."
    title: "Independent pet store owners, Texas"
    steps: ["Searched maps, state records and the stores' own sites", "Named the owner or manager of 3,388 stores", "Checked every email and phone", "Waiting for your yes to send it to the client"]
    line: "Left out 214 stores that belong to chains"
    doc: {kind: sheet, title: "Pet store owners, Texas", meta: "From maps, state records and each store's site", cols: ["Store", "Person", "Checked"], rows: [["Paws on Main, Austin", "Owner, named", "Email and phone"], ["The Feed Barn, Waco", "Owner, named", "Email and phone"], ["Lone Star Pets, Tyler", "Manager, named", "Phone only"]], foot: "Every person has the source the name came from."}
    trust: {assumed: "independent means fewer than three locations", checked: "every email with a live mailbox check"}
    approve: {act: "Send to the client"}
---
