import { supabase } from '@/supabase/config';

export async function createNotification({ type, title, message, referenceId, referenceType }) {
  const { data, error } = await supabase
    .from('notifications')
    .insert([{
      type, title, message,
      is_read: false,
    }])
    .select()
    .single();
  if (error) { console.error('createNotification error:', error); throw error; }
  return data;
}

export async function getNotifications({
  unreadOnly = false, pageSize = 20, page = 1,
} = {}) {
  let query = supabase.from('notifications').select('*', { count: 'exact' });
  if (unreadOnly) query = query.eq('is_read', false);
  query = query.order('created_at', { ascending: false });
  const from = (page - 1) * pageSize;
  query = query.range(from, from + pageSize - 1);
  const { data, count, error } = await query;
  if (error) { console.error('getNotifications error:', error); throw error; }
  return { data: data || [], count: count || 0 };
}

export async function markAsRead(id) {
  const { data, error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('id', id)
    .select()
    .single();
  if (error) { console.error('markAsRead error:', error); throw error; }
  return data;
}

export async function markAllAsRead() {
  const { data, error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('is_read', false)
    .select();
  if (error) { console.error('markAllAsRead error:', error); throw error; }
  return data || [];
}

export async function getUnreadCount() {
  const { count, error } = await supabase
    .from('notifications')
    .select('*', { count: 'exact', head: true })
    .eq('is_read', false);
  if (error) { console.error('getUnreadCount error:', error); throw error; }
  return count || 0;
}
