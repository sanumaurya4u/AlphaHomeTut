import { useState, useEffect } from 'react';
import DataTable from './DataTable';
import Modal from './Modal';
import { getDemoRequests, updateDemoRequestStatus, createDemoRequest, updateDemoRequest, deleteDemoRequest } from '@/services/demoRequestService';
import toast from 'react-hot-toast';
import { Calendar, Phone, MapPin, DollarSign, BookOpen, User, PlusCircle, Trash2, Edit } from 'lucide-react';

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

export default function AdminStudents() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal & Form States
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [modalType, setModalType] = useState('add'); // 'add' or 'edit'
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response = await getDemoRequests({ pageSize: 50 });
      setData(response.data);
    } catch (error) {
      toast.error('Failed to load students');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateDemoRequestStatus(id, newStatus);
      toast.success('Status updated successfully');
      setData(prev => prev.map(student => student.id === id ? { ...student, status: newStatus } : student));
    } catch (error) {
      toast.error('Failed to update status');
      console.error(error);
    }
  };

  const handleView = (row) => {
    setSelectedStudent(row);
    setIsViewModalOpen(true);
  };

  const handleAddClick = () => {
    setModalType('add');
    setFormData(INITIAL_FORM_STATE);
    setIsFormModalOpen(true);
  };

  const handleEditClick = (row) => {
    setModalType('edit');
    setSelectedStudent(row);
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
    if (window.confirm(`Are you sure you want to delete demo request/student for ${row.student_name}?`)) {
      try {
        await deleteDemoRequest(row.id);
        toast.success('Record deleted successfully');
        setData(prev => prev.filter(item => item.id !== row.id));
      } catch (error) {
        toast.error('Failed to delete student request');
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
        toast.success('Student request created successfully');
      } else {
        await updateDemoRequest(selectedStudent.id, formData);
        toast.success('Student details updated successfully');
      }
      setIsFormModalOpen(false);
      fetchStudents();
    } catch (error) {
      toast.error(modalType === 'add' ? 'Failed to create student request' : 'Failed to update student details');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns = [
    { key: 'id', label: 'ID', render: (row) => <span className="text-gray-400 text-xs">{row.id.substring(0,8)}...</span> },
    { key: 'name', label: 'Name', render: (row) => <span className="font-bold text-gray-900">{row.student_name}</span> },
    { key: 'class', label: 'Class', render: (row) => row.class || '-' },
    { key: 'subject', label: 'Subject', render: (row) => row.subject || '-' },
    { key: 'location', label: 'Location', render: (row) => row.location || '-' },
    { 
      key: 'status', 
      label: 'Status',
      render: (row) => (
        <select
          value={row.status || 'Pending'}
          onChange={(e) => handleStatusChange(row.id, e.target.value)}
          className={`px-3 py-1 rounded-full text-xs font-bold cursor-pointer outline-none appearance-none ${
            row.status === 'Completed' || row.status === 'Tutor Assigned' ? 'bg-emerald-100 text-emerald-700' :
            row.status === 'Contacted' ? 'bg-blue-100 text-blue-700' :
            'bg-amber-100 text-amber-700'
          }`}
        >
          <option value="Pending">Pending</option>
          <option value="Contacted">Contacted</option>
          <option value="Tutor Assigned">Tutor Assigned</option>
          <option value="Completed">Completed</option>
        </select>
      )
    },
    { key: 'joined', label: 'Joined On', render: (row) => new Date(row.created_at).toLocaleDateString() }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-primary mb-1">Students</h2>
          <p className="text-gray-500 text-sm">Manage student profiles, enrollments, and statuses.</p>
        </div>
        <button 
          onClick={handleAddClick}
          className="bg-primary text-white hover:bg-primary-light font-bold px-6 py-2.5 rounded-xl text-sm transition-all shadow-sm flex items-center gap-2"
        >
          <PlusCircle className="w-4 h-4" /> Add Student
        </button>
      </div>

      <DataTable 
        columns={columns} 
        data={data} 
        loading={loading}
        searchPlaceholder="Search students by name, ID, or class..."
        onView={handleView}
        onEdit={handleEditClick}
        onDelete={handleDelete}
      />

      {/* View Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Student Request Profile"
        size="md"
      >
        {selectedStudent && (
          <div className="space-y-6">
            <div className="flex justify-between border-b border-gray-100 pb-4">
              <div>
                <h3 className="text-xl font-black text-primary">{selectedStudent.student_name}</h3>
                <p className="text-xs text-gray-400 mt-1">ID: {selectedStudent.id}</p>
              </div>
              <span className={`px-3 py-1 rounded-full h-fit text-xs font-bold ${
                selectedStudent.status === 'Completed' || selectedStudent.status === 'Tutor Assigned' ? 'bg-emerald-100 text-emerald-700' :
                selectedStudent.status === 'Contacted' ? 'bg-blue-100 text-blue-700' :
                'bg-amber-100 text-amber-700'
              }`}>
                {selectedStudent.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-secondary flex-shrink-0" />
                <span className="text-gray-600">Contact: {selectedStudent.phone || '-'}</span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-secondary flex-shrink-0" />
                <span className="text-gray-600">Class: {selectedStudent.class || '-'}</span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-secondary flex-shrink-0" />
                <span className="text-gray-600">Subject: {selectedStudent.subject || '-'}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-secondary flex-shrink-0" />
                <span className="text-gray-600">Location: {selectedStudent.location || '-'}</span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-secondary flex-shrink-0" />
                <span className="text-gray-600">Budget: {selectedStudent.budget || '-'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-secondary flex-shrink-0" />
                <span className="text-gray-600">Timing: {selectedStudent.timing || '-'}</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-secondary flex-shrink-0" />
                <span className="text-gray-600">Mode: {selectedStudent.mode || '-'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-secondary flex-shrink-0" />
                <span className="text-gray-600">Joined: {new Date(selectedStudent.created_at).toLocaleDateString()}</span>
              </div>
            </div>

            {selectedStudent.remarks && (
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 text-sm">
                <p className="font-bold text-gray-700 mb-1">Remarks</p>
                <p className="text-gray-600 leading-relaxed">{selectedStudent.remarks}</p>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Add / Edit Form Modal */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        title={modalType === 'add' ? 'Add Student Request' : 'Edit Student Details'}
        size="md"
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-semibold text-xs mb-1.5">Student Name *</label>
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
                placeholder="e.g. Class 10"
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
                placeholder="e.g. Math, Physics"
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
                placeholder="e.g. ₹5,000/mo"
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
                placeholder="e.g. Evening 5-7 PM"
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
            <label className="block text-gray-700 font-semibold text-xs mb-1.5">Remarks / Notes</label>
            <textarea
              name="remarks"
              value={formData.remarks}
              onChange={handleInputChange}
              rows={3}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:border-secondary focus:outline-none transition-all resize-none"
              placeholder="Any additional details or requirements..."
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
              {modalType === 'add' ? 'Create Request' : 'Save Changes'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
