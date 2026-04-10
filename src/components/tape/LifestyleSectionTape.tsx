import { motion } from "framer-motion";
import { CameraIcon, UserGroupIcon, HeartIcon } from "@heroicons/react/24/outline";
import faceTapeLifestyle from "@/assets/products/tape/face-tape-lifestyle.webp";
import faceTapeResult from "@/assets/products/tape/face-tape-result.webp";

const moments = [
  {
    icon: CameraIcon,
    title: "Antes de una foto",
    description:
      "Sesión de fotos, boda, cena. 30 segundos en el baño y saliste con el contorno más firme de la noche.",
  },
  {
    icon: UserGroupIcon,
    title: "Antes de una reunión",
    description:
      "Reunión importante, entrevista, presentación. Llegás descansada y firme, sin cremas que no notás en el momento.",
  },
  {
    icon: HeartIcon,
    title: "Antes de salir",
    description:
      "Una cita, un cumpleaños, un evento. Un gesto invisible que te hace sentir lista, sin depender de filtros después.",
  },
];

const containerVariants = {
  initial: { opacity: 1 },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  initial: { opacity: 0, y: 15 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.1, 0.25, 1] as const,
    },
  },
};

export const LifestyleSectionTape = () => {
  return (
    <section className="py-8 md:py-16 px-4 md:px-6 bg-gradient-to-b from-background via-secondary/20 to-background relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(192,139,122,0.08),transparent_60%)]" />

      <div className="container max-w-[1200px] mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-center mb-12 md:mb-20 space-y-4 md:space-y-6"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter px-4">
            Los momentos donde importa
          </h2>
          <p className="text-lg md:text-xl lg:text-2xl text-muted-foreground font-light px-4 max-w-3xl mx-auto leading-relaxed">
            El Face Tape no reemplaza tu rutina de piel. Reemplaza el deseo de tener un filtro cuando la cámara se prende.
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
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="w-full aspect-[3/4] rounded-2xl shadow-lg drop-shadow-[0_8px_16px_rgba(192,139,122,0.25)] overflow-hidden"
              >
                <img
                  src={faceTapeLifestyle}
                  alt="Luciendo más firme con V-Shaped Face Tape"
                  className="w-full h-full object-cover object-top"
                  loading="lazy"
                  decoding="async"
                />
              </motion.div>
              <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -bottom-6 -right-4 md:-right-8 w-28 md:w-36 aspect-square rounded-xl overflow-hidden border-2 border-primary/40 shadow-[0_8px_24px_rgba(192,139,122,0.3)] bg-background"
              >
                <img
                  src={faceTapeResult}
                  alt="Resultado invisible del Face Tape"
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </motion.div>
              <div className="absolute -bottom-6 left-4 bg-primary/90 backdrop-blur-sm px-4 py-2 rounded-lg border border-primary/50 shadow-lg">
                <p className="text-xs md:text-sm font-bold text-foreground text-center">
                  V-Shaped Face Tape
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.2 }}
            variants={containerVariants}
            className="space-y-8 order-1 lg:order-2"
          >
            {moments.map((moment, index) => {
              const Icon = moment.icon;
              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="flex gap-6 items-start p-6 md:p-8 bg-gradient-to-r from-card/50 to-transparent border-l-2 border-primary/50 hover:border-primary transition-all duration-300"
                >
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 md:w-14 md:h-14 flex items-center justify-center bg-primary/10 rounded-lg border border-primary/30">
                      <Icon className="w-6 h-6 md:w-7 md:h-7 text-primary" strokeWidth={1.5} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl md:text-2xl font-bold text-foreground">
                      {moment.title}
                    </h3>
                    <p className="text-base md:text-lg text-muted-foreground leading-relaxed font-light">
                      {moment.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
          className="mt-16 md:mt-20 text-center"
        >
          <div className="inline-block shimmer-host bg-secondary/50 backdrop-blur-sm border border-primary/30 rounded-lg px-8 py-6 md:px-12 md:py-8 shadow-[0_4px_24px_rgba(192,139,122,0.12),0_1px_4px_rgba(0,0,0,0.06)]">
            <p className="text-lg md:text-xl lg:text-2xl font-light text-foreground/90 leading-relaxed">
              Tu arma secreta antes de cualquier evento.{" "}
              <span className="font-bold text-primary">Invisible, instantánea, tuya.</span>
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default LifestyleSectionTape;
