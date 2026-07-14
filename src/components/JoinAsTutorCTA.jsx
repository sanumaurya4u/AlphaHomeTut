import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GraduationCap, ArrowRight } from 'lucide-react';

export default function JoinAsTutorCTA() {
  return (
    <section className="py-20 bg-[#061B45] relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#E3A30C]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <GraduationCap className="w-16 h-16 text-[#E3A30C] mx-auto mb-6" />
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Want to Join Our Elite Team of Tutors?
          </h2>
          <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
            Share your knowledge, inspire students, and earn a great income on your own schedule.
          </p>
          
          <Link 
            to="/signup"
            className="inline-flex items-center gap-2 bg-[#E3A30C] hover:bg-[#c9900a] text-[#061B45] font-bold px-8 py-4 rounded-xl transition-all hover:scale-105 shadow-lg shadow-[#E3A30C]/20"
          >
            Become a Tutor Today
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
