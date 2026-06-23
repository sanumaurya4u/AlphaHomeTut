import { auth, db } from '@/firebase/config';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';

/**
 * Login an admin user with email and password.
 * Checks if the user is an authorized admin after authentication.
 * Signs out and throws if not an admin.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<import('firebase/auth').UserCredential>}
 */
export async function loginAdmin(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const userId = userCredential.user.uid;
    const isAdmin = await isAdminUser(userId);
    if (!isAdmin) {
      await signOut(auth);
      throw new Error('Access denied. You are not an authorized admin.');
    }
    return userCredential;
  } catch (error) {
    console.error('loginAdmin error:', error);
    throw error;
  }
}

/**
 * Logout the current admin user.
 * @returns {Promise<boolean>}
 */
export async function logoutAdmin() {
  try {
    await signOut(auth);
    return true;
  } catch (error) {
    console.error('logoutAdmin error:', error);
    throw error;
  }
}

/**
 * Get the current authenticated user.
 * @returns {import('firebase/auth').User | null}
 */
export function getCurrentSession() {
  try {
    return auth.currentUser;
  } catch (error) {
    console.error('getCurrentSession error:', error);
    throw error;
  }
}

/**
 * Check if a user is an admin by querying the admin_users Firestore collection.
 * @param {string} userId
 * @returns {Promise<boolean>}
 */
export async function isAdminUser(userId) {
  try {
    const q = query(
      collection(db, 'admin_users'),
      where('user_id', '==', userId)
    );
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  } catch (error) {
    console.error('isAdminUser error:', error);
    throw error;
  }
}
