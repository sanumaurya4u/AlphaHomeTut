import { motion } from 'framer-motion';
import { RefreshCw, CheckCircle2, XCircle, Clock, AlertTriangle, ArrowRight, Building, CreditCard } from 'lucide-react';

const eligibleCases = [
  'The company cannot provide tuitions in the tutor\'s registered area.',
  'Registration period has not been utilized due to company limitations.',
];

const nonRefundableCases = [
  'The tutor fails to apply for assignments.',
  'The tutor is unavailable or shifts location.',
  'Communication with guardians, conducting demos, or visiting assignments has taken place.',
  'The tutor declines tuition due to personal reasons.',
  'The tutor provides false or forged documents.',
  'The tutor violates the Terms & Conditions.',
];

const processSteps = [
  { title: 'Submit Request', desc: 'Visit office in person with prescribed form and original receipt.', icon: Building, status: 'complete' },
  { title: '45-Day Waiting', desc: 'Applications eligible only after 45 working days post-registration.', icon: Clock, status: 'waiting' },
  { title: 'Verification', desc: 'Company reviews eligibility and verifies all conditions.', icon: CheckCircle2, status: 'review' },
  { title: 'Bank Transfer', desc: 'Approved refunds disbursed via account transfer within 5 business days.', icon: CreditCard, status: 'complete' },
];

export default function RefundPolicy() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="gradient-animated py-20 md:py-28 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-10 right-10 w-72 h-72 bg-secondary/8 rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-10 w-64 h-64 bg-secondary/5 rounded-full blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 bg-secondary/15 border border-secondary/30 text-secondary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <RefreshCw className="w-4 h-4" />
              Refund Guidelines
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
              Refund <span className="gradient-text">Policy</span>
            </h1>
            <p className="text-white/60 max-w-2xl mx-auto text-lg">
              Clear and transparent refund guidelines for all registered tutors.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Eligible Cases */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8 mb-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            </div>
            <h2 className="text-xl font-bold text-primary">Eligible for Refund</h2>
          </div>
          <ul className="space-y-3">
            {eligibleCases.map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-gray-600 text-sm leading-relaxed">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                {item}
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Non-Refundable Cases */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white rounded-2xl border border-red-100 shadow-sm p-6 md:p-8 mb-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
              <XCircle className="w-5 h-5 text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-primary">Non-Refundable Cases</h2>
          </div>
          <ul className="space-y-3">
            {nonRefundableCases.map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-gray-600 text-sm leading-relaxed">
                <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                {item}
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Refund Process Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8 mb-8"
        >
          <h2 className="text-xl font-bold text-primary mb-8 text-center">Refund Process</h2>

          <div className="relative max-w-2xl mx-auto">
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-secondary to-emerald-500" />

            {processSteps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.15 }}
                className="relative pl-16 pb-10 last:pb-0"
              >
                <div className={`absolute left-3.5 w-6 h-6 rounded-full border-4 border-white shadow-md ${
                  step.status === 'complete' ? 'bg-emerald-500' :
                  step.status === 'waiting' ? 'bg-amber-500' :
                  'bg-primary'
                }`} />

                <div className={`rounded-xl p-5 border ${
                  step.status === 'waiting'
                    ? 'bg-amber-50 border-amber-200'
                    : 'bg-gray-50 border-gray-100'
                }`}>
                  <div className="flex items-center gap-3 mb-2">
                    <step.icon className={`w-5 h-5 ${
                      step.status === 'waiting' ? 'text-amber-600' : 'text-primary'
                    }`} />
                    <h3 className="font-bold text-primary text-sm">{step.title}</h3>
                  </div>
                  <p className="text-gray-600 text-sm">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Refund Flowchart */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8 mb-8"
        >
          <h2 className="text-xl font-bold text-primary mb-8 text-center">Refund Decision Flowchart</h2>

          <div className="max-w-sm mx-auto space-y-4">
            {[
              { text: 'Request Submitted', color: 'bg-primary', textColor: 'text-white' },
              { text: '45 Days Elapsed?', color: 'bg-amber-100', textColor: 'text-amber-700', isQuestion: true },
              { text: 'Eligibility Check', color: 'bg-blue-100', textColor: 'text-blue-700' },
              { text: 'Documents Verified?', color: 'bg-amber-100', textColor: 'text-amber-700', isQuestion: true },
              { text: 'Refund Approved ✓', color: 'bg-emerald-500', textColor: 'text-white' },
              { text: 'Bank Transfer (5 days)', color: 'bg-emerald-100', textColor: 'text-emerald-700' },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className={`${item.color} ${item.textColor} px-6 py-3 rounded-xl text-sm font-semibold inline-block ${item.isQuestion ? 'rounded-2xl border-2 border-dashed border-amber-300' : ''}`}>
                  {item.text}
                </div>
                {i < 5 && (
                  <div className="flex justify-center my-2">
                    <ArrowRight className="w-4 h-4 text-gray-300 rotate-90" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Important Notices */}
        <div className="space-y-4">
          {[
            { title: '45 Working Day Rule', text: 'Refund applications are only accepted after 45 working days from the date of registration. Applications submitted before this period will not be processed.', color: 'amber' },
            { title: 'In-Person Requirement', text: 'All refund requests must be submitted in person at the company office with the prescribed form and original payment receipt. Online requests are not accepted.', color: 'blue' },
            { title: 'Bank Transfer', text: 'Approved refunds are processed via bank transfer within 5 business days after verification. Please ensure your bank details are correct at the time of application.', color: 'green' },
          ].map((notice, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className={`rounded-2xl p-6 border ${
                notice.color === 'amber' ? 'bg-amber-50 border-amber-200' :
                notice.color === 'blue' ? 'bg-blue-50 border-blue-200' :
                'bg-emerald-50 border-emerald-200'
              }`}
            >
              <div className="flex items-start gap-3">
                <AlertTriangle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                  notice.color === 'amber' ? 'text-amber-500' :
                  notice.color === 'blue' ? 'text-blue-500' :
                  'text-emerald-500'
                }`} />
                <div>
                  <h4 className={`font-bold text-sm mb-1 ${
                    notice.color === 'amber' ? 'text-amber-700' :
                    notice.color === 'blue' ? 'text-blue-700' :
                    'text-emerald-700'
                  }`}>{notice.title}</h4>
                  <p className={`text-sm ${
                    notice.color === 'amber' ? 'text-amber-600' :
                    notice.color === 'blue' ? 'text-blue-600' :
                    'text-emerald-600'
                  }`}>{notice.text}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
