import { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { UserPlus, GraduationCap, BookOpen, Briefcase, Phone, MapPin, Upload, Loader2 } from 'lucide-react';
import { registerTutor } from '@/services/tutorService';
import { createNotification } from '@/services/notificationService';
import { NOTIFICATION_TYPES } from '@/constants';

export default function BecomeTutorForm() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    tutorName: '', qualification: '', subjects: '', experience: '',
    phone: '', city: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.tutorName || !formData.qualification || !formData.subjects || !formData.phone) {
      toast.error('Please fill in all required fields.');
      return;
    }
    setLoading(true);
    try {
      await registerTutor({
        full_name: formData.tutorName,
        phone: formData.phone,
        email: '',
        degree: formData.qualification,
        subjects: formData.subjects,
        experience: formData.experience,
        city: formData.city,
        status: 'Pending',
      });
      await createNotification({
        type: NOTIFICATION_TYPES.NEW_TUTOR,
        title: 'New Tutor Application',
        message: `Quick application from ${formData.tutorName}`,
        referenceType: 'tutor',
      });
      toast.success('Your application has been submitted! Our team will review and contact you soon.', { duration: 5000 });
      setFormData({ tutorName: '', qualification: '', subjects: '', experience: '', phone: '', city: '' });
    } catch (error) {
      console.error('Tutor application error:', error);
      toast.error(error.message || 'Submission failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = 'w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3.5 text-white placeholder-white/40 focus:border-secondary transition-all text-sm backdrop-blur-sm';
  const labelClass = 'block text-white/90 font-semibold text-sm mb-2';

  return (
    <section id="become-tutor" className="py-20 md:py-28 gradient-animated relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-secondary/8 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-secondary/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-12">
          <span className="text-secondary font-semibold text-sm uppercase tracking-widest">Join Our Team</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mt-3 mb-4">Become a <span className="gradient-text">Tutor</span></h2>
          <p className="text-white/60 max-w-2xl mx-auto text-lg">Join our growing network of educators and start earning by teaching students near you.</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-3xl mx-auto glass rounded-3xl p-8 md:p-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className={labelClass}><UserPlus className="w-4 h-4 inline mr-1" />Full Name *</label>
                <input type="text" name="tutorName" value={formData.tutorName} onChange={handleChange} placeholder="Your full name" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}><GraduationCap className="w-4 h-4 inline mr-1" />Qualification *</label>
                <select name="qualification" value={formData.qualification} onChange={handleChange} className={inputClass}>
                  <option value="" className="text-gray-800">Select Qualification</option>
                  {['B.A.', 'B.Sc.', 'B.Com.', 'B.Tech.', 'M.A.', 'M.Sc.', 'M.Com.', 'M.Tech.', 'B.Ed.', 'Ph.D.', 'Other'].map(q => <option key={q} value={q} className="text-gray-800">{q}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}><BookOpen className="w-4 h-4 inline mr-1" />Subjects *</label>
                <input type="text" name="subjects" value={formData.subjects} onChange={handleChange} placeholder="e.g. Math, Physics" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}><Briefcase className="w-4 h-4 inline mr-1" />Experience</label>
                <select name="experience" value={formData.experience} onChange={handleChange} className={inputClass}>
                  <option value="" className="text-gray-800">Select Experience</option>
                  {['Fresher', '1-2 Years', '2-5 Years', '5-10 Years', '10+ Years'].map(e => <option key={e} value={e} className="text-gray-800">{e}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}><Phone className="w-4 h-4 inline mr-1" />Phone Number *</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Your phone number" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}><MapPin className="w-4 h-4 inline mr-1" />City</label>
                <input type="text" name="city" value={formData.city} onChange={handleChange} placeholder="Your city" className={inputClass} />
              </div>
            </div>

            <div>
              <label className={labelClass}><Upload className="w-4 h-4 inline mr-1" />Upload Resume</label>
              <div className="border-2 border-dashed border-white/20 rounded-xl p-6 text-center hover:border-secondary/50 transition-colors cursor-pointer">
                <Upload className="w-8 h-8 text-white/40 mx-auto mb-2" />
                <p className="text-white/50 text-sm">Click to upload or drag and drop</p>
                <p className="text-white/30 text-xs mt-1">PDF, DOC up to 5MB</p>
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full bg-secondary hover:bg-secondary-light text-primary font-bold py-4 rounded-xl text-base transition-all hover:shadow-lg hover:shadow-secondary/30 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed">
              {loading ? <><Loader2 className="w-5 h-5 animate-spin" />Submitting...</> : <><UserPlus className="w-5 h-5" />Submit Application</>}
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
