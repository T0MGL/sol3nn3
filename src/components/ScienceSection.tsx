import { motion } from "framer-motion";
import { CpuChipIcon, BeakerIcon, ShieldCheckIcon, HeartIcon } from "@heroicons/react/24/outline";
import ingredientsImage from "@/assets/products/ingredients-info.webp";

const ingredients = [
  {
    icon: CpuChipIcon,
    name: "PDRN 1%",
    concentration: "1%",
    description: "Polidesoxirribonucleótido. Apoya la apariencia de una piel revitalizada y un aspecto más liso.",
    benefit: "Aspecto revitalizado",
    clinical: false
  },
  {
    icon: BeakerIcon,
    name: "Complejo de 5 Péptidos",
    concentration: "5%",
    description: "Péptidos bioactivos. Apoya la apariencia de firmeza, elasticidad y textura de la piel.",
    benefit: "Aspecto más firme",
    clinical: false
  },
  {
    icon: HeartIcon,
    name: "Ácido Hialurónico",
    concentration: "3%",
    description: "Apoya la hidratación de las capas superficiales de la piel y ayuda a mantener la sensación de hidratación.",
    benefit: "Piel con aspecto hidratado",
    clinical: false
  },
  {
    icon: ShieldCheckIcon,
    name: "Niacinamida",
    concentration: "4%",
    description: "Vitamina B3. Apoya la apariencia de un tono más uniforme y poros menos visibles.",
    benefit: "Aspecto más uniforme",
    clinical: false
  }
];

export const ScienceSection = () => {
  return (
    <section className="py-8 md:py-16 px-4 md:px-6 bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(192,139,122,0.08),transparent_60%)]" />

      <div className="container max-w-[1200px] mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-center mb-16 md:mb-20 space-y-6 md:space-y-8"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter px-4 leading-tight">
            Ingredientes clave
          </h2>
          <p className="text-lg md:text-xl lg:text-2xl text-muted-foreground font-light max-w-4xl mx-auto px-4 leading-relaxed">
            Una fórmula cosmética importada que combina
            <span className="text-foreground font-medium"> PDRN, complejo de péptidos, ácido hialurónico y niacinamida</span>,
            pensada para apoyar la reparación, la hidratación y la textura.
          </p>
        </motion.div>

        {/* Ingredients Grid */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 md:mb-16"
        >
          {ingredients.map((ingredient, index) => {
            const Icon = ingredient.icon;
            const concentrationValue = parseInt(ingredient.concentration) * 10;
            return (
              <div
                key={index}
                className="bg-card border border-border/50 rounded-lg p-6 space-y-4 hover:border-primary/30 transition-all duration-300 shadow-[0_1px_4px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_20px_rgba(192,139,122,0.12)]"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Icon className="w-6 h-6 text-primary" strokeWidth={1.5} />
                </div>
                <div className="space-y-3">
                  <div>
                    <h3 className="font-bold text-foreground">
                      {ingredient.name}
                    </h3>
                    <p className="text-xs text-muted-foreground pt-1">
                      Concentración: {ingredient.concentration}
                    </p>
                  </div>

                  {/* Concentration Bar */}
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-primary to-accent"
                      initial={{ width: 0 }}
                      whileInView={{ width: `${concentrationValue}%` }}
                      transition={{ duration: 0.8, delay: index * 0.15 }}
                      viewport={{ once: true, amount: 0.3 }}
                    />
                  </div>

                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {ingredient.description}
                  </p>
                  <p className="text-xs text-primary font-semibold pt-1">
                    ✓ {ingredient.benefit}
                  </p>
                </div>
              </div>
            );
          })}
        </motion.div>

        {/* Clinical Results */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.4, delay: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
          className="mt-12 md:mt-16 text-center max-w-3xl mx-auto px-4"
        >
          <div className="bg-gradient-to-b from-primary/10 to-primary/5 border border-primary/20 rounded-xl p-8 md:p-10 space-y-4">
            <h3 className="text-2xl md:text-3xl font-bold text-foreground">
              Para qué se usa
            </h3>
            <div className="grid grid-cols-3 gap-4 pt-4">
              <div>
                <p className="text-2xl md:text-3xl font-bold text-primary">Diario</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Pensado para uso diario
                </p>
              </div>
              <div>
                <p className="text-2xl md:text-3xl font-bold text-primary">4+</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Semanas de uso continuo recomendadas
                </p>
              </div>
              <div>
                <p className="text-2xl md:text-3xl font-bold text-primary">Todos</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Tipos de piel
                </p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground pt-4">
              Producto cosmético importado. El empaque puede variar. Sin afiliación a ninguna marca específica. Los resultados pueden variar según el tipo de piel.
            </p>
          </div>
        </motion.div>

        {/* Ingredients Visual */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          className="mt-16 md:mt-24"
        >
          <img
            src={ingredientsImage}
            alt="Ingredientes clave del suero: PDRN, péptidos, ácido hialurónico, niacinamida"
            className="w-full max-w-4xl mx-auto rounded-xl shadow-[0_10px_40px_rgba(192,139,122,0.2)]"
            loading="lazy"
            decoding="async"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default ScienceSection;
