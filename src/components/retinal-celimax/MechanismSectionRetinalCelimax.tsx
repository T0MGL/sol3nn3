import { motion } from "framer-motion";
import { staggerContainerVariants, staggerItemVariants } from "@/lib/animations";
import macroImage from "@/assets/products/retinal-celimax/hero5.webp";

interface ConversionStep {
  readonly id: string;
  readonly label: string;
  readonly molecule: string;
  readonly description: string;
}

const RETINOL_PATH: readonly ConversionStep[] = [
  {
    id: "retinol-1",
    label: "Paso 1",
    molecule: "Retinol",
    description: "Convierte a retinaldehído. Fricción con la barrera, irritación frecuente.",
  },
  {
    id: "retinol-2",
    label: "Paso 2",
    molecule: "Retinaldehído",
    description: "Convierte a ácido retinoico. Segunda parada, más tiempo, más enrojecimiento.",
  },
  {
    id: "retinol-3",
    label: "Activo",
    molecule: "Ácido retinoico",
    description: "Forma activa que finalmente actúa sobre la renovación celular.",
  },
];

const RETINAL_PATH: readonly ConversionStep[] = [
  {
    id: "retinal-1",
    label: "Paso 1",
    molecule: "Retinal (retinaldehído)",
    description: "El frasco entra ya en la antesala de la forma activa. Una sola conversión.",
  },
  {
    id: "retinal-2",
    label: "Activo",
    molecule: "Ácido retinoico",
    description: "Misma forma activa que la tretinoína, sin receta y con tolerancia más amable.",
  },
];

export const MechanismSectionRetinalCelimax = () => {
  return (
    <section className="py-8 md:py-16 px-4 md:px-6 bg-gradient-to-b from-background via-secondary/10 to-background relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(192,139,122,0.08),transparent_60%)]" />

      <div className="container max-w-[1200px] mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-center mb-12 md:mb-20 space-y-4 md:space-y-6"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter px-4">
            Retinol vs retinal, sin marketing
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground font-light max-w-3xl mx-auto px-4 leading-relaxed">
            Los dos llegan al mismo destino, el ácido retinoico. La diferencia es cuántas paradas hace tu piel en el camino. Menos paradas, menos pelea, mismo resultado.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-start">
          <motion.div
            variants={staggerContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="space-y-5"
          >
            <motion.div variants={staggerItemVariants} className="text-center space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground/70">
                Camino del retinol clásico
              </p>
              <p className="text-sm md:text-base text-muted-foreground/90 font-light">
                Tres paradas, dos conversiones, más fricción.
              </p>
            </motion.div>

            {RETINOL_PATH.map((step, index) => (
              <motion.div
                key={step.id}
                variants={staggerItemVariants}
                className="relative p-5 md:p-6 bg-card/40 border border-border/40 rounded-lg"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-muted/30 border border-border/40 flex items-center justify-center text-xs font-semibold text-muted-foreground">
                    {index + 1}
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-[11px] uppercase tracking-wider text-muted-foreground/70">
                      {step.label}
                    </p>
                    <h3 className="text-lg md:text-xl font-semibold text-foreground">
                      {step.molecule}
                    </h3>
                    <p className="text-sm text-muted-foreground/90 leading-relaxed font-light">
                      {step.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            variants={staggerContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="space-y-5"
          >
            <motion.div variants={staggerItemVariants} className="text-center space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                Camino del retinal Celimax
              </p>
              <p className="text-sm md:text-base text-foreground/90 font-light">
                Dos paradas, una conversión, más eficiencia.
              </p>
            </motion.div>

            {RETINAL_PATH.map((step, index) => (
              <motion.div
                key={step.id}
                variants={staggerItemVariants}
                className="relative p-5 md:p-6 bg-primary/5 border border-primary/30 rounded-lg shadow-[0_4px_20px_rgba(192,139,122,0.08)]"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/15 border border-primary/40 flex items-center justify-center text-xs font-semibold text-primary">
                    {index + 1}
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-[11px] uppercase tracking-wider text-primary/80">
                      {step.label}
                    </p>
                    <h3 className="text-lg md:text-xl font-semibold text-foreground">
                      {step.molecule}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed font-light">
                      {step.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}

            <motion.div
              variants={staggerItemVariants}
              className="relative overflow-hidden rounded-lg border border-primary/20"
            >
              <img
                src={macroImage}
                alt="Detalle de la fórmula encapsulada del Celimax Retinal Shot"
                loading="lazy"
                decoding="async"
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent pointer-events-none" />
              <p className="absolute bottom-3 left-4 right-4 text-xs md:text-sm text-foreground/90 font-light">
                Encapsulación liposomal: la dosis activa se libera de manera gradual durante la noche.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default MechanismSectionRetinalCelimax;
