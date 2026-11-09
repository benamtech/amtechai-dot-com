---
# /ecommerce, 2026-11-08 (session `lena`) on layouts/landing.html. Ben: a page for e-commerce agencies and brands (the
# kind of business Brand Box is: a firm that builds and runs many online stores for their owners). Brand Box is never
# named (no client is named without their permission). The action is a call, as on /real-estate: a custom engagement.
# Every store name, product and figure inside a card illustrates the application. Photographs: gpt-image-2.5.
title: "AI agent teams for e-commerce brands and agencies"
description: "A custom team of AI agents for your online stores: products listed, ads and creative made, email sent and every store's numbers read each morning."
route: "/ecommerce"
layout: "landing"
crumb: "E-commerce"
okf_type: "Business Type"
llms: {order: 31, label: "E-commerce", text: "Custom AI agent teams for e-commerce brands and agencies that run many online stores: product listings, ads and creative, email campaigns and every store's numbers, on one screen. Engagements from $1,200/mo."}
names: {employee: "Your lead agent", t1: "Catalog", t3: "Ads and creative", t2: "Email", t4: "Reporting", t5: "Research", t6: "Store builder"}
team: [employee, t1, t3, t2, t4, t5, t6]
h1a: "Run every store"
h1b: "with one AI team."
sub: "A custom team of AI agents for your online stores: new products listed, ads and creative made, email sent and every store's numbers read each morning, across every store you run."
answer: "AMTECH builds custom teams of AI agents for e-commerce brands and for agencies that run online stores for their owners. The agents list new products in each store's voice, make ads and creative from the product photos, write each store's email, and read every store's sales, ad spend and stock each morning, all on one screen across every store."
field: "Your company's name"
button: "Book a call"
book: {industry: "E-commerce", topic: "An e-commerce agent team"}
prices: "Custom agents with guaranteed results from $1,200 a month. Or start free and pay as you go."
hero_img: "img/ecommerce/hero.png"
hero_alt: "A bright e-commerce studio and stockroom with a product photo table"
panel:
  firm: "Your stores"
  h: "Your team"
  rows:
    - {who: t1, state: work}
    - {who: t3, state: work}
    - {who: t2, state: wait}
    - {who: t4, state: work}
    - {who: t5, state: idle}
  card_h: "This morning: All stores"
  steps: ["Listed 46 new products across eight stores", "Made 12 ad images from the product photos", "Read yesterday's sales for every store"]
  now: "Writing Thursday's email for each store"
  total: "Two stores flagged: ad spend up, sales flat."
found: [{n: "8", what: "stores run"}, {n: "46", what: "products listed today"}, {n: "12", what: "new ads made"}]
offer_found: false
systems: ["Shopify", "Meta Ads", "Google Ads", "Klaviyo", "Gmail", "Google Sheets", "QuickBooks", "Your suppliers"]
frame_h: "One launch, every store."
bands_h: "Everything a store needs, every day."
bands:
  - who: t1
    img: "img/ecommerce/listings.png"
    alt: "A mug, a candle and a wallet on a product photography set"
    h: "New products, live everywhere."
    p: "Supplier sheets and photos turned into listings in each store's own voice, priced from your margins."
    doc: {kind: sheet, title: "New this week", meta: "From the supplier's sheet and photos", cols: ["Product", "Stores", "Status"], rows: [["Stoneware mug, four glazes", "All eight", "Live"], ["Soy candle, cedar", "Five of eight", "Live"], ["Leather card wallet", "Three of eight", "Needs a size chart"]], foot: "Each listing written for the store it sits in."}
  - who: t3
    img: "img/ecommerce/ads.png"
    alt: "Product photographs and colour swatches pinned on a studio wall"
    h: "Ads made from your own products."
    p: "New images and copy for every launch, and last week's ads read for what actually sold."
    doc: {kind: sheet, title: "Ads this week", meta: "From your ad accounts and each store's sales", cols: ["Ad", "Store", "What happened"], rows: [["Mug, kitchen morning", "Copper Kettle", "Best seller this week"], ["Candle, cedar close-up", "Fern Street", "New, running"], ["Wallet, gift guide", "Linen and Oak", "Paused: no sales in seven days"]], foot: "Spend moves to what sells, inside the limit you set."}
  - who: t2
    img: "img/ecommerce/orders.png"
    alt: "Orders being packed at a small fulfilment table"
    h: "Email that sells, store by store."
    p: "Campaigns and flows written for each store's customers, from what they bought and when."
    doc: {kind: email, title: "Thursday's email", meta: "Copper Kettle, to last spring's buyers", to: "Customers who bought a mug last spring", subject: "Four new glazes, made for slow mornings", body: ["The stoneware you liked last spring is back in four new glazes.", "Each one is glazed by hand, so no two are quite the same. Yours ships tomorrow."]}
  - who: t4
    img: "img/ecommerce/stores.png"
    alt: "A long aisle of shelving in a fulfilment warehouse"
    h: "Every store's numbers, every morning."
    p: "Sales, ad spend, stock and returns read for each store, with what to do about each one."
    doc: {kind: report, title: "Morning report", meta: "All stores, from yesterday", rows: [{label: "Best store", value: "Copper Kettle, sales up on the new mugs"}, {label: "Watch", value: "Fern Street: ad spend up, sales flat"}, {label: "Low stock", value: "Cedar candle, nine days left"}, {label: "Returns", value: "Two, both sizing on the wallet"}], foot: "Read before you open your laptop."}
orbit_h: "Your team, built around your stores."
grid_h: "Every store, every team, one screen."
grid:
  offices: ["Copper Kettle", "Fern Street", "Linen and Oak"]
  lamps: [[work, work, idle, work, idle], [work, wait, work, work, idle], [idle, work, work, idle, wait]]
  legend: {work: "working", wait: "waiting on you", idle: "idle"}
offer_h: "See the team for your stores."
offer_p: "Tell us about your stores. On the call we show the team we would build for them and what it would do in its first week."
options:
  - {h: "One brand", p: "A team for your own stores."}
  - {h: "E-commerce agency", p: "A team for every client's store, on one screen."}
  - {h: "Custom agents", p: "Set up with you, with guaranteed results, from $1,200 a month."}
approval: {who: t3, act: "Launch ads for the stoneware mug", to: "Copper Kettle, inside this week's budget", preview: "Three images from the new product photos, each with its own headline."}
questions_h: "Questions"
questions:
  - {q: "Does it work with Shopify?", a: "Yes. Your agents work inside Shopify and the tools around it: your ad accounts, your email platform, your supplier sheets and your books."}
  - {q: "Can it run stores for my clients?", a: "Yes. Each client's store gets its own team, its work and sign-ins are kept to that store, and one screen shows all of them."}
  - {q: "Does it make the ad creative too?", a: "Yes. Ads and creative are made from your own product photos and brand, and each one is checked against what sold."}
  - {q: "What does it cost?", a: "Custom agents set up with you, with guaranteed results, start at $1,200 a month. You can also start free and pay as you go for the work done."}
closing_h: "Your stores could be running themselves."
closing_sub: "Tell us about your stores and we will show you the team for them."
site_sources: false
sources:
  - "The stores, products, ads and figures shown on this page illustrate the AMTECH application; they are not a customer's stores."
reviewed: {by: "Ben Palaskas", date: "2026-11-08"}
frame:
  - who: t1
    ask: "The spring collection is in. Get the new products live on all eight stores this week."
    reply: "Catalog has it. Every product is written in each store's voice, priced from your margins, and the first store is ready for you to look over."
    title: "Spring collection, live on eight stores"
    steps: ["Read the supplier's sheet and the product photos", "Wrote each listing in the store's own voice", "Priced each product from your margins", "Waiting for your look before the first store goes live"]
    line: "Flagged two products the supplier sent without sizes"
    doc: {kind: sheet, title: "Spring collection", meta: "From the supplier's sheet, for each store", cols: ["Product", "Stores", "Ready"], rows: [["Linen throw, three colours", "All eight", "Listing and photos"], ["Ceramic planter set", "Six of eight", "Listing and photos"], ["Rattan basket", "All eight", "Needs sizes"]], foot: "Each store's listing written in its own voice."}
    trust: {assumed: "your usual margin for home goods", checked: "every price against what each store charges today"}
    approve: {act: "Put the first store live"}
---
