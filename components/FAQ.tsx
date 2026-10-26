'use client'

import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

const questions = [
  {
    q: '¿Necesito saber de diseño o programación?',
    a: 'No. Busca tu negocio en Google o introduce tu web actual y revisa la propuesta. La IA prepara el contenido y el diseño; después puedes gestionar tus datos, servicios y horarios desde el panel.',
  },
  {
    q: '¿Qué puedo probar gratis?',
    a: 'Puedes explorar los ejemplos y generar una vista previa sin tarjeta. Al crear tu cuenta, tienes 14 días de prueba del plan elegido para configurar tu negocio y conocer las herramientas.',
  },
  {
    q: '¿Puedo usar mi propio dominio?',
    a: 'Sí. Puedes conectar tu dominio desde la configuración del negocio. El panel te guía para añadir los registros necesarios y comprobar que la conexión está lista.',
  },
  {
    q: '¿Mi web aparecerá en Google?',
    a: 'Tu web incluye una estructura preparada para SEO y contenido de tu negocio. La indexación y la posición final dependen de Google y de otros factores; no podemos garantizar una posición concreta.',
  },
  {
    q: '¿Puedo cambiar los textos y los servicios?',
    a: 'Sí. Puedes actualizar el contenido, los servicios, el equipo y los horarios desde tu panel. También dispones de generación asistida con IA según los límites de tu plan.',
  },
  {
    q: '¿Hay permanencia?',
    a: 'No hay permanencia. Puedes cancelar la renovación de tu suscripción. Si eliges facturación anual, el importe indicado se factura por año; en la modalidad mensual se factura cada mes.',
  },
]

export default function FAQ() {
  return (
    <section
      id="preguntas"
      className="landing-section border-t border-[#e5e8dc] bg-white"
    >
      <div className="landing-container grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
        <div>
          <p className="landing-eyebrow">Todo claro, desde el principio</p>
          <h2 className="landing-title">
            Pequeñas dudas.
            <br />
            <span className="landing-serif">Respuestas claras.</span>
          </h2>
          <p className="mt-5 max-w-xs text-sm leading-7 text-[#818772]">
            Dar el salto es más fácil cuando sabes qué esperar.
          </p>
          <Link
            href="/crear-pagina-web-negocio"
            className="mt-7 inline-flex items-center gap-2 rounded text-xs font-semibold text-[#536d42]"
          >
            Pruébalo por ti mismo
            <ArrowUpRight className="size-3.5" aria-hidden="true" />
          </Link>
        </div>
        <Accordion type="single" collapsible>
          {questions.map(({ q, a }, index) => (
            <AccordionItem
              key={q}
              value={`question-${index}`}
              className="border-[#e3e7d8]"
            >
              <AccordionTrigger className="py-5 text-left text-sm font-medium text-[#3f5034] hover:no-underline">
                {q}
              </AccordionTrigger>
              <AccordionContent className="pb-5 text-sm leading-7 text-[#7c8370]">
                {a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
