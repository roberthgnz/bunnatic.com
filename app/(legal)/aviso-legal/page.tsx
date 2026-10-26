import type { Metadata } from 'next'
import LegalPage from '@/components/legal/LegalPage'
import { legalContent, type LegalLocale } from '@/lib/legalContent'
import { getLegalSlug } from '@/lib/pageSlugs'
import { buildPageMetadata } from '@/lib/seo'

type LegalRouteProps = {
  params: Promise<{ locale: string }>
}

function isLegalLocale(locale: string): locale is LegalLocale {
  return locale === 'es' || locale === 'ca'
}

export async function generateMetadata({
  params,
}: LegalRouteProps): Promise<Metadata> {
  const { locale } = await params
  const safeLocale: LegalLocale = locale === 'ca' ? 'ca' : 'es'

  return buildPageMetadata({
    locale: safeLocale,
    title: `${legalContent[safeLocale]['aviso-legal'].title} | Locavo`,
    description:
      safeLocale === 'ca'
        ? "Consulta l'avís legal de Locavo amb informació sobre la titularitat, condicions d'ús i responsabilitats del lloc web."
        : 'Consulta el aviso legal de Locavo con información sobre la titularidad, condiciones de uso y responsabilidades del sitio web.',
    esPath: `/${getLegalSlug('aviso-legal', 'es')}`,
    caPath: `/${getLegalSlug('aviso-legal', 'ca')}`,
    noindex: true,
  })
}

export default async function AvisoLegalPage({ params }: LegalRouteProps) {
  const { locale: rawLocale } = await params
  // Routes have no locale segment; Spanish is the default.
  const locale: LegalLocale = isLegalLocale(rawLocale) ? rawLocale : 'es'

  return <LegalPage locale={locale} pageKey="aviso-legal" />
}
