import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';

const forItems = [
  'Business owners ready to invest in modern systems',
  'Local companies that want to dominate their category',
  'Contractors and service businesses tired of chaos',
  'Operators willing to learn new workflows',
  'Owners who want to work on the business, not just inside it',
  'Teams ready to use AI as leverage, not a gimmick',
];

const notForItems = [
  'People looking for passive income',
  'Owners unwilling to change their process',
  'Businesses looking for the cheapest website',
  'Companies that want generic AI tools with no implementation',
  'People expecting software to replace discipline or service quality',
];

export default function ForNotForSection() {
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
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-red font-semibold mb-6">
            Fit
          </p>
          <h2 className="font-display text-[clamp(1.75rem,4vw,3rem)] font-black leading-[1.08] tracking-[-0.03em] text-white max-w-3xl">
            Built for Serious Operators
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="border border-white/[0.06] bg-white/[0.02] p-6"
          >
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-emerald-400/70 mb-5 block">
              This Is For You If
            </span>
            <ul className="space-y-3">
              {forItems.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <Check size={14} className="text-emerald-400/70 mt-0.5 shrink-0" />
                  <span className="text-[0.87rem] text-white/55 leading-[1.5]">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="border border-white/[0.06] bg-white/[0.02] p-6"
          >
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-red/60 mb-5 block">
              Not For
            </span>
            <ul className="space-y-3">
              {notForItems.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <X size={14} className="text-red/50 mt-0.5 shrink-0" />
                  <span className="text-[0.87rem] text-white/40 leading-[1.5]">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
