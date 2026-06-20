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

// Lazy load pages
const HomePage = lazy(() => import('./pages/HomePage'));
const TermsAndConditions = lazy(() => import('./pages/TermsAndConditions'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const RefundPolicy = lazy(() => import('./pages/RefundPolicy'));
const TutorRegistration = lazy(() => import('./pages/TutorRegistration'));
const MembershipPlans = lazy(() => import('./pages/MembershipPlans'));
const TutorDashboard = lazy(() => import('./pages/TutorDashboard'));

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
    // Remove any existing n8n-chat container to avoid duplicates (React StrictMode double-mounts)
    const existingChat = document.getElementById('n8n-chat');
    if (existingChat) {
      existingChat.remove();
    }

    const chatApp = createChat({
      webhookUrl: 'https://sanumaurya4tech.app.n8n.cloud/webhook/37bd7585-f6cd-4f06-a30a-66fe7334511e/chat',
      enableStreaming: false
    });

    return () => {
      // Cleanup on unmount
      chatApp?.unmount?.();
      const chatEl = document.getElementById('n8n-chat');
      if (chatEl) {
        chatEl.remove();
      }
    };
  }, []);

  return (
    <>
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
          <Route path="/" element={<Layout><HomePage /></Layout>} />
          <Route path="/terms" element={<Layout><TermsAndConditions /></Layout>} />
          <Route path="/privacy" element={<Layout><PrivacyPolicy /></Layout>} />
          <Route path="/refund" element={<Layout><RefundPolicy /></Layout>} />
          <Route path="/register" element={<Layout><TutorRegistration /></Layout>} />
          <Route path="/membership" element={<Layout><MembershipPlans /></Layout>} />
          <Route path="/dashboard" element={<Layout hideNavFooter><TutorDashboard /></Layout>} />
        </Routes>
      </Suspense>
    </>
  );
}
