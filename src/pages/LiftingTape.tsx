import { useCallback, useEffect, useMemo, useRef, useState, lazy, Suspense, memo } from "react";
import { Link } from "react-router-dom";
import { DeliveryBanner } from "@/components/DeliveryBanner";
import { OfferCTA } from "@/components/OfferCTA";
import { CustomCursor } from "@/components/CustomCursor";
import { ScrollProgress } from "@/components/ScrollProgress";
import { HeroSectionTape } from "@/components/tape/HeroSectionTape";
import { StickyBuyButtonTape } from "@/components/tape/StickyBuyButtonTape";
import {
  sendOrderInBackground,
  generateOrderNumber,
  type PackVariant,
} from "@/services/orderService";
import {
  trackTapeInitiateCheckout,
  trackTapeAddToCart,
  trackTapePurchase,
  buildTapeContentName,
} from "@/lib/meta-pixel";

type TapePackVariant = Extract<PackVariant, "individual" | "ritual" | "evento">;

const ProductGalleryTape = lazy(() => import("@/components/tape/ProductGalleryTape"));
const HowItWorksTape = lazy(() => import("@/components/tape/HowItWorksTape"));
const BenefitsSectionTape = lazy(() => import("@/components/tape/BenefitsSectionTape"));
const LifestyleSectionTape = lazy(() => import("@/components/tape/LifestyleSectionTape"));
const ComparisonTableTape = lazy(() => import("@/components/tape/ComparisonTableTape"));
const StatsSectionTape = lazy(() => import("@/components/tape/StatsSectionTape"));
const FAQSectionTape = lazy(() => import("@/components/tape/FAQSectionTape"));
const GuaranteeSectionTape = lazy(() => import("@/components/tape/GuaranteeSectionTape"));

const QuantitySelectorTape = lazy(() =>
  import("@/components/checkout/QuantitySelectorTape").then((module) => ({
    default: module.QuantitySelectorTape,
  }))
);
const PhoneNameForm = lazy(() => import("@/components/checkout/PhoneNameForm"));
const SuccessPage = lazy(() => import("@/components/checkout/SuccessPage"));
const PaymentFallbackModal = lazy(() => import("@/components/checkout/PaymentFallbackModal"));
const CheckoutModal = lazy(() =>
  import("@/components/checkout/CheckoutModal").then((m) => ({ default: m.CheckoutModal }))
);

const TAPE_UNIT_PRICE = 149000;
const TAPE_BASE_PRODUCT_NAME = "V-Shaped Face Tape";

const TAPE_BANNER_MESSAGES = [
  "NUEVO LANZAMIENTO PARAGUAY",
  "DELIVERY GRATIS A TODO PARAGUAY",
  "PAGO AL RECIBIR",
  "CAJA SELLADA O LA REEMPLAZAMOS",
] as const;

const tapeProductLabel = (quantity: number): string => {
  if (quantity <= 1) return `${TAPE_BASE_PRODUCT_NAME} · 1 caja (100 parches)`;
  if (quantity === 2) return `${TAPE_BASE_PRODUCT_NAME} · Pack Ritual (2 cajas)`;
  if (quantity === 3) return `${TAPE_BASE_PRODUCT_NAME} · Pack Evento (3 cajas + bolsa Solenne)`;
  return `${TAPE_BASE_PRODUCT_NAME} · Pack x${quantity}`;
};

const SectionSkeleton = memo(({ height }: { height: string }) => (
  <div className={`${height} bg-background animate-pulse`}>
    <div className="container max-w-[1400px] mx-auto px-4 py-12 md:py-20">
      <div className="h-8 md:h-10 w-48 md:w-64 bg-secondary/50 rounded mx-auto mb-8" />
      <div className="space-y-4">
        <div className="h-4 bg-secondary/30 rounded w-3/4 mx-auto" />
        <div className="h-4 bg-secondary/30 rounded w-1/2 mx-auto" />
      </div>
    </div>
  </div>
));
SectionSkeleton.displayName = "SectionSkeleton";

const LiftingTape = () => {
  const [showQuantitySelector, setShowQuantitySelector] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showPaymentFallback, setShowPaymentFallback] = useState(false);
  const [showPhoneForm, setShowPhoneForm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [checkoutInProgress, setCheckoutInProgress] = useState(false);

  const [checkoutData, setCheckoutData] = useState({
    quantity: 1,
    totalPrice: TAPE_UNIT_PRICE,
    unitPrice: TAPE_UNIT_PRICE,
    packVariant: "individual" as TapePackVariant,
    colors: null as [string, string] | null,
    location: "",
    name: "",
    phone: "",
    address: "",
    isGeolocated: false,
    lat: undefined as number | undefined,
    long: undefined as number | undefined,
    paymentMethod: "digital" as "digital" | "cash",
    orderNumber: "",
    paymentIntentId: "",
  });

  useEffect(() => {
    const previousTitle = document.title;
    document.title = "Parches Invisibles para la Cara | 100 unidades | Solenne Paraguay";

    const metaDescription = document.querySelector('meta[name="description"]');
    const previousDescription = metaDescription?.getAttribute("content") ?? "";
    metaDescription?.setAttribute(
      "content",
      "Cinta facial invisible para efecto lifting instantáneo. Para eventos, fotos y reuniones. Sin agujas, sin cirugía. Envío gratis Paraguay."
    );

    const setOrCreateMeta = (selector: string, attr: string, attrValue: string, content: string) => {
      let tag = document.querySelector(selector) as HTMLMetaElement | null;
      const previousContent = tag?.getAttribute("content") ?? null;
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute(attr, attrValue);
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", content);
      return { tag, previousContent };
    };

    const ogTitle = setOrCreateMeta(
      'meta[property="og:title"]',
      "property",
      "og:title",
      "Parches Invisibles para la Cara | 100 unidades | Solenne"
    );
    const ogDescription = setOrCreateMeta(
      'meta[property="og:description"]',
      "property",
      "og:description",
      "Cinta facial invisible para efecto lifting instantáneo. Para eventos, fotos y reuniones. Envío gratis Paraguay."
    );
    const ogUrl = setOrCreateMeta(
      'meta[property="og:url"]',
      "property",
      "og:url",
      "https://bysolenne.shop/lifting-tape"
    );
    const twitterTitle = setOrCreateMeta(
      'meta[name="twitter:title"]',
      "name",
      "twitter:title",
      "Parches Invisibles para la Cara | 100 unidades | Solenne"
    );
    const twitterDescription = setOrCreateMeta(
      'meta[name="twitter:description"]',
      "name",
      "twitter:description",
      "Lifting instantáneo invisible. Sin agujas, sin cirugía. Envío gratis en Paraguay."
    );

    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    const previousCanonical = canonical?.getAttribute("href") ?? null;
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", "https://bysolenne.shop/lifting-tape");

    return () => {
      document.title = previousTitle;
      if (metaDescription && previousDescription) {
        metaDescription.setAttribute("content", previousDescription);
      }
      if (ogTitle.previousContent !== null) ogTitle.tag.setAttribute("content", ogTitle.previousContent);
      if (ogDescription.previousContent !== null) ogDescription.tag.setAttribute("content", ogDescription.previousContent);
      if (ogUrl.previousContent !== null) ogUrl.tag.setAttribute("content", ogUrl.previousContent);
      if (twitterTitle.previousContent !== null) twitterTitle.tag.setAttribute("content", twitterTitle.previousContent);
      if (twitterDescription.previousContent !== null)
        twitterDescription.tag.setAttribute("content", twitterDescription.previousContent);
      if (canonical && previousCanonical) {
        canonical.setAttribute("href", previousCanonical);
      }
    };
  }, []);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (checkoutInProgress && !showSuccess) {
        e.preventDefault();
        e.returnValue = "Tenés un pedido en proceso. Si salís ahora, perderás tu progreso.";
        return e.returnValue;
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [checkoutInProgress, showSuccess]);

  useEffect(() => {
    if (!checkoutData.orderNumber) {
      setCheckoutData((prev) => ({
        ...prev,
        orderNumber: generateOrderNumber(),
      }));
    }
  }, [checkoutData.orderNumber]);

  useEffect(() => {
    if (showPhoneForm && checkoutData.quantity > 0) {
      trackTapeInitiateCheckout({
        quantity: checkoutData.quantity,
        value: checkoutData.totalPrice,
      });
    }
  }, [showPhoneForm, checkoutData.quantity, checkoutData.totalPrice]);

  const handleBuyClick = useCallback(() => {
    setCheckoutInProgress(true);
    setShowQuantitySelector(true);

    import("@/components/checkout/PhoneNameForm");
    import("@/components/checkout/CheckoutModal");
  }, []);

  const handleQuantitySelected = useCallback(
    (quantity: number, totalPrice: number, unitPrice: number, packVariant: PackVariant) => {
      const tapeVariant: TapePackVariant =
        packVariant === "ritual" || packVariant === "evento" ? packVariant : "individual";

      setCheckoutData((prev) => ({
        ...prev,
        quantity,
        totalPrice,
        unitPrice,
        packVariant: tapeVariant,
      }));
      setShowQuantitySelector(false);

      trackTapeAddToCart({
        quantity,
        value: totalPrice,
      });

      setShowPhoneForm(true);
    },
    []
  );

  const handlePaymentSuccess = useCallback(
    (result: {
      paymentIntentId: string;
      paymentType: "COD";
      isPaid: false;
      deliveryType: "común" | "premium";
      finalTotal: number;
    }) => {
      const data = checkoutData;

      sendOrderInBackground({
        name: data.name,
        phone: data.phone,
        location: data.location,
        address: data.address,
        lat: data.lat,
        long: data.long,
        quantity: data.quantity,
        unitPrice: data.unitPrice,
        total: result.finalTotal,
        orderNumber: data.orderNumber,
        paymentIntentId: result.paymentIntentId,
        email: undefined,
        paymentType: result.paymentType,
        isPaid: result.isPaid,
        deliveryType: result.deliveryType,
        productName: buildTapeContentName(data.quantity),
        productKey: "tape",
        packVariant: data.packVariant,
      });

      trackTapePurchase({
        quantity: data.quantity,
        value: result.finalTotal,
        order_id: data.orderNumber,
      });

      setCheckoutData((prev) => ({
        ...prev,
        paymentIntentId: result.paymentIntentId,
        totalPrice: result.finalTotal,
      }));

      setShowCheckout(false);
      setShowSuccess(true);
    },
    [checkoutData]
  );

  const handleBackToPhoneForm = useCallback(() => {
    setShowCheckout(false);
    setShowPhoneForm(true);
  }, []);

  const resetCheckoutData = useCallback(() => {
    setCheckoutData({
      quantity: 1,
      totalPrice: TAPE_UNIT_PRICE,
      unitPrice: TAPE_UNIT_PRICE,
      packVariant: "individual",
      colors: null,
      location: "",
      name: "",
      phone: "",
      address: "",
      isGeolocated: false,
      paymentMethod: "digital",
      orderNumber: generateOrderNumber(),
      paymentIntentId: "",
      lat: undefined,
      long: undefined,
    });
  }, []);

  const handleQuantitySelectorClose = useCallback(() => {
    setShowQuantitySelector(false);
    setCheckoutInProgress(false);
    resetCheckoutData();
  }, [resetCheckoutData]);

  const handleCheckoutClose = useCallback(() => {
    setShowCheckout(false);
    setCheckoutInProgress(false);
    resetCheckoutData();
  }, [resetCheckoutData]);

  const handlePhoneSubmit = useCallback(
    (data: { name: string; phone: string; location: string; address: string; isGeolocated: boolean; lat?: number; long?: number; ruc?: string }) => {
      setCheckoutData((prev) => ({
        ...prev,
        name: data.name,
        phone: data.phone,
        location: data.location,
        address: data.address,
        isGeolocated: data.isGeolocated,
        lat: data.lat,
        long: data.long,
      }));

      setShowPhoneForm(false);
      setShowCheckout(true);
    },
    []
  );

  const handlePhoneFormClose = useCallback(() => {
    setShowPhoneForm(false);
    setCheckoutInProgress(false);
    resetCheckoutData();
  }, [resetCheckoutData]);

  const handleSuccessClose = useCallback(() => {
    setShowSuccess(false);
    setCheckoutInProgress(false);
    resetCheckoutData();
  }, [resetCheckoutData]);

  const orderData = useMemo(
    () => ({
      orderNumber: checkoutData.orderNumber,
      products: `${checkoutData.quantity}x ${TAPE_BASE_PRODUCT_NAME}`,
      total: `${checkoutData.totalPrice.toLocaleString("es-PY")} Gs`,
      location: checkoutData.location,
      phone: checkoutData.phone,
      name: checkoutData.name,
      address: checkoutData.address,
    }),
    [checkoutData]
  );

  const customerData = useMemo(
    () => ({
      name: checkoutData.name,
      phone: checkoutData.phone,
      location: checkoutData.location,
      address: checkoutData.address,
      orderNumber: checkoutData.orderNumber,
      quantity: checkoutData.quantity,
    }),
    [
      checkoutData.name,
      checkoutData.phone,
      checkoutData.location,
      checkoutData.address,
      checkoutData.orderNumber,
      checkoutData.quantity,
    ]
  );

  const lastScrollYRef = useRef(0);
  const [showHeader, setShowHeader] = useState(true);

  useEffect(() => {
    let ticking = false;

    const controlNavbar = () => {
      const currentScrollY = window.scrollY;
      const lastY = lastScrollYRef.current;

      if (currentScrollY > lastY && currentScrollY > 50) {
        setShowHeader(false);
      } else if (currentScrollY < lastY) {
        setShowHeader(true);
      }

      lastScrollYRef.current = currentScrollY;
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(controlNavbar);
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div className="grain-overlay min-h-screen bg-background text-foreground">
      <DeliveryBanner messages={TAPE_BANNER_MESSAGES} />

      <header
        className={`fixed left-0 w-full z-50 transition-transform duration-300 ${
          showHeader ? "translate-y-0" : "-translate-y-[150%]"
        } top-[36px] md:top-[40px]`}
      >
        <div className="w-full">
          <div className="container max-w-[1400px] mx-auto px-4 md:px-6 lg:px-12 py-2 md:py-3 flex items-center justify-between">
            <Link
              to="/"
              className="text-2xl md:text-3xl font-serif font-semibold tracking-tighter text-foreground"
            >
              SOLENNE
            </Link>
            <button
              onClick={handleBuyClick}
              className="text-primary hover:text-primary/80 font-medium text-sm md:text-base transition-colors tracking-tight mix-blend-difference"
            >
              Comprar Ahora
            </button>
          </div>
        </div>
      </header>

      <main className="pt-0 pb-0 transition-all duration-300">
        <HeroSectionTape onBuyClick={handleBuyClick} />

        <Suspense fallback={<SectionSkeleton height="h-[500px] md:h-[600px]" />}>
          <ProductGalleryTape />
        </Suspense>

        <Suspense fallback={<SectionSkeleton height="h-[600px] md:h-[700px]" />}>
          <HowItWorksTape />
        </Suspense>

        <Suspense fallback={<SectionSkeleton height="h-[500px] md:h-[600px]" />}>
          <BenefitsSectionTape />
        </Suspense>

        <OfferCTA onBuyClick={handleBuyClick} />

        <Suspense fallback={<SectionSkeleton height="h-[500px] md:h-[600px]" />}>
          <LifestyleSectionTape />
        </Suspense>

        <Suspense fallback={<SectionSkeleton height="h-[600px] md:h-[700px]" />}>
          <ComparisonTableTape />
        </Suspense>

        <OfferCTA onBuyClick={handleBuyClick} />

        <Suspense fallback={<SectionSkeleton height="h-[500px] md:h-[600px]" />}>
          <StatsSectionTape />
        </Suspense>

        <Suspense fallback={<SectionSkeleton height="h-[500px] md:h-[600px]" />}>
          <FAQSectionTape />
        </Suspense>

        <OfferCTA onBuyClick={handleBuyClick} variant="minimal" />

        <Suspense fallback={<SectionSkeleton height="h-[400px] md:h-[500px]" />}>
          <GuaranteeSectionTape onBuyClick={handleBuyClick} />
        </Suspense>
      </main>

      <ScrollProgress />

      <StickyBuyButtonTape onBuyClick={handleBuyClick} />

      <CustomCursor />

      {showQuantitySelector && (
        <Suspense fallback={null}>
          <QuantitySelectorTape
            isOpen={showQuantitySelector}
            onClose={handleQuantitySelectorClose}
            onContinue={handleQuantitySelected}
          />
        </Suspense>
      )}

      {showPhoneForm && (
        <Suspense fallback={null}>
          <PhoneNameForm
            isOpen={showPhoneForm}
            onSubmit={handlePhoneSubmit}
            onClose={handlePhoneFormClose}
          />
        </Suspense>
      )}

      {showCheckout && (
        <Suspense fallback={null}>
          <CheckoutModal
            isOpen={showCheckout}
            onClose={handleCheckoutClose}
            onBack={handleBackToPhoneForm}
            onSuccess={handlePaymentSuccess}
            amount={checkoutData.totalPrice}
            currency="pyg"
            isProcessingOrder={false}
            customerData={customerData}
            productLabel={tapeProductLabel}
          />
        </Suspense>
      )}

      {showPaymentFallback && (
        <Suspense fallback={null}>
          <PaymentFallbackModal
            isOpen={showPaymentFallback}
            onPayOnDelivery={() => {}}
            onRetryPayment={() => {}}
            onCancel={() => setShowPaymentFallback(false)}
          />
        </Suspense>
      )}

      {showSuccess && (
        <Suspense fallback={null}>
          <SuccessPage
            isOpen={showSuccess}
            orderData={orderData}
            onClose={handleSuccessClose}
          />
        </Suspense>
      )}

      <footer className="bg-background border-t border-border/30 py-12 md:py-16 px-4 md:px-6 pb-32 md:pb-40">
        <div className="container max-w-[1400px] mx-auto text-center space-y-5 md:space-y-6">
          <p className="text-2xl font-serif font-semibold tracking-tighter text-primary">SOLENNE</p>
          <p className="text-muted-foreground font-light text-xs md:text-sm">
            Verse mejor. Sentirse mejor.
          </p>

          <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground/60">
            <Link to="/terminos-y-condiciones" className="hover:text-foreground transition-colors">
              Términos y Condiciones
            </Link>
            <span className="text-muted-foreground/30">|</span>
            <Link to="/politica-de-privacidad" className="hover:text-foreground transition-colors">
              Política de Privacidad
            </Link>
          </div>

          <p className="text-[10px] md:text-xs text-muted-foreground/60 font-light">
            © {new Date().getFullYear()} SOLENNE Todos los Derechos Reservados
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LiftingTape;
