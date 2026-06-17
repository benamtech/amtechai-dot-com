import { ApplicationData } from '../../pages/Apply';
import { StepHeader, Field, Textarea } from './applyShared';

interface Props {
  data: ApplicationData;
  onChange: (updates: Partial<ApplicationData>) => void;
  errors: Record<string, string>;
}

export default function ApplyStep5({ data, onChange, errors }: Props) {
  const charCount = data.why_now.trim().length;

  return (
    <div>
      <StepHeader
        headline="Why now?"
        sub={`Most important question on this form. Take 60 seconds. A serious answer tells us you're ready for a serious program.`}
      />

      <Field label="In your own words — what made you apply today, and what does a win look like at the end of this month?" error={errors.why_now}>
        <Textarea
          value={data.why_now}
          onChange={(e) => onChange({ why_now: e.target.value })}
          placeholder='Be specific. "I want to make money" is not enough.'
          hasError={!!errors.why_now}
          style={{ minHeight: 160 }}
          rows={6}
        />
        <div className="mt-1.5 flex items-center justify-between">
          <span className="text-[0.75rem] text-[#6b7280]">
            {charCount < 80 ? `${80 - charCount} more characters needed` : ''}
          </span>
          <span className={`text-[0.75rem] ${charCount >= 80 ? 'text-[#16a34a]' : 'text-[#6b7280]'}`}>
            {charCount} / 80 min
          </span>
        </div>
      </Field>
    </div>
  );
}
