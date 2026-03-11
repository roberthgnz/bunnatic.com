# Quick Start: Rate Limiting con Upstash

## 🚀 Instalación Rápida (5 minutos)

### 1. Instalar dependencias
```bash
pnpm install
```

### 2. Configurar Upstash Redis

1. Crea cuenta en [console.upstash.com](https://console.upstash.com/)
2. Crea una base de datos Redis
3. Copia las credenciales REST API

### 3. Añadir variables de entorno

Crea o edita `.env.local`:

```bash
UPSTASH_REDIS_REST_URL="https://your-endpoint.upstash.io"
UPSTASH_REDIS_REST_TOKEN="your-token-here"
```

### 4. Iniciar servidor

```bash
pnpm dev
```

### 5. Probar

1. Ve a `http://localhost:3000/crear-pagina-web-negocio`
2. Realiza 5 búsquedas
3. En la 6ta búsqueda verás el mensaje de límite alcanzado

## 📊 Gestión del Rate Limit

```bash
# Ver todos los rate limits activos
pnpm ratelimit:list

# Ver rate limit de una IP específica
pnpm ratelimit:check 192.168.1.1

# Resetear rate limit de una IP (útil para testing)
pnpm ratelimit:reset 192.168.1.1
```

## 🔧 Configuración

El rate limit está configurado en `lib/rateLimit.ts`:

- **Límite**: 5 búsquedas
- **Ventana**: 48 horas
- **Scope**: Por dirección IP

Para cambiar estos valores, edita la función `checkRateLimit()`.

## 📁 Archivos Importantes

- `lib/rateLimit.ts` - Lógica del rate limiter
- `app/api/demo/places/*` - Endpoints con rate limiting
- `app/[locale]/crear-pagina-web-negocio/page.tsx` - UI que consume los endpoints
- `scripts/manage-ratelimit.ts` - Script de gestión

## 📚 Documentación Completa

- [SETUP_UPSTASH.md](./SETUP_UPSTASH.md) - Guía detallada de configuración
- [DEMO_RATE_LIMIT.md](./DEMO_RATE_LIMIT.md) - Documentación técnica completa

## ❓ Problemas Comunes

**No funciona el rate limit**
- Verifica que las variables de entorno estén configuradas
- Reinicia el servidor después de añadir las variables
- Revisa los logs para ver errores de conexión

**Quiero probar sin límites**
- Usa `pnpm ratelimit:reset YOUR_IP` para resetear tu límite
- O comenta temporalmente la verificación en los endpoints

**¿Cómo sé mi IP?**
- En desarrollo local, probablemente sea `::1` o `127.0.0.1`
- Usa `pnpm ratelimit:list` para ver todas las IPs con límite activo
