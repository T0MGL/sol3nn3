import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { fadeInUpView, DURATION } from "@/lib/animations";

interface Stat {
  value: number;
  suffix: string;
  label: string;
  description?: string;
}

const stats: Stat[] = [
  {
    value: 100,
    suffix: " parches",
    label: "Por cada caja",
    description: "Te dura varias semanas de eventos",
  },
  {
    value: 30,
    suffix: " seg",
    label: "Tiempo de aplicación",
    description: "3 pasos simples, cero esfuerzo",
  },
  {
    value: 0,
    suffix: "",
    label: "Dolor, agujas o cirugía",
    description: "Lifting sin intervención médica",
  },
  {
    value: 100,
    suffix: "%",
    label: "Invisible en cámara",
    description: "Incluso con flash y cabello suelto",
  },
];

interface CounterProps {
  from: number;
  to: number;
  duration?: number;
  isVisible: boolean;
}

const Counter: React.FC<CounterProps> = ({ from, to, duration = 2, isVisible }) => {
  const [count, setCount] = useState(from);

  useEffect(() => {
    if (!isVisible) {
      setCount(from);
      return;
    }

    if (to === 0) {
      setCount(0);
      return;
    }

    const increment = (to - from) / (duration * 60);
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

function cn(...classes: (string | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export const StatsSectionTape: React.FC = () => {
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
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-accent/5 to-secondary/5 pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto">
        <motion.div className="text-center mb-12 md:mb-16" {...fadeInUpView}>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Los números que importan
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Todo lo que hacen los parches, sin lo que no queremos.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={containerVariants}
        >
          {stats.map((stat, index) => (
            <motion.div key={index} variants={itemVariants} className="relative group">
              <div
                className={cn(
                  "p-6 md:p-8 rounded-xl text-center",
                  "border border-primary/20 transition-all duration-300",
                  "hover:border-primary/50 hover:shadow-lg hover:bg-primary/5"
                )}
              >
                <div className="mb-4">
                  <div className="text-4xl md:text-5xl font-bold text-primary inline-flex items-baseline gap-1">
                    <Counter from={0} to={stat.value} isVisible={isVisible} />
                    <span className="text-2xl md:text-3xl">{stat.suffix}</span>
                  </div>
                </div>

                <h3 className="text-base md:text-lg font-semibold text-foreground mb-2">
                  {stat.label}
                </h3>

                {stat.description && (
                  <p className="text-xs md:text-sm text-muted-foreground">{stat.description}</p>
                )}

                <motion.div
                  className="h-1 bg-gradient-to-r from-transparent via-primary to-transparent mt-4 rounded-full"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  transition={{ duration: 0.8, delay: 0.3 + index * 0.1 }}
                  viewport={{ once: true, amount: 0.3 }}
                />
              </div>

              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default StatsSectionTape;
