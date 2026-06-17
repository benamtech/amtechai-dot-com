import { ApplicationData } from '../../pages/Apply';
import { StepHeader, Field, SingleSelect } from './applyShared';

interface Props {
  data: ApplicationData;
  onChange: (updates: Partial<ApplicationData>) => void;
  errors: Record<string, string>;
}

const HOURS_OPTIONS = [
  {
    value: 'under_5',
    label: 'Less than 5 hours',
    warning: 'This may not be enough to act on opportunities as they appear. We\'ll discuss on your intake call.',
  },
  { value: '5_10', label: '5–10 hours per week' },
  { value: '10_20', label: '10–20 hours per week' },
  { value: 'over_20', label: 'More than 20 hours. This is my primary focus.' },
];

const GOAL_OPTIONS = [
  { value: 'first_campaign', label: 'Understand the system and get my first campaign live.' },
  { value: 'book_meeting', label: 'Get a campaign live and book at least one seller meeting.' },
  { value: 'first_deal', label: 'Close my first wholesale deal.' },
  { value: 'scale', label: 'I already close deals. I want to scale volume.' },
];

const BUDGET_OPTIONS = [
  { value: '500_1000', label: '$500–$1,000' },
  { value: '1000_1500', label: '$1,000–$1,500' },
  { value: 'over_1500', label: '$1,500+  I\'m ready to move fast.' },
];

export default function ApplyStep3({ data, onChange, errors }: Props) {
  return (
    <div>
      <StepHeader
        headline="This program requires real time. How much can you give it?"
        sub="The AI handles outbound. You review outcomes, follow up on callbacks, and show up to seller meetings."
      />

      <Field label="Hours per week" error={errors.hours_per_week}>
        <SingleSelect
          options={HOURS_OPTIONS}
          value={data.hours_per_week}
          onChange={(v) => onChange({ hours_per_week: v })}
          hasError={!!errors.hours_per_week}
        />
      </Field>

      <Field label="Goal for this month" error={errors.monthly_goal}>
        <SingleSelect
          options={GOAL_OPTIONS}
          value={data.monthly_goal}
          onChange={(v) => onChange({ monthly_goal: v })}
          hasError={!!errors.monthly_goal}
        />
      </Field>

      <Field label="Budget for lead lists and call volume" error={errors.budget_range}>
        <SingleSelect
          options={BUDGET_OPTIONS}
          value={data.budget_range}
          onChange={(v) => onChange({ budget_range: v })}
          hasError={!!errors.budget_range}
        />
        <p className="mt-3 text-[0.8rem] text-[#6b7280] leading-[1.65]">
          Lead lists and call volume are separate from your program fee. Most members spend $500–$1,500 before closing their first deal. One wholesale assignment fee returns $5,000–$15,000. Budget accordingly.
        </p>
      </Field>
    </div>
  );
}
