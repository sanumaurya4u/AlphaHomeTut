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
 * Create a new tutor assignment.
 */
export async function createAssignment(data) {
  try {
    const docRef = await addDoc(collection(db, 'assigned_tutors'), {
      ...data,
      created_at: serverTimestamp(),
    });

    return { id: docRef.id, ...data };
  } catch (error) {
    console.error('createAssignment error:', error);
    throw error;
  }
}

/**
 * Fetch assignments with optional filtering, search, and pagination.
 * Performs secondary lookups on demo_requests and tutors to join related data.
 */
export async function getAssignments({
  search = '',
  status = '',
  page = 1,
  pageSize = 10,
  lastDoc = null,
} = {}) {
  try {
    const assignmentsRef = collection(db, 'assigned_tutors');
    const constraints = [];

    if (status) {
      constraints.push(where('status', '==', status));
    }

    constraints.push(orderBy('created_at', 'desc'));
    constraints.push(limit(pageSize));

    if (lastDoc) {
      constraints.push(startAfter(lastDoc));
    }

    const q = query(assignmentsRef, ...constraints);
    const snapshot = await getDocs(q);

    // Fetch related data for each assignment
    const data = await Promise.all(
      snapshot.docs.map(async (docSnap) => {
        const assignment = { id: docSnap.id, ...docSnap.data() };

        // Fetch related demo_request
        let demoRequestData = null;
        if (assignment.demo_request_id) {
          try {
            const demoSnap = await getDoc(doc(db, 'demo_requests', assignment.demo_request_id));
            if (demoSnap.exists()) {
              const d = demoSnap.data();
              demoRequestData = {
                student_name: d.student_name,
                subject: d.subject,
                class: d.class,
              };
            }
          } catch {
            // Silently handle missing reference
          }
        }

        // Fetch related tutor
        let tutorData = null;
        if (assignment.tutor_id) {
          try {
            const tutorSnap = await getDoc(doc(db, 'tutors', assignment.tutor_id));
            if (tutorSnap.exists()) {
              tutorData = { full_name: tutorSnap.data().full_name };
            }
          } catch {
            // Silently handle missing reference
          }
        }

        return {
          ...assignment,
          demo_requests: demoRequestData,
          tutors: tutorData,
        };
      })
    );

    // Client-side search on student_name and tutor full_name
    let filteredData = data;
    if (search) {
      const searchLower = search.toLowerCase();
      filteredData = data.filter(
        (a) =>
          (a.demo_requests?.student_name && a.demo_requests.student_name.toLowerCase().includes(searchLower)) ||
          (a.tutors?.full_name && a.tutors.full_name.toLowerCase().includes(searchLower))
      );
    }

    // Count query
    const countConstraints = [];
    if (status) {
      countConstraints.push(where('status', '==', status));
    }
    const countQuery = countConstraints.length > 0
      ? query(assignmentsRef, ...countConstraints)
      : assignmentsRef;
    const countSnapshot = await getCountFromServer(countQuery);
    const count = countSnapshot.data().count;

    const lastVisible = snapshot.docs[snapshot.docs.length - 1] || null;

    return { data: filteredData, count, lastDoc: lastVisible };
  } catch (error) {
    console.error('getAssignments error:', error);
    throw error;
  }
}

/**
 * Update an assignment's status and/or notes.
 */
export async function updateAssignment(id, data) {
  try {
    const assignmentRef = doc(db, 'assigned_tutors', id);
    await updateDoc(assignmentRef, data);

    const updatedSnap = await getDoc(assignmentRef);
    return { id: updatedSnap.id, ...updatedSnap.data() };
  } catch (error) {
    console.error('updateAssignment error:', error);
    throw error;
  }
}

/**
 * Delete an assignment by ID.
 */
export async function deleteAssignment(id) {
  try {
    await deleteDoc(doc(db, 'assigned_tutors', id));
    return true;
  } catch (error) {
    console.error('deleteAssignment error:', error);
    throw error;
  }
}
