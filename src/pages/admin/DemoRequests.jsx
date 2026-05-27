import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Eye, Trash2, UserPlus, MoreVertical } from 'lucide-react';
import PageHeader from '@/components/admin/PageHeader';
import DataTable from '@/components/admin/DataTable';
import StatusBadge from '@/components/admin/StatusBadge';
import Modal from '@/components/admin/Modal';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import { getDemoRequests, updateDemoRequestStatus, deleteDemoRequest, assignTutorToRequest } from '@/services/demoRequestService';
import { getVerifiedTutors } from '@/services/tutorService';
import { useDebounce } from '@/hooks/useDebounce';
import { formatDate } from '@/utils/formatters';
import { exportToCSV } from '@/utils/csvExport';
import { DEMO_STATUS } from '@/constants';

export default function DemoRequests() {
  const [data, setData] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [modeFilter, setModeFilter] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selected, setSelected] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const [assignOpen, setAssignOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [tutors, setTutors] = useState([]);
  const [selectedTutor, setSelectedTutor] = useState('');
  const [assignNotes, setAssignNotes] = useState('');

  const debouncedSearch = useDebounce(search);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getDemoRequests({ search: debouncedSearch, status: statusFilter, mode: modeFilter, page, pageSize, sortBy, sortOrder });
      setData(result.data || []);
      setCount(result.count || 0);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, [debouncedSearch, statusFilter, modeFilter, page, pageSize, sortBy, sortOrder]);

  useState(() => { fetchData(); });
  // eslint-disable-next-line
  const refetch = () => fetchData();

  const handleSort = (key) => {
    if (sortBy === key) setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    else { setSortBy(key); setSortOrder('asc'); }
  };

  const handleFilter = (key, value) => {
    if (key === 'status') setStatusFilter(value);
    if (key === 'mode') setModeFilter(value);
    setPage(1);
    setTimeout(refetch, 50);
  };

  const handleStatusUpdate = async () => {
    if (!selected || !newStatus) return;
    try {
      await updateDemoRequestStatus(selected.id, newStatus);
      toast.success('Status updated');
      setStatusOpen(false);
      refetch();
    } catch (err) { toast.error('Failed to update status'); }
  };

  const handleDelete = async () => {
    if (!selected) return;
    await deleteDemoRequest(selected.id);
    toast.success('Request deleted');
    setDeleteOpen(false);
    refetch();
  };

  const openAssign = async (row) => {
    setSelected(row);
    try {
      const t = await getVerifiedTutors();
      setTutors(t);
    } catch {}
    setAssignOpen(true);
  };

  const handleAssign = async () => {
    if (!selected || !selectedTutor) return;
    try {
      await assignTutorToRequest(selected.id, selectedTutor, assignNotes);
      toast.success('Tutor assigned successfully');
      setAssignOpen(false);
      setSelectedTutor('');
      setAssignNotes('');
      refetch();
    } catch (err) { toast.error('Failed to assign tutor'); }
  };

  const handleExport = () => {
    exportToCSV(data, [
      { key: 'student_name', label: 'Student Name' },
      { key: 'student_class', label: 'Class' },
      { key: 'subject', label: 'Subject' },
      { key: 'location', label: 'Location' },
      { key: 'mode', label: 'Mode' },
      { key: 'status', label: 'Status' },
      { key: 'created_at', label: 'Date' },
    ], 'demo_requests');
  };

  const columns = [
    { key: 'student_name', label: 'Student', sortable: true },
    { key: 'student_class', label: 'Class', sortable: true },
    { key: 'subject', label: 'Subject', sortable: true },
    { key: 'location', label: 'Location' },
    { key: 'mode', label: 'Mode', render: (v) => <span className="capitalize">{v}</span> },
    { key: 'status', label: 'Status', render: (v) => <StatusBadge status={v} /> },
    { key: 'created_at', label: 'Date', sortable: true, render: (v) => formatDate(v) },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <PageHeader title="Demo Requests" description="Manage student tuition requests" />

      <DataTable
        columns={columns}
        data={data}
        loading={loading}
        searchPlaceholder="Search by name or location..."
        searchValue={search}
        onSearch={(v) => { setSearch(v); setPage(1); setTimeout(refetch, 350); }}
        filters={[
          { key: 'status', label: 'All Status', options: Object.values(DEMO_STATUS) },
          { key: 'mode', label: 'All Modes', options: ['home', 'online'] },
        ]}
        filterValues={{ status: statusFilter, mode: modeFilter }}
        onFilterChange={handleFilter}
        page={page} totalPages={Math.ceil(count / pageSize)} pageSize={pageSize} totalCount={count}
        onPageChange={(p) => { setPage(p); setTimeout(refetch, 50); }}
        onPageSizeChange={(s) => { setPageSize(s); setPage(1); setTimeout(refetch, 50); }}
        onSort={handleSort} sortBy={sortBy} sortOrder={sortOrder}
        onExport={handleExport}
        renderActions={(row) => (
          <div className="flex items-center gap-1 justify-end">
            <button onClick={() => { setSelected(row); setDetailOpen(true); }} className="p-1.5 rounded-lg hover:bg-gray-100" title="View"><Eye className="w-4 h-4 text-gray-500" /></button>
            <button onClick={() => { setSelected(row); setNewStatus(row.status); setStatusOpen(true); }} className="p-1.5 rounded-lg hover:bg-gray-100" title="Update Status"><MoreVertical className="w-4 h-4 text-gray-500" /></button>
            <button onClick={() => openAssign(row)} className="p-1.5 rounded-lg hover:bg-blue-50" title="Assign Tutor"><UserPlus className="w-4 h-4 text-blue-500" /></button>
            <button onClick={() => { setSelected(row); setDeleteOpen(true); }} className="p-1.5 rounded-lg hover:bg-red-50" title="Delete"><Trash2 className="w-4 h-4 text-red-400" /></button>
          </div>
        )}
      />

      {/* Detail Modal */}
      <Modal isOpen={detailOpen} onClose={() => setDetailOpen(false)} title="Request Details" size="md">
        {selected && (
          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            {[
              ['Student Name', selected.student_name],
              ['Class', selected.student_class],
              ['Subject', selected.subject],
              ['Location', selected.location],
              ['Mode', selected.mode],
              ['Timing', selected.timing],
              ['Budget', selected.budget],
              ['Status', selected.status],
              ['Date', formatDate(selected.created_at)],
            ].map(([label, value]) => (
              <div key={label}><p className="text-gray-400 text-xs mb-1">{label}</p><p className="font-medium text-gray-800">{value || '—'}</p></div>
            ))}
          </div>
        )}
      </Modal>

      {/* Status Update Modal */}
      <Modal isOpen={statusOpen} onClose={() => setStatusOpen(false)} title="Update Status" size="sm">
        <div className="space-y-4">
          <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary/30">
            {Object.values(DEMO_STATUS).map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <button onClick={handleStatusUpdate} className="w-full bg-primary text-white py-2.5 rounded-xl text-sm font-medium hover:bg-primary-light transition-colors">Save</button>
        </div>
      </Modal>

      {/* Assign Tutor Modal */}
      <Modal isOpen={assignOpen} onClose={() => setAssignOpen(false)} title="Assign Tutor" size="md">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Tutor</label>
            <select value={selectedTutor} onChange={(e) => setSelectedTutor(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary/30">
              <option value="">Choose a verified tutor...</option>
              {tutors.map(t => <option key={t.id} value={t.id}>{t.full_name} — {t.subjects}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea value={assignNotes} onChange={(e) => setAssignNotes(e.target.value)} rows={3} placeholder="Optional notes..." className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary/30 resize-none" />
          </div>
          <button onClick={handleAssign} disabled={!selectedTutor} className="w-full bg-primary text-white py-2.5 rounded-xl text-sm font-medium hover:bg-primary-light transition-colors disabled:opacity-50">Assign Tutor</button>
        </div>
      </Modal>

      <ConfirmDialog isOpen={deleteOpen} onClose={() => setDeleteOpen(false)} onConfirm={handleDelete} title="Delete Request" message="Are you sure you want to delete this demo request? This cannot be undone." confirmText="Delete" isDestructive />
    </motion.div>
  );
}
