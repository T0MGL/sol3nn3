/**
 * Stripe SDK singleton.
 * Cached across warm invocations of the same Vercel Lambda container.
 * STRIPE_SECRET_KEY is read lazily; missing key throws on first use, not at import time.
 */

import Stripe from 'stripe';

let cached = null;

export function getStripe() {
  if (cached) return cached;

  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error('STRIPE_SECRET_KEY is not configured');
  }

  cached = new Stripe(key, {
    apiVersion: '2024-12-18.acacia',
    typescript: false,
  });

  return cached;
}
