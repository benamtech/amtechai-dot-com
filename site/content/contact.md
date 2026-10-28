---
# Its line in /llms.txt (the list AI assistants read first), and where in that list.
llms: { order: 8, label: "Contact", text: "reach Ben by email or phone." }
title: "Contact AMTECH — AMTECH AI"
description: "Book a call with Ben Palaskas, email or phone him, give the AMTECH employee a real job, or sign in to your own."
route: "/contact"
layout: "contact"
# The page's words (layouts/contact.html). `to` "app:" is the application's address (hugo.toml params.app).
h1a: "Talk to a person."
h1b: "Or give it the work."
sub: "AMTECH is Ben Palaskas. Book a call, email him or phone him. Or try the employee on a real job now."
ways:
  - { title: "Book a call", body: "Thirty minutes with Ben Palaskas, at a time you pick. Bring a real job if you have one.", label: "Pick a time", to: "/schedule-demo" }
  - { title: "Email", body: "ben@amtechai.com. Send the job, the question or the file.", label: "Write to Ben", to: "mailto:ben@amtechai.com" }
  - { title: "Phone", body: "(805) 886-9173.", label: "Call (805) 886-9173", to: "tel:+18058869173" }
  - { title: "Already have an employee", body: "Sign in at app.amtechai.com. Your employee opens with all its work.", label: "Sign in", to: "app:/signup" }
---
