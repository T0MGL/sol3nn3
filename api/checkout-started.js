/**
 * POST /api/checkout-started
 * Step-1 capture for abandoned-checkout recovery. The user gave us name + phone
 * but has not paid yet. We push the lead to n8n so a WhatsApp follow-up can fire
 * after a delay if the order never completes.
 *
 * Returns 200 immediately; the n8n forward is fire-and-forget so a slow workflow
 * never blocks the checkout UX.
 */

import { sendCheckoutStarted } from './_lib/n8n.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const body = req.body || {};
  const { name, phone } = body;

  if (!name || !phone) {
    return res.status(400).json({ error: 'Name and phone are required' });
  }

  res.status(200).json({ success: true });

  const payload = {
    type: 'checkout_started',
    store_id: 'solenne',
    timestamp: new Date().toISOString(),
    customer: { name, phone },
    location: {
      city: body.location || '',
      address: body.address || '',
      lat: body.lat ?? null,
      long: body.long ?? null,
    },
    bundle: {
      label: body.bundleLabel || '',
      quantity: body.quantity || 1,
      price: body.price || 0,
    },
    source: 'solenne-landing-page',
  };

  sendCheckoutStarted(payload).catch((err) => {
    console.error('checkout-started forward error:', err?.message);
  });
}
