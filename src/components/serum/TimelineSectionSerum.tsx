import { motion } from "framer-motion";
import { staggerContainerVariants, staggerItemVariants } from "@/lib/animations";
import { SERUM_TIMELINE } from "@/data/serumProduct";

export const TimelineSectionSerum = () => {
  return (
    <section className="py-8 md:py-16 px-4 md:px-6 bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(192,139,122,0.08),transparent_60%)]" />

      <div className="container max-w-[1100px] mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-center mb-12 md:mb-16 space-y-4 md:space-y-6"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter px-4">
            Lo que vas a ver, semana a semana
          </h2>
          <p className="text-lg md:text-xl lg:text-2xl text-muted-foreground font-light px-4 max-w-3xl mx-auto leading-relaxed">
            Sin promesas mágicas. La fibra de la pestaña responde con uso constante. Esto es lo que la mayoría reporta.
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="relative grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8"
        >
          {SERUM_TIMELINE.map((milestone, index) => (
            <motion.div
              key={milestone.window}
              variants={staggerItemVariants}
              className="relative bg-card/50 border border-border/40 hover:border-primary/40 rounded-xl p-6 md:p-8 transition-all duration-300 backdrop-blur-sm"
            >
              <div className="absolute -top-3 left-6 bg-primary text-foreground px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider shadow-md">
                {milestone.window}
              </div>
              <div className="absolute top-6 right-6 text-5xl md:text-6xl font-bold text-primary/10 tracking-tighter leading-none">
                {String(index + 1).padStart(2, "0")}
              </div>

              <div className="space-y-3 pt-4">
                <h3 className="text-xl md:text-2xl font-bold text-foreground tracking-tight">
                  {milestone.title}
                </h3>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed font-light">
                  {milestone.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center text-sm md:text-base text-muted-foreground/70 mt-12 italic max-w-2xl mx-auto"
        >
          Resultados individuales varían. La constancia, no la dosis, es lo que mueve la aguja.
        </motion.p>
      </div>
    </section>
  );
};

export default TimelineSectionSerum;
