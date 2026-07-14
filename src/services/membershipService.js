import { supabase } from '@/supabase/config';

export async function createMembership(data) {
  const expiresAt = new Date();
  expiresAt.setFullYear(expiresAt.getFullYear() + 1);

  const membershipData = {
    tutor_id: data.tutor_id,
    plan: data.plan_name || data.plan,
    amount: data.amount,
    payment_status: 'Pending',
    start_date: new Date().toISOString(),
    end_date: expiresAt.toISOString(),
  };

  const { data: membership, error } = await supabase
    .from('tutor_memberships')
    .insert([membershipData])
    .select()
    .single();
  if (error) { console.error('createMembership error:', error); throw error; }
  return membership;
}

export async function getMemberships({
  search = '', status = '', planName = '',
  page = 1, pageSize = 10,
} = {}) {
  let query = supabase
    .from('tutor_memberships')
    .select(`
      *,
      tutors ( full_name, email, phone )
    `, { count: 'exact' });
  if (status) query = query.eq('payment_status', status);
  if (planName) query = query.eq('plan', planName);
  query = query.order('created_at', { ascending: false });
  const from = (page - 1) * pageSize;
  query = query.range(from, from + pageSize - 1);
  let { data, count, error } = await query;
  if (error) { console.error('getMemberships error:', error); throw error; }

  if (search) {
    const s = search.toLowerCase();
    data = (data || []).filter(m =>
      (m.plan || '').toLowerCase().includes(s) ||
      (m.tutors?.full_name || '').toLowerCase().includes(s)
    );
  }
  return { data: data || [], count: count || 0 };
}

export async function updateMembershipStatus(id, status) {
  const { data, error } = await supabase
    .from('tutor_memberships')
    .update({ payment_status: status })
    .eq('id', id)
    .select()
    .single();
  if (error) { console.error('updateMembershipStatus error:', error); throw error; }
  return data;
}

export async function getMembershipStats() {
  const { data, error } = await supabase.from('tutor_memberships').select('plan, payment_status');
  if (error) { console.error('getMembershipStats error:', error); throw error; }
  const stats = { total: (data || []).length, byPlan: {}, byStatus: {} };
  (data || []).forEach(m => {
    const plan = m.plan || 'Unknown';
    const s = m.payment_status || 'Unknown';
    stats.byPlan[plan] = (stats.byPlan[plan] || 0) + 1;
    stats.byStatus[s] = (stats.byStatus[s] || 0) + 1;
  });
  return stats;
}
