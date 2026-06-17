import { motion } from 'framer-motion';

const automations = [
  {
    title: 'Forms to CRM / Dashboard',
    description: 'Capture information once and send it where it needs to go.',
  },
  {
    title: 'Missed Call / Inquiry Follow-Up',
    description: 'Automatically trigger email or SMS follow-up when someone reaches out.',
  },
  {
    title: 'Review Request Systems',
    description: 'Send review requests at the right time after work is completed.',
  },
  {
    title: 'Calendar Automation',
    description: 'Create events, send alerts, and keep appointments visible.',
  },
  {
    title: 'Internal Dashboards',
    description: 'Show the owner what needs attention instead of hiding everything in inboxes and spreadsheets.',
  },
  {
    title: 'SMS / Email Workflows',
    description: 'Structured customer communication without relying on memory.',
  },
];

export default function AutomationSection() {
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
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-red/70 mb-3 block">
            Category 03
          </span>
          <h2 className="font-display text-[clamp(1.75rem,4vw,2.75rem)] font-black leading-[1.08] tracking-[-0.03em] text-white mb-4">
            Business Automation
          </h2>
          <p className="text-[1rem] leading-[1.7] text-white/40 max-w-2xl">
            Connecting the tools your business already depends on. A lot of business growth is blocked by simple operational friction — leads come in but do not get followed up, estimates sit unfinished, staff need manual reminders, owners repeat the same admin tasks every week.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {automations.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              className="border border-white/[0.06] bg-white/[0.02] p-5 group hover:border-white/[0.12] transition-colors duration-300"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="w-1.5 h-1.5 bg-red/60 shrink-0" />
                <h3 className="font-display text-[0.92rem] font-bold text-white">
                  {item.title}
                </h3>
              </div>
              <p className="text-[0.82rem] leading-[1.6] text-white/40 pl-[18px]">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
