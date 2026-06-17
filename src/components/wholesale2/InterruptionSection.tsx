import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const NUMBERS = ['+1 (602) 448-3271', '+1 (480) 917-8844', '+1 (623) 554-0019'];
const CTA_HREF = 'mailto:ben@amtechai.com?subject=Wholesale Beta Application';

// Waveform SVG points generator
function flatPoints(width: number, cy: number): string {
  const pts: string[] = [];
  for (let x = 0; x <= width; x += 8) pts.push(`${x},${cy}`);
  return pts.join(' ');
}

function ringPoints(width: number, cy: number, t: number, intensity: number): string {
  const pts: string[] = [];
  for (let x = 0; x <= width; x += 4) {
    const dist = Math.abs(x - width / 2);
    const wave = Math.sin((x * 0.06) + t * 8) * intensity * Math.exp(-dist * 0.008);
    pts.push(`${x},${cy + wave}`);
  }
  return pts.join(' ');
}

export default function InterruptionSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const waveRef = useRef<SVGPolylineElement>(null);
  const hasPlayed = useRef(false);

  // number rows
  const numRefs = useRef<(HTMLDivElement | null)[]>([]);
  const statusRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  const conclusionRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLSpanElement>(null);
  const connectedRef = useRef<HTMLParagraphElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const WAVE_W = 320;
    const WAVE_CY = 20;

    function animateWave(onDone: () => void) {
      const wave = waveRef.current;
      if (!wave) { onDone(); return; }
      const waveEl = wave;

      let t = 0;
      let intensity = 0;
      let phase: 'ramp' | 'ring' | 'collapse' = 'ramp';
      let elapsed = 0;
      const RING_DURATION = 1400; // ms
      const RAMP_DURATION = 300;
      const COLLAPSE_DURATION = 400;
      let last = performance.now();

      function tick(now: number) {
        const dt = now - last;
        last = now;
        elapsed += dt;
        t += dt / 1000;

        if (phase === 'ramp') {
          intensity = Math.min(12, (elapsed / RAMP_DURATION) * 12);
          waveEl.setAttribute('points', ringPoints(WAVE_W, WAVE_CY, t, intensity));
          if (elapsed >= RAMP_DURATION) { phase = 'ring'; elapsed = 0; }
          requestAnimationFrame(tick);
        } else if (phase === 'ring') {
          waveEl.setAttribute('points', ringPoints(WAVE_W, WAVE_CY, t, 12));
          if (elapsed >= RING_DURATION) { phase = 'collapse'; elapsed = 0; }
          requestAnimationFrame(tick);
        } else if (phase === 'collapse') {
          intensity = Math.max(0, 12 - (elapsed / COLLAPSE_DURATION) * 12);
          waveEl.setAttribute('points', ringPoints(WAVE_W, WAVE_CY, t, intensity));
          if (elapsed >= COLLAPSE_DURATION) {
            waveEl.setAttribute('points', flatPoints(WAVE_W, WAVE_CY));
            onDone();
            return;
          }
          requestAnimationFrame(tick);
        }
      }
      waveEl.setAttribute('points', flatPoints(WAVE_W, WAVE_CY));
      requestAnimationFrame(tick);
    }

    function playSequence() {
      if (hasPlayed.current) return;
      hasPlayed.current = true;

      const tl = gsap.timeline();
      const numEls = numRefs.current;
      const statEls = statusRefs.current;

      // Hide everything initially
      gsap.set([numEls[0], numEls[1], numEls[2]], { opacity: 0, y: 10 });
      gsap.set([statEls[0], statEls[1], statEls[2]], { opacity: 0 });
      gsap.set(conclusionRef.current, { opacity: 0 });
      gsap.set(connectedRef.current, { opacity: 0 });
      gsap.set(summaryRef.current, { opacity: 0 });
      gsap.set(ctaRef.current, { opacity: 0, y: 10 });

      // Number 1 appears
      tl.to(numEls[0], { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' })
        .to(statEls[0], { opacity: 1, duration: 0.3 }, '+=0.2')
        // Wave plays (we trigger it as a callback, delay accounts for wave duration ~2.1s)
        .call(() => animateWave(() => {}), [], '+=0.3')
        .to({}, { duration: 2.1 }) // wait for wave
        // No answer
        .call(() => {
          if (statEls[0]) statEls[0].textContent = 'No answer.';
        })
        .to(numEls[0], { opacity: 0.25, duration: 0.5 }, '+=0.2')

        // Number 2 appears faster
        .to(numEls[1], { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' }, '+=0.3')
        .to(statEls[1], { opacity: 1, duration: 0.2 }, '+=0.1')
        .to({}, { duration: 1.2 })
        .call(() => { if (statEls[1]) statEls[1].textContent = 'No answer.'; })
        .to(numEls[1], { opacity: 0.25, duration: 0.4 }, '+=0.2')

        // Number 3 fastest
        .to(numEls[2], { opacity: 1, y: 0, duration: 0.25, ease: 'power2.out' }, '+=0.2')
        .to(statEls[2], { opacity: 1, duration: 0.2 }, '+=0.1')
        .to({}, { duration: 0.9 })
        .call(() => { if (statEls[2]) statEls[2].textContent = 'No answer.'; })
        .to(numEls[2], { opacity: 0.25, duration: 0.3 }, '+=0.15')

        // Pause: all 3 visible and faded
        .to({}, { duration: 0.8 })

        // Clear numbers 1 and 3, highlight number 2 with glow
        .to([numEls[0], numEls[2]], { opacity: 0, duration: 0.4 }, '+=0.2')
        .to([statEls[0], statEls[2]], { opacity: 0, duration: 0.4 }, '<')
        .to(numEls[1], { opacity: 1, duration: 0.5 }, '+=0.1')
        .call(() => {
          if (glowRef.current) {
            gsap.to(glowRef.current, {
              textShadow: '0 0 30px rgba(126,184,247,0.9), 0 0 60px rgba(126,184,247,0.4)',
              color: '#7eb8f7',
              duration: 0.6,
            });
          }
          if (statEls[1]) statEls[1].textContent = 'Attempting contact...';
          gsap.to(statEls[1], { opacity: 1, duration: 0.4 });
        })
        .to({}, { duration: 0.8 })
        .call(() => {
          if (statEls[1]) statEls[1].textContent = 'Connected. Qualifying now.';
        })
        .to(connectedRef.current, { opacity: 1, duration: 0.5 }, '+=0.3')

        // Summary text appears line by line
        .to({}, { duration: 0.6 })
        .to(summaryRef.current, { opacity: 1, duration: 0.6 }, '+=0.3')

        // CTA
        .to(ctaRef.current, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '+=0.4');
    }

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: 'top 70%',
      once: true,
      onEnter: playSequence,
    });

    return () => {
      trigger.kill();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-black overflow-hidden"
      style={{ minHeight: '100vh' }}
    >
      <div className="flex flex-col items-center justify-center min-h-screen px-6 py-20 text-center">

        {/* Number rows */}
        <div className="space-y-8 mb-12 w-full max-w-lg">
          {NUMBERS.map((num, i) => (
            <div key={num} className="space-y-2">
              <div
                ref={(el) => { numRefs.current[i] = el; }}
                className="font-mono text-3xl sm:text-4xl font-bold text-white tracking-wider"
                style={{ opacity: 0 }}
              >
                {i === 1 ? (
                  <>
                    <span ref={glowRef}>{num}</span>
                  </>
                ) : num}
              </div>
              <p
                ref={(el) => { statusRefs.current[i] = el; }}
                className="font-mono text-sm text-[#6b7280] tracking-widest uppercase"
                style={{ opacity: 0 }}
              >
                Attempting contact...
              </p>
              {i === 0 && (
                <div className="flex justify-center mt-3">
                  <svg width="320" height="40" className="overflow-visible">
                    <polyline
                      ref={waveRef}
                      points="0,20 320,20"
                      fill="none"
                      stroke="#E11D2A"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      opacity="0.7"
                    />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Connected state */}
        <div ref={conclusionRef} className="mb-12" style={{ opacity: 0 }}>
          <p
            ref={connectedRef}
            className="font-mono text-base text-[#7eb8f7] tracking-widest uppercase"
            style={{ opacity: 0 }}
          />
        </div>

        {/* Summary copy */}
        <div
          ref={summaryRef}
          className="max-w-xl mx-auto space-y-1 mb-14"
          style={{ opacity: 0 }}
        >
          {[
            'This is what 400 dials looks like.',
            'Most are silence.',
            'Three become conversations.',
            'One books a meeting.',
            '',
            'AMTECH automates the silence.',
            'You handle the one that matters.',
          ].map((line, i) =>
            line === '' ? (
              <div key={i} className="h-5" />
            ) : (
              <p
                key={i}
                className={`font-display text-xl sm:text-2xl leading-snug ${
                  i >= 5 ? 'text-[#E11D2A] font-bold' : 'text-white font-medium'
                }`}
              >
                {line}
              </p>
            )
          )}
        </div>

        {/* CTA */}
        <a
          ref={ctaRef}
          href={CTA_HREF}
          className="inline-flex items-center gap-2 bg-[#E11D2A] px-8 py-4 font-mono text-xs uppercase tracking-[0.18em] text-white transition-all duration-200 hover:bg-[#FF1A2B]"
          style={{ opacity: 0 }}
          onClick={() => {
            if (typeof window !== 'undefined' && window.gtag) {
              window.gtag('event', 'cta_click', { page: 'wholesale-2', section: 'interruption' });
            }
          }}
        >
          Apply for Beta Access
          <ArrowRight size={13} />
        </a>
      </div>

      {/* Decorative top rule */}
      <div className="absolute top-0 left-0 right-0 h-px bg-[#E11D2A]" />
    </section>
  );
}
