import ContactSection from '../components/ContactSection';

export default function ContactPage() {
  const isDashboard = window.location.pathname.includes('/dashboard');
  return (
    <div className={isDashboard ? "" : "pt-20"}>
      <ContactSection />
    </div>
  );
}
