import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { CheckCircle, ArrowRight } from 'lucide-react';

const stripePromise = loadStripe('pk_live_51S5xh6QqpRmYMPzxk16ByujPjJoBtkmfoH659jjfWMCeerWc9Rg5oDtsSUA41vJISXyQwP6U8PsY5KLhhuE98cgA00bJyQkcA5');

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [amount, setAmount] = useState<number | null>(null);

  useEffect(() => {
    const clientSecret = searchParams.get('payment_intent_client_secret');
    if (!clientSecret) {
      setStatus('error');
      return;
    }

    stripePromise.then((stripe) => {
      if (!stripe) return;
      stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
        if (paymentIntent?.status === 'succeeded') {
          setAmount(paymentIntent.amount / 100);
          setStatus('success');
        } else {
          setStatus('error');
        }
      });
    });
  }, [searchParams]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#FAFAFA] px-6">
      <Link to="/" className="mb-12 inline-flex items-baseline">
        <span className="font-display text-base font-black tracking-[0.06em] text-black">AMTECH</span>
        <span className="text-base font-black text-red">.</span>
      </Link>

      {status === 'loading' && (
        <div className="text-center">
          <p className="font-mono text-sm text-black/40">Confirming payment...</p>
        </div>
      )}

      {status === 'success' && (
        <div className="glass-card w-full max-w-md p-8 text-center">
          <CheckCircle size={40} className="mx-auto mb-4 text-green-500" />
          <p className="mb-2 font-mono text-[0.65rem] uppercase tracking-[0.18em] text-green-600">
            Payment Confirmed
          </p>
          <h1 className="font-display text-display-md text-black">
            {amount !== null ? `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : 'Payment'} received.
          </h1>
          <p className="mt-4 font-body text-body-sm text-black/40">
            Thank you. A receipt has been sent to your email address.
          </p>
          <div className="mt-8">
            <Link to="/" className="btn-primary w-full justify-center">
              Return Home
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      )}

      {status === 'error' && (
        <div className="glass-card w-full max-w-md p-8 text-center" style={{ borderColor: 'rgba(225, 29, 42, 0.2)' }}>
          <p className="mb-2 font-mono text-[0.65rem] uppercase tracking-[0.18em] text-red">
            Payment Issue
          </p>
          <h1 className="font-display text-display-md text-black">Something went wrong.</h1>
          <p className="mt-4 font-body text-body-sm text-black/40">
            Your payment may not have been processed. Please try again or contact us.
          </p>
          <div className="mt-8">
            <Link to="/pay" className="btn-primary w-full justify-center">
              Try Again
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
