import { motion } from 'framer-motion';
import { Camera, CreditCard, FileText, GraduationCap, CheckCircle2 } from 'lucide-react';

const documents = [
  {
    icon: Camera,
    title: 'Passport Size Photos',
    description: 'Two recent passport-size photographs with white background.',
    required: true,
  },
  {
    icon: CreditCard,
    title: 'Aadhar Card / ID Proof',
    description: 'Aadhar Card, Driving License, or Voter\'s ID card for address verification.',
    required: true,
  },
  {
    icon: FileText,
    title: '10th & 12th Marksheets',
    description: 'Secondary and Senior Secondary marksheets from recognized boards.',
    required: true,
  },
  {
    icon: GraduationCap,
    title: 'Degree Certificate',
    description: 'Latest obtained degree along with the respective marksheet.',
    required: true,
  },
];

export default function DocumentsRequired() {
  return (
    <section className="py-20 md:py-28 bg-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-secondary font-semibold text-sm uppercase tracking-widest">Registration</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary mt-3 mb-6">
            Documents <span className="gradient-text">Required</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Keep these documents ready before starting your tutor registration process.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {documents.map((doc, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group"
            >
              <div className="bg-white rounded-2xl p-6 h-full border border-gray-100 shadow-sm hover:shadow-xl hover:border-secondary/30 transition-all duration-300 card-hover text-center">
                <div className="w-16 h-16 mx-auto bg-primary/5 group-hover:bg-secondary/15 rounded-2xl flex items-center justify-center mb-4 transition-all group-hover:scale-110">
                  <doc.icon className="w-8 h-8 text-primary group-hover:text-secondary transition-colors" />
                </div>
                <h3 className="text-base font-bold text-primary mb-2">{doc.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-3">{doc.description}</p>
                {doc.required && (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Required
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-10 text-center"
        >
          <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 px-5 py-3 rounded-xl text-sm font-medium">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            Providing false or forged documents will lead to immediate disqualification and legal action.
          </div>
        </motion.div>
      </div>
    </section>
  );
}
