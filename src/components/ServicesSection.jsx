import { motion } from 'framer-motion';
import { services } from '../data/services';

export default function ServicesSection() {
  return (
    <section id="services" className="py-20 md:py-28 gradient-animated relative overflow-hidden">
      {/* Decorative */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-64 h-64 bg-secondary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-secondary/8 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-secondary font-semibold text-sm uppercase tracking-widest">
            Our Services
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mt-3 mb-6">
            What We <span className="gradient-text">Offer</span>
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto text-lg">
            Comprehensive educational services tailored to meet every student&apos;s unique learning needs.
          </p>
        </motion.div>

        {/* Cards Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, i) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group"
            >
              <div className="glass rounded-2xl p-8 h-full card-hover hover:border-secondary/30 transition-all">
                <div className="w-14 h-14 bg-secondary/15 group-hover:bg-secondary/25 rounded-xl flex items-center justify-center mb-5 transition-all group-hover:scale-110">
                  <service.icon className="w-7 h-7 text-secondary" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-secondary transition-colors">
                  {service.title}
                </h3>
                <p className="text-white/55 leading-relaxed text-sm">
                  {service.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
