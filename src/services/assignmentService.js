import { supabase } from '@/supabase/config';

export async function createAssignment(data) {
  const { data: assignment, error } = await supabase
    .from('tutor_assignments')
    .insert([data])
    .select()
    .single();
  if (error) { console.error('createAssignment error:', error); throw error; }
  return assignment;
}

export async function getAssignments({
  search = '', status = '',
  page = 1, pageSize = 10,
} = {}) {
  let query = supabase
    .from('tutor_assignments')
    .select(`
      *,
      demo_requests ( student_name, subject, class ),
      tutors ( full_name )
    `, { count: 'exact' });
  if (status) query = query.eq('status', status);
  query = query.order('created_at', { ascending: false });
  const from = (page - 1) * pageSize;
  query = query.range(from, from + pageSize - 1);
  let { data, count, error } = await query;
  if (error) { console.error('getAssignments error:', error); throw error; }

  if (search) {
    const s = search.toLowerCase();
    data = (data || []).filter(a =>
      (a.demo_requests?.student_name || '').toLowerCase().includes(s) ||
      (a.tutors?.full_name || '').toLowerCase().includes(s)
    );
  }
  return { data: data || [], count: count || 0 };
}

export async function updateAssignment(id, data) {
  const { data: updated, error } = await supabase
    .from('tutor_assignments')
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  if (error) { console.error('updateAssignment error:', error); throw error; }
  return updated;
}

export async function deleteAssignment(id) {
  const { error } = await supabase.from('tutor_assignments').delete().eq('id', id);
  if (error) { console.error('deleteAssignment error:', error); throw error; }
  return true;
}
