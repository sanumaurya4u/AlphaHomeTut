import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { IndianRupee, Download, TrendingUp, Loader2 } from 'lucide-react';
import { supabase } from '@/supabase/config';

export default function TutorEarnings({ tutorId }) {
  const [earningsData, setEarningsData] = useState([]);
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState({ thisMonth: 0, total: 0, pending: 0, growth: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEarnings = async () => {
      if (!tutorId) {
        setLoading(false);
        return;
      }
      try {
        const { data, error } = await supabase
          .from('tutor_earnings')
          .select('*')
          .eq('tutor_id', tutorId)
          .order('date', { ascending: false });
        
        if (error) {
          console.error('Failed to fetch earnings', error);
        }

        const realData = data || [];
        
        const total = realData.filter(e => e.status === 'Paid').reduce((acc, curr) => acc + Number(curr.amount), 0);
        const pending = realData.filter(e => e.status === 'Pending').reduce((acc, curr) => acc + Number(curr.amount), 0);
        
        const currentMonthData = realData.filter(e => {
          const d = new Date(e.date);
          const now = new Date();
          return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
        });
        const thisMonth = currentMonthData.reduce((acc, curr) => acc + Number(curr.amount), 0);
        
        setStats({ thisMonth, total, pending, growth: 12 }); // Growth mocked as 12% for UI
        setHistory(realData.slice(0, 5));
        
        // Simple grouping for the last 6 entries for the chart if data exists
        const chartData = realData.slice(0, 6).reverse().map(e => ({
          month: new Date(e.date).toLocaleDateString('en-US', { month: 'short' }),
          amount: Number(e.amount)
        }));
        
        setEarningsData(chartData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchEarnings();
  }, [tutorId]);

  const maxEarning = earningsData.length > 0 ? Math.max(...earningsData.map(e => e.amount)) : 10000;

  if (loading) {
    return <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <p className="text-gray-500 text-sm">This Month</p>
          <p className="text-3xl font-bold text-primary mt-1 flex items-center gap-2">
            ₹{stats.thisMonth.toLocaleString()} <span className="text-xs text-emerald-500 font-medium bg-emerald-50 px-2 py-1 rounded-lg flex items-center gap-1"><TrendingUp className="w-3 h-3"/> +{stats.growth}%</span>
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <p className="text-gray-500 text-sm">Total Earnings</p>
          <p className="text-3xl font-bold text-primary mt-1">₹{stats.total.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <p className="text-gray-500 text-sm">Pending</p>
          <p className="text-3xl font-bold text-amber-500 mt-1">₹{stats.pending.toLocaleString()}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Chart */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="font-bold text-primary mb-6">Earnings Overview</h3>
          {earningsData.length === 0 ? (
            <div className="flex items-center justify-center h-56 text-gray-500">No earnings data yet.</div>
          ) : (
            <div className="flex items-end gap-3 h-56">
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
          )}
        </div>

        {/* History */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-primary">Payment History</h3>
            <button className="text-primary hover:text-secondary transition-colors text-sm font-medium flex items-center gap-1">
              <Download className="w-4 h-4" /> Export
            </button>
          </div>
          <div className="space-y-3">
            {history.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No payment history found.</p>
            ) : (
              history.map((p, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-lg shadow-sm border border-gray-100 flex items-center justify-center text-primary">
                      <IndianRupee className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-primary text-sm">Payment</p>
                      <p className="text-xs text-gray-400">Date: {new Date(p.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary">₹{Number(p.amount).toLocaleString()}</p>
                    <span className={`text-xs font-medium ${p.status === 'Paid' ? 'text-emerald-600' : 'text-amber-500'}`}>{p.status}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
