import { supabase } from '@/supabase/client';

const BUCKET_NAME = 'tutor-documents';

/**
 * Upload a document file to Supabase storage and record it in the tutor_documents table.
 */
export async function uploadDocument(file, tutorId, documentType) {
  try {
    const timestamp = Date.now();
    const ext = file.name.split('.').pop();
    const filePath = `${tutorId}/${documentType}_${timestamp}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      throw new Error(`File upload failed: ${uploadError.message}`);
    }

    const { data: record, error: insertError } = await supabase
      .from('tutor_documents')
      .insert({
        tutor_id: tutorId,
        file_path: filePath,
        file_name: file.name,
        file_size: file.size,
        document_type: documentType,
      })
      .select()
      .single();

    if (insertError) {
      // Attempt to clean up the uploaded file if the DB insert fails
      await supabase.storage.from(BUCKET_NAME).remove([filePath]);
      throw new Error(`Document record creation failed: ${insertError.message}`);
    }

    return record;
  } catch (error) {
    console.error('uploadDocument error:', error);
    throw error;
  }
}

/**
 * Generate a signed URL for a stored document (valid for 1 hour).
 */
export async function getDocumentUrl(filePath) {
  try {
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .createSignedUrl(filePath, 3600);

    if (error) {
      throw new Error(error.message);
    }

    return data.signedUrl;
  } catch (error) {
    console.error('getDocumentUrl error:', error);
    throw error;
  }
}

/**
 * Delete a document from both Supabase storage and the tutor_documents table.
 */
export async function deleteDocument(id, filePath) {
  try {
    const { error: storageError } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([filePath]);

    if (storageError) {
      throw new Error(`Storage deletion failed: ${storageError.message}`);
    }

    const { error: dbError } = await supabase
      .from('tutor_documents')
      .delete()
      .eq('id', id);

    if (dbError) {
      throw new Error(`Document record deletion failed: ${dbError.message}`);
    }

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
    const { data, error } = await supabase
      .from('tutor_documents')
      .select('*')
      .eq('tutor_id', tutorId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error('getDocumentsByTutor error:', error);
    throw error;
  }
}
