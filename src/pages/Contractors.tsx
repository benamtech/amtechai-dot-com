import { useRef, useState } from 'react';
import { ArrowRight, FileText, Link2, ShieldCheck } from 'lucide-react';
import AnimatedSection from '../components/ui/AnimatedSection';

// The working agent runs on the platform host. Nothing is requested from it until the visitor presses
// Start: a crawler or a reader who never presses it costs nothing and is handed no workspace.
const AGENT_ORIGIN = 'https://app.amtechai.com';

const does = [
  {
    icon: FileText,
    title: 'The estimate',
    body: 'Describe the job in your own words, or give it what you already have: plans, photos, a customer’s email, an old estimate or your price sheet. It drafts the estimate in front of you and asks about anything it cannot work out.',
  },
  {
    icon: Link2,
    title: 'A page your customer can open',
    body: 'When the estimate is right, it makes a clean page with your business name on it. Nothing is sent to a customer until you send it yourself.',
  },
  {
    icon: ShieldCheck,
    title: 'Yours when you keep it',
    body: 'Sign in with your email or phone and the whole workspace becomes your AMTECH employee: the conversation, the files and what it learned about your business. You open it at your own address on amtechai.com.',
  },
];

const faqs = [
  {
    q: 'Is it free to try?',
    a: 'Yes. There is no card and no sign-up to start. You only sign in if you want to keep what it made.',
  },
  {
    q: 'What does it cost if I keep it?',
    a: 'There is no monthly fee. You pay for the work it does as it does it, and AMTECH takes 8% of payments your customers make through it. Stripe’s card fee comes out of your side, as it does on any Stripe account.',
  },
  {
    q: 'Does it send anything to my customer on its own?',
    a: 'No. It drafts, and you send. Every page and every payment request waits for your tap.',
  },
  {
    q: 'Will it ask for my passwords or bank details?',
    a: 'No. It never asks for a password, a card number or a Social Security number in the chat. Stripe collects payout details on its own secure form.',
  },
];

export default function Contractors() {
  const [started, setStarted] = useState(false);
  const holder = useRef<HTMLDivElement>(null);

  const start = () => {
    setStarted(true);
    // Bring the agent into view; the frame is created by this click and not before.
    requestAnimationFrame(() => holder.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  };

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-[#FAFAFA] pt-32 pb-16 md:pt-44 md:pb-20">
        <div
          className="pointer-events-none absolute left-1/2 top-1/4 h-[700px] w-[900px] -translate-x-1/2 -translate-y-1/2"
          style={{ background: 'radial-gradient(ellipse at center, rgba(228, 37, 28, 0.22) 0%, rgba(228, 37, 28, 0.06) 45%, transparent 70%)' }}
          aria-hidden="true"
        />
        <div className="container-wide relative z-10">
          <div className="mx-auto max-w-3xl text-center">
            <AnimatedSection>
              <h1 className="font-display text-display-hero text-black">
                Give it a real job.
                <br />
                <span className="text-red">Watch it do the office work.</span>
              </h1>
              <p className="mx-auto mt-7 max-w-2xl font-body text-body-lg leading-relaxed text-black/60">
                This is the AMTECH employee for contractors, working live on this page. Tell it about a
                job and it drafts the estimate and makes a page your customer can open. You send
                everything yourself.
              </p>
              <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
                {!started && (
                  <button type="button" onClick={start} className="btn-primary">
                    Start with a job
                    <ArrowRight size={16} />
                  </button>
                )}
                <a href="#what-it-does" className="btn-secondary">
                  What it does
                </a>
              </div>
              <p className="mt-4 font-body text-sm leading-relaxed text-black/45">
                Free to try. No card and no sign-up to start.
              </p>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* THE AGENT — mounted only after Start */}
      <section className="bg-[#FAFAFA]" aria-label="The AMTECH employee, working">
        <div ref={holder} className="container-wide pb-16">
          {started ? (
            <iframe
              src={`${AGENT_ORIGIN}/funnel/`}
              title="The AMTECH employee, working"
              className="mx-auto block h-[78vh] min-h-[560px] w-full max-w-5xl border border-black/15 bg-[#f7f9fc]"
              allow="clipboard-write"
            />
          ) : (
            <div className="mx-auto max-w-5xl border border-dashed border-black/15 p-10 text-center">
              <p className="font-body text-body-md text-black/50">
                Press <strong className="text-black/70">Start with a job</strong> and the employee opens here.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* WHAT IT DOES */}
      <section id="what-it-does" className="bg-white">
        <div className="container-wide py-20 md:py-24">
          <AnimatedSection>
            <h2 className="font-display text-display-lg text-black">What it does in one sitting.</h2>
          </AnimatedSection>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {does.map((d, i) => (
              <AnimatedSection key={d.title} delay={i * 0.07}>
                <div className="glass-card h-full p-8">
                  <d.icon size={24} className="text-red" strokeWidth={1.75} />
                  <h3 className="mt-5 font-display text-display-sm text-black">{d.title}</h3>
                  <p className="mt-3 font-body text-body-md leading-relaxed text-black/60">{d.body}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* WHY NOW — dark */}
      <section className="bg-[#0a0a0a]">
        <div className="container-wide py-20 md:py-28">
          <div className="mx-auto max-w-3xl">
            <AnimatedSection>
              <h2 className="font-display text-display-md text-white">
                Your next customer may ask an AI before they call anyone.
              </h2>
              <p className="mt-6 font-body text-body-lg leading-relaxed text-white/70">
                45% of consumers now use AI tools to find local businesses, up from 6% a year earlier
                (BrightLocal, 2026). Paid leads are expensive: contractors pay about{' '}
                <span className="text-red font-semibold">$54 per lead</span> for Google Local Services
                Ads (SearchLight Digital, 2026). The contractor who answers with a real estimate first
                is the one who gets the job.
              </p>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* YOU STAY IN CHARGE */}
      <section className="bg-[#f4f4f4]">
        <div className="container-wide py-16 md:py-24">
          <div className="mx-auto max-w-3xl">
            <AnimatedSection>
              <h2 className="font-display text-display-md text-black">
                It drafts. <span style={{ color: '#2563EB' }}>You send.</span>
              </h2>
              <p className="mt-6 font-body text-body-lg leading-relaxed text-black/60">
                78% of small-business owners do not fully trust AI to work without oversight
                (Business.com, 2026). Nor should they. Nothing it makes reaches a customer until you
                press send.
              </p>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* FAIR QUESTIONS */}
      <section className="bg-[#FAFAFA]">
        <div className="container-wide py-16 md:py-24">
          <div className="mx-auto max-w-3xl">
            <AnimatedSection>
              <h2 className="font-display text-display-md text-black">Fair questions, straight answers.</h2>
            </AnimatedSection>
            <div className="mt-10 space-y-6">
              {faqs.map((f, i) => (
                <AnimatedSection key={f.q} delay={i * 0.05}>
                  <div className="glass-card p-6">
                    <h3 className="font-display text-display-sm text-black">{f.q}</h3>
                    <p className="mt-3 font-body text-body-md leading-relaxed text-black/60">{f.a}</p>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-[#FAFAFA] pb-28 md:pb-36">
        <div className="container-wide relative z-10">
          <AnimatedSection>
            <div className="rounded-3xl bg-black p-10 md:p-16">
              <h2 className="max-w-3xl font-display text-display-xl text-white">Bring the job you need priced.</h2>
              <p className="mt-6 max-w-2xl font-body text-body-lg leading-relaxed text-white/70">
                AMTECH runs its own business on an AI employee, and has since August 2026. This is the
                same employee, ready for yours.
              </p>
              <div className="mt-10">
                <button type="button" onClick={start} className="btn-primary">
                  Start with a job
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
