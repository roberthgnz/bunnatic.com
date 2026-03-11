# Rate Limiting para Endpoints de Demostración

## Resumen

Se ha implementado un sistema de rate limiting usando **Upstash Redis** para los endpoints de demostración de la página `/crear-pagina-web-negocio`. Los usuarios no registrados tienen un límite de 5 búsquedas cada 48 horas por dirección IP.

## Cambios Implementados

### 1. Sistema de Rate Limiting con Upstash Redis (`lib/rateLimit.ts`)

- Rate limiter usando Upstash Redis (serverless, edge-compatible)
- Límite: 5 usos por IP cada 48 horas
- TTL automático en Redis para limpieza de entradas expiradas
- Extracción de IP real desde headers de proxy/load balancer
- Fail-open: permite requests si Redis falla (para resiliencia)

### 2. Configuración de Upstash

Variables de entorno requeridas en `.env`:

```bash
UPSTASH_REDIS_REST_URL="https://YOUR_REDIS_ENDPOINT.upstash.io"
UPSTASH_REDIS_REST_TOKEN="YOUR_UPSTASH_TOKEN"
```

Para obtener estas credenciales:
1. Crea una cuenta en [Upstash Console](https://console.upstash.com/)
2. Crea una nueva base de datos Redis
3. Copia las credenciales REST API (URL y Token)

### 3. Instalación

```bash
pnpm install @upstash/redis
```

### 4. Nuevos Endpoints bajo `/api/demo/`

Se crearon versiones con rate limit de los endpoints existentes:

- `/api/demo/places/search` - Búsqueda de negocios en Google Places
- `/api/demo/places/details` - Detalles de un negocio específico
- `/api/demo/places/crawl` - Análisis de sitios web con Firecrawl

Todos los endpoints:
- Verifican el rate limit antes de procesar la petición
- Retornan status 429 cuando se excede el límite
- Incluyen headers `X-RateLimit-*` con información del límite

### 5. Actualización de la Página de Creación

La página `app/[locale]/crear-pagina-web-negocio/page.tsx` ahora:

- Usa los nuevos endpoints `/api/demo/` en lugar de `/api/`
- Detecta cuando se alcanza el límite (status 429)
- Muestra un CTA atractivo para registrarse cuando se excede el límite
- Informa al usuario cuándo podrá volver a intentarlo

### 6. UI del Rate Limit

Cuando un usuario alcanza el límite, se muestra:

- Mensaje claro explicando que ha alcanzado el límite
- Tiempo restante hasta que se resetee el límite
- Lista de beneficios de registrarse
- Botón prominente para crear cuenta gratis
- Diseño atractivo con gradientes y colores llamativos

## Respuesta de Error (429)

```json
{
  "error": "rate_limit_exceeded",
  "message": "Has alcanzado el límite de búsquedas de demostración. Regístrate para continuar.",
  "resetAt": 1234567890000
}
```

Headers incluidos:
- `X-RateLimit-Limit: 5`
- `X-RateLimit-Remaining: 0`
- `X-RateLimit-Reset: 1234567890000`

## Endpoints Originales

Los endpoints originales en `/api/places/` permanecen sin cambios y sin rate limiting. Estos pueden ser usados por usuarios autenticados o en otras partes de la aplicación.

## Ventajas de Upstash Redis

1. **Serverless**: No necesitas gestionar infraestructura
2. **Edge-Compatible**: Funciona en Edge Runtime de Vercel/Next.js
3. **Global**: Baja latencia desde cualquier región
4. **Escalable**: Maneja millones de requests sin configuración
5. **Persistente**: Los datos sobreviven reinicios del servidor
6. **Multi-Instancia**: Funciona correctamente con múltiples instancias de la app

## Testing

Para probar el rate limiting:

1. Asegúrate de tener las credenciales de Upstash en `.env`
2. Instala las dependencias: `pnpm install`
3. Visita `/crear-pagina-web-negocio`
4. Realiza 5 búsquedas diferentes
5. En la 6ta búsqueda deberías ver el mensaje de límite alcanzado

Para resetear el límite manualmente (testing):
```bash
# Usando Upstash CLI o Redis CLI
redis-cli -u $UPSTASH_REDIS_REST_URL DEL "ratelimit:demo:YOUR_IP"
```

## Monitoreo

Puedes monitorear el uso del rate limit en:
- Upstash Console: Ver comandos ejecutados, latencia, etc.
- Logs de la aplicación: Errores de rate limit se loguean

## Mejoras Futuras Recomendadas

1. **Rate Limiting por Usuario Autenticado**: Diferentes límites para usuarios registrados vs anónimos

2. **Analytics**: Trackear cuántos usuarios alcanzan el límite y cuántos se registran después

3. **A/B Testing**: Probar diferentes límites (3, 5, 10 búsquedas) para optimizar conversión

4. **Bypass para IPs Internas**: Permitir testing sin límites desde IPs de desarrollo

5. **Rate Limit Sliding Window**: Implementar ventana deslizante en lugar de ventana fija para distribución más uniforme
