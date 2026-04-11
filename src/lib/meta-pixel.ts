/**
 * Meta (Facebook) Pixel Integration
 *
 * Type-safe utilities for tracking conversion events with Meta/Facebook Pixel.
 * Every funnel event (ViewContent, AddToCart, InitiateCheckout, AddPaymentInfo,
 * Purchase) shares the same canonical content_name and content_ids so the
 * attribution funnel stays consolidated and catalog matching works against
 * the Ordefy product ("PDRN Pink Peptide Serum 30ml").
 *
 * Advanced Matching: Purchase, InitiateCheckout, AddToCart and AddPaymentInfo
 * accept an optional user_data payload with hashed PII (em, ph, fn, ln,
 * external_id) + fbc/fbp cookie values. Helpers in meta-matching.ts produce
 * all values in the format Meta expects. Plaintext PII is never sent.
 */

declare global {
  interface Window {
    fbq: (
      action: 'track' | 'trackCustom' | 'init',
      eventName: string,
      parameters?: Record<string, unknown>,
      options?: Record<string, unknown>
    ) => void;
    _fbq: unknown;
  }
}

export const SOLENNE_CONTENT_NAME_BASE = 'Solenne PDRN Pink Peptide Serum';
export const SOLENNE_CONTENT_ID_BASE = 'solenne-pdrn-serum';
export const SOLENNE_CONTENT_CATEGORY = 'Skincare & Beauty';
export const SOLENNE_CONTENT_TYPE = 'product';
export const SOLENNE_CURRENCY = 'PYG';
export const SOLENNE_UNIT_PRICE = 189000;

export const SOLENNE_TAPE_CONTENT_NAME_BASE = 'Solenne V-Shaped Face Tape';
export const SOLENNE_TAPE_CONTENT_CATEGORY = 'Beauty & Personal Care';
export const SOLENNE_TAPE_UNIT_PRICE = 149000;

const TAPE_SKU_BY_QUANTITY: Record<number, string> = {
  1: 'SOLENNE-TAPE-100',
  2: 'SOLENNE-TAPE-RITUAL',
  3: 'SOLENNE-TAPE-EVENTO',
};

/**
 * User data for Meta Advanced Matching.
 * All PII fields MUST be SHA-256 hashed before being passed here.
 * fbc/fbp are raw cookie values (Meta hashes them server-side).
 */
export interface MetaUserData {
  em?: string;
  ph?: string;
  fn?: string;
  ln?: string;
  external_id?: string;
  fbc?: string;
  fbp?: string;
}

const buildUserDataPayload = (user_data?: MetaUserData): Record<string, string> | undefined => {
  if (!user_data) return undefined;
  const entries = Object.entries(user_data).filter(([, value]) => typeof value === 'string' && value.length > 0) as Array<[string, string]>;
  if (entries.length === 0) return undefined;
  return Object.fromEntries(entries);
};

export const buildSolenneContentName = (quantity: number): string =>
  quantity <= 1
    ? SOLENNE_CONTENT_NAME_BASE
    : `${SOLENNE_CONTENT_NAME_BASE} - Pack x${quantity}`;

export const buildSolenneContentIds = (quantity: number): string[] =>
  quantity <= 1
    ? [SOLENNE_CONTENT_ID_BASE]
    : [`${SOLENNE_CONTENT_ID_BASE}-${quantity}pack`];

export const buildTapeContentName = (quantity: number): string => {
  if (quantity <= 1) return SOLENNE_TAPE_CONTENT_NAME_BASE;
  if (quantity === 2) return `${SOLENNE_TAPE_CONTENT_NAME_BASE} - Pack Ritual`;
  if (quantity === 3) return `${SOLENNE_TAPE_CONTENT_NAME_BASE} - Pack Evento`;
  return `${SOLENNE_TAPE_CONTENT_NAME_BASE} - Pack x${quantity}`;
};

export const buildTapeContentIds = (quantity: number): string[] => {
  const sku = TAPE_SKU_BY_QUANTITY[quantity] ?? `SOLENNE-TAPE-${quantity}`;
  return [sku];
};

/**
 * Initialize Meta Pixel
 * Call this once when the app loads
 */
export const initMetaPixel = (pixelId: string): void => {
  if (typeof window === 'undefined') return;

  if (window.fbq) {
    console.log('Meta Pixel already initialized');
    return;
  }

  window.fbq = function (...args: [string, string, Record<string, unknown>?, Record<string, unknown>?]) {
    interface FbqExtended {
      callMethod?: (...methodArgs: unknown[]) => void;
      queue: unknown[];
      push: (...pushArgs: unknown[]) => void;
      loaded: boolean;
      version: string;
    }
    const fbq = window.fbq as unknown as FbqExtended;
    if (fbq.callMethod) {
      fbq.callMethod.apply(window.fbq, args);
    } else {
      fbq.queue.push(args);
    }
  };

  if (!window._fbq) window._fbq = window.fbq;
  interface FbqExtended {
    push: (...args: unknown[]) => void;
    loaded: boolean;
    version: string;
    queue: unknown[];
  }
  const fbq = window.fbq as unknown as FbqExtended;
  fbq.push = window.fbq;
  fbq.loaded = true;
  fbq.version = '2.0';
  fbq.queue = [];

  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://connect.facebook.net/en_US/fbevents.js';
  document.head.appendChild(script);

  window.fbq('init', pixelId);

  console.log('Meta Pixel initialized:', pixelId);
};

/**
 * Track PageView event
 * Call this on route changes or initial page load
 */
export const trackPageView = (): void => {
  if (typeof window === 'undefined' || !window.fbq) return;

  window.fbq('track', 'PageView');
  console.log('Meta Pixel: PageView tracked');
};

/**
 * Track ViewContent event
 * Call when user views the product
 */
export const trackViewContent = (params?: {
  content_name?: string;
  content_category?: string;
  content_ids?: string[];
  content_type?: string;
  value?: number;
  currency?: string;
}): void => {
  if (typeof window === 'undefined' || !window.fbq) return;

  const defaultParams = {
    content_name: SOLENNE_CONTENT_NAME_BASE,
    content_category: SOLENNE_CONTENT_CATEGORY,
    content_ids: [SOLENNE_CONTENT_ID_BASE],
    content_type: SOLENNE_CONTENT_TYPE,
    value: SOLENNE_UNIT_PRICE,
    currency: SOLENNE_CURRENCY,
  };

  const payload = { ...defaultParams, ...params };
  window.fbq('track', 'ViewContent', payload);
  console.log('Meta Pixel: ViewContent tracked', payload);
};

/**
 * Track InitiateCheckout event
 * Call when user proceeds to the checkout step.
 * Quantity drives the canonical content_name and content_ids.
 */
export const trackInitiateCheckout = (params: {
  quantity: number;
  value: number;
  currency?: string;
  user_data?: MetaUserData;
  event_id?: string;
}): void => {
  if (typeof window === 'undefined' || !window.fbq) return;

  const user_data = buildUserDataPayload(params.user_data);
  const payload: Record<string, unknown> = {
    content_name: buildSolenneContentName(params.quantity),
    content_category: SOLENNE_CONTENT_CATEGORY,
    content_ids: buildSolenneContentIds(params.quantity),
    content_type: SOLENNE_CONTENT_TYPE,
    num_items: params.quantity,
    value: params.value,
    currency: params.currency ?? SOLENNE_CURRENCY,
  };
  if (user_data) payload.user_data = user_data;

  const options = params.event_id ? { eventID: params.event_id } : undefined;
  window.fbq('track', 'InitiateCheckout', payload, options);
  console.log('Meta Pixel: InitiateCheckout tracked', { ...payload, eventID: params.event_id });
};

/**
 * Track AddToCart event
 * Call when user confirms quantity/upsell selection.
 * Quantity drives the canonical content_name and content_ids.
 */
export const trackAddToCart = (params: {
  quantity: number;
  value: number;
  currency?: string;
  user_data?: MetaUserData;
  event_id?: string;
}): void => {
  if (typeof window === 'undefined' || !window.fbq) return;

  const user_data = buildUserDataPayload(params.user_data);
  const payload: Record<string, unknown> = {
    content_name: buildSolenneContentName(params.quantity),
    content_category: SOLENNE_CONTENT_CATEGORY,
    content_ids: buildSolenneContentIds(params.quantity),
    content_type: SOLENNE_CONTENT_TYPE,
    num_items: params.quantity,
    value: params.value,
    currency: params.currency ?? SOLENNE_CURRENCY,
  };
  if (user_data) payload.user_data = user_data;

  const options = params.event_id ? { eventID: params.event_id } : undefined;
  window.fbq('track', 'AddToCart', payload, options);
  console.log('Meta Pixel: AddToCart tracked', { ...payload, eventID: params.event_id });
};

/**
 * Track AddPaymentInfo event
 * Call when user enters or switches payment method.
 * Quantity drives the canonical content_name and content_ids so this event
 * stays aligned with the rest of the funnel.
 */
export const trackAddPaymentInfo = (params: {
  quantity: number;
  value: number;
  currency?: string;
  payment_type?: string;
  user_data?: MetaUserData;
  event_id?: string;
}): void => {
  if (typeof window === 'undefined' || !window.fbq) return;

  const user_data = buildUserDataPayload(params.user_data);
  const payload: Record<string, unknown> = {
    content_name: buildSolenneContentName(params.quantity),
    content_category: SOLENNE_CONTENT_CATEGORY,
    content_ids: buildSolenneContentIds(params.quantity),
    content_type: SOLENNE_CONTENT_TYPE,
    num_items: params.quantity,
    value: params.value,
    currency: params.currency ?? SOLENNE_CURRENCY,
    ...(params.payment_type && { payment_type: params.payment_type }),
  };
  if (user_data) payload.user_data = user_data;

  const options = params.event_id ? { eventID: params.event_id } : undefined;
  window.fbq('track', 'AddPaymentInfo', payload, options);
  console.log('Meta Pixel: AddPaymentInfo tracked', { ...payload, eventID: params.event_id });
};

/**
 * Track Purchase event (conversion)
 * Call when the order is successfully completed.
 * This is the most important event for ROAS measurement.
 * Quantity drives the canonical content_name and content_ids.
 *
 * user_data is optional Advanced Matching payload; all PII must be hashed
 * before calling (use helpers in meta-matching.ts).
 * event_id enables CAPI deduplication when server-side events are added later.
 */
export const trackPurchase = (params: {
  quantity: number;
  value: number;
  currency?: string;
  order_id?: string;
  user_data?: MetaUserData;
  event_id?: string;
}): void => {
  if (typeof window === 'undefined' || !window.fbq) return;

  const user_data = buildUserDataPayload(params.user_data);
  const payload: Record<string, unknown> = {
    content_name: buildSolenneContentName(params.quantity),
    content_category: SOLENNE_CONTENT_CATEGORY,
    content_ids: buildSolenneContentIds(params.quantity),
    content_type: SOLENNE_CONTENT_TYPE,
    num_items: params.quantity,
    value: params.value,
    currency: params.currency ?? SOLENNE_CURRENCY,
    ...(params.order_id && { order_id: params.order_id }),
  };
  if (user_data) payload.user_data = user_data;

  const options = params.event_id ? { eventID: params.event_id } : undefined;
  window.fbq('track', 'Purchase', payload, options);
  console.log('Meta Pixel: Purchase tracked (CONVERSION)', { ...payload, eventID: params.event_id });
};

/**
 * Track Lead event
 * Fires when a user hands over contact data without completing a purchase,
 * e.g. exit-intent email capture. Feeds abandoned-cart audiences with
 * high match quality.
 */
export const trackLead = (params: {
  value?: number;
  currency?: string;
  content_name?: string;
  user_data?: MetaUserData;
  event_id?: string;
}): void => {
  if (typeof window === 'undefined' || !window.fbq) return;

  const user_data = buildUserDataPayload(params.user_data);
  const payload: Record<string, unknown> = {
    currency: params.currency ?? SOLENNE_CURRENCY,
    ...(typeof params.value === 'number' && { value: params.value }),
    ...(params.content_name && { content_name: params.content_name }),
  };
  if (user_data) payload.user_data = user_data;

  const options = params.event_id ? { eventID: params.event_id } : undefined;
  window.fbq('track', 'Lead', payload, options);
  console.log('Meta Pixel: Lead tracked', { ...payload, eventID: params.event_id });
};

/**
 * Track custom event
 * For any custom tracking needs
 */
export const trackCustomEvent = (eventName: string, parameters?: Record<string, unknown>): void => {
  if (typeof window === 'undefined' || !window.fbq) return;

  window.fbq('trackCustom', eventName, parameters);
  console.log(`Meta Pixel: Custom event "${eventName}" tracked`, parameters);
};

/**
 * Tape-specific pixel wrappers.
 * Funnel stays canonical for the V-Shaped Face Tape product catalog so AdsManager
 * never mixes tape attribution with the PDRN serum funnel.
 */

export const trackTapeViewContent = (): void => {
  if (typeof window === 'undefined' || !window.fbq) return;

  const payload = {
    content_name: SOLENNE_TAPE_CONTENT_NAME_BASE,
    content_category: SOLENNE_TAPE_CONTENT_CATEGORY,
    content_ids: buildTapeContentIds(1),
    content_type: SOLENNE_CONTENT_TYPE,
    value: SOLENNE_TAPE_UNIT_PRICE,
    currency: SOLENNE_CURRENCY,
  };

  window.fbq('track', 'ViewContent', payload);
  console.log('Meta Pixel: Tape ViewContent tracked', payload);
};

export const trackTapeInitiateCheckout = (params: {
  quantity: number;
  value: number;
  currency?: string;
  user_data?: MetaUserData;
  event_id?: string;
}): void => {
  if (typeof window === 'undefined' || !window.fbq) return;

  const user_data = buildUserDataPayload(params.user_data);
  const payload: Record<string, unknown> = {
    content_name: buildTapeContentName(params.quantity),
    content_category: SOLENNE_TAPE_CONTENT_CATEGORY,
    content_ids: buildTapeContentIds(params.quantity),
    content_type: SOLENNE_CONTENT_TYPE,
    num_items: params.quantity,
    value: params.value,
    currency: params.currency ?? SOLENNE_CURRENCY,
  };
  if (user_data) payload.user_data = user_data;

  const options = params.event_id ? { eventID: params.event_id } : undefined;
  window.fbq('track', 'InitiateCheckout', payload, options);
  console.log('Meta Pixel: Tape InitiateCheckout tracked', { ...payload, eventID: params.event_id });
};

export const trackTapeAddToCart = (params: {
  quantity: number;
  value: number;
  currency?: string;
  user_data?: MetaUserData;
  event_id?: string;
}): void => {
  if (typeof window === 'undefined' || !window.fbq) return;

  const user_data = buildUserDataPayload(params.user_data);
  const payload: Record<string, unknown> = {
    content_name: buildTapeContentName(params.quantity),
    content_category: SOLENNE_TAPE_CONTENT_CATEGORY,
    content_ids: buildTapeContentIds(params.quantity),
    content_type: SOLENNE_CONTENT_TYPE,
    num_items: params.quantity,
    value: params.value,
    currency: params.currency ?? SOLENNE_CURRENCY,
  };
  if (user_data) payload.user_data = user_data;

  const options = params.event_id ? { eventID: params.event_id } : undefined;
  window.fbq('track', 'AddToCart', payload, options);
  console.log('Meta Pixel: Tape AddToCart tracked', { ...payload, eventID: params.event_id });
};

export const trackTapePurchase = (params: {
  quantity: number;
  value: number;
  currency?: string;
  order_id?: string;
  user_data?: MetaUserData;
  event_id?: string;
}): void => {
  if (typeof window === 'undefined' || !window.fbq) return;

  const user_data = buildUserDataPayload(params.user_data);
  const payload: Record<string, unknown> = {
    content_name: buildTapeContentName(params.quantity),
    content_category: SOLENNE_TAPE_CONTENT_CATEGORY,
    content_ids: buildTapeContentIds(params.quantity),
    content_type: SOLENNE_CONTENT_TYPE,
    num_items: params.quantity,
    value: params.value,
    currency: params.currency ?? SOLENNE_CURRENCY,
    ...(params.order_id && { order_id: params.order_id }),
  };
  if (user_data) payload.user_data = user_data;

  const options = params.event_id ? { eventID: params.event_id } : undefined;
  window.fbq('track', 'Purchase', payload, options);
  console.log('Meta Pixel: Tape Purchase tracked (CONVERSION)', { ...payload, eventID: params.event_id });
};
