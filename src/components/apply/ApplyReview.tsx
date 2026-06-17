import { ArrowLeft, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { ApplicationData } from '../../pages/Apply';

const EXPERIENCE_LABELS: Record<string, string> = {
  beginner: 'Complete beginner',
  tried: "I've tried — made calls, pulled lists, didn't close",
  inconsistent: "Done deals but inconsistently",
  active: "Active operation — scaling outbound",
};
const COLD_CALL_LABELS: Record<string, string> = {
  never: "No — that's part of why I'm here",
  manual: "Yes, manually — it burned me out",
  dialer: "Yes, with VAs or a dialer",
};
const LEAD_SOURCE_LABELS: Record<string, string> = {
  none_willing: "No, but willing to get one",
  propstream: "Yes, I have PropStream",
  other: "I use a different source",
  unsure: "Not sure what that is yet",
};
const HOURS_LABELS: Record<string, string> = {
  under_5: "Less than 5 hours/week",
  '5_10': "5–10 hours/week",
  '10_20': "10–20 hours/week",
  over_20: "More than 20 hours — primary focus",
};
const GOAL_LABELS: Record<string, string> = {
  first_campaign: "Understand the system and get first campaign live",
  book_meeting: "Get a campaign live and book a seller meeting",
  first_deal: "Close my first wholesale deal",
  scale: "Already close deals — want to scale volume",
};
const BUDGET_LABELS: Record<string, string> = {
  under_300: "Under $300",
  '300_500': "$300–$500",
  '500_1000': "$500–$1,000",
  '1000_1500': "$1,000–$1,500",
  over_1500: "$1,500+ — ready to move fast",
};
const PRICE_LABELS: Record<string, string> = {
  under_100k: "Under $100K",
  '100k_250k': "$100K–$250K",
  '250k_500k': "$250K–$500K",
  over_500k: "$500K+",
  unsure: "Not sure — need guidance",
};
const BUYERS_LABELS: Record<string, string> = {
  none: "No — starting from scratch",
  few: "A few contacts, nothing organized",
  active: "Yes — active buyers in my market",
};

function Row({ label, value }: { label: string; value: string | string[] }) {
  const display = Array.isArray(value) ? value.join(', ') : value;
  return (
    <div className="py-5 border-b border-white/10">
      <p className="font-mono text-[0.58rem] uppercase tracking-[0.2em] text-[#6b7280] mb-1.5">{label}</p>
      <p className="text-[1.1rem] text-white leading-snug">{display}</p>
    </div>
  );
}

interface Props {
  data: ApplicationData;
  onBack: () => void;
  onSubmit: () => void;
  submitting: boolean;
}

export default function ApplyReview({ data, onBack, onSubmit, submitting }: Props) {
  const city = data.target_market || data.city_state || 'your market';
  const propTypes = data.property_types.length > 0 ? data.property_types.slice(0, 2).join(' and ') : 'residential';

  return (
    <div className="min-h-screen bg-[#0a0a0a] font-['Inter',sans-serif]">
      {/* Header */}
      <div className="px-6 py-16 md:py-24 mx-auto max-w-[680px]">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="font-black text-[clamp(2rem,5vw,2.75rem)] tracking-[-0.04em] text-white leading-[1.05] mb-4">
            Here's what we know about you.
          </h1>
          <p className="text-[0.95rem] text-[#6b7280]">
            Review your answers. If anything looks wrong, go back.
          </p>
        </motion.div>

        {/* Answers */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mt-10"
        >
          <Row label="Full Name" value={data.full_name} />
          <Row label="Email" value={data.email} />
          <Row label="Phone" value={data.phone} />
          <Row label="City / State" value={data.city_state} />
          <Row label="Experience Level" value={EXPERIENCE_LABELS[data.experience_level] || data.experience_level} />
          <Row label="Cold Calling Background" value={COLD_CALL_LABELS[data.cold_call_experience] || data.cold_call_experience} />
          <Row label="Lead Source" value={
            data.lead_source === 'other' && data.lead_source_other
              ? `Other: ${data.lead_source_other}`
              : LEAD_SOURCE_LABELS[data.lead_source] || data.lead_source
          } />
          <Row label="Hours per Week" value={HOURS_LABELS[data.hours_per_week] || data.hours_per_week} />
          <Row label="Monthly Goal" value={GOAL_LABELS[data.monthly_goal] || data.monthly_goal} />
          <Row label="Budget for Lists & Volume" value={BUDGET_LABELS[data.budget_range] || data.budget_range} />
          <Row label="Target Market" value={data.target_market} />
          <Row label="Property Types" value={data.property_types} />
          <Row label="Price Range / ARV" value={PRICE_LABELS[data.price_range] || data.price_range} />
          {data.buyers_list && (
            <Row label="Buyers List" value={BUYERS_LABELS[data.buyers_list] || data.buyers_list} />
          )}
          <div className="py-5 border-b border-white/10">
            <p className="font-mono text-[0.58rem] uppercase tracking-[0.2em] text-[#6b7280] mb-1.5">Why Now</p>
            <p className="text-[0.95rem] text-[#6b7280] italic leading-[1.7]">"{data.why_now}"</p>
          </div>
        </motion.div>

        {/* Divider */}
        <div className="h-px bg-[#E11D2A] my-10" />

        {/* Dynamic line */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-[1.05rem] text-white text-center leading-[1.7] mb-10"
        >
          Based on your answers, we'll configure your Wholesale Lead Qualifier agent for the{' '}
          <span className="text-[#E11D2A]">{city}</span>{' '}
          <span className="text-[#E11D2A]">{propTypes}</span>{' '}
          market before your first campaign goes live.
        </motion.p>

        {/* Pricing block */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="border border-white/20 px-6 py-8 mb-8"
        >
          <p className="font-mono text-[0.62rem] uppercase tracking-[0.22em] text-[#6b7280] mb-6">
            AMTECH Operators — Beta Cohort
          </p>
          <div className="flex justify-between items-baseline border-b border-white/10 pb-4 mb-6">
            <span className="text-white text-[0.95rem]">One Month Program Access</span>
            <span className="text-white font-black text-[1.1rem]">$1,800</span>
          </div>
          <p className="font-mono text-[0.6rem] uppercase tracking-[0.15em] text-[#6b7280] mb-3">Includes</p>
          <ul className="space-y-2 mb-6">
            {[
              'AMTECH Campaign Dashboard',
              'Wholesale Lead Qualifier Agent',
              'Campaign Configuration (done with you)',
              'Calendar Booking Automation',
              'SMS Appointment Alerts',
              'Weekly Operator Sessions (4 calls)',
              'Private Operator Community Access',
            ].map((item) => (
              <li key={item} className="flex items-start gap-3 text-[0.875rem] text-[#6b7280]">
                <span className="text-[#E11D2A] mt-0.5">·</span>
                {item}
              </li>
            ))}
          </ul>
          <div className="border-t border-white/10 pt-4 flex justify-between items-baseline">
            <span className="text-white text-[0.95rem] font-semibold">Total</span>
            <div className="text-right">
              <span className="text-white font-black text-[1.1rem]">$1,800</span>
              <p className="text-[#6b7280] text-[0.72rem] mt-0.5">Billed once. No recurring charge.</p>
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <button
            onClick={onSubmit}
            disabled={submitting}
            className="w-full bg-[#E11D2A] py-5 font-mono text-[0.75rem] uppercase tracking-[0.2em] text-white hover:bg-[#FF1A2B] transition-colors duration-200 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {submitting ? 'Submitting...' : <>Confirm and Submit Application <ArrowRight size={14} /></>}
          </button>
          <p className="mt-3 text-center text-[0.72rem] text-[#6b7280]">
            Confirmation email + intake call scheduling within 48 hours.
          </p>

          <div className="mt-8 text-center">
            <button
              onClick={onBack}
              className="font-mono text-[0.65rem] uppercase tracking-[0.15em] text-[#6b7280] underline underline-offset-4 hover:text-white transition-colors inline-flex items-center gap-1.5"
            >
              <ArrowLeft size={11} /> Edit my answers
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
