import { useState } from 'react';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import StepIndicator from '../components/schedule/StepIndicator';
import InfoStep from '../components/schedule/InfoStep';
import SelectionStep from '../components/schedule/SelectionStep';
import DateTimeStep from '../components/schedule/DateTimeStep';
import Confirmation from '../components/schedule/Confirmation';
import { formatDateForDisplay } from '../components/schedule/bookingConstants';
import { createBooking, type BookingData } from '../components/schedule/bookingService';

const CALL_INDUSTRIES = [
  'Wholesale / Real Estate',
  'High Ticket Sales',
] as const;

const CALL_TOPICS = [
  'Sales Bootcamp Enrollment',
  'AI Prospecting Agent',
  'General Inquiry',
] as const;

const stepVariants = {
  enter: { opacity: 0, x: 20 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
};

export default function ScheduleCall() {
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [organization, setOrganization] = useState('');
  const [industry, setIndustry] = useState('');
  const [topic, setTopic] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState<BookingData | null>(null);

  async function handleConfirm() {
    if (!selectedDate || !selectedTime) return;
    setSubmitting(true);

    const booking: BookingData = {
      name,
      email,
      organization,
      industry,
      topic,
      bookingDate: formatDateForDisplay(selectedDate),
      bookingTime: selectedTime,
    };

    const success = await createBooking(booking);
    setSubmitting(false);

    if (success) {
      window.gtag?.('event', 'generate_lead', {
        industry,
        topic,
        source: 'schedule-call',
      });
      setConfirmed(booking);
    }
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col">
      <header className="border-b border-black/[0.06] bg-white/80 backdrop-blur-xl px-4 sm:px-7 py-3 flex items-center justify-between">
        <Link to="/" className="inline-flex items-baseline">
          <span className="font-display text-base font-black tracking-[0.06em] text-black">AMTECH</span>
          <span className="text-base font-black text-red">.</span>
        </Link>
        <span className="mono-label text-red">Schedule Call</span>
      </header>

      <div className="flex-1 flex items-start justify-center px-4 py-8 sm:py-12 lg:py-16">
        <div className="w-full max-w-2xl">
          {confirmed ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Confirmation booking={confirmed} />
            </motion.div>
          ) : (
            <>
              <div className="mb-6 sm:mb-8">
                <div className="mb-5">
                  <p className="mono-label text-red mb-1">Book a Call</p>
                  <h1 className="text-[22px] sm:text-[28px] font-display font-black text-black leading-tight">
                    Schedule Your Consultation
                  </h1>
                </div>
                <StepIndicator currentStep={step} />
              </div>

              <div className="glass-card px-4 py-5 sm:px-7 sm:py-6">
                <AnimatePresence mode="wait">
                  {step === 0 && (
                    <motion.div
                      key="info"
                      variants={stepVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.2 }}
                    >
                      <InfoStep
                        initial={{ name, email, organization }}
                        onNext={(data) => {
                          setName(data.name);
                          setEmail(data.email);
                          setOrganization(data.organization);
                          setStep(1);
                        }}
                      />
                    </motion.div>
                  )}

                  {step === 1 && (
                    <motion.div
                      key="industry"
                      variants={stepVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.2 }}
                    >
                      <SelectionStep
                        title="Which area are you focused on?"
                        subtitle="This helps us tailor the conversation to your goals"
                        options={CALL_INDUSTRIES}
                        selected={industry}
                        onSelect={setIndustry}
                        onNext={() => setStep(2)}
                        onBack={() => setStep(0)}
                      />
                    </motion.div>
                  )}

                  {step === 2 && (
                    <motion.div
                      key="topic"
                      variants={stepVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.2 }}
                    >
                      <SelectionStep
                        title="What would you like to discuss?"
                        subtitle="Select the topic you'd like to cover"
                        options={CALL_TOPICS}
                        selected={topic}
                        onSelect={setTopic}
                        onNext={() => setStep(3)}
                        onBack={() => setStep(1)}
                      />
                    </motion.div>
                  )}

                  {step === 3 && (
                    <motion.div
                      key="datetime"
                      variants={stepVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.2 }}
                    >
                      <DateTimeStep
                        selectedDate={selectedDate}
                        selectedTime={selectedTime}
                        onSelectDate={setSelectedDate}
                        onSelectTime={setSelectedTime}
                        onBack={() => setStep(2)}
                        onConfirm={handleConfirm}
                        submitting={submitting}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <p className="text-center mono-label text-black/20 mt-6">
                AMTECH // American Marketing Technology
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
