import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fadeInUpView } from "@/lib/animations";
import serumHero from "@/assets/products/serum/serum-hero.webp";
import serumApplication from "@/assets/products/serum/serum-application.webp";
import serumResult from "@/assets/products/serum/serum-result.webp";
import serumPackaging from "@/assets/products/serum/serum-packaging.webp";

const images = [
  { src: serumHero, alt: "Solenne Serum de Pestañas, frasco 7 ml" },
  { src: serumApplication, alt: "Aplicación nocturna del Serum de Pestañas" },
  { src: serumResult, alt: "Resultado de pestañas más largas con uso constante" },
  { src: serumPackaging, alt: "Packaging del Serum de Pestañas Solenne" },
];

export const ProductGallerySerum = () => {
  const [selectedImage, setSelectedImage] = useState(0);

  return (
    <section data-section="product-gallery-serum" className="py-8 md:py-12 px-4 bg-background">
      <div className="container max-w-[1200px] mx-auto">
        <div className="space-y-8">
          <motion.div
            {...fadeInUpView}
            className="relative aspect-[4/3] md:aspect-video w-full overflow-hidden bg-gradient-to-b from-background via-card/20 to-background"
          >
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(192,139,122,0.15),transparent_60%)]" />
            <AnimatePresence mode="wait">
              <motion.img
                key={selectedImage}
                src={images[selectedImage].src}
                alt={images[selectedImage].alt}
                loading="lazy"
                decoding="async"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.01 }}
                transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                className="w-full h-full object-contain drop-shadow-[0_4px_24px_rgba(192,139,122,0.35)] drop-shadow-[0_0_60px_rgba(192,139,122,0.18)]"
              />
            </AnimatePresence>
          </motion.div>

          <motion.div
            {...fadeInUpView}
            transition={{ ...fadeInUpView.transition, delay: 0.1 }}
            className="grid grid-cols-4 gap-3 md:gap-4"
          >
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`relative aspect-square overflow-hidden bg-card border-2 transition-all duration-300 ${
                  selectedImage === index
                    ? "border-primary shadow-[0_0_20px_rgba(192,139,122,0.4)]"
                    : "border-border/30 hover:border-primary/50"
                }`}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-contain bg-card"
                />
              </button>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ProductGallerySerum;
