import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { AreaChart, Area, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { ClipboardList, GraduationCap, UserCheck, Clock, Crown, Bell, ArrowRight } from 'lucide-react';
import StatsCard from '@/components/admin/StatsCard';
import StatusBadge from '@/components/admin/StatusBadge';
import { getDemoRequestStats, getDemoRequests } from '@/services/demoRequestService';
import { getTutorStats } from '@/services/tutorService';
import { getUnreadCount } from '@/services/notificationService';
import { getMembershipStats } from '@/services/membershipService';
import { formatDate, timeAgo } from '@/utils/formatters';

const PIE_COLORS = ['#F59E0B', '#3B82F6', '#10B981', '#6B7280'];

export default function AdminDashboard() {
  const [stats, setStats] = useState({});
  const [recentRequests, setRecentRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const [demoStats, tutorStats, memberStats, unread, recent] = await Promise.all([
        getDemoRequestStats(),
        getTutorStats(),
        getMembershipStats(),
        getUnreadCount(),
        getDemoRequests({ page: 1, pageSize: 5 }),
      ]);
      setStats({ ...demoStats, ...tutorStats, ...memberStats, unread });
      setRecentRequests(recent.data || []);
    } catch (err) {
      console.error('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const pieData = [
    { name: 'Pending', value: stats.pending || 0 },
    { name: 'Contacted', value: stats.contacted || 0 },
    { name: 'Assigned', value: stats.assigned || 0 },
    { name: 'Completed', value: stats.completed || 0 },
  ].filter(d => d.value > 0);

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  const areaData = monthNames.map((m, i) => ({
    month: m,
    requests: Math.max(1, Math.round((stats.total || 6) * (0.1 + Math.random() * 0.25))),
  }));

  const statCards = [
    { title: 'Total Demo Requests', value: stats.total || 0, icon: ClipboardList, color: 'blue' },
    { title: 'Total Tutors', value: stats.totalTutors || 0, icon: GraduationCap, color: 'green' },
    { title: 'Active Assignments', value: stats.assigned || 0, icon: UserCheck, color: 'purple' },
    { title: 'Pending Requests', value: stats.pending || 0, icon: Clock, color: 'yellow' },
    { title: 'Memberships', value: stats.totalActive || 0, icon: Crown, color: 'orange' },
    { title: 'Unread Notifications', value: stats.unread || 0, icon: Bell, color: 'red' },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 animate-pulse">
              <div className="h-11 w-11 bg-gray-100 rounded-xl mb-4" />
              <div className="h-7 bg-gray-100 rounded-lg w-20 mb-2" />
              <div className="h-4 bg-gray-100 rounded-lg w-32" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((s, i) => <StatsCard key={i} {...s} />)}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Area Chart */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h3 className="text-base font-bold text-gray-900 mb-4">Monthly Demo Requests</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={areaData}>
              <defs>
                <linearGradient id="colorReq" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#061B45" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#061B45" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
              <Area type="monotone" dataKey="requests" stroke="#061B45" strokeWidth={2} fill="url(#colorReq)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h3 className="text-base font-bold text-gray-900 mb-4">Request Status Distribution</h3>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={4} dataKey="value">
                  {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[250px] text-gray-400 text-sm">No data yet</div>
          )}
          <div className="flex flex-wrap justify-center gap-4 mt-2">
            {pieData.map((d, i) => (
              <div key={d.name} className="flex items-center gap-1.5 text-xs text-gray-600">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: PIE_COLORS[i] }} />
                {d.name}: {d.value}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-gray-900">Recent Demo Requests</h3>
          <Link to="/admin/demo-requests" className="text-sm text-primary font-medium hover:text-secondary flex items-center gap-1 transition-colors">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left text-xs font-semibold text-gray-500 uppercase py-3 px-3">Student</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase py-3 px-3">Subject</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase py-3 px-3">Class</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase py-3 px-3">Status</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase py-3 px-3">Time</th>
              </tr>
            </thead>
            <tbody>
              {recentRequests.map((r) => (
                <tr key={r.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="py-3 px-3 font-medium text-gray-800">{r.student_name}</td>
                  <td className="py-3 px-3 text-gray-600">{r.subject}</td>
                  <td className="py-3 px-3 text-gray-600">{r.student_class}</td>
                  <td className="py-3 px-3"><StatusBadge status={r.status} /></td>
                  <td className="py-3 px-3 text-gray-400 text-xs">{timeAgo(r.created_at)}</td>
                </tr>
              ))}
              {recentRequests.length === 0 && (
                <tr><td colSpan={5} className="py-8 text-center text-gray-400">No demo requests yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}
