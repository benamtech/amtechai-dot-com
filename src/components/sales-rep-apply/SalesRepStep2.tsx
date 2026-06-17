import { SalesRepApplicationData } from '../../pages/SalesRepApply';
import { StepHeader, Field, Textarea } from './salesRepShared';

interface Props {
  data: SalesRepApplicationData;
  onChange: (updates: Partial<SalesRepApplicationData>) => void;
  errors: Record<string, string>;
}

export default function SalesRepStep2({ data, onChange, errors }: Props) {
  return (
    <div>
      <StepHeader
        headline="Your work and sales background."
        sub="Be honest. We're looking for fit, not a perfect resume."
      />

      <Field
        label="What are you doing for work right now, and what are you roughly earning?"
        error={errors.current_work}
      >
        <Textarea
          value={data.current_work}
          onChange={(e) => onChange({ current_work: e.target.value })}
          placeholder="e.g. I'm a server at a restaurant, making about $45k/year with tips..."
          rows={3}
          hasError={!!errors.current_work}
        />
      </Field>

      <Field
        label="What type of sales have you done, and how do you usually perform?"
        error={errors.sales_experience}
        sub="If no sales experience, tell us about any customer-facing or hustle experience."
      >
        <Textarea
          value={data.sales_experience}
          onChange={(e) => onChange({ sales_experience: e.target.value })}
          placeholder="e.g. I did door-to-door for a summer, closed about 20% of demos. Best month was 8 deals..."
          rows={3}
          hasError={!!errors.sales_experience}
        />
      </Field>
    </div>
  );
}
