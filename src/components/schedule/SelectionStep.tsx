import { ArrowLeft, ArrowRight, Check } from 'lucide-react';

interface SelectionStepProps {
  title: string;
  subtitle: string;
  options: readonly string[];
  selected: string;
  onSelect: (value: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function SelectionStep({
  title,
  subtitle,
  options,
  selected,
  onSelect,
  onNext,
  onBack,
}: SelectionStepProps) {
  return (
    <div className="space-y-3">
      <div className="mb-4">
        <p className="mono-label text-red mb-1">Select One</p>
        <h3 className="text-[15px] font-display font-black text-black">{title}</h3>
        <p className="text-[12px] text-black/40 mt-0.5">{subtitle}</p>
      </div>

      <div className="space-y-2">
        {options.map((option) => {
          const isSelected = selected === option;
          return (
            <button
              key={option}
              onClick={() => onSelect(option)}
              className={`w-full text-left px-5 py-4 rounded-xl transition-all duration-200 flex items-center justify-between ${
                isSelected
                  ? 'glass-bright text-black'
                  : 'glass text-black/60 hover:text-black'
              }`}
              style={isSelected ? { borderColor: 'rgba(225, 29, 42, 0.3)' } : {}}
            >
              <span className="text-[13px] font-medium">{option}</span>
              {isSelected && <Check className="w-4 h-4 flex-shrink-0 text-red" />}
            </button>
          );
        })}
      </div>

      <div className="flex gap-3 pt-2">
        <button
          onClick={onBack}
          className="btn-secondary flex-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back
        </button>
        <button
          onClick={onNext}
          disabled={!selected}
          className="btn-primary flex-1 disabled:opacity-25 disabled:cursor-not-allowed"
        >
          Continue
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
