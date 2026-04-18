import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "framer-motion";

const faqs = [
  {
    question: "¿Como funciona el rizador electrico?",
    answer:
      "Utiliza calor controlado (entre 60 y 80 grados) para moldear tus pestañas con suavidad. Se calienta en 5 segundos, aplicas en un solo movimiento y listo. Sin tirones, sin pellizcos.",
  },
  {
    question: "¿Cuanto dura el rizado?",
    answer:
      "El rizado dura hasta 24 horas. Gracias a la tecnologia termica, la curvatura se mantiene durante todo el dia sin necesidad de retoques.",
  },
  {
    question: "¿Es seguro para las pestañas?",
    answer:
      "Totalmente. El diseño anti-quemaduras protege tus parpados, y el calor controlado moldea sin dañar la pestaña. Ademas tiene apagado inteligente automatico a los 5 minutos de inactividad.",
  },
  {
    question: "¿Como se carga?",
    answer:
      "Con cable USB universal (incluido). Una carga completa toma aproximadamente 1 hora y te dura todo el dia de uso.",
  },
  {
    question: "¿Necesita pilas?",
    answer:
      "No. Tiene bateria recargable integrada de larga duracion. Sin pilas, sin reemplazos. Solo conectas el USB, cargas y listo.",
  },
  {
    question: "¿Es apto para todo tipo de pestañas?",
    answer:
      "Si. El control de temperatura entre 60 y 80 grados permite ajustar la intensidad segun tu tipo de pestaña: finas, gruesas, largas o cortas.",
  },
  {
    question: "¿Puedo usarlo con mascara de pestañas?",
    answer:
      "Si. Recomendamos aplicar primero el rizador y despues la mascara para un efecto mas duradero y definido.",
  },
  {
    question: "¿Es portatil?",
    answer:
      "Pesa solo 31 gramos y mide 14 cm de largo. Cabe perfectamente en cualquier cartera, neceser o bolso de viaje.",
  },
  {
    question: "¿Como es el envio en Paraguay?",
    answer: "Delivery gratis a todo el Paraguay. Entrega en 1 a 3 dias habiles.",
  },
  {
    question: "¿Como pago?",
    answer:
      "Aceptamos pago contra entrega (efectivo al recibir), tarjeta de credito y debito, y transferencia bancaria.",
  },
  {
    question: "¿Que pasa si llega con algun defecto?",
    answer:
      "Si tu rizador llega con algun defecto o dañado, te enviamos uno nuevo sin costo. Avisanos por WhatsApp en las primeras 24 horas desde la recepcion.",
  },
];

export const FAQSectionRizador = () => {
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

export default FAQSectionRizador;
