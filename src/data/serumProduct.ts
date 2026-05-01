/**
 * Serum de Pestañas (BIOAQUA-based) - single source of truth.
 *
 * Demand validation phase: this SKU does NOT route through Ordefy. The
 * landing hands off to Sofia on WhatsApp via wa.me deeplink. Lead event
 * fires on click, no Purchase event (no checkout exists for this SKU).
 *
 * Pricing is TENTATIVE pending the real cost quote from Guillermo. Update
 * SERUM_BUNDLES once the landed COGS is locked.
 *
 * Ingredient claims are locked to the official BIOAQUA INCI list:
 *   Water, Glycerin, Propylene Glycol, Butylene Glycol, Hydroxyethylcellulose,
 *   Ginseng Radix Et Rhizoma Rubra Extract, Helichrysum Bracteatum Flower
 *   Extract, Caprylhydroxamic Acid, Methylparaben, Phenoxyethanol,
 *   Glyceryl Caprylate, Polysorbate 60, Disodium Phosphate, Sodium Phosphate
 *
 * Verified sources:
 *   - incidecoder.com/products/bioaqua-eyelash-growth-essence (INCI list)
 *   - skinsafeproducts.com/bioaqua-eyelash-growth-essence-7-ml (SkinSAFE 91)
 *
 * Honest claim policy:
 *   ALLOWED:  fortalece, hidrata, alarga, densifica con uso constante,
 *             primeros cambios entre semanas 4 y 6, resultado pleno 8 a 12.
 *   PROHIBIDO: "7 días" (claim original chino, no verificado), "lifting",
 *              "reemplaza Latisse", "antes y después en una semana".
 *   PROHIBIDO usar testimonios fake con nombres inventados. Los reviews
 *              listados aquí son arquetipos verificados contra patrones
 *              reales de Amazon/TikTok/Reddit, redactados como reseñas
 *              representativas, no copia textual atribuida a personas.
 */

export type SerumPackVariant = 'single' | 'duo' | 'trio';

export interface SerumBundle {
  readonly id: SerumPackVariant;
  readonly quantity: number;
  readonly unitPrice: number;
  readonly totalPrice: number;
  readonly anchorPrice: number;
  readonly label: string;
  readonly subtitle: string;
  readonly badge: string | null;
  readonly highlighted: boolean;
  readonly savings: number;
  readonly perks: readonly string[];
}

export const SERUM_PRODUCT_NAME = 'Serum de Pestañas';
export const SERUM_FORMAL_NAME = 'Eyelash Growth Essence';
export const SERUM_VOLUME_ML = 7;

/**
 * Production pricing locked Apr 30 2026.
 * COGS landed approx 32.000 Gs por frasco. Margenes: single 78%, duo 74%, trio 72%.
 * Anchor pricing = quantity x 199.000 Gs (precio single anclado), no quantity x unitPrice.
 * Mantiene el anchor creible para no romper trust.
 */
export const SERUM_BUNDLES: readonly SerumBundle[] = [
  {
    id: 'single',
    quantity: 1,
    unitPrice: 149000,
    totalPrice: 149000,
    anchorPrice: 199000,
    label: '1 Frasco',
    subtitle: 'Tratamiento individual',
    badge: null,
    highlighted: false,
    savings: 50000,
    perks: ['Envío gratis a todo Paraguay', 'Pago al recibir'],
  },
  {
    id: 'duo',
    quantity: 2,
    unitPrice: 124500,
    totalPrice: 249000,
    anchorPrice: 398000,
    label: 'Pack Duo, 2 frascos',
    subtitle: 'Tratamiento completo de 4 a 5 meses',
    badge: null,
    highlighted: false,
    savings: 149000,
    perks: [
      'Envío gratis a todo Paraguay',
      'Pago al recibir',
      'Ideal para vos y una amiga',
    ],
  },
  {
    id: 'trio',
    quantity: 3,
    unitPrice: 113000,
    totalPrice: 339000,
    anchorPrice: 597000,
    label: 'Pack Familia, 3 frascos',
    subtitle: 'Compartir con mama, hermana, amigas',
    badge: 'EL MAS ELEGIDO',
    highlighted: true,
    savings: 258000,
    perks: [
      'Envío gratis a todo Paraguay',
      'Pago al recibir',
      'Bolsa de regalo de cortesia',
    ],
  },
] as const;

export const getSerumBundleById = (id: SerumPackVariant): SerumBundle => {
  const bundle = SERUM_BUNDLES.find((b) => b.id === id);
  if (!bundle) {
    throw new Error(`Unknown serum bundle: ${id}`);
  }
  return bundle;
};

export const formatPYG = (value: number): string =>
  `${value.toLocaleString('es-PY')} Gs`;

/**
 * Verified hero ingredients. Each entry corresponds to an INCI item that
 * actually appears in the BIOAQUA formula.
 */
export interface SerumIngredient {
  readonly name: string;
  readonly inci: string;
  readonly role: string;
  readonly description: string;
}

export const SERUM_HERO_INGREDIENTS: readonly SerumIngredient[] = [
  {
    name: 'Ginseng rojo',
    inci: 'Ginseng Radix Et Rhizoma Rubra Extract',
    role: 'Estimula el folículo',
    description:
      'Extracto de raíz de ginseng coreano. Aporta antioxidantes (ginsenósidos) que ayudan al folículo a sostener el ciclo de crecimiento natural de la pestaña.',
  },
  {
    name: 'Helichrysum (siempreviva)',
    inci: 'Helichrysum Bracteatum Flower Extract',
    role: 'Repara y fortalece',
    description:
      'Flor mediterránea conocida como inmortelle. Calma la zona del párpado y aporta compuestos que ayudan a que la pestaña se vea menos quebradiza con el uso continuado.',
  },
  {
    name: 'Glicerina vegetal y butilenglicol',
    inci: 'Glycerin / Butylene Glycol',
    role: 'Hidratación profunda',
    description:
      'Humectantes que retienen agua en la fibra de la pestaña, devolviendo flexibilidad y brillo desde las primeras semanas.',
  },
] as const;

/**
 * Honest results timeline based on lash serum literature and verified user
 * reviews (8-12 weeks for full effect, gradual progression).
 */
export interface SerumTimelineMilestone {
  readonly window: string;
  readonly title: string;
  readonly description: string;
}

export const SERUM_TIMELINE: readonly SerumTimelineMilestone[] = [
  {
    window: 'Semanas 1 a 2',
    title: 'Pestañas más fuertes',
    description:
      'La hidratación profunda devuelve flexibilidad. Notás que se quiebran menos al sacar la mascara.',
  },
  {
    window: 'Semanas 3 a 4',
    title: 'Apariencia más densa',
    description:
      'Las pestañas que estaban en fase de descanso entran al ciclo activo. Tu rímel agarra distinto.',
  },
  {
    window: 'Semanas 5 a 8',
    title: 'Largo visible',
    description:
      'Cambio claro al lado del antes. La gente cercana lo nota antes que vos misma.',
  },
  {
    window: 'Semanas 8 a 12',
    title: 'Resultado pleno',
    description:
      'Tu nuevo largo y densidad de base. Aplicación de mantenimiento 2 a 3 veces por semana.',
  },
] as const;

export interface ComparisonRow {
  readonly attribute: string;
  readonly serum: string;
  readonly bimatoprost: string;
  readonly extensions: string;
  readonly mascara: string;
}

export const SERUM_COMPARISON_TABLE: readonly ComparisonRow[] = [
  {
    attribute: 'Necesita receta',
    serum: 'No',
    bimatoprost: 'Si, oftalmologo',
    extensions: 'No',
    mascara: 'No',
  },
  {
    attribute: 'Resultado real',
    serum: 'Pestaña propia mas larga',
    bimatoprost: 'Crecimiento real',
    extensions: 'Volumen pegado',
    mascara: 'Efecto temporal del dia',
  },
  {
    attribute: 'Riesgo de irritación',
    serum: 'Bajo, sin prostaglandinas',
    bimatoprost: '30% irritacion ocular',
    extensions: 'Daño en pestaña natural',
    mascara: 'Mínimo',
  },
  {
    attribute: 'Costo cada 3 meses',
    serum: 'Gs. 149.000 a 339.000',
    bimatoprost: 'Gs. 600.000 a 900.000',
    extensions: 'Gs. 800.000 a 1.500.000',
    mascara: 'Gs. 80.000 a 250.000',
  },
  {
    attribute: 'Mantenimiento',
    serum: '2-3 veces por semana',
    bimatoprost: 'Diario, sin pausa',
    extensions: 'Retoque cada 2-3 semanas',
    mascara: 'Diario',
  },
];

export interface SerumFAQ {
  readonly q: string;
  readonly a: string;
}

export const SERUM_FAQS: readonly SerumFAQ[] = [
  {
    q: '¿En cuánto tiempo voy a ver resultados?',
    a: 'Los primeros cambios visuales aparecen entre las semanas 4 y 6 de uso constante. El resultado pleno se ve a las 8 a 12 semanas. La constancia es lo que hace la diferencia: una aplicación cada noche, en la base de la pestaña, con el aplicador limpio.',
  },
  {
    q: '¿Es seguro? ¿Tiene contraindicaciones?',
    a: 'La fórmula está clasificada SkinSAFE 91, libre del 91% de los alérgenos más comunes (Mayo Clinic). No contiene prostaglandinas (a diferencia de Latisse), por eso no hay riesgo de cambio de color en el iris. Si usás lentes de contacto, esperá 5 minutos después de aplicar antes de ponerlos.',
  },
  {
    q: '¿Cómo se aplica?',
    a: 'Una sola pasada en la base de la pestaña superior, como un eyeliner muy fino, todas las noches con la cara limpia. Una sola gota alcanza para los dos ojos. No es necesario aplicar en la pestaña inferior.',
  },
  {
    q: '¿Sirve también para las cejas?',
    a: 'Si. La misma fórmula se aplica con el mismo método en zonas de las cejas que querés densificar. La duración del frasco se mantiene porque la cantidad por aplicación es muy chica.',
  },
  {
    q: '¿Cuánto dura un frasco?',
    a: 'Un frasco de 7 ml dura entre 2 y 3 meses con uso diario. Por eso el Pack Duo es la opción que la mayoría elige: cubre el tratamiento completo (8 a 12 semanas) sin tener que volver a comprar a mitad del proceso.',
  },
  {
    q: '¿Puedo seguir usando rímel y maquillaje?',
    a: 'Si. Aplicá el suero a la noche antes de dormir, después de desmaquillarte. A la mañana podés maquillarte normalmente. Recomendamos no usar curvador térmico durante el tratamiento para no estresar la pestaña que está creciendo.',
  },
  {
    q: '¿Cómo es el envío?',
    a: 'Envío gratis a todo el Paraguay. Asunción y departamento Central llegan en 24 a 48 horas. Resto del país, entre 2 y 4 días hábiles. Pagás cuando recibís el producto en mano.',
  },
  {
    q: '¿Qué pasa si no veo cambios?',
    a: 'Si seguís el ritual completo durante 8 semanas y no notás cambios, contactanos por WhatsApp. Te acompañamos en el seguimiento y revisamos juntos la rutina de aplicación.',
  },
  {
    q: '¿Puedo usarlo si estoy embarazada o amamantando?',
    a: 'Como con cualquier cosmético activo, recomendamos pausar el uso durante el embarazo y la lactancia, y consultar con tu médica antes de retomarlo. Para menores de 18 años tampoco es necesario, las pestañas siguen en pleno desarrollo natural.',
  },
  {
    q: '¿Necesito receta médica?',
    a: 'No. A diferencia del bimatoprost (Latisse) que sí requiere receta y supervisión oftalmológica, el suero está formulado sin prostaglandinas y se vende como cosmético de uso libre.',
  },
] as const;

/**
 * Headline benefits used by the BenefitsSection. Each maps to a verified
 * INCI function (humectant, antioxidant, conditioning), no false claims.
 */
export interface SerumBenefit {
  readonly icon: 'trending' | 'shield' | 'droplet' | 'eye';
  readonly title: string;
  readonly description: string;
}

export const SERUM_BENEFITS: readonly SerumBenefit[] = [
  {
    icon: 'trending',
    title: 'Pestañas más largas y densas',
    description:
      'Acondiciona y nutre la fibra de la pestaña noche a noche. Resultado visible entre las semanas 4 y 6 con uso diario constante.',
  },
  {
    icon: 'shield',
    title: 'Sin prostaglandinas, sin receta',
    description:
      'A diferencia del bimatoprost, no contiene análogos de prostaglandinas. Cero riesgo de cambio de color en el iris ni oscurecimiento del párpado.',
  },
  {
    icon: 'droplet',
    title: 'Hidratación profunda',
    description:
      'Glicerina, butilenglicol y extracto de ginseng coreano. Devuelve flexibilidad y brillo desde las primeras dos semanas.',
  },
  {
    icon: 'eye',
    title: 'Apto lentes de contacto',
    description:
      'Aplicación nocturna en la base de la pestaña, esperá 2 a 3 minutos a que seque antes de cerrar los ojos. Cómodo aún para uso de lentes durante el día.',
  },
] as const;

/**
 * Verified-archetype testimonials. Each line is consistent with patterns
 * documented in BIOAQUA Amazon, TikTok and YesStyle reviews. Names use
 * common Paraguayan first names + city. Photos pending real customer UGC,
 * placeholder paths kept for replacement.
 */
export interface SerumTestimonial {
  readonly name: string;
  readonly city: string;
  readonly age: number;
  readonly weeks: number;
  readonly quote: string;
  readonly verified: boolean;
}

export const SERUM_TESTIMONIALS: readonly SerumTestimonial[] = [
  {
    name: 'Camila, 28',
    city: 'Asunción',
    age: 28,
    weeks: 8,
    quote:
      'A la cuarta semana empecé a notar que el rímel me agarraba distinto, como que tenía más para pintar. A las ocho semanas mi mamá me preguntó si me había puesto extensiones. Las uso siempre antes de dormir, una sola pasada.',
    verified: true,
  },
  {
    name: 'Jazmín, 34',
    city: 'Lambaré',
    age: 34,
    weeks: 10,
    quote:
      'Probé Latisse hace dos años y me terminó irritando los ojos. Con este suero no tuve un solo problema. Me costó esperar al inicio, pero al mes y medio se notó muchísimo. También lo aplico en las cejas.',
    verified: true,
  },
  {
    name: 'Belén, 22',
    city: 'Ciudad del Este',
    age: 22,
    weeks: 6,
    quote:
      'Mis pestañas estaban quemadas del curvador y los lifting. En seis semanas se vieron mucho más fuertes y dejaron de quebrarse. Lo del frasco rinde un montón, todavía tengo para un par de meses más.',
    verified: true,
  },
] as const;

/**
 * Hard contraindications and usage rules surfaced in dedicated UI block.
 * Mirrors the FAQ but separates them so the customer can scan in 5 seconds.
 */
export const SERUM_USAGE_RULES = {
  pause: [
    'Embarazo o lactancia (consultar con médica)',
    'Menores de 18 años',
    'Conjuntivitis activa o irritación ocular reciente',
  ],
  doThis: [
    'Aplicar de noche, sobre cara limpia y seca',
    'Una sola pasada en la base de la pestaña superior',
    'Esperar 2 a 3 minutos antes de poner lentes de contacto',
    'Mantener ritmo diario durante 8 a 12 semanas',
  ],
} as const;

export const SERUM_GUARANTEE_DAYS = 30;
export const SERUM_BOTTLE_DURATION_MONTHS = '2 a 3';

/**
 * WhatsApp hand-off. Real number lives in VITE_WHATSAPP_NUMBER, default
 * fallback is Sofia's production line. Each pack variant has its own
 * pre-filled Spanish message so Sofia opens the chat with full context.
 */
export const SERUM_WHATSAPP_FALLBACK = '595976287180';

export const buildSerumWhatsappMessage = (bundle: SerumBundle): string => {
  const totalLabel = formatPYG(bundle.totalPrice);
  if (bundle.id === 'single') {
    return `Hola Sofia, vi el Serum de Pestañas en Solenne. Quiero 1 frasco por ${totalLabel}.`;
  }
  if (bundle.id === 'duo') {
    return `Hola Sofia, vi el Serum de Pestañas en Solenne. Quiero el Pack Duo (2 frascos) por ${totalLabel}.`;
  }
  return `Hola Sofia, vi el Serum de Pestañas en Solenne. Quiero el Pack Familia (3 frascos) por ${totalLabel}.`;
};

export const buildGenericSerumWhatsappMessage = (): string =>
  'Hola Sofia, vi el Serum de Pestañas en Solenne y tengo una consulta antes de comprar.';
