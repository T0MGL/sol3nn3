import { ArrowPathIcon, BeakerIcon, ClockIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import { staggerContainerVariants, staggerItemVariants } from "@/lib/animations";

const benefits = [
  {
    icon: ArrowPathIcon,
    title: "Regeneración Celular Activa",
    description: "El PDRN (Salmon DNA) estimula la producción natural de colágeno y elastina. Actúa en capas profundas de la piel para revitalizar células dañadas y restaurar su juventud. Resultados visibles desde la primera semana.",
  },
  {
    icon: BeakerIcon,
    title: "Glass Skin Effect",
    description: "Los 5 tipos de péptidos trabajan en sinergia para mejorar la firmeza, elasticidad y textura. Tu piel se vuelve más suave, luminosa y con ese brillo característico del glass skin coreano.",
  },
  {
    icon: ClockIcon,
    title: "Hidratación Profunda 24hs",
    description: "El Hyaluronic Acid penetra hasta las capas más profundas de la epidermis, manteniendo tu piel hidratada todo el día. Niacinamide unifica el tono y minimiza poros visiblemente.",
  },
];

export const BenefitsSection = () => {
  return (
    <section className="py-8 md:py-16 px-4 md:px-6 bg-background relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(192,139,122,0.08),transparent_50%)]" />

      <div className="container max-w-[1200px] mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-center mb-12 md:mb-20 space-y-3 md:space-y-4"
        >
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold px-4">
            Tu piel, transformada desde adentro
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground font-light max-w-2xl mx-auto">
            PDRN (Sodium DNA) + Péptidos actúan en capas profundas de la piel para resultados visibles.
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 lg:gap-12"
        >
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <motion.div
                key={index}
                variants={staggerItemVariants}
                className="group relative p-8 md:p-10 bg-gradient-to-b from-card to-secondary/30 border border-border/50 hover:border-primary/40 transition-all duration-300 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:-translate-y-1.5 hover:shadow-[0_12px_32px_rgba(192,139,122,0.18),0_4px_8px_rgba(0,0,0,0.06)]"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                {/* Shimmer sweep on hover */}
                <div className="absolute inset-0 -z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/8 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
                </div>

                <div className="relative space-y-5 md:space-y-6">
                  <div className="w-12 h-12 md:w-14 md:h-14 flex items-center justify-center">
                    <Icon className="w-9 h-9 md:w-10 md:h-10 text-primary" strokeWidth={1.5} />
                  </div>

                  <h3 className="text-xl md:text-2xl font-bold tracking-tight">
                    {benefit.title}
                  </h3>

                  <p className="text-sm md:text-base text-muted-foreground leading-relaxed font-light">
                    {benefit.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default BenefitsSection;
