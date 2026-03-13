import { notFound } from 'next/navigation'
import LeadsViewer from '../_components/LeadsViewer'
import { getBusinessBySlug, getLeads } from '@/lib/supabase/actions'

export default async function BusinessLeadsPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const business = await getBusinessBySlug(slug)

  if (!business) {
    notFound()
  }

  const leads = await getLeads(business.id)

  return <LeadsViewer leads={leads}  />
}
