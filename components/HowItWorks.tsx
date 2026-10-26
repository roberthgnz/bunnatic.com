import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

const steps = [
  {
    title: 'Dinos quién eres',
    text: 'Busca tu negocio en Google o comparte tu web actual. Recogemos la información para empezar.',
  },
  {
    title: 'Déjaselo a la IA',
    text: 'Creamos una propuesta con tus textos, servicios y estilo. Revísala y hazla tuya.',
  },
  {
    title: 'Crea tu cuenta y personaliza',
    text: 'Prueba cualquier plan gratis durante 14 días y ajusta servicios, horarios y equipo desde tu panel.',
  },
  {
    title: 'Abre tu puerta digital',
    text: 'Conecta tu dominio y publica cuando lo tengas todo listo. Tus clientes ya pueden encontrarte.',
  },
]

export default function HowItWorks() {
  return (
    <section id="como-funciona" className="home-section bg-(--home-soft)">
      <div className="home-container grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-24">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <p className="home-eyebrow">De tu idea a tu web</p>
          <h2 className="home-title">Cómo crear la web de tu negocio</h2>
          <p className="mt-6 max-w-sm text-lg text-(--home-muted)">
            No necesitas más tiempo libre. Necesitas una forma más fácil.
          </p>
          <Link href="/crear-pagina-web-negocio" className="home-button mt-10">
            Vamos con el primer paso
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
        <ol>
          {steps.map(({ title, text }, index) => (
            <li
              key={title}
              className="grid grid-cols-[3.5rem_1fr] gap-4 border-t border-black/15 py-10 first:border-t-0 first:pt-0 sm:grid-cols-[5rem_1fr] lg:first:border-t lg:first:pt-10"
            >
              <span className="text-lg font-medium text-black/35 tabular-nums">
                {String(index + 1).padStart(2, '0')}
              </span>
              <div>
                <h3 className="text-2xl font-medium tracking-[-0.03em] sm:text-3xl">
                  {title}
                </h3>
                <p className="mt-3 max-w-lg text-base leading-relaxed text-(--home-muted)">
                  {text}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
