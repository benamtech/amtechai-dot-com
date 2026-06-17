import { ApplicationData } from '../../pages/Apply';
import { StepHeader, Field, Input } from './applyShared';

function formatPhone(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 10);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

interface Props {
  data: ApplicationData;
  onChange: (updates: Partial<ApplicationData>) => void;
  errors: Record<string, string>;
}

export default function ApplyStep1({ data, onChange, errors }: Props) {
  return (
    <div>
      <StepHeader
        headline="Tell us where you're starting from."
        sub="No wrong answers. We need your starting point to configure your campaign correctly."
      />

      <Field label="Full Name" error={errors.full_name}>
        <Input
          type="text"
          value={data.full_name}
          onChange={(e) => onChange({ full_name: e.target.value })}
          placeholder="Jane Smith"
          hasError={!!errors.full_name}
          autoComplete="name"
        />
      </Field>

      <Field label="Email" error={errors.email}>
        <Input
          type="email"
          value={data.email}
          onChange={(e) => onChange({ email: e.target.value })}
          onBlur={(e) => {
            if (e.target.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.target.value)) {
              // parent will show error on advance attempt
            }
          }}
          placeholder="jane@example.com"
          hasError={!!errors.email}
          autoComplete="email"
        />
      </Field>

      <Field
        label="Phone"
        error={errors.phone}
        sub="We use this to send SMS alerts when your AI books an appointment."
      >
        <Input
          type="tel"
          value={data.phone}
          onChange={(e) => onChange({ phone: formatPhone(e.target.value) })}
          placeholder="(602) 555-0100"
          hasError={!!errors.phone}
          autoComplete="tel"
        />
      </Field>

      <Field
        label="City and State"
        error={errors.city_state}
        sub="Your market determines your list strategy and agent configuration."
      >
        <Input
          type="text"
          value={data.city_state}
          onChange={(e) => onChange({ city_state: e.target.value })}
          placeholder="e.g. Phoenix, AZ"
          hasError={!!errors.city_state}
        />
      </Field>
    </div>
  );
}
