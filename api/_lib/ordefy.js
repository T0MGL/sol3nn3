/**
 * Ordefy fulfillment helpers shared across /api/* serverless handlers.
 *
 * SKU mapping is the source of truth for what gets persisted in Ordefy.
 * The frontend sends productKey ('pdrn'|'tape'|'lash'|'rizador'|'celimax') + packVariant
 * ('individual'|'duo'|'familiar'|'ritual'|'evento'|'trio'); we resolve to a
 * concrete SKU here. Bundle SKUs are 1 line item (qty=1) with bundle price;
 * non-bundle uses qty=N at unit price.
 */

const KNOWN_COUNTRY_CODES = [
  '595', '598', '591', '592', '593', '594', '597', '599',
  '54', '55', '56', '57', '58', '51', '52', '53',
  '1', '34', '39', '44', '49', '33', '7', '86', '81', '82', '91',
];

const GPS_MAPS_LINK_RE = /^https?:\/\/(?:www\.)?google\.[a-z.]+\/maps\?q=-?\d+(?:\.\d+)?,-?\d+(?:\.\d+)?/i;

export function normalizePhone(raw) {
  if (raw === undefined || raw === null) return null;
  const trimmed = String(raw).trim();
  if (!trimmed) return null;

  const hasPlus = trimmed.startsWith('+');
  let digits = trimmed.replace(/\D/g, '');
  if (!digits) return null;

  if (hasPlus) {
    if (digits.length < 8 || digits.length > 15) return null;
    return '+' + digits;
  }

  if (digits.startsWith('00')) {
    digits = digits.slice(2);
    if (digits.length < 8 || digits.length > 15) return null;
    return '+' + digits;
  }

  if (digits.startsWith('5950') && digits.length >= 12) {
    return '+595' + digits.slice(4);
  }

  if (digits.startsWith('595') && digits.length >= 11 && digits.length <= 13) {
    return '+' + digits;
  }

  if (digits.startsWith('0') && digits.length >= 9 && digits.length <= 11) {
    return '+595' + digits.slice(1);
  }

  if (/^9\d{8}$/.test(digits)) {
    return '+595' + digits;
  }

  for (const cc of KNOWN_COUNTRY_CODES) {
    if (digits.startsWith(cc) && digits.length >= cc.length + 7 && digits.length <= 15) {
      return '+' + digits;
    }
  }

  if (digits.length >= 8 && digits.length <= 10) {
    return '+595' + digits;
  }

  return null;
}

export function isRealGpsMapsLink(link) {
  return typeof link === 'string' && GPS_MAPS_LINK_RE.test(link);
}

export function generateOrdefyIdempotencyKey() {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 10);
  return `solenne-order-${timestamp}-${random}`;
}

// city  = ciudad oficial PY con acentos. Ordefy normaliza accent-insensitive.
// address = barrio + calle/numero. Nunca incluye city.
// google_maps_url = solo cuando hay GPS real, separado para que el courier
//                   abra coordenada exacta si la direccion es ambigua.
export function buildOrdefyShippingAddress({ lat, long, address, city, googleMapsLink }) {
  const trimmedAddress = typeof address === 'string' ? address.trim() : '';
  const trimmedCity = typeof city === 'string' ? city.trim() : '';
  const safeCity = trimmedCity || 'Paraguay';

  const hasRealCoords = typeof lat === 'number' && typeof long === 'number';
  const hasMapsLink = isRealGpsMapsLink(googleMapsLink);

  const payload = {
    address: trimmedAddress || safeCity,
    city: safeCity,
  };

  if (hasRealCoords) {
    payload.google_maps_url = `https://www.google.com/maps?q=${lat},${long}`;
  } else if (hasMapsLink) {
    payload.google_maps_url = googleMapsLink;
  }

  return payload;
}

export function getSku(productKey, packVariant) {
  if (productKey === 'tape') {
    if (packVariant === 'individual') return 'SOLENNE-TAPE-100';
    if (packVariant === 'ritual') return 'SOLENNE-TAPE-RITUAL';
    if (packVariant === 'evento') return 'SOLENNE-TAPE-EVENTO';
    return null;
  }
  if (productKey === 'lash') {
    if (packVariant === 'duo') return 'SOLENNE-LASH-DUO';
    if (packVariant === 'trio') return 'SOLENNE-LASH-TRIO';
    return 'SOLENNE-LASH-1';
  }
  if (productKey === 'rizador') {
    if (packVariant === 'duo') return 'RIZADOR-ELECTRICO-DUO';
    return 'RIZADOR-ELECTRICO';
  }
  if (productKey === 'celimax') {
    if (packVariant === 'duo') return 'SOLENNE-CELIMAX-DUO';
    if (packVariant === 'trio') return 'SOLENNE-CELIMAX-TRIO';
    return 'SOLENNE-CELIMAX-1';
  }
  // pdrn (default)
  if (packVariant === 'individual') return 'SOLENNE-PDRN-30ML-IND';
  if (packVariant === 'duo') return 'SOLENNE-PDRN-DUO';
  if (packVariant === 'familiar') return 'SOLENNE-PDRN-FAMILIAR';
  return null;
}

export function getTapeProductName(packVariant) {
  if (packVariant === 'individual') return 'Solenne V-Shaped Face Tape';
  if (packVariant === 'ritual') return 'Solenne V-Shaped Face Tape - Pack Ritual';
  if (packVariant === 'evento') return 'Solenne V-Shaped Face Tape - Pack Evento';
  return 'Solenne V-Shaped Face Tape';
}

export function getTapePackPrice(packVariant) {
  if (packVariant === 'ritual') return 209000;
  if (packVariant === 'evento') return 299000;
  return 129000;
}

export function getLashProductName(packVariant) {
  if (packVariant === 'duo') return 'Solenne Serum de Pestañas - Pack Dúo';
  if (packVariant === 'trio') return 'Solenne Serum de Pestañas - Pack Trío';
  return 'Solenne Serum de Pestañas';
}

export function getLashPackPrice(packVariant) {
  if (packVariant === 'duo') return 249000;
  if (packVariant === 'trio') return 339000;
  return 139000;
}

export function getCelimaxProductName(packVariant) {
  if (packVariant === 'duo') return 'Celimax Retinal Shot, Pack Dúo';
  if (packVariant === 'trio') return 'Celimax Retinal Shot, Pack Madre';
  return 'Celimax Retinal Shot';
}

export function getCelimaxPackPrice(packVariant) {
  if (packVariant === 'duo') return 319000;
  if (packVariant === 'trio') return 439000;
  return 189000;
}

export function resolveUnitPrice({ unitPrice, productPrice, quantity }) {
  if (typeof unitPrice === 'number' && unitPrice > 0) return unitPrice;
  if (quantity > 0) return Math.round(productPrice / quantity);
  return productPrice;
}

function buildItems({ productKey, packVariant, quantity, unitPrice, total, deliveryType, productName }) {
  const isPriority = deliveryType === 'premium';
  const priorityCost = isPriority ? 10000 : 0;
  const productPrice = total - priorityCost;
  const safeQuantity = Number.isInteger(quantity) && quantity > 0 ? quantity : 1;

  const items = [];

  if (productKey === 'tape') {
    const sku = getSku('tape', packVariant);
    const name = getTapeProductName(packVariant);

    if (packVariant === 'ritual' || packVariant === 'evento') {
      items.push({ sku, name, quantity: 1, price: getTapePackPrice(packVariant) });
    } else {
      items.push({ sku, name, quantity: safeQuantity, price: 129000 });
    }
  } else if (productKey === 'lash') {
    const sku = getSku('lash', packVariant);
    const name = getLashProductName(packVariant);

    if (packVariant === 'duo' || packVariant === 'trio') {
      items.push({ sku, name, quantity: 1, price: getLashPackPrice(packVariant) });
    } else {
      items.push({ sku, name, quantity: safeQuantity, price: 139000 });
    }
  } else if (productKey === 'celimax') {
    const sku = getSku('celimax', packVariant);
    const name = getCelimaxProductName(packVariant);

    if (packVariant === 'duo' || packVariant === 'trio') {
      items.push({ sku, name, quantity: 1, price: getCelimaxPackPrice(packVariant) });
    } else {
      items.push({ sku, name, quantity: safeQuantity, price: 189000 });
    }
  } else {
    // pdrn
    const sku = getSku('pdrn', packVariant);
    const name = productName || 'PDRN Serum';

    if (packVariant === 'duo' || packVariant === 'familiar') {
      // Bundle SKU: one line at the full pack price. Ordefy deducts
      // units_per_pack from the parent, so quantity must be the number of
      // PACKS (1), never the number of units. Sending quantity=N here would
      // over-deduct parent stock (N x units_per_pack).
      items.push({ sku, name, quantity: 1, price: productPrice });
    } else {
      const resolvedUnitPrice = resolveUnitPrice({ unitPrice, productPrice, quantity: safeQuantity });
      items.push({ sku, name, quantity: safeQuantity, price: resolvedUnitPrice });
    }
  }

  if (isPriority) {
    items.push({
      sku: 'SOLENNE-ENVIO-PRIORITARIO',
      name: 'Envio Prioritario VIP',
      quantity: 1,
      price: priorityCost,
    });
  }

  return items;
}

/**
 * Send order to Ordefy. Idempotent on orderNumber via idempotency_key.
 * Returns { success, data?, error? }.
 */
export async function sendToOrdefy(orderData) {
  const webhookUrl = process.env.ORDEFY_WEBHOOK_URL;
  const apiKey = process.env.ORDEFY_API_KEY;

  if (!webhookUrl || !apiKey) {
    return { success: false, error: 'Ordefy not configured' };
  }

  const {
    name, phone, email, location, address,
    lat, long, googleMapsLink,
    quantity, unitPrice, total,
    orderNumber, paymentType, isPaid, deliveryType, productName,
    productKey, packVariant,
  } = orderData;

  const items = buildItems({
    productKey, packVariant, quantity, unitPrice, total, deliveryType, productName,
  });

  const paymentStatus = isPaid === true || paymentType === 'Card' ? 'paid' : 'pending';
  const normalizedPhone = normalizePhone(phone);

  const payload = {
    idempotency_key: orderNumber || generateOrdefyIdempotencyKey(),
    customer: {
      name,
      phone: normalizedPhone || undefined,
      email: email || undefined,
    },
    shipping_address: buildOrdefyShippingAddress({
      lat, long, address, city: location, googleMapsLink,
    }),
    items,
    totals: { subtotal: total, shipping: 0, total },
    payment_method: paymentType === 'Card' ? 'online' : 'cash_on_delivery',
    payment_status: paymentStatus,
  };

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': apiKey,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Ordefy error:', response.status, errorText);
      return { success: false, error: `Ordefy API error: ${response.status}` };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('Ordefy request failed:', error.message);
    return { success: false, error: error.message };
  }
}
