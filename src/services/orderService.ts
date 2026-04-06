/**
 * Order Service
 * Envia ordenes al serverless function /api/send-order que forwardea a n8n Y Ordefy.
 * Fallback: envia directo a n8n si la serverless function falla.
 */

const API_URL = import.meta.env.VITE_API_URL || '';
const N8N_WEBHOOK_URL = import.meta.env.VITE_N8N_WEBHOOK_URL || 'https://n8n.thebrightidea.ai/webhook/solenneorder';

export interface OrderData {
  name: string;
  phone: string;
  location: string;
  address?: string;
  lat?: number;
  long?: number;
  quantity: number;
  total: number;
  orderNumber: string;
  paymentIntentId?: string;
  email?: string;
  paymentType: 'COD' | 'Cash' | 'Card';
  isPaid?: boolean;
  deliveryType: 'común' | 'premium';
  productName: string;
}

export interface SendOrderResponse {
  success: boolean;
  message: string;
  orderNumber: string;
  error?: string;
}

/**
 * Envia la orden via serverless function (n8n + Ordefy en paralelo).
 * Fallback: envia directo a n8n si /api/send-order no esta disponible.
 */
export async function sendOrderToN8N(
  orderData: OrderData
): Promise<SendOrderResponse> {
  try {
    let googleMapsLink: string | null = null;
    if (orderData.lat && orderData.long) {
      googleMapsLink = `https://www.google.com/maps?q=${orderData.lat},${orderData.long}`;
    } else if (orderData.address && orderData.location) {
      const fullAddress = `${orderData.address}, ${orderData.location}`;
      googleMapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`;
    }

    const payload = {
      name: orderData.name,
      phone: orderData.phone,
      email: orderData.email || null,
      location: orderData.location,
      address: orderData.address || '',
      lat: orderData.lat || null,
      long: orderData.long || null,
      googleMapsLink,
      quantity: orderData.quantity,
      total: orderData.total,
      orderNumber: orderData.orderNumber,
      paymentType: orderData.paymentType,
      isPaid: orderData.isPaid === true || orderData.paymentType === 'Card',
      deliveryType: orderData.deliveryType,
      productName: orderData.productName,
      paymentIntentId: orderData.paymentIntentId || null,
    };

    // Try serverless function first (sends to both n8n AND Ordefy)
    const apiEndpoint = `${API_URL}/api/send-order`;
    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const result = await response.json();
    return { success: result.success, message: 'Orden enviada', orderNumber: result.orderNumber || orderData.orderNumber };

  } catch (error) {
    // Fallback: send directly to n8n (email will work, Ordefy won't)
    try {
      const fallbackPayload = {
        orderNumber: orderData.orderNumber,
        timestamp: new Date().toISOString(),
        customer: { name: orderData.name, phone: orderData.phone, email: orderData.email || null },
        location: { city: orderData.location, address: orderData.address || '' },
        order: { quantity: orderData.quantity, product: orderData.productName, total: orderData.total, currency: 'PYG' },
        payment: { method: orderData.paymentType, isPaid: orderData.isPaid === true || orderData.paymentType === 'Card' },
        source: 'selenne-landing-page',
      };

      await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fallbackPayload),
      });

      return { success: true, message: 'Orden enviada (fallback)', orderNumber: orderData.orderNumber };
    } catch (fallbackError) {
      const errorMessage = fallbackError instanceof Error ? fallbackError.message : 'Error al enviar orden';
      return { success: false, message: errorMessage, orderNumber: orderData.orderNumber, error: errorMessage };
    }
  }
}

/**
 * Fire-and-forget: envía la orden en background sin bloquear la UI.
 */
export function sendOrderInBackground(orderData: OrderData): void {
  setTimeout(() => {
    sendOrderToN8N(orderData).catch((error) => {
      console.error('❌ Background order send failed:', error);
    });
  }, 0);
}

/**
 * Genera número de orden único.
 * Formato: #SOL-MMDD-XXXX
 */
export function generateOrderNumber(): string {
  const date = new Date();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `#SOL-${month}${day}-${random}`;
}
