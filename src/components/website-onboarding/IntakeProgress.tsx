interface IntakeProgressProps {
  percentage: number;
}

export default function IntakeProgress({ percentage }: IntakeProgressProps) {
  return (
    <div className="t-progress">
      <div className="prog-label">INTAKE PROGRESS</div>
      <div className="prog-track">
        <div className="prog-fill" style={{ width: `${percentage}%` }} />
      </div>
      <div className="prog-pct">{percentage}%</div>
    </div>
  );
}
