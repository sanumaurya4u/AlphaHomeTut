import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { CheckCircle2, Crown, Star, Zap, Shield, Users, IndianRupee, ArrowRight, Award } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const plans = [
  {
    id: 'silver',
    name: 'Silver',
    price: '500',
    period: 'one-time',
    icon: Shield,
    color: 'from-gray-400 to-gray-500',
    glowColor: 'shadow-gray-300/30',
    badge: null,
    salaryRange: '₹1,500 – ₹2,500',
    description: 'Perfect for new tutors looking to start their teaching career with guaranteed tuition assignments.',
    features: [
      { text: 'Multiple tuitions allowed', included: true },
      { text: 'Salary: ₹1,500 to ₹2,500 per tuition', included: true },
      { text: 'Guaranteed tuition opportunity', included: true },
      { text: 'Document verification', included: true },
      { text: 'WhatsApp & email support', included: true },
      { text: 'Priority assignment support', included: false },
      { text: 'High-paying tuition opportunities', included: false },
      { text: 'Certificate of appreciation', included: false },
    ],
    cta: 'Join Silver',
  },
  {
    id: 'platinum',
    name: 'Platinum',
    price: '1,000',
    period: 'one-time',
    icon: Crown,
    color: 'from-secondary-dark to-secondary',
    glowColor: 'shadow-secondary/30',
    badge: 'Most Popular',
    salaryRange: '₹3,000+',
    description: 'For experienced tutors seeking high-paying tuition opportunities with priority support and recognition.',
    features: [
      { text: 'Multiple tuitions allowed', included: true },
      { text: 'Salary: ₹3,000 and above per tuition', included: true },
      { text: 'Guaranteed tuition opportunity', included: true },
      { text: 'Document verification', included: true },
      { text: 'WhatsApp & email support', included: true },
      { text: 'Priority assignment support', included: true },
      { text: 'High-paying tuition opportunities', included: true },
      { text: 'Certificate of appreciation', included: true },
    ],
    cta: 'Join Platinum',
  },
];

export default function MembershipPlans() {
  const [hoveredPlan, setHoveredPlan] = useState(null);
  const { profile } = useAuth();

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
              <Crown className="w-4 h-4" />
              Membership Plans
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
              Choose Your <span className="gradient-text">Membership</span>
            </h1>
            <p className="text-white/60 max-w-2xl mx-auto text-lg">
              Select the plan that matches your teaching goals. Both plans include verified registration and tuition assignments.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Plans */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-10 pb-20">
        <div className="grid md:grid-cols-2 gap-8">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              onMouseEnter={() => setHoveredPlan(plan.id)}
              onMouseLeave={() => setHoveredPlan(null)}
              className="relative"
            >
              {/* Popular Badge */}
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                  <span className="inline-flex items-center gap-1 bg-secondary text-primary font-bold px-5 py-1.5 rounded-full text-xs uppercase tracking-wider shadow-lg shadow-secondary/30">
                    <Star className="w-3.5 h-3.5 fill-primary" />
                    {plan.badge}
                  </span>
                </div>
              )}

              <div className={`bg-white rounded-3xl border-2 p-8 md:p-10 h-full transition-all duration-500 ${
                plan.badge ? 'border-secondary shadow-2xl' : 'border-gray-100 shadow-lg'
              } ${hoveredPlan === plan.id ? `shadow-2xl ${plan.glowColor} -translate-y-2` : ''}`}>
                {/* Plan Icon & Name */}
                <div className="flex items-center gap-4 mb-6">
                  <div className={`w-14 h-14 bg-gradient-to-br ${plan.color} rounded-2xl flex items-center justify-center shadow-lg`}>
                    <plan.icon className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-primary">{plan.name}</h3>
                    <p className="text-gray-500 text-sm">Membership</p>
                  </div>
                </div>

                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-gray-400 text-lg">₹</span>
                    <span className="text-5xl font-bold text-primary">{plan.price}</span>
                  </div>
                  <p className="text-gray-400 text-sm mt-1">One-time registration fee • Valid for 1 year</p>
                </div>

                {/* Salary Range */}
                <div className="bg-primary/5 rounded-xl p-4 mb-6">
                  <div className="flex items-center gap-2 mb-1">
                    <IndianRupee className="w-4 h-4 text-secondary" />
                    <span className="text-sm font-semibold text-primary">Expected Salary Range</span>
                  </div>
                  <p className="text-2xl font-bold text-primary">{plan.salaryRange} <span className="text-sm font-normal text-gray-500">/ tuition</span></p>
                </div>

                <p className="text-gray-500 text-sm leading-relaxed mb-6">{plan.description}</p>

                {/* Features */}
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, j) => (
                    <li key={j} className={`flex items-start gap-3 text-sm ${feature.included ? 'text-gray-700' : 'text-gray-300'}`}>
                      <CheckCircle2 className={`w-5 h-5 flex-shrink-0 ${feature.included ? 'text-secondary' : 'text-gray-200'}`} />
                      {feature.text}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Link
                  to={profile?.role === 'tutor' ? '/dashboard?tab=membership' : '/register'}
                  className={`w-full flex items-center justify-center gap-2 font-bold py-4 rounded-xl text-base transition-all hover:shadow-lg hover:-translate-y-0.5 ${
                    plan.badge
                      ? 'bg-secondary text-primary hover:bg-secondary-light hover:shadow-secondary/30 pulse-glow'
                      : 'bg-primary text-white hover:bg-primary-light hover:shadow-primary/30'
                  }`}
                >
                  {plan.cta}
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Comparison Table */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-20"
        >
          <h2 className="text-3xl font-bold text-primary text-center mb-10">
            Compare <span className="gradient-text">Plans</span>
          </h2>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-primary text-white">
                    <th className="text-left px-6 py-4 font-semibold text-sm">Feature</th>
                    <th className="text-center px-6 py-4 font-semibold text-sm">Silver (₹500)</th>
                    <th className="text-center px-6 py-4 font-semibold text-sm bg-secondary/20">Platinum (₹1,000)</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { feature: 'Multiple Tuitions', silver: true, platinum: true },
                    { feature: 'Salary Range', silver: '₹1,500–₹2,500', platinum: '₹3,000+' },
                    { feature: 'Guaranteed Tuition', silver: true, platinum: true },
                    { feature: 'Document Verification', silver: true, platinum: true },
                    { feature: 'Priority Assignment', silver: false, platinum: true },
                    { feature: 'High-Paying Opportunities', silver: false, platinum: true },
                    { feature: 'Certificate of Appreciation', silver: false, platinum: true },
                    { feature: 'Validity', silver: '1 Year', platinum: '1 Year' },
                  ].map((row, i) => (
                    <tr key={i} className={`border-t border-gray-100 ${i % 2 === 0 ? 'bg-gray-50/50' : 'bg-white'}`}>
                      <td className="px-6 py-4 text-sm font-medium text-gray-700">{row.feature}</td>
                      <td className="px-6 py-4 text-center text-sm">
                        {typeof row.silver === 'boolean'
                          ? row.silver
                            ? <CheckCircle2 className="w-5 h-5 text-secondary mx-auto" />
                            : <span className="text-gray-300">—</span>
                          : <span className="font-semibold text-primary">{row.silver}</span>
                        }
                      </td>
                      <td className="px-6 py-4 text-center text-sm bg-secondary/5">
                        {typeof row.platinum === 'boolean'
                          ? row.platinum
                            ? <CheckCircle2 className="w-5 h-5 text-secondary mx-auto" />
                            : <span className="text-gray-300">—</span>
                          : <span className="font-semibold text-primary">{row.platinum}</span>
                        }
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-16 text-center"
        >
          <div className="bg-primary rounded-3xl p-10 md:p-14 relative overflow-hidden">
            <div className="absolute inset-0">
              <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            </div>
            <div className="relative">
              <Award className="w-12 h-12 text-secondary mx-auto mb-4" />
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">Ready to Start Teaching?</h3>
              <p className="text-white/60 max-w-lg mx-auto mb-8">Register today and get your first tuition assignment. Join 500+ tutors already earning with Alpha Home Tuition.</p>
              <Link
                to={profile?.role === 'tutor' ? '/dashboard?tab=membership' : '/register'}
                className="inline-flex items-center gap-2 bg-secondary text-primary font-bold px-8 py-4 rounded-full text-base hover:bg-secondary-light transition-all hover:shadow-xl hover:shadow-secondary/25 hover:-translate-y-0.5 pulse-glow"
              >
                <Zap className="w-5 h-5" />
                Register Now
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
