import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Users, BookOpen, LogOut, Loader2, LayoutDashboard,
  MessageSquare, UserPlus, CreditCard
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { getTutors } from '@/services/tutorService';
import { getDemoRequests } from '@/services/demoRequestService';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user, isAdmin, logout, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('tutors');
  
  const [tutors, setTutors] = useState([]);
  const [demoRequests, setDemoRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Auth Guard
  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      navigate('/admin/login', { replace: true });
    }
  }, [authLoading, user, isAdmin, navigate]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'tutors') {
        const response = await getTutors({ pageSize: 50 });
        setTutors(response.data);
      } else if (activeTab === 'demoRequests') {
        const response = await getDemoRequests({ pageSize: 50 });
        setDemoRequests(response.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && isAdmin) {
      fetchData();
    }
  }, [activeTab, user, isAdmin]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/admin/login', { replace: true });
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  if (authLoading || !user || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
          <Loader2 className="w-10 h-10 animate-spin text-secondary mb-4" />
          <p className="text-gray-500 font-medium">Checking authorization...</p>
        </div>
      </div>
    );
  }

  const renderTutorsTable = () => (
    <div className="overflow-x-auto bg-white rounded-xl shadow border border-gray-100">
      <table className="w-full text-left text-sm text-gray-600">
        <thead className="bg-gray-50 border-b border-gray-100 text-gray-800 font-semibold">
          <tr>
            <th className="px-6 py-4">Name</th>
            <th className="px-6 py-4">Email / Phone</th>
            <th className="px-6 py-4">Qualification</th>
            <th className="px-6 py-4">Subjects</th>
            <th className="px-6 py-4">Status</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-500"><Loader2 className="w-6 h-6 animate-spin mx-auto" /></td></tr>
          ) : tutors.length === 0 ? (
            <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-500">No tutors found.</td></tr>
          ) : (
            tutors.map(tutor => (
              <tr key={tutor.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                <td className="px-6 py-4 font-medium text-primary">{tutor.fullName || tutor.full_name}</td>
                <td className="px-6 py-4">
                  <div>{tutor.email}</div>
                  <div className="text-xs text-gray-400">{tutor.phone}</div>
                </td>
                <td className="px-6 py-4">{tutor.degree || tutor.qualification}</td>
                <td className="px-6 py-4 max-w-xs truncate">{tutor.subjects}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                    tutor.status === 'Verified' ? 'bg-emerald-100 text-emerald-700' :
                    tutor.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                    'bg-amber-100 text-amber-700'
                  }`}>
                    {tutor.status || 'Pending'}
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );

  const renderDemoRequestsTable = () => (
    <div className="overflow-x-auto bg-white rounded-xl shadow border border-gray-100">
      <table className="w-full text-left text-sm text-gray-600">
        <thead className="bg-gray-50 border-b border-gray-100 text-gray-800 font-semibold">
          <tr>
            <th className="px-6 py-4">Student Name</th>
            <th className="px-6 py-4">Contact</th>
            <th className="px-6 py-4">Class & Subject</th>
            <th className="px-6 py-4">Location</th>
            <th className="px-6 py-4">Status</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-500"><Loader2 className="w-6 h-6 animate-spin mx-auto" /></td></tr>
          ) : demoRequests.length === 0 ? (
            <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-500">No demo requests found.</td></tr>
          ) : (
            demoRequests.map(req => (
              <tr key={req.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                <td className="px-6 py-4 font-medium text-primary">{req.studentName || req.student_name}</td>
                <td className="px-6 py-4">
                  <div>{req.phone}</div>
                  {req.email && <div className="text-xs text-gray-400">{req.email}</div>}
                </td>
                <td className="px-6 py-4">
                  <div>{req.className || req.class}</div>
                  <div className="text-xs text-gray-500">{req.subject || req.subjects}</div>
                </td>
                <td className="px-6 py-4">{req.location || req.city}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                    req.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' :
                    req.status === 'Tutor Assigned' ? 'bg-blue-100 text-blue-700' :
                    req.status === 'Contacted' ? 'bg-purple-100 text-purple-700' :
                    'bg-amber-100 text-amber-700'
                  }`}>
                    {req.status || 'Pending'}
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col fixed inset-y-0 left-0 z-10">
        <div className="p-6 border-b border-gray-100 flex items-center gap-3">
          <div className="w-10 h-10 bg-secondary/15 rounded-xl flex items-center justify-center">
            <LayoutDashboard className="w-5 h-5 text-secondary" />
          </div>
          <div>
            <h2 className="font-bold text-primary">Alpha Admin</h2>
            <p className="text-xs text-gray-400">Portal</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => setActiveTab('tutors')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
              activeTab === 'tutors' 
                ? 'bg-secondary/10 text-secondary' 
                : 'text-gray-600 hover:bg-gray-50 hover:text-primary'
            }`}
          >
            <UserPlus className="w-5 h-5" /> Registered Tutors
          </button>
          
          <button
            onClick={() => setActiveTab('demoRequests')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
              activeTab === 'demoRequests' 
                ? 'bg-secondary/10 text-secondary' 
                : 'text-gray-600 hover:bg-gray-50 hover:text-primary'
            }`}
          >
            <BookOpen className="w-5 h-5" /> Demo Requests
          </button>
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-5 h-5" /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-8 py-6 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-primary capitalize">
              {activeTab === 'tutors' ? 'Registered Tutors' : 'Demo Requests'}
            </h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500">Logged in as <strong className="text-primary">Admin</strong></span>
              <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center text-secondary font-bold border border-secondary/30">
                A
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-8">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'tutors' && renderTutorsTable()}
            {activeTab === 'demoRequests' && renderDemoRequestsTable()}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
