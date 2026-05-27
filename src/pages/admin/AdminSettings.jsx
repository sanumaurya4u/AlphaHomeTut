import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { User, Lock, Loader2, Shield } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/supabase/client';
import { changePasswordSchema } from '@/utils/validators';
import PageHeader from '@/components/admin/PageHeader';

export default function AdminSettings() {
  const { user, adminData } = useAuth();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { newPassword: '', confirmPassword: '' },
  });

  const onSubmit = async (data) => {
    try {
      const { error } = await supabase.auth.updateUser({ password: data.newPassword });
      if (error) throw error;
      toast.success('Password updated successfully!');
      reset();
    } catch (error) {
      toast.error(error.message || 'Failed to update password');
    }
  };

  const inputClass = 'w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 outline-none focus:border-primary/30 focus:bg-white transition-all';

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <PageHeader title="Settings" description="Manage your admin account" />

      <div className="max-w-2xl space-y-6">
        {/* Profile Card */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <User className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-base font-bold text-gray-900">Profile Information</h3>
          </div>
          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-400 text-xs mb-1">Name</p>
              <p className="font-medium text-gray-800">{adminData?.name || 'Admin'}</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs mb-1">Email</p>
              <p className="font-medium text-gray-800">{user?.email || '—'}</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs mb-1">Role</p>
              <p className="font-medium text-gray-800 flex items-center gap-1"><Shield className="w-3.5 h-3.5 text-secondary" /> Administrator</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs mb-1">Account ID</p>
              <p className="font-mono text-gray-500 text-xs">{user?.id?.slice(0, 12)}...</p>
            </div>
          </div>
        </div>

        {/* Change Password Card */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <Lock className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-base font-bold text-gray-900">Change Password</h3>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">New Password</label>
              <input {...register('newPassword')} type="password" placeholder="Enter new password" className={inputClass} />
              {errors.newPassword && <p className="text-red-500 text-xs mt-1">{errors.newPassword.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password</label>
              <input {...register('confirmPassword')} type="password" placeholder="Confirm new password" className={inputClass} />
              {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
            </div>
            <button type="submit" disabled={isSubmitting} className="bg-primary text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-primary-light transition-colors disabled:opacity-60 flex items-center gap-2">
              {isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Updating...</> : 'Update Password'}
            </button>
          </form>
        </div>
      </div>
    </motion.div>
  );
}
