/**
 * Meta (Facebook) Pixel Integration (product-agnostic)
 *
 * Type-safe utilities for tracking conversion events with Meta/Facebook Pixel.
 * Every funnel event (ViewContent, AddToCart, InitiateCheckout, AddPaymentInfo,
 * Purchase) accepts a ProductPixelConfig so the same tracking code works for
 * ANY product. Adding a new product requires zero changes here.
 *
 * Advanced Matching: Purchase, InitiateCheckout, AddToCart and AddPaymentInfo
 * accept an optional user_data payload with hashed PII (em, ph, fn, ln,
 * external_id) + fbc/fbp cookie values. Helpers in meta-matching.ts produce
 * all values in the format Meta expects. Plaintext PII is never sent.
 *
 * Server-side CAPI: Every tracked event is also relayed to the server-side
 * Meta Conversions API endpoint via meta-capi-client.ts for redundant
 * attribution (browser pixel + server CAPI with shared event_id dedup).
 */

import { generateEventId, sendServerEvent } from './meta-capi-client';
import { getFbc, getFbp } from './meta-matching';
import { type ProductPixelConfig, buildContentName, buildContentIds } from './products';

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

/**
 * Initialize Meta Pixel.
 * Call this once when the app loads.
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
 * Track PageView event.
 * Call this on route changes or initial page load.
 */
export const trackPageView = (): void => {
  if (typeof window === 'undefined' || !window.fbq) return;

  window.fbq('track', 'PageView');
  console.log('Meta Pixel: PageView tracked');
};

/**
 * Track ViewContent event.
 * Call when user views a product page.
 */
export const trackViewContent = (product: ProductPixelConfig): void => {
  if (typeof window === 'undefined' || !window.fbq) return;

  const payload = {
    content_name: product.contentNameBase,
    content_category: product.contentCategory,
    content_ids: [product.contentIdBase],
    content_type: product.contentType,
    value: product.unitPrice,
    currency: product.currency,
  };

  const event_id = generateEventId();
  window.fbq('track', 'ViewContent', payload, { eventID: event_id });
  console.log('Meta Pixel: ViewContent tracked', payload);

  sendServerEvent({
    event_name: 'ViewContent',
    event_id,
    event_source_url: window.location.href,
    user_data: { fbc: getFbc(), fbp: getFbp() },
    custom_data: payload,
  });
};

/**
 * Track InitiateCheckout event.
 * Call when user proceeds to the checkout step.
 */
export const trackInitiateCheckout = (params: {
  product: ProductPixelConfig;
  quantity: number;
  value: number;
  currency?: string;
  user_data?: MetaUserData;
  event_id?: string;
}): void => {
  if (typeof window === 'undefined' || !window.fbq) return;

  const user_data = buildUserDataPayload(params.user_data);
  const payload: Record<string, unknown> = {
    content_name: buildContentName(params.product, params.quantity),
    content_category: params.product.contentCategory,
    content_ids: buildContentIds(params.product, params.quantity),
    content_type: params.product.contentType,
    num_items: params.quantity,
    value: params.value,
    currency: params.currency ?? params.product.currency,
  };
  if (user_data) payload.user_data = user_data;

  const event_id = params.event_id || generateEventId();
  window.fbq('track', 'InitiateCheckout', payload, { eventID: event_id });
  console.log('Meta Pixel: InitiateCheckout tracked', { ...payload, eventID: event_id });

  sendServerEvent({
    event_name: 'InitiateCheckout',
    event_id,
    event_source_url: window.location.href,
    user_data: { ...user_data, fbc: getFbc(), fbp: getFbp() },
    custom_data: payload,
  });
};

/**
 * Track AddToCart event.
 * Call when user confirms quantity/upsell selection.
 */
export const trackAddToCart = (params: {
  product: ProductPixelConfig;
  quantity: number;
  value: number;
  currency?: string;
  user_data?: MetaUserData;
  event_id?: string;
}): void => {
  if (typeof window === 'undefined' || !window.fbq) return;

  const user_data = buildUserDataPayload(params.user_data);
  const payload: Record<string, unknown> = {
    content_name: buildContentName(params.product, params.quantity),
    content_category: params.product.contentCategory,
    content_ids: buildContentIds(params.product, params.quantity),
    content_type: params.product.contentType,
    num_items: params.quantity,
    value: params.value,
    currency: params.currency ?? params.product.currency,
  };
  if (user_data) payload.user_data = user_data;

  const event_id = params.event_id || generateEventId();
  window.fbq('track', 'AddToCart', payload, { eventID: event_id });
  console.log('Meta Pixel: AddToCart tracked', { ...payload, eventID: event_id });

  sendServerEvent({
    event_name: 'AddToCart',
    event_id,
    event_source_url: window.location.href,
    user_data: { ...user_data, fbc: getFbc(), fbp: getFbp() },
    custom_data: payload,
  });
};

/**
 * Track AddPaymentInfo event.
 * Call when user enters or switches payment method.
 */
export const trackAddPaymentInfo = (params: {
  product: ProductPixelConfig;
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
    content_name: buildContentName(params.product, params.quantity),
    content_category: params.product.contentCategory,
    content_ids: buildContentIds(params.product, params.quantity),
    content_type: params.product.contentType,
    num_items: params.quantity,
    value: params.value,
    currency: params.currency ?? params.product.currency,
    ...(params.payment_type && { payment_type: params.payment_type }),
  };
  if (user_data) payload.user_data = user_data;

  const event_id = params.event_id || generateEventId();
  window.fbq('track', 'AddPaymentInfo', payload, { eventID: event_id });
  console.log('Meta Pixel: AddPaymentInfo tracked', { ...payload, eventID: event_id });

  sendServerEvent({
    event_name: 'AddPaymentInfo',
    event_id,
    event_source_url: window.location.href,
    user_data: { ...user_data, fbc: getFbc(), fbp: getFbp() },
    custom_data: payload,
  });
};

/**
 * Track Purchase event (conversion).
 * Call when the order is successfully completed.
 * This is the most important event for ROAS measurement.
 */
export const trackPurchase = (params: {
  product: ProductPixelConfig;
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
    content_name: buildContentName(params.product, params.quantity),
    content_category: params.product.contentCategory,
    content_ids: buildContentIds(params.product, params.quantity),
    content_type: params.product.contentType,
    num_items: params.quantity,
    value: params.value,
    currency: params.currency ?? params.product.currency,
    ...(params.order_id && { order_id: params.order_id }),
  };
  if (user_data) payload.user_data = user_data;

  const event_id = params.event_id || params.order_id || generateEventId();
  window.fbq('track', 'Purchase', payload, { eventID: event_id });
  console.log('Meta Pixel: Purchase tracked (CONVERSION)', { ...payload, eventID: event_id });

  sendServerEvent({
    event_name: 'Purchase',
    event_id,
    event_source_url: window.location.href,
    user_data: { ...user_data, fbc: getFbc(), fbp: getFbp() },
    custom_data: payload,
  });
};

/**
 * Track Lead event.
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
    currency: params.currency ?? 'PYG',
    ...(typeof params.value === 'number' && { value: params.value }),
    ...(params.content_name && { content_name: params.content_name }),
  };
  if (user_data) payload.user_data = user_data;

  const event_id = params.event_id || generateEventId();
  window.fbq('track', 'Lead', payload, { eventID: event_id });
  console.log('Meta Pixel: Lead tracked', { ...payload, eventID: event_id });

  sendServerEvent({
    event_name: 'Lead',
    event_id,
    event_source_url: window.location.href,
    user_data: { ...user_data, fbc: getFbc(), fbp: getFbp() },
    custom_data: payload,
  });
};

/**
 * Track custom event.
 * For any custom tracking needs.
 */
export const trackCustomEvent = (eventName: string, parameters?: Record<string, unknown>): void => {
  if (typeof window === 'undefined' || !window.fbq) return;

  window.fbq('trackCustom', eventName, parameters);
  console.log(`Meta Pixel: Custom event "${eventName}" tracked`, parameters);
};
