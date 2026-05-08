import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { XMarkIcon, TruckIcon, GiftIcon, HeartIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import type { PackVariant } from "@/services/orderService";
import {
  RETINAL_CELIMAX_BUNDLES,
  type RetinalCelimaxPackVariant,
} from "@/data/retinalCelimaxProduct";

interface QuantitySelectorRetinalCelimaxProps {
  isOpen: boolean;
  onClose: () => void;
  onContinue: (
    quantity: number,
    totalPrice: number,
    unitPrice: number,
    packVariant: PackVariant
  ) => void;
}

type CelimaxOrderVariant = Extract<PackVariant, "individual" | "duo" | "trio">;

interface CelimaxDisplayBundle {
  readonly id: RetinalCelimaxPackVariant;
  readonly quantity: number;
  readonly price: number;
  readonly unitPrice: number;
  readonly anchor: number;
  readonly label: string;
  readonly subtitle: string;
  readonly badge: string | null;
  readonly highlighted: boolean;
  readonly savings: number;
  readonly gift: string | null;
  readonly isGiftPack: boolean;
  readonly orderVariant: CelimaxOrderVariant;
}

const toOrderVariant = (id: RetinalCelimaxPackVariant): CelimaxOrderVariant => {
  if (id === "single") return "individual";
  if (id === "duo") return "duo";
  return "trio";
};

const giftFor = (id: RetinalCelimaxPackVariant): string | null => {
  if (id === "trio") return "Bolsa Solenne de cortesía";
  if (id === "duo") return "Tratamiento completo de 12 a 16 semanas";
  return null;
};

const BUNDLES: readonly CelimaxDisplayBundle[] = RETINAL_CELIMAX_BUNDLES.map(
  (bundle) => ({
    id: bundle.id,
    quantity: bundle.quantity,
    price: bundle.totalPrice,
    unitPrice: bundle.unitPrice,
    anchor: bundle.anchorPrice,
    label: bundle.label,
    subtitle: bundle.subtitle,
    badge: bundle.badge,
    highlighted: bundle.highlighted,
    savings: bundle.savings,
    gift: giftFor(bundle.id),
    isGiftPack: bundle.id === "trio",
    orderVariant: toOrderVariant(bundle.id),
  })
);

const DEFAULT_INDEX = 0;

export const QuantitySelectorRetinalCelimax = ({
  isOpen,
  onClose,
  onContinue,
}: QuantitySelectorRetinalCelimaxProps) => {
  const [selectedBundleIndex, setSelectedBundleIndex] = useState(DEFAULT_INDEX);

  useEffect(() => {
    if (isOpen) {
      setSelectedBundleIndex(DEFAULT_INDEX);
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
      selectedBundle.orderVariant
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
                  Elegí tu Pack Retinal
                </h2>
                <p className="text-base text-muted-foreground leading-relaxed">
                  Un frasco rinde 6 a 8 semanas. El tratamiento completo son 8 a 12 semanas.
                </p>
              </div>

              <div className="space-y-5 pt-2">
                {BUNDLES.map((bundle, index) => {
                  const isSelected = selectedBundleIndex === index;

                  const champagneBorder = "border-[#C9A961]";
                  const champagneSelected = "border-[#C9A961] bg-[rgba(201,169,97,0.12)] shadow-lg shadow-[rgba(201,169,97,0.25)]";
                  const champagneIdle = "border-[#C9A961]/45 bg-[rgba(201,169,97,0.06)] hover:border-[#C9A961]/70";

                  const cardClasses = isSelected
                    ? bundle.isGiftPack
                      ? champagneSelected
                      : bundle.highlighted
                        ? "border-primary bg-primary/10 shadow-lg shadow-primary/20"
                        : "border-primary bg-primary/5"
                    : bundle.isGiftPack
                      ? champagneIdle
                      : bundle.highlighted
                        ? "border-primary/40 bg-secondary/20 hover:border-primary/60"
                        : "border-border/30 bg-secondary/10 hover:border-border/50";

                  const ringClasses = bundle.isGiftPack
                    ? "ring-2 ring-[#C9A961]/35"
                    : bundle.highlighted
                      ? "ring-2 ring-primary/30"
                      : "";

                  const radioBorder = isSelected
                    ? bundle.isGiftPack
                      ? "border-[#C9A961]"
                      : "border-primary"
                    : "border-border/50";

                  const radioFill = bundle.isGiftPack ? "bg-[#C9A961]" : "bg-primary";

                  const labelColor = bundle.isGiftPack
                    ? "text-[#C9A961]"
                    : bundle.highlighted
                      ? "text-primary"
                      : "text-foreground";

                  const priceColor = bundle.isGiftPack
                    ? "text-[#C9A961]"
                    : bundle.highlighted
                      ? "text-primary"
                      : "text-foreground";

                  return (
                    <motion.button
                      key={bundle.id}
                      onClick={() => setSelectedBundleIndex(index)}
                      className={`relative w-full p-5 rounded-lg border-2 transition-all duration-300 text-left ${cardClasses} ${ringClasses}`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {bundle.badge && (
                        <div
                          className={`absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[11px] font-bold whitespace-nowrap flex items-center gap-1.5 ${
                            bundle.isGiftPack
                              ? "bg-gradient-to-r from-[#C9A961] to-[#B89248] text-black shadow-lg"
                              : bundle.highlighted
                                ? "bg-gradient-to-r from-primary to-[#A67265] text-foreground shadow-lg"
                                : "bg-gold text-black"
                          }`}
                        >
                          {bundle.isGiftPack && (
                            <HeartIcon className="w-3 h-3" strokeWidth={2.5} />
                          )}
                          {bundle.badge}
                        </div>
                      )}

                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0 ${radioBorder}`}
                          >
                            {isSelected && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className={`w-3 h-3 rounded-full ${radioFill}`}
                              />
                            )}
                          </div>

                          <div className="min-w-0">
                            <p className={`text-lg font-bold ${labelColor}`}>
                              {bundle.label}
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {bundle.unitPrice.toLocaleString("es-PY")} Gs c/frasco
                            </p>
                            {bundle.isGiftPack && (
                              <p className="text-[11px] text-foreground/85 leading-snug mt-2 italic">
                                {bundle.subtitle}
                              </p>
                            )}
                            {bundle.gift && (
                              <div className="flex items-center gap-1 mt-1.5">
                                <GiftIcon
                                  className={`w-3.5 h-3.5 ${
                                    bundle.isGiftPack ? "text-[#C9A961]" : "text-gold"
                                  }`}
                                />
                                <p
                                  className={`text-[11px] font-semibold ${
                                    bundle.isGiftPack ? "text-[#C9A961]" : "text-gold"
                                  }`}
                                >
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
                          <p className={`text-2xl font-bold ${priceColor}`}>
                            {bundle.price.toLocaleString("es-PY")} Gs
                          </p>
                          {bundle.savings > 0 && (
                            <p
                              className={`text-[11px] font-medium mt-0.5 ${
                                bundle.isGiftPack ? "text-[#C9A961]/80" : "text-gold"
                              }`}
                            >
                              Ahorrás {bundle.savings.toLocaleString("es-PY")} Gs
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
                    Envío gratis a todo el Paraguay
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
                Soporte real por WhatsApp · Envíos a todo Paraguay · Pago al recibir
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default QuantitySelectorRetinalCelimax;
