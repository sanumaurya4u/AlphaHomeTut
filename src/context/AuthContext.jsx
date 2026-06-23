import { createContext, useState, useEffect } from 'react';
import { auth, db } from '@/firebase/config';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut as firebaseSignOut } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [adminData, setAdminData] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  /**
   * Query the admin_users Firestore collection to check if the given userId
   * has an admin record. Returns the admin row or null.
   */
  const fetchAdminData = async (userId) => {
    try {
      const q = query(
        collection(db, 'admin_users'),
        where('user_id', '==', userId)
      );
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        return null;
      }

      const docSnap = snapshot.docs[0];
      return { id: docSnap.id, ...docSnap.data() };
    } catch (err) {
      console.error('fetchAdminData exception:', err);
      return null;
    }
  };

  /**
   * Handle auth state changes — set user + admin state accordingly.
   */
  const handleUser = async (firebaseUser) => {
    if (firebaseUser) {
      setUser(firebaseUser);

      const admin = await fetchAdminData(firebaseUser.uid);
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
    // Subscribe to Firebase auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      await handleUser(firebaseUser);
    });

    return () => {
      unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Sign in with email and password.
   * Returns the UserCredential from Firebase Auth.
   */
  const login = async (email, password) => {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result;
  };

  /**
   * Sign out the current user.
   */
  const logout = async () => {
    await firebaseSignOut(auth);
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
