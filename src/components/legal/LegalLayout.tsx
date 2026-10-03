import type { ReactNode } from 'react';

/**
 * Shared chrome for the legal routes (/privacy, /terms).
 *
 * These pages exist to be read and to be linked from the Google OAuth consent screen,
 * so they stay deliberately plain: no animation, no gating, high contrast, real text in
 * the DOM. Everything a verification reviewer needs is reachable without JS interaction.
 */

export function LegalPage({
  title,
  intro,
  effective,
  children,
}: {
  title: string;
  intro: string;
  effective: string;
  children: ReactNode;
}) {
  return (
    <>
      <section className="bg-[#FAFAFA] pt-32 pb-10 md:pt-40 md:pb-14">
        <div className="container-wide">
          <p className="mono-label text-black/30">Legal</p>
          <h1 className="mt-4 max-w-3xl font-display text-display-lg text-black">{title}</h1>
          <p className="mt-6 max-w-2xl font-body text-body-lg leading-relaxed text-black/50">{intro}</p>
          <p className="mt-6 font-mono text-sm text-black/30">Effective {effective}</p>
        </div>
      </section>

      <section className="bg-white">
        <div className="container-wide py-12 md:py-20">
          <div className="max-w-3xl">{children}</div>
        </div>
      </section>
    </>
  );
}

export function Section({ heading, children }: { heading: string; children: ReactNode }) {
  return (
    <section className="mb-12 md:mb-14">
      <h2 className="font-display text-xl font-bold tracking-[-0.01em] text-black md:text-2xl">{heading}</h2>
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  );
}

/** A section that reviewers need to find fast — bordered so it reads as a callout. */
export function Highlight({ heading, children }: { heading: string; children: ReactNode }) {
  return (
    <section className="mb-12 rounded-2xl border border-red/20 bg-red-50/40 p-6 md:mb-14 md:p-8">
      <h2 className="font-display text-xl font-bold tracking-[-0.01em] text-black md:text-2xl">{heading}</h2>
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  );
}

export function P({ children }: { children: ReactNode }) {
  return <p className="font-body text-body-md leading-relaxed text-black/60">{children}</p>;
}

export function UL({ items }: { items: ReactNode[] }) {
  return (
    <ul className="space-y-2.5">
      {items.map((item, i) => (
        <li key={i} className="flex gap-3 font-body text-body-md leading-relaxed text-black/60">
          <span aria-hidden="true" className="mt-[0.6em] h-1 w-1 shrink-0 rounded-full bg-red" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function A({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-black underline decoration-red/40 underline-offset-2 transition-colors hover:decoration-red"
    >
      {children}
    </a>
  );
}
