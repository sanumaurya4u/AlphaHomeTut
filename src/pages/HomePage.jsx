import HeroSection from '../components/HeroSection';
import AboutSection from '../components/AboutSection';
import ServicesSection from '../components/ServicesSection';
import HowItWorks from '../components/HowItWorks';
import FindTutorForm from '../components/FindTutorForm';
import StatsCounter from '../components/StatsCounter';
import TrustSafety from '../components/TrustSafety';
import TutorRegistrationProcess from '../components/TutorRegistrationProcess';
import DocumentsRequired from '../components/DocumentsRequired';
import ServiceChargeInfo from '../components/ServiceChargeInfo';
import BecomeTutorForm from '../components/BecomeTutorForm';
import SuccessStories from '../components/SuccessStories';
import Testimonials from '../components/Testimonials';
import CompanyPolicies from '../components/CompanyPolicies';
import FAQ from '../components/FAQ';
import ContactSection from '../components/ContactSection';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <HowItWorks />
      <FindTutorForm />
      <StatsCounter />
      <TrustSafety />
      <TutorRegistrationProcess />
      <DocumentsRequired />
      <ServiceChargeInfo />
      <BecomeTutorForm />
      <SuccessStories />
      <Testimonials />
      <CompanyPolicies />
      <FAQ />
      <ContactSection />
    </>
  );
}
