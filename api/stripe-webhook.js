/**
 * POST /api/stripe-webhook
 * Server-authoritative event handler for Stripe.
 *
 * Why this exists:
 *   - confirmPayment in the browser can succeed but the user closes the tab
 *     before /api/send-order fires. Without this webhook the order is paid
 *     in Stripe but invisible to Ordefy and the fulfillment pipeline.
 *   - Stripe retries deliveries on 5xx, so handlers must be idempotent. We
 *     pass orderNumber as Ordefy idempotency_key so retries dedupe.
 *
 * bodyParser is disabled so the raw bytes used for signature verification
 * match exactly what Stripe signed. Any reformat (Vercel JSON-parsing, etc.)
 * breaks the HMAC and Stripe rejects every event.
 */

import { getStripe } from './_lib/stripe.js';
import { sendToOrdefy } from './_lib/ordefy.js';

export const config = {
  api: {
    bodyParser: false,
  },
};

async function readRawBody(req) {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

function deriveOrderNumberFromIntent(paymentIntent) {
  const fromMetadata = paymentIntent?.metadata?.orderNumber;
  if (typeof fromMetadata === 'string' && fromMetadata.length > 0) {
    return fromMetadata;
  }
  return `#SOL-PI-${paymentIntent.id}`;
}

async function handlePaymentIntentSucceeded(paymentIntent) {
  const metadata = paymentIntent.metadata || {};

  if (metadata.brand !== 'solenne') {
    console.log('webhook: ignoring non-solenne PaymentIntent', paymentIntent.id);
    return { skipped: true, reason: 'not solenne' };
  }

  const orderNumber = deriveOrderNumberFromIntent(paymentIntent);
  const total = paymentIntent.amount;
  const customerName = paymentIntent.shipping?.name || metadata.customerName || '';
  const customerPhone = metadata.customerPhone || paymentIntent.shipping?.phone || '';
  const customerEmail = paymentIntent.receipt_email || metadata.customerEmail || '';

  const shippingAddr = paymentIntent.shipping?.address;
  const result = await sendToOrdefy({
    name: customerName,
    phone: customerPhone,
    email: customerEmail,
    location: shippingAddr?.city || metadata.city || '',
    address: shippingAddr?.line1 || metadata.address || '',
    lat: metadata.lat ? Number(metadata.lat) : undefined,
    long: metadata.long ? Number(metadata.long) : undefined,
    googleMapsLink: metadata.googleMapsLink || null,
    quantity: metadata.quantity ? Number(metadata.quantity) : 1,
    unitPrice: metadata.unitPrice ? Number(metadata.unitPrice) : undefined,
    total,
    orderNumber,
    paymentType: 'Card',
    isPaid: true,
    deliveryType: metadata.deliveryType || 'comun',
    productName: metadata.productName || 'Solenne PDRN Serum',
    productKey: metadata.productKey || 'pdrn',
    packVariant: metadata.packVariant || 'individual',
  });

  return result;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error('STRIPE_WEBHOOK_SECRET is not configured');
    return res.status(500).json({ error: 'Webhook secret not configured' });
  }

  let event;
  try {
    const rawBody = await readRawBody(req);
    const signature = req.headers['stripe-signature'];
    const stripe = getStripe();
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (error) {
    console.error('Webhook signature verification failed:', error?.message);
    return res.status(400).json({ error: `Webhook Error: ${error?.message}` });
  }

  try {
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const result = await handlePaymentIntentSucceeded(event.data.object);
        console.log('webhook payment_intent.succeeded handled:', event.data.object.id, result);
        break;
      }

      case 'payment_intent.payment_failed': {
        const pi = event.data.object;
        console.log('webhook payment failed:', pi.id, pi.last_payment_error?.message);
        break;
      }

      case 'charge.succeeded': {
        const charge = event.data.object;
        console.log('webhook charge.succeeded:', charge.id, charge.amount, charge.currency);
        break;
      }

      case 'charge.refunded': {
        const charge = event.data.object;
        console.log('webhook charge.refunded:', charge.id, 'amount_refunded:', charge.amount_refunded);
        break;
      }

      default:
        console.log('webhook unhandled event type:', event.type);
    }

    return res.status(200).json({ received: true });
  } catch (error) {
    console.error('webhook handler error:', error?.message);
    // Return 500 so Stripe retries. Idempotency_key prevents Ordefy duplicates.
    return res.status(500).json({ error: 'Handler error' });
  }
}
