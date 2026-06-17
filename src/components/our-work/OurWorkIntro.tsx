import { motion } from 'framer-motion';

const layers = [
  'Clear websites',
  'Searchable service authority',
  'Automated follow-up',
  'Review generation',
  'AI-assisted admin work',
  'Dashboards',
  'Campaign workflows',
  'Custom tools around real procedures',
];

export default function OurWorkIntro() {
  return (
    <section className="bg-black-rich py-24 md:py-32 border-t border-white/[0.04]">
      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl"
        >
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-red font-semibold mb-6">
            What We Do
          </p>
          <h2 className="font-display text-[clamp(1.75rem,4vw,2.75rem)] font-black leading-[1.08] tracking-[-0.03em] text-white mb-8">
            We Build the Layer Between Your Business and the Chaos
          </h2>
          <p className="text-[1rem] leading-[1.7] text-white/45 mb-10">
            Most businesses do not fail because they lack effort. They struggle because the work is scattered across texts, emails, spreadsheets, calls, sticky notes, outdated websites, and owner memory.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12"
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/30 mb-5">
            AMTECH turns that chaos into structure
          </p>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-3">
            {layers.map((layer, i) => (
              <div
                key={layer}
                className="border border-white/[0.06] bg-white/[0.02] px-4 py-3 flex items-center gap-2"
              >
                <span className="w-1 h-1 bg-red/50 shrink-0" />
                <span className="text-[0.82rem] text-white/55">{layer}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.blockquote
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="border-l-2 border-red/40 pl-6 max-w-2xl"
        >
          <p className="text-[1.05rem] leading-[1.7] text-white/60 italic">
            Our work is not about adding random software. It is about building the operating layer your business should have had years ago.
          </p>
        </motion.blockquote>
      </div>
    </section>
  );
}
