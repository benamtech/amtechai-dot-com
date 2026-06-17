import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const STATUS_ROWS = [
  { label: 'Called', count: 146, max: 247, booked: false },
  { label: 'No Answer', count: 89, max: 247, booked: false },
  { label: 'Reached', count: 34, max: 247, booked: false },
  { label: 'Interested', count: 12, max: 247, booked: false },
  { label: 'Callback', count: 8, max: 247, booked: false },
  { label: 'Meeting Booked', count: 3, max: 247, booked: true },
];

export default function DashboardPanel() {
  const panelRef = useRef<HTMLDivElement>(null);
  const barRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;

    gsap.fromTo(
      panel,
      { y: 24, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: panel,
          start: 'top 75%',
          once: true,
        },
      }
    );

    barRefs.current.forEach((bar, i) => {
      if (!bar) return;
      const row = STATUS_ROWS[i];
      const targetWidth = `${Math.max(3, Math.round((row.count / row.max) * 100))}%`;
      gsap.fromTo(
        bar,
        { width: '0%' },
        {
          width: targetWidth,
          duration: 1.1,
          ease: 'power2.out',
          delay: i * 0.08,
          scrollTrigger: {
            trigger: panel,
            start: 'top 75%',
            once: true,
          },
        }
      );
    });
  }, []);

  return (
    <div
      ref={panelRef}
      className="bg-white border border-black/20 w-full"
      style={{ opacity: 0 }}
    >
      {/* Panel header */}
      <div className="border-b border-black/10 px-5 py-3 flex items-center justify-between">
        <span className="font-mono text-[0.6rem] uppercase tracking-[0.22em] text-black/40">
          Campaign — Wholesale Lead Qualifier
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 bg-[#E11D2A]" />
          <span className="font-mono text-[0.55rem] uppercase tracking-wider text-[#E11D2A]">Active</span>
        </span>
      </div>

      {/* Status rows */}
      <div className="px-5 py-5 space-y-5">
        {STATUS_ROWS.map((row, i) => (
          <div key={row.label} className="space-y-2">
            <div className="flex items-center justify-between">
              <span className={`font-mono text-[0.65rem] uppercase tracking-[0.12em] ${row.booked ? 'text-[#E11D2A]' : 'text-black/50'}`}>
                {row.label}
              </span>
              <span className={`font-mono text-sm font-bold ${row.booked ? 'text-[#E11D2A]' : 'text-black'}`}>
                {row.count}
              </span>
            </div>
            {/* Bar track */}
            <div className="h-[3px] bg-black/[0.06] border border-black/[0.08] relative overflow-hidden">
              <div
                ref={(el) => { barRefs.current[i] = el; }}
                className={`absolute left-0 top-0 h-full ${row.booked ? 'bg-[#E11D2A]' : 'bg-black/15'}`}
                style={{ width: '0%' }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Martinez row — green left border, Meeting Booked badge green */}
      <div className="border-t border-black/10 border-l-2 border-l-[#16a34a] px-5 py-4">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <span className="font-mono text-[0.7rem] font-semibold text-black">Martinez, R.</span>
          <span className="font-mono text-[0.6rem] uppercase tracking-wider border border-[#16a34a] text-[#16a34a] px-2 py-0.5">
            Meeting Booked
          </span>
          <span className="font-mono text-[0.58rem] text-black/30">2 attempts</span>
          <span className="font-mono text-[0.62rem] font-semibold text-[#16a34a]">Check your calendar.</span>
        </div>
      </div>
    </div>
  );
}
