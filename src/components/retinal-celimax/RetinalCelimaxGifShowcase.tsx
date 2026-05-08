import { motion } from "framer-motion";
import othersectionImage from "@/assets/products/retinal-celimax/othersection.webp";

const GIF_URL =
  "https://cdn.shopify.com/s/files/1/0814/5207/3195/files/gif2.gif?v=1776784605";

export const RetinalCelimaxGifShowcase = () => {
  return (
    <section className="py-12 md:py-20 px-4 md:px-6 bg-gradient-to-b from-background via-card/15 to-background">
      <div className="container max-w-[1200px] mx-auto space-y-12 md:space-y-16">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            className="relative w-full max-w-[520px] mx-auto lg:mx-0"
          >
            <div className="absolute inset-0 -z-10 rounded-full blur-[80px] bg-primary/15 scale-90" />
            <div className="relative aspect-square overflow-hidden rounded-xl border border-border/40 bg-card/30 shadow-[0_30px_60px_-25px_rgba(0,0,0,0.35)]">
              <img
                src={GIF_URL}
                alt="Textura del Celimax Retinal Shot en aplicación"
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
            className="space-y-5 md:space-y-6"
          >
            <div className="h-0.5 w-10 bg-primary/40" />
            <p className="text-xs md:text-sm font-semibold tracking-[0.18em] uppercase text-primary">
              Una gota, así de denso
            </p>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground leading-tight">
              Mirá la fórmula <span className="italic">en acción</span>
            </h2>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              Textura sedosa que se desliza, no que pesa. El retinal encapsulado se absorbe en segundos y deja la piel lista para descansar y renovarse durante la noche.
            </p>
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="space-y-1">
                <p className="text-2xl md:text-3xl font-bold text-primary">15 ml</p>
                <p className="text-xs md:text-sm text-muted-foreground">Frasco con dropper de precisión</p>
              </div>
              <div className="space-y-1">
                <p className="text-2xl md:text-3xl font-bold text-primary">1 a 2</p>
                <p className="text-xs md:text-sm text-muted-foreground">Gotas por aplicación nocturna</p>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="relative w-full max-w-[900px] mx-auto"
        >
          <div className="rounded-xl overflow-hidden border border-border/40 shadow-[0_25px_55px_-25px_rgba(0,0,0,0.3)]">
            <img
              src={othersectionImage}
              alt="¿Por qué una gota? Sistema A-Shot del Celimax Retinal Shot con micro partículas para penetración dirigida en poros"
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
