import { motion } from 'framer-motion';
import { Globe, MapPin, Search, Star, Pen } from 'lucide-react';

const features = [
  {
    icon: Globe,
    title: 'Website Development',
    description: 'Modern, fast, mobile-first websites built around the services people actually buy.',
  },
  {
    icon: MapPin,
    title: 'Service + Location Architecture',
    description: 'Clear service pages and service-area pages designed to make the business understandable by customers, Google, and AI search systems.',
  },
  {
    icon: Search,
    title: 'Entity SEO + Knowledge Graph Work',
    description: 'Deep local authority work that connects services, locations, reviews, business facts, and topical expertise into a stronger online presence.',
  },
  {
    icon: Star,
    title: 'Review Generation Funnels',
    description: 'Systems that help businesses consistently request, organize, and leverage customer reviews.',
  },
  {
    icon: Pen,
    title: 'Conversion-Focused Copy',
    description: 'Copy written to explain the business clearly, build trust, and turn visitors into real inquiries.',
  },
];

export default function DigitalFoundationSection() {
  return (
    <section id="digital-foundation" className="bg-black py-24 md:py-32 border-t border-white/[0.04]">
      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-14"
        >
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-red/70 mb-3 block">
            Category 01
          </span>
          <h2 className="font-display text-[clamp(1.75rem,4vw,2.75rem)] font-black leading-[1.08] tracking-[-0.03em] text-white mb-4">
            Digital Foundation
          </h2>
          <p className="text-[1rem] leading-[1.7] text-white/40 max-w-2xl">
            Websites, authority, reviews, and trust infrastructure. For many businesses, this first layer is still the most important: a serious website, clear service pages, strong local relevance, reviews, and a structure that helps both humans and search engines understand the business.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mb-14">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
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
                  {feature.title}
                </h3>
                <p className="text-[0.82rem] leading-[1.6] text-white/40">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="border border-white/[0.08] bg-white/[0.02] p-6 max-w-2xl"
        >
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/30 mb-3 block">
            Example Use Case
          </span>
          <h4 className="font-display text-[1rem] font-bold text-white mb-3">
            Local Service Authority System
          </h4>
          <p className="text-[0.87rem] leading-[1.65] text-white/45">
            A pooper scooper company can become the clearest and most trusted local option by combining service-area content, entity SEO, review generation, and structured service information. The result is not just a better website — it is a stronger local authority footprint.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
