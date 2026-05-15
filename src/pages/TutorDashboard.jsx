import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, BookOpen, Send, IndianRupee, Bell, Settings, User,
  TrendingUp, Clock, MapPin, ChevronRight, Star, Calendar, CheckCircle2,
  AlertCircle, Menu, X, LogOut
} from 'lucide-react';

const menuItems = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'available', label: 'Available Tuitions', icon: BookOpen },
  { id: 'applied', label: 'Applied Tuitions', icon: Send },
  { id: 'earnings', label: 'Earnings', icon: IndianRupee },
  { id: 'notifications', label: 'Notifications', icon: Bell, badge: 3 },
  { id: 'settings', label: 'Profile Settings', icon: Settings },
];

const dashboardStats = [
  { label: 'Active Tuitions', value: '3', icon: BookOpen, color: 'bg-blue-500', change: '+1 this month' },
  { label: 'Pending Requests', value: '2', icon: Clock, color: 'bg-amber-500', change: 'Awaiting response' },
  { label: 'Monthly Earnings', value: '₹12,500', icon: IndianRupee, color: 'bg-emerald-500', change: '+₹2,500 vs last month' },
  { label: 'Upcoming Demos', value: '1', icon: Calendar, color: 'bg-purple-500', change: 'Tomorrow, 4 PM' },
];

const availableTuitions = [
  { id: 1, subject: 'Mathematics', class: 'Class 10', location: 'Boring Road, Patna', salary: '₹3,000', mode: 'Home', timing: 'Evening (5-7 PM)', posted: '2 hours ago' },
  { id: 2, subject: 'Physics + Chemistry', class: 'Class 12', location: 'Kankarbagh, Patna', salary: '₹4,000', mode: 'Home', timing: 'Morning (8-10 AM)', posted: '5 hours ago' },
  { id: 3, subject: 'English', class: 'Class 8', location: 'Danapur, Patna', salary: '₹2,000', mode: 'Online', timing: 'Evening (4-5 PM)', posted: '1 day ago' },
  { id: 4, subject: 'All Subjects', class: 'Class 5', location: 'Rajendra Nagar, Patna', salary: '₹2,500', mode: 'Home', timing: 'Afternoon (3-5 PM)', posted: '1 day ago' },
];

const appliedTuitions = [
  { id: 1, subject: 'Science', class: 'Class 9', location: 'Bailey Road', salary: '₹3,000', status: 'Demo Scheduled', statusColor: 'text-blue-600 bg-blue-50' },
  { id: 2, subject: 'Mathematics', class: 'Class 7', location: 'Patliputra', salary: '₹2,500', status: 'Under Review', statusColor: 'text-amber-600 bg-amber-50' },
];

const notifications = [
  { id: 1, text: 'New tuition available: Class 10 Mathematics in Boring Road', time: '2 hours ago', read: false },
  { id: 2, text: 'Your demo for Class 9 Science is scheduled for tomorrow at 4 PM', time: '5 hours ago', read: false },
  { id: 3, text: 'Payment of ₹3,000 received for October tuition', time: '1 day ago', read: false },
  { id: 4, text: 'Monthly earnings report for September is ready', time: '3 days ago', read: true },
  { id: 5, text: 'Profile verification completed successfully', time: '1 week ago', read: true },
];

const earningsData = [
  { month: 'May', amount: 8000 },
  { month: 'Jun', amount: 9500 },
  { month: 'Jul', amount: 10000 },
  { month: 'Aug', amount: 11000 },
  { month: 'Sep', amount: 10000 },
  { month: 'Oct', amount: 12500 },
];

export default function TutorDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const maxEarning = Math.max(...earningsData.map(e => e.amount));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar for mobile */}
      <div className="lg:hidden bg-primary px-4 py-3 flex items-center justify-between sticky top-0 z-50">
        <button onClick={() => setSidebarOpen(true)} className="text-white p-2 hover:bg-white/10 rounded-lg">
          <Menu className="w-5 h-5" />
        </button>
        <span className="text-white font-bold text-sm">Tutor Dashboard</span>
        <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center text-primary text-xs font-bold">RK</div>
      </div>

      <div className="flex">
        {/* Sidebar Overlay (mobile) */}
        {sidebarOpen && (
          <div className="fixed inset-0 bg-black/50 z-50 lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        {/* Sidebar */}
        <aside className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-primary text-white flex-shrink-0 z-50 transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}>
          <div className="p-6 h-full flex flex-col">
            {/* Close button mobile */}
            <div className="lg:hidden flex justify-end mb-2">
              <button onClick={() => setSidebarOpen(false)} className="text-white/70 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Profile */}
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center text-primary font-bold">RK</div>
              <div>
                <p className="font-bold text-sm">Ravi Kumar</p>
                <p className="text-white/50 text-xs">Platinum Member</p>
              </div>
            </div>

            {/* Menu */}
            <nav className="flex-1 space-y-1">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    activeTab === item.id
                      ? 'bg-secondary/15 text-secondary'
                      : 'text-white/60 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                  {item.badge && (
                    <span className="ml-auto bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                </button>
              ))}
            </nav>

            {/* Logout */}
            <button className="flex items-center gap-3 px-4 py-3 text-white/40 hover:text-white/70 text-sm transition-colors mt-4">
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0 p-4 md:p-8 lg:p-10">
          {/* Overview */}
          {activeTab === 'overview' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
              <div className="mb-8">
                <h1 className="text-2xl font-bold text-primary">Welcome back, Ravi! 👋</h1>
                <p className="text-gray-500 text-sm mt-1">Here&apos;s your teaching activity overview.</p>
              </div>

              {/* Stats */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {dashboardStats.map((stat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.1 }}
                    className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className={`w-10 h-10 ${stat.color} rounded-xl flex items-center justify-center`}>
                        <stat.icon className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-primary">{stat.value}</p>
                    <p className="text-gray-500 text-xs mt-1">{stat.label}</p>
                    <p className="text-xs text-emerald-500 font-medium mt-2 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" /> {stat.change}
                    </p>
                  </motion.div>
                ))}
              </div>

              {/* Chart */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-8">
                <h3 className="font-bold text-primary mb-6">Earnings Overview</h3>
                <div className="flex items-end gap-3 h-48">
                  {earningsData.map((item, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2">
                      <span className="text-xs font-semibold text-primary">₹{(item.amount / 1000).toFixed(1)}k</span>
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${(item.amount / maxEarning) * 100}%` }}
                        transition={{ duration: 0.6, delay: i * 0.1 }}
                        className={`w-full rounded-t-lg ${i === earningsData.length - 1 ? 'bg-secondary' : 'bg-primary/20'} min-h-[8px]`}
                      />
                      <span className="text-xs text-gray-400">{item.month}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h3 className="font-bold text-primary mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  {notifications.slice(0, 3).map((n) => (
                    <div key={n.id} className={`flex items-start gap-3 p-3 rounded-xl ${n.read ? 'bg-gray-50' : 'bg-secondary/5 border border-secondary/10'}`}>
                      <div className={`w-2 h-2 rounded-full flex-shrink-0 mt-2 ${n.read ? 'bg-gray-300' : 'bg-secondary'}`} />
                      <div className="flex-1">
                        <p className="text-sm text-gray-700">{n.text}</p>
                        <p className="text-xs text-gray-400 mt-1">{n.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Available Tuitions */}
          {activeTab === 'available' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
              <h2 className="text-2xl font-bold text-primary mb-6">Available Tuitions</h2>
              <div className="space-y-4">
                {availableTuitions.map((t) => (
                  <div key={t.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-bold text-primary">{t.subject}</h3>
                          <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">{t.class}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${t.mode === 'Online' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'}`}>{t.mode}</span>
                        </div>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{t.location}</span>
                          <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{t.timing}</span>
                          <span className="flex items-center gap-1"><IndianRupee className="w-3.5 h-3.5" />{t.salary}/mo</span>
                        </div>
                        <p className="text-xs text-gray-400 mt-2">Posted {t.posted}</p>
                      </div>
                      <button className="bg-secondary hover:bg-secondary-light text-primary font-bold px-6 py-2.5 rounded-xl text-sm transition-all hover:shadow-md flex-shrink-0 flex items-center gap-1">
                        Apply <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Applied Tuitions */}
          {activeTab === 'applied' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
              <h2 className="text-2xl font-bold text-primary mb-6">Applied Tuitions</h2>
              <div className="space-y-4">
                {appliedTuitions.map((t) => (
                  <div key={t.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <h3 className="font-bold text-primary">{t.subject} — {t.class}</h3>
                        <div className="flex flex-wrap gap-3 mt-2 text-sm text-gray-500">
                          <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{t.location}</span>
                          <span className="flex items-center gap-1"><IndianRupee className="w-3.5 h-3.5" />{t.salary}/mo</span>
                        </div>
                      </div>
                      <span className={`px-4 py-1.5 rounded-full text-xs font-bold ${t.statusColor}`}>
                        {t.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Earnings */}
          {activeTab === 'earnings' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
              <h2 className="text-2xl font-bold text-primary mb-6">Earnings</h2>
              <div className="grid sm:grid-cols-3 gap-4 mb-8">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <p className="text-gray-500 text-sm">This Month</p>
                  <p className="text-3xl font-bold text-primary mt-1">₹12,500</p>
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <p className="text-gray-500 text-sm">Total Earnings</p>
                  <p className="text-3xl font-bold text-primary mt-1">₹61,000</p>
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <p className="text-gray-500 text-sm">Pending</p>
                  <p className="text-3xl font-bold text-amber-500 mt-1">₹3,000</p>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h3 className="font-bold text-primary mb-4">Payment History</h3>
                <div className="space-y-3">
                  {[
                    { month: 'October 2025', amount: '₹12,500', status: 'Paid', date: 'Oct 5' },
                    { month: 'September 2025', amount: '₹10,000', status: 'Paid', date: 'Sep 5' },
                    { month: 'August 2025', amount: '₹11,000', status: 'Paid', date: 'Aug 5' },
                  ].map((p, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div>
                        <p className="font-semibold text-primary text-sm">{p.month}</p>
                        <p className="text-xs text-gray-400">Received on {p.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-primary">{p.amount}</p>
                        <span className="text-xs text-emerald-600 font-medium">{p.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Notifications */}
          {activeTab === 'notifications' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
              <h2 className="text-2xl font-bold text-primary mb-6">Notifications</h2>
              <div className="space-y-3">
                {notifications.map((n) => (
                  <div key={n.id} className={`bg-white rounded-xl border p-5 transition-shadow hover:shadow-sm ${
                    n.read ? 'border-gray-100' : 'border-secondary/20 bg-secondary/5'
                  }`}>
                    <div className="flex items-start gap-3">
                      <div className={`w-2 h-2 rounded-full flex-shrink-0 mt-2 ${n.read ? 'bg-gray-300' : 'bg-secondary'}`} />
                      <div>
                        <p className={`text-sm ${n.read ? 'text-gray-600' : 'text-gray-800 font-medium'}`}>{n.text}</p>
                        <p className="text-xs text-gray-400 mt-1">{n.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Settings */}
          {activeTab === 'settings' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
              <h2 className="text-2xl font-bold text-primary mb-6">Profile Settings</h2>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center text-white text-2xl font-bold">RK</div>
                  <div>
                    <h3 className="font-bold text-primary text-xl">Ravi Kumar</h3>
                    <p className="text-gray-500 text-sm">Platinum Member • Verified Tutor</p>
                    <span className="inline-flex items-center gap-1 text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full mt-1 font-medium">
                      <CheckCircle2 className="w-3 h-3" /> Profile Verified
                    </span>
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-6">
                  {[
                    { label: 'Full Name', value: 'Ravi Kumar' },
                    { label: 'Phone', value: '+91 98765 43210' },
                    { label: 'Email', value: 'ravi.kumar@email.com' },
                    { label: 'City', value: 'Patna, Bihar' },
                    { label: 'Qualification', value: 'M.Sc. Mathematics' },
                    { label: 'Experience', value: '5+ Years' },
                    { label: 'Subjects', value: 'Mathematics, Physics' },
                    { label: 'Membership', value: 'Platinum (₹1,000)' },
                  ].map((field, i) => (
                    <div key={i}>
                      <label className="block text-xs text-gray-400 font-medium mb-1">{field.label}</label>
                      <p className="text-sm font-semibold text-primary bg-gray-50 rounded-xl px-4 py-3">{field.value}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-8 flex gap-3">
                  <button className="bg-primary text-white font-bold px-6 py-3 rounded-xl text-sm hover:bg-primary-light transition-all">Edit Profile</button>
                  <button className="bg-gray-100 text-gray-600 font-medium px-6 py-3 rounded-xl text-sm hover:bg-gray-200 transition-all">Change Password</button>
                </div>
              </div>
            </motion.div>
          )}
        </main>
      </div>
    </div>
  );
}
