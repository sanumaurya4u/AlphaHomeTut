import { Users, GraduationCap, Briefcase, FileText, Calendar, Video, Clock, CreditCard, IndianRupee, Star, Shield, BarChart, ChevronLeft, ChevronRight, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const navItems = [
  { id: 'overview', label: 'Overview', icon: BarChart },
  { id: 'students', label: 'Students', icon: Users },
  { id: 'tutors', label: 'Tutors', icon: GraduationCap },
  { id: 'jobs', label: 'Jobs', icon: Briefcase },
  { id: 'applicants', label: 'Job Applicants', icon: FileText },
  { id: 'interviews', label: 'Interviews', icon: Calendar },
  { id: 'trials', label: 'Trial Classes', icon: Video },
  { id: 'classes', label: 'Tutor Classes', icon: Clock },
  { id: 'billing', label: 'Student Billing', icon: CreditCard },
  { id: 'payouts', label: 'Tutor Payouts', icon: IndianRupee },
  { id: 'reviews', label: 'Reviews', icon: Star },
  { id: 'staff', label: 'Staff/Roles', icon: Shield },
  { id: 'reports', label: 'Reports', icon: BarChart },
];

export default function AdminSidebar({ activeTab, setActiveTab, isOpen, setIsOpen, isMobile }) {
  const { signOutUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOutUser();
    navigate('/admin/login');
  };

  const handleTabClick = (id) => {
    setActiveTab(id);
    if (isMobile) setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed top-0 left-0 h-full bg-[#061B45] text-white transition-all duration-300 z-50 flex flex-col shadow-2xl ${
          isOpen ? 'w-64 translate-x-0' : isMobile ? '-translate-x-full w-64' : 'w-20 translate-x-0'
        }`}
      >
        <div className="flex items-center justify-between p-4 h-20 border-b border-white/10 shrink-0">
          <Link 
            to="/" 
            className={`flex items-center gap-2 hover:opacity-85 transition-opacity ${!isOpen && !isMobile ? 'scale-0 w-0 hidden' : 'scale-100'}`}
          >
            <img src="/AHT-logo.svg" alt="AlphaAdmin" className="w-8 h-8 rounded-lg object-contain" />
            <div className="font-bold text-xl whitespace-nowrap">
              Alpha<span className="text-secondary">Admin</span>
            </div>
          </Link>
          
          {!isMobile && (
            <button 
              onClick={() => setIsOpen(!isOpen)} 
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 transition-colors mx-auto"
            >
              {isOpen ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
            </button>
          )}
        </div>

        <nav className="flex-1 py-4 px-3 space-y-1.5 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id)}
              className={`w-full flex items-center gap-4 px-3 py-2.5 rounded-xl transition-all duration-200 group ${
                activeTab === item.id 
                  ? 'bg-secondary text-primary font-bold shadow-lg shadow-secondary/20' 
                  : 'text-white/70 hover:bg-white/5 hover:text-white'
              }`}
            >
              <item.icon className={`w-5 h-5 flex-shrink-0 ${activeTab === item.id ? 'text-primary' : 'text-white/50 group-hover:text-white'}`} />
              <span className={`transition-all duration-300 whitespace-nowrap text-sm ${!isOpen && !isMobile ? 'opacity-0 w-0 hidden' : 'opacity-100'}`}>
                {item.label}
              </span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10 shrink-0">
          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-4 px-3 py-3 rounded-xl text-red-400 hover:bg-red-400/10 transition-colors ${!isOpen && !isMobile ? 'justify-center' : ''}`}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <span className={`transition-all duration-300 font-medium text-sm ${!isOpen && !isMobile ? 'opacity-0 w-0 hidden' : 'opacity-100'}`}>
              Sign Out
            </span>
          </button>
        </div>
      </aside>
    </>
  );
}
