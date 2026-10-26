import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowRight, ArrowUpRight, Leaf, MapPin } from 'lucide-react'
import { getSiteExample, siteExamples } from '@/lib/siteExamples'

type Props = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return siteExamples.map(({ slug }) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const example = getSiteExample((await params).slug)
  return {
    title: example
      ? `${example.name} · Web de ejemplo`
      : 'Ejemplo no encontrado',
    robots: { index: false, follow: true },
  }
}

export default async function ExamplePage({ params }: Props) {
  const example = getSiteExample((await params).slug)
  if (!example) notFound()
  const createHref = `/crear-pagina-web-negocio?sector=${encodeURIComponent(example.sector)}&source=ejemplo-${example.slug}`

  return (
    <div
      className="example-page min-h-screen"
      style={{ background: example.surface, color: example.color }}
    >
      <div className="sticky top-0 z-40 flex flex-wrap items-center justify-between gap-3 border-b border-black/10 bg-white px-5 py-3 text-black sm:px-8">
        <Link
          href="/#ejemplos"
          className="inline-flex items-center gap-2 rounded text-sm"
        >
          <ArrowLeft className="size-3.5" aria-hidden="true" />
          Volver a Locavo
        </Link>
        <p className="hidden text-xs text-black/55 sm:block">
          Ejemplo de diseño · Negocio ficticio
        </p>
        <Link
          href={createHref}
          className="landing-button min-h-10! px-5! py-2! text-sm!"
        >
          Crear la web de mi negocio
          <ArrowUpRight className="size-3.5" aria-hidden="true" />
        </Link>
      </div>
      <header className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-6 sm:px-10">
        <Link
          href={`/ejemplos/${example.slug}`}
          className="flex items-center gap-2 rounded font-serif text-2xl"
        >
          <Leaf className="size-5" aria-hidden="true" />
          {example.name}
        </Link>
        <nav aria-label="Secciones del ejemplo" className="flex gap-5 text-xs">
          <Link href="#nosotros" className="rounded hover:underline">
            Nosotros
          </Link>
          <Link href="#servicios" className="rounded hover:underline">
            Servicios
          </Link>
        </nav>
      </header>
      <main>
        <section className="relative isolate overflow-hidden">
          <Image
            src={example.image}
            alt={example.imageAlt}
            fill
            priority
            sizes="100vw"
            className="-z-20 object-cover"
          />
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/75 to-black/15" />
          <div className="mx-auto max-w-6xl px-6 py-24 text-white sm:px-10 sm:py-36">
            <p className="mb-6 flex items-center gap-2 text-xs tracking-widest uppercase">
              <MapPin className="size-3.5" aria-hidden="true" />
              {example.location} · {example.category}
            </p>
            <h1 className="max-w-3xl font-serif text-5xl leading-[1.05] tracking-tight whitespace-pre-line sm:text-7xl lg:text-8xl">
              {example.tagline}
            </h1>
            <p className="mt-7 max-w-md text-base leading-7 text-white/85">
              {example.description}
            </p>
            <Link
              href="#servicios"
              className="mt-9 inline-flex items-center gap-6 rounded-full bg-white px-6 py-3.5 text-sm font-medium"
              style={{ color: example.color }}
            >
              Conócenos
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </section>
        <section
          id="nosotros"
          className="mx-auto grid max-w-6xl scroll-mt-24 gap-8 px-6 py-20 sm:px-10 md:grid-cols-2 md:items-center"
        >
          <div>
            <p className="text-xs tracking-[.2em] uppercase opacity-60">
              El valor de lo cercano
            </p>
            <h2 className="mt-4 font-serif text-4xl leading-tight sm:text-5xl">
              Hecho con calma.
              <br />
              <span className="italic">Pensado para ti.</span>
            </h2>
          </div>
          <p className="max-w-md text-base leading-8 opacity-75">
            {example.description} Creemos en los pequeños detalles, en conocer a
            las personas y en hacer las cosas con dedicación. Ese es el espíritu
            de {example.name}.
          </p>
        </section>
        <section
          id="servicios"
          className="mx-auto max-w-6xl scroll-mt-24 border-t border-current/10 px-6 py-16 sm:px-10"
        >
          <p className="text-xs tracking-[.2em] uppercase opacity-60">
            Lo que hacemos
          </p>
          <h2 className="mt-4 font-serif text-4xl">Siempre, a tu manera.</h2>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {example.services.map((service, index) => (
              <article
                key={service.title}
                className="rounded-2xl border border-current/10 bg-white/50 p-7"
              >
                <span className="font-serif text-3xl opacity-40">
                  0{index + 1}
                </span>
                <h3 className="mt-6 text-lg font-semibold">{service.title}</h3>
                <p className="mt-3 text-sm leading-7 opacity-70">
                  {service.text}
                </p>
              </article>
            ))}
          </div>
        </section>
        <section
          className="mx-5 mb-8 rounded-2xl px-6 py-14 text-center text-white sm:mx-8"
          style={{ background: example.color }}
        >
          <p className="text-xs tracking-widest uppercase opacity-70">
            Ahora, tu turno
          </p>
          <h2 className="mt-4 font-serif text-4xl">
            Tu negocio también tiene una historia.
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-sm leading-7 opacity-75">
            Esto es un ejemplo ficticio creado para inspirarte. Locavo crea tu
            propuesta con los datos reales de tu negocio.
          </p>
          <Link
            href={createHref}
            className="mt-7 inline-flex items-center gap-5 rounded-full bg-white px-6 py-3 text-sm font-semibold"
            style={{ color: example.color }}
          >
            Crear mi propia web
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </section>
      </main>
      <footer className="flex flex-wrap items-center justify-between gap-3 px-6 py-7 text-xs opacity-65 sm:px-10">
        <span>{example.name} · Ejemplo de diseño</span>
        <Link href="/" className="rounded hover:underline">
          Creado con Locavo ↗
        </Link>
      </footer>
    </div>
  )
}
