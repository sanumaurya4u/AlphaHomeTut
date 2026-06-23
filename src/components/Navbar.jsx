import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';

const navLinks = [
  { name: 'Home', href: '#home', route: '/' },
  { name: 'About', href: '#about', route: '/#about' },
  { name: 'Services', href: '#services', route: '/#services' },
  { name: 'Find Tutor', href: '#find-tutor', route: '/#find-tutor' },
  { name: 'Become Tutor', href: '#become-tutor', route: '/#become-tutor' },
  { name: 'Contact', href: '#contact', route: '/#contact' },
];

const legalLinks = [
  { name: 'Terms & Conditions', route: '/terms' },
  { name: 'Privacy Policy', route: '/privacy' },
  { name: 'Refund Policy', route: '/refund' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [legalOpen, setLegalOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Unified click handler that works on single tap for both mobile and desktop
  const handleNavClick = useCallback((href, route) => {
    setIsOpen(false);
    setLegalOpen(false);
    if (isHome) {
      // On home page, smooth scroll to the section
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else {
      // On other pages, navigate to home with hash
      navigate(route);
    }
  }, [isHome, navigate]);

  const handleBookDemo = useCallback(() => {
    setIsOpen(false);
    if (isHome) {
      document.querySelector('#find-tutor')?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/#find-tutor');
    }
  }, [isHome, navigate]);

  // Toggle legal dropdown on click (works with single tap on mobile)
  const toggleLegal = useCallback(() => {
    setLegalOpen(prev => !prev);
  }, []);

  // Close legal dropdown when clicking outside
  useEffect(() => {
    if (!legalOpen) return;
    const handleClickOutside = () => setLegalOpen(false);
    // Delay adding the listener so the current click doesn't immediately close it
    const timer = setTimeout(() => {
      document.addEventListener('click', handleClickOutside);
    }, 0);
    return () => {
      clearTimeout(timer);
      document.removeEventListener('click', handleClickOutside);
    };
  }, [legalOpen]);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-primary/95 backdrop-blur-md shadow-lg shadow-primary-dark/30'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link
            to="/"
            className="nav-link flex items-center gap-2 group bg-white rounded-xl py-1 px-3 shadow-md border border-white/20 transition-all hover:shadow-lg hover:scale-[1.02]"
          >
            <img src="/logo.png" alt="Alpha Home Tuition" className="h-10 md:h-12 w-auto object-contain" />
          </Link>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link.name}
                type="button"
                onClick={() => handleNavClick(link.href, link.route)}
                className="nav-link text-white/80 hover:text-secondary px-3 py-2 text-sm font-medium transition-colors relative group"
              >
                {link.name}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-secondary transition-all duration-300 group-hover:w-3/4 rounded-full" />
              </button>
            ))}

            {/* Legal Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={toggleLegal}
                onMouseEnter={() => setLegalOpen(true)}
                onMouseLeave={() => setLegalOpen(false)}
                className="nav-link text-white/80 hover:text-secondary px-3 py-2 text-sm font-medium transition-colors flex items-center gap-1"
              >
                Legal <ChevronDown className={`w-3.5 h-3.5 transition-transform ${legalOpen ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {legalOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 mt-1 bg-white rounded-xl shadow-xl border border-gray-100 py-2 min-w-48 overflow-hidden"
                    onMouseEnter={() => setLegalOpen(true)}
                    onMouseLeave={() => setLegalOpen(false)}
                  >
                    {legalLinks.map((link) => (
                      <Link
                        key={link.name}
                        to={link.route}
                        onClick={() => setLegalOpen(false)}
                        className="nav-link block px-4 py-2.5 text-sm text-gray-700 hover:bg-secondary/10 hover:text-primary transition-colors font-medium"
                      >
                        {link.name}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Plans link */}
            <Link
              to="/membership"
              className={`nav-link text-white/80 hover:text-secondary px-3 py-2 text-sm font-medium transition-colors relative group ${location.pathname === '/membership' ? 'text-secondary' : ''}`}
            >
              Plans
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-secondary transition-all duration-300 group-hover:w-3/4 rounded-full" />
            </Link>
          </div>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              to="/register"
              className="nav-link text-white/80 hover:text-secondary px-4 py-2 text-sm font-medium transition-colors"
            >
              Register
            </Link>
            <button
              type="button"
              onClick={handleBookDemo}
              className="nav-link bg-secondary text-primary font-bold px-6 py-2.5 rounded-full text-sm hover:bg-secondary-light transition-all hover:shadow-lg hover:shadow-secondary/30 pulse-glow"
            >
              Book Free Demo
            </button>
          </div>

          {/* Mobile Toggle */}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="nav-link lg:hidden text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-primary-dark/98 backdrop-blur-lg border-t border-white/10 overflow-hidden"
          >
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((link, i) => (
                <motion.button
                  key={link.name}
                  type="button"
                  onClick={() => handleNavClick(link.href, link.route)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="nav-link block w-full text-left text-white/80 hover:text-secondary hover:bg-white/5 px-4 py-3 rounded-lg text-sm font-medium transition-all"
                >
                  {link.name}
                </motion.button>
              ))}

              {/* Mobile Legal Links */}
              <div className="border-t border-white/10 pt-3 mt-3">
                <p className="px-4 py-2 text-white/40 text-xs font-semibold uppercase tracking-wider">Legal</p>
                {legalLinks.map((link, i) => (
                  <motion.div key={link.name} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: (navLinks.length + i) * 0.05 }}>
                    <Link to={link.route} onClick={() => setIsOpen(false)} className="nav-link block text-white/60 hover:text-secondary hover:bg-white/5 px-4 py-3 rounded-lg text-sm font-medium transition-all">
                      {link.name}
                    </Link>
                  </motion.div>
                ))}
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: (navLinks.length + 3) * 0.05 }}>
                  <Link to="/membership" onClick={() => setIsOpen(false)} className="nav-link block text-white/60 hover:text-secondary hover:bg-white/5 px-4 py-3 rounded-lg text-sm font-medium transition-all">
                    Membership Plans
                  </Link>
                </motion.div>
              </div>

              <div className="pt-3 space-y-2">
                <Link to="/register" onClick={() => setIsOpen(false)} className="nav-link block text-center bg-white/10 border border-white/20 text-white font-semibold px-6 py-3 rounded-full text-sm hover:bg-white/20 transition-all">
                  Register as Tutor
                </Link>
                <button
                  type="button"
                  onClick={handleBookDemo}
                  className="nav-link block w-full text-center bg-secondary text-primary font-bold px-6 py-3 rounded-full text-sm hover:bg-secondary-light transition-all"
                >
                  Book Free Demo
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
