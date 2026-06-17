import { useState } from 'react';

const CONNECT_FEE = 0.015;
const TWILIO_MIN  = 0.014;
const AI_MIN      = 0.56;

function fmt$(n: number): string {
  if (n >= 100000) return '$' + (n / 1000).toFixed(0) + 'k';
  if (n >= 1000)   return '$' + Math.round(n).toLocaleString();
  if (n >= 100)    return '$' + n.toFixed(0);
  return '$' + n.toFixed(2);
}

function fmtN(n: number): string {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000)    return Math.round(n).toLocaleString();
  return Math.round(n).toString();
}

interface SliderRowProps {
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  display: string;
  onChange: (v: number) => void;
}

function SliderRow({ label, min, max, step, value, display, onChange }: SliderRowProps) {
  return (
    <div className="mb-5 last:mb-0">
      <div className="flex items-baseline justify-between mb-2 sm:mb-0">
        <span className="text-[13px] tracking-[0.04em] text-black/70 font-body font-medium">{label}</span>
        <span className="text-[14px] font-body font-semibold text-black tracking-[0.02em] sm:hidden">{display}</span>
      </div>
      <div className="flex items-center gap-4">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={e => onChange(parseFloat(e.target.value))}
          className="w-full h-px bg-black/20 outline-none cursor-pointer appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:bg-red [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:rounded-full [&::-moz-range-thumb]:w-3.5 [&::-moz-range-thumb]:h-3.5 [&::-moz-range-thumb]:bg-red [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-none"
        />
        <span className="hidden sm:block text-[14px] font-body font-semibold text-black text-right tracking-[0.02em] w-[88px] shrink-0">{display}</span>
      </div>
    </div>
  );
}

function runDecay(leads: number, maxAttempts: number, answerRate: number) {
  let remaining     = leads;
  let totalDials    = 0;
  let totalAnswered = 0;

  for (let round = 1; round <= maxAttempts; round++) {
    if (remaining <= 0) break;
    const answeredThisRound = remaining * answerRate;
    totalDials    += remaining;
    totalAnswered += answeredThisRound;
    remaining     -= answeredThisRound;
  }

  return { totalDials, totalAnswered };
}

export default function OutboundCalculator() {
  const [leads, setLeads]           = useState(1000);
  const [attempts, setAttempts]     = useState(2);
  const [answerRate, setAnswerRate] = useState(20);
  const [duration, setDuration]     = useState(3);

  const rate = answerRate / 100;
  const { totalDials, totalAnswered } = runDecay(leads, attempts, rate);
  const answeredMins  = totalAnswered * duration;
  const reachedPct    = (totalAnswered / leads) * 100;

  const connectCost   = totalDials * CONNECT_FEE;
  const twilioMinCost = answeredMins * TWILIO_MIN;
  const aiCost        = answeredMins * AI_MIN;
  const total         = connectCost + twilioMinCost + aiCost;

  return (
    <div className="space-y-2">
      <div className="glass-card px-4 sm:px-7 py-5 sm:py-6">
        <div className="mono-label text-red mb-5">Campaign Parameters</div>
        <SliderRow label="Number of leads" min={1000} max={50000} step={100} value={leads} display={leads.toLocaleString()} onChange={setLeads} />
        <SliderRow label="Max attempts per lead" min={1} max={5} step={1} value={attempts} display={String(attempts)} onChange={setAttempts} />
        <SliderRow label="Answer rate per attempt" min={5} max={60} step={1} value={answerRate} display={`${answerRate}%`} onChange={setAnswerRate} />
        <SliderRow label="Avg call duration" min={1} max={15} step={0.5} value={duration} display={`${duration.toFixed(1)} min`} onChange={setDuration} />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {[
          { label: 'Total Dials',      val: fmtN(totalDials),    accent: false },
          { label: 'Conversations',    val: fmtN(totalAnswered), accent: false },
          { label: 'List Reached',     val: Math.round(reachedPct) + '%', accent: false },
          { label: 'AI Minutes',       val: fmtN(answeredMins),  accent: true  },
        ].map(({ label, val, accent }) => (
          <div key={label} className="glass-card px-4 sm:px-5 py-3 sm:py-4">
            <div className="mono-label text-black/30 mb-1.5">{label}</div>
            <div className={`font-display text-[22px] sm:text-[26px] tracking-[0.03em] ${accent ? 'text-red' : 'text-black'}`}>{val}</div>
          </div>
        ))}
      </div>

      <div className="glass-card px-4 sm:px-7 py-6 sm:py-8">
        <div className="mono-label text-red mb-3">Total Campaign Cost</div>
        <div className="flex items-baseline gap-2 sm:gap-3 mb-2">
          <div className="font-display text-[48px] sm:text-[88px] leading-none tracking-[0.02em] text-black">{fmt$(total)}</div>
          <div className="text-[13px] sm:text-[14px] text-black/40 font-body font-medium tracking-[0.06em] pb-1 sm:pb-3">total</div>
        </div>
        <div className="text-[12px] sm:text-[13px] text-black/40 font-body tracking-[0.03em] mb-5 sm:mb-7 leading-[1.8] flex flex-wrap gap-x-1">
          <span><span className="text-black/70 font-semibold">{leads.toLocaleString()}</span> leads</span>
          <span className="hidden sm:inline">&nbsp;&middot;&nbsp;</span>
          <span className="sm:hidden">&middot;</span>
          <span><span className="text-black/70 font-semibold">{attempts}</span> max attempts</span>
          <span className="hidden sm:inline">&nbsp;&middot;&nbsp;</span>
          <span className="sm:hidden">&middot;</span>
          <span><span className="text-black/70 font-semibold">{answerRate}%</span> answer rate</span>
          <span className="hidden sm:inline">&nbsp;&middot;&nbsp;</span>
          <span className="sm:hidden">&middot;</span>
          <span><span className="text-black/70 font-semibold">{duration.toFixed(1)} min</span> avg duration</span>
        </div>

        <div className="border-t border-black/[0.06] pt-5 space-y-0">
          {[
            { label: 'Twilio connection fee',    note: '$0.015 per dial -- all attempts', val: fmt$(connectCost) },
            { label: 'Twilio per-minute',        note: '$0.014/min -- answered calls only', val: fmt$(twilioMinCost) },
            { label: 'AI voice + conversation',  note: '$0.56/min -- answered calls only',  val: fmt$(aiCost) },
          ].map(({ label, note, val }) => (
            <div key={label} className="flex justify-between items-start sm:items-baseline py-2 sm:py-[7px] border-b border-black/[0.06]">
              <div className="min-w-0">
                <div className="text-[13px] sm:text-[14px] text-black/70 font-body font-medium tracking-[0.02em]">{label}</div>
                <div className="text-[11px] sm:text-[12px] text-black/30 font-body mt-0.5 break-words">{note}</div>
              </div>
              <span className="text-[13px] text-black font-body font-semibold pl-3 sm:pl-4 whitespace-nowrap shrink-0">{val}</span>
            </div>
          ))}
          <div className="flex justify-between items-baseline py-[7px]">
            <span className="text-[14px] text-black font-body font-bold tracking-[0.06em]">TOTAL</span>
            <span className="text-[16px] text-red font-body font-semibold pl-4">{fmt$(total)}</span>
          </div>
        </div>
      </div>

      <div className="text-[11px] sm:text-[12px] text-black/25 font-body tracking-[0.03em] leading-[1.8] sm:leading-[1.7] pt-4 sm:pt-5 border-t border-black/[0.06]">
        Decay model: each retry round only redials unanswered leads from the prior round. &middot;
        Connection fee ($0.015) charged per dial attempt regardless of answer. &middot;
        Minute costs apply to answered calls only. &middot;
        Answer rate reflects per-attempt probability, not total list penetration.
      </div>
    </div>
  );
}
