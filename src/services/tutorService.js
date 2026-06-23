import { db } from '@/firebase/config';
import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  getCountFromServer,
  serverTimestamp,
} from 'firebase/firestore';

/**
 * Register a new tutor.
 */
export async function registerTutor(data) {
  try {
    const docRef = await addDoc(collection(db, 'tutors'), {
      ...data,
      created_at: serverTimestamp(),
    });

    return { id: docRef.id, ...data };
  } catch (error) {
    console.error('registerTutor error:', error);
    throw error;
  }
}

/**
 * Fetch tutors with optional filtering, search, sorting, and pagination.
 * Uses Firestore cursor-based pagination.
 */
export async function getTutors({
  search = '',
  status = '',
  qualification = '',
  page = 1,
  pageSize = 10,
  sortBy = 'created_at',
  sortOrder = 'desc',
  lastDoc = null,
} = {}) {
  try {
    const tutorsRef = collection(db, 'tutors');
    const constraints = [];

    if (status) {
      constraints.push(where('status', '==', status));
    }

    if (qualification) {
      constraints.push(where('qualification', '==', qualification));
    }

    constraints.push(orderBy(sortBy, sortOrder));
    constraints.push(limit(pageSize));

    if (lastDoc) {
      constraints.push(startAfter(lastDoc));
    }

    const q = query(tutorsRef, ...constraints);
    const snapshot = await getDocs(q);

    let data = snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    }));

    // Client-side search filtering on full_name, email, phone
    if (search) {
      const searchLower = search.toLowerCase();
      data = data.filter(
        (tutor) =>
          (tutor.full_name && tutor.full_name.toLowerCase().includes(searchLower)) ||
          (tutor.email && tutor.email.toLowerCase().includes(searchLower)) ||
          (tutor.phone && tutor.phone.toLowerCase().includes(searchLower))
      );
    }

    // Build count query with the same filters (excluding pagination)
    const countConstraints = [];
    if (status) {
      countConstraints.push(where('status', '==', status));
    }
    if (qualification) {
      countConstraints.push(where('qualification', '==', qualification));
    }

    const countQuery = countConstraints.length > 0
      ? query(tutorsRef, ...countConstraints)
      : tutorsRef;
    const countSnapshot = await getCountFromServer(countQuery);
    const count = countSnapshot.data().count;

    const lastVisible = snapshot.docs[snapshot.docs.length - 1] || null;

    return { data, count, lastDoc: lastVisible };
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
    const tutorSnap = await getDoc(doc(db, 'tutors', id));

    if (!tutorSnap.exists()) {
      throw new Error('Tutor not found');
    }

    // Fetch related tutor_documents
    const docsQuery = query(
      collection(db, 'tutor_documents'),
      where('tutor_id', '==', id)
    );
    const docsSnapshot = await getDocs(docsQuery);
    const tutor_documents = docsSnapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    }));

    return {
      id: tutorSnap.id,
      ...tutorSnap.data(),
      tutor_documents,
    };
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
    const tutorRef = doc(db, 'tutors', id);
    await updateDoc(tutorRef, { status });

    const updatedSnap = await getDoc(tutorRef);
    return { id: updatedSnap.id, ...updatedSnap.data() };
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
    await deleteDoc(doc(db, 'tutors', id));
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
    const tutorsRef = collection(db, 'tutors');

    const [total, pending, verified, rejected] = await Promise.all([
      getCountFromServer(tutorsRef),
      getCountFromServer(query(tutorsRef, where('status', '==', 'Pending'))),
      getCountFromServer(query(tutorsRef, where('status', '==', 'Verified'))),
      getCountFromServer(query(tutorsRef, where('status', '==', 'Rejected'))),
    ]);

    return {
      total: total.data().count,
      pending: pending.data().count,
      verified: verified.data().count,
      rejected: rejected.data().count,
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
    const q = query(
      collection(db, 'tutors'),
      where('status', '==', 'Verified'),
      orderBy('full_name', 'asc')
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map((docSnap) => {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        full_name: data.full_name,
        email: data.email,
        phone: data.phone,
        subjects: data.subjects,
        qualification: data.qualification,
      };
    });
  } catch (error) {
    console.error('getVerifiedTutors error:', error);
    throw error;
  }
}
