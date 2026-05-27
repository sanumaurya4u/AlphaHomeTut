import { supabase } from '@/supabase/client';

/**
 * Create a new tutor assignment.
 */
export async function createAssignment(data) {
  try {
    const { data: assignment, error } = await supabase
      .from('assigned_tutors')
      .insert(data)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return assignment;
  } catch (error) {
    console.error('createAssignment error:', error);
    throw error;
  }
}

/**
 * Fetch assignments with optional filtering, search, and pagination.
 * Joins demo_requests (student_name, subject, class) and tutors (full_name).
 */
export async function getAssignments({
  search = '',
  status = '',
  page = 1,
  pageSize = 10,
} = {}) {
  try {
    const from = (page - 1) * pageSize;
    const to = page * pageSize - 1;

    let query = supabase
      .from('assigned_tutors')
      .select(
        '*, demo_requests(student_name, subject, class), tutors(full_name)',
        { count: 'exact' }
      );

    if (status) {
      query = query.eq('status', status);
    }

    if (search) {
      query = query.or(
        `demo_requests.student_name.ilike.%${search}%,tutors.full_name.ilike.%${search}%`
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
    console.error('getAssignments error:', error);
    throw error;
  }
}

/**
 * Update an assignment's status and/or notes.
 */
export async function updateAssignment(id, data) {
  try {
    const { data: assignment, error } = await supabase
      .from('assigned_tutors')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return assignment;
  } catch (error) {
    console.error('updateAssignment error:', error);
    throw error;
  }
}

/**
 * Delete an assignment by ID.
 */
export async function deleteAssignment(id) {
  try {
    const { error } = await supabase
      .from('assigned_tutors')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(error.message);
    }

    return true;
  } catch (error) {
    console.error('deleteAssignment error:', error);
    throw error;
  }
}
