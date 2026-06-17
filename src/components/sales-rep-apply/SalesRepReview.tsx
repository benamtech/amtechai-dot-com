import { ArrowLeft, ArrowRight } from 'lucide-react';
import { SalesRepApplicationData } from '../../pages/SalesRepApply';
import { TIMEZONES, HOURS_OPTIONS } from './salesRepShared';

interface Props {
  data: SalesRepApplicationData;
  onBack: () => void;
  onSubmit: () => void;
  submitting: boolean;
}

function ReviewField({ label, value }: { label: string; value: string | boolean | null }) {
  const displayValue = typeof value === 'boolean' ? (value ? 'Yes' : 'No') : (value || '—');
  return (
    <div className="mb-4">
      <p className="font-mono text-[0.55rem] uppercase tracking-[0.18em] text-[#6b7280] mb-1">{label}</p>
      <p className="text-[0.9rem] text-[#0a0a0a] leading-snug whitespace-pre-wrap">{displayValue}</p>
    </div>
  );
}

export default function SalesRepReview({ data, onBack, onSubmit, submitting }: Props) {
  const timezoneLabel = TIMEZONES.find(t => t.value === data.timezone)?.label || data.timezone;
  const hoursLabel = HOURS_OPTIONS.find(h => h.value === data.hours_commitment)?.label || data.hours_commitment;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <p className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-[#E11D2A] mb-2">Review</p>
        <h2 className="font-display text-[clamp(1.5rem,4vw,2rem)] font-black tracking-[-0.02em] text-[#0a0a0a] leading-[1.1]">
          Before you submit.
        </h2>
        <p className="mt-2 text-[0.9rem] text-[#6b7280]">Make sure everything looks correct.</p>
      </div>

      <div className="space-y-8">
        <section className="p-5 bg-[#fafafa] border border-[#0a0a0a]/10">
          <p className="font-mono text-[0.55rem] uppercase tracking-[0.18em] text-[#E11D2A] mb-4">Intro Video</p>
          <ReviewField label="Video Link" value={data.video_link} />
        </section>

        <section className="p-5 bg-[#fafafa] border border-[#0a0a0a]/10">
          <p className="font-mono text-[0.55rem] uppercase tracking-[0.18em] text-[#E11D2A] mb-4">Personal Details</p>
          <ReviewField label="Name" value={`${data.first_name} ${data.last_name}`} />
          <ReviewField label="City" value={data.city} />
          <ReviewField label="Timezone" value={timezoneLabel} />
          <ReviewField label="Phone" value={data.phone} />
          <ReviewField label="Instagram" value={data.instagram_handle ? `@${data.instagram_handle}` : ''} />
        </section>

        <section className="p-5 bg-[#fafafa] border border-[#0a0a0a]/10">
          <p className="font-mono text-[0.55rem] uppercase tracking-[0.18em] text-[#E11D2A] mb-4">Background</p>
          <ReviewField label="Current Work & Earnings" value={data.current_work} />
          <ReviewField label="Sales Experience" value={data.sales_experience} />
        </section>

        <section className="p-5 bg-[#fafafa] border border-[#0a0a0a]/10">
          <p className="font-mono text-[0.55rem] uppercase tracking-[0.18em] text-[#E11D2A] mb-4">Motivation</p>
          <ReviewField label="Why This, Why Now" value={data.motivation} />
          <ReviewField label="Hours/Week Commitment" value={hoursLabel} />
        </section>

        <section className="p-5 bg-[#fafafa] border border-[#0a0a0a]/10">
          <p className="font-mono text-[0.55rem] uppercase tracking-[0.18em] text-[#E11D2A] mb-4">Situational</p>
          <ReviewField label="Feedback Response" value={data.feedback_response} />
          <ReviewField label="Objection Handling" value={data.objection_handling} />
        </section>

        <section className="p-5 bg-[#fafafa] border border-[#0a0a0a]/10">
          <p className="font-mono text-[0.55rem] uppercase tracking-[0.18em] text-[#E11D2A] mb-4">Final</p>
          <ReviewField label="Equipment Confirmed" value={data.equipment_confirmed} />
          <ReviewField label="Additional Info" value={data.additional_info} />
        </section>
      </div>

      <div className="flex items-center justify-between mt-10 pt-8 border-t border-[#0a0a0a]/10">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-[0.15em] text-[#0a0a0a] underline underline-offset-4 hover:text-[#E11D2A] transition-colors"
        >
          <ArrowLeft size={12} /> Back
        </button>
        <button
          onClick={onSubmit}
          disabled={submitting}
          className="inline-flex items-center gap-2 bg-[#0a0a0a] px-8 py-3.5 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-white hover:bg-[#E11D2A] transition-colors duration-200 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {submitting ? 'Submitting...' : 'Submit Application'}
          {!submitting && <ArrowRight size={13} />}
        </button>
      </div>
    </div>
  );
}
