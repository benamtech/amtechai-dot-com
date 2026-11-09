---
# /contact, moved 2026-11-09 (session `lena`) onto layouts/landing.html, the style of the rest of the site: the hero with
# a call as the action, the four ways to reach AMTECH as cards, questions, Ask the AIs, the close. Every fact as before.
llms: { order: 8, label: "Contact", text: "reach Ben by email or phone." }
title: "Contact AMTECH"
description: "Book a call with Ben Palaskas, email or phone him, start your own AI team on a real job, or sign in to the one you have."
route: "/contact"
layout: "landing"
crumb: "Contact"
names: {employee: "Your lead agent", t1: "Operations", t2: "Sales", t3: "Marketing", t4: "Finance", t5: "Research", t6: "Builder"}
team: [employee, t2, t3, t4, t5, t1, t6]
h1a: "Talk to a person."
h1b: "Or give it the work."
sub: "AMTECH is Ben Palaskas. Book a call, email him or phone him. Or start your own AI team on a real job now."
answer: "To reach AMTECH AI, book a call with its founder Ben Palaskas at amtechai.com/schedule-demo, email ben@amtechai.com, or phone (805) 886-9173. Existing customers sign in at app.amtechai.com."
field: "Your business's name"
button: "Book a call"
book: {industry: "Something else", topic: "A custom agent setup"}
prices: "Custom agents with guaranteed results from $1,200/mo. Or pay as you go from $50/mo."
hero_img: "img/hubs/questions.png"
hero_alt: "A business owner at a cafe window in the morning, a coffee and a phone on the table"
panel:
  firm: "Your business"
  h: "Your agents"
  rows:
    - {who: t2, state: work}
    - {who: t3, state: work}
    - {who: t4, state: wait}
    - {who: t5, state: work}
    - {who: t1, state: idle}
  card_h: "After the call: Your business"
  steps: ["Learned how your business runs", "Named what you want off your plate first", "Built the team for that work"]
  now: "Starting on the first real job"
  total: "Your team at work the same week."
# `ways`: the email and phone this page offers.
ways:
  - { title: "Book a call", body: "Thirty minutes with Ben Palaskas, at a time you pick. Bring a real job if you have one.", label: "Pick a time", to: "/schedule-demo" }
  - { title: "Email", body: "ben@amtechai.com. Send the job, the question or the file.", label: "Write to Ben", to: "mailto:ben@amtechai.com" }
  - { title: "Phone", body: "(805) 886-9173.", label: "Call (805) 886-9173", to: "tel:+18058869173" }
  - { title: "Already have an employee", body: "Sign in at app.amtechai.com. Your employee opens with all its work.", label: "Sign in", to: "app:/signup" }
cards_h: "Four ways to reach AMTECH."
cards:
  - {who: [employee], h: "Book a call", p: "Thirty minutes with Ben Palaskas, at a time you pick. Bring a real job if you have one.", href: "/schedule-demo"}
  - {who: [t2], h: "Email", p: "ben@amtechai.com. Send the job, the question or the file.", href: "mailto:ben@amtechai.com"}
  - {who: [t3], h: "Phone", p: "(805) 886-9173.", href: "tel:+18058869173"}
  - {who: [t6], h: "Already have a team", p: "Sign in at app.amtechai.com. Your team opens with all its work.", href: "https://app.amtechai.com/signup"}
offer_h: "Have your team built with you."
offer_p: "Book a call and Ben sets up your team with you, with the results agreed up front. To start on your own today, press Start at the top of any page."
options:
  - {h: "Pay as you go", p: "Your agents on your real work, then pay as you go."}
  - {h: "Custom agents", p: "Set up with you, with guaranteed results, from $1,200 a month."}
questions_h: "Questions"
questions:
  - {q: "Who will I talk to?", a: "Ben Palaskas, who founded AMTECH AI and sets up custom teams himself."}
  - {q: "What should I bring to the call?", a: "A real job if you have one: a plan set, a list you need built, a store, or the work you most want off your plate."}
  - {q: "Is AMTECH AI the same as Amtech Systems?", a: "No. AMTECH AI is a separate technology company that builds and runs teams of AI agents for businesses."}
ask_prompt: "How do I contact AMTECH AI (amtechai.com), and what does it do for a small business?"
closing_h: "Talk to a person."
closing_sub: "Type your business's name and pick a time with Ben."
site_sources: false
reviewed: {by: "Ben Palaskas", date: "2026-11-09"}
---
