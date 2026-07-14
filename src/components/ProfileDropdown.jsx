import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { User, FileText, LogOut, Loader2, Sparkles, ChevronDown } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';

export default function ProfileDropdown({ onItemClick }) {
  const { user, profile, signOutUser, loading } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const handleItemClick = () => {
    setIsOpen(false);
    onItemClick?.();
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    setIsOpen(false);
    onItemClick?.();
    setIsLoggingOut(true);
    try {
      await signOutUser();
      toast.success('Successfully logged out.');
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to log out.');
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (loading || isLoggingOut) {
    return (
      <div className="flex items-center gap-2 bg-white/5 rounded-full pl-1 pr-4 py-1 border border-white/10 animate-pulse">
        <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center">
          <Loader2 className="w-4 h-4 text-secondary animate-spin" />
        </div>
        <div className="w-16 h-4 bg-white/10 rounded"></div>
      </div>
    );
  }

  if (!user) return null;

  const fullName = profile?.full_name || user.email?.split('@')[0] || 'User';
  const firstName = fullName.split(' ')[0];
  const initials = fullName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 bg-white/5 hover:bg-white/10 transition-all rounded-full pl-1.5 pr-3 py-1.5 border border-white/20 focus:outline-none group"
      >
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-secondary to-orange-400 text-primary font-bold flex items-center justify-center shadow-md">
          {initials}
        </div>
        <div className="flex flex-col items-start hidden sm:flex">
          <span className="text-xs text-white/70 font-medium leading-none mb-0.5">Welcome back,</span>
          <span className="text-sm text-white font-bold leading-none truncate max-w-[100px]">{firstName}</span>
        </div>
        <ChevronDown className={`w-4 h-4 text-white/60 transition-transform duration-300 ml-1 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="absolute left-1/2 -translate-x-1/2 lg:left-auto lg:right-0 lg:translate-x-0 mt-3 w-72 max-w-[85vw] sm:max-w-none bg-[#061B45]/95 backdrop-blur-xl rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.4)] border border-white/10 overflow-hidden z-[80]"
          >
            {/* Header Section */}
            <div className="relative p-5 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
              
              <div className="relative z-10 flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-secondary to-orange-400 p-0.5 shadow-lg shadow-secondary/20">
                  <div className="w-full h-full rounded-full bg-[#061B45] flex items-center justify-center">
                    <span className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-br from-secondary to-orange-400">
                      {initials}
                    </span>
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg leading-tight truncate w-40">{fullName}</h3>
                  <p className="text-xs text-white/50 truncate w-40 mb-1">{user.email}</p>
                  <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-widest font-bold bg-white/10 text-secondary px-2 py-0.5 rounded-full border border-secondary/20">
                    <Sparkles className="w-3 h-3" />
                    {profile?.role || 'Student'}
                  </span>
                </div>
              </div>
            </div>

            <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            {/* Menu Items */}
            <div className="p-2 space-y-0.5">
              {profile?.role === 'student' && (
                <>
                  <Link
                    to="/student?tab=profile"
                    onClick={handleItemClick}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-all"
                  >
                    <User className="w-4 h-4 text-secondary" />
                    My Profile
                  </Link>
                  <Link
                    to="/student?tab=requests"
                    onClick={handleItemClick}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-all"
                  >
                    <FileText className="w-4 h-4 text-secondary" />
                    My Requests
                  </Link>
                </>
              )}

              {profile?.role === 'tutor' && (
                <Link
                  to="/dashboard"
                  onClick={handleItemClick}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-all"
                >
                  <User className="w-4 h-4 text-secondary" />
                  Tutor Dashboard
                </Link>
              )}

              {profile?.role === 'admin' && (
                <Link
                  to="/admin/dashboard"
                  onClick={handleItemClick}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-all"
                >
                  <User className="w-4 h-4 text-secondary" />
                  Admin Dashboard
                </Link>
              )}
            </div>

            <div className="p-2 bg-black/20">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-xl transition-all"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
