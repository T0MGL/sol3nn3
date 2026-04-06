## Solenne: Ordefy Webhook API Reference

Store ID: `0b3f13f8-d1dc-48a5-a707-27a095c9c545`
Base URL: `https://api.ordefy.io/api/webhook/orders/0b3f13f8-d1dc-48a5-a707-27a095c9c545`
Auth: `X-API-Key: wh_6d021f48403a313bd3dfede798fe13855331f33ce6cb148ccf153f2e26df`

---

### Crear Orden

```
POST /api/webhook/orders/0b3f13f8-d1dc-48a5-a707-27a095c9c545

Headers:
  Content-Type: application/json
  X-API-Key: wh_6d021f48403a313bd3dfede798fe13855331f33ce6cb148ccf153f2e26df

Body:
{
  "idempotency_key": "whatsapp-0981123456-uuid",
  "customer": {
    "name": "Maria Lopez",
    "phone": "+595981123456",
    "email": "maria@example.com"
  },
  "shipping_address": {
    "google_maps_url": "https://maps.app.goo.gl/...",
    "notes": "Casa blanca"
  },
  "items": [
    {
      "name": "PDRN Pink Peptide Serum 30ml",
      "sku": "SOLENNE-PDRN-DUO",
      "quantity": 1,
      "price": 299000,
      "variant_title": "Kit Duo"
    }
  ],
  "totals": {
    "subtotal": 299000,
    "shipping": 0,
    "total": 299000
  },
  "payment_method": "cash_on_delivery"
}

Response (201):
{
  "success": true,
  "order_id": "uuid",
  "order_number": "ORD-00042",
  "customer_id": "uuid"
}
```

---

### Buscar Ordenes

```
GET /api/webhook/orders/0b3f13f8-d1dc-48a5-a707-27a095c9c545/lookup?phone=0981123456&status=pending&limit=5

Response (200):
{
  "success": true,
  "orders": [...],
  "total": 1
}
```

---

### Confirmar Orden

```
POST /api/webhook/orders/0b3f13f8-d1dc-48a5-a707-27a095c9c545/confirm

Body:
{
  "order_number": "ORD-00042"
}

Response (200):
{
  "success": true,
  "order_number": "ORD-00042",
  "status": "confirmed"
}
```

---

### Actualizar Estado

```
PATCH /api/webhook/orders/0b3f13f8-d1dc-48a5-a707-27a095c9c545/status

Body:
{
  "order_number": "ORD-00042",
  "status": "contacted"
}

Response (200):
{
  "success": true,
  "previous_status": "pending",
  "new_status": "contacted"
}
```

---

### Agregar Items (Upsell)

```
PATCH /api/webhook/orders/0b3f13f8-d1dc-48a5-a707-27a095c9c545/items

Body:
{
  "order_number": "ORD-00042",
  "action": "add",
  "products": [
    {
      "sku": "SOLENNE-ENVIO-PRIORITARIO",
      "name": "Envio Prioritario VIP",
      "quantity": 1,
      "price": 10000,
      "is_upsell": true
    }
  ]
}

Response (200):
{
  "success": true,
  "items_count": 2,
  "total_price": 309000
}
```

---

### SKUs de Solenne

| SKU | Producto | Precio |
|---|---|---|
| SOLENNE-PDRN-30ML | PDRN Pink Peptide Serum 30ml (Personal) | Gs. 189.000 |
| SOLENNE-PDRN-DUO | Kit Duo (2 unidades) | Gs. 299.000 |
| SOLENNE-PDRN-FAMILIAR | Kit Familiar (3 unidades) | Gs. 399.000 |
| SOLENNE-ENVIO-PRIORITARIO | Envio Prioritario VIP | Gs. 10.000 |

---

### Estados de Orden

pending -> contacted -> confirmed -> in_preparation -> ready_to_ship -> shipped -> delivered

Tambien: cancelled, rejected
