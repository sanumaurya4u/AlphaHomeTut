import { useEffect, useRef } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

const COLOR_MAP = {
  blue: {
    bg: 'bg-blue-50',
    icon: 'bg-blue-500',
    text: 'text-blue-600',
  },
  green: {
    bg: 'bg-green-50',
    icon: 'bg-green-500',
    text: 'text-green-600',
  },
  yellow: {
    bg: 'bg-yellow-50',
    icon: 'bg-yellow-500',
    text: 'text-yellow-600',
  },
  purple: {
    bg: 'bg-purple-50',
    icon: 'bg-purple-500',
    text: 'text-purple-600',
  },
  red: {
    bg: 'bg-red-50',
    icon: 'bg-red-500',
    text: 'text-red-600',
  },
  orange: {
    bg: 'bg-orange-50',
    icon: 'bg-orange-500',
    text: 'text-orange-600',
  },
};

function AnimatedNumber({ value }) {
  const ref = useRef(null);
  const numericValue = typeof value === 'number' ? value : parseFloat(value) || 0;

  const spring = useSpring(0, {
    mass: 1,
    stiffness: 75,
    damping: 15,
  });

  const display = useTransform(spring, (current) =>
    Math.round(current).toLocaleString()
  );

  useEffect(() => {
    spring.set(numericValue);
  }, [spring, numericValue]);

  useEffect(() => {
    const unsubscribe = display.on('change', (latest) => {
      if (ref.current) {
        ref.current.textContent = latest;
      }
    });
    return unsubscribe;
  }, [display]);

  return <span ref={ref}>0</span>;
}

export default function StatsCard({
  title,
  value,
  icon: Icon,
  trend,
  trendLabel,
  color = 'blue',
}) {
  const colors = COLOR_MAP[color] || COLOR_MAP.blue;
  const isPositive = trend > 0;
  const TrendIcon = isPositive ? TrendingUp : TrendingDown;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className="glass-light rounded-xl p-5 cursor-default"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-500 truncate">{title}</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            <AnimatedNumber value={value} />
          </p>
        </div>
        <div
          className={`flex-shrink-0 w-12 h-12 rounded-lg ${colors.icon} flex items-center justify-center`}
        >
          {Icon && <Icon className="w-6 h-6 text-white" />}
        </div>
      </div>

      {trend !== undefined && trend !== null && (
        <div className="mt-3 flex items-center gap-1.5">
          <span
            className={`inline-flex items-center gap-0.5 text-xs font-semibold ${
              isPositive ? 'text-green-600' : 'text-red-600'
            }`}
          >
            <TrendIcon className="w-3.5 h-3.5" />
            {Math.abs(trend)}%
          </span>
          {trendLabel && (
            <span className="text-xs text-gray-400">{trendLabel}</span>
          )}
        </div>
      )}
    </motion.div>
  );
}
