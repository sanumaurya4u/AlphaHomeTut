import { supabase } from '@/supabase/client';

/**
 * Register a new tutor.
 */
export async function registerTutor(data) {
  try {
    const { data: tutor, error } = await supabase
      .from('tutors')
      .insert(data)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return tutor;
  } catch (error) {
    console.error('registerTutor error:', error);
    throw error;
  }
}

/**
 * Fetch tutors with optional filtering, search, sorting, and pagination.
 */
export async function getTutors({
  search = '',
  status = '',
  qualification = '',
  page = 1,
  pageSize = 10,
  sortBy = 'created_at',
  sortOrder = 'desc',
} = {}) {
  try {
    const from = (page - 1) * pageSize;
    const to = page * pageSize - 1;

    let query = supabase
      .from('tutors')
      .select('*', { count: 'exact' });

    if (status) {
      query = query.eq('status', status);
    }

    if (qualification) {
      query = query.eq('qualification', qualification);
    }

    if (search) {
      query = query.or(
        `full_name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%`
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
    console.error('getTutors error:', error);
    throw error;
  }
}

/**
 * Fetch a single tutor by ID, including their related documents.
 */
export async function getTutorById(id) {
  try {
    const { data, error } = await supabase
      .from('tutors')
      .select('*, tutor_documents(*)')
      .eq('id', id)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error('getTutorById error:', error);
    throw error;
  }
}

/**
 * Update the status of a tutor.
 */
export async function updateTutorStatus(id, status) {
  try {
    const { data, error } = await supabase
      .from('tutors')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error('updateTutorStatus error:', error);
    throw error;
  }
}

/**
 * Delete a tutor by ID.
 */
export async function deleteTutor(id) {
  try {
    const { error } = await supabase
      .from('tutors')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(error.message);
    }

    return true;
  } catch (error) {
    console.error('deleteTutor error:', error);
    throw error;
  }
}

/**
 * Get aggregate stats for tutors: total, pending, verified, rejected.
 */
export async function getTutorStats() {
  try {
    const [total, pending, verified, rejected] = await Promise.all([
      supabase.from('tutors').select('id', { count: 'exact', head: true }),
      supabase.from('tutors').select('id', { count: 'exact', head: true }).eq('status', 'Pending'),
      supabase.from('tutors').select('id', { count: 'exact', head: true }).eq('status', 'Verified'),
      supabase.from('tutors').select('id', { count: 'exact', head: true }).eq('status', 'Rejected'),
    ]);

    const errors = [total, pending, verified, rejected].filter(r => r.error);
    if (errors.length > 0) {
      throw new Error(errors[0].error.message);
    }

    return {
      total: total.count ?? 0,
      pending: pending.count ?? 0,
      verified: verified.count ?? 0,
      rejected: rejected.count ?? 0,
    };
  } catch (error) {
    console.error('getTutorStats error:', error);
    throw error;
  }
}

/**
 * Get all verified tutors (for assignment dropdowns).
 */
export async function getVerifiedTutors() {
  try {
    const { data, error } = await supabase
      .from('tutors')
      .select('id, full_name, email, phone, subjects, qualification')
      .eq('status', 'Verified')
      .order('full_name', { ascending: true });

    if (error) {
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error('getVerifiedTutors error:', error);
    throw error;
  }
}
