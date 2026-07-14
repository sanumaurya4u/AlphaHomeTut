import { useState, useEffect } from 'react';
import { supabase } from '@/supabase/config';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';
import { User, Phone, Mail, Save, Loader2 } from 'lucide-react';

export default function StudentProfile() {
  const { user, profile, refreshProfile } = useAuth();
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '');
      setPhone(profile.phone || '');
    }
  }, [profile]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fullName.trim()) {
      toast.error('Name is required');
      return;
    }

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: fullName.trim(),
          phone: phone.trim(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) throw error;

      await refreshProfile();
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  const inputClass = 'w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 text-gray-800 focus:border-secondary transition-all text-sm';
  const labelClass = 'block text-primary font-semibold text-sm mb-2';

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-primary/5 p-6 md:p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-primary">Profile Settings</h2>
        <p className="text-gray-500 text-sm mt-1">Update your personal information to help us contact you.</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6 max-w-xl">
        <div>
          <label className={labelClass}><User className="w-4 h-4 inline mr-1.5 text-secondary" />Full Name</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Your Full Name"
            className={inputClass}
          />
        </div>
        
        <div>
          <label className={labelClass}><Mail className="w-4 h-4 inline mr-1.5 text-secondary" />Email Address (Read-only)</label>
          <input
            type="email"
            value={user?.email || ''}
            disabled
            className={`${inputClass} bg-gray-50 text-gray-400 cursor-not-allowed border-gray-100`}
          />
        </div>
        
        <div>
          <label className={labelClass}><Phone className="w-4 h-4 inline mr-1.5 text-secondary" />Phone Number</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Your Phone Number"
            className={inputClass}
          />
        </div>
        
        <button
          type="submit"
          disabled={isSaving}
          className="bg-primary hover:bg-primary-light text-white font-bold px-6 py-3.5 rounded-xl text-sm transition-all hover:shadow-lg hover:shadow-primary/20 flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}
