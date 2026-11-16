---
# /chatgpt/business-agents (gala, Opus, 2026-11-16). What a ChatGPT business agent is, who can have one today (U.S.
# ecommerce and online service businesses), what it can and cannot do, the rules, sponsored agents, and what a local
# service business does now: the Q&A pack and the AMTECH employee. Facts: R-OPENAI-BUSINESS.md (help 20001635, 20001651,
# the Business Agents Policy).
title: "ChatGPT business agents, explained: what they do and who can have one"
description: "A ChatGPT business agent answers customers inside ChatGPT using only what the business gives it. Who can have one today, what it can do, and what local businesses use instead."
route: "/chatgpt/business-agents"
layout: "gpt"
crumb: "Business agents"
weight: 2
audience: "Owners of local service businesses and online stores"
lastmod: 2026-11-16
llms: {order: 35, label: "ChatGPT business agents", text: "What a ChatGPT business agent is (a labeled chat inside ChatGPT that answers from the business's own information), who can publish one today (U.S. ecommerce and online service businesses with a website), what it can and cannot do, the policy rules, sponsored agents in ChatGPT ads, and how local service businesses answer customers now with an AMTECH AI employee."}
h1a: "What is a ChatGPT"
h1b: "business agent?"
answer: "It's a chat inside ChatGPT that speaks for one business. A customer opens it from the business's page and asks questions, and the agent answers using only the information that business gave it, then sends them to the website to buy. Today, U.S. online shops and online service businesses can publish one. Local service businesses can't yet, so here's what they do instead."
check: {trade: "hvac"}
hero_img: "img/services/svc-inv-desk.png"
hero_alt: "A quiet office desk at night with a laptop and a lamp"
mock:
  label: "A customer asking a business agent in ChatGPT about shipping and returns"
  k: "Business agent, Northwind Outdoor"
  q: "Do you ship to Canada, and how long do I have to return a tent?"
  intro: "From Northwind Outdoor's own policies:"
  names:
    - {n: "Ships to Canada", meta: "5 to 8 business days, duties shown at checkout"}
    - {n: "Returns within 30 days", meta: "Free on exchanges. Start a return on northwind.com"}
outcomes_h: "Who can have a business agent today"
outcomes:
  - tone: green
    k: "Yes"
    h: "Online shops in the U.S."
    p: "Stores with a website can build an agent in Business Hub, and Shopify stores may find a draft already made from their catalog."
  - tone: green
    k: "Yes"
    h: "Online service businesses in the U.S."
    p: "Services sold and delivered online, with a website, can apply. OpenAI checks both the type of business and what the agent is for before it goes live."
  - tone: amber
    k: "Not yet"
    h: "Local service businesses"
    p: "Contractors, agents, property managers and other local businesses can claim their page but can't publish an agent yet. You can still answer every customer in seconds today, the way our clients do."
    link: {label: "What to do now", href: "#now"}
blocks:
  - id: what
    h: "What a business agent does"
    p:
      - "Think of it as your best salesperson, sitting inside ChatGPT, who has read everything you wrote down and nothing else."
    list:
      - "**Answers from your information only.** Your products, services, prices, policies and FAQs. It doesn't pull in reviews, forums or a competitor's comparison page."
      - "**Lives in its own chat.** It's a separate, clearly labeled conversation about your business, apart from ChatGPT's own answers, where you're listed next to everyone else."
      - "**Sends people to your website** with their questions already answered, where they buy, book or call."
      - "**Can offer a follow-up.** OpenAI's rules let an agent offer to follow up and collect contact details when the customer chooses to share them."
      - "**Is the landing spot for ChatGPT ads.** A sponsored ad can open a chat with your agent instead of a web page."
    img: "img/painting/paint-walkthrough.png"
    alt: "A person holding up a phone in a bright living room"
  - id: limits
    h: "What it can't do, yet"
    list:
      - "Take payments, make bookings or look up a customer's order. It explains and links to your site, where those happen."
      - "Show you the conversations. OpenAI doesn't share customers' chats with businesses, only totals in your page's numbers."
      - "Pretend to be a person. It has to say it's an AI."
      - "Give advice that needs a license (legal, medical, financial), promise results, push with false urgency, or ask for IDs, health details or bank logins."
    after: "Those rules come from OpenAI's Business Agents Policy, and an agent that breaks them doesn't get published."
  - id: vs
    h: "Your agent versus regular ChatGPT"
    p:
      - "Why would an owner want an agent when customers can already ask ChatGPT about them? Because the two answer very differently."
    table:
      cols: ["", "Regular ChatGPT", "Your business agent"]
      rows:
        - ["Where answers come from", "Whatever it finds: reviews, forums, old pages, competitors' comparisons", "Only what you give it"]
        - ["Who else comes up", "You're listed next to your competitors", "A separate chat about your business"]
        - ["Prices and stock", "Whatever it last read", "Live, from your product feed"]
        - ["Your policies", "A guess, or nothing", "Your exact return, delivery and service terms"]
        - ["Contact details", "You get nothing", "The customer can choose to leave them"]
        - ["Where it sends people", "Anywhere", "To your website, questions already answered"]
  - id: build
    h: "How a business agent is built"
    ol:
      - "Claim and verify your page in the ChatGPT business directory, including the ID check."
      - "In Business Hub, review the information the agent will use: products or services, policies, FAQs."
      - "Write the agent's instructions within OpenAI's rules: what it covers, how it talks, where it sends people."
      - "Test it with real customer questions, pulled from your emails, calls and reviews, and fix every wrong answer."
      - "Publish. Customers can only chat with a published agent."
    after: "The work that makes an agent good is the testing. We use 30 to 50 real questions per business and don't publish until every answer is right."
    link: {label: "How the directory works", href: "/chatgpt/business-directory"}
  - id: now
    h: "For local businesses: answer every customer now"
    p:
      - "A roofer or a real estate agent can't put an agent inside ChatGPT yet. But the customer who finds you there still calls, texts or fills in your web form, usually at the worst moment, and usually after trying someone else first. Whoever answers first gets the job."
      - "That's what our **AI employee** does today. It answers every call, text and web lead in seconds, day or night, from your own prices, services and calendar. It books the estimate or the showing, follows up until the customer replies, and sends you the details. It works the way a business agent will, on every channel your customers already use."
      - "And when OpenAI opens agents to your kind of business, your questions and answers are already written and tested. We include them in every ChatGPT setup."
    link: {label: "See how it follows up every lead", href: "/questions/can-an-ai-employee-follow-up-every-lead"}
    img: "img/services/svc-inv-hero.png"
    alt: "A service technician walking to a work van outside a house at sunset"
    mock:
      label: "An AMTECH AI employee answering a customer's text for a roofing company"
      k: "Your AI employee, by text, 9:41 p.m."
      q: "Do you do roof inspections after hail? We're in Jeffersontown."
      intro: "Yes, we do free storm inspections in Jeffersontown. I can put you on the schedule now:"
      names:
        - {n: "Thursday, 9 to 11 a.m.", meta: "Reply 1 to book"}
        - {n: "Friday, 1 to 3 p.m.", meta: "Reply 2 to book"}
addon:
  k: "Also for contractors"
  h: "Sponsored agents: an ad that opens a conversation"
  p: "OpenAI is testing ads that open a chat with a business agent instead of a website, built in Ads Manager on a campaign that optimizes for conversions. It's limited to selected advertisers for now. We run ChatGPT ads for contractors as a managed pilot and will add sponsored agents where your account has access."
  link: {label: "How ChatGPT ads work", href: "/chatgpt/ads"}
questions:
  - q: "Can a contractor or real estate agent have a ChatGPT business agent?"
    a: "Not yet. Today agents are for U.S. online shops and online service businesses with a website. Local service businesses can claim their page in the directory, and we write and test their questions and answers now so they're ready when OpenAI opens agents to them."
  - q: "What does a business agent cost?"
    a: "OpenAI isn't charging for business agents while they're in beta. The cost is the work: clean product and policy information, instructions within OpenAI's rules, and testing against real customer questions until every answer is right."
  - q: "Can a ChatGPT business agent book appointments?"
    a: "No. Today it explains and links to your website, where customers book or buy. If you want appointments booked for you around the clock, that's what our [AI employee](/questions/can-an-ai-employee-follow-up-every-lead) does, by phone, text and web."
  - q: "Can I read what customers ask my agent?"
    a: "No. OpenAI doesn't share customers' chats with businesses. You see totals and topics in your page's numbers."
  - q: "Is a business agent the same as a chatbot on my website?"
    a: "It lives in a different place. A website chatbot talks to people already on your site. A business agent talks to people inside ChatGPT, often before they've found your site at all. Many businesses will want both."
  - q: "Do I need Shopify?"
    a: "No. Shopify stores may get a draft agent made automatically, but any eligible business can connect a product feed or enter its information in Business Hub."
  - q: "Will business agents come to local service businesses?"
    a: "OpenAI says it's rolling out in stages and holding some categories back until it has the right safeguards. It hasn't given a date for local services. Claim your page and get your answers ready now, so you're live on day one."
closing_h: "First, find out if ChatGPT names you at all."
closing_sub: "An agent helps people who already found you. The check shows whether ChatGPT sends them your way in the first place."
ask_prompt: "What is a ChatGPT business agent, who can have one, and what should a local service business do instead?"
reviewed: {by: "Ben Palaskas", date: "2026-11-16"}
---
