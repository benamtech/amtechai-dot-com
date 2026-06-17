# AMTECH Visual Analysis

Honest assessment. No sugarcoating.

---

## The Verdict

The site looks like a well-built SaaS marketing page from 2023. It is competent. It is not remarkable. If you put this next to Apple's Vision Pro site, the gap is immediately obvious -- and it's not close. The bones are decent (typography hierarchy, spacing system, color restraint), but the execution is safe where it should be aggressive, and decorative where it should be functional.

---

## What Works

**Typography system.** The Inter + IBM Plex Mono pairing is solid. The display scale (clamp-based, -0.04em tracking on heroes) produces tight, confident headlines. The mono labels at 0.6rem with heavy tracking create a clear information hierarchy. This is the strongest design decision on the site.

**Color discipline.** Red (#E11D2A) is used sparingly and intentionally -- mono labels, accent dots, CTA buttons, the period in the logotype. The restraint prevents it from becoming a candy store. Black text at varying opacities (100%, 80%, 60%, 50%, 40%, 30%, 25%) creates depth without introducing new colors. This is correct.

**The Services section interactive mockups.** The call ticker, SMS thread, and lead map are the most compelling visual elements on the entire site. They simulate real product activity. They move. They feel like something is actually happening. This section alone does more selling than every other section combined.

**Navigation.** Floating pill nav with blur backdrop, scroll-triggered opacity shift, clean mobile drawer. Tight. No complaints.

---

## What Doesn't Work

### 1. The glass-card epidemic

Nearly every content block on the site is wrapped in the same `glass-card` component: white at 70% opacity, 1.5rem border-radius, 0.06 black border, 40px backdrop blur. It appears in:

- ProductsSection (both cards)
- ProcessSection (all three steps)
- FitSection (good fit card)
- ResultsSection (stats card)
- StorySection (stats callout)
- DifferentSection (AI Brains card, AI Employees card, combined card)
- PricingReferencePoints (all four reference cards)
- PricingWhatYoureReplacing (both comparison columns)
- PricingWhatShapesPrice (all three factor cards)

That's roughly 18 glass cards across the site. They all look the same. They all hover the same. After three scrolls the user is pattern-blind. Apple's approach: every section earns its own visual treatment. AMTECH's approach: wrap it in glass-card and move on.

**The fix:** Half of these should be stripped to raw content with no card wrapper. The cards that remain need differentiation -- border weight, background tone, internal layout variation.

### 2. The rounded-corners problem

The style guide says "no rounded softness." The site has `border-radius: 1.5rem` on every card, `border-radius: 9999px` on every button and pill, and `rounded-2xl` on the navbar. This reads as friendly and approachable -- the opposite of "Bloomberg terminal meets early Stripe."

Compare: Stripe circa 2018 used 4px radius maximum. Bloomberg uses none. The AMTECH tailwind config defines `borderRadius: { sm: '0.25rem' }` but almost nothing uses it. The buttons are fully rounded pills. The cards are practically bubbles.

**The fix:** Cards at 4-8px radius max. Buttons at 4px or 0. Kill the pill aesthetic entirely. The `.glass-pill` component should not exist.

### 3. White space that isn't earning its keep

The hero section is a full viewport height with five lines of text and a button. The WhatWeBuildSection is an entire section -- `py-20 md:py-40` -- for a headline, a mono subline, and one paragraph. That's 320px of vertical padding for three sentences.

Apple uses massive white space, but they fill sections with product photography, video, parallax, or scroll-triggered reveals that justify the breathing room. AMTECH uses the same vertical padding without the visual content to justify it. The result isn't "intentional space" -- it's "empty page."

**The fix:** Either compress text-only sections dramatically (cut padding in half) or fill them with visual content that earns the space. The stock photos we just added help, but they're a bandage.

### 4. The stock photo situation

Let's be direct: the six Pexels images we just added are generic abstract photography. A red construction frame on black. A "digital cityscape." These are the visual equivalent of lorem ipsum. They fill space. They don't communicate anything about AMTECH, AI, or the specific businesses being served.

Apple doesn't use stock photography. They shoot every image. They render every product shot. Every visual is custom and communicates something specific about the product.

AMTECH should either:
- Commission custom photography/renders of the actual product (dashboards, call flows, system architecture)
- Use screenshots of real system output as visual content
- Use no photography at all and let the typography and interactive elements carry the design

The worst option is generic abstract photography that says "we searched Pexels for red and black." Which is what we have.

### 5. Animation uniformity

Every section uses the same `AnimatedSection` component: fade in + translate Y, triggered by intersection observer, with staggered delays. Every card enters the same way. Every heading enters the same way. After the hero, there are zero surprises in how content appears.

Apple's sites use scroll-linked transforms, parallax depth layers, video playback triggered by scroll position, scale transitions, blur-to-sharp reveals, sticky elements that transform as you scroll past them.

AMTECH has one animation: slide up and fade in. Repeated 40+ times.

### 6. Dark sections lack depth

The DashboardSection, TestimonialsSection, and SocialProofSection all use flat black backgrounds (#000, #111). The dark cards within them (#161616) differ by 6 hex values from their parent. At normal viewing conditions, they're barely distinguishable.

Apple's dark sections use carefully lit product photography, gradient light sources, reflection maps, and atmospheric effects to create depth. AMTECH's dark sections are flat rectangles with white text on them.

The background images we added at 6-7% opacity are a start, but they're barely visible and don't create actual visual depth.

### 7. No scroll experience

The site is a vertical stack of sections. You scroll. Content fades in. You scroll more. More content fades in. There is no parallax. No sticky elements. No scroll-triggered state changes. No progressive reveal. No section that surprises you.

The Services section with its interactive mockups is the closest thing to an engaging scroll moment, but even it just appears via the same fade-up animation as everything else.

### 8. Footer is an afterthought

Four text links. A phone number. An email. A copyright line. No visual weight. No brand reinforcement. Apple's footer is a dense information architecture with clear visual hierarchy. AMTECH's footer looks like it was added at 2am to make the page feel complete.

---

## Section-by-Section

| Section | Grade | Note |
|---------|-------|------|
| Navbar | B+ | Solid. Blur effect works. Could lose the pill radius. |
| Hero | C+ | Big text, small button, empty space. No visual anchor. |
| WhatWeBuild | C | Three sentences don't need their own section. |
| Products | C+ | Two identical glass cards with icons. Generic. |
| Process | C | Three numbered glass cards. Seen this layout on every SaaS page ever. |
| Results | C | Two stats in a glass card. Undercooked. |
| Fit | B- | The good/not-good framing is smart. Execution is two more glass cards. |
| Services | B+ | Best section on the site. Interactive elements carry it. |
| Dashboard | B- | Strong copy. The blockquote with red border is effective. Visually flat. |
| Testimonials | B- | Content is strong. Three identical dark cards. |
| Social Proof | C+ | Big dark box with text in it. |
| FAQ | B | Clean accordion. Nothing wrong, nothing memorable. |
| Close CTA | C+ | Same layout as the hero but smaller. |
| Footer | C- | Bare minimum. |

---

## The Core Problem

The site is a template that was filled in with good copy. The typography decisions are strong. The color system is disciplined. The interactive mockups in ServicesSection prove the team can build compelling UI. But 80% of the site is the same glass card with the same animation on the same white/off-white background, repeated until the page ends.

The AMTECH style guide describes "Bloomberg terminal meets early Stripe." What the site actually delivers is closer to "Tailwind UI landing page with custom colors." There's a meaningful gap between the stated aesthetic and what's on screen.

---

## What Would Close the Gap

1. **Kill glass-card on half the sections.** Let content breathe without a wrapper. Use cards selectively for emphasis, not as the default container for everything.

2. **Flatten the border radius.** 4px max on cards. Square or near-square buttons. The pill aesthetic undermines the stated identity.

3. **Build a real scroll experience.** At minimum: sticky section headers, scroll-triggered counter animations that feel earned, parallax on the images. At best: scroll-linked video or product visualization.

4. **Replace stock photos with product screenshots.** Real dashboards. Real call transcripts. Real system diagrams. If the product works, show it working.

5. **Vary the animation vocabulary.** Scale transitions. Horizontal reveals. Clip-path animations. Anything besides "fade up from 24px below."

6. **Add density to dark sections.** Grid overlays, subtle data visualization patterns, more aggressive background treatments. The dark sections should feel like command centers, not empty rooms.

7. **Invest in the hero.** A static headline with a button is not a hero in 2026. It needs motion, product visualization, or at minimum a scroll-triggered transition that rewards engagement.

8. **Design the footer.** Add a mini-sitemap, a CTA, brand messaging. Make it feel intentional.

---

## Summary

The foundation is strong. The copy is better than the design. The interactive elements prove what's possible. The gap between this and a Vision Pro-tier experience is not about talent -- it's about ambition. Most of the site plays it safe. The parts that don't (ServicesSection, the typography system, the color restraint) are genuinely good. The task is to bring that same level of intentionality to every section, and to stop defaulting to glass-card + fade-up as the answer to every layout question.
