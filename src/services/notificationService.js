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
  writeBatch,
} from 'firebase/firestore';

/**
 * Create a new notification.
 */
export async function createNotification({ type, title, message, referenceId, referenceType }) {
  try {
    const docRef = await addDoc(collection(db, 'notifications'), {
      type,
      title,
      message,
      reference_id: referenceId,
      reference_type: referenceType,
      is_read: false,
      created_at: serverTimestamp(),
    });

    const snap = await getDoc(docRef);
    return { id: snap.id, ...snap.data() };
  } catch (error) {
    console.error('createNotification error:', error);
    throw error;
  }
}

/**
 * Fetch notifications with optional unread-only filter and pagination.
 */
export async function getNotifications({
  unreadOnly = false,
  pageSize = 20,
  lastDoc = null,
} = {}) {
  try {
    const constraints = [];

    if (unreadOnly) {
      constraints.push(where('is_read', '==', false));
    }

    constraints.push(orderBy('created_at', 'desc'));
    constraints.push(limit(pageSize));

    if (lastDoc) {
      constraints.push(startAfter(lastDoc));
    }

    const q = query(collection(db, 'notifications'), ...constraints);
    const snapshot = await getDocs(q);

    const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    const lastVisible = snapshot.docs[snapshot.docs.length - 1] || null;

    // Get total count
    const countConstraints = [];
    if (unreadOnly) {
      countConstraints.push(where('is_read', '==', false));
    }
    const countQuery = query(collection(db, 'notifications'), ...countConstraints);
    const countSnap = await getCountFromServer(countQuery);
    const count = countSnap.data().count;

    return { data, count, lastDoc: lastVisible };
  } catch (error) {
    console.error('getNotifications error:', error);
    throw error;
  }
}

/**
 * Mark a single notification as read.
 */
export async function markAsRead(id) {
  try {
    const docRef = doc(db, 'notifications', id);
    await updateDoc(docRef, { is_read: true });

    const snap = await getDoc(docRef);
    return { id: snap.id, ...snap.data() };
  } catch (error) {
    console.error('markAsRead error:', error);
    throw error;
  }
}

/**
 * Mark all notifications as read.
 */
export async function markAllAsRead() {
  try {
    const q = query(
      collection(db, 'notifications'),
      where('is_read', '==', false)
    );
    const snapshot = await getDocs(q);

    const batch = writeBatch(db);
    snapshot.docs.forEach((d) => {
      batch.update(d.ref, { is_read: true });
    });
    await batch.commit();

    // Return updated docs
    const updated = snapshot.docs.map((d) => ({
      id: d.id,
      ...d.data(),
      is_read: true,
    }));

    return updated;
  } catch (error) {
    console.error('markAllAsRead error:', error);
    throw error;
  }
}

/**
 * Get the count of unread notifications.
 */
export async function getUnreadCount() {
  try {
    const q = query(
      collection(db, 'notifications'),
      where('is_read', '==', false)
    );
    const countSnap = await getCountFromServer(q);
    return countSnap.data().count;
  } catch (error) {
    console.error('getUnreadCount error:', error);
    throw error;
  }
}
