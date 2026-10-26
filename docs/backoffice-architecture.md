# Arquitectura del backoffice

## Capas y límites

Las páginas de `app/dashboard` componen la interfaz y llaman a consultas del servidor. `lib/backoffice/session.ts` verifica la identidad con Supabase y comparte el resultado durante una petición mediante `React.cache`. `access.ts` obtiene el negocio y comprueba propietario o pertenencia activa antes de permitir una operación. Cada consulta y cada acción verifica su acceso: el layout y la navegación no son controles de seguridad suficientes.

`policy.ts` define las capacidades. `queries.ts` agrupa lecturas y reutiliza consultas en el layout, la cabecera y las páginas. `actions/` contiene las mutaciones de servicios, horarios, calendario, publicación, ajustes y retirada de accesos. `schemas.ts` valida los datos recibidos en el servidor, aunque ya se hayan validado en un formulario. `revalidate.ts` actualiza el panel, el listado y las páginas públicas tras guardar.

Los módulos de sesión, consultas y acceso llevan `server-only`. Los tipos, la política, el estado de configuración y los selectores del directorio son funciones puras que pueden utilizarse en la interfaz y en pruebas. No se usa caché global de usuarios, permisos ni datos privados.

## Permisos actuales

- El propietario se obtiene de `businesses.user_id`. Una fila de equipo con rol `owner` no concede propiedad.
- Solo una pertenencia activa de la misma persona y el mismo negocio permite leer el espacio compartido.
- El propietario modifica contenido, ajustes, dominios y accesos. Se conserva la política de escritura existente en Supabase.
- Los administradores y editores activos pueden crear eventos del calendario. Los lectores no pueden hacerlo.
- Los contactos de clientes se reservan al propietario. La navegación los oculta para colaboradores, la consulta los rechaza y la analítica compartida muestra un dato no disponible en lugar de un cero ficticio.
- La interfaz de lectura deshabilita formularios; los permisos se vuelven a comprobar al ejecutar la acción. Ocultar botones no sustituye ese control.

Cambiar las capacidades de los roles requiere actualizar juntos `policy.ts`, las políticas SQL y las pruebas. No se han ampliado permisos de escritura de contenido a colaboradores.

## Datos e interfaz

El selector del espacio y el listado usan la misma consulta de negocios propios y compartidos. El resumen de listado selecciona columnas concretas y evita transferir los datos originales de Google. La cabecera y el resumen del negocio se renderizan en el servidor: ya no hay un `BusinessProvider` que serialice todas las secciones al navegador. Los formularios reciben únicamente los campos necesarios.

El directorio filtra nombres sin distinguir acentos, categoría y dominio, permite ver dominios que requieren revisión y negocios compartidos, y ordena sin mutar los datos originales. La búsqueda rápida permite navegar con Ctrl/⌘ K y flechas. `navigation.ts` comparte las rutas de secciones y sus capacidades entre pestañas y buscador.

Los errores de datos no se convierten en listas vacías. Las consultas lanzan un error controlado y los límites de error del panel o de la aplicación ofrecen reintentar. Los errores de mutación devuelven `{ error }` y los éxitos `{ success: true }`; los detalles de base de datos no se muestran al usuario. Las operaciones de borrado y actualización comprueban que se haya modificado una fila.

La analítica cuenta eventos `page_view` y `click`, y contactos reales de `leads`, durante siete días UTC. Usa consultas de recuento exacto; no descarga eventos personales ni depende del límite de filas por respuesta. Sin eventos, muestra cero y un estado vacío. No estima visitantes únicos, duración ni rebote porque el modelo de eventos actual no los acredita. La recogida de eventos debe estar conectada en cada web para que existan registros.

## Compatibilidad y trabajo restante

`lib/supabase/actions.ts` mantiene las firmas anteriores como fachada para consumidores existentes. Las páginas y formularios migrados importan las consultas o acciones de su módulo directamente. La generación IA, el aprovisionamiento de dominios, las altas de negocio y parte de la gestión de equipo conservan sus implementaciones anteriores; las escrituras heredadas de contenido reciben ahora el control de acceso común. Esta separación permite migrarlas por dominio sin mezclar cambios de Stripe, Cloudflare o cuotas en este refactor.

La migración `20261026_harden_backoffice_permissions.sql` alinea las políticas de acceso directo de Supabase: restringe borradores públicos, excluye equipos inactivos y evita que lectores escriban en el calendario. Está preparada para revisión y **no se aplica automáticamente a una base de datos remota**. Hasta aplicarla, las comprobaciones del servidor están activas, pero las políticas antiguas de acceso directo siguen existiendo. Los datos públicos de negocio, servicios y horarios mantienen su lectura pública necesaria para las webs.

## Verificación

```sh
pnpm exec tsx scripts/check-backoffice.ts
pnpm exec tsx scripts/check-auth-redirects.ts
python scripts/check-backoffice-rls.py
pnpm exec tsc --noEmit
pnpm lint
pnpm build
```

Las pruebas de TypeScript cubren aislamiento entre negocios, pertenencias pendientes/inactivas, roles falsificados, capacidades, datos inválidos, búsqueda, ordenación, estado de configuración y mensajes de error. La prueba SQL crea una instancia temporal de PostgreSQL en loopback, aplica las migraciones base y el endurecimiento, y comprueba acceso anónimo, de propietario, editor, lector y miembros pendientes/inactivos. Después detiene la instancia y elimina sus datos. Requiere binarios locales de PostgreSQL; se puede indicar su ubicación con `--pg-bin`. Ninguna de estas pruebas se conecta a Supabase ni aplica migraciones a una base de datos remota.
