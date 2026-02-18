import { motion } from "framer-motion";
import { staggerContainerVariants, staggerItemVariants } from "@/lib/animations";
// import productVideo from "@/assets/nocteglasses.mp4"; // Video file not available
import { useRef, useEffect } from "react";

export const ProductVideo = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    let isMounted = true;

    // Intenta reproducir el video cuando el componente se monta
    const playVideo = async () => {
      try {
        await videoElement.play();
      } catch (error) {
        // Solo logueamos si el componente sigue montado
        if (isMounted) {
          console.log("Autoplay bloqueado por el navegador:", error);
        }
      }
    };

    // Usa Intersection Observer para reproducir cuando esté visible
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && isMounted) {
            playVideo();
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(videoElement);

    return () => {
      isMounted = false;
      observer.disconnect();
    };
  }, []);

  return null; // ProductVideo section disabled - video asset not available
};

export default ProductVideo;
