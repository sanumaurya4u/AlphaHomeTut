import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, GraduationCap, Briefcase, IndianRupee, TrendingUp, CheckCircle2 } from 'lucide-react';
import { getTutorStats } from '@/services/tutorService';
import { getDemoRequestStats } from '@/services/demoRequestService';

export default function AdminOverview({ setActiveTab }) {
  const [tutorStats, setTutorStats] = useState({ total: 0, pending: 0, verified: 0, rejected: 0 });
  const [demoStats, setDemoStats] = useState({ total: 0, pending: 0, contacted: 0, assigned: 0, completed: 0 });

  useEffect(() => {
    async function loadStats() {
      try {
        const [t, d] = await Promise.all([getTutorStats(), getDemoRequestStats()]);
        setTutorStats(t);
        setDemoStats(d);
      } catch (err) {
        console.error('Failed to load stats', err);
      }
    }
    loadStats();
  }, []);

  const stats = [
    { label: 'Total Students', value: demoStats.total.toString(), icon: Users, color: 'text-blue-600', bgColor: 'bg-blue-50', change: '+12% this month' },
    { label: 'Verified Tutors', value: tutorStats.verified.toString(), icon: GraduationCap, color: 'text-emerald-600', bgColor: 'bg-emerald-50', change: '+5% this month' },
    { label: 'Active Jobs', value: (demoStats.pending + demoStats.contacted).toString(), icon: Briefcase, color: 'text-amber-600', bgColor: 'bg-amber-50', change: '+24 new this week' },
    { label: 'Monthly Revenue', value: '₹4.2L', icon: IndianRupee, color: 'text-purple-600', bgColor: 'bg-purple-50', change: '+18% vs last month' },
  ];

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-2xl ${stat.bgColor} ${stat.color} flex items-center justify-center`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
            <p className="text-3xl font-black text-primary mb-1">{stat.value}</p>
            <p className="text-gray-500 font-medium text-sm">{stat.label}</p>
            <p className="text-xs text-emerald-600 font-bold mt-4 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> {stat.change}
            </p>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-primary text-lg">Recent Activity</h3>
            <button className="text-secondary font-medium text-sm hover:underline">View All</button>
          </div>
          <div className="space-y-4">
            {[
              { text: 'New tutor registration: Ravi Kumar', time: '10 mins ago', type: 'tutor' },
              { text: 'Demo scheduled for Class 10 Math', time: '1 hour ago', type: 'demo' },
              { text: 'Payment received from Student ID #1042', time: '3 hours ago', type: 'payment' },
              { text: 'New job posted: Physics for Class 12', time: '5 hours ago', type: 'job' },
            ].map((activity, i) => (
              <div key={i} className="flex items-start gap-4 p-3 hover:bg-gray-50 rounded-xl transition-colors">
                <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                  activity.type === 'tutor' ? 'bg-emerald-500' :
                  activity.type === 'demo' ? 'bg-blue-500' :
                  activity.type === 'payment' ? 'bg-purple-500' : 'bg-amber-500'
                }`} />
                <div>
                  <p className="text-sm font-medium text-gray-800">{activity.text}</p>
                  <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Actions */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-primary text-lg">Action Required</h3>
            <span className="bg-red-100 text-red-600 text-xs font-bold px-2.5 py-1 rounded-full">{(tutorStats.pending > 0 || demoStats.pending > 0) ? 'Tasks Pending' : 'All clear'}</span>
          </div>
          <div className="space-y-3">
            {[
              { text: `Review ${tutorStats.pending} new tutor applications`, action: 'Review Now', tab: 'tutors' },
              { text: `Assign tutors to ${demoStats.pending} pending jobs`, action: 'Assign', tab: 'jobs' },
              { text: 'Approve KYC documents', action: 'Approve', tab: 'tutors' },
            ].map((task, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-red-100 bg-red-50/50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold text-sm">
                    {i+1}
                  </div>
                  <p className="text-sm font-medium text-gray-800">{task.text}</p>
                </div>
                <button 
                  onClick={() => setActiveTab && setActiveTab(task.tab)}
                  className="bg-white border border-gray-200 text-gray-700 hover:text-primary hover:border-gray-300 px-4 py-1.5 rounded-lg text-sm font-bold shadow-sm transition-all"
                >
                  {task.action}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
