---
# /real-estate (2026-11-08). A landing page in its own template (layouts/landing.html), shorter and calmer than the
# industry family: Beam's conventions (one action, white space, large photographs with the work floating on them),
# AMTECH's brand. The four jobs are the four paid job posts in ideas-for-agents/industry/real-estate/full-team.
# Prices: only brain/pricing.md's website wording (the price line under every start field, and "$1,200 a month").
# Proof: no customer, number or result is claimed. Every row in a card illustrates the application (data/w.json sources).
# Photographs: made for this page with gpt-image-2.5 through AMTECH's gateway, 2026-11-08.
title: "AI team for real estate: surveys, listing campaigns, reviews and seller calls"
description: "An AI team for real estate firms: property surveys, listing email campaigns, reviews after every closing and seller calls. Custom built from $1,200/mo."
route: "/real-estate"
layout: "landing"
crumb: "Real estate"
okf_type: "Business Type"
llms: {order: 30, label: "Real estate", text: "AI agent teams for real estate businesses: property surveys, listing email campaigns, reviews after every closing, and seller calls, from $1,200/mo."}
h1a: "The surveys, the listings, the reviews and the seller calls."
h1b: "Done by your AI team."
sub: "AMTECH builds your real estate business a team of AI agents that works inside the software you already use. It prepares every property survey, launches every listing by email, asks every client for a review and calls back every seller, and you approve what goes out."
field: "Your company's name"
button: "Build my team"
call: {text: "Or talk to Ben about a custom setup", href: "/schedule-demo"}
hero_img: "img/real-estate/hero.png"
hero_alt: "A broker walking past a glass office building at sunset"
hero_card:
  h: "Your team today"
  rows:
    - {who: "Surveys", what: "Office survey for a 9,000 sq ft tenant, 14 buildings matched", state: "Step 3 of 4", tone: "run"}
    - {who: "Listings", what: "Just-listed campaign for the house on Ridge Road", state: "Waiting for your yes", tone: "wait"}
    - {who: "Reviews", what: "Five-star rating from the Ortiz closing, sent on to Google", state: "Done", tone: "done"}
    - {who: "Sellers", what: "Call with the owner on Alder Street, walkthrough booked", state: "Thursday 10:00", tone: "done"}
systems_h: "Works inside what your office already runs"
systems: ["Follow Up Boss", "kvCORE", "Lofty", "Salesforce", "Mailchimp", "Constant Contact", "Google Business Profile", "Zillow", "DocuSign", "dotloop", "Google Workspace", "QuickBooks"]
jobs_h: "Four jobs your team takes over first"
jobs_sub: "Real estate firms post each of these as a separate job and pay a freelancer to build a workflow that someone then has to run. Your AMTECH team runs all four, every day, and gets better at them."
jobs:
  - id: surveys
    img: "img/real-estate/surveys.png"
    alt: "An aerial view of a downtown office district in the morning"
    h: "Commercial property surveys, the same day they are asked for"
    p: "Send your team the tenant's requirements. It searches the listing databases you already log in to, checks each building against the size, rate, location and timing, and builds the survey in your template, with photos, floor plans and notes. You review a finished survey instead of spending the afternoon assembling one."
    gets:
      - "Learns from the surveys you have already sent"
      - "Works under your own logins, inside each database's terms"
      - "Updates the survey when a space leases or a rate changes"
    card:
      kind: table
      h: "Office survey: 8,000 to 10,000 sq ft"
      meta: "From the tenant's requirements email"
      cols: ["Building", "Available", "Asking", "Fit"]
      rows:
        - ["Harbor Point, floor 6", "9,200 sq ft", "$34.50", "Strong"]
        - ["The Calder, floor 11", "8,750 sq ft", "$31.00", "Strong"]
        - ["400 Main, floors 3 to 4", "10,400 sq ft", "$29.75", "Over size"]
        - ["Mill Yard Building B", "8,100 sq ft", "$27.00", "Parking short"]
      foot: "14 buildings checked. 4 shown. Ready for your review."
  - id: listings
    img: "img/real-estate/listings.png"
    alt: "A luxury living room with floor-to-ceiling windows above the city lights at dusk"
    h: "Every listing launched by email, to the buyers and agents who fit"
    p: "When a listing goes live, your team writes the campaign in your brand: the just-listed email, the open house invitation, the price change and the just-sold note. It picks the buyers and agents from your own lists who match the home, sends from your email platform once you approve, and tells you who opened, clicked and replied."
    gets:
      - "Written for the property, never from a template"
      - "Sent to the right segment, not the whole list"
      - "Replies answered and handed to the right agent"
    card:
      kind: email
      h: "Just listed: a glass house above the city"
      meta: "To buyers and agents on your luxury list"
      lines:
        - "Five bedrooms, a double-height living room and the whole city in the windows."
        - "Private showings start Saturday. Reply to choose a time."
      action: "Approve and send"
  - id: reviews
    img: "img/real-estate/reviews.png"
    alt: "A couple holding the key on the porch of their new house"
    h: "A review from every closing, and a call back for every unhappy client"
    p: "After a closing, a showing or a lease signing, your team asks the client how it went by text or email. A happy client is sent straight to your Google or Zillow page to say so. Anyone less than happy gets a personal reply, and the agent is told at once with everything the client said, so it is fixed before it becomes a public review."
    gets:
      - "Asks at the right moment, in your words"
      - "Answers every public review on Google"
      - "A monthly picture of how clients rate each agent"
    card:
      kind: flow
      h: "After the Ortiz closing"
      rows:
        - {k: "Rating", v: "5 of 5"}
        - {k: "Next", v: "Sent the link to your Google page"}
        - {k: "Review", v: "Posted, and answered with a thank-you"}
      foot: "A rating under 5 goes to the agent within minutes."
  - id: sellers
    img: "img/real-estate/sellers.png"
    alt: "A tired ranch house with an overgrown front lawn"
    h: "Every seller called back, in a voice that sounds like your office"
    p: "Your team calls back every owner who asked to hear from you, the moment they ask, day or night. It finds out whether they still want to sell, why, how soon, and what condition the house is in, works out a price range from your buying rules, and books the walkthrough on your calendar. Every call is recorded, written up and added to your CRM."
    gets:
      - "Calls, texts and emails, one conversation"
      - "Follows each seller until they say yes or no"
      - "Keeps to do-not-call lists and the consent each owner gave"
    card:
      kind: call
      h: "Call with the owner, Alder Street"
      meta: "Called back 40 seconds after the form"
      rows:
        - {k: "Still selling", v: "Yes, within 60 days"}
        - {k: "Condition", v: "Roof about 20 years old, kitchen original"}
        - {k: "Price range", v: "From your buying rules"}
        - {k: "Next", v: "Walkthrough booked, Thursday 10:00"}
team_h: "One team, with a page for every member"
team_sub: "Your team lives in one application. You talk to it like a colleague, see each member's work as it happens, and approve what goes out from one list. Add a member for any other job your office does, from transaction paperwork to the website."
team_img_alt: "The AMTECH application showing a real estate team at work"
team:
  lead: {name: "Your real estate team", line: "Takes your requests and hands each one to the member for it"}
  members:
    - {name: "Surveys", line: "3 surveys in progress"}
    - {name: "Listings", line: "1 campaign waiting for your yes"}
    - {name: "Reviews", line: "6 clients asked this week"}
    - {name: "Sellers", line: "11 calls today, 2 walkthroughs booked"}
  waits_h: "Waiting for your yes"
  waits:
    - "Send the just-listed campaign for Ridge Road"
    - "Send the office survey to the tenant's broker"
offer_h: "Your team, built for your business, from $1,200 a month"
offer_sub: "AMTECH builds your team with you: the members your work needs, the connections to your software, the routines and the rules for what goes out. Then it runs every day, and we keep improving it."
offer_includes_h: "What the $1,200 covers"
offer_includes:
  - "A team made for your business, not a template"
  - "Every connection set up for you, to your CRM, email, calendar, phone and databases"
  - "The four jobs on this page, and any others your office hands over"
  - "Routines that run on their own, every morning and every week"
  - "Approvals in your words: what waits for you and what just goes"
  - "A person at AMTECH who keeps improving it with you"
offer_steps_h: "How it starts"
offer_steps:
  - {h: "Tell us what your office does", p: "Type your company's name, or book a call. Your team reads your website and your listings first."}
  - {h: "We build your team", p: "In a few days: the members, the connections and the first routines, tested on your real work."}
  - {h: "It goes to work", p: "You approve the first surveys, campaigns and calls, then decide what can go out on its own."}
compare_h: "Why a team, and not a one-off build"
compare_sub: "A freelancer can build you a workflow. Somebody still has to run it, fix it when a website changes, and build the next one."
compare_cols: ["A freelancer's build", "Another software subscription", "Your AMTECH team"]
compare_rows:
  - {k: "Does the work itself", v: ["Runs the steps it was built for", "You do the work inside it", "Yes, end to end"]}
  - {k: "Handles what is new", v: ["Breaks, and needs another job post", "Waits for the vendor", "Adapts, and asks you when unsure"]}
  - {k: "Covers more than one job", v: ["One workflow per project", "One job per tool", "Surveys, listings, reviews, sellers and more"]}
  - {k: "Gets better every week", v: ["No", "When the vendor ships", "Yes, from your own approvals and edits"]}
  - {k: "You approve what goes out", v: ["Depends on the build", "Depends on the tool", "Always, or under rules you set"]}
yes_h: "You stay in charge"
yes:
  - {h: "Nothing goes out without your yes", p: "Every email, survey, review reply and offer range waits for you, until you decide a kind of work can go out on its own."}
  - {h: "Your logins stay yours", p: "Your team works inside your accounts with the access you give it, and you can end that access at any time."}
  - {h: "Every action is on the record", p: "Each call, email and change is written down with who did it and why, so you can check any of it later."}
questions_h: "What real estate firms ask first"
questions:
  - {q: "Is this a chatbot?", a: "No. A chatbot answers questions. Your AMTECH team does the work: it prepares the survey, writes and sends the campaign, makes the call and books the walkthrough, inside your own software, and brings the finished work to you to approve."}
  - {q: "Will it work with our CRM and our databases?", a: "Yes. Your team connects to Follow Up Boss, kvCORE, Lofty, Salesforce and the email, calendar and phone tools you use, and works in the listing and property databases you subscribe to under your own logins. If something has no ready connection, your team builds one."}
  - {q: "Can it replace our review software, our email tool or our call service?", a: "It can. On day one it works inside what you already pay for, so nothing changes for your agents. When you would rather stop paying for a tool, your team takes over its job."}
  - {q: "Are the seller calls legal?", a: "Your team calls owners who asked to hear from you or agreed to be called, checks do-not-call lists before every call, and says it is an automated assistant where the law asks it to. Cold lists are worked by mail and email unless you have consent to call."}
  - {q: "Do you only work with one kind of real estate business?", a: "No. Commercial brokerages, residential teams, luxury agents, investors and property managers each get a team made for their own work. The four jobs on this page are where most start."}
  - {q: "How fast is it set up?", a: "Usually within a few days. You can start with your company's name today, and your team begins by reading your website and your listings while we set up the rest with you."}
closing_h: "Put your real estate team to work."
closing_sub: "Type your company's name. Your team starts by reading your website and your listings."
site_sources: false
sources:
  - "The price line: AMTECH's price list, October 2026."
  - "The work shown in progress on this page (buildings, names, streets, times and counts) illustrates the AMTECH application; it is not a customer's job."
  - "The photographs on this page were made for it with an image model; they show no real client, agent or property."
reviewed: {by: "Ben Palaskas", date: "2026-11-08"}
---
