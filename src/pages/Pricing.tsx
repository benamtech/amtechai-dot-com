import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import AnimatedSection from '../components/ui/AnimatedSection';

// Every figure on this page comes from AMTECH's own price list (brain/pricing.md) and nowhere else.
const rows = [
  {
    what: 'Your own AI employee, self-serve',
    price: 'No monthly fee',
    detail:
      'Start free on a real job. If you keep it, you pay for the work it does as it does it, and AMTECH takes 8% of payments your customers make through it. No card to start.',
  },
  {
    what: 'A managed AI employee',
    price: 'From $1,500 a month',
    detail:
      'AMTECH sets it up around your business, your rates and your customers, and keeps it working. Most businesses land above $2,000 a month.',
  },
  {
    what: 'A website',
    price: '$1,000 or more',
    detail: 'Built, launched and kept readable to Google and to the AI assistants people now ask.',
  },
  {
    what: 'Hourly work',
    price: '$75 an hour',
    detail: 'Anything built or advised: agents, integrations, software set-up and repair, or a session working beside you.',
  },
  {
    what: 'Payments through a site AMTECH runs',
    price: '8% of each payment',
    detail:
      'Taken automatically by Stripe when a customer pays through checkout, a deposit or a balance our code creates. You are the merchant, and Stripe’s own card fee comes on top.',
  },
];

export default function Pricing() {
  return (
    <>
      <section className="relative overflow-hidden bg-[#FAFAFA] pt-32 pb-16 md:pt-44 md:pb-20">
        <div className="container-narrow relative z-10">
          <AnimatedSection>
            <h1 className="font-display text-display-hero text-black">
              What it costs<span className="text-red">.</span>
            </h1>
            <p className="mt-7 max-w-2xl font-body text-body-lg leading-relaxed text-black/60">
              These are starting points, not fixed prices. A bigger job or a tighter deadline moves the number up. Ben sets
              the final price for every managed job, and shows you how he got there.
            </p>
          </AnimatedSection>
        </div>
      </section>

      <section className="bg-white">
        <div className="container-narrow py-16 md:py-24">
          <div className="divide-y divide-black/[0.08] border-y border-black/[0.08]">
            {rows.map((r, i) => (
              <AnimatedSection key={r.what} delay={i * 0.05}>
                <div className="grid gap-3 py-8 md:grid-cols-[1fr_auto] md:gap-10">
                  <div>
                    <h2 className="font-display text-display-sm text-black">{r.what}</h2>
                    <p className="mt-3 max-w-xl font-body text-body-md leading-relaxed text-black/60">{r.detail}</p>
                  </div>
                  <p className="font-mono text-lg font-bold text-black md:text-right">{r.price}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#FAFAFA] pb-28 md:pb-36">
        <div className="container-narrow pt-16">
          <AnimatedSection>
            <div className="rounded-3xl bg-black p-10 md:p-16">
              <h2 className="max-w-3xl font-display text-display-xl text-white">Try it on a job first.</h2>
              <p className="mt-6 max-w-2xl font-body text-body-lg leading-relaxed text-white/70">
                The quickest way to know what it is worth to you is to give it real work. It is free to start.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link to="/contractors" className="btn-primary">
                  Try it on a job
                  <ArrowRight size={16} />
                </Link>
                <Link to="/schedule-demo" className="btn-secondary">
                  Talk to Ben
                </Link>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
