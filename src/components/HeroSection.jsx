import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, UserPlus, GraduationCap, Users, BookOpen } from 'lucide-react';

const heroStats = [
  { icon: GraduationCap, value: '500+', label: 'Tutors' },
  { icon: Users, value: '1000+', label: 'Students' },
  { icon: BookOpen, value: '50+', label: 'Subjects' },
];

/* ═══════════════════════════════════════════════════════
   SVG Student Objects — clearly visible, glowing outlines
   ═══════════════════════════════════════════════════════ */

function PencilSVG({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g filter="url(#pencilGlow)">
        <rect x="22" y="6" width="14" height="42" rx="2" fill="rgba(255,215,0,0.12)" stroke="rgba(255,215,0,0.6)" strokeWidth="1.5" />
        <polygon points="22,48 36,48 29,60" fill="rgba(255,215,0,0.1)" stroke="rgba(255,215,0,0.5)" strokeWidth="1.5" />
        <rect x="22" y="6" width="14" height="6" rx="1" fill="rgba(255,150,150,0.2)" stroke="rgba(255,150,150,0.5)" strokeWidth="1" />
        <line x1="29" y1="48" x2="29" y2="58" stroke="rgba(255,215,0,0.4)" strokeWidth="1" />
      </g>
      <defs>
        <filter id="pencilGlow"><feGaussianBlur stdDeviation="1.5" /><feComposite in="SourceGraphic" /></filter>
      </defs>
    </svg>
  );
}

function PenSVG({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g filter="url(#penGlow)">
        <path d="M26 8 L34 8 L36 44 L24 44 Z" fill="rgba(100,149,237,0.12)" stroke="rgba(100,149,237,0.6)" strokeWidth="1.5" />
        <polygon points="24,44 36,44 30,58" fill="rgba(100,149,237,0.1)" stroke="rgba(100,149,237,0.5)" strokeWidth="1.5" />
        <path d="M26 8 Q30 2 34 8" fill="rgba(100,149,237,0.15)" stroke="rgba(100,149,237,0.5)" strokeWidth="1.2" />
        <rect x="23" y="20" width="14" height="5" rx="1" fill="rgba(255,215,0,0.15)" stroke="rgba(255,215,0,0.4)" strokeWidth="1" />
      </g>
      <defs>
        <filter id="penGlow"><feGaussianBlur stdDeviation="1.5" /><feComposite in="SourceGraphic" /></filter>
      </defs>
    </svg>
  );
}

function BookSVG({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g filter="url(#bookGlow)">
        <path d="M10 12 Q10 8 14 8 L30 8 L30 52 L14 52 Q10 52 10 48 Z" fill="rgba(255,215,0,0.1)" stroke="rgba(255,215,0,0.55)" strokeWidth="1.5" />
        <path d="M54 12 Q54 8 50 8 L34 8 L34 52 L50 52 Q54 52 54 48 Z" fill="rgba(255,215,0,0.08)" stroke="rgba(255,215,0,0.55)" strokeWidth="1.5" />
        <path d="M30 8 L32 6 L34 8 L34 52 L32 54 L30 52 Z" fill="rgba(255,215,0,0.15)" stroke="rgba(255,215,0,0.4)" strokeWidth="1" />
        <line x1="16" y1="16" x2="26" y2="16" stroke="rgba(255,215,0,0.35)" strokeWidth="1" />
        <line x1="16" y1="22" x2="26" y2="22" stroke="rgba(255,215,0,0.25)" strokeWidth="1" />
        <line x1="16" y1="28" x2="24" y2="28" stroke="rgba(255,215,0,0.25)" strokeWidth="1" />
        <line x1="38" y1="16" x2="48" y2="16" stroke="rgba(255,215,0,0.35)" strokeWidth="1" />
        <line x1="38" y1="22" x2="48" y2="22" stroke="rgba(255,215,0,0.25)" strokeWidth="1" />
      </g>
      <defs>
        <filter id="bookGlow"><feGaussianBlur stdDeviation="1.5" /><feComposite in="SourceGraphic" /></filter>
      </defs>
    </svg>
  );
}

function RulerSVG({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g filter="url(#rulerGlow)">
        <rect x="8" y="24" width="48" height="16" rx="2" fill="rgba(255,215,0,0.08)" stroke="rgba(255,215,0,0.55)" strokeWidth="1.5" />
        {[12, 18, 24, 30, 36, 42, 48].map((x, i) => (
          <line key={i} x1={x} y1="24" x2={x} y2={i % 2 === 0 ? 34 : 30} stroke="rgba(255,215,0,0.45)" strokeWidth="1" />
        ))}
      </g>
      <defs>
        <filter id="rulerGlow"><feGaussianBlur stdDeviation="1.5" /><feComposite in="SourceGraphic" /></filter>
      </defs>
    </svg>
  );
}

function CalculatorSVG({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g filter="url(#calcGlow)">
        <rect x="14" y="6" width="36" height="52" rx="4" fill="rgba(99,102,241,0.1)" stroke="rgba(99,102,241,0.55)" strokeWidth="1.5" />
        <rect x="18" y="12" width="28" height="12" rx="2" fill="rgba(100,200,150,0.12)" stroke="rgba(100,200,150,0.5)" strokeWidth="1" />
        {[0, 1, 2].map(row =>
          [0, 1, 2].map(col => (
            <rect key={`${row}-${col}`} x={20 + col * 10} y={30 + row * 9} width="7" height="6" rx="1.5"
              fill="rgba(255,215,0,0.08)" stroke="rgba(255,215,0,0.4)" strokeWidth="0.8" />
          ))
        )}
      </g>
      <defs>
        <filter id="calcGlow"><feGaussianBlur stdDeviation="1.5" /><feComposite in="SourceGraphic" /></filter>
      </defs>
    </svg>
  );
}

function GradCapSVG({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g filter="url(#capGlow)">
        <polygon points="32,10 58,24 32,38 6,24" fill="rgba(255,215,0,0.1)" stroke="rgba(255,215,0,0.6)" strokeWidth="1.5" />
        <path d="M16 28 L16 42 Q24 50 32 50 Q40 50 48 42 L48 28" fill="none" stroke="rgba(255,215,0,0.45)" strokeWidth="1.5" />
        <line x1="52" y1="24" x2="52" y2="46" stroke="rgba(255,215,0,0.5)" strokeWidth="1.5" />
        <circle cx="52" cy="48" r="2.5" fill="rgba(255,215,0,0.15)" stroke="rgba(255,215,0,0.5)" strokeWidth="1" />
      </g>
      <defs>
        <filter id="capGlow"><feGaussianBlur stdDeviation="1.5" /><feComposite in="SourceGraphic" /></filter>
      </defs>
    </svg>
  );
}

function LightbulbSVG({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g filter="url(#bulbGlow)">
        <path d="M32 8 Q48 8 48 28 Q48 38 38 42 L38 48 L26 48 L26 42 Q16 38 16 28 Q16 8 32 8 Z"
          fill="rgba(255,215,0,0.1)" stroke="rgba(255,215,0,0.6)" strokeWidth="1.5" />
        <rect x="26" y="48" width="12" height="4" rx="1" fill="rgba(255,215,0,0.08)" stroke="rgba(255,215,0,0.4)" strokeWidth="1" />
        <rect x="28" y="52" width="8" height="3" rx="1.5" fill="rgba(255,215,0,0.08)" stroke="rgba(255,215,0,0.4)" strokeWidth="1" />
        <line x1="32" y1="18" x2="32" y2="34" stroke="rgba(255,215,0,0.3)" strokeWidth="1" />
        <line x1="26" y1="24" x2="32" y2="30" stroke="rgba(255,215,0,0.25)" strokeWidth="1" />
        <line x1="38" y1="24" x2="32" y2="30" stroke="rgba(255,215,0,0.25)" strokeWidth="1" />
      </g>
      <defs>
        <filter id="bulbGlow"><feGaussianBlur stdDeviation="2" /><feComposite in="SourceGraphic" /></filter>
      </defs>
    </svg>
  );
}

function GlobeSVG({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g filter="url(#globeGlow)">
        <circle cx="32" cy="32" r="22" fill="rgba(100,149,237,0.08)" stroke="rgba(100,149,237,0.55)" strokeWidth="1.5" />
        <ellipse cx="32" cy="32" rx="10" ry="22" fill="none" stroke="rgba(100,149,237,0.35)" strokeWidth="1" />
        <line x1="10" y1="24" x2="54" y2="24" stroke="rgba(100,149,237,0.25)" strokeWidth="0.8" />
        <line x1="10" y1="40" x2="54" y2="40" stroke="rgba(100,149,237,0.25)" strokeWidth="0.8" />
        <line x1="32" y1="10" x2="32" y2="54" stroke="rgba(100,149,237,0.2)" strokeWidth="0.8" />
      </g>
      <defs>
        <filter id="globeGlow"><feGaussianBlur stdDeviation="1.5" /><feComposite in="SourceGraphic" /></filter>
      </defs>
    </svg>
  );
}

function AtomSVG({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g filter="url(#atomGlow)">
        <circle cx="32" cy="32" r="4" fill="rgba(255,215,0,0.3)" stroke="rgba(255,215,0,0.6)" strokeWidth="1.5" />
        <ellipse cx="32" cy="32" rx="24" ry="10" fill="none" stroke="rgba(255,215,0,0.4)" strokeWidth="1.2" transform="rotate(0 32 32)" />
        <ellipse cx="32" cy="32" rx="24" ry="10" fill="none" stroke="rgba(100,149,237,0.35)" strokeWidth="1.2" transform="rotate(60 32 32)" />
        <ellipse cx="32" cy="32" rx="24" ry="10" fill="none" stroke="rgba(167,139,250,0.35)" strokeWidth="1.2" transform="rotate(120 32 32)" />
      </g>
      <defs>
        <filter id="atomGlow"><feGaussianBlur stdDeviation="1.5" /><feComposite in="SourceGraphic" /></filter>
      </defs>
    </svg>
  );
}

function TriangleRulerSVG({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g filter="url(#triGlow)">
        <polygon points="8,54 56,54 8,10" fill="rgba(255,215,0,0.07)" stroke="rgba(255,215,0,0.5)" strokeWidth="1.5" />
        <polygon points="16,54 40,54 16,28" fill="none" stroke="rgba(255,215,0,0.25)" strokeWidth="0.8" />
        {[20, 26, 32, 38, 44, 50].map((x, i) => (
          <line key={i} x1={x} y1="54" x2={x} y2="50" stroke="rgba(255,215,0,0.35)" strokeWidth="0.8" />
        ))}
      </g>
      <defs>
        <filter id="triGlow"><feGaussianBlur stdDeviation="1.5" /><feComposite in="SourceGraphic" /></filter>
      </defs>
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════
   Object component map and floating positions
   ═══════════════════════════════════════════════════════ */

const svgComponents = {
  pencil: PencilSVG,
  pen: PenSVG,
  book: BookSVG,
  ruler: RulerSVG,
  calculator: CalculatorSVG,
  gradcap: GradCapSVG,
  lightbulb: LightbulbSVG,
  globe: GlobeSVG,
  atom: AtomSVG,
  triangleruler: TriangleRulerSVG,
};

// Floating education objects — positioned to avoid overlapping text (left side)
const eduObjects = [
  // Right side (clearly visible, larger)
  { type: 'pencil',        size: 72,  x: '78%', y: '12%',  delay: 0,   duration: 18, rotate: -15 },
  { type: 'book',          size: 80,  x: '68%', y: '40%',  delay: 2,   duration: 22, rotate: 8   },
  { type: 'gradcap',       size: 75,  x: '85%', y: '28%',  delay: 1,   duration: 20, rotate: -5  },
  { type: 'calculator',    size: 65,  x: '72%', y: '65%',  delay: 3.5, duration: 24, rotate: 12  },
  { type: 'atom',          size: 70,  x: '88%', y: '55%',  delay: 5,   duration: 26, rotate: 0   },
  { type: 'globe',         size: 68,  x: '62%', y: '78%',  delay: 4,   duration: 21, rotate: 10  },
  // Left side (smaller, behind content area boundaries)
  { type: 'pen',           size: 55,  x: '5%',  y: '15%',  delay: 1.5, duration: 19, rotate: 20  },
  { type: 'ruler',         size: 60,  x: '8%',  y: '60%',  delay: 6,   duration: 25, rotate: -25 },
  { type: 'lightbulb',     size: 58,  x: '15%', y: '38%',  delay: 3,   duration: 17, rotate: 5   },
  { type: 'triangleruler', size: 55,  x: '12%', y: '80%',  delay: 7,   duration: 23, rotate: -10 },
];

// Geometric shapes (kept but reduced — accent only)
const shapes = [
  { type: 'cube',    size: 35, x: '55%', y: '20%', delay: 0, duration: 20 },
  { type: 'ring',    size: 50, x: '92%', y: '75%', delay: 1, duration: 28 },
  { type: 'sphere',  size: 28, x: '48%', y: '85%', delay: 4, duration: 22 },
  { type: 'pyramid', size: 30, x: '95%', y: '15%', delay: 2, duration: 18 },
];

// Particles
const particles = Array.from({ length: 30 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 3 + 1,
  delay: Math.random() * 8,
  duration: Math.random() * 6 + 4,
  opacity: Math.random() * 0.4 + 0.15,
}));

/* ═══════════════════════════════════════════════════════
   Sub-components
   ═══════════════════════════════════════════════════════ */

function FloatingEduObject({ type, size, x, y, delay, duration, rotate }) {
  const SvgComp = svgComponents[type];
  if (!SvgComp) return null;
  return (
    <div
      className="edu-float-object"
      style={{
        left: x,
        top: y,
        animationDelay: `${delay}s`,
        animationDuration: `${duration}s`,
        '--init-rotate': `${rotate}deg`,
      }}
    >
      <div className="edu-float-inner" style={{ animationDuration: `${duration * 1.5}s`, animationDelay: `${delay}s` }}>
        <SvgComp size={size} />
      </div>
    </div>
  );
}

function Shape3D({ type, size, x, y, delay, duration }) {
  return (
    <div
      className="hero-3d-shape"
      style={{ left: x, top: y, animationDelay: `${delay}s`, animationDuration: `${duration}s` }}
    >
      <div className={`hero-shape-inner hero-shape-${type}`} style={{ width: size, height: size }} />
    </div>
  );
}

function ParticleField() {
  return (
    <div className="absolute inset-0 overflow-hidden">
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
    <div className="hero-grid-floor">
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
   Main HeroSection
   ═══════════════════════════════════════════════════════ */

export default function HeroSection() {

  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden">
      {/* === 3D Animated Background === */}
      <div className="absolute inset-0 hero-bg-base">
        <div className="hero-gradient-mesh" />
        <GridFloor />

        {/* Floating education objects */}
        {eduObjects.map((obj, i) => (
          <FloatingEduObject key={`edu-${i}`} {...obj} />
        ))}

        {/* Accent geometric shapes */}
        {shapes.map((shape, i) => (
          <Shape3D key={`shape-${i}`} {...shape} />
        ))}

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
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
        <div className="max-w-3xl">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-white/5 border border-white/10 backdrop-blur-md text-secondary px-5 py-2.5 rounded-full text-sm font-medium mb-6 shadow-lg shadow-secondary/5"
          >
            <span className="w-2 h-2 bg-secondary rounded-full animate-pulse" />
            Quality Education at Your Doorstep
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white leading-tight mb-6"
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
            className="text-lg sm:text-xl text-white/60 mb-10 max-w-2xl leading-relaxed"
          >
            Find experienced tutors for all classes and subjects at your
            doorstep. Personalized learning that delivers real results.
          </motion.p>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="flex flex-wrap gap-4 mb-14"
          >
            <Link
              to="/find-tutor"
              className="inline-flex items-center gap-2 bg-secondary text-primary font-bold px-8 py-4 rounded-full text-base hover:bg-secondary-light transition-all hover:shadow-xl hover:shadow-secondary/25 hover:-translate-y-0.5 pulse-glow"
            >
              <Search className="w-5 h-5" />
              Find Tutor
            </Link>

          </motion.div>

          {/* Stats removed for now until real data is available */}
          <div className="mb-20" />
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white via-white/50 to-transparent z-10" />
    </section>
  );
}
