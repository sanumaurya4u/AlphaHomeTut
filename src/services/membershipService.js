import { supabase } from '@/supabase/client';

/**
 * Create a new membership with a default 1-year expiry and Active status.
 */
export async function createMembership(data) {
  try {
    const expiresAt = new Date();
    expiresAt.setFullYear(expiresAt.getFullYear() + 1);

    const { data: membership, error } = await supabase
      .from('memberships')
      .insert({
        tutor_id: data.tutor_id,
        plan_name: data.plan_name,
        amount: data.amount,
        status: 'Active',
        expires_at: expiresAt.toISOString(),
      })
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return membership;
  } catch (error) {
    console.error('createMembership error:', error);
    throw error;
  }
}

/**
 * Fetch memberships with optional filtering, search, and pagination.
 * Joins with tutors to include the tutor's full_name.
 */
export async function getMemberships({
  search = '',
  status = '',
  planName = '',
  page = 1,
  pageSize = 10,
} = {}) {
  try {
    const from = (page - 1) * pageSize;
    const to = page * pageSize - 1;

    let query = supabase
      .from('memberships')
      .select('*, tutors(full_name, email, phone)', { count: 'exact' });

    if (status) {
      query = query.eq('status', status);
    }

    if (planName) {
      query = query.eq('plan_name', planName);
    }

    if (search) {
      query = query.or(
        `plan_name.ilike.%${search}%,tutors.full_name.ilike.%${search}%`
      );
    }

    query = query.order('created_at', { ascending: false });
    query = query.range(from, to);

    const { data, count, error } = await query;

    if (error) {
      throw new Error(error.message);
    }

    return { data, count };
  } catch (error) {
    console.error('getMemberships error:', error);
    throw error;
  }
}

/**
 * Update the status of a membership.
 */
export async function updateMembershipStatus(id, status) {
  try {
    const { data, error } = await supabase
      .from('memberships')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error('updateMembershipStatus error:', error);
    throw error;
  }
}

/**
 * Get membership stats grouped by plan type and status.
 */
export async function getMembershipStats() {
  try {
    const { data, error } = await supabase
      .from('memberships')
      .select('plan_name, status');

    if (error) {
      throw new Error(error.message);
    }

    const stats = {
      total: data.length,
      byPlan: {},
      byStatus: {},
    };

    for (const membership of data) {
      const plan = membership.plan_name || 'Unknown';
      const membershipStatus = membership.status || 'Unknown';

      stats.byPlan[plan] = (stats.byPlan[plan] || 0) + 1;
      stats.byStatus[membershipStatus] = (stats.byStatus[membershipStatus] || 0) + 1;
    }

    return stats;
  } catch (error) {
    console.error('getMembershipStats error:', error);
    throw error;
  }
}
