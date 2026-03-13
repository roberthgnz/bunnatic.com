# Persistencia de Estado de Generación con Redis (Upstash)

## Descripción

El estado de generación en `/dashboard/generation` ahora se persiste en Redis usando Upstash, permitiendo que los usuarios puedan recargar la página sin perder su progreso.

## Arquitectura

### Backend (API Route)
- **Ruta**: `/api/generation-state`
- **Métodos**:
  - `GET`: Recupera el estado guardado del usuario actual
  - `POST`: Guarda el estado actual del usuario
  - `DELETE`: Elimina el estado guardado del usuario

### Frontend (Componente)
- **Componente**: `GlobalGenerationPanel`
- **Ubicación**: `app/dashboard/generation/_components/GlobalGenerationPanel.tsx`

## Estado Persistido

El siguiente estado se guarda en Redis:

```typescript
{
  sourceType: 'google' | 'url',
  googleResults: PlaceSearchResult[],
  preview: BusinessSourcePreview | null,
  selectedBlocks: string[],
  selectedBusinessId: string,
  googleQuery?: string,
  urlValue?: string,
  crawlJobId?: string | null,  // Para reanudar crawls en progreso
  crawlUrl?: string | null      // URL del crawl en progreso
}
```

## Características

### 1. Carga Automática
Al montar el componente, se carga automáticamente el estado guardado desde Redis.

### 2. Reanudación de Crawls
Si hay un crawl en progreso cuando se recarga la página:
- Se recupera el `jobId` y la URL del crawl
- Se continúa automáticamente con el polling
- El usuario no pierde el progreso del crawl

### 3. Guardado Automático con Debounce
El estado se guarda automáticamente cada vez que cambia, con un debounce de 500ms para evitar llamadas excesivas a la API.

### 4. Limpieza Automática
El estado se elimina automáticamente cuando:
- Se resetea el estado de generación
- Se aplica exitosamente la información a un negocio
- Se crea exitosamente un nuevo negocio
- Se completa o falla un crawl

### 5. TTL (Time To Live)
Los estados guardados expiran automáticamente después de 24 horas.

### 6. Seguridad
- Solo usuarios autenticados pueden acceder a su estado
- Cada usuario solo puede acceder a su propio estado
- La clave en Redis incluye el ID del usuario: `generation_state:{user_id}`

## Configuración Requerida

Asegúrate de tener las siguientes variables de entorno configuradas:

```env
UPSTASH_REDIS_REST_URL="https://YOUR_REDIS_ENDPOINT.upstash.io"
UPSTASH_REDIS_REST_TOKEN="YOUR_UPSTASH_TOKEN"
```

## Flujo de Datos

### Flujo Normal
```
1. Usuario carga /dashboard/generation
   ↓
2. Componente llama GET /api/generation-state
   ↓
3. API verifica autenticación y recupera estado de Redis
   ↓
4. Estado se restaura en el componente
   ↓
5. Usuario interactúa (busca, genera preview, etc.)
   ↓
6. Cambios se guardan automáticamente vía POST /api/generation-state
   ↓
7. Al completar o resetear, se llama DELETE /api/generation-state
```

### Flujo de Reanudación de Crawl
```
1. Usuario inicia crawl de URL
   ↓
2. Se obtiene jobId del servidor
   ↓
3. jobId y URL se guardan en Redis inmediatamente
   ↓
4. Comienza polling del estado del crawl
   ↓
5. [Usuario recarga la página]
   ↓
6. Al cargar, se detecta crawl en progreso
   ↓
7. Se reanuda automáticamente el polling con el jobId guardado
   ↓
8. Al completar, se limpia jobId y URL del estado
```

## Ventajas sobre sessionStorage

1. **Persistencia entre dispositivos**: El usuario puede continuar en otro dispositivo
2. **Persistencia entre sesiones**: El estado sobrevive al cerrar el navegador
3. **Seguridad**: El estado está en el servidor, no expuesto en el cliente
4. **Escalabilidad**: Redis maneja múltiples usuarios concurrentes eficientemente
5. **TTL automático**: Los estados antiguos se limpian automáticamente
6. **Reanudación de crawls**: Los crawls en progreso se pueden reanudar después de recargar

## Manejo de Errores

Si Redis no está disponible o falla:
- La carga inicial continúa sin estado guardado
- El guardado falla silenciosamente (se registra en consola)
- La aplicación sigue funcionando normalmente

## Testing

Para probar la funcionalidad:

### Test 1: Persistencia básica
1. Inicia una búsqueda en Google o ingresa una URL
2. Genera un preview
3. Selecciona bloques y un negocio
4. Recarga la página
5. Verifica que el estado se haya restaurado correctamente

### Test 2: Reanudación de crawl
1. Ingresa una URL para crawl
2. Haz clic en "Analizar URL"
3. Mientras el crawl está en progreso, recarga la página
4. Verifica que el crawl continúe automáticamente
5. Espera a que complete y verifica que el preview se genere

### Test 3: Verificación de Redis
```bash
# Verificar conexión a Redis
npx tsx scripts/test-redis-generation-state.ts
```

Puedes verificar los estados guardados en la consola de Upstash:
- Clave: `generation_state:{user_id}`
- TTL: 86400 segundos (24 horas)
