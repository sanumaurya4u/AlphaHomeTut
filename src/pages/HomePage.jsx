import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, GraduationCap, ShieldAlert } from 'lucide-react';

/* ═══════════════════════════════════════════════════════
   Background & Particles (from HeroSection)
   ═══════════════════════════════════════════════════════ */
const particles = Array.from({ length: 30 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 3 + 1,
  delay: Math.random() * 8,
  duration: Math.random() * 6 + 4,
  opacity: Math.random() * 0.4 + 0.15,
}));

function ParticleField() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <div
          key={p.id}
          className="hero-particle"
          style={{
            left: `${p.x}%`, top: `${p.y}%`,
            width: p.size, height: p.size,
            animationDelay: `${p.delay}s`, animationDuration: `${p.duration}s`,
            opacity: p.opacity,
          }}
        />
      ))}
    </div>
  );
}

function GridFloor() {
  return (
    <div className="hero-grid-floor pointer-events-none">
      <div className="hero-grid-inner" />
    </div>
  );
}

function MouseGlow() {
  const glowRef = useRef(null);
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (glowRef.current) {
        const rect = glowRef.current.parentElement.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        glowRef.current.style.background = `radial-gradient(600px circle at ${x}px ${y}px, rgba(255,215,0,0.08), transparent 50%)`;
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  return <div ref={glowRef} className="absolute inset-0 z-[1] pointer-events-none transition-all duration-300" />;
}

/* ═══════════════════════════════════════════════════════
   Main HomePage
   ═══════════════════════════════════════════════════════ */

const portals = [
  {
    title: 'Student / Parent',
    description: 'Find your perfect tutor for personalized learning at home.',
    icon: Users,
    color: 'text-emerald-400',
    bgLight: 'bg-emerald-400/10',
    border: 'border-emerald-400/30',
    hoverBorder: 'group-hover:border-emerald-400/60',
    shadow: 'hover:shadow-emerald-400/20',
    link: '/student',
    buttonText: 'Enter as Student',
    buttonClass: 'bg-emerald-500 hover:bg-emerald-400 text-white',
  },
  {
    title: 'Tutor',
    description: 'Manage your tutoring career, apply for jobs, and track earnings.',
    icon: GraduationCap,
    color: 'text-secondary', // Gold
    bgLight: 'bg-secondary/10',
    border: 'border-secondary/30',
    hoverBorder: 'group-hover:border-secondary/60',
    shadow: 'hover:shadow-secondary/20',
    link: '/tutor/login',
    buttonText: 'Enter as Tutor',
    buttonClass: 'bg-secondary hover:bg-secondary-light text-primary font-bold',
  },
  {
    title: 'Admin',
    description: 'Manage the platform, users, assignments, and payments.',
    icon: ShieldAlert,
    color: 'text-purple-400',
    bgLight: 'bg-purple-400/10',
    border: 'border-purple-400/30',
    hoverBorder: 'group-hover:border-purple-400/60',
    shadow: 'hover:shadow-purple-400/20',
    link: '/admin/login',
    buttonText: 'Enter as Admin',
    buttonClass: 'bg-purple-500 hover:bg-purple-400 text-white',
  }
];

export default function HomePage() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-primary-dark">
      {/* === Animated Background === */}
      <div className="absolute inset-0 hero-bg-base pointer-events-none">
        <div className="hero-gradient-mesh" />
        <GridFloor />
        <ParticleField />

        {/* Orbital rings */}
        <div className="hero-orbital hero-orbital-1" />
        <div className="hero-orbital hero-orbital-2" />
        <div className="hero-orbital hero-orbital-3" />

        <MouseGlow />

        {/* Ambient glow orbs */}
        <div className="absolute top-[10%] right-[15%] w-80 h-80 bg-secondary/8 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-[20%] left-[5%] w-96 h-96 bg-blue-500/6 rounded-full blur-[120px] hero-breathe" />
        <div className="absolute top-[50%] right-[40%] w-64 h-64 bg-purple-500/5 rounded-full blur-[80px] hero-breathe-alt" />
      </div>

      {/* === Content === */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 w-full">
        
        <div className="text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center justify-center p-3 bg-white/10 rounded-2xl backdrop-blur-md border border-white/20 mb-6 shadow-xl"
          >
            <img src="/AHT-logo.svg" alt="AlphaHomeTut Logo" className="h-14 w-14 object-contain rounded-xl" />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight mb-4"
          >
            Alpha<span className="text-secondary">Home</span>Tut
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-white/70 max-w-2xl mx-auto"
          >
            Select your portal to continue. Quality education and seamless management, all in one platform.
          </motion.p>
        </div>

        {/* Portals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {portals.map((portal, index) => (
            <motion.div
              key={portal.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
            >
              <Link 
                to={portal.link}
                className={`group block h-full p-8 rounded-3xl bg-white/5 backdrop-blur-xl border ${portal.border} ${portal.hoverBorder} transition-all duration-300 hover:-translate-y-2 ${portal.shadow} shadow-lg`}
              >
                <div className={`w-16 h-16 rounded-2xl ${portal.bgLight} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-white/10`}>
                  <portal.icon className={`w-8 h-8 ${portal.color}`} />
                </div>
                
                <h2 className="text-2xl font-bold text-white mb-3 group-hover:text-white/90 transition-colors">
                  {portal.title}
                </h2>
                
                <p className="text-white/60 text-sm leading-relaxed mb-8 h-12">
                  {portal.description}
                </p>

                <div className={`w-full py-3 px-4 rounded-xl text-center font-semibold text-sm transition-all duration-300 shadow-md ${portal.buttonClass}`}>
                  {portal.buttonText}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
