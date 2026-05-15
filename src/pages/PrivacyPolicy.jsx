import { motion } from 'framer-motion';
import { Shield, Database, Share2, Lock, UserCheck, Scale, Eye, Server } from 'lucide-react';

const sections = [
  {
    icon: Database,
    title: 'Information We Collect',
    content: [
      'Personal details: Full name, phone number, email address, city, and residential address.',
      'Educational details: Academic qualifications, marksheets, degree certificates, and college information.',
      'Identity documents: Aadhar Card, passport-size photographs, and other government-issued IDs.',
      'Professional details: Teaching experience, preferred subjects, and salary expectations.',
      'Usage data: Browser information, IP address, and website interaction patterns.',
    ],
  },
  {
    icon: Eye,
    title: 'How We Use Your Data',
    content: [
      'To verify tutor identity and qualifications during the registration process.',
      'To match tutors with suitable tuition assignments based on location and expertise.',
      'To communicate updates about tuition opportunities, demo schedules, and policy changes.',
      'To process membership fees, service charges, and refund requests.',
      'To improve our platform and services through anonymized analytics.',
    ],
  },
  {
    icon: Share2,
    title: 'Data Sharing',
    content: [
      'We share limited tutor information (name, qualifications, experience) with parents/guardians for assignment matching.',
      'We do not sell, rent, or trade personal data to third-party companies or marketers.',
      'Data may be shared with law enforcement if required by legal proceedings or court orders.',
      'Internal team members access data strictly on a need-to-know basis for operational purposes.',
    ],
  },
  {
    icon: Lock,
    title: 'Data Security',
    content: [
      'All data is stored securely with access controls and encryption protocols.',
      'We use official communication channels (WhatsApp, email) for all data exchanges.',
      'Regular security reviews are conducted to ensure data protection measures are up to date.',
      'We follow industry-standard practices to protect against unauthorized access and data breaches.',
    ],
  },
  {
    icon: UserCheck,
    title: 'Your Rights',
    content: [
      'You can request access to all personal data we hold about you.',
      'You can request correction of inaccurate personal information.',
      'You can request deletion of your data, subject to our retention policies and legal obligations.',
      'You can withdraw consent for data processing at any time (this may affect your registration).',
    ],
  },
  {
    icon: Scale,
    title: 'Legal Compliance',
    content: [
      'We comply with the Information Technology Act, 2000, and its amendments.',
      'We comply with applicable Indian data protection regulations.',
      'Any misuse of data by tutors or staff will result in immediate termination and legal action.',
      'All legal disputes fall under the jurisdiction of courts in Patna, Bihar.',
    ],
  },
  {
    icon: Server,
    title: 'Data Retention',
    content: [
      'Active tutor profiles: Data retained for the duration of registration plus 1 year after deactivation.',
      'Inactive profiles: Data is anonymized or deleted after 2 years of inactivity.',
      'Financial records: Retained for 7 years as required by Indian taxation laws.',
      'Communication logs: Retained for 1 year for dispute resolution purposes.',
    ],
  },
];

export default function PrivacyPolicy() {
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
              Privacy & Security
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
              Privacy <span className="gradient-text">Policy</span>
            </h1>
            <p className="text-white/60 max-w-2xl mx-auto text-lg">
              Your privacy matters to us. Learn how Alpha Home Tuition Pvt. Ltd. collects, uses, and protects your personal data.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-6">
          {sections.map((section, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/5 rounded-xl flex items-center justify-center flex-shrink-0">
                  <section.icon className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-bold text-primary mb-4">{section.title}</h2>
                  <ul className="space-y-3">
                    {section.content.map((item, j) => (
                      <li key={j} className="flex items-start gap-2 text-gray-600 text-sm leading-relaxed">
                        <span className="w-1.5 h-1.5 bg-secondary rounded-full flex-shrink-0 mt-2" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Last Updated */}
        <div className="mt-10 text-center">
          <p className="text-gray-400 text-sm">Last Updated: May 2025 | Effective immediately</p>
          <p className="text-gray-400 text-xs mt-2">
            This privacy policy is governed by Indian laws. For queries, contact us at info@alphahometuition.com
          </p>
        </div>
      </div>
    </div>
  );
}
