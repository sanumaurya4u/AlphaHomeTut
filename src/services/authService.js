import { supabase } from '@/supabase/client';

/**
 * Sign in an admin user with email and password.
 * Verifies the user has an entry in the admin_users table after authentication.
 */
export async function loginAdmin(email, password) {
  try {
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      throw new Error(authError.message);
    }

    const userId = authData.user.id;

    const isAdmin = await isAdminUser(userId);
    if (!isAdmin) {
      await supabase.auth.signOut();
      throw new Error('Access denied. You are not an authorized admin.');
    }

    return authData;
  } catch (error) {
    console.error('loginAdmin error:', error);
    throw error;
  }
}

/**
 * Sign out the current admin user.
 */
export async function logoutAdmin() {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw new Error(error.message);
    }

    return true;
  } catch (error) {
    console.error('logoutAdmin error:', error);
    throw error;
  }
}

/**
 * Retrieve the current authentication session.
 */
export async function getCurrentSession() {
  try {
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      throw new Error(error.message);
    }

    return data.session;
  } catch (error) {
    console.error('getCurrentSession error:', error);
    throw error;
  }
}

/**
 * Check whether the given userId exists in the admin_users table.
 */
export async function isAdminUser(userId) {
  try {
    const { data, error } = await supabase
      .from('admin_users')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      throw new Error(error.message);
    }

    return !!data;
  } catch (error) {
    console.error('isAdminUser error:', error);
    throw error;
  }
}
