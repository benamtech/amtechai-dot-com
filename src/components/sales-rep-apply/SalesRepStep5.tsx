import { SalesRepApplicationData } from '../../pages/SalesRepApply';
import { StepHeader, Field, Textarea, YesNoSelect } from './salesRepShared';

interface Props {
  data: SalesRepApplicationData;
  onChange: (updates: Partial<SalesRepApplicationData>) => void;
  errors: Record<string, string>;
}

export default function SalesRepStep5({ data, onChange, errors }: Props) {
  return (
    <div>
      <StepHeader
        headline="Final checks."
        sub="Almost done."
      />

      <Field
        label="Do you have a laptop, a phone, reliable internet, and a quiet place to take calls?"
        error={errors.equipment_confirmed}
      >
        <YesNoSelect
          value={data.equipment_confirmed}
          onChange={(v) => onChange({ equipment_confirmed: v })}
          hasError={!!errors.equipment_confirmed}
        />
      </Field>

      <Field
        label="Anything we should know?"
        error={errors.additional_info}
        sub="Optional. Schedule conflicts, personal circumstances, or anything else relevant."
      >
        <Textarea
          value={data.additional_info || ''}
          onChange={(e) => onChange({ additional_info: e.target.value })}
          placeholder="e.g. I have a vacation planned in July, but I can put in extra hours before and after..."
          rows={3}
          hasError={!!errors.additional_info}
        />
      </Field>
    </div>
  );
}
