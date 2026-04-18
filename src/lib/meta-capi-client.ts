/**
 * Client-side utility for sending events to the server-side Meta CAPI endpoint.
 *
 * Each tracking call in meta-pixel.ts generates an event_id that is shared
 * between the browser pixel (fbq eventID option) and this server relay,
 * enabling Meta to deduplicate browser+server events automatically.
 *
 * Fire-and-forget: calls never block UI and never throw.
 */

const PRODUCTION_HOSTNAME = 'bysolenne.shop';

/**
 * Generate a UUID v4 event ID for Meta event deduplication.
 * Same ID is sent to both browser pixel (fbq eventID) and server CAPI.
 */
export const generateEventId = (): string => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  // Fallback for older browsers
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

/**
 * Send an event to the server-side CAPI endpoint.
 * Fire-and-forget: never blocks UI, never throws.
 * Only fires on production hostname (bysolenne.shop).
 */
export const sendServerEvent = (params: {
  event_name: string;
  event_id: string;
  event_source_url: string;
  user_data?: {
    em?: string;
    ph?: string;
    fn?: string;
    ln?: string;
    external_id?: string;
    fbc?: string;
    fbp?: string;
  };
  custom_data?: Record<string, unknown>;
}): void => {
  try {
    if (typeof window === 'undefined') return;

    // Only fire on production hostname
    if (window.location.hostname !== PRODUCTION_HOSTNAME) return;

    const body = JSON.stringify({
      event_name: params.event_name,
      event_id: params.event_id,
      event_time: Math.floor(Date.now() / 1000),
      event_source_url: params.event_source_url,
      user_data: params.user_data,
      custom_data: params.custom_data,
    });

    // Prefer sendBeacon (works during page unload), fall back to fetch
    const sent =
      typeof navigator !== 'undefined' &&
      typeof navigator.sendBeacon === 'function' &&
      navigator.sendBeacon(
        '/api/meta-capi',
        new Blob([body], { type: 'application/json' }),
      );

    if (!sent) {
      fetch('/api/meta-capi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
        keepalive: true,
      }).catch(() => {
        // silent, non critical
      });
    }
  } catch (err) {
    console.log('CAPI sendServerEvent error (non critical):', err);
  }
};
