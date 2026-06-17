import { KEY_LABELS } from './intakeScript';

interface IntakeSummaryProps {
  answers: Record<string, unknown>;
}

export default function IntakeSummary({ answers }: IntakeSummaryProps) {
  const rows = Object.entries(answers)
    .filter(([k, v]) => v !== null && v !== undefined && KEY_LABELS[k])
    .map(([k, v]) => {
      let display: string;
      if (Array.isArray(v)) {
        display = v.map((f: { name?: string }) => f.name || String(f)).join(', ');
      } else {
        display = String(v);
      }
      return { key: k, label: KEY_LABELS[k], value: display };
    });

  return (
    <div className="complete-wrap">
      <div className="complete-head">INTAKE SUMMARY</div>
      {rows.map((row) => (
        <div key={row.key} className="summary-row">
          <div className="s-key">{row.label}</div>
          <div className="s-val">{row.value}</div>
        </div>
      ))}
      <div className="complete-footer">TRANSMITTED // AMTECH TEAM NOTIFIED</div>
    </div>
  );
}
