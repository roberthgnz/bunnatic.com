import { getBusinessBySlug } from '@/lib/supabase/actions'
import { notFound } from 'next/navigation'
import BusinessSettingsForm from './_components/BusinessSettingsForm'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default async function BusinessSettingsPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  const business = await getBusinessBySlug(slug)

  if (!business) {
    notFound()
  }

  const t = {
    es: {
      title: 'Configuración',
    },
    ca: {
      title: 'Configuració',
    },
  }[locale === 'ca' ? 'ca' : 'es']

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <BusinessSettingsForm business={business} locale={locale} />
      </CardContent>
    </Card>
  )
}
