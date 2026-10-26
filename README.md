# Locavo

Creación y gestión de webs para negocios locales con React, las APIs de Next.js sobre vinext y Cloudflare Workers. NextAuth gestiona las sesiones y los proveedores de acceso; D1 almacena los datos y Workers KV conserva los borradores temporales.

## Desarrollo

1. Instala las dependencias con `pnpm install`.
2. Copia `.env.example` a `.env.local` para las variables públicas de compilación y `.dev.vars.example` a `.dev.vars` para los secretos del servidor. Genera un `AUTH_SECRET` aleatorio y configura las integraciones necesarias.
3. Ejecuta `pnpm db:migrate:local` y `pnpm cf:typegen`.
4. Ejecuta `pnpm dev` y abre `http://localhost:3000`.

El desarrollo y `pnpm start` (vista previa de una compilación) ejecutan el servidor en workerd. D1 y KV se simulan localmente en `.wrangler/state`. Las credenciales locales anteriores no se reutilizan automáticamente.

## Autenticación y servicios

El registro por correo exige confirmar la dirección. Las contraseñas se guardan con PBKDF2 mediante Web Crypto; los hashes bcrypt importados se verifican y actualizan al iniciar sesión. Los enlaces de confirmación y recuperación caducan en una hora, se almacenan como hashes y se consumen una sola vez. El cambio de contraseña revoca las sesiones anteriores.

Google OAuth requiere `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET` y la URL autorizada `https://TU_HOST/api/auth/callback/google`. Resend requiere un remitente verificado para enviar confirmaciones y recuperaciones. Google Places, Firecrawl y Gemini conservan sus integraciones. Stripe conserva pagos y webhooks; su firma se verifica de forma asíncrona compatible con Workers.

Las consultas D1 aplican los permisos en el servidor, incluyendo propietario, equipo activo y aislamiento de los datos privados. Los límites de peticiones usan incrementos atómicos en D1. KV se reserva para estado temporal y tiene consistencia eventual.

## Comprobaciones

```sh
pnpm typecheck
pnpm exec tsx scripts/check-auth-redirects.ts
pnpm exec tsx scripts/check-backoffice.ts
pnpm exec tsx scripts/check-cloudflare.ts
pnpm lint
pnpm build
pnpm exec wrangler deploy --dry-run
```

`scripts/check-cloudflare.ts` usa exclusivamente D1 local y usuarios sintéticos. Para comprobar también el inicio de sesión, las APIs protegidas y KV contra el Worker local, establece `TEST_BASE_URL` con la URL de `pnpm dev` o `pnpm start`. La prueba elimina los usuarios y datos que crea y no envía correos ni cobra pagos.

Con el servidor de desarrollo abierto, `python scripts/check-worker-http.py http://127.0.0.1:3000` comprueba el mismo recorrido HTTP mediante la API local de Cloudflare, sin iniciar otro workerd. Solo admite un servidor local y limpia los usuarios y negocios sintéticos al terminar.

## Despliegue y datos existentes

Consulta [la guía de migración](docs/cloudflare-migration.md) antes del primer despliegue. `wrangler.jsonc` usa el nombre **locavo**. Deben configurarse sus propios recursos, secretos y dominio. Las migraciones locales no trasladan los usuarios ni los datos de producción.

## Experiencia pública

- `/`: portada, ejemplos por sector, planes y preguntas frecuentes.
- `/crear-pagina-web-negocio?q=...`: creador con búsqueda precargada y confirmación antes de llamar a Google.
- `/ejemplos/restaurante`, `/ejemplos/peluqueria`, `/ejemplos/clinica`: muestras ficticias sin indexación.
- `/signup?plan=pro&billing=yearly`: registro que conserva el plan, la modalidad y el destino.
- `/dashboard`: negocios y herramientas de gestión.

Los estilos viven en `app/globals.css`, los componentes de portada en `components/landing` y los precios compartidos en `lib/content.ts`. Las fotografías de los ejemplos se sirven desde `public/images`.
