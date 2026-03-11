# Configuración de Upstash Redis para Rate Limiting

## Paso 1: Crear cuenta en Upstash

1. Ve a [https://console.upstash.com/](https://console.upstash.com/)
2. Crea una cuenta gratuita (incluye 10,000 comandos/día gratis)

## Paso 2: Crear base de datos Redis

1. En el dashboard de Upstash, haz clic en "Create Database"
2. Configura:
   - **Name**: `bunnatic-ratelimit` (o el nombre que prefieras)
   - **Type**: Regional o Global (Global recomendado para mejor latencia)
   - **Region**: Elige la más cercana a tus usuarios
   - **Eviction**: No eviction (recomendado para rate limiting)
3. Haz clic en "Create"

## Paso 3: Obtener credenciales

1. Una vez creada la base de datos, ve a la pestaña "Details"
2. En la sección "REST API", encontrarás:
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`
3. Copia estos valores

## Paso 4: Configurar variables de entorno

Añade las credenciales a tu archivo `.env`:

```bash
UPSTASH_REDIS_REST_URL="https://your-endpoint.upstash.io"
UPSTASH_REDIS_REST_TOKEN="your-token-here"
```

## Paso 5: Instalar dependencias

```bash
pnpm install
```

Esto instalará `@upstash/redis` que ya está en el `package.json`.

## Paso 6: Verificar funcionamiento

1. Inicia el servidor de desarrollo:
   ```bash
   pnpm dev
   ```

2. Ve a `http://localhost:3000/crear-pagina-web-negocio`

3. Realiza una búsqueda y verifica en los logs que no hay errores

4. Puedes verificar en Upstash Console que se están ejecutando comandos

## Monitoreo en Upstash

En el dashboard de Upstash puedes ver:
- **Commands**: Número de comandos ejecutados
- **Latency**: Latencia promedio de las operaciones
- **Data Browser**: Ver las keys almacenadas (útil para debugging)

Para ver las keys de rate limit:
1. Ve a "Data Browser" en tu base de datos
2. Busca keys que empiecen con `ratelimit:demo:`

## Troubleshooting

### Error: "Upstash Redis credentials not found"

- Verifica que las variables de entorno estén correctamente configuradas
- Reinicia el servidor de desarrollo después de añadir las variables

### Rate limit no funciona

- Verifica en Upstash Console que se están ejecutando comandos
- Revisa los logs del servidor para ver errores
- El sistema hace "fail-open", así que si Redis falla, permite los requests

### Limpiar rate limit para testing

Puedes usar los scripts de gestión incluidos:

```bash
# Ver rate limit de una IP específica
pnpm ratelimit:check 192.168.1.1

# Resetear rate limit de una IP
pnpm ratelimit:reset 192.168.1.1

# Listar todos los rate limits activos
pnpm ratelimit:list
```

También puedes hacerlo manualmente en el Data Browser de Upstash o con Redis CLI:

```bash
# Usando redis-cli
redis-cli -u $UPSTASH_REDIS_REST_URL DEL "ratelimit:demo:YOUR_IP"
```

## Plan Gratuito de Upstash

El plan gratuito incluye:
- 10,000 comandos por día
- 256 MB de almacenamiento
- Suficiente para ~3,000-5,000 usuarios únicos por día con rate limiting

Para más tráfico, considera actualizar al plan Pro.
