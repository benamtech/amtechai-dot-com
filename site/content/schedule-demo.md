---
# Its line in /llms.txt (the list AI assistants read first), and where in that list.
llms: { order: 7, label: "Talk to Ben", text: "book a call with Ben Palaskas." }
title: "Book a call with Ben Palaskas"
description: "Book thirty minutes with Ben Palaskas, AMTECH's founder: your business, the custom agent setup, and a real job if you bring one."
route: "/schedule-demo"
layout: "schedule-demo"
crumb: "Book a call"
no_start: true
site_sources: false
h1a: "Book a call with"
h1b: "Ben Palaskas."
sub: "Thirty minutes with AMTECH's founder, at a time you pick. Bring your business and a real job if you have one; you leave knowing what your AI employee would take off your plate first."
covers_h: "What the call covers"
covers:
  - "How your business runs today, and what you want off your plate first"
  - "The custom agent setup: the departments your agents would run, and the results they are held to"
  - "Training for you and your people in working with your AI team"
  - "A real job, done on the call, if you bring one"
twin_p: "The booking asks for a name, an email address and the business's name, then its industry, the topic, and a day and time on Ben's calendar (Eastern Time, shown in the visitor's own time zone). Ben is told of every booking. Book at"
steps: ["Your details", "Industry", "Topic", "Day and time"]
fields:
  - {k: name, label: "Your name", type: text, ph: "Jane Smith", ac: name}
  - {k: email, label: "Email address", type: email, ph: "jane@yourbusiness.com", ac: email}
  - {k: organization, label: "Your business's name", type: text, ph: "Smith Roofing", ac: organization}
pick:
  industry_q: "What kind of business is it?"
  industry_sub: "So the call starts from your trade."
  topic_q: "What would you like to talk about?"
  topic_sub: "Pick the one that matters most; the rest can come up on the call."
  time_q: "Pick a day and a time"
words:
  steps_label: "Booking steps"
  continue: "Continue"
  back: "Back"
  confirm: "Book the call"
  sending: "Booking..."
  taken: "That time was just taken. Pick another"
  failed: "That did not go through. Try again"
  prev: "Previous month"
  next: "Next month"
  zone: "Times in"
  zone_label: "Time zone"
  weekdays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  pick_date: "Pick a day first"
  full: "That day is fully booked. Pick another."
  loading: "Loading the open times..."
  parts: ["Morning", "Afternoon", "Evening"]
  name_req: "Your name, please"
  email_req: "Your email address, please"
  email_bad: "That email address does not look right"
  org_req: "Your business's name, please"
  eastern: "Eastern Time"
  note: "is when the call is on Ben's calendar"
industries:
  - "Roofing"
  - "Landscaping"
  - "Painting"
  - "Contracting and the trades"
  - "Hospitality and restaurants"
  - "Transportation and logistics"
  - "An agency serving businesses"
  - "Something else"
topics:
  - "An AI employee for my business"
  - "A custom agent setup"
  - "Estimates and takeoffs"
  - "Being found on Google and in AI answers"
  - "Leads and follow-up"
  - "Running several businesses or clients"
  - "Something else"
done_h: "Your call is booked."
done_p: "Ben has your booking. Booked under"
done_rows:
  - {label: "Day", k: bookingDate}
  - {label: "Time", k: bookingTime}
  - {label: "Name", k: name}
  - {label: "Business", k: organization}
  - {label: "Industry", k: industry}
  - {label: "Topic", k: topic}
done_back: "Back to the home page"
other_h: "Or reach AMTECH another way"
other:
  - {title: "Start now", body: "Name your business and your AI employee starts on it, before any call.", label: "Start free", to: "/#start"}
  - {title: "Email", body: "ben@amtechai.com. Send the job, the question or the file.", label: "Write to Ben", to: "mailto:ben@amtechai.com"}
  - {title: "Phone", body: "(805) 886-9173.", label: "Call (805) 886-9173", to: "tel:+18058869173"}
  - {title: "Pricing", body: "Start free and pay as you go, or custom agents with guaranteed results.", label: "See pricing", to: "/pricing"}
---
