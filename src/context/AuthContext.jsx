import { createContext, useState, useEffect } from 'react';
import { supabase } from '@/supabase/client';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [adminData, setAdminData] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkAdminRole = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error || !data) {
        setIsAdmin(false);
        setAdminData(null);
        return false;
      }

      setIsAdmin(true);
      setAdminData(data);
      return true;
    } catch {
      setIsAdmin(false);
      setAdminData(null);
      return false;
    }
  };

  useEffect(() => {
    // Check existing session
    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser(session.user);
          await checkAdminRole(session.user.id);
        }
      } catch (err) {
        console.error('Auth init error:', err);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          setUser(session.user);
          await checkAdminRole(session.user.id);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setAdminData(null);
          setIsAdmin(false);
        } else if (event === 'TOKEN_REFRESHED' && session?.user) {
          setUser(session.user);
        }
      }
    );

    return () => subscription?.unsubscribe();
  }, []);

  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setAdminData(null);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ user, adminData, isAdmin, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
