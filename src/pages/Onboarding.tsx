import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Mic, Clock, Sparkles } from 'lucide-react';
import ConversationInterface from '../components/onboarding/ConversationInterface';

export default function Onboarding() {
  const [started, setStarted] = useState(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <div className="flex h-dvh flex-col bg-[#FAFAFA]">
      <div className="pointer-events-none fixed inset-0 bg-grid-pattern bg-grid-lg opacity-40" />
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          background:
            'radial-gradient(ellipse at 50% 30%, rgba(225,29,42,0.04) 0%, transparent 60%)',
        }}
      />

      <header className="relative z-10 flex shrink-0 items-center justify-between px-6 py-4 md:px-10">
        <Link to="/" className="inline-flex items-baseline opacity-60 transition-opacity hover:opacity-100">
          <span className="font-display text-sm font-black tracking-[0.06em] text-black">
            AMTECH
          </span>
          <span className="text-sm font-black text-red">.</span>
        </Link>
        {started ? (
          <div className="flex items-center gap-2 font-mono text-[0.6rem] uppercase tracking-[0.15em] text-black/40">
            <span className="inline-block h-1 w-1 animate-pulse-red bg-red" />
            Session Active
          </div>
        ) : (
          <Link
            to="/"
            className="font-mono text-[0.6rem] uppercase tracking-[0.15em] text-black/40 transition-colors hover:text-black"
          >
            Back to site
          </Link>
        )}
      </header>

      <main className="relative z-10 flex flex-1 flex-col overflow-hidden">
        {started ? (
          <ConversationInterface />
        ) : (
          <OnboardingWelcome onStart={() => setStarted(true)} />
        )}
      </main>
    </div>
  );
}

function OnboardingWelcome({ onStart }: { onStart: () => void }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6">
      <div className="w-full max-w-xl text-center">
        <p className="mb-5 font-mono text-[0.6rem] uppercase tracking-[0.2em] text-red/70">
          AI Estimator Demo
        </p>

        <h1 className="font-display text-3xl font-black leading-[1.15] tracking-tight text-black sm:text-4xl md:text-5xl">
          See It Live on
          <br />
          <span className="text-red">Your Business</span>
        </h1>

        <p className="mx-auto mt-5 max-w-md text-[15px] leading-relaxed text-black/50">
          In a quick conversation, our AI advisor will walk through how the estimator would
          be configured for your specific trade, your pricing, and your service area. You leave
          knowing exactly what it would look like.
        </p>

        <div className="mx-auto mt-10 flex max-w-sm flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-center">
          <button
            onClick={onStart}
            className="group flex items-center justify-center gap-3 bg-red px-8 py-3.5 font-mono text-xs font-semibold uppercase tracking-[0.12em] text-white transition-all hover:bg-red-bright"
          >
            Start Demo
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>

        <div className="mx-auto mt-12 grid max-w-md grid-cols-3 gap-px border border-black/[0.06] bg-black/[0.06]">
          <div className="flex flex-col items-center gap-2 bg-white px-4 py-5">
            <Mic className="h-4 w-4 text-red/70" />
            <span className="font-mono text-[0.6rem] uppercase tracking-[0.12em] text-black/40">
              Voice or Text
            </span>
          </div>
          <div className="flex flex-col items-center gap-2 bg-white px-4 py-5">
            <Clock className="h-4 w-4 text-red/70" />
            <span className="font-mono text-[0.6rem] uppercase tracking-[0.12em] text-black/40">
              Under 5 min
            </span>
          </div>
          <div className="flex flex-col items-center gap-2 bg-white px-4 py-5">
            <Sparkles className="h-4 w-4 text-red/70" />
            <span className="font-mono text-[0.6rem] uppercase tracking-[0.12em] text-black/40">
              No obligation
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
