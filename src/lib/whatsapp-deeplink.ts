/**
 * WhatsApp hand-off helper for demand-validation SKUs (no Ordefy checkout).
 *
 * Builds a wa.me deeplink with a pre-filled, URL-encoded Spanish message and
 * fires Meta Lead event (Pixel + CAPI via existing trackLead) right before
 * navigation. We never wrap the click in a setTimeout race: the wa.me URL
 * opens on user gesture in the SAME tick to bypass mobile popup blockers,
 * and trackLead is fired synchronously before the navigation happens.
 *
 * For Sofia hand-off the phone number lives in VITE_WHATSAPP_NUMBER. Update
 * via .env, never hardcode another number elsewhere.
 */

import { trackLead } from './meta-pixel';
import { getFbc, getFbp } from './meta-matching';
import { SERUM_WHATSAPP_FALLBACK } from '@/data/serumProduct';

const sanitizeNumber = (raw: string): string => raw.replace(/[^0-9]/g, '');

export const getWhatsappNumber = (): string => {
  const fromEnv = import.meta.env.VITE_WHATSAPP_NUMBER;
  if (typeof fromEnv === 'string' && fromEnv.length > 0) {
    return sanitizeNumber(fromEnv);
  }
  return SERUM_WHATSAPP_FALLBACK;
};

export const buildWhatsappUrl = (message: string, phone: string = getWhatsappNumber()): string => {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${phone}?text=${encoded}`;
};

export interface SerumLeadParams {
  readonly contentName: string;
  readonly value: number;
}

/**
 * Fire Meta Lead (browser pixel + server CAPI) for a serum WhatsApp hand-off.
 * Uses fbc/fbp cookies for advanced matching. PII (email/phone) is not
 * collected on this landing, so user_data is intentionally minimal.
 */
export const fireSerumLead = ({ contentName, value }: SerumLeadParams): void => {
  trackLead({
    value,
    currency: 'PYG',
    content_name: contentName,
    user_data: {
      fbc: getFbc(),
      fbp: getFbp(),
    },
  });
};
