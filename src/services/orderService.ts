/**
 * Order Service
 * Envia ordenes al serverless function /api/send-order que forwardea a n8n Y Ordefy.
 * Fallback: envia directo a n8n si la serverless function falla.
 *
 * googleMapsLink solo se genera cuando el cliente comparte GPS real via browser.
 * Texto libre nunca se geocodifica: el cliente espera que un link apunte a su ubicacion real.
 */

const API_URL = import.meta.env.VITE_API_URL || '';
const N8N_WEBHOOK_URL = import.meta.env.VITE_N8N_WEBHOOK_URL || 'https://n8n.thebrightidea.ai/webhook/solenneorder';

export type ProductKey = 'pdrn' | 'tape' | 'rizador';
export type PackVariant = 'individual' | 'duo' | 'familiar' | 'ritual' | 'evento';

export interface OrderData {
  name: string;
  phone: string;
  location: string;
  address?: string;
  lat?: number;
  long?: number;
  quantity: number;
  unitPrice: number;
  total: number;
  orderNumber: string;
  paymentIntentId?: string;
  email?: string;
  paymentType: 'COD' | 'Cash' | 'Card';
  isPaid?: boolean;
  deliveryType: 'común' | 'premium';
  productName: string;
  productKey: ProductKey;
  packVariant: PackVariant;
}

export interface SendOrderResponse {
  success: boolean;
  message: string;
  orderNumber: string;
  error?: string;
}

function buildGpsMapsLink(lat?: number, long?: number): string | null {
  if (typeof lat !== 'number' || typeof long !== 'number') return null;
  return `https://www.google.com/maps?q=${lat},${long}`;
}

export async function sendOrderToN8N(
  orderData: OrderData
): Promise<SendOrderResponse> {
  const googleMapsLink = buildGpsMapsLink(orderData.lat, orderData.long);
  const isPaid = orderData.isPaid === true || orderData.paymentType === 'Card';

  try {
    const payload = {
      name: orderData.name,
      phone: orderData.phone,
      email: orderData.email || null,
      location: orderData.location,
      address: orderData.address || '',
      lat: orderData.lat ?? null,
      long: orderData.long ?? null,
      googleMapsLink,
      quantity: orderData.quantity,
      unitPrice: orderData.unitPrice,
      total: orderData.total,
      orderNumber: orderData.orderNumber,
      paymentType: orderData.paymentType,
      isPaid,
      deliveryType: orderData.deliveryType,
      productName: orderData.productName,
      productKey: orderData.productKey,
      packVariant: orderData.packVariant,
      paymentIntentId: orderData.paymentIntentId || null,
    };

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
    try {
      const fallbackPayload = {
        orderNumber: orderData.orderNumber,
        timestamp: new Date().toISOString(),
        customer: { name: orderData.name, phone: orderData.phone, email: orderData.email || null },
        location: {
          city: orderData.location,
          address: orderData.address || '',
          googleMapsLink,
        },
        order: {
          quantity: orderData.quantity,
          unitPrice: orderData.unitPrice,
          product: orderData.productName,
          productKey: orderData.productKey,
          packVariant: orderData.packVariant,
          total: orderData.total,
          currency: 'PYG',
        },
        payment: { method: orderData.paymentType, isPaid },
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
