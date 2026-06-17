import { SalesRepApplicationData } from '../../pages/SalesRepApply';
import { StepHeader, Field, Input, Select, TIMEZONES } from './salesRepShared';

function formatPhone(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 10);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

interface Props {
  data: SalesRepApplicationData;
  onChange: (updates: Partial<SalesRepApplicationData>) => void;
  errors: Record<string, string>;
}

export default function SalesRepStep1({ data, onChange, errors }: Props) {
  return (
    <div>
      <StepHeader
        headline="Your details."
        sub="Basic info so we can reach you."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="First Name" error={errors.first_name}>
          <Input
            type="text"
            value={data.first_name}
            onChange={(e) => onChange({ first_name: e.target.value })}
            placeholder="Jane"
            hasError={!!errors.first_name}
            autoComplete="given-name"
          />
        </Field>

        <Field label="Last Name" error={errors.last_name}>
          <Input
            type="text"
            value={data.last_name}
            onChange={(e) => onChange({ last_name: e.target.value })}
            placeholder="Smith"
            hasError={!!errors.last_name}
            autoComplete="family-name"
          />
        </Field>
      </div>

      <Field label="City" error={errors.city}>
        <Input
          type="text"
          value={data.city}
          onChange={(e) => onChange({ city: e.target.value })}
          placeholder="Austin"
          hasError={!!errors.city}
          autoComplete="address-level2"
        />
      </Field>

      <Field label="Timezone" error={errors.timezone}>
        <Select
          value={data.timezone}
          onChange={(v) => onChange({ timezone: v })}
          options={TIMEZONES}
          placeholder="Select your timezone"
          hasError={!!errors.timezone}
        />
      </Field>

      <Field label="Phone Number" error={errors.phone} sub="Format: (000) 000-0000">
        <Input
          type="tel"
          value={data.phone}
          onChange={(e) => onChange({ phone: formatPhone(e.target.value) })}
          placeholder="(555) 123-4567"
          hasError={!!errors.phone}
          autoComplete="tel"
        />
      </Field>

      <Field label="Instagram Handle" error={errors.instagram_handle}>
        <Input
          type="text"
          value={data.instagram_handle}
          onChange={(e) => onChange({ instagram_handle: e.target.value.replace(/^@/, '') })}
          placeholder="yourname"
          hasError={!!errors.instagram_handle}
          autoComplete="off"
        />
      </Field>
    </div>
  );
}
