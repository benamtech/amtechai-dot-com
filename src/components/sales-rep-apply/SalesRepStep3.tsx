import { SalesRepApplicationData } from '../../pages/SalesRepApply';
import { StepHeader, Field, Textarea, SingleSelect, HOURS_OPTIONS } from './salesRepShared';

interface Props {
  data: SalesRepApplicationData;
  onChange: (updates: Partial<SalesRepApplicationData>) => void;
  errors: Record<string, string>;
}

export default function SalesRepStep3({ data, onChange, errors }: Props) {
  return (
    <div>
      <StepHeader
        headline="Why this, why now."
        sub="The real answer matters more than the polished one."
      />

      <Field
        label="Why this, why now — and what's the real monthly income number you're aiming for in the next 12 months, and what would you do with it?"
        error={errors.motivation}
        sub="Be specific. The more real you are, the better we can help."
      >
        <Textarea
          value={data.motivation}
          onChange={(e) => onChange({ motivation: e.target.value })}
          placeholder="e.g. I've been stuck in hourly work for 4 years. I want to make $8k/month so I can move out of my parents' house and save for a down payment..."
          rows={4}
          hasError={!!errors.motivation}
        />
      </Field>

      <Field
        label="How many hours a week can you genuinely commit?"
        error={errors.hours_commitment}
      >
        <SingleSelect
          options={HOURS_OPTIONS}
          value={data.hours_commitment}
          onChange={(v) => onChange({ hours_commitment: v })}
          hasError={!!errors.hours_commitment}
        />
      </Field>
    </div>
  );
}
