import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { lazy, Suspense } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import ScrollToTop from './components/ScrollToTop';
import ScrollToTopOnNavigate from './components/ScrollToTopOnNavigate';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Lazy load pages
const Login = lazy(() => import('./pages/auth/Login'));
const Signup = lazy(() => import('./pages/auth/Signup'));
const TutorLogin = lazy(() => import('./pages/auth/TutorLogin'));
const TutorRegister = lazy(() => import('./pages/auth/TutorRegister'));
const HomePage = lazy(() => import('./pages/HomePage'));
const StudentHome = lazy(() => import('./pages/StudentHome'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ServicesPage = lazy(() => import('./pages/ServicesPage'));
const FindTutorPage = lazy(() => import('./pages/FindTutorPage'));
const BecomeTutorPage = lazy(() => import('./pages/BecomeTutorPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const TermsAndConditions = lazy(() => import('./pages/TermsAndConditions'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const RefundPolicy = lazy(() => import('./pages/RefundPolicy'));
const TutorRegistration = lazy(() => import('./pages/TutorRegistration'));
const MembershipPlans = lazy(() => import('./pages/MembershipPlans'));
const TutorDashboard = lazy(() => import('./pages/TutorDashboard'));
const AdminLogin = lazy(() => import('./pages/auth/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const ChatBot = lazy(() => import('./components/chatbot/ChatBot'));

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

function Layout({ children, hideNavFooter, hideChatBot, hideTutorOptions }) {
  return (
    <div className="min-h-screen bg-white">
      {!hideNavFooter && <Navbar />}
      <main className={!hideNavFooter ? "pb-20 lg:pb-0" : ""}>{children}</main>
      {!hideNavFooter && <Footer hideTutorOptions={hideTutorOptions} />}
      <WhatsAppButton />
      {!hideChatBot && (
        <Suspense fallback={null}>
          <ChatBot />
        </Suspense>
      )}
      <ScrollToTop />
    </div>
  );
}

export default function App() {
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
          {/* Public auth routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/tutor/login" element={<Layout hideNavFooter><TutorLogin /></Layout>} />
          <Route path="/tutor/register" element={<Layout hideNavFooter><TutorRegister /></Layout>} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/admin/login" element={<Layout hideNavFooter hideChatBot><AdminLogin /></Layout>} />

          {/* Public informational and landing routes */}
          <Route path="/" element={<Layout hideNavFooter><HomePage /></Layout>} />
          <Route path="/student" element={<Layout hideTutorOptions><StudentHome /></Layout>} />
          <Route path="/home" element={<Navigate to="/" replace />} />
          <Route path="/about" element={<Layout><AboutPage /></Layout>} />
          <Route path="/services" element={<Layout><ServicesPage /></Layout>} />
          <Route path="/find-tutor" element={<Layout><FindTutorPage /></Layout>} />
          <Route path="/become-tutor" element={<Layout><BecomeTutorPage /></Layout>} />
          <Route path="/contact" element={<Layout><ContactPage /></Layout>} />
          <Route path="/terms" element={<Layout><TermsAndConditions /></Layout>} />
          <Route path="/privacy" element={<Layout><PrivacyPolicy /></Layout>} />
          <Route path="/refund" element={<Layout><RefundPolicy /></Layout>} />
          <Route path="/register" element={<Layout><TutorRegistration /></Layout>} />
          <Route path="/membership" element={<Layout><MembershipPlans /></Layout>} />

          {/* Protected routes - require login & roles */}
          <Route path="/dashboard" element={<ProtectedRoute requiredRole="tutor"><Layout hideNavFooter><TutorDashboard /></Layout></ProtectedRoute>} />
          <Route path="/admin/dashboard" element={<ProtectedRoute requiredRole="admin"><Layout hideNavFooter hideChatBot><AdminDashboard /></Layout></ProtectedRoute>} />
        </Routes>
      </Suspense>
    </AuthProvider>
  );
}
