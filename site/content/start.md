---
# /start: the start field on every page sends the business's name here (GET ?business=...&industry=...&config=...&for=...);
# this page mounts the AI employee's workspace and gives it the name as the first input. Never indexed, never in the
# sitemap, never prerendered (a prerender would open a visit). lane SITEBUILD, onboarding-handoff.json step 1; the page
# finished by lane START, 2026-10-27. Every word below is the page's; layouts/start.html only places them. The name the
# visitor typed is put beside `setting` by the page's script (their own words, never built into a sentence here).
title: "Your AI employee"
description: "Your AMTECH AI employee starts here, with your business's name as the first thing it reads."
layout: start
noindex: true
sitemap_exclude: true

home_label: "AMTECH home"
signin: "Sign in"
setting: "Setting up"
next_h: "What happens next"
next:
  - "Your employee reads your website and your Google listing, learns what you sell and where you work, and starts on real work for your business."
  - "You see everything before it goes out. No message, page, payment or booking leaves your business until you say yes."
  - "Starting is free. No card, and no sign-up until you decide to keep your employee."
loading: "Opening your employee's workspace"
fail_h: "Your employee's workspace did not open."
fail_p: "A slow connection or a blocker in this browser stopped the workspace loading. Nothing was sent anywhere. Try again, or reach Ben Palaskas, who runs AMTECH, and he will set your employee up with you."
retry: "Try again"
help_h: "Rather talk to a person?"
contact_label: "Every way to reach us"
empty_h: "Name your business and meet your employee."
empty_p: "Type your business's name. Your AI employee reads your website and your Google listing and starts on the work while you watch."
check: "One check that you are a person, then your words go to your employee."
noscript: "Your AI employee works inside this page, and the page needs JavaScript to open the workspace. Turn JavaScript on and reload, or email ben@amtechai.com and Ben will set your employee up with you."
---
