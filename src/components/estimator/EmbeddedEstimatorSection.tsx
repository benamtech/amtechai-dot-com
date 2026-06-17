import { useState } from 'react';
import { Mic, MessageSquare, ArrowRight, Sparkles } from 'lucide-react';
import AnimatedSection from '../ui/AnimatedSection';
import EmbeddedVoiceMode from './EmbeddedVoiceMode';
import EmbeddedTextChatMode from './EmbeddedTextChatMode';
import type { EmbeddedMessage, EmbeddedConversationMode } from './types';

let messageCounter = 0;
function createMessage(data: Omit<EmbeddedMessage, 'id' | 'created_at'>): EmbeddedMessage {
  return {
    ...data,
    id: `msg-${++messageCounter}-${Date.now()}`,
    created_at: new Date().toISOString(),
  };
}

interface EmbeddedEstimatorSectionProps {
  headline?: string;
  subtext?: string;
  sectionId?: string;
  autoStart?: boolean;
  defaultMode?: EmbeddedConversationMode;
  textOnly?: boolean;
}

export default function EmbeddedEstimatorSection({
  headline = 'Try the Estimator Live',
  subtext = "This is a real AI agent — built and configured by us. It's set up for Summit Outdoor Living, a fictional landscaping and hardscape company based in Bend, Oregon. Your version would be configured for your trade, your pricing, and your service area.",
  sectionId = 'try-it',
  autoStart = false,
  defaultMode = 'voice',
  textOnly = false,
}: EmbeddedEstimatorSectionProps) {
  const [started, setStarted] = useState(autoStart);
  const [mode, setMode] = useState<EmbeddedConversationMode>(defaultMode);
  const [messages, setMessages] = useState<EmbeddedMessage[]>([]);

  const addMessage = (data: Omit<EmbeddedMessage, 'id' | 'created_at'>) => {
    setMessages((prev) => [...prev, createMessage(data)]);
  };

  const handleModeSwitch = (newMode: EmbeddedConversationMode) => {
    if (newMode === mode) return;
    setMode(newMode);
    setMessages([]);
  };

  return (
    <section id={sectionId} className="relative overflow-hidden bg-[#FAFAFA] py-24 md:py-34">
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[700px] -translate-x-1/2 -translate-y-1/2 bg-red/[0.03] blur-[220px]"
        aria-hidden="true"
      />

      <div className="container-narrow relative z-10">
        {!started ? (
          <div className="flex flex-col items-center">
            <AnimatedSection>
              <p className="mb-3 text-center font-mono text-[0.6rem] uppercase tracking-[0.2em] text-red/70">
                AI Estimator Demo
              </p>
              <p className="mb-5 text-center font-mono text-[0.6rem] uppercase tracking-[0.15em] text-black/40">
                Summit Outdoor Living &nbsp;&middot;&nbsp; Bend, Oregon
              </p>
              <h2 className="text-center font-display text-display-lg text-black">
                {headline}
              </h2>
            </AnimatedSection>

            <AnimatedSection delay={0.1}>
              <p className="mx-auto mt-6 max-w-xl text-left font-body text-body-lg leading-relaxed text-black/50">
                {subtext}
              </p>
            </AnimatedSection>

            <AnimatedSection delay={0.15}>
              <div className="mt-10 flex flex-col items-center gap-4">
                <button
                  onClick={() => setStarted(true)}
                  className="group flex items-center justify-center gap-3 bg-red px-10 py-4 font-mono text-xs font-semibold uppercase tracking-[0.12em] text-white transition-all hover:bg-red-bright"
                >
                  Start Demo
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </button>
                <p className="font-body text-sm text-black/40">
                  No signup required &mdash; runs in your browser
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <div className="mx-auto mt-12 grid max-w-md grid-cols-3 gap-px border border-black/[0.06] bg-black/[0.06]">
                <div className="flex flex-col items-center gap-2 bg-white px-4 py-5">
                  <Mic className="h-4 w-4 text-red/70" />
                  <span className="font-mono text-[0.6rem] uppercase tracking-[0.12em] text-black/40">
                    Voice or Text
                  </span>
                </div>
                <div className="flex flex-col items-center gap-2 bg-white px-4 py-5">
                  <Sparkles className="h-4 w-4 text-red/70" />
                  <span className="font-mono text-[0.6rem] uppercase tracking-[0.12em] text-black/40">
                    Live AI
                  </span>
                </div>
                <div className="flex flex-col items-center gap-2 bg-white px-4 py-5">
                  <MessageSquare className="h-4 w-4 text-red/70" />
                  <span className="font-mono text-[0.6rem] uppercase tracking-[0.12em] text-black/40">
                    Your Trade
                  </span>
                </div>
              </div>
            </AnimatedSection>
          </div>
        ) : (
          <AnimatedSection>
            <div className="mx-auto max-w-3xl">
              <div className="mb-1 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <p className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-red/70">
                    AI Estimator Demo
                  </p>
                  <span className="hidden font-mono text-[0.6rem] uppercase tracking-[0.12em] text-black/40 sm:inline">
                    Summit Outdoor Living &middot; Bend, OR
                  </span>
                </div>
                <div className="flex items-center gap-2 font-mono text-[0.6rem] uppercase tracking-[0.15em] text-black/40">
                  <span className="inline-block h-1 w-1 animate-pulse-red bg-red" />
                  Session Active
                </div>
              </div>

              <div className="flex flex-col border border-black/[0.06] bg-white" style={{ height: textOnly ? '420px' : '480px', maxHeight: '70vh' }}>
                {!textOnly && (
                  <div className="flex shrink-0 items-center justify-center border-b border-black/[0.06] py-3">
                    <div className="flex items-center border border-black/[0.06] bg-[#FAFAFA]/60">
                      <button
                        onClick={() => handleModeSwitch('voice')}
                        className={`flex items-center gap-2 px-5 py-2.5 font-mono text-[0.7rem] uppercase tracking-[0.12em] transition-all ${
                          mode === 'voice'
                            ? 'bg-black/[0.05] text-black'
                            : 'text-black/40 hover:text-black/60'
                        }`}
                      >
                        <Mic className="h-3.5 w-3.5" />
                        Voice
                      </button>
                      <div className="h-5 w-px bg-black/[0.06]" />
                      <button
                        onClick={() => handleModeSwitch('text')}
                        className={`flex items-center gap-2 px-5 py-2.5 font-mono text-[0.7rem] uppercase tracking-[0.12em] transition-all ${
                          mode === 'text'
                            ? 'bg-black/[0.05] text-black'
                            : 'text-black/40 hover:text-black/60'
                        }`}
                      >
                        <MessageSquare className="h-3.5 w-3.5" />
                        Text
                      </button>
                    </div>
                  </div>
                )}

                <div className="min-h-0 flex-1">
                  {mode === 'voice' ? (
                    <EmbeddedVoiceMode
                      messages={messages}
                      onAddMessage={addMessage}
                      autoStart
                    />
                  ) : (
                    <EmbeddedTextChatMode
                      messages={messages}
                      onAddMessage={addMessage}
                    />
                  )}
                </div>
              </div>

              <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="font-body text-xs text-black/40 sm:text-sm">
                  Summit Outdoor Living is a fictional company. Your agent would be configured for your trade.
                </p>
                <button
                  onClick={() => { setStarted(autoStart); setMessages([]); setMode(defaultMode); }}
                  className="shrink-0 font-mono text-[0.6rem] uppercase tracking-[0.15em] text-black/40 transition-colors hover:text-black"
                >
                  Reset demo
                </button>
              </div>
            </div>
          </AnimatedSection>
        )}
      </div>
    </section>
  );
}
