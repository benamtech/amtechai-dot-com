import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import AnimatedSection from '../ui/AnimatedSection';

export default function PricingHero() {
  return (
    <section className="relative overflow-hidden bg-[#FAFAFA] pt-32 pb-24 md:pt-44 md:pb-32">
      <div
        className="pointer-events-none absolute left-1/2 top-1/3 h-[500px] w-[700px] -translate-x-1/2 -translate-y-1/2"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(225, 29, 42, 0.04) 0%, transparent 70%)',
        }}
        aria-hidden="true"
      />
      <div className="container-narrow relative z-10">
        <AnimatedSection>
          <p className="mono-label mb-6 text-red">Pricing</p>
          <h1 className="font-display text-display-xl text-black">
            Pricing Is Based on What We Build for You.
          </h1>
        </AnimatedSection>
        <AnimatedSection delay={0.1}>
          <p className="mt-8 max-w-2xl font-body text-body-lg leading-relaxed text-black/50">
            Every AMTECH system is custom. A 30-minute call is how we figure out what makes sense for your business — and what it costs.
          </p>
        </AnimatedSection>
        <AnimatedSection delay={0.2}>
          <div className="mt-10">
            <Link to="/schedule-demo" className="btn-primary">
              Schedule a Call
              <ArrowRight size={16} />
            </Link>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
