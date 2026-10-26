import { notFound } from 'next/navigation'
import { getBusinessWorkspace } from '@/lib/backoffice/queries'
import BusinessSectionNav from './_components/BusinessSectionNav'
import BusinessHeader from './_components/BusinessHeader'

export default async function BusinessDetailLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const workspace = await getBusinessWorkspace(slug)

  if (!workspace) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <BusinessHeader
        business={workspace.business}
        businessDomain={workspace.businessDomain}
        isPublished={workspace.sections.some(
          (section) => section.status === 'published'
        )}
        setupCompletion={workspace.setupCompletion}
        role={workspace.role}
      />
      <BusinessSectionNav slug={slug} role={workspace.role} />
      <div className="min-w-0 pt-2">{children}</div>
    </div>
  )
}
