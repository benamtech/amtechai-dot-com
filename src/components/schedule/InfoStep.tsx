import { useState } from 'react';
import { ArrowRight } from 'lucide-react';

interface InfoStepProps {
  initial: { name: string; email: string; organization: string };
  onNext: (data: { name: string; email: string; organization: string }) => void;
}

export default function InfoStep({ initial, onNext }: InfoStepProps) {
  const [name, setName] = useState(initial.name);
  const [email, setEmail] = useState(initial.email);
  const [organization, setOrganization] = useState(initial.organization);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate(): boolean {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = 'Name is required';
    if (!email.trim()) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'Enter a valid email';
    if (!organization.trim()) errs.organization = 'Organization is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (validate()) {
      onNext({ name: name.trim(), email: email.trim(), organization: organization.trim() });
    }
  }

  const inputClasses = 'w-full border border-black/10 bg-white/70 px-4 py-3 text-[13px] text-black rounded-lg outline-none transition-colors focus:border-black/25 placeholder:text-black/25';

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block mono-label text-black/40 mb-2">Full Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="John Smith"
          className={inputClasses}
        />
        {errors.name && <p className="text-[11px] mt-1 text-red">{errors.name}</p>}
      </div>

      <div>
        <label className="block mono-label text-black/40 mb-2">Email Address</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="john@company.com"
          className={inputClasses}
        />
        {errors.email && <p className="text-[11px] mt-1 text-red">{errors.email}</p>}
      </div>

      <div>
        <label className="block mono-label text-black/40 mb-2">Organization</label>
        <input
          type="text"
          value={organization}
          onChange={(e) => setOrganization(e.target.value)}
          placeholder="Acme Corp"
          className={inputClasses}
        />
        {errors.organization && <p className="text-[11px] mt-1 text-red">{errors.organization}</p>}
      </div>

      <div className="pt-2">
        <button
          type="submit"
          className="btn-primary w-full"
        >
          Continue
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </form>
  );
}
