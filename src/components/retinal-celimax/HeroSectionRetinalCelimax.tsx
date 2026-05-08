import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  ArrowTrendingUpIcon,
  ShieldCheckIcon,
  ArrowPathIcon,
  SunIcon,
  HeartIcon,
  GiftIcon,
  TruckIcon,
} from "@heroicons/react/24/outline";
import { StarIcon } from "@heroicons/react/24/solid";
import { motion, AnimatePresence } from "framer-motion";
import paymentMethodsImage from "@/assets/payments/payment-methods.webp";
import hero1Image from "@/assets/products/retinal-celimax/hero1.webp";
import hero2Image from "@/assets/products/retinal-celimax/hero2.webp";
import hero3Image from "@/assets/products/retinal-celimax/hero3.webp";
import hero4Image from "@/assets/products/retinal-celimax/hero4.webp";
import hero5Image from "@/assets/products/retinal-celimax/hero5.webp";
import { LivePurchaseNotification, getRandomBuyer } from "@/components/LivePurchaseNotification";
import { trackViewContent } from "@/lib/meta-pixel";
import { PRODUCTS } from "@/lib/products";
import { getDeliveryDates } from "@/lib/delivery-utils";
import {
  RETINAL_CELIMAX_BUNDLES,
  type RetinalCelimaxBundle,
  type RetinalCelimaxPackVariant,
} from "@/data/retinalCelimaxProduct";

interface HeroSectionRetinalCelimaxProps {
  onBuyClick: (bundle: RetinalCelimaxBundle) => void;
}

const HERO_STOCK_STORAGE_KEY = "solenne-retinal-celimax-stock";

const DEFAULT_BUNDLE_ID: RetinalCelimaxPackVariant =
  RETINAL_CELIMAX_BUNDLES.find((b) => b.highlighted)?.id ?? "duo";

export const HeroSectionRetinalCelimax = ({
  onBuyClick,
}: HeroSectionRetinalCelimaxProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [hasPeeked, setHasPeeked] = useState(false);
  const [selectedBundleId, setSelectedBundleId] =
    useState<RetinalCelimaxPackVariant>(DEFAULT_BUNDLE_ID);

  const [showPurchaseNotification, setShowPurchaseNotification] = useState(false);
  const [currentBuyer, setCurrentBuyer] = useState(() => getRandomBuyer());
  const hasShownPurchaseRef = useRef(false);

  const deliveryDates = useMemo(() => getDeliveryDates(), []);

  const selectedBundle = useMemo(
    () =>
      RETINAL_CELIMAX_BUNDLES.find((b) => b.id === selectedBundleId) ??
      RETINAL_CELIMAX_BUNDLES[0],
    [selectedBundleId]
  );

  const [stockLeft, setStockLeft] = useState(() => {
    const today = new Date().toDateString();
    const stored = localStorage.getItem(HERO_STOCK_STORAGE_KEY);

    if (stored) {
      const data = JSON.parse(stored);
      if (data.date === today) return data.stock;
    }

    const newStock = 22;
    localStorage.setItem(HERO_STOCK_STORAGE_KEY, JSON.stringify({ date: today, stock: newStock }));
    return newStock;
  });

  const [displayStock, setDisplayStock] = useState(stockLeft);
  const [stockAnimating, setStockAnimating] = useState(false);

  const slides = [
    { image: hero1Image, alt: "Aplicación del Celimax Retinal Shot sobre el rostro" },
    { image: hero2Image, alt: "Celimax Retinal Shot, booster antiedad con 0.1% nano-retinal" },
    { image: hero3Image, alt: "Antes y después del uso del Celimax Retinal Shot en poros" },
    { image: hero4Image, alt: "Beneficios del Celimax Retinal Shot" },
    { image: hero5Image, alt: "Sistema A-Shot del Celimax Retinal Shot, complejo de triple elasticidad" },
  ];

  useEffect(() => {
    trackViewContent(PRODUCTS.celimax);
  }, []);

  useEffect(() => {
    if (hasPeeked || hasInteracted || currentSlide !== 0) return;

    const peekTimer = setTimeout(() => {
      if (hasInteracted) return;
      setCurrentSlide(1);
      setTimeout(() => {
        if (!hasInteracted) setCurrentSlide(0);
      }, 1000);
      setHasPeeked(true);
    }, 2200);

    return () => clearTimeout(peekTimer);
  }, [hasPeeked, hasInteracted, currentSlide]);

  useEffect(() => {
    if (hasShownPurchaseRef.current) return;

    const purchaseTimer = setTimeout(() => {
      if (hasShownPurchaseRef.current) return;
      hasShownPurchaseRef.current = true;

      setCurrentBuyer(getRandomBuyer());
      setShowPurchaseNotification(true);

      setTimeout(() => {
        const newStock = Math.max(stockLeft - 1, 1);
        setStockAnimating(true);

        setTimeout(() => {
          setDisplayStock(newStock);
          setStockLeft(newStock);

          const today = new Date().toDateString();
          localStorage.setItem(
            HERO_STOCK_STORAGE_KEY,
            JSON.stringify({ date: today, stock: newStock })
          );

          setTimeout(() => setStockAnimating(false), 1500);
        }, 300);
      }, 1500);

      setTimeout(() => setShowPurchaseNotification(false), 4000);
    }, 8000);

    return () => clearTimeout(purchaseTimer);
  }, [stockLeft]);

  return (
    <section className="relative min-h-[85vh] flex items-start overflow-hidden bg-background">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(192,139,122,0.08),transparent_70%)] pointer-events-none" />

      <div className="container max-w-[1400px] mx-auto px-4 md:px-6 lg:px-12 relative z-10 pt-[80px] md:pt-36 pb-6 md:pb-12">
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-4 md:gap-8 items-start">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            className="relative order-1 w-full"
          >
            <motion.div
              layout
              className="absolute top-2 left-2 z-20 bg-primary px-2 py-1 rounded-md shadow-lg overflow-hidden"
              initial={false}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            >
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="text-foreground text-[10px] md:text-xs font-semibold whitespace-nowrap"
              >
                NUEVO
              </motion.p>
            </motion.div>

            <div className="relative w-full lg:max-w-[640px] lg:mx-auto -mx-4 md:mx-0 leading-[0]">
              <div className="relative w-full aspect-[4/5] md:aspect-[4/5] lg:aspect-[3/4] overflow-hidden rounded-none md:rounded-lg bg-background">
                <div className="absolute inset-0 -z-10 rounded-full blur-[80px] bg-primary/20 animate-glow-breathe scale-75" />
                <div className="absolute inset-[10%] -z-10 rounded-full blur-[40px] bg-primary/15" />

                <AnimatePresence mode="popLayout">
                  <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.18}
                    onDragEnd={(_, info) => {
                      const threshold = 50;
                      if (info.offset.x < -threshold) {
                        setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
                        setHasInteracted(true);
                      } else if (info.offset.x > threshold) {
                        setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
                        setHasInteracted(true);
                      }
                    }}
                    className="w-full h-full absolute inset-0 cursor-grab active:cursor-grabbing touch-pan-y"
                  >
                    <img
                      src={slides[currentSlide].image}
                      alt={slides[currentSlide].alt}
                      className="w-full h-full object-cover select-none pointer-events-none"
                      loading={currentSlide === 0 ? "eager" : "lazy"}
                      decoding="async"
                      draggable={false}
                    />
                  </motion.div>
                </AnimatePresence>

                <button
                  onClick={() => {
                    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
                    setHasInteracted(true);
                  }}
                  className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-foreground/60 hover:bg-foreground/80 text-background w-9 h-9 rounded-full items-center justify-center transition-all shadow-lg backdrop-blur-sm"
                  aria-label="Slide anterior"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                    <path fillRule="evenodd" d="M11.78 5.22a.75.75 0 0 1 0 1.06L8.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z" clipRule="evenodd" />
                  </svg>
                </button>
                <button
                  onClick={() => {
                    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
                    setHasInteracted(true);
                  }}
                  className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-foreground/60 hover:bg-foreground/80 text-background w-9 h-9 rounded-full items-center justify-center transition-all shadow-lg backdrop-blur-sm"
                  aria-label="Slide siguiente"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                    <path fillRule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 1 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                  </svg>
                </button>

                <div className="absolute bottom-3 md:bottom-4 left-1/2 -translate-x-1/2 z-20 flex justify-center gap-2 px-3 py-1.5 rounded-full bg-foreground/40 backdrop-blur-md">
                  {slides.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setCurrentSlide(index);
                        setHasInteracted(true);
                      }}
                      className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                        index === currentSlide ? "bg-background w-6" : "bg-background/50 hover:bg-background/80 w-2"
                      }`}
                      aria-label={`Ir a slide ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.4, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
            className="space-y-4 md:space-y-6 order-2 w-full"
          >
            <div className="space-y-4 md:space-y-5">
              <div className="h-0.5 w-10 bg-primary/40" />

              <motion.h1
                className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-tight"
                initial={{ clipPath: "inset(0 100% 0 0)" }}
                whileInView={{ clipPath: "inset(0 0% 0 0)" }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                Reafirma <span className="italic">de verdad</span>
              </motion.h1>
              <p className="text-lg md:text-xl text-primary font-medium">
                Celimax Retinal Shot, Antiedad Reafirmante Coreano | 15 ml
              </p>
              <p className="text-base md:text-lg text-muted-foreground font-light">
                Reduce líneas finas y arrugas con la versión más avanzada del retinol. Más eficiente que el retinol convencional, más amable que la tretinoína.
              </p>

              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-0.5">
                  <StarIcon className="w-5 h-5 text-accent" />
                  <StarIcon className="w-5 h-5 text-accent" />
                  <StarIcon className="w-5 h-5 text-accent" />
                  <StarIcon className="w-5 h-5 text-accent" />
                  <div className="relative w-5 h-5">
                    <StarIcon className="w-5 h-5 text-muted-foreground/30 absolute" />
                    <div className="overflow-hidden absolute inset-0" style={{ width: '80%' }}>
                      <StarIcon className="w-5 h-5 text-accent" />
                    </div>
                  </div>
                </div>
                <p className="text-sm text-foreground/80 font-medium">
                  4.8/5 (2.847 clientas)
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 md:gap-4 py-2">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <ArrowPathIcon className="w-6 h-6 text-primary" />
                </div>
                <span className="text-sm md:text-base font-medium text-foreground">Reduce líneas y arrugas</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <ArrowTrendingUpIcon className="w-6 h-6 text-primary" />
                </div>
                <span className="text-sm md:text-base font-medium text-foreground">Reafirma sin irritar</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <ShieldCheckIcon className="w-6 h-6 text-primary" />
                </div>
                <span className="text-sm md:text-base font-medium text-foreground">Tolerancia superior al retinol</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <SunIcon className="w-6 h-6 text-primary" />
                </div>
                <span className="text-sm md:text-base font-medium text-foreground">Piel uniforme y luminosa</span>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm md:text-base text-foreground/70 leading-relaxed">
                Antiedad real con la versión más avanzada del retinol. El retinal trabaja un paso antes en tu piel: misma renovación celular que reduce líneas finas y arrugas, con tolerancia más amable que el retinol convencional. Diseñado para sumarse a tu rutina sin pelearse con tu PDRN.
              </p>
              <p className="text-xs md:text-sm text-primary font-medium">
                Frasco 15 ml · Rinde 6 a 8 semanas · Resultado antiedad pleno entre semanas 8 y 12
              </p>
            </div>

            <div className="space-y-2.5 pt-1">
              <p className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">
                Elegí tu pack
              </p>
              {RETINAL_CELIMAX_BUNDLES.map((bundle) => {
                const isSelected = selectedBundleId === bundle.id;
                const isGift = bundle.id === "trio";

                const cardBase =
                  "relative w-full p-3.5 md:p-4 rounded-lg border-2 transition-all duration-300 text-left";
                const cardSelected = isGift
                  ? "border-[#C9A961] bg-[rgba(201,169,97,0.12)] shadow-md shadow-[rgba(201,169,97,0.2)]"
                  : bundle.highlighted
                    ? "border-primary bg-primary/10 shadow-md shadow-primary/15"
                    : "border-primary bg-primary/5";
                const cardIdle = isGift
                  ? "border-[#C9A961]/45 bg-[rgba(201,169,97,0.06)] hover:border-[#C9A961]/70"
                  : bundle.highlighted
                    ? "border-primary/40 bg-secondary/20 hover:border-primary/60"
                    : "border-border/40 bg-secondary/10 hover:border-border/60";

                const radioBorder = isSelected
                  ? isGift
                    ? "border-[#C9A961]"
                    : "border-primary"
                  : "border-border/50";
                const radioFill = isGift ? "bg-[#C9A961]" : "bg-primary";
                const labelColor = isGift
                  ? "text-[#C9A961]"
                  : bundle.highlighted
                    ? "text-primary"
                    : "text-foreground";
                const priceColor = isGift
                  ? "text-[#C9A961]"
                  : bundle.highlighted
                    ? "text-primary"
                    : "text-foreground";
                const savingsColor = isGift ? "text-[#C9A961]/85" : "text-gold";

                return (
                  <motion.button
                    key={bundle.id}
                    onClick={() => setSelectedBundleId(bundle.id)}
                    className={`${cardBase} ${isSelected ? cardSelected : cardIdle}`}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    aria-pressed={isSelected}
                  >
                    {bundle.badge && (
                      <div
                        className={`absolute -top-2.5 left-3 px-2.5 py-0.5 rounded-full text-[10px] font-bold whitespace-nowrap flex items-center gap-1 ${
                          isGift
                            ? "bg-gradient-to-r from-[#C9A961] to-[#B89248] text-black shadow"
                            : bundle.highlighted
                              ? "bg-gradient-to-r from-primary to-[#A67265] text-foreground shadow"
                              : "bg-gold text-black"
                        }`}
                      >
                        {isGift && <HeartIcon className="w-3 h-3" strokeWidth={2.5} />}
                        {bundle.badge}
                      </div>
                    )}

                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0 ${radioBorder}`}
                        >
                          {isSelected && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className={`w-2.5 h-2.5 rounded-full ${radioFill}`}
                            />
                          )}
                        </div>

                        <div className="min-w-0">
                          <p className={`text-sm md:text-base font-bold ${labelColor}`}>
                            {bundle.label}
                          </p>
                          <p className="text-[11px] md:text-xs text-muted-foreground mt-0.5">
                            {bundle.unitPrice.toLocaleString("es-PY")} Gs c/frasco
                          </p>
                          {isGift && (
                            <div className="flex items-center gap-1 mt-1">
                              <GiftIcon className="w-3 h-3 text-[#C9A961]" />
                              <p className="text-[10px] font-semibold text-[#C9A961] leading-tight">
                                Regalo Día de la Madre
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="text-right flex-shrink-0">
                        <p className="text-[10px] text-muted-foreground line-through leading-tight">
                          Gs. {bundle.anchorPrice.toLocaleString("es-PY")}
                        </p>
                        <p className={`text-lg md:text-xl font-bold leading-tight ${priceColor}`}>
                          {bundle.totalPrice.toLocaleString("es-PY")} Gs
                        </p>
                        {bundle.savings > 0 && (
                          <p className={`text-[10px] font-medium leading-tight mt-0.5 ${savingsColor}`}>
                            Ahorrás {bundle.savings.toLocaleString("es-PY")} Gs
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.button>
                );
              })}

              <div className="flex items-center justify-center gap-1.5 pt-1.5">
                <TruckIcon className="w-4 h-4 text-primary" />
                <p className="text-[11px] md:text-xs text-primary font-medium">
                  Envío gratis a todo Paraguay · Pago al recibir
                </p>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{
                opacity: 1,
                scale: stockAnimating ? [1, 1.08, 1] : 1,
                borderColor: stockAnimating
                  ? ["rgba(166, 114, 101, 0.3)", "rgba(166, 114, 101, 0.8)", "rgba(166, 114, 101, 0.3)"]
                  : "rgba(212, 169, 154, 1)",
              }}
              transition={{
                delay: stockAnimating ? 0 : 0.3,
                duration: stockAnimating ? 0.6 : 0.4,
                repeat: stockAnimating ? 2 : 0,
              }}
              className={`inline-flex items-center gap-2 px-4 py-2 bg-[rgba(212,169,154,0.2)] border border-[#D4A99A] rounded-lg transition-all ${
                stockAnimating ? "shadow-[0_0_20px_rgba(192,139,122,0.5)]" : ""
              }`}
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#A67265] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#A67265]"></span>
              </span>
              <span className="text-sm font-semibold text-[#A67265]">
                Solo quedan{" "}
                <AnimatePresence mode="wait">
                  <motion.span
                    key={displayStock}
                    initial={{ opacity: 0, y: -20, scale: 1.5 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.5 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className={`inline-block font-bold ${stockAnimating ? "text-foreground" : ""}`}
                  >
                    {displayStock}
                  </motion.span>
                </AnimatePresence>{" "}
                frascos del primer lote
              </span>
            </motion.div>

            <div className="space-y-3">
              <motion.div
                animate={{ scale: [1, 1.015, 1] }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  repeatType: "loop",
                  ease: "easeInOut",
                }}
              >
                <Button
                  data-hero-cta
                  variant="hero"
                  size="xl"
                  className="w-full h-14 md:h-16 text-base md:text-lg font-bold shadow-[0_8px_24px_rgba(192,139,122,0.4)] tracking-[0.15em] rounded-[2px]"
                  style={{ background: "#C08B7A" }}
                  onClick={() => onBuyClick(selectedBundle)}
                >
                  COMPRAR AHORA: Gs. {selectedBundle.totalPrice.toLocaleString("es-PY")}
                </Button>
              </motion.div>

              <p className="text-sm text-center text-accent font-medium">
                Pedí hoy y recibí entre el {deliveryDates.startDay} y {deliveryDates.endDay}
              </p>

              <div className="flex items-center justify-center gap-1.5 text-xs text-[#C9A961] font-semibold tracking-wide">
                <HeartIcon className="w-3.5 h-3.5" strokeWidth={2.5} />
                <span>Llega antes del 15 de mayo · Día de la Madre</span>
              </div>
            </div>

            <div className="flex justify-center pt-2">
              <img
                src={paymentMethodsImage}
                alt="Visa, Mastercard, Apple Pay, Google Pay"
                className="h-8 md:h-9 w-auto opacity-80"
              />
            </div>
          </motion.div>
        </div>
      </div>

      <LivePurchaseNotification
        isVisible={showPurchaseNotification}
        buyerName={currentBuyer.name}
        buyerCity={currentBuyer.city}
        productLabel="el Celimax Retinal Shot"
      />
    </section>
  );
};

export default HeroSectionRetinalCelimax;
