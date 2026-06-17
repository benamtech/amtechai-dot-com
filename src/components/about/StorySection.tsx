import AnimatedSection from '../ui/AnimatedSection';

export default function StorySection() {
  return (
    <section className="bg-white">
      <div className="container-narrow py-24 md:py-34">
        <AnimatedSection>
          <p className="mono-label mb-4 text-red">Origin</p>
          <h2 className="font-display text-display-lg text-black">The Story</h2>
        </AnimatedSection>

        <AnimatedSection delay={0.03}>
          <div className="mt-12 overflow-hidden rounded-sm">
            <img
              src="https://images.pexels.com/photos/10559023/pexels-photo-10559023.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
              alt=""
              className="h-64 w-full object-cover grayscale-[30%] md:h-80"
            />
          </div>
        </AnimatedSection>

        <div className="mt-12 space-y-6">
          <AnimatedSection delay={0.05}>
            <p className="font-body text-body-md leading-[1.8] text-black/60">
              AMTECH started as a services company with a product to sell and no sales team to sell it with. So we built one out of AI — a custom outbound system pointed at a cold list of contractors.
            </p>
          </AnimatedSection>

          <AnimatedSection delay={0.08}>
            <div className="glass-card p-8 md:p-10">
              <div className="flex flex-col gap-4 md:flex-row md:gap-12">
                <div className="flex items-baseline gap-3">
                  <span className="font-display text-[clamp(2rem,3.5vw,2.75rem)] font-black leading-none text-black">$100</span>
                  <span className="font-mono text-xs uppercase tracking-wider text-black/30">total spend</span>
                </div>
                <div className="flex items-baseline gap-3">
                  <span className="font-display text-[clamp(2rem,3.5vw,2.75rem)] font-black leading-none text-black">200</span>
                  <span className="font-mono text-xs uppercase tracking-wider text-black/30">calls made</span>
                </div>
                <div className="flex items-baseline gap-3">
                  <span className="font-display text-[clamp(2rem,3.5vw,2.75rem)] font-black leading-none text-red">3</span>
                  <span className="font-mono text-xs uppercase tracking-wider text-black/30">clients signed</span>
                </div>
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.11}>
            <p className="font-body text-body-md leading-[1.8] text-black/60">
              That result was hard to ignore. We had built something that worked better than the conventional alternative at a fraction of the cost, and we had the numbers to prove it. The decision to productize it wasn't complicated.
            </p>
          </AnimatedSection>

          <AnimatedSection delay={0.14}>
            <p className="font-body text-body-md leading-[1.8] text-black/60">
              That's the company. We build AI-powered software for American businesses — custom systems that handle the operational work that keeps a business running but doesn't require a human to do it.
            </p>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
