import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Eye, Trash2, CheckCheck } from 'lucide-react';
import PageHeader from '@/components/admin/PageHeader';
import DataTable from '@/components/admin/DataTable';
import Modal from '@/components/admin/Modal';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import { getContactMessages, markAsRead, deleteContactMessage } from '@/services/contactService';
import { useDebounce } from '@/hooks/useDebounce';
import { formatDate, truncate } from '@/utils/formatters';

export default function ContactMessages() {
  const [data, setData] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [readFilter, setReadFilter] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selected, setSelected] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const debouncedSearch = useDebounce(search);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const isRead = readFilter === 'Read' ? true : readFilter === 'Unread' ? false : undefined;
      const result = await getContactMessages({ search: debouncedSearch, isRead, page, pageSize });
      setData(result.data || []);
      setCount(result.count || 0);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, [debouncedSearch, readFilter, page, pageSize]);

  useState(() => { fetchData(); });
  const refetch = () => fetchData();

  const handleMarkRead = async (row) => {
    try {
      await markAsRead(row.id);
      toast.success('Marked as read');
      refetch();
    } catch { toast.error('Failed'); }
  };

  const handleDelete = async () => {
    await deleteContactMessage(selected.id);
    toast.success('Message deleted');
    setDeleteOpen(false);
    refetch();
  };

  const columns = [
    { key: 'name', label: 'Name', render: (v, row) => (
      <div className="flex items-center gap-2">
        {!row.is_read && <span className="w-2 h-2 rounded-full bg-secondary flex-shrink-0" />}
        <span className={!row.is_read ? 'font-semibold' : ''}>{v}</span>
      </div>
    )},
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'message', label: 'Message', render: (v) => <span className="text-gray-500">{truncate(v, 40)}</span> },
    { key: 'created_at', label: 'Date', render: (v) => formatDate(v) },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <PageHeader title="Contact Messages" description="Manage incoming contact form submissions" />
      <DataTable
        columns={columns} data={data} loading={loading}
        searchPlaceholder="Search by name or email..."
        searchValue={search}
        onSearch={(v) => { setSearch(v); setPage(1); setTimeout(refetch, 350); }}
        filters={[{ key: 'read', label: 'All Messages', options: ['Read', 'Unread'] }]}
        filterValues={{ read: readFilter }}
        onFilterChange={(_, v) => { setReadFilter(v); setPage(1); setTimeout(refetch, 50); }}
        page={page} totalPages={Math.ceil(count / pageSize)} pageSize={pageSize} totalCount={count}
        onPageChange={(p) => { setPage(p); setTimeout(refetch, 50); }}
        onPageSizeChange={(s) => { setPageSize(s); setPage(1); setTimeout(refetch, 50); }}
        renderActions={(row) => (
          <div className="flex items-center gap-1 justify-end">
            <button onClick={() => { setSelected(row); setDetailOpen(true); if (!row.is_read) handleMarkRead(row); }} className="p-1.5 rounded-lg hover:bg-gray-100"><Eye className="w-4 h-4 text-gray-500" /></button>
            {!row.is_read && <button onClick={() => handleMarkRead(row)} className="p-1.5 rounded-lg hover:bg-green-50"><CheckCheck className="w-4 h-4 text-green-500" /></button>}
            <button onClick={() => { setSelected(row); setDeleteOpen(true); }} className="p-1.5 rounded-lg hover:bg-red-50"><Trash2 className="w-4 h-4 text-red-400" /></button>
          </div>
        )}
      />
      <Modal isOpen={detailOpen} onClose={() => setDetailOpen(false)} title="Message Details" size="md">
        {selected && (
          <div className="space-y-4 text-sm">
            <div className="grid sm:grid-cols-2 gap-4">
              <div><p className="text-gray-400 text-xs mb-1">Name</p><p className="font-medium">{selected.name}</p></div>
              <div><p className="text-gray-400 text-xs mb-1">Email</p><p className="font-medium">{selected.email || '—'}</p></div>
              <div><p className="text-gray-400 text-xs mb-1">Phone</p><p className="font-medium">{selected.phone || '—'}</p></div>
              <div><p className="text-gray-400 text-xs mb-1">Date</p><p className="font-medium">{formatDate(selected.created_at)}</p></div>
            </div>
            <div><p className="text-gray-400 text-xs mb-1">Message</p><p className="text-gray-700 bg-gray-50 rounded-xl p-4 whitespace-pre-wrap">{selected.message}</p></div>
          </div>
        )}
      </Modal>
      <ConfirmDialog isOpen={deleteOpen} onClose={() => setDeleteOpen(false)} onConfirm={handleDelete} title="Delete Message" message="Delete this contact message?" confirmText="Delete" isDestructive />
    </motion.div>
  );
}
