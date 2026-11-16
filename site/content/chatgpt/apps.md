---
# /chatgpt/apps (gala, Opus, 2026-11-16). ChatGPT apps (OpenAI now calls them plugins): what they are, how customers use
# them, Zillow and Angi and what they mean for agents and contractors, what it takes to have your own, and when that is
# worth it. Facts: R-OPENAI-BUSINESS.md section 3 and 6 (developers.openai.com/plugins, help 11487775, Zillow newsroom
# 2025-10-06, Localogy 2026-04-02).
title: "ChatGPT apps (plugins) explained: Zillow, Angi and what they mean for your leads"
description: "Zillow and Angi now run inside ChatGPT. What ChatGPT apps (now plugins) are, what they mean for agents and contractors, and when your own makes sense."
route: "/chatgpt/apps"
layout: "gpt"
crumb: "ChatGPT apps"
weight: 3
audience: "Real estate agents, contractors and local service businesses"
lastmod: 2026-11-16
llms: {order: 36, label: "ChatGPT apps (plugins)", text: "What ChatGPT apps are (OpenAI now calls them plugins), how customers use Zillow, Angi, Booking.com and others inside ChatGPT, what that means for real estate agents' and contractors' leads, and when a business should have its own app built."}
h1a: "What are ChatGPT apps,"
h1b: "and do you need one?"
answer: "ChatGPT apps, which OpenAI now calls plugins, let a customer use another company's service right inside ChatGPT. Someone can search homes with Zillow or get matched with a contractor through Angi without leaving the chat. Most local businesses don't need their own app. They need to be strong on the apps their customers already use, and named in ChatGPT's own answer."
check: {trade: "realtor"}
hero_img: "img/real-estate/listings.png"
hero_alt: "A bright living room with tall windows looking out over hills at dusk"
mock:
  label: "A customer using the Angi app inside ChatGPT to find a contractor"
  k: "ChatGPT, with the Angi app"
  q: "@Angi I need my water heater replaced in Pittsburgh this week"
  intro: "Angi can match you with local pros for this job. Here's how it works:"
  names:
    - {n: "Tell Angi about the job", meta: "Tank or tankless, gas or electric, when you need it"}
    - {n: "Get matched with pros", meta: "Angi picks which local pros see your request"}
    - {n: "Compare quotes and book", meta: "Through Angi"}
outcomes_h: "Three ways a customer can find you inside ChatGPT"
outcomes:
  - tone: green
    k: "The answer"
    h: "ChatGPT names you itself."
    p: "The customer asks for the best plumber in town and ChatGPT names three. Nobody takes a cut, and it's the spot worth fighting for."
    link: {label: "Check if it names you", href: "#check"}
  - tone: amber
    k: "An app"
    h: "A marketplace app sends you the lead."
    p: "The customer uses Zillow or Angi inside ChatGPT. The marketplace decides who gets the lead, and usually charges for it."
  - tone: amber
    k: "An ad"
    h: "You pay to appear under the answer."
    p: "A labeled ad below ChatGPT's answer, aimed at your city. Useful for contractors who want calls this week."
    link: {label: "How ChatGPT ads work", href: "/chatgpt/ads"}
blocks:
  - id: what
    h: "How ChatGPT apps work"
    p:
      - "An app connects ChatGPT to a service the customer already uses. Some only fetch information. Others show interactive results, like a map of homes or a list of pros, or let ChatGPT take an action for the customer."
    list:
      - "**Customers turn them on** in ChatGPT's settings, where they're now listed as plugins, and connect an account if the app needs one."
      - "**They call one up** by typing @ and the app's name, or by choosing it from the + menu. ChatGPT can also suggest an app when it fits the question."
      - "**The apps come from one directory** that OpenAI shares between ChatGPT and Codex, its coding tool."
      - "**Big names are already there:** Zillow for homes, Angi for home services, plus Booking.com, Expedia, DoorDash and Uber."
    img: "img/painting/paint-walkthrough.png"
    alt: "A person holding up a phone in a bright living room"
  - id: agents
    h: "What this means for real estate agents"
    p:
      - "Zillow was the first real estate app in ChatGPT, in October 2025, and it's still the only one. A buyer can start a question with \"Zillow\" and see listings, photos, maps and prices inside the chat. When they want a tour or an agent, that request goes through Zillow."
      - "So for a buyer using the Zillow app, Zillow decides which agent gets the lead. For a buyer who simply asks ChatGPT \"who's the best agent in Tacoma?\", ChatGPT decides, from the lists, reviews and pages it reads. The second one costs you nothing per lead. In our November check of 30 Tacoma agents, ChatGPT never named 24 of them."
    after: "Do both. Keep your Zillow and Realtor.com profiles complete with recent reviews, and make sure ChatGPT can name you without a marketplace in the middle."
    link: {label: "ChatGPT for real estate agents", href: "/chatgpt/real-estate-agents"}
    img: "img/real-estate/reviews.png"
    alt: "A couple on the porch of the house they just bought"
  - id: contractors
    h: "What this means for contractors"
    p:
      - "Angi's app answers home service questions inside ChatGPT, then connects the homeowner with service pros, quotes and booking. That's the same lead marketplace you know, with a new front door."
      - "If Angi works for you, keep your profile sharp. If you'd rather not pay per lead, the answer ChatGPT gives on its own is the one to win: \"best roofer in Louisville\" is asked without any app at all, and it names three to five companies."
    link: {label: "ChatGPT for contractors", href: "/chatgpt/contractors"}
    img: "img/home/crew.png"
    alt: "A contractor crew arriving at a job site at sunrise"
  - id: own
    h: "When your own ChatGPT app makes sense"
    p:
      - "Building an app is real software work. It's a small server that follows OpenAI's app standard (the Model Context Protocol), sometimes with its own screens, submitted by a verified business with a privacy policy and a test account, then reviewed by OpenAI. Selling through an app is limited to physical goods for now."
      - "For a single contractor or agent, it's rarely the first move. It starts to pay off when you have something customers want to search or use, such as:"
    list:
      - "a brokerage or team with its own listings, open houses and neighborhood data;"
      - "a home service company with online pricing, scheduling and service areas across several towns;"
      - "a supplier or store with live stock and prices."
    after: "We build these as part of custom AI systems, from $5,000. Most owners are better served first by being named in ChatGPT's answer and answering every lead fast, so that's where we usually start."
    link: {label: "Talk through whether you need one", href: "/schedule-demo?topic=A%20custom%20agent%20setup"}
questions:
  - q: "What are ChatGPT apps?"
    a: "They're other companies' services that run inside ChatGPT. A customer can search homes with Zillow, get matched with a home service pro through Angi, or book travel with Booking.com without leaving the chat. OpenAI now calls them plugins."
  - q: "Are ChatGPT apps and plugins the same thing?"
    a: "Yes. OpenAI now calls them plugins, and its developer documentation lives under that name. Older versions of the ChatGPT app may still say Apps."
  - q: "Can my small business have its own ChatGPT app?"
    a: "Yes, if a verified business builds one to OpenAI's standard and it passes review. It's software work, and for most local businesses it isn't the first thing to do. Being named in ChatGPT's answer and answering every lead fast usually pays back sooner."
  - q: "How much does a ChatGPT app cost to build?"
    a: "OpenAI doesn't charge to list one. The cost is building and maintaining it. We build them inside custom AI systems, which start at $5,000."
  - q: "Does Zillow's ChatGPT app send leads to agents?"
    a: "When a buyer in the Zillow app asks for a tour or an agent, that request goes through Zillow, so Zillow decides who gets it. When a buyer asks ChatGPT directly for the best agent in town, ChatGPT decides from what it reads."
  - q: "Should a contractor join Angi because of ChatGPT?"
    a: "Only if paying for leads already works for you. The Angi app adds a new way in, not a new rule. Plenty of homeowners ask ChatGPT directly, and that answer can name you with no lead fee."
  - q: "Do apps replace the ChatGPT business directory?"
    a: "No. They're separate things. The [business directory](/chatgpt/business-directory) is your own page inside ChatGPT, and apps are other companies' services that customers can use there."
closing_h: "Win the answer that has no middleman."
closing_sub: "See whether ChatGPT names you when a customer asks for the best in your trade and town."
ask_prompt: "What are ChatGPT apps (plugins) like Zillow and Angi, and what do they mean for local businesses?"
reviewed: {by: "Ben Palaskas", date: "2026-11-16"}
---
