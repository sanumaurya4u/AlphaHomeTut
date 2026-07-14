import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Download, CheckCircle2, AlertTriangle, Shield, FileText } from 'lucide-react';
import { termsData } from '../data/termsData';

export default function TermsAndConditions() {
  const [openSections, setOpenSections] = useState({});
  const [accepted, setAccepted] = useState(false);
  const [activeSection, setActiveSection] = useState('registration');

  const toggleSection = (id) => {
    setOpenSections(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const scrollToSection = (id) => {
    setActiveSection(id);
    const el = document.getElementById(`section-${id}`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

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
              <Shield className="w-4 h-4" />
              Legal Document
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
              Terms & <span className="gradient-text">Conditions</span>
            </h1>
            <p className="text-white/60 max-w-2xl mx-auto text-lg mb-8">
              Alpha Home Tuition Pvt. Ltd. — Please read these terms carefully before registering with us.
            </p>
            <a 
              href="/TnC%20Alpha%20Sol.pdf" 
              download="TnC_Alpha_Sol.pdf"
              className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white font-semibold px-6 py-3 rounded-full text-sm hover:bg-white/20 transition-all backdrop-blur-sm"
            >
              <Download className="w-4 h-4" />
              Download PDF
            </a>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <motion.aside
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:w-72 flex-shrink-0"
          >
            <div className="lg:sticky lg:top-24 bg-white rounded-2xl border border-gray-100 shadow-sm p-4 max-h-[calc(100vh-120px)] overflow-y-auto">
              <h3 className="font-bold text-primary text-sm uppercase tracking-wider mb-4 px-3">Sections</h3>
              <nav className="space-y-1">
                {termsData.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all ${
                      activeSection === section.id
                        ? 'bg-secondary/10 text-primary font-semibold border-l-2 border-secondary'
                        : 'text-gray-500 hover:bg-gray-50 hover:text-primary'
                    }`}
                  >
                    {section.title}
                  </button>
                ))}
              </nav>
            </div>
          </motion.aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            <div className="space-y-6">
              {termsData.map((section, i) => (
                <motion.div
                  key={section.id}
                  id={`section-${section.id}`}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.5 }}
                  className="scroll-mt-24"
                >
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                    {/* Section Header / Accordion Toggle */}
                    <button
                      onClick={() => toggleSection(section.id)}
                      className="w-full flex items-center justify-between px-6 md:px-8 py-6 text-left group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/5 group-hover:bg-secondary/15 rounded-xl flex items-center justify-center transition-colors flex-shrink-0">
                          <FileText className="w-5 h-5 text-primary group-hover:text-secondary transition-colors" />
                        </div>
                        <h2 className="text-lg md:text-xl font-bold text-primary">{section.title}</h2>
                      </div>
                      <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-300 flex-shrink-0 ${openSections[section.id] ? 'rotate-180 text-secondary' : ''}`} />
                    </button>

                    {/* Section Body */}
                    <AnimatePresence>
                      {openSections[section.id] && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="px-6 md:px-8 pb-6 space-y-6">
                            {section.subsections.map((sub, j) => (
                              <div key={j}>
                                <h3 className="text-base font-bold text-primary mb-3">{sub.title}</h3>

                                {/* Warning Box */}
                                {sub.warning && (
                                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4">
                                    <div className="flex items-start gap-2">
                                      <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                                      <p className="text-amber-700 text-sm font-medium">Important — Please read carefully</p>
                                    </div>
                                  </div>
                                )}

                                {/* Content */}
                                {sub.content.length > 0 && (
                                  <ul className="space-y-2">
                                    {sub.content.map((item, k) => (
                                      <li key={k} className="flex items-start gap-2 text-gray-600 text-sm leading-relaxed">
                                        <span className="w-1.5 h-1.5 bg-secondary rounded-full flex-shrink-0 mt-2" />
                                        {item}
                                      </li>
                                    ))}
                                  </ul>
                                )}

                                {/* Membership Tiers */}
                                {sub.tiers && (
                                  <div className="grid sm:grid-cols-2 gap-4 mt-4">
                                    {sub.tiers.map((tier, t) => (
                                      <div key={t} className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                                        <h4 className="font-bold text-primary text-sm mb-3">{tier.name}</h4>
                                        <ul className="space-y-2">
                                          {tier.features.map((f, fi) => (
                                            <li key={fi} className="flex items-start gap-2 text-gray-600 text-sm">
                                              <CheckCircle2 className="w-4 h-4 text-secondary flex-shrink-0 mt-0.5" />
                                              {f}
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Warning Boxes */}
            <div className="mt-10 space-y-4">
              {[
                { title: 'Fraud Warning', text: 'Providing direct tuition to clients introduced by Alpha Home Tuition will result in immediate profile suspension, legal action, and public disclosure.', color: 'red' },
                { title: 'Payment Delay Warning', text: 'Failing to deposit payments received from guardians will incur a penalty of ₹100/day for up to 15 days. Legal action will be taken after 15 days.', color: 'amber' },
                { title: 'Direct Tuition Violation', text: 'All tuitions obtained through fraudulent means must be discontinued. Legal disputes fall under the jurisdiction of courts in Patna.', color: 'red' },
              ].map((box, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className={`rounded-2xl p-6 border ${
                    box.color === 'red' ? 'bg-red-50 border-red-200' : 'bg-amber-50 border-amber-200'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <AlertTriangle className={`w-6 h-6 flex-shrink-0 ${box.color === 'red' ? 'text-red-500' : 'text-amber-500'}`} />
                    <div>
                      <h4 className={`font-bold text-sm mb-1 ${box.color === 'red' ? 'text-red-700' : 'text-amber-700'}`}>{box.title}</h4>
                      <p className={`text-sm ${box.color === 'red' ? 'text-red-600' : 'text-amber-600'}`}>{box.text}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Accept Terms */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mt-10 bg-white rounded-2xl border border-gray-100 shadow-sm p-8"
            >
              <h3 className="text-xl font-bold text-primary mb-4">Self-Declaration</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-6">
                I hereby declare that I have read, understood, and agreed to abide by the terms and conditions set forth by Alpha Home Tuition Pvt. Ltd.
              </p>
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={accepted}
                  onChange={(e) => setAccepted(e.target.checked)}
                  className="mt-1 w-5 h-5 rounded border-gray-300 text-secondary focus:ring-secondary accent-[#FFD700]"
                />
                <span className="text-sm text-gray-700 group-hover:text-primary transition-colors">
                  I agree to the <strong>Terms & Conditions</strong> of Alpha Home Tuition Pvt. Ltd. and confirm that all information provided is accurate and truthful.
                </span>
              </label>
              {accepted && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mt-4 flex items-center gap-2 text-emerald-600 text-sm font-medium">
                  <CheckCircle2 className="w-5 h-5" />
                  Terms accepted. You can now proceed with registration.
                </motion.div>
              )}
            </motion.div>

            {/* Note */}
            <div className="mt-6 text-center text-gray-400 text-xs">
              <p>The company reserves the right to amend these terms and conditions without prior notification, in compliance with applicable Indian laws and regulations.</p>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
