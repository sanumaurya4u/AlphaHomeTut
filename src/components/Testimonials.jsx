import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { testimonials } from '../data/testimonials';

export default function Testimonials() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);

  const paginate = (dir) => {
    setDirection(dir);
    setCurrent((prev) => (prev + dir + testimonials.length) % testimonials.length);
  };

  const variants = {
    enter: (d) => ({ x: d > 0 ? 300 : -300, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d) => ({ x: d < 0 ? 300 : -300, opacity: 0 }),
  };

  // Show 3 cards on desktop, 1 on mobile
  const getVisibleTestimonials = () => {
    const result = [];
    for (let i = 0; i < 3; i++) {
      result.push(testimonials[(current + i) % testimonials.length]);
    }
    return result;
  };

  return (
    <section id="testimonials" className="py-20 md:py-28 bg-gray-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-secondary-dark font-semibold text-sm uppercase tracking-widest">Testimonials</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary mt-3 mb-4">
            What Our <span className="gradient-text">Students Say</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Real stories from real students and parents who trust Alpha Home Tuition.
          </p>
        </motion.div>

        {/* Desktop Grid */}
        <div className="hidden md:grid md:grid-cols-3 gap-6 mb-8">
          {getVisibleTestimonials().map((t, i) => (
            <motion.div
              key={`${t.id}-${current}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 card-hover relative"
            >
              <Quote className="absolute top-6 right-6 w-8 h-8 text-secondary/20" />
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {t.avatar}
                </div>
                <div>
                  <p className="font-bold text-primary">{t.name}</p>
                  <p className="text-gray-500 text-sm">{t.role}</p>
                </div>
              </div>
              <div className="flex gap-1 mb-3">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} className={`w-4 h-4 ${j < t.rating ? 'text-secondary fill-secondary' : 'text-gray-300'}`} />
                ))}
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">{t.feedback}</p>
            </motion.div>
          ))}
        </div>

        {/* Mobile Slider */}
        <div className="md:hidden relative">
          <div className="overflow-hidden rounded-2xl">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={current}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3 }}
                className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 relative"
              >
                <Quote className="absolute top-6 right-6 w-8 h-8 text-secondary/20" />
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {testimonials[current].avatar}
                  </div>
                  <div>
                    <p className="font-bold text-primary">{testimonials[current].name}</p>
                    <p className="text-gray-500 text-sm">{testimonials[current].role}</p>
                  </div>
                </div>
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className={`w-4 h-4 ${j < testimonials[current].rating ? 'text-secondary fill-secondary' : 'text-gray-300'}`} />
                  ))}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">{testimonials[current].feedback}</p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-center gap-4 mt-8">
          <button onClick={() => paginate(-1)} className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:border-secondary hover:text-secondary transition-colors shadow-sm">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex gap-2">
            {testimonials.map((_, i) => (
              <button key={i} onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i); }}
                className={`w-2.5 h-2.5 rounded-full transition-all ${i === current ? 'bg-secondary w-8' : 'bg-gray-300 hover:bg-gray-400'}`} />
            ))}
          </div>
          <button onClick={() => paginate(1)} className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:border-secondary hover:text-secondary transition-colors shadow-sm">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
