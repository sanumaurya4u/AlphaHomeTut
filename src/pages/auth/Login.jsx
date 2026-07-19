import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Mail, Lock, LogIn, Loader2 } from 'lucide-react';
import { signIn, signInWithGoogle } from '@/services/authService';
import GoogleSignInButton from '@/components/GoogleSignInButton';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in all fields.');
      return;
    }
    setLoading(true);
    try {
      await signIn({ email, password });
      toast.success('Welcome back!');
      navigate('/home');
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

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
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            Welcome <span className="gradient-text">Back</span>
          </h1>
          <p className="text-white/60">Sign in to access Alpha Home Tuition</p>
        </div>

        <div className="glass rounded-3xl p-8 md:p-10">
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
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3.5 text-white placeholder-white/40 focus:border-secondary transition-all text-sm backdrop-blur-sm"
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
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3.5 text-white placeholder-white/40 focus:border-secondary transition-all text-sm backdrop-blur-sm"
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
              onClick={async () => {
                try {
                  await signInWithGoogle();
                  toast.success('Welcome back!');
                  navigate('/home');
                } catch (error) {
                  console.error('Google login error:', error);
                  toast.error(error.message || 'Google login failed.');
                }
              }}
              label="Sign in with Google"
            />
          </form>

          <p className="text-center text-white/50 text-sm mt-6">
            Don't have an account?{' '}
            <Link to="/signup" className="text-secondary font-semibold hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
