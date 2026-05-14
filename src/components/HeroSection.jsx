import { motion } from 'framer-motion';
import { Search, UserPlus, GraduationCap, Users, BookOpen } from 'lucide-react';
import heroBanner from '../assets/hero-banner.jpg';

const heroStats = [
  { icon: GraduationCap, value: '500+', label: 'Tutors' },
  { icon: Users, value: '1000+', label: 'Students' },
  { icon: BookOpen, value: '50+', label: 'Subjects' },
];

export default function HeroSection() {
  const handleNavClick = (e, href) => {
    e.preventDefault();
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroBanner}
          alt="Alpha Home Tuition Banner"
          className="w-full h-full object-cover"
        />
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary-dark/95 via-primary/90 to-primary-dark/80" />
        {/* Decorative elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 right-10 w-72 h-72 bg-secondary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-10 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
        <div className="max-w-3xl">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-secondary/15 border border-secondary/30 text-secondary px-4 py-2 rounded-full text-sm font-medium mb-6"
          >
            <span className="w-2 h-2 bg-secondary rounded-full animate-pulse" />
            Trusted by 1000+ Students & Parents
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6"
          >
            Best Home Tuition{' '}
            <span className="gradient-text">Service</span> For Every{' '}
            <span className="gradient-text">Student</span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="text-lg sm:text-xl text-white/70 mb-8 max-w-2xl leading-relaxed"
          >
            Find experienced tutors for all classes and subjects at your
            doorstep. Personalized learning that delivers real results.
          </motion.p>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="flex flex-wrap gap-4 mb-12"
          >
            <a
              href="#find-tutor"
              onClick={(e) => handleNavClick(e, '#find-tutor')}
              className="inline-flex items-center gap-2 bg-secondary text-primary font-bold px-8 py-4 rounded-full text-base hover:bg-secondary-light transition-all hover:shadow-xl hover:shadow-secondary/25 hover:-translate-y-0.5 pulse-glow"
            >
              <Search className="w-5 h-5" />
              Find Tutor
            </a>
            <a
              href="#become-tutor"
              onClick={(e) => handleNavClick(e, '#become-tutor')}
              className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white font-semibold px-8 py-4 rounded-full text-base hover:bg-white/20 transition-all hover:-translate-y-0.5 backdrop-blur-sm"
            >
              <UserPlus className="w-5 h-5" />
              Become Tutor
            </a>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.8 }}
            className="flex flex-wrap gap-6 md:gap-10"
          >
            {heroStats.map((stat, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-12 h-12 bg-secondary/15 rounded-xl flex items-center justify-center border border-secondary/20">
                  <stat.icon className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-white/50 text-sm">{stat.label}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
    </section>
  );
}
