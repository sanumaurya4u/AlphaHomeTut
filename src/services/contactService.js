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
 * Submit a new contact message.
 */
export async function submitContactMessage(data) {
  try {
    const docRef = await addDoc(collection(db, 'contact_messages'), {
      ...data,
      is_read: false,
      created_at: serverTimestamp(),
    });

    return { id: docRef.id, ...data };
  } catch (error) {
    console.error('submitContactMessage error:', error);
    throw error;
  }
}

/**
 * Fetch contact messages with optional filtering, search, sorting, and pagination.
 */
export async function getContactMessages({
  search = '',
  isRead = null,
  page = 1,
  pageSize = 10,
  sortBy = 'created_at',
  sortOrder = 'desc',
  lastDoc = null,
} = {}) {
  try {
    const messagesRef = collection(db, 'contact_messages');
    const constraints = [];

    if (isRead !== null && isRead !== undefined && isRead !== '') {
      constraints.push(where('is_read', '==', isRead));
    }

    constraints.push(orderBy(sortBy, sortOrder));
    constraints.push(limit(pageSize));

    if (lastDoc) {
      constraints.push(startAfter(lastDoc));
    }

    const q = query(messagesRef, ...constraints);
    const snapshot = await getDocs(q);

    let data = snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    }));

    // Client-side search filtering on name, email, subject, message
    if (search) {
      const searchLower = search.toLowerCase();
      data = data.filter(
        (msg) =>
          (msg.name && msg.name.toLowerCase().includes(searchLower)) ||
          (msg.email && msg.email.toLowerCase().includes(searchLower)) ||
          (msg.subject && msg.subject.toLowerCase().includes(searchLower)) ||
          (msg.message && msg.message.toLowerCase().includes(searchLower))
      );
    }

    // Count query with same filters (excluding pagination)
    const countConstraints = [];
    if (isRead !== null && isRead !== undefined && isRead !== '') {
      countConstraints.push(where('is_read', '==', isRead));
    }

    const countQuery = countConstraints.length > 0
      ? query(messagesRef, ...countConstraints)
      : messagesRef;
    const countSnapshot = await getCountFromServer(countQuery);
    const count = countSnapshot.data().count;

    const lastVisible = snapshot.docs[snapshot.docs.length - 1] || null;

    return { data, count, lastDoc: lastVisible };
  } catch (error) {
    console.error('getContactMessages error:', error);
    throw error;
  }
}

/**
 * Mark a contact message as read.
 */
export async function markAsRead(id) {
  try {
    const msgRef = doc(db, 'contact_messages', id);
    await updateDoc(msgRef, { is_read: true });

    const updatedSnap = await getDoc(msgRef);
    return { id: updatedSnap.id, ...updatedSnap.data() };
  } catch (error) {
    console.error('markAsRead error:', error);
    throw error;
  }
}

/**
 * Delete a contact message by ID.
 */
export async function deleteContactMessage(id) {
  try {
    await deleteDoc(doc(db, 'contact_messages', id));
    return true;
  } catch (error) {
    console.error('deleteContactMessage error:', error);
    throw error;
  }
}

/**
 * Get the count of unread contact messages.
 */
export async function getUnreadCount() {
  try {
    const q = query(
      collection(db, 'contact_messages'),
      where('is_read', '==', false)
    );
    const countSnapshot = await getCountFromServer(q);
    return countSnapshot.data().count;
  } catch (error) {
    console.error('getUnreadCount error:', error);
    throw error;
  }
}
