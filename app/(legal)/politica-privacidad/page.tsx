import type { Metadata } from 'next'
import LegalPage from '@/components/legal/LegalPage'
import { legalContent, type LegalLocale } from '@/lib/legalContent'
import { getLegalSlug } from '@/lib/pageSlugs'
import { buildPageMetadata } from '@/lib/seo'
import { notFound } from 'next/navigation'

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
    title: `${legalContent[safeLocale]['politica-privacidad'].title} | Bunnatic`,
    description:
      safeLocale === 'ca'
        ? "Coneix com Bunnatic tracta les teves dades personals, els teus drets de privacitat i com exercir-los segons el RGPD."
        : 'Conoce cómo Bunnatic trata tus datos personales, tus derechos de privacidad y cómo ejercerlos según el RGPD.',
    esPath: `/${getLegalSlug('politica-privacidad', 'es')}`,
    caPath: `/${getLegalSlug('politica-privacidad', 'ca')}`,
    noindex: true,
  })
}

export default async function PoliticaPrivacidadPage({
  params,
}: LegalRouteProps) {
  const { locale } = await params

  if (!isLegalLocale(locale)) {
    notFound()
  }

  return <LegalPage locale={locale} pageKey="politica-privacidad" />
}
