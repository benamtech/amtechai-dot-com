import { Link } from 'react-router-dom';

interface LogoProps {
  className?: string;
}

export default function Logo({ className = '' }: LogoProps) {
  return (
    <Link to="/" className={`inline-flex items-baseline ${className}`}>
      <span className="font-display text-xl font-black tracking-[0.06em] text-black">
        AMTECH
      </span>
      <span className="text-red font-black text-xl">.</span>
    </Link>
  );
}
