import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowRight } from 'lucide-react';

const navLinks = [
  { label: 'Learn AI', to: '/articles/amtech-vs-chatgpt-claude' },
  { label: 'Our Work', to: '/our-work' },
  { label: 'Sales Bootcamp', to: '/sales-bootcamp' },
];

const glassTextPill = 'rounded-full bg-white/82 px-3 py-1.5 text-black shadow-[0_1px_12px_rgba(255,255,255,0.34)] backdrop-blur-md';

const darkPages = ['/wholesale', '/wholesale-2', '/our-work'];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();

  const isDarkPage = darkPages.includes(location.pathname);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-4 pt-4 md:px-6 md:pt-5">
      <div
        className={`relative mx-auto max-w-7xl overflow-hidden rounded-[1.35rem] border shadow-nav backdrop-blur-2xl transition-all duration-700 before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:bg-[radial-gradient(circle_at_18%_0%,rgba(255,255,255,0.28),transparent_28%),linear-gradient(135deg,rgba(255,255,255,0.18),rgba(225,29,42,0.08),rgba(255,255,255,0.04))] before:opacity-80 ${
          isDarkPage
            ? isScrolled
              ? 'bg-black/72 border-white/[0.12]'
              : 'bg-black/42 border-white/[0.16]'
            : isScrolled
              ? 'bg-white/72 border-white/70'
              : 'bg-white/48 border-white/60'
        }`}
      >
        <div className="relative z-10 flex h-14 items-center justify-between px-6 lg:h-16 lg:px-8">
          <Link to="/" className={`inline-flex items-baseline ${glassTextPill}`}>
            <span className="font-display text-base font-black tracking-[0.06em] text-black lg:text-lg">
              AMTECH
            </span>
            <span className="text-base lg:text-lg font-black text-red">.</span>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`relative font-body text-[13px] font-semibold transition-colors duration-300 ${glassTextPill} ${
                  location.pathname === link.to
                    ? 'text-black'
                    : 'text-black/62 hover:text-black'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden items-center md:flex">
            <Link
              to="/schedule-demo"
              className={`inline-flex items-center gap-2 px-5 py-2 text-[13px] font-semibold rounded-none transition-all duration-300 active:scale-[0.98] ${
                isDarkPage
                  ? 'bg-white text-black hover:bg-white/90'
                  : 'bg-black text-white hover:bg-black/80'
              }`}
            >
              Book a Call
              <ArrowRight size={14} />
            </Link>
          </div>

          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className={`flex h-10 w-10 items-center justify-center transition-colors md:hidden ${glassTextPill} hover:text-black`}
            aria-label="Toggle menu"
          >
            {isMobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className={`mx-auto mt-2 max-w-7xl overflow-hidden rounded-[1.35rem] backdrop-blur-2xl border shadow-nav md:hidden ${
              isDarkPage
                ? 'bg-black/90 border-white/[0.06]'
                : 'bg-white/90 border-black/[0.06]'
            }`}
          >
            <div className="flex flex-col gap-1 px-6 py-6">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-4 py-3 font-body text-base font-medium transition-colors ${
                    location.pathname === link.to
                      ? `${glassTextPill} font-semibold`
                      : `${glassTextPill} text-black/70 hover:text-black`
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className={`mt-4 border-t pt-4 ${isDarkPage ? 'border-white/[0.06]' : 'border-black/[0.06]'}`}>
                <Link
                  to="/schedule-demo"
                  className="btn-primary w-full"
                >
                  Book a Call
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
