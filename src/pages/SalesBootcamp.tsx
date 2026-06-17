import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Check, X } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

const CTA_HREF = '/schedule-call';

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

// ─── Section entrance hook ────────────────────────────────────────────────────
function useSectionEntrance(ref: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    gsap.set(el, { y: 40, opacity: 0 });
    const trigger = ScrollTrigger.create({
      trigger: el,
      start: 'top 80%',
      once: true,
      onEnter: () => {
        gsap.to(el, { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' });
      },
    });
    return () => trigger.kill();
  }, [ref]);
}

// ─── Curriculum day block ─────────────────────────────────────────────────────
function DayBlock({
  day,
  title,
  description,
  dark = false,
}: {
  day: string;
  title: string;
  description: string;
  dark?: boolean;
}) {
  return (
    <div
      className={`border px-6 py-5 ${dark ? 'bg-[#0a0a0a] border-[#0a0a0a]' : 'bg-[#f5f5f5] border-black/10'}`}
    >
      <span
        className={`font-mono text-[0.55rem] uppercase tracking-[0.22em] ${dark ? 'text-[#E11D2A]' : 'text-[#E11D2A]'}`}
      >
        {day}
      </span>
      <h3
        className={`text-base font-bold tracking-tight mt-2 ${dark ? 'text-white' : 'text-[#0a0a0a]'}`}
      >
        {title}
      </h3>
      <p
        className={`text-sm leading-relaxed mt-2 ${dark ? 'text-[#b5b5b5]' : 'text-[#6b6b6b]'}`}
      >
        {description}
      </p>
    </div>
  );
}

// ─── Value prop row ────────────────────────────────────────────────────────────
function ValueRow({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-5 py-5 border-b border-black/10 last:border-b-0">
      <span className="font-mono text-sm font-semibold text-[#E11D2A] shrink-0">{icon}</span>
      <div>
        <h3 className="text-lg font-bold tracking-tight">{title}</h3>
        <p className="text-sm leading-relaxed text-[#6b6b6b] mt-1">{description}</p>
      </div>
    </div>
  );
}

// ─── Week section ─────────────────────────────────────────────────────────────
function WeekSection({
  title,
  subtitle,
  days,
}: {
  title: string;
  subtitle: string;
  days: { day: string; title: string; description: string; dark?: boolean }[];
}) {
  const sectionRef = useRef<HTMLElement>(null);
  useSectionEntrance(sectionRef as React.RefObject<HTMLElement | null>);

  return (
    <section
      ref={sectionRef}
      className="px-6 md:px-18 py-16 md:py-20 bg-white border-t border-black/5"
    >
      <div className="mx-auto max-w-6xl">
        <div className="flex justify-between items-baseline border-b border-black pb-4 mb-10">
          <div className="font-extrabold text-xl tracking-tight">
            AMTECH<span className="text-[#E11D2A]">.</span>
          </div>
          <div className="font-mono text-xs uppercase tracking-[0.28em] text-[#E11D2A] font-semibold">
            {title}
          </div>
        </div>

        <h2 className="font-display text-[clamp(1.5rem,3.5vw,2.25rem)] font-extrabold tracking-[-0.02em] leading-[1.08] mb-2">
          {subtitle}
        </h2>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          {days.map((d) => (
            <DayBlock key={d.day} {...d} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
function SalesBootcamp() {
  const heroRef = useRef<HTMLDivElement>(null);
  const problemRef = useRef<HTMLElement>(null);
  const rhythmRef = useRef<HTMLElement>(null);
  const outcomesRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLElement>(null);

  useWordReveal(heroRef as React.RefObject<HTMLElement | null>);
  useSectionEntrance(problemRef as React.RefObject<HTMLElement | null>);
  useSectionEntrance(rhythmRef as React.RefObject<HTMLElement | null>);
  useSectionEntrance(outcomesRef as React.RefObject<HTMLElement | null>);
  useSectionEntrance(ctaRef as React.RefObject<HTMLElement | null>);

  useEffect(() => {
    document.title = 'AMTECH Sales Bootcamp | 10-Day AI-Powered Sales Training';
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute(
        'content',
        'A 10-day async-first bootcamp that trains you to sell AI solutions using custom prospecting agents, daily accountability, and live certification. For people serious about breaking into high-ticket sales.'
      );
    }
    return () => {
      document.title = 'AMTECH. - Your Next Employee Is a Computer';
    };
  }, []);

  const heroWords1 = ['Break', 'into', 'high-ticket', 'sales'];
  const heroWords2 = ['without', 'starting', 'from', 'zero.'];

  const week1Days = [
    { day: 'Day 1', title: 'Kickoff', description: 'Live 90-minute call. Industry psychology, offer frame, Discord setup, first prospecting assignment.' },
    { day: 'Day 2', title: 'Prospecting + Qualification', description: 'Build a 50-prospect list using the Hermes AI agent. Research realtors, contractors, local businesses.' },
    { day: 'Day 3', title: 'Intro + Intel', description: 'Learn to open conversations without sounding like a vendor. Reach consequence-level intel.' },
    { day: 'Day 4', title: 'Presentation + Close', description: 'Bridge from Intel to tailored offer. Handle objections through label, reflect, reframe, re-ask.' },
    { day: 'Day 5', title: 'Midpoint Gate', description: 'Live 60-minute call. Submit full-call role-play or schedule evaluator session.', dark: true },
  ];

  const week2Days = [
    { day: 'Day 6', title: 'Reading Real Calls', description: 'Review call recordings. Identify buying signals, break points, and next-step opportunities.' },
    { day: 'Day 7', title: 'Objection Mastery', description: 'Stacked objection training. Handle three objections without losing frame or arguing.' },
    { day: 'Day 8', title: 'Payment + Onboarding', description: 'Move from verbal yes to payment. Learn the onboarding call rhythm.' },
    { day: 'Day 9', title: 'Pipeline Ownership', description: 'Full pipeline audit. Top 5 opportunities, next actions, pending follow-ups.' },
    { day: 'Day 10', title: 'Certification', description: 'Live 90-minute graduation call. Certification role-play, pipeline review, active-rep path.', dark: true },
  ];

  const rhythmBlocks = [
    { icon: '01', title: 'Morning Goals', description: 'Post daily goals to Discord: outreach target, assignment focus, pod commitment.' },
    { icon: '02', title: 'Async Lessons', description: 'Watch/read the day\'s content. Live days include in-call teaching.' },
    { icon: '03', title: 'Work Blocks', description: 'Prospecting, list building, script practice, role-play recording, outreach.' },
    { icon: '04', title: 'Pod Check-in', description: 'Short sync with accountability partner. Compare goals, name improvements.' },
    { icon: '05', title: 'EOD Report', description: 'Post numbers: touches, conversations, bookings, blockers, assignment links.' },
    { icon: '06', title: '3 Daily Videos', description: 'Record goals (am), reflection (pm), debrief (eod). Upload to IG for proof funnel.' },
  ];

  const includedItems = [
    'Hermes AI prospecting agent - lifetime access',
    'Full DFY scripts + objection library',
    'Daily Discord accountability + pod structure',
    '3 live anchor calls with coach review',
    'Certification into active rep path',
    'Commission + lead-share eligibility',
  ];

  const forItems = [
    'Sales pros without a real offer to sell',
    'Career pivots ready for a 10-day sprint',
    'People who will post, report, role-play, and pick up the phone',
    'Those done with courses that don\'t produce behavior',
  ];

  const notForItems = [
    'Passive-income seekers',
    'People who won\'t record videos or show up async',
    'Anyone unwilling to be held accountable publicly',
    'Those who argue against coaching feedback',
  ];

  return (
    <div className="min-h-screen bg-white text-[#0a0a0a]">
      {/* ── Sticky Nav ─────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-white border-b border-black/10 px-6 py-3.5 flex items-center justify-between">
        <Link to="/" className="inline-flex items-baseline">
          <span className="font-display text-sm font-extrabold tracking-[0.06em] text-[#0a0a0a]">
            AMTECH
          </span>
          <span className="text-sm font-extrabold text-[#E11D2A]">.</span>
        </Link>
        <Link
          to={CTA_HREF}
          className="font-mono text-[0.62rem] uppercase tracking-[0.15em] text-[#E11D2A] hover:text-[#0a0a0a] transition-colors"
          onClick={() => window.gtag?.('event', 'cta_click', { page: 'sales-bootcamp', section: 'nav' })}
        >
          Book a Call
        </Link>
      </header>

      {/* ── Hero Section ────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[calc(100vh-48px)] bg-white flex items-center">
        <div className="mx-auto max-w-4xl w-full px-6 py-20">
          <div className="relative z-10">
            {/* Kicker */}
            <p className="font-mono text-[0.6rem] uppercase tracking-[0.22em] text-[#E11D2A] mb-6">
              10-Day Async Bootcamp + Custom AI Agent
            </p>

            {/* Headline */}
            <h1
              ref={heroRef as React.RefObject<HTMLHeadingElement>}
              className="font-display text-[clamp(2.5rem,6vw,4rem)] font-extrabold leading-[1.05] tracking-[-0.05em] text-[#0a0a0a] mb-6"
            >
              {heroWords1.map((word, i) => (
                <span key={word + i} data-word className="inline-block mr-[0.18em]">
                  {word}
                </span>
              ))}
              <br />
              {heroWords2.map((word, i) => (
                <span key={word + i} data-word className="inline-block mr-[0.18em]">
                  {word}
                </span>
              ))}
            </h1>

            {/* Body */}
            <motion.p
              className="font-body text-[1rem] leading-[1.75] text-[#6b6b6b] mb-10 max-w-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.85 }}
            >
              The AMTECH Sales Bootcamp is a 10-day sprint that trains you to sell AI solutions to
              local businesses. You get a custom prospecting agent, daily accountability, live coaching,
              and a certification path into active rep status. Not a course. A system.
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
                onClick={() => window.gtag?.('event', 'cta_click', { page: 'sales-bootcamp', section: 'hero' })}
              >
                <span
                  className="absolute inset-0 bg-[#E11D2A] transition-transform duration-200 ease-out origin-right scale-x-0 group-hover:scale-x-100"
                  style={{ transformOrigin: 'right' }}
                />
                <span className="relative z-10">Book Your Call</span>
                <ArrowRight size={13} className="relative z-10" />
              </Link>

              <a
                href="#curriculum"
                className="font-mono text-[0.7rem] uppercase tracking-[0.15em] text-[#0a0a0a] underline underline-offset-4 hover:text-[#E11D2A] transition-colors"
              >
                View Curriculum &darr;
              </a>
            </motion.div>

            {/* Scarcity */}
            <motion.p
              className="font-mono text-[0.6rem] text-[#6b6b6b] tracking-[0.1em]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 1.15 }}
            >
              Cohort capped at 12. Async-first, three live anchor calls.
            </motion.p>
          </div>
        </div>
      </section>

      {/* ── Problem Section ─────────────────────────────────────────────────────── */}
      <section
        ref={problemRef}
        className="bg-[#0a0a0a] px-6 py-20 md:py-32"
      >
        <div className="mx-auto max-w-3xl">
          <p className="font-mono text-[0.6rem] uppercase tracking-[0.22em] text-[#6b6b6b] mb-8">
            The Problem
          </p>

          <h2 className="font-display text-[clamp(2rem,5vw,3.5rem)] font-extrabold tracking-[-0.04em] text-white leading-[1.05] mb-10">
            Courses teach. They don't produce.
          </h2>

          <p className="font-body text-[1rem] leading-[1.85] text-[#6b6b6b] max-w-[680px] mb-8">
            Most sales training is content. Watch videos, read scripts, maybe attend a Zoom.
            There's no daily rhythm. No accountability. No proof of behavior.
            <br /><br />
            You leave with information, not a working system.
            <br /><br />
            The AMTECH bootcamp is built differently. Every day you prospect, post, record,
            and report. By Day 10, you've proven you can do the job - not just learn about it.
          </p>

          <p className="font-display text-[1.15rem] font-semibold text-white">
            The filter isn't knowledge. It's repetition.
          </p>
        </div>
      </section>

      {/* ── The Offer Section ───────────────────────────────────────────────────── */}
      <section className="bg-[#f5f5f5] px-6 py-16 md:py-20 border-t border-black/5">
        <div className="mx-auto max-w-6xl">
          <div className="flex justify-between items-baseline border-b border-black pb-4 mb-10">
            <div className="font-extrabold text-xl tracking-tight">
              AMTECH<span className="text-[#E11D2A]">.</span>
            </div>
            <div className="font-mono text-xs uppercase tracking-[0.28em] text-[#E11D2A] font-semibold">
              What You Get
            </div>
          </div>

          <h2 className="font-display text-[clamp(1.75rem,4vw,2.75rem)] font-extrabold tracking-[-0.02em] leading-[1.08] mb-4">
            A complete system, not a content library
            <span className="text-[#E11D2A]">.</span>
          </h2>

          <div className="mt-10 max-w-3xl">
            {includedItems.map((item) => (
              <div key={item} className="flex items-start gap-3 py-3 border-b border-black/10 last:border-b-0">
                <Check size={14} className="text-[#E11D2A] shrink-0 mt-0.5" />
                <p className="text-sm text-[#0a0a0a]">{item}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 px-6 py-5 bg-[#0a0a0a] inline-block">
            <div className="flex gap-6 items-center flex-wrap">
              <div>
                <span className="font-mono text-[0.55rem] uppercase tracking-[0.22em] text-[#E11D2A] block">
                  The Guarantee
                </span>
                <p className="text-white text-sm mt-2">
                  Complete the work, submit the Day 5 gate, attempt certification. Don't pass?
                  Tuition rolls forward to the next cohort free.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── The Rhythm Section ──────────────────────────────────────────────────── */}
      <section
        ref={rhythmRef}
        className="bg-white px-6 py-16 md:py-20 border-t border-black/5"
      >
        <div className="mx-auto max-w-6xl">
          <div className="flex justify-between items-baseline border-b border-black pb-4 mb-10">
            <div className="font-extrabold text-xl tracking-tight">
              AMTECH<span className="text-[#E11D2A]">.</span>
            </div>
            <div className="font-mono text-xs uppercase tracking-[0.28em] text-[#E11D2A] font-semibold">
              The Daily Rhythm
            </div>
          </div>

          <h2 className="font-display text-[clamp(1.75rem,4vw,2.75rem)] font-extrabold tracking-[-0.02em] leading-[1.08] mb-4">
            Every day follows the same structure
            <span className="text-[#E11D2A]">.</span>
          </h2>

          <p className="text-base leading-relaxed text-[#6b6b6b] max-w-3xl mb-10">
            The bootcamp rhythm mirrors the working rep day. You learn by doing - posting goals,
            running outreach, recording videos, logging numbers, and answering to your pod.
            Async-first, but never casual.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-0">
            {rhythmBlocks.map((block) => (
              <ValueRow key={block.icon} {...block} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Week 1 Section ──────────────────────────────────────────────────────── */}
      <div id="curriculum">
        <WeekSection
          title="Week 1 - Theory"
          subtitle="Build the operating base while the rhythm takes hold"
          days={week1Days}
        />
      </div>

      {/* ── Week 2 Section ──────────────────────────────────────────────────────── */}
      <WeekSection
        title="Week 2 - Live Fire"
        subtitle="Run real outreach and prepare for certification"
        days={week2Days}
      />

      {/* ── Outcomes Section ─────────────────────────────────────────────────────── */}
      <section
        ref={outcomesRef}
        className="bg-white px-6 py-16 md:py-20 border-t border-black/5"
      >
        <div className="mx-auto max-w-3xl">
          <div className="flex gap-8">
            <div className="w-1 shrink-0 bg-[#E11D2A]" />
            <div>
              <p className="font-display text-[clamp(1.5rem,3.5vw,2.25rem)] font-semibold text-[#0a0a0a] leading-[1.4] mb-8">
                "By Day 10, you've built a researched prospect list, practiced every phase,
                run outreach, submitted role-plays, handled objections, learned the payment moment,
                and proven pipeline discipline."
              </p>
              <p className="font-body text-[0.875rem] text-[#6b6b6b] italic">
                This is work, not content. The reps who pass are the reps who showed up.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Who This Is For ──────────────────────────────────────────────────────── */}
      <section className="bg-white border-t border-black/10 px-6 py-16 md:py-20">
        <div className="mx-auto max-w-6xl">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="font-display text-[clamp(1.5rem,3vw,2.25rem)] font-extrabold tracking-[-0.03em] text-[#0a0a0a] mb-12"
          >
            This bootcamp is not for everyone.
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-black/10 mb-10">
            <div className="bg-white px-8 py-10">
              <p className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-[#0a0a0a] mb-6">
                For
              </p>
              <div className="space-y-3">
                {forItems.map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <Check size={13} className="text-[#0a0a0a] shrink-0 mt-0.5" />
                    <p className="font-body text-[0.85rem] leading-snug text-[#6b6b6b]">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white px-8 py-10">
              <p className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-[#E11D2A] mb-6">
                Not For
              </p>
              <div className="space-y-3">
                {notForItems.map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <X size={13} className="text-[#E11D2A] shrink-0 mt-0.5" />
                    <p className="font-body text-[0.85rem] leading-snug text-[#6b6b6b]">{item}</p>
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
            className="font-display text-[1rem] font-semibold text-[#0a0a0a]"
          >
            The cohort is small because the accountability is real.
          </motion.p>
        </div>
      </section>

      {/* ── Final CTA Section ─────────────────────────────────────────────────────── */}
      <section
        ref={ctaRef}
        className="bg-[#E11D2A] px-6 py-20 md:py-28"
      >
        <div className="mx-auto max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-[clamp(1.75rem,4vw,2.75rem)] font-extrabold tracking-[-0.04em] text-black leading-[1.05] mb-6">
              Ready to run the 10-day sprint?
            </h2>
            <p className="font-body text-[0.95rem] leading-[1.75] text-black/80 mb-10">
              Book a call to discuss the bootcamp, your goals, and whether you're a fit for the next cohort.
              No pressure. Just a conversation.
            </p>
            <Link
              to={CTA_HREF}
              className="inline-flex items-center gap-2 bg-white px-8 py-4 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-black transition-all duration-200 hover:bg-black hover:text-white active:scale-[0.98]"
              onClick={() => window.gtag?.('event', 'cta_click', { page: 'sales-bootcamp', section: 'final' })}
            >
              Book Your Call
              <ArrowRight size={13} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── Minimal footer ──────────────────────────────────────────────────────── */}
      <footer className="border-t border-black/10 px-6 py-8 flex items-center justify-between bg-white">
        <Link to="/" className="inline-flex items-baseline">
          <span className="font-display text-sm font-extrabold tracking-[0.06em] text-[#0a0a0a]">
            AMTECH
          </span>
          <span className="text-sm font-extrabold text-[#E11D2A]">.</span>
        </Link>
        <p className="font-mono text-[0.58rem] text-[#6b6b6b]">
          &copy; {new Date().getFullYear()} AMTECH. Sales Bootcamp.
        </p>
      </footer>
    </div>
  );
}

export default SalesBootcamp;
