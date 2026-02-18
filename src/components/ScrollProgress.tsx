import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export const ScrollProgress: React.FC = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollTop = window.scrollY;
      const scrollPercent = windowHeight > 0 ? (scrollTop / windowHeight) * 100 : 0;
      setProgress(Math.min(scrollPercent, 100));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[2px] bg-primary z-[999]"
      style={{
        scaleX: progress / 100,
        transformOrigin: '0% 50%',
      }}
      transition={{
        type: 'spring',
        stiffness: 500,
        damping: 90,
        mass: 0.2,
      }}
    />
  );
};

export default ScrollProgress;
