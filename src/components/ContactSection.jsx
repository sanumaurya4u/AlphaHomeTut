import { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Phone, Mail, MapPin, Send, Clock, Loader2 } from 'lucide-react';
import { submitContactMessage } from '@/services/contactService';
import { createNotification } from '@/services/notificationService';
import { NOTIFICATION_TYPES } from '@/constants';

export default function ContactSection() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.message) {
      toast.error('Please fill in your name and message.');
      return;
    }
    setLoading(true);
    try {
      await submitContactMessage(formData);
      await createNotification({
        type: NOTIFICATION_TYPES.NEW_CONTACT,
        title: 'New Contact Message',
        message: `New message from ${formData.name}`,
        referenceType: 'contact',
      });
      toast.success('Message sent successfully! We will get back to you soon.', { duration: 5000 });
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (error) {
      console.error('Contact submit error:', error);
      toast.error(error.message || 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    { icon: Phone, title: 'Call Us', lines: ['7484934920', '9142283996'] },
    { icon: Mail, title: 'Email Us', lines: ['info@alphahometuition.com'] },
    { icon: MapPin, title: 'Address', lines: ['Alpha Home Tuition', 'Bihar, India'] },
    { icon: Clock, title: 'Hours', lines: ['Mon-Sat: 8AM - 9PM', 'Sun: 10AM - 6PM'] },
  ];

  const inputClass = 'w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 text-gray-800 placeholder-gray-400 focus:border-secondary transition-all text-sm';

  return (
    <section id="contact" className="py-20 md:py-28 bg-gray-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-16">
          <span className="text-secondary-dark font-semibold text-sm uppercase tracking-widest">Contact</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary mt-3 mb-4">Get In <span className="gradient-text">Touch</span></h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">Have questions? Reach out to us and our team will respond promptly.</p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Contact Info */}
          <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="lg:col-span-2 space-y-6">
            {contactInfo.map((item, i) => (
              <div key={i} className="flex items-start gap-4 group">
                <div className="w-12 h-12 bg-primary/5 group-hover:bg-secondary/15 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors">
                  <item.icon className="w-5 h-5 text-primary group-hover:text-secondary transition-colors" />
                </div>
                <div>
                  <p className="font-bold text-primary text-sm">{item.title}</p>
                  {item.lines.map((line, j) => (
                    <p key={j} className="text-gray-600 text-sm">{line}</p>
                  ))}
                </div>
              </div>
            ))}

            {/* Map Placeholder */}
            <div className="rounded-2xl overflow-hidden border border-gray-200 h-48 bg-gray-100 mt-6">
              <iframe
                title="Location Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3597.123456789!2d85.1376!3d25.6093!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjXCsDM2JzMzLjUiTiA4NcKwMDgnMTUuNCJF!5e0!3m2!1sen!2sin!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-3 bg-white rounded-3xl shadow-xl shadow-primary/5 border border-gray-100 p-8 md:p-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-primary font-semibold text-sm mb-2">Your Name *</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Full name" className={inputClass} />
                </div>
                <div>
                  <label className="block text-primary font-semibold text-sm mb-2">Email</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="your@email.com" className={inputClass} />
                </div>
              </div>
              <div>
                <label className="block text-primary font-semibold text-sm mb-2">Phone Number</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Your phone number" className={inputClass} />
              </div>
              <div>
                <label className="block text-primary font-semibold text-sm mb-2">Message *</label>
                <textarea name="message" value={formData.message} onChange={handleChange} placeholder="Write your message..." rows={5} className={inputClass + ' resize-none'} />
              </div>
              <button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary-light text-white font-bold py-4 rounded-xl text-base transition-all hover:shadow-lg hover:shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed">
                {loading ? <><Loader2 className="w-5 h-5 animate-spin" />Sending...</> : <><Send className="w-5 h-5" />Send Message</>}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
