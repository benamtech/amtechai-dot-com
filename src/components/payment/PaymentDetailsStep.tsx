import { ArrowRight } from 'lucide-react';

interface PaymentDetails {
  amount: string;
  name: string;
  company: string;
  email: string;
  description: string;
}

interface PaymentDetailsStepProps {
  details: PaymentDetails;
  onChange: (field: keyof PaymentDetails, value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
  error: string | null;
}

export default function PaymentDetailsStep({
  details,
  onChange,
  onSubmit,
  isLoading,
  error,
}: PaymentDetailsStepProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  const amountNum = parseFloat(details.amount);
  const isValidAmount = !isNaN(amountNum) && amountNum >= 0.5;

  const inputClass =
    'w-full rounded-lg border border-black/10 bg-white/70 px-4 py-3 font-body text-sm text-black placeholder:text-black/25 focus:border-black/25 focus:outline-none transition-colors';

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="mono-label text-black/40 mb-1.5 block">
          Amount (USD) <span className="text-red">*</span>
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono text-sm text-black/30">$</span>
          <input
            type="number"
            min="0.50"
            step="0.01"
            required
            placeholder="0.00"
            value={details.amount}
            onChange={(e) => onChange('amount', e.target.value)}
            className={`${inputClass} pl-8`}
          />
        </div>
      </div>

      <div>
        <label className="mono-label text-black/40 mb-1.5 block">
          Payment Description <span className="text-red">*</span>
        </label>
        <textarea
          required
          rows={2}
          placeholder="What is this payment for?"
          value={details.description}
          onChange={(e) => onChange('description', e.target.value)}
          className={`${inputClass} resize-none`}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="mono-label text-black/40 mb-1.5 block">
            Your Name <span className="text-red">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="Full name"
            value={details.name}
            onChange={(e) => onChange('name', e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label className="mono-label text-black/40 mb-1.5 block">
            Company
          </label>
          <input
            type="text"
            placeholder="Company name (optional)"
            value={details.company}
            onChange={(e) => onChange('company', e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className="mono-label text-black/40 mb-1.5 block">
          Email <span className="text-red">*</span>
        </label>
        <input
          type="email"
          required
          placeholder="your@email.com"
          value={details.email}
          onChange={(e) => onChange('email', e.target.value)}
          className={inputClass}
        />
      </div>

      {error && (
        <div className="rounded-lg border border-red/30 bg-red/5 px-4 py-3">
          <p className="font-body text-sm text-red">{error}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading || !isValidAmount || !details.name || !details.email || !details.description}
        className="btn-primary w-full justify-center py-4 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isLoading ? 'Preparing...' : (
          <>
            Continue to Payment
            <ArrowRight size={14} />
          </>
        )}
      </button>
    </form>
  );
}
