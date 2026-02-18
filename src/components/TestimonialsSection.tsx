import { StarIcon } from "@heroicons/react/24/solid";
import { motion } from "framer-motion";

const testimonials = [
  {
    name: "María José",
    role: "Asunción",
    rating: 5,
    quote: "Mi piel nunca estuvo tan hidratada. Lo uso hace 3 semanas y ya noto una diferencia enorme en la textura.",
  },
  {
    name: "Valentina",
    role: "Encarnación",
    rating: 5,
    quote: "Empecé a ver resultados en 5 días. La piel más luminosa y los poros visiblemente reducidos. Vale cada guaraní.",
  },
  {
    name: "Camila",
    role: "CDE",
    rating: 5,
    quote: "Soy fanática del K-beauty y este es de los mejores sueros que probé. Que lo traigan a Paraguay fue un regalo.",
  },
  {
    name: "Sofía",
    role: "Villarrica",
    rating: 5,
    quote: "Después de 2 semanas mi piel estaba completamente transformada. Ahora es mi producto estrella.",
  },
];

const containerVariants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.35,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};


export const TestimonialsSection = () => {
  return (
    <section className="py-8 md:py-16 px-4 md:px-6 bg-background relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(192,139,122,0.08),transparent_50%)]" />

      <div className="container max-w-[1200px] mx-auto relative z-10">
        <div className="text-center mb-8 md:mb-12 space-y-3 md:space-y-4">
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold px-4">
            Resultados reales. Piel transformada.
          </h2>
          <p className="text-base md:text-xl text-muted-foreground px-4">
            Clientas paraguayas que ya lo viven
          </p>
        </div>

        {/* Rating Summary Banner */}
        <div className="max-w-3xl mx-auto mb-12 md:mb-16">
          <div className="bg-gradient-to-b from-secondary/40 to-secondary/20 backdrop-blur-sm border border-accent/30 rounded-lg p-8 md:p-10 shadow-[0_4px_6px_rgba(0,0,0,0.08),0_0_40px_rgba(192,139,122,0.12)]">
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-10">
              {/* Star Rating Display */}
              <div className="flex flex-col items-center gap-3">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon key={i} className="w-7 h-7 md:w-8 md:h-8 text-accent" />
                  ))}
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl md:text-5xl font-bold text-accent">4.8</span>
                  <span className="text-lg md:text-xl text-muted-foreground font-light">de 5</span>
                </div>
              </div>

              {/* Divider */}
              <div className="hidden md:block w-px h-20 bg-border/50" />

              {/* Customer Count */}
              <div className="flex flex-col items-center gap-2 text-center">
                <p className="text-3xl md:text-4xl font-bold text-foreground">2,847</p>
                <p className="text-base md:text-lg text-muted-foreground font-light">
                  clientes satisfechos
                </p>
                <p className="text-xs md:text-sm text-accent/80 font-medium mt-1">
                  ★ Reviews verificadas
                </p>
              </div>
            </div>
          </div>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6"
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group p-6 md:p-8 bg-gradient-to-b from-card to-background border border-border/50 hover:border-primary/30 transition-all duration-300 shadow-[0_1px_4px_rgba(0,0,0,0.04)] hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(192,139,122,0.14),0_2px_6px_rgba(0,0,0,0.05)]"
            >
              <div className="space-y-5 md:space-y-6">
                <div className="flex gap-0.5">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <StarIcon key={i} className="w-3.5 h-3.5 md:w-4 md:h-4 text-accent" />
                  ))}
                </div>

                <p className="text-foreground/80 leading-relaxed font-light text-sm">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>

                <div className="pt-4 border-t border-border/30">
                  <p className="font-semibold text-foreground text-sm md:text-base">
                    {testimonial.name}
                  </p>
                  <p className="text-xs text-muted-foreground font-light mt-1">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
