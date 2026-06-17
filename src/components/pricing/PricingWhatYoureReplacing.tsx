import AnimatedSection from '../ui/AnimatedSection';

const oldWay = [
  { label: 'Full-time receptionist', cost: '$20,000-$35,000/year' },
  { label: 'Outbound sales rep', cost: '$40,000-$60,000/year + commission' },
  { label: 'Marketing agency retainer', cost: '$2,000-$5,000/month' },
];

const newWay = [
  { label: 'AI inbound + secretary configuration', cost: '$679/month' },
  { label: 'AI outbound agent', cost: 'Fraction of a hire. No commission.' },
  { label: 'AI lead generation', cost: '$5/lead or $100/captured lead' },
];

export default function PricingWhatYoureReplacing() {
  return (
    <section className="bg-[#FAFAFA] py-28">
      <div className="container-wide">
        <AnimatedSection>
          <h2 className="mb-4 max-w-2xl font-display text-display-lg text-black">
            What You're Replacing.
          </h2>
        </AnimatedSection>
        <AnimatedSection delay={0.1}>
          <p className="mb-16 max-w-2xl font-body text-body-lg leading-relaxed text-black/40">
            The math is straightforward. A full-time receptionist costs $20-35k per year. Our inbound system runs at $679 per month. The output is comparable. The availability is not — ours runs 24 hours a day.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <AnimatedSection delay={0.1} direction="left">
            <div className="glass-card p-8 lg:p-12">
              <p className="mono-label mb-8 text-black/25">The old way</p>
              <div className="flex flex-col gap-0 divide-y divide-black/[0.06]">
                {oldWay.map(row => (
                  <div key={row.label} className="flex flex-col gap-1 py-5 sm:flex-row sm:items-center sm:justify-between">
                    <span className="font-body text-body-sm text-black/50">{row.label}</span>
                    <span className="whitespace-nowrap font-mono text-sm font-bold text-black/60">
                      {row.cost}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.2} direction="right">
            <div className="glass-card relative overflow-hidden p-8 lg:p-12" style={{ borderColor: 'rgba(225, 29, 42, 0.2)' }}>
              <div className="absolute left-0 top-0 h-full w-[2px] rounded-full bg-red" />
              <p className="mono-label mb-8 text-red">The AMTECH way</p>
              <div className="flex flex-col gap-0 divide-y divide-black/[0.06]">
                {newWay.map(row => (
                  <div key={row.label} className="flex flex-col gap-1 py-5 sm:flex-row sm:items-center sm:justify-between">
                    <span className="font-body text-body-sm text-black/70">{row.label}</span>
                    <span className="whitespace-nowrap font-mono text-sm font-bold text-black">
                      {row.cost}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>
        </div>

        <AnimatedSection delay={0.3}>
          <div className="mt-8 border-t border-black/[0.06] pt-8">
            <p className="font-mono text-sm italic text-black/30">
              The difference in output is not proportional to the difference in cost. That is the point.
            </p>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
