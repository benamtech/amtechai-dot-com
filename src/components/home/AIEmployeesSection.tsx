import { motion } from 'framer-motion';

const functions = [
  'Answering and organizing inquiries',
  'Drafting estimates',
  'Following up with prospects',
  'Requesting reviews',
  'Managing campaign outcomes',
  'Summarizing calls',
  'Preparing owner decisions',
  'Updating dashboards',
  'Creating calendar events',
  'Sending alerts',
  'Helping staff move faster',
];

export default function AIEmployeesSection() {
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
              AI Employees
            </p>
            <h2 className="font-display text-[clamp(1.75rem,4vw,2.75rem)] font-black leading-[1.08] tracking-[-0.03em] text-white mb-8">
              What We Mean by AI Employees
            </h2>
            <div className="space-y-5 text-[0.95rem] leading-[1.7] text-white/50">
              <p>
                An AI Employee is not a chatbot slapped onto your website. An AI Employee is a custom system designed to handle a real business function.
              </p>
              <p>
                The business owner stays in control. AMTECH handles the technical design, implementation, training, and iteration.
              </p>
              <p className="text-white/70 font-medium">
                You do not need to become a software company. You need one on your side.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="border border-white/[0.06] bg-white/[0.02] p-6"
          >
            <div className="flex items-center gap-2 mb-5">
              <div className="w-2 h-2 bg-red rounded-full" />
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
                Functions an AI Employee Can Handle
              </span>
            </div>
            <div className="space-y-2">
              {functions.map((fn, i) => (
                <motion.div
                  key={fn}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 0.3 + i * 0.04 }}
                  className="flex items-center gap-3 px-4 py-2.5 border border-white/[0.04] bg-white/[0.01]"
                >
                  <span className="w-1 h-1 bg-emerald-400/70 shrink-0" />
                  <span className="text-[0.82rem] text-white/55">{fn}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
