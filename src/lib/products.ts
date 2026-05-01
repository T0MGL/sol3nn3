/**
 * Centralized product registry for Solenne.
 *
 * Every product sold on the site is defined here with its pixel-tracking
 * metadata. Adding a new product means adding ONE entry to PRODUCTS.
 * Zero changes to pixel, CAPI, or tracking code.
 */

export interface ProductPixelConfig {
  /** Base display name sent as content_name to Meta */
  contentNameBase: string;
  /** Base content ID / SKU slug for Meta catalog matching */
  contentIdBase: string;
  /** Meta content_category */
  contentCategory: string;
  /** Meta content_type (usually 'product') */
  contentType: string;
  /** ISO currency code */
  currency: string;
  /** Unit price for a single item */
  unitPrice: number;
  /** SKU overrides keyed by quantity (for bundle/variant SKUs) */
  skuByQuantity?: Record<number, string>;
  /** Human-readable pack names keyed by quantity */
  packNames?: Record<number, string>;
}

export const PRODUCTS = {
  pdrn: {
    contentNameBase: 'Solenne PDRN Pink Peptide Serum',
    contentIdBase: 'solenne-pdrn-serum',
    contentCategory: 'Skincare & Beauty',
    contentType: 'product',
    currency: 'PYG',
    unitPrice: 189000,
  },
  tape: {
    contentNameBase: 'Solenne V-Shaped Face Tape',
    contentIdBase: 'SOLENNE-TAPE',
    contentCategory: 'Beauty & Personal Care',
    contentType: 'product',
    currency: 'PYG',
    unitPrice: 149000,
    skuByQuantity: {
      1: 'SOLENNE-TAPE-100',
      2: 'SOLENNE-TAPE-RITUAL',
      3: 'SOLENNE-TAPE-EVENTO',
    },
    packNames: {
      2: 'Pack Ritual',
      3: 'Pack Evento',
    },
  },
  rizador: {
    contentNameBase: 'Solenne Rizador de Pestañas Eléctrico',
    contentIdBase: 'SOLENNE-RIZADOR',
    contentCategory: 'Beauty & Personal Care',
    contentType: 'product',
    currency: 'PYG',
    unitPrice: 159000,
    skuByQuantity: {
      1: 'RIZADOR-ELECTRICO',
      2: 'RIZADOR-ELECTRICO-DUO',
    },
    packNames: {
      2: 'Pack Duo',
    },
  },
  serum: {
    contentNameBase: 'Solenne Serum de Pestañas',
    contentIdBase: 'SOLENNE-SERUM-LASH',
    contentCategory: 'Beauty & Personal Care',
    contentType: 'product',
    currency: 'PYG',
    unitPrice: 149000,
    skuByQuantity: {
      1: 'SOLENNE-SERUM-LASH-01',
      2: 'SOLENNE-SERUM-LASH-DUO',
      3: 'SOLENNE-SERUM-LASH-TRIO',
    },
    packNames: {
      2: 'Pack Duo',
      3: 'Pack Familia',
    },
  },
} as const satisfies Record<string, ProductPixelConfig>;

export type ProductKey = keyof typeof PRODUCTS;

/**
 * Build the canonical content_name for a product at a given quantity.
 * Single items use the base name; multi-packs append the pack label.
 */
export const buildContentName = (product: ProductPixelConfig, quantity: number): string => {
  if (quantity <= 1) return product.contentNameBase;
  const packName = product.packNames?.[quantity];
  if (packName) return `${product.contentNameBase} - ${packName}`;
  return `${product.contentNameBase} - Pack x${quantity}`;
};

/**
 * Build content_ids for Meta catalog matching.
 * Uses SKU overrides when available, otherwise derives from base ID.
 */
export const buildContentIds = (product: ProductPixelConfig, quantity: number): string[] => {
  const skuOverride = product.skuByQuantity?.[quantity];
  if (skuOverride) return [skuOverride];
  if (quantity <= 1) return [product.contentIdBase];
  return [`${product.contentIdBase}-${quantity}pack`];
};
