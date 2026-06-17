import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Check, X } from 'lucide-react';
import InterruptionSection from '../components/wholesale2/InterruptionSection';
import DashboardPanel from '../components/wholesale2/DashboardPanel';
import MembershipSection from '../components/wholesale2/MembershipSection';

gsap.registerPlugin(ScrollTrigger);

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

const CTA_HREF = '/apply';
const DEMO_HREF = '/apply';

// ─── Countup hook ────────────────────────────────────────────────────────────
function useCountup(
  ref: React.RefObject<HTMLSpanElement | null>,
  target: number,
  suffix: string,
  duration = 1.8
) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const proxy = { val: 0 };
    const trigger = ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.to(proxy, {
          val: target,
          duration,
          ease: 'power2.out',
          onUpdate: () => {
            if (!el) return;
            const v = proxy.val;
            el.textContent = Number.isInteger(target)
              ? Math.round(v) + suffix
              : v.toFixed(1) + suffix;
          },
        });
      },
    });
    return () => trigger.kill();
  }, [ref, target, suffix, duration]);
}

// ─── Column entrance hook ─────────────────────────────────────────────────────
function useColumnEntrance(refs: React.RefObject<(HTMLDivElement | null)[]>) {
  useEffect(() => {
    const els = (refs.current ?? []).filter(Boolean) as HTMLDivElement[];
    if (!els.length) return;
    gsap.set(els, { y: 40, opacity: 0 });
    const trigger = ScrollTrigger.create({
      trigger: els[0],
      start: 'top 80%',
      once: true,
      onEnter: () => {
        gsap.to(els, {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out',
          stagger: 0.15,
        });
      },
    });
    return () => trigger.kill();
  }, [refs]);
}

// ─── Word-by-word reveal hook ─────────────────────────────────────────────────
function useWordReveal(ref: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const words = el.querySelectorAll<HTMLSpanElement>('[data-word]');
    gsap.set(words, { y: 20, opacity: 0 });
    const trigger = ScrollTrigger.create({
      trigger: el,
      start: 'top 80%',
      once: true,
      onEnter: () => {
        gsap.to(words, {
          y: 0,
          opacity: 1,
          duration: 0.5,
          ease: 'power2.out',
          stagger: 0.07,
        });
      },
    });
    return () => trigger.kill();
  }, [ref]);
}

// ─── Horizontal scroll steps ──────────────────────────────────────────────────
const STEPS = [
  { n: 1, label: 'Upload List', ai: false },
  { n: 2, label: 'Select Agent', ai: false },
  { n: 3, label: 'Start Cold Call Campaign', ai: true },
  { n: 4, label: 'AI Calls Leads', ai: true },
  { n: 5, label: 'Dashboard Updates', ai: true },
  { n: 6, label: 'Booking Detected', ai: true },
  { n: 7, label: 'Calendar Event Created', ai: true },
  { n: 8, label: 'SMS Alert Sent', ai: true },
];

function HowItWorksSection() {
  const trackRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const cards = Array.from(track.querySelectorAll<HTMLDivElement>('[data-step]'));

    const st = ScrollTrigger.create({
      trigger: track,
      start: 'top 60%',
      once: true,
      onEnter: () => {
        gsap.fromTo(
          cards,
          { y: 24, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out', stagger: 0.08 }
        );
      },
    });

    const updateActive = () => {
      const scrollX = track.scrollLeft;
      const cardW = cards[0]?.offsetWidth ?? 160;
      const idx = Math.round(scrollX / (cardW + 16));
      if (idx !== activeRef.current) {
        activeRef.current = idx;
        cards.forEach((c, i) => {
          c.dataset.active = i === idx ? 'true' : 'false';
          if (i === idx) {
            c.style.borderTopColor = '#E11D2A';
            c.style.borderTopWidth = '2px';
            c.style.boxShadow = '0 4px 20px rgba(0,0,0,0.15)';
          } else {
            c.style.borderTopColor = c.dataset.ai === 'true' ? '#16a34a' : 'transparent';
            c.style.borderTopWidth = '2px';
            c.style.boxShadow = c.dataset.ai === 'true' ? '0 -2px 8px rgba(22,163,74,0.25)' : 'none';
          }
        });
      }
    };
    track.addEventListener('scroll', updateActive);
    updateActive();

    return () => {
      st.kill();
      track.removeEventListener('scroll', updateActive);
    };
  }, []);

  return (
    <section className="bg-[#f4f4f4] border-t border-black/5 px-6 py-20 md:py-28">
      <div className="mx-auto max-w-7xl">
        <p className="font-mono text-[0.6rem] uppercase tracking-[0.22em] text-[#E11D2A] mb-4">
          The Process
        </p>
        <h2 className="font-display text-[clamp(1.75rem,3.5vw,3rem)] font-black tracking-[-0.03em] text-[#0a0a0a] mb-14">
          You do two things.<br />
          The system does the rest.
        </h2>

        {/* Desktop horizontal scroll */}
        <div
          ref={trackRef}
          className="hidden md:flex gap-4 overflow-x-auto pb-4"
          style={{ scrollSnapType: 'x mandatory', scrollbarWidth: 'none' }}
        >
          {STEPS.map((step) => (
            <div
              key={step.n}
              data-step={step.n}
              data-ai={step.ai ? 'true' : 'false'}
              className="shrink-0 w-44 border border-black/15 px-5 py-5 cursor-pointer transition-all duration-200"
              style={{
                scrollSnapAlign: 'start',
                borderTopWidth: '2px',
                borderTopColor: step.ai ? '#16a34a' : 'transparent',
                background: step.ai ? 'rgba(22,163,74,0.06)' : '#ffffff',
                boxShadow: step.ai ? '0 -2px 8px rgba(22,163,74,0.25)' : 'none',
              }}
            >
              <p className="font-mono text-[0.52rem] uppercase tracking-[0.18em] text-[#6b7280] mb-3">
                Step {step.n}
              </p>
              <p className="font-display text-[0.85rem] font-bold text-[#0a0a0a] leading-snug">
                {step.label}
              </p>
            </div>
          ))}
        </div>

        {/* Mobile vertical stack */}
        <div className="flex flex-col gap-3 md:hidden">
          {STEPS.map((step) => (
            <div
              key={step.n}
              className="border border-black/15 px-5 py-4 border-t-2"
              style={{
                borderTopColor: step.ai ? '#16a34a' : 'transparent',
                background: step.ai ? 'rgba(22,163,74,0.06)' : '#ffffff',
                boxShadow: step.ai ? '0 -2px 8px rgba(22,163,74,0.25)' : 'none',
              }}
            >
              <span className="font-mono text-[0.55rem] uppercase tracking-wider text-[#6b7280] mr-3">
                {step.n}
              </span>
              <span className="font-display text-sm font-bold text-[#0a0a0a]">
                {step.label}
              </span>
            </div>
          ))}
        </div>

        <p className="mt-10 font-body text-[0.9rem] text-[#6b7280]">
          Step 1: Upload a list.<br />
          Step 8: Show up to the meeting.<br />
          <span className="italic">Everything between is the program.</span>
        </p>
      </div>
    </section>
  );
}

// ─── Identity Section ─────────────────────────────────────────────────────────
function IdentitySection() {
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const bodyRef = useRef<HTMLParagraphElement>(null);
  const finalRef = useRef<HTMLParagraphElement>(null);

  useWordReveal(headlineRef as React.RefObject<HTMLElement | null>);

  useEffect(() => {
    const body = bodyRef.current;
    const final = finalRef.current;
    if (!body || !final) return;

    gsap.set([body, final], { opacity: 0 });

    ScrollTrigger.create({
      trigger: body,
      start: 'top 80%',
      once: true,
      onEnter: () => {
        gsap.to(body, { opacity: 1, duration: 0.6, ease: 'power2.out', delay: 0.4 });
        gsap.to(final, { opacity: 1, duration: 0.6, ease: 'power2.out', delay: 1.0 });
      },
    });
  }, []);

  const headlineLines = [
    ['Not', 'a', 'course.'],
    ['Not', 'a', 'tool.'],
    ['An', 'operator', 'community'],
    ['with', 'an', 'unfair', 'advantage.'],
  ];

  return (
    <section className="bg-[#0a0a0a] px-6 py-20 md:py-32">
      <div className="mx-auto max-w-3xl">
        <p className="font-mono text-[0.6rem] uppercase tracking-[0.22em] text-[#6b7280] mb-8">
          The Program
        </p>

        <h2
          ref={headlineRef}
          className="font-display text-[clamp(2rem,5vw,3.5rem)] font-black tracking-[-0.04em] text-white leading-[1.05] mb-12"
        >
          {headlineLines.map((line, li) => (
            <span key={li} className="block">
              {line.map((word, wi) => (
                <span
                  key={wi}
                  data-word
                  className="inline-block mr-[0.22em]"
                >
                  {word}
                </span>
              ))}
            </span>
          ))}
        </h2>

        <p
          ref={bodyRef}
          className="font-body text-[1rem] leading-[1.85] text-[#6b7280] max-w-[680px] mb-8"
          style={{ opacity: 0 }}
        >
          AMTECH Operators is a small, hands-on program for people serious about running wholesale acquisition campaigns.
          <br /><br />
          You get access to the AMTECH platform, a configured AI acquisition system, campaign setup support, and a group of people doing the same thing at the same time.
          <br /><br />
          The AI handles the outreach.<br />
          The community handles the knowledge.<br />
          You handle the deals.
        </p>

        <p
          ref={finalRef}
          className="font-display text-[1.15rem] font-semibold text-white"
          style={{ opacity: 0 }}
        >
          This is what most people in wholesaling don't have access to.
        </p>
      </div>
    </section>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
function Wholesale2() {
  useEffect(() => {
    document.title = 'AMTECH Operators | AI Wholesale Acquisition Program';
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute('content', "AMTECH Operators is a hands-on program for people who want to run real estate wholesale acquisition campaigns — without manually dialing from a spreadsheet for six months and quitting.");
    }
    return () => {
      document.title = 'AMTECH. — Your Next Employee Is a Computer';
    };
  }, []);

  // Countup refs
  const count1Ref = useRef<HTMLSpanElement>(null);
  useCountup(count1Ref, 73, '%');

  // Column entrance
  const colRefs = useRef<(HTMLDivElement | null)[]>([]);
  useColumnEntrance(colRefs);

  // Hero headline words
  const heroWords1 = ['Break', 'into', 'wholesaling'];
  const heroWords2 = ["without", 'cold', 'calls.'];

  return (
    <div className="min-h-screen bg-white text-[#0a0a0a]">

      {/* ── Sticky Nav ──────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-black border-b border-white/[0.06] px-6 py-3.5 flex items-center justify-between">
        <Link to="/" className="inline-flex items-baseline">
          <span className="font-display text-sm font-black tracking-[0.06em] text-white">AMTECH</span>
          <span className="text-sm font-black text-[#E11D2A]">.</span>
        </Link>
        <Link
          to={CTA_HREF}
          className="font-mono text-[0.62rem] uppercase tracking-[0.15em] text-[#E11D2A] hover:text-white transition-colors"
        >
          Apply for Beta
        </Link>
      </header>

      {/* ── Section 1: Hero ─────────────────────────────────────────────────── */}
      <section className="relative min-h-[calc(100vh-48px)] bg-white flex items-center overflow-hidden">
        <div className="mx-auto max-w-4xl w-full px-6 py-20">

          {/* Left: copy */}
          <div className="relative z-10">
            {/* Small caps label */}
     

            {/* Headline */}
            <h1 className="font-display text-[clamp(3rem,7vw,4.75rem)] font-black leading-[1] tracking-[-0.05em] text-[#0a0a0a] mb-6">
              {heroWords1.map((word, i) => (
                <motion.span
                  key={word + i}
                  className="inline-block mr-[0.18em]"
                  initial={{ y: 28, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.1 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                >
                  {word}
                </motion.span>
              ))}
              <br />
              {heroWords2.map((word, i) => (
                <motion.span
                  key={word + i}
                  className="inline-block mr-[0.18em]"
                  initial={{ y: 28, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.4 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                >
                  {word}
                </motion.span>
              ))}
            </h1>

            {/* Body */}
            <motion.p
              className="font-body text-[1rem] leading-[1.75] text-[#6b7280] mb-10 max-w-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.85 }}
            >
              AMTECH Operators is a hands-on program for people who want to run real estate wholesale acquisition campaigns — without manually dialing from a spreadsheet for six months and quitting.
            </motion.p>

            {/* CTAs */}
            <motion.div
              className="flex flex-wrap items-center gap-5 mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.0 }}
            >
              <Link
                to={CTA_HREF}
                className="group relative overflow-hidden inline-flex items-center gap-2 px-7 py-3.5 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-white border-r-2 border-[#E11D2A]"
                style={{ background: '#0a0a0a' }}
                onClick={() => window.gtag?.('event', 'cta_click', { page: 'wholesale-2', section: 'hero' })}
              >
                <span
                  className="absolute inset-0 bg-[#E11D2A] transition-transform duration-200 ease-out origin-right scale-x-0 group-hover:scale-x-100"
                  style={{ transformOrigin: 'right' }}
                />
                <span className="relative z-10">Apply for Access</span>
                <ArrowRight size={13} className="relative z-10" />
              </Link>

              <a
                href="#how-it-works"
                className="font-mono text-[0.7rem] uppercase tracking-[0.15em] text-[#0a0a0a] underline underline-offset-4 hover:text-[#E11D2A] transition-colors"
              >
                See how it works &darr;
              </a>
            </motion.div>

            {/* Scarcity */}
            <motion.p
              className="font-mono text-[0.6rem] text-[#6b7280] tracking-[0.1em]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 1.15 }}
            >
              Beta cohort: 5 members maximum. Reviewed applications only.
            </motion.p>
          </div>

        </div>
      </section>

      {/* ── Section 2: The Interruption ─────────────────────────────────────── */}
      <InterruptionSection />

      {/* ── Section 3: The Number ───────────────────────────────────────────── */}
      <section className="bg-[#0a0a0a] px-6 py-20 md:py-32">
        <div className="mx-auto max-w-3xl">
          <span
            ref={count1Ref}
            className="block font-display text-[clamp(6rem,18vw,11rem)] font-black text-white leading-none mb-0"
          >
            0%
          </span>

          <p className="font-display text-[clamp(1.1rem,2.5vw,1.5rem)] text-white mt-2 mb-8 leading-snug">
            of people who try wholesaling<br />
            quit before closing a deal.
          </p>

          <p className="font-body text-[1.05rem] leading-[1.85] text-[#6b7280] max-w-xl mb-12">
            Not from lack of motivation.<br />
            From lack of a system that turns lead lists into real conversations.<br />
            The volume required is inhuman.<br />
            Until now.
          </p>

          <p className="font-display text-[1.25rem] font-semibold text-white">
            The barrier was never the deal.<br />
            It was getting to the conversation.
          </p>
        </div>
      </section>

      {/* ── Section 4: Identity ─────────────────────────────────────────────── */}
      <IdentitySection />

      {/* ── Section 5: Membership Includes ──────────────────────────────────── */}
      <MembershipSection />

      {/* ── Section 6: How It Works ──────────────────────────────────────────── */}
      <div id="how-it-works">
        <HowItWorksSection />
      </div>

      {/* ── Section 7: Dashboard Visual ─────────────────────────────────────── */}
      <section className="bg-[#0a0a0a] px-6 py-20 md:py-28">
        <div className="mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <p className="font-mono text-[0.6rem] uppercase tracking-[0.22em] text-[#E11D2A] mb-4">
              The Dashboard
            </p>
            <h2 className="font-display text-[clamp(1.5rem,3vw,2.5rem)] font-black tracking-[-0.03em] text-white">
              Not call logs.<br />
              Campaign outcomes.
            </h2>
          </motion.div>

          <DashboardPanel />

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="mt-6 font-body text-[0.875rem] italic text-[#6b7280]"
          >
            Every member sees this dashboard from day one.<br />
            No setup guesswork. No figuring it out alone.
          </motion.p>
        </div>
      </section>

      {/* ── Section 8: Quote ────────────────────────────────────────────────── */}
      <section className="bg-white px-6 py-20 md:py-28">
        <div className="mx-auto max-w-3xl">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="flex gap-8"
          >
            <div className="w-1 shrink-0 bg-[#f97316]" />
            <div>
              <p className="font-display text-[clamp(1.5rem,3.5vw,2.5rem)] font-semibold text-[#0a0a0a] leading-[1.4] mb-8">
                "I didn't know how to cold call.<br />
                I didn't have to.<br />
                <br />
                The AI worked the list.<br />
                I showed up to the meeting<br />
                and left with a signed contract."
              </p>
              <p className="font-body text-[0.875rem] text-[#6b7280] italic mb-3">
                The technology is the vehicle. The contract is the destination.
              </p>
              <p className="font-body text-[0.8rem] text-[#6b7280]">
                First cohort member. First deal.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Section 9: Who This Is For ───────────────────────────────────────── */}
      <section className="bg-white border-t border-black/10 px-6 py-20 md:py-28">
        <div className="mx-auto max-w-7xl">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="font-display text-[clamp(1.75rem,3.5vw,3rem)] font-black tracking-[-0.03em] text-[#0a0a0a] mb-16"
          >
            This program is not for everyone.
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-black/10 mb-12">
            <div className="bg-white px-8 py-10">
              <p className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-[#0a0a0a] mb-8">
                For
              </p>
              <div className="space-y-4">
                {[
                  'You are willing to pull or pay for lead lists',
                  'You will follow up when a booking appears',
                  'You want to learn wholesaling by doing it',
                  'You understand this requires execution',
                  'You can commit time weekly to implementation',
                  'You want to be part of a small, serious group',
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <Check size={13} className="text-[#0a0a0a] shrink-0 mt-0.5" />
                    <p className="font-body text-[0.875rem] leading-snug text-[#6b7280]">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white px-8 py-10">
              <p className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-[#E11D2A] mb-8">
                Not For
              </p>
              <div className="space-y-4">
                {[
                  'People expecting passive income',
                  "People who won't call leads back",
                  'People with no budget for lists or calls',
                  'People who want a done-for-you guarantee',
                  'People unwilling to learn compliance basics',
                  "People who aren't ready to work",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <X size={13} className="text-[#E11D2A] shrink-0 mt-0.5" />
                    <p className="font-body text-[0.875rem] leading-snug text-[#6b7280]">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="font-display text-[1.1rem] font-semibold text-[#0a0a0a]"
          >
            The cohort is small because the support is real. We review every application.
          </motion.p>
        </div>
      </section>

      {/* ── Section 10: Beta ─────────────────────────────────────────────────── */}
      <section className="bg-[#E11D2A] px-6 pt-20 md:pt-32">
        <div className="mx-auto max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-[clamp(2rem,5vw,3.5rem)] font-black tracking-[-0.04em] text-black leading-[1.05] pb-10">
              5 members in a closed beta.<br />
              Run real campaigns and get real support from our team of wholesalers and AI experts.
            </h2>
          </motion.div>
        </div>
      </section>

      <section className="bg-white px-6 py-12">
        <div className="mx-auto max-w-3xl">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="space-y-4 text-[#000000] font-body text-[0.95rem] leading-[1.75]">
              <p>
                AMTECH Operators is intentionally small.
              </p>
              <p>
                Five members per cohort. Each one gets platform access, agent configuration, campaign setup support, weekly live sessions, and access to the operator community.
              </p>
              <p>
                If you are accepted, we review your goals, your market, your list plan, and your availability before your first campaign goes live.
              </p>
              <p>
                You are not buying software.<br />
                You are joining a program with real infrastructure and real people running it with you.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="bg-[#E11D2A] px-6 pb-20 md:pb-32">
        <div className="mx-auto max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="font-display text-[clamp(2rem,5vw,3.5rem)] font-black tracking-[-0.04em] text-black leading-[1.05] pt-10 mb-10">
              Starting at $1,800 depending on setup and support needs.
            </p>
            <Link
              to={CTA_HREF}
              className="inline-flex items-center gap-2 bg-white px-9 py-4 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-black transition-all duration-200 hover:bg-black hover:text-white active:scale-[0.98]"
              onClick={() => window.gtag?.('event', 'cta_click', { page: 'wholesale-2', section: 'beta' })}
            >
              Apply for Access
              <ArrowRight size={13} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── Section 11: Disclaimer ───────────────────────────────────────────── */}
      <section className="bg-[#f4f4f4] px-6 py-14">
        <div className="mx-auto max-w-3xl">
          <p className="font-mono text-[0.55rem] uppercase tracking-[0.25em] text-[#6b7280] mb-5">
            Results Disclaimer
          </p>
          <p className="font-body text-[0.8rem] leading-[1.75] text-[#6b7280]">
            This system provides AI-assisted outreach infrastructure and implementation support. Results depend on list quality, market conditions, follow-up, negotiation, and user execution. AMTECH does not guarantee deals, income, or any specific business outcome.
          </p>
          <p className="mt-3 font-body text-[0.8rem] leading-[1.75] text-[#6b7280]">
            Users are responsible for compliance with applicable real estate, telemarketing, and privacy laws in their jurisdiction. AMTECH provides software and support — not legal, financial, or real estate advice.
          </p>
        </div>
      </section>

      {/* ── Section 12: Final CTA ────────────────────────────────────────────── */}
      <section className="bg-white px-6 py-24 md:py-36">
        <div className="mx-auto max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-[clamp(1.75rem,4vw,3rem)] font-black tracking-[-0.04em] text-[#0a0a0a] mb-6">
              Ready to run real campaigns<br />
              with people doing the same?
            </h2>
            <p className="font-body text-[0.95rem] leading-[1.75] text-[#6b7280] mb-10">
              Apply for the beta. The first cohort is small so setup is supported from day one.
            </p>
            <div className="flex flex-wrap items-center gap-5">
              <Link
                to={CTA_HREF}
                className="inline-flex items-center gap-2 bg-[#E11D2A] px-8 py-4 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-white transition-all duration-200 hover:bg-[#FF1A2B] active:scale-[0.98]"
                onClick={() => window.gtag?.('event', 'cta_click', { page: 'wholesale-2', section: 'footer-cta' })}
              >
                Apply for Access
                <ArrowRight size={13} />
              </Link>
              <Link
                to={DEMO_HREF}
                className="font-mono text-[0.7rem] uppercase tracking-[0.15em] text-[#0a0a0a] underline underline-offset-4 hover:text-[#E11D2A] transition-colors"
              >
                Request a Demo
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Minimal footer ───────────────────────────────────────────────────── */}
      <footer className="border-t border-black/10 px-6 py-8 flex items-center justify-between bg-white">
        <Link to="/" className="inline-flex items-baseline">
          <span className="font-display text-sm font-black tracking-[0.06em] text-[#0a0a0a]">AMTECH</span>
          <span className="text-sm font-black text-[#E11D2A]">.</span>
        </Link>
        <p className="font-mono text-[0.58rem] text-[#6b7280]">
          &copy; {new Date().getFullYear()} AMTECH. Operators Program.
        </p>
      </footer>

    </div>
  );
}


export default Wholesale2