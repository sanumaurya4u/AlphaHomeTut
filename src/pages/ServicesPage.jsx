import ServicesSection from '../components/ServicesSection';
import HowItWorks from '../components/HowItWorks';

export default function ServicesPage() {
  const isDashboard = window.location.pathname.includes('/dashboard');
  return (
    <div className={isDashboard ? "" : "pt-20"}>
      <ServicesSection />
      <HowItWorks />
    </div>
  );
}
