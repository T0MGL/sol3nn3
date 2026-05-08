import { motion } from "framer-motion";
import othersectionImage from "@/assets/products/retinal-celimax/othersection.webp";

const GIF_URL =
  "https://cdn.shopify.com/s/files/1/0814/5207/3195/files/gif2.gif?v=1776784605";

export const RetinalCelimaxGifShowcase = () => {
  return (
    <section className="py-8 md:py-14 px-4 md:px-6 bg-background">
      <div className="container max-w-[1100px] mx-auto space-y-6 md:space-y-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="relative w-full max-w-[720px] mx-auto"
        >
          <div className="absolute inset-0 -z-10 rounded-full blur-[80px] bg-primary/15 scale-90" />
          <div className="relative rounded-xl overflow-hidden border border-border/40 bg-card/30 shadow-[0_25px_55px_-25px_rgba(0,0,0,0.3)]">
            <img
              src={GIF_URL}
              alt="Celimax Retinal Shot en mano"
              className="w-full h-auto block"
              loading="lazy"
              decoding="async"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, delay: 0.05, ease: [0.25, 0.1, 0.25, 1] }}
          className="relative w-full max-w-[900px] mx-auto"
        >
          <div className="rounded-xl overflow-hidden border border-border/40 shadow-[0_25px_55px_-25px_rgba(0,0,0,0.3)]">
            <img
              src={othersectionImage}
              alt="Sistema A-Shot del Celimax Retinal Shot"
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

export default RetinalCelimaxGifShowcase;
