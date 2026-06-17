import { SalesRepApplicationData } from '../../pages/SalesRepApply';
import { StepHeader, Field, Textarea } from './salesRepShared';

interface Props {
  data: SalesRepApplicationData;
  onChange: (updates: Partial<SalesRepApplicationData>) => void;
  errors: Record<string, string>;
}

export default function SalesRepStep4({ data, onChange, errors }: Props) {
  return (
    <div>
      <StepHeader
        headline="Let's see how you think."
        sub="These questions help us understand how you handle real situations."
      />

      <Field
        label="Tell us about a time you got hard feedback, or got told you were doing something wrong. What did you do next?"
        error={errors.feedback_response}
      >
        <Textarea
          value={data.feedback_response}
          onChange={(e) => onChange({ feedback_response: e.target.value })}
          placeholder="e.g. My manager told me I was talking too much on calls. I recorded myself for a week, listened back, and cut my talk time by 40%..."
          rows={4}
          hasError={!!errors.feedback_response}
        />
      </Field>

      <Field
        label="A prospect says: 'It sounds good, but it's too expensive.' Type out, word for word, what you'd say back."
        error={errors.objection_handling}
        sub="This is a real skill. Show us how you'd actually respond."
      >
        <Textarea
          value={data.objection_handling}
          onChange={(e) => onChange({ objection_handling: e.target.value })}
          placeholder="Type your exact response..."
          rows={4}
          hasError={!!errors.objection_handling}
        />
      </Field>
    </div>
  );
}
