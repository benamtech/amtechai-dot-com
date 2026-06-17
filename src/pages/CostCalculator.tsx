import { useState } from 'react';
import OutboundCalculator from '../components/cost-calculator/OutboundCalculator';

type Section = 'outbound' | 'employee' | 'chatbot';

const sections: { id: Section; label: string; subtitle: string }[] = [
  { id: 'outbound', label: 'AI Outbound Sales', subtitle: 'Voice agent campaign estimator' },
  { id: 'employee', label: 'AI Employee', subtitle: 'Autonomous workforce agent' },
  { id: 'chatbot', label: 'Custom Chatbot', subtitle: 'Embedded lead capture & estimation' },
];

export default function CostCalculator() {
  const [active, setActive] = useState<Section>('outbound');

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-mono">
      <div className="max-w-[820px] mx-auto px-4 sm:px-8 pt-24 sm:pt-32 pb-20 sm:pb-24">

        <div className="mb-8">
          <h1 className="font-display text-[32px] sm:text-[48px] font-bold leading-none tracking-tight text-red">
            Cost Calculator
          </h1>
          <div className="h-0.5 bg-red w-full mt-4" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-8">
          {sections.map(({ id, label, subtitle }) => (
            <button
              key={id}
              onClick={() => setActive(id)}
              className={`text-left px-5 py-4 rounded-xl transition-all duration-300 ${
                active === id
                  ? 'glass-bright'
                  : 'glass hover:border-black/[0.12]'
              }`}
              style={active === id ? { borderColor: 'rgba(225, 29, 42, 0.3)' } : {}}
            >
              <div className={`text-[9px] tracking-[0.18em] uppercase font-medium mb-1.5 ${active === id ? 'text-red' : 'text-black/30'}`}>
                {active === id ? '-- Active' : id === 'outbound' ? 'Select' : 'Coming Soon'}
              </div>
              <div className={`text-[13px] font-medium tracking-[0.04em] leading-tight ${active === id ? 'text-black' : 'text-black/40'}`}>
                {label}
              </div>
              <div className="text-[10px] text-black/25 tracking-[0.05em] mt-1">{subtitle}</div>
            </button>
          ))}
        </div>

        {active === 'outbound' && <OutboundCalculator />}

        {(active === 'employee' || active === 'chatbot') && (
          <ComingSoon section={sections.find(s => s.id === active)!} />
        )}

        <div className="mt-12 pt-8 border-t border-black/[0.06] flex justify-end">
          <a
            href="/pay"
            className="btn-primary !px-8 !py-3 !text-xs"
          >
            Pay Now
          </a>
        </div>
      </div>
    </div>
  );
}

function ComingSoon({ section }: { section: { label: string; subtitle: string } }) {
  return (
    <div className="glass-card px-6 sm:px-10 py-14 sm:py-20 flex flex-col items-center text-center">
      <div className="mono-label text-black/25 mb-6">Not Yet Available</div>
      <div className="font-display text-[36px] sm:text-[56px] leading-none tracking-[0.03em] text-black/10 mb-3">
        COMING SOON
      </div>
      <div className="h-px w-16 bg-red mb-6" />
      <div className="text-[13px] text-black/50 font-mono tracking-[0.06em] max-w-sm leading-[1.8]">
        The <span className="text-black/70 font-medium">{section.label}</span> pricing calculator is currently in development.
        Check back soon or{' '}
        <a href="/schedule-demo" className="text-red hover:text-red-bright transition-colors">reach out directly</a>{' '}
        for a custom estimate.
      </div>
    </div>
  );
}
