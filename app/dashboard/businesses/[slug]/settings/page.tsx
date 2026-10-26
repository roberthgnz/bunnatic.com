import { getBusinessBySlug, getBusinessDomain } from '@/lib/supabase/actions'
import { notFound } from 'next/navigation'
import BusinessSettingsForm from './_components/BusinessSettingsForm'
import DomainSettingsCard from './_components/DomainSettingsCard'
import { getCloudflareCnameTarget } from '@/lib/domains/config'

export default async function BusinessSettingsPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const business = await getBusinessBySlug(slug)
  const domain = await getBusinessDomain(slug)

  if (!business) {
    notFound()
  }

  return (
    <div className="divide-border divide-y pb-10">
      <div className="pb-8">
        <BusinessSettingsForm business={business} />
      </div>

      <div className="pt-8">
        <DomainSettingsCard
          businessSlug={slug}
          initialDomain={domain}
          dnsTarget={getCloudflareCnameTarget()}
          rootDomain={
            process.env.PLATFORM_ROOT_DOMAIN?.trim().toLowerCase() || null
          }
        />
      </div>
    </div>
  )
}
