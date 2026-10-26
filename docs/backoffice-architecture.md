# Arquitectura del backoffice

## Capas y límites

Las páginas de `app/dashboard` componen la interfaz y llaman a consultas del servidor. `lib/backoffice/session.ts` verifica la identidad con NextAuth y D1 y comparte el resultado durante una petición mediante `React.cache`. `access.ts` obtiene el negocio y comprueba propietario o pertenencia activa antes de permitir una operación. Cada consulta y cada acción verifica su acceso: el layout y la navegación no son controles de seguridad suficientes.

`policy.ts` define las capacidades. `queries.ts` agrupa lecturas y reutiliza consultas en el layout, la cabecera y las páginas. `actions/` contiene las mutaciones de servicios, horarios, calendario, publicación, ajustes y retirada de accesos. `schemas.ts` valida los datos recibidos en el servidor, aunque ya se hayan validado en un formulario. `revalidate.ts` actualiza el panel, el listado y las páginas públicas tras guardar.

Los módulos de sesión, consultas y acceso llevan `server-only`. Los tipos, la política, el estado de configuración y los selectores del directorio son funciones puras que pueden utilizarse en la interfaz y en pruebas. No se usa caché global de usuarios, permisos ni datos privados.

## Permisos actuales

- El propietario se obtiene de `businesses.user_id`. Una fila de equipo con rol `owner` no concede propiedad.
- Solo una pertenencia activa de la misma persona y el mismo negocio permite leer el espacio compartido.
- El propietario modifica contenido, ajustes, dominios y accesos. Los predicados de D1 conservan los permisos de escritura anteriores.
- Los administradores y editores activos pueden crear eventos del calendario. Los lectores no pueden hacerlo.
- Los contactos de clientes se reservan al propietario. La navegación los oculta para colaboradores, la consulta los rechaza y la analítica compartida muestra un dato no disponible en lugar de un cero ficticio.
- La interfaz de lectura deshabilita formularios; los permisos se vuelven a comprobar al ejecutar la acción. Ocultar botones no sustituye ese control.

Cambiar las capacidades de los roles requiere actualizar juntos `policy.ts`, los predicados de `lib/db/query.ts` y las pruebas. No se han ampliado permisos de escritura de contenido a colaboradores.

## Datos e interfaz

El selector del espacio y el listado usan la misma consulta de negocios propios y compartidos. El resumen de listado selecciona columnas concretas y evita transferir los datos originales de Google. La cabecera y el resumen del negocio se renderizan en el servidor: ya no hay un `BusinessProvider` que serialice todas las secciones al navegador. Los formularios reciben únicamente los campos necesarios.

El directorio filtra nombres sin distinguir acentos, categoría y dominio, permite ver dominios que requieren revisión y negocios compartidos, y ordena sin mutar los datos originales. La búsqueda rápida permite navegar con Ctrl/⌘ K y flechas. `navigation.ts` comparte las rutas de secciones y sus capacidades entre pestañas y buscador.

Los errores de datos no se convierten en listas vacías. Las consultas lanzan un error controlado y los límites de error del panel o de la aplicación ofrecen reintentar. Los errores de mutación devuelven `{ error }` y los éxitos `{ success: true }`; los detalles de base de datos no se muestran al usuario. Las operaciones de borrado y actualización comprueban que se haya modificado una fila.

La analítica cuenta eventos `page_view` y `click`, y contactos reales de `leads`, durante siete días UTC. Usa consultas de recuento exacto; no descarga eventos personales ni depende del límite de filas por respuesta. Sin eventos, muestra cero y un estado vacío. No estima visitantes únicos, duración ni rebote porque el modelo de eventos actual no los acredita. La recogida de eventos debe estar conectada en cada web para que existan registros.

## Compatibilidad y trabajo restante

`lib/db/actions.ts` conserva las firmas de las operaciones de negocio. Las páginas y formularios importan las consultas o acciones de su módulo directamente. Las acciones de autenticación están en `lib/auth/actions.ts` y usan NextAuth. Las operaciones de datos usan un cliente D1 por petición, con predicados de acceso y consultas parametrizadas.

`migrations/0001_cloudflare.sql` crea el esquema SQLite de D1, las tablas de NextAuth y los índices. El acceso al binding D1 queda limitado al servidor. Las migraciones PostgreSQL anteriores se conservan como historial en `supabase/migrations`; no se ejecutan sobre D1. Los datos públicos de negocio, servicios y horarios mantienen su lectura pública necesaria para las webs.

## Verificación

```sh
pnpm exec tsx scripts/check-backoffice.ts
pnpm exec tsx scripts/check-auth-redirects.ts
pnpm exec tsx scripts/check-cloudflare.ts
pnpm exec tsc --noEmit
pnpm lint
pnpm build
```

Las pruebas de TypeScript cubren pertenencias pendientes/inactivas, roles falsificados, capacidades, datos inválidos, búsqueda, ordenación, estado de configuración y errores. La prueba de Cloudflare ejecuta consultas contra D1 local: aislamiento entre negocios, permisos de escritura, campos protegidos, upserts, JSON, rollback e importación. Las antiguas pruebas SQL se conservan solo para el esquema PostgreSQL histórico. Ninguna prueba aplica migraciones a una base remota.
