import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import AnimatedSection from '../components/ui/AnimatedSection';

// Every claim here is one AMTECH may make (brain/proof.md), and none is about a client.
export default function About() {
  return (
    <>
      <section className="relative overflow-hidden bg-[#FAFAFA] pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="container-narrow relative z-10">
          <AnimatedSection>
            <p className="mono-label mb-4 text-red">About</p>
            <h1 className="font-display text-display-xl text-black">We run our own business on it.</h1>
            <p className="mt-6 max-w-2xl font-body text-body-lg leading-relaxed text-black/60">
              AMTECH is Ben Palaskas. It builds AI employees for the businesses that keep neighbourhoods running:
              contractors, service companies and local operators.
            </p>
          </AnimatedSection>
        </div>
      </section>

      <section className="bg-white">
        <div className="container-narrow py-16 md:py-24 space-y-10">
          <AnimatedSection>
            <h2 className="font-display text-display-md text-black">The same employee we sell</h2>
            <p className="mt-5 font-body text-body-lg leading-relaxed text-black/60">
              AMTECH runs its own company on an AI employee, and has since August 2026. It writes our estimates,
              answers our email and keeps our records. It is not a demo and not a plan.
            </p>
          </AnimatedSection>
          <AnimatedSection delay={0.05}>
            <h2 className="font-display text-display-md text-black">Work you can check</h2>
            <p className="mt-5 font-body text-body-lg leading-relaxed text-black/60">
              What it delivers is work, not a description of work: a full booking journey shipped with its tests
              passing, a working site with its own admin, an outreach campaign really sent, every one with a record
              behind it.
            </p>
          </AnimatedSection>
          <AnimatedSection delay={0.1}>
            <h2 className="font-display text-display-md text-black">You stay in charge</h2>
            <p className="mt-5 font-body text-body-lg leading-relaxed text-black/60">
              78% of small-business owners do not fully trust AI to work without oversight (Business.com, 2026). Nor
              should they. The employee drafts, and you approve what goes out.
            </p>
          </AnimatedSection>
        </div>
      </section>

      <section className="bg-[#FAFAFA] pb-28 md:pb-36">
        <div className="container-narrow pt-16 text-center">
          <AnimatedSection>
            <h2 className="font-display text-display-lg text-black">Talk to Ben, or try it first.</h2>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link to="/contractors" className="btn-primary">
                Try it on a job
                <ArrowRight size={16} />
              </Link>
              <Link to="/schedule-demo" className="btn-secondary">Talk to Ben</Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
