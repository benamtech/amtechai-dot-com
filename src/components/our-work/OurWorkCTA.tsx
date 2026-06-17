import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function OurWorkCTA() {
  return (
    <section className="bg-black-rich py-24 md:py-32 border-t border-white/[0.04]">
      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center max-w-2xl mx-auto"
        >
          <h2 className="font-display text-[clamp(1.75rem,4vw,2.75rem)] font-black leading-[1.08] tracking-[-0.03em] text-white mb-6">
            What Should AMTECH Build for Your Business?
          </h2>
          <p className="text-[1rem] leading-[1.7] text-white/45 mb-10">
            Whether you need a serious website, a local authority system, an AI employee, an automation workflow, or a full operator system, the first step is understanding where your business is stuck.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-5 mb-8">
            <Link
              to="/schedule-demo"
              className="inline-flex items-center gap-3 bg-red px-10 py-5 text-[15px] font-semibold text-white transition-all duration-300 hover:bg-red-bright hover:shadow-red-glow active:scale-[0.98]"
            >
              Book a Strategy Call
              <ArrowRight size={16} />
            </Link>
            <Link
              to="/wholesale"
              className="inline-flex items-center gap-2 text-[15px] font-medium text-white/40 border-b border-white/20 pb-0.5 transition-colors duration-300 hover:text-white hover:border-white/50"
            >
              See Current Programs
              <ArrowRight size={14} />
            </Link>
          </div>

          <a
            href="tel:+18058869173"
            className="font-mono text-[0.75rem] text-white/25 border-b border-white/10 pb-0.5 transition-colors hover:text-white/40 hover:border-white/20"
          >
            Or call — (805) 886-9173
          </a>
        </motion.div>
      </div>
    </section>
  );
}
