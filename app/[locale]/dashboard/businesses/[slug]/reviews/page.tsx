import { notFound } from 'next/navigation'
import ContentReviewManager from '../_components/ContentReviewManager'
import { getBusinessBySlug, getSections } from '@/lib/supabase/actions'

export default async function BusinessReviewsPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  const business = await getBusinessBySlug(slug)

  if (!business) {
    notFound()
  }

  const sections = await getSections(business.id)

  return <ContentReviewManager sections={sections} locale={locale} />
}
