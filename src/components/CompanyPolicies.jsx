import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ShieldCheck, FileText, RefreshCw, ArrowRight } from 'lucide-react';

const policies = [
  {
    icon: FileText,
    title: 'Terms & Conditions',
    description: 'Complete registration, membership, service charge, and penalty policies for tutors and students.',
    link: '/terms',
    color: 'from-primary to-primary-light',
  },
  {
    icon: ShieldCheck,
    title: 'Privacy Policy',
    description: 'How we collect, use, and protect your personal data in compliance with the Information Technology Act, 2000.',
    link: '/privacy',
    color: 'from-emerald-600 to-emerald-500',
  },
  {
    icon: RefreshCw,
    title: 'Refund Policy',
    description: 'Clear guidelines on refund eligibility, process, timelines, and non-refundable conditions.',
    link: '/refund',
    color: 'from-amber-600 to-amber-500',
  },
];

export default function CompanyPolicies() {
  return (
    <section className="py-20 md:py-28 bg-primary relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-72 h-72 bg-secondary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-64 h-64 bg-secondary/8 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-secondary font-semibold text-sm uppercase tracking-widest">Legal & Policies</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mt-3 mb-6">
            Legal & Secure <span className="gradient-text">Platform</span>
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto text-lg">
            Alpha Home Tuition Pvt. Ltd. operates with full transparency and legal compliance for your trust and safety.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {policies.map((policy, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
            >
              <Link to={policy.link} className="block group h-full">
                <div className="glass rounded-2xl p-8 h-full hover:border-secondary/30 transition-all duration-300 card-hover">
                  <div className={`w-14 h-14 bg-gradient-to-br ${policy.color} rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-lg`}>
                    <policy.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-secondary transition-colors">{policy.title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed mb-4">{policy.description}</p>
                  <span className="inline-flex items-center gap-1 text-secondary text-sm font-semibold group-hover:gap-2 transition-all">
                    Read More <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
