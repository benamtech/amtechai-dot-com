import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const paths = [
  {
    title: 'Build My Digital Foundation',
    description: 'Website, local SEO, reviews, and authority for businesses starting from scratch or starting over.',
    cta: 'Build My Foundation',
    to: '/schedule-demo',
  },
  {
    title: 'Install AI Employees',
    description: 'Automate operations, follow-up, estimating, admin, or communication with custom AI agents.',
    cta: 'Design My AI System',
    to: '/schedule-demo',
  },
  {
    title: 'Join an Operator Program',
    description: 'Industry-specific systems like AI-assisted wholesale acquisition or contractor growth programs.',
    cta: 'See Operator Programs',
    to: '/how-it-works',
  },
];

export default function OfferPathsSection() {
  return (
    <section className="bg-black py-24 md:py-32 border-t border-white/[0.04]">
      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-red font-semibold mb-6">
            Get Started
          </p>
          <h2 className="font-display text-[clamp(1.75rem,4vw,3rem)] font-black leading-[1.08] tracking-[-0.03em] text-white max-w-3xl mx-auto">
            Start With the Layer Your Business Needs Most
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-5 mb-14">
          {paths.map((path, i) => (
            <motion.div
              key={path.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="border border-white/[0.06] bg-white/[0.02] p-6 flex flex-col group hover:border-red/20 transition-colors duration-300"
            >
              <h3 className="font-display text-[1.05rem] font-bold text-white mb-3">
                {path.title}
              </h3>
              <p className="text-[0.85rem] leading-[1.6] text-white/40 mb-6 flex-1">
                {path.description}
              </p>
              <Link
                to={path.to}
                className="inline-flex items-center gap-2 text-[0.85rem] font-semibold text-red transition-colors hover:text-red-bright"
              >
                {path.cta}
                <ArrowRight size={14} />
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center"
        >
          <p className="text-[0.95rem] text-white/40 mb-6">
            Not sure where to start? Talk to us directly.
          </p>
          <Link
            to="/schedule-demo"
            className="inline-flex items-center gap-3 bg-red px-10 py-5 text-[15px] font-semibold text-white transition-all duration-300 hover:bg-red-bright hover:shadow-red-glow active:scale-[0.98]"
          >
            Book a Strategy Call
            <ArrowRight size={16} />
          </Link>
          <div className="mt-6">
            <a
              href="tel:+18058869173"
              className="font-mono text-[0.75rem] text-white/30 border-b border-white/10 pb-0.5 transition-colors hover:text-white/50 hover:border-white/30"
            >
              Or call — (805) 886-9173
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
