import { useState, useEffect, useMemo, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  EyeSlashIcon,
  BoltIcon,
  SparklesIcon,
  FaceSmileIcon,
} from "@heroicons/react/24/outline";
import { StarIcon } from "@heroicons/react/24/solid";
import { motion, AnimatePresence } from "framer-motion";
import paymentMethodsImage from "@/assets/payments/payment-methods.webp";
import faceTapeHero from "@/assets/products/tape/face-tape-hero.webp";
import faceTapeApplication from "@/assets/products/tape/face-tape-application.webp";
import faceTapeResult from "@/assets/products/tape/face-tape-result.webp";
import faceTapePackaging from "@/assets/products/tape/face-tape-packaging.webp";
import faceTapeLifestyle from "@/assets/products/tape/face-tape-lifestyle.webp";
import { LivePurchaseNotification, getRandomBuyer } from "@/components/LivePurchaseNotification";
import { trackTapeViewContent } from "@/lib/meta-pixel";
import { getDeliveryDates } from "@/lib/delivery-utils";

interface HeroSectionTapeProps {
  onBuyClick: () => void;
}

const HERO_STOCK_STORAGE_KEY = "solenne-tape-stock";

export const HeroSectionTape = ({ onBuyClick }: HeroSectionTapeProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [hasPeeked, setHasPeeked] = useState(false);

  const [showPurchaseNotification, setShowPurchaseNotification] = useState(false);
  const [currentBuyer, setCurrentBuyer] = useState(() => getRandomBuyer());
  const hasShownPurchaseRef = useRef(false);

  const deliveryDates = useMemo(() => getDeliveryDates(), []);

  const [stockLeft, setStockLeft] = useState(() => {
    const today = new Date().toDateString();
    const stored = localStorage.getItem(HERO_STOCK_STORAGE_KEY);

    if (stored) {
      const data = JSON.parse(stored);
      if (data.date === today) return data.stock;
    }

    const newStock = 12;
    localStorage.setItem(HERO_STOCK_STORAGE_KEY, JSON.stringify({ date: today, stock: newStock }));
    return newStock;
  });

  const [displayStock, setDisplayStock] = useState(stockLeft);
  const [stockAnimating, setStockAnimating] = useState(false);

  const slides = [
    {
      image: faceTapeHero,
      alt: "SOLENNE V-Shaped Face Tape - Packaging",
    },
    {
      image: faceTapeApplication,
      alt: "SOLENNE V-Shaped Face Tape - Aplicación en 30 segundos",
    },
    {
      image: faceTapeResult,
      alt: "SOLENNE V-Shaped Face Tape - Resultado invisible",
    },
    {
      image: faceTapePackaging,
      alt: "SOLENNE V-Shaped Face Tape - Caja de 100 parches",
    },
    {
      image: faceTapeLifestyle,
      alt: "SOLENNE V-Shaped Face Tape - Lista para tu evento",
    },
  ];

  useEffect(() => {
    trackTapeViewContent();

    const preloadTimer = setTimeout(() => {
      import("@/components/checkout/QuantitySelectorTape");
      import("@/components/checkout/PhoneNameForm");
      import("@/components/checkout/CheckoutModal");
    }, 2000);

    return () => clearTimeout(preloadTimer);
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
    }, 2000);

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
              className="absolute top-4 left-2 md:top-2 md:left-4 z-20 bg-primary px-3 py-1.5 rounded-md shadow-lg overflow-hidden"
              initial={false}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            >
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="text-foreground text-xs md:text-sm font-semibold whitespace-nowrap"
              >
                Nuevo en Paraguay
              </motion.p>
            </motion.div>

            <div className="relative w-full max-w-[500px] mx-auto">
              <div className="relative w-full aspect-square overflow-hidden rounded-lg">
                <div className="absolute inset-0 -z-10 rounded-full blur-[60px] bg-primary/20 animate-glow-breathe scale-75" />
                <div className="absolute inset-[10%] -z-10 rounded-full blur-[30px] bg-primary/15" />

                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -40 }}
                    transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                    className="w-full h-full"
                  >
                    <motion.div
                      animate={{ y: [0, -8, 0] }}
                      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                      className="w-full h-full"
                    >
                      <img
                        src={slides[currentSlide].image}
                        alt={slides[currentSlide].alt}
                        className="w-full h-full object-contain"
                        loading={currentSlide === 0 ? "eager" : "lazy"}
                        decoding="async"
                      />
                    </motion.div>
                  </motion.div>
                </AnimatePresence>

                <button
                  onClick={() => {
                    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
                    setHasInteracted(true);
                  }}
                  className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-foreground/60 hover:bg-foreground/80 text-background w-9 h-9 rounded-full flex items-center justify-center transition-all shadow-lg backdrop-blur-sm"
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
                  className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-foreground/60 hover:bg-foreground/80 text-background w-9 h-9 rounded-full flex items-center justify-center transition-all shadow-lg backdrop-blur-sm"
                  aria-label="Slide siguiente"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                    <path fillRule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 1 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>

              <div className="flex justify-center gap-2 mt-4">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setCurrentSlide(index);
                      setHasInteracted(true);
                    }}
                    className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                      index === currentSlide ? "bg-primary w-6" : "bg-primary/40 hover:bg-primary/60 w-2"
                    }`}
                    aria-label={`Ir a slide ${index + 1}`}
                  />
                ))}
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
                Parches <span className="italic">Invisibles</span>
              </motion.h1>
              <p className="text-lg md:text-xl text-primary font-medium">
                Para la Cara | 100 unidades
              </p>
              <p className="text-base md:text-lg text-muted-foreground font-light">
                Lifting instantaneo en 30 segundos, antes de tu evento.
              </p>

              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-0.5">
                  <StarIcon className="w-5 h-5 text-accent" />
                  <StarIcon className="w-5 h-5 text-accent" />
                  <StarIcon className="w-5 h-5 text-accent" />
                  <StarIcon className="w-5 h-5 text-accent" />
                  <StarIcon className="w-5 h-5 text-accent" />
                </div>
                <p className="text-sm text-foreground/80 font-medium">
                  Tu aliada antes de cada evento
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 md:gap-4 py-2">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <EyeSlashIcon className="w-6 h-6 text-primary" />
                </div>
                <span className="text-sm md:text-base font-medium text-foreground">100% invisible</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <BoltIcon className="w-6 h-6 text-primary" />
                </div>
                <span className="text-sm md:text-base font-medium text-foreground">Resultado al instante</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <SparklesIcon className="w-6 h-6 text-primary" />
                </div>
                <span className="text-sm md:text-base font-medium text-foreground">Resistente al agua</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <FaceSmileIcon className="w-6 h-6 text-primary" />
                </div>
                <span className="text-sm md:text-base font-medium text-foreground">Con tu maquillaje</span>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm md:text-base text-foreground/70 leading-relaxed">
                Cinta adhesiva ultra fina color piel que tensa mejillas, papada, contorno y párpados sin que nadie lo note. Tu mejor aliada antes de fotos, reuniones y salidas.
              </p>
              <p className="text-xs md:text-sm text-primary font-medium">
                Caja con 100 parches · Aplicación en 3 pasos · 30 segundos
              </p>
            </div>

            <div className="flex items-center gap-3 py-2">
              <span className="text-base text-foreground/40 line-through">Gs. 199.000</span>
              <span className="text-4xl md:text-5xl font-bold text-foreground">Gs. 149.000</span>
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
                cajas en el primer lote
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
                  onClick={onBuyClick}
                >
                  COMPRAR AHORA: Gs. 149.000
                </Button>
              </motion.div>

              <p className="text-sm text-center text-accent font-medium">
                Pedí hoy y recibí entre el {deliveryDates.startDay} y {deliveryDates.endDay}
              </p>
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
        productLabel="el V-Shaped Face Tape"
      />
    </section>
  );
};

export default HeroSectionTape;
