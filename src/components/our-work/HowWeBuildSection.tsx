import { motion } from 'framer-motion';

const steps = [
  {
    number: '01',
    title: 'Understand the Business',
    description: 'We learn how the business actually makes money, communicates, follows up, estimates, delivers, and gets stuck.',
  },
  {
    number: '02',
    title: 'Map the Bottlenecks',
    description: 'We identify where the owner, staff, website, or current software is slowing the business down.',
  },
  {
    number: '03',
    title: 'Build the System',
    description: 'We design the website, dashboard, AI agent, automation, or workflow around the real operating process.',
  },
  {
    number: '04',
    title: 'Train the Operator',
    description: 'We help the owner or team understand how to use the system, what to watch, and how to improve it.',
  },
  {
    number: '05',
    title: 'Iterate',
    description: 'The system gets better as the business uses it. AMTECH stays involved to refine prompts, workflows, automations, and dashboards.',
  },
];

export default function HowWeBuildSection() {
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
            Process
          </p>
          <h2 className="font-display text-[clamp(1.75rem,4vw,2.75rem)] font-black leading-[1.08] tracking-[-0.03em] text-white mb-4">
            How AMTECH Builds
          </h2>
          <p className="text-[1rem] leading-[1.7] text-white/40 max-w-2xl">
            This is high-touch expert service, not self-serve software. We stay with you through the process.
          </p>
        </motion.div>

        <div className="space-y-4">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="border border-white/[0.06] bg-white/[0.02] p-5 flex items-start gap-5"
            >
              <span className="font-mono text-[1.5rem] font-black text-white/[0.07] shrink-0 leading-none mt-0.5">
                {step.number}
              </span>
              <div>
                <h3 className="font-display text-[0.95rem] font-bold text-white mb-1.5">
                  {step.title}
                </h3>
                <p className="text-[0.85rem] leading-[1.6] text-white/40">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
