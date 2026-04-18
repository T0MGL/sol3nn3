/**
 * Vercel Serverless Function - /api/meta-capi
 * Server-side Meta Conversions API (CAPI) endpoint for Solenne.
 * Receives pixel events from the frontend and forwards them to Meta's Graph API.
 *
 * Hashed PII fields (em, ph, fn, ln, external_id) are wrapped in arrays per CAPI spec.
 * fbc and fbp remain plain strings.
 * client_ip_address and client_user_agent are injected server-side.
 */

const PIXEL_ID_FALLBACK = '2322991584857999';

const ARRAY_WRAP_FIELDS = ['em', 'ph', 'fn', 'ln', 'external_id'];

function extractClientIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.length > 0) {
    return forwarded.split(',')[0].trim();
  }
  return req.socket?.remoteAddress || null;
}

function buildUserData(userData, clientIp, clientUserAgent) {
  const result = {};

  if (userData && typeof userData === 'object') {
    for (const [key, value] of Object.entries(userData)) {
      if (value === null || value === undefined || value === '') continue;

      if (ARRAY_WRAP_FIELDS.includes(key)) {
        result[key] = Array.isArray(value) ? value : [value];
      } else {
        result[key] = value;
      }
    }
  }

  if (clientIp) result.client_ip_address = clientIp;
  if (clientUserAgent) result.client_user_agent = clientUserAgent;

  return result;
}

function validateRequiredFields(body) {
  const required = ['event_name', 'event_time', 'event_source_url', 'event_id'];
  const missing = required.filter((field) => !body[field]);
  return missing;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const accessToken = process.env.META_CAPI_ACCESS_TOKEN;
  if (!accessToken) {
    console.warn('META_CAPI_ACCESS_TOKEN is not configured. CAPI events will not be sent.');
    return res.status(503).json({ error: 'Meta CAPI not configured', success: false });
  }

  try {
    const body = req.body;
    const missing = validateRequiredFields(body);

    if (missing.length > 0) {
      return res.status(400).json({
        error: `Missing required fields: ${missing.join(', ')}`,
        success: false,
      });
    }

    const { event_name, event_time, event_source_url, event_id, user_data, custom_data } = body;

    const clientIp = extractClientIp(req);
    const clientUserAgent = req.headers['user-agent'] || null;

    const pixelId = process.env.META_PIXEL_ID || PIXEL_ID_FALLBACK;

    const capiPayload = {
      data: [
        {
          event_name,
          event_time,
          action_source: 'website',
          event_source_url,
          event_id,
          user_data: buildUserData(user_data, clientIp, clientUserAgent),
          ...(custom_data && typeof custom_data === 'object' ? { custom_data } : {}),
        },
      ],
    };

    const metaUrl = `https://graph.facebook.com/v21.0/${pixelId}/events?access_token=${accessToken}`;

    const response = await fetch(metaUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(capiPayload),
    });

    const responseBody = await response.text();

    if (!response.ok) {
      console.error('Meta CAPI error:', response.status, responseBody);
      return res.status(502).json({
        error: `Meta API returned ${response.status}`,
        success: false,
        meta_response: responseBody,
      });
    }

    let parsed;
    try {
      parsed = JSON.parse(responseBody);
    } catch {
      parsed = { raw: responseBody };
    }

    console.log('Meta CAPI sent:', event_name, 'event_id:', event_id, 'status:', response.status);

    return res.status(200).json({
      success: true,
      event_name,
      event_id,
      meta_status: response.status,
      meta_response: parsed,
    });
  } catch (error) {
    console.error('Meta CAPI failed:', error.message);
    return res.status(500).json({ error: error.message || 'Failed to send CAPI event', success: false });
  }
}
