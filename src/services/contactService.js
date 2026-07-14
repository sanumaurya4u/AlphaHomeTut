import { supabase } from '@/supabase/config';

export async function submitContactMessage(data) {
  const { error } = await supabase
    .from('contact_messages')
    .insert([{ ...data, is_read: false }]);
  if (error) { console.error('submitContactMessage error:', error); throw error; }
  return true;
}

export async function getContactMessages({
  search = '', isRead = null,
  page = 1, pageSize = 10, sortBy = 'created_at', sortOrder = 'desc',
} = {}) {
  let query = supabase.from('contact_messages').select('*', { count: 'exact' });
  if (isRead !== null && isRead !== undefined && isRead !== '') {
    query = query.eq('is_read', isRead);
  }
  if (search) {
    query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%,subject.ilike.%${search}%,message.ilike.%${search}%`);
  }
  const ascending = sortOrder === 'asc';
  query = query.order(sortBy, { ascending });
  const from = (page - 1) * pageSize;
  query = query.range(from, from + pageSize - 1);
  const { data, count, error } = await query;
  if (error) { console.error('getContactMessages error:', error); throw error; }
  return { data: data || [], count: count || 0 };
}

export async function markAsRead(id) {
  const { data, error } = await supabase
    .from('contact_messages')
    .update({ is_read: true })
    .eq('id', id)
    .select()
    .single();
  if (error) { console.error('markAsRead error:', error); throw error; }
  return data;
}

export async function deleteContactMessage(id) {
  const { error } = await supabase.from('contact_messages').delete().eq('id', id);
  if (error) { console.error('deleteContactMessage error:', error); throw error; }
  return true;
}

export async function getUnreadCount() {
  const { count, error } = await supabase
    .from('contact_messages')
    .select('*', { count: 'exact', head: true })
    .eq('is_read', false);
  if (error) { console.error('getUnreadCount error:', error); throw error; }
  return count || 0;
}
