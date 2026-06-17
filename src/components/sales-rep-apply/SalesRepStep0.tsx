import { SalesRepApplicationData } from '../../pages/SalesRepApply';
import { StepHeader, VideoNotice, Field, Input } from './salesRepShared';

interface Props {
  data: SalesRepApplicationData;
  onChange: (updates: Partial<SalesRepApplicationData>) => void;
  errors: Record<string, string>;
}

export default function SalesRepStep0({ data, onChange, errors }: Props) {
  return (
    <div>
      <StepHeader
        headline="Let's start with your video."
        sub="Record this before filling out the form. It helps us get to know you faster."
      />

      <VideoNotice />

      <Field label="Video Link" error={errors.video_link} sub="Paste a YouTube, Loom, or Google Drive link.">
        <Input
          type="url"
          value={data.video_link}
          onChange={(e) => onChange({ video_link: e.target.value })}
          placeholder="https://youtube.com/watch?v=..."
          hasError={!!errors.video_link}
          autoComplete="off"
        />
      </Field>

      <div className="mt-8 p-4 bg-[#f5f5f5] border border-[#0a0a0a]/10">
        <p className="text-[0.8rem] leading-[1.6] text-[#6b7280]">
          <strong className="text-[#0a0a0a]">Optional add-on:</strong> Add 30 seconds pretending Ben is a friend stuck in a job they hate, and pitch them on why they should bet on themselves.
        </p>
      </div>
    </div>
  );
}
