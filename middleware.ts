/**
 * Vercel Edge Middleware: per-route Open Graph rewrite for the Solenne SPA.
 *
 * Why this exists
 * ---------------
 * The site is a Vite + React SPA served as a single static index.html through
 * a Vercel rewrite. Crawlers (WhatsApp, iMessage, Telegram, Facebook, X,
 * LinkedIn) never run JavaScript, so every PDP shared on social would inherit
 * the PDRN tags baked into index.html. This middleware intercepts the HTML
 * response on PDP paths and rewrites the OG / Twitter / canonical tags to the
 * values declared in src/lib/og-config.ts before streaming it to the client.
 *
 * Why no UA gating
 * ----------------
 * Some clients (iMessage, LinkedIn) lie about their UA. Rewriting for every
 * visitor is cheap (string replace on cached HTML) and avoids the class of
 * bugs where a real browser sees one set of tags and the crawler sees another.
 * It also keeps the canonical URL coherent for human users who view-source.
 *
 * Caching
 * -------
 * Each Edge function instance keeps a single in-memory copy of index.html
 * keyed by the deployment origin. The fetch falls through to the static asset
 * served by Vercel itself, so cold starts cost one extra request per region.
 */

import { next } from "@vercel/edge";
import {
  OG_ROUTES,
  SITE_ORIGIN,
  absoluteImageUrl,
  canonicalUrlFor,
  findOgRoute,
  type OgRoute,
} from "./src/lib/og-config";

export const config = {
  /**
   * Run on every request that is NOT a static asset, API route, Vercel
   * internal path, or any URL with a file extension. The negative lookahead
   * keeps the middleware cheap on /assets/*, /og/*, and similar.
   */
  matcher: ["/((?!api/|assets/|og/|_vercel/|favicon|robots\\.txt|sitemap\\.xml|.*\\.[a-zA-Z0-9]+$).*)"],
};

const HTML_CONTENT_TYPE = "text/html; charset=utf-8";

let cachedHtml: string | null = null;
let cachedHtmlOrigin: string | null = null;

const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

interface MetaPatch {
  /** Regex matching a single tag we want to overwrite. */
  pattern: RegExp;
  /** Replacement HTML for that tag. */
  replacement: string;
}

const buildPatches = (route: OgRoute): MetaPatch[] => {
  const title = escapeHtml(route.title);
  const description = escapeHtml(route.description);
  const url = canonicalUrlFor(route);
  const image = absoluteImageUrl(route);
  const imageAlt = escapeHtml(route.imageAlt);

  return [
    {
      pattern: /<title>[^<]*<\/title>/i,
      replacement: `<title>${title}</title>`,
    },
    {
      pattern: /<meta\s+name="title"\s+content="[^"]*"\s*\/?>/i,
      replacement: `<meta name="title" content="${title}" />`,
    },
    {
      pattern: /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/i,
      replacement: `<meta name="description" content="${description}" />`,
    },
    {
      pattern: /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/i,
      replacement: `<link rel="canonical" href="${url}" />`,
    },
    {
      pattern: /<meta\s+property="og:url"\s+content="[^"]*"\s*\/?>/i,
      replacement: `<meta property="og:url" content="${url}" />`,
    },
    {
      pattern: /<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/i,
      replacement: `<meta property="og:title" content="${title}" />`,
    },
    {
      pattern: /<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/i,
      replacement: `<meta property="og:description" content="${description}" />`,
    },
    {
      pattern: /<meta\s+property="og:image"\s+content="[^"]*"\s*\/?>/i,
      replacement: `<meta property="og:image" content="${image}" />`,
    },
    {
      pattern: /<meta\s+property="og:image:type"\s+content="[^"]*"\s*\/?>/i,
      replacement: `<meta property="og:image:type" content="${route.imageType}" />`,
    },
    {
      pattern: /<meta\s+property="og:image:width"\s+content="[^"]*"\s*\/?>/i,
      replacement: `<meta property="og:image:width" content="${route.imageWidth}" />`,
    },
    {
      pattern: /<meta\s+property="og:image:height"\s+content="[^"]*"\s*\/?>/i,
      replacement: `<meta property="og:image:height" content="${route.imageHeight}" />`,
    },
    {
      pattern: /<meta\s+property="og:image:alt"\s+content="[^"]*"\s*\/?>/i,
      replacement: `<meta property="og:image:alt" content="${imageAlt}" />`,
    },
    {
      pattern: /<meta\s+name="twitter:url"\s+content="[^"]*"\s*\/?>/i,
      replacement: `<meta name="twitter:url" content="${url}" />`,
    },
    {
      pattern: /<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/?>/i,
      replacement: `<meta name="twitter:title" content="${title}" />`,
    },
    {
      pattern: /<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/?>/i,
      replacement: `<meta name="twitter:description" content="${description}" />`,
    },
    {
      pattern: /<meta\s+name="twitter:image"\s+content="[^"]*"\s*\/?>/i,
      replacement: `<meta name="twitter:image" content="${image}" />`,
    },
    {
      pattern: /<meta\s+name="twitter:image:alt"\s+content="[^"]*"\s*\/?>/i,
      replacement: `<meta name="twitter:image:alt" content="${imageAlt}" />`,
    },
  ];
};

const applyPatches = (html: string, patches: MetaPatch[]): string => {
  let output = html;
  for (const { pattern, replacement } of patches) {
    output = output.replace(pattern, replacement);
  }
  return output;
};

const fetchIndexHtml = async (origin: string): Promise<string> => {
  if (cachedHtml && cachedHtmlOrigin === origin) {
    return cachedHtml;
  }
  const response = await fetch(`${origin}/index.html`, {
    headers: { "x-edge-middleware-origin-fetch": "1" },
  });
  if (!response.ok) {
    throw new Error(`index.html fetch failed: ${response.status}`);
  }
  const text = await response.text();
  cachedHtml = text;
  cachedHtmlOrigin = origin;
  return text;
};

export default async function middleware(request: Request): Promise<Response> {
  const url = new URL(request.url);

  const route = findOgRoute(url.pathname);
  if (!route) {
    return next();
  }

  // Loop guard: do not rewrite when fetching index.html for ourselves.
  if (request.headers.get("x-edge-middleware-origin-fetch") === "1") {
    return next();
  }

  try {
    const html = await fetchIndexHtml(url.origin);
    const patched = applyPatches(html, buildPatches(route));
    return new Response(patched, {
      status: 200,
      headers: {
        "content-type": HTML_CONTENT_TYPE,
        "cache-control": "public, max-age=0, must-revalidate",
        "x-og-route": route.path,
      },
    });
  } catch {
    return next();
  }
}

// Touched on import to keep tree-shaking honest about the route registry.
void OG_ROUTES;
void SITE_ORIGIN;
