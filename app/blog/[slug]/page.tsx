import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { LandingShell } from '@/components/landing/SeoLandingSections'
import { Breadcrumbs } from '@/components/seo/Breadcrumbs'
import { GuideCards } from '@/components/seo/GuideCards'
import { StructuredData } from '@/components/seo/StructuredData'
import { guides, getGuide, formatGuideDate } from '@/lib/blog'
import { buildPageMetadata, getBaseUrl } from '@/lib/seo'

type Props = { params: Promise<{ slug: string }> }
export function generateStaticParams() {
  return guides.map(({ slug }) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const guide = getGuide((await params).slug)
  if (!guide) notFound()
  const metadata = buildPageMetadata({
    locale: 'es',
    title: guide.title,
    description: guide.description,
    esPath: `/blog/${guide.slug}`,
  })
  return {
    ...metadata,
    openGraph: {
      ...metadata.openGraph,
      type: 'article',
      publishedTime: `${guide.publishedAt}T00:00:00Z`,
      modifiedTime: `${guide.updatedAt}T00:00:00Z`,
      authors: [`${getBaseUrl()}/sobre-locavo`],
      section: guide.category,
    },
  }
}

export default async function GuidePage({ params }: Props) {
  const guide = getGuide((await params).slug)
  if (!guide) notFound()
  const base = getBaseUrl()
  const path = `/blog/${guide.slug}`
  return (
    <LandingShell>
      <StructuredData
        data={{
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          '@id': `${base}${path}#article`,
          headline: guide.title,
          description: guide.description,
          inLanguage: 'es',
          mainEntityOfPage: `${base}${path}`,
          image: `${base}/social/locavo.png`,
          datePublished: `${guide.publishedAt}T00:00:00Z`,
          dateModified: `${guide.updatedAt}T00:00:00Z`,
          author: {
            '@type': 'Organization',
            '@id': `${base}/#organization`,
            name: 'Locavo',
            url: `${base}/sobre-locavo`,
          },
          publisher: { '@id': `${base}/#organization` },
          isPartOf: { '@id': `${base}/#website` },
        }}
      />
      <article className="landing-section">
        <div className="landing-container max-w-4xl!">
          <Breadcrumbs
            items={[
              { name: 'Inicio', path: '/' },
              { name: 'Guías', path: '/blog' },
              { name: guide.category, path },
            ]}
          />
          <p className="home-eyebrow">{guide.category}</p>
          <h1 className="text-[clamp(36px,5vw,64px)] leading-[1.05] font-medium tracking-[-0.04em] text-balance">
            {guide.title}
          </h1>
          <p className="mt-8 text-xl leading-relaxed text-(--home-muted)">
            {guide.answer}
          </p>
          <p className="mt-7 text-sm text-(--home-muted)">
            Publicado por{' '}
            <Link className="underline underline-offset-4" href="/sobre-locavo">
              Locavo
            </Link>{' '}
            ·{' '}
            <time dateTime={guide.publishedAt}>
              {formatGuideDate(guide.publishedAt)}
            </time>{' '}
            · Revisión editorial:{' '}
            <time dateTime={guide.updatedAt}>
              {formatGuideDate(guide.updatedAt)}
            </time>
          </p>
          <aside
            aria-label="Contexto y fuente"
            className="mt-10 rounded-3xl bg-(--home-soft) p-7 leading-relaxed"
          >
            <p>
              {guide.evidence.text}{' '}
              <a
                className="underline underline-offset-4"
                href={guide.evidence.url}
              >
                {guide.evidence.source}
              </a>
              .
            </p>
            <p className="mt-3 text-sm text-(--home-muted)">
              {guide.evidence.limitation}
            </p>
          </aside>
          <nav
            aria-label="En esta guía"
            className="my-12 border-y border-(--home-line) py-7"
          >
            <p className="font-medium">En esta guía</p>
            <ol className="mt-4 space-y-3">
              {guide.sections.map((section) => (
                <li key={section.id}>
                  <a
                    className="underline underline-offset-4"
                    href={`#${section.id}`}
                  >
                    {section.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
          {guide.sections.map((section) => (
            <section
              key={section.id}
              aria-labelledby={section.id}
              className="mt-12"
            >
              <h2
                id={section.id}
                className="scroll-mt-28 text-3xl leading-tight font-medium tracking-tight"
              >
                {section.title}
              </h2>
              {section.paragraphs.map((paragraph) => (
                <p
                  key={paragraph}
                  className="mt-5 text-lg leading-8 text-(--home-muted)"
                >
                  {paragraph}
                </p>
              ))}
              {section.bullets && (
                <ul className="mt-5 list-disc space-y-2 pl-6 text-lg leading-8 text-(--home-muted)">
                  {section.bullets.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}
              {guide.slug === 'seo-local-para-negocios' &&
                section.id === 'prioridades' && (
                  <p className="mt-5 leading-7">
                    Fuente:{' '}
                    <a
                      className="underline underline-offset-4"
                      href="https://support.google.com/business/answer/7091?hl=es"
                    >
                      Google, consejos para mejorar el posicionamiento local
                    </a>
                    .
                  </p>
                )}
              {guide.slug === 'web-o-redes-sociales-negocio' &&
                section.id === 'busqueda' && (
                  <p className="mt-5 leading-7">
                    Consulta las{' '}
                    <a
                      className="underline underline-offset-4"
                      href="https://support.google.com/business/answer/3038177?hl=es"
                    >
                      directrices oficiales de Google para representar tu
                      empresa
                    </a>{' '}
                    antes de crear o modificar un perfil.
                  </p>
                )}
            </section>
          ))}
          <div
            className="mt-14 overflow-x-auto rounded-2xl border border-(--home-line)"
            role="region"
            aria-label={guide.table.caption}
            tabIndex={0}
          >
            <table className="w-full min-w-[600px] text-left text-base leading-relaxed">
              <caption className="p-6 text-left text-xl font-medium">
                {guide.table.caption}
              </caption>
              <thead className="bg-(--home-soft)">
                <tr>
                  {guide.table.headers.map((header) => (
                    <th
                      key={header}
                      scope="col"
                      className="px-6 py-4 font-medium"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {guide.table.rows.map((row) => (
                  <tr key={row[0]} className="border-t border-(--home-line)">
                    <th scope="row" className="px-6 py-5 align-top font-medium">
                      {row[0]}
                    </th>
                    {row.slice(1).map((cell) => (
                      <td
                        key={cell}
                        className="px-6 py-5 align-top text-(--home-muted)"
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <aside className="mt-14 rounded-3xl bg-(--home-soft) p-8">
            <h2 className="text-2xl font-medium tracking-tight">
              Lleva la guía a tu negocio
            </h2>
            <p className="mt-4 leading-relaxed text-(--home-muted)">
              Empieza por la información que ya puedes comprobar y revisa cada
              paso antes de publicar.
            </p>
            <ul className="mt-6 space-y-4">
              {guide.links.map((link) => (
                <li key={link.href}>
                  <Link
                    className="font-medium underline underline-offset-4"
                    href={link.href}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </article>
      <GuideCards exclude={guide.slug} />
    </LandingShell>
  )
}
