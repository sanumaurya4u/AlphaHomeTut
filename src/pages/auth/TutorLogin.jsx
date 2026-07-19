import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Mail, Lock, LogIn, Loader2, GraduationCap } from 'lucide-react';
import { signIn, signInWithGoogle } from '@/services/authService';
import GoogleSignInButton from '@/components/GoogleSignInButton';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/supabase/config';

export default function TutorLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { refreshProfile } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in all fields.');
      return;
    }
    setLoading(true);
    try {
      // Sign in the user
      const { user } = await signIn({ email, password });
      
      // Fetch profile to verify role
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();
        
      if (error) throw error;
      
      if (profile.role !== 'tutor') {
        await supabase.auth.signOut();
        throw new Error('Access denied. This portal is for tutors only.');
      }

      await refreshProfile();
      toast.success('Welcome back, Tutor!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Tutor Login error:', error);
      toast.error(error.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { user } = await signInWithGoogle();
      
      // Allow time for database trigger to create profile if new user
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();
        
      if (error) throw error;
      
      if (profile.role !== 'tutor') {
        await supabase.auth.signOut();
        throw new Error('Access denied. This portal is for tutors only.');
      }

      await refreshProfile();
      toast.success('Welcome back, Tutor!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Tutor Google Login error:', error);
      toast.error(error.message || 'Google login failed.');
    }
  };


  const inputClass = "w-full bg-[#061B45]/50 border border-white/20 rounded-xl px-4 py-3.5 text-white placeholder-white/40 focus:border-secondary transition-all text-sm backdrop-blur-sm";

  return (
    <div className="min-h-screen bg-[#061B45] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />
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
            Tutor <span className="text-secondary">Portal</span>
          </h1>
          <p className="text-white/60">Sign in to manage your tutoring career</p>
        </div>

        <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 md:p-10 border border-white/10 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-white/90 font-semibold text-sm mb-2">
                <Mail className="w-4 h-4 inline mr-1" />Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className={inputClass}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-secondary hover:bg-secondary-light text-primary font-bold py-4 rounded-xl text-base transition-all hover:shadow-lg hover:shadow-secondary/30 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Signing in...</>
              ) : (
                <><LogIn className="w-5 h-5" /> Sign In</>
              )}
            </button>

            <div className="relative flex items-center gap-4 my-6">
              <div className="flex-1 border-t border-white/20"></div>
              <span className="text-white/50 text-sm font-medium">or</span>
              <div className="flex-1 border-t border-white/20"></div>
            </div>

            <GoogleSignInButton
              onClick={handleGoogleLogin}
              label="Sign in with Google"
            />
          </form>

          <p className="text-center text-white/50 text-sm mt-6">
            Don't have a tutor account?{' '}
            <Link to="/tutor/register" className="text-secondary font-semibold hover:underline">
              Register Here
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
