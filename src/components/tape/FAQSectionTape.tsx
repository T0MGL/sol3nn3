import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "framer-motion";

const faqs = [
  {
    question: "¿Qué son los parches invisibles para la cara?",
    answer:
      "Son cintas adhesivas invisibles diseñadas para dar un efecto lifting temporal en mejillas, papada, contorno facial y párpados. Las usás el día que querés lucir más firme y radiante, y las retirás al final del día.",
  },
  {
    question: "¿Cómo se aplica?",
    answer:
      "En 3 pasos simples. 1) Colocás la cinta en la zona a tensar. 2) Estirás suavemente hacia arriba y hacia atrás. 3) Fijás la punta detrás de la oreja o bajo el cabello. Listo, 30 segundos en total.",
  },
  {
    question: "¿Es invisible de verdad?",
    answer:
      "Sí, 100% invisible. Pasan desapercibidas incluso con el cabello suelto, en fotos con flash y frente a cámaras. Diseñadas con material ultra fino color piel y acabado mate.",
  },
  {
    question: "¿Resisten agua y sudor?",
    answer:
      "Sí. El adhesivo premium mantiene el efecto todo el día, en eventos largos, bodas al aire libre, fotos, reuniones o salidas largas.",
  },
  {
    question: "¿Cuánto dura el efecto?",
    answer:
      "El efecto es inmediato y dura mientras la usás. Se retira al final del día. Es ideal para ocasiones especiales o cuando querés lucir tu mejor versión sin comprometerte a nada permanente.",
  },
  {
    question: "¿Cuántas cintas trae cada caja?",
    answer:
      "Cada caja contiene 100 parches. Si la usás para eventos puntuales (una boda, una reunión, una cena), te dura varias semanas.",
  },
  {
    question: "¿Es apto para piel sensible?",
    answer:
      "El adhesivo es hipoalergénico y apto para la mayoría de los tipos de piel. Si tenés piel muy sensible o historial de reacciones, te recomendamos hacer una prueba en una zona pequeña primero.",
  },
  {
    question: "¿Puedo usarlo con maquillaje?",
    answer:
      "Sí. Aplicá la cinta primero, y seguí con tu rutina habitual: base, polvo, rubor, contour. Es invisible y compatible con bases líquidas, polvos y todo tipo de cosméticos.",
  },
  {
    question: "¿Cómo es el envío en Paraguay?",
    answer: "Delivery gratis a todo el Paraguay. Entrega en 1 a 3 días hábiles.",
  },
  {
    question: "¿Cómo pago?",
    answer:
      "Aceptamos pago contra entrega (efectivo al recibir), tarjeta de crédito y débito, y transferencia bancaria.",
  },
  {
    question: "¿Qué pasa si la caja llega dañada?",
    answer:
      "Si tu caja llega dañada o sellada incorrectamente, te enviamos una nueva sin costo. Avisanos por WhatsApp en las primeras 24 horas desde la recepción.",
  },
  {
    question: "¿Sirve para hombres?",
    answer:
      "Sí. La cinta no tiene género y funciona en cualquier tipo de rostro. Se aplica igual en mejillas, papada o contorno.",
  },
];

export const FAQSectionTape = () => {
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

export default FAQSectionTape;
