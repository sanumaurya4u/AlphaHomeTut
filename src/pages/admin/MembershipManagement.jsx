import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import PageHeader from '@/components/admin/PageHeader';
import DataTable from '@/components/admin/DataTable';
import StatusBadge from '@/components/admin/StatusBadge';
import StatsCard from '@/components/admin/StatsCard';
import Modal from '@/components/admin/Modal';
import { getMemberships, updateMembershipStatus, getMembershipStats } from '@/services/membershipService';
import { formatDate, formatCurrency } from '@/utils/formatters';
import { MEMBERSHIP_STATUS } from '@/constants';
import { Crown, DollarSign, TrendingUp } from 'lucide-react';

export default function MembershipManagement() {
  const [data, setData] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});
  const [statusFilter, setStatusFilter] = useState('');
  const [planFilter, setPlanFilter] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selected, setSelected] = useState(null);
  const [statusOpen, setStatusOpen] = useState(false);
  const [newStatus, setNewStatus] = useState('');

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [result, memberStats] = await Promise.all([
        getMemberships({ status: statusFilter, planName: planFilter, page, pageSize }),
        getMembershipStats(),
      ]);
      setData(result.data || []);
      setCount(result.count || 0);
      setStats(memberStats);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, [statusFilter, planFilter, page, pageSize]);

  useState(() => { fetchData(); });
  const refetch = () => fetchData();

  const handleStatusUpdate = async () => {
    try {
      await updateMembershipStatus(selected.id, newStatus);
      toast.success('Status updated');
      setStatusOpen(false);
      refetch();
    } catch { toast.error('Update failed'); }
  };

  const totalRevenue = data.reduce((sum, m) => sum + (m.amount || 0), 0);

  const columns = [
    { key: 'tutor_name', label: 'Tutor', render: (_, row) => row.tutors?.full_name || '—' },
    { key: 'plan_name', label: 'Plan', render: (v) => <span className="font-medium">{v}</span> },
    { key: 'amount', label: 'Amount', render: (v) => formatCurrency(v) },
    { key: 'status', label: 'Status', render: (v) => <StatusBadge status={v} /> },
    { key: 'purchased_at', label: 'Purchased', render: (v) => formatDate(v) },
    { key: 'expires_at', label: 'Expires', render: (v) => formatDate(v) },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <PageHeader title="Membership Plans" description="Track membership purchases and renewals" />

      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        <StatsCard title="Active Memberships" value={stats.totalActive || 0} icon={Crown} color="green" />
        <StatsCard title="Total Revenue" value={totalRevenue} icon={DollarSign} color="orange" />
        <StatsCard title="This Month" value={stats.silver || 0 + (stats.platinum || 0)} icon={TrendingUp} color="blue" />
      </div>

      <DataTable
        columns={columns} data={data} loading={loading}
        filters={[
          { key: 'status', label: 'All Status', options: Object.values(MEMBERSHIP_STATUS) },
          { key: 'plan', label: 'All Plans', options: ['Silver', 'Platinum'] },
        ]}
        filterValues={{ status: statusFilter, plan: planFilter }}
        onFilterChange={(key, v) => { if (key === 'status') setStatusFilter(v); if (key === 'plan') setPlanFilter(v); setPage(1); setTimeout(refetch, 50); }}
        page={page} totalPages={Math.ceil(count / pageSize)} pageSize={pageSize} totalCount={count}
        onPageChange={(p) => { setPage(p); setTimeout(refetch, 50); }}
        onPageSizeChange={(s) => { setPageSize(s); setPage(1); setTimeout(refetch, 50); }}
        renderActions={(row) => (
          <button onClick={() => { setSelected(row); setNewStatus(row.status); setStatusOpen(true); }} className="text-xs text-primary font-medium hover:text-secondary">Edit</button>
        )}
      />

      <Modal isOpen={statusOpen} onClose={() => setStatusOpen(false)} title="Update Membership" size="sm">
        <div className="space-y-4">
          <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none">
            {Object.values(MEMBERSHIP_STATUS).map(s => <option key={s}>{s}</option>)}
          </select>
          <button onClick={handleStatusUpdate} className="w-full bg-primary text-white py-2.5 rounded-xl text-sm font-medium hover:bg-primary-light transition-colors">Save</button>
        </div>
      </Modal>
    </motion.div>
  );
}
