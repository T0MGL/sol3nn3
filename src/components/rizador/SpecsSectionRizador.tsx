import { motion } from "framer-motion";
import { staggerContainerVariants, staggerItemVariants } from "@/lib/animations";
import {
  FireIcon,
  BoltIcon,
  ScaleIcon,
  ArrowsPointingOutIcon,
} from "@heroicons/react/24/outline";

const specs = [
  {
    icon: FireIcon,
    label: "Temperatura",
    value: "60 a 80 grados",
    detail: "Control preciso para cada tipo de pestaña",
  },
  {
    icon: BoltIcon,
    label: "Carga",
    value: "Cable USB universal rapido",
    detail: "1 hora de carga para todo el dia",
  },
  {
    icon: ScaleIcon,
    label: "Peso",
    value: "31 gramos",
    detail: "Diseño ultraligero, cabe en cualquier cartera",
  },
  {
    icon: ArrowsPointingOutIcon,
    label: "Medidas",
    value: "14 cm de largo",
    detail: "Compacto y portatil",
  },
];

export const SpecsSectionRizador = () => {
  return (
    <section className="py-8 md:py-16 px-4 md:px-6 bg-gradient-to-b from-background via-card/20 to-background">
      <div className="container max-w-[1000px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-center mb-12 md:mb-16 space-y-3 md:space-y-4"
        >
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold px-4">
            Especificaciones de tu nuevo aliado
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground font-light max-w-2xl mx-auto">
            Diseño premium negro con detalles rose gold. Tecnologia pensada para vos.
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="space-y-4 md:space-y-6"
        >
          {specs.map((spec, index) => {
            const Icon = spec.icon;
            return (
              <motion.div
                key={index}
                variants={staggerItemVariants}
                className="flex items-center gap-5 md:gap-6 p-5 md:p-6 bg-card/30 border border-border/50 hover:border-primary/30 transition-all duration-300 rounded-lg"
              >
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-6 h-6 md:w-7 md:h-7 text-primary" strokeWidth={1.5} />
                </div>
                <div className="flex-1">
                  <p className="text-xs md:text-sm text-muted-foreground uppercase tracking-wider font-medium">
                    {spec.label}
                  </p>
                  <p className="text-lg md:text-xl font-bold text-foreground mt-0.5">
                    {spec.value}
                  </p>
                  <p className="text-sm text-muted-foreground font-light mt-1">
                    {spec.detail}
                  </p>
                </div>
              </motion.div>
            );
          })}

          <motion.div
            variants={staggerItemVariants}
            className="flex items-center gap-5 md:gap-6 p-5 md:p-6 bg-primary/5 border border-primary/20 rounded-lg"
          >
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 md:w-7 md:h-7 text-primary">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 10.5h.375c.621 0 1.125.504 1.125 1.125v2.25c0 .621-.504 1.125-1.125 1.125H21M3.75 18h15A2.25 2.25 0 0 0 21 15.75v-6a2.25 2.25 0 0 0-2.25-2.25h-15A2.25 2.25 0 0 0 1.5 9.75v6A2.25 2.25 0 0 0 3.75 18Z" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-xs md:text-sm text-muted-foreground uppercase tracking-wider font-medium">
                Bateria
              </p>
              <p className="text-lg md:text-xl font-bold text-foreground mt-0.5">
                Larga duracion sin pilas
              </p>
              <p className="text-sm text-muted-foreground font-light mt-1">
                Bateria recargable integrada, sin reemplazos
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default SpecsSectionRizador;
