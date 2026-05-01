import { useCallback, useEffect, useMemo, useRef, useState, lazy, Suspense, memo } from "react";
import { Link } from "react-router-dom";
import { DeliveryBanner } from "@/components/DeliveryBanner";
import { OfferCTA } from "@/components/OfferCTA";
import { CustomCursor } from "@/components/CustomCursor";
import { ScrollProgress } from "@/components/ScrollProgress";
import { HeroSectionSerum } from "@/components/serum/HeroSectionSerum";
import { StickyBuyButtonSerum } from "@/components/serum/StickyBuyButtonSerum";
import {
  sendOrderInBackground,
  generateOrderNumber,
  type PackVariant,
} from "@/services/orderService";
import {
  trackInitiateCheckout,
  trackAddToCart,
  trackPurchase,
  type MetaUserData,
} from "@/lib/meta-pixel";
import { PRODUCTS, buildContentName } from "@/lib/products";
import {
  hashEmail,
  hashPhoneE164,
  hashFirstName,
  hashLastName,
  hashExternalId,
  getFbc,
  getFbp,
} from "@/lib/meta-matching";
import { SERUM_BUNDLES, SERUM_PRODUCT_NAME } from "@/data/serumProduct";

type SerumPackVariant = Extract<PackVariant, "individual" | "duo" | "trio">;

const ProductGallerySerum = lazy(() => import("@/components/serum/ProductGallerySerum"));
const HowItWorksSerum = lazy(() => import("@/components/serum/HowItWorksSerum"));
const BenefitsSectionSerum = lazy(() => import("@/components/serum/BenefitsSectionSerum"));
const IngredientsSectionSerum = lazy(() => import("@/components/serum/IngredientsSectionSerum"));
const TimelineSectionSerum = lazy(() => import("@/components/serum/TimelineSectionSerum"));
const ComparisonTableSerum = lazy(() => import("@/components/serum/ComparisonTableSerum"));
const StatsSectionSerum = lazy(() => import("@/components/serum/StatsSectionSerum"));
const UsageRulesSerum = lazy(() => import("@/components/serum/UsageRulesSerum"));
const FAQSectionSerum = lazy(() => import("@/components/serum/FAQSectionSerum"));
const GuaranteeSectionSerum = lazy(() => import("@/components/serum/GuaranteeSectionSerum"));

const QuantitySelectorSerum = lazy(() =>
  import("@/components/checkout/QuantitySelectorSerum").then((module) => ({
    default: module.QuantitySelectorSerum,
  }))
);
const PhoneNameForm = lazy(() => import("@/components/checkout/PhoneNameForm"));
const SuccessPage = lazy(() => import("@/components/checkout/SuccessPage"));
const PaymentFallbackModal = lazy(() => import("@/components/checkout/PaymentFallbackModal"));
const CheckoutModal = lazy(() =>
  import("@/components/checkout/CheckoutModal").then((m) => ({ default: m.CheckoutModal }))
);

const SERUM_UNIT_PRICE = SERUM_BUNDLES[0].unitPrice;
const SERUM_BASE_PRODUCT_NAME = SERUM_PRODUCT_NAME;

const SERUM_BANNER_MESSAGES = [
  "NUEVO LANZAMIENTO PARAGUAY",
  "DELIVERY GRATIS A TODO PARAGUAY",
  "PAGO AL RECIBIR",
  "FRASCO SELLADO O LO REEMPLAZAMOS",
] as const;

const serumProductLabel = (quantity: number): string => {
  if (quantity <= 1) return `${SERUM_BASE_PRODUCT_NAME} · 1 frasco (7 ml)`;
  if (quantity === 2) return `${SERUM_BASE_PRODUCT_NAME} · Pack Duo (2 frascos)`;
  if (quantity === 3) return `${SERUM_BASE_PRODUCT_NAME} · Pack Familia (3 frascos + bolsa Solenne)`;
  return `${SERUM_BASE_PRODUCT_NAME} · Pack x${quantity}`;
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

const LashSerum = () => {
  const [showQuantitySelector, setShowQuantitySelector] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showPaymentFallback, setShowPaymentFallback] = useState(false);
  const [showPhoneForm, setShowPhoneForm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [checkoutInProgress, setCheckoutInProgress] = useState(false);

  const [checkoutData, setCheckoutData] = useState({
    quantity: 1,
    totalPrice: SERUM_UNIT_PRICE,
    unitPrice: SERUM_UNIT_PRICE,
    packVariant: "individual" as SerumPackVariant,
    colors: null as [string, string] | null,
    location: "",
    name: "",
    phone: "",
    address: "",
    email: "" as string,
    wantsInvoice: false,
    ruc: "" as string,
    isGeolocated: false,
    lat: undefined as number | undefined,
    long: undefined as number | undefined,
    paymentMethod: "digital" as "digital" | "cash",
    orderNumber: "",
    paymentIntentId: "",
  });

  useEffect(() => {
    const previousTitle = document.title;
    document.title = "Serum de Pestañas | Crecimiento real en 8 a 12 semanas | Solenne Paraguay";

    const metaDescription = document.querySelector('meta[name="description"]');
    const previousDescription = metaDescription?.getAttribute("content") ?? "";
    metaDescription?.setAttribute(
      "content",
      "Serum de pestañas con ginseng rojo y helichrysum. Pestañas más largas y densas en 8 a 12 semanas, sin prostaglandinas, sin receta. Envío gratis Paraguay."
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
      "Serum de Pestañas | 7 ml | Solenne"
    );
    const ogDescription = setOrCreateMeta(
      'meta[property="og:description"]',
      "property",
      "og:description",
      "Pestañas más largas y densas con uso constante. Sin prostaglandinas, sin receta. Envío gratis Paraguay."
    );
    const ogUrl = setOrCreateMeta(
      'meta[property="og:url"]',
      "property",
      "og:url",
      "https://bysolenne.shop/serum-pestanas"
    );
    const twitterTitle = setOrCreateMeta(
      'meta[name="twitter:title"]',
      "name",
      "twitter:title",
      "Serum de Pestañas | Solenne Paraguay"
    );
    const twitterDescription = setOrCreateMeta(
      'meta[name="twitter:description"]',
      "name",
      "twitter:description",
      "Pestañas más largas y densas en 8 a 12 semanas. Sin prostaglandinas, sin receta. Envío gratis."
    );

    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    const previousCanonical = canonical?.getAttribute("href") ?? null;
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", "https://bysolenne.shop/serum-pestanas");

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
      trackInitiateCheckout({
        product: PRODUCTS.lash,
        quantity: checkoutData.quantity,
        value: checkoutData.totalPrice,
        user_data: { fbc: getFbc(), fbp: getFbp() },
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
      const serumVariant: SerumPackVariant =
        packVariant === "duo" ? "duo" : packVariant === "trio" ? "trio" : "individual";

      setCheckoutData((prev) => ({
        ...prev,
        quantity,
        totalPrice,
        unitPrice,
        packVariant: serumVariant,
      }));
      setShowQuantitySelector(false);

      trackAddToCart({
        product: PRODUCTS.lash,
        quantity,
        value: totalPrice,
        user_data: { fbc: getFbc(), fbp: getFbp() },
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
        email: data.email || undefined,
        paymentType: result.paymentType,
        isPaid: result.isPaid,
        deliveryType: result.deliveryType,
        productName: buildContentName(PRODUCTS.lash, data.quantity),
        productKey: "lash",
        packVariant: data.packVariant,
      });

      void (async () => {
        const [em, ph, fn, ln, external_id] = await Promise.all([
          hashEmail(data.email || undefined),
          hashPhoneE164(data.phone),
          hashFirstName(data.name),
          hashLastName(data.name),
          hashExternalId(data.orderNumber),
        ]);

        const user_data: MetaUserData = {
          em,
          ph,
          fn,
          ln,
          external_id,
          fbc: getFbc(),
          fbp: getFbp(),
        };

        trackPurchase({
          product: PRODUCTS.lash,
          quantity: data.quantity,
          value: result.finalTotal,
          order_id: data.orderNumber,
          event_id: data.orderNumber,
          user_data,
        });
      })();

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
      totalPrice: SERUM_UNIT_PRICE,
      unitPrice: SERUM_UNIT_PRICE,
      packVariant: "individual",
      colors: null,
      location: "",
      name: "",
      phone: "",
      address: "",
      email: "",
      wantsInvoice: false,
      ruc: "",
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
    (data: {
      name: string;
      phone: string;
      location: string;
      address: string;
      isGeolocated: boolean;
      lat?: number;
      long?: number;
      ruc?: string;
      email?: string;
      wantsInvoice?: boolean;
    }) => {
      setCheckoutData((prev) => ({
        ...prev,
        name: data.name,
        phone: data.phone,
        location: data.location,
        address: data.address,
        isGeolocated: data.isGeolocated,
        lat: data.lat,
        long: data.long,
        ruc: data.ruc ?? "",
        email: data.email ?? "",
        wantsInvoice: !!data.wantsInvoice,
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
      products: `${checkoutData.quantity}x ${SERUM_BASE_PRODUCT_NAME}`,
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
      <DeliveryBanner messages={SERUM_BANNER_MESSAGES} />

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
        <HeroSectionSerum onBuyClick={handleBuyClick} />

        <Suspense fallback={<SectionSkeleton height="h-[500px] md:h-[600px]" />}>
          <ProductGallerySerum />
        </Suspense>

        <Suspense fallback={<SectionSkeleton height="h-[600px] md:h-[700px]" />}>
          <HowItWorksSerum />
        </Suspense>

        <Suspense fallback={<SectionSkeleton height="h-[500px] md:h-[600px]" />}>
          <BenefitsSectionSerum />
        </Suspense>

        <OfferCTA onBuyClick={handleBuyClick} />

        <Suspense fallback={<SectionSkeleton height="h-[600px] md:h-[700px]" />}>
          <IngredientsSectionSerum />
        </Suspense>

        <Suspense fallback={<SectionSkeleton height="h-[500px] md:h-[600px]" />}>
          <TimelineSectionSerum />
        </Suspense>

        <Suspense fallback={<SectionSkeleton height="h-[600px] md:h-[700px]" />}>
          <ComparisonTableSerum />
        </Suspense>

        <OfferCTA onBuyClick={handleBuyClick} />

        <Suspense fallback={<SectionSkeleton height="h-[500px] md:h-[600px]" />}>
          <StatsSectionSerum />
        </Suspense>

        <Suspense fallback={<SectionSkeleton height="h-[400px] md:h-[500px]" />}>
          <UsageRulesSerum />
        </Suspense>

        <Suspense fallback={<SectionSkeleton height="h-[500px] md:h-[600px]" />}>
          <FAQSectionSerum />
        </Suspense>

        <OfferCTA onBuyClick={handleBuyClick} variant="minimal" />

        <Suspense fallback={<SectionSkeleton height="h-[400px] md:h-[500px]" />}>
          <GuaranteeSectionSerum onBuyClick={handleBuyClick} />
        </Suspense>
      </main>

      <ScrollProgress />

      <StickyBuyButtonSerum onBuyClick={handleBuyClick} />

      <CustomCursor />

      {showQuantitySelector && (
        <Suspense fallback={null}>
          <QuantitySelectorSerum
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
            productLabel={serumProductLabel}
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

export default LashSerum;
