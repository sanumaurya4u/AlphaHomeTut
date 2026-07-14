import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, GraduationCap, Home, LayoutGrid, Search, UserPlus, Mail } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import ProfileDropdown from './ProfileDropdown';
import AuthModal from './AuthModal';
const navLinks = [
  { name: 'Home', route: '/student', icon: Home },
  { name: 'Services', route: '/services', icon: LayoutGrid },
  { name: 'Find Tutor', route: '/find-tutor', icon: Search },
  { name: 'Contact', route: '/contact', icon: Mail },
  { name: 'About', route: '/about', icon: null },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  
  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = useCallback((route) => {
    setIsOpen(false);
    navigate(route);
  }, [navigate]);

  // Bottom Nav items for mobile (exactly 4 main items)
  const bottomNavItems = [
    { name: 'Home', icon: Home, route: '/student' },
    { name: 'Services', icon: LayoutGrid, route: '/services' },
    { name: 'Find', icon: Search, route: '/find-tutor' },
    { name: 'Contact', icon: Mail, route: '/contact' },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-[70] transition-all duration-300 ${
          scrolled || !isHome
            ? 'bg-primary/95 backdrop-blur-md shadow-lg shadow-primary-dark/30'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link
              to="/"
              className="nav-link flex items-center gap-2 group bg-white/10 rounded-xl py-2 px-4 backdrop-blur-sm border border-white/20 transition-all hover:bg-white/20 hover:scale-[1.02]"
            >
              <img src="/AHT-logo.svg" alt="AlphaHomeTut Logo" className="h-9 w-9 object-contain rounded-lg" />
              <div className="flex flex-col">
                <span className="text-xl font-bold text-white leading-none tracking-tight">Alpha<span className="text-secondary">Home</span>Tut</span>
                <span className="text-[10px] text-white/70 font-medium uppercase tracking-widest mt-0.5">Education Portal</span>
              </div>
            </Link>

            {/* Desktop Links (Hidden on minimal homepage) */}
            {!isHome && (
              <div className="hidden lg:flex items-center gap-1">
                {navLinks.map((link) => (
                  <button
                    key={link.name}
                    type="button"
                    onClick={() => handleNavClick(link.route)}
                    className={`nav-link px-3 py-2 text-sm font-medium transition-colors relative group ${
                      location.pathname === link.route
                        ? 'text-secondary'
                        : 'text-white/80 hover:text-secondary'
                    }`}
                  >
                    {link.name}
                    <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-secondary transition-all duration-300 rounded-full ${
                      location.pathname === link.route
                        ? 'w-3/4'
                        : 'w-0 group-hover:w-3/4'
                    }`} />
                  </button>
                ))}
              </div>
            )}

            {/* Right Side: CTAs & Profile */}
            <div className="hidden lg:flex items-center gap-3">
              {user ? (
                <ProfileDropdown />
              ) : (
                  <button
                    onClick={() => setIsAuthModalOpen(true)}
                    className="nav-link bg-secondary/10 border border-secondary/20 text-secondary font-bold px-6 py-2 rounded-xl text-sm hover:bg-secondary/20 transition-all"
                  >
                    Login
                  </button>
              )}
            </div>

            {/* Mobile Menu Toggle Button */}
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 rounded-xl text-white/80 hover:text-secondary hover:bg-white/5 transition-all focus:outline-none"
              aria-label={isOpen ? "Close Menu" : "Open Menu"}
            >
              {isOpen ? (
                <X className="w-6 h-6 transition-transform duration-300 rotate-90" />
              ) : (
                <Menu className="w-6 h-6 transition-transform duration-300" />
              )}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Bottom Navigation Bar (Hidden on homepage) */}
      {!isHome && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-[50] bg-primary/95 backdrop-blur-xl border-t border-white/10 px-1 py-2 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.3)]">
          <div className="flex items-center justify-around h-14">
            {bottomNavItems.map((item) => {
              const isActive = location.pathname === item.route;
              return (
                <button
                  key={item.name}
                  onClick={() => handleNavClick(item.route)}
                  className={`flex flex-col items-center justify-center gap-0.5 min-w-0 flex-1 transition-all ${isActive ? 'text-secondary' : 'text-white/60'}`}
                >
                  <item.icon className={`w-4 h-4 ${isActive ? 'scale-110' : ''}`} />
                  <span className="text-[8px] font-semibold uppercase tracking-wide leading-tight">{item.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Mobile Menu Overlay (Slides down from top) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: '-100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="lg:hidden fixed inset-0 z-[60] bg-primary-dark/98 backdrop-blur-lg flex flex-col"
          >
            <div className="flex-1 overflow-y-auto pt-24 pb-32 px-6">
              <div className="space-y-1">
                {user && (
                  <div className="flex justify-center mb-6">
                    <ProfileDropdown onItemClick={() => setIsOpen(false)} />
                  </div>
                )}
                
                {!isHome && (
                  <>
                    <p className="px-4 py-2 text-white/30 text-[10px] font-bold uppercase tracking-[0.2em]">Navigation</p>
                    {navLinks.map((link, i) => (
                      <motion.button
                        key={link.name}
                        type="button"
                        onClick={() => handleNavClick(link.route)}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="nav-link flex items-center gap-4 w-full text-left text-white/80 hover:text-secondary hover:bg-white/5 px-4 py-3.5 rounded-xl text-sm font-semibold transition-all"
                      >
                        {link.icon && <link.icon className="w-4 h-4 opacity-50" />}
                        {link.name}
                      </motion.button>
                    ))}
                  </>
                )}

                <div className="pt-6 space-y-3 border-t border-white/10 mt-6">
                  {!user && (
                      <button 
                        onClick={() => { setIsOpen(false); setIsAuthModalOpen(true); }} 
                        className="nav-link block w-full text-center bg-secondary/10 border border-secondary/20 text-secondary font-bold px-6 py-3.5 rounded-xl text-sm hover:bg-secondary/20 transition-all shadow-lg shadow-secondary/10"
                      >
                        Login
                      </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        role="student"
      />
    </>
  );
}
