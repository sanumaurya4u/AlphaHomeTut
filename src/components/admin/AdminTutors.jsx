import { useState, useEffect } from 'react';
import DataTable from './DataTable';
import Modal from './Modal';
import { getTutors, updateTutorStatus, getTutorById, deleteTutor, updateTutorDocumentStatus } from '@/services/tutorService';
import { getDocumentUrl } from '@/services/uploadService';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';
import { Loader2, FileText, Check, X as CloseIcon, ExternalLink } from 'lucide-react';

export default function AdminTutors() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Modal States
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedTutor, setSelectedTutor] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [docRemarks, setDocRemarks] = useState({});

  useEffect(() => {
    fetchTutors();
  }, []);

  const fetchTutors = async () => {
    setLoading(true);
    try {
      const response = await getTutors({ pageSize: 50 });
      setData(response.data);
    } catch (error) {
      toast.error('Failed to load tutors');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateTutorStatus(id, newStatus);
      toast.success('Status updated successfully');
      setData(prev => prev.map(tutor => tutor.id === id ? { ...tutor, status: newStatus } : tutor));
      if (selectedTutor && selectedTutor.id === id) {
        setSelectedTutor(prev => ({ ...prev, status: newStatus }));
      }
    } catch (error) {
      toast.error('Failed to update status');
      console.error(error);
    }
  };

  const handleView = async (row) => {
    setSelectedTutor(null);
    setIsViewModalOpen(true);
    setDetailsLoading(true);
    try {
      const fullTutor = await getTutorById(row.id);
      setSelectedTutor(fullTutor);
    } catch (error) {
      toast.error('Failed to load tutor details');
      console.error(error);
      setIsViewModalOpen(false);
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleDelete = async (row) => {
    if (window.confirm(`Are you sure you want to delete tutor ${row.full_name}?`)) {
      try {
        await deleteTutor(row.id);
        toast.success('Tutor deleted successfully');
        setData(prev => prev.filter(t => t.id !== row.id));
      } catch (error) {
        toast.error('Failed to delete tutor');
        console.error(error);
      }
    }
  };

  const handleDocStatusChange = async (docId, newStatus) => {
    const remarks = docRemarks[docId] || '';
    try {
      await updateTutorDocumentStatus(docId, newStatus, remarks, user?.id);
      toast.success(`Document marked as ${newStatus}`);
      setSelectedTutor(prev => ({
        ...prev,
        tutor_documents: prev.tutor_documents.map(doc => 
          doc.id === docId ? { ...doc, status: newStatus, remarks } : doc
        )
      }));
    } catch (error) {
      toast.error('Failed to update document status');
      console.error(error);
    }
  };

  const handleViewDocument = async (filePath) => {
    try {
      const url = await getDocumentUrl(filePath);
      window.open(url, '_blank');
    } catch (error) {
      toast.error('Failed to get document link');
      console.error(error);
    }
  };

  const columns = [
    { key: 'id', label: 'ID', render: (row) => <span className="text-gray-400 text-xs">{row.id.substring(0,8)}...</span> },
    { key: 'full_name', label: 'Name', render: (row) => <span className="font-bold text-gray-900">{row.full_name}</span> },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Contact', render: (row) => row.phone || '-' },
    { key: 'qualification', label: 'Qualification', render: (row) => row.qualification || '-' },
    { key: 'city', label: 'City', render: (row) => row.city || '-' },
    { 
      key: 'status', 
      label: 'Status',
      render: (row) => (
        <select
          value={row.status || 'Pending'}
          onChange={(e) => handleStatusChange(row.id, e.target.value)}
          className={`px-3 py-1 rounded-full text-xs font-bold cursor-pointer outline-none appearance-none ${
            row.status === 'Verified' ? 'bg-emerald-100 text-emerald-700' :
            row.status === 'Rejected' ? 'bg-red-100 text-red-700' :
            'bg-amber-100 text-amber-700'
          }`}
        >
          <option value="Pending">Pending</option>
          <option value="Verified">Verified</option>
          <option value="Rejected">Rejected</option>
        </select>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-primary mb-1">Tutors</h2>
          <p className="text-gray-500 text-sm">Manage tutor profiles, verify documents, and approve applications.</p>
        </div>
        <button 
          onClick={fetchTutors}
          className="bg-primary text-white hover:bg-primary-light font-bold px-6 py-2.5 rounded-xl text-sm transition-all shadow-sm"
        >
          Refresh Data
        </button>
      </div>

      <DataTable 
        columns={columns} 
        data={data} 
        loading={loading}
        searchPlaceholder="Search tutors by name, email, or phone..."
        onView={handleView}
        onDelete={handleDelete}
      />

      {/* Tutor Profile Details Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Tutor Profile Details"
        size="lg"
      >
        {detailsLoading ? (
          <div className="py-12 flex flex-col items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-secondary mb-4" />
            <p className="text-gray-500 font-medium">Fetching details...</p>
          </div>
        ) : selectedTutor ? (
          <div className="space-y-8">
            {/* Header info */}
            <div className="flex flex-col sm:flex-row justify-between gap-4 pb-6 border-b border-gray-100">
              <div>
                <h3 className="text-2xl font-black text-primary">{selectedTutor.full_name}</h3>
                <p className="text-gray-500 text-sm mt-1">{selectedTutor.email} | {selectedTutor.phone}</p>
                <p className="text-gray-400 text-xs mt-1">ID: {selectedTutor.id}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-gray-500">Tutor Status:</span>
                <select
                  value={selectedTutor.status || 'Pending'}
                  onChange={(e) => handleStatusChange(selectedTutor.id, e.target.value)}
                  className={`px-4 py-2 rounded-xl text-sm font-bold border outline-none cursor-pointer ${
                    selectedTutor.status === 'Verified' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                    selectedTutor.status === 'Rejected' ? 'bg-red-50 text-red-700 border-red-200' :
                    'bg-amber-50 text-amber-700 border-amber-200'
                  }`}
                >
                  <option value="Pending">Pending</option>
                  <option value="Verified">Verified</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
            </div>

            {/* Profile Grid info */}
            <div className="grid sm:grid-cols-2 gap-6 text-sm">
              <div className="space-y-4">
                <h4 className="font-bold text-gray-800 border-l-4 border-secondary pl-2">Education & Skills</h4>
                <div className="space-y-2 pl-3">
                  <p><span className="text-gray-400">Qualification:</span> <span className="font-medium text-gray-800">{selectedTutor.qualification || '-'}</span></p>
                  <p><span className="text-gray-400">Degree:</span> <span className="font-medium text-gray-800">{selectedTutor.degree || '-'}</span></p>
                  <p><span className="text-gray-400">College/University:</span> <span className="font-medium text-gray-800">{selectedTutor.college || '-'}</span></p>
                  <p><span className="text-gray-400">Teaching Experience:</span> <span className="font-medium text-gray-800">{selectedTutor.experience || '-'}</span></p>
                  <p><span className="text-gray-400">Preferred Subjects:</span> <span className="font-medium text-gray-800">{selectedTutor.preferred_subjects || '-'}</span></p>
                  <p><span className="text-gray-400">Preferred Classes:</span> <span className="font-medium text-gray-800">{selectedTutor.preferred_classes || '-'}</span></p>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-bold text-gray-800 border-l-4 border-secondary pl-2">Personal & Contact</h4>
                <div className="space-y-2 pl-3">
                  <p><span className="text-gray-400">Gender:</span> <span className="font-medium text-gray-800">{selectedTutor.gender || '-'}</span></p>
                  <p><span className="text-gray-400">City:</span> <span className="font-medium text-gray-800">{selectedTutor.city || '-'}</span></p>
                  <p><span className="text-gray-400">Address:</span> <span className="font-medium text-gray-800">{selectedTutor.address || '-'}</span></p>
                  <p><span className="text-gray-400">Expected Salary:</span> <span className="font-medium text-gray-800">{selectedTutor.expected_salary || '-'}</span></p>
                  <p><span className="text-gray-400">10th Marks:</span> <span className="font-medium text-gray-800">{selectedTutor.tenth_marks || '-'}</span></p>
                  <p><span className="text-gray-400">12th Marks:</span> <span className="font-medium text-gray-800">{selectedTutor.twelfth_marks || '-'}</span></p>
                </div>
              </div>
            </div>

            {/* Documents Verification Section */}
            <div className="space-y-4 pt-4 border-t border-gray-100">
              <h4 className="font-bold text-gray-800 border-l-4 border-secondary pl-2">Verification Documents</h4>
              
              {!selectedTutor.tutor_documents || selectedTutor.tutor_documents.length === 0 ? (
                <p className="text-sm text-gray-400 pl-3">No documents uploaded yet.</p>
              ) : (
                <div className="space-y-4 pl-3">
                  {selectedTutor.tutor_documents.map((doc) => (
                    <div key={doc.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-secondary/15 text-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                          <FileText className="w-5 h-5 text-secondary" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-800">{doc.document_type}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{doc.file_name} ({(doc.file_size ? (doc.file_size / 1024).toFixed(1) : 0)} KB)</p>
                          {doc.remarks && <p className="text-xs text-red-500 mt-1"><span className="font-semibold">Remarks:</span> {doc.remarks}</p>}
                        </div>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                        {/* Status Badge */}
                        <span className={`px-2.5 py-1 rounded-lg text-center text-xs font-bold ${
                          doc.status === 'Verified' ? 'bg-emerald-100 text-emerald-700' :
                          doc.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                          'bg-amber-100 text-amber-700'
                        }`}>
                          {doc.status}
                        </span>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => handleViewDocument(doc.file_path)}
                            className="flex items-center gap-1 bg-white hover:bg-gray-100 border border-gray-200 text-gray-700 hover:text-primary px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm transition-all"
                            title="View document"
                          >
                            <ExternalLink className="w-3.5 h-3.5" /> View
                          </button>
                          
                          <button 
                            onClick={() => handleDocStatusChange(doc.id, 'Verified')}
                            className="bg-emerald-500 hover:bg-emerald-600 text-white p-1.5 rounded-lg transition-colors"
                            title="Approve document"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          
                          <button 
                            onClick={() => {
                              const reason = window.prompt("Enter rejection reason:");
                              if (reason !== null) {
                                setDocRemarks(prev => ({ ...prev, [doc.id]: reason }));
                                handleDocStatusChange(doc.id, 'Rejected');
                              }
                            }}
                            className="bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-lg transition-colors"
                            title="Reject document"
                          >
                            <CloseIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <p className="text-gray-500 text-center py-6">Tutor details not found.</p>
        )}
      </Modal>
    </div>
  );
}
