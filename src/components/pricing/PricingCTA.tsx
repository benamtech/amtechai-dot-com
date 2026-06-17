import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import AnimatedSection from '../ui/AnimatedSection';

export default function PricingCTA() {
  return (
    <section className="relative overflow-hidden bg-white py-20 md:py-36">
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[400px] w-[600px] -translate-x-1/2 -translate-y-1/2 animate-glow-pulse"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(225, 29, 42, 0.04) 0%, transparent 70%)',
        }}
        aria-hidden="true"
      />

      <div className="container-narrow relative z-10 text-center">
        <AnimatedSection>
          <h2 className="font-display text-display-lg text-black">
            The Best Way to Get a Number Is to Talk to Us.
          </h2>
        </AnimatedSection>

        <AnimatedSection delay={0.1}>
          <p className="mx-auto mt-8 max-w-2xl font-body text-body-lg leading-relaxed text-black/50">
            Tell us what your business looks like and what you need it to do. We'll tell you exactly what we'd build and what it costs.
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.15}>
          <div className="mt-10 flex flex-col items-center gap-4">
            <Link to="/schedule-demo" className="btn-primary px-8 py-4 text-sm md:!px-10 md:!py-5 md:!text-base">
              Schedule a Pricing Call
              <ArrowRight size={18} />
            </Link>
            <p className="font-mono text-xs text-black/25">
              No commitment. No presentation. Just a straight conversation.
            </p>
            <p className="mt-2 font-mono text-[11px] text-black/20">
              Prefer to run the numbers first?{' '}
              <Link to="/cost-calculator" className="text-red/70 hover:text-red transition-colors">
                Try the cost calculator
              </Link>
              .
            </p>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
