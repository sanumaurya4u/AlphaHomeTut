import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, BookOpen, GraduationCap, Briefcase, CheckCircle2, Loader2, FileText, Shield, Crown } from 'lucide-react';
import { updateTutorProfile } from '@/services/tutorService';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';

export default function TutorProfile({ profile, setProfile }) {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
    phone: profile?.phone || '',
    city: profile?.city || '',
    qualification: profile?.qualification || '',
    experience: profile?.experience || '',
    subjects: profile?.subjects || '',
    gender: profile?.gender || '',
    address: profile?.address || '',
    tenth_marks: profile?.tenth_marks || '',
    twelfth_marks: profile?.twelfth_marks || '',
    college: profile?.college || '',
    preferred_classes: profile?.preferred_classes || '',
    preferred_subjects: profile?.preferred_subjects || '',
    expected_salary: profile?.expected_salary || ''
  });

  // Sync state if profile prop updates
  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        phone: profile.phone || '',
        city: profile.city || '',
        qualification: profile.qualification || '',
        experience: profile.experience || '',
        subjects: profile.subjects || '',
        gender: profile.gender || '',
        address: profile.address || '',
        tenth_marks: profile.tenth_marks || '',
        twelfth_marks: profile.twelfth_marks || '',
        college: profile.college || '',
        preferred_classes: profile.preferred_classes || '',
        preferred_subjects: profile.preferred_subjects || '',
        expected_salary: profile.expected_salary || ''
      });
    }
  }, [profile]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      let updated;
      if (profile?.id) {
        updated = await updateTutorProfile(profile.id, formData);
      } else {
        // If profile was somehow not auto-created, create it now
        const { supabase } = await import('@/supabase/config');
        const { data, error } = await supabase
          .from('tutors')
          .insert([{
            ...formData,
            email: user?.email || profile?.email,
            profile_id: user?.id,
            status: 'Pending'
          }])
          .select()
          .single();
        if (error) throw error;
        updated = data;
      }
      setProfile(updated);
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Update profile error:', error);
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800 placeholder-gray-400 focus:border-secondary focus:ring-1 focus:ring-secondary transition-all text-sm";
  const labelClass = "block text-xs text-gray-500 font-medium mb-1.5";
  const viewBlockClass = "flex items-center gap-3 text-primary font-medium bg-gray-50/50 p-3.5 rounded-xl border border-gray-100 min-h-[48px] text-sm";

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8 pb-8 border-b border-gray-100">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 bg-secondary rounded-2xl flex items-center justify-center text-primary text-3xl font-bold shadow-md">
              {profile?.full_name?.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase() || 'U'}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-primary">{profile?.full_name}</h2>
              <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                <span className="text-gray-500 text-sm flex items-center gap-1"><Mail className="w-4 h-4"/> {profile?.email}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-gray-300 hidden sm:inline-block"></span>
                <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${
                  profile?.status === 'Verified' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                }`}>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {profile?.status || 'Pending'}
                </span>
              </div>
            </div>
          </div>
          <button 
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            disabled={loading}
            className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 justify-center ${
              isEditing ? 'bg-secondary text-primary hover:bg-secondary-light hover:shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            {isEditing ? 'Save Changes' : 'Edit Profile'}
          </button>
        </div>

        {/* 1. Personal & Contact Details */}
        <div className="mb-8">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-5 flex items-center gap-2">
            <User className="w-4.5 h-4.5 text-secondary" /> Personal & Contact Details
          </h3>
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <label className={labelClass}>Full Name</label>
              {isEditing ? (
                <input type="text" name="full_name" value={formData.full_name} onChange={handleChange} className={inputClass} />
              ) : (
                <div className={viewBlockClass}>
                  <User className="w-5 h-5 text-gray-400" /> {profile?.full_name}
                </div>
              )}
            </div>
            
            <div>
              <label className={labelClass}>Phone Number</label>
              {isEditing ? (
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className={inputClass} />
              ) : (
                <div className={viewBlockClass}>
                  <Phone className="w-5 h-5 text-gray-400" /> {profile?.phone || 'Not provided'}
                </div>
              )}
            </div>

            <div>
              <label className={labelClass}>Gender</label>
              {isEditing ? (
                <select name="gender" value={formData.gender} onChange={handleChange} className={inputClass}>
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              ) : (
                <div className={viewBlockClass}>
                  <User className="w-5 h-5 text-gray-400" /> {profile?.gender || 'Not provided'}
                </div>
              )}
            </div>

            <div>
              <label className={labelClass}>City/Location</label>
              {isEditing ? (
                <input type="text" name="city" value={formData.city} onChange={handleChange} className={inputClass} />
              ) : (
                <div className={viewBlockClass}>
                  <MapPin className="w-5 h-5 text-gray-400" /> {profile?.city || 'Not provided'}
                </div>
              )}
            </div>

            <div className="sm:col-span-2">
              <label className={labelClass}>Full Address</label>
              {isEditing ? (
                <input type="text" name="address" value={formData.address} onChange={handleChange} className={inputClass} placeholder="Enter your detailed street address" />
              ) : (
                <div className={viewBlockClass}>
                  <MapPin className="w-5 h-5 text-gray-400" /> {profile?.address || 'Not provided'}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 2. Academic Credentials */}
        <div className="mb-8 pt-6 border-t border-gray-100">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-5 flex items-center gap-2">
            <GraduationCap className="w-4.5 h-4.5 text-secondary" /> Academic Credentials
          </h3>
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <label className={labelClass}>Highest Qualification</label>
              {isEditing ? (
                <select name="qualification" value={formData.qualification} onChange={handleChange} className={inputClass}>
                  <option value="">Select Qualification</option>
                  {['B.A.', 'B.Sc.', 'B.Com.', 'B.Tech.', 'BCA', 'BBA', 'M.A.', 'M.Sc.', 'M.Com.', 'M.Tech.', 'MCA', 'MBA', 'B.Ed.', 'Ph.D.', 'Other'].map(q => <option key={q} value={q}>{q}</option>)}
                </select>
              ) : (
                <div className={viewBlockClass}>
                  <GraduationCap className="w-5 h-5 text-gray-400" /> {profile?.qualification || 'Not provided'}
                </div>
              )}
            </div>

            <div>
              <label className={labelClass}>College / University</label>
              {isEditing ? (
                <input type="text" name="college" value={formData.college} onChange={handleChange} className={inputClass} placeholder="Enter college name" />
              ) : (
                <div className={viewBlockClass}>
                  <GraduationCap className="w-5 h-5 text-gray-400" /> {profile?.college || 'Not provided'}
                </div>
              )}
            </div>

            <div>
              <label className={labelClass}>10th Marks (%)</label>
              {isEditing ? (
                <input type="text" name="tenth_marks" value={formData.tenth_marks} onChange={handleChange} className={inputClass} placeholder="e.g. 85%" />
              ) : (
                <div className={viewBlockClass}>
                  <FileText className="w-5 h-5 text-gray-400" /> {profile?.tenth_marks || 'Not provided'}
                </div>
              )}
            </div>

            <div>
              <label className={labelClass}>12th Marks (%)</label>
              {isEditing ? (
                <input type="text" name="twelfth_marks" value={formData.twelfth_marks} onChange={handleChange} className={inputClass} placeholder="e.g. 80%" />
              ) : (
                <div className={viewBlockClass}>
                  <FileText className="w-5 h-5 text-gray-400" /> {profile?.twelfth_marks || 'Not provided'}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 3. Teaching Preferences & Requirements */}
        <div className="mb-6 pt-6 border-t border-gray-100">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-5 flex items-center gap-2">
            <Briefcase className="w-4.5 h-4.5 text-secondary" /> Teaching Preferences
          </h3>
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <label className={labelClass}>Teaching Experience</label>
              {isEditing ? (
                <select name="experience" value={formData.experience} onChange={handleChange} className={inputClass}>
                  <option value="">Select Experience</option>
                  {['Fresher', '6 months - 1 year', '1-2 Years', '2-5 Years', '5-10 Years', '10+ Years'].map(e => <option key={e} value={e}>{e}</option>)}
                </select>
              ) : (
                <div className={viewBlockClass}>
                  <Briefcase className="w-5 h-5 text-gray-400" /> {profile?.experience || 'Not provided'}
                </div>
              )}
            </div>

            <div>
              <label className={labelClass}>Expected Salary (₹/month)</label>
              {isEditing ? (
                <select name="expected_salary" value={formData.expected_salary} onChange={handleChange} className={inputClass}>
                  <option value="">Select Range</option>
                  {['₹1,000 - ₹2,000', '₹2,000 - ₹3,000', '₹3,000 - ₹5,000', '₹5,000 - ₹8,000', '₹8,000 - ₹12,000', '₹12,000+'].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              ) : (
                <div className={viewBlockClass}>
                  <Briefcase className="w-5 h-5 text-gray-400" /> {profile?.expected_salary || 'Not provided'}
                </div>
              )}
            </div>

            <div>
              <label className={labelClass}>Preferred Classes</label>
              {isEditing ? (
                <select name="preferred_classes" value={formData.preferred_classes} onChange={handleChange} className={inputClass}>
                  <option value="">Select Classes</option>
                  {['Class 1-5', 'Class 6-8', 'Class 9-10', 'Class 11-12', 'All Classes'].map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              ) : (
                <div className={viewBlockClass}>
                  <BookOpen className="w-5 h-5 text-gray-400" /> {profile?.preferred_classes || 'Not provided'}
                </div>
              )}
            </div>

            <div>
              <label className={labelClass}>Preferred Subjects</label>
              {isEditing ? (
                <input type="text" name="preferred_subjects" value={formData.preferred_subjects} onChange={handleChange} className={inputClass} placeholder="e.g. Mathematics, Science" />
              ) : (
                <div className={viewBlockClass}>
                  <BookOpen className="w-5 h-5 text-gray-400" /> {profile?.preferred_subjects || 'Not provided'}
                </div>
              )}
            </div>

            <div className="sm:col-span-2">
              <label className={labelClass}>Subject Expertise (All subjects you can teach)</label>
              {isEditing ? (
                <input type="text" name="subjects" value={formData.subjects} onChange={handleChange} placeholder="e.g. Math, Physics, Chemistry, English" className={inputClass} />
              ) : (
                <div className={viewBlockClass}>
                  <BookOpen className="w-5 h-5 text-gray-400" /> {profile?.subjects || 'Not provided'}
                </div>
              )}
            </div>
          </div>
        </div>

        {isEditing && (
          <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
            <button 
              onClick={() => {
                setIsEditing(false);
                setFormData({
                  full_name: profile?.full_name || '',
                  phone: profile?.phone || '',
                  city: profile?.city || '',
                  qualification: profile?.qualification || '',
                  experience: profile?.experience || '',
                  subjects: profile?.subjects || '',
                  gender: profile?.gender || '',
                  address: profile?.address || '',
                  tenth_marks: profile?.tenth_marks || '',
                  twelfth_marks: profile?.twelfth_marks || '',
                  college: profile?.college || '',
                  preferred_classes: profile?.preferred_classes || '',
                  preferred_subjects: profile?.preferred_subjects || '',
                  expected_salary: profile?.expected_salary || ''
                });
              }}
              className="text-gray-500 font-bold text-sm hover:text-gray-700 mr-4 transition-colors"
            >
              Cancel
            </button>
          </div>
        )}

      </div>
    </motion.div>
  );
}

