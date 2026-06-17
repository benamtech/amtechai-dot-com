import { motion } from 'framer-motion';

const systems = [
  {
    title: 'AI Wholesale Real Estate Launch Lab',
    description: 'Lead upload, AI campaign agent, batch calling, lead outcome dashboard, calendar booking automation, SMS alerts, and implementation support.',
  },
  {
    title: 'Contractor AI Operator Program',
    description: 'Better estimating, follow-up, job documentation, review generation, admin automation, and owner visibility for contractors ready to grow.',
  },
  {
    title: 'Local Authority Growth System',
    description: 'Website structure, review generation, service-area content, entity SEO, and reputation workflows to dominate a local category.',
  },
  {
    title: 'AI Office Manager Setup',
    description: 'Custom internal system for organizing admin work, customer communication, scheduling, follow-up, and internal operations.',
  },
];

export default function OperatorSystemsSection() {
  return (
    <section className="bg-black-rich py-24 md:py-32 border-t border-white/[0.04]">
      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-14"
        >
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-red/70 mb-3 block">
            Category 04
          </span>
          <h2 className="font-display text-[clamp(1.75rem,4vw,2.75rem)] font-black leading-[1.08] tracking-[-0.03em] text-white mb-4">
            Operator Systems
          </h2>
          <p className="text-[1rem] leading-[1.7] text-white/40 max-w-2xl">
            Industry-specific software, workflows, and guidance. Some businesses need more than a website or automation. They need a complete operating system around a specific business goal.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-10"
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/30 mb-4">
            Each operator system combines
          </p>
          <div className="flex flex-wrap gap-2">
            {['Custom software', 'AI agents', 'Dashboards', 'Automations', 'Training', 'Workflows', 'Ongoing support'].map((tag) => (
              <span
                key={tag}
                className="border border-white/[0.08] bg-white/[0.02] px-3 py-1.5 text-[0.75rem] font-mono text-white/45"
              >
                {tag}
              </span>
            ))}
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-5">
          {systems.map((system, i) => (
            <motion.div
              key={system.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="border border-white/[0.06] bg-white/[0.02] p-6 hover:border-red/20 transition-colors duration-300"
            >
              <h3 className="font-display text-[1rem] font-bold text-white mb-3">
                {system.title}
              </h3>
              <p className="text-[0.85rem] leading-[1.6] text-white/40">
                {system.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
