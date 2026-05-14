import { GraduationCap, Phone, Mail, MapPin, Globe, Camera, MessageSquare, Play, ArrowRight } from 'lucide-react';

const quickLinks = [
  { name: 'Home', href: '#home' },
  { name: 'About Us', href: '#about' },
  { name: 'Services', href: '#services' },
  { name: 'Find Tutor', href: '#find-tutor' },
  { name: 'Become Tutor', href: '#become-tutor' },
  { name: 'Contact', href: '#contact' },
];

const serviceLinks = [
  'Home Tuition',
  'Online Classes',
  'Competitive Exams',
  'School Coaching',
  'Language Courses',
  'Skill Development',
];

const socialLinks = [
  { icon: Globe, href: '#', label: 'Facebook' },
  { icon: Camera, href: '#', label: 'Instagram' },
  { icon: MessageSquare, href: '#', label: 'Twitter' },
  { icon: Play, href: '#', label: 'YouTube' },
];

export default function Footer() {
  const handleClick = (e, href) => {
    e.preventDefault();
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-primary-dark text-white relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/3 w-64 h-64 bg-secondary/3 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Main Footer */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 py-16">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-primary" />
              </div>
              <div>
                <span className="font-bold text-lg leading-tight block">Alpha</span>
                <span className="text-secondary text-xs font-semibold tracking-wider">HOME TUITION</span>
              </div>
            </div>
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
              {quickLinks.map((link, i) => (
                <li key={i}>
                  <a href={link.href} onClick={(e) => handleClick(e, link.href)} className="text-white/50 hover:text-secondary text-sm flex items-center gap-2 transition-colors group">
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">Services</h3>
            <ul className="space-y-3">
              {serviceLinks.map((name, i) => (
                <li key={i}>
                  <span className="text-white/50 text-sm flex items-center gap-2">
                    <ArrowRight className="w-3 h-3" />
                    {name}
                  </span>
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
                  <p>7484934920</p>
                  <p>9142283996</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-secondary flex-shrink-0 mt-0.5" />
                <p className="text-white/50 text-sm">info@alphahometuition.com</p>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-secondary flex-shrink-0 mt-0.5" />
                <p className="text-white/50 text-sm">Alpha Home Tuition, Bihar, India</p>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/40 text-sm text-center">
            &copy; 2025 Alpha Home Tuition. All Rights Reserved.
          </p>
          <p className="text-white/30 text-xs">
            From Learning to Leading...
          </p>
        </div>
      </div>
    </footer>
  );
}
