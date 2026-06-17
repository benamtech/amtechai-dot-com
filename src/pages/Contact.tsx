import { Link } from 'react-router-dom';
import { Phone, Mail, Clock, ArrowRight, Mic, Sparkles, PhoneIncoming } from 'lucide-react';
import AnimatedSection from '../components/ui/AnimatedSection';

export default function Contact() {
  return (
    <>
      <section className="relative overflow-hidden bg-[#FAFAFA] pt-32 pb-10 md:pt-40 md:pb-16">
        <div
          className="pointer-events-none absolute left-1/2 top-1/3 h-[400px] w-[600px] -translate-x-1/2 -translate-y-1/2"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(225, 29, 42, 0.04) 0%, transparent 70%)',
          }}
          aria-hidden="true"
        />
        <div className="container-wide relative z-10">
          <h1 className="max-w-3xl font-display text-display-xl text-black">
            See the estimator live on your trade.
          </h1>
          <p className="mt-6 max-w-2xl font-body text-body-lg leading-relaxed text-black/50">
            Skip the forms and the back-and-forth. Schedule a demo and see exactly how the
            estimator would work for your specific business &mdash; under five minutes. No obligation.
          </p>
        </div>
      </section>

      <section className="bg-[#FAFAFA]">
        <div className="container-wide pb-16 md:pb-24">
          <div className="mx-auto max-w-2xl">
            <AnimatedSection>
              <div className="glass-card p-6 sm:p-8 md:p-12">
                <div className="flex flex-col items-center text-center">
                  <div className="mb-8 grid w-full grid-cols-3 gap-2 sm:gap-3">
                    {[
                      { icon: Mic, label: 'Voice or Text' },
                      { icon: Sparkles, label: 'AI-Powered' },
                      { icon: PhoneIncoming, label: 'Under 5 Min' },
                    ].map(({ icon: Icon, label }) => (
                      <div key={label} className="glass-bright flex flex-col items-center gap-2 rounded-xl px-2 py-4 sm:px-4 sm:py-5">
                        <Icon className="h-5 w-5 text-red/70" />
                        <span className="mono-label text-black/30">{label}</span>
                      </div>
                    ))}
                  </div>

                  <h2 className="font-display text-2xl font-bold text-black md:text-3xl">
                    Schedule a demo
                  </h2>
                  <p className="mt-4 max-w-md text-left font-body text-body-md leading-relaxed text-black/40">
                    Tell us your trade, your pricing, and what&rsquo;s not working. Get a
                    live walkthrough of how AMTECH would be configured for your business.
                  </p>

                  <Link
                    to="/shedule-demo"
                    className="btn-primary mt-8 px-8 py-3 text-sm md:!px-10 md:!py-4 md:!text-base"
                  >
                    Schedule Demo
                    <ArrowRight size={18} />
                  </Link>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      <section className="border-t border-black/[0.06] bg-white">
        <div className="container-wide py-16 md:py-20">
          <div className="mx-auto max-w-2xl">
            <AnimatedSection>
              <h3 className="font-display text-xl font-bold text-black">
                Prefer to talk to a human first?
              </h3>
              <p className="mt-3 font-body text-body-sm leading-relaxed text-black/40">
                We answer our phone. (Yes, with the same AI we build for our clients. Consider
                it a live demo of what your business could sound like.)
              </p>
            </AnimatedSection>

            <AnimatedSection delay={0.1}>
              <div className="mt-8 grid gap-6 sm:grid-cols-3">
                <a
                  href="tel:+18058869173"
                  className="flex items-center gap-3 text-black/50 transition-colors hover:text-black"
                >
                  <Phone size={18} className="shrink-0 text-red" />
                  <span className="font-mono text-sm">(805) 886-9173</span>
                </a>
                <a
                  href="mailto:ben@amtechai.com"
                  className="flex items-center gap-3 text-black/50 transition-colors hover:text-black"
                >
                  <Mail size={18} className="shrink-0 text-red" />
                  <span className="font-mono text-sm">ben@amtechai.com</span>
                </a>
                <div className="flex items-center gap-3 text-black/40">
                  <Clock size={18} className="shrink-0 text-red" />
                  <span className="font-mono text-sm">
                    AI 24/7 &middot; Humans M-F 9-6 PT
                  </span>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      <section className="bg-[#F5F5F5]">
        <div className="container-wide py-16 md:py-20">
          <div className="mx-auto max-w-2xl text-center">
            <AnimatedSection>
              <p className="font-mono text-3xl font-medium text-red md:text-4xl">35%</p>
              <p className="mt-2 mono-label text-black/30">
                average lift in lead-to-appointment conversions within the first 60 days
              </p>
            </AnimatedSection>

            <AnimatedSection delay={0.1}>
              <blockquote className="mt-10 glass-card p-8 text-left">
                <p className="font-body text-body-md italic text-black/60">
                  &ldquo;The estimator went live and within two weeks I had more booked
                  consultations than the entire month before. Same traffic. Nobody leaving
                  without a quote.&rdquo;
                </p>
                <footer className="mt-4 font-body text-body-sm text-black/30">
                  &mdash; Maria Santos, Green Valley Landscaping
                </footer>
              </blockquote>
            </AnimatedSection>
          </div>
        </div>
      </section>

      <section className="border-t border-black/[0.06] bg-white">
        <div className="container-wide py-12 md:py-16">
          <div className="flex flex-col gap-4 text-center md:flex-row md:items-center md:justify-center md:gap-12 md:text-left">
            <p className="font-body text-xs text-black/30 sm:text-body-sm">
              <span className="text-black/60">$500 setup. $50&ndash;100/month.</span> No contract. Cancel anytime.
            </p>
            <div className="hidden h-4 w-px bg-black/10 md:block" aria-hidden="true" />
            <p className="font-body text-xs text-black/30 sm:text-body-sm">
              <span className="text-black/60">Live in 5&ndash;7 days.</span> From discovery
              call to estimator on your website.
            </p>
            <div className="hidden h-4 w-px bg-black/10 md:block" aria-hidden="true" />
            <p className="font-body text-xs text-black/30 sm:text-body-sm">
              <span className="text-black/60">One job covers the year.</span> The math only
              needs to work once.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
