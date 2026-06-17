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
        className={`mx-auto max-w-7xl rounded-2xl transition-all duration-700 ${
          isScrolled
            ? isDarkPage
              ? 'bg-black/80 backdrop-blur-2xl border border-white/[0.06] shadow-nav'
              : 'bg-white/80 backdrop-blur-2xl border border-black/[0.06] shadow-nav'
            : isDarkPage
              ? 'bg-black/50 backdrop-blur-xl border border-white/[0.04]'
              : 'bg-white/50 backdrop-blur-xl border border-black/[0.04]'
        }`}
      >
        <div className="flex h-14 lg:h-16 items-center justify-between px-6 lg:px-8">
          <Link to="/" className="inline-flex items-baseline">
            <span className={`font-display text-base lg:text-lg font-black tracking-[0.06em] ${isDarkPage ? 'text-white' : 'text-black'}`}>
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
                    ? isDarkPage ? 'text-white' : 'text-black'
                    : isDarkPage ? 'text-white/40 hover:text-white/70' : 'text-black/40 hover:text-black/70'
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
            className={`flex h-10 w-10 items-center justify-center transition-colors md:hidden ${
              isDarkPage ? 'text-white/50 hover:text-white' : 'text-black/50 hover:text-black'
            }`}
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
            className={`mx-auto mt-2 max-w-7xl overflow-hidden rounded-2xl backdrop-blur-2xl border shadow-nav md:hidden ${
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
                      ? isDarkPage ? 'text-white' : 'text-black'
                      : isDarkPage ? 'text-white/50 hover:text-white' : 'text-black/50 hover:text-black'
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
