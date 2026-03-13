import { notFound } from 'next/navigation'
import AnalyticsViewer from '../_components/AnalyticsViewer'
import { getBusinessBySlug } from '@/lib/supabase/actions'

export default async function BusinessAnalyticsPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const business = await getBusinessBySlug(slug)

  if (!business) {
    notFound()
  }

  return <AnalyticsViewer businessId={business.id}  />
}
