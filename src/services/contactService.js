import { supabase } from '@/supabase/client';

/**
 * Submit a new contact message.
 */
export async function submitContactMessage(data) {
  try {
    const { data: message, error } = await supabase
      .from('contact_messages')
      .insert(data)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return message;
  } catch (error) {
    console.error('submitContactMessage error:', error);
    throw error;
  }
}

/**
 * Fetch contact messages with optional filtering, search, sorting, and pagination.
 */
export async function getContactMessages({
  search = '',
  isRead = null,
  page = 1,
  pageSize = 10,
  sortBy = 'created_at',
  sortOrder = 'desc',
} = {}) {
  try {
    const from = (page - 1) * pageSize;
    const to = page * pageSize - 1;

    let query = supabase
      .from('contact_messages')
      .select('*', { count: 'exact' });

    if (isRead !== null && isRead !== undefined && isRead !== '') {
      query = query.eq('is_read', isRead);
    }

    if (search) {
      query = query.or(
        `name.ilike.%${search}%,email.ilike.%${search}%,subject.ilike.%${search}%,message.ilike.%${search}%`
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
    console.error('getContactMessages error:', error);
    throw error;
  }
}

/**
 * Mark a contact message as read.
 */
export async function markAsRead(id) {
  try {
    const { data, error } = await supabase
      .from('contact_messages')
      .update({ is_read: true })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error('markAsRead error:', error);
    throw error;
  }
}

/**
 * Delete a contact message by ID.
 */
export async function deleteContactMessage(id) {
  try {
    const { error } = await supabase
      .from('contact_messages')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(error.message);
    }

    return true;
  } catch (error) {
    console.error('deleteContactMessage error:', error);
    throw error;
  }
}

/**
 * Get the count of unread contact messages.
 */
export async function getUnreadCount() {
  try {
    const { count, error } = await supabase
      .from('contact_messages')
      .select('id', { count: 'exact', head: true })
      .eq('is_read', false);

    if (error) {
      throw new Error(error.message);
    }

    return count ?? 0;
  } catch (error) {
    console.error('getUnreadCount error:', error);
    throw error;
  }
}
