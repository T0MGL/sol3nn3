import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "framer-motion";

const faqs = [
  {
    question: "¿Para qué tipo de piel es?",
    answer: "El Suero de Péptidos PDRN está formulado para todo tipo de piel, incluida la sensible. Su textura ligera se absorbe rápido sin dejar pegajosidad. Si tenés piel reactiva, te recomendamos hacer una prueba en una zona pequeña antes del uso completo.",
  },
  {
    question: "¿Es seguro?",
    answer: "Está diseñado para uso cosmético. Recomendamos hacer una prueba en una zona pequeña de la piel antes del uso completo.",
  },
  {
    question: "¿Cómo es el envío en Paraguay?",
    answer: "Envío gratis a Asunción y Departamento Central. 1 a 2 días hábiles.",
  },
  {
    question: "¿Cómo se usa?",
    answer: "Aplicá 2 a 3 gotas sobre la piel limpia, mañana y noche. Masajeá hasta absorber. Se recomienda combinar con hidratante y protector solar durante el día.",
  },
  {
    question: "¿Cuánto dura un frasco de 30ml?",
    answer: "Con 2 a 3 gotas mañana y noche, un frasco rinde entre 4 y 6 semanas. Para ver los resultados completos del tratamiento, visibles desde la semana 4, recomendamos comenzar con el Kit Duo.",
  },
  {
    question: "¿Por qué el Kit Duo es el más vendido?",
    answer: "Los resultados de los péptidos son acumulativos. La mayoría de nuestras clientas eligen el Kit Duo para asegurar 2 meses de uso continuo y conseguir el cambio de textura completo.",
  },
];

export const FAQSection = () => {
  return (
    <section className="py-8 md:py-16 px-4 md:px-6 bg-background">
      <div className="container max-w-[900px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-center mb-12 md:mb-20 space-y-3 md:space-y-4"
        >
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold px-4">
            Preguntas Frecuentes
          </h2>
        </motion.div>

        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="border border-border/50 bg-background/50 backdrop-blur-sm px-5 md:px-8 hover:border-primary/30 transition-colors"
            >
              <AccordionTrigger className="text-left text-sm md:text-base lg:text-lg font-medium hover:text-primary py-5 md:py-6">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-sm md:text-base text-muted-foreground leading-relaxed font-light whitespace-pre-line pb-5 md:pb-6">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQSection;
