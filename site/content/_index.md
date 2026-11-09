---
# Home, rebuilt 2026-11-08 (session `lena`) on layouts/landing.html, the /real-estate pattern: photographs with the
# application's own cards on them, few words set large, one action. Ben: "less clutter", "more images"; then: "we need to
# communicate not the specific implementation for contractors ... but that amtech is custom agent swarms for SMB's, but
# explained in language they would understand ... the landing pages, industry pages etc would have those more
# specific-icp type details". So the home names no trade's paperwork: the agents carry department names an owner already
# uses, and the examples run across kinds of business. What AMTECH may say it is comes from brain/proof.md; the price
# line is the site's own (brain/pricing.md). Every figure inside a card illustrates the application.
llms: { order: 1, label: "AMTECH", text: "AMTECH builds custom teams of AI agents for small and mid-sized businesses: a team made for each business, working together inside the software it already runs, with one screen where the owner directs, watches and improves every agent." }
title: "AMTECH: custom AI agent teams for small and mid-sized businesses"
description: "AMTECH builds a custom team of AI agents for your business: they work together inside your software and you run them all from one screen. Book a call."
route: "/"
layout: "landing"
crumb: "AMTECH"
names: {employee: "Your lead agent", t1: "Operations", t2: "Sales", t3: "Marketing", t4: "Finance", t5: "Research", t6: "Builder"}
team: [employee, t2, t3, t4, t5, t1, t6]
h1a: "A custom AI team"
h1b: "for your business."
sub: "Tell us what your business does. AMTECH builds a team of AI agents just for it: each takes a part of the work, they work together inside the tools you already use, and you see everything they do on one screen."
answer: "AMTECH builds custom teams of AI agents for small and mid-sized businesses. A lead agent learns how the business runs and builds a team of specialist agents for its work, such as sales, marketing, finance, research and operations; the agents work together inside the business's own software, and the owner directs, watches and improves all of them from one screen."
app:
  name: "AMTECH"
  category: "Custom AI agent teams for businesses"
  features: ["A team of AI agents built from a description of the business", "Agents that work together and hand work to each other", "Each agent connected to the business's own software, with its own sign-in", "One screen to direct every agent and see its work, live", "Standing rules in plain words, a receipt for every action, and the cost of every job", "A team for each business, location, store or client, on one account"]
  offers:
    - {name: "Pay as you go", price: "50", description: "Pay as you go from $50 a month in credits, for the work done."}
    - {name: "Custom agents", price: "1200", description: "Custom agents set up with you, with guaranteed results, from $1,200 a month."}
field: "Your business's name"
button: "Book a call"
start: {industry: ""}
prices: "Custom agents with guaranteed results from $1,200/mo. Or pay as you go from $50/mo."
hero_img: "img/home/hero.png"
hero_alt: "A company office at dawn, with work trucks lined up in the yard outside the window"
panel:
  firm: "Your business"
  h: "Your agents"
  rows:
    - {who: t2, state: work}
    - {who: t3, state: work}
    - {who: t4, state: wait}
    - {who: t5, state: work}
    - {who: t1, state: idle}
  card_h: "Before 9am: Your business"
  steps: ["Found 120 new prospects and their owners", "Put six new products live on your store", "Matched 14 payments in your books"]
  now: "Writing this week's customer email"
  total: "31 jobs finished before you opened your email."
found: [{n: "6", what: "agents on your team"}, {n: "31", what: "jobs finished today"}, {n: "9", what: "tools connected"}]
offer_found: false
systems: ["QuickBooks", "Gmail", "Shopify", "Your CRM", "Stripe", "Google Business Profile", "Your website", "Google Calendar"]
frame_h: "Ask in a sentence. Your team does the work."
bands_h: "How your AI team works."
bands:
  - who: employee
    img: "img/home/build.png"
    alt: "A small company's equipment yard at sunrise"
    h: "Built for your business, not off a shelf."
    p: "Your lead agent reads your website, your listing and your tools, then builds an agent for each part of the work it finds."
    doc: {kind: sheet, title: "Your team, built this morning", meta: "From your website, your listing and your books", cols: ["Agent", "Its job", "Works in"], rows: [["Sales", "Every lead and quote", "Gmail, your CRM"], ["Marketing", "Your site, posts and email", "Your website, Google"], ["Finance", "Invoices, payments, books", "QuickBooks, Stripe"]], foot: "Every business gets a different team: the work decides it."}
  - who: t5
    img: "img/home/connect.png"
    alt: "Plans and a hard hat on a table in a site office"
    h: "Inside the tools you already use."
    p: "Each agent signs in to your software with its own login, and works through the screen where there is no other way in."
    doc: {kind: sheet, title: "Connections", meta: "Your tools and the agents that use them", cols: ["Tool", "Used by", "Status"], rows: [["Shopify", "Operations", "Connected"], ["QuickBooks", "Finance", "Connected"], ["A supplier's portal", "Research", "Through the screen"]], foot: "You sign in once. No agent ever sees a password."}
  - who: t2
    img: "img/home/run.png"
    alt: "A restaurant kitchen during afternoon prep"
    h: "Working together, and you can see it."
    p: "Agents hand work to each other, and one screen shows what each is doing, what it finished and what it needs from you."
    doc: {kind: sheet, title: "Today", meta: "Across your agents, live", cols: ["Agent", "Working on", "State"], rows: [["Research", "40 new prospects", "Handed to Sales"], ["Sales", "First emails to the 40", "Working"], ["Finance", "Four late invoices", "Waiting on you"]], foot: "Every job shows what was read, written and checked."}
  - who: t4
    img: "img/home/govern.png"
    alt: "A family business back office at dusk, a desk lamp lit over a quiet main street"
    h: "Your rules, your records, your costs."
    p: "Say in plain words what each agent may do on its own. Every action leaves a receipt, and every job shows what it cost."
    doc: {kind: sheet, title: "Standing rules", meta: "Written by you, in your words", cols: ["Agent", "Goes ahead on its own", "Limit"], rows: [["Finance", "Reminders on overdue invoices", "Up to 30 days late"], ["Sales", "Replies to new leads", "Your prices only"], ["Builder", "Edits to your website", "Pages you approved"]], foot: "Change a rule in a sentence; the team follows it from the next job."}
orbit_h: "One team, built around your business."
industries_h: "Made for the way your business works."
industries:
  - {label: "Real estate", line: "Sellers, leases and off-market deals found every morning.", href: "/real-estate", img: "img/real-estate/hero-city.png", alt: "A glass office tower at blue hour"}
  - {label: "E-commerce", line: "Every store's products, ads, email and numbers, run by one team.", href: "/ecommerce", img: "img/ecommerce/hero.png", alt: "A bright e-commerce studio and stockroom"}
  - {label: "Lead generation", line: "Owner names, verified contacts and lists at any size.", href: "/lead-generation", img: "img/lead-generation/owners.png", alt: "A main street of small independent shops in the morning"}
  - {label: "Landscaping and yard care", line: "Every route, renewal and invoice handled.", href: "/industries/landscaping", img: "img/landscaping/hero.png", alt: "A crew mowing a wide lawn in the morning"}
  - {label: "Contractors", line: "Bids out, permits closed, every draw paid.", href: "/industries/contractors", img: "img/contractors/hero.png", alt: "A commercial building under construction at golden hour"}
  - {label: "Restaurants", line: "Every location's numbers, bookings and reviews.", href: "/industries/hospitality", img: "img/home/hospitality.png", alt: "A neighbourhood restaurant dining room in the evening"}
  - {label: "Trucking", line: "Loads booked, paperwork checked, invoices out.", href: "/industries/transportation", img: "img/home/transportation.png", alt: "Semi trucks backed into a freight depot at dawn"}
grid_h: "Every business, store or client, one screen."
grid:
  offices: ["Main office", "Second location", "A client you serve"]
  lamps: [[work, work, wait, work, idle], [work, idle, work, work, work], [idle, work, work, idle, wait]]
  legend: {work: "working", wait: "waiting on you", idle: "idle"}
proof: {h: "Scoop Dogg was the first business run by an AI employee.", p: "Pet waste and turf care in Ventura and Santa Barbara counties. His AI employee set up his new website and its online booking, then set up his automatic replies itself. He gets bookings every week, and he is first in ChatGPT and on Google for pet and yard cleanup in his area."}
offer_h: "Start your AI team today."
offer_p: "Name your business and your agents start on real work today. When you want a team set up with you, with the results agreed up front, we build it together."
options:
  - {h: "Pay as you go", p: "Your agents on your real work, then pay as you go."}
  - {h: "Custom agents", p: "Set up with you, with guaranteed results, from $1,200 a month."}
  - {h: "Agencies and operators", p: "A team for every business, store or client you run, on one screen."}
questions_h: "Questions"
questions:
  - {q: "What does AMTECH do?", a: "AMTECH builds a custom team of AI agents for your business. Each agent takes a part of the work, such as sales, marketing, finance, research or operations; they work together inside the software you already use, and you run all of them from one screen."}
  - {q: "What is an AI agent?", a: "An AI that does a job from start to finish rather than answering a question. It reads what it needs, uses your software, does the work and reports what it did. A team of agents splits a business's work the way a team of people would."}
  - {q: "How is this different from ChatGPT?", a: "ChatGPT is a tool you drive: it tells you how. Your AMTECH agents do the work themselves, inside your own records and software, every day, and you see every job they finish."}
  - {q: "How is AMTECH different from Grok Bot or OpenAI Dots?", a: "Those give one person AI helpers to set up and run themselves. AMTECH builds the whole team for your business, connects it to your software, and runs it with you, with results agreed up front when you want them."}
  - {q: "Can I run agents for several businesses, stores or clients?", a: "Yes. One account holds a team for each business, store or client you run, and one screen shows all of them."}
  - {q: "What does it cost?", a: "Pay as you go for the work done, from $50 a month. Custom agents set up with you, with guaranteed results, start at $1,200 a month."}
  - {q: "What happens to my data if I leave?", a: "It is yours. Export it whenever you like, and close your account to have nothing of your business left behind."}
  - {q: "Who is AMTECH?", a: "AMTECH AI is a technology company founded by Ben Palaskas that builds and runs teams of AI agents for businesses. It is not Amtech Systems."}
ask_prompt: "What does AMTECH AI (amtechai.com) do for a small business?"
closing_h: "Name your business and meet your team on a call."
closing_sub: "Book thirty minutes with Ben Palaskas. You see the team your business would get, and a real job done on the call if you bring one."
site_sources: false
sources:
  - "The work shown on this page (jobs, counts, rules, stores and connections) illustrates the AMTECH application; it is not a customer's job."
  - "Scoop Dogg: reported by Ben Palaskas, AMTECH, 27 October 2026 (scoopdogg.net)."
reviewed: {by: "Ben Palaskas", date: "2026-11-08"}
frame:
  - tab: "New products on every store"
    who: t1
    ask: "The spring collection is in. Get the new products live on all eight stores this week."
    reply: "Operations has it. Every product is written, photographed from the supplier's files and priced for each store, and the first store is ready for you to look over."
    title: "Spring collection, live on eight stores"
    steps: ["Read the supplier's sheet and the product photos", "Wrote each listing in the store's own voice", "Priced each product from your margins", "Waiting for your look before the first store goes live"]
    line: "Flagged two products the supplier sent without sizes"
    doc: {kind: sheet, title: "Spring collection", meta: "From the supplier's sheet, for each store", cols: ["Product", "Stores", "Ready"], rows: [["Linen throw, three colours", "All eight", "Listing and photos"], ["Ceramic planter set", "Six of eight", "Listing and photos"], ["Rattan basket", "All eight", "Needs sizes"]], foot: "Each store's listing written in its own voice."}
    trust: {assumed: "your usual margin for home goods", checked: "every price against what each store charges today"}
    approve: {act: "Put the first store live"}
  - tab: "A list of owners to call"
    who: t5
    ask: "Find me the owners of independent pet stores in Texas, with a phone and an email for each."
    reply: "Research found 412 stores and the owner of 338, checked each email and phone, and handed the list to Sales, which wrote the first email for each."
    title: "Independent pet store owners, Texas"
    steps: ["Searched maps, state records and the stores' own sites", "Found the owner's name for 338 of 412 stores", "Checked every email and phone", "Waiting for your yes to send the first emails"]
    line: "Left out 31 stores that belong to chains"
    doc: {kind: sheet, title: "Pet store owners, Texas", meta: "From maps, state records and each store's site", cols: ["Store", "Owner", "Checked"], rows: [["Paws on Main, Austin", "Owner, named", "Email and phone"], ["The Feed Barn, Waco", "Owner, named", "Email and phone"], ["Lone Star Pets, Tyler", "Owner, named", "Phone only"]], foot: "Every owner has the source the name came from."}
    trust: {assumed: "independent means fewer than three locations", checked: "every email with a live mailbox check"}
    approve: {act: "Send the first emails"}
  - tab: "The page customers ask ChatGPT for"
    who: t3
    ask: "When someone asks ChatGPT for a business like ours nearby, do we come up?"
    reply: "Not yet. Marketing checked what ChatGPT and Google answer today, then wrote the page that answers the question from your own work, area and reviews."
    title: "Your page for the question customers ask most"
    steps: ["Asked ChatGPT and Google what customers ask", "Read who the answers name, and why", "Wrote the page from your work, your area and your reviews", "Waiting for your yes to publish it"]
    line: "Marked it up so search engines and AI assistants can read it"
    doc:
      kind: page
      title: "Your new page"
      meta: "A new page on your website"
      url: "yoursite.com/near-you"
      h: "What customers ask, answered by the people who do the work"
      p: "What it costs, how long it takes, what to expect, and the towns you cover, from your own jobs and reviews."
      button: "Book now"
      rows: ["How much does it cost?", "How soon can you start?", "Do you cover my town?"]
    trust: {assumed: "your service area from your Google listing", checked: "what ChatGPT and Google answer for the question today"}
    approve: {act: "Publish to your site"}
---
