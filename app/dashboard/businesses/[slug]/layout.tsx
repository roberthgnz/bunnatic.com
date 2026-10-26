import { notFound } from 'next/navigation'
import {
  getBusinessBySlug,
  getBusinessDomainByBusinessId,
  getSections,
  getWorkingHours,
  getServices,
} from '@/lib/supabase/actions'
import BusinessSectionNav from './_components/BusinessSectionNav'
import { BusinessProvider } from './_components/BusinessContext'
import BusinessHeader from './_components/BusinessHeader'

export default async function BusinessDetailLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const business = await getBusinessBySlug(slug)

  if (!business) {
    notFound()
  }

  const [services, workingHours, sections] = await Promise.all([
    getServices(business.id),
    getWorkingHours(business.id),
    getSections(business.id),
  ])
  const businessDomain = await getBusinessDomainByBusinessId(business.id)

  return (
    <BusinessProvider
      business={business}
      services={services}
      workingHours={workingHours}
      sections={sections}
      businessDomain={businessDomain}
    >
      <div className="space-y-6">
        <BusinessHeader />
        <BusinessSectionNav slug={slug} />
        <div className="min-w-0 pt-2">{children}</div>
      </div>
    </BusinessProvider>
  )
}
