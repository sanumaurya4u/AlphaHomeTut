import { motion } from 'framer-motion';
import { ShieldCheck, UserCheck, IndianRupee, BarChart3, Target, Eye, Award } from 'lucide-react';

const features = [
  {
    icon: UserCheck,
    title: 'Verified Tutors',
    description: 'Every tutor undergoes thorough verification including identity, qualification, and experience checks.',
  },
  {
    icon: Target,
    title: 'Personalized Learning',
    description: 'Custom study plans tailored to each student\'s learning style, pace, and academic goals.',
  },
  {
    icon: IndianRupee,
    title: 'Affordable Fees',
    description: 'Quality education at budget-friendly rates. Flexible payment plans to suit every family.',
  },
  {
    icon: BarChart3,
    title: 'Progress Tracking',
    description: 'Regular assessments, progress reports, and parent-teacher communication for better outcomes.',
  },
];

const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.6 },
};

export default function AboutSection() {
  return (
    <section id="about" className="py-20 md:py-28 bg-white relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/3 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <motion.div {...fadeInUp} className="text-center mb-16">
          <span className="text-secondary font-semibold text-sm uppercase tracking-widest">About Us</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary mt-3 mb-6">
            Why Choose <span className="gradient-text">Alpha Home Tuition?</span>
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto text-lg leading-relaxed">
            Alpha Home Tuition helps parents and students connect with verified and experienced
            tutors according to their learning needs. We are a trusted mediator that ensures quality
            education reaches every home.
          </p>
        </motion.div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {[
            {
              icon: Target,
              title: 'Our Mission',
              text: 'To make quality education accessible and affordable for every student by connecting them with the best tutors at their doorstep.',
              color: 'from-primary to-primary-light',
            },
            {
              icon: Eye,
              title: 'Our Vision',
              text: 'To become India\'s most trusted home tuition platform, empowering millions of students with personalized learning experiences.',
              color: 'from-secondary-dark to-secondary',
            },
            {
              icon: Award,
              title: 'Our Promise',
              text: 'We guarantee verified tutors, flexible timings, transparent fees, and complete satisfaction. Your child\'s success is our priority.',
              color: 'from-primary-light to-primary',
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="card-hover group"
            >
              <div className={`bg-gradient-to-br ${item.color} rounded-2xl p-8 h-full text-white relative overflow-hidden`}>
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                <item.icon className="w-10 h-10 mb-4 relative z-10" />
                <h3 className="text-xl font-bold mb-3 relative z-10">{item.title}</h3>
                <p className="text-white/80 leading-relaxed relative z-10">{item.text}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Feature Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="card-hover group bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-xl hover:border-secondary/30 transition-all"
            >
              <div className="w-14 h-14 bg-primary/5 group-hover:bg-secondary/15 rounded-xl flex items-center justify-center mb-4 transition-colors">
                <feature.icon className="w-7 h-7 text-primary group-hover:text-secondary transition-colors" />
              </div>
              <h3 className="text-lg font-bold text-primary mb-2">{feature.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
