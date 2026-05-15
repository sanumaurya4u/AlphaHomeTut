import { motion } from 'framer-motion';
import { FileText, Search, CreditCard, Users, Rocket } from 'lucide-react';

const steps = [
  {
    icon: FileText,
    step: '01',
    title: 'Apply Online',
    description: 'Fill the registration form with your personal, educational, and experience details.',
  },
  {
    icon: Search,
    step: '02',
    title: 'Document Verification',
    description: 'Submit your marksheets, degree, Aadhar card, and passport photos for verification.',
  },
  {
    icon: CreditCard,
    step: '03',
    title: 'Choose Membership',
    description: 'Select Silver (₹500) or Platinum (₹1000) membership plan based on your preference.',
  },
  {
    icon: Users,
    step: '04',
    title: 'Get Assignments',
    description: 'Receive tuition assignments matching your profile, location, and expertise.',
  },
  {
    icon: Rocket,
    step: '05',
    title: 'Start Teaching',
    description: 'Conduct demo classes, get confirmed, and start earning with regular tuitions.',
  },
];

export default function TutorRegistrationProcess() {
  return (
    <section className="py-20 md:py-28 gradient-animated relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-10 right-10 w-72 h-72 bg-secondary/8 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-64 h-64 bg-secondary/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-secondary font-semibold text-sm uppercase tracking-widest">For Tutors</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mt-3 mb-6">
            How Tutor Registration <span className="gradient-text">Works</span>
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto text-lg">
            Join our growing network of tutors in 5 simple steps. Start earning by teaching students near you.
          </p>
        </motion.div>

        <div className="relative">
          {/* Connection line */}
          <div className="hidden lg:block absolute top-[60px] left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-secondary/20 via-secondary/60 to-secondary/20" />

          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.6, delay: i * 0.12 }}
                className="relative text-center group"
              >
                <div className="relative mx-auto mb-6">
                  <div className="w-20 h-20 mx-auto glass rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:-translate-y-2 group-hover:border-secondary/40">
                    <step.icon className="w-9 h-9 text-secondary" />
                  </div>
                  <span className="absolute -top-3 -right-3 w-8 h-8 bg-secondary text-primary text-sm font-bold rounded-full flex items-center justify-center shadow-lg">
                    {step.step}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center mt-12"
        >
          <a
            href="/register"
            className="inline-flex items-center gap-2 bg-secondary text-primary font-bold px-8 py-4 rounded-full text-base hover:bg-secondary-light transition-all hover:shadow-xl hover:shadow-secondary/25 hover:-translate-y-0.5"
          >
            <FileText className="w-5 h-5" />
            Register as Tutor
          </a>
        </motion.div>
      </div>
    </section>
  );
}
