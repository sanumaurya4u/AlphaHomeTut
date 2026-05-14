import { motion } from 'framer-motion';
import { ClipboardList, Search, UserCheck, Rocket } from 'lucide-react';

const steps = [
  {
    icon: ClipboardList,
    step: '01',
    title: 'Submit Requirement',
    description: 'Fill out a simple form with your child\'s class, subject, location, and learning preferences.',
  },
  {
    icon: Search,
    step: '02',
    title: 'We Analyze Needs',
    description: 'Our team reviews your requirements and shortlists the best matching tutors from our network.',
  },
  {
    icon: UserCheck,
    step: '03',
    title: 'Teacher Assignment',
    description: 'We assign a verified tutor who matches your needs and arrange a free demo class.',
  },
  {
    icon: Rocket,
    step: '04',
    title: 'Start Learning',
    description: 'Once satisfied with the demo, regular classes begin with personalized learning and progress tracking.',
  },
];

export default function HowItWorks() {
  return (
    <section className="py-20 md:py-28 bg-gray-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-secondary-dark font-semibold text-sm uppercase tracking-widest">Process</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary mt-3 mb-6">
            How It <span className="gradient-text">Works</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Getting started is simple. Follow these four easy steps to connect with your ideal tutor.
          </p>
        </motion.div>

        <div className="relative">
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-secondary/20 via-secondary to-secondary/20 -translate-y-1/2" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                className="relative text-center group"
              >
                <div className="relative mx-auto mb-6">
                  <div className="w-20 h-20 mx-auto bg-white rounded-2xl shadow-lg border-2 border-primary/10 group-hover:border-secondary group-hover:shadow-xl flex items-center justify-center transition-all duration-300 group-hover:-translate-y-2">
                    <step.icon className="w-9 h-9 text-primary group-hover:text-secondary transition-colors" />
                  </div>
                  <span className="absolute -top-3 -right-3 w-8 h-8 bg-secondary text-primary text-sm font-bold rounded-full flex items-center justify-center shadow-lg">
                    {step.step}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-primary mb-2">{step.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
