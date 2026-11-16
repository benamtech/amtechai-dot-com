---
# /chatgpt/ads (gala, Opus, 2026-11-16; replaces /articles/chatgpt-ads-for-contractors). How ChatGPT ads work: where they
# show, who sees them, how you pay, the $25 minimum, targeting, what is allowed (local services yes, housing listings no),
# sponsored agents, and AMTECH's managed pilot for contractors. Facts: R-OPENAI-BUSINESS.md section 4 (help 20001047,
# 20001210, 20001245, 20001412, 20001651; ad policies; Axios 2026-05-05; TechWyse 2026-05-06). Pilot price: brain/pricing.md.
title: "How ChatGPT ads work: cost, targeting and who can advertise"
description: "ChatGPT ads appear under ChatGPT's answers, from $25 a day, and can target your city. Where they show, who sees them, how you pay, what's allowed, and how contractors should start."
route: "/chatgpt/ads"
layout: "gpt"
crumb: "ChatGPT ads"
weight: 4
audience: "Contractors and local service businesses"
lastmod: 2026-11-16
llms: {order: 37, label: "ChatGPT ads", text: "How ads in ChatGPT work: shown below answers to Free and Go users in the U.S. and other countries, bought in OpenAI's self-serve Ads Manager, paid per thousand views, per click or optimized for conversions, from $25 a day, targeted by country, platform and (where available) state, city or ZIP code; local services allowed, ads for specific housing listings prohibited; sponsored business agents in a limited test; and AMTECH's managed ChatGPT Ads pilot for contractors."}
h1a: "How do ads in"
h1b: "ChatGPT work?"
answer: "Ads in ChatGPT show up under its answers, clearly labeled, for people using the Free and Go plans. You buy them yourself in OpenAI's Ads Manager from $25 a day, pay per view or per click, and can aim them at your state, city or ZIP code. Local services are one of the categories OpenAI allows. Ads never change what ChatGPT's answer says."
check: {trade: "hvac"}
hero_img: "img/services/svc-inv-hero.png"
hero_alt: "A service technician walking to a work van outside a house at sunset"
mock:
  label: "A sponsored ad from a heating company shown under a ChatGPT answer"
  k: "ChatGPT, with an ad below the answer"
  q: "my furnace is banging when it kicks on, is that dangerous?"
  intro: "A bang at startup is usually delayed ignition or ducts expanding. If you smell gas, leave the house and call your gas company. Otherwise have it checked soon."
  names:
    - {n: "Sponsored: Keystone Heating & Air", meta: "Same-day furnace repair in Pittsburgh. Book online or call"}
outcomes_h: "Is ChatGPT advertising right for you?"
outcomes:
  - tone: green
    k: "A good fit"
    h: "Contractors and home services"
    p: "Local services are an allowed category, the questions are urgent, and one job can pay for a month of clicks. This is who we run ads for first."
    link: {label: "Our ads pilot", href: "#offer"}
  - tone: amber
    k: "Allowed, with limits"
    h: "Real estate agents"
    p: "Ads for a specific home for sale or rent are banned. An ad for you and your services, with no listing in it, isn't. Every ad is reviewed, and mortgage ads are restricted to approved advertisers."
  - tone: amber
    k: "Test first"
    h: "Cash home buyers"
    p: "OpenAI's policy doesn't address \"we buy houses\" ads directly, so they're reviewed case by case. Win the free answer first, then test a small campaign."
    link: {label: "ChatGPT for cash home buyers", href: "/chatgpt/cash-home-buyers"}
blocks:
  - id: where
    h: "Where the ads show, and who sees them"
    list:
      - "**Under the answer.** An ad appears below ChatGPT's response, one at a time, labeled as an ad. OpenAI is also testing picture ads while images are being made."
      - "**To Free and Go users.** People on Plus, Pro, Business, Enterprise and Edu plans don't see ads, and nobody under 18 does."
      - "**When it's relevant.** Which ad shows is decided by how well it fits the conversation and by what advertisers bid."
      - "**Apart from the answer.** OpenAI runs ads on separate systems from the model. Advertisers can't shape, rank or change what ChatGPT says, so paying never buys a place in the answer itself."
    img: "img/roofing/roof-storm.png"
    alt: "A suburban street under grey storm clouds"
  - id: pay
    h: "What ChatGPT ads cost"
    p:
      - "You set a daily budget or a total for the campaign. The minimum daily budget is **$25** in the U.S. and Canada, and the same in Australian dollars, or £15 and €15."
    table:
      cols: ["Goal", "How you pay", "Use it for"]
      rows:
        - ["Views", "Per 1,000 times the ad is shown", "Getting your name seen in your city"]
        - ["Clicks", "Per click", "Sending people to your site or booking page"]
        - ["Conversions", "Per click or per 1,000 views, optimized for leads", "Calls, quote requests and bookings you can track"]
    after: "When OpenAI opened its self-serve Ads Manager in May 2026, it suggested starting bids of about $3 to $5 a click. At that price, $50 a day buys roughly 10 to 16 visits from people asking about exactly what you do."
  - id: target
    h: "Who you can reach"
    list:
      - "**By place:** country, and where it's available, state, city or ZIP code. For a local business, that's the setting that matters."
      - "**By device:** the ChatGPT apps on iPhone and Android, and the website on a computer."
      - "**Your own lists:** upload a customer list to reach people like them, or to leave them out. It needs about 25,000 matches to work."
      - "**Conversions:** add OpenAI's pixel or its Conversions API to your website so it can learn which clicks become leads."
  - id: rules
    h: "What you can and can't advertise"
    p:
      - "During the early test, OpenAI is mostly accepting consumer categories: lifestyle and household goods, **local services**, travel, and digital products and education. Every ad is reviewed before it runs."
    list:
      - "**Housing:** ads for a specific home for sale or rent are prohibited. You can send people to a site with listings if the ad and its landing page don't feature a specific one."
      - "**Money:** financial services, including mortgages, are limited to approved advertisers, and may need proof of a license."
      - "**Licensed work:** legal and health services need the right license and approval."
      - "**Where:** your business must be based in a country Ads Manager serves, which includes the U.S., Canada, the U.K. and Australia. New accounts advertise in their home country first."
  - id: agents
    h: "Sponsored agents: an ad that opens a chat"
    p:
      - "OpenAI is testing ads that open a conversation with a business's own agent instead of a web page. The customer asks their questions there, then follows a link to the website. It's built in Ads Manager on a campaign set to optimize for conversions, and it's limited to selected advertisers for now."
    link: {label: "What business agents are", href: "/chatgpt/business-agents"}
  - id: start
    h: "How to start, step by step"
    ol:
      - "**Win the free answer first.** Ads sit under the answer. If ChatGPT already names a competitor above your ad, you're paying to be second. [Check where you stand](#check)."
      - "**Make the landing page worth the click:** your services, your area, your phone number and a quick way to book."
      - "**Set up tracking** so calls and form fills count as conversions."
      - "**Start in your own city** with a $50 to $100 daily budget on clicks, and one ad per main service."
      - "**Read the numbers weekly:** cost per click, cost per lead, and which questions your ad showed up for."
      - "**Answer every lead in minutes.** An ad click that waits until tomorrow is money gone."
addon:
  k: "ChatGPT Ads pilot, contractors only"
  h: "We'll run your ChatGPT ads, and three spots are open."
  p: "We're running managed ChatGPT ads for our first three contractor clients: $240 to set up, then $340 a month flat. Your ad budget goes straight to OpenAI on your own card, and we recommend $50 to $100 a day to start. We set up tracking, write and test the ads, aim them at your service area, and report cost per lead every week. Ask on a call."
  link: {label: "Book a call about ChatGPT ads", href: "/schedule-demo?topic=ChatGPT%20ads"}
questions:
  - q: "How much do ChatGPT ads cost?"
    a: "The minimum daily budget is $25 in the U.S. You pay per 1,000 views, per click, or for conversions (still billed per click or per 1,000 views). OpenAI suggested starting bids of about $3 to $5 a click when it opened Ads Manager in May 2026."
  - q: "Where do I sign up for ChatGPT ads?"
    a: "In OpenAI's self-serve Ads Manager at ads.openai.com. Your business has to be based in a country it serves, and every ad is reviewed before it runs."
  - q: "Can I target my city with ChatGPT ads?"
    a: "Yes, where it's available. Campaigns can target by country, and by state, city or ZIP code, along with device."
  - q: "Do ChatGPT ads affect ChatGPT's answers?"
    a: "No. Ads appear under the answer and run on separate systems. Advertisers can't change what ChatGPT recommends, which is why we work on both: earning a place in the answer and, for contractors, an ad under it."
  - q: "Who sees ads in ChatGPT?"
    a: "People on the Free and Go plans. Plus, Pro, Business, Enterprise and Edu users don't see ads, and neither does anyone under 18."
  - q: "Can real estate agents run ChatGPT ads?"
    a: "Ads for a specific home for sale or rent are prohibited. An ad for the agent and their services, with no listing in it, isn't banned by the policy, but every ad is reviewed, and mortgage ads are restricted."
  - q: "Are ChatGPT ads worth it for a contractor?"
    a: "They can be, because the questions are urgent and one job pays for many clicks. Start only after the basics are right: being named in the answer, a landing page that books, and someone answering every lead in minutes."
  - q: "What does AMTECH charge to run ChatGPT ads?"
    a: "For our first three contractor clients, $240 to set up and $340 a month flat. Your ad budget goes directly to OpenAI on your own card."
closing_h: "Before you buy the ad, check the answer."
closing_sub: "If ChatGPT already names you, an ad doubles your spot. If it names someone else, fix that first. It's free to find out."
ask_prompt: "How do ads in ChatGPT work for a local contractor: cost, targeting and rules?"
reviewed: {by: "Ben Palaskas", date: "2026-11-16"}
---
