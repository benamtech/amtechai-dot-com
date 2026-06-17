import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const ITEMS = [
  {
    title: 'AMTECH Campaign Dashboard',
    body: 'Access the platform your campaigns run on. Lead pool, call outcomes, opportunities, booked meetings, and next actions — organized by campaign, not raw call logs.',
  },
  {
    title: 'Wholesale Lead Qualifier Agent',
    body: "An AI voice agent configured for seller acquisition. It calls your list, qualifies interest, collects callback details, and flags appointment opportunities. You don't dial. You review outcomes.",
  },
  {
    title: 'Campaign Setup Support',
    body: "We configure your first campaign with you. List sourcing, agent setup, batch structure. You learn by doing it live, not watching a video.",
  },
  {
    title: 'Calendar Booking Automation',
    body: 'When a call outcome resolves as booked, AMTECH creates a Google Calendar event and invites you automatically. You get an SMS. You show up.',
  },
  {
    title: 'Weekly Operator Sessions',
    body: "Live weekly calls with the cohort. Campaign reviews. Outcome analysis. What's working, what isn't, what's next. You are not figuring this out alone.",
  },
  {
    title: 'The Operator Community',
    body: 'A private group of people running the same system in different markets. Deal structures, list sources, buyer connections, market feedback. The network compounds over time.',
  },
];

export default function MembershipSection() {
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const borderRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    itemRefs.current.forEach((item, i) => {
      if (!item) return;
      const border = borderRefs.current[i];

      gsap.set(item, { opacity: 0, y: 24 });
      if (border) gsap.set(border, { scaleY: 0, transformOrigin: 'top center' });

      ScrollTrigger.create({
        trigger: item,
        start: 'top 82%',
        once: true,
        onEnter: () => {
          gsap.to(item, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'power2.out',
            delay: (i % 2) * 0.12,
          });
          if (border) {
            gsap.to(border, {
              scaleY: 1,
              duration: 0.3,
              ease: 'power2.out',
              delay: (i % 2) * 0.12 + 0.1,
            });
          }
        },
      });
    });
  }, []);

  return (
    <section className="bg-white border-t border-black/10 px-6 py-20 md:py-28">
      <div className="mx-auto max-w-7xl">
        <p className="font-mono text-[0.6rem] uppercase tracking-[0.22em] text-[#E11D2A] mb-5">
          Membership Includes
        </p>
        <h2 className="font-display text-[clamp(1.75rem,3.5vw,3.25rem)] font-black tracking-[-0.03em] text-[#0a0a0a] mb-16 max-w-2xl">
          Everything you need<br />
          to run your first campaign.<br />
          And the people to help<br />
          you do it right.
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
          {ITEMS.map((item, i) => (
            <div
              key={item.title}
              ref={(el) => { itemRefs.current[i] = el; }}
              className="flex gap-5"
              style={{ opacity: 0 }}
            >
              {/* Animated left border */}
              <div className="relative w-px shrink-0 self-stretch bg-black/10">
                <div
                  ref={(el) => { borderRefs.current[i] = el; }}
                  className="absolute inset-0 bg-[#E11D2A]"
                  style={{ scaleY: 0, transformOrigin: 'top center' }}
                />
              </div>

              <div className="py-1">
                <h3 className="font-display text-[0.95rem] font-bold text-[#0a0a0a] mb-2">
                  {item.title}
                </h3>
                <p className="font-body text-[0.875rem] leading-[1.7] text-[#6b7280]">
                  {item.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
