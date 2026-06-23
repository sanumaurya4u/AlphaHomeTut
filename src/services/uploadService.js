import { db, storage } from '@/firebase/config';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';

const BUCKET_NAME = 'tutor-documents';

/**
 * Upload a document file to Firebase Cloud Storage and record it in the tutor_documents collection.
 */
export async function uploadDocument(file, tutorId, documentType) {
  try {
    const timestamp = Date.now();
    const ext = file.name.split('.').pop();
    const filePath = `${BUCKET_NAME}/${tutorId}/${documentType}_${timestamp}.${ext}`;

    const storageRef = ref(storage, filePath);
    await uploadBytes(storageRef, file);

    let docRef;
    try {
      docRef = await addDoc(collection(db, 'tutor_documents'), {
        tutor_id: tutorId,
        file_path: filePath,
        file_name: file.name,
        file_size: file.size,
        document_type: documentType,
        created_at: serverTimestamp(),
      });
    } catch (insertError) {
      // Clean up the uploaded file if the Firestore insert fails
      await deleteObject(storageRef);
      throw new Error(`Document record creation failed: ${insertError.message}`);
    }

    const snap = await getDoc(docRef);
    return { id: snap.id, ...snap.data() };
  } catch (error) {
    console.error('uploadDocument error:', error);
    throw error;
  }
}

/**
 * Get the download URL for a stored document.
 */
export async function getDocumentUrl(filePath) {
  try {
    const storageRef = ref(storage, filePath);
    const url = await getDownloadURL(storageRef);
    return url;
  } catch (error) {
    console.error('getDocumentUrl error:', error);
    throw error;
  }
}

/**
 * Delete a document from both Firebase Cloud Storage and the tutor_documents collection.
 */
export async function deleteDocument(id, filePath) {
  try {
    const storageRef = ref(storage, filePath);
    await deleteObject(storageRef);

    const docRef = doc(db, 'tutor_documents', id);
    await deleteDoc(docRef);

    return true;
  } catch (error) {
    console.error('deleteDocument error:', error);
    throw error;
  }
}

/**
 * Fetch all documents belonging to a specific tutor.
 */
export async function getDocumentsByTutor(tutorId) {
  try {
    const q = query(
      collection(db, 'tutor_documents'),
      where('tutor_id', '==', tutorId),
      orderBy('created_at', 'desc')
    );
    const snapshot = await getDocs(q);

    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (error) {
    console.error('getDocumentsByTutor error:', error);
    throw error;
  }
}
