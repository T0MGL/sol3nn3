import { motion, AnimatePresence } from "framer-motion";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

interface LivePurchaseNotificationProps {
  isVisible: boolean;
  buyerName: string;
  buyerCity: string;
}

export const LivePurchaseNotification = ({
  isVisible,
  buyerName,
  buyerCity,
}: LivePurchaseNotificationProps) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
          className="fixed bottom-24 left-4 right-4 md:left-auto md:right-6 md:bottom-6 z-[60] md:max-w-sm"
        >
          <div className="bg-secondary/95 backdrop-blur-sm border border-green-500/30 rounded-lg p-4 shadow-lg">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <CheckCircleIcon className="w-6 h-6 text-green-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">
                  {buyerName} de {buyerCity}
                </p>
                <p className="text-xs text-foreground/60 mt-0.5">
                  acaba de comprar el PDRN Serum
                </p>
              </div>
              <span className="text-xs text-foreground/40 flex-shrink-0">
                ahora
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Paraguayan women's names
const PARAGUAYAN_NAMES = [
  "María", "Ana", "Lucía", "Sofía", "Valentina", "Camila", "Florencia",
  "Paula", "Laura", "Daniela", "Carolina", "Mariana", "Gabriela", "Romina",
  "Verónica", "Leticia", "Silvia", "Andrea", "Natalia", "Fernanda",
];

export const getRandomBuyer = () => {
  const index = Math.floor(Math.random() * PARAGUAYAN_NAMES.length);
  return { name: PARAGUAYAN_NAMES[index], city: "Asunción" };
};
