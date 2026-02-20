/**
 * Vercel Serverless Function - /api/send-order
 * Reemplaza el backend Express. Envía la orden a n8n y Ordefy.
 */

function generateOrdefyIdempotencyKey() {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 10);
  return `selenne-order-${timestamp}-${random}`;
}

function buildOrdefyShippingAddress({ lat, long, address, city, googleMapsLink }) {
  if (lat && long) {
    return {
      google_maps_url: `https://www.google.com/maps?q=${lat},${long}`,
      notes: address || undefined,
    };
  }
  if (googleMapsLink && /maps\.google\.com\/.*\?q=-?\d+\.?\d*,-?\d+\.?\d*/.test(googleMapsLink)) {
    return {
      google_maps_url: googleMapsLink,
      notes: address || undefined,
    };
  }
  return {
    address: address || city,
    city: city,
  };
}

function getSku(quantity) {
  if (quantity === 1) return 'SELENNE-PACK-1';
  if (quantity === 2) return 'SELENNE-PACK-2';
  return `SELENNE-PACK-${quantity}`;
}

async function sendToOrdefy(orderData) {
  if (!process.env.ORDEFY_WEBHOOK_URL || !process.env.ORDEFY_API_KEY) {
    console.warn('⚠️ Ordefy not configured');
    return { success: false, error: 'Ordefy not configured' };
  }

  const { name, phone, email, location, address, lat, long, googleMapsLink, quantity, total, orderNumber, paymentType, isPaid, deliveryType, productName } = orderData;

  const isPriority = deliveryType === 'premium';
  const priorityCost = isPriority ? 10000 : 0;
  const productPrice = total - priorityCost;

  const items = [
    {
      sku: getSku(quantity || 1),
      name: productName || 'SELENNE',
      quantity: 1,
      price: productPrice,
    },
  ];

  if (isPriority) {
    items.push({ sku: 'SELENNE-ENVIO-PRIORITARIO', name: 'Envío Prioritario VIP', quantity: 1, price: priorityCost });
  }

  const paymentStatus = isPaid === true || paymentType === 'Card' ? 'paid' : 'pending';

  const ordefyPayload = {
    idempotency_key: orderNumber || generateOrdefyIdempotencyKey(),
    customer: { name, phone: phone || undefined, email: email || undefined },
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
      console.error('❌ Ordefy error:', response.status, errorText);
      return { success: false, error: `Ordefy API error: ${response.status}` };
    }

    const result = await response.json();
    console.log('✅ Ordefy OK:', result);
    return { success: true, data: result };
  } catch (error) {
    console.error('❌ Ordefy failed:', error.message);
    return { success: false, error: error.message };
  }
}

export default async function handler(req, res) {
  // Solo aceptar POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      name, phone, location, address,
      lat, long, googleMapsLink,
      quantity, total, orderNumber,
      paymentIntentId, email,
      paymentType, isPaid, deliveryType, productName,
    } = req.body;

    if (!name || !phone || !location) {
      return res.status(400).json({ error: 'Name, phone, and location are required' });
    }

    const resolvedOrderNumber = orderNumber || `#SELENNE-${Date.now()}`;

    // Payload para n8n
    const webhookPayload = {
      orderNumber: resolvedOrderNumber,
      timestamp: new Date().toISOString(),
      customer: { name, phone, email: email || null },
      location: { city: location, address: address || '', googleMapsLink: googleMapsLink || null },
      order: {
        quantity: quantity || 1,
        product: productName || 'SELENNE',
        total: total || 0,
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

    console.log('📦 Processing order:', resolvedOrderNumber);

    // Enviar a n8n y Ordefy en paralelo
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
        name, phone, email, location, address,
        lat, long, googleMapsLink,
        quantity, total, productName,
        orderNumber: resolvedOrderNumber,
        paymentType, isPaid, deliveryType,
      }),
    ]);

    const n8nSuccess = n8nResult.status === 'fulfilled' && !n8nResult.value?.skipped;
    const ordefySuccess = ordefyResult.status === 'fulfilled' && ordefyResult.value?.success;

    if (n8nResult.status === 'fulfilled') {
      console.log(n8nSuccess ? '✅ n8n OK' : '⚠️ n8n skipped:', n8nResult.value);
    } else {
      console.error('❌ n8n failed:', n8nResult.reason?.message);
    }

    return res.status(200).json({
      success: n8nSuccess || ordefySuccess,
      message: 'Order processed',
      orderNumber: resolvedOrderNumber,
      n8nResponse: n8nResult.status === 'fulfilled' ? n8nResult.value : { error: n8nResult.reason?.message },
      ordefyResponse: ordefyResult.status === 'fulfilled' ? ordefyResult.value : { error: ordefyResult.reason?.message },
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
    return res.status(500).json({ error: error.message || 'Failed to send order', success: false });
  }
}
