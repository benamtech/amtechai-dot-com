import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import ApplyStep1 from '../components/apply/ApplyStep1';
import ApplyStep2 from '../components/apply/ApplyStep2';
import ApplyStep3 from '../components/apply/ApplyStep3';
import ApplyStep4 from '../components/apply/ApplyStep4';
import ApplyStep5 from '../components/apply/ApplyStep5';
import ApplyReview from '../components/apply/ApplyReview';
import ApplyConfirmation from '../components/apply/ApplyConfirmation';

const STORAGE_KEY = 'amtech_apply_data';
const STEP_LABELS = [
  'YOUR SITUATION',
  'YOUR EXPERIENCE',
  'YOUR COMMITMENT',
  'YOUR MARKET',
  'ONE LAST THING',
];

export interface ApplicationData {
  // Step 1
  full_name: string;
  email: string;
  phone: string;
  city_state: string;
  // Step 2
  experience_level: string;
  cold_call_experience: string;
  lead_source: string;
  lead_source_other: string;
  // Step 3
  hours_per_week: string;
  monthly_goal: string;
  budget_range: string;
  // Step 4
  target_market: string;
  property_types: string[];
  price_range: string;
  buyers_list: string;
  // Step 5
  why_now: string;
}

const EMPTY: ApplicationData = {
  full_name: '', email: '', phone: '', city_state: '',
  experience_level: '', cold_call_experience: '', lead_source: '', lead_source_other: '',
  hours_per_week: '', monthly_goal: '', budget_range: '',
  target_market: '', property_types: [], price_range: '', buyers_list: '',
  why_now: '',
};

type Screen = 'form' | 'review' | 'confirmation';

export default function Apply() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<ApplicationData>(EMPTY);
  const [screen, setScreen] = useState<Screen>('form');
  const [showResume, setShowResume] = useState(false);
  const [stepErrors, setStepErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    document.title = 'Apply — AMTECH Operators';
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const hasData = Object.values(parsed).some((v) => v !== '' && !(Array.isArray(v) && v.length === 0));
        if (hasData) setShowResume(true);
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    return () => { document.title = 'AMTECH. — Your Next Employee Is a Computer'; };
  }, []);

  const save = (updates: Partial<ApplicationData>) => {
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
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setShowResume(false);
  };

  const startOver = () => {
    setData(EMPTY);
    localStorage.removeItem(STORAGE_KEY);
    setShowResume(false);
    setStep(1);
  };

  const validateStep = (): boolean => {
    const errors: Record<string, string> = {};
    if (step === 1) {
      if (!data.full_name.trim()) errors.full_name = 'Required';
      if (!data.email.trim()) errors.email = 'Required';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.email = 'Enter a valid email';
      if (!data.phone.trim()) errors.phone = 'Required';
      if (!data.city_state.trim()) errors.city_state = 'Required';
    }
    if (step === 2) {
      if (!data.experience_level) errors.experience_level = 'Select one';
      if (!data.cold_call_experience) errors.cold_call_experience = 'Select one';
      if (!data.lead_source) errors.lead_source = 'Select one';
    }
    if (step === 3) {
      if (!data.hours_per_week) errors.hours_per_week = 'Select one';
      if (!data.monthly_goal) errors.monthly_goal = 'Select one';
      if (!data.budget_range) errors.budget_range = 'Select one';
    }
    if (step === 4) {
      if (!data.target_market.trim()) errors.target_market = 'Required';
      if (data.property_types.length === 0) errors.property_types = 'Select at least one';
      if (!data.price_range) errors.price_range = 'Select one';
    }
    if (step === 5) {
      if (data.why_now.trim().length < 80) errors.why_now = 'Tell us a bit more. This helps us configure your program correctly.';
    }
    setStepErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const next = () => {
    if (!validateStep()) return;
    window.gtag?.('event', `step_${step}_complete`);
    if (step < 5) { setStep(s => s + 1); window.scrollTo(0, 0); }
    else {
      window.gtag?.('event', 'review_screen_viewed');
      setScreen('review');
      window.scrollTo(0, 0);
    }
  };

  const back = () => {
    if (screen === 'review') { setScreen('form'); setStep(5); window.scrollTo(0, 0); return; }
    if (step > 1) { setStep(s => s - 1); window.scrollTo(0, 0); }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    window.gtag?.('event', 'payment_initiated');
    try {
      const { error } = await supabase.from('operator_applications').insert([{
        full_name: data.full_name,
        email: data.email,
        phone: data.phone,
        city_state: data.city_state,
        experience_level: data.experience_level,
        cold_call_experience: data.cold_call_experience,
        lead_source: data.lead_source,
        lead_source_other: data.lead_source_other || null,
        hours_per_week: data.hours_per_week,
        monthly_goal: data.monthly_goal,
        budget_range: data.budget_range,
        target_market: data.target_market,
        property_types: data.property_types,
        price_range: data.price_range,
        buyers_list: data.buyers_list || null,
        why_now: data.why_now,
      }]);
      if (error) throw error;

      // Send confirmation emails via edge function
      await supabase.functions.invoke('send-application-email', {
        body: { application: data },
      });

      localStorage.removeItem(STORAGE_KEY);
      window.gtag?.('event', 'application_complete');
      setScreen('confirmation');
      window.scrollTo(0, 0);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (screen === 'confirmation') {
    return <ApplyConfirmation email={data.email} />;
  }

  if (screen === 'review') {
    return (
      <ApplyReview
        data={data}
        onBack={back}
        onSubmit={handleSubmit}
        submitting={submitting}
      />
    );
  }

  const progress = (step / 5) * 100;

  return (
    <div className="min-h-screen bg-white font-['Inter',sans-serif]">
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
      <div className="px-6 py-4 border-b border-[#0a0a0a]/10">
        <p className="font-mono text-[0.6rem] uppercase tracking-[0.22em] text-[#6b7280]">
          Step {step} of 5 — {STEP_LABELS[step - 1]}
        </p>
      </div>

      {/* Form area */}
      <div className="mx-auto max-w-[680px] px-6 py-12 md:py-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            {step === 1 && <ApplyStep1 data={data} onChange={save} errors={stepErrors} />}
            {step === 2 && <ApplyStep2 data={data} onChange={save} errors={stepErrors} />}
            {step === 3 && <ApplyStep3 data={data} onChange={save} errors={stepErrors} />}
            {step === 4 && <ApplyStep4 data={data} onChange={save} errors={stepErrors} />}
            {step === 5 && <ApplyStep5 data={data} onChange={save} errors={stepErrors} />}
          </motion.div>
        </AnimatePresence>

        {/* Bottom nav */}
        <div className="flex items-center justify-between mt-12 pt-8 border-t border-[#0a0a0a]/10">
          {step > 1 ? (
            <button
              onClick={back}
              className="inline-flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-[0.15em] text-[#0a0a0a] underline underline-offset-4 hover:text-[#E11D2A] transition-colors"
            >
              <ArrowLeft size={12} /> Back
            </button>
          ) : <div />}
          <button
            onClick={next}
            className="inline-flex items-center gap-2 bg-[#0a0a0a] px-8 py-3.5 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-white hover:bg-[#E11D2A] transition-colors duration-200 active:scale-[0.98]"
          >
            {step === 5 ? 'Review Application' : 'Continue'}
            <ArrowRight size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}
