import { useState } from 'react';
import { Link } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import PaymentDetailsStep from '../components/payment/PaymentDetailsStep';
import PaymentForm from '../components/payment/PaymentForm';

const stripePromise = loadStripe('pk_live_51S5xh6QqpRmYMPzxk16ByujPjJoBtkmfoH659jjfWMCeerWc9Rg5oDtsSUA41vJISXyQwP6U8PsY5KLhhuE98cgA00bJyQkcA5');

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

interface PaymentDetails {
  amount: string;
  name: string;
  company: string;
  email: string;
  description: string;
}

export default function Payment() {
  const [step, setStep] = useState<'details' | 'card'>('details');
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [details, setDetails] = useState<PaymentDetails>({
    amount: '',
    name: '',
    company: '',
    email: '',
    description: '',
  });

  const handleFieldChange = (field: keyof PaymentDetails, value: string) => {
    setDetails((prev) => ({ ...prev, [field]: value }));
  };

  const handleCreateIntent = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const amountCents = Math.round(parseFloat(details.amount) * 100);

      const res = await fetch(
        `${SUPABASE_URL}/functions/v1/create-payment-intent`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            amount: amountCents,
            currency: 'usd',
            name: details.name,
            email: details.email,
            company: details.company,
            description: details.description,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok || !data.clientSecret) {
        throw new Error(data.error ?? 'Failed to initialize payment.');
      }

      setClientSecret(data.clientSecret);
      setStep('card');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const elementsOptions = clientSecret
    ? {
        clientSecret,
        appearance: {
          theme: 'stripe' as const,
          variables: {
            colorPrimary: '#E11D2A',
            colorBackground: '#FFFFFF',
            colorText: '#111111',
            colorDanger: '#E11D2A',
            fontFamily: 'Inter, system-ui, sans-serif',
            borderRadius: '12px',
            colorBorder: 'rgba(0, 0, 0, 0.10)',
            colorInputBackground: '#FFFFFF',
            colorInputText: '#111111',
            colorPlaceholderText: 'rgba(0, 0, 0, 0.25)',
          },
        },
      }
    : undefined;

  return (
    <div className="flex min-h-screen flex-col bg-[#FAFAFA]">
      <header className="border-b border-black/[0.06] bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-2xl items-center justify-between px-6">
          <Link to="/" className="inline-flex items-baseline">
            <span className="font-display text-base font-black tracking-[0.06em] text-black">
              AMTECH
            </span>
            <span className="text-base font-black text-red">.</span>
          </Link>
          <div className="flex items-center gap-1.5">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-500"></span>
            <span className="mono-label text-black/50">Secure Payment</span>
          </div>
        </div>
      </header>

      <main className="flex flex-1 items-start justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <div className="mb-2 flex items-center gap-3">
              <Step number={1} active={step === 'details'} done={step === 'card'} />
              <div className="h-px flex-1 bg-black/10" />
              <Step number={2} active={step === 'card'} done={false} />
            </div>
            <div className="mt-4">
              <p className="mono-label text-red">
                Step {step === 'details' ? '1' : '2'} of 2
              </p>
              <h1 className="mt-1 font-display text-display-md text-black">
                {step === 'details' ? 'Payment Details' : 'Card Information'}
              </h1>
            </div>
          </div>

          <div className="glass-card p-6 md:p-8">
            {step === 'details' && (
              <PaymentDetailsStep
                details={details}
                onChange={handleFieldChange}
                onSubmit={handleCreateIntent}
                isLoading={isLoading}
                error={error}
              />
            )}

            {step === 'card' && clientSecret && elementsOptions && (
              <Elements stripe={stripePromise} options={elementsOptions}>
                <button
                  onClick={() => setStep('details')}
                  className="mb-6 font-body text-xs text-black/40 transition-colors hover:text-black"
                >
                  &larr; Back to details
                </button>
                <PaymentForm
                  amount={parseFloat(details.amount)}
                  name={details.name}
                  company={details.company}
                  email={details.email}
                  description={details.description}
                />
              </Elements>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function Step({ number, active, done }: { number: number; active: boolean; done: boolean }) {
  return (
    <div
      className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg font-mono text-xs font-bold transition-colors ${
        done
          ? 'bg-green-500/10 text-green-600 border border-green-500/30'
          : active
          ? 'bg-red/10 text-red border border-red/30'
          : 'border border-black/10 text-black/20'
      }`}
    >
      {done ? '\u2713' : number}
    </div>
  );
}
