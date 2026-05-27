import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import PageHeader from '@/components/admin/PageHeader';
import DataTable from '@/components/admin/DataTable';
import StatusBadge from '@/components/admin/StatusBadge';
import StatsCard from '@/components/admin/StatsCard';
import { getMemberships } from '@/services/membershipService';
import { formatDate, formatCurrency } from '@/utils/formatters';
import { DollarSign, TrendingUp, CreditCard, Info } from 'lucide-react';

export default function Payments() {
  const [data, setData] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getMemberships({ page, pageSize });
      setData(result.data || []);
      setCount(result.count || 0);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, [page, pageSize]);

  useState(() => { fetchData(); });
  const refetch = () => fetchData();

  const totalRevenue = data.reduce((sum, m) => sum + (m.amount || 0), 0);
  const activeCount = data.filter(m => m.status === 'Active').length;

  const columns = [
    { key: 'tutor_name', label: 'Tutor', render: (_, row) => row.tutors?.full_name || '—' },
    { key: 'plan_name', label: 'Plan' },
    { key: 'amount', label: 'Amount', render: (v) => formatCurrency(v) },
    { key: 'status', label: 'Status', render: (v) => <StatusBadge status={v} /> },
    { key: 'purchased_at', label: 'Date', render: (v) => formatDate(v) },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <PageHeader title="Payments" description="Track membership payments and revenue" />

      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        <StatsCard title="Total Revenue" value={totalRevenue} icon={DollarSign} color="green" />
        <StatsCard title="Active Subscriptions" value={activeCount} icon={CreditCard} color="blue" />
        <StatsCard title="Total Transactions" value={count} icon={TrendingUp} color="purple" />
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-6 flex items-start gap-3">
        <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-blue-800">Payment Gateway Coming Soon</p>
          <p className="text-xs text-blue-600 mt-0.5">Razorpay/Stripe integration will be added in a future update. Currently showing membership payment records.</p>
        </div>
      </div>

      <DataTable
        columns={columns} data={data} loading={loading}
        page={page} totalPages={Math.ceil(count / pageSize)} pageSize={pageSize} totalCount={count}
        onPageChange={(p) => { setPage(p); setTimeout(refetch, 50); }}
        onPageSizeChange={(s) => { setPageSize(s); setPage(1); setTimeout(refetch, 50); }}
      />
    </motion.div>
  );
}
