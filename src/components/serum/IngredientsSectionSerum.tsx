import { motion } from "framer-motion";
import { staggerContainerVariants, staggerItemVariants } from "@/lib/animations";
import { SERUM_HERO_INGREDIENTS } from "@/data/serumProduct";
import serumIngredients from "@/assets/products/serum/serum-detail-1.jpg";

export const IngredientsSectionSerum = () => {
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
            Tres activos. Una fórmula coreana.
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground font-light max-w-3xl mx-auto px-4 leading-relaxed">
            Sin prostaglandinas, sin parabenos, sin alcohol denaturado. Lo que sí tiene, está acá.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            className="relative order-2 lg:order-1"
          >
            <div className="absolute inset-0 bg-primary/10 rounded-full blur-[100px] scale-75" />
            <div className="relative max-w-[500px] mx-auto">
              <div className="w-full aspect-square rounded-2xl shadow-lg drop-shadow-[0_8px_16px_rgba(192,139,122,0.25)] overflow-hidden">
                <img
                  src={serumIngredients}
                  alt="Ingredientes del Serum de Pestañas Solenne"
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={staggerContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="space-y-6 order-1 lg:order-2"
          >
            {SERUM_HERO_INGREDIENTS.map((ingredient) => (
              <motion.div
                key={ingredient.inci}
                variants={staggerItemVariants}
                className="p-6 md:p-8 bg-gradient-to-r from-card/70 to-transparent border-l-2 border-primary/50 hover:border-primary transition-all duration-300"
              >
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="space-y-1">
                    <h3 className="text-xl md:text-2xl font-bold text-foreground">
                      {ingredient.name}
                    </h3>
                    <p className="text-xs text-muted-foreground/60 font-mono uppercase tracking-wider">
                      {ingredient.inci}
                    </p>
                  </div>
                  <span className="inline-block text-[11px] font-semibold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full">
                    {ingredient.role}
                  </span>
                </div>
                <p className="mt-4 text-sm md:text-base text-muted-foreground leading-relaxed font-light">
                  {ingredient.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default IngredientsSectionSerum;
