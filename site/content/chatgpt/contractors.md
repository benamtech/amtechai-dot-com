---
# /chatgpt/contractors (gala, Opus, 2026-11-16; replaces /chatgpt-for-contractors). The trades hub: every contractor
# niche page, how ChatGPT picks contractors, the lists it reads (tools/engine/lists.json), our checks across four trades,
# and the ads pilot. Real answer: plumber Pittsburgh, PA (engine harvest 2026-11-16).
title: "ChatGPT for contractors: be the company it tells homeowners to call"
description: "Homeowners now ask ChatGPT which roofer, plumber or contractor to call. See if it names you, free. How it picks contractors and how to get named."
route: "/chatgpt/contractors"
layout: "gpt"
crumb: "Contractors"
weight: 20
audience: "Contractors and home service companies"
lastmod: 2026-11-16
llms: {order: 41, label: "ChatGPT for contractors", text: "How ChatGPT recommends contractors and home service companies (in AMTECH's November 2026 checks it never named 23 of 30 Louisville roofers, 25 of 30 Nashville HVAC companies and 26 of 30 Tacoma general contractors), the lists it reads, a free check, the setup to get named, managed ChatGPT ads for contractors, and the AI employee that answers every call."}
h1a: "Does ChatGPT tell homeowners"
h1b: "to call you?"
answer: "When a pipe bursts or a storm takes off shingles, more homeowners now ask ChatGPT who to call, and it names three to five companies. In our November checks it never named 23 of 30 roofers in Louisville, 25 of 30 HVAC companies in Nashville or 26 of 30 general contractors in Tacoma. Check yours. If you're not named, we'll fix it."
check: {trade: "plumber", ph: ["Three Rivers Plumbing", "Pittsburgh", "PA"]}
hero_img: "img/home/crew.png"
hero_alt: "A contractor crew arriving at a job site at sunrise"
mock:
  label: "ChatGPT's answer to best plumber in Pittsburgh, Pennsylvania"
  k: "Asked November 16, 2026"
  q: "best plumber in Pittsburgh, PA"
  intro: "Based on current ratings, review volume, and service offerings, here's my Pittsburgh shortlist:"
  names:
    - {n: "Stahl Plumbing and Drain", meta: "Named in 3 of 3 answers"}
    - {n: "Mr. Rooter Plumbing of Pittsburgh", meta: "Named in 3 of 3 answers"}
    - {n: "Revelation Plumbing", meta: "Named in 2 of 3 answers"}
outcomes_h: "What homeowners ask ChatGPT"
outcomes:
  - tone: ask
    k: "Right now"
    h: "\"My AC just died, it's 9 p.m. in East Nashville. Who do I call?\""
    p: "Emergencies go to whoever ChatGPT names and whoever picks up. Being named and answering at night are both the job."
  - tone: ask
    k: "Planning"
    h: "\"Who can I trust to gut my kitchen in Franklin?\""
    p: "Big jobs start with research. ChatGPT reads reviews, portfolios and \"best of\" lists, then gives a shortlist."
  - tone: ask
    k: "Checking you"
    h: "\"Is Ridgeline Roofing any good? Are they licensed?\""
    p: "Before calling you back, they ask about you by name. Your directory page and reviews decide what they hear."
blocks:
  - id: trades
    h: "Pick your trade"
    p:
      - "Each trade gets asked different questions and ChatGPT reads different lists for each. Every page below shows a real answer for that trade and what to fix."
    list:
      - "[Roofers](/chatgpt/roofers): storm damage, insurance claims and replacements."
      - "[HVAC companies](/chatgpt/hvac): no heat, no AC and maintenance plans."
      - "[Plumbers](/chatgpt/plumbers): burst pipes, water heaters and drains."
      - "[Electricians](/chatgpt/electricians): panels, EV chargers and generators."
      - "[General contractors](/chatgpt/general-contractors): additions, new builds and big projects."
      - "[Remodelers](/chatgpt/remodelers): kitchens, baths and whole houses."
      - "[Landscapers](/chatgpt/landscapers): design, hardscape and lawn care."
      - "[Painters](/chatgpt/painters): interiors, exteriors and cabinets."
    img: "img/contractors/permits.png"
    alt: "A tradesman with a tablet inside a framed house"
  - id: how
    h: "Where ChatGPT gets its answer for contractors"
    p:
      - "ChatGPT searches, reads, and names the companies the pages agree on. For contractors, these are the pages it cited most in our runs:"
    table:
      cols: ["Where it reads", "How it picks", "How you get on it"]
      rows:
        - ["Expertise.com's best in your city", "Editors, with a stated method", "Free to submit"]
        - ["BestProsInTown", "Reviews plus paid profiles", "Free basic listing; the AI profile is $469 a year"]
        - ["ThreeBestRated", "Editors", "Free to submit"]
        - ["Angi and HomeAdvisor", "Paid lead networks", "Pay per lead"]
        - ["Houzz", "Reviews, photos and paid Pro plans", "Free profile; Pro from $199 a month"]
        - ["Better Business Bureau", "Complaints and accreditation", "Free listing; accreditation is paid"]
        - ["Local newspaper \"best of\" contests", "Reader nominations and votes", "Get your customers to nominate you"]
    after: "We apply our clients to every free list ChatGPT cites for their trade and town. The paid ones are your choice, and we tell you which ones are actually read before you spend."
  - id: hours
    h: "The question nobody else answers: who picks up at 9 p.m.?"
    p:
      - "ChatGPT can tell a homeowner who's good. It can't make you answer. Most of the urgent calls it sends come at night and on weekends, and the homeowner calls the next name if you don't pick up."
      - "That's why our ChatGPT clients usually add the AI employee: it answers every call and text in seconds, books the visit and sends you the details. Being named gets the call. Answering gets the job."
    link: {label: "See how it answers every lead", href: "/questions/can-an-ai-employee-follow-up-every-lead"}
    img: "img/home/night.png"
    alt: "A small town at night with shop windows lit"
    mock:
      label: "An AMTECH AI employee answering a homeowner's text at night"
      who: "Text message"
      k: "Your AI employee, by text, 9:12 p.m."
      q: "AC stopped blowing cold, it's 88 inside. Can someone come tonight?"
      intro: "Sorry, that's miserable. Our on-call tech can be there between 10 and 11 tonight. Want me to book it?"
      names:
        - {n: "Book tonight, 10 to 11 p.m.", meta: "Reply YES"}
        - {n: "First thing tomorrow, 7 to 9 a.m.", meta: "Reply 2"}
addon:
  k: "ChatGPT Ads pilot, contractors only"
  h: "Want to show up under the answer this week?"
  p: "Ads in ChatGPT run under the answer and can be aimed at your service area, from $25 a day. We're running managed ads for our first three contractor clients: $240 to set up and $340 a month flat. Your ad budget goes straight to OpenAI."
  link: {label: "How ChatGPT ads work", href: "/chatgpt/ads"}
questions:
  - q: "How do contractors get recommended by ChatGPT?"
    a: "Get onto the lists ChatGPT reads for your trade and town (Expertise.com, BestProsInTown, ThreeBestRated, BBB and your local \"best of\"), keep fresh Google reviews coming, put your services, service area and phone number on your website as text, and claim your page in ChatGPT's business directory. Then check what it says every month."
  - q: "Do I have to pay Angi or HomeAdvisor to be named?"
    a: "No. ChatGPT reads those sites, but it also reads free lists, your reviews and your own website. Paying for leads isn't a requirement for being named."
  - q: "Does ChatGPT use Google reviews?"
    a: "ChatGPT often shows star ratings and review counts when it names a company, and reviews are part of what it reads. But reviews alone don't do it: one Louisville roofer with more than 1,500 Google reviews was named in only one answer out of three."
  - q: "What does it cost?"
    a: "The check, your written ChatGPT page and the fix plan are free. Setup is $480 once and $90 a month to keep you there, cancel any time. ChatGPT ads for contractors are a separate pilot: $240 setup and $340 a month."
  - q: "I work in several towns. Does that matter?"
    a: "Yes. ChatGPT answers town by town. We start with the town that matters most to you and add the rest, with a service-area line on your page and your site for each."
closing_h: "Find out who ChatGPT tells homeowners to call."
closing_sub: "It's free and takes about a minute. You'll see whether it names you, and exactly who it names instead."
ask_prompt: "How does ChatGPT decide which contractors to recommend to homeowners, and how does a contractor get named?"
reviewed: {by: "Ben Palaskas", date: "2026-11-16"}
---
