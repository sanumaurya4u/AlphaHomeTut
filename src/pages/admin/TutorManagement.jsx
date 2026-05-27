import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Eye, Trash2, CheckCircle, XCircle } from 'lucide-react';
import PageHeader from '@/components/admin/PageHeader';
import DataTable from '@/components/admin/DataTable';
import StatusBadge from '@/components/admin/StatusBadge';
import Modal from '@/components/admin/Modal';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import { getTutors, updateTutorStatus, deleteTutor } from '@/services/tutorService';
import { getDocumentsByTutor, getDocumentUrl } from '@/services/uploadService';
import { createNotification } from '@/services/notificationService';
import { useDebounce } from '@/hooks/useDebounce';
import { formatDate, formatPhone } from '@/utils/formatters';
import { exportToCSV } from '@/utils/csvExport';
import { TUTOR_STATUS, NOTIFICATION_TYPES } from '@/constants';

export default function TutorManagement() {
  const [data, setData] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selected, setSelected] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [docUrls, setDocUrls] = useState({});

  const debouncedSearch = useDebounce(search);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getTutors({ search: debouncedSearch, status: statusFilter, page, pageSize, sortBy, sortOrder });
      setData(result.data || []);
      setCount(result.count || 0);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, [debouncedSearch, statusFilter, page, pageSize, sortBy, sortOrder]);

  useState(() => { fetchData(); });
  const refetch = () => fetchData();

  const openProfile = async (row) => {
    setSelected(row);
    setProfileOpen(true);
    try {
      const docs = await getDocumentsByTutor(row.id);
      setDocuments(docs);
      const urls = {};
      for (const doc of docs) {
        try {
          urls[doc.id] = await getDocumentUrl(doc.file_path);
        } catch {}
      }
      setDocUrls(urls);
    } catch {}
  };

  const handleVerify = async (row) => {
    try {
      await updateTutorStatus(row.id, 'Verified');
      await createNotification({ type: NOTIFICATION_TYPES.TUTOR_VERIFIED, title: 'Tutor Verified', message: `${row.full_name} has been verified`, referenceId: row.id, referenceType: 'tutor' });
      toast.success(`${row.full_name} verified!`);
      refetch();
    } catch { toast.error('Failed to verify'); }
  };

  const handleReject = async (row) => {
    try {
      await updateTutorStatus(row.id, 'Rejected');
      toast.success(`${row.full_name} rejected`);
      refetch();
    } catch { toast.error('Failed to reject'); }
  };

  const handleDelete = async () => {
    if (!selected) return;
    await deleteTutor(selected.id);
    toast.success('Tutor deleted');
    setDeleteOpen(false);
    refetch();
  };

  const columns = [
    { key: 'full_name', label: 'Name', sortable: true },
    { key: 'phone', label: 'Phone', render: (v) => formatPhone(v) },
    { key: 'email', label: 'Email' },
    { key: 'degree', label: 'Qualification' },
    { key: 'experience', label: 'Experience' },
    { key: 'city', label: 'City' },
    { key: 'status', label: 'Status', render: (v) => <StatusBadge status={v} /> },
    { key: 'created_at', label: 'Date', sortable: true, render: (v) => formatDate(v) },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <PageHeader title="Tutor Registrations" description="Review and manage tutor applications" />

      <DataTable
        columns={columns} data={data} loading={loading}
        searchPlaceholder="Search by name, email, or phone..."
        searchValue={search}
        onSearch={(v) => { setSearch(v); setPage(1); setTimeout(refetch, 350); }}
        filters={[{ key: 'status', label: 'All Status', options: Object.values(TUTOR_STATUS) }]}
        filterValues={{ status: statusFilter }}
        onFilterChange={(_, v) => { setStatusFilter(v); setPage(1); setTimeout(refetch, 50); }}
        page={page} totalPages={Math.ceil(count / pageSize)} pageSize={pageSize} totalCount={count}
        onPageChange={(p) => { setPage(p); setTimeout(refetch, 50); }}
        onPageSizeChange={(s) => { setPageSize(s); setPage(1); setTimeout(refetch, 50); }}
        onSort={(key) => { if (sortBy === key) setSortOrder(p => p === 'asc' ? 'desc' : 'asc'); else { setSortBy(key); setSortOrder('asc'); } }}
        sortBy={sortBy} sortOrder={sortOrder}
        onExport={() => exportToCSV(data, columns.map(c => ({ key: c.key, label: c.label })), 'tutors')}
        renderActions={(row) => (
          <div className="flex items-center gap-1 justify-end">
            <button onClick={() => openProfile(row)} className="p-1.5 rounded-lg hover:bg-gray-100" title="View"><Eye className="w-4 h-4 text-gray-500" /></button>
            {row.status === 'Pending' && (
              <>
                <button onClick={() => handleVerify(row)} className="p-1.5 rounded-lg hover:bg-green-50" title="Verify"><CheckCircle className="w-4 h-4 text-green-500" /></button>
                <button onClick={() => handleReject(row)} className="p-1.5 rounded-lg hover:bg-red-50" title="Reject"><XCircle className="w-4 h-4 text-red-400" /></button>
              </>
            )}
            <button onClick={() => { setSelected(row); setDeleteOpen(true); }} className="p-1.5 rounded-lg hover:bg-red-50" title="Delete"><Trash2 className="w-4 h-4 text-red-400" /></button>
          </div>
        )}
      />

      {/* Profile Modal */}
      <Modal isOpen={profileOpen} onClose={() => setProfileOpen(false)} title="Tutor Profile" size="lg">
        {selected && (
          <div className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-4 text-sm">
              {[
                ['Name', selected.full_name], ['Phone', formatPhone(selected.phone)], ['Email', selected.email],
                ['Gender', selected.gender], ['City', selected.city], ['Address', selected.address],
                ['10th Marks', selected.tenth_marks], ['12th Marks', selected.twelfth_marks],
                ['Degree', selected.degree], ['College', selected.college],
                ['Subjects', selected.subjects], ['Experience', selected.experience],
                ['Preferred Classes', selected.preferred_classes], ['Preferred Subjects', selected.preferred_subjects],
                ['Expected Salary', selected.expected_salary], ['Membership', selected.membership_plan],
                ['Status', selected.status], ['Registered', formatDate(selected.created_at)],
              ].map(([label, value]) => (
                <div key={label}><p className="text-gray-400 text-xs mb-1">{label}</p><p className="font-medium text-gray-800">{value || '—'}</p></div>
              ))}
            </div>
            {documents.length > 0 && (
              <div>
                <h4 className="font-bold text-gray-900 mb-3">Documents</h4>
                <div className="grid sm:grid-cols-2 gap-3">
                  {documents.map(doc => (
                    <div key={doc.id} className="border border-gray-200 rounded-xl p-3 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-700 capitalize">{doc.document_type.replace(/_/g, ' ')}</p>
                        <p className="text-xs text-gray-400">{doc.file_name}</p>
                      </div>
                      {docUrls[doc.id] && (
                        <a href={docUrls[doc.id]} target="_blank" rel="noopener noreferrer" className="text-xs text-primary font-medium hover:text-secondary">View</a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>

      <ConfirmDialog isOpen={deleteOpen} onClose={() => setDeleteOpen(false)} onConfirm={handleDelete} title="Delete Tutor" message="This will permanently delete this tutor and all associated data." confirmText="Delete" isDestructive />
    </motion.div>
  );
}
