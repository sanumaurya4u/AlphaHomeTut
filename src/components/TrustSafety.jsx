import { motion } from 'framer-motion';
import { ShieldCheck, Lock, Scale, Eye, UserCheck, HeadphonesIcon } from 'lucide-react';

const trustCards = [
  {
    icon: UserCheck,
    title: 'Verified Tutors',
    description: 'Every tutor undergoes thorough background verification, identity check, and qualification assessment before onboarding.',
    color: 'from-blue-500 to-blue-600',
  },
  {
    icon: Lock,
    title: 'Secure Communication',
    description: 'All communications happen through official channels. Your personal data is encrypted and never shared with third parties.',
    color: 'from-emerald-500 to-emerald-600',
  },
  {
    icon: Scale,
    title: 'Legal Protection',
    description: 'Comprehensive terms & conditions, registered company operations, and legal framework to protect all stakeholders.',
    color: 'from-purple-500 to-purple-600',
  },
  {
    icon: Eye,
    title: 'Transparent Process',
    description: 'Clear fee structure, no hidden charges, documented policies for refunds, service charges, and membership plans.',
    color: 'from-amber-500 to-amber-600',
  },
  {
    icon: ShieldCheck,
    title: 'Student Safety',
    description: 'Safety measures for tuition visits, emergency protocols, and a dedicated team to handle any concerns promptly.',
    color: 'from-rose-500 to-rose-600',
  },
  {
    icon: HeadphonesIcon,
    title: 'Dedicated Support',
    description: 'Responsive support team available via WhatsApp, email, and phone to assist tutors, students, and parents.',
    color: 'from-cyan-500 to-cyan-600',
  },
];

export default function TrustSafety() {
  return (
    <section className="py-20 md:py-28 bg-gray-50 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/3 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl translate-y-1/2 translate-x-1/2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-secondary-dark font-semibold text-sm uppercase tracking-widest">Trust & Safety</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary mt-3 mb-6">
            Why Parents & Tutors <span className="gradient-text">Trust Us</span>
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto text-lg leading-relaxed">
            We are committed to building a safe, transparent, and trustworthy platform for every student, parent, and tutor.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {trustCards.map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group"
            >
              <div className="bg-white rounded-2xl p-8 h-full border border-gray-100 shadow-sm hover:shadow-xl hover:border-secondary/30 transition-all duration-300 card-hover relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-secondary/5 to-transparent rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500" />
                <div className={`w-14 h-14 bg-gradient-to-br ${card.color} rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <card.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg font-bold text-primary mb-2 group-hover:text-secondary transition-colors">{card.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed relative z-10">{card.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
