import { motion } from 'framer-motion';
import { Calculator, Inbox, MessageSquare, Star, Target, Briefcase } from 'lucide-react';

const agents = [
  {
    icon: Calculator,
    title: 'AI Estimator',
    description: 'Helps draft estimates, summarize scope, prepare bid notes, and speed up proposal workflows.',
  },
  {
    icon: Inbox,
    title: 'AI Reception / Intake Assistant',
    description: 'Organizes inbound inquiries, captures required details, and routes next steps.',
  },
  {
    icon: MessageSquare,
    title: 'AI Follow-Up Agent',
    description: 'Sends timely follow-ups by email or SMS after quotes, missed calls, form submissions, or sales conversations.',
  },
  {
    icon: Star,
    title: 'AI Review Assistant',
    description: 'Helps request, track, and organize customer reviews.',
  },
  {
    icon: Target,
    title: 'AI Campaign Operator',
    description: 'Tracks outreach outcomes, surfaces callbacks, and keeps humans focused on high-value follow-up.',
  },
  {
    icon: Briefcase,
    title: 'AI Office Assistant',
    description: 'Helps with admin tasks, job notes, payroll-related workflows, internal summaries, and routine communications.',
  },
];

export default function AIEmployeesWorkSection() {
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
            Category 02
          </span>
          <h2 className="font-display text-[clamp(1.75rem,4vw,2.75rem)] font-black leading-[1.08] tracking-[-0.03em] text-white mb-4">
            AI Employees
          </h2>
          <p className="text-[1rem] leading-[1.7] text-white/40 max-w-2xl">
            Custom agents built around actual business functions. An AI Employee is not a generic chatbot. It is a custom system designed to handle a specific repeatable business function.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
          {agents.map((agent, i) => {
            const Icon = agent.icon;
            return (
              <motion.div
                key={agent.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.07 }}
                className="border border-white/[0.06] bg-white/[0.02] p-5"
              >
                <div className="w-8 h-8 flex items-center justify-center border border-red/30 bg-red/[0.06] mb-4">
                  <Icon size={15} className="text-red" />
                </div>
                <h3 className="font-display text-[0.92rem] font-bold text-white mb-2">
                  {agent.title}
                </h3>
                <p className="text-[0.82rem] leading-[1.6] text-white/40">
                  {agent.description}
                </p>
              </motion.div>
            );
          })}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-[0.95rem] text-white/60 font-medium max-w-2xl"
        >
          The owner stays in control. The AI employee handles repetitive work, organization, and preparation so the business can move faster.
        </motion.p>
      </div>
    </section>
  );
}
