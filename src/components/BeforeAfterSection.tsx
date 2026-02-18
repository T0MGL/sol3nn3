import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { fadeInUpView, DURATION } from '@/lib/animations';
import beforeImage from '@/assets/beforeafter/before.webp';
import afterImage from '@/assets/beforeafter/after.webp';

interface BeforeAfterSectionProps {
  beforeSrc?: string;
  afterSrc?: string;
  beforeLabel?: string;
  afterLabel?: string;
}

export const BeforeAfterSection: React.FC<BeforeAfterSectionProps> = ({
  beforeSrc = beforeImage,
  afterSrc = afterImage,
  beforeLabel = 'Antes · Día 0',
  afterLabel = 'Después · Semana 4',
}) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const handleMouseDown = () => {
    isDragging.current = true;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging.current || !containerRef.current) return;

    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging.current || !containerRef.current) return;

    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    const x = e.touches[0].clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  useEffect(() => {
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('touchend', handleMouseUp);
    document.addEventListener('touchmove', handleTouchMove);

    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('touchend', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  return (
    <section className="relative py-16 md:py-20 lg:py-24 px-4 md:px-8">
      {/* Section Title */}
      <motion.div className="text-center mb-12 md:mb-16" {...fadeInUpView}>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
          Resultados Visibles al Comparar
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Desliza para ver la transformación en 4 semanas de uso continuo
        </p>
      </motion.div>

      {/* Before/After Slider */}
      <motion.div
        className="max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: DURATION.normal }}
        viewport={{ once: true, amount: 0.3 }}
      >
        <div
          ref={containerRef}
          className={cn(
            'relative rounded-xl overflow-hidden bg-gray-100',
            'aspect-square md:aspect-video cursor-col-resize',
            'border border-primary/20 shadow-lg'
          )}
          onMouseDown={handleMouseDown}
          onTouchStart={handleMouseDown}
        >
          {/* Before Image */}
          <div className="absolute inset-0 w-full h-full">
            {beforeSrc ? (
              <img
                src={beforeSrc}
                alt={beforeLabel}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-gray-600 font-semibold">Piel sin tratar</p>
                  <p className="text-sm text-gray-500">(Imagen representativa)</p>
                </div>
              </div>
            )}

            {/* Before Label */}
            <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm px-4 py-2 rounded-lg">
              <span className="text-white text-sm md:text-base font-semibold">{beforeLabel}</span>
            </div>
          </div>

          {/* After Image (Overlay) */}
          <div
            className="absolute inset-0 h-full overflow-hidden"
            style={{ width: `${100 - sliderPosition}%` }}
          >
            {afterSrc ? (
              <img
                src={afterSrc}
                alt={afterLabel}
                className="w-full h-full object-cover"
                style={{
                  width: '100%',
                  height: '100%',
                  transform: `translateX(${(sliderPosition / (100 - sliderPosition)) * 100}%)`,
                }}
              />
            ) : (
              <div
                className="w-full h-full bg-gradient-to-br from-green-200 to-green-300 flex items-center justify-center"
                style={{
                  width: '100%',
                  height: '100%',
                  transform: `translateX(${(sliderPosition / (100 - sliderPosition)) * 100}%)`,
                }}
              >
                <div className="text-center">
                  <p className="text-green-900 font-semibold">Piel transformada</p>
                  <p className="text-sm text-green-800">(Imagen representativa)</p>
                </div>
              </div>
            )}

            {/* After Label */}
            <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm px-4 py-2 rounded-lg">
              <span className="text-white text-sm md:text-base font-semibold">{afterLabel}</span>
            </div>
          </div>

          {/* Divider Line & Handle */}
          <motion.div
            className="absolute top-0 bottom-0 w-1 bg-white shadow-lg z-20"
            style={{ left: `${sliderPosition}%` }}
          >
            {/* Handle Circle */}
            <motion.div
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
              whileHover={{ scale: 1.2 }}
            >
              <div className="w-14 h-14 rounded-full bg-white shadow-xl flex items-center justify-center border-4 border-primary/30">
                {/* Arrow Icons */}
                <div className="flex gap-1">
                  <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path
                      fillRule="evenodd"
                      d="M6.707 6.707a1 1 0 010 1.414L4.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z"
                    />
                  </svg>
                  <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path
                      fillRule="evenodd"
                      d="M13.293 6.707a1 1 0 010 1.414L15.586 10l-2.293 2.293a1 1 0 111.414 1.414l3-3a1 1 0 010-1.414l-3-3a1 1 0 01-1.414 0z"
                    />
                  </svg>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Results Badge */}
        <motion.div
          className="mt-8 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: DURATION.normal, delay: 0.3 }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <span className="inline-block bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/30 px-6 py-3 rounded-full">
            <span className="text-primary font-semibold">✓ Resultado Real</span>
            <span className="text-muted-foreground text-sm"> · 28 días de transformación</span>
          </span>
        </motion.div>

        {/* Helper Text */}
        <motion.p
          className="text-center text-muted-foreground text-sm mt-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: DURATION.normal, delay: 0.4 }}
          viewport={{ once: true, amount: 0.3 }}
        >
          Desliza la barra para comparar el antes y después
        </motion.p>
      </motion.div>
    </section>
  );
};

export default BeforeAfterSection;
