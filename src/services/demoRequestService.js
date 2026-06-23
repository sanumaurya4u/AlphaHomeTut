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
  writeBatch,
} from 'firebase/firestore';

/**
 * Create a new demo request.
 */
export async function createDemoRequest(data) {
  try {
    const docRef = await addDoc(collection(db, 'demo_requests'), {
      ...data,
      created_at: serverTimestamp(),
    });

    return { id: docRef.id, ...data };
  } catch (error) {
    console.error('createDemoRequest error:', error);
    throw error;
  }
}

/**
 * Fetch demo requests with optional filtering, search, sorting, and pagination.
 * Uses Firestore cursor-based pagination.
 */
export async function getDemoRequests({
  search = '',
  status = '',
  mode = '',
  page = 1,
  pageSize = 10,
  sortBy = 'created_at',
  sortOrder = 'desc',
  lastDoc = null,
} = {}) {
  try {
    const requestsRef = collection(db, 'demo_requests');
    const constraints = [];

    if (status) {
      constraints.push(where('status', '==', status));
    }

    if (mode) {
      constraints.push(where('mode', '==', mode));
    }

    constraints.push(orderBy(sortBy, sortOrder));
    constraints.push(limit(pageSize));

    if (lastDoc) {
      constraints.push(startAfter(lastDoc));
    }

    const q = query(requestsRef, ...constraints);
    const snapshot = await getDocs(q);

    let data = snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    }));

    // Client-side search filtering on student_name, location
    if (search) {
      const searchLower = search.toLowerCase();
      data = data.filter(
        (req) =>
          (req.student_name && req.student_name.toLowerCase().includes(searchLower)) ||
          (req.location && req.location.toLowerCase().includes(searchLower))
      );
    }

    // Build count query with the same filters (excluding pagination)
    const countConstraints = [];
    if (status) {
      countConstraints.push(where('status', '==', status));
    }
    if (mode) {
      countConstraints.push(where('mode', '==', mode));
    }

    const countQuery = countConstraints.length > 0
      ? query(requestsRef, ...countConstraints)
      : requestsRef;
    const countSnapshot = await getCountFromServer(countQuery);
    const count = countSnapshot.data().count;

    const lastVisible = snapshot.docs[snapshot.docs.length - 1] || null;

    return { data, count, lastDoc: lastVisible };
  } catch (error) {
    console.error('getDemoRequests error:', error);
    throw error;
  }
}

/**
 * Fetch a single demo request by its ID.
 */
export async function getDemoRequestById(id) {
  try {
    const docSnap = await getDoc(doc(db, 'demo_requests', id));

    if (!docSnap.exists()) {
      throw new Error('Demo request not found');
    }

    return { id: docSnap.id, ...docSnap.data() };
  } catch (error) {
    console.error('getDemoRequestById error:', error);
    throw error;
  }
}

/**
 * Update the status of a demo request.
 */
export async function updateDemoRequestStatus(id, status) {
  try {
    const requestRef = doc(db, 'demo_requests', id);
    await updateDoc(requestRef, { status });

    const updatedSnap = await getDoc(requestRef);
    return { id: updatedSnap.id, ...updatedSnap.data() };
  } catch (error) {
    console.error('updateDemoRequestStatus error:', error);
    throw error;
  }
}

/**
 * Delete a demo request by its ID.
 */
export async function deleteDemoRequest(id) {
  try {
    await deleteDoc(doc(db, 'demo_requests', id));
    return true;
  } catch (error) {
    console.error('deleteDemoRequest error:', error);
    throw error;
  }
}

/**
 * Get aggregate stats for demo requests: total, pending, contacted, assigned, completed.
 */
export async function getDemoRequestStats() {
  try {
    const requestsRef = collection(db, 'demo_requests');

    const [total, pending, contacted, assigned, completed] = await Promise.all([
      getCountFromServer(requestsRef),
      getCountFromServer(query(requestsRef, where('status', '==', 'Pending'))),
      getCountFromServer(query(requestsRef, where('status', '==', 'Contacted'))),
      getCountFromServer(query(requestsRef, where('status', '==', 'Tutor Assigned'))),
      getCountFromServer(query(requestsRef, where('status', '==', 'Completed'))),
    ]);

    return {
      total: total.data().count,
      pending: pending.data().count,
      contacted: contacted.data().count,
      assigned: assigned.data().count,
      completed: completed.data().count,
    };
  } catch (error) {
    console.error('getDemoRequestStats error:', error);
    throw error;
  }
}

/**
 * Assign a tutor to a demo request.
 * Inserts into assigned_tutors and updates the demo request status to "Tutor Assigned".
 * Uses a batch write for atomicity.
 */
export async function assignTutorToRequest(requestId, tutorId, notes = '') {
  try {
    const batch = writeBatch(db);

    // Create a new document reference in assigned_tutors
    const assignmentRef = doc(collection(db, 'assigned_tutors'));
    const assignmentData = {
      demo_request_id: requestId,
      tutor_id: tutorId,
      notes,
      status: 'Assigned',
      created_at: serverTimestamp(),
    };
    batch.set(assignmentRef, assignmentData);

    // Update the demo request status
    const requestRef = doc(db, 'demo_requests', requestId);
    batch.update(requestRef, { status: 'Tutor Assigned' });

    await batch.commit();

    return { id: assignmentRef.id, ...assignmentData };
  } catch (error) {
    console.error('assignTutorToRequest error:', error);
    throw error;
  }
}
