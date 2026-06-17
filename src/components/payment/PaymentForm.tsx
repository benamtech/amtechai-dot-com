import { useState } from 'react';
import {
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { ArrowRight, Loader2 } from 'lucide-react';

interface PaymentFormProps {
  amount: number;
  name: string;
  company: string;
  email: string;
  description: string;
}

export default function PaymentForm({ amount, name, company, email, description }: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);
    setErrorMessage(null);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/payment-success`,
        payment_method_data: {
          billing_details: {
            name,
            email,
          },
        },
      },
    });

    if (error) {
      setErrorMessage(error.message ?? 'An unexpected error occurred.');
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-xl border border-black/[0.06] bg-white/50 p-5">
        <div className="mb-4">
          <p className="mono-label text-black/25">
            Payment Summary
          </p>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="font-body text-sm text-black/40">Amount</span>
            <span className="font-mono text-sm font-bold text-black">${amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-body text-sm text-black/40">For</span>
            <span className="font-body text-sm text-black/80 text-right max-w-[60%]">{description}</span>
          </div>
          {company && (
            <div className="flex justify-between">
              <span className="font-body text-sm text-black/40">Company</span>
              <span className="font-body text-sm text-black/80">{company}</span>
            </div>
          )}
        </div>
      </div>

      <div>
        <p className="mono-label text-black/25 mb-3">
          Card Details
        </p>
        <div className="rounded-xl border border-black/[0.06] bg-white p-4">
          <PaymentElement
            options={{
              layout: 'tabs',
              fields: {
                billingDetails: {
                  name: 'never',
                  email: 'never',
                },
              },
            }}
          />
        </div>
      </div>

      {errorMessage && (
        <div className="rounded-lg border border-red/30 bg-red/5 px-4 py-3">
          <p className="font-body text-sm text-red">{errorMessage}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || !elements || isProcessing}
        className="btn-primary w-full justify-center py-4 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isProcessing ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Processing...
          </>
        ) : (
          <>
            Pay ${amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            <ArrowRight size={14} />
          </>
        )}
      </button>

      <p className="text-center font-body text-[0.7rem] text-black/30">
        Payments are secured and encrypted by Stripe. Your card information is never stored.
      </p>
    </form>
  );
}
