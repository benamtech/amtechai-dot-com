import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import AnimatedSection from '../components/ui/AnimatedSection';
import DifferentSection from '../components/how-it-works/DifferentSection';

export default function HowItWorks() {
  return (
    <>
      <section className="relative overflow-hidden bg-[#FAFAFA] pt-32 pb-20 md:pt-40 md:pb-28">
        <div
          className="pointer-events-none absolute left-1/2 top-1/3 h-[500px] w-[700px] -translate-x-1/2 -translate-y-1/2"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(225, 29, 42, 0.04) 0%, transparent 70%)',
          }}
          aria-hidden="true"
        />
        <div className="container-wide relative z-10">
          <AnimatedSection>
            <p className="mono-label mb-4 text-red">How It Works</p>
            <h1 className="max-w-4xl font-display text-display-xl text-black">
              We Interview Your Business. Then We Build Its Brain.
            </h1>
            <p className="mt-6 max-w-2xl font-body text-body-lg leading-relaxed text-black/50">
              Every AI system we build starts with a deep conversation about how your business
              actually operates. Your processes, your decisions, your language, your edge cases.
              We learn it all &mdash; then we architect intelligence around it.
            </p>
            <p className="mt-4 max-w-2xl font-body text-body-md leading-relaxed text-black/40">
              The result isn&rsquo;t a chatbot or an automation. It&rsquo;s a custom-built AI system
              that thinks, decides, and executes like an extension of your best people &mdash; at a
              scale they never could.
            </p>
            <div className="mt-10">
              <Link to="/schedule-demo" className="btn-primary">
                Start the Conversation
                <ArrowRight size={16} />
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <DifferentSection />

      <section className="bg-[#FAFAFA]">
        <div className="container-narrow py-20 md:py-34">
          <AnimatedSection>
            <div className="text-center">
              <h2 className="font-display text-display-lg text-black">
                The Discovery Call Is Where Everything Starts.
              </h2>
              <p className="mx-auto mt-6 max-w-xl font-body text-body-lg leading-relaxed text-black/50">
                30 minutes. We ask hard questions about your operation, your bottlenecks, and
                your ambitions. You leave knowing exactly what we&rsquo;d build, what it would
                do, and how fast it goes live.
              </p>
              <div className="mt-10">
                <Link to="/schedule-demo" className="btn-primary px-8 py-4 text-sm md:!px-10 md:!py-5 md:!text-base">
                  Schedule a Discovery Call
                  <ArrowRight size={18} />
                </Link>
              </div>
              <p className="mt-6 font-mono text-xs text-black/25">
                No commitment. No pitch deck. Just a conversation about what&rsquo;s possible.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
