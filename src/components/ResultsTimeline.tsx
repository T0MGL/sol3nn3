import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { fadeInUpView, DURATION } from '@/lib/animations';

interface TimelineStep {
  label: string;
  timeframe: string;
  benefits: string[];
  badge?: string;
}

const steps: TimelineStep[] = [
  {
    label: 'Hidratación Profunda',
    timeframe: 'Día 1 - 3',
    benefits: [
      'Piel suave y de aspecto fresco',
      'Hidratación inmediata',
      'Absorción rápida',
    ],
  },
  {
    label: 'Regeneración Celular',
    timeframe: 'Semana 1',
    benefits: [
      'Luminosidad visible',
      'Textura más uniforme',
      'Elasticidad mejorada',
    ],
    badge: 'Resultados Visibles',
  },
  {
    label: 'Transformación Notoria',
    timeframe: 'Semana 2',
    benefits: [
      'Poros más refinados',
      'Glass skin effect',
      'Firmeza aumentada',
    ],
  },
  {
    label: 'Resultados Óptimos',
    timeframe: 'Semana 4',
    benefits: [
      'Piel radiante y renovada',
      'Textura premium',
      'Efectos duraderos',
    ],
    badge: '28 Días Transformación',
  },
];

export const ResultsTimeline: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: DURATION.fast,
      },
    },
  };

  return (
    <section className="relative py-16 md:py-20 lg:py-24 px-4 md:px-8">
      {/* Section Title */}
      <motion.div className="text-center mb-12 md:mb-16" {...fadeInUpView}>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
          Tu Transformación Semana a Semana
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Resultados progresivos y reales desde el primer día de uso
        </p>
      </motion.div>

      {/* Timeline Container */}
      <div className="max-w-6xl mx-auto">
        {/* Desktop Timeline (Horizontal) */}
        <div className="hidden md:block">
          <motion.div
            className="relative"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={containerVariants}
          >
            {/* Timeline Line Background */}
            <div className="absolute top-8 left-0 right-0 h-1 bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20" />

            {/* Animated Progress Line */}
            <motion.div
              className="absolute top-8 left-0 h-1 bg-primary"
              initial={{ width: '0%' }}
              whileInView={{ width: `${((activeIndex + 1) / steps.length) * 100}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              viewport={{ once: true, amount: 0.3 }}
            />

            {/* Steps Grid */}
            <div className="grid grid-cols-4 gap-6 relative z-10">
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="flex flex-col items-center"
                  onHoverStart={() => setActiveIndex(index)}
                >
                  {/* Step Circle */}
                  <motion.div
                    className={cn(
                      'w-16 h-16 rounded-full flex items-center justify-center font-bold text-lg',
                      'border-2 transition-all duration-300 cursor-pointer relative z-20',
                      activeIndex === index
                        ? 'bg-primary text-white border-primary shadow-lg scale-110'
                        : 'bg-white border-primary/30 text-primary hover:border-primary'
                    )}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {index + 1}
                  </motion.div>

                  {/* Step Info */}
                  <motion.div
                    className="mt-6 text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: activeIndex === index ? 1 : 0.6 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3 className="font-semibold text-foreground mb-1 text-sm md:text-base">
                      {step.label}
                    </h3>
                    <p className="text-xs md:text-sm text-muted-foreground mb-3">
                      {step.timeframe}
                    </p>

                    {/* Badge */}
                    {step.badge && activeIndex === index && (
                      <motion.span
                        className="inline-block text-xs font-semibold text-white bg-primary px-3 py-1 rounded-full"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        {step.badge}
                      </motion.span>
                    )}
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Benefits Panel (Desktop) */}
          <motion.div
            className="mt-16 p-8 rounded-xl bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/10 border border-primary/20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: DURATION.normal, delay: 0.3 }}
            viewport={{ once: true, amount: 0.3 }}
          >
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              <h3 className="text-lg md:text-xl font-semibold text-foreground mb-4">
                {steps[activeIndex].label} — {steps[activeIndex].timeframe}
              </h3>
              <ul className="space-y-2">
                {steps[activeIndex].benefits.map((benefit, idx) => (
                  <motion.li
                    key={idx}
                    className="flex items-center gap-3 text-muted-foreground"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: idx * 0.1 }}
                  >
                    <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                    {benefit}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
        </div>

        {/* Mobile Timeline (Vertical) */}
        <div className="md:hidden">
          <motion.div
            className="space-y-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={containerVariants}
          >
            {steps.map((step, index) => (
              <motion.div key={index} variants={itemVariants} className="relative">
                {/* Timeline Line (Vertical) */}
                {index < steps.length - 1 && (
                  <div className="absolute left-8 top-20 h-12 w-1 bg-gradient-to-b from-primary to-primary/20" />
                )}

                {/* Step Circle */}
                <div className="flex gap-6">
                  <motion.div
                    className={cn(
                      'w-16 h-16 rounded-full flex items-center justify-center font-bold text-lg',
                      'border-2 flex-shrink-0',
                      'bg-primary text-white border-primary shadow-lg'
                    )}
                  >
                    {index + 1}
                  </motion.div>

                  {/* Step Content */}
                  <motion.div className="flex-1 pt-2">
                    <h3 className="font-semibold text-foreground mb-1 text-sm">
                      {step.label}
                    </h3>
                    <p className="text-xs text-muted-foreground mb-3">{step.timeframe}</p>

                    {step.badge && (
                      <span className="inline-block text-xs font-semibold text-white bg-primary px-3 py-1 rounded-full mb-3">
                        {step.badge}
                      </span>
                    )}

                    <ul className="space-y-2">
                      {step.benefits.map((benefit, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-muted-foreground">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0 mt-1" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ResultsTimeline;
