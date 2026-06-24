import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  User, Phone, Mail, MapPin, BookOpen, GraduationCap, Briefcase,
  Upload, Camera, CreditCard, FileText, Shield, Crown, CheckCircle2,
  ArrowLeft, ArrowRight, Sparkles, ChevronRight, Loader2
} from 'lucide-react';
import { registerTutor } from '@/services/tutorService';

const stepTitles = [
  { title: 'Personal Details', icon: User },
  { title: 'Education', icon: GraduationCap },
  { title: 'Experience', icon: Briefcase },
  { title: 'Documents', icon: Upload },
  { title: 'Membership', icon: Crown },
  { title: 'Declaration', icon: Shield },
];

export default function TutorRegistration() {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '', phone: '', email: '', address: '', city: '', gender: '',
    tenthMarks: '', twelfthMarks: '', degree: '', college: '', subjects: '',
    experience: '', preferredClasses: '', preferredSubjects: '', expectedSalary: '',
    passportPhoto: null, aadharCard: null, marksheet: null, degreeCert: null,
    membership: '',
    acceptTerms: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const validateStep = () => {
    switch (step) {
      case 0:
        if (!formData.fullName || !formData.phone || !formData.email || !formData.city || !formData.gender) {
          toast.error('Please fill in all required fields.');
          return false;
        }
        if (!/^\d{10}$/.test(formData.phone)) {
          toast.error('Please enter a valid 10-digit phone number.');
          return false;
        }
        if (!/\S+@\S+\.\S+/.test(formData.email)) {
          toast.error('Please enter a valid email address.');
          return false;
        }
        return true;
      case 1:
        if (!formData.tenthMarks || !formData.twelfthMarks || !formData.degree || !formData.subjects) {
          toast.error('Please fill in all required fields.');
          return false;
        }
        return true;
      case 2:
        if (!formData.experience || !formData.preferredClasses || !formData.preferredSubjects) {
          toast.error('Please fill in all required fields.');
          return false;
        }
        return true;
      case 3:
        return true; // Document upload is UI-only
      case 4:
        if (!formData.membership) {
          toast.error('Please select a membership plan.');
          return false;
        }
        return true;
      case 5:
        if (!formData.acceptTerms) {
          toast.error('Please accept the Terms & Conditions.');
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep()) {
      if (step < 5) setStep(step + 1);
    }
  };

  const prevStep = () => {
    if (step > 0) setStep(step - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;

    setIsSubmitting(true);
    try {
      await registerTutor({
        full_name: formData.fullName,
        phone: formData.phone,
        email: formData.email,
        address: formData.address || null,
        city: formData.city,
        gender: formData.gender,
        tenth_marks: formData.tenthMarks,
        twelfth_marks: formData.twelfthMarks,
        degree: formData.degree,
        college: formData.college || null,
        subjects: formData.subjects,
        experience: formData.experience,
        preferred_classes: formData.preferredClasses,
        preferred_subjects: formData.preferredSubjects,
        expected_salary: formData.expectedSalary || null,
        membership: formData.membership,
        qualification: formData.degree,
        status: 'Pending',
      });
      setSubmitted(true);
      toast.success('Registration submitted successfully! Our team will review your application.', { duration: 6000 });
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = 'w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 text-gray-800 placeholder-gray-400 focus:border-secondary transition-all text-sm';
  const labelClass = 'block text-primary font-semibold text-sm mb-2';

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, type: 'spring' }}
          className="bg-white rounded-3xl shadow-2xl p-10 md:p-16 text-center max-w-lg w-full"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
            className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle2 className="w-12 h-12 text-emerald-500" />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <h2 className="text-3xl font-bold text-primary mb-3">Registration Successful!</h2>
            <p className="text-gray-600 mb-2">Thank you, <strong>{formData.fullName}</strong>!</p>
            <p className="text-gray-500 text-sm mb-8">Your application has been submitted successfully. Our team will review your documents and contact you within 24-48 hours.</p>
            <div className="bg-primary/5 rounded-xl p-4 mb-8">
              <p className="text-sm text-primary font-medium">Membership Selected: <span className="text-secondary font-bold">{formData.membership}</span></p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/" className="inline-flex items-center justify-center gap-2 bg-primary text-white font-bold px-6 py-3 rounded-xl text-sm hover:bg-primary-light transition-all">
                Back to Home
              </Link>
              <Link to="/dashboard" className="inline-flex items-center justify-center gap-2 bg-secondary text-primary font-bold px-6 py-3 rounded-xl text-sm hover:bg-secondary-light transition-all">
                View Dashboard
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="gradient-animated py-16 md:py-20 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-10 right-10 w-72 h-72 bg-secondary/8 rounded-full blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              Tutor <span className="gradient-text">Registration</span>
            </h1>
            <p className="text-white/60 max-w-xl mx-auto text-base">
              Join Alpha Home Tuition and start your teaching career today.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10 pb-20">
        {/* Stepper */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8"
        >
          <div className="flex items-center justify-between overflow-x-auto pb-2">
            {stepTitles.map((s, i) => (
              <div key={i} className="flex items-center flex-shrink-0">
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                    i < step ? 'bg-emerald-500 text-white' :
                    i === step ? 'bg-secondary text-primary shadow-lg shadow-secondary/30' :
                    'bg-gray-100 text-gray-400'
                  }`}>
                    {i < step ? <CheckCircle2 className="w-5 h-5" /> : <s.icon className="w-5 h-5" />}
                  </div>
                  <span className={`text-xs mt-2 font-medium hidden sm:block ${
                    i <= step ? 'text-primary' : 'text-gray-400'
                  }`}>{s.title}</span>
                </div>
                {i < stepTitles.length - 1 && (
                  <div className={`w-8 md:w-16 h-0.5 mx-2 transition-colors ${
                    i < step ? 'bg-emerald-500' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Form */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
            >
              {/* Step Title */}
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-secondary/15 rounded-xl flex items-center justify-center">
                  {(() => { const Icon = stepTitles[step].icon; return <Icon className="w-5 h-5 text-secondary" />; })()}
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Step {step + 1} of 6</p>
                  <h2 className="text-xl font-bold text-primary">{stepTitles[step].title}</h2>
                </div>
              </div>

              {/* Step 0: Personal Details */}
              {step === 0 && (
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className={labelClass}>Full Name *</label>
                    <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Enter your full name" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Phone Number *</label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="10-digit phone number" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Email Address *</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="your@email.com" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>City *</label>
                    <input type="text" name="city" value={formData.city} onChange={handleChange} placeholder="Your city" className={inputClass} />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={labelClass}>Address</label>
                    <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Full address" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Gender *</label>
                    <select name="gender" value={formData.gender} onChange={handleChange} className={inputClass}>
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Step 1: Educational Details */}
              {step === 1 && (
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className={labelClass}>10th Marks (%) *</label>
                    <input type="text" name="tenthMarks" value={formData.tenthMarks} onChange={handleChange} placeholder="e.g. 85%" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>12th Marks (%) *</label>
                    <input type="text" name="twelfthMarks" value={formData.twelfthMarks} onChange={handleChange} placeholder="e.g. 80%" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Graduation Degree *</label>
                    <select name="degree" value={formData.degree} onChange={handleChange} className={inputClass}>
                      <option value="">Select Degree</option>
                      {['B.A.', 'B.Sc.', 'B.Com.', 'B.Tech.', 'BCA', 'BBA', 'M.A.', 'M.Sc.', 'M.Com.', 'M.Tech.', 'MCA', 'MBA', 'B.Ed.', 'Ph.D.', 'Other'].map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>College Name</label>
                    <input type="text" name="college" value={formData.college} onChange={handleChange} placeholder="Your college/university" className={inputClass} />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={labelClass}>Subject Expertise *</label>
                    <input type="text" name="subjects" value={formData.subjects} onChange={handleChange} placeholder="e.g. Mathematics, Physics, Chemistry" className={inputClass} />
                  </div>
                </div>
              )}

              {/* Step 2: Experience */}
              {step === 2 && (
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className={labelClass}>Teaching Experience *</label>
                    <select name="experience" value={formData.experience} onChange={handleChange} className={inputClass}>
                      <option value="">Select Experience</option>
                      {['Fresher', '6 months - 1 year', '1-2 Years', '2-5 Years', '5-10 Years', '10+ Years'].map(e => <option key={e} value={e}>{e}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Preferred Classes *</label>
                    <select name="preferredClasses" value={formData.preferredClasses} onChange={handleChange} className={inputClass}>
                      <option value="">Select Classes</option>
                      {['Class 1-5', 'Class 6-8', 'Class 9-10', 'Class 11-12', 'All Classes'].map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Preferred Subjects *</label>
                    <input type="text" name="preferredSubjects" value={formData.preferredSubjects} onChange={handleChange} placeholder="e.g. Maths, Science" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Expected Salary (₹/month)</label>
                    <select name="expectedSalary" value={formData.expectedSalary} onChange={handleChange} className={inputClass}>
                      <option value="">Select Range</option>
                      {['₹1,000 - ₹2,000', '₹2,000 - ₹3,000', '₹3,000 - ₹5,000', '₹5,000 - ₹8,000', '₹8,000 - ₹12,000', '₹12,000+'].map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
              )}

              {/* Step 3: Document Upload */}
              {step === 3 && (
                <div className="grid sm:grid-cols-2 gap-6">
                  {[
                    { name: 'passportPhoto', label: 'Passport Size Photo', icon: Camera, accept: '.jpg,.jpeg,.png' },
                    { name: 'aadharCard', label: 'Aadhar Card', icon: CreditCard, accept: '.jpg,.jpeg,.png,.pdf' },
                    { name: 'marksheet', label: '10th/12th Marksheet', icon: FileText, accept: '.jpg,.jpeg,.png,.pdf' },
                    { name: 'degreeCert', label: 'Degree Certificate', icon: GraduationCap, accept: '.jpg,.jpeg,.png,.pdf' },
                  ].map((doc) => (
                    <div key={doc.name}>
                      <label className={labelClass}><doc.icon className="w-4 h-4 inline mr-1" />{doc.label}</label>
                      <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-secondary/50 transition-colors cursor-pointer group">
                        <Upload className="w-8 h-8 text-gray-300 group-hover:text-secondary mx-auto mb-2 transition-colors" />
                        <p className="text-gray-400 text-sm">Click to upload</p>
                        <p className="text-gray-300 text-xs mt-1">JPG, PNG, PDF up to 5MB</p>
                        {formData[doc.name] && (
                          <p className="text-emerald-500 text-xs mt-2 font-medium">✓ File selected</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Step 4: Membership Selection */}
              {step === 4 && (
                <div className="grid sm:grid-cols-2 gap-6">
                  {[
                    {
                      id: 'Silver', price: '₹500', salary: '₹1,500 – ₹2,500',
                      features: ['Multiple tuitions', 'Guaranteed opportunity', 'Email & WhatsApp support'],
                      icon: Shield, color: 'gray',
                    },
                    {
                      id: 'Platinum', price: '₹1,000', salary: '₹3,000+',
                      features: ['High-paying tuitions', 'Priority assignment', 'Certificate eligible'],
                      icon: Crown, color: 'gold', popular: true,
                    },
                  ].map((plan) => (
                    <label
                      key={plan.id}
                      className={`relative cursor-pointer block rounded-2xl border-2 p-6 transition-all duration-300 ${
                        formData.membership === plan.id
                          ? 'border-secondary bg-secondary/5 shadow-lg shadow-secondary/10'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input type="radio" name="membership" value={plan.id} checked={formData.membership === plan.id} onChange={handleChange} className="hidden" />
                      {plan.popular && (
                        <span className="absolute -top-3 right-4 bg-secondary text-primary text-xs font-bold px-3 py-1 rounded-full">Popular</span>
                      )}
                      <div className="flex items-center gap-3 mb-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          plan.color === 'gold' ? 'bg-gradient-to-br from-secondary-dark to-secondary' : 'bg-gradient-to-br from-gray-400 to-gray-500'
                        }`}>
                          <plan.icon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-bold text-primary text-lg">{plan.id}</h3>
                          <p className="text-2xl font-bold text-primary">{plan.price}</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-500 mb-3">Salary: <strong className="text-primary">{plan.salary}</strong>/tuition</p>
                      <ul className="space-y-2">
                        {plan.features.map((f, i) => (
                          <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                            <CheckCircle2 className="w-4 h-4 text-secondary flex-shrink-0" />{f}
                          </li>
                        ))}
                      </ul>
                      {formData.membership === plan.id && (
                        <div className="absolute top-4 right-4">
                          <CheckCircle2 className="w-6 h-6 text-secondary" />
                        </div>
                      )}
                    </label>
                  ))}
                  <div className="sm:col-span-2 text-center">
                    <Link to="/membership" className="text-secondary hover:text-secondary-dark text-sm font-medium inline-flex items-center gap-1 transition-colors">
                      Compare plans in detail <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              )}

              {/* Step 5: Declaration */}
              {step === 5 && (
                <div>
                  <div className="bg-gray-50 rounded-2xl p-6 mb-6">
                    <h3 className="font-bold text-primary mb-3">Self-Declaration</h3>
                    <p className="text-gray-600 text-sm leading-relaxed mb-4">
                      I hereby declare that I have read, understood, and agreed to abide by the terms and conditions set forth by Alpha Home Tuition Pvt. Ltd. I confirm that all information provided in this registration form is accurate and truthful.
                    </p>
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4">
                      <p className="text-amber-700 text-sm">
                        <strong>Important:</strong> Providing false information or forged documents will lead to immediate disqualification and legal action under applicable laws.
                      </p>
                    </div>
                  </div>

                  <label className="flex items-start gap-3 cursor-pointer group p-4 rounded-xl border-2 border-gray-200 hover:border-secondary/30 transition-colors">
                    <input type="checkbox" name="acceptTerms" checked={formData.acceptTerms} onChange={handleChange} className="mt-1 w-5 h-5 rounded border-gray-300 accent-[#FFD700]" />
                    <span className="text-sm text-gray-700">
                      I agree to the <Link to="/terms" className="text-secondary font-semibold hover:underline">Terms & Conditions</Link> of Alpha Home Tuition Pvt. Ltd. and declare that all information provided is accurate.
                    </span>
                  </label>

                  {/* Summary */}
                  <div className="mt-6 bg-primary/5 rounded-2xl p-6">
                    <h4 className="font-bold text-primary mb-3">Registration Summary</h4>
                    <div className="grid sm:grid-cols-2 gap-3 text-sm">
                      <div><span className="text-gray-500">Name:</span> <strong className="text-primary">{formData.fullName}</strong></div>
                      <div><span className="text-gray-500">Phone:</span> <strong className="text-primary">{formData.phone}</strong></div>
                      <div><span className="text-gray-500">Email:</span> <strong className="text-primary">{formData.email}</strong></div>
                      <div><span className="text-gray-500">City:</span> <strong className="text-primary">{formData.city}</strong></div>
                      <div><span className="text-gray-500">Degree:</span> <strong className="text-primary">{formData.degree}</strong></div>
                      <div><span className="text-gray-500">Membership:</span> <strong className="text-secondary">{formData.membership}</strong></div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-10 pt-6 border-t border-gray-100">
            <button
              onClick={prevStep}
              disabled={step === 0}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all ${
                step === 0 ? 'text-gray-300 cursor-not-allowed' : 'text-primary hover:bg-primary/5'
              }`}
            >
              <ArrowLeft className="w-4 h-4" /> Previous
            </button>

            {step < 5 ? (
              <button
                onClick={nextStep}
                className="flex items-center gap-2 bg-primary hover:bg-primary-light text-white font-bold px-8 py-3 rounded-xl text-sm transition-all hover:shadow-lg hover:shadow-primary/20"
              >
                Next <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex items-center gap-2 bg-secondary hover:bg-secondary-light text-primary font-bold px-8 py-3 rounded-xl text-sm transition-all hover:shadow-lg hover:shadow-secondary/30 pulse-glow disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting...</> : <><Sparkles className="w-4 h-4" /> Submit Registration</>}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
