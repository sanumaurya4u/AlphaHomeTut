import { createContext, useState, useEffect } from 'react';
import { supabase } from '@/supabase/client';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [adminData, setAdminData] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  /**
   * Query the admin_users table to check if the given userId
   * has an admin record. Returns the admin row or null.
   */
  const fetchAdminData = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching admin data:', error.message);
        return null;
      }

      return data;
    } catch (err) {
      console.error('fetchAdminData exception:', err);
      return null;
    }
  };

  /**
   * Handle session changes — set user + admin state accordingly.
   */
  const handleSession = async (session) => {
    if (session?.user) {
      setUser(session.user);

      const admin = await fetchAdminData(session.user.id);
      if (admin) {
        setAdminData(admin);
        setIsAdmin(true);
      } else {
        setAdminData(null);
        setIsAdmin(false);
      }
    } else {
      setUser(null);
      setAdminData(null);
      setIsAdmin(false);
    }

    setLoading(false);
  };

  useEffect(() => {
    // 1. Check for an existing session on mount
    const initSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        await handleSession(session);
      } catch (err) {
        console.error('Error getting initial session:', err);
        setLoading(false);
      }
    };

    initSession();

    // 2. Subscribe to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN') {
          await handleSession(session);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setAdminData(null);
          setIsAdmin(false);
          setLoading(false);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Sign in with email and password.
   * Returns the auth result from Supabase.
   */
  const login = async (email, password) => {
    const result = await supabase.auth.signInWithPassword({ email, password });
    return result;
  };

  /**
   * Sign out the current user.
   */
  const logout = async () => {
    await supabase.auth.signOut();
  };

  const value = {
    user,
    adminData,
    isAdmin,
    loading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
