import { useState, useEffect } from 'react';
import { Menu, Search, Filter } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';

import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminOverview from '@/components/admin/AdminOverview';
import AdminStudents from '@/components/admin/AdminStudents';
import AdminTutors from '@/components/admin/AdminTutors';
import AdminJobs from '@/components/admin/AdminJobs';
import AdminApplicants from '@/components/admin/AdminApplicants';
import AdminInterviews from '@/components/admin/AdminInterviews';
import AdminTrials from '@/components/admin/AdminTrials';
import AdminClasses from '@/components/admin/AdminClasses';
import AdminBilling from '@/components/admin/AdminBilling';
import AdminPayouts from '@/components/admin/AdminPayouts';
import AdminReviews from '@/components/admin/AdminReviews';
import AdminStaff from '@/components/admin/AdminStaff';
import AdminReports from '@/components/admin/AdminReports';

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  // Handle window resize for mobile check
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const renderTab = () => {
    switch (activeTab) {
      case 'overview': return <AdminOverview setActiveTab={setActiveTab} />;
      case 'students': return <AdminStudents />;
      case 'tutors': return <AdminTutors />;
      case 'jobs': return <AdminJobs />;
      case 'applicants': return <AdminApplicants />;
      case 'interviews': return <AdminInterviews />;
      case 'trials': return <AdminTrials />;
      case 'classes': return <AdminClasses />;
      case 'billing': return <AdminBilling />;
      case 'payouts': return <AdminPayouts />;
      case 'reviews': return <AdminReviews />;
      case 'staff': return <AdminStaff />;
      case 'reports': return <AdminReports />;
      default: return <AdminOverview setActiveTab={setActiveTab} />;
    }
  };

  const tabTitles = {
    'overview': 'Dashboard Overview',
    'students': 'Student Management',
    'tutors': 'Tutor Directory',
    'jobs': 'Tuition Jobs',
    'applicants': 'Job Applicants',
    'interviews': 'Interviews',
    'trials': 'Trial Classes',
    'classes': 'Active Classes',
    'billing': 'Student Billing',
    'payouts': 'Tutor Payouts',
    'reviews': 'Feedback & Reviews',
    'staff': 'Staff & Roles',
    'reports': 'Analytics & Reports'
  };

  return (
    <div className="min-h-screen bg-gray-50 flex overflow-hidden">
      
      {/* Sidebar */}
      <AdminSidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isOpen={sidebarOpen} 
        setIsOpen={setSidebarOpen} 
        isMobile={isMobile}
      />

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${!isMobile && sidebarOpen ? 'ml-64' : !isMobile && !sidebarOpen ? 'ml-20' : 'ml-0'}`}>
        
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-4 sm:px-8 sticky top-0 z-30 shadow-sm">
          <div className="flex items-center gap-4">
            {isMobile && (
              <button 
                onClick={() => setSidebarOpen(true)} 
                className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Menu className="w-6 h-6" />
              </button>
            )}
            <h1 className="text-xl font-bold text-primary hidden sm:block">
              {tabTitles[activeTab]}
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 w-64">
              <Search className="w-4 h-4 text-gray-400 mr-2" />
              <input type="text" placeholder="Global search..." className="bg-transparent border-none outline-none text-sm w-full" />
            </div>

            <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
              <div className="flex flex-col items-end hidden sm:flex">
                <span className="text-sm font-bold text-gray-800 leading-none">Super Admin</span>
                <span className="text-xs text-secondary font-medium mt-1">Full Access</span>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-blue-900 text-white font-bold flex items-center justify-center border-2 border-white shadow-sm">
                SA
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8">
          <div className="max-w-7xl mx-auto">
            {renderTab()}
          </div>
        </main>
        
      </div>
    </div>
  );
}
