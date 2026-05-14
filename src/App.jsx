import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import ServicesSection from './components/ServicesSection';
import HowItWorks from './components/HowItWorks';
import FindTutorForm from './components/FindTutorForm';
import BecomeTutorForm from './components/BecomeTutorForm';
import StatsCounter from './components/StatsCounter';
import Testimonials from './components/Testimonials';
import FAQ from './components/FAQ';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import ScrollToTop from './components/ScrollToTop';

export default function App() {
  return (
    <div className="min-h-screen bg-white">
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
      <Navbar />
      <main>
        <HeroSection />
        <AboutSection />
        <ServicesSection />
        <HowItWorks />
        <FindTutorForm />
        <StatsCounter />
        <BecomeTutorForm />
        <Testimonials />
        <FAQ />
        <ContactSection />
      </main>
      <Footer />
      <WhatsAppButton />
      <ScrollToTop />
    </div>
  );
}
