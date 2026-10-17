---
# Its line in /llms.txt (the list AI assistants read first), and where in that list.
llms: { order: 3, label: "Pictures and videos from an AMTECH AI employee", text: "describe a picture or a short video and an always-on, fully managed AMTECH AI employee makes it, checks it and keeps working on it with you, then on the rest of the business. 2 cents a picture, video by the second, free to start, no sign-up." }
title: "Pictures and Videos From an AI Employee — AMTECH Create"
description: "Describe a picture or a short video and an always-on, fully managed AMTECH AI employee makes it, checks it and keeps improving it. 2 cents a picture, video by the second. Free to start, no sign-up, no subscription."
route: "/create"
layout: "create"
starters:
  - { label: "A product photo", say: "A clean product photo of a ceramic coffee mug on a sunlit wooden table, a small fern behind it", frame: "4:5" }
  - { label: "A post for my business", say: "A bright Instagram post for a family-run bakery: a tray of fresh croissants by a window in the morning", frame: "4:5" }
  - { label: "A poster", say: "A bold poster for a summer street-food night: neon signs, a crowd under string lights, the words FRIDAY NIGHT MARKET", frame: "2:3" }
  - { label: "A phone wallpaper", say: "A quiet mountain lake at dawn, mist on the water, one red canoe", frame: "9:16" }
  - { label: "A website banner", say: "A wide banner for a plumbing company: a clean modern bathroom, warm light, no people", frame: "16:9" }
  - { label: "A short video", say: "A 6-second video with sound: steam rising from a fresh cup of coffee on a café counter, morning light, the camera slowly pushing in", frame: "16:9" }
# The questions on the page, and the FAQ structured data search engines read: one list.
faqs:
  - q: "What does it cost?"
    a: "2 cents a picture, 4 cents for a large one. Video is charged by the second it delivers: 5 cents a second when AMTECH's own video machines make it, 16 cents when they are not running, and the employee says which. You start with 40 free credits (20 pictures) and no card. After that you add credit in packs of $5, $10 or $20. There is no subscription and credits never expire. A piece that fails is not charged."
  - q: "What makes the pictures and videos?"
    a: "Pictures: FLUX 3 Image (Klein), Black Forest Labs' picture model. Video, with sound: LTX-2.5 on AMTECH's own machines, or Google's Veo 3.1 Lite when those are not running. The employee writes the detailed description each model needs from your plain words and checks what comes back before you see it, so you never have to learn to prompt."
  - q: "Can I use the pictures for my business?"
    a: "Yes. The pictures and videos are yours to use, including commercially. There is no visible watermark (videos made by Veo carry Google's invisible SynthID mark). They are made by AI, and if you publish one where people would expect a photo or real footage, say that it was made with AI."
  - q: "What is different from other AI picture sites?"
    a: "This is an AI employee, not a picture tool. It keeps working on what it made and remembers your pieces, and the same employee does the rest of the office: posts, pricing, invoices, follow-ups, your website. It is always on and fully managed: there are no models, keys or servers for you to deal with. Nothing goes out without your yes."
  - q: "What will it not make?"
    a: "Sexual content, anything sexualising a child, graphic gore, real public figures, and other people's characters or trademarks. Your own business name and logo are fine. Every picture, and frames from every video, is checked before you see it."
  - q: "Do I need an account?"
    a: "No. Start typing. Give an email only if you want to keep your employee and everything it made; that also adds 60 free credits."
---
