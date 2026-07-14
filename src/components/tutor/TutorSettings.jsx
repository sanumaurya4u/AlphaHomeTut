import { useState } from 'react';
import { motion } from 'framer-motion';
import { Key, Bell, Eye, ShieldCheck, Loader2, CheckCircle2 } from 'lucide-react';
import { supabase } from '@/supabase/config';
import toast from 'react-hot-toast';

export default function TutorSettings() {
  const [password, setPassword] = useState({ current: '', new: '', confirm: '' });
  const [loading, setLoading] = useState(false);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (password.new !== password.confirm) {
      toast.error('New passwords do not match');
      return;
    }
    if (password.new.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: password.new });
      if (error) throw error;
      toast.success('Password updated successfully');
      setPassword({ current: '', new: '', confirm: '' });
    } catch (error) {
      toast.error(error.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800 placeholder-gray-400 focus:border-secondary focus:ring-1 focus:ring-secondary transition-all text-sm";

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-primary mb-2">Account Settings</h2>
        <p className="text-gray-500">Manage your password, privacy, and preferences.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Security */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
              <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                <Key className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-primary">Change Password</h3>
            </div>
            
            <form onSubmit={handlePasswordChange} className="space-y-5">
              <div>
                <label className="block text-sm text-gray-600 font-medium mb-1.5">New Password</label>
                <input 
                  type="password" 
                  value={password.new} 
                  onChange={(e) => setPassword({ ...password, new: e.target.value })} 
                  className={inputClass} 
                  placeholder="Minimum 6 characters" 
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 font-medium mb-1.5">Confirm New Password</label>
                <input 
                  type="password" 
                  value={password.confirm} 
                  onChange={(e) => setPassword({ ...password, confirm: e.target.value })} 
                  className={inputClass} 
                  placeholder="Re-enter new password" 
                />
              </div>
              <button 
                type="submit" 
                disabled={loading}
                className="bg-primary text-white hover:bg-primary-light font-bold px-6 py-3 rounded-xl text-sm transition-all flex items-center justify-center gap-2 mt-2"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                Update Password
              </button>
            </form>
          </div>

          {/* Preferences */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
              <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl">
                <Bell className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-primary">Notification Preferences</h3>
            </div>
            <div className="space-y-4">
              {[
                { label: 'Email alerts for new tuitions in my area', checked: true },
                { label: 'SMS alerts for demo scheduling', checked: true },
                { label: 'Weekly earnings report email', checked: false },
                { label: 'Marketing and promotional emails', checked: false },
              ].map((pref, i) => (
                <label key={i} className="flex items-center gap-3 cursor-pointer group">
                  <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${pref.checked ? 'bg-secondary border-secondary' : 'border-gray-300 group-hover:border-secondary'}`}>
                    {pref.checked && <CheckCircle2 className="w-3.5 h-3.5 text-primary" />}
                  </div>
                  <span className="text-gray-700 text-sm font-medium">{pref.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gradient-to-br from-[#061B45] to-[#0A265E] rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
            <ShieldCheck className="w-10 h-10 text-secondary mb-4 relative z-10" />
            <h3 className="text-xl font-bold mb-2 relative z-10">Privacy & Security</h3>
            <p className="text-white/60 text-sm leading-relaxed relative z-10 mb-6">
              Your data is encrypted and securely stored. We never share your personal contact details with students until a demo is scheduled and approved by you.
            </p>
            <button className="w-full bg-white/10 hover:bg-white/20 transition-colors py-3 rounded-xl text-sm font-bold relative z-10">
              Read Privacy Policy
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-red-100 shadow-sm p-6 sm:p-8 text-center">
            <h3 className="text-red-600 font-bold mb-2">Danger Zone</h3>
            <p className="text-gray-500 text-xs mb-4">Once you delete your account, there is no going back. Please be certain.</p>
            <button className="w-full border-2 border-red-100 text-red-600 hover:bg-red-50 font-bold py-3 rounded-xl text-sm transition-all">
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
