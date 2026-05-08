/**
 * Celimax Retinal Shot, Tratamiento Reafirmante
 *
 * Source of truth for the /retinal-celimax landing. Pricing follows the
 * existing Tape/Lash bundle convention (anchor = 2x or 3x base, savings %
 * matched to the duo/trio split that already runs in production):
 *
 *   1u  219.000 Gs  unit 219.000 Gs  no anchor
 *   2u  369.000 Gs  unit 184.500 Gs  anchor 438.000  savings 69.000  -15.7% vs 2x
 *   3u  499.000 Gs  unit 166.333 Gs  anchor 657.000  savings 158.000 -24.0% vs 3x
 *
 * Tape baseline: duo -16.4%, trio -24.2% on a 149.000 Gs base.
 * Lash baseline: duo -16.4%, trio -24.2% on a 149.000 Gs base.
 * Celimax matches both within 1pp on each bundle and keeps the brand-wide
 * convention that totals end in -9.000 Gs.
 *
 * Pricing decision Apr 30 2026, locked by Gaston with the Phase 2 brief.
 *
 * Honest claim policy:
 *   ALLOWED:  reafirma, mejora textura, suaviza lineas finas con uso constante,
 *             tolerancia mejor que retinol clasico, primeros cambios entre
 *             semanas 4 y 6, resultado pleno 8 a 12.
 *   PROHIBIDO: "elimina arrugas", "reemplaza Botox", "lifting sin cirugia",
 *              "antiaging" como claim absoluto, testimoniales con nombres
 *              inventados, "doctoras" sin credenciales reales.
 */

export type RetinalCelimaxPackVariant = 'single' | 'duo' | 'trio';

export interface RetinalCelimaxBundle {
  readonly id: RetinalCelimaxPackVariant;
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

export const RETINAL_CELIMAX_PRODUCT_NAME = 'Celimax Retinal Shot, Tratamiento Reafirmante';
export const RETINAL_CELIMAX_SHORT_NAME = 'Celimax Retinal Shot';
export const RETINAL_CELIMAX_VOLUME_ML = 15;

export const RETINAL_CELIMAX_BUNDLES: readonly RetinalCelimaxBundle[] = [
  {
    id: 'single',
    quantity: 1,
    unitPrice: 219000,
    totalPrice: 219000,
    anchorPrice: 289000,
    label: '1 frasco',
    subtitle: 'Tratamiento individual de 6 a 8 semanas',
    badge: null,
    highlighted: false,
    savings: 70000,
    perks: ['Envío gratis a todo Paraguay', 'Pago al recibir'],
  },
  {
    id: 'duo',
    quantity: 2,
    unitPrice: 184500,
    totalPrice: 369000,
    anchorPrice: 438000,
    label: 'Pack Dúo, 2 frascos',
    subtitle: 'Tratamiento completo de 12 a 16 semanas',
    badge: 'MÁS ELEGIDO',
    highlighted: true,
    savings: 69000,
    perks: [
      'Envío gratis a todo Paraguay',
      'Pago al recibir',
      'Te alcanza para todo el ciclo de renovación',
    ],
  },
  {
    id: 'trio',
    quantity: 3,
    unitPrice: 166333,
    totalPrice: 499000,
    anchorPrice: 657000,
    label: 'Pack Madre, 3 frascos',
    subtitle: 'Uno para vos. Uno para mamá. Uno para tu persona favorita.',
    badge: 'REGALO DÍA DE LA MADRE',
    highlighted: false,
    savings: 158000,
    perks: [
      'Envío gratis a todo Paraguay',
      'Pago al recibir',
      'Bolsa Solenne de cortesía',
      'Llega antes del 15 de mayo',
    ],
  },
] as const;

export const getRetinalCelimaxBundleById = (
  id: RetinalCelimaxPackVariant
): RetinalCelimaxBundle => {
  const bundle = RETINAL_CELIMAX_BUNDLES.find((b) => b.id === id);
  if (!bundle) {
    throw new Error(`Unknown Celimax Retinal Shot bundle: ${id}`);
  }
  return bundle;
};

export const formatRetinalCelimaxPrice = (value: number): string =>
  `${value.toLocaleString('es-PY')} Gs`;

export interface RetinalCelimaxBenefit {
  readonly icon: 'firm' | 'texture' | 'tolerance' | 'glow';
  readonly title: string;
  readonly description: string;
}

export const RETINAL_CELIMAX_BENEFITS: readonly RetinalCelimaxBenefit[] = [
  {
    icon: 'firm',
    title: 'Reafirma sin irritar',
    description:
      'El retinal trabaja un paso antes que el retinol clásico. Misma renovación, sensación más amable en la piel sensible o nueva al tratamiento.',
  },
  {
    icon: 'texture',
    title: 'Mejora la textura',
    description:
      'Refina poros y suaviza líneas finas con uso constante. Los primeros cambios visuales aparecen entre las semanas 4 y 6 de aplicación nocturna.',
  },
  {
    icon: 'tolerance',
    title: 'Tolerancia superior al retinol',
    description:
      'Encapsulado para liberación gradual durante la noche. Menos pico de irritación, menos descamación, mismo objetivo de renovación.',
  },
  {
    icon: 'glow',
    title: 'Piel uniforme y luminosa',
    description:
      'Acompaña a la piel a recuperar luz natural y tono parejo. Funciona en sinergia con tu PDRN si ya estás en la rutina Solenne.',
  },
] as const;

export interface RetinalCelimaxStep {
  readonly number: string;
  readonly title: string;
  readonly description: string;
  readonly duration: string;
}

export const RETINAL_CELIMAX_STEPS: readonly RetinalCelimaxStep[] = [
  {
    number: '01',
    title: 'Limpiá',
    description:
      'Cara desmaquillada y completamente seca. Esperá 5 a 10 minutos después de lavarla para que la piel se reequilibre.',
    duration: 'Una vez por noche',
  },
  {
    number: '02',
    title: 'Aplicá',
    description:
      'Una a dos gotas en la palma, calentá entre los dedos y presioná suavemente sobre rostro y cuello. Evitá el contorno inmediato del ojo.',
    duration: '20 segundos',
  },
  {
    number: '03',
    title: 'Sostené',
    description:
      'Empezá tres noches por semana durante dos semanas, luego día por medio, y finalmente diario. Protector solar de día es no negociable.',
    duration: '8 a 12 semanas',
  },
];

export interface RetinalCelimaxComparisonOption {
  readonly title: string;
  readonly specs: readonly {
    readonly label: string;
    readonly value: string;
    readonly isGood: boolean;
  }[];
  readonly isHighlighted?: boolean;
}

export const RETINAL_CELIMAX_COMPARISON: readonly RetinalCelimaxComparisonOption[] = [
  {
    title: 'Retinol clásico',
    specs: [
      { label: 'Pasos hasta el ácido retinoico', value: '2 pasos, más irritación', isGood: false },
      { label: 'Adaptación de la piel', value: '4 a 6 semanas, descamación', isGood: false },
      { label: 'Apto piel sensible', value: 'No, en general no', isGood: false },
      { label: 'Costo cada 3 meses', value: 'Gs. 350k a 700k', isGood: false },
    ],
  },
  {
    title: 'Tretinoína (con receta)',
    specs: [
      { label: 'Necesita receta', value: 'Sí, dermatóloga', isGood: false },
      { label: 'Tolerancia', value: 'Baja, fuerte irritación', isGood: false },
      { label: 'Disponibilidad en PY', value: 'Limitada y cara', isGood: false },
      { label: 'Costo cada 3 meses', value: 'Gs. 600k a 900k', isGood: false },
    ],
  },
  {
    title: 'Celimax Retinal Shot',
    specs: [
      { label: 'Pasos hasta el ácido retinoico', value: '1 solo paso', isGood: true },
      { label: 'Adaptación de la piel', value: 'Suave desde la 2da semana', isGood: true },
      { label: 'Apto piel sensible', value: 'Sí, con introducción gradual', isGood: true },
      { label: 'Costo cada 3 meses', value: 'Gs. 166k a 219k por frasco', isGood: true },
    ],
    isHighlighted: true,
  },
  {
    title: 'Crema antiarrugas común',
    specs: [
      { label: 'Activo real comprobado', value: 'No, marketing genérico', isGood: false },
      { label: 'Renovación celular', value: 'Mínima a nula', isGood: false },
      { label: 'Resultado a 12 semanas', value: 'Hidratación pasajera', isGood: false },
      { label: 'Costo cada 3 meses', value: 'Gs. 120k a 400k', isGood: false },
    ],
  },
];

export interface RetinalCelimaxFAQ {
  readonly q: string;
  readonly a: string;
}

export const RETINAL_CELIMAX_FAQS: readonly RetinalCelimaxFAQ[] = [
  {
    q: '¿Qué diferencia hay entre retinal y retinol?',
    a: 'El retinol necesita dos conversiones en la piel para volverse ácido retinoico (la forma activa). El retinal sólo una. Eso lo hace hasta 11 veces más eficiente y con un perfil de tolerancia más amable. Mismo objetivo de renovación celular, menos camino entre el frasco y el resultado.',
  },
  {
    q: '¿Puedo usar este booster todas las noches?',
    a: 'Empezá usándolo 2 a 3 veces por semana. Aumentá la frecuencia de a poco a medida que tu piel construye tolerancia. Llegar al uso diario es el objetivo, no la línea de partida. Si sentís tirantez, espaciá un día más antes de subir el ritmo.',
  },
  {
    q: '¿En cuánto tiempo voy a ver resultados?',
    a: 'Los primeros cambios visibles aparecen entre las semanas 4 y 6 de uso constante: piel más uniforme, textura más fina y luminosidad recuperada. El resultado antiedad pleno se ve entre las semanas 8 y 12. Lo que hace la diferencia es la frecuencia, no la cantidad por aplicación.',
  },
  {
    q: '¿Puedo usarlo si tengo piel sensible o nunca usé retinoides?',
    a: 'Sí, con introducción gradual. Empezá dos a tres noches por semana durante las primeras dos semanas, luego día por medio, y recién después diario. Si sentís tirantez, espaciá un día más. La idea no es quemar la piel, es enseñarle a renovarse.',
  },
  {
    q: '¿Puedo combinarlo con activos como AHA/BHA o Vitamina C?',
    a: 'Mejor evitar capa con capa de activos fuertes. Vitamina C de día, retinal de noche. Si usás AHA o BHA, alterná las noches con retinal para prevenir irritación. Nunca los apliques juntos en la misma capa, eso garantiza ardor y compromete la barrera.',
  },
  {
    q: '¿Lo puedo combinar con mi PDRN Pink Peptide Serum?',
    a: 'Sí, y se potencian. El protocolo Solenne recomienda Celimax de noche, sólo o en capa fina seguido de tu hidratante. PDRN puede ir de mañana para reparar y reforzar la barrera, o las noches en que descansás del retinal. No los mezcles en la misma capa.',
  },
  {
    q: '¿Cómo es la tolerancia? ¿Voy a descamarme?',
    a: 'El retinal encapsulado libera la dosis activa de manera gradual durante la noche, por eso suele evitar el pico de irritación que provoca el retinol estándar. Una descamación leve durante las primeras dos semanas es esperable y se controla con una hidratante densa. Si aparece ardor, suspender 48 horas y reanudar despacio.',
  },
  {
    q: '¿Por qué mi piel se ve un poco amarilla después de aplicar?',
    a: 'Es por el retinal. El color amarillo viene del activo en sí, no de tu piel. Es temporal y se va al lavarte la cara la mañana siguiente sin dejar rastro. Lo notás más cuando aplicás un poco de más, en cuyo caso bajá la dosis a una sola gota.',
  },
  {
    q: '¿Necesito protector solar todos los días con el Celimax Retinal Shot?',
    a: 'Sí, no es opcional. El retinal aumenta la sensibilidad al sol, por eso necesitás protector de amplio espectro FPS 30 o más todas las mañanas, llueva o no, esté nublado o no. Reaplicá durante el día si te exponés. Sin esto el tratamiento no avanza, retrocede.',
  },
  {
    q: '¿Puedo usarlo si estoy embarazada o amamantando?',
    a: 'No. Los retinoides en general no se recomiendan durante el embarazo ni la lactancia. Pausá el uso y consultá con tu médica antes de retomarlo. Si querés mantener una rutina activa en ese período, tu mejor opción dentro de Solenne es el PDRN.',
  },
  {
    q: '¿Cómo es el envío y el pago?',
    a: 'Envío gratis a todo el Paraguay. Asunción y departamento Central llegan en 24 a 48 horas. Resto del país, entre 2 y 4 días hábiles. Pagás cuando recibís el producto en mano. Frasco sellado o lo reemplazamos sin costo.',
  },
  {
    q: '¿Llega antes del Día de la Madre?',
    a: 'Sí. Si pedís hasta el 12 de mayo y vivís en Asunción o Gran Asunción, llega antes del 15. Para interior del país (CDE, Encarnación, Coronel Oviedo y otras ciudades), pedí hasta el 10 de mayo para asegurar la entrega a tiempo. Cualquier duda, escribinos por WhatsApp y te confirmamos zona y plazo en el momento.',
  },
];

/**
 * WhatsApp hand-off pre-filled messages by bundle. Reuse the existing
 * VITE_WHATSAPP_NUMBER (Sofia) via getWhatsappNumber from
 * @/lib/whatsapp-deeplink. Never hardcode a different number.
 */
export const buildRetinalCelimaxWhatsappMessage = (
  bundle: RetinalCelimaxBundle | null
): string => {
  if (!bundle) {
    return 'Hola Sofia, vi el Celimax Retinal Shot en Solenne y tengo una consulta antes de comprar.';
  }
  const totalLabel = formatRetinalCelimaxPrice(bundle.totalPrice);
  if (bundle.id === 'single') {
    return `Hola Sofia, vi el Celimax Retinal Shot en Solenne. Quiero 1 frasco por ${totalLabel}.`;
  }
  if (bundle.id === 'duo') {
    return `Hola Sofia, vi el Celimax Retinal Shot en Solenne. Quiero el Pack Dúo (2 frascos) por ${totalLabel}.`;
  }
  return `Hola Sofia, vi el Celimax Retinal Shot en Solenne. Quiero el Pack Madre (3 frascos) por ${totalLabel}, llega antes del 15 de mayo.`;
};
