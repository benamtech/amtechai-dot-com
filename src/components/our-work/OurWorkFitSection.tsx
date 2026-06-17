import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';

const forItems = [
  'Business owners ready to invest in better systems',
  'Contractors and local service companies',
  'Owners tired of being the bottleneck',
  'Teams that want to use AI practically',
  'Businesses that want stronger local authority',
  'Operators who want software designed around their actual work',
  'Companies ready to learn new workflows',
];

const notForItems = [
  'People looking for cheap template websites',
  'Owners unwilling to change their process',
  'Businesses expecting AI to replace service quality',
  'Companies looking for generic lead generation only',
  'People expecting software to fix a broken offer',
  'Passive-income seekers',
];

export default function OurWorkFitSection() {
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
            Fit
          </p>
          <h2 className="font-display text-[clamp(1.75rem,4vw,2.75rem)] font-black leading-[1.08] tracking-[-0.03em] text-white">
            Built for Business Owners Who Are Ready to Operate Differently
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
