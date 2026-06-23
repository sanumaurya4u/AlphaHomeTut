import { db } from '@/firebase/config';
import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  getCountFromServer,
  serverTimestamp,
} from 'firebase/firestore';

/**
 * Create a new membership with a default 1-year expiry and Active status.
 */
export async function createMembership(data) {
  try {
    const expiresAt = new Date();
    expiresAt.setFullYear(expiresAt.getFullYear() + 1);

    const membershipData = {
      tutor_id: data.tutor_id,
      plan_name: data.plan_name,
      amount: data.amount,
      status: 'Active',
      expires_at: expiresAt.toISOString(),
      created_at: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, 'memberships'), membershipData);

    return { id: docRef.id, ...membershipData };
  } catch (error) {
    console.error('createMembership error:', error);
    throw error;
  }
}

/**
 * Fetch memberships with optional filtering, search, and pagination.
 * Joins with tutors to include the tutor's full_name, email, phone.
 */
export async function getMemberships({
  search = '',
  status = '',
  planName = '',
  page = 1,
  pageSize = 10,
  lastDoc = null,
} = {}) {
  try {
    const membershipsRef = collection(db, 'memberships');
    const constraints = [];

    if (status) {
      constraints.push(where('status', '==', status));
    }

    if (planName) {
      constraints.push(where('plan_name', '==', planName));
    }

    constraints.push(orderBy('created_at', 'desc'));
    constraints.push(limit(pageSize));

    if (lastDoc) {
      constraints.push(startAfter(lastDoc));
    }

    const q = query(membershipsRef, ...constraints);
    const snapshot = await getDocs(q);

    // Fetch related tutor data for each membership
    const data = await Promise.all(
      snapshot.docs.map(async (docSnap) => {
        const membership = { id: docSnap.id, ...docSnap.data() };

        let tutorData = null;
        if (membership.tutor_id) {
          try {
            const tutorSnap = await getDoc(doc(db, 'tutors', membership.tutor_id));
            if (tutorSnap.exists()) {
              const t = tutorSnap.data();
              tutorData = {
                full_name: t.full_name,
                email: t.email,
                phone: t.phone,
              };
            }
          } catch {
            // Silently handle missing tutor reference
          }
        }

        return {
          ...membership,
          tutors: tutorData,
        };
      })
    );

    // Client-side search on plan_name and tutor full_name
    let filteredData = data;
    if (search) {
      const searchLower = search.toLowerCase();
      filteredData = data.filter(
        (m) =>
          (m.plan_name && m.plan_name.toLowerCase().includes(searchLower)) ||
          (m.tutors?.full_name && m.tutors.full_name.toLowerCase().includes(searchLower))
      );
    }

    // Count query
    const countConstraints = [];
    if (status) {
      countConstraints.push(where('status', '==', status));
    }
    if (planName) {
      countConstraints.push(where('plan_name', '==', planName));
    }
    const countQuery = countConstraints.length > 0
      ? query(membershipsRef, ...countConstraints)
      : membershipsRef;
    const countSnapshot = await getCountFromServer(countQuery);
    const count = countSnapshot.data().count;

    const lastVisible = snapshot.docs[snapshot.docs.length - 1] || null;

    return { data: filteredData, count, lastDoc: lastVisible };
  } catch (error) {
    console.error('getMemberships error:', error);
    throw error;
  }
}

/**
 * Update the status of a membership.
 */
export async function updateMembershipStatus(id, status) {
  try {
    const membershipRef = doc(db, 'memberships', id);
    await updateDoc(membershipRef, { status });

    const updatedSnap = await getDoc(membershipRef);
    return { id: updatedSnap.id, ...updatedSnap.data() };
  } catch (error) {
    console.error('updateMembershipStatus error:', error);
    throw error;
  }
}

/**
 * Get membership stats grouped by plan type and status.
 */
export async function getMembershipStats() {
  try {
    const snapshot = await getDocs(collection(db, 'memberships'));

    const stats = {
      total: snapshot.size,
      byPlan: {},
      byStatus: {},
    };

    snapshot.docs.forEach((docSnap) => {
      const data = docSnap.data();
      const plan = data.plan_name || 'Unknown';
      const membershipStatus = data.status || 'Unknown';

      stats.byPlan[plan] = (stats.byPlan[plan] || 0) + 1;
      stats.byStatus[membershipStatus] = (stats.byStatus[membershipStatus] || 0) + 1;
    });

    return stats;
  } catch (error) {
    console.error('getMembershipStats error:', error);
    throw error;
  }
}
