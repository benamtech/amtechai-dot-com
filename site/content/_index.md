---
# Home, rebuilt 2026-11-08 (session `lena`) on layouts/landing.html, the /real-estate pattern: photographs with the
# application's own cards on them, few words set large, one action. Ben: "less clutter", "more images", "more about how
# AMTECH is an agent management platform". What AMTECH may say it is comes from brain/proof.md: the infrastructure that
# makes, runs and governs teams of AI agents for businesses; each employee makes its own team. The price line is the
# site's own (brain/pricing.md, Ben 10-27). Every figure inside a card illustrates the application. Photographs:
# gpt-image-2.5 through AMTECH's gateway. The old home's sections live on in /services, /industries and /questions.
llms: { order: 1, label: "AMTECH", text: "AMTECH is an AI agent management platform for businesses: it builds a team of AI agents around how a business works, connects them to the software it runs, and gives the owner one screen to direct, watch and improve every agent." }
title: "AMTECH: the AI agent management platform for businesses"
description: "AMTECH is the AI agent management platform for businesses: a team of agents built around your work, connected to your software, run from one screen."
route: "/"
layout: "landing"
crumb: "AMTECH"
names: {employee: "Your lead agent"}
team: [employee, t1, t2, t3, t4, t5, t6]
h1a: "One platform to run"
h1b: "your AI agent team."
sub: "Describe your business and AMTECH builds a team of AI agents around it, connects them to the software you already run, and gives you one screen to direct every agent and see its work."
app:
  name: "AMTECH"
  category: "AI agent management platform"
  features: ["Builds a team of AI agents from a description of the business", "Connects each agent to the business's own software, with its own sign-in", "One screen to direct every agent and see its work, live", "Standing rules in plain words, a receipt for every action, and the cost of every job", "A team for each business, location or client, on one account"]
  offers:
    - {name: "Start free", price: "0", description: "Start free and pay as you go for the work done."}
    - {name: "Custom agents", price: "1200", description: "Custom agents set up with you, with guaranteed results, from $1,200 a month."}
answer: "AMTECH is an AI agent management platform for businesses. A lead agent learns how the business runs and builds a team of specialist agents for estimating, follow-up, marketing, bookkeeping, research and building software; each agent works inside the business's own systems, and the owner directs, watches and improves all of them from one screen."
field: "Your business's name"
button: "Start"
start: {industry: ""}
prices: "Start free and pay as you go. Custom agents with guaranteed results from $1,200/mo."
hero_img: "img/home/hero.png"
hero_alt: "A company office at dawn, with work trucks lined up in the yard outside the window"
panel:
  firm: "Your business"
  h: "Your agents"
  rows:
    - {who: t1, state: work}
    - {who: t2, state: work}
    - {who: t3, state: wait}
    - {who: t4, state: work}
    - {who: t5, state: idle}
  card_h: "Before 9am: Your business"
  steps: ["Priced three plan sets from bid invites", "Matched 14 payments in QuickBooks", "Wrote the page customers ask ChatGPT for"]
  now: "Following up nine open quotes"
  total: "26 jobs finished before you opened your email."
found: [{n: "6", what: "agents at work"}, {n: "26", what: "jobs finished today"}, {n: "9", what: "systems connected"}]
systems: ["QuickBooks", "Gmail", "Jobber", "Procore", "Stripe", "Google Business Profile", "Your website", "Google Calendar"]
frame_h: "Talk to one agent. The team does the work."
bands_h: "One platform for every agent you run."
bands:
  - who: employee
    img: "img/home/build.png"
    alt: "A landscaping company's equipment yard at sunrise"
    h: "Built from how your business works."
    p: "Your lead agent reads your site, your listing and your systems, then builds an agent for each kind of work it finds."
    doc: {kind: sheet, title: "Your team, built this morning", meta: "From your website, your listing and your books", cols: ["Agent", "Its job", "Works in"], rows: [["Takeoffs", "Prices every plan set", "Plan rooms, your price book"], ["Follow-up", "Works every open quote", "Gmail, your CRM"], ["Collections", "Invoices and payments", "QuickBooks, Stripe"]], foot: "Nobody picks from a menu: the work names the team."}
  - who: t5
    img: "img/home/connect.png"
    alt: "Architectural plans spread on a table in a construction site office"
    h: "Inside the software you already run."
    p: "Each agent gets its own sign-in to your tools, and builds the connection itself where none exists."
    doc: {kind: sheet, title: "Connections", meta: "Your systems and the agents that use them", cols: ["System", "Used by", "Status"], rows: [["Procore", "Takeoffs", "Connected"], ["QuickBooks", "Collections", "Connected"], ["City permit portal", "Research", "Through the screen"]], foot: "You sign in once. No agent ever sees a password."}
  - who: t2
    img: "img/home/run.png"
    alt: "A restaurant kitchen during afternoon prep"
    h: "Every agent's work, live."
    p: "What each agent is doing, what it finished and what it needs from you, across every location you run."
    doc: {kind: sheet, title: "Today", meta: "Across your agents, live", cols: ["Agent", "Working on", "State"], rows: [["Follow-up", "Nine open quotes", "Working"], ["Being found", "This week's ChatGPT check", "Finished"], ["Collections", "Four late invoices", "Working"]], foot: "Every job shows what was read, written and checked."}
  - who: t4
    img: "img/home/govern.png"
    alt: "A family business back office at dusk, a desk lamp lit over a quiet main street"
    h: "Your rules, your records, your costs."
    p: "Write in plain words what each agent may do on its own. Every action leaves a receipt, and every job shows what it cost."
    doc: {kind: sheet, title: "Standing rules", meta: "Written by you, in your words", cols: ["Agent", "Goes ahead on its own", "Limit"], rows: [["Collections", "Reminders on overdue invoices", "Up to 30 days late"], ["Follow-up", "Replies to quotes gone quiet", "Your prices only"], ["Builder", "Edits to pages on your site", "Pages you approved"]], foot: "Change a rule in a sentence; the team follows it from the next job."}
orbit_h: "Your agents, built around your business."
industries_h: "Set up for the way your industry works."
industries:
  - {label: "Real estate", line: "Sellers, leases and off-market deals found every morning.", href: "/real-estate", img: "img/real-estate/hero-city.png", alt: "A glass office tower at blue hour"}
  - {label: "General contractors", line: "Bids out, permits closed, every draw paid.", href: "/industries/contractors", img: "img/contractors/hero.png", alt: "A commercial building under construction at golden hour"}
  - {label: "Roofing", line: "Every roof priced and every quote followed.", href: "/industries/roofing", img: "img/home/roofing.png", alt: "Roofers laying new shingles at golden hour"}
  - {label: "Landscaping", line: "Every property bid and agreement renewed.", href: "/industries/landscaping", img: "img/home/landscaping.png", alt: "A newly finished backyard patio and planting beds"}
  - {label: "Painting", line: "From the walkthrough to a signed proposal.", href: "/industries/painting", img: "img/home/painting.png", alt: "A house being repainted sage green"}
  - {label: "Hospitality", line: "Every location's numbers, bookings and reviews.", href: "/industries/hospitality", img: "img/home/hospitality.png", alt: "A neighbourhood restaurant dining room in the evening"}
  - {label: "Transportation", line: "Loads booked, paperwork checked, invoices out.", href: "/industries/transportation", img: "img/home/transportation.png", alt: "Semi trucks backed into a freight depot at dawn"}
grid_h: "Every business, every team, one screen."
grid:
  offices: ["Main office", "North location", "A client you serve"]
  lamps: [[work, work, wait, work, idle], [work, idle, work, work, work], [idle, work, work, idle, wait]]
  legend: {work: "working", wait: "waiting on you", idle: "idle"}
proof: {h: "Scoop Dogg was the first business run by an AI employee.", p: "Pet waste and turf care in Ventura and Santa Barbara counties. His AI employee set up his new website and its online booking, then set up his automatic replies itself. He gets bookings every week, and he is first in ChatGPT and on Google for pet and yard cleanup in his area."}
offer_h: "Start your agent team today."
offer_p: "Name your business and your agents start on real work today. When you want a team set up with you, with the results agreed up front, we build it together."
options:
  - {h: "Start free", p: "Your agents on your real work, then pay as you go."}
  - {h: "Custom agents", p: "Set up with you, with guaranteed results, from $1,200 a month."}
  - {h: "Agencies and operators", p: "A team for every business or client you run, on one screen."}
offer_found: false
questions_h: "Questions"
questions:
  - {q: "What is an AI agent management platform?", a: "Software that builds, connects, runs and oversees AI agents in one place. AMTECH builds a team of agents for your business, connects each one to the tools it needs, and shows you every agent's work, rules and costs on one screen."}
  - {q: "What does AMTECH do for a small business?", a: "It gives the business a lead agent that learns how it runs and builds a team of specialist agents for the work: estimates and takeoffs, quote follow-up, being found on Google and in ChatGPT, bookkeeping and collections, research, and websites and tools."}
  - {q: "How is this different from ChatGPT?", a: "ChatGPT is a tool you drive: it tells you how. Your AMTECH agents do the work themselves, inside your own records and systems, every day, and you see every job they finish."}
  - {q: "Can it replace the software I pay for?", a: "Yes. Your agents plug into what you run on the first day, and where a subscription only does a job, an agent can do that job itself, set up for how you work."}
  - {q: "Can I run agents for several businesses or clients?", a: "Yes. One account holds a team for each business or client you run, and one screen shows all of them."}
  - {q: "What does it cost?", a: "Start free and pay as you go for the work done. Custom agents set up with you, with guaranteed results, start at $1,200 a month."}
  - {q: "What happens to my data if I leave?", a: "It is yours. Export it whenever you like, and close your account to have nothing of your business left behind."}
  - {q: "Who is AMTECH?", a: "AMTECH AI is a technology company founded by Ben Palaskas that builds and runs teams of AI agents for businesses. It is not Amtech Systems."}
closing_h: "Name your business and meet your agents."
closing_sub: "Your lead agent reads your site and your Google listing, then your team starts on real work today."
site_sources: false
sources:
  - "The work shown on this page (jobs, counts, rules and connections) illustrates the AMTECH application; it is not a customer's job."
  - "Scoop Dogg: his AI employee set up his new website, its online booking and his automatic replies; he gets bookings every week; first in ChatGPT and on Google for pet and yard cleanup across Ventura and Santa Barbara: reported by Ben Palaskas, AMTECH, 27 October 2026 (scoopdogg.net)."
  - "The photographs on this page were made for it with an image model; they show no real client or business."
reviewed: {by: "Ben Palaskas", date: "2026-11-08"}
frame:
  - tab: "An estimate from a plan set"
    who: t1
    ask: "The plan set from this morning's bid invite just came in. Price the roof for me."
    reply: "Takeoffs has it. Every roof plane is measured at scale and priced from your book, and the estimate is below for you to send."
    title: "Estimate for the plan set in this morning's bid invite"
    steps: ["Read the plan set and the bid invite", "Measured each roof plane at scale, with pitch and waste", "Priced every line from your book", "Waiting for your yes to send the estimate"]
    line: "Named the skylight flashing the plans do not detail"
    doc:
      kind: estimate
      title: "Roof estimate"
      meta: "From the plan set in this morning's bid invite"
      priced: "From your book"
      rows:
        - {item: "Roof area, measured at scale with pitch and waste", qty: "16.3", unit: "squares"}
        - {item: "Underlayment, ice and water shield in the valleys", unit: "squares"}
        - {item: "Ridge, hip and drip edge", unit: "linear feet"}
        - {item: "Tear-off and disposal", unit: "squares"}
        - {item: "Skylight flashing the plans do not detail", unit: "each"}
      foot: "Anything the plans could not show is named on the estimate, never guessed."
    trust: {assumed: "your usual shingle line, since the plans name none", checked: "every plane against the plan's scale bar"}
    approve: {act: "Send to the general contractor"}
  - tab: "A lead followed up to a yes"
    who: t2
    ask: "Did the homeowner with the backyard redesign quote ever answer?"
    reply: "Follow-up wrote to them on Tuesday under your standing approval, and they answered this morning: they want to go ahead in the spring. The reply that books the walk-through is ready."
    title: "Follow-up on the backyard redesign quote"
    steps: ["Read the quote and every message since", "Followed up under your standing approval", "Read the answer: a yes, starting in spring", "Waiting for your yes to book the walk-through"]
    line: "Found the open mornings on your calendar next week"
    doc:
      kind: email
      title: "Reply to the homeowner"
      meta: "Written in your words, from your past replies"
      to: "The homeowner, from your website's form"
      subject: "Your backyard redesign: booking the walk-through"
      body:
        - "Thank you for coming back to us. We would be glad to start your backyard in the spring."
        - "The next step is a walk-through at your home to confirm the plan and the measurements. Would Tuesday or Thursday morning next week suit you?"
        - "Once we have walked it together, the final quote follows from it."
    trust: {assumed: "next week's open mornings on your calendar", checked: "the quote's scope against the homeowner's message"}
    approve: {act: "Send to the homeowner"}
  - tab: "A page that answers what customers ask ChatGPT"
    who: t3
    ask: "When someone asks ChatGPT who paints house exteriors near them, do we come up?"
    reply: "Not yet. Being found checked what ChatGPT and Google answer today, then wrote the page that answers the question from your own jobs, area and reviews, with your booking form on it."
    title: "Your page for the question customers ask most"
    steps: ["Asked ChatGPT and Google what customers ask", "Read who the answers name, and why", "Wrote the page from your jobs, your area and your reviews", "Waiting for your yes to publish it"]
    line: "Marked it up so search engines and AI assistants can read it"
    doc:
      kind: page
      title: "Exterior house painting"
      meta: "A new page on your website"
      url: "yoursite.com/exterior-house-painting"
      h: "Exterior house painting, finished before the weather turns"
      p: "How long a repaint takes, which paint lasts on a sunny wall, the prep your siding needs, and the towns we cover."
      button: "Book an estimate"
      rows: ["How long does an exterior repaint take?", "Which paint lasts on a south-facing wall?", "Do you paint in the colder months?"]
    trust: {assumed: "your service area from your Google listing", checked: "what ChatGPT and Google answer for the question today"}
    approve: {act: "Publish to your site"}
---
