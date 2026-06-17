interface GlowEffectProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'h-32 w-32',
  md: 'h-64 w-64',
  lg: 'h-96 w-96',
};

export default function GlowEffect({
  className = '',
  size = 'md',
}: GlowEffectProps) {
  return (
    <div
      className={`pointer-events-none absolute rounded-full blur-[100px] ${sizeClasses[size]} bg-red/20 ${className}`}
      aria-hidden="true"
    />
  );
}
