import { motion } from "framer-motion";
import { CheckCircleIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { SERUM_USAGE_RULES } from "@/data/serumProduct";

export const UsageRulesSerum = () => {
  return (
    <section className="py-8 md:py-16 px-4 md:px-6 bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(192,139,122,0.06),transparent_50%)]" />

      <div className="container max-w-[1100px] mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-center mb-12 md:mb-16 space-y-3 md:space-y-4"
        >
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tighter px-4">
            Cómo usarlo bien
          </h2>
          <p className="text-base md:text-lg text-muted-foreground font-light max-w-2xl mx-auto">
            Lo importante en 30 segundos. Sin letras chicas escondidas.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            className="p-6 md:p-8 border border-primary/30 bg-primary/5 rounded-xl"
          >
            <div className="flex items-center gap-3 mb-5">
              <CheckCircleIcon className="w-7 h-7 text-primary" strokeWidth={1.5} />
              <h3 className="text-xl md:text-2xl font-bold text-foreground">Hacé esto</h3>
            </div>
            <ul className="space-y-3">
              {SERUM_USAGE_RULES.doThis.map((rule) => (
                <li key={rule} className="flex items-start gap-3 text-sm md:text-base text-foreground/80 leading-relaxed font-light">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.4, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
            className="p-6 md:p-8 border border-border/40 bg-card/40 rounded-xl"
          >
            <div className="flex items-center gap-3 mb-5">
              <ExclamationTriangleIcon className="w-7 h-7 text-muted-foreground" strokeWidth={1.5} />
              <h3 className="text-xl md:text-2xl font-bold text-foreground">Pausá si</h3>
            </div>
            <ul className="space-y-3">
              {SERUM_USAGE_RULES.pause.map((rule) => (
                <li key={rule} className="flex items-start gap-3 text-sm md:text-base text-foreground/80 leading-relaxed font-light">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-muted-foreground/60 flex-shrink-0" />
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default UsageRulesSerum;
