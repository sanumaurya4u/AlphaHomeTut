import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Mail, Lock, User, UserPlus, Loader2, GraduationCap, BookOpen } from 'lucide-react';
import { signUp } from '@/services/authService';

export default function Signup() {
  const [formData, setFormData] = useState({
    fullName: '', email: '', password: '', confirmPassword: '', role: '',
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.password || !formData.role) {
      toast.error('Please fill in all required fields.');
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
        role: formData.role,
      });
      toast.success('Account created successfully! Please check your email to confirm.', { duration: 6000 });
      navigate('/login');
    } catch (error) {
      console.error('Signup error:', error);
      toast.error(error.message || 'Failed to create account.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = 'w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3.5 text-white placeholder-white/40 focus:border-secondary transition-all text-sm backdrop-blur-sm';

  return (
    <div className="min-h-screen gradient-animated flex items-center justify-center px-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-72 h-72 bg-secondary/8 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-secondary/5 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative z-10 py-8"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            Create <span className="gradient-text">Account</span>
          </h1>
          <p className="text-white/60">Join Alpha Home Tuition today</p>
        </div>

        <div className="glass rounded-3xl p-8 md:p-10">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-white/90 font-semibold text-sm mb-2">
                <User className="w-4 h-4 inline mr-1" />Full Name *
              </label>
              <input
                type="text" name="fullName" value={formData.fullName}
                onChange={handleChange} placeholder="Enter your full name"
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-white/90 font-semibold text-sm mb-2">
                <Mail className="w-4 h-4 inline mr-1" />Email Address *
              </label>
              <input
                type="email" name="email" value={formData.email}
                onChange={handleChange} placeholder="your@email.com"
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-white/90 font-semibold text-sm mb-2">I am a... *</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: 'student', label: 'Student / Parent', icon: BookOpen },
                  { value: 'tutor', label: 'Tutor', icon: GraduationCap },
                ].map((r) => (
                  <label
                    key={r.value}
                    className={`flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl border-2 cursor-pointer transition-all text-sm font-medium ${
                      formData.role === r.value
                        ? 'border-secondary bg-secondary/15 text-white'
                        : 'border-white/20 text-white/50 hover:border-white/40'
                    }`}
                  >
                    <input
                      type="radio" name="role" value={r.value}
                      checked={formData.role === r.value}
                      onChange={handleChange} className="hidden"
                    />
                    <r.icon className="w-5 h-5" />{r.label}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-white/90 font-semibold text-sm mb-2">
                <Lock className="w-4 h-4 inline mr-1" />Password *
              </label>
              <input
                type="password" name="password" value={formData.password}
                onChange={handleChange} placeholder="Min. 6 characters"
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-white/90 font-semibold text-sm mb-2">
                <Lock className="w-4 h-4 inline mr-1" />Confirm Password *
              </label>
              <input
                type="password" name="confirmPassword" value={formData.confirmPassword}
                onChange={handleChange} placeholder="Re-enter password"
                className={inputClass}
              />
            </div>

            <button
              type="submit" disabled={loading}
              className="w-full bg-secondary hover:bg-secondary-light text-primary font-bold py-4 rounded-xl text-base transition-all hover:shadow-lg hover:shadow-secondary/30 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Creating Account...</>
              ) : (
                <><UserPlus className="w-5 h-5" /> Create Account</>
              )}
            </button>
          </form>

          <p className="text-center text-white/50 text-sm mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-secondary font-semibold hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
