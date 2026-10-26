# Bunnatic

Creación y gestión de webs para negocios locales con Next.js, React, Supabase y generación asistida por IA.

## Desarrollo

1. Instala las dependencias con `pnpm install`.
2. Copia `.env.example` a `.env.local` y configura las integraciones que vayas a utilizar.
3. Ejecuta `pnpm dev` y abre `http://localhost:3000`.

Supabase proporciona autenticación y datos. Google Places permite buscar negocios; Firecrawl analiza webs existentes y Gemini genera contenido. Los límites de la demo usan Upstash Redis. Stripe, Resend y Cloudflare requieren sus propias variables para pagos, correo y dominios personalizados. Consulta `.env.example` para los nombres exactos; no guardes credenciales en el repositorio.

## Experiencia pública

- `/`: portada con búsqueda de negocio, vista previa interactiva por sector, ejemplos, planes y preguntas frecuentes.
- `/crear-pagina-web-negocio?q=...`: creador con la búsqueda precargada desde la portada. La consulta requiere una confirmación del usuario antes de llamar a Google.
- `/ejemplos/restaurante`, `/ejemplos/peluqueria`, `/ejemplos/clinica`: diseños de negocios ficticios, navegables y sin indexación. El contenido común se define en `lib/siteExamples.ts`.
- `/signup?plan=pro&billing=yearly`: registro que conserva el contexto del plan y la modalidad hasta la configuración inicial. No inicia un cobro.
- `/dashboard`: gestión de negocios y sus herramientas.

Los estilos de la portada viven en `app/globals.css`, con componentes en `components/landing`. Los precios se comparten con el panel a través de `lib/content.ts`.

## Comprobaciones

```sh
pnpm exec tsc --noEmit
pnpm exec tsx scripts/check-auth-redirects.ts
pnpm lint
pnpm build
pnpm start
```

Al revisar el recorrido público, comprueba el cambio de sector y dispositivo, los enlaces a ejemplos, el traspaso del nombre al creador y la modalidad mensual/anual hasta el registro. Verifica también el menú móvil, la ausencia de desbordamiento desde 320 px y los estados de error de búsqueda.

El registro por correo transmite el destino a Supabase y la confirmación conserva sus parámetros. Las pruebas de redirección comprueban el contexto del plan y del borrador, y rechazan destinos externos o malformados. No envían correos. Para probar la entrega real, configura también la lista de destinos autorizados en Supabase para tu dominio.

La demo necesita una conexión de Redis operativa para aplicar sus límites. El comportamiento existente permite continuar las consultas si Redis falla; revisa esa conexión antes de habilitar una demo pública.

## Fotografías de los ejemplos

Las fotografías se sirven localmente desde `public/images` y se optimizan con `next/image`. Proceden de Unsplash: [restaurante](https://images.unsplash.com/photo-1555396273-367ea4eb4db5), [peluquería](https://images.unsplash.com/photo-1600948836101-f9ffda59d250) y [clínica](https://images.unsplash.com/photo-1629909613654-28e377c37b09). Los negocios y los textos de las muestras son ficticios.
