---
# Home, rebuilt 2026-11-13 (session `voni`) on layouts/home.html, from plans/2026-11-09-SELF-SERVE-SWARM/session-5/STORY.md.
# Ben, 11-12: AMTECH is "a next-generation technology company", not an agency; 11-13: "it needs to be a cool homepage not
# a bunch of paragraphs", real menu, generated images, short copy. The page is the company's sentence, the start box,
# the team forming for five kinds of business (drawn in the application's look; the names and counts inside it
# illustrate the application), four figures, the kinds of business (each a real page), the operators' band, customers,
# price and one action. Every word the page shows is in this file.
llms: { order: 1, label: "AMTECH", text: "AMTECH is a swarm of AI agents that runs new and existing businesses on its own, in any industry: describe a business, and a team of agents forms around it and runs its work, inside the software it already uses, with one screen where the owner directs and sees everything." }
title: "AMTECH: describe your business, meet the AI team that runs it"
description: "Describe your business and AMTECH builds a team of AI agents that runs its work: sales, marketing, customers, books and operations, in your own tools."
route: "/"
layout: "home"
crumb: "AMTECH"
h1a: "Describe your business."
h1b: "Meet the team that runs it."
sub: "AMTECH builds a team of AI agents around your business in minutes. It works inside the tools you already use, day and night."
answer: "AMTECH is a swarm of AI agents that runs new and existing businesses on its own, in any industry. Describe a business and a team of agents forms around it: each agent takes a part of the work, such as sales, marketing, customers, books and operations; they work together inside the business's own software, and the owner directs and sees all of it on one screen. Agencies, operators and investors run a team for every client, store or company from one account."
app:
  name: "AMTECH"
  category: "AI agent teams that run a business's work"
  features: ["A team of AI agents built from a description of the business", "Agents that work together and hand work to each other", "Each agent connected to the business's own software", "One screen to direct every agent and see its work, live", "Standing rules in plain words and a receipt for every action", "A team for each business, location, store or client, on one account"]
  offers:
    - {name: "Pay as you go", price: "50", description: "Pay as you go from $50 a month in credits, for the work done."}
    - {name: "Custom agents", price: "1200", description: "Custom agents set up with you, with guaranteed results, from $1,200 a month."}
field: "What does your business do?"
button: "Build my team"
under: "Free to start. Your team is working in about 90 seconds."
book: "Or book a call"
chips: ["A 12-tech HVAC company in Phoenix", "A candle store on Shopify", "A marketing agency with 40 clients", "Three dental offices in Ohio"]
hero_img: "img/home/night.png"
hero_alt: "A small American city at blue hour, every storefront and workshop lit from inside"
kinds_h: "One sentence in. A working team out."
kinds_ready: "Team ready in"
kinds_you: "You"
kinds_team: "Your team"
kinds_today: "Today"
kinds:
  - tab: "HVAC company"
    say: "We're a 12-tech heating and air company in Phoenix."
    firm: "Desert Air"
    url: "desert-air.amtechai.com"
    secs: "84 seconds"
    team:
      - {who: employee, name: "Ava", job: "Runs the office"}
      - {who: t1, name: "Dispatch", job: "Schedules every tech"}
      - {who: t2, name: "Front desk", job: "Answers calls and texts"}
      - {who: t4, name: "Billing", job: "Invoices and collections"}
      - {who: t3, name: "Reviews", job: "Asks every happy customer"}
    work:
      - {who: t2, line: "Booked 9 service calls from overnight messages"}
      - {who: t1, line: "Rebuilt tomorrow's routes around two no-heat calls"}
      - {who: t4, line: "Collected 6 late invoices"}
    now: {who: t3, line: "Asking yesterday's 11 customers for a review"}
    total: "38 jobs finished today"
  - tab: "Online store"
    say: "We sell candles online, on Shopify."
    firm: "Ember and Oak"
    url: "ember-and-oak.amtechai.com"
    secs: "86 seconds"
    team:
      - {who: employee, name: "Ada", job: "Runs the store"}
      - {who: t1, name: "Listings", job: "Every product page"}
      - {who: t3, name: "Ads", job: "Spend, creative, results"}
      - {who: t2, name: "Email", job: "Campaigns and carts"}
      - {who: t5, name: "Analyst", job: "The numbers, every morning"}
    work:
      - {who: t1, line: "Put the winter collection live: 14 listings"}
      - {who: t3, line: "Moved budget from two losing ads to the winner"}
      - {who: t2, line: "Won back 23 abandoned carts"}
    now: {who: t5, line: "Writing this morning's numbers"}
    total: "52 jobs finished today"
  - tab: "Marketing agency"
    say: "Marketing agency, 40 local clients."
    firm: "Brightline"
    url: "brightline.amtechai.com"
    secs: "91 seconds"
    team:
      - {who: employee, name: "Avery", job: "Runs client work"}
      - {who: t5, name: "Reports", job: "Every client, every month"}
      - {who: t3, name: "Ads", job: "40 accounts, watched daily"}
      - {who: t6, name: "Social", job: "Posts for every client"}
      - {who: t2, name: "New business", job: "Finds the next 40"}
    work:
      - {who: t5, line: "Sent 40 monthly reports, each in the client's words"}
      - {who: t3, line: "Caught a broken ad account before the client did"}
      - {who: t6, line: "Scheduled 120 posts for next week"}
    now: {who: t2, line: "Writing to 60 new prospects"}
    total: "214 jobs finished today"
  - tab: "Dental group"
    say: "Three dental offices in Ohio."
    firm: "Bright Smile Dental"
    url: "bright-smile.amtechai.com"
    secs: "103 seconds"
    team:
      - {who: employee, name: "Ava", job: "Runs three front offices"}
      - {who: t2, name: "Nora", job: "Answers patients"}
      - {who: t1, name: "Theo", job: "No-shows and recalls"}
      - {who: t3, name: "Miles", job: "Brings patients back"}
      - {who: t6, name: "Priya", job: "Reviews"}
    work:
      - {who: t1, line: "Filled 7 cancelled appointments from the waitlist"}
      - {who: t3, line: "Brought back 12 patients overdue for a cleaning"}
      - {who: t2, line: "Answered 31 patient messages"}
    now: {who: t6, line: "Asking today's patients for a review"}
    total: "67 jobs finished today"
  - tab: "Law firm"
    say: "A six-lawyer family law firm."
    firm: "Hale and Marsh"
    url: "hale-marsh.amtechai.com"
    secs: "90 seconds"
    team:
      - {who: employee, name: "June", job: "Runs the office"}
      - {who: t2, name: "Intake", job: "Every new enquiry"}
      - {who: t4, name: "Billing", job: "Time, invoices, trust"}
      - {who: t1, name: "Onboarding", job: "New client paperwork"}
      - {who: t5, name: "Research", job: "Case law and filings"}
    work:
      - {who: t2, line: "Qualified 8 new enquiries and booked 5 consults"}
      - {who: t4, line: "Sent 22 invoices from this week's time"}
      - {who: t1, line: "Opened 3 new client files, forms signed"}
    now: {who: t5, line: "Pulling filings for Thursday's hearing"}
    total: "44 jobs finished today"
figures:
  - {n: "90 sec", what: "from a sentence to a working team"}
  - {n: "1/10", what: "the cost of the office work it takes over"}
  - {n: "24/7", what: "nights, weekends and holidays"}
  - {n: "0", what: "new software for you to learn"}
not_h: "Not another tool. The work."
not: ["Another chatbot to ask", "Another app to learn", "Another agent to build", "Another seat to pay for"]
yes: "A team that does the work."
industries_h: "Any business. Its own team."
industries:
  - {label: "Home services", line: "Calls, routes, invoices, reviews.", href: "/industries/landscaping", img: "img/landscaping/hero.png", alt: "A crew mowing a wide lawn in the morning"}
  - {label: "E-commerce", line: "Products, ads, email, numbers.", href: "/ecommerce", img: "img/ecommerce/hero.png", alt: "A bright e-commerce studio and stockroom"}
  - {label: "Contractors", line: "Bids, permits, draws.", href: "/industries/contractors", img: "img/contractors/hero.png", alt: "A commercial building under construction at golden hour"}
  - {label: "Real estate", line: "Sellers and deals, every morning.", href: "/real-estate", img: "img/real-estate/hero-city.png", alt: "A glass office tower at blue hour"}
  - {label: "Lead generation", line: "Owners found, checked, contacted.", href: "/lead-generation", img: "img/lead-generation/owners.png", alt: "A main street of small independent shops in the morning"}
  - {label: "Restaurants", line: "Bookings, reviews, every location.", href: "/industries/hospitality", img: "img/home/hospitality.png", alt: "A neighbourhood restaurant dining room in the evening"}
industries_all: "All industries"
ops_img: "img/home/portfolio.png"
ops_alt: "A metropolitan area at dusk, thousands of businesses lit to the horizon"
ops_k: "Agencies, operators, investors"
ops_h: "Run a hundred businesses from one screen."
ops_p: "A team for every client, store or company you own. One account."
ops_button: "Talk to us"
customers_h: "Already running real businesses."
customers_link: "Read the story"
customers:
  - {kind: "A yard-care company", line: "The team built his website, set up online booking and replies to his customers. He runs the routes.", img: "img/landscaping/yard.png", alt: "A tidy back yard after a morning's work", href: "/customers/scoop-dogg"}
  - {kind: "An e-commerce group", line: "A team for each of eight stores keeps products, ads and email moving.", img: "img/ecommerce/stores.png", alt: "Products laid out for several online stores"}
  - {kind: "A lead-generation business", line: "The team finds store owners by name, checks every phone and email, and delivers the list.", img: "img/lead-generation/verify.png", alt: "Contact details being checked"}
price_h: "Start free. Pay for work done."
options:
  - {h: "Pay as you go", big: "$50", per: "a month to start", p: "Your team on real work today.", href: "#start", link: "Build my team"}
  - {h: "Custom", big: "$1,200", per: "a month and up", p: "Set up with you. Results agreed up front.", href: "/schedule-demo", link: "Book a call"}
  - {h: "Agencies and operators", big: "Per team", per: "one account", p: "A team for every business you run.", href: "/schedule-demo", link: "Talk to us"}
price_link: "See pricing"
close_img: "img/home/crew.png"
close_alt: "A contracting crew starting work on a house at sunrise"
closing_h: "You do the work only people can do."
closing_sub: "Your team does the rest."
questions_h: "Questions"
questions:
  - {q: "What does AMTECH do?", a: "AMTECH gives your business its own swarm of AI agents that runs the work on its own. Each agent takes a part of the work, such as sales, marketing, finance, research or operations; they work together inside the software you already use, and you run all of them from one screen."}
  - {q: "What is an AI agent?", a: "An AI that does a job from start to finish rather than answering a question. It reads what it needs, uses your software, does the work and reports what it did. A team of agents splits a business's work the way a team of people would."}
  - {q: "How is this different from ChatGPT?", a: "ChatGPT is a tool you drive: it tells you how. Your AMTECH agents do the work themselves, inside your own records and software, every day, and you see every job they finish."}
  - {q: "How is AMTECH different from Grok Bot or OpenAI Dots?", a: "Those give one person AI helpers to set up and run themselves. AMTECH builds the whole team for your business, connects it to your software, and runs it with you, with results agreed up front when you want them."}
  - {q: "Can I run agents for several businesses, stores or clients?", a: "Yes. One account holds a team for each business, store or client you run, and one screen shows all of them."}
  - {q: "What does it cost?", a: "Pay as you go for the work done, from $50 a month. Custom agents set up with you, with guaranteed results, start at $1,200 a month."}
  - {q: "Do I need to know how to use AI?", a: "No. AMTECH picks the models, sets up everything the agents need, writes their rules with you in plain words and keeps up with what changes in AI, so you never have to."}
  - {q: "Which AI models does AMTECH use?", a: "Fast open-source models, DeepSeek and GLM, chosen for each job. They are why AMTECH's agents finish work faster than other AI tools and why a team costs so little to run."}
  - {q: "What happens to my data if I leave?", a: "It is yours. Export it whenever you like, and close your account to have nothing of your business left behind."}
  - {q: "Who is AMTECH?", a: "AMTECH AI is a technology company founded by Ben Palaskas that builds swarms of AI agents which run new and existing businesses on their own, in any industry. It is not Amtech Systems."}
ask_prompt: "What does AMTECH AI (amtechai.com) do for a small business?"
sources:
  - "The work shown on this page (teams, jobs, counts and seconds) illustrates the AMTECH application; it is not a customer's job."
  - "Scoop Dogg: reported by Ben Palaskas, AMTECH, 27 October 2026 (scoopdogg.net)."
reviewed: {by: "Ben Palaskas", date: "2026-11-13"}
---
