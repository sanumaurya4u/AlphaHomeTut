import { motion } from 'framer-motion';
import { IndianRupee, Percent, Clock, CreditCard, HelpCircle, ChevronDown } from 'lucide-react';
import { useState } from 'react';

const charges = [
  {
    icon: Percent,
    title: '80% First Month Service Charge',
    description: '80% of the first month\'s salary is deducted as a one-time service charge. This covers tutor matching, verification, and platform support.',
    highlight: true,
  },
  {
    icon: CreditCard,
    title: 'Installment Payment',
    description: 'The service charge can be paid in two installments: 50% first + 50% later = 100% total. Flexible payment for your convenience.',
    highlight: false,
  },
  {
    icon: Clock,
    title: 'Short-Term Assignments',
    description: 'For assignments lasting 1–3 months, service charges range from 25% to 50% of the salary, depending on the duration.',
    highlight: false,
  },
  {
    icon: IndianRupee,
    title: 'Fee Collection',
    description: 'Tuition fees may be collected by the center until the service charge is fully cleared. Regular payments ensure uninterrupted service.',
    highlight: false,
  },
];

const faqs = [
  {
    q: 'When do I pay the service charge?',
    a: 'The service charge is deducted from your first month\'s earnings. You can pay it in two equal installments of 50% each.',
  },
  {
    q: 'What if my tuition lasts less than 3 months?',
    a: 'Short-term assignments (1–3 months) have a reduced service charge ranging from 25% to 50% of salary.',
  },
  {
    q: 'Can the center collect tuition fees?',
    a: 'Yes, tuition fees may be collected by the center until your service charge is fully cleared.',
  },
];

export default function ServiceChargeInfo() {
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <section className="py-20 md:py-28 bg-gray-50 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-secondary-dark font-semibold text-sm uppercase tracking-widest">Pricing</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary mt-3 mb-6">
            Service <span className="gradient-text">Charges</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Transparent fee structure so you know exactly what to expect. No hidden charges.
          </p>
        </motion.div>

        {/* Info Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {charges.map((charge, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group"
            >
              <div className={`rounded-2xl p-6 h-full transition-all duration-300 card-hover ${
                charge.highlight
                  ? 'bg-primary text-white shadow-xl shadow-primary/20'
                  : 'bg-white border border-gray-100 shadow-sm hover:shadow-xl hover:border-secondary/30'
              }`}>
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 transition-all group-hover:scale-110 ${
                  charge.highlight ? 'bg-secondary/20' : 'bg-primary/5 group-hover:bg-secondary/15'
                }`}>
                  <charge.icon className={`w-7 h-7 ${charge.highlight ? 'text-secondary' : 'text-primary group-hover:text-secondary'} transition-colors`} />
                </div>
                <h3 className={`text-base font-bold mb-2 ${charge.highlight ? 'text-white' : 'text-primary'}`}>{charge.title}</h3>
                <p className={`text-sm leading-relaxed ${charge.highlight ? 'text-white/70' : 'text-gray-500'}`}>{charge.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto mb-16"
        >
          <h3 className="text-2xl font-bold text-primary text-center mb-8">Payment Timeline</h3>
          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-secondary via-primary to-secondary/30" />
            {[
              { step: 'Tuition Confirmed', desc: 'Tutor assigned and confirmed after successful demo class.', color: 'bg-secondary' },
              { step: 'First Month Earnings', desc: '80% deducted as service charge. 20% retained by tutor.', color: 'bg-primary' },
              { step: '1st Installment (50%)', desc: 'Pay 50% of service charge within the first month.', color: 'bg-primary' },
              { step: '2nd Installment (50%)', desc: 'Pay remaining 50% in the second month. Service charge cleared.', color: 'bg-secondary' },
              { step: 'Full Earnings', desc: 'From month 3 onwards, enjoy 100% of your tuition earnings.', color: 'bg-emerald-500' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="relative pl-16 pb-8 last:pb-0"
              >
                <div className={`absolute left-4 w-5 h-5 rounded-full ${item.color} border-4 border-white shadow-md`} />
                <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                  <h4 className="font-bold text-primary text-sm">{item.step}</h4>
                  <p className="text-gray-500 text-sm mt-1">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* FAQ */}
        <div className="max-w-2xl mx-auto">
          <h3 className="text-2xl font-bold text-primary text-center mb-8">
            <HelpCircle className="w-6 h-6 inline mr-2 text-secondary" />
            Common Questions
          </h3>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.08 }}
              >
                <div className={`rounded-xl border transition-all ${openFaq === i ? 'border-secondary/30 shadow-md bg-white' : 'border-gray-100 bg-white hover:border-gray-200'}`}>
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between px-5 py-4 text-left">
                    <span className="font-semibold text-sm text-gray-700">{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${openFaq === i ? 'rotate-180 text-secondary' : ''}`} />
                  </button>
                  {openFaq === i && (
                    <p className="px-5 pb-4 text-gray-500 text-sm leading-relaxed">{faq.a}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
