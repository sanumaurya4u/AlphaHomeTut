import { useState, useEffect } from 'react';
import DataTable from './DataTable';
import Modal from './Modal';
import { getDemoRequests, createDemoRequest, updateDemoRequest, deleteDemoRequest, assignTutorToRequest } from '@/services/demoRequestService';
import { getVerifiedTutors } from '@/services/tutorService';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';
import { PlusCircle, Loader2, Calendar, Phone, MapPin, DollarSign, BookOpen, User, CheckCircle2 } from 'lucide-react';

const INITIAL_FORM_STATE = {
  student_name: '',
  class: '',
  subject: '',
  location: '',
  timing: '',
  budget: '',
  mode: 'Home Tuition',
  phone: '',
  status: 'Pending',
  remarks: ''
};

export default function AdminJobs() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Modal & Form States
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [modalType, setModalType] = useState('add'); // 'add' or 'edit'
  const [selectedJob, setSelectedJob] = useState(null);
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Tutor Assignment States
  const [verifiedTutors, setVerifiedTutors] = useState([]);
  const [selectedTutorId, setSelectedTutorId] = useState('');
  const [assignmentNotes, setAssignmentNotes] = useState('');
  const [isAssigning, setIsAssigning] = useState(false);

  useEffect(() => {
    fetchJobs();
    loadVerifiedTutors();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const response = await getDemoRequests({ pageSize: 50 });
      setData(response.data);
    } catch (error) {
      toast.error('Failed to load jobs');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const loadVerifiedTutors = async () => {
    try {
      const tutors = await getVerifiedTutors();
      setVerifiedTutors(tutors);
    } catch (error) {
      console.error('Failed to load verified tutors', error);
    }
  };

  const handleView = (row) => {
    setSelectedJob(row);
    setSelectedTutorId('');
    setAssignmentNotes('');
    setIsViewModalOpen(true);
  };

  const handleAddClick = () => {
    setModalType('add');
    setFormData(INITIAL_FORM_STATE);
    setIsFormModalOpen(true);
  };

  const handleEditClick = (row) => {
    setModalType('edit');
    setSelectedJob(row);
    setFormData({
      student_name: row.student_name || '',
      class: row.class || '',
      subject: row.subject || '',
      location: row.location || '',
      timing: row.timing || '',
      budget: row.budget || '',
      mode: row.mode || 'Home Tuition',
      phone: row.phone || '',
      status: row.status || 'Pending',
      remarks: row.remarks || ''
    });
    setIsFormModalOpen(true);
  };

  const handleDelete = async (row) => {
    if (window.confirm(`Are you sure you want to delete job ID ${row.id.substring(0,8)}...?`)) {
      try {
        await deleteDemoRequest(row.id);
        toast.success('Job deleted successfully');
        setData(prev => prev.filter(item => item.id !== row.id));
      } catch (error) {
        toast.error('Failed to delete job');
        console.error(error);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.student_name || !formData.phone) {
      toast.error('Student Name and Phone Number are required');
      return;
    }

    setIsSubmitting(true);
    try {
      if (modalType === 'add') {
        await createDemoRequest(formData);
        toast.success('Job created successfully');
      } else {
        await updateDemoRequest(selectedJob.id, formData);
        toast.success('Job details updated successfully');
      }
      setIsFormModalOpen(false);
      fetchJobs();
    } catch (error) {
      toast.error(modalType === 'add' ? 'Failed to create job' : 'Failed to update job details');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAssignTutor = async (e) => {
    e.preventDefault();
    if (!selectedTutorId) {
      toast.error('Please select a tutor');
      return;
    }

    setIsAssigning(true);
    try {
      await assignTutorToRequest(selectedJob.id, selectedTutorId, assignmentNotes, user?.id);
      toast.success('Tutor assigned successfully!');
      setIsViewModalOpen(false);
      fetchJobs();
    } catch (error) {
      toast.error('Failed to assign tutor');
      console.error(error);
    } finally {
      setIsAssigning(false);
    }
  };

  const columns = [
    { key: 'id', label: 'Job ID', render: (row) => <span className="font-bold text-gray-900">{row.id.substring(0,8)}...</span> },
    { key: 'subject', label: 'Subject', render: (row) => row.subject || '-' },
    { key: 'class', label: 'Class', render: (row) => row.class || '-' },
    { key: 'mode', label: 'Mode', render: (row) => (
      <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${row.mode === 'Online Classes' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'}`}>{row.mode || '-'}</span>
    ) },
    { key: 'location', label: 'Location', render: (row) => row.location || '-' },
    { key: 'budget', label: 'Budget', render: (row) => row.budget || '-' },
    { 
      key: 'status', 
      label: 'Status',
      render: (row) => {
        const isOpen = row.status === 'Pending' || row.status === 'Contacted';
        return (
        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
          isOpen ? 'bg-emerald-100 text-emerald-700' :
          row.status === 'Tutor Assigned' ? 'bg-blue-100 text-blue-700' :
          'bg-gray-100 text-gray-700'
        }`}>
          {isOpen ? 'Open' : row.status}
        </span>
      )}
    },
    { key: 'posted', label: 'Posted', render: (row) => new Date(row.created_at).toLocaleDateString() }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-primary mb-1">Tuition Jobs</h2>
          <p className="text-gray-500 text-sm">Manage student requirements and post new tuition opportunities.</p>
        </div>
        <button 
          onClick={handleAddClick}
          className="bg-primary text-white hover:bg-primary-light font-bold px-6 py-2.5 rounded-xl text-sm transition-all shadow-sm flex items-center gap-2"
        >
          <PlusCircle className="w-4 h-4" /> Create Job
        </button>
      </div>

      <DataTable 
        columns={columns} 
        data={data} 
        loading={loading}
        searchPlaceholder="Search jobs by ID, subject, or location..."
        onView={handleView}
        onEdit={handleEditClick}
        onDelete={handleDelete}
      />

      {/* View & Assign Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Tuition Job Details"
        size="md"
      >
        {selectedJob && (
          <div className="space-y-6">
            <div className="flex justify-between border-b border-gray-100 pb-4">
              <div>
                <h3 className="text-xl font-black text-primary">{selectedJob.subject} Tutor needed</h3>
                <p className="text-xs text-gray-400 mt-1">Job ID: {selectedJob.id}</p>
              </div>
              <span className={`px-3 py-1 rounded-full h-fit text-xs font-bold ${
                selectedJob.status === 'Pending' || selectedJob.status === 'Contacted' ? 'bg-emerald-100 text-emerald-700' :
                selectedJob.status === 'Tutor Assigned' ? 'bg-blue-100 text-blue-700' :
                'bg-gray-100 text-gray-700'
              }`}>
                {selectedJob.status === 'Pending' || selectedJob.status === 'Contacted' ? 'Open' : selectedJob.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-secondary flex-shrink-0" />
                <span className="text-gray-600">Class: {selectedJob.class || '-'}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-secondary flex-shrink-0" />
                <span className="text-gray-600">Location: {selectedJob.location || '-'}</span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-secondary flex-shrink-0" />
                <span className="text-gray-600">Budget: {selectedJob.budget || '-'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-secondary flex-shrink-0" />
                <span className="text-gray-600">Timing: {selectedJob.timing || '-'}</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-secondary flex-shrink-0" />
                <span className="text-gray-600">Mode: {selectedJob.mode || '-'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-secondary flex-shrink-0" />
                <span className="text-gray-600">Posted: {new Date(selectedJob.created_at).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2 col-span-2 border-t border-gray-50 pt-2">
                <Phone className="w-4 h-4 text-secondary flex-shrink-0" />
                <span className="text-gray-600">Student Contact: <span className="font-bold">{selectedJob.student_name}</span> ({selectedJob.phone || '-'})</span>
              </div>
            </div>

            {selectedJob.remarks && (
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 text-sm">
                <p className="font-bold text-gray-700 mb-1">Job Requirements Details</p>
                <p className="text-gray-600 leading-relaxed">{selectedJob.remarks}</p>
              </div>
            )}

            {/* Tutor Assignment section */}
            {(selectedJob.status === 'Pending' || selectedJob.status === 'Contacted') ? (
              <div className="pt-6 border-t border-gray-100">
                <h4 className="font-bold text-gray-800 border-l-4 border-secondary pl-2 mb-4">Assign Tutor to Job</h4>
                
                {verifiedTutors.length === 0 ? (
                  <p className="text-xs text-amber-600 font-bold bg-amber-50 border border-amber-100 p-3 rounded-xl">
                    No verified tutors available. Make sure tutors are verified under the "Tutors" tab before assigning.
                  </p>
                ) : (
                  <form onSubmit={handleAssignTutor} className="space-y-4">
                    <div>
                      <label className="block text-gray-700 font-semibold text-xs mb-1.5">Select Verified Tutor</label>
                      <select
                        value={selectedTutorId}
                        onChange={(e) => setSelectedTutorId(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:border-secondary focus:outline-none transition-all outline-none"
                        required
                      >
                        <option value="">-- Choose verified tutor --</option>
                        {verifiedTutors.map((tutor) => (
                          <option key={tutor.id} value={tutor.id}>
                            {tutor.full_name} ({tutor.qualification || 'No Degree'} | {tutor.phone})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-gray-700 font-semibold text-xs mb-1.5">Assignment Notes / Remarks</label>
                      <textarea
                        value={assignmentNotes}
                        onChange={(e) => setAssignmentNotes(e.target.value)}
                        rows={2}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:border-secondary focus:outline-none transition-all resize-none outline-none"
                        placeholder="Optional instructions for the tutor..."
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isAssigning}
                      className="w-full bg-secondary hover:bg-secondary-light text-primary font-bold py-3 rounded-xl text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                    >
                      {isAssigning ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                      Confirm Tutor Assignment
                    </button>
                  </form>
                )}
              </div>
            ) : (
              <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl flex items-center gap-2.5 text-sm text-blue-700 font-semibold mt-4">
                <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0" />
                This job already has a tutor assigned or is completed.
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Add / Edit Form Modal */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        title={modalType === 'add' ? 'Create Tuition Job' : 'Edit Tuition Job'}
        size="md"
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-semibold text-xs mb-1.5">Student / Contact Name *</label>
              <input
                type="text"
                name="student_name"
                value={formData.student_name}
                onChange={handleInputChange}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-sm focus:border-secondary focus:outline-none transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold text-xs mb-1.5">Phone Number *</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-sm focus:border-secondary focus:outline-none transition-all"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-semibold text-xs mb-1.5">Class</label>
              <input
                type="text"
                name="class"
                value={formData.class}
                onChange={handleInputChange}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-sm focus:border-secondary focus:outline-none transition-all"
                placeholder="e.g. Class 12"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold text-xs mb-1.5">Subject</label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-sm focus:border-secondary focus:outline-none transition-all"
                placeholder="e.g. Chemistry"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-semibold text-xs mb-1.5">Budget</label>
              <input
                type="text"
                name="budget"
                value={formData.budget}
                onChange={handleInputChange}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-sm focus:border-secondary focus:outline-none transition-all"
                placeholder="e.g. ₹6,000/mo"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold text-xs mb-1.5">Timing</label>
              <input
                type="text"
                name="timing"
                value={formData.timing}
                onChange={handleInputChange}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-sm focus:border-secondary focus:outline-none transition-all"
                placeholder="e.g. Morning 7-9 AM"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-semibold text-xs mb-1.5">Tuition Mode</label>
              <select
                name="mode"
                value={formData.mode}
                onChange={handleInputChange}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-sm focus:border-secondary focus:outline-none transition-all"
              >
                <option value="Home Tuition">Home Tuition</option>
                <option value="Online Classes">Online Classes</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 font-semibold text-xs mb-1.5">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-sm focus:border-secondary focus:outline-none transition-all"
              >
                <option value="Pending">Pending</option>
                <option value="Contacted">Contacted</option>
                <option value="Tutor Assigned">Tutor Assigned</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold text-xs mb-1.5">Location / Address</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-sm focus:border-secondary focus:outline-none transition-all"
              placeholder="Full physical address or online details"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold text-xs mb-1.5">Job Description / Requirements</label>
            <textarea
              name="remarks"
              value={formData.remarks}
              onChange={handleInputChange}
              rows={3}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:border-secondary focus:outline-none transition-all resize-none"
              placeholder="Any details on tutor requirements, student learning issues..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setIsFormModalOpen(false)}
              className="bg-gray-100 text-gray-700 hover:bg-gray-200 px-5 py-2 rounded-xl text-sm font-bold transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-primary text-white hover:bg-primary-light disabled:opacity-60 px-5 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2"
            >
              {isSubmitting && <PlusCircle className="w-4.5 h-4.5 animate-spin" />}
              {modalType === 'add' ? 'Create Job' : 'Save Changes'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
