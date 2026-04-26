/**
 * Vercel Serverless Function - /api/send-order
 * Forwardea la orden a n8n (WhatsApp) y Ordefy (fulfillment) en paralelo.
 *
 * Reglas:
 * - googleMapsLink solo se acepta si es una URL real de coordenadas (?q=lat,lng).
 *   Texto libre no se geocodifica; el shipping_address cae a city/address plano.
 * - quantity en Ordefy siempre refleja la cantidad real por linea. Nunca qty=1 con precio de pack.
 *   unitPrice viene del cliente; si falta, se deriva como total / quantity.
 */

function generateOrdefyIdempotencyKey() {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 10);
  return `selenne-order-${timestamp}-${random}`;
}

/**
 * Normalizes a Paraguay phone number to E.164 format (+595XXXXXXXXX).
 * The checkout form submits "+595 9XXXXXXXX" (space after country code).
 * When this reaches Ordefy without normalization, the space is treated as
 * a digit by some parsers, producing "+5950..." which causes lookup mismatches.
 */
function normalizePhone(raw) {
  if (!raw) return raw;
  const digits = String(raw).replace(/[^\d+]/g, '');
  if (digits.startsWith('+')) return digits;
  if (digits.startsWith('595')) return '+' + digits;
  if (digits.startsWith('0')) return '+595' + digits.slice(1);
  return '+595' + digits;
}

const GPS_MAPS_LINK_RE = /^https?:\/\/(?:www\.)?google\.[a-z.]+\/maps\?q=-?\d+(?:\.\d+)?,-?\d+(?:\.\d+)?/i;

function isRealGpsMapsLink(link) {
  return typeof link === 'string' && GPS_MAPS_LINK_RE.test(link);
}

function buildOrdefyShippingAddress({ lat, long, address, city, googleMapsLink }) {
  if (typeof lat === 'number' && typeof long === 'number') {
    return {
      google_maps_url: `https://www.google.com/maps?q=${lat},${long}`,
      notes: address || undefined,
    };
  }

  if (isRealGpsMapsLink(googleMapsLink)) {
    return {
      google_maps_url: googleMapsLink,
      notes: address || undefined,
    };
  }

  return {
    address: address || city,
    city,
  };
}

function getSku(productKey, packVariant) {
  if (productKey === 'tape') {
    if (packVariant === 'individual') return 'SOLENNE-TAPE-100';
    if (packVariant === 'ritual') return 'SOLENNE-TAPE-RITUAL';
    if (packVariant === 'evento') return 'SOLENNE-TAPE-EVENTO';
    return null;
  }
  if (packVariant === 'individual') return 'SOLENNE-PDRN-30ML';
  if (packVariant === 'duo') return 'SOLENNE-PDRN-DUO';
  if (packVariant === 'familiar') return 'SOLENNE-PDRN-FAMILIAR';
  return null;
}

function getTapeProductName(packVariant) {
  if (packVariant === 'individual') return 'Solenne V-Shaped Face Tape';
  if (packVariant === 'ritual') return 'Solenne V-Shaped Face Tape - Pack Ritual';
  if (packVariant === 'evento') return 'Solenne V-Shaped Face Tape - Pack Evento';
  return 'Solenne V-Shaped Face Tape';
}

function getTapePackPrice(packVariant) {
  if (packVariant === 'ritual') return 249000;
  if (packVariant === 'evento') return 339000;
  return 149000;
}

function resolveUnitPrice({ unitPrice, productPrice, quantity }) {
  if (typeof unitPrice === 'number' && unitPrice > 0) return unitPrice;
  if (quantity > 0) return Math.round(productPrice / quantity);
  return productPrice;
}

async function sendToOrdefy(orderData) {
  if (!process.env.ORDEFY_WEBHOOK_URL || !process.env.ORDEFY_API_KEY) {
    console.warn('Ordefy not configured');
    return { success: false, error: 'Ordefy not configured' };
  }

  const {
    name, phone, email, location, address,
    lat, long, googleMapsLink,
    quantity, unitPrice, total,
    orderNumber, paymentType, isPaid, deliveryType, productName,
    productKey, packVariant,
  } = orderData;

  const isPriority = deliveryType === 'premium';
  const priorityCost = isPriority ? 10000 : 0;
  const productPrice = total - priorityCost;
  const safeQuantity = Number.isInteger(quantity) && quantity > 0 ? quantity : 1;

  const items = [];

  if (productKey === 'tape') {
    const tapeSku = getSku('tape', packVariant);
    const tapeName = getTapeProductName(packVariant);

    if (packVariant === 'ritual' || packVariant === 'evento') {
      items.push({
        sku: tapeSku,
        name: tapeName,
        quantity: 1,
        price: getTapePackPrice(packVariant),
      });
    } else {
      items.push({
        sku: tapeSku,
        name: tapeName,
        quantity: safeQuantity,
        price: 149000,
      });
    }
  } else {
    const pdrnSku = getSku('pdrn', packVariant);
    const resolvedUnitPrice = resolveUnitPrice({ unitPrice, productPrice, quantity: safeQuantity });
    items.push({
      sku: pdrnSku,
      name: productName || 'PDRN Serum',
      quantity: safeQuantity,
      price: resolvedUnitPrice,
    });
  }

  if (isPriority) {
    items.push({
      sku: 'SOLENNE-ENVIO-PRIORITARIO',
      name: 'Envio Prioritario VIP',
      quantity: 1,
      price: priorityCost,
    });
  }

  const paymentStatus = isPaid === true || paymentType === 'Card' ? 'paid' : 'pending';

  const normalizedPhone = normalizePhone(phone);

  const ordefyPayload = {
    idempotency_key: orderNumber || generateOrdefyIdempotencyKey(),
    customer: { name, phone: normalizedPhone || undefined, email: email || undefined },
    shipping_address: buildOrdefyShippingAddress({ lat, long, address, city: location, googleMapsLink }),
    items,
    totals: { subtotal: total, shipping: 0, total },
    payment_method: paymentType === 'Card' ? 'online' : 'cash_on_delivery',
    payment_status: paymentStatus,
  };

  try {
    const response = await fetch(process.env.ORDEFY_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-API-Key': process.env.ORDEFY_API_KEY },
      body: JSON.stringify(ordefyPayload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Ordefy error:', response.status, errorText);
      return { success: false, error: `Ordefy API error: ${response.status}` };
    }

    const result = await response.json();
    return { success: true, data: result };
  } catch (error) {
    console.error('Ordefy failed:', error.message);
    return { success: false, error: error.message };
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
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
    } = req.body;

    if (!name || !phone || !location) {
      return res.status(400).json({ error: 'Name, phone, and location are required' });
    }

    const resolvedProductKey = productKey === 'tape' ? 'tape' : 'pdrn';
    const validVariants = ['individual', 'duo', 'familiar', 'ritual', 'evento'];
    const resolvedPackVariant = validVariants.includes(packVariant) ? packVariant : 'individual';

    const resolvedOrderNumber = orderNumber || `#SELENNE-${Date.now()}`;
    const safeQuantity = Number.isInteger(quantity) && quantity > 0 ? quantity : 1;
    const safeTotal = Number.isFinite(total) ? total : 0;
    const resolvedUnitPrice = resolveUnitPrice({
      unitPrice,
      productPrice: safeTotal - (deliveryType === 'premium' ? 10000 : 0),
      quantity: safeQuantity,
    });
    const sanitizedMapsLink = isRealGpsMapsLink(googleMapsLink) ? googleMapsLink : null;
    const resolvedPhone = normalizePhone(phone);

    const webhookPayload = {
      orderNumber: resolvedOrderNumber,
      timestamp: new Date().toISOString(),
      customer: { name, phone: resolvedPhone, email: email || null },
      location: {
        city: location,
        address: address || '',
        googleMapsLink: sanitizedMapsLink,
      },
      order: {
        quantity: safeQuantity,
        unitPrice: resolvedUnitPrice,
        product: productName || (resolvedProductKey === 'tape' ? 'V-Shaped Face Tape' : 'PDRN Serum'),
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
      source: 'selenne-landing-page',
    };

    console.log('Processing order:', resolvedOrderNumber, resolvedProductKey, resolvedPackVariant, 'qty:', safeQuantity);

    const [n8nResult, ordefyResult] = await Promise.allSettled([
      process.env.N8N_WEBHOOK_URL
        ? fetch(process.env.N8N_WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(webhookPayload),
          }).then(async (r) => {
            if (!r.ok) throw new Error(`n8n webhook failed: ${r.status}`);
            return r.json().catch(() => ({}));
          })
        : Promise.resolve({ skipped: true, reason: 'N8N_WEBHOOK_URL not configured' }),

      sendToOrdefy({
        name, phone: resolvedPhone, email, location, address,
        lat, long, googleMapsLink: sanitizedMapsLink,
        quantity: safeQuantity,
        unitPrice: resolvedUnitPrice,
        total: safeTotal,
        productName,
        productKey: resolvedProductKey,
        packVariant: resolvedPackVariant,
        orderNumber: resolvedOrderNumber,
        paymentType, isPaid, deliveryType,
      }),
    ]);

    const n8nSuccess = n8nResult.status === 'fulfilled' && !n8nResult.value?.skipped;
    const ordefySuccess = ordefyResult.status === 'fulfilled' && ordefyResult.value?.success;

    if (n8nResult.status === 'rejected') {
      console.error('n8n failed:', n8nResult.reason?.message);
    }

    return res.status(200).json({
      success: n8nSuccess || ordefySuccess,
      message: 'Order processed',
      orderNumber: resolvedOrderNumber,
      n8nResponse: n8nResult.status === 'fulfilled' ? n8nResult.value : { error: n8nResult.reason?.message },
      ordefyResponse: ordefyResult.status === 'fulfilled' ? ordefyResult.value : { error: ordefyResult.reason?.message },
    });

  } catch (error) {
    console.error('Error:', error.message);
    return res.status(500).json({ error: error.message || 'Failed to send order', success: false });
  }
}
