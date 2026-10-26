# Migración de Locavo a Cloudflare

## Infraestructura

El Worker **locavo** ejecuta vinext con el plugin oficial de Cloudflare para Vite. Los bindings `DB` (D1) y `GENERATION_STATE` (KV) se definen en `wrangler.jsonc`. NextAuth usa el adaptador D1 y sesiones JWT. Los permisos de acceso a los datos se aplican en `lib/db/query.ts`; D1 no ejecuta las antiguas políticas PostgreSQL RLS.

La carpeta `supabase/migrations` se conserva como historial del esquema anterior. No se aplica sobre D1. Las migraciones actuales están en `migrations` y se aplican con Wrangler.

## Preparación del entorno remoto

1. Selecciona la cuenta de Cloudflare correcta con `pnpm exec wrangler whoami`.
2. Crea recursos exclusivos de Locavo con `pnpm exec wrangler d1 create locavo` y `pnpm exec wrangler kv namespace create GENERATION_STATE`. Añade `database_id` e `id` de los recursos creados a sus bindings de `wrangler.jsonc`. El identificador de cuenta se puede especificar en esa configuración si hay varias cuentas.
3. Configura las variables públicas de `.env.example` antes de compilar. El dominio definitivo debe quedar en `NEXT_PUBLIC_SITE_URL`.
4. Añade los valores de `.dev.vars.example` al entorno remoto mediante `pnpm exec wrangler secret put NOMBRE`. `AUTH_SECRET` debe generarse para este entorno y conservarse entre despliegues. `APP_URL` y `AUTH_URL` deben usar el origen HTTPS definitivo. Incluye ese host en `PLATFORM_HOSTS`.
5. Configura el callback de Google `/api/auth/callback/google`, el remitente verificado de Resend y el webhook de Stripe `/api/stripe/webhook`.
6. Ejecuta `pnpm db:migrate:remote` contra la base Locavo verificada y después `pnpm deploy`. `.dev.vars` nunca sustituye los secretos remotos.

El despliegue de prueba puede usar un host `workers.dev` propio incluido explícitamente en `PLATFORM_HOSTS`. Los dominios de clientes requieren configurar Cloudflare for SaaS, el CNAME de destino y la zona antes de activar la función. Un nombre de marca no confirma la propiedad de un dominio.

## Traslado de datos

Para una instalación nueva, basta con aplicar el esquema. Si hay datos existentes, exporta las tablas con un respaldo privado, convierte los datos e impórtalos primero en un entorno de ensayo.

`scripts/prepare-d1-import.ts` convierte un archivo JSON privado con arrays `users`, `identities` y las tablas públicas en SQL para D1. La exportación de `auth.users` requiere acceso administrativo a PostgreSQL; el cliente público no puede obtener los hashes. Mantén el respaldo y el SQL generado en `private-migration/`, excluido de Git.

- Conserva los UUID de usuarios y negocios para mantener equipos, referencias y suscripciones Stripe.
- Incluye `id`, `email`, `encrypted_password`, `email_confirmed_at` y `raw_user_meta_data` de `auth.users`. Los hashes bcrypt se conservan hasta el siguiente acceso.
- Incluye `user_id`, `provider` e `identity_data` de `auth.identities` para conservar las cuentas Google (`sub`).
- Exporta las tablas públicas completas como arrays con sus nombres actuales. Los objetos JSON y arrays se serializan para SQLite; los booleanos se convierten en 0/1.
- Las sesiones existentes no se trasladan: los usuarios deben volver a iniciar sesión.
- El trigger de D1 crea perfiles nuevos; el importador combina después los perfiles históricos, conservando facturación y prueba gratuita.

```sh
pnpm exec tsx scripts/prepare-d1-import.ts private-migration/export.json private-migration/import.sql
pnpm exec wrangler d1 execute locavo --local --file private-migration/import.sql
```

Comprueba recuentos, propietarios, equipos, datos públicos y suscripciones en ensayo antes de ejecutar el import remoto equivalente con `--remote`. No se importa ni se modifica ninguna base remota automáticamente.

## Validación antes del cambio de tráfico

Comprueba registro, confirmación, Google OAuth, acceso y cierre de sesión, recuperación y revocación; verifica un propietario y un colaborador con permisos distintos. Confirma los datos importados y los dominios de cliente. Prueba Stripe en modo de prueba y confirma que los webhooks persisten el resultado en D1. Las comprobaciones locales no acreditan la entrega de correo, OAuth ni pagos de producción.

La compilación puede necesitar limitar los hilos de Rolldown en equipos con poca memoria. En ese caso, establece `RAYON_NUM_THREADS=2` para la invocación de compilación y ejecuta las comprobaciones de forma secuencial.

Conserva el respaldo y la infraestructura anterior durante el cambio. Volver al servicio anterior no revierte las escrituras realizadas en D1; un rollback de tráfico necesita reconciliación de datos.
