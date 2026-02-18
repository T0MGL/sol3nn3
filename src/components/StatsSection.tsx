import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { fadeInUpView, DURATION } from '@/lib/animations';

interface Stat {
  value: number;
  suffix: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
}

const stats: Stat[] = [
  {
    value: 2847,
    suffix: '+',
    label: 'Clientas Satisfechas',
    description: 'En Paraguay y Latam',
  },
  {
    value: 99,
    suffix: '%',
    label: 'Hidratación Mejorada',
    description: 'En la primer semana',
  },
  {
    value: 4,
    suffix: ' semanas',
    label: 'Transformación Visible',
    description: 'Resultados óptimos',
  },
  {
    value: 30,
    suffix: ' días',
    label: 'Garantía de Dinero',
    description: 'Devolución completa',
  },
];

interface CounterProps {
  from: number;
  to: number;
  duration?: number;
  onComplete?: () => void;
  isVisible: boolean;
}

const Counter: React.FC<CounterProps> = ({ from, to, duration = 2, isVisible }) => {
  const [count, setCount] = useState(from);

  useEffect(() => {
    if (!isVisible) {
      setCount(from);
      return;
    }

    const increment = (to - from) / (duration * 60); // 60 fps
    let currentValue = from;
    const interval = setInterval(() => {
      currentValue += increment;
      if (currentValue >= to) {
        setCount(to);
        clearInterval(interval);
      } else {
        setCount(Math.floor(currentValue));
      }
    }, 1000 / 60);

    return () => clearInterval(interval);
  }, [isVisible, from, to, duration]);

  return <span>{count}</span>;
};

export const StatsSection: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.06,
        delayChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 8 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: DURATION.fast,
      },
    },
  };

  return (
    <section ref={ref} className="relative py-16 md:py-20 lg:py-24 px-4 md:px-8">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-accent/5 to-secondary/5 pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div className="text-center mb-12 md:mb-16" {...fadeInUpView}>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Resultados Probados Científicamente
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Números reales de personas que han transformado su piel
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={containerVariants}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="relative group"
            >
              {/* Card */}
              <div
                className={cn(
                  'p-8 rounded-xl text-center',
                  'border border-primary/20 transition-all duration-300',
                  'hover:border-primary/50 hover:shadow-lg hover:bg-primary/5'
                )}
              >
                {/* Stat Value */}
                <div className="mb-4">
                  <div className="text-4xl md:text-5xl font-bold text-primary inline-flex items-baseline gap-1">
                    <Counter from={0} to={stat.value} isVisible={isVisible} />
                    <span className="text-3xl md:text-4xl">{stat.suffix}</span>
                  </div>
                </div>

                {/* Stat Label */}
                <h3 className="text-lg md:text-xl font-semibold text-foreground mb-2">
                  {stat.label}
                </h3>

                {/* Stat Description */}
                {stat.description && (
                  <p className="text-sm text-muted-foreground">{stat.description}</p>
                )}

                {/* Decoration Line */}
                <motion.div
                  className="h-1 bg-gradient-to-r from-transparent via-primary to-transparent mt-4 rounded-full"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  transition={{ duration: 0.8, delay: 0.3 + index * 0.1 }}
                  viewport={{ once: true, amount: 0.3 }}
                />
              </div>

              {/* Hover Glow (for premium feel) */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur" />
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          className="text-center mt-12 md:mt-16"
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: DURATION.fast, delay: 0.2 }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
            Estos resultados son el promedio de 2.847+ clientas que han usado PDRN Pink Peptide
            Serum durante 4 semanas consecutivas
          </p>
          <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              Datos Verificados
            </span>
            <span className="hidden sm:inline text-primary/30">•</span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              Dermatológicamente Testeado
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// Helper function for cn (in case it's not imported)
function cn(...classes: (string | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

export default StatsSection;
