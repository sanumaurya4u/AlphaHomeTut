import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { Bell, ClipboardList, GraduationCap, MessageSquare, CheckCheck, Mail } from 'lucide-react';
import PageHeader from '@/components/admin/PageHeader';
import EmptyState from '@/components/admin/EmptyState';
import { getNotifications, markAsRead, markAllAsRead } from '@/services/notificationService';
import { timeAgo } from '@/utils/formatters';
import { NOTIFICATION_TYPES } from '@/constants';

const typeIcons = {
  [NOTIFICATION_TYPES.NEW_DEMO_REQUEST]: ClipboardList,
  [NOTIFICATION_TYPES.NEW_TUTOR]: GraduationCap,
  [NOTIFICATION_TYPES.NEW_CONTACT]: MessageSquare,
  [NOTIFICATION_TYPES.TUTOR_VERIFIED]: GraduationCap,
  [NOTIFICATION_TYPES.TUTOR_ASSIGNED]: ClipboardList,
  [NOTIFICATION_TYPES.MEMBERSHIP_PURCHASED]: Mail,
};

const typeColors = {
  [NOTIFICATION_TYPES.NEW_DEMO_REQUEST]: 'bg-blue-50 text-blue-600',
  [NOTIFICATION_TYPES.NEW_TUTOR]: 'bg-green-50 text-green-600',
  [NOTIFICATION_TYPES.NEW_CONTACT]: 'bg-purple-50 text-purple-600',
  [NOTIFICATION_TYPES.TUTOR_VERIFIED]: 'bg-emerald-50 text-emerald-600',
  [NOTIFICATION_TYPES.TUTOR_ASSIGNED]: 'bg-amber-50 text-amber-600',
  [NOTIFICATION_TYPES.MEMBERSHIP_PURCHASED]: 'bg-orange-50 text-orange-600',
};

export default function Notifications() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getNotifications({ unreadOnly: filter === 'unread', page: 1, pageSize: 100 });
      setData(result.data || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, [filter]);

  useState(() => { fetchData(); });
  const refetch = () => fetchData();

  const handleMarkRead = async (id) => {
    try {
      await markAsRead(id);
      refetch();
    } catch {}
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllAsRead();
      toast.success('All marked as read');
      refetch();
    } catch { toast.error('Failed'); }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <PageHeader
        title="Notifications"
        description="Stay updated with latest activities"
        actions={
          <>
            <div className="flex bg-gray-100 rounded-xl p-1">
              {['all', 'unread'].map(f => (
                <button key={f} onClick={() => { setFilter(f); setTimeout(refetch, 50); }}
                  className={`px-4 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${filter === f ? 'bg-white text-primary shadow-sm' : 'text-gray-500'}`}>
                  {f}
                </button>
              ))}
            </div>
            <button onClick={handleMarkAllRead} className="flex items-center gap-1.5 px-4 py-2 bg-primary text-white rounded-xl text-xs font-medium hover:bg-primary-light transition-colors">
              <CheckCheck className="w-3.5 h-3.5" /> Mark All Read
            </button>
          </>
        }
      />

      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse"><div className="h-4 bg-gray-100 rounded-lg w-3/4" /></div>)}
        </div>
      ) : data.length === 0 ? (
        <EmptyState icon={Bell} title="No notifications" description={filter === 'unread' ? 'All caught up! No unread notifications.' : 'No notifications yet.'} />
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {data.map((n) => {
              const Icon = typeIcons[n.type] || Bell;
              const color = typeColors[n.type] || 'bg-gray-50 text-gray-600';
              return (
                <motion.div
                  key={n.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  onClick={() => !n.is_read && handleMarkRead(n.id)}
                  className={`bg-white rounded-2xl border p-5 flex items-start gap-4 cursor-pointer hover:shadow-sm transition-all ${!n.is_read ? 'border-secondary/30 bg-secondary/[0.02]' : 'border-gray-100'}`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className={`text-sm ${!n.is_read ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>{n.title}</p>
                      {!n.is_read && <span className="w-2 h-2 rounded-full bg-secondary flex-shrink-0 mt-1.5" />}
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">{n.message}</p>
                    <p className="text-[11px] text-gray-400 mt-1.5">{timeAgo(n.created_at)}</p>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}
