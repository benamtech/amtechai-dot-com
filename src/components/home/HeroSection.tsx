import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const systemLabels = [
  'Website / Local Authority',
  'Reviews / Reputation',
  'AI Estimator',
  'AI Reception / Follow-Up',
  'Campaign Dashboard',
  'Calendar / SMS Alerts',
  'Owner Dashboard',
];

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center bg-black pt-32 pb-24 md:pt-40 md:pb-32 overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern bg-grid-md opacity-[0.04]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-glow-red-soft rounded-full pointer-events-none" />

      <div className="container-wide relative z-10">
        <div className="grid lg:grid-cols-[1fr,420px] gap-16 items-center">
          <div>


            <h1 className="font-display text-[clamp(2.5rem,6vw,4.5rem)] font-black leading-[1.02] tracking-[-0.04em] text-white mb-8">
              <motion.span
                className="block"
                initial={{ y: 28, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              >
                The Operating System
              </motion.span>
              <motion.span
                className="block"
                initial={{ y: 28, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
              >
                for Businesses Ready to
              </motion.span>
              <motion.span
                className="block text-red"
                initial={{ y: 28, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                Dominate Their Market.
              </motion.span>
            </h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="text-[1.05rem] leading-[1.7] text-white/50 max-w-[540px] mb-12"
            >
              AMTECH builds custom AI-powered business systems for serious operators — from websites and local authority campaigns to AI agents that handle follow-up, estimating, outreach, reviews, admin work, and industry-specific workflows.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.0 }}
              className="flex flex-col sm:flex-row items-start gap-5"
            >
              <Link
                to="/schedule-demo"
                className="inline-flex items-center gap-3 bg-red px-8 py-4 text-[15px] font-semibold text-white transition-all duration-300 hover:bg-red-bright hover:shadow-red-glow active:scale-[0.98]"
              >
                Book a Strategy Call
                <ArrowRight size={16} />
              </Link>
              <Link
                to="/our-work"
                className="inline-flex items-center gap-2 text-[15px] font-medium text-white/40 border-b border-white/20 pb-0.5 transition-colors duration-300 hover:text-white hover:border-white/50"
              >
                See What We Build
                <ArrowRight size={14} />
              </Link>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="hidden lg:block"
          >
            <div className="border border-white/[0.08] bg-white/[0.02] p-6 space-y-3">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 bg-red rounded-full animate-pulse-red" />
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
                  Systems Active
                </span>
              </div>
              {systemLabels.map((label, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.9 + i * 0.08 }}
                  className="flex items-center justify-between border border-white/[0.06] bg-white/[0.02] px-4 py-3"
                >
                  <span className="font-mono text-[11px] text-white/60">{label}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400/80" />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
