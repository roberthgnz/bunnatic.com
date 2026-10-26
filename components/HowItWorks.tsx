import {
  ArrowRight,
  Check,
  Globe2,
  MapPin,
  Search,
  Sparkles,
} from 'lucide-react'
import Link from 'next/link'

const steps = [
  {
    number: '01',
    title: 'Dinos quién eres.',
    text: 'Busca tu negocio en Google o comparte tu web actual. Recogemos la información para empezar.',
    icon: Search,
  },
  {
    number: '02',
    title: 'Déjaselo a la IA.',
    text: 'Creamos una propuesta con tus textos, servicios y estilo. Revísala y hazla tuya.',
    icon: Sparkles,
  },
  {
    number: '03',
    title: 'Abre tu puerta digital.',
    text: 'Crea tu cuenta, termina de configurar tu negocio y publica cuando lo tengas todo listo.',
    icon: Globe2,
  },
]

export default function HowItWorks() {
  return (
    <section id="como-funciona" className="landing-section bg-[#fcfcf7]">
      <div className="landing-container">
        <div className="text-center">
          <p className="landing-eyebrow">De tu idea a tu web</p>
          <h2 className="landing-title">
            Tres pasos.<span className="landing-serif"> Cero líos.</span>
          </h2>
          <p className="mt-4 text-sm text-[#7b8271]">
            No necesitas más tiempo libre. Necesitas una forma más fácil.
          </p>
        </div>
        <div className="mt-12 grid gap-8 md:grid-cols-3 md:gap-10">
          {steps.map(({ number, title, text, icon: Icon }, index) => (
            <article key={number} className="relative">
              <div className="mb-6 flex items-center justify-between border-b border-[#dfe3d5] pb-5">
                <span className="font-serif text-4xl text-[#9aa989]">
                  {number}
                </span>
                <Icon
                  className="size-5 text-[#7c8d6c]"
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
              </div>
              <h3 className="text-lg font-semibold tracking-tight text-[#34472d]">
                {title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-[#7b8271]">{text}</p>
              <div className="mt-6 flex min-h-14 items-center gap-3 rounded-xl border border-[#e3e6da] bg-white p-3 text-[11px] text-[#728263]">
                {index === 0 ? (
                  <>
                    <MapPin className="size-4 shrink-0" aria-hidden="true" />
                    <span>Tu negocio, tu ciudad, tu historia.</span>
                  </>
                ) : index === 1 ? (
                  <>
                    <Sparkles className="size-4 shrink-0" aria-hidden="true" />
                    <span>Una propuesta pensada para ti.</span>
                  </>
                ) : (
                  <>
                    <Check className="size-4 shrink-0" aria-hidden="true" />
                    <span>Tu web, lista para salir al mundo.</span>
                  </>
                )}
              </div>
            </article>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link href="/crear-pagina-web-negocio" className="landing-button">
            Vamos con el primer paso
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  )
}
