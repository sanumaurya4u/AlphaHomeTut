import { useState, useEffect } from 'react';
import { Menu } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/supabase/config';
import Footer from '@/components/Footer';
import BecomeTutorForm from '@/components/BecomeTutorForm';
import TutorSidebar from '@/components/tutor/TutorSidebar';
import TutorProfile from '@/components/tutor/TutorProfile';
import TutorApplications from '@/components/tutor/TutorApplications';
import TutorDocuments from '@/components/tutor/TutorDocuments';
import TutorMembership from '@/components/tutor/TutorMembership';
import TutorEarnings from '@/components/tutor/TutorEarnings';
import TutorNotifications from '@/components/tutor/TutorNotifications';
import TutorSettings from '@/components/tutor/TutorSettings';
import TermsAndConditions from '@/pages/TermsAndConditions';
import PrivacyPolicy from '@/pages/PrivacyPolicy';
import RefundPolicy from '@/pages/RefundPolicy';
import AboutPage from '@/pages/AboutPage';
import ServicesPage from '@/pages/ServicesPage';
import ContactPage from '@/pages/ContactPage';

export default function TutorDashboard() {
  const { user, profile } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'profile');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  const [tutorProfile, setTutorProfile] = useState(null);
  const [loadingTutor, setLoadingTutor] = useState(true);

  // Synchronize search params with active tab state
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && tab !== activeTab) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  // Handle window resize for mobile check
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch tutor profile to ensure they have filled the form or auto-create it
  useEffect(() => {
    const fetchTutor = async () => {
      try {
        const { data, error } = await supabase
          .from('tutors')
          .select('*')
          .or(`email.ilike.${user?.email},profile_id.eq.${user?.id}`)
          .limit(1)
          .maybeSingle();

        if (data) {
          // If the profile was created via registration form before signup, link it now
          if (!data.profile_id) {
            const { data: updated } = await supabase
              .from('tutors')
              .update({ profile_id: user.id })
              .eq('id', data.id)
              .select()
              .single();
            setTutorProfile(updated || data);
          } else {
            setTutorProfile(data);
          }
        } else if (!data) {
          // Profile does not exist in tutors table, auto-create a default one
          const { data: newTutor, error: insertError } = await supabase
            .from('tutors')
            .insert([{
              email: user.email,
              full_name: profile?.full_name || user.user_metadata?.full_name || user.email.split('@')[0],
              profile_id: user.id,
              status: 'Pending'
            }])
            .select()
            .single();
            
          if (!insertError && newTutor) {
            setTutorProfile(newTutor);
          } else {
            console.error('Failed to auto-create tutor profile:', insertError);
          }
        } else if (error) {
          console.error('Error fetching tutor profile:', error);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingTutor(false);
      }
    };
    if (user?.email) {
      fetchTutor();
    } else {
      setLoadingTutor(false);
    }
  }, [user, profile]);

  if (loadingTutor) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-secondary rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400 text-sm font-medium">Loading your portal...</p>
        </div>
      </div>
    );
  }

  // If they haven't applied yet and somehow auto-creation failed, initialize an empty profile
  // so they can access the dashboard and fill their details in the Profile tab.
  const currentProfile = tutorProfile || {
    id: null,
    full_name: profile?.full_name || user?.user_metadata?.full_name || (user?.email ? user.email.split('@')[0] : ''),
    email: user?.email || '',
    phone: profile?.phone || '',
    status: 'Pending'
  };

  // Render active tab component
  const renderTab = () => {
    switch (activeTab) {
      case 'profile': return <TutorProfile profile={currentProfile} setProfile={setTutorProfile} />;
      case 'applications': return <TutorApplications tutorId={currentProfile.id} />;
      case 'documents': return <TutorDocuments tutorId={currentProfile.id} />;
      case 'membership': return <TutorMembership tutorId={currentProfile.id} />;
      case 'earnings': return <TutorEarnings tutorId={currentProfile.id} />;
      case 'notifications': return <TutorNotifications tutorId={currentProfile.id} />;
      case 'settings': return <TutorSettings profile={currentProfile} />;
      case 'terms': return <TermsAndConditions />;
      case 'privacy': return <PrivacyPolicy />;
      case 'refund': return <RefundPolicy />;
      case 'about': return <AboutPage />;
      case 'services': return <ServicesPage />;
      case 'contact': return <ContactPage />;
      default: return <TutorProfile profile={currentProfile} setProfile={setTutorProfile} />;
    }
  };

  const initials = currentProfile.full_name
    ? currentProfile.full_name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
    : 'U';

  return (
    <div className="min-h-screen bg-gray-50 flex overflow-hidden">
      
      {/* Sidebar */}
      <TutorSidebar 
        activeTab={activeTab} 
        setActiveTab={handleTabChange} 
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
              {activeTab === 'profile' && 'My Profile'}
              {activeTab === 'applications' && 'My Applications'}
              {activeTab === 'documents' && 'Documents'}
              {activeTab === 'membership' && 'Membership'}
              {activeTab === 'earnings' && 'Earnings & Payments'}
              {activeTab === 'notifications' && 'Notifications'}
              {activeTab === 'settings' && 'Account Settings'}
              {activeTab === 'terms' && 'Terms & Conditions'}
              {activeTab === 'privacy' && 'Privacy Policy'}
              {activeTab === 'refund' && 'Refund Policy'}
              {activeTab === 'about' && 'About Us'}
              {activeTab === 'services' && 'Services'}
              {activeTab === 'contact' && 'Contact Support'}
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="p-2 relative text-gray-400 hover:text-primary transition-colors" onClick={() => handleTabChange('notifications')}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bell"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>
            
            <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
              <div className="flex flex-col items-end hidden sm:flex">
                <span className="text-sm font-bold text-gray-800 leading-none">{currentProfile.full_name}</span>
                <span className="text-xs text-emerald-600 font-medium mt-1">
                  {currentProfile.status === 'Verified' ? 'Verified Tutor' : 'Pending Verification'}
                </span>
              </div>
              <div className="w-10 h-10 rounded-full bg-secondary text-primary font-bold flex items-center justify-center border-2 border-white shadow-sm">
                {initials}
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Content */}
        <main className="flex-1 overflow-y-auto flex flex-col">
          <div className={`flex-1 ${['terms', 'privacy', 'refund', 'about', 'services', 'contact'].includes(activeTab) ? '' : 'p-4 sm:p-8 w-full max-w-6xl mx-auto'}`}>
            {renderTab()}
          </div>
          <Footer hideStudentOptions={true} isDashboard={true} />
        </main>
        
      </div>
    </div>
  );
}
