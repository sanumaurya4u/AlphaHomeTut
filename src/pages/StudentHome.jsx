import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import HeroSection from '../components/HeroSection';
import HowItWorks from '../components/HowItWorks';
import ServicesSection from '../components/ServicesSection';
import StatsCounter from '../components/StatsCounter';
import FAQ from '../components/FAQ';
import StudentProfile from '../components/StudentProfile';
import StudentRequests from '../components/StudentRequests';
import AuthModal from '../components/AuthModal';
import { User, FileText, ArrowLeft } from 'lucide-react';

export default function StudentHome() {
  const { user, profile, loading } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get('tab');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user && (tab === 'profile' || tab === 'requests')) {
      setSearchParams({});
      setIsAuthModalOpen(true);
    } else if (!loading && user && profile && profile.role !== 'student' && (tab === 'profile' || tab === 'requests')) {
      setSearchParams({});
    }
  }, [user, profile, loading, tab, setSearchParams]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-secondary rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400 text-sm font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  // If tab is profile or requests, and user is logged in, show student dashboard
  if (user && (tab === 'profile' || tab === 'requests')) {
    const fullName = profile?.full_name || user.email?.split('@')[0] || 'Student';
    const initials = fullName
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();

    return (
      <div className="min-h-screen bg-gray-50 pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Card */}
          <div className="bg-[#061B45] text-white rounded-3xl p-6 md:p-8 mb-8 relative overflow-hidden shadow-xl shadow-primary-dark/20">
            <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
            
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-secondary to-orange-400 p-0.5 shadow-lg shadow-secondary/20">
                  <div className="w-full h-full rounded-2xl bg-[#061B45] flex items-center justify-center font-bold text-xl text-secondary">
                    {initials}
                  </div>
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold">{fullName}</h1>
                  <p className="text-white/60 text-sm mt-1">{user.email}</p>
                </div>
              </div>
              <button
                onClick={() => setSearchParams({})}
                className="self-start md:self-auto flex items-center gap-2 bg-white/10 hover:bg-white/25 transition-all text-white px-5 py-2.5 rounded-xl text-sm font-semibold border border-white/10"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Home
              </button>
            </div>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-primary/5 p-4 space-y-1">
                <button
                  onClick={() => setSearchParams({ tab: 'profile' })}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-semibold transition-all ${
                    tab === 'profile'
                      ? 'bg-primary text-white shadow-lg shadow-primary/20'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-primary'
                  }`}
                >
                  <User className="w-4 h-4" />
                  My Profile
                </button>
                <button
                  onClick={() => setSearchParams({ tab: 'requests' })}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-semibold transition-all ${
                    tab === 'requests'
                      ? 'bg-primary text-white shadow-lg shadow-primary/20'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-primary'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  My Requests
                </button>
                <div className="border-t border-gray-100 my-2 pt-2">
                  <button
                    onClick={() => setSearchParams({})}
                    className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-semibold text-gray-500 hover:bg-gray-50 transition-all"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Home
                  </button>
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-3">
              {tab === 'profile' ? <StudentProfile /> : <StudentRequests />}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Normal Student Landing Home Page
  return (
    <>
      <HeroSection />
      <HowItWorks />
      <ServicesSection />
      <StatsCounter />
      <FAQ />

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        role="student"
      />
    </>
  );
}
