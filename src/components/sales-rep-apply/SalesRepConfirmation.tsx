import { Link } from 'react-router-dom';
import { Check, ArrowRight } from 'lucide-react';

export default function SalesRepConfirmation() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-6 py-16">
      <div className="max-w-lg w-full text-center">
        <div className="w-16 h-16 bg-[#0a0a0a] rounded-full flex items-center justify-center mx-auto mb-6">
          <Check size={28} className="text-white" strokeWidth={2.5} />
        </div>

        <h2 className="font-display text-[clamp(1.75rem,4vw,2.25rem)] font-black tracking-[-0.02em] text-[#0a0a0a] leading-[1.1] mb-4">
          Application submitted.
        </h2>

        <p className="text-[0.95rem] leading-[1.7] text-[#6b7280] mb-8">
          We review every application. If your background looks like a fit, you'll hear from us within 2 business days.
        </p>

        <div className="bg-[#fafafa] border border-[#0a0a0a]/10 p-5 mb-8">
          <p className="text-[0.8rem] text-[#6b7280] leading-relaxed">
            In the meantime, work on your objection handling. Write out 5 more responses to "it's too expensive" — different angles, different tones. You'll thank yourself later.
          </p>
        </div>

        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-[#E11D2A] px-8 py-3.5 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-white transition-colors duration-200 hover:bg-[#FF1A2B] active:scale-[0.98]"
        >
          Back to Home
          <ArrowRight size={13} />
        </Link>
      </div>
    </div>
  );
}
