import AboutSection from '../components/AboutSection';
import TrustSafety from '../components/TrustSafety';
import CompanyPolicies from '../components/CompanyPolicies';

export default function AboutPage() {
  const isDashboard = window.location.pathname.includes('/dashboard');
  return (
    <div className={isDashboard ? "" : "pt-20"}>
      <AboutSection />
      <TrustSafety />
      <CompanyPolicies />
    </div>
  );
}
