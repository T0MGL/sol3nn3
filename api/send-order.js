/**
 * POST /api/send-order
 * Forwardea la orden a n8n (WhatsApp closer) y Ordefy (fulfillment) en paralelo.
 *
 * Reglas:
 *  - googleMapsLink solo se acepta si es URL real de coordenadas (?q=lat,lng).
 *    Texto libre nunca se geocodifica.
 *  - quantity en Ordefy refleja la cantidad real por linea. Bundles van qty=1
 *    con precio total del pack; non-bundle va qty=N con unitPrice.
 *  - Idempotencia via orderNumber (Ordefy idempotency_key).
 *
 * Este endpoint corre desde el browser despues de confirmPayment exitoso o
 * tras seleccionar COD. Para tarjeta hay un segundo path: el webhook de Stripe
 * tambien llama sendToOrdefy con el mismo orderNumber, asi si el browser muere
 * antes de llegar aca, la orden igual cae en Ordefy.
 */

import { isRealGpsMapsLink, normalizePhone, sendToOrdefy } from './_lib/ordefy.js';
import { sendToN8N } from './_lib/n8n.js';

const VALID_PRODUCT_KEYS = new Set(['pdrn', 'tape', 'lash', 'rizador', 'celimax']);
const VALID_PACK_VARIANTS = new Set(['individual', 'duo', 'trio', 'familiar', 'ritual', 'evento']);

function resolveProductKey(input) {
  if (typeof input === 'string' && VALID_PRODUCT_KEYS.has(input)) return input;
  return 'pdrn';
}

function resolvePackVariant(input) {
  if (typeof input === 'string' && VALID_PACK_VARIANTS.has(input)) return input;
  return 'individual';
}

function resolveUnitPriceFromBody({ unitPrice, productPrice, quantity }) {
  if (typeof unitPrice === 'number' && unitPrice > 0) return unitPrice;
  if (quantity > 0) return Math.round(productPrice / quantity);
  return productPrice;
}

function defaultProductLabel(productKey) {
  if (productKey === 'tape') return 'V-Shaped Face Tape';
  if (productKey === 'lash') return 'Serum de Pestanas';
  if (productKey === 'rizador') return 'Rizador de Pestanas';
  if (productKey === 'celimax') return 'Celimax Retinal Shot';
  return 'PDRN Serum';
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      name, phone, location, address,
      lat, long, googleMapsLink,
      quantity, unitPrice, total, orderNumber,
      paymentIntentId, email,
      paymentType, isPaid, deliveryType, productName,
      productKey, packVariant,
    } = req.body || {};

    if (!name || !phone || !location) {
      return res.status(400).json({ error: 'Name, phone, and location are required' });
    }

    const normalizedPhone = normalizePhone(phone);
    if (!normalizedPhone) {
      return res.status(400).json({
        error: 'Phone format not recognized. Use Paraguay mobile (e.g. 0981234567) or full international (+595981234567).',
        success: false,
      });
    }

    const resolvedProductKey = resolveProductKey(productKey);
    const resolvedPackVariant = resolvePackVariant(packVariant);

    const resolvedOrderNumber = orderNumber || `#SOL-${Date.now()}`;
    const safeQuantity = Number.isInteger(quantity) && quantity > 0 ? quantity : 1;
    const safeTotal = Number.isFinite(total) ? total : 0;
    const productPriceNet = safeTotal - (deliveryType === 'premium' ? 10000 : 0);
    const resolvedUnitPrice = resolveUnitPriceFromBody({
      unitPrice,
      productPrice: productPriceNet,
      quantity: safeQuantity,
    });

    const sanitizedMapsLink = isRealGpsMapsLink(googleMapsLink) ? googleMapsLink : null;

    const webhookPayload = {
      orderNumber: resolvedOrderNumber,
      timestamp: new Date().toISOString(),
      customer: { name, phone: normalizedPhone, email: email || null },
      location: {
        city: location,
        address: address || '',
        googleMapsLink: sanitizedMapsLink,
      },
      order: {
        quantity: safeQuantity,
        unitPrice: resolvedUnitPrice,
        product: productName || defaultProductLabel(resolvedProductKey),
        productKey: resolvedProductKey,
        packVariant: resolvedPackVariant,
        total: safeTotal,
        currency: 'PYG',
      },
      payment: {
        method: paymentType || 'COD',
        status: isPaid === true || paymentType === 'Card' ? 'paid' : 'pending',
        isPaid: isPaid === true || paymentType === 'Card',
        paymentIntentId: paymentIntentId || null,
      },
      source: 'solenne-landing-page',
    };

    const [n8nResult, ordefyResult] = await Promise.allSettled([
      sendToN8N(webhookPayload),
      sendToOrdefy({
        name,
        phone: normalizedPhone,
        email,
        location,
        address,
        lat,
        long,
        googleMapsLink: sanitizedMapsLink,
        quantity: safeQuantity,
        unitPrice: resolvedUnitPrice,
        total: safeTotal,
        productName,
        productKey: resolvedProductKey,
        packVariant: resolvedPackVariant,
        orderNumber: resolvedOrderNumber,
        paymentType,
        isPaid,
        deliveryType,
      }),
    ]);

    const n8nValue = n8nResult.status === 'fulfilled' ? n8nResult.value : { error: n8nResult.reason?.message };
    const ordefyValue = ordefyResult.status === 'fulfilled' ? ordefyResult.value : { error: ordefyResult.reason?.message };

    const n8nSuccess = n8nResult.status === 'fulfilled' && !n8nValue?.skipped;
    const ordefySuccess = ordefyResult.status === 'fulfilled' && ordefyValue?.success;

    return res.status(200).json({
      success: n8nSuccess || ordefySuccess,
      message: 'Order processed',
      orderNumber: resolvedOrderNumber,
      n8nResponse: n8nValue,
      ordefyResponse: ordefyValue,
    });
  } catch (error) {
    console.error('send-order error:', error?.message);
    return res.status(500).json({ error: error?.message || 'Failed to send order', success: false });
  }
}
