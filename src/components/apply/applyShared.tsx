import React from 'react';
import { Check } from 'lucide-react';

export function StepHeader({ headline, sub }: { headline: string; sub: string }) {
  return (
    <div className="mb-10">
      <h1 className="font-black text-[clamp(1.75rem,4vw,2.25rem)] tracking-[-0.03em] text-[#0a0a0a] leading-[1.1] mb-3">
        {headline}
      </h1>
      <p className="text-[0.95rem] leading-[1.7] text-[#6b7280]">{sub}</p>
    </div>
  );
}

interface FieldProps {
  label: string;
  error?: string;
  sub?: string;
  children: React.ReactNode;
}
export function Field({ label, error, sub, children }: FieldProps) {
  return (
    <div className="mb-7">
      <label className="block font-mono text-[0.62rem] uppercase tracking-[0.18em] text-[#0a0a0a] mb-2">
        {label}
      </label>
      {children}
      {sub && !error && (
        <p className="mt-1.5 text-[0.8rem] text-[#6b7280] leading-snug">{sub}</p>
      )}
      {error && (
        <p className="mt-1.5 text-[0.8rem] text-[#E11D2A]">{error}</p>
      )}
    </div>
  );
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean;
}
export function Input({ hasError, className = '', ...props }: InputProps) {
  return (
    <input
      {...props}
      className={`w-full px-4 py-3 text-[0.95rem] text-[#0a0a0a] bg-white border ${
        hasError ? 'border-[#E11D2A]' : 'border-[#0a0a0a]'
      } outline-none focus:border-[#E11D2A] focus:ring-2 focus:ring-[#E11D2A]/20 placeholder:text-[#6b7280]/60 transition-colors ${className}`}
    />
  );
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  hasError?: boolean;
}
export function Textarea({ hasError, className = '', ...props }: TextareaProps) {
  return (
    <textarea
      {...props}
      className={`w-full px-4 py-3 text-[0.95rem] text-[#0a0a0a] bg-white border ${
        hasError ? 'border-[#E11D2A]' : 'border-[#0a0a0a]'
      } outline-none focus:border-[#E11D2A] focus:ring-2 focus:ring-[#E11D2A]/20 placeholder:text-[#6b7280]/60 transition-colors resize-none ${className}`}
    />
  );
}

interface CardOption {
  value: string;
  label: string;
  warning?: string;
  note?: string;
}
interface SingleSelectProps {
  options: CardOption[];
  value: string;
  onChange: (v: string) => void;
  hasError?: boolean;
}
export function SingleSelect({ options, value, onChange, hasError }: SingleSelectProps) {
  return (
    <div className={`space-y-2 ${hasError ? 'ring-1 ring-[#E11D2A] ring-offset-2' : ''}`}>
      {options.map((opt) => {
        const selected = value === opt.value;
        return (
          <div key={opt.value}>
            <button
              type="button"
              onClick={() => onChange(opt.value)}
              className={`w-full text-left px-5 py-4 border transition-all duration-150 ${
                selected
                  ? 'bg-[#0a0a0a] text-white border-[#0a0a0a] border-l-[3px] border-l-[#E11D2A]'
                  : 'bg-white text-[#0a0a0a] border-[#0a0a0a]/20 hover:border-[#0a0a0a] hover:bg-[#f5f5f5]'
              }`}
            >
              <span className="text-[0.9rem] leading-snug">{opt.label}</span>
            </button>
            {selected && opt.warning && (
              <p className="mt-1 text-[0.8rem] text-[#E11D2A] px-1">{opt.warning}</p>
            )}
            {selected && opt.note && (
              <p className="mt-1 text-[0.8rem] text-[#6b7280] px-1">{opt.note}</p>
            )}
          </div>
        );
      })}
    </div>
  );
}

interface MultiSelectProps {
  options: string[];
  value: string[];
  onChange: (v: string[]) => void;
  hasError?: boolean;
}
export function MultiSelect({ options, value, onChange, hasError }: MultiSelectProps) {
  const toggle = (opt: string) => {
    if (value.includes(opt)) onChange(value.filter((v) => v !== opt));
    else onChange([...value, opt]);
  };
  return (
    <div className={`space-y-2 ${hasError ? 'ring-1 ring-[#E11D2A] ring-offset-2' : ''}`}>
      {options.map((opt) => {
        const selected = value.includes(opt);
        return (
          <button
            key={opt}
            type="button"
            onClick={() => toggle(opt)}
            className={`w-full text-left px-5 py-4 border transition-all duration-150 flex items-center gap-3 ${
              selected
                ? 'bg-[#f5f5f5] border-[#0a0a0a]/20 border-l-[3px] border-l-[#E11D2A]'
                : 'bg-white text-[#0a0a0a] border-[#0a0a0a]/20 hover:border-[#0a0a0a]'
            }`}
          >
            <div className={`w-4 h-4 border flex items-center justify-center shrink-0 transition-colors ${
              selected ? 'bg-[#E11D2A] border-[#E11D2A]' : 'border-[#0a0a0a]/40'
            }`}>
              {selected && <Check size={10} className="text-white" strokeWidth={3} />}
            </div>
            <span className="text-[0.9rem] leading-snug text-[#0a0a0a]">{opt}</span>
          </button>
        );
      })}
    </div>
  );
}
