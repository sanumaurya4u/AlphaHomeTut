import { supabase } from '@/supabase/config';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { firebaseAuth, googleProvider } from './firebaseConfig';

export async function signUp({ email, password, fullName, role }) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName, role },
    },
  });
  if (error) throw error;
  return data;
}

export async function signIn({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
  return true;
}

export async function getCurrentSession() {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) throw error;
  return session;
}

export async function getUserProfile(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  if (error) throw error;
  return data;
}

export function onAuthStateChange(callback) {
  return supabase.auth.onAuthStateChange(callback);
}

export async function signInWithGoogle() {
  // 1. Sign in with Firebase
  const userCredential = await signInWithPopup(firebaseAuth, googleProvider);
  
  // 2. Extract the underlying Google ID Token
  const credential = GoogleAuthProvider.credentialFromResult(userCredential);
  const googleIdToken = credential?.idToken;

  if (!googleIdToken) {
    throw new Error('No Google ID Token found in credential.');
  }

  // 3. Authenticate with Supabase using the Google ID Token
  const { data, error } = await supabase.auth.signInWithIdToken({
    provider: 'google',
    token: googleIdToken,
  });

  if (error) throw error;
  return data;
}
