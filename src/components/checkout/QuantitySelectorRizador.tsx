import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { XMarkIcon, TruckIcon, GiftIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import type { PackVariant } from "@/services/orderService";

interface QuantitySelectorRizadorProps {
  isOpen: boolean;
  onClose: () => void;
  onContinue: (
    quantity: number,
    totalPrice: number,
    unitPrice: number,
    packVariant: PackVariant
  ) => void;
}

interface RizadorBundle {
  id: string;
  quantity: number;
  price: number;
  unitPrice: number;
  anchor: number;
  label: string;
  badge: string | null;
  highlighted: boolean;
  savings?: number;
  gift: string | null;
  packVariant: Extract<PackVariant, "individual" | "duo">;
}

const BUNDLES: readonly RizadorBundle[] = [
  {
    id: "individual",
    quantity: 1,
    price: 159000,
    unitPrice: 159000,
    anchor: 209000,
    label: "1 Rizador Electrico",
    badge: null,
    highlighted: false,
    gift: null,
    packVariant: "individual",
  },
  {
    id: "duo",
    quantity: 2,
    price: 269000,
    unitPrice: 134500,
    anchor: 418000,
    label: "Pack Duo, 2 rizadores",
    badge: "IDEAL PARA REGALAR: Ahorras Gs. 49.000",
    highlighted: true,
    savings: 49000,
    gift: "Perfecto para compartir con una amiga",
    packVariant: "duo",
  },
] as const;

export const QuantitySelectorRizador = ({ isOpen, onClose, onContinue }: QuantitySelectorRizadorProps) => {
  const [selectedBundleIndex, setSelectedBundleIndex] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setSelectedBundleIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const selectedBundle = BUNDLES[selectedBundleIndex];

  const handleContinue = () => {
    onContinue(
      selectedBundle.quantity,
      selectedBundle.price,
      selectedBundle.unitPrice,
      selectedBundle.packVariant
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-background/60 z-[100] flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-[500px] bg-gradient-to-b from-secondary to-background border border-border/50 rounded-xl p-8 md:p-10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] max-h-[90dvh] overflow-y-auto"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Cerrar"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>

            <div className="space-y-8">
              <div className="space-y-4 text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground leading-tight">
                  Elegi tu opcion
                </h2>
                <p className="text-base text-muted-foreground leading-relaxed">
                  Rizador de Pestañas Electrico Solenne
                </p>
              </div>

              <div className="space-y-5 pt-2">
                {BUNDLES.map((bundle, index) => {
                  const isSelected = selectedBundleIndex === index;

                  return (
                    <motion.button
                      key={bundle.id}
                      onClick={() => setSelectedBundleIndex(index)}
                      className={`
                        relative w-full p-5 rounded-lg border-2 transition-all duration-300 text-left
                        ${isSelected
                          ? bundle.highlighted
                            ? "border-primary bg-primary/10 shadow-lg shadow-primary/20"
                            : "border-primary bg-primary/5"
                          : bundle.highlighted
                            ? "border-primary/40 bg-secondary/20 hover:border-primary/60"
                            : "border-border/30 bg-secondary/10 hover:border-border/50"
                        }
                        ${bundle.highlighted ? "ring-2 ring-primary/30" : ""}
                      `}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {bundle.badge && (
                        <div
                          className={`
                            absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[11px] font-bold whitespace-nowrap
                            ${bundle.highlighted
                              ? "bg-gradient-to-r from-primary to-[#A67265] text-foreground shadow-lg"
                              : "bg-gold text-black"
                            }
                          `}
                        >
                          {bundle.badge}
                        </div>
                      )}

                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-4">
                          <div
                            className={`
                              w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0
                              ${isSelected ? "border-primary" : "border-border/50"}
                            `}
                          >
                            {isSelected && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="w-3 h-3 rounded-full bg-primary"
                              />
                            )}
                          </div>

                          <div>
                            <p className={`text-lg font-bold ${bundle.highlighted ? "text-primary" : "text-foreground"}`}>
                              {bundle.label}
                            </p>
                            {bundle.quantity > 1 && (
                              <p className="text-xs text-muted-foreground mt-0.5">
                                {bundle.unitPrice.toLocaleString("es-PY")} Gs c/u
                              </p>
                            )}
                            {bundle.gift && (
                              <div className="flex items-center gap-1 mt-1.5">
                                <GiftIcon className="w-3.5 h-3.5 text-gold" />
                                <p className="text-[11px] text-gold font-semibold">
                                  {bundle.gift}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="text-right flex-shrink-0">
                          <p className="text-[11px] text-muted-foreground line-through">
                            Gs. {bundle.anchor.toLocaleString("es-PY")}
                          </p>
                          <p className={`text-2xl font-bold ${bundle.highlighted ? "text-primary" : "text-foreground"}`}>
                            {bundle.price.toLocaleString("es-PY")} Gs
                          </p>
                          {"savings" in bundle && bundle.savings && (
                            <p className="text-[11px] text-gold font-medium mt-0.5">
                              Ahorras {bundle.savings.toLocaleString("es-PY")} Gs
                            </p>
                          )}
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                <div className="flex items-center justify-center gap-2">
                  <TruckIcon className="w-5 h-5 text-primary" />
                  <p className="text-sm text-primary font-medium">
                    Envio gratis a todo el Paraguay
                  </p>
                </div>
              </div>

              <Button
                onClick={handleContinue}
                variant="hero"
                size="xl"
                className="w-full h-14 text-base font-semibold"
              >
                Continuar: {selectedBundle.price.toLocaleString("es-PY")} Gs
              </Button>

              <p className="text-center text-xs text-muted-foreground/60 leading-relaxed">
                Soporte real por WhatsApp · Envios a todo Paraguay · Pago al recibir
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default QuantitySelectorRizador;
