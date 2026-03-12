import { getBusinessBySlug, getBusinessDomain } from '@/lib/supabase/actions'
import { notFound } from 'next/navigation'
import BusinessSettingsForm from './_components/BusinessSettingsForm'
import DomainSettingsCard from './_components/DomainSettingsCard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getCloudflareCnameTarget } from '@/lib/domains/config'

export default async function BusinessSettingsPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  const business = await getBusinessBySlug(slug)
  const domain = await getBusinessDomain(slug)

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
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <BusinessSettingsForm business={business} locale={locale} />
        </CardContent>
      </Card>

      <DomainSettingsCard
        businessSlug={slug}
        locale={locale}
        initialDomain={domain}
        dnsTarget={getCloudflareCnameTarget()}
      />
    </div>
  )
}
