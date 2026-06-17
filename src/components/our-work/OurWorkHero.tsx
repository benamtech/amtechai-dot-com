import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const systemCards = [
  'Website',
  'Reviews',
  'SEO / Entity Authority',
  'AI Estimator',
  'AI Follow-Up',
  'Campaign Dashboard',
  'Calendar Automation',
  'Owner Dashboard',
];

export default function OurWorkHero() {
  return (
    <section className="relative min-h-[85vh] flex items-center bg-black pt-32 pb-24 md:pt-40 md:pb-32 overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern bg-grid-md opacity-[0.04]" />

      <div className="container-wide relative z-10">
        <div className="grid lg:grid-cols-[1fr,380px] gap-16 items-center">
          <div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="font-mono text-[11px] uppercase tracking-[0.25em] text-red font-semibold mb-8"
            >
              Our Work
            </motion.p>

            <motion.h1
              initial={{ y: 28, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="font-display text-[clamp(2.25rem,5.5vw,4rem)] font-black leading-[1.05] tracking-[-0.04em] text-white mb-8"
            >
              Systems We Build for{' '}
              <span className="text-red">Serious Operators</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-[1.05rem] leading-[1.7] text-white/50 max-w-[540px] mb-12"
            >
              AMTECH builds the digital foundation, automation workflows, AI agents, and custom operating systems that help ambitious business owners modernize, organize, and scale.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="flex flex-col sm:flex-row items-start gap-5"
            >
              <Link
                to="/schedule-demo"
                className="inline-flex items-center gap-3 bg-red px-8 py-4 text-[15px] font-semibold text-white transition-all duration-300 hover:bg-red-bright hover:shadow-red-glow active:scale-[0.98]"
              >
                Book a Strategy Call
                <ArrowRight size={16} />
              </Link>
              <a
                href="#digital-foundation"
                className="inline-flex items-center gap-2 text-[15px] font-medium text-white/40 border-b border-white/20 pb-0.5 transition-colors duration-300 hover:text-white hover:border-white/50"
              >
                Explore Our Systems
                <ArrowRight size={14} />
              </a>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="hidden lg:block"
          >
            <div className="border border-white/[0.08] bg-white/[0.02] p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 bg-red rounded-full animate-pulse-red" />
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
                  System Map
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {systemCards.map((label, i) => (
                  <motion.div
                    key={label}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.6 + i * 0.06 }}
                    className="border border-white/[0.06] bg-white/[0.02] px-3 py-2.5 text-center"
                  >
                    <span className="font-mono text-[10px] text-white/50">{label}</span>
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
