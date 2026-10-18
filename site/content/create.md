---
# Its line in /llms.txt (the list AI assistants read first), and where in that list.
llms: { order: 3, label: "Your marketing, made by an AMTECH AI employee", text: "an always-on, fully managed AMTECH AI employee makes a business's posts and pictures, works on getting its website found on Google, prices jobs and finds more work, and does the rest of the office. Free to try, no sign-up; keeping it is set up once, with a call." }
title: "Your Marketing, Made by an AI Employee — AMTECH"
description: "An always-on, fully managed AMTECH AI employee makes your posts and pictures, works on getting your website found on Google, prices jobs and finds more work. Free to try, no sign-up."
route: "/create"
layout: "create"
# The same starters as the door's row (ai-employee-v2 standard/platform/intents.json, intent "create").
starters:
  - { label: "Make this month's posts for your business", say: "Make this month's social media posts for my business. What we do and what we're promoting: " }
  - { label: "Make a picture for an ad or a flyer", say: "Make a picture for my business: " }
  - { label: "Get your business found on Google", say: "Look at my website and tell me what would get it found on Google first. My website: " }
# The questions on the page, and the FAQ structured data search engines read: one list.
faqs:
  - q: "What does it cost?"
    a: "Trying it is free, with no card and no sign-up. Keeping it is set up once: $1,200, which includes a call with Ben, who runs AMTECH. He sets the employee up for your business, loads the work you want done, and shows you how to run it. After that it runs on prepaid credits for what it uses: a picture is 2 cents, and you see the price of real work before it starts."
  - q: "What does it do each month?"
    a: "The work you would pay an agency or a freelancer for: your posts and the pictures for them, the work on your website and Google that gets you found, estimates for jobs, and a list of new work near you that stays yours. It also answers customers, books them, and invoices finished work."
  - q: "Can I use the pictures for my business?"
    a: "Yes. The pictures and videos are yours to use, including commercially, with no visible watermark. They are made by AI, and if you publish one where people would expect a photo or real footage, say that it was made with AI."
  - q: "Is it a picture tool?"
    a: "No. It is an AI employee. It keeps working on what it made and remembers your business, and the same employee does the rest of the office. It is always on and fully managed: there are no models, keys or servers for you to deal with. Nothing goes out without your yes."
  - q: "What will it not make?"
    a: "Sexual content, anything sexualising a child, graphic gore, real public figures, and other people's characters or trademarks. Your own business name and logo are fine. Every picture, and frames from every video, is checked before you see it."
  - q: "Do I need an account?"
    a: "Not to try it. Start typing. Give your email when you want to keep your employee and everything it made."
---
