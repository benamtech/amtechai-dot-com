import React from 'react';
import { Check } from 'lucide-react';

export function StepHeader({ headline, sub }: { headline: string; sub: string }) {
  return (
    <div className="mb-8">
      <h2 className="font-display text-[clamp(1.5rem,4vw,2rem)] font-black tracking-[-0.02em] text-[#0a0a0a] leading-[1.1] mb-3">
        {headline}
      </h2>
      <p className="text-[0.9rem] leading-[1.7] text-[#6b7280]">{sub}</p>
    </div>
  );
}

export function VideoNotice() {
  return (
    <div className="mb-8 p-4 border-l-[3px] border-l-[#E11D2A] bg-[#fef2f2]">
      <p className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-[#E11D2A] mb-2">
        Video Required
      </p>
      <p className="text-[0.85rem] leading-[1.6] text-[#0a0a0a]">
        Before you begin, please record a 60-90 second intro video. It should be selfie-style, one take, no script.
        Cover: who you are; your best result in sales and the highest income you've ever generated (or if you've never sold before,
        why you'll be good and the hardest thing you've ever pushed through); why you want this and the number you're chasing.
      </p>
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
    <div className="mb-6">
      <label className="block font-mono text-[0.6rem] uppercase tracking-[0.18em] text-[#0a0a0a] mb-2">
        {label}
      </label>
      {children}
      {sub && !error && (
        <p className="mt-1.5 text-[0.75rem] text-[#6b7280] leading-snug">{sub}</p>
      )}
      {error && (
        <p className="mt-1.5 text-[0.75rem] text-[#E11D2A]">{error}</p>
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
        hasError ? 'border-[#E11D2A]' : 'border-[#0a0a0a]/20'
      } outline-none focus:border-[#0a0a0a] focus:ring-1 focus:ring-[#0a0a0a]/10 placeholder:text-[#6b7280]/50 transition-colors ${className}`}
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
        hasError ? 'border-[#E11D2A]' : 'border-[#0a0a0a]/20'
      } outline-none focus:border-[#0a0a0a] focus:ring-1 focus:ring-[#0a0a0a]/10 placeholder:text-[#6b7280]/50 transition-colors resize-none ${className}`}
    />
  );
}

interface CardOption {
  value: string;
  label: string;
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
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`w-full text-left px-4 py-3.5 border transition-all duration-150 ${
              selected
                ? 'bg-[#0a0a0a] text-white border-[#0a0a0a] border-l-[3px] border-l-[#E11D2A]'
                : 'bg-white text-[#0a0a0a] border-[#0a0a0a]/15 hover:border-[#0a0a0a]/40 hover:bg-[#fafafa]'
            }`}
          >
            <span className="text-[0.85rem] leading-snug">{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}

interface YesNoSelectProps {
  value: boolean | null;
  onChange: (v: boolean) => void;
  hasError?: boolean;
}
export function YesNoSelect({ value, onChange, hasError }: YesNoSelectProps) {
  const options = [
    { val: true, label: 'Yes' },
    { val: false, label: 'No' },
  ];
  return (
    <div className={`flex gap-3 ${hasError ? 'ring-1 ring-[#E11D2A] ring-offset-2' : ''}`}>
      {options.map((opt) => {
        const selected = value === opt.val;
        return (
          <button
            key={opt.label}
            type="button"
            onClick={() => onChange(opt.val)}
            className={`flex-1 px-4 py-3 border transition-all duration-150 ${
              selected
                ? 'bg-[#0a0a0a] text-white border-[#0a0a0a]'
                : 'bg-white text-[#0a0a0a] border-[#0a0a0a]/15 hover:border-[#0a0a0a]/40'
            }`}
          >
            <span className="text-[0.85rem]">{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export const TIMEZONES = [
  { value: 'US/Eastern', label: 'Eastern Time (ET)' },
  { value: 'US/Central', label: 'Central Time (CT)' },
  { value: 'US/Mountain', label: 'Mountain Time (MT)' },
  { value: 'US/Pacific', label: 'Pacific Time (PT)' },
  { value: 'US/Alaska', label: 'Alaska Time (AKT)' },
  { value: 'US/Hawaii', label: 'Hawaii Time (HT)' },
];

interface SelectProps {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  hasError?: boolean;
}
export function Select({ value, onChange, options, placeholder, hasError }: SelectProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full px-4 py-3 text-[0.95rem] text-[#0a0a0a] bg-white border ${
        hasError ? 'border-[#E11D2A]' : 'border-[#0a0a0a]/20'
      } outline-none focus:border-[#0a0a0a] focus:ring-1 focus:ring-[#0a0a0a]/10 transition-colors appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%236b7280%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:20px] bg-[right_12px_center] bg-no-repeat`}
    >
      {placeholder && <option value="" disabled>{placeholder}</option>}
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  );
}

export const HOURS_OPTIONS = [
  { value: '10-15', label: '10-15 hours/week' },
  { value: '15-25', label: '15-25 hours/week' },
  { value: '25-35', label: '25-35 hours/week' },
  { value: '35-45', label: '35-45 hours/week' },
  { value: '45+', label: '45+ hours/week (full-time commitment)' },
];
