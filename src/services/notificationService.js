import { supabase } from '@/supabase/client';

/**
 * Create a new notification.
 */
export async function createNotification({ type, title, message, referenceId, referenceType }) {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .insert({
        type,
        title,
        message,
        reference_id: referenceId,
        reference_type: referenceType,
        is_read: false,
      })
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error('createNotification error:', error);
    throw error;
  }
}

/**
 * Fetch notifications with optional unread-only filter and pagination.
 */
export async function getNotifications({
  unreadOnly = false,
  page = 1,
  pageSize = 20,
} = {}) {
  try {
    const from = (page - 1) * pageSize;
    const to = page * pageSize - 1;

    let query = supabase
      .from('notifications')
      .select('*', { count: 'exact' });

    if (unreadOnly) {
      query = query.eq('is_read', false);
    }

    query = query.order('created_at', { ascending: false });
    query = query.range(from, to);

    const { data, count, error } = await query;

    if (error) {
      throw new Error(error.message);
    }

    return { data, count };
  } catch (error) {
    console.error('getNotifications error:', error);
    throw error;
  }
}

/**
 * Mark a single notification as read.
 */
export async function markAsRead(id) {
  try {
    const { data, error } = await supabase
      .from('notifications')
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
 * Mark all notifications as read.
 */
export async function markAllAsRead() {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('is_read', false)
      .select();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error('markAllAsRead error:', error);
    throw error;
  }
}

/**
 * Get the count of unread notifications.
 */
export async function getUnreadCount() {
  try {
    const { count, error } = await supabase
      .from('notifications')
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
