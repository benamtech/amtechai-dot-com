import AnimatedSection from '../ui/AnimatedSection';

const factors = [
  {
    label: 'What it does',
    copy: 'A single inbound phone system costs less than a full outbound sales operation with lead sourcing and a dashboard. Most clients start with one system and expand from there.',
  },
  {
    label: "What you're already working with",
    copy: "If you have a CRM, a calendar system, and a business number, we wire into them. If you don't, we set them up. Setup complexity affects the build cost.",
  },
  {
    label: 'Your volume',
    copy: 'Lead generation and outbound pricing scales with the size of your list and your market. A contractor in a mid-size city has different needs than a wholesaler running national campaigns.',
  },
];

export default function PricingWhatShapesPrice() {
  return (
    <section className="bg-[#FAFAFA] py-28">
      <div className="container-wide">
        <AnimatedSection>
          <h2 className="mb-4 max-w-2xl font-display text-display-lg text-black">
            What You Pay Depends on What You Need.
          </h2>
        </AnimatedSection>
        <AnimatedSection delay={0.1}>
          <p className="mb-16 max-w-2xl font-body text-body-lg leading-relaxed text-black/40">
            We don't sell subscriptions to software you configure yourself. We build the system, integrate it into your operation, and keep it running.
          </p>
        </AnimatedSection>

        <div className="flex flex-col gap-0 divide-y divide-black/[0.06] border-t border-black/[0.06]">
          {factors.map((factor, i) => (
            <AnimatedSection key={factor.label} delay={0.1 + i * 0.08}>
              <div className="grid grid-cols-1 gap-6 py-10 md:grid-cols-[1fr_2fr] md:gap-16">
                <div>
                  <p className="mono-label mb-2 text-black/25">
                    Factor {String(i + 1).padStart(2, '0')}
                  </p>
                  <h3 className="font-display text-xl text-black">{factor.label}</h3>
                </div>
                <p className="font-body text-body-md leading-relaxed text-black/50">{factor.copy}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
