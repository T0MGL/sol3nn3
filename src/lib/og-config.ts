/**
 * Single source of truth for per-route Open Graph metadata.
 *
 * Consumed by the Edge Middleware (middleware.ts) to rewrite the static
 * index.html on the fly so every product page (PDP) ships its own title,
 * description, image, and canonical URL when shared on WhatsApp, Telegram,
 * iMessage, Facebook, X, LinkedIn, etc.
 *
 * Adding a new PDP: append one entry, push, done. No middleware changes.
 *
 * Image paths must point to files served from /public, with absolute URLs
 * resolved against SITE_ORIGIN at request time. Crawlers reject relative
 * og:image values, so middleware always emits the absolute form.
 */

export const SITE_ORIGIN = "https://bysolenne.shop" as const;

export interface OgRoute {
  /** Path matched literally against URL.pathname. */
  readonly path: string;
  /** Browser tab title and og:title / twitter:title. */
  readonly title: string;
  /** og:description / twitter:description / meta description. Keep under 200 chars. */
  readonly description: string;
  /** Absolute or root-relative path to the OG image (e.g. /og/pdrn.webp). */
  readonly image: string;
  /** Image MIME type, used for og:image:type. */
  readonly imageType: "image/webp" | "image/jpeg" | "image/png";
  /** Image pixel width. WhatsApp prefers >=600. */
  readonly imageWidth: number;
  /** Image pixel height. */
  readonly imageHeight: number;
  /** Alt text for og:image:alt. */
  readonly imageAlt: string;
}

export const OG_ROUTES: readonly OgRoute[] = [
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
] as const;

const ROUTE_INDEX: ReadonlyMap<string, OgRoute> = new Map(
  OG_ROUTES.map((route) => [route.path, route]),
);

/**
 * Look up an OG config by exact pathname match. Trailing slashes are
 * normalized so /lifting-tape and /lifting-tape/ both resolve.
 */
export const findOgRoute = (pathname: string): OgRoute | undefined => {
  if (pathname.length > 1 && pathname.endsWith("/")) {
    return ROUTE_INDEX.get(pathname.slice(0, -1));
  }
  return ROUTE_INDEX.get(pathname);
};

/**
 * Build the absolute canonical URL for a route.
 */
export const canonicalUrlFor = (route: OgRoute): string => {
  if (route.path === "/") return SITE_ORIGIN;
  return `${SITE_ORIGIN}${route.path}`;
};

/**
 * Build the absolute image URL crawlers can fetch directly.
 */
export const absoluteImageUrl = (route: OgRoute): string => {
  return `${SITE_ORIGIN}${route.image}`;
};
