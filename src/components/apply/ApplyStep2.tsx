import { ApplicationData } from '../../pages/Apply';
import { StepHeader, Field, SingleSelect, Input } from './applyShared';

interface Props {
  data: ApplicationData;
  onChange: (updates: Partial<ApplicationData>) => void;
  errors: Record<string, string>;
}

const EXPERIENCE_OPTIONS = [
  { value: 'beginner', label: 'Complete beginner. I understand the concept but haven\'t started.' },
  { value: 'tried', label: 'I\'ve tried. Made calls, pulled lists, didn\'t close anything.' },
  { value: 'inconsistent', label: 'I\'ve done deals but inconsistently. Need a repeatable system.' },
  { value: 'active', label: 'I run an active operation and want AI to scale my outbound.' },
];

const COLD_CALL_OPTIONS = [
  { value: 'never', label: 'No. That\'s part of why I\'m here.' },
  { value: 'manual', label: 'Yes, manually. It burned me out.' },
  { value: 'dialer', label: 'Yes, with VAs or a dialer. Looking for something smarter.' },
];

const LEAD_SOURCE_OPTIONS = [
  { value: 'none_willing', label: 'No, but I\'m willing to get one.' },
  { value: 'propstream', label: 'Yes, I have PropStream.' },
  { value: 'other', label: 'I use a different source.' },
  { value: 'unsure', label: 'I\'m not sure what that is yet.' },
];

export default function ApplyStep2({ data, onChange, errors }: Props) {
  return (
    <div>
      <StepHeader
        headline="Be honest with us. This shapes how we set you up."
        sub="We work with beginners and people who've tried before."
      />

      <Field label="Where are you in wholesaling?" error={errors.experience_level}>
        <SingleSelect
          options={EXPERIENCE_OPTIONS}
          value={data.experience_level}
          onChange={(v) => onChange({ experience_level: v })}
          hasError={!!errors.experience_level}
        />
      </Field>

      <Field label="Have you cold called before?" error={errors.cold_call_experience}>
        <SingleSelect
          options={COLD_CALL_OPTIONS}
          value={data.cold_call_experience}
          onChange={(v) => onChange({ cold_call_experience: v })}
          hasError={!!errors.cold_call_experience}
        />
      </Field>

      <Field label="Do you have PropStream or a lead source?" error={errors.lead_source}>
        <SingleSelect
          options={LEAD_SOURCE_OPTIONS}
          value={data.lead_source}
          onChange={(v) => onChange({ lead_source: v })}
          hasError={!!errors.lead_source}
        />
        {data.lead_source === 'other' && (
          <div className="mt-3">
            <Input
              type="text"
              value={data.lead_source_other}
              onChange={(e) => onChange({ lead_source_other: e.target.value })}
              placeholder="Which one?"
            />
          </div>
        )}
      </Field>
    </div>
  );
}
