import { useEffect, useRef, useState } from 'react';

const FEED_LINES = [
  { text: 'Campaign started — 247 leads queued', type: 'info' },
  { text: 'AI calling...', type: 'info' },
  { text: 'No answer — Martinez, R.', type: 'muted' },
  { text: 'No answer — Chen Holdings', type: 'muted' },
  { text: 'Connected — Okafor Property', type: 'info' },
  { text: 'Qualifying...', type: 'info' },
  { text: 'MEETING BOOKED — Okafor Property', type: 'booked' },
  { text: 'Tomorrow 2:00 PM', type: 'booked-sub' },
];

function timestamp() {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
}

interface FeedEntry {
  id: number;
  ts: string;
  text: string;
  type: string;
}

export default function ActivityFeedPanel({ className = '' }: { className?: string }) {
  const [entries, setEntries] = useState<FeedEntry[]>([]);
  const [showSms, setShowSms] = useState(false);
  const idRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;

    function runCycle() {
      if (!isMounted.current) return;
      setEntries([]);
      setShowSms(false);

      const delays = [300, 800, 1600, 2400, 3400, 4200, 5400, 6000];

      FEED_LINES.forEach((line, i) => {
        timerRef.current = setTimeout(() => {
          if (!isMounted.current) return;
          const entry: FeedEntry = {
            id: idRef.current++,
            ts: timestamp(),
            text: line.text,
            type: line.type,
          };
          setEntries((prev) => [...prev, entry]);
        }, delays[i]);
      });

      // SMS pulse 2s after booked line
      timerRef.current = setTimeout(() => {
        if (!isMounted.current) return;
        setShowSms(true);
      }, 8000);

      // Loop every 16s
      timerRef.current = setTimeout(() => {
        if (!isMounted.current) return;
        runCycle();
      }, 16000);
    }

    runCycle();

    return () => {
      isMounted.current = false;
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <div
      className={`bg-[#0d0d0d] border border-white/[0.07] flex flex-col ${className}`}
      style={{ minHeight: 320 }}
    >
      {/* Panel top bar */}
      <div className="border-b border-white/[0.06] px-4 py-2.5 flex items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full bg-[#E11D2A] animate-pulse" />
        <span className="font-mono text-[0.52rem] uppercase tracking-[0.22em] text-white/25">
          Live Campaign Feed
        </span>
      </div>

      {/* Feed body */}
      <div className="flex-1 px-4 py-4 space-y-3 overflow-hidden">
        {entries.map((entry) => (
          <div
            key={entry.id}
            className="flex items-start gap-3 animate-fade-in"
            style={{ animation: 'feedIn 0.25s ease-out both' }}
          >
            <span className="font-mono text-[0.5rem] text-white/20 shrink-0 mt-0.5 tabular-nums">
              {entry.ts}
            </span>
            <span
              className={`font-mono text-[0.65rem] leading-relaxed ${
                entry.type === 'booked'
                  ? 'text-[#E11D2A] font-bold'
                  : entry.type === 'booked-sub'
                  ? 'text-[#E11D2A]/70 pl-2'
                  : entry.type === 'muted'
                  ? 'text-white/30'
                  : 'text-white/70'
              }`}
            >
              {entry.text}
            </span>
          </div>
        ))}
      </div>

      {/* SMS notification pulse */}
      {showSms && (
        <div
          className="border-t border-white/[0.06] px-4 py-2.5"
          style={{ animation: 'feedIn 0.3s ease-out both' }}
        >
          <span className="font-mono text-[0.55rem] text-white/35">
            ● SMS sent to operator
          </span>
        </div>
      )}

      <style>{`
        @keyframes feedIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
