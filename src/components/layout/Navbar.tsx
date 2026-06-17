import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowRight } from 'lucide-react';

const navLinks = [
  { label: 'Our Work', to: '/our-work' },
  { label: 'Operator Program', to: '/wholesale-2' },
];

const darkPages = ['/', '/wholesale', '/wholesale-2', '/our-work'];

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
        className={`mx-auto max-w-7xl rounded-full transition-all duration-700 ${
          isScrolled
            ? isDarkPage
              ? 'bg-white/72 backdrop-blur-2xl border border-white/50 shadow-[0_18px_70px_rgba(0,0,0,0.18)] ring-1 ring-black/[0.03]'
              : 'bg-white/72 backdrop-blur-2xl border border-white/60 shadow-[0_18px_70px_rgba(0,0,0,0.14)] ring-1 ring-black/[0.04]'
            : isDarkPage
              ? 'bg-white/58 backdrop-blur-2xl border border-white/50 shadow-[0_12px_50px_rgba(0,0,0,0.10)] ring-1 ring-black/[0.03]'
              : 'bg-white/58 backdrop-blur-2xl border border-white/50 shadow-[0_12px_50px_rgba(0,0,0,0.10)] ring-1 ring-black/[0.03]'
        }`}
      >
        <div className="flex h-14 lg:h-16 items-center justify-between px-6 lg:px-8">
          <Link to="/" className="inline-flex items-baseline">
            <span className={`font-display text-base lg:text-lg font-black tracking-[0.06em] text-black`}>
              AMTECH
            </span>
            <span className="text-base lg:text-lg font-black text-red">.</span>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`relative font-body text-[13px] font-medium transition-colors duration-300 ${
                  location.pathname === link.to
                    ? 'text-black'
                    : 'text-black/45 hover:text-black/75'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden items-center md:flex">
            <Link
              to="/schedule-demo"
              className="inline-flex items-center gap-2 rounded-full bg-red px-5 py-2 text-[13px] font-semibold text-white shadow-red-glow-btn transition-all duration-300 hover:bg-red-bright active:scale-[0.98]"
            >
              Book a Call
              <ArrowRight size={14} />
            </Link>
          </div>

          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="flex h-10 w-10 items-center justify-center text-black/55 transition-colors hover:text-black md:hidden"
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
            className="mx-auto mt-2 max-w-7xl overflow-hidden rounded-3xl border border-white/60 bg-white/92 shadow-nav backdrop-blur-2xl md:hidden"
          >
            <div className="flex flex-col gap-1 px-6 py-6">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-4 py-3 font-body text-base font-medium transition-colors ${
                    location.pathname === link.to
                      ? 'text-black'
                      : 'text-black/55 hover:text-black'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="mt-4 border-t border-black/[0.06] pt-4">
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
