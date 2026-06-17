import { motion } from 'framer-motion';

const stages = [
  {
    number: '01',
    title: 'No Serious Website Yet',
    description: 'You need a real digital foundation: website, service pages, clear copy, trust signals, reviews, and basic conversion.',
  },
  {
    number: '02',
    title: 'Website Exists, But Growth Is Inconsistent',
    description: 'You need authority, review systems, SEO/entity structure, follow-up workflows, and better tracking.',
  },
  {
    number: '03',
    title: 'Owner Is Still the Bottleneck',
    description: 'You need AI agents for estimating, admin, communication, scheduling, follow-up, and internal processes.',
  },
  {
    number: '04',
    title: 'Ready to Scale',
    description: 'You need dashboards, automations, operator training, campaign systems, and custom business intelligence.',
  },
];

export default function StagesSection() {
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
            Who We Help
          </p>
          <h2 className="font-display text-[clamp(1.75rem,4vw,3rem)] font-black leading-[1.08] tracking-[-0.03em] text-white max-w-3xl mb-6">
            Wherever You Are, We Build the Next Layer
          </h2>
          <p className="text-[1rem] leading-[1.7] text-white/40 max-w-2xl">
            AMTECH does not force every client into the same package. We build the next logical operating layer for the business.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {stages.map((stage, i) => (
            <motion.div
              key={stage.number}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="border border-white/[0.06] bg-white/[0.02] p-6 relative group hover:border-red/20 transition-colors duration-300"
            >
              <span className="font-mono text-[2rem] font-black text-white/[0.06] absolute top-4 right-5">
                {stage.number}
              </span>
              <div className="flex items-center gap-2 mb-4">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-red">
                  Stage {stage.number}
                </span>
              </div>
              <h3 className="font-display text-[1rem] font-bold text-white mb-3 leading-tight">
                {stage.title}
              </h3>
              <p className="text-[0.85rem] leading-[1.6] text-white/40">
                {stage.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
