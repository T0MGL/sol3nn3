/**
 * POST /api/create-payment-intent
 * Creates a Stripe PaymentIntent for the Solenne checkout (card + Apple/Google Pay).
 *
 * Idempotency: uses orderNumber as the Stripe idempotencyKey when present, so a retry
 * from the browser after a flaky network never produces a duplicate PaymentIntent.
 *
 * The metadata.brand=solenne tag is what the webhook reads server-side to decide
 * which Ordefy store + n8n workflow to forward to.
 */

import { getStripe } from './_lib/stripe.js';

const MIN_BY_CURRENCY = { pyg: 1000, usd: 50 };
const MAX_BY_CURRENCY = { pyg: 10000000, usd: 100000 };

function validateBody(body) {
  if (!body || typeof body !== 'object') {
    return { ok: false, error: 'Invalid JSON body' };
  }

  const { amount, currency, email } = body;

  if (typeof amount !== 'number' || !Number.isFinite(amount)) {
    return { ok: false, error: 'amount must be a number' };
  }
  if (typeof currency !== 'string' || currency.length === 0) {
    return { ok: false, error: 'currency is required' };
  }
  if (typeof email !== 'string' || !email.includes('@')) {
    return { ok: false, error: 'email is required' };
  }

  const cur = currency.toLowerCase();
  const min = MIN_BY_CURRENCY[cur] ?? 100;
  const max = MAX_BY_CURRENCY[cur] ?? 100000;

  if (amount < min || amount > max) {
    return { ok: false, error: `amount must be between ${min} and ${max} ${cur.toUpperCase()}` };
  }

  return { ok: true, data: { amount: Math.round(amount), currency: cur, email } };
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const validation = validateBody(req.body);
  if (!validation.ok) {
    return res.status(400).json({ error: validation.error });
  }

  const { amount, currency, email } = validation.data;
  const { paymentMethodId, shipping, metadata, orderNumber } = req.body;

  const intentParams = {
    amount,
    currency,
    receipt_email: email,
    description: 'Solenne PDRN Pink Peptide Serum',
    metadata: {
      brand: 'solenne',
      product: 'PDRN Pink Peptide Serum 30ml',
      orderNumber: orderNumber || '',
      ...(metadata && typeof metadata === 'object' ? metadata : {}),
    },
    automatic_payment_methods: {
      enabled: true,
      allow_redirects: 'never',
    },
  };

  if (paymentMethodId && paymentMethodId !== 'pending') {
    intentParams.payment_method = paymentMethodId;
    intentParams.confirm = true;
  }

  if (shipping && shipping.name && shipping.address) {
    intentParams.shipping = {
      name: shipping.name,
      address: {
        line1: shipping.address.line1 || '',
        line2: shipping.address.line2 || null,
        city: shipping.address.city || '',
        state: shipping.address.state || '',
        postal_code: shipping.address.postal_code || '',
        country: shipping.address.country || 'PY',
      },
    };
  }

  const idempotencyKey = orderNumber || `solenne-pi-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

  try {
    const stripe = getStripe();
    const paymentIntent = await stripe.paymentIntents.create(intentParams, { idempotencyKey });

    return res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      status: paymentIntent.status,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
    });
  } catch (error) {
    const message = error?.message || 'Failed to create payment intent';
    const type = error?.type || 'unknown_error';

    if (type === 'StripeCardError') {
      return res.status(400).json({ error: 'Card was declined', details: message });
    }
    if (type === 'StripeInvalidRequestError') {
      return res.status(400).json({ error: 'Invalid request to Stripe', details: message });
    }

    console.error('create-payment-intent error:', message, type);
    return res.status(500).json({ error: message, type });
  }
}
