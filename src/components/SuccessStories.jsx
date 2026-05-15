import { motion } from 'framer-motion';
import { TrendingUp, Users, Award, IndianRupee } from 'lucide-react';

const stories = [
  {
    name: 'Ravi Kumar',
    role: 'Mathematics Tutor',
    experience: '2 years with Alpha',
    earnings: '₹15,000/month',
    students: '8 Students',
    quote: 'Alpha Home Tuition gave me a platform to start my teaching career. Within 2 months, I had 4 regular students and now I earn steadily every month.',
    badge: 'Top Earner',
    badgeColor: 'bg-amber-100 text-amber-700',
  },
  {
    name: 'Anjali Singh',
    role: 'Science & English Tutor',
    experience: '1.5 years with Alpha',
    earnings: '₹12,000/month',
    students: '6 Students',
    quote: 'As a B.Ed. graduate, I wanted flexible teaching opportunities. Alpha connected me with students near my home. The process was smooth and professional.',
    badge: 'Star Tutor',
    badgeColor: 'bg-blue-100 text-blue-700',
  },
  {
    name: 'Suresh Mishra',
    role: 'Physics & Chemistry Tutor',
    experience: '3 years with Alpha',
    earnings: '₹22,000/month',
    students: '12 Students',
    quote: 'Started with Silver membership and upgraded to Platinum. The high-paying assignments helped me earn more. Best decision I made for my teaching career.',
    badge: 'Platinum Member',
    badgeColor: 'bg-purple-100 text-purple-700',
  },
];

export default function SuccessStories() {
  return (
    <section className="py-20 md:py-28 bg-gray-50 relative overflow-hidden">
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/3 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-secondary-dark font-semibold text-sm uppercase tracking-widest">Success Stories</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary mt-3 mb-6">
            Tutors Who Grew <span className="gradient-text">With Us</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Real stories from tutors who transformed their teaching career with Alpha Home Tuition.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {stories.map((story, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="group"
            >
              <div className="bg-white rounded-2xl p-8 h-full border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 card-hover relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-secondary/5 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />

                {/* Badge */}
                <span className={`inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full mb-4 ${story.badgeColor}`}>
                  <Award className="w-3.5 h-3.5" />
                  {story.badge}
                </span>

                {/* Avatar & Info */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {story.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="font-bold text-primary">{story.name}</p>
                    <p className="text-gray-500 text-sm">{story.role}</p>
                  </div>
                </div>

                {/* Quote */}
                <p className="text-gray-600 text-sm leading-relaxed mb-5 italic">"{story.quote}"</p>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3 pt-4 border-t border-gray-100">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-secondary mb-1">
                      <IndianRupee className="w-3.5 h-3.5" />
                    </div>
                    <p className="text-xs font-bold text-primary">{story.earnings}</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-secondary mb-1">
                      <Users className="w-3.5 h-3.5" />
                    </div>
                    <p className="text-xs font-bold text-primary">{story.students}</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-secondary mb-1">
                      <TrendingUp className="w-3.5 h-3.5" />
                    </div>
                    <p className="text-xs font-bold text-primary">{story.experience}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
