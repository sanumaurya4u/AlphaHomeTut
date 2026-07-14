import { supabase } from '@/supabase/config';

const BUCKET_NAME = 'tutor-documents';

export async function uploadDocument(file, tutorId, documentType) {
  try {
    const timestamp = Date.now();
    const ext = file.name.split('.').pop();
    const filePath = `${tutorId}/${documentType}_${timestamp}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, file);
    if (uploadError) throw uploadError;

    const { data: docRecord, error: insertError } = await supabase
      .from('tutor_documents')
      .insert([{
        tutor_id: tutorId,
        file_path: filePath,
        file_name: file.name,
        file_size: file.size,
        document_type: documentType,
      }])
      .select()
      .single();

    if (insertError) {
      await supabase.storage.from(BUCKET_NAME).remove([filePath]);
      throw insertError;
    }
    return docRecord;
  } catch (error) {
    console.error('uploadDocument error:', error);
    throw error;
  }
}

export async function getDocumentUrl(filePath) {
  const { data } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(filePath);
  return data.publicUrl;
}

export async function deleteDocument(id, filePath) {
  const { error: storageError } = await supabase.storage
    .from(BUCKET_NAME)
    .remove([filePath]);
  if (storageError) { console.error('deleteDocument storage error:', storageError); throw storageError; }

  const { error: dbError } = await supabase
    .from('tutor_documents')
    .delete()
    .eq('id', id);
  if (dbError) { console.error('deleteDocument db error:', dbError); throw dbError; }
  return true;
}

export async function getDocumentsByTutor(tutorId) {
  const { data, error } = await supabase
    .from('tutor_documents')
    .select('*')
    .eq('tutor_id', tutorId)
    .order('created_at', { ascending: false });
  if (error) { console.error('getDocumentsByTutor error:', error); throw error; }
  return data || [];
}
