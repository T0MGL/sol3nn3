import { motion } from "framer-motion";
import { MoonIcon, BeakerIcon, ClockIcon } from "@heroicons/react/24/outline";
import { RETINAL_CELIMAX_STEPS } from "@/data/retinalCelimaxProduct";

const STEP_ICONS = [BeakerIcon, MoonIcon, ClockIcon] as const;

export const HowItWorksRetinalCelimax = () => {
  return (
    <section className="py-8 md:py-16 px-4 md:px-6 bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(192,139,122,0.08),transparent_60%)]" />

      <div className="container max-w-[1200px] mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-center mb-16 md:mb-20 space-y-5 md:space-y-6"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter px-4 leading-tight">
            Tres pasos. Una vez por noche. Listo.
          </h2>
          <p className="text-lg md:text-xl lg:text-2xl text-muted-foreground font-light max-w-3xl mx-auto px-4 leading-relaxed">
            Lo único que importa es{" "}
            <span className="text-foreground font-medium">presentarse cada noche</span> y dejar que el activo trabaje. La piel pide constancia, no intensidad.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-12 md:mb-16"
        >
          {RETINAL_CELIMAX_STEPS.map((step, index) => {
            const Icon = STEP_ICONS[index] ?? ClockIcon;
            return (
              <div
                key={step.number}
                className="relative bg-card border border-border/50 rounded-lg p-8 space-y-5 hover:border-primary/30 transition-all duration-300 shadow-[0_1px_4px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_20px_rgba(192,139,122,0.12)]"
              >
                <span className="absolute top-6 right-6 text-5xl md:text-6xl font-bold text-primary/10 tracking-tighter leading-none">
                  {step.number}
                </span>

                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center relative">
                  <Icon className="w-7 h-7 text-primary" strokeWidth={1.5} />
                </div>

                <div className="space-y-3 relative">
                  <h3 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
                    {step.title}
                  </h3>
                  <p className="text-sm md:text-base text-muted-foreground leading-relaxed font-light">
                    {step.description}
                  </p>
                  <div className="inline-flex items-center gap-2 pt-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <span className="text-xs font-semibold text-primary tracking-wide uppercase">
                      {step.duration}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-center text-sm md:text-base text-muted-foreground/80 mt-12 md:mt-16 font-light italic max-w-2xl mx-auto"
        >
          Cada noche, un gesto chico. A las ocho semanas, la piel responde.
        </motion.p>
      </div>
    </section>
  );
};

export default HowItWorksRetinalCelimax;
