## Contexto para n8n Workflow

Workflow completo de agente de ventas por WhatsApp para Solenne, una marca DTC de skincare premium en Paraguay. Producto principal: PDRN Pink Peptide Serum.

El sistema tiene DOS capas: respuestas automaticas sin IA (FAQ) y AI Agent para negociacion. La mayoria de mensajes se resuelven sin IA.

---

## Arquitectura General

```
[WhatsApp Cloud API Webhook - Mensaje entra]
      |
[Extraer datos + normalizar]
      |
[Postgres: estado + historial]
      |
[Pedido web?] -> [Confirmar pedido web]
      |
[Keyword Filter] <-> [AI Agent]
  |         |
[FAQ / AI Agent]
      |
[Formatear respuesta]
      |
[WhatsApp Cloud API - Enviar respuesta]
```

---

## Hard Debug / Produccion (Checklist)

- Responder `200 OK` al webhook inmediatamente y mover el procesamiento pesado a un sub-workflow con `Execute Workflow` para evitar timeouts.
- Normalizar el texto: lowercase, sin tildes, sin signos ni emojis. Guardar `text_raw` y `text_norm`.
- Manejar tipos de mensaje no-texto: si viene `location` tratarlo como Maps; si viene audio/imagen, pedir texto o ubicacion.
- De-dup con `message.id` usando indice unico y TTL. Si es duplicado, cortar la ejecucion.
- Router por estado (Postgres): `awaiting_location`, `awaiting_data`, `escalated`. Si hay estado activo, saltar keyword filter.
- En el keyword filter, priorizar intencion real sobre saludo. Confirmacion solo si el mensaje es corto o match exacto.
- Los `Wait` deben revalidar estado antes de enviar para evitar mensajes duplicados.
- HTTP Requests con `On Error = Stop Workflow` y notificacion a Gaston ante fallas.
- Loguear `phone`, `message_id`, `route`, `latency`, `error` para poder auditar produccion.
- Verificar que el modelo configurado exista en el proveedor (ID exacto) antes de ir a produccion.

---

## Workflow 1: PRINCIPAL, Receptor de mensajes

### Nodo 1: Webhook WhatsApp

- Trigger: Webhook que recibe POST de WhatsApp Cloud API
- Path: `solenneorder`
- Extraer del payload:
    - `from` (numero del cliente)
    - `text.body` (texto del mensaje)
    - `profile.name` (nombre del cliente)
    - `timestamp`
    - `message.id` (para no procesar duplicados)

### Nodo 2: Normalizar y clasificar mensaje

- Crear `text_raw` y `text_norm` (lowercase, sin tildes, sin signos ni emojis)
- Detectar tipo de mensaje: `text` / `location` / `image` / `audio`
- Si `location` o link de Maps -> tratar como ubicacion valida

### Nodo 3: Filtro de duplicados

- Verificar que el `message.id` no fue procesado antes
- Si es duplicado -> ignorar
- Guardar `message.id` procesado en Postgres o cache

### Nodo 4: Router por estado (Postgres)

- Buscar estado de conversacion por `phone` en `solenne_contacts`
- Si `awaiting_location` y el mensaje trae Maps -> ir a Confirmar Pedido Web (Paso 3A)
- Si `awaiting_data` -> ir a Captura de datos para orden
- Si `escalated` -> no responder o avisar que un asesor ya esta en contacto
- Si no hay estado activo -> continuar

### Nodo 5: Detectar si es PEDIDO WEB automatico

- Buscar en el texto patrones como:
    - `"Acabo de completar mi pedido"`
    - `"Orden: #SOL-"`
    - Contiene `"Solenne"` + `"Mis datos:"`
- Si es pedido web -> ir a Confirmar Pedido Web
- Si NO es pedido web -> siguiente nodo

### Nodo 6: Consultar historial en Postgres

- Query: `SELECT id, session_id, message, created_at FROM solenne_chat_histories WHERE session_id = $from ORDER BY created_at DESC LIMIT 10`
- Si hay historial y esta en negociacion activa -> enviar al AI Agent con contexto
- Si NO hay historial o no esta en negociacion -> enviar al Keyword Filter

### Nodo 7: Keyword Filter (Switch Node)

- Evaluar `text_norm` con `contains` o regex (no igualdad exacta)
- Confirmacion solo si `text_norm` matchea `^(si|confirmo|quiero|dale|va|mandame)$`
- Las keywords deben estar normalizadas sin tildes porque se comparan contra `text_norm`
- Prioridad: PROBLEMA/ERROR -> PRECIO -> ENVIO/DELIVERY -> INGREDIENTES -> FOTOS -> RESULTADOS -> LOCAL/TIENDA -> USO -> GARANTIA -> CONFIRMACION -> SALUDO SIMPLE -> DEFAULT

**Grupo PRECIO:**

- Keywords: `precio`, `cuanto`, `costo`, `cuesta`, `vale`
- Accion: Enviar imagen `lista_precios.jpg` + texto:

    ```
    Hola [nombre]

    Estos son nuestros precios:
    1 Serum: Gs. 189.000
    Kit Duo (2): Gs. 299.000, ahorras Gs. 79.000
    Kit Familiar (3): Gs. 399.000, ahorras Gs. 168.000

    El envio es GRATIS a todo Paraguay
    Te gustaria pedir el tuyo?
    ```

**Grupo FOTOS:**

- Keywords: `foto`, `fotos`, `imagen`, `como es`, `ver`
- Accion: Enviar 2-3 fotos del serum + texto:

    ```
    Asi se ve el PDRN Serum de Solenne
    Te gustaria probarlo?
    ```

**Grupo INGREDIENTES:**

- Keywords: `ingrediente`, `compuesto`, `formula`, `pdrn`, `peptido`, `hialuronico`, `niacinamida`
- Accion: Texto:

    ```
    Nuestro serum tiene una formula premium:
    PDRN 1% (regeneracion celular)
    Complejo de 5 Peptidos 5% (firmeza)
    Acido Hialuronico 3% (hidratacion profunda)
    Niacinamida 4% (luminosidad y poros)
    Es K-beauty de verdad! Te gustaria probarlo?
    ```

**Grupo RESULTADOS:**

- Keywords: `funciona`, `resultado`, `sirve`, `efectivo`, `cuanto tarda`, `antes despues`
- Accion: Texto:

    ```
    Los resultados se ven desde la primera semana!
    Semana 1: piel mas hidratada y luminosa
    Semana 2-3: mejora en textura y tono
    Semana 4+: transformacion visible
    Ademas tenes 30 dias de garantia si no ves resultados
    ```

**Grupo LOCAL/TIENDA:**

- Keywords: `local`, `tienda`, `donde estan`, `pasar a buscar`, `retirar`
- Accion: Texto:

    ```
    No contamos con local fisico, trabajamos solo por delivery a todo Paraguay
    El envio es totalmente GRATIS!
    Te gustaria que te enviemos el tuyo?
    ```

**Grupo USO:**

- Keywords: `como se usa`, `aplicar`, `uso`, `rutina`, `cuantas veces`, `gotas`
- Accion: Texto:

    ```
    Super facil de usar!
    2-3 gotas sobre piel limpia, manana y noche
    Antes de tu crema hidratante
    Se absorbe al instante, nada pegajoso
    Los resultados se ven desde la primera semana
    ```

**Grupo ENVIO/DELIVERY:**

- Keywords: `envio`, `delivery`, `demora`, `llega`, `cuanto tarda`, `entrega`
- Accion: Texto:

    ```
    Hacemos envios GRATIS a todo Paraguay!
    Entrega en 1-3 dias habiles
    Desde que ciudad nos escribis?
    ```

**Grupo GARANTIA:**

- Keywords: `garantia`, `devolver`, `devolucion`, `cambio`, `reembolso`
- Accion: Texto:

    ```
    Tenes garantia de satisfaccion de 30 dias
    Si no ves resultados, te devolvemos tu dinero
    Tu compra esta 100% protegida!
    Te gustaria probarlo?
    ```

**Grupo PAGO:**

- Keywords: `pago`, `pagar`, `transferencia`, `tarjeta`, `efectivo`, `contraentrega`
- Accion: Texto:

    ```
    Aceptamos pago contra entrega (efectivo al recibir)
    Tambien tarjeta de credito/debito por la web
    Y transferencia bancaria
    Como preferis pagar?
    ```

**Grupo CONFIRMACION:**

- Keywords (texto corto y exacto): `si`, `confirmo`, `quiero`, `dale`, `va`, `mandame`
- Accion: -> Sub-workflow: Captura de datos para orden

**Grupo PROBLEMA/ERROR:**

- Keywords: `problema`, `error`, `no funciona`, `no carga`, `reclamo`, `queja`
- Accion: -> Sub-workflow: Human Handoff

**Grupo SALUDO SIMPLE:**

- Keywords: `hola`, `buenas`, `buen dia`, `buenas tardes`, `buenas noches`
- Accion: Texto + foto del producto:

    ```
    Hola [nombre]! Bienvenida a Solenne
    Tenemos el PDRN Pink Peptide Serum, el secreto K-beauty para una piel radiante
    [enviar foto del producto]
    Te gustaria conocer mas?
    ```

**DEFAULT (ningun keyword match):**

- -> Enviar al AI Agent

---

## Sub-workflow 2: CONFIRMAR PEDIDO WEB

Se activa cuando se detecta un mensaje automatico de pedido web.

### Paso 1: Parsear el mensaje

- Extraer con regex:
    - Numero de orden: `#SOL-XXXX-XXXX`
    - Producto
    - Monto
    - Nombre
    - Telefono
    - Ubicacion

### Paso 2: Evaluar la ubicacion

- El campo ubicacion contiene link de Google Maps?
    - SI tiene link de Maps -> Ir a Paso 3A (confirmacion directa)
    - NO tiene link de Maps -> Ir a Paso 3B (pedir ubicacion)

### Paso 3A: Confirmacion directa (tiene Google Maps)

- Guardar estado en Postgres: `awaiting_location = false`, `order_status = confirming`
- Esperar 2 minutos (Wait node) para dar chance a la clienta de escribir algo mas
- Antes de enviar, revalidar que `order_status = confirming` para evitar duplicados
- Enviar mensaje 1:

    ```
    Hola [nombre]!
    Tu pedido [#orden] ha sido confirmado
    Muchas gracias por confiar en Solenne!
    El delivery se pondra en contacto para coordinar su entrega
    ```

- Esperar 5 segundos
- Enviar mensaje 2:

    ```
    Ante cualquier duda estamos a las ordenes por este medio!
    ```

- Notificar a Gaston por email + WhatsApp con resumen del pedido

### Paso 3B: Pedir ubicacion (no tiene Maps link)

- Guardar estado en Postgres: `awaiting_location = true`
- Esperar 2 minutos (Wait node)
- Antes de enviar, revalidar que `awaiting_location = true` para evitar duplicados
- Enviar mensaje:

    ```
    Hola [nombre]!
    Recibimos tu pedido [#orden]
    Para coordinar el envio, nos podrias compartir tu ubicacion por Google Maps?
    Solo tenes que abrir Google Maps, mantener presionado tu ubicacion, y compartir el link aca
    ```

- Cuando la clienta responda con un link de Maps -> ejecutar Paso 3A

---

## Sub-workflow 3: AI AGENT (Sofia)

Se activa SOLO cuando:

- El keyword filter no matcheo
- La clienta ya tiene historial (esta en negociacion)
- La conversacion es compleja o ambigua

### Configuracion del AI Agent Node

**Model:** Claude (Anthropic) via API, usar claude-sonnet-4-5-20250929

**System Prompt:**

```
Sos Sofia, asesora de belleza de Solenne Paraguay.

IDENTIDAD:
- Sos humana, cercana, amigable
- Hablas en espanol paraguayo natural, tono femenino y girly
- Usas el nombre de pila de la clienta
- Emojis moderados y femeninos (sparkles, heart, check, star)
- NUNCA reveles que sos IA o bot
- SIEMPRE terminas con una pregunta
- Respuestas cortas, maximo 3-4 lineas por mensaje
- Tono aspiracional, elegante, K-beauty

PRODUCTO:
- PDRN Pink Peptide Serum 30ml
- Personal (1): Gs. 189.000
- Kit Duo (2): Gs. 299.000 (ahorro de Gs. 79.000)
- Kit Familiar (3): Gs. 399.000 (ahorro de Gs. 168.000)
- Unidades extra: Gs. 133.000 c/u
- Envio GRATIS a todo Paraguay, 1-3 dias habiles
- Garantia de satisfaccion de 30 dias
- Ingredientes: PDRN 1%, Complejo de 5 Peptidos 5%, Acido Hialuronico 3%, Niacinamida 4%
- NO tienen local fisico, solo delivery

ESTRATEGIA DE VENTA:
- Presentas la oportunidad sin rogar
- Usas escasez real: "nos quedan pocas unidades"
- Usas prueba social: "es nuestro mas vendido, ya van 2800+ clientas felices"
- Siempre intentas el upsell al Kit Duo cuando es natural
- Cierre logistico: "Estamos preparando envios hoy, te gustaria recibir el tuyo?"

MANEJO DE OBJECIONES:
- "Es caro" -> No bajas precio. Justificas: "Son menos de Gs. 3.200 por dia por una piel radiante. Ademas con el Kit Duo ahorras Gs. 79.000"
- "Lo pienso" -> "Perfecto, te reservo uno por hoy por las dudas. Te parece?"
- "No confio" -> "Tenes 30 dias de garantia. Si no te gusta, te devolvemos tu plata"
- "Funciona?" -> Describir ingredientes premium y resultados desde primera semana
- "Vi algo parecido mas barato" -> "El PDRN concentrado al 1% es lo que lo diferencia. La mayoria usa concentraciones menores"

CUANDO CERRAR:
- Si pregunto precio dos veces -> ofrece el Kit Duo
- Si duda -> ofrece reservar sin compromiso
- Si confirma -> pedi direccion + nombre inmediatamente

CONFIRMACION DE ENVIO:
- "Te enviaremos tu pedido lo antes posible. El delivery se pondra en contacto para coordinar la entrega!"

CUANDO USAR send_media:
- Usa send_media("lista_precios") solo cuando la clienta esta dudando del precio EN MEDIO de una negociacion
- Usa send_media("pack_comparativo") cuando hay oportunidad clara de upsell
- Usa send_media("foto_producto") solo si la clienta pide ver fotos durante la conversacion
- NO envies media si el FAQ ya lo hizo en la primera interaccion

CUANDO ESCALAR A HUMANO:
- Clienta muy enojada o con queja grave
- Error tecnico en la web
- Pedido con problema de entrega
- Solicitud que no podes resolver

NUNCA:
- Bajar el precio
- Inventar stock
- Prometer hora exacta de entrega
- Dejar un mensaje sin pregunta al final
- Enviar mensajes largos (maximo 3-4 lineas)
- Usar "usted", siempre tutear
```

**Tools disponibles para el AI Agent:**

**Tool 1: send_media**

- Input: `media_type` (string: "lista_precios" | "pack_comparativo" | "foto_producto")
- Descripcion para el agente: "Envia una imagen a la clienta por WhatsApp. Usalo solo durante negociacion activa, no para respuestas basicas que ya maneja el FAQ."
- Implementacion: HTTP Request node a WhatsApp API para enviar imagen por URL o media_id

**Tool 2: confirm_order**

- Input: `nombre` (string), `direccion` (string), `producto` (string), `monto` (string)
- Descripcion: "Genera y envia la plantilla de confirmacion de pedido a la clienta. Usalo cuando la clienta confirmo que quiere comprar y ya tenes sus datos."
- Implementacion: Formatea el mensaje de confirmacion + notifica a Gaston

**Tool 3: human_handoff**

- Input: `motivo` (string), `resumen_conversacion` (string)
- Descripcion: "Escala la conversacion a un humano. Usalo solo para quejas graves, errores tecnicos o situaciones que no podes resolver."
- Implementacion: Envia alerta a Gaston + responde a la clienta que la transfiere a un asesor

**Memory:** Postgres con window_buffer de ultimos 10 mensajes por numero de telefono. Tabla: `solenne_chat_histories`.

---

## Sub-workflow 4: CAPTURA DE DATOS PARA ORDEN

### Paso 1: Cargar/crear borrador

- Crear o leer un `order_draft` por `phone` en `solenne_order_drafts`
- Marcar `awaiting_data = true` y `data_step` actual

### Paso 2: Resolver producto

- Si el mensaje menciona `kit duo`, `2`, `dos` -> seleccionar Kit Duo
- Si menciona `kit familiar`, `3`, `tres` -> seleccionar Kit Familiar
- Si menciona `1`, `uno`, `personal` -> seleccionar Personal
- Si no esta claro -> preguntar "Cuantos serums te gustaria? 1 (Gs. 189.000), Kit Duo de 2 (Gs. 299.000), o Kit Familiar de 3 (Gs. 399.000)?"

### Paso 3: Capturar datos faltantes

- Pedir solo UN dato por mensaje (nombre, ciudad, direccion o link de Maps)
- Guardar cada respuesta en el borrador y avanzar `data_step`

### Paso 4: Validar ubicacion

- Si hay Google Maps link valido -> guardar `google_maps_url`
- Si es texto manual -> pedir `address` y `city`

### Paso 5: Crear orden en Ordefy

- `POST /api/webhook/orders/0b3f13f8-d1dc-48a5-a707-27a095c9c545` con `idempotency_key` del tipo `whatsapp-{phone}-{draft_id}`
- Headers: `X-API-Key: {{ORDEFY_API_KEY}}`
- Si hay error, notificar a Gaston y mantener `awaiting_data = true`

### Paso 6: Confirmar a la clienta

- Enviar mensaje de confirmacion + notificar a Gaston
- Limpiar `order_draft`, setear `awaiting_data = false` y `order_status = confirmed`

---

## Sub-workflow 5: HUMAN HANDOFF

### Paso 1: Notificar a Gaston

- Enviar mensaje por WhatsApp personal o email:

    ```
    ESCALADO A HUMANO
    Clienta: [nombre] ([numero])
    Motivo: [motivo]
    Resumen: [ultimos 5 mensajes]
    ```

### Paso 2: Responder a la clienta

- Texto:

    ```
    Te paso con una asesora ahora mismo [nombre]
    En breve te responde personalmente!
    ```

### Paso 3: Marcar en Postgres

- `solenne_upsert_contact(phone, escalated => true)`
- Mientras `escalated = true`, NO procesar mensajes con IA
- Gaston puede desactivar con un comando o desde dashboard

---

## Pack Pricing Logic (Code Node)

```javascript
const quantity = $input.item.json.quantity || 1;
const extraUnits = Math.max(0, quantity - 3);
const baseQuantity = Math.min(quantity, 3);

const PACK_PRICES = { 1: 189000, 2: 299000, 3: 399000 };
const PACK_NAMES = { 1: "Personal", 2: "Kit Duo", 3: "Kit Familiar" };
const PACK_SKUS = { 1: "SOLENNE-PDRN-30ML", 2: "SOLENNE-PDRN-DUO", 3: "SOLENNE-PDRN-FAMILIAR" };

let total = PACK_PRICES[baseQuantity] + (extraUnits * 133000);

const items = [{
  name: "PDRN Pink Peptide Serum 30ml",
  sku: PACK_SKUS[baseQuantity],
  quantity: 1,
  price: PACK_PRICES[baseQuantity],
  variant_title: PACK_NAMES[baseQuantity]
}];

if (extraUnits > 0) {
  items.push({
    name: "PDRN Pink Peptide Serum 30ml (extra)",
    sku: "SOLENNE-PDRN-30ML",
    quantity: extraUnits,
    price: 133000,
    variant_title: "Unidad Extra"
  });
}

return { items, total, packName: PACK_NAMES[baseQuantity] };
```

---

## Base de datos Postgres

Supabase project: `qapqhhyfzmgkvzvtoluq`

Tablas (prefijo `solenne_` para aislamiento de NOCTE):
- `solenne_chat_histories` (session_id, message JSONB, created_at)
- `solenne_contacts` (phone, name, awaiting_location, awaiting_data, data_step, order_status, escalated, pending_order_id, last_interaction)
- `solenne_order_drafts` (phone, draft_json JSONB, updated_at)
- `solenne_knowledge_base` (category, trigger_keywords, content, priority)

RPC: `solenne_upsert_contact(...)` para upsert atomico de estado de conversacion.

---

## Ordefy Integration

- Store ID: `0b3f13f8-d1dc-48a5-a707-27a095c9c545`
- API Key: `{{ORDEFY_API_KEY}}`
- Base URL: `https://api.ordefy.io/api/webhook/orders/0b3f13f8-d1dc-48a5-a707-27a095c9c545`
- SKUs: SOLENNE-PDRN-30ML, SOLENNE-PDRN-DUO, SOLENNE-PDRN-FAMILIAR, SOLENNE-ENVIO-PRIORITARIO

---

## Variables de entorno necesarias

```
WHATSAPP_PHONE_NUMBER_ID=     (pendiente: nuevo numero Solenne)
WHATSAPP_ACCESS_TOKEN=        (pendiente: Meta Business)
WHATSAPP_VERIFY_TOKEN=        (generar nuevo para Solenne)
CLAUDE_API_KEY=               (o OpenRouter)
POSTGRES_CONNECTION_STRING=   (Supabase qapqhhyfzmgkvzvtoluq)
ORDEFY_API_KEY={{ORDEFY_API_KEY}}
ORDEFY_STORE_ID=0b3f13f8-d1dc-48a5-a707-27a095c9c545
GASTON_WHATSAPP_NUMBER=
GASTON_EMAIL=gastonlpza@gmail.com
```

---

## Archivos de media necesarios

Antes de deployar, subir y obtener los `media_id` de WhatsApp para:

1. `lista_precios.jpg` - Imagen comparativa Personal vs Kit Duo vs Kit Familiar
2. `foto_producto_1.jpg` - PDRN Serum botella
3. `foto_producto_2.jpg` - Serum en uso / lifestyle
4. `pack_comparativo.jpg` - Visual del ahorro del Kit Duo

---

## Notas de implementacion

- El Wait de 2 minutos en pedidos web es CLAVE. Darle a la clienta la chance de enviar su ubicacion o confirmar primero. El Wait debe revalidar estado antes de enviar.
- El keyword filter debe ser CASE INSENSITIVE y manejar acentos (cuanto = cuanto).
- Cada mensaje entrante y saliente se guarda en `solenne_chat_histories` para el historial.
- Si `escalated = true`, el bot NO responde. Solo Gaston.
- Rate limit: no enviar mas de 3 mensajes seguidos al mismo numero en 10 segundos.
- NUNCA modificar el workflow de NOCTE. Este es un workflow completamente independiente.
