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
        {/* Main Content Area Layout */}
        <div className="flex flex-col gap-8 md:flex-row">
          {/* Left Sidebar */}
          <aside className="w-full shrink-0 md:sticky md:top-6 md:z-20 md:h-[calc(100vh-3rem)] md:w-56 md:overflow-y-auto lg:w-64">
            <BusinessSectionNav slug={slug} />
          </aside>

          {/* Right Content */}
          <main className="min-w-0 flex-1">{children}</main>
        </div>
      </div>
    </BusinessProvider>
  )
}
