/**
 * n8n webhook helpers shared across /api/* serverless handlers.
 *
 * Two channels:
 *   - N8N_WEBHOOK_URL                       order completion (success or COD pending)
 *   - N8N_ABANDONED_CHECKOUT_WEBHOOK_URL    step-1 captured, no purchase yet
 *
 * Missing env -> graceful skip. Errors are logged, never thrown to the caller.
 */

export async function sendToN8N(payload) {
  const url = process.env.N8N_WEBHOOK_URL;
  if (!url) {
    return { skipped: true, reason: 'N8N_WEBHOOK_URL not configured' };
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`n8n webhook failed: ${response.status}`);
    }

    return await response.json().catch(() => ({}));
  } catch (error) {
    console.error('n8n send failed:', error.message);
    throw error;
  }
}

/**
 * Fire-and-forget: caller already returned 200 to the browser. We just relay
 * the abandoned-checkout signal so the n8n flow can chase the lead via WhatsApp.
 */
export async function sendCheckoutStarted(payload) {
  const url = process.env.N8N_ABANDONED_CHECKOUT_WEBHOOK_URL;
  if (!url) return { skipped: true };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.error('checkout-started forward failed:', response.status);
      return { success: false };
    }

    return { success: true };
  } catch (error) {
    console.error('checkout-started forward error:', error.message);
    return { success: false, error: error.message };
  }
}
