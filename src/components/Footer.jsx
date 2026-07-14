import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Globe, Camera, MessageSquare, Play, ArrowRight } from 'lucide-react';

const quickLinks = [
  { name: 'Home', route: '/' },
  { name: 'About Us', route: '/#about' },
  { name: 'Services', route: '/#services' },
  { name: 'Find Tutor', route: '/#find-tutor' },
  { name: 'Become Tutor', route: '/#become-tutor' },
  { name: 'Contact', route: '/#contact' },
];

const tutorLinks = [
  { name: 'Register as Tutor', route: '/register' },
  { name: 'Membership Plans', route: '/membership' },
  { name: 'Tutor Dashboard', route: '/dashboard' },
];

const legalLinks = [
  { name: 'Terms & Conditions', route: '/terms' },
  { name: 'Privacy Policy', route: '/privacy' },
  { name: 'Refund Policy', route: '/refund' },
];

const socialLinks = [
  { icon: Globe, href: '#', label: 'Facebook' },
  { icon: Camera, href: '#', label: 'Instagram' },
  { icon: MessageSquare, href: '#', label: 'Twitter' },
  { icon: Play, href: '#', label: 'YouTube' },
];

export default function Footer({ hideTutorOptions = false, hideStudentOptions = false, isDashboard = false }) {
  let filteredQuickLinks = quickLinks;
  if (hideTutorOptions) {
    filteredQuickLinks = quickLinks.filter((link) => link.name !== 'Become Tutor');
  } else if (hideStudentOptions) {
    filteredQuickLinks = quickLinks.filter((link) => link.name !== 'Find Tutor' && link.name !== 'Become Tutor');
  }

  const getRoute = (originalRoute) => {
    if (!isDashboard) return originalRoute;
    if (originalRoute.includes('about')) return '?tab=about';
    if (originalRoute.includes('services')) return '?tab=services';
    if (originalRoute.includes('contact')) return '?tab=contact';
    if (originalRoute.includes('terms')) return '?tab=terms';
    if (originalRoute.includes('privacy')) return '?tab=privacy';
    if (originalRoute.includes('refund')) return '?tab=refund';
    if (originalRoute.includes('membership')) return '?tab=membership';
    if (originalRoute.includes('dashboard')) return '?tab=profile';
    if (originalRoute.includes('register')) return '?tab=profile';
    if (originalRoute === '/') return '?tab=profile'; 
    return originalRoute;
  };

  return (
    <footer className="bg-primary-dark text-white relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/3 w-64 h-64 bg-secondary/3 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Main Footer */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-10 py-16">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4 hover:opacity-85 transition-opacity">
              <img src="/AHT-logo.svg" alt="Alpha Home Tuition" className="h-14 w-auto object-contain rounded-xl" />
            </Link>
            <p className="text-white/50 text-sm leading-relaxed mb-6">
              Connecting students with verified tutors for personalized learning at home. Quality education at your doorstep.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((s, i) => (
                <a key={i} href={s.href} aria-label={s.label} className="w-10 h-10 bg-white/5 hover:bg-secondary/20 border border-white/10 hover:border-secondary/30 rounded-lg flex items-center justify-center transition-all hover:-translate-y-1">
                  <s.icon className="w-4 h-4 text-white/70 hover:text-secondary" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">Quick Links</h3>
            <ul className="space-y-3">
              {filteredQuickLinks.map((link, i) => (
                <li key={i}>
                  <Link to={getRoute(link.route)} className="text-white/50 hover:text-secondary text-sm flex items-center gap-2 transition-colors group">
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* For Tutors */}
          <div>
            {!hideTutorOptions && (
              <>
                <h3 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">For Tutors</h3>
                <ul className="space-y-3 mb-8">
                  {tutorLinks.map((link, i) => (
                    <li key={i}>
                      <Link to={getRoute(link.route)} className="text-white/50 hover:text-secondary text-sm flex items-center gap-2 transition-colors group">
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </>
            )}

            <h3 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">Legal</h3>
            <ul className="space-y-3">
              {legalLinks.map((link, i) => (
                <li key={i}>
                  <Link to={getRoute(link.route)} className="text-white/50 hover:text-secondary text-sm flex items-center gap-2 transition-colors group">
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">Contact Info</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-secondary flex-shrink-0 mt-0.5" />
                <div className="text-white/50 text-sm">
                  <p>7295948480</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-secondary flex-shrink-0 mt-0.5" />
                <p className="text-white/50 text-sm">alpha.hometuition4u@gmail.com</p>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-secondary flex-shrink-0 mt-0.5" />
                <p className="text-white/50 text-sm">Alpha Home Tuition Pvt. Ltd.<br />Bihar, India</p>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal Disclaimer */}
        <div className="border-t border-white/10 py-4">
          <p className="text-white/30 text-xs text-center leading-relaxed">
            Alpha Home Tuition Pvt. Ltd. acts as a facilitator between tutors and students. All tutor profiles are verified.
            The company is not directly liable for payment disputes between tutors and guardians.
            All legal disputes fall under the jurisdiction of courts in Patna, Bihar.
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/40 text-sm text-center">
            &copy; {new Date().getFullYear()} Alpha Home Tuition Pvt. Ltd. All Rights Reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link to={getRoute("/terms")} className="text-white/30 hover:text-white/60 text-xs transition-colors">Terms</Link>
            <Link to={getRoute("/privacy")} className="text-white/30 hover:text-white/60 text-xs transition-colors">Privacy</Link>
            <Link to={getRoute("/refund")} className="text-white/30 hover:text-white/60 text-xs transition-colors">Refund</Link>
          </div>
          <p className="text-white/30 text-xs">
            From Learning to Leading...
          </p>
        </div>
      </div>
    </footer>
  );
}
