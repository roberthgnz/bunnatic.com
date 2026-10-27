import Link from 'next/link'
import { LandingShell } from '@/components/landing/SeoLandingSections'
import { Breadcrumbs } from '@/components/seo/Breadcrumbs'
import { GuideCards } from '@/components/seo/GuideCards'
import { businessLandingEntries } from '@/lib/businessLandingData'
import { buildPageMetadata } from '@/lib/seo'

export const metadata = buildPageMetadata({
  locale: 'es',
  title: 'Páginas web para negocios: elige tu sector',
  description:
    'Explora cómo organizar la web de un restaurante, clínica, peluquería, taller y otros negocios. Servicios, horarios y contacto según tu actividad.',
  esPath: '/negocio',
})

export default function SectorsPage() {
  return (
    <LandingShell>
      <section className="landing-section">
        <div className="landing-container">
          <Breadcrumbs
            items={[
              { name: 'Inicio', path: '/' },
              { name: 'Sectores', path: '/negocio' },
            ]}
          />
          <p className="home-eyebrow">Webs por sector</p>
          <h1 className="landing-title max-w-4xl">
            La información que necesita la web de tu negocio
          </h1>
          <p className="mt-7 max-w-3xl text-xl leading-relaxed text-(--home-muted)">
            Una web de negocio debe responder a las dudas de sus clientes antes
            de pedirles que contacten. Locavo organiza servicios, horarios e
            información comercial para distintas actividades locales. Elige tu
            sector para ver qué contenido conviene preparar y qué revisar. La
            propuesta debe ajustarse a los servicios y condiciones que realmente
            ofrece tu negocio.
          </p>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {businessLandingEntries.map((entry) => (
              <article
                key={entry.legacySlug}
                className="rounded-3xl bg-(--home-soft) p-8"
              >
                <h2 className="text-2xl font-medium tracking-tight">
                  <Link
                    className="underline-offset-4 hover:underline"
                    href={`/negocio/${entry.legacySlug}`}
                  >
                    {entry.copy.title}
                  </Link>
                </h2>
                <p className="mt-5 leading-relaxed text-(--home-muted)">
                  {entry.copy.subtitle}
                </p>
                <Link
                  className="mt-6 inline-flex min-h-11 items-center font-medium underline underline-offset-4"
                  href={`/negocio/${entry.legacySlug}`}
                >
                  Ver contenido para este sector
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>
      <GuideCards />
    </LandingShell>
  )
}
