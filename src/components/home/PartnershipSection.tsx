import { motion } from 'framer-motion';

const deliverables = [
  'Strategy',
  'Design',
  'Software implementation',
  'AI agent setup',
  'Automation workflows',
  'Dashboard creation',
  'Training',
  'Iteration',
  'Ongoing support',
];

export default function PartnershipSection() {
  return (
    <section className="bg-black py-24 md:py-32 border-t border-white/[0.04]">
      <div className="container-wide">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-red font-semibold mb-6">
              How We Work
            </p>
            <h2 className="font-display text-[clamp(1.75rem,4vw,2.75rem)] font-black leading-[1.08] tracking-[-0.03em] text-white mb-8">
              We Build With You, Not Around You
            </h2>
            <div className="space-y-5 text-[0.95rem] leading-[1.7] text-white/50">
              <p>
                Business owners do not need another dashboard they do not understand. They need a technical partner who can translate their business into systems, train them, and improve the system as the business evolves.
              </p>
              <p className="text-white/70 font-medium">
                This is high-touch expert service, not self-serve SaaS.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <div className="border border-white/[0.06] bg-white/[0.02] p-6">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/30 mb-5 block">
                AMTECH Provides
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {deliverables.map((d, i) => (
                  <motion.div
                    key={d}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: 0.3 + i * 0.04 }}
                    className="border border-white/[0.06] bg-white/[0.02] px-4 py-3 text-center"
                  >
                    <span className="text-[0.8rem] text-white/55 font-medium">{d}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
