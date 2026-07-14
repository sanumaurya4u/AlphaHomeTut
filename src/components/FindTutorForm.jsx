import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Search, User, BookOpen, MapPin, Clock, IndianRupee, Monitor, Home } from 'lucide-react';
import { createDemoRequest } from '@/services/demoRequestService';
import { useAuth } from '@/context/AuthContext';
import AuthModal from './AuthModal';

export default function FindTutorForm() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    studentName: '', studentClass: '', subject: '', location: '',
    timing: '', budget: '', mode: 'home',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }

    if (!formData.studentName || !formData.studentClass || !formData.subject || !formData.location) {
      toast.error('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      await createDemoRequest({
        profile_id: user.id,
        phone: profile?.phone || '',
        student_name: formData.studentName,
        class: formData.studentClass,
        subject: formData.subject,
        location: formData.location,
        timing: formData.timing || null,
        budget: formData.budget || null,
        mode: formData.mode === 'home' ? 'Home Tuition' : 'Online Classes',
        status: 'Pending',
      });
      toast.success('Your tuition request has been submitted! We will contact you within 24 hours.', { duration: 5000 });
      setFormData({ studentName: '', studentClass: '', subject: '', location: '', timing: '', budget: '', mode: 'home' });
    } catch (error) {
      console.error('Form submission error:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = 'w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 text-gray-800 placeholder-gray-400 focus:border-secondary transition-all text-sm';
  const labelClass = 'block text-primary font-semibold text-sm mb-2';

  return (
    <>
    <section id="find-tutor" className="py-20 md:py-28 bg-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-12">
          <span className="text-secondary font-semibold text-sm uppercase tracking-widest">Find Your Tutor</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary mt-3 mb-4">Submit Your <span className="gradient-text">Requirement</span></h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">Tell us what you need and we will find the perfect tutor for you.</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl shadow-primary/5 border border-gray-100 p-8 md:p-10 relative overflow-hidden">
          
          {!user && (
            <div 
              onClick={() => setIsAuthModalOpen(true)}
              className="absolute inset-0 bg-white/5 backdrop-blur-[0.5px] cursor-pointer z-10"
              title="Please login to find a tutor"
            />
          )}

          <form onSubmit={handleSubmit}>
            <fieldset disabled={!user} className="space-y-6 border-0 p-0 m-0">
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className={labelClass}><User className="w-4 h-4 inline mr-1" />Student Name *</label>
                  <input type="text" name="studentName" value={formData.studentName} onChange={handleChange} placeholder="Enter student name" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}><BookOpen className="w-4 h-4 inline mr-1" />Class *</label>
                  <select name="studentClass" value={formData.studentClass} onChange={handleChange} className={inputClass}>
                    <option value="">Select Class</option>
                    {[...Array(12)].map((_, i) => <option key={i} value={i + 1}>Class {i + 1}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClass}><BookOpen className="w-4 h-4 inline mr-1" />Subject *</label>
                  <select name="subject" value={formData.subject} onChange={handleChange} className={inputClass}>
                    <option value="">Select Subject</option>
                    {['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Hindi', 'Accounts', 'Economics', 'Computer Science', 'All Subjects'].map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClass}><MapPin className="w-4 h-4 inline mr-1" />Location *</label>
                  <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="Your area / city" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}><Clock className="w-4 h-4 inline mr-1" />Preferred Timing</label>
                  <select name="timing" value={formData.timing} onChange={handleChange} className={inputClass}>
                    <option value="">Select Timing</option>
                    {['Morning (6-9 AM)', 'Forenoon (9-12 PM)', 'Afternoon (12-3 PM)', 'Evening (3-6 PM)', 'Night (6-9 PM)'].map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClass}><IndianRupee className="w-4 h-4 inline mr-1" />Budget (Monthly)</label>
                  <select name="budget" value={formData.budget} onChange={handleChange} className={inputClass}>
                    <option value="">Select Budget</option>
                    {['₹1,000 - ₹2,000', '₹2,000 - ₹3,000', '₹3,000 - ₹5,000', '₹5,000 - ₹8,000', '₹8,000+'].map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className={labelClass}>Mode of Learning</label>
                <div className="flex gap-4">
                  {[{ value: 'home', label: 'Home Tuition', icon: Home }, { value: 'online', label: 'Online Classes', icon: Monitor }].map(m => (
                    <label key={m.value} className={`flex-1 flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl border-2 cursor-pointer transition-all text-sm font-medium ${formData.mode === m.value ? 'border-secondary bg-secondary/10 text-primary' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}>
                      <input type="radio" name="mode" value={m.value} checked={formData.mode === m.value} onChange={handleChange} className="hidden" />
                      <m.icon className="w-5 h-5" />{m.label}
                    </label>
                  ))}
                </div>
              </div>

              <button type="submit" disabled={isSubmitting} className="w-full bg-primary hover:bg-primary-light text-white font-bold py-4 rounded-xl text-base transition-all hover:shadow-lg hover:shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed">
                <Search className="w-5 h-5" />{isSubmitting ? 'Submitting...' : 'Find My Tutor'}
              </button>
            </fieldset>
          </form>
        </motion.div>
      </div>
    </section>
    
    <AuthModal 
      isOpen={isAuthModalOpen} 
      onClose={() => setIsAuthModalOpen(false)} 
      onSuccess={() => toast.success('Now you can submit your request!')}
    />
    </>
  );
}
