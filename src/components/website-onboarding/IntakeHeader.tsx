interface IntakeHeaderProps {
  sessionCode: string;
}

export default function IntakeHeader({ sessionCode }: IntakeHeaderProps) {
  return (
    <div className="t-header">
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div className="logo-mark">AMTECH</div>
        <div className="logo-sub">
          American Marketing Technology&nbsp;&nbsp;//&nbsp;&nbsp;Client Intake
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: 5,
          position: 'relative',
          zIndex: 1,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div className="status-dot" />
          <div className="status-label">LIVE SESSION</div>
        </div>
        <div className="session-id">{sessionCode}</div>
      </div>
    </div>
  );
}
