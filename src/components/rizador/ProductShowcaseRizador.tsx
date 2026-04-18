import { motion } from "framer-motion";
import showcaseSpecsImg from "@/assets/products/rizador/rizador-showcase-specs.webp";

export const ProductShowcaseRizador = () => {
  return (
    <section className="py-6 md:py-10 px-4 md:px-6 bg-background">
      <div className="container max-w-[900px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          className="relative overflow-hidden rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.3)]"
        >
          <img
            src={showcaseSpecsImg}
            alt="Especificaciones del Rizador Solenne: temperatura controlada 60-80 grados, carga USB, peso 31g, medidas 14cm"
            loading="lazy"
            decoding="async"
            className="w-full h-auto"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default ProductShowcaseRizador;
