import type { ReactNode } from 'react';

interface SectionWrapperProps {
  children: ReactNode;
  variant?: 'dark' | 'elevated' | 'light' | 'white';
  className?: string;
  id?: string;
  fullHeight?: boolean;
  container?: 'wide' | 'narrow' | 'none';
}

const variantClasses = {
  dark: 'section-dark',
  elevated: 'section-elevated',
  light: 'section-light',
  white: 'section-white',
};

const containerClasses = {
  wide: 'container-wide',
  narrow: 'container-narrow',
  none: '',
};

export default function SectionWrapper({
  children,
  variant = 'dark',
  className = '',
  id,
  fullHeight = false,
  container = 'wide',
}: SectionWrapperProps) {
  return (
    <section
      id={id}
      className={`relative ${variantClasses[variant]} ${fullHeight ? 'min-h-screen' : ''} ${className}`}
    >
      <div className={`${containerClasses[container]} py-20 md:py-28 lg:py-34`}>
        {children}
      </div>
    </section>
  );
}
