import { supabase } from '@/supabase/config';

export async function registerTutor(data) {
  const { data: tutor, error } = await supabase
    .from('tutors')
    .insert([data])
    .select()
    .single();
  if (error) { console.error('registerTutor error:', error); throw error; }
  return tutor;
}

export async function getTutors({
  search = '', status = '', qualification = '',
  page = 1, pageSize = 10, sortBy = 'created_at', sortOrder = 'desc',
} = {}) {
  let query = supabase.from('tutors').select('*', { count: 'exact' });
  if (status) query = query.eq('status', status);
  if (qualification) query = query.eq('qualification', qualification);
  if (search) query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%`);
  const ascending = sortOrder === 'asc';
  query = query.order(sortBy, { ascending });
  const from = (page - 1) * pageSize;
  query = query.range(from, from + pageSize - 1);
  const { data, count, error } = await query;
  if (error) { console.error('getTutors error:', error); throw error; }
  return { data: data || [], count: count || 0 };
}

export async function getTutorById(id) {
  const { data: tutor, error } = await supabase
    .from('tutors')
    .select('*, tutor_documents(*)')
    .eq('id', id)
    .single();
  if (error) { console.error('getTutorById error:', error); throw error; }
  return tutor;
}

export async function updateTutorStatus(id, status) {
  const { data, error } = await supabase
    .from('tutors')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  if (error) { console.error('updateTutorStatus error:', error); throw error; }
  return data;
}

export async function updateTutorProfile(id, updates) {
  const { data, error } = await supabase
    .from('tutors')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  if (error) { console.error('updateTutorProfile error:', error); throw error; }
  return data;
}

export async function deleteTutor(id) {
  const { error } = await supabase.from('tutors').delete().eq('id', id);
  if (error) { console.error('deleteTutor error:', error); throw error; }
  return true;
}

export async function getTutorStats() {
  const [total, pending, verified, rejected] = await Promise.all([
    supabase.from('tutors').select('*', { count: 'exact', head: true }),
    supabase.from('tutors').select('*', { count: 'exact', head: true }).eq('status', 'Pending'),
    supabase.from('tutors').select('*', { count: 'exact', head: true }).eq('status', 'Verified'),
    supabase.from('tutors').select('*', { count: 'exact', head: true }).eq('status', 'Rejected'),
  ]);
  return {
    total: total.count || 0,
    pending: pending.count || 0,
    verified: verified.count || 0,
    rejected: rejected.count || 0,
  };
}

export async function getVerifiedTutors() {
  const { data, error } = await supabase
    .from('tutors')
    .select('id, full_name, email, phone, subjects, qualification')
    .eq('status', 'Verified')
    .order('full_name', { ascending: true });
  if (error) { console.error('getVerifiedTutors error:', error); throw error; }
  return data || [];
}

export async function updateTutorDocumentStatus(id, status, remarks = '', verifiedBy = null) {
  const { data, error } = await supabase
    .from('tutor_documents')
    .update({ 
      status, 
      remarks, 
      verified_by: verifiedBy,
      updated_at: new Date().toISOString() 
    })
    .eq('id', id)
    .select()
    .single();
  if (error) { console.error('updateTutorDocumentStatus error:', error); throw error; }
  return data;
}

