import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const POSTER = "/serum-antes-despues-poster.jpg";
const MP4 = "/serum-antes-despues.mp4";
const WEBM = "/serum-antes-despues.webm";

const usePrefersReducedMotion = () => {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(query.matches);

    const onChange = (event: MediaQueryListEvent) => setReduced(event.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  return reduced;
};

export const BeforeAfterVideoSerum = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const video = videoRef.current;
    if (!video || reducedMotion) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.4 }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, [reducedMotion]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      className="mx-auto mb-12 md:mb-16 w-full max-w-[320px] md:max-w-[360px]"
    >
      <div className="relative overflow-hidden rounded-2xl border border-border/40 bg-card/40 shadow-[0_12px_40px_rgba(192,139,122,0.16),0_4px_12px_rgba(0,0,0,0.06)]">
        {reducedMotion ? (
          <img
            src={POSTER}
            alt="Comparación de pestañas antes y después del uso del serum Solenne"
            width={250}
            height={332}
            className="block h-auto w-full"
          />
        ) : (
          <video
            ref={videoRef}
            poster={POSTER}
            width={250}
            height={332}
            autoPlay
            loop
            muted
            playsInline
            preload="none"
            aria-label="Comparación de pestañas antes y después del uso del serum Solenne"
            className="block h-auto w-full"
          >
            <source src={WEBM} type="video/webm" />
            <source src={MP4} type="video/mp4" />
          </video>
        )}
      </div>
      <p className="mt-3 text-center text-xs md:text-sm text-muted-foreground/70 font-light italic">
        Resultado con uso constante. Los tiempos varían según cada persona.
      </p>
    </motion.div>
  );
};

export default BeforeAfterVideoSerum;
