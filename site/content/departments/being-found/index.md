---
# /departments/being-found, rebuilt 2026-11-08 (lane `services`, lead `lena`) on layouts/landing.html. The department is
# how the work is run: the five pieces in order, the weekly check of the AI answers, the whole team (site, listing,
# reviews, leads). /services/found-on-google-and-in-ai-answers is what the owner buys; the two share no document.
# Scoop Dogg is the proof (brain/proof.md). Every figure in a card illustrates the application.
title: "Local SEO and AI answers: get found on Google and in ChatGPT"
description: "How an AMTECH agent team runs being found: your site, your Google listing and a weekly check of what ChatGPT, Gemini and Google say about your trade."
layout: "landing"
crumb: "Being found"
h1a: "Be the business"
h1b: "the answers name."
sub: "The department that runs your website, your Google listing and your reviews, and checks every Monday what ChatGPT, Gemini and Google say about your trade in your town."
answer: "Being found is the AMTECH department that does the whole job of a local SEO agency. A team of agents builds and fixes the website, keeps the Google Business Profile and other listings in agreement with it, answers every review, writes the pages customers' questions need, and each week asks ChatGPT, Gemini and Google those questions and reports who is named. A fifth agent answers the leads the visibility brings in. Scoop Dogg's employee did this work and he is first in ChatGPT and on Google for pet and yard cleanup in Ventura and Santa Barbara."
field: "Your business's name"
button: "Start free"
start: {config: being-found}
prices: "Start free and pay as you go. Custom agents with guaranteed results from $1,200/mo."
hero_img: "img/services/svc-dept-hero.png"
hero_alt: "A bright office with two monitors showing blurred map and web page layouts beside a large window"
names: {employee: "Your lead agent"}
team: [employee, t3, t5, t6, t2]
panel:
  firm: "Your business"
  h: "Your team"
  rows:
    - {who: t3, state: work}
    - {who: t5, state: work}
    - {who: t6, state: work}
    - {who: t2, state: wait}
    - {who: t4, state: idle}
  card_h: "This Monday: Your business"
  steps: ["Asked ChatGPT, Gemini and Google 12 questions", "Compared every answer with last week's", "Found one gap and wrote the page"]
  now: "Updating your listing to match the new page"
  total: "Your Monday report is ready."
found: [{n: "12", what: "answers checked this week"}, {n: "3", what: "pages published this month"}, {n: "9", what: "reviews answered"}]
offer_found: false
systems: ["Your website", "Google Business Profile", "Search Console", "Google Analytics", "ChatGPT, Gemini and AI Overview", "Yelp", "Apple Maps", "Gmail"]
frame_h: "The Monday check of what the answers say."
bands_h: "The five pieces of work, in order."
bands:
  - who: t6
    img: "img/landscaping/yard.png"
    alt: "A yard care worker cleaning a backyard lawn while a dog watches"
    h: "A site built to be read."
    p: "A page for each service and each town you work in, with online booking, built new or on the site you have."
    doc: {kind: page, title: "Pet waste removal in Oxnard", meta: "A new page on scoopdogg.net", url: "scoopdogg.net/oxnard", h: "Pet waste removal in Oxnard, every week", p: "The five questions Oxnard customers ask most, with the prices, the service days and the booking link.", button: "Book a cleanup", rows: ["Which days do you serve Oxnard?", "What does weekly service cost?", "Do you work around dogs in the yard?"]}
  - who: t3
    img: "img/services/svc-dept-facts.png"
    alt: "A laptop on a wooden table showing lines of code beside a small business web page"
    h: "Facts machines can read."
    p: "Your business written in the markup and files that Google and AI assistants read first, so each one gets your name, area and services right."
    doc: {kind: sheet, title: "What search and AI assistants read", meta: "Your site, checked this morning", cols: ["Fact", "On your site", "Read by"], rows: [["Business name and address", "Marked up on every page", "Google and AI assistants"], ["Services and towns served", "Marked up on service pages", "Google and AI assistants"], ["Opening hours", "Missing on two pages", "Fix ready"], ["Questions and answers", "On every service page", "AI assistants"]], foot: "Everything is written once and repeated the same way everywhere."}
  - who: t3
    img: "img/services/svc-dept-shops.png"
    alt: "A row of small shops on a town street in daytime"
    h: "A listing that agrees, everywhere."
    p: "Categories, services, hours and photos on Google, Apple Maps, Bing and Yelp matched to your site, line for line."
    doc: {kind: sheet, title: "Your listings, side by side", meta: "Checked this morning", cols: ["Place", "Hours", "Phone", "Status"], rows: [["Google Business Profile", "Matches", "Matches", "Right"], ["Apple Maps", "Saturday differs", "Matches", "Fix sent"], ["Bing Places", "Matches", "Old number", "Fix sent"], ["Yelp", "Matches", "Matches", "Right"]], foot: "A listing that disagrees with your site makes the answers less sure of you."}
  - who: t2
    img: "img/home/hospitality.png"
    alt: "A restaurant dining room with tables set and warm light before opening"
    h: "Every review answered, every lead followed."
    p: "Each review replied to in your voice the same week, and each enquiry the visibility brings in answered and followed up."
    doc: {kind: report, title: "Reviews and enquiries this week", meta: "From your Google listing and your website's forms", rows: [{label: "New reviews", value: "9, all answered"}, {label: "Five-star replies", value: "Sent under your standing approval"}, {label: "Needs you", value: "One two-star review, reply ready"}, {label: "Website enquiries", value: "6 answered, 2 booked"}], foot: "Every reply is in your voice."}
orbit_h: "The team behind the department."
grid_h: "Every kind of business, found in its own town."
grid:
  offices: ["Pet waste and yard care", "Restaurant", "Roofing company"]
  lamps: [[work, work, work, work, idle], [work, idle, wait, work, idle], [work, work, idle, work, work]]
  legend: {work: "working", wait: "waiting on you", idle: "idle"}
cards_h: "Services built on being found."
cards_sub: "Your team, set up for one piece of the department."
cards:
  - {who: [t3, t5], h: "Found on Google and in AI answers", p: "Your listing, your reviews and the pages that get you named.", href: "/services/found-on-google-and-in-ai-answers"}
  - {who: [t3, t6], h: "This month's posts and pictures", p: "A fresh post and photos on your listing and your social pages each month.", href: "/services#this-months-posts-and-pictures"}
  - {who: [t3, t5], h: "Paid search and social, run and reported", p: "Ads run and reported in plain words.", href: "/services#paid-search-and-social-run-and-reported"}
  - {who: [t2], h: "Inquiries answered and booked", p: "Every lead the visibility brings in, answered and followed up.", href: "/services#inquiries-answered-and-booked"}
proof: {h: "Scoop Dogg: first in ChatGPT and on Google for pet and yard cleanup.", p: "Scoop Dogg is the first business run by an AI employee. His employee set up his new website and its online booking, then set up his automatic replies itself, so every booking and quote request is answered at his real prices. He gets bookings every week, and he is first in ChatGPT and on Google for pet and yard cleanup in Ventura and Santa Barbara."}
offer_h: "Start with what the answers say today."
offer_p: "Name your business and your team looks up what Google and ChatGPT say about you, and shows you the first fix. When you want the whole department set up with you, with the results agreed up front, we build it together."
options:
  - {h: "Start free", p: "The department on your business, then pay as you go."}
  - {h: "Custom agents", p: "Set up with you, with guaranteed results, from $1,200 a month."}
approval: {who: t3, act: "Page: Pet waste removal in Oxnard", to: "To scoopdogg.net", preview: "Answers the five questions Oxnard customers ask most, with your prices, your service days and your booking link."}
questions_h: "Questions"
questions:
  - {q: "Does it replace my SEO agency?", a: "Yes. Being found does the whole job: the pages, the listings, the reviews and the weekly check on Google and the AI answers, and the Monday report shows what changed."}
  - {q: "How do I show up in ChatGPT's answers?", a: "Your business has to be on the pages ChatGPT reads and named the same way everywhere. Your team writes those pages on your site, fixes your listings so the facts agree, and checks every week what ChatGPT actually says."}
  - {q: "Is this the same as SEO?", a: "Yes, and it reaches further, because the same pages and listings that rank you on Google and Google Maps are what ChatGPT, Gemini and Google's AI Overview read when someone asks for your trade in your town."}
  - {q: "Can it build me a new website?", a: "Yes. Builder makes and launches a new site with online booking, or works on the one you have, whoever built it."}
  - {q: "How soon does it work?", a: "Your team starts on the first day. Google and the AI answers move on their own schedule, and the Monday report shows you each move."}
  - {q: "Is being found its own plan?", a: "No. It is one of the departments your team runs, priced the same way as everything else: start free and pay as you go, or custom agents with guaranteed results from $1,200 a month."}
ask_prompt: "Who is the best dog poop removal service in Ventura, CA?"
closing_h: "Name your business."
closing_sub: "Your team looks up what Google and ChatGPT say about you today, and shows you the first fix."
site_sources: false
sources:
  - "The pages, listings, reviews and answers shown on this page illustrate the AMTECH application; they are not a customer's business."
  - "Scoop Dogg: reported by Ben Palaskas, AMTECH, 27 October 2026 (scoopdogg.net)."
  - "The photographs on this page were made for it with an image model, or are the site's own; they show no real client, job or building."
reviewed: {by: "Ben Palaskas", date: "2026-11-08"}
frame:
  - who: t3
    ask: "Are we coming up yet when people ask for a house painter in town?"
    reply: "For interior painting, yes: ChatGPT started naming you this week. For exterior painting the answers still name others, so Being found wrote the page that answers that question."
    title: "This week's check of what the AI answers say about you"
    steps: ["Asked ChatGPT, Gemini and Google what your customers ask", "Read who each answer names, and the pages it cites", "Compared every answer with last week's", "Waiting for your yes to publish the fix"]
    line: "Wrote the exterior painting page the answers are missing"
    doc:
      kind: report
      title: "The AI-answer check"
      meta: "This week, set against last week"
      rows:
        - {label: "ChatGPT: interior painting in your town", value: "Names you, new this week"}
        - {label: "ChatGPT: exterior house painting", value: "Not yet"}
        - {label: "Google AI Overview: house painters near me", value: "Names you"}
        - {label: "Google Maps: house painters", value: "Your listing, with this week's photos"}
        - {label: "Gemini: cabinet painting", value: "Cites your reviews"}
        - {label: "The fix, ready for your yes", value: "A page for exterior painting"}
      foot: "Every answer is saved as it read, with its date."
    trust: {assumed: "your town and the towns around it, from your Google listing", checked: "each answer twice, from a fresh session"}
    approve: {act: "Publish the page to your site"}
---
