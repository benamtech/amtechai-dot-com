import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import AnimatedSection from '../ui/AnimatedSection';

const systems = [
  {
    name: 'AI Inbound + Secretary Configuration',
    audience: 'Contractors, owner-operators',
    description: 'For businesses that need every call answered, appointments booked, and someone keeping the owner on track.',
    pricing: '$679/month.',
  },
  {
    name: 'AI Outbound Sales',
    audience: 'Wholesalers, real estate, appointment-driven businesses',
    description: 'The system works your list around the clock — qualifying, setting appointments, handing off warm leads.',
    pricing: 'Priced based on list size and campaign scope.',
  },
  {
    name: 'AI Lead Generation',
    audience: 'Campaign-driven businesses',
    description: 'Agents running continuously across platforms to surface qualified leads. Flexible per-lead or per-capture pricing.',
    pricing: 'Structured after understanding your market.',
  },
  {
    name: 'Full Operations Build',
    audience: 'Businesses removing every bottleneck',
    description: 'All of the above, integrated into a single system with a unified dashboard.',
    pricing: 'Scoped individually. 2-3 weeks typical.',
  },
];

export default function PricingReferencePoints() {
  return (
    <section className="bg-white py-28">
      <div className="container-wide">
        <AnimatedSection>
          <p className="mono-label mb-4 text-black/25">Reference Points</p>
          <h2 className="mb-4 max-w-2xl font-display text-display-lg text-black">
            To Give You a Sense of the Range:
          </h2>
        </AnimatedSection>

        <AnimatedSection delay={0.05}>
          <div className="mt-8 mb-10">
            <Link
              to="/cost-calculator"
              className="glass-pill inline-flex items-center gap-3 px-6 py-3 transition-all duration-300 hover:bg-black/[0.04]"
            >
              <span className="font-mono text-[11px] tracking-[0.06em] text-black/40">Running outbound campaigns?</span>
              <span className="inline-flex items-center gap-1.5 font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-red">
                Estimate your cost
                <ArrowRight size={11} />
              </span>
            </Link>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {systems.map((system, i) => (
            <AnimatedSection key={system.name} delay={0.08 * i}>
              <div className="glass-card h-full p-8 md:p-10">
                <p className="mono-label mb-3 text-black/25">{system.audience}</p>
                <h3 className="mb-4 font-display text-xl text-black">{system.name}</h3>
                <p className="mb-6 font-body text-body-sm leading-relaxed text-black/50">
                  {system.description}
                </p>
                <p className="font-mono text-sm font-bold text-black/80">{system.pricing}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
