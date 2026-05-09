import { next } from "@vercel/edge";

export const config = {
  matcher: [
    "/",
    "/lifting-tape",
    "/serum-pestanas",
    "/retinal-celimax",
    "/rizador-electrico",
  ],
};

interface OgRoute {
  path: string;
  title: string;
  description: string;
  image: string;
  imageType: string;
  imageWidth: number;
  imageHeight: number;
  imageAlt: string;
}

const SITE_ORIGIN = "https://bysolenne.shop";

const OG_ROUTES: OgRoute[] = [
  {
    path: "/",
    title: "Solenne - Pink Repair Peptide Serum (30ml) | Paraguay",
    description:
      "Suero de péptidos importado, formulado para apoyar la reparación, hidratación y un aspecto más liso de la piel. Envío gratis en Paraguay.",
    image: "/og/pdrn.webp",
    imageType: "image/webp",
    imageWidth: 2048,
    imageHeight: 2048,
    imageAlt: "Solenne PDRN Pink Repair Peptide Serum",
  },
  {
    path: "/lifting-tape",
    title: "Solenne - V-Shaped Face Tape | Efecto lifting temporal",
    description:
      "Cinta facial invisible para un efecto lifting temporal en eventos especiales. Caja de 100 unidades. Envío gratis en Paraguay.",
    image: "/og/tape.webp",
    imageType: "image/webp",
    imageWidth: 1856,
    imageHeight: 2304,
    imageAlt: "Solenne V-Shaped Face Tape para efecto lifting temporal",
  },
  {
    path: "/serum-pestanas",
    title: "Solenne - Serum de Pestañas | Cuidado profesional",
    description:
      "Serum de pestañas formulado para acompañar el cuidado diario y un aspecto más cuidado. Envío gratis en Paraguay.",
    image: "/og/serum-pestanas.webp",
    imageType: "image/webp",
    imageWidth: 1440,
    imageHeight: 1919,
    imageAlt: "Solenne Serum de Pestañas",
  },
  {
    path: "/retinal-celimax",
    title: "Solenne - Celimax Retinal Shot | Tratamiento reafirmante",
    description:
      "Tratamiento con retinal Celimax para apoyar la firmeza y textura de la piel. Importado de Corea. Envío gratis en Paraguay.",
    image: "/og/retinal-celimax.webp",
    imageType: "image/webp",
    imageWidth: 3712,
    imageHeight: 4608,
    imageAlt: "Celimax Retinal Shot - Tratamiento reafirmante coreano",
  },
  {
    path: "/rizador-electrico",
    title: "Solenne - Rizador de Pestañas Eléctrico | Efecto curvado",
    description:
      "Rizador eléctrico recargable para un curvado prolongado en segundos. Sin pinchazos, sin tirones. Envío gratis en Paraguay.",
    image: "/og/rizador.webp",
    imageType: "image/webp",
    imageWidth: 1200,
    imageHeight: 1493,
    imageAlt: "Solenne Rizador de Pestañas Eléctrico",
  },
];

const ROUTE_INDEX = new Map<string, OgRoute>();
for (const r of OG_ROUTES) {
  ROUTE_INDEX.set(r.path, r);
}

function findOgRoute(pathname: string): OgRoute | undefined {
  if (pathname.length > 1 && pathname.endsWith("/")) {
    return ROUTE_INDEX.get(pathname.slice(0, -1));
  }
  return ROUTE_INDEX.get(pathname);
}

function canonicalUrlFor(route: OgRoute): string {
  if (route.path === "/") return SITE_ORIGIN;
  return SITE_ORIGIN + route.path;
}

function absoluteImageUrl(route: OgRoute): string {
  return SITE_ORIGIN + route.image;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

interface MetaPatch {
  pattern: RegExp;
  replacement: string;
}

function buildPatches(route: OgRoute): MetaPatch[] {
  const title = escapeHtml(route.title);
  const description = escapeHtml(route.description);
  const url = canonicalUrlFor(route);
  const image = absoluteImageUrl(route);
  const imageAlt = escapeHtml(route.imageAlt);

  return [
    { pattern: /<title>[^<]*<\/title>/i, replacement: "<title>" + title + "</title>" },
    { pattern: /<meta\s+name="title"\s+content="[^"]*"\s*\/?>/i, replacement: '<meta name="title" content="' + title + '" />' },
    { pattern: /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/i, replacement: '<meta name="description" content="' + description + '" />' },
    { pattern: /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/i, replacement: '<link rel="canonical" href="' + url + '" />' },
    { pattern: /<meta\s+property="og:url"\s+content="[^"]*"\s*\/?>/i, replacement: '<meta property="og:url" content="' + url + '" />' },
    { pattern: /<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/i, replacement: '<meta property="og:title" content="' + title + '" />' },
    { pattern: /<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/i, replacement: '<meta property="og:description" content="' + description + '" />' },
    { pattern: /<meta\s+property="og:image"\s+content="[^"]*"\s*\/?>/i, replacement: '<meta property="og:image" content="' + image + '" />' },
    { pattern: /<meta\s+property="og:image:type"\s+content="[^"]*"\s*\/?>/i, replacement: '<meta property="og:image:type" content="' + route.imageType + '" />' },
    { pattern: /<meta\s+property="og:image:width"\s+content="[^"]*"\s*\/?>/i, replacement: '<meta property="og:image:width" content="' + route.imageWidth + '" />' },
    { pattern: /<meta\s+property="og:image:height"\s+content="[^"]*"\s*\/?>/i, replacement: '<meta property="og:image:height" content="' + route.imageHeight + '" />' },
    { pattern: /<meta\s+property="og:image:alt"\s+content="[^"]*"\s*\/?>/i, replacement: '<meta property="og:image:alt" content="' + imageAlt + '" />' },
    { pattern: /<meta\s+name="twitter:url"\s+content="[^"]*"\s*\/?>/i, replacement: '<meta name="twitter:url" content="' + url + '" />' },
    { pattern: /<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/?>/i, replacement: '<meta name="twitter:title" content="' + title + '" />' },
    { pattern: /<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/?>/i, replacement: '<meta name="twitter:description" content="' + description + '" />' },
    { pattern: /<meta\s+name="twitter:image"\s+content="[^"]*"\s*\/?>/i, replacement: '<meta name="twitter:image" content="' + image + '" />' },
    { pattern: /<meta\s+name="twitter:image:alt"\s+content="[^"]*"\s*\/?>/i, replacement: '<meta name="twitter:image:alt" content="' + imageAlt + '" />' },
  ];
}

function applyPatches(html: string, patches: MetaPatch[]): string {
  let output = html;
  for (const p of patches) {
    output = output.replace(p.pattern, p.replacement);
  }
  return output;
}

let cachedHtml: string | null = null;
let cachedHtmlOrigin: string | null = null;

async function fetchIndexHtml(origin: string): Promise<string> {
  if (cachedHtml !== null && cachedHtmlOrigin === origin) {
    return cachedHtml;
  }
  const response = await fetch(origin + "/index.html", {
    headers: { "x-edge-middleware-origin-fetch": "1" },
  });
  if (!response.ok) {
    throw new Error("index.html fetch failed: " + response.status);
  }
  const text = await response.text();
  cachedHtml = text;
  cachedHtmlOrigin = origin;
  return text;
}

export default async function middleware(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const route = findOgRoute(url.pathname);
  if (route === undefined) {
    return next();
  }
  if (request.headers.get("x-edge-middleware-origin-fetch") === "1") {
    return next();
  }
  try {
    const html = await fetchIndexHtml(url.origin);
    const patched = applyPatches(html, buildPatches(route));
    return new Response(patched, {
      status: 200,
      headers: {
        "content-type": "text/html; charset=utf-8",
        "cache-control": "public, max-age=0, must-revalidate",
        "x-og-route": route.path,
      },
    });
  } catch (_err) {
    return next();
  }
}
