import { supabase } from '@/supabase/config';

export async function createDemoRequest(data) {
  const { error } = await supabase
    .from('demo_requests')
    .insert([data]);
  if (error) { console.error('createDemoRequest error:', error); throw error; }
  return true;
}

export async function getDemoRequests({
  search = '', status = '', mode = '',
  page = 1, pageSize = 10, sortBy = 'created_at', sortOrder = 'desc',
} = {}) {
  let query = supabase.from('demo_requests').select('*', { count: 'exact' });
  if (status) query = query.eq('status', status);
  if (mode) query = query.eq('mode', mode);
  if (search) query = query.or(`student_name.ilike.%${search}%,location.ilike.%${search}%`);
  const ascending = sortOrder === 'asc';
  query = query.order(sortBy, { ascending });
  const from = (page - 1) * pageSize;
  query = query.range(from, from + pageSize - 1);
  const { data, count, error } = await query;
  if (error) { console.error('getDemoRequests error:', error); throw error; }
  return { data: data || [], count: count || 0 };
}

export async function getDemoRequestById(id) {
  const { data, error } = await supabase
    .from('demo_requests')
    .select('*')
    .eq('id', id)
    .single();
  if (error) { console.error('getDemoRequestById error:', error); throw error; }
  return data;
}

export async function updateDemoRequestStatus(id, status) {
  const { data, error } = await supabase
    .from('demo_requests')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  if (error) { console.error('updateDemoRequestStatus error:', error); throw error; }
  return data;
}

export async function deleteDemoRequest(id) {
  const { error } = await supabase.from('demo_requests').delete().eq('id', id);
  if (error) { console.error('deleteDemoRequest error:', error); throw error; }
  return true;
}

export async function getDemoRequestStats() {
  const [total, pending, contacted, assigned, completed] = await Promise.all([
    supabase.from('demo_requests').select('*', { count: 'exact', head: true }),
    supabase.from('demo_requests').select('*', { count: 'exact', head: true }).eq('status', 'Pending'),
    supabase.from('demo_requests').select('*', { count: 'exact', head: true }).eq('status', 'Contacted'),
    supabase.from('demo_requests').select('*', { count: 'exact', head: true }).eq('status', 'Tutor Assigned'),
    supabase.from('demo_requests').select('*', { count: 'exact', head: true }).eq('status', 'Completed'),
  ]);
  return {
    total: total.count || 0,
    pending: pending.count || 0,
    contacted: contacted.count || 0,
    assigned: assigned.count || 0,
    completed: completed.count || 0,
  };
}

export async function assignTutorToRequest(requestId, tutorId, notes = '', assignedBy = null) {
  const { data: assignment, error: assignError } = await supabase
    .from('tutor_assignments')
    .insert([{ demo_request_id: requestId, tutor_id: tutorId, notes, status: 'Assigned', assigned_by: assignedBy }])
    .select()
    .single();
  if (assignError) { console.error('assignTutorToRequest error:', assignError); throw assignError; }
  await supabase.from('demo_requests').update({ status: 'Tutor Assigned' }).eq('id', requestId);
  return assignment;
}

export async function updateDemoRequest(id, updates) {
  const { data, error } = await supabase
    .from('demo_requests')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  if (error) { console.error('updateDemoRequest error:', error); throw error; }
  return data;
}

