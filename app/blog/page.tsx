import Link from 'next/link'
import { LandingShell } from '@/components/landing/SeoLandingSections'
import { Breadcrumbs } from '@/components/seo/Breadcrumbs'
import { StructuredData } from '@/components/seo/StructuredData'
import { guides, formatGuideDate } from '@/lib/blog'
import { buildPageMetadata, getBaseUrl } from '@/lib/seo'

export const metadata = buildPageMetadata({
  locale: 'es',
  title: 'Guías para crear y mejorar la web de tu negocio',
  description:
    'Contenido práctico sobre páginas web, SEO local y presencia digital para pequeños negocios. Listas de revisión y fuentes oficiales.',
  esPath: '/blog',
})

export default function BlogPage() {
  const base = getBaseUrl()
  return (
    <LandingShell>
      <StructuredData
        data={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'Guías de Locavo',
          url: `${base}/blog`,
          mainEntity: {
            '@type': 'ItemList',
            itemListElement: guides.map((guide, index) => ({
              '@type': 'ListItem',
              position: index + 1,
              name: guide.title,
              url: `${base}/blog/${guide.slug}`,
            })),
          },
        }}
      />
      <section className="landing-section">
        <div className="landing-container">
          <Breadcrumbs
            items={[
              { name: 'Inicio', path: '/' },
              { name: 'Guías', path: '/blog' },
            ]}
          />
          <p className="home-eyebrow">Guías de Locavo</p>
          <h1 className="landing-title max-w-4xl">
            Una presencia digital que puedas entender y mantener
          </h1>
          <p className="mt-7 max-w-3xl text-xl leading-relaxed text-(--home-muted)">
            Estas guías de Locavo ayudan a pequeños negocios a preparar su web,
            revisar su información y decidir qué canales digitales atender.
            Encontrarás pasos concretos, tablas de revisión y enlaces a fuentes
            oficiales. Empieza por la planificación si aún no tienes web o por
            la guía de SEO local si quieres revisar una página existente.
          </p>
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {guides.map((guide) => (
              <article
                key={guide.slug}
                className="flex flex-col rounded-3xl border border-(--home-line) p-8"
              >
                <p className="text-sm text-(--home-muted)">{guide.category}</p>
                <h2 className="mt-4 text-2xl font-medium tracking-tight">
                  <Link
                    className="underline-offset-4 hover:underline"
                    href={`/blog/${guide.slug}`}
                  >
                    {guide.title}
                  </Link>
                </h2>
                <p className="mt-5 flex-1 leading-relaxed text-(--home-muted)">
                  {guide.description}
                </p>
                <p className="mt-6 text-sm text-(--home-muted)">
                  Locavo ·{' '}
                  <time dateTime={guide.publishedAt}>
                    {formatGuideDate(guide.publishedAt)}
                  </time>
                </p>
                <Link
                  href={`/blog/${guide.slug}`}
                  className="mt-6 inline-flex min-h-11 items-center font-medium underline underline-offset-4"
                >
                  Leer guía
                </Link>
              </article>
            ))}
          </div>
          <p className="mt-10 text-sm text-(--home-muted)">
            Consulta cómo preparamos el contenido en{' '}
            <Link href="/sobre-locavo" className="underline underline-offset-4">
              Sobre Locavo y criterio editorial
            </Link>
            .
          </p>
        </div>
      </section>
    </LandingShell>
  )
}
