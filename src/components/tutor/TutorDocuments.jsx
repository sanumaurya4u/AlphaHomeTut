import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { uploadDocument, getDocumentsByTutor } from '@/services/uploadService';
import toast from 'react-hot-toast';

export default function TutorDocuments({ tutorId }) {
  const [uploading, setUploading] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [documents, setDocuments] = useState({
    Aadhaar: { status: 'Missing', fileName: null },
    Photo: { status: 'Missing', fileName: null },
    Resume: { status: 'Missing', fileName: null },
    Certificates: { status: 'Missing', fileName: null },
  });

  useEffect(() => {
    const fetchDocuments = async () => {
      if (!tutorId) return;
      try {
        const docs = await getDocumentsByTutor(tutorId);
        const docsMap = {
          Aadhaar: { status: 'Missing', fileName: null },
          Photo: { status: 'Missing', fileName: null },
          Resume: { status: 'Missing', fileName: null },
          Certificates: { status: 'Missing', fileName: null },
        };
        docs.forEach(doc => {
          if (docsMap[doc.document_type]) {
            docsMap[doc.document_type] = {
              status: 'Pending', // Set to pending or based on a real verified status if available
              fileName: doc.file_name,
            };
          }
        });
        setDocuments(docsMap);
      } catch (error) {
        toast.error('Failed to load documents');
      } finally {
        setLoading(false);
      }
    };
    fetchDocuments();
  }, [tutorId]);

  const handleFileUpload = async (type, e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(type);
    try {
      await uploadDocument(file, tutorId, type);
      setDocuments({ ...documents, [type]: { status: 'Pending', fileName: file.name } });
      toast.success(`${type} uploaded successfully. Awaiting verification.`);
    } catch (error) {
      toast.error(`Failed to upload ${type}`);
    } finally {
      setUploading(null);
    }
  };

  const docTypes = [
    { type: 'Aadhaar', title: 'Aadhaar Card', desc: 'Front and back in a single PDF/Image' },
    { type: 'Photo', title: 'Passport Photo', desc: 'Clear passport size photograph' },
    { type: 'Resume', title: 'Resume/CV', desc: 'Updated professional resume' },
    { type: 'Certificates', title: 'Highest Qualification', desc: 'Degree or Marksheet' },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-primary mb-2">Document Verification</h2>
          <p className="text-gray-500">Upload your documents to get the "Verified Tutor" badge and access premium tuitions.</p>
        </div>

        <div className="grid gap-6">
          {loading ? (
            <div className="flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
          ) : (
            docTypes.map((doc) => {
              const currentDoc = documents[doc.type] || { status: 'Missing', fileName: null };
              return (
                <div key={doc.type} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl border border-gray-100 bg-gray-50/50 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-xl ${
                      currentDoc.status === 'Verified' ? 'bg-emerald-100 text-emerald-600' :
                      currentDoc.status === 'Pending' ? 'bg-amber-100 text-amber-600' :
                      'bg-gray-200 text-gray-500'
                    }`}>
                      <FileText className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800">{doc.title}</h3>
                      <p className="text-xs text-gray-500 mt-0.5">{doc.desc}</p>
                      
                      <div className="flex items-center gap-2 mt-2">
                        {currentDoc.status === 'Verified' && <span className="text-xs font-bold text-emerald-600 flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5"/> Verified</span>}
                        {currentDoc.status === 'Pending' && <span className="text-xs font-bold text-amber-600 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5"/> Pending Review</span>}
                        {currentDoc.status === 'Missing' && <span className="text-xs font-bold text-red-500 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5"/> Required</span>}
                        
                        {currentDoc.fileName && (
                          <>
                            <span className="w-1 h-1 bg-gray-300 rounded-full" />
                            <span className="text-xs text-gray-400 truncate max-w-[150px]">{currentDoc.fileName}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="sm:ml-auto">
                    <input
                      type="file"
                      id={`upload-${doc.type}`}
                      className="hidden"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileUpload(doc.type, e)}
                      disabled={uploading === doc.type || currentDoc.status === 'Verified'}
                    />
                    <label
                      htmlFor={`upload-${doc.type}`}
                      className={`flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all cursor-pointer ${
                        currentDoc.status === 'Verified'
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-60'
                          : 'bg-primary text-white hover:bg-primary-light hover:shadow-md'
                      }`}
                    >
                      {uploading === doc.type ? (
                        <><Loader2 className="w-4 h-4 animate-spin" /> Uploading...</>
                      ) : (
                        <><Upload className="w-4 h-4" /> {currentDoc.fileName ? 'Update' : 'Upload'}</>
                      )}
                    </label>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </motion.div>
  );
}
