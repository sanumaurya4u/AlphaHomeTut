import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User, UserPlus, LogIn, Loader2, BookOpen } from 'lucide-react';
import { signIn, signUp } from '@/services/authService';
import toast from 'react-hot-toast';

export default function AuthModal({ isOpen, onClose, onSuccess, role = 'student' }) {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast.error('Please fill in all required fields.');
      return;
    }
    
    if (!isLogin) {
      if (!formData.fullName) {
        toast.error('Full name is required.');
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        toast.error('Passwords do not match.');
        return;
      }
      if (formData.password.length < 6) {
        toast.error('Password must be at least 6 characters.');
        return;
      }
    }

    setLoading(true);
    try {
      if (isLogin) {
        await signIn({ email: formData.email, password: formData.password });
        toast.success('Successfully logged in!');
      } else {
        await signUp({
          email: formData.email,
          password: formData.password,
          fullName: formData.fullName,
          role: role
        });
        toast.success('Account created successfully! You are now logged in.', { duration: 4000 });
      }
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Auth error:', error);
      toast.error(error.message || 'Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = 'w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:border-secondary transition-all text-sm backdrop-blur-sm';

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-primary-dark/80 backdrop-blur-sm"
          />
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-md bg-[#0a2d6e] border border-white/10 shadow-2xl rounded-3xl overflow-hidden pointer-events-auto relative"
            >
              {/* Background decors */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-secondary/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
              
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-white/50 hover:text-white bg-white/5 hover:bg-white/10 p-2 rounded-full transition-colors z-10"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="p-8 relative z-10">
                <div className="text-center mb-6">
                  <div className="w-12 h-12 bg-secondary/20 rounded-xl flex items-center justify-center mx-auto mb-4 border border-secondary/30">
                    <BookOpen className="w-6 h-6 text-secondary" />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-1">
                    {isLogin ? 'Welcome Back' : 'Create Account'}
                  </h2>
                  <p className="text-white/60 text-sm">
                    {isLogin ? 'Login to continue your request' : `Sign up as a ${role}`}
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {!isLogin && (
                    <div>
                      <label className="block text-white/90 font-semibold text-xs mb-1.5">
                        <User className="w-3.5 h-3.5 inline mr-1" />Full Name
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder="Enter your name"
                        className={inputClass}
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-white/90 font-semibold text-xs mb-1.5">
                      <Mail className="w-3.5 h-3.5 inline mr-1" />Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your@email.com"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className="block text-white/90 font-semibold text-xs mb-1.5">
                      <Lock className="w-3.5 h-3.5 inline mr-1" />Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter password"
                      className={inputClass}
                    />
                  </div>

                  {!isLogin && (
                    <div>
                      <label className="block text-white/90 font-semibold text-xs mb-1.5">
                        <Lock className="w-3.5 h-3.5 inline mr-1" />Confirm Password
                      </label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Re-enter password"
                        className={inputClass}
                      />
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-secondary hover:bg-secondary-light text-primary font-bold py-3.5 rounded-xl text-sm transition-all hover:shadow-lg hover:shadow-secondary/30 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
                  >
                    {loading ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</>
                    ) : isLogin ? (
                      <><LogIn className="w-4 h-4" /> Sign In</>
                    ) : (
                      <><UserPlus className="w-4 h-4" /> Sign Up</>
                    )}
                  </button>
                </form>

                <div className="mt-6 text-center">
                  <p className="text-white/50 text-sm">
                    {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
                    <button
                      type="button"
                      onClick={() => setIsLogin(!isLogin)}
                      className="text-secondary font-semibold hover:underline bg-transparent border-none p-0 cursor-pointer"
                    >
                      {isLogin ? 'Sign Up' : 'Sign In'}
                    </button>
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
