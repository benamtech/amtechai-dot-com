import { motion } from 'framer-motion';
import { Globe, Search, Bot, Megaphone, Layers } from 'lucide-react';

const systems = [
  {
    icon: Globe,
    title: 'Websites That Become Business Infrastructure',
    description: 'Not brochure sites. Websites designed to explain, rank, convert, and support automation.',
    capabilities: [
      'Modern website development',
      'Service-area pages',
      'Conversion-focused copy',
      'Review integration',
      'Local authority structure',
      'AI/search visibility',
    ],
  },
  {
    icon: Search,
    title: 'Local Authority + Entity SEO Systems',
    description: 'For businesses that need to own their local category. Become the clearest, most trusted entity in the market.',
    capabilities: [
      'Deep service/entity content',
      'Knowledge graph strategy',
      'Review-generation funnels',
      'Google Business Profile support',
      'Local content systems',
      'Reputation and trust-building',
    ],
  },
  {
    icon: Bot,
    title: 'AI Agents for Operations',
    description: 'Custom agents trained around your real business processes. Not generic chatbots.',
    capabilities: [
      'Estimate drafting',
      'Bid follow-up',
      'Inbound lead response',
      'Email/SMS management',
      'Customer intake',
      'Scheduling support',
    ],
  },
  {
    icon: Megaphone,
    title: 'Campaign + Outreach Systems',
    description: 'AI-assisted business development systems that organize outreach, track outcomes, and surface follow-up.',
    capabilities: [
      'Outreach campaign management',
      'Outcome tracking',
      'Follow-up surfacing',
      'Team coordination',
      'Calendar automation',
      'SMS/email alerts',
    ],
  },
  {
    icon: Layers,
    title: 'Industry-Specific Operator Programs',
    description: 'Packaged software, workflows, and guidance for specific industries.',
    capabilities: [
      'AI Wholesale Real Estate Launch Lab',
      'Contractor AI Operator Program',
      'Local Authority Growth System',
      'Review + Reputation Engine',
      'AI Office Manager setup',
    ],
  },
];

export default function WhatWeBuildSection() {
  return (
    <section className="bg-black py-24 md:py-32 border-t border-white/[0.04]">
      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-16"
        >
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-red font-semibold mb-6">
            What We Build
          </p>
          <h2 className="font-display text-[clamp(1.75rem,4vw,3rem)] font-black leading-[1.08] tracking-[-0.03em] text-white max-w-3xl">
            Custom AI Systems Around the Work Your Business Actually Does
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {systems.map((system, i) => {
            const Icon = system.icon;
            return (
              <motion.div
                key={system.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className={`border border-white/[0.06] bg-white/[0.02] p-6 flex flex-col ${
                  i >= 3 ? 'lg:col-span-1' : ''
                }`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 flex items-center justify-center border border-red/30 bg-red/[0.06]">
                    <Icon size={16} className="text-red" />
                  </div>
                  <h3 className="font-display text-[0.95rem] font-bold text-white leading-tight">
                    {system.title}
                  </h3>
                </div>
                <p className="text-[0.85rem] leading-[1.6] text-white/40 mb-5">
                  {system.description}
                </p>
                <ul className="mt-auto space-y-2">
                  {system.capabilities.map((cap) => (
                    <li
                      key={cap}
                      className="flex items-center gap-2 text-[0.8rem] text-white/50"
                    >
                      <span className="w-1 h-1 bg-red/60 shrink-0" />
                      {cap}
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
