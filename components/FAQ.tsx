import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

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
      className="home-section border-t border-(--home-line)"
    >
      <div className="home-container grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
        <div>
          <h2 className="home-title">Preguntas frecuentes</h2>
          <p className="mt-6 max-w-xs text-lg text-(--home-muted)">
            Dar el salto es más fácil cuando sabes qué esperar.
          </p>
          <Link
            href="/crear-pagina-web-negocio"
            className="mt-8 inline-flex items-center gap-2 text-sm font-medium underline decoration-black/25 underline-offset-4 hover:decoration-black"
          >
            Pruébalo por ti mismo
            <ArrowUpRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
        <div className="border-t border-black/15">
          {questions.map(({ q, a }) => (
            <details key={q} className="border-b border-black/15">
              <summary className="cursor-pointer py-7 text-left text-lg font-medium tracking-[-0.01em] sm:text-xl">
                {q}
              </summary>
              <p className="max-w-2xl pb-7 text-base leading-relaxed text-(--home-muted)">
                {a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
