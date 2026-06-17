import { Check } from 'lucide-react';

const STEPS = ['Your Info', 'Industry', 'Topic', 'Date & Time'];

interface StepIndicatorProps {
  currentStep: number;
}

export default function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <div className="flex items-center gap-1 sm:gap-2">
      {STEPS.map((label, i) => {
        const isActive = i === currentStep;
        const isComplete = i < currentStep;

        return (
          <div key={label} className="flex items-center gap-1 sm:gap-2">
            {i > 0 && (
              <div
                className={`w-4 sm:w-8 lg:w-12 h-px transition-colors duration-300 ${
                  isComplete ? 'bg-black' : 'bg-black/10'
                }`}
              />
            )}
            <div className="flex items-center gap-1.5">
              <div
                className={`w-6 h-6 flex items-center justify-center text-[10px] font-bold rounded-md transition-all duration-300 ${
                  isComplete
                    ? 'bg-red text-white'
                    : isActive
                    ? 'border border-black/30 text-black'
                    : 'border border-black/10 text-black/25'
                }`}
              >
                {isComplete ? <Check className="w-3 h-3" /> : i + 1}
              </div>
              <span
                className={`hidden sm:inline text-[10px] tracking-[0.12em] uppercase font-semibold transition-colors duration-300 ${
                  isActive ? 'text-black' : isComplete ? 'text-black/50' : 'text-black/20'
                }`}
              >
                {label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
