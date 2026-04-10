import { motion } from "framer-motion";
import { HandRaisedIcon, ArrowsPointingOutIcon, CheckBadgeIcon } from "@heroicons/react/24/outline";
import faceTapeApplication from "@/assets/products/tape/face-tape-application.webp";

const steps = [
  {
    number: "01",
    icon: HandRaisedIcon,
    title: "Colocá",
    description:
      "Despegá la cinta del blister. Apoyala sobre la zona que querés tensar: mejillas, papada, contorno o párpados.",
    duration: "10 segundos",
  },
  {
    number: "02",
    icon: ArrowsPointingOutIcon,
    title: "Estirá",
    description:
      "Con la otra punta libre, tirá suavemente hacia arriba y hacia atrás. La piel se eleva con vos.",
    duration: "10 segundos",
  },
  {
    number: "03",
    icon: CheckBadgeIcon,
    title: "Fijá",
    description:
      "Escondé la punta detrás de la oreja o bajo el cabello. Listo. Nadie la ve y el lifting ya está hecho.",
    duration: "10 segundos",
  },
];

export const HowItWorksTape = () => {
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
            3 pasos. 30 segundos. Lifting listo.
          </h2>
          <p className="text-lg md:text-xl lg:text-2xl text-muted-foreground font-light max-w-3xl mx-auto px-4 leading-relaxed">
            Sin agujas, sin cirugía, sin gastar una fortuna.{" "}
            <span className="text-foreground font-medium">Un movimiento invisible</span> que te pone frente al espejo lista en el mismo tiempo que tardás en buscar el rímel.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-12 md:mb-16"
        >
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={index}
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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
          className="relative max-w-3xl mx-auto"
        >
          <div className="absolute inset-0 bg-primary/10 rounded-2xl blur-[80px] scale-90" />
          <div className="relative rounded-2xl overflow-hidden shadow-[0_10px_40px_rgba(192,139,122,0.2)] border border-primary/10">
            <img
              src={faceTapeApplication}
              alt="Aplicación del V-Shaped Face Tape paso a paso"
              className="w-full h-auto object-cover"
              loading="lazy"
              decoding="async"
            />
          </div>
          <p className="text-center text-xs md:text-sm text-muted-foreground/70 mt-4 font-light italic">
            Mientras lo usás, tu rostro luce más firme. Al final del día, lo retirás.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorksTape;
