import { motion } from 'framer-motion';

const examples = [
  {
    label: 'Local Service',
    title: 'Local Authority System for a Pooper Scooper Company',
    problem: 'The business needed stronger local search visibility, better service clarity, and more trust in a competitive local market.',
    built: [
      'Service-focused website structure',
      'Local entity SEO',
      'Service-area content',
      'Review-generation system',
      'Knowledge graph strategy',
      'AI-assisted content and reputation workflows',
    ],
    outcome: 'Designed to make the business the clearest and most trusted option in its local market.',
  },
  {
    label: 'Contractor',
    title: 'Contractor Operator System',
    problem: 'A service contractor owner is stuck handling estimates, communication, follow-up, admin, and growth manually.',
    built: [
      'AI estimate drafting',
      'Bid follow-up workflows',
      'Email/SMS customer communication',
      'Payroll/admin automations',
      'Review requests',
      'Owner dashboard + job documentation',
    ],
    outcome: 'Built to reduce owner bottlenecks and make the business easier to operate, manage, and scale.',
  },
  {
    label: 'Acquisition',
    title: 'AI Acquisition Dashboard',
    problem: 'Outbound-heavy businesses lose context across lead lists, call attempts, follow-up, and booked appointments.',
    built: [
      'Campaign dashboard',
      'AI voice agent integration',
      'Batch calling workflow',
      'Lead outcome tracking',
      'Calendar booking automation',
      'SMS booking alerts',
    ],
    outcome: 'Built to turn scattered outreach into a managed acquisition system where humans focus on the highest-value follow-up.',
  },
];

export default function ExamplesSection() {
  return (
    <section className="bg-black py-24 md:py-32 border-t border-white/[0.04]">
      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-14"
        >
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-red font-semibold mb-6">
            Proof
          </p>
          <h2 className="font-display text-[clamp(1.75rem,4vw,2.75rem)] font-black leading-[1.08] tracking-[-0.03em] text-white">
            Examples of the Work
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-5">
          {examples.map((ex, i) => (
            <motion.div
              key={ex.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="border border-white/[0.06] bg-white/[0.02] p-6 flex flex-col"
            >
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-red/70 mb-3">
                {ex.label}
              </span>
              <h3 className="font-display text-[0.95rem] font-bold text-white mb-4 leading-tight">
                {ex.title}
              </h3>

              <div className="mb-4">
                <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/25 mb-2 block">
                  Problem
                </span>
                <p className="text-[0.82rem] leading-[1.6] text-white/40">
                  {ex.problem}
                </p>
              </div>

              <div className="mb-4 flex-1">
                <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/25 mb-2 block">
                  AMTECH Built
                </span>
                <ul className="space-y-1.5">
                  {ex.built.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-[0.8rem] text-white/50">
                      <span className="w-1 h-1 bg-red/50 mt-1.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border-t border-white/[0.06] pt-4">
                <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/25 mb-2 block">
                  Outcome
                </span>
                <p className="text-[0.85rem] leading-[1.5] text-white/60">
                  {ex.outcome}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
