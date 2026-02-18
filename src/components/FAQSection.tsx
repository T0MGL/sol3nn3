import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "framer-motion";

const faqs = [
  {
    question: "¿Para qué tipo de piel es el PDRN Serum?",
    answer: "Es apto para todo tipo de piel, incluyendo piel sensible. Formulado y dermatológicamente testeado para uso diario.",
  },
  {
    question: "¿Cuándo veo resultados?",
    answer: "La mayoría de nuestras clientas notan mejoras en hidratación desde la primera semana. Resultados óptimos a las 4 semanas de uso constante.",
  },
  {
    question: "¿Cómo es el envío en Paraguay?",
    answer: "Delivery gratis a Asunción y Departamento Central. 1-2 días hábiles. Packaging premium incluido.",
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
