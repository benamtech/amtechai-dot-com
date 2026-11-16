---
# /chatgpt, the hub of the ChatGPT section (gala, Opus, 2026-11-16; plan visibility-desk/plans/SITE-CHATGPT-V2.md).
# Function first: the owner's question, the answer, the free check, a real ChatGPT answer. The figures are AMTECH's own
# runs (visibility-desk engine cells, 2026-11-15/16). Facts about OpenAI's features: visibility-desk/research/R-OPENAI-BUSINESS.md.
title: "Does ChatGPT recommend your business? Free check"
description: "See if ChatGPT names your business when customers ask for the best in your trade and town. Free, in a minute. If it doesn't, we put you in the answer."
route: "/chatgpt"
layout: "gpt"
crumb: "ChatGPT"
okf_type: "Service"
lastmod: 2026-11-16
llms: {order: 33, label: "Getting named in ChatGPT", text: "A free check that shows whether ChatGPT names a local business when customers ask for the best in its trade and town, and which businesses it names instead. AMTECH then gets the business into the answer: its ChatGPT directory page written and claimed, every free list ChatGPT reads applied to, its details matched everywhere, and a monthly re-check. Free check and written page; $480 setup; $90 a month."}
h1a: "Does ChatGPT recommend"
h1b: "your business?"
answer: "When a customer asks ChatGPT for the best roofer, plumber or real estate agent in town, it names three to five businesses. In November 2026 we asked it about 165 local businesses in six trades, and it never named 132 of them. Check yours below. If you're not in the answer, we'll put you there."
check: {trade: "roofing", ph: ["Ridgeline Roofing", "Louisville", "KY"]}
hero_img: "img/chatgpt/hero.png"
hero_alt: "A small American town at blue hour, its shops and workshops lit from inside"
mock:
  label: "ChatGPT's answer to best roofer in Louisville, Kentucky, naming three companies"
  k: "Asked November 16, 2026"
  q: "best roofer in Louisville, KY"
  intro: "If I were hiring a roofer in Louisville, I'd start with these:"
  names:
    - {n: "Aboveboard Roofing Co", meta: "5.0 stars, 245 reviews. Named in 3 of 3 answers"}
    - {n: "Origin Roofing & Exteriors", meta: "4.9 stars, 354 reviews. Named in 3 of 3 answers"}
    - {n: "KRC Roofing and Construction", meta: "Named in 2 of 3 answers"}
  you: "23 other Louisville roofers"
  verdict: "Never named"
outcomes_h: "What your result means, and what to do next"
outcomes:
  - tone: red
    k: "Not named"
    h: "Customers who ask ChatGPT are being sent to someone else."
    p: "This is where most businesses land, and it's fixable. ChatGPT names the businesses it can read the most about: on the lists it trusts for your trade, in reviews, on their own websites and now in its own directory. We get you onto all of them."
    link: {label: "How we fix it", href: "#offer"}
  - tone: amber
    k: "Named sometimes"
    h: "You're in the running. Now close the gap."
    p: "ChatGPT named you in some answers and a competitor in all of them. The difference is usually one or two lists you're missing, or details that don't match from site to site. Your free fix plan shows which."
    link: {label: "Get the free fix plan", href: "#offer"}
  - tone: green
    k: "Named every time"
    h: "Keep it, and answer every customer it sends."
    p: "Claim your directory page so your own details are the ones ChatGPT shows, check the answer every month, and make sure every call and message it sends you gets answered in minutes."
    link: {label: "Answer every lead", href: "/questions/can-an-ai-employee-follow-up-every-lead"}
blocks:
  - id: how
    h: "How ChatGPT decides who to name"
    p:
      - "ChatGPT doesn't keep a ranked list of businesses. When someone asks for a recommendation, it searches the web, reads what it finds and names the businesses those pages agree on. So the question is simple: what can it read about you?"
    list:
      - "**The lists it trusts.** The \"best of\" pages for your trade and town: Expertise.com, BestProsInTown, Angi and HomeAdvisor for contractors, Zillow, Realtor.com and FastExpert for agents. If you're not on them, you're usually not in the answer."
      - "**Your reviews.** How many, how good and how recent, on Google, Yelp and the sites for your trade."
      - "**Your own website.** Your services, the towns you work in and your phone number, written as plain text a machine can read."
      - "**Its new business directory.** The page you can now claim inside ChatGPT and fill in yourself."
    after: "Reviews alone don't do it. One Louisville roofer has more than 1,500 Google reviews, six times as many as the company ChatGPT put first, and it was named in one answer out of three."
    img: "img/painting/paint-walkthrough.png"
    alt: "A homeowner holding up a phone in a half-painted room"
  - id: directory
    h: "The new ChatGPT business directory"
    p:
      - "On November 10, 2026, OpenAI opened **Businesses in ChatGPT**, a directory inside ChatGPT where a business claims its own page. You prove you own the business, then set your description, services, service area, hours, phone, website, logo and photos yourself."
      - "ChatGPT can show that page when customers ask about you. You also get your numbers: how often ChatGPT mentions you, how many people click through to your website, and the topics they ask about. It's free, and it only opened in November, so this is the time to get yours right."
    link: {label: "How the directory works, step by step", href: "/chatgpt/business-directory"}
    img: "img/lead-generation/owners.png"
    alt: "A row of small shops on a main street in the afternoon"
    profile:
      label: "An example business page in the ChatGPT directory"
      k: "A claimed page in ChatGPT"
      mono: "RR"
      name: "Ridgeline Roofing"
      cat: "Roofing contractor, Pittsburgh, PA"
      rows:
        - {k: "Service area", v: "Allegheny and Butler counties"}
        - {k: "Hours", v: "Mon to Sat, 7 a.m. to 6 p.m. Emergency tarping 24/7"}
        - {k: "Services", v: "Replacement, leak repair, storm damage, gutters"}
        - {k: "Phone", v: "(412) 555-0142"}
      btns: ["Website", "Call", "Directions"]
  - id: numbers
    h: "We checked 165 local businesses. ChatGPT never named 132."
    p:
      - "In November 2026 we asked ChatGPT what a customer asks, \"best roofer in Louisville, KY\", three times for each trade and town. Then we checked every local business in that trade against the answers. Four out of five were never named once."
    table:
      cols: ["Trade and town", "Businesses checked", "Never named"]
      rows:
        - ["Roofers, Louisville, KY", "30", "23"]
        - ["Heating and air, Nashville, TN", "30", "25"]
        - ["General contractors, Tacoma, WA", "30", "26"]
        - ["Real estate agents, Tacoma, WA", "30", "24"]
        - ["Property managers, Tacoma, WA", "30", "23"]
        - ["Cash home buyers, Tacoma, WA", "15", "11"]
    after: "Every one of those 132 businesses can be fixed the same way: get on the pages ChatGPT reads, make the details match, claim the directory page, and check again."
addon:
  k: "For contractors: ChatGPT Ads"
  h: "Want to show up under the answer this week?"
  p: "Ads in ChatGPT run under the answer and can be aimed at your city, from $25 a day. We're running a managed pilot for our first three contractors: $240 to set up and $340 a month, and your ad budget goes straight to OpenAI."
  link: {label: "How ChatGPT ads work", href: "/chatgpt/ads"}
questions:
  - q: "How do I get my business recommended by ChatGPT?"
    a: "Get onto the pages ChatGPT reads for your trade and town (the \"best of\" lists, review sites and directories), keep fresh reviews coming in, put your services, towns and phone number on your website as plain text, and claim your page in ChatGPT's business directory. Then check what it says every month. That is the whole job we do for you."
  - q: "Is there a business directory in ChatGPT?"
    a: "Yes. It's called Businesses in ChatGPT, and it opened on November 10, 2026. A business claims its page at chatgpt.com/business-hub, proves it's the owner, and sets its own details. [Here's how it works](/chatgpt/business-directory)."
  - q: "How do I claim my business on ChatGPT?"
    a: "Sign in to ChatGPT, open Business Hub, search for your business and choose Claim. Verify with a code to your business phone or email, or through your website. After OpenAI approves it, finish the ID check with Persona and fill in every field. [The full steps are here](/articles/how-to-claim-your-business-on-chatgpt)."
  - q: "Will claiming my page make ChatGPT recommend me?"
    a: "Not by itself, and OpenAI says so. Claiming makes sure what ChatGPT shows about you is right, and it gives you your numbers. Being recommended comes from what ChatGPT reads about you across the web. That's the rest of the work, and it's what we do."
  - q: "Can I pay to be recommended by ChatGPT?"
    a: "No. ChatGPT's answers can't be bought. Ads appear under the answer, labeled as ads, and OpenAI keeps them apart from the answer itself. We do both: the work that earns a place in the answer, and for contractors, ads under it."
  - q: "What does it cost?"
    a: "The check, your written ChatGPT page and the fix plan are free. Setup is $480 once. Keeping you in the answer is $90 a month, and you can cancel any time. If a list charges to be on it, we tell you which ones are worth it before you spend anything."
  - q: "How long does it take?"
    a: "The check takes a minute, and your written page and fix plan come within a day. Setup is one 20-minute call and our work after it, and the list applications go out the same week. Some lists add you within days, while lists picked by editors take longer. We check ChatGPT again every month and show you what changed."
  - q: "Do you need my password?"
    a: "No. You claim the page with your own ChatGPT account, then add AMTECH as your agency inside Business Hub. OpenAI built it that way on purpose, and you can remove us whenever you like."
  - q: "Does this help on Google too?"
    a: "Yes. The lists, the reviews and a clear website are what Google's local results and AI Overviews read as well. If you want your website and Google listing run for you, that's our [Being found service](/departments/being-found)."
closing_h: "Find out who ChatGPT sends your customers to."
closing_sub: "It's free, it takes about a minute, and you'll see exactly who it names instead of you."
ask_prompt: "Does ChatGPT recommend my business, and how does AMTECH AI (amtechai.com) help local businesses get named in ChatGPT?"
reviewed: {by: "Ben Palaskas", date: "2026-11-16"}
---
