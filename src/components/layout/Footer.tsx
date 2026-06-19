import { Link, useLocation } from 'react-router-dom';

const links = [
  { label: 'How It Works', to: '/how-it-works' },
  { label: 'About', to: '/about' },
  { label: 'Pricing', to: '/pricing' },
  { label: 'Agent Skills', to: '/skills' },
  { label: 'Contact', to: '/schedule-demo' },
];

const darkPages = ['/', '/wholesale', '/wholesale-2', '/our-work'];

export default function Footer() {
  const location = useLocation();
  const isDark = darkPages.includes(location.pathname);

  return (
    <footer className={`border-t ${isDark ? 'border-white/[0.04] bg-black' : 'border-black/[0.06] bg-white'}`}>
      <div className="container-wide py-12 md:py-16">
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div className="inline-flex items-baseline">
            <span className={`font-display text-lg font-black tracking-[0.06em] ${isDark ? 'text-white' : 'text-black'}`}>
              AMTECH
            </span>
            <span className="text-lg font-black text-red">.</span>
          </div>

          <div className="flex flex-wrap items-center gap-6 md:gap-8">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`font-body text-sm transition-colors duration-300 ${
                  isDark ? 'text-white/30 hover:text-white/60' : 'text-black/40 hover:text-black/70'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className={`mt-8 flex flex-col gap-4 border-t pt-8 md:flex-row md:items-center md:justify-between ${
          isDark ? 'border-white/[0.04]' : 'border-black/[0.06]'
        }`}>
          <div className="flex flex-wrap items-center gap-6">
            <a
              href="tel:+18058869173"
              className={`font-mono text-sm transition-colors ${isDark ? 'text-white/20 hover:text-white/40' : 'text-black/30 hover:text-black/50'}`}
            >
              (805) 886-9173
            </a>
            <a
              href="mailto:ben@amtechai.com"
              className={`font-mono text-sm transition-colors ${isDark ? 'text-white/20 hover:text-white/40' : 'text-black/30 hover:text-black/50'}`}
            >
              ben@amtechai.com
            </a>
          </div>

          <p className={`font-body text-sm ${isDark ? 'text-white/15' : 'text-black/25'}`}>
            &copy; {new Date().getFullYear()} AMTECH.
          </p>
        </div>
      </div>
    </footer>
  );
}
