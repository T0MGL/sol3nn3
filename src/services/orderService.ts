/**
 * Order Service
 * Llama directamente al webhook de n8n desde el frontend.
 * Sin backend intermedio.
 */

const N8N_WEBHOOK_URL = import.meta.env.VITE_N8N_WEBHOOK_URL || 'https://n8n.thebrightidea.ai/webhook/nocteorder';

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
 * Envía la orden directamente al webhook de n8n desde el browser.
 */
export async function sendOrderToN8N(
  orderData: OrderData
): Promise<SendOrderResponse> {
  try {
    console.log('📦 Enviando orden directo a n8n...', orderData);

    // Google Maps link desde coordenadas GPS si están disponibles
    let googleMapsLink: string | null = null;
    if (orderData.lat && orderData.long) {
      googleMapsLink = `https://www.google.com/maps?q=${orderData.lat},${orderData.long}`;
    } else if (orderData.address && orderData.location) {
      const fullAddress = `${orderData.address}, ${orderData.location}`;
      googleMapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`;
    }

    const payload = {
      orderNumber: orderData.orderNumber,
      timestamp: new Date().toISOString(),
      customer: {
        name: orderData.name,
        phone: orderData.phone,
        email: orderData.email || null,
      },
      location: {
        city: orderData.location,
        address: orderData.address || '',
        googleMapsLink,
      },
      order: {
        quantity: orderData.quantity,
        product: orderData.productName,
        total: orderData.total,
        currency: 'PYG',
        deliveryType: orderData.deliveryType,
      },
      payment: {
        method: orderData.paymentType,
        status: orderData.isPaid === true || orderData.paymentType === 'Card' ? 'paid' : 'pending',
        isPaid: orderData.isPaid === true || orderData.paymentType === 'Card',
        paymentIntentId: orderData.paymentIntentId || null,
      },
      source: 'selenne-landing-page',
    };

    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`n8n respondió con status: ${response.status}`);
    }

    console.log('✅ Orden enviada a n8n exitosamente');
    return { success: true, message: 'Orden enviada', orderNumber: orderData.orderNumber };

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Error al enviar orden';
    console.error('❌ Error enviando orden a n8n:', errorMessage);
    return { success: false, message: errorMessage, orderNumber: orderData.orderNumber, error: errorMessage };
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
 * Formato: #NOC-MMDD-XXXX
 */
export function generateOrderNumber(): string {
  const date = new Date();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `#NOC-${month}${day}-${random}`;
}
