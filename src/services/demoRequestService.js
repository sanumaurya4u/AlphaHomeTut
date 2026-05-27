import { supabase } from '@/supabase/client';

/**
 * Create a new demo request.
 */
export async function createDemoRequest(data) {
  try {
    const { data: result, error } = await supabase
      .from('demo_requests')
      .insert(data)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return result;
  } catch (error) {
    console.error('createDemoRequest error:', error);
    throw error;
  }
}

/**
 * Fetch demo requests with optional filtering, search, sorting, and pagination.
 */
export async function getDemoRequests({
  search = '',
  status = '',
  mode = '',
  page = 1,
  pageSize = 10,
  sortBy = 'created_at',
  sortOrder = 'desc',
} = {}) {
  try {
    const from = (page - 1) * pageSize;
    const to = page * pageSize - 1;

    let query = supabase
      .from('demo_requests')
      .select('*', { count: 'exact' });

    if (status) {
      query = query.eq('status', status);
    }

    if (mode) {
      query = query.eq('mode', mode);
    }

    if (search) {
      query = query.or(
        `student_name.ilike.%${search}%,location.ilike.%${search}%`
      );
    }

    query = query.order(sortBy, { ascending: sortOrder === 'asc' });
    query = query.range(from, to);

    const { data, count, error } = await query;

    if (error) {
      throw new Error(error.message);
    }

    return { data, count };
  } catch (error) {
    console.error('getDemoRequests error:', error);
    throw error;
  }
}

/**
 * Fetch a single demo request by its ID.
 */
export async function getDemoRequestById(id) {
  try {
    const { data, error } = await supabase
      .from('demo_requests')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error('getDemoRequestById error:', error);
    throw error;
  }
}

/**
 * Update the status of a demo request.
 */
export async function updateDemoRequestStatus(id, status) {
  try {
    const { data, error } = await supabase
      .from('demo_requests')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error('updateDemoRequestStatus error:', error);
    throw error;
  }
}

/**
 * Delete a demo request by its ID.
 */
export async function deleteDemoRequest(id) {
  try {
    const { error } = await supabase
      .from('demo_requests')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(error.message);
    }

    return true;
  } catch (error) {
    console.error('deleteDemoRequest error:', error);
    throw error;
  }
}

/**
 * Get aggregate stats for demo requests: total, pending, contacted, assigned, completed.
 */
export async function getDemoRequestStats() {
  try {
    const [total, pending, contacted, assigned, completed] = await Promise.all([
      supabase.from('demo_requests').select('id', { count: 'exact', head: true }),
      supabase.from('demo_requests').select('id', { count: 'exact', head: true }).eq('status', 'Pending'),
      supabase.from('demo_requests').select('id', { count: 'exact', head: true }).eq('status', 'Contacted'),
      supabase.from('demo_requests').select('id', { count: 'exact', head: true }).eq('status', 'Tutor Assigned'),
      supabase.from('demo_requests').select('id', { count: 'exact', head: true }).eq('status', 'Completed'),
    ]);

    const errors = [total, pending, contacted, assigned, completed].filter(r => r.error);
    if (errors.length > 0) {
      throw new Error(errors[0].error.message);
    }

    return {
      total: total.count ?? 0,
      pending: pending.count ?? 0,
      contacted: contacted.count ?? 0,
      assigned: assigned.count ?? 0,
      completed: completed.count ?? 0,
    };
  } catch (error) {
    console.error('getDemoRequestStats error:', error);
    throw error;
  }
}

/**
 * Assign a tutor to a demo request.
 * Inserts into assigned_tutors and updates the demo request status to "Tutor Assigned".
 */
export async function assignTutorToRequest(requestId, tutorId, notes = '') {
  try {
    const { data: assignment, error: assignError } = await supabase
      .from('assigned_tutors')
      .insert({
        demo_request_id: requestId,
        tutor_id: tutorId,
        notes,
        status: 'Assigned',
      })
      .select()
      .single();

    if (assignError) {
      throw new Error(assignError.message);
    }

    const { error: updateError } = await supabase
      .from('demo_requests')
      .update({ status: 'Tutor Assigned' })
      .eq('id', requestId);

    if (updateError) {
      throw new Error(updateError.message);
    }

    return assignment;
  } catch (error) {
    console.error('assignTutorToRequest error:', error);
    throw error;
  }
}
