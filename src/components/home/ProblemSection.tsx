import { motion } from 'framer-motion';

const problems = [
  'The website does not explain the business clearly',
  'Reviews are not systematically generated',
  'Follow-up depends on memory',
  'Estimates take too long',
  'Office work lives in texts, notes, spreadsheets, and inboxes',
  'Leads are not organized',
  'Customers are not nurtured',
  'The owner is still the glue holding everything together',
];

export default function ProblemSection() {
  return (
    <section className="bg-black-rich py-24 md:py-32 border-t border-white/[0.04]">
      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-red font-semibold mb-6">
            The Real Problem
          </p>
          <h2 className="font-display text-[clamp(1.75rem,4vw,3rem)] font-black leading-[1.08] tracking-[-0.03em] text-white max-w-3xl mb-8">
            Most Businesses Don't Have a Lead Problem. They Have an Operating System Problem.
          </h2>
          <p className="text-[1rem] leading-[1.7] text-white/40 max-w-2xl mb-14">
            Business owners are told they need more ads, more leads, more posts, more SEO, more software, more staff. But the real problem is usually deeper.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-4">
          {problems.map((problem, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              className="flex items-start gap-4 border border-white/[0.06] bg-white/[0.02] px-5 py-4"
            >
              <span className="font-mono text-[10px] text-red/60 mt-0.5 shrink-0">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="text-[0.9rem] text-white/60 leading-[1.5]">
                {problem}
              </span>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-14 text-[1.05rem] text-white/70 font-medium max-w-2xl"
        >
          AMTECH fixes the system underneath the growth problem. We build the infrastructure that makes growth manageable.
        </motion.p>
      </div>
    </section>
  );
}
