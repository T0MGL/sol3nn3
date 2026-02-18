import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export const CustomCursor: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHoveringButton, setIsHoveringButton] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Track if device supports fine pointer (desktop)
  const [isFinePointer, setIsFinePointer] = useState(false);

  // Only show on desktop devices (fine pointer)
  useEffect(() => {
    const mediaQuery = window.matchMedia('(pointer: fine)');
    setIsFinePointer(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setIsFinePointer(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Hide default cursor on mount (only on fine pointer devices)
  useEffect(() => {
    if (isFinePointer) {
      document.documentElement.style.cursor = 'none';
      return () => {
        document.documentElement.style.cursor = 'auto';
      };
    }
  }, [isFinePointer]);

  // Handle mouse movement
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  // Detect hovering interactive elements
  useEffect(() => {
    const handleMouseEnter = () => setIsHoveringButton(true);
    const handleMouseLeave = () => setIsHoveringButton(false);

    const interactiveElements = document.querySelectorAll(
      'a, button, input, textarea, select, [role="button"], [role="link"], .cursor-pointer'
    );

    interactiveElements.forEach((el) => {
      el.addEventListener('mouseenter', handleMouseEnter);
      el.addEventListener('mouseleave', handleMouseLeave);
    });

    return () => {
      interactiveElements.forEach((el) => {
        el.removeEventListener('mouseenter', handleMouseEnter);
        el.removeEventListener('mouseleave', handleMouseLeave);
      });
    };
  }, []);

  if (!isFinePointer || !isVisible) {
    return null;
  }

  return (
    <>
      {/* Outer ring */}
      <motion.div
        className="pointer-events-none fixed z-[999]"
        style={{
          left: mousePosition.x,
          top: mousePosition.y,
          x: '-50%',
          y: '-50%',
        }}
        animate={{
          width: isHoveringButton ? 60 : 32,
          height: isHoveringButton ? 60 : 32,
        }}
        transition={{
          type: 'spring',
          stiffness: 500,
          damping: 28,
          mass: 0.5,
        }}
      >
        {/* Cursor circle with premium styling */}
        <div
          className={`absolute inset-0 rounded-full border-2 transition-all duration-300 ${
            isHoveringButton
              ? 'border-primary/70 bg-primary/10 backdrop-blur-sm'
              : 'border-primary/40 bg-transparent'
          }`}
          style={{
            boxShadow: isHoveringButton
              ? '0 0 20px rgba(192, 139, 122, 0.3)'
              : '0 0 10px rgba(192, 139, 122, 0.15)',
          }}
        />

        {/* Inner dot */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="w-2 h-2 rounded-full transition-all duration-300"
            style={{
              backgroundColor: isHoveringButton ? 'hsl(var(--primary))' : 'hsl(var(--primary) / 0.6)',
            }}
          />
        </div>
      </motion.div>
    </>
  );
};

export default CustomCursor;
