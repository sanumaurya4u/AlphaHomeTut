import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { lazy, Suspense, useEffect } from 'react';
import '@n8n/chat/style.css';
import { createChat } from '@n8n/chat';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import ScrollToTop from './components/ScrollToTop';
import ScrollToTopOnNavigate from './components/ScrollToTopOnNavigate';
import { AuthProvider } from './context/AuthContext';

// Lazy load public pages
const HomePage = lazy(() => import('./pages/HomePage'));
const TermsAndConditions = lazy(() => import('./pages/TermsAndConditions'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const RefundPolicy = lazy(() => import('./pages/RefundPolicy'));
const TutorRegistration = lazy(() => import('./pages/TutorRegistration'));
const MembershipPlans = lazy(() => import('./pages/MembershipPlans'));
const TutorDashboard = lazy(() => import('./pages/TutorDashboard'));

// Lazy load admin pages
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const AdminLayout = lazy(() => import('./layouts/AdminLayout'));
const ProtectedRoute = lazy(() => import('./routes/ProtectedRoute'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const DemoRequests = lazy(() => import('./pages/admin/DemoRequests'));
const TutorManagement = lazy(() => import('./pages/admin/TutorManagement'));
const Assignments = lazy(() => import('./pages/admin/Assignments'));
const ContactMessages = lazy(() => import('./pages/admin/ContactMessages'));
const MembershipManagement = lazy(() => import('./pages/admin/MembershipManagement'));
const Notifications = lazy(() => import('./pages/admin/Notifications'));
const Payments = lazy(() => import('./pages/admin/Payments'));
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings'));

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-secondary rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-400 text-sm font-medium">Loading...</p>
      </div>
    </div>
  );
}

function Layout({ children, hideNavFooter }) {
  return (
    <div className="min-h-screen bg-white">
      {!hideNavFooter && <Navbar />}
      <main>{children}</main>
      {!hideNavFooter && <Footer />}
      <WhatsAppButton />
      <ScrollToTop />
    </div>
  );
}

export default function App() {
  useEffect(() => {
    createChat({
      webhookUrl: 'https://sanumaurya4tech.app.n8n.cloud/webhook/37bd7585-f6cd-4f06-a30a-66fe7334511e/chat',
      enableStreaming: true
    });
  }, []);

  return (
    <AuthProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#061B45',
            color: '#fff',
            borderRadius: '12px',
            padding: '16px',
            fontSize: '14px',
          },
          success: {
            iconTheme: { primary: '#FFD700', secondary: '#061B45' },
          },
          error: {
            iconTheme: { primary: '#ff4444', secondary: '#fff' },
            style: { background: '#ff4444', color: '#fff' },
          },
        }}
      />
      <ScrollToTopOnNavigate />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Layout><HomePage /></Layout>} />
          <Route path="/terms" element={<Layout><TermsAndConditions /></Layout>} />
          <Route path="/privacy" element={<Layout><PrivacyPolicy /></Layout>} />
          <Route path="/refund" element={<Layout><RefundPolicy /></Layout>} />
          <Route path="/register" element={<Layout><TutorRegistration /></Layout>} />
          <Route path="/membership" element={<Layout><MembershipPlans /></Layout>} />
          <Route path="/dashboard" element={<Layout hideNavFooter><TutorDashboard /></Layout>} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<ProtectedRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="demo-requests" element={<DemoRequests />} />
              <Route path="tutors" element={<TutorManagement />} />
              <Route path="assignments" element={<Assignments />} />
              <Route path="contacts" element={<ContactMessages />} />
              <Route path="memberships" element={<MembershipManagement />} />
              <Route path="notifications" element={<Notifications />} />
              <Route path="payments" element={<Payments />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>
          </Route>
        </Routes>
      </Suspense>
    </AuthProvider>
  );
}

