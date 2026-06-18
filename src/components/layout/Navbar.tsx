import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowRight } from 'lucide-react';

const navLinks = [
  { label: 'Learn AI', to: '/articles' },
  { label: 'Our Work', to: '/our-work' },
  { label: 'Sales Bootcamp', to: '/sales-bootcamp' },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();

  const activeNavTextClass = 'text-black opacity-100';
  const mutedNavTextClass = 'text-black/70 hover:text-black';

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  return (
    <nav className="fixed top-0 left-0 z-50 w-full overflow-x-clip">
      <div
        className={`relative left-1/2 w-[75dvw] max-w-[calc(100vw-16px)] -translate-x-1/2 overflow-hidden border-x-2 border-b-2 border-black backdrop-blur-2xl transition-all duration-300 before:pointer-events-none before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_18%_0%,rgba(255,255,255,0.82),transparent_30%),radial-gradient(circle_at_82%_100%,rgba(225,29,42,0.1),transparent_34%),linear-gradient(135deg,rgba(255,255,255,0.9),rgba(255,255,255,0.66),rgba(255,255,255,0.84))] before:opacity-95 ${
          isScrolled ? 'bg-white/86' : 'bg-white/72'
        }`}
      >
        <div className="relative z-10 flex h-14 items-center justify-between px-4 sm:px-6 lg:h-16 lg:px-8">
          <Link to="/" className="inline-flex items-baseline text-black transition-opacity hover:opacity-80">
            <span className="font-display text-base font-black tracking-[0.06em] lg:text-lg">
              AMTECH
            </span>
            <span className="text-base font-black text-red lg:text-lg">.</span>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`relative font-body text-[13px] font-semibold transition-colors duration-300 ${
                  location.pathname === link.to ? activeNavTextClass : mutedNavTextClass
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden items-center md:flex">
            <Link
              to="/schedule-demo"
              className="inline-flex items-center gap-2 rounded-none bg-black px-5 py-2 text-[13px] font-semibold text-white transition-all duration-300 hover:bg-black/80 active:scale-[0.98]"
            >
              Book a Call
              <ArrowRight size={14} />
            </Link>
          </div>

          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="flex h-10 w-10 items-center justify-center text-black transition-opacity hover:opacity-80 md:hidden"
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
            className="relative left-1/2 w-[75dvw] max-w-[calc(100vw-16px)] -translate-x-1/2 overflow-hidden border-x-2 border-b-2 border-black bg-white/86 backdrop-blur-2xl md:hidden"
          >
            <div className="relative z-10 flex flex-col gap-1 px-6 py-6">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-4 py-3 font-body text-base font-medium transition-colors ${
                    location.pathname === link.to ? activeNavTextClass : mutedNavTextClass
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
