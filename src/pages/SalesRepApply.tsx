import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import SalesRepStep0 from '../components/sales-rep-apply/SalesRepStep0';
import SalesRepStep1 from '../components/sales-rep-apply/SalesRepStep1';
import SalesRepStep2 from '../components/sales-rep-apply/SalesRepStep2';
import SalesRepStep3 from '../components/sales-rep-apply/SalesRepStep3';
import SalesRepStep4 from '../components/sales-rep-apply/SalesRepStep4';
import SalesRepStep5 from '../components/sales-rep-apply/SalesRepStep5';
import SalesRepReview from '../components/sales-rep-apply/SalesRepReview';
import SalesRepConfirmation from '../components/sales-rep-apply/SalesRepConfirmation';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

const STORAGE_KEY = 'amtech_sales_rep_data';
const TOTAL_STEPS = 6;
const STEP_LABELS = [
  'VIDEO',
  'YOUR DETAILS',
  'WORK & SALES',
  'MOTIVATION',
  'SITUATIONAL',
  'FINAL CHECKS',
];

export interface SalesRepApplicationData {
  video_link: string;
  first_name: string;
  last_name: string;
  city: string;
  timezone: string;
  phone: string;
  instagram_handle: string;
  current_work: string;
  sales_experience: string;
  motivation: string;
  hours_commitment: string;
  feedback_response: string;
  objection_handling: string;
  equipment_confirmed: boolean | null;
  additional_info: string;
}

const EMPTY: SalesRepApplicationData = {
  video_link: '',
  first_name: '',
  last_name: '',
  city: '',
  timezone: '',
  phone: '',
  instagram_handle: '',
  current_work: '',
  sales_experience: '',
  motivation: '',
  hours_commitment: '',
  feedback_response: '',
  objection_handling: '',
  equipment_confirmed: null,
  additional_info: '',
};

type Screen = 'form' | 'review' | 'confirmation';

export default function SalesRepApply() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<SalesRepApplicationData>(EMPTY);
  const [screen, setScreen] = useState<Screen>('form');
  const [showResume, setShowResume] = useState(false);
  const [stepErrors, setStepErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    document.title = 'Sales Rep Application — AMTECH';
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const hasData = Object.values(parsed).some((v) => v !== '' && v !== null && !(Array.isArray(v) && v.length === 0));
        if (hasData) setShowResume(true);
      } catch {
        // Ignore invalid saved application state.
      }
    }
    return () => { document.title = 'AMTECH. — Your Next Employee Is a Computer'; };
  }, []);

  const save = (updates: Partial<SalesRepApplicationData>) => {
    const next = { ...data, ...updates };
    setData(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setStepErrors({});
  };

  const resume = () => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setData(JSON.parse(saved));
      } catch {
        // Ignore invalid saved application state.
      }
    }
    setShowResume(false);
  };

  const startOver = () => {
    setData(EMPTY);
    localStorage.removeItem(STORAGE_KEY);
    setShowResume(false);
    setStep(0);
  };

  const validateStep = (): boolean => {
    const errors: Record<string, string> = {};

    if (step === 0) {
      if (!data.video_link.trim()) errors.video_link = 'Required';
      else if (!/^https?:\/\/.+/.test(data.video_link)) errors.video_link = 'Enter a valid URL';
    }
    if (step === 1) {
      if (!data.first_name.trim()) errors.first_name = 'Required';
      if (!data.last_name.trim()) errors.last_name = 'Required';
      if (!data.city.trim()) errors.city = 'Required';
      if (!data.timezone) errors.timezone = 'Required';
      if (!data.phone.trim()) errors.phone = 'Required';
      else if (data.phone.replace(/\D/g, '').length !== 10) errors.phone = 'Enter a valid 10-digit phone';
      if (!data.instagram_handle.trim()) errors.instagram_handle = 'Required';
    }
    if (step === 2) {
      if (!data.current_work.trim()) errors.current_work = 'Required';
      if (!data.sales_experience.trim()) errors.sales_experience = 'Required';
    }
    if (step === 3) {
      if (!data.motivation.trim()) errors.motivation = 'Required';
      else if (data.motivation.trim().length < 50) errors.motivation = 'Tell us a bit more';
      if (!data.hours_commitment) errors.hours_commitment = 'Required';
    }
    if (step === 4) {
      if (!data.feedback_response.trim()) errors.feedback_response = 'Required';
      else if (data.feedback_response.trim().length < 30) errors.feedback_response = 'Give us more detail';
      if (!data.objection_handling.trim()) errors.objection_handling = 'Required';
      else if (data.objection_handling.trim().length < 20) errors.objection_handling = 'Write out your full response';
    }
    if (step === 5) {
      if (data.equipment_confirmed === null) errors.equipment_confirmed = 'Required';
    }

    setStepErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const next = () => {
    if (!validateStep()) return;
    window.gtag?.('event', `sales_rep_step_${step}_complete`);
    if (step < TOTAL_STEPS - 1) {
      setStep(s => s + 1);
      window.scrollTo(0, 0);
    } else {
      window.gtag?.('event', 'sales_rep_review_viewed');
      setScreen('review');
      window.scrollTo(0, 0);
    }
  };

  const back = () => {
    if (screen === 'review') {
      setScreen('form');
      setStep(TOTAL_STEPS - 1);
      window.scrollTo(0, 0);
      return;
    }
    if (step > 0) {
      setStep(s => s - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    window.gtag?.('event', 'sales_rep_submit_initiated');
    try {
      const { error } = await supabase.from('sales_rep_applications').insert([{
        video_link: data.video_link,
        first_name: data.first_name,
        last_name: data.last_name,
        city: data.city,
        timezone: data.timezone,
        phone: data.phone,
        instagram_handle: data.instagram_handle,
        current_work: data.current_work,
        sales_experience: data.sales_experience,
        motivation: data.motivation,
        hours_commitment: data.hours_commitment,
        feedback_response: data.feedback_response,
        objection_handling: data.objection_handling,
        equipment_confirmed: data.equipment_confirmed,
        additional_info: data.additional_info || null,
      }]);
      if (error) throw error;

      localStorage.removeItem(STORAGE_KEY);
      window.gtag?.('event', 'sales_rep_application_complete');
      setScreen('confirmation');
      window.scrollTo(0, 0);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (screen === 'confirmation') {
    return (
      <div className="min-h-screen bg-[#FAFAFA]">
        <header className="border-b border-black/[0.06] bg-white/80 backdrop-blur-xl px-4 sm:px-6 py-3 flex items-center justify-between">
          <Link to="/" className="inline-flex items-baseline">
            <span className="font-display text-base font-black tracking-[0.06em] text-black">AMTECH</span>
            <span className="text-base font-black text-[#E11D2A]">.</span>
          </Link>
          <span className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-[#E11D2A]">Application Received</span>
        </header>
        <SalesRepConfirmation />
      </div>
    );
  }

  if (screen === 'review') {
    return (
      <div className="min-h-screen bg-[#FAFAFA]">
        <header className="border-b border-black/[0.06] bg-white/80 backdrop-blur-xl px-4 sm:px-6 py-3 flex items-center justify-between">
          <Link to="/" className="inline-flex items-baseline">
            <span className="font-display text-base font-black tracking-[0.06em] text-black">AMTECH</span>
            <span className="text-base font-black text-[#E11D2A]">.</span>
          </Link>
          <span className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-[#6b7280]">Review</span>
        </header>
        <div className="px-4 sm:px-6 py-10 md:py-16">
          <SalesRepReview
            data={data}
            onBack={back}
            onSubmit={handleSubmit}
            submitting={submitting}
          />
        </div>
      </div>
    );
  }

  const progress = ((step + 1) / TOTAL_STEPS) * 100;

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* Resume banner */}
      <AnimatePresence>
        {showResume && (
          <motion.div
            initial={{ y: -60 }}
            animate={{ y: 0 }}
            exit={{ y: -60 }}
            className="bg-[#0a0a0a] px-6 py-4 flex items-center justify-between"
          >
            <p className="text-white text-sm">Continue where you left off?</p>
            <div className="flex gap-6">
              <button onClick={resume} className="text-sm text-white underline underline-offset-2 hover:text-[#E11D2A] transition-colors">
                Continue
              </button>
              <button onClick={startOver} className="text-sm text-[#6b7280] underline underline-offset-2 hover:text-white transition-colors">
                Start Over
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="border-b border-black/[0.06] bg-white/80 backdrop-blur-xl px-4 sm:px-6 py-3 flex items-center justify-between">
        <Link to="/" className="inline-flex items-baseline">
          <span className="font-display text-base font-black tracking-[0.06em] text-black">AMTECH</span>
          <span className="text-base font-black text-[#E11D2A]">.</span>
        </Link>
        <span className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-[#E11D2A]">Sales Rep Application</span>
      </header>

      {/* Progress bar */}
      <div className="h-[3px] bg-[#f5f5f5] w-full">
        <motion.div
          className="h-full bg-[#E11D2A]"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        />
      </div>

      {/* Step label */}
      <div className="px-4 sm:px-6 py-4 border-b border-[#0a0a0a]/10">
        <p className="font-mono text-[0.6rem] uppercase tracking-[0.22em] text-[#6b7280]">
          Step {step + 1} of {TOTAL_STEPS} — {STEP_LABELS[step]}
        </p>
      </div>

      {/* Intro text */}
      <div className="px-4 sm:px-6 py-6 border-b border-[#0a0a0a]/10 bg-white">
        <div className="max-w-2xl">
          <h1 className="font-display text-[clamp(1.25rem,3.5vw,1.75rem)] font-black tracking-[-0.02em] text-[#0a0a0a] leading-[1.1] mb-3">
            Sales Rep Pre-call Form
          </h1>
          <p className="text-[0.85rem] leading-[1.65] text-[#6b7280] mb-4">
            Please complete this form before your first interview with an AMTECH representative. Expect daily outreach, daily short videos, and live coaching. Honesty helps us find the right fit faster.
          </p>
          <div className="bg-[#f5f5f5] border border-[#0a0a0a]/10 p-4">
            <p className="font-mono text-[0.55rem] uppercase tracking-[0.18em] text-[#E11D2A] mb-2">About This Role</p>
            <p className="text-[0.8rem] leading-[1.65] text-[#0a0a0a]">
              You'll be selling a sales and AI tools training bootcamp that helps ambitious people learn how to use AMTECH's tools to sell AI employees — real automation that replaces real work — to realtors, contractors, and other local service businesses. This is an info product. You're the closer.
            </p>
          </div>
        </div>
      </div>

      {/* Form area */}
      <div className="px-4 sm:px-6 py-8 md:py-12">
        <div className="max-w-2xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              {step === 0 && <SalesRepStep0 data={data} onChange={save} errors={stepErrors} />}
              {step === 1 && <SalesRepStep1 data={data} onChange={save} errors={stepErrors} />}
              {step === 2 && <SalesRepStep2 data={data} onChange={save} errors={stepErrors} />}
              {step === 3 && <SalesRepStep3 data={data} onChange={save} errors={stepErrors} />}
              {step === 4 && <SalesRepStep4 data={data} onChange={save} errors={stepErrors} />}
              {step === 5 && <SalesRepStep5 data={data} onChange={save} errors={stepErrors} />}
            </motion.div>
          </AnimatePresence>

          {/* Bottom nav */}
          <div className="flex items-center justify-between mt-10 pt-6 border-t border-[#0a0a0a]/10">
            {step > 0 ? (
              <button
                onClick={back}
                className="inline-flex items-center gap-2 font-mono text-[0.65rem] uppercase tracking-[0.15em] text-[#0a0a0a] underline underline-offset-4 hover:text-[#E11D2A] transition-colors"
              >
                <ArrowLeft size={12} /> Back
              </button>
            ) : (
              <div />
            )}
            <button
              onClick={next}
              className="inline-flex items-center gap-2 bg-[#0a0a0a] px-7 py-3 font-mono text-[0.65rem] uppercase tracking-[0.18em] text-white hover:bg-[#E11D2A] transition-colors duration-200 active:scale-[0.98]"
            >
              {step === TOTAL_STEPS - 1 ? 'Review Application' : 'Continue'}
              <ArrowRight size={12} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
