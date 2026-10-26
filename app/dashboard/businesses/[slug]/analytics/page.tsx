import { notFound } from 'next/navigation'
import AnalyticsViewer from '../_components/AnalyticsViewer'
import {
  getBusinessBySlug,
  getAnalyticsSummary,
} from '@/lib/backoffice/queries'

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

  const summary = await getAnalyticsSummary(business.id)
  return <AnalyticsViewer summary={summary} />
}
