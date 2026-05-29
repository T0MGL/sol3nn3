# DEPRECATED, DO NOT DEPLOY

Este backend (server.js) esta MUERTO desde 2026-05-18 y NO debe redeployarse.

## Que reemplaza esto

El backend vivo de Solenne son las funciones serverless en la raiz del proyecto:

- `api/send-order.js` -> `api/_lib/ordefy.js`

Estas corren dentro del unico proyecto Vercel `bysolenne` (prj_LgoAFqvCQyKt15GMtGamj78HnSo0).
`nocte-backend/` NO tiene link propio a Vercel y NO esta desplegado en ningun dominio.

## Por que NO se debe revivir

`getSku()` en `server.js` mapea quantity 1 al SKU PADRE `SOLENNE-PDRN-30ML`. Ese SKU es ambiguo
en Ordefy (tiene variantes hijas) y dispara `AMBIGUOUS_PARENT_SKU`, lo que hace que Ordefy
RECHACE la orden entera. El individual canonico correcto es `SOLENNE-PDRN-30ML-IND`, que ya
maneja el backend vivo en `api/_lib/ordefy.js` (funcion `getSku`).

Si necesitas tocar la logica de ordenes a Ordefy, edita `api/_lib/ordefy.js`. Nunca este archivo.

## Para borrar definitivamente

Cuando se confirme que no hay referencia historica util, eliminar el directorio `nocte-backend/`
completo. Por ahora se conserva solo como referencia de git.
