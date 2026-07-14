import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Mail, Lock, UserPlus, Loader2, GraduationCap, User } from 'lucide-react';
import { signUp } from '@/services/authService';

export default function TutorRegister() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.password || !formData.confirmPassword) {
      toast.error('Please fill in all fields.');
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

    setLoading(true);
    try {
      await signUp({
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
        role: 'tutor'
      });
      toast.success('Registration successful! Please login.');
      navigate('/tutor/login');
    } catch (error) {
      console.error('Tutor Registration error:', error);
      toast.error(error.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full bg-[#061B45]/50 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:border-secondary transition-all text-sm backdrop-blur-sm";

  return (
    <div className="min-h-screen bg-[#061B45] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-secondary/10 rounded-full blur-[100px] -translate-y-1/2 -translate-x-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-[100px] translate-y-1/2 translate-x-1/2" />
        <div className="hero-grid-floor opacity-30"><div className="hero-grid-inner" /></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center justify-center p-3 bg-white/5 rounded-2xl backdrop-blur-md border border-white/10 mb-4 shadow-xl hover:bg-white/10 hover:scale-[1.02] transition-all">
            <img src="/AHT-logo.svg" alt="AlphaHomeTut Logo" className="h-8 w-8 object-contain" />
          </Link>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2 tracking-tight">
            Join as <span className="text-secondary">Tutor</span>
          </h1>
          <p className="text-white/60">Create your account to start earning</p>
        </div>

        <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 md:p-10 border border-white/10 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-white/90 font-semibold text-sm mb-2">
                <User className="w-4 h-4 inline mr-1" />Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="John Doe"
                className={inputClass}
              />
            </div>
            
            <div>
              <label className="block text-white/90 font-semibold text-sm mb-2">
                <Mail className="w-4 h-4 inline mr-1" />Email Address
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
              <label className="block text-white/90 font-semibold text-sm mb-2">
                <Lock className="w-4 h-4 inline mr-1" />Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password"
                className={inputClass}
              />
            </div>
            
            <div>
              <label className="block text-white/90 font-semibold text-sm mb-2">
                <Lock className="w-4 h-4 inline mr-1" />Confirm Password
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

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-secondary hover:bg-secondary-light text-primary font-bold py-4 rounded-xl text-base transition-all hover:shadow-lg hover:shadow-secondary/30 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Registering...</>
              ) : (
                <><UserPlus className="w-5 h-5" /> Create Account</>
              )}
            </button>
          </form>

          <p className="text-center text-white/50 text-sm mt-6">
            Already have an account?{' '}
            <Link to="/tutor/login" className="text-secondary font-semibold hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
