# Analisis del user flow y propuesta ideal para aumentar suscripciones

## 1) Resumen ejecutivo

Hoy el funnel mezcla tres intenciones distintas (`ver demo`, `crear cuenta`, `comprar plan`) en rutas y CTAs diferentes. Eso genera saltos de contexto, perdida de idioma y perdida de intencion (plan elegido, origen de campaña, etc.).

Objetivo recomendado: **un solo flujo principal orientado a conversion de pago**.

Secuencia ideal:
1. Landing segmentada por problema/sector.
2. Demo guiada (`/crear`) con output visible en < 60s.
3. Captura de cuenta en el momento de maxima motivacion (cuando quiere publicar).
4. Checkout directo al plan preseleccionado.
5. Activacion asistida post-pago (primer resultado en 24h).

## 2) Flujo actual detectado (codigo)

### Entrada
- Home: CTA principal en Hero va a `/crear` ([components/Hero.tsx](../components/Hero.tsx)).
- Pricing: CTA de cada plan va a `/signup?source=pricing&plan=...` ([components/Pricing.tsx](../components/Pricing.tsx)).
- Final CTA: va directo a `/signup` ([components/FinalCTA.tsx](../components/FinalCTA.tsx)).
- Navbar: CTA cambia segun pagina (`/crear`, demo, o signup con redirect) ([components/Navbar.tsx](../components/Navbar.tsx)).

### Conversion
- En `/crear`, boton "Publicar mi web ahora" lleva a `/{locale}/signup?redirect=/crear` ([app/[locale]/crear/page.tsx](../app/[locale]/crear/page.tsx)).
- Tras signup exitoso, redirige a `flow.destination` (por defecto `/crear`) ([app/[locale]/signup/page.tsx](../app/[locale]/signup/page.tsx)).
- No hay paso explicito de checkout en este tramo.

## 3) Fricciones que hoy frenan suscripciones

## P0 (impacto alto)

1. **Intencion de compra fragmentada**
- Un CTA promete demo, otro registro, otro prueba, otro publicar.
- El usuario no entiende "que pasa despues" y cae la conversion.

2. **Sin cierre de pago en el flujo principal**
- El funnel actual empuja a signup, pero no encadena de forma obligatoria a checkout/plan.
- Resultado: muchos "usuarios creados" y pocas suscripciones activas.

3. **Perdida de contexto tras registro**
- Desde `/crear`, signup vuelve a `/crear`; no se conserva el estado completo del negocio elegido.
- El usuario siente que "vuelve atras".

4. **El plan elegido en pricing no parece gobernar el siguiente paso**
- Se pasa `plan` por query, pero el flujo posterior no fuerza un checkout con ese plan.

## P1 (impacto medio)

5. **Inconsistencia de locale en enlaces absolutos**
- Hay links como `/crear` y `/signup` en varios componentes, pudiendo romper continuidad de idioma.

6. **Calidad tecnica en login**
- `signin/page.tsx` no muestra un `return` explicito antes del JSX, indicador de deuda/rotura potencial ([app/[locale]/signin/page.tsx](../app/[locale]/signin/page.tsx)).

7. **Naming de CTA no estandarizado**
- "Crear cuenta", "Probar demo", "Publicar", "Prueba 14 dias" conviven sin jerarquia clara por etapa.

## 4) Flujo ideal recomendado (orientado a suscripcion)

## North Star
**Una sola accion primaria por pantalla** y **una sola historia**: 
"Prueba -> valida valor -> activa plan".

## Flujo propuesto

1. **TOFU (captacion): Landing + sector**
- CTA primario siempre: `Probar demo gratis`.
- CTA secundario: `Ver precios`.
- Nada de "Crear cuenta" en primer scroll.

2. **MOFU (activacion de valor): /crear**
- Buscar negocio y generar preview.
- Mostrar "valor concreto" (texto, SEO, contactos, tiempo ahorrado).
- CTA primario: `Guardar y publicar`.

3. **Gate de registro (solo cuando hay valor creado)**
- Si pulsa `Guardar y publicar`, abrir signup con:
  - `redirect=/checkout`
  - `draftId`
  - `planSuggested`
  - UTMs/source
- Mensaje: "Tu web ya esta generada. Crea tu cuenta para no perderla".

4. **Checkout (paso obligatorio de monetizacion)**
- Pantalla unica con plan recomendado preseleccionado.
- Mostrar resumen de valor generado para su negocio + prueba de 14 dias.
- CTA: `Iniciar prueba de 14 dias` (con metodo de pago si aplica estrategia).

5. **Onboarding post-checkout (retencion temprana)**
- Checklist de 3 pasos max:
  1) Confirmar datos
  2) Conectar WhatsApp/telefono
  3) Publicar dominio
- Objetivo: primer resultado visible en < 24h.

## 5) Reglas de producto/UX para maximizar conversion

1. Definir CTA primario global unico por etapa:
- Landing: `Probar demo gratis`
- Demo completa: `Guardar y publicar`
- Checkout: `Iniciar prueba de 14 dias`

2. Conservar contexto extremo a extremo:
- `locale`, `source`, `utm_*`, `plan`, `draftId`, `sector`.

3. No devolver nunca al usuario a un estado "vacio" tras signup.

4. Evitar rutas ambiguas:
- `signup` no debe ser destino final del funnel, solo paso intermedio.

5. Reducir decision en pricing:
- 3 planes max visibles.
- 1 recomendado por defecto segun tamano/uso.

## 6) Instrumentacion minima (sin esto no se puede optimizar)

Eventos minimos:
- `landing_cta_click`
- `crear_search_submitted`
- `crear_preview_generated`
- `crear_publish_clicked`
- `signup_started`
- `signup_completed`
- `checkout_started`
- `checkout_completed`
- `onboarding_step_completed`

Embudo KPI:
1. Visitante -> Preview generado
2. Preview -> Signup completado
3. Signup -> Checkout iniciado
4. Checkout iniciado -> Suscripcion activa
5. Suscripcion activa -> Publicacion completada

## 7) Backlog recomendado (priorizado)

## Semana 1 (quick wins)
1. Unificar CTAs y naming por etapa.
2. Forzar `redirect=/checkout` al salir de signup desde flujo comercial.
3. Preservar `plan/source/utm/locale` en todo salto.
4. Reparar inconsistencias tecnicas de signin.

## Semana 2
1. Crear pantalla de checkout integrada con plan preseleccionado.
2. Persistir `draftId` de `/crear` para no perder trabajo.
3. Añadir eventos de embudo.

## Semana 3-4
1. Onboarding post-pago con checklist orientado a "tiempo a valor".
2. Experimentos A/B en copy de CTA y orden de planes.

## 8) Resultado esperado

Si se aplica este rediseño de flujo, deberias ver mejora en:
- tasa `preview -> signup`
- tasa `signup -> suscripcion activa`
- tiempo medio hasta publicacion

La clave no es "mas trafico", sino **menos friccion entre valor percibido y momento de pago**.
