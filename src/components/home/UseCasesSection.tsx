import { motion } from 'framer-motion';

const useCases = [
  {
    label: 'Local Service Business',
    title: 'Local Service Authority System',
    example: 'For a pooper scooper company',
    items: [
      'Local SEO/entity structure',
      'Service-area content',
      'Review generation',
      'Google trust-building',
      'Automated content/reputation workflows',
    ],
    goal: 'Become the clearest and most trusted option in the local market.',
  },
  {
    label: 'Contractor / Remodel',
    title: 'Contractor Operator System',
    example: 'For a painting/remodel company',
    items: [
      'Bid-writing assistant',
      'Estimate workflow',
      'Customer follow-up',
      'Email/SMS automations',
      'Review requests + payroll/admin tools',
    ],
    goal: 'Reduce owner bottlenecks and support growth.',
  },
  {
    label: 'Outbound / Acquisition',
    title: 'AI Acquisition System',
    example: 'For real estate or outbound-heavy operators',
    items: [
      'Lead upload + AI campaign agent',
      'Batch calling',
      'Outcome dashboard',
      'Booked appointments + shared calendar',
      'SMS alerts',
    ],
    goal: 'Organize acquisition work so humans focus on highest-value conversations.',
  },
];

export default function UseCasesSection() {
  return (
    <section className="bg-black-rich py-24 md:py-32 border-t border-white/[0.04]">
      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-16"
        >
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-red font-semibold mb-6">
            Proof
          </p>
          <h2 className="font-display text-[clamp(1.75rem,4vw,3rem)] font-black leading-[1.08] tracking-[-0.03em] text-white max-w-3xl">
            Examples of AMTECH Systems
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-5">
          {useCases.map((uc, i) => (
            <motion.div
              key={uc.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="border border-white/[0.06] bg-white/[0.02] p-6 flex flex-col"
            >
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-red/70 mb-3">
                {uc.label}
              </span>
              <h3 className="font-display text-[1rem] font-bold text-white mb-2 leading-tight">
                {uc.title}
              </h3>
              <p className="text-[0.8rem] text-white/30 mb-5 italic">
                {uc.example}
              </p>
              <ul className="space-y-2 mb-6 flex-1">
                {uc.items.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 text-[0.82rem] text-white/50"
                  >
                    <span className="w-1 h-1 bg-red/50 mt-1.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="border-t border-white/[0.06] pt-4">
                <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-white/30 mb-1">
                  Goal
                </p>
                <p className="text-[0.85rem] text-white/60 leading-[1.5]">
                  {uc.goal}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
