import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { CountdownTimer } from "@/components/CountdownTimer";
import {
  ArrowPathIcon,
  BeakerIcon,
  ClockIcon,
  ShieldCheckIcon
} from "@heroicons/react/24/outline";
import { StarIcon } from "@heroicons/react/24/solid";
import { motion, AnimatePresence } from "framer-motion";
import paymentMethodsImage from "@/assets/payments/payment-methods.webp";
import lifestyleImage from "@/assets/branding/lifestyle.webp";
import serumCloseupImage from "@/assets/products/serum-closeup.webp";
import serumBenefitsImage from "@/assets/products/serum-benefits.webp";
import firmskinImage from "@/assets/products/firmskin.webp";
import beforeAfterImage from "@/assets/products/serumbeforeafter.webp";
import { LivePurchaseNotification, getRandomBuyer } from "@/components/LivePurchaseNotification";
import { trackViewContent } from "@/lib/meta-pixel";
import { getDeliveryDates } from "@/lib/delivery-utils";

interface HeroSectionProps {
  onBuyClick: () => void;
}

export const HeroSection = ({ onBuyClick }: HeroSectionProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [hasPeeked, setHasPeeked] = useState(false);

  // Live purchase notification
  const [showPurchaseNotification, setShowPurchaseNotification] = useState(false);
  const [currentBuyer, setCurrentBuyer] = useState(() => getRandomBuyer());
  const hasShownPurchaseRef = useRef(false);

  // Memoize delivery dates calculation (doesn't change during session)
  const deliveryDates = useMemo(() => getDeliveryDates(), []);

  // Dynamic stock counter (resets daily, creates urgency)
  const [stockLeft, setStockLeft] = useState(() => {
    const today = new Date().toDateString();
    const stored = localStorage.getItem('solenne-serum-stock');

    if (stored) {
      const data = JSON.parse(stored);
      if (data.date === today) {
        return data.stock;
      }
    }

    // Static stock of 15 units
    const newStock = 15;
    localStorage.setItem('solenne-serum-stock', JSON.stringify({ date: today, stock: newStock }));
    return newStock;
  });

  // Animated stock number display
  const [displayStock, setDisplayStock] = useState(stockLeft);
  const [stockAnimating, setStockAnimating] = useState(false);

  const slides = [
    {
      image: lifestyleImage,
      gradient: "linear-gradient(135deg, #F2EDE4, #E8D5C4)",
      alt: "SOLENNE - PDRN Pink Peptide Serum Lifestyle"
    },
    {
      image: serumCloseupImage,
      gradient: "linear-gradient(135deg, #F2EDE4, #E8D5C4)",
      alt: "SOLENNE PDRN Serum - Foto del producto"
    },
    {
      image: serumBenefitsImage,
      gradient: "linear-gradient(135deg, #F2EDE4, #E8D5C4)",
      alt: "SOLENNE - Beneficios del serum PDRN"
    },
    {
      image: firmskinImage,
      gradient: "linear-gradient(135deg, #F2EDE4, #E8D5C4)",
      alt: "SOLENNE - Resultados de Firmeza Clínicamente Probado"
    },
    {
      image: beforeAfterImage,
      gradient: "linear-gradient(135deg, #F2EDE4, #E8D5C4)",
      alt: "SOLENNE - Efecto Filtro de Brillo Rosa Antes y Después"
    }
  ];

  // Track ViewContent when hero section is viewed
  useEffect(() => {
    trackViewContent();

    // Preload checkout modals after a short delay (for mobile users)
    // This ensures instant response when user clicks CTA
    const preloadTimer = setTimeout(() => {
      import("@/components/checkout/QuantitySelector");
      import("@/components/checkout/PhoneNameForm");
      import("@/components/checkout/StripeCheckoutModal");
    }, 2000); // Wait 2 seconds after page load

    return () => clearTimeout(preloadTimer);
  }, []);

  // Carousel peek animation - briefly shows second slide then returns
  useEffect(() => {
    if (hasPeeked || hasInteracted || currentSlide !== 0) return;

    const peekTimer = setTimeout(() => {
      if (hasInteracted) return;

      // Briefly show the second slide
      setCurrentSlide(1);

      // Return to first slide after 1 second
      setTimeout(() => {
        if (!hasInteracted) {
          setCurrentSlide(0);
        }
      }, 1000);

      setHasPeeked(true);
    }, 2000);

    return () => clearTimeout(peekTimer);
  }, [hasPeeked, hasInteracted, currentSlide]);

  // Live purchase notification - shows once per session after 8 seconds
  useEffect(() => {
    if (hasShownPurchaseRef.current) return;

    const purchaseTimer = setTimeout(() => {
      if (hasShownPurchaseRef.current) return;
      hasShownPurchaseRef.current = true;

      setCurrentBuyer(getRandomBuyer());
      setShowPurchaseNotification(true);

      // Animate stock decrease after notification appears
      setTimeout(() => {
        const newStock = Math.max(stockLeft - 1, 1);

        // Trigger pulse animation on stock indicator
        setStockAnimating(true);

        // Update the display number with dramatic effect
        setTimeout(() => {
          setDisplayStock(newStock);
          setStockLeft(newStock);

          // Update localStorage
          const today = new Date().toDateString();
          localStorage.setItem('solenne-serum-stock', JSON.stringify({ date: today, stock: newStock }));

          // Stop animation after a bit
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
        {/* Mobile-First Layout */}
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-4 md:gap-8 items-start">

          {/* Image Slider - Order 1 on mobile (shows first) */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            className="relative order-1 w-full"
          >
            {/* Authority Badge */}
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
                #1 K-Beauty en Paraguay 🇵🇾
              </motion.p>
            </motion.div>

            {/* Image Carousel */}
            <div className="relative w-full max-w-[500px] mx-auto">
              <div className="relative w-full aspect-square overflow-hidden rounded-lg">
                {/* Outer ambient glow — wide, soft, breathing */}
                <div className="absolute inset-0 -z-10 rounded-full blur-[60px] bg-primary/20 animate-glow-breathe scale-75" />
                {/* Inner contact glow — tight, slightly brighter */}
                <div className="absolute inset-[10%] -z-10 rounded-full blur-[30px] bg-primary/15" />

                {/* Animated Slides */}
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
                        className="w-full h-full object-cover"
                        loading={currentSlide === 0 ? "eager" : "lazy"}
                        decoding="async"
                      />
                    </motion.div>
                  </motion.div>
                </AnimatePresence>

                {/* Navigation Buttons */}
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

              {/* Slide Indicators (dots) */}
              <div className="flex justify-center gap-2 mt-4">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setCurrentSlide(index);
                      setHasInteracted(true);
                    }}
                    className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${index === currentSlide ? 'bg-primary w-6' : 'bg-primary/40 hover:bg-primary/60 w-2'
                      }`}
                    aria-label={`Ir a slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </motion.div>

          {/* Content - Order 2 on mobile */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.4, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
            className="space-y-4 md:space-y-6 order-2 w-full"
          >
            {/* Main Title */}
            <div className="space-y-4 md:space-y-5">
              {/* Decorative Separator */}
              <div className="h-0.5 w-10 bg-primary/40" />

              <motion.h1
                className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-tight"
                initial={{ clipPath: 'inset(0 100% 0 0)' }}
                whileInView={{ clipPath: 'inset(0 0% 0 0)' }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              >
                PDRN <span className="italic">Pink Peptide</span> Serum
              </motion.h1>
              <p className="text-lg md:text-xl text-primary font-medium">
                El suero viral de Corea que regenera tu piel
              </p>

              {/* Star Rating + Social Proof */}
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
                  4.8/5 (1.174 clientes)
                </p>
              </div>
            </div>

            {/* Benefits Grid - 2x2 Icons */}
            <div className="grid grid-cols-2 gap-3 md:gap-4 py-2">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <ArrowPathIcon className="w-6 h-6 text-primary" />
                </div>
                <span className="text-sm md:text-base font-medium text-foreground">Regeneración Celular</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <BeakerIcon className="w-6 h-6 text-primary" />
                </div>
                <span className="text-sm md:text-base font-medium text-foreground">Glass Skin Effect</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <ClockIcon className="w-6 h-6 text-primary" />
                </div>
                <span className="text-sm md:text-base font-medium text-foreground">Hidratación 24hs</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <ShieldCheckIcon className="w-6 h-6 text-primary" />
                </div>
                <span className="text-sm md:text-base font-medium text-foreground">Anti-Envejecimiento</span>
              </div>
            </div>

            {/* Product Description */}
            <div className="space-y-2">
              <p className="text-sm md:text-base text-foreground/70 leading-relaxed">
                Formulado con PDRN (Sodium DNA) 1% y 5 tipos de Péptidos, el suero más buscado de Corea del Sur, ahora en Paraguay. Regenerá tu piel desde adentro.
              </p>
              <p className="text-xs md:text-sm text-primary font-medium">
                📦 Tamaño: 30ml / 1.01 fl. oz.
              </p>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3 py-2">
              <span className="text-base text-foreground/40 line-through">Gs. 246.000</span>
              <span className="text-4xl md:text-5xl font-bold text-foreground">Gs. 189.000</span>
            </div>

            {/* Stock Urgency Indicator */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{
                opacity: 1,
                scale: stockAnimating ? [1, 1.08, 1] : 1,
                borderColor: stockAnimating ? ['rgba(166, 114, 101, 0.3)', 'rgba(166, 114, 101, 0.8)', 'rgba(166, 114, 101, 0.3)'] : 'rgba(212, 169, 154, 1)',
              }}
              transition={{
                delay: stockAnimating ? 0 : 0.3,
                duration: stockAnimating ? 0.6 : 0.4,
                repeat: stockAnimating ? 2 : 0,
              }}
              className={`inline-flex items-center gap-2 px-4 py-2 bg-[rgba(212,169,154,0.2)] border border-[#D4A99A] rounded-lg transition-all ${stockAnimating ? 'shadow-[0_0_20px_rgba(192,139,122,0.5)]' : ''}`}
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#A67265] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#A67265]"></span>
              </span>
              <span className="text-sm font-semibold text-[#A67265]">
                ● Solo quedan{" "}
                <AnimatePresence mode="wait">
                  <motion.span
                    key={displayStock}
                    initial={{ opacity: 0, y: -20, scale: 1.5 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.5 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className={`inline-block font-bold ${stockAnimating ? 'text-foreground' : ''}`}
                  >
                    {displayStock}
                  </motion.span>
                </AnimatePresence>
                {" "}unidades en stock
              </span>
            </motion.div>

            {/* CTA Button */}
            <div className="space-y-3">
                <motion.div
                  animate={{
                    scale: [1, 1.015, 1],
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    repeatType: "loop",
                    ease: "easeInOut"
                  }}
                >
                  <Button
                    data-hero-cta
                    variant="hero"
                    size="xl"
                    className="w-full h-14 md:h-16 text-base md:text-lg font-bold shadow-[0_8px_24px_rgba(192,139,122,0.4)] tracking-[0.15em] rounded-[2px]"
                    style={{
                      background: "#C08B7A",
                    }}
                    onClick={onBuyClick}
                  >
                    COMPRAR AHORA — Gs. 189.000
                  </Button>
                </motion.div>

              {/* Dynamic Delivery Date */}
              <p className="text-sm text-center text-accent font-medium">
                📦 Pedí hoy y recibí entre el Miércoles y Viernes
              </p>
            </div>

            {/* Payment Methods */}
            <div className="flex justify-center pt-2">
              <img
                src={paymentMethodsImage}
                alt="Visa, Mastercard, Apple Pay, Google Pay"
                className="h-8 md:h-9 w-auto opacity-80"
              />
            </div>

            {/* Countdown Timer */}
            <div className="flex justify-center pt-2">
              <CountdownTimer />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Stripe Payment Success Modal */}


      {/* Live Purchase Notification */}
      <LivePurchaseNotification
        isVisible={showPurchaseNotification}
        buyerName={currentBuyer.name}
        buyerCity={currentBuyer.city}
      />
    </section>
  );
};
