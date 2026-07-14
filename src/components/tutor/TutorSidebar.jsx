import { User, FileText, Upload, CreditCard, DollarSign, Bell, Settings, LogOut, ChevronLeft, ChevronRight, ShieldCheck, RefreshCw } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const navItems = [
  { id: 'profile', label: 'My Profile', icon: User },
  { id: 'applications', label: 'My Applications', icon: FileText },
  { id: 'documents', label: 'Documents', icon: Upload },
  { id: 'membership', label: 'Membership', icon: CreditCard },
  { id: 'earnings', label: 'Earnings', icon: DollarSign },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'settings', label: 'Settings', icon: Settings },
  { id: 'terms', label: 'Terms & Conditions', icon: FileText },
  { id: 'privacy', label: 'Privacy Policy', icon: ShieldCheck },
  { id: 'refund', label: 'Refund Policy', icon: RefreshCw },
];

export default function TutorSidebar({ activeTab, setActiveTab, isOpen, setIsOpen, isMobile }) {
  const { signOutUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOutUser();
    navigate('/tutor/login');
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
            <img src="/AHT-logo.svg" alt="AlphaTut" className="w-8 h-8 rounded-lg object-contain" />
            <div className="font-bold text-xl whitespace-nowrap">
              Alpha<span className="text-secondary">Tut</span>
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

        <nav className="flex-1 py-6 px-3 space-y-2 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id)}
              className={`w-full flex items-center gap-4 px-3 py-3 rounded-xl transition-all duration-200 group ${
                activeTab === item.id 
                  ? 'bg-secondary text-primary font-semibold shadow-lg shadow-secondary/20' 
                  : 'text-white/70 hover:bg-white/5 hover:text-white'
              }`}
            >
              <item.icon className={`w-5 h-5 flex-shrink-0 ${activeTab === item.id ? 'text-primary' : 'text-white/50 group-hover:text-white'}`} />
              <span className={`transition-all duration-300 whitespace-nowrap ${!isOpen && !isMobile ? 'opacity-0 w-0 hidden' : 'opacity-100'}`}>
                {item.label}
              </span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-4 px-3 py-3 rounded-xl text-red-400 hover:bg-red-400/10 transition-colors ${!isOpen && !isMobile ? 'justify-center' : ''}`}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <span className={`transition-all duration-300 font-medium ${!isOpen && !isMobile ? 'opacity-0 w-0 hidden' : 'opacity-100'}`}>
              Sign Out
            </span>
          </button>
        </div>
      </aside>
    </>
  );
}
