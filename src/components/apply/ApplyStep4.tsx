import { ApplicationData } from '../../pages/Apply';
import { StepHeader, Field, Input, SingleSelect, MultiSelect } from './applyShared';

interface Props {
  data: ApplicationData;
  onChange: (updates: Partial<ApplicationData>) => void;
  errors: Record<string, string>;
}

const PROPERTY_TYPES = [
  'Single family residential',
  'Small multifamily (2–4 units)',
  'Land and lots',
  'Mobile homes',
  'Commercial',
  'Not sure yet',
];

const PRICE_RANGE_OPTIONS = [
  { value: 'under_100k', label: 'Under $100K' },
  { value: '100k_250k', label: '$100K–$250K' },
  { value: '250k_500k', label: '$250K–$500K' },
  { value: 'over_500k', label: '$500K+' },
  { value: 'unsure', label: 'Not sure — need guidance' },
];

const BUYERS_LIST_OPTIONS = [
  { value: 'none', label: 'No. Starting from scratch.' },
  { value: 'few', label: 'A few contacts but nothing organized.' },
  { value: 'active', label: 'Yes. Active buyers in my market.' },
];

export default function ApplyStep4({ data, onChange, errors }: Props) {
  return (
    <div>
      <StepHeader
        headline="Tell us about where you want to work deals."
        sub="We configure the Wholesale Lead Qualifier agent for your specific market."
      />

      <Field label="Target Market" error={errors.target_market}>
        <Input
          type="text"
          value={data.target_market}
          onChange={(e) => onChange({ target_market: e.target.value })}
          placeholder="e.g. Atlanta metro, South Phoenix"
          hasError={!!errors.target_market}
        />
      </Field>

      <Field label="Property type focus" error={errors.property_types}>
        <MultiSelect
          options={PROPERTY_TYPES}
          value={data.property_types}
          onChange={(v) => onChange({ property_types: v })}
          hasError={!!errors.property_types}
        />
      </Field>

      <Field label="Price range / ARV" error={errors.price_range}>
        <SingleSelect
          options={PRICE_RANGE_OPTIONS}
          value={data.price_range}
          onChange={(v) => onChange({ price_range: v })}
          hasError={!!errors.price_range}
        />
      </Field>

      <Field
        label="Do you have a buyers list?"
        sub="Having buyers isn't required. Buyer list building is covered inside the program."
      >
        <SingleSelect
          options={BUYERS_LIST_OPTIONS}
          value={data.buyers_list}
          onChange={(v) => onChange({ buyers_list: v })}
        />
      </Field>
    </div>
  );
}
