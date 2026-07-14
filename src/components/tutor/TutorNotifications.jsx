import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bell, BookOpen, Calendar, IndianRupee, UserCheck, Loader2 } from 'lucide-react';
import { getNotifications, markAllAsRead } from '@/services/notificationService';
import toast from 'react-hot-toast';

export default function TutorNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await getNotifications();
        setNotifications(res.data || []);
      } catch (error) {
        toast.error('Failed to load notifications');
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
      setNotifications(notifications.map(n => ({ ...n, is_read: true })));
      toast.success('All notifications marked as read');
    } catch (error) {
      toast.error('Failed to mark notifications as read');
    }
  };

  const getIconAndColor = (type) => {
    switch (type) {
      case 'lead': return { icon: BookOpen, color: 'text-blue-500 bg-blue-50' };
      case 'schedule': return { icon: Calendar, color: 'text-purple-500 bg-purple-50' };
      case 'payment': return { icon: IndianRupee, color: 'text-emerald-500 bg-emerald-50' };
      case 'verification': return { icon: UserCheck, color: 'text-secondary bg-secondary/10' };
      default: return { icon: Bell, color: 'text-gray-500 bg-gray-100' };
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Just now';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-primary mb-1">Notifications</h2>
          <p className="text-gray-500 text-sm">Stay updated with your tuitions and account activity.</p>
        </div>
        {notifications.some(n => !n.is_read) && (
          <button 
            onClick={handleMarkAllAsRead}
            className="text-sm font-medium text-secondary hover:text-secondary-light transition-colors"
          >
            Mark all as read
          </button>
        )}
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="divide-y divide-gray-100">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No notifications yet.</div>
          ) : (
            notifications.map((n, i) => {
              const { icon: Icon, color } = getIconAndColor(n.type);
              return (
                <motion.div 
                  key={n.id} 
                  initial={{ opacity: 0, x: -10 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  transition={{ delay: i * 0.05 }}
                  className={`p-5 flex items-start gap-4 transition-colors hover:bg-gray-50 ${!n.is_read ? 'bg-secondary/5' : ''}`}
                >
                  <div className={`p-3 rounded-xl flex-shrink-0 ${color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className={`font-bold text-sm ${!n.is_read ? 'text-primary' : 'text-gray-800'}`}>{n.title}</h3>
                      <span className="text-xs text-gray-400 whitespace-nowrap">{formatDate(n.created_at)}</span>
                    </div>
                    <p className={`text-sm mt-1 ${!n.is_read ? 'text-gray-700 font-medium' : 'text-gray-500'}`}>{n.message}</p>
                  </div>
                  {!n.is_read && (
                    <div className="w-2.5 h-2.5 rounded-full bg-secondary flex-shrink-0 self-center" />
                  )}
                </motion.div>
              );
            })
          )}
        </div>
      </div>
    </motion.div>
  );
}
