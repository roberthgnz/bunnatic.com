# Locavo: contenido y verificación editorial

Fecha de preparación: 27 de octubre de 2026. Mercado e idioma asumidos: pequeños negocios en España, español. El diagnóstico previo y el mapa de intenciones están en `seo-audit-2026-10-27.json`. Se reutiliza la estructura de guías, artículos relacionados y enlaces comerciales de spicy-chat-platform; no sus textos, testimonios ni cifras sin fuentes. No se ha modificado ese proyecto.

## Paquete editorial

La fuente de contenido, H1, title, descripción, fechas y enlaces es `lib/blog.ts`. Cada URL resuelve una intención distinta:

| URL                                  | Pregunta                                 | Conversión                                  | Diferenciación práctica                                                   |
| ------------------------------------ | ---------------------------------------- | ------------------------------------------- | ------------------------------------------------------------------------- |
| `/blog/como-crear-web-negocio-local` | ¿Qué preparar y revisar para publicar?   | Ver sectores y herramienta                  | Lista de pruebas de contacto, materiales y responsabilidades              |
| `/blog/seo-local-para-negocios`      | ¿Qué revisar en web y Perfil de Empresa? | Consultar característica SEO y guía inicial | Separar acceso, indexación, visibilidad y solicitudes                     |
| `/blog/web-o-redes-sociales-negocio` | ¿Qué función debe cumplir cada canal?    | Planificar web y explorar sectores          | Comparación de información estable, novedades y esfuerzo de mantenimiento |

Demanda: hipótesis por encaje con el producto; no se han obtenido volúmenes, dificultad ni consultas de Search Console. El contenido está atribuido a la marca real Locavo como Organization, con alcance explicado en `/sobre-locavo`; no se inventa un autor personal ni un equipo acreditado.

## Registro de evidencia

| ID  | Afirmación                                                     | Fuente                                                                                                      | Fecha y población                                                                                                                           | Estado/uso                                                                        |
| --- | -------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| E01 | 36,2 % con web; 32,1 % con medios sociales                     | [INE](https://ine.es/dyngs/Prensa/ETICCE20251T2026.htm)                                                     | Publicada 22-10-2026, consultada 27-10-2026; empresas de menos de diez empleados con Internet, sectores cubiertos, primer trimestre de 2026 | Verificado; contexto, sin inferir ventas, exclusividad de categorías o causalidad |
| E02 | Relevancia, distancia y prominencia; no comprar posición local | [Google Business](https://support.google.com/business/answer/7091?hl=es)                                    | Consultada 27-10-2026                                                                                                                       | Verificado; guía SEO local, enlace junto a afirmación                             |
| E03 | Canonical y fechas de cambios significativos en sitemap        | [Google Search Central](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap) | Consultada 27-10-2026                                                                                                                       | Verificado; implementación técnica, no garantía de indexación                     |
| E04 | Funciones y dependencias de Locavo                             | `app/dashboard`, `lib/db`, `lib/auth`, `wrangler.jsonc`                                                     | Código local y despliegue revisados 27-10-2026                                                                                              | Hechos del proyecto; integraciones externas todavía necesitan configuración       |

## Investigación original pendiente (no es contenido público)

- [DATO ORIGINAL PENDIENTE D01] Tiempo de creación: medir inicio/fin, mediana, muestra, errores y periodo con usuarios que autoricen el estudio. Responsable recomendado: producto. No se publica una duración garantizada.
- [DATO ORIGINAL PENDIENTE D02] Caso de negocio real: recoger situación inicial, cambios, consultas atendidas, atribución, periodo y permiso de publicación. Responsable recomendado: producto/comercial. No se publican reseñas ni resultados simulados.
- [DATO ORIGINAL PENDIENTE D03] Preguntas reales: contrastar prioridades con consultas de Search Console y soporte cuando existan datos. Responsable recomendado: propietario.

Estos datos enriquecerían las piezas, pero no sostienen ninguna afirmación actual. No se han inventado resultados para llenar los huecos.

## Checklist humana pendiente

La revisión técnica automatizada no sustituye estas comprobaciones editoriales. No se marcan como realizadas por haber generado el texto.

- Guía de creación: validar con el propietario que el recorrido de edición descrito coincide con las funciones habilitadas y probarlo con un negocio autorizado.
- Guía SEO: contrastar las dudas prioritarias con consultas reales cuando exista una propiedad verificada; no interpretar la revisión técnica como mejora ya observada del ranking.
- Comparación de canales: validar ejemplos con un negocio real y revisar responsabilidades de mantenimiento.
- Todas: revisar tono, exactitud comercial y enlaces externos antes de cada actualización sustantiva; conservar el denominador de las cifras del INE y su fecha.
- Autoría: el propietario debe validar la firma de marca y el criterio editorial; no añadir biografías personales sin datos confirmados.

## Medición pendiente

No hay datos verificados de Search Console, conversiones ni citas en asistentes. Tras verificar la propiedad, registrar páginas indexadas, consultas, impresiones, clics y solicitudes con periodos comparables. Revisar la elección del dominio definitivo antes de una estrategia de enlaces externos; el dominio actual conocido y autorizado es `locavo.reliutg.workers.dev`. No se han creado perfiles externos, enviado sitemaps a cuentas ajenas ni cambiado preferencias de entrenamiento de IA.

## Verificación de implementación y despliegue

- Worker publicado: `locavo`, versión `09ae8f41-d024-4182-b710-fb4646c462dc`, 27-10-2026.
- TypeScript, lint de los archivos cambiados y compilación de producción completados sin errores.
- `pnpm check:seo https://locavo.reliutg.workers.dev`: pasa para las 29 URLs indexables del sitemap, tres guías completas, diez redirecciones de sectores, canonical, títulos, JSON-LD, respuestas FAQ en HTML, rutas privadas y nueva imagen social.
- El creador entrega el formulario y encabezado desde el servidor. La prueba comprueba que conserva la búsqueda y que `/crear` redirige manteniendo los parámetros.
- Las páginas legales conservan su noindex previo y quedan fuera del sitemap; el footer sigue enlazándolas.
- `node scripts/check-deployment.mjs`: pasa en producción para home, acceso, registro, sesión de invitado, CSRF/cookies, protección de perfil/dashboard y CSS. Google OAuth sigue sin configurar, como antes de este cambio.
- Inspección DOM de una guía y del formulario completada. Captura visual no completada: el preview devolvió dos veces `Preview automation snapshot timed out after 15000ms`; el navegador alternativo devolvió `Browser is not available: iab`. No se afirma una revisión visual completa ni una prueba móvil.
- Estas comprobaciones demuestran el comportamiento del despliegue; no demuestran indexación, posiciones o crecimiento de tráfico.
