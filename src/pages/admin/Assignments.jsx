import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Trash2, Edit } from 'lucide-react';
import PageHeader from '@/components/admin/PageHeader';
import DataTable from '@/components/admin/DataTable';
import StatusBadge from '@/components/admin/StatusBadge';
import Modal from '@/components/admin/Modal';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import { getAssignments, updateAssignment, deleteAssignment } from '@/services/assignmentService';
import { formatDate } from '@/utils/formatters';
import { ASSIGNMENT_STATUS } from '@/constants';

export default function Assignments() {
  const [data, setData] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [statusFilter, setStatusFilter] = useState('');
  const [selected, setSelected] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editStatus, setEditStatus] = useState('');
  const [editNotes, setEditNotes] = useState('');

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getAssignments({ status: statusFilter, page, pageSize });
      setData(result.data || []);
      setCount(result.count || 0);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, [statusFilter, page, pageSize]);

  useState(() => { fetchData(); });
  const refetch = () => fetchData();

  const openEdit = (row) => { setSelected(row); setEditStatus(row.status); setEditNotes(row.notes || ''); setEditOpen(true); };

  const handleUpdate = async () => {
    try {
      await updateAssignment(selected.id, { status: editStatus, notes: editNotes });
      toast.success('Assignment updated');
      setEditOpen(false);
      refetch();
    } catch { toast.error('Update failed'); }
  };

  const handleDelete = async () => {
    await deleteAssignment(selected.id);
    toast.success('Assignment deleted');
    setDeleteOpen(false);
    refetch();
  };

  const columns = [
    { key: 'student_name', label: 'Student', render: (_, row) => row.demo_requests?.student_name || '—' },
    { key: 'tutor_name', label: 'Tutor', render: (_, row) => row.tutors?.full_name || '—' },
    { key: 'subject', label: 'Subject', render: (_, row) => row.demo_requests?.subject || '—' },
    { key: 'student_class', label: 'Class', render: (_, row) => row.demo_requests?.student_class || '—' },
    { key: 'status', label: 'Status', render: (v) => <StatusBadge status={v} /> },
    { key: 'assigned_at', label: 'Assigned', render: (v) => formatDate(v) },
    { key: 'notes', label: 'Notes', render: (v) => <span className="text-gray-500 text-xs max-w-[150px] truncate block">{v || '—'}</span> },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <PageHeader title="Assigned Tutors" description="Manage tutor-student assignments" />
      <DataTable
        columns={columns} data={data} loading={loading}
        filters={[{ key: 'status', label: 'All Status', options: Object.values(ASSIGNMENT_STATUS) }]}
        filterValues={{ status: statusFilter }}
        onFilterChange={(_, v) => { setStatusFilter(v); setPage(1); setTimeout(refetch, 50); }}
        page={page} totalPages={Math.ceil(count / pageSize)} pageSize={pageSize} totalCount={count}
        onPageChange={(p) => { setPage(p); setTimeout(refetch, 50); }}
        onPageSizeChange={(s) => { setPageSize(s); setPage(1); setTimeout(refetch, 50); }}
        renderActions={(row) => (
          <div className="flex items-center gap-1 justify-end">
            <button onClick={() => openEdit(row)} className="p-1.5 rounded-lg hover:bg-gray-100"><Edit className="w-4 h-4 text-gray-500" /></button>
            <button onClick={() => { setSelected(row); setDeleteOpen(true); }} className="p-1.5 rounded-lg hover:bg-red-50"><Trash2 className="w-4 h-4 text-red-400" /></button>
          </div>
        )}
      />
      <Modal isOpen={editOpen} onClose={() => setEditOpen(false)} title="Edit Assignment" size="sm">
        <div className="space-y-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select value={editStatus} onChange={(e) => setEditStatus(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none">{Object.values(ASSIGNMENT_STATUS).map(s => <option key={s}>{s}</option>)}</select>
          </div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea value={editNotes} onChange={(e) => setEditNotes(e.target.value)} rows={3} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none resize-none" />
          </div>
          <button onClick={handleUpdate} className="w-full bg-primary text-white py-2.5 rounded-xl text-sm font-medium hover:bg-primary-light transition-colors">Save</button>
        </div>
      </Modal>
      <ConfirmDialog isOpen={deleteOpen} onClose={() => setDeleteOpen(false)} onConfirm={handleDelete} title="Delete Assignment" message="Remove this assignment?" confirmText="Delete" isDestructive />
    </motion.div>
  );
}
