import { useCallback, useEffect, useMemo, useRef, useState, lazy, Suspense, memo } from "react";
import { Link } from "react-router-dom";
import { DeliveryBanner } from "@/components/DeliveryBanner";
import { OfferCTA } from "@/components/OfferCTA";
import { CustomCursor } from "@/components/CustomCursor";
import { ScrollProgress } from "@/components/ScrollProgress";
import { HeroSectionRetinalCelimax } from "@/components/retinal-celimax/HeroSectionRetinalCelimax";
import { StickyBuyButtonRetinalCelimax } from "@/components/retinal-celimax/StickyBuyButtonRetinalCelimax";
import {
  sendOrderInBackground,
  generateOrderNumber,
  type PackVariant,
} from "@/services/orderService";
import {
  trackInitiateCheckout,
  trackAddToCart,
  trackPurchase,
  trackLead,
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
import {
  RETINAL_CELIMAX_BUNDLES,
  RETINAL_CELIMAX_PRODUCT_NAME,
  RETINAL_CELIMAX_SHORT_NAME,
  buildRetinalCelimaxWhatsappMessage,
  type RetinalCelimaxBundle,
} from "@/data/retinalCelimaxProduct";
import { buildWhatsappUrl } from "@/lib/whatsapp-deeplink";
import { clearCheckoutFormStorage } from "@/hooks/useCheckoutFormPersistence";

type CelimaxOrderVariant = Extract<PackVariant, "individual" | "duo" | "trio">;

const BenefitsSectionRetinalCelimax = lazy(() =>
  import("@/components/retinal-celimax/BenefitsSectionRetinalCelimax").then((m) => ({
    default: m.BenefitsSectionRetinalCelimax,
  }))
);
const HowItWorksRetinalCelimax = lazy(() =>
  import("@/components/retinal-celimax/HowItWorksRetinalCelimax").then((m) => ({
    default: m.HowItWorksRetinalCelimax,
  }))
);
const RetinalCelimaxGifShowcase = lazy(() =>
  import("@/components/retinal-celimax/RetinalCelimaxGifShowcase").then((m) => ({
    default: m.RetinalCelimaxGifShowcase,
  }))
);
const ComparisonTableRetinalCelimax = lazy(() =>
  import("@/components/retinal-celimax/ComparisonTableRetinalCelimax").then((m) => ({
    default: m.ComparisonTableRetinalCelimax,
  }))
);
const FAQSectionRetinalCelimax = lazy(() =>
  import("@/components/retinal-celimax/FAQSectionRetinalCelimax").then((m) => ({
    default: m.FAQSectionRetinalCelimax,
  }))
);

const QuantitySelectorRetinalCelimax = lazy(() =>
  import("@/components/checkout/QuantitySelectorRetinalCelimax").then((m) => ({
    default: m.QuantitySelectorRetinalCelimax,
  }))
);
const PhoneNameForm = lazy(() => import("@/components/checkout/PhoneNameForm"));
const SuccessPage = lazy(() => import("@/components/checkout/SuccessPage"));
const PaymentFallbackModal = lazy(() => import("@/components/checkout/PaymentFallbackModal"));
const CheckoutModal = lazy(() =>
  import("@/components/checkout/CheckoutModal").then((m) => ({ default: m.CheckoutModal }))
);

const SINGLE_BUNDLE = RETINAL_CELIMAX_BUNDLES[0];

const RETINAL_CELIMAX_BANNER_MESSAGES = [
  "REGALO DÍA DE LA MADRE · LLEGA ANTES DEL 15 DE MAYO",
  "DELIVERY GRATIS A TODO PARAGUAY",
  "PAGO AL RECIBIR",
  "FRASCO SELLADO O LO REEMPLAZAMOS",
] as const;

const celimaxProductLabel = (quantity: number): string => {
  if (quantity <= 1) return `${RETINAL_CELIMAX_SHORT_NAME} · 1 frasco (15 ml)`;
  if (quantity === 2) return `${RETINAL_CELIMAX_SHORT_NAME} · Pack Dúo (2 frascos)`;
  if (quantity === 3) return `${RETINAL_CELIMAX_SHORT_NAME} · Pack Madre (3 frascos + bolsa Solenne)`;
  return `${RETINAL_CELIMAX_SHORT_NAME} · Pack x${quantity}`;
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

const findBundleByQuantity = (quantity: number): RetinalCelimaxBundle => {
  return (
    RETINAL_CELIMAX_BUNDLES.find((b) => b.quantity === quantity) ?? SINGLE_BUNDLE
  );
};

const RetinalCelimax = () => {
  const [showQuantitySelector, setShowQuantitySelector] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showPaymentFallback, setShowPaymentFallback] = useState(false);
  const [showPhoneForm, setShowPhoneForm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [checkoutInProgress, setCheckoutInProgress] = useState(false);

  const [checkoutData, setCheckoutData] = useState({
    quantity: SINGLE_BUNDLE.quantity,
    totalPrice: SINGLE_BUNDLE.totalPrice,
    unitPrice: SINGLE_BUNDLE.unitPrice,
    packVariant: "individual" as CelimaxOrderVariant,
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

  const stickyAnchorPrice = useMemo(() => {
    return findBundleByQuantity(checkoutData.quantity).anchorPrice;
  }, [checkoutData.quantity]);

  useEffect(() => {
    const previousTitle = document.title;
    document.title = "Celimax Retinal Shot, regalo Día de la Madre | Solenne";

    const metaDescription = document.querySelector('meta[name="description"]');
    const previousDescription = metaDescription?.getAttribute("content") ?? "";
    metaDescription?.setAttribute(
      "content",
      "Regalá el ritual coreano que reafirma. Pack 3 unidades a 499.000 Gs, llega antes del 15 de mayo. Retinal encapsulado, envío gratis Paraguay."
    );

    const setOrCreateMeta = (
      selector: string,
      attr: string,
      attrValue: string,
      content: string
    ) => {
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
      "Celimax Retinal Shot, regalo Día de la Madre | Solenne"
    );
    const ogDescription = setOrCreateMeta(
      'meta[property="og:description"]',
      "property",
      "og:description",
      "Regalá el ritual coreano que reafirma. Pack 3 unidades a 499.000 Gs, llega antes del 15 de mayo."
    );
    const ogUrl = setOrCreateMeta(
      'meta[property="og:url"]',
      "property",
      "og:url",
      "https://bysolenne.shop/retinal-celimax"
    );
    const ogImage = setOrCreateMeta(
      'meta[property="og:image"]',
      "property",
      "og:image",
      "https://bysolenne.shop/og/retinal-celimax.jpg"
    );
    const twitterTitle = setOrCreateMeta(
      'meta[name="twitter:title"]',
      "name",
      "twitter:title",
      "Celimax Retinal Shot, regalo Día de la Madre | Solenne"
    );
    const twitterDescription = setOrCreateMeta(
      'meta[name="twitter:description"]',
      "name",
      "twitter:description",
      "Regalá el ritual coreano que reafirma. Pack 3 unidades a 499.000 Gs. Llega antes del 15 de mayo."
    );

    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    const previousCanonical = canonical?.getAttribute("href") ?? null;
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", "https://bysolenne.shop/retinal-celimax");

    return () => {
      document.title = previousTitle;
      if (metaDescription && previousDescription) {
        metaDescription.setAttribute("content", previousDescription);
      }
      if (ogTitle.previousContent !== null) ogTitle.tag.setAttribute("content", ogTitle.previousContent);
      if (ogDescription.previousContent !== null) ogDescription.tag.setAttribute("content", ogDescription.previousContent);
      if (ogUrl.previousContent !== null) ogUrl.tag.setAttribute("content", ogUrl.previousContent);
      if (ogImage.previousContent !== null) ogImage.tag.setAttribute("content", ogImage.previousContent);
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
        product: PRODUCTS.celimax,
        quantity: checkoutData.quantity,
        value: checkoutData.totalPrice,
        user_data: { fbc: getFbc(), fbp: getFbp() },
      });
    }
  }, [showPhoneForm, checkoutData.quantity, checkoutData.totalPrice]);

  const handleBuyClick = useCallback((bundle?: RetinalCelimaxBundle) => {
    setCheckoutInProgress(true);

    if (bundle) {
      const orderVariant: CelimaxOrderVariant =
        bundle.id === "duo" ? "duo" : bundle.id === "trio" ? "trio" : "individual";

      setCheckoutData((prev) => ({
        ...prev,
        quantity: bundle.quantity,
        totalPrice: bundle.totalPrice,
        unitPrice: bundle.unitPrice,
        packVariant: orderVariant,
      }));

      trackAddToCart({
        product: PRODUCTS.celimax,
        quantity: bundle.quantity,
        value: bundle.totalPrice,
        user_data: { fbc: getFbc(), fbp: getFbp() },
      });

      setShowPhoneForm(true);
      import("@/components/checkout/CheckoutModal");
      return;
    }

    setShowQuantitySelector(true);
    import("@/components/checkout/PhoneNameForm");
    import("@/components/checkout/CheckoutModal");
  }, []);

  const handleQuantitySelected = useCallback(
    (quantity: number, totalPrice: number, unitPrice: number, packVariant: PackVariant) => {
      const orderVariant: CelimaxOrderVariant =
        packVariant === "duo" ? "duo" : packVariant === "trio" ? "trio" : "individual";

      setCheckoutData((prev) => ({
        ...prev,
        quantity,
        totalPrice,
        unitPrice,
        packVariant: orderVariant,
      }));
      setShowQuantitySelector(false);

      trackAddToCart({
        product: PRODUCTS.celimax,
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
        productName: buildContentName(PRODUCTS.celimax, data.quantity),
        productKey: "celimax",
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
          product: PRODUCTS.celimax,
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

      clearCheckoutFormStorage();

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
      quantity: SINGLE_BUNDLE.quantity,
      totalPrice: SINGLE_BUNDLE.totalPrice,
      unitPrice: SINGLE_BUNDLE.unitPrice,
      packVariant: "individual",
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

  const handleWhatsappClick = useCallback(() => {
    trackLead({
      value: SINGLE_BUNDLE.totalPrice,
      currency: "PYG",
      content_name: RETINAL_CELIMAX_PRODUCT_NAME,
      user_data: { fbc: getFbc(), fbp: getFbp() },
    });
    const url = buildWhatsappUrl(buildRetinalCelimaxWhatsappMessage(null));
    window.open(url, "_blank", "noopener,noreferrer");
  }, []);

  const orderData = useMemo(
    () => ({
      orderNumber: checkoutData.orderNumber,
      products: `${checkoutData.quantity}x ${RETINAL_CELIMAX_SHORT_NAME}`,
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
      <DeliveryBanner messages={RETINAL_CELIMAX_BANNER_MESSAGES} />

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
        <HeroSectionRetinalCelimax onBuyClick={handleBuyClick} />

        <Suspense fallback={<SectionSkeleton height="h-[500px] md:h-[600px]" />}>
          <BenefitsSectionRetinalCelimax />
        </Suspense>

        <Suspense fallback={<SectionSkeleton height="h-[500px] md:h-[600px]" />}>
          <RetinalCelimaxGifShowcase />
        </Suspense>

        <OfferCTA onBuyClick={handleBuyClick} selectedPrice={SINGLE_BUNDLE.totalPrice} />

        <Suspense fallback={<SectionSkeleton height="h-[600px] md:h-[700px]" />}>
          <HowItWorksRetinalCelimax />
        </Suspense>

        <Suspense fallback={<SectionSkeleton height="h-[600px] md:h-[700px]" />}>
          <ComparisonTableRetinalCelimax />
        </Suspense>

        <OfferCTA onBuyClick={handleBuyClick} selectedPrice={SINGLE_BUNDLE.totalPrice} variant="mothersDay" />

        <Suspense fallback={<SectionSkeleton height="h-[500px] md:h-[600px]" />}>
          <FAQSectionRetinalCelimax />
        </Suspense>

        <OfferCTA onBuyClick={handleBuyClick} selectedPrice={SINGLE_BUNDLE.totalPrice} variant="minimal" />

        <section className="py-12 md:py-20 px-4 md:px-6 bg-background relative" id="comprar">
          <div className="container max-w-[900px] mx-auto text-center space-y-6 md:space-y-8">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tighter">
              Frasco sellado o lo reemplazamos
            </h2>
            <p className="text-base md:text-lg text-muted-foreground font-light max-w-2xl mx-auto leading-relaxed">
              Cada frasco sale del depósito sellado y revisado. Si recibís el tuyo dañado o con algún defecto, avisanos por WhatsApp en las primeras 24 horas desde la entrega y te enviamos uno nuevo sin costo.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-2">
              <button
                data-guarantee-cta
                onClick={handleBuyClick}
                className="w-full sm:w-auto sm:min-w-[280px] h-14 md:h-16 px-8 bg-primary hover:bg-primary/90 text-foreground font-bold text-base md:text-lg shadow-[0_0_50px_rgba(192,139,122,0.4)] transition-all"
              >
                Comprar Ahora
              </button>
              <button
                onClick={handleWhatsappClick}
                className="w-full sm:w-auto sm:min-w-[280px] h-14 md:h-16 px-8 border border-primary/40 text-foreground hover:border-primary hover:bg-primary/5 font-medium text-base md:text-lg transition-all"
              >
                Consultar por WhatsApp
              </button>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 text-xs md:text-sm text-muted-foreground font-light pt-4">
              <span>Envío GRATIS</span>
              <span className="hidden sm:inline">·</span>
              <span>1 a 3 días</span>
              <span className="hidden sm:inline">·</span>
              <span>Pago al recibir</span>
            </div>
          </div>
        </section>
      </main>

      <ScrollProgress />

      <StickyBuyButtonRetinalCelimax
        onBuyClick={handleBuyClick}
        selectedPrice={checkoutData.totalPrice}
        selectedAnchorPrice={stickyAnchorPrice}
      />

      <CustomCursor />

      {showQuantitySelector && (
        <Suspense fallback={null}>
          <QuantitySelectorRetinalCelimax
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
            productLabel={celimaxProductLabel}
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

          <p className="text-[10px] md:text-xs text-muted-foreground/70 font-light max-w-2xl mx-auto leading-relaxed px-4">
            Producto cosmético importado. El empaque puede variar. Sin afiliación a ninguna marca específica más allá de la indicada. Los resultados pueden variar según el tipo de piel.
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

export default RetinalCelimax;
