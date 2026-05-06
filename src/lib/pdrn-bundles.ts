export interface PdrnBundle {
  id: string;
  quantity: number;
  price: number;
  unitPrice: number;
  label: string;
  badge: string | null;
  highlighted: boolean;
  savings?: number;
  subline?: string;
}

export const PDRN_BUNDLES: readonly PdrnBundle[] = [
  {
    id: "personal",
    quantity: 1,
    price: 189000,
    unitPrice: 189000,
    label: "Personal",
    badge: null,
    highlighted: false,
  },
  {
    id: "duo",
    quantity: 2,
    price: 349000,
    unitPrice: 174500,
    label: "Kit Duo",
    badge: "MAS VENDIDO",
    highlighted: true,
    savings: 29000,
    subline: "2 frascos, pagas menos por cada uno",
  },
  {
    id: "familiar",
    quantity: 3,
    price: 489000,
    unitPrice: 163000,
    label: "Kit Familiar",
    badge: "Super Ahorro",
    highlighted: false,
    savings: 78000,
    subline: "3 meses de tratamiento completo",
  },
];

export const DEFAULT_BUNDLE_INDEX = 0;
export const ORIGINAL_UNIT_PRICE = 246000;
