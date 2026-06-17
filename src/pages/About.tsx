import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import AnimatedSection from '../components/ui/AnimatedSection';
import StorySection from '../components/about/StorySection';
import ThesisSection from '../components/about/ThesisSection';

export default function About() {
  return (
    <>
      <section className="relative overflow-hidden bg-[#FAFAFA] pt-32 pb-20 md:pt-40 md:pb-28 border-b border-black/[0.06]">
        <div
          className="pointer-events-none absolute left-1/2 top-1/3 h-[400px] w-[600px] -translate-x-1/2 -translate-y-1/2"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(225, 29, 42, 0.04) 0%, transparent 70%)',
          }}
          aria-hidden="true"
        />
        <div className="container-wide relative z-10">
          <AnimatedSection>
            <p className="mono-label mb-4 text-red">About AMTECH</p>
            <h1 className="max-w-4xl font-display text-display-xl text-black">
              We Built This Because We Needed It Ourselves.
            </h1>
          </AnimatedSection>
        </div>
      </section>

      <StorySection />
      <ThesisSection />

      <section className="bg-[#FAFAFA] border-t border-black/[0.06]">
        <div className="container-narrow py-24 text-center md:py-34">
          <AnimatedSection>
            <div className="mx-auto mb-6 h-px w-16 bg-red" />
            <h2 className="font-display text-display-lg text-black">
              If You're Curious Whether This Makes Sense for Your Business, Let's Talk.
            </h2>
          </AnimatedSection>

          <AnimatedSection delay={0.1}>
            <div className="mt-10">
              <Link to="/schedule-demo" className="btn-primary px-8 py-4 text-sm md:!px-10 md:!py-5">
                Schedule a Call
                <ArrowRight size={16} />
              </Link>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.15}>
            <p className="mt-6 font-mono text-xs text-black/25">
              30 minutes. We'll ask about your business and tell you exactly what we'd build.
            </p>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
