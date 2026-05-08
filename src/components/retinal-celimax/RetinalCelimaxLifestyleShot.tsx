import { motion } from "framer-motion";
import lifestyleImage from "@/assets/products/retinal-celimax/hero2.webp";

export const RetinalCelimaxLifestyleShot = () => {
  return (
    <section className="py-8 md:py-14 px-4 md:px-6 bg-background">
      <div className="container max-w-[1100px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="relative w-full max-w-[900px] mx-auto"
        >
          <div className="rounded-xl overflow-hidden border border-border/40 shadow-[0_25px_55px_-25px_rgba(0,0,0,0.3)]">
            <img
              src={lifestyleImage}
              alt="Celimax Retinal Shot, booster antiedad con 0.1% nano-retinal"
              className="w-full h-auto block"
              loading="lazy"
              decoding="async"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default RetinalCelimaxLifestyleShot;
