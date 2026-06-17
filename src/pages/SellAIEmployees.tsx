import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

const CTA_HREF = '/apply/info-sales-rep';

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

// ─── Stat item ────────────────────────────────────────────────────────────────
function StatCard({
  value,
  label,
  dark = false,
}: {
  value: string;
  label: string;
  dark?: boolean;
}) {
  return (
    <div
      className={`border px-5 py-5 ${dark ? 'bg-[#0a0a0a] border-[#0a0a0a]' : 'bg-white border-black/20'}`}
    >
      <div
        className={`text-3xl font-extrabold tracking-tight ${dark ? 'text-white' : 'text-[#0a0a0a]'}`}
      >
        {value}
        {dark && <span className="text-[#E11D2A]">.</span>}
      </div>
      <div
        className={`font-mono text-[0.6rem] uppercase tracking-[0.22em] mt-2 ${dark ? 'text-[#9a9a9a]' : 'text-[#6b6b6b]'}`}
      >
        {label}
      </div>
    </div>
  );
}

// ─── Offer card ───────────────────────────────────────────────────────────────
function OfferCard({
  label,
  title,
  description,
  dark = false,
}: {
  label: string;
  title: string;
  description: string;
  dark?: boolean;
}) {
  return (
    <div
      className={`p-5 border ${dark ? 'bg-[#0a0a0a] border-[#0a0a0a]' : 'bg-[#f5f5f5] border-black/10'}`}
    >
      <span
        className={`font-mono text-[0.55rem] uppercase tracking-[0.22em] ${dark ? 'text-[#E11D2A]' : 'text-[#E11D2A]'}`}
      >
        {label}
      </span>
      <h3
        className={`text-lg font-bold tracking-tight mt-2.5 ${dark ? 'text-white' : 'text-[#0a0a0a]'}`}
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

// ─── Value stack row ───────────────────────────────────────────────────────────
function ValueRow({
  idx,
  title,
  description,
}: {
  idx: string;
  title: string;
  description: string;
}) {
  return (
    <div className="grid grid-cols-[54px_380px_1fr] gap-7 items-baseline py-5 border-b border-black/10 last:border-b-0">
      <span className="font-mono text-sm font-semibold text-[#E11D2A]">{idx}</span>
      <h3 className="text-lg font-bold tracking-tight">{title}</h3>
      <p className="text-sm leading-relaxed text-[#6b6b6b]">{description}</p>
    </div>
  );
}

// ─── Path step ────────────────────────────────────────────────────────────────
function PathStep({
  num,
  title,
  description,
}: {
  num: string;
  title: string;
  description: string;
}) {
  return (
    <div className="border border-black/20 px-4 py-4">
      <span className="font-mono text-xs font-semibold text-[#E11D2A]">{num}</span>
      <h3 className="text-base font-extrabold tracking-tight mt-1.5 mb-1.5">{title}</h3>
      <p className="text-xs leading-relaxed text-[#6b6b6b]">{description}</p>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
function SellAIEmployees() {
  const heroRef = useRef<HTMLHeadingElement>(null);
  const offerRef = useRef<HTMLElement>(null);
  const valueRef = useRef<HTMLElement>(null);
  const fulfillmentRef = useRef<HTMLElement>(null);
  const closeRef = useRef<HTMLElement>(null);

  useWordReveal(heroRef as React.RefObject<HTMLElement | null>);
  useSectionEntrance(offerRef);
  useSectionEntrance(valueRef);
  useSectionEntrance(fulfillmentRef);
  useSectionEntrance(closeRef);

  useEffect(() => {
    document.title = 'AMTECH. - Rep Briefing: Sell AI Employees';
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute(
        'content',
        'Internal sales briefing for AMTECH AI Employee Bootcamp. Everything you need to close enrollments into the 10-day sales sprint.'
      );
    }
    return () => {
      document.title = 'AMTECH. - Your Next Employee Is a Computer';
    };
  }, []);

  const heroWords = ['You\'re', 'about', 'to', 'sell', 'AI', 'Employees'];

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
          onClick={() => window.gtag?.('event', 'cta_click', { page: 'sell-ai-employees', section: 'nav' })}
        >
          Apply to Sell
        </Link>
      </header>

      {/* ── Section 1: Hero / Cover ─────────────────────────────────────────────── */}
      <section className="px-6 py-16 md:px-18 md:py-20">
        <div className="mx-auto max-w-6xl">
          {/* Header row */}
          <div className="flex justify-between items-start border-b border-black pb-4 mb-8">
            <div className="font-extrabold text-xl tracking-tight">
              AMTECH<span className="text-[#E11D2A]">.</span>
            </div>
            <div className="font-mono text-xs uppercase tracking-[0.2em] text-right leading-relaxed text-[#6b6b6b]">
              <span className="text-[#E11D2A] font-semibold">Rep briefing - internal</span>
              <br />
              For the closer. Not for prospects.
            </div>
          </div>

          {/* Headline */}
          <h1
            ref={heroRef as React.RefObject<HTMLHeadingElement>}
            className="font-display text-[clamp(2.5rem,6vw,4rem)] font-extrabold tracking-[-0.025em] leading-[1.04] mb-6"
          >
            {heroWords.map((word, i) => (
              <span
                key={word + i}
                data-word
                className="inline-block mr-[0.15em]"
              >
                {word}
              </span>
            ))}
            <span className="text-[#E11D2A]">.</span>
          </h1>

          {/* Body */}
          <p className="text-base leading-relaxed text-[#6b6b6b] max-w-3xl mb-8">
            AMTECH builds AI Employees - working systems that answer calls, chase leads,
            and handle paperwork - for contractors, realtors, and local service businesses.
            The AI Employee Bootcamp trains people to sell them.{' '}
            <strong className="text-[#0a0a0a]">
              Your job is closing enrollments into that bootcamp.
            </strong>{' '}
            These five slides are everything you need to hold the frame on a call.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-2xl">
            <StatCard value="$2,300" label="Working tuition anchor" />
            <StatCard value="10 days" label="Async cohort sprint" />
            <StatCard value="1 deal" label="Pays the buyer back" dark />
          </div>

          {/* CTA */}
          <motion.div
            className="mt-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Link
              to={CTA_HREF}
              className="group relative overflow-hidden inline-flex items-center gap-2 px-7 py-3.5 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-white border-r-2 border-[#E11D2A]"
              style={{ background: '#0a0a0a' }}
              onClick={() => window.gtag?.('event', 'cta_click', { page: 'sell-ai-employees', section: 'hero' })}
            >
              <span
                className="absolute inset-0 bg-[#E11D2A] transition-transform duration-200 ease-out origin-right scale-x-0 group-hover:scale-x-100"
                style={{ transformOrigin: 'right' }}
              />
              <span className="relative z-10">Apply to Sell</span>
              <ArrowRight size={13} className="relative z-10" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── Section 2: The Offer ─────────────────────────────────────────────────── */}
      <section
        ref={offerRef}
        className="px-6 md:px-18 py-16 md:py-20 bg-[#fafafa] border-t border-black/5"
      >
        <div className="mx-auto max-w-6xl">
          {/* Section header */}
          <div className="flex justify-between items-baseline border-b border-black pb-4 mb-10">
            <div className="font-extrabold text-xl tracking-tight">
              AMTECH<span className="text-[#E11D2A]">.</span>
            </div>
            <div className="font-mono text-xs uppercase tracking-[0.28em] text-[#E11D2A] font-semibold">
              01 / The thing you're selling
            </div>
          </div>

          <h2 className="font-display text-[clamp(1.75rem,4vw,2.75rem)] font-extrabold tracking-[-0.02em] leading-[1.08] mb-4">
            A 10-day sprint with a real job at the end
            <span className="text-[#E11D2A]">.</span>
          </h2>

          <p className="text-base leading-relaxed text-[#6b6b6b] max-w-3xl mb-10">
            Not a course. Not a community. Entry into the AMTECH ecosystem - async-first
            Discord cohort, daily submissions, pod accountability, and a certification gate
            on Day 10. When a prospect calls it "a course," this structure is your correction.
          </p>

          {/* Offer cards grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <OfferCard
              label="Week 1 - Build"
              title="The operating base"
              description="Industry psychology, product fluency, prospecting + qualification, Intro + Intel, Presentation + Close. Day 5 gate."
            />
            <OfferCard
              label="Week 2 - Prove"
              title="The behavior"
              description="Call review, objection mastery, payment + onboarding, pipeline ownership. Certification on Day 10."
            />
            <OfferCard
              label="Live anchor calls"
              title="Three, not thirty"
              description="Day 1 kickoff (90m), Day 5 gate clinic (60m), Day 10 graduation (90m). Everything else is async - that's why it scales."
            />
            <OfferCard
              label="The guarantee - use it late, not early"
              title="Do the work, or it rolls forward"
              description="Complete the assignments, submit the Day 5 gate, attempt certification. Don't certify? Tuition applies to the next cohort free. The only failure mode is not showing up."
              dark
            />
          </div>
        </div>
      </section>

      {/* ── Section 3: Value Stack ───────────────────────────────────────────────── */}
      <section
        ref={valueRef}
        className="px-6 md:px-18 py-16 md:py-20 bg-white border-t border-black/5"
      >
        <div className="mx-auto max-w-6xl">
          {/* Section header */}
          <div className="flex justify-between items-baseline border-b border-black pb-4 mb-10">
            <div className="font-extrabold text-xl tracking-tight">
              AMTECH<span className="text-[#E11D2A]">.</span>
            </div>
            <div className="font-mono text-xs uppercase tracking-[0.28em] text-[#E11D2A] font-semibold">
              02 / Your value stack on every call
            </div>
          </div>

          <h2 className="font-display text-[clamp(1.75rem,4vw,2.75rem)] font-extrabold tracking-[-0.02em] leading-[1.08] mb-8">
            Your buyer isn't buying information
            <span className="text-[#E11D2A]">.</span>
          </h2>

          {/* Stack rows */}
          <div className="mt-8">
            <ValueRow
              idx="A"
              title="Hermes prospecting agent - lifetime"
              description="They build their own AI agent that finds contractors and realtors, researches each business, flags admin pain, and writes their DMs and call notes. Lifetime access, all future updates."
            />
            <ValueRow
              idx="B"
              title="Full DFY scripts + objection library - theirs forever"
              description="Every script and objection handler, downloadable. Portable to any sales role - they keep it even if AMTECH is never the fit."
            />
            <ValueRow
              idx="C"
              title="Certification into the active rep path"
              description="Day 10 certification unlocks active closer status, the rep community, and ongoing group coaching."
            />
            <ValueRow
              idx="D"
              title="Commission + inbound lead-share rotation"
              description="Defined commission on every AI Employee deal they close, plus a performance-weighted inbound lead rotation where territory allows."
            />
          </div>

          {/* Sell order callout */}
          <div className="inline-block mt-6 px-4 py-3 bg-[#0a0a0a] text-white font-mono text-xs tracking-[0.06em]">
            SELL THE ORDER: D &rarr; A &rarr; B &rarr; C. Income first. Tools second. Paper last.
          </div>
        </div>
      </section>

      {/* ── Section 4: Fulfillment ───────────────────────────────────────────────── */}
      <section
        ref={fulfillmentRef}
        className="px-6 md:px-18 py-16 md:py-20 bg-[#fafafa] border-t border-black/5"
      >
        <div className="mx-auto max-w-6xl">
          {/* Section header */}
          <div className="flex justify-between items-baseline border-b border-black pb-4 mb-10">
            <div className="font-extrabold text-xl tracking-tight">
              AMTECH<span className="text-[#E11D2A]">.</span>
            </div>
            <div className="font-mono text-xs uppercase tracking-[0.28em] text-[#E11D2A] font-semibold">
              03 / What's underneath the offer
            </div>
          </div>

          <h2 className="font-display text-[clamp(1.75rem,4vw,2.75rem)] font-extrabold tracking-[-0.02em] leading-[1.08] mb-4">
            You close<span className="text-[#E11D2A]">.</span> We build<span className="text-[#E11D2A]">.</span>
          </h2>

          <p className="text-base leading-relaxed text-[#6b6b6b] max-w-3xl mb-8">
            This is what separates the bootcamp from every guru course your prospect has been
            pitched: real fulfillment. Every AI Employee sold goes through the AMTECH dev team.
            The rep never writes code, never debugs, never touches delivery.
          </p>

          {/* Split columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl">
            {/* Rep does */}
            <div className="bg-[#f5f5f5] border border-black/10 px-6 py-6">
              <span className="font-mono text-[0.55rem] uppercase tracking-[0.22em] text-[#E11D2A] block mb-4">
                The rep does
              </span>
              <ul className="space-y-2">
                {[
                  'Prospects with their Hermes agent',
                  'Runs the call, handles objections',
                  'Closes the contractor',
                  'Collects commission',
                ].map((item) => (
                  <li key={item} className="text-sm font-medium pl-5 relative">
                    <span className="absolute left-0 top-2 w-2 h-2 bg-[#E11D2A]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* AMTECH delivers */}
            <div className="bg-[#0a0a0a] px-6 py-6">
              <span className="font-mono text-[0.55rem] uppercase tracking-[0.22em] text-[#E11D2A] block mb-4">
                AMTECH delivers
              </span>
              <ul className="space-y-2">
                {[
                  'Business brain - the system knows the company',
                  'Structured AMTECH CRM records',
                  'Owner messaging + review/approval surfaces',
                  'Browser tools for real task execution',
                  'Wired into the contractor\'s existing software',
                ].map((item) => (
                  <li key={item} className="text-sm text-white flex gap-3 items-baseline">
                    <span className="font-mono text-[#E11D2A] font-semibold">&rarr;</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <p className="text-sm italic text-[#6b6b6b] mt-6">
            A private AI office employee, stood up and maintained for a paying local business -
            that's the product your buyer gets to sell.
          </p>
        </div>
      </section>

      {/* ── Section 5: Why It Closes ─────────────────────────────────────────────── */}
      <section
        ref={closeRef}
        className="px-6 md:px-18 py-16 md:py-20 bg-white border-t border-black/5"
      >
        <div className="mx-auto max-w-6xl">
          {/* Section header */}
          <div className="flex justify-between items-baseline border-b border-black pb-4 mb-10">
            <div className="font-extrabold text-xl tracking-tight">
              AMTECH<span className="text-[#E11D2A]">.</span>
            </div>
            <div className="font-mono text-xs uppercase tracking-[0.28em] text-[#E11D2A] font-semibold">
              04 / Why it closes
            </div>
          </div>

          <h2 className="font-display text-[clamp(1.75rem,4vw,2.75rem)] font-extrabold tracking-[-0.02em] leading-[1.08]">
            <span className="text-[#E11D2A]">One closed deal</span> pays your buyer back
            <span className="text-[#E11D2A]">.</span>
          </h2>

          {/* Path steps */}
          <div className="mt-10">
            {/* Desktop horizontal */}
            <div className="hidden md:grid grid-cols-[1fr_28px_1fr_28px_1fr_28px_1fr] gap-0 items-stretch">
              <PathStep num="01" title="Enroll" description="Buyer joins the 10-day sprint" />
              <div className="flex items-center justify-center text-[#E11D2A] font-bold">&rarr;</div>
              <PathStep num="02" title="Certify" description="Day 10 gate - proven behavior" />
              <div className="flex items-center justify-center text-[#E11D2A] font-bold">&rarr;</div>
              <PathStep num="03" title="Close" description="Sells AI Employees to contractors" />
              <div className="flex items-center justify-center text-[#E11D2A] font-bold">&rarr;</div>
              <PathStep num="04" title="Get paid" description="Commission. AMTECH fulfills." />
            </div>

            {/* Mobile vertical */}
            <div className="flex flex-col gap-4 md:hidden">
              <PathStep num="01" title="Enroll" description="Buyer joins the 10-day sprint" />
              <PathStep num="02" title="Certify" description="Day 10 gate - proven behavior" />
              <PathStep num="03" title="Close" description="Sells AI Employees to contractors" />
              <PathStep num="04" title="Get paid" description="Commission. AMTECH fulfills." />
            </div>
          </div>

          {/* Talktrack quote */}
          <div className="mt-10 px-6 py-6 bg-[#0a0a0a] grid grid-cols-[auto_1fr] gap-6 items-center max-w-3xl">
            <span className="font-mono text-[0.55rem] uppercase tracking-[0.22em] text-[#E11D2A] whitespace-nowrap">
              Say this on every call
            </span>
            <p className="text-lg font-semibold text-white tracking-tight">
              "One closed AI Employee deal pays this back. Everything after that is upside."
            </p>
          </div>

          {/* FOR / NOT FOR */}
          <div className="mt-8 font-mono text-xs tracking-[0.06em] leading-relaxed">
            <p className="text-[#0a0a0a]">
              <strong className="text-[#E11D2A] font-semibold">FOR:</strong>{' '}
              sales pros without a real offer &middot; side-hustlers done with courses &middot; career pivots ready to work a 10-day sprint
            </p>
            <p className="text-[#6b6b6b] mt-2">
              <strong className="text-[#E11D2A] font-semibold">NOT FOR:</strong>{' '}
              passive-income seekers &middot; investors &middot; anyone who won't post, report, role-play, or pick up the phone
            </p>
          </div>

          {/* Footer tagline */}
          <div className="mt-14">
            <p className="text-lg font-extrabold">
              AMTECH<span className="text-[#E11D2A]">.</span>{' '}
              <span className="font-normal text-sm text-[#6b6b6b]">
                amtechai.com - you close. we build.
              </span>
            </p>
          </div>
        </div>
      </section>

      {/* ── Final CTA ────────────────────────────────────────────────────────────── */}
      <section className="px-6 md:px-18 py-20 md:py-28 bg-[#E11D2A]">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-display text-[clamp(1.5rem,4vw,2.5rem)] font-extrabold tracking-[-0.03em] text-black leading-tight mb-8">
            Ready to sell AI Employees?
          </h2>
          <Link
            to={CTA_HREF}
            className="inline-flex items-center gap-2 bg-white px-8 py-4 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-black transition-all duration-200 hover:bg-black hover:text-white active:scale-[0.98]"
            onClick={() => window.gtag?.('event', 'cta_click', { page: 'sell-ai-employees', section: 'final' })}
          >
            Apply to Sell
            <ArrowRight size={13} />
          </Link>
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
          &copy; {new Date().getFullYear()} AMTECH. Rep Program.
        </p>
      </footer>
    </div>
  );
}

export default SellAIEmployees;
