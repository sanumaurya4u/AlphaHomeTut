import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ShieldAlert, Users, GraduationCap, ArrowRight } from 'lucide-react';

export default function PortalSelection() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#061B45] relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#061B45] via-[#0a2d6e] to-[#061B45]" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-secondary/5 rounded-full blur-3xl -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/3 rounded-full blur-3xl translate-y-1/2 translate-x-1/2" />

      <div className="relative z-10 max-w-5xl w-full px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="w-20 h-20 bg-secondary/15 rounded-3xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm border border-secondary/20">
            <GraduationCap className="w-10 h-10 text-secondary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Alpha Home Tuition
          </h1>
          <p className="text-lg text-white/60 max-w-2xl mx-auto">
            Please select your portal to continue
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* User Services Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Link
              to="/home"
              className="group block relative p-1 rounded-3xl overflow-hidden transition-transform hover:-translate-y-2"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-secondary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-[22px] p-8 md:p-10 h-full flex flex-col hover:bg-white/[0.06] transition-colors">
                <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                  <Users className="w-8 h-8 text-emerald-400" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-3">User Services</h2>
                <p className="text-white/50 mb-8 flex-1">
                  Find a tutor, register as a tutor, view membership plans, and explore our services.
                </p>
                <div className="flex items-center text-emerald-400 font-semibold group-hover:gap-3 gap-2 transition-all">
                  Continue as User <ArrowRight className="w-5 h-5" />
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Admin Portal Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Link
              to="/admin/login"
              className="group block relative p-1 rounded-3xl overflow-hidden transition-transform hover:-translate-y-2"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-secondary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-[22px] p-8 md:p-10 h-full flex flex-col hover:bg-white/[0.06] transition-colors">
                <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                  <ShieldAlert className="w-8 h-8 text-secondary" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-3">Admin Portal</h2>
                <p className="text-white/50 mb-8 flex-1">
                  Secure login for administrators to manage tutors, view demo requests, and extract data.
                </p>
                <div className="flex items-center text-secondary font-semibold group-hover:gap-3 gap-2 transition-all">
                  Login as Admin <ArrowRight className="w-5 h-5" />
                </div>
              </div>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
