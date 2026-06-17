import { Brain, Bot, Zap, Shield, Workflow, Database, Phone, Mail, BarChart3, Calendar, FileText, Globe } from 'lucide-react';
import AnimatedSection from '../ui/AnimatedSection';

const brainCapabilities = [
  { icon: Workflow, label: 'Autonomous decision-making trained on your logic' },
  { icon: Database, label: 'Connected to every system your business touches' },
  { icon: Shield, label: 'Knows your SOPs, pricing, policies, and edge cases' },
  { icon: BarChart3, label: 'Learns and improves from every interaction' },
];

const employeeExamples = [
  { role: 'Receptionist', does: 'Answers every call. Qualifies. Books. Never misses one.' },
  { role: 'Sales Rep', does: 'Works your list around the clock. Qualifies. Transfers warm.' },
  { role: 'Office Admin', does: 'Handles scheduling, documents, data entry, and domain-specific workflows autonomously.' },
  { role: 'Customer Success', does: 'Post-sale follow-up, reviews, referrals. Retention on autopilot.' },
  { role: 'Data Analyst', does: 'Tracks every metric. Surfaces what matters. Reports in real time.' },
];

export default function DifferentSection() {
  return (
    <section className="bg-[#FAFAFA]">
      <div className="container-wide py-16 md:py-34">
        <AnimatedSection>
          <p className="mono-label mb-4 text-red">What We Build</p>
          <h2 className="font-display text-display-lg text-black max-w-3xl">
            Two Categories of Intelligence. Limitless Applications.
          </h2>
          <p className="mt-6 max-w-2xl font-body text-body-lg leading-[1.75] text-black/50">
            Every business is different. The AI we build for a landscaping company looks nothing
            like what we build for a political campaign or a real estate wholesaler. That&rsquo;s
            by design.
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.05}>
          <div className="mt-12 overflow-hidden rounded-sm">
            <img
              src="https://images.pexels.com/photos/28864313/pexels-photo-28864313/free-photo-of-neon-lit-architectural-detail-in-brazil.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
              alt=""
              className="h-48 w-full object-cover md:h-64"
              style={{ filter: 'grayscale(20%) contrast(1.1)' }}
            />
          </div>
        </AnimatedSection>

        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <AnimatedSection delay={0.1} direction="left">
            <div className="glass-card h-full p-7 sm:p-10 md:p-12">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-red/10">
                <Brain size={26} className="text-red" />
              </div>

              <h3 className="font-display text-display-md text-black">AI Brains</h3>
              <p className="mt-2 font-body text-body-md leading-relaxed text-black/60">
                The intelligence layer of your business.
              </p>

              <p className="mt-6 font-body text-body-sm leading-[1.75] text-black/50">
                An AI Brain is a custom-built intelligence system that understands your entire
                operation. It doesn&rsquo;t just respond to inputs &mdash; it reasons, decides, and
                acts based on deep knowledge of how your business works. Trained on your data,
                your processes, your pricing logic, your institutional knowledge.
              </p>

              <div className="mt-8 space-y-3">
                {brainCapabilities.map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-start gap-3">
                    <Icon size={15} className="mt-0.5 flex-shrink-0 text-red/60" />
                    <span className="font-body text-body-sm leading-snug text-black/50">{label}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8 border-t border-black/[0.06] pt-6">
                <p className="font-mono text-xs italic text-black/30">
                  &ldquo;It knows more about my pricing than my estimators do.&rdquo;
                </p>
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.2} direction="right">
            <div className="glass-card h-full p-7 sm:p-10 md:p-12">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-red/10">
                <Bot size={26} className="text-red" />
              </div>

              <h3 className="font-display text-display-md text-black">AI Employees</h3>
              <p className="mt-2 font-body text-body-md leading-relaxed text-black/60">
                Roles filled. Not seats hired.
              </p>

              <p className="mt-6 font-body text-body-sm leading-[1.75] text-black/50">
                An AI Employee handles a specific role in your business end-to-end. It&rsquo;s not
                an assistant &mdash; it&rsquo;s a fully autonomous agent that does the work a
                human would, at a fraction of the cost, at 100x the scale, 24 hours a day.
                Custom-configured to your business, your voice, your standards.
              </p>

              <div className="mt-8 space-y-0 divide-y divide-black/[0.06]">
                {employeeExamples.map(({ role, does }) => (
                  <div key={role} className="flex flex-col gap-1 py-3 sm:flex-row sm:items-baseline sm:gap-4">
                    <span className="font-mono text-xs font-semibold uppercase tracking-[0.1em] text-red shrink-0 sm:w-36">
                      {role}
                    </span>
                    <span className="font-body text-body-sm leading-snug text-black/50">{does}</span>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>
        </div>

        <AnimatedSection delay={0.3}>
          <div className="mt-12 glass-card p-7 sm:p-10 md:p-12">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:gap-12">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red/10">
                <Zap size={22} className="text-red" />
              </div>
              <div>
                <h3 className="font-display text-display-sm text-black">
                  Most clients get both.
                </h3>
                <p className="mt-3 max-w-2xl font-body text-body-md leading-[1.75] text-black/50">
                  The Brain is the intelligence. The Employees are the execution. Together they
                  form a system that understands your business deeply and operates inside it
                  autonomously. The Brain trains the Employees. The Employees feed data back
                  to the Brain. The whole system compounds.
                </p>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
              {[
                { icon: Phone, label: 'Voice' },
                { icon: Mail, label: 'Email' },
                { icon: Globe, label: 'Web' },
                { icon: Calendar, label: 'Scheduling' },
                { icon: FileText, label: 'Documents' },
                { icon: BarChart3, label: 'Analytics' },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex flex-col items-center gap-2 rounded-xl border border-black/[0.06] bg-white/60 px-3 py-4">
                  <Icon size={16} className="text-red/60" />
                  <span className="font-mono text-[0.55rem] uppercase tracking-[0.12em] text-black/30">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
