# Solenne Automation: Setup Reference

## IDs and Credentials

| Item | Value |
|---|---|
| Ordefy Store ID | `0b3f13f8-d1dc-48a5-a707-27a095c9c545` |
| Ordefy API Key | `wh_6d021f48403a313bd3dfede798fe13855331f33ce6cb148ccf153f2e26df` |
| Ordefy Webhook URL | `https://api.ordefy.io/api/webhook/orders/0b3f13f8-d1dc-48a5-a707-27a095c9c545` |
| Product ID (PDRN Serum) | `2242e89a-9829-4f27-babf-3a1d10c2b9a4` |
| Variant ID (Kit Duo) | `9d79793b-0635-4109-b0db-f053737e6801` |
| Variant ID (Kit Familiar) | `074c56a3-0d77-4cf7-8c78-0338cc0f104e` |
| Product ID (Envio VIP) | `d13997dc-72ff-412e-9352-2dd96257cba4` |
| Carrier ID | `c62e22b1-a558-4dd6-9df0-fcc3ed699b89` |
| n8n Webhook Path | `solenneorder` |
| Supabase (chat tables) | `qapqhhyfzmgkvzvtoluq` |

## Checklist: Gaston Actions Required

### 1. Supabase Migration (REQUIRED)

Run `supabase-migration.sql` in the Supabase SQL Editor:
https://supabase.com/dashboard/project/qapqhhyfzmgkvzvtoluq/sql/new

This creates: solenne_chat_histories, solenne_contacts, solenne_order_drafts, solenne_knowledge_base, solenne_few_shot_examples, solenne_upsert_contact() RPC.

### 2. WhatsApp Number (REQUIRED)

Once the number is created:
1. Get the `Phone Number ID` and `Access Token` from Meta Business API
2. Update in n8n: create new WhatsApp credential "Solenne WhatsApp"
3. Update in code: set `VITE_WHATSAPP_NUMBER` in `.env` and `.env.production`
4. Register message templates in Meta Business Manager:
   - `solenne_order_confirmation`
   - `solenne_follow_up`
   - `solenne_delivery_update`

### 3. Chatwoot (REQUIRED)

1. Create new inbox type "WhatsApp Cloud" in existing Chatwoot instance
2. Connect the new Solenne WhatsApp number
3. Note the webhook callback URL for n8n configuration

### 4. n8n Workflow (REQUIRED)

1. Import `workflow-solenne.json` into n8n (https://n8n.thebrightidea.ai)
2. Create/update credentials:
   - **Solenne WhatsApp**: Phone Number ID + Access Token
   - **Postgres**: Same Supabase connection (reuse NOCTE credential, tables use `solenne_` prefix)
   - **Gmail**: Same (gastonlpza@gmail.com)
3. Replace WhatsApp Phone Number ID in all HTTP Request nodes (search for `SOLENNE_PHONE_NUMBER_ID_PLACEHOLDER`)
4. Activate the workflow
5. Test: send "hola" to the new number

### 5. Vercel Environment Variables (REQUIRED)

In Vercel dashboard for bysolenne.shop project:

```
ORDEFY_WEBHOOK_URL=https://api.ordefy.io/api/webhook/orders/0b3f13f8-d1dc-48a5-a707-27a095c9c545
ORDEFY_API_KEY=wh_6d021f48403a313bd3dfede798fe13855331f33ce6cb148ccf153f2e26df
N8N_WEBHOOK_URL=https://n8n.thebrightidea.ai/webhook/solenneorder
VITE_WHATSAPP_NUMBER=595XXXXXXXXX
STRIPE_SECRET_KEY=(existing Solenne Stripe key)
```

### 6. WhatsApp Media (REQUIRED before going live)

Upload to the new WhatsApp Business account and get media IDs:
1. `lista_precios.jpg`: comparativa Personal vs Kit Duo vs Kit Familiar
2. `foto_producto_1.jpg`: PDRN Serum botella
3. `foto_producto_2.jpg`: lifestyle/uso
4. `pack_comparativo.jpg`: visual del ahorro

Update media IDs in the n8n workflow FAQ response nodes.

## SKUs

| SKU | Producto | Precio (Gs.) |
|---|---|---|
| SOLENNE-PDRN-30ML | PDRN Serum (Personal, 1u) | 189,000 |
| SOLENNE-PDRN-DUO | Kit Duo (2u) | 299,000 |
| SOLENNE-PDRN-FAMILIAR | Kit Familiar (3u) | 399,000 |
| SOLENNE-ENVIO-PRIORITARIO | Envio Prioritario VIP | 10,000 |

## Files Modified

| File | Change |
|---|---|
| `src/services/orderService.ts` | Webhook URL -> solenneorder, order prefix -> #SOL- |
| `src/components/WhatsAppButton.tsx` | Uses VITE_WHATSAPP_NUMBER env var |
| `src/components/checkout/StripeCheckoutModal.tsx` | Uses VITE_WHATSAPP_NUMBER, Solenne branding |
| `src/components/checkout/PaymentFallbackModal.tsx` | "PDRN Serum de Solenne" |
| `src/components/CountdownTimer.tsx` | Storage key -> solenne-countdown-target |
| `src/lib/stripe.ts` | Product config -> PDRN Serum, PYG |
| `src/lib/meta-pixel.ts` | Content -> Solenne, Skincare category, 189k price |
| `src/pages/TerminosCondiciones.tsx` | @bysolenne, skincare description |
| `src/pages/PoliticaPrivacidad.tsx` | @bysolenne |
| `.env` | Product name, n8n webhook, WA number placeholder |
| `.env.production` | n8n webhook, WA number placeholder, product name |
| `nocte-backend/.env` | Ordefy URL/key -> Solenne, n8n -> solenneorder |
| `nocte-backend/server.js` | CORS -> bysolenne.shop |

## Files Created

| File | Purpose |
|---|---|
| `n8n/prompt.md` | Sofia AI agent system prompt + workflow architecture |
| `n8n/api-docs.md` | Ordefy webhook API reference for Solenne |
| `n8n/supabase-migration.sql` | DDL + seed data for Supabase tables |
| `n8n/workflow-solenne.json` | Complete n8n workflow (cloned from NOCTE) |
| `n8n/SETUP.md` | This file |
