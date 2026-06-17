import AnimatedSection from '../ui/AnimatedSection';

export default function ThesisSection() {
  return (
    <section className="bg-[#F5F5F5]">
      <div className="container-narrow py-24 md:py-34">
        <AnimatedSection>
          <p className="mono-label mb-4 text-red">Process</p>
          <h2 className="font-display text-display-lg text-black">How We Work</h2>
        </AnimatedSection>

        <div className="mt-12 space-y-6">
          <AnimatedSection delay={0.05}>
            <p className="font-body text-body-md leading-[1.8] text-black/60">
              Every system we sell, we've run ourselves. When we tell you what an outbound agent produces, we're telling you what we measured on our own list. When we tell you the inbound system handles every call without dropping anything, we're telling you what we built for our own operation first.
            </p>
          </AnimatedSection>

          <AnimatedSection delay={0.08}>
            <p className="font-body text-body-md leading-[1.8] text-black/60">
              We meet with clients in person when we can. We ask a lot of questions before we build anything. The quality of what we deliver depends entirely on how well we understand your business — and that starts with a real conversation.
            </p>
          </AnimatedSection>

          <AnimatedSection delay={0.11}>
            <div className="flex items-center gap-4 pt-2">
              <div className="h-px flex-1 bg-black/[0.06]" />
              <div className="glass-pill px-6 py-2">
                <p className="font-mono text-xs uppercase tracking-[0.15em] text-black/40">
                  Central Oregon — Nationwide
                </p>
              </div>
              <div className="h-px flex-1 bg-black/[0.06]" />
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.14}>
            <p className="font-body text-body-md leading-[1.8] text-black/60">
              We're based in Central Oregon and work with businesses across the country.
            </p>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
